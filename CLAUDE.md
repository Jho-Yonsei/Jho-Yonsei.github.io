# 프로젝트 컨텍스트 — Jho-Yonsei.github.io (3D Gaussian 프로필 아바타)

작성일: 2026-10-02, 최종 갱신: 2026-10-05. 이전 Claude Code 대화에서 한 작업과 결정을 다음 대화에서 그대로 이어가기 위한 정리입니다.
Claude Code는 이 파일을 세션 시작 시 자동으로 읽습니다. 이 파일은 `_config.yml`의 `exclude`에 들어 있어 사이트에 배포되지 않습니다.

## 1. 사이트 개요와 작업 방식

- Jekyll 사이트(academicpages / Minimal Mistakes 기반). GitHub Pages가 `main` 브랜치 소스에서 직접 빌드한다.
- `_site/`가 git에 커밋되어 있다. 소스를 바꾸면 반드시 `bundle exec jekyll build`로 `_site/`를 다시 생성할 것.
  사용자는 `_site/`를 보고 작업이 됐는지 판단한다. 임시 폴더에만 빌드해 두면 "안 되어 있다"고 본다.
- 사용자의 로컬 확인 방법:
  ```
  bundle exec jekyll build
  ruby -run -e httpd _site -p 4000      # http://localhost:4000
  ```
- 커밋/푸시는 사용자가 지시할 때만 한다. 2026-10-02와 2026-10-05 작업분은 2026-10-05에 사용자 지시로 한 커밋(`309eeca`)에 묶어 커밋하고 2026-10-06에 푸시했다.
  커밋에서 뺀 것: `_talks/Thesis.pdf`(Experience가 링크하는 `files/Thesis.pdf`의 15 MB 중복본, 미추적 상태로 둠),
  `_site/CoCoGaussian|CoMoGaussian|SMURF|SwiftVGGT/`(프로젝트 페이지의 빌드 사본 약 1.1 GB, 한 번도 커밋된 적 없음 → `.gitignore`에 추가.
  GitHub Pages는 소스 폴더에서 직접 서빙하므로 `_config.yml` exclude에 넣으면 안 됨), `.sass-cache/`, `.DS_Store`(루트 것은 추적 해제).
- git 작성자 정보가 이 Mac에 없어서 이전 커밋과 같은 `Jho-Yonsei <2015142131@yonsei.ac.kr>`를 저장소 전용(`git config`, `--global` 아님)으로 설정했다.
- `.git/hooks/`에 Git LFS 훅(post-checkout, post-commit, post-merge, pre-push)이 깔려 있지만 git-lfs는 설치돼 있지 않고 `.gitattributes`는 비어 있어
  LFS로 추적되는 파일은 없다(PDF 등은 전부 일반 blob). 커밋 때 post-commit 훅이 경고만 냈고, git-lfs가 없으면 `.git/hooks/pre-push`가 exit 2로 `git push`를 중단시킨다.
  사용자 동의로 네 훅 파일을 삭제했다(LFS 안 쓰므로 안전; `git lfs install`을 다시 실행하지 않는 한 돌아오지 않음).
- GitHub 인증: 이 Mac에는 키체인 자격 증명도, GitHub에 등록된 SSH 키도 없었다. 사용자 선택으로 `brew install gh` 후 사용자가 직접
  `gh auth login`(HTTPS, 브라우저 로그인, 계정 Jho-Yonsei)을 했고, git 자격 증명은 gh의 keyring 토큰을 쓴다. 이후 `git push origin main`은 그냥 된다.
  `gh api repos/Jho-Yonsei/Jho-Yonsei.github.io/pages/builds/latest`로 Pages 빌드 상태를 볼 수 있다.

## 2. 현재 구현 (2026-10-02 도입, 2026-10-05 자산 교체·스웨이·링크 수정)

### 2-1. 사이드바 프로필 사진 자리의 3D Gaussian Splat 뷰어

