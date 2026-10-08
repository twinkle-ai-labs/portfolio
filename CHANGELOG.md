# Changelog

이 제품의 판은 `package.json` 의 `version` 과 태그 `vX.Y.Z` 로 센다. 1.1.0 까지는 CHANGELOG 없이 나갔다 —
그 판들의 내용은 `git log` 와 금고(`vault/products/Portfolio/`)가 갖고 있다.

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
