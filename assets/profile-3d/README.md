# 3D profile (Gaussian splats)

The sidebar avatar (`_includes/author-profile.html`) shows a 3D Gaussian-splat bust that can be
rotated with the mouse. The viewer is `assets/js/profile3d-splat.js` (GaussianSplats3D 0.4.7 on
three.js 0.170, both resolved by the import map in `_includes/head/custom.html`); its styles are in
`_sass/_profile3d.scss`. `images/profile.jpg` remains the placeholder while the splats download and
the fallback on narrow screens or without WebGL.

| File | Purpose |
|---|---|
| `profile3d.ksplat` | Default asset (4.5 MB), GaussianSplats3D compressed format (level 1). |
| `profile3d.splat` | Fallback asset (6.0 MB), generic `.splat` format, used only if the `.ksplat` fails to load. |
| `profile_512.png` | 512-px copy of `images/profile.png` that was the input to the generation pipeline. |

The bust was generated from the single ID photo with FaceLift (ICCV 2025, multi-view diffusion +
GS-LRM) and is used as FaceLift produced it, without cutting (188,001 splats; only FaceLift's own
filter |x| <= 0.91, y >= -1.0 applies). The torso therefore ends in a blurry boundary at the bottom
and the underside is open, which is why the viewer limits the polar angle and the stylesheet fades
the lower part of the canvas out. Coordinates are y-up with the face towards +z and the head centred
near the origin; bounding box x [-0.91, 0.91], y [-1.00, 0.76], z [-0.72, 0.63]. The initial camera
and orbit centre come from the container's `data-cam` ("0,0.05,2.9") and `data-look` ("0,-0.1,0")
attributes in `_includes/author-profile.html`.

The pipeline lives on the GPU server (`/mnt/kelp/jhlee/etc/homepage/3d/`); the handoff bundle's
`GAUSSIAN_VIEWER_GUIDE.md` explains how to regenerate the two assets. FaceLift weights are released
under the Adobe Research License (non-commercial research use), and these assets are its output.

An earlier attempt with TRELLIS.2 (`scripts/generate_profile_trellis2.py`) was not completed and is
not used.
