/*
 * 3D profile viewer for the sidebar avatar.
 *
 * Renders the Gaussian-splat bust in assets/profile-3d/ with GaussianSplats3D (three.js).
 * Both libraries resolve through the import map in _includes/head/custom.html; this file is
 * loaded as an ES module from _includes/scripts.html.
 *
 * Expected markup (see _includes/author-profile.html):
 *
 *   <div class="profile3d" data-splat="/assets/profile-3d/profile3d.ksplat"
 *                          data-splat-fallback="/assets/profile-3d/profile3d.splat"
 *                          data-cam="0,0.05,2.9" data-look="0,-0.1,0">
 *     <div class="profile3d__stage"><img class="profile3d__fallback" src="/images/profile.jpg"></div>
 *     <div class="profile3d__hint">drag to rotate</div>
 *   </div>
 *
 * data-cam is the initial camera position and data-look the orbit centre, both "x,y,z" in scene
 * units. The scene is y-up, the face looks towards +z and the head is centred near the origin
 * (bounding box x[-0.91, 0.91] y[-1.0, 0.76] z[-0.72, 0.63]). Both attributes are optional; the
 * defaults below frame the bust including the shoulders.
 *
 * The photo is visible from the first paint. The splat canvas is mounted underneath it and the
 * photo cross-fades out once the first frame has been drawn (class "is-ready"). Without WebGL, or
 * if the download fails, the photo simply stays. The viewer runs at every viewport width, phones
 * included (the libraries, ~600 KB, and the 4.5 MB splat file are downloaded there too).
 *
 * Until the first interaction the head sways slowly left and right (SWAY below) instead of
 * orbiting all the way round; the user can take over with the mouse at any time.
 */

// Used when the container has no data-look / data-cam attribute.
const DEFAULT_LOOK_AT = [0, -0.12, 0];          // orbit centre (height of the head centre)
const DEFAULT_CAMERA_POSITION = [0, 0.0, 3.0];  // initial camera; a larger z makes the bust smaller

// Idle motion before the first interaction: the camera swings around its starting direction
// following a sine, so the head turns to each side and back without ever showing the back.
const SWAY = {
  amplitude: 25 * Math.PI / 180,  // peak angle to each side of the initial view
  period: 12000,                  // ms for one full left-right-left cycle
};

const SPLAT_OPTIONS = {
  progressiveLoad: false,         // build the whole bust before revealing it (the photo covers the wait)
  showLoadingUI: false,
  splatAlphaRemovalThreshold: 5,  // 0-255; raising it thins out the semi-transparent hair
};

function keepPhoto(el, reason) {
  el.classList.remove('is-ready');
  if (reason) console.warn('[profile3d]', reason);
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (_) {
    return false;
  }
}

// "x,y,z" -> [x, y, z]; anything malformed falls back to the default.
function parseVec3(value, fallback) {
  if (!value) return fallback;
  const v = value.split(',').map(Number);
  return v.length === 3 && v.every(Number.isFinite) ? v : fallback;
}

function cameraSetup(el) {
  return {
    lookAt: parseVec3(el.dataset.look, DEFAULT_LOOK_AT),
    position: parseVec3(el.dataset.cam, DEFAULT_CAMERA_POSITION),
  };
}

// The splat files are downloaded here rather than by the viewer: the viewer's own loader does not
// reliably reject on a failed download, which would leave the fallback chain stuck. The data is
// handed over as a blob URL with an explicit format.
function splatSources(el) {
  return [
    { url: el.dataset.splat, format: 'KSplat' },
    { url: el.dataset.splatFallback, format: 'Splat' },
  ].filter((s) => s.url);
}

async function downloadFirstAvailable(sources) {
  let lastError = new Error('no splat source configured');
  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return { blob: await response.blob(), format: source.format, url: source.url };
    } catch (e) {
      lastError = e;
      console.warn('[profile3d] could not download', source.url, e);
    }
  }
  throw lastError;
}

