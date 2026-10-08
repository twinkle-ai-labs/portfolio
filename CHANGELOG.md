# Changelog

이 제품의 판은 `package.json` 의 `version` 과 태그 `vX.Y.Z` 로 센다. 1.1.0 까지는 CHANGELOG 없이 나갔다 —
그 판들의 내용은 `git log` 와 금고(`vault/products/Portfolio/`)가 갖고 있다.

## [1.1.2] — 2026-10-08 · me.twinklelabs.kr

### Fixed
- `/files` 가 라이브에서 검게 서던 것 (`989e0d8`). v1.1.1 의 `dist/files/` 가 라우트 `/files` 를 가렸다 — GitHub Pages 는
  폴더가 있으면 `/files` 를 `/files/` 로 301 보내고, 404.html 셈이 돌려 둔 그 주소에서 index.html 의 상대 경로 번들이
  `/files/runtime.js` 로 풀려 404. `/space` 는 폴더가 없어 슬래시가 안 붙었을 뿐이다. 로컬 `serve -s` 는 301 을 안 해 못 잡았다

### Changed
- 봉한 `.enc` 와 `manifest.json` 의 자리 — `src/assets/files/` → `src/assets/sealed/`, 배포물은 `dist/sealed/`.
  라우트와 이름이 겹치지 않는다. `scripts/encrypt-files.mjs` · `FileVault` 의 fetch 경로도 같이 갔다
- `webpack.config.js` 의 `output.publicPath` 를 `/` 로 박았다 — 어느 깊이의 주소에서도 번들을 루트에서 찾는다

## [1.1.1] — 2026-10-08 · me.twinklelabs.kr

### Added
- `/files` — 키로 여는 문서함. 이력서 · 포트폴리오 PDF 넷을 PBKDF2(600k) → AES-256-GCM 으로 봉한 `.enc` 로 싣고,
  페이지에서 비밀구절 하나를 받아 WebCrypto 로 브라우저 안에서 푼다. 서버도 키가 가는 곳도 없다. 메뉴에 Files. `noindex` (`1e15b9d`)
- `scripts/encrypt-files.mjs` — 원본(`src/assets/pdf/`, git 밖)을 봉해 `src/assets/files/` 에 `.enc` 와 `manifest.json` 을 쓴다.
  컨테이너 꼴(`TWKF` 머리)은 `src/utils/crypto.ts` 와 한 벌

### Removed
- 평문 PDF 넷을 추적과 배포물에서 걷었다 — `dist/pdf/` 는 더 이상 나가지 않는다. 이력에서도 걷었다(2026-10-08 · filter-repo, 세 브랜치 강제 푸시)
- 어디서도 import 하지 않던 pdf.js 워커 복사(`pdf.worker.min.mjs`)

### Fixed
- `master` 의 CI 가 이제 없는 `src/assets/pdf` 를 복사하려다 실패하던 것 — 이 판의 `webpack.config.js` 가 `src/assets/files` 를 싣는다

### 왜 patch 인가
- 기능이 들었지만 번호는 patch 다 — 이 조직에서 minor 는 사람이 올린다(`releaser.md` 원칙 1)
