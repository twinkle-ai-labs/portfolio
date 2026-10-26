# Changelog

이 제품의 판은 `package.json` 의 `version` 과 태그 `vX.Y.Z` 로 센다. 1.1.0 까지는 CHANGELOG 없이 나갔다 —
그 판들의 내용은 `git log` 와 금고(`vault/products/Portfolio/`)가 갖고 있다.

## [1.1.3] — 2026-10-26 · me.twinklelabs.kr

### Added
- 우리 계측 — Twinkle API 의 `/beacon/v1/hit` 에 쿠키 없는 핑 하나 (`95c5109`). 집 · 경로 · 리퍼러만 보내고 서버는 사람을 잇는 것을
  적지 않는다. GA4 와 같은 조건(측정 ID 가 있는 빌드)에서만 켜지고, 화면을 갈아 끼울 때 `RouteViews` 가 한 번 더 보낸다
- 오르다 «설계» · «장애» 챕터, 통합통계의 구조 · 파이프라인, «내비 운영» 챕터 — 전부 코드 · 장애보고서 · 이력서에 근거가 있는 것만 (`b5378c0`)

### Changed
- GA4 Consent Mode — `analytics_storage` 만 `granted`, 광고 세 칸(`ad_storage` · `ad_user_data` · `ad_personalization`)은 `denied` 그대로 (`c595b07`).
  네 칸 전부 denied 면 GA4 는 핑을 보고서에 싣지 않아 사용자 · 페이지뷰가 0 이었다(2026-10-22 · Observatory). 배너는 여전히 세우지 않는다
- 정체성을 «백엔드 엔지니어» 하나로 — 제목 · 히어로 · 프로필 · 경력이 넷으로 갈려 있었다. 메타 · JSON-LD · manifest 까지 한 줄 (`01282ef`)
- 프로젝트 카드 겉면을 «문제 · 한 일 · 결과» 세 줄로(`features` → `story{problem, action, result}`), 기술명은 `stacks` 에만 (`8c9f593`)
- 카드를 훑어 읽히게 — 제목 아래 숫자 둘, 한 문장 세 줄, 칩 여섯 이하. 히어로 한 문단과 프로필 소제목을 숫자 있는 문장으로 (`a98bc63`)
- 히어로 콘솔의 근거 없는 숫자(«12/12 instances» · «4.2M rows» · «uptime 99.9%»)를 출처 태그가 붙은 실제 값으로 (`8c9f593`)
- 회사 항목에 공식 직급 병기(주임 연구원 · 대리), 프로젝트 역할의 Lead 를 뗀다 — 리드한 사람은 없고 혼자 맡았다 (`b5378c0` · `5b76bd4` · `30a51da`)

### Removed
- «AVAILABLE FOR WORK» 배지 — 재직 중인데 실명 검색에 걸리는 공개 사이트 상단이었다 (`b5378c0`)
- 히어로 체크리스트 넷 — 프로필 «How Do I Work» 카드 넷과 글자만 다른 같은 말이었다 (`ab6ab7a`)
- 프로필 «Engineering Philosophy» 블록 · 섹션 위의 기술 알약 여섯 · 어디서도 그리지 않던 `hero.careerSummary` · `coreStrengths` 키 (`8c9f593` · `a98bc63` · `01282ef`)
- 코드에 없던 말 — Filebeat · «헬스체크 뒤 무중단 롤아웃» · Prometheus → Slack 알림 · «3컨텍스트 DDD» · Quartz (`b5378c0`)

### 왜 patch 인가
- 글과 계측이 바뀌었지 사용자가 할 수 있는 일이 늘지 않았다 — 그리고 이 조직에서 minor 는 사람이 올린다(`releaser.md` 원칙 1)

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