// Resolves once the viewer has sorted and drawn its first frame (or after a timeout).
function whenFirstFrameDrawn(viewer, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const started = performance.now();
    const tick = () => {
      if (viewer.splatRenderReady || performance.now() - started > timeoutMs) {
        requestAnimationFrame(() => resolve());
      } else {
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
}

function configureControls(viewer, el, lookAt) {
  // The viewer installs page-wide hot-keys (I, O, P, arrows, ...) and click-to-refocus handlers.
  // A profile widget must not react to keys pressed anywhere on the page, so drop them.
  viewer.removeEventHandlers();
  for (const c of [viewer.perspectiveControls, viewer.orthographicControls]) {
    if (c && c.stopListenToKeyEvents) c.stopListenToKeyEvents();
  }
  // The unused orthographic-camera controls also listen on the canvas and would swallow wheel
  // events (blocking page scroll) and pointer events, so switch them off entirely.
  if (viewer.orthographicControls) viewer.orthographicControls.enabled = false;

  const controls = viewer.controls;  // three.js OrbitControls for the perspective camera
  if (!controls) return;

  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;              // keep the mouse wheel for scrolling the page
  controls.autoRotate = false;              // idle motion is the sway below, not a full orbit
  controls.minPolarAngle = Math.PI * 0.15;  // do not look down from above
  controls.maxPolarAngle = Math.PI * 0.60;  // keep the open underside of the bust hidden
  controls.minDistance = 1.6;
  controls.maxDistance = 4.5;
  controls.target.set(lookAt[0], lookAt[1], lookAt[2]);
  controls.update();
  // OrbitControls puts an inline "touch-action: none" on the canvas, which would also swallow
  // vertical swipes on phones (the avatar sits at the top of the page there). Allow the browser to
  // keep vertical panning for page scroll; horizontal touch drags still rotate the head.
  if (controls.domElement && controls.domElement.style) controls.domElement.style.touchAction = 'pan-y';
  controls.addEventListener('start', () => {
    el.classList.add('is-touched');       // hides the hint and ends the idle sway
  });
}

// Swings the camera left and right around the direction it is looking from when called, keeping
// its distance and height. Runs until the container is marked "is-touched" (first drag) or until
// the returned function is called. Pure camera-position updates, so OrbitControls stays in charge.
function startSway(viewer, el) {
  const controls = viewer.controls;
  const camera = viewer.camera;
  if (!controls || !camera) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const target = controls.target;
  const baseAzimuth = Math.atan2(camera.position.x - target.x, camera.position.z - target.z);
  const started = performance.now();
  let active = true;

  const tick = (now) => {
    if (!active || el.classList.contains('is-touched')) return;
    const dx = camera.position.x - target.x;
    const dy = camera.position.y - target.y;
    const dz = camera.position.z - target.z;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const polar = Math.acos(Math.max(-1, Math.min(1, dy / radius)));
    const azimuth = baseAzimuth + SWAY.amplitude * Math.sin(((now - started) / SWAY.period) * 2 * Math.PI);
    camera.position.set(
      target.x + radius * Math.sin(polar) * Math.sin(azimuth),
      target.y + radius * Math.cos(polar),
      target.z + radius * Math.sin(polar) * Math.cos(azimuth),
    );
    controls.update();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return () => { active = false; };
}

export async function mountProfile3D(el, GaussianSplats3D) {
  let source;
  try {
    source = await downloadFirstAvailable(splatSources(el));
  } catch (e) {
    return keepPhoto(el, 'splat download failed: ' + e);
  }

  const camera = cameraSetup(el);
  const stage = el.querySelector('.profile3d__stage') || el;
  let viewer;
  try {
    viewer = new GaussianSplats3D.Viewer({
      rootElement: stage,               // the canvas is created inside this element and follows its size
      cameraUp: [0, 1, 0],
      initialCameraPosition: camera.position,
      initialCameraLookAt: camera.lookAt,
      sharedMemoryForWorkers: false,    // works without COOP/COEP headers (plain static hosting)
      gpuAcceleratedSort: false,
      useBuiltInControls: true,
      selfDrivenMode: true,
      dynamicScene: false,
      antialiased: true,
      sphericalHarmonicsDegree: 0,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,  // the CSS cross-fade does the reveal
      logLevel: GaussianSplats3D.LogLevel.None,
    });
    configureControls(viewer, el, camera.lookAt);
  } catch (e) {
    return keepPhoto(el, 'viewer init failed: ' + e);
  }

  const blobUrl = URL.createObjectURL(source.blob);
  try {
    await viewer.addSplatScene(blobUrl, {
      ...SPLAT_OPTIONS,
      format: GaussianSplats3D.SceneFormat[source.format],
    });
  } catch (e) {
    Promise.resolve(viewer.dispose()).catch(() => {});
    return keepPhoto(el, 'splat load failed: ' + e);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }

  viewer.start();
  await whenFirstFrameDrawn(viewer);
  el.classList.add('is-ready');
  el._profile3d = viewer;
  el._profile3dStopSway = startSway(viewer, el);
}

let libraryPromise = null;
function loadLibrary() {
  if (!libraryPromise) libraryPromise = import('@mkkellogg/gaussian-splats-3d');
  return libraryPromise;
}

// On phones the sidebar is hidden with CSS on every page but the home page (_sass/_sidebar.scss).
// Mounting into a display:none container would download the libraries and the splat file for
// nothing, so wait until the element is actually laid out (e.g. after a rotation or a resize to
// a wider viewport).
function whenVisible(el, callback) {
  const isVisible = () => el.getClientRects().length > 0;
  if (isVisible()) {
    callback();
    return;
  }
  const check = () => {
    if (!isVisible()) return;
    window.removeEventListener('resize', check);
    window.removeEventListener('orientationchange', check);
    callback();
  };
  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', check);
}

function boot() {
  const targets = Array.from(document.querySelectorAll('.profile3d[data-splat]'));
  if (targets.length === 0) return;
  if (!hasWebGL()) {
    targets.forEach((el) => keepPhoto(el, 'WebGL unavailable'));
    return;
  }
  targets.forEach((el) => whenVisible(el, () => {
    loadLibrary()
      .then((GaussianSplats3D) => mountProfile3D(el, GaussianSplats3D))
      .catch((e) => keepPhoto(el, 'library load failed: ' + e));
  }));
}

boot();