- 자산: `assets/profile-3d/profile3d.ksplat`(기본, 4.5 MB), `profile3d.splat`(폴백, 6.0 MB). 둘 다 188,001 splats.
  FaceLift(ICCV 2025)로 증명사진 한 장에서 생성한 두상+상반신을 **자르지 않고 그대로** 쓴다(FaceLift 기본 필터 |x|≤0.91, y≥-1.0만 적용).
  y-up, 얼굴은 +z, 머리 중심이 원점 부근, bbox x[-0.91, 0.91] y[-1.00, 0.76] z[-0.72, 0.63]. SH degree 0, 알파 평균 0.14.
  몸통 아래쪽은 FaceLift 경계에서 흐릿하게 번지며 끝나고 바닥은 뚫려 있다. 라이선스: Adobe Research License(비상업 연구용).
  2026-10-05에 `profile3d_handoff/assets/`의 파일로 교체했다(이전 자산은 `--cut_z -0.80`으로 하단을 잘라낸 159,819 splats 버전,
  `handoff/assets/`에 그대로 남아 있음. 두 handoff 폴더 모두 gitignore·exclude 대상이라 git과 `_site/`에는 들어가지 않는다).
- 뷰어 모듈: `assets/js/profile3d-splat.js` (ES module). GaussianSplats3D 0.4.7 + three.js 0.170을 jsDelivr CDN의
  import map으로 로드한다. import map은 `_includes/head/custom.html`, 모듈 스크립트 태그는 `_includes/scripts.html`.
  handoff의 `js/profile3d-splat.js`를 그대로 쓰지 않고, 이 사이트에 맞춘 기존 모듈을 유지하면서 `data-cam`/`data-look` 읽기만 가져왔다
  (이유는 아래 "뷰어 동작과 결정 사항"). 다른 페이지에서 three.js를 쓰지 않으므로 중복 로드 문제는 없다
  (`CoCoGaussian/` 등 프로젝트 페이지는 Jekyll 레이아웃을 쓰지 않는 독립 HTML이라 import map과 무관).
- 마크업: `_includes/author-profile.html`의 `.author__avatar` 안에
  `.profile3d[data-splat][data-splat-fallback][data-cam="0,0.05,2.9"][data-look="0,-0.1,0"]` 컨테이너.
  `data-cam`은 초기 카메라 위치, `data-look`은 회전 중심(둘 다 "x,y,z", handoff 가이드의 예제 값 그대로. 사용자가 이 값을 쓰라고 지정함).
  속성이 없으면 모듈의 기본값 `[0, 0, 3.0]` / `[0, -0.12, 0]`. 그 안에 `.profile3d__stage`(캔버스가 생성되는 루트),
  `img.profile3d__fallback`(사진: 로딩 중 placeholder이자 폴백), `.profile3d__hint`("drag to rotate").
  상태 클래스: `is-ready`(첫 프레임 그려짐, 사진 페이드아웃), `is-touched`(첫 조작 후 힌트 숨김).
- 스타일: `_sass/_profile3d.scss` (`assets/css/main.scss`에서 import). 원형, 최대 220px, 데스크톱에서 5px 패딩 + 1px 테두리.
  캔버스에 아래쪽 78%→98% 투명 페이드 마스크. 이전에는 절단면을 숨기려고 74%→97%였고, 자르지 않은 모델에서는 어깨가 원 가장자리에
  닿는 것을 막고 FaceLift 경계의 번짐을 배경에 녹이는 용도라 시작점을 조금 내렸다. 힌트 캡슐은 어깨 위에 겹치지만 반투명 흰 배경이라 읽힌다.
- 뷰어 동작과 결정 사항(모두 의도된 것):
  - 뷰어는 모든 화면 폭에서 로드된다(2026-10-05 변경, 사용자 요청). 그 전에는 925px 미만에서 로드하지 않고 36px 사진 썸네일만 보여줬다.
    모바일에서도 라이브러리(~600 KB)와 ksplat(4.5 MB)을 내려받는다는 점은 사용자에게 알렸다.
  - 터치: OrbitControls가 캔버스에 인라인 `touch-action: none`을 넣어 세로 스와이프까지 삼키므로 `configureControls`에서
    `controls.domElement.style.touchAction = 'pan-y'`로 덮어쓴다. 결과적으로 폰에서 가로 드래그는 회전, 세로 스와이프는 페이지 스크롤
    (세로 터치로는 polar 회전이 안 되는데 의도된 트레이드오프). `.profile3d__stage`의 `touch-action: pan-y`만으로는 부족했다
    (유효 touch-action은 터치된 요소와 조상들의 교집합이라 캔버스의 `none`이 이긴다).
  - 마우스 휠 줌 비활성(`enableZoom=false`). 사이드바가 sticky라 휠로 페이지 스크롤이 막히는 것을 피하기 위함. (handoff 모듈은 줌 허용)
  - 대기 동작은 360° 자동 회전이 아니라 좌우 스웨이(2026-10-05 변경, 사용자 요청: "좌우로 20~30도만 천천히 왔다갔다").
    모듈의 `SWAY` 상수(진폭 25°, 한 사이클 12초 사인)로 `startSway()`가 매 프레임 카메라 위치만 바꾸고 `controls.update()`를 부른다.
    `is-ready` 직후 시작하고 컨테이너에 `is-touched`가 붙으면(첫 드래그) 멈춘다. OrbitControls의 `autoRotate`는 false로 고정.
    `prefers-reduced-motion`이면 스웨이 없음. 마우스 조작은 그대로 가능(스웨이가 카메라 위치만 쓰므로 드래그가 바로 이어받는다).
  - 라이브러리가 window에 거는 단축키(I, O, P, 화살표 등)와 클릭 시 초점 이동은 `viewer.removeEventHandlers()`로 제거.
    사용하지 않는 `orthographicControls`는 `enabled=false`(그대로 두면 휠 이벤트를 preventDefault해 스크롤이 막힘).
  - 다운로드는 라이브러리에 맡기지 않고 직접 `fetch` → blob URL + 명시적 `format`으로 넘긴다.
    라이브러리 loader는 다운로드 실패 시 promise를 reject하지 않아 폴백 체인이 멈추기 때문(handoff 모듈의 try/catch 폴백은 이 경우 동작하지 않음).
    순서: ksplat → splat → 둘 다 실패면 사진 유지.
  - `progressiveLoad: false`, `SceneRevealMode.Instant` + CSS 크로스페이드로 사진에서 3D로 전환.
  - `viewer.dispose()`는 rootElement가 body 자식이 아니면 내부에서 예외가 나므로 `.catch`로 감싼다.
- 튜닝 포인트: 카메라/회전 중심은 마크업의 `data-cam`/`data-look`. 모듈 상단·`configureControls`에
  polar 각도 0.15π~0.60π(바닥이 뚫려 있어 아래에서 올려다보지 못하게; 가이드는 바닥이 보이면 0.55π 권장), `SWAY.amplitude`/`SWAY.period`,
  `minDistance 1.6`/`maxDistance 4.5`(줌이 꺼져 있어 실질적 영향 없음), `splatAlphaRemovalThreshold 5`(올리면 머리카락이 비어 보임).

### 2-2. 배경색을 흰색으로

- `_sass/_variables.scss`: `$body-color`, `$background-color`를 `#fbf8f3` → `#fff`. 상단 내비(`.greedy-nav`)도 같은 변수를 쓴다.
- `$code-background-color`(#f6f1e9)는 요청 범위 밖이라 그대로 둠. 흰 배경에 맞추려면 `#fafafa` 정도.

### 2-3. 사이트 자체 CSS/JS 링크를 상대 경로로

- `_includes/head.html`(main.css), `_includes/head/custom.html`(academicons.css), `_includes/scripts.html`(main.min.js)을
  `{{ base_path }}/assets/...` 대신 `{{ '/assets/...' | relative_url }}`로 바꿨다.
- 이유: `_config.yml`의 `url`이 배포 도메인이라 로컬에서 `_site/`를 띄워도 CSS/JS를 배포 사이트에서 가져와
  바뀐 스타일이 로컬에서 보이지 않았다. 배포 사이트에서는 동일 출처라 결과가 같다.

### 2-4. 홈 링크와 사이드바 CV (2026-10-05)

- `_pages/about.md`의 "contact me"와 "CV" 링크가 `{{ base_path }}/contacts.html`, `{{base_path}}/files/CV.pdf`(배포 도메인 절대 URL)라
  로컬 `_site/`에서 클릭하면 배포 사이트로 나갔다. `{{ '/contacts/' | relative_url }}`, `{{ '/files/CV.pdf' | relative_url }}`로 바꿨다.
  `/contacts.html`은 `_pages/contacts.md`의 `redirect_from`이 만드는 리다이렉트 페이지이고 실제 permalink는 `/contacts/`.
- 사이드바 링크 목록(Email, LinkedIn, Github, Google Scholar) 아래에 CV 항목 추가: `_config.yml` `author.cv: "/files/CV.pdf"`,
  `_includes/author-profile.html`의 googlescholar 블록 다음에 `{% if author.cv %}` 블록(아이콘 `fas fa-file-alt`(줄이 그어진 문서. `fa-file-pdf`는 PDF 표시라서, `fa-id-card`는 신분증 같아서 사용자가 거절함), `relative_url` 적용).
  `files/CV.pdf`(65 KB)가 실제 CV. `_pages/cv.md`(`/cv/`)는 테마의 예시 내용이 그대로 남아 있는 placeholder라 링크하지 않았다.

### 2-5. 모바일 사이드바 레이아웃 (2026-10-05)

- 사용자 요청(최종): 모바일에서 첫 줄에 이름·소속과 오른쪽 끝 Follow 버튼, 그 아래에 3D Gaussian. 그리고 모바일에서는 Home에만 이 프로필을
  보여주고 Publications/Experience/Contacts에서는 없앨 것. (처음엔 Gaussian을 위에 두라고 했다가 같은 날 순서를 바꿨다.)
- `_includes/author-profile.html`의 바깥 `div`에 `class="author__profile"` 추가. `_sass/_sidebar.scss`에서 `$large` 미만일 때
  `.author__profile`을 `display: flex; flex-wrap: wrap; align-items: center`로, `.author__content`는 `flex: 1 1 0`, `.author__urls-wrapper`는
  `margin-left: auto`(오른쪽 끝), `.author__avatar`는 `order: 1; flex: 0 0 100%; margin-top: 1em`(둘째 줄 전체, 가운데 정렬).
  `$large` 이상은 테마의 기존 블록 레이아웃 그대로(`display: block`, `order: 0`, `flex: none`, `margin-left: 0`).
  테마 원래 모바일 레이아웃(table-cell 가로 한 줄, 36px 썸네일)은 버렸다.
- Home 전용: `_includes/sidebar.html`이 `page.url == "/"`일 때 `.sidebar`에 `sidebar--home`을 붙이고, `_sass/_sidebar.scss`의
  `.sidebar:not(.sidebar--home)`이 `$large` 미만에서 `display: none`(이상에서 `display: block`). 사이드바에는 author profile만 있으므로
  통째로 숨겨 본문이 위에서 시작한다.
- 뷰어 모듈의 `boot()`은 `whenVisible()`로 컨테이너가 실제 레이아웃된(`getClientRects().length > 0`) 뒤에만 라이브러리 import와 마운트를 한다
  (숨겨진 페이지에서 4.5 MB를 헛되이 받지 않도록). 숨겨진 상태로 시작했다가 `resize`/`orientationchange`로 보이게 되면 그때 마운트한다.
  라이브러리 import는 `loadLibrary()`로 한 번만.
- `.author__bio`에 모바일 `margin-top: 8px`. `_sass/_profile3d.scss`의 5px 패딩 + 1px 테두리는 이제 모든 폭에 적용.
- Follow 버튼의 드롭다운(`.author__urls`, `position: absolute; right: 0`)은 wrapper가 오른쪽 끝에 있으므로 오른쪽 정렬로 열린다.
  이 테마의 `assets/js/_main.js`는 `is--visible` 클래스가 아니라 jQuery `fadeToggle`로 토글한다(검증 스크립트에서 클래스로 확인하면 안 됨).
- 검증(headless Chrome, `Emulation.setDeviceMetricsOverride` 390×844 DPR 3 + 터치 에뮬레이션, 768×1024): Home에서 뷰어 `is-ready`와 188,001 splats,
  이름 줄(top 107px)이 뷰어(top 168px) 위, Follow 오른쪽 끝, 캔버스 computed `touch-action: pan-y`, 가로 터치 드래그로 방위각 변화 + `is-touched`,
  `Input.synthesizeScrollGesture`(touch)와 touchStart/Move/End 세로 스와이프로 `scrollY` 증가, Follow 탭 후 메뉴 `display: block`이고 오른쪽 끝이
  wrapper 오른쪽 끝과 일치. Publications/Experience/Contacts에서는 `.sidebar` `display: none`이고 jsDelivr·ksplat 요청이 하나도 없음.
  그 상태에서 1400px로 리사이즈하면 뷰어가 마운트됨. 데스크톱(1400px)에서는 레이아웃 변화 없음도 확인했다.

### 2-6. CV 파일과 이메일 (2026-10-06)

- `files/CV.pdf`를 사용자가 루트에 둔 새 파일(PDF 1.7)로 교체했다(루트의 사본은 `files/`로 옮김. 루트에 두면 Jekyll이 `/CV.pdf`로도 배포한다).
  이전 CV는 git 히스토리(`309eeca` 이전)에 있다.
- 사이드바 Email(mailto)은 `_config.yml` `author.email`이며 `2015142131@yonsei.ac.kr` → `jungho.lee_v@navercorp.com`으로 바꿨다.
  git 작성자 이메일(`git config user.email`)은 이전 커밋과의 일관성을 위해 yonsei 주소 그대로다.

### 2-7. 기타

- `_config.yml` `exclude`에 `handoff`, `handoff.tar.gz`, `profile3d_handoff`, `CLAUDE.md`. `.gitignore`에 `handoff/`, `handoff.tar.gz`, `profile3d_handoff/`.
  (제외하지 않으면 Jekyll이 handoff 폴더의 자산 사본 10 MB를 `_site/`에 복사한다.)
- `handoff/`(2026-10-02 번들, 잘린 자산), `handoff.tar.gz`, `profile3d_handoff/`(2026-10-05 번들, 자르지 않은 자산과
  `GAUSSIAN_VIEWER_GUIDE.md`)는 루트에 그대로 있다. 지우지 않았다.
- `assets/profile-3d/README.md`는 현재 자산 기준으로 갱신했다. Jekyll이 이 README를 `_site/assets/profile-3d/index.html`로도 렌더링한다(기존 동작).
  같은 폴더의 `profile_512.png`는 생성 파이프라인 입력 사본.
- `scripts/generate_profile_trellis2.py`는 이전의 TRELLIS.2 시도(미완, 사용 안 함).

## 3. 이 Mac의 빌드 환경

- Homebrew `ruby@3.3`(3.3.12). 2026-10-02에 설치했다고 기록했지만 2026-10-05 세션 시작 시점에는 없어서(`brew list`에 ruby 없음)
  `brew install ruby@3.3`로 다시 설치했다. brew가 `/opt/homebrew/bin/ruby`, `gem`, `bundle`에 자동으로 링크했고 기존 PATH에서 바로 잡힌다.
  Homebrew의 `ruby` 포뮬러는 Ruby 4.0이라 Jekyll 3.10이 로드되지 않는다(`logger` 등이 기본 gem에서 빠짐). 설치하지 말 것.
- `gem install bundler -v 2.5.9`(Gemfile.lock의 BUNDLED WITH) 후 `bundle _2.5.9_ install` 완료(github-pages 232, jekyll 3.10.0, 99 gems).
  Gemfile과 Gemfile.lock은 바뀌지 않았다. 세션 시작 시 `bundle exec jekyll build`가 안 되면 이 두 단계를 다시 하면 된다.
- `bundle exec jekyll build`는 약 5초. 첫 줄의 faraday-retry 안내 문구는 무시해도 된다.
- `ruby -run -e httpd _site -p 4000`은 `bundle install`이 설치한 webrick 덕에 일반 `ruby`로 동작한다.
- gem 실행 파일 경로 `/opt/homebrew/lib/ruby/gems/3.3.0/bin`은 PATH에 없다. `jekyll`을 직접 부르지 말고 `bundle exec`를 쓸 것.
- 시스템 Ruby 2.6(`/usr/bin/ruby`)으로는 이 스택을 돌릴 수 없다.
- `serve.rb`는 rbenv 또는 현재 Ruby의 `Gem.bin_path("jekyll")`로 jekyll을 찾는다. 확인하지 않았다.

## 4. 검증 방법 (재사용 가능)

- `_site/`를 `ruby -run -e httpd _site -p <포트>`로 띄우고 headless Chrome(`--headless=new --remote-debugging-port=...`)을
  DevTools 프로토콜로 조작해 확인한다(websocket-client를 임시 폴더에 `pip --target`으로 설치; 세션 scratchpad에 둔 스크립트는 세션이 끝나면 사라진다).
  확인 항목: `.profile3d`에 `is-ready` 부여, `el._profile3d.splatMesh.getSplatCount()` = 188,001, `el._profile3d.camera.position` ≈ (0, 0.05, 2.9)와
  `controls.target` = (0, -0.1, 0), 캔버스 위 wheel 이벤트의 `defaultPrevented === false`, 대기 중 방위각이 약 ±25° 안에서만 왕복(7초 샘플링),
  드래그 후 `is-touched`·힌트 숨김·카메라 정지(스웨이 종료), 사이드바 링크 목록에 `CV -> /files/CV.pdf`, 홈의 contact/CV href가 상대 경로,
  단축키 무반응, 라이브러리 오버레이(progress bar, spinner, info panel) `display: none`, 좁은 폭에서도 뷰어 로드(2026-10-05부터; 그 전엔 480px에서 미로드 확인),
  다른 페이지(Publications 등)에서도 동작. 2026-10-05에 모두 통과. 화면 캡처로 정면/측면/뒤/상하 극각 한계에서 프레이밍과 하단 페이드도 확인했다.
- headless Chrome의 첫 페이지 로드에서 CDN 모듈 fetch가 한 번 실패한 적이 있다(일시적, 재시도 후 정상). 콘솔에 `[profile3d] library load failed`로 찍힌다.
- 실패 원인은 브라우저 콘솔에 `[profile3d] ...` 경고로 찍힌다.
- `ruby -run -e httpd`는 Cache-Control 없이 Last-Modified/ETag만 보내서, 브라우저가 전에 열어 본 페이지를 휴리스틱 캐시(마지막 수정 후 경과 시간의 10%)로
  재검증 없이 보여준다. 2026-10-05에 사용자가 "홈에는 CV가 있는데 Publications 등에는 없다"고 했을 때 `_site/`와 서버 응답은 모두 정상이었고
  원인은 이 캐시였다(홈은 새로고침해서 최신, 나머지는 내비게이션으로 들어가 캐시본). 사용자가 "안 바뀌었다"고 하면 먼저 `curl`로 서버 응답을 보고
  하드 리로드(⌘⇧R)나 시크릿 창을 안내할 것. `bundle exec jekyll serve`는 no-cache 헤더를 주지만 개발 모드에서 `site.url`을 localhost로 덮어써
  커밋되는 `_site/`의 절대 URL을 오염시키므로 이 저장소에서는 쓰지 말 것.
- `JEKYLL_ENV=production`(HTML 압축) 빌드에서도 import map JSON이 유효함을 확인했다(2026-10-02).
- webrick이 주는 MIME: `.js` application/javascript, `.ksplat` application/octet-stream. 문제없음.

## 5. 남은 일과 메모

- 사용자가 로컬에서 새 자산의 모양(프레이밍, 하단 페이드, 힌트 위치)과 스웨이 속도/폭을 확인한 뒤 커밋/푸시한다. 조정 요청이 오면
  `data-cam`/`data-look`(마크업), 페이드 위치(`_sass/_profile3d.scss`), `SWAY`와 polar 상한(`profile3d-splat.js`) 순으로 손대면 된다.
- 기존 문제(이번 작업과 무관): `_includes/head/custom.html`이 참조하는 `images/favicon-*.png`, `android-chrome-192x192.png`가 없어 404가 난다
  (`base_path` 절대 URL이라 로컬에서는 배포 도메인으로 요청이 나가고 ORB 차단 로그가 찍힌다).
- 변경 사항은 모두 작업 트리에만 있다. 커밋 전 `git status`로 소스 변경, `_site/` 재생성, 새 파일(`_sass/_profile3d.scss`,
  `assets/js/profile3d-splat.js`, `assets/profile-3d/`, `CLAUDE.md`)을 확인할 것. `.DS_Store` 삭제들도 작업 트리에 섞여 있다.
