<div align="center">

# Twinkle's Portfolio

백엔드 엔지니어 **김희정**의 개인 포트폴리오 사이트

[**me.twinklelabs.kr**](https://me.twinklelabs.kr)

</div>

![og](https://me.twinklelabs.kr/og.png)

<br>

## 소개

`Twinkle`은 제가 오래 써 온 별명입니다. 저에게 이 단어는
*"언제나 빛나는 별처럼, 애써 드러내지 않아도 여전히 빛나고 있음"* 을 뜻합니다.

밤하늘을 테마로 배경과 컬러, 아이콘을 잡았고,
[/space](https://me.twinklelabs.kr/space) 페이지에서 Babylon.js로 구현한 3D 밤하늘을 볼 수 있습니다.

| 로고 | Favicon |
| :-: | :-: |
| ![로고](https://me.twinklelabs.kr/logo.png) | ![Favicon](https://me.twinklelabs.kr/favicon.png) |

<br>

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 메인 — Home · Profile · Experience · Projects · Skills |
| `/space` | Babylon.js 3D 밤하늘 배경화면 |
| `/resume` | 이력서 (현재 비어 있음) |
| `*` | 404 |

메인은 다섯 개 섹션(`#s_home` `#s_profile` `#s_career` `#s_project` `#s_skill`)으로 이뤄진
한 페이지이고, 헤더 내비게이션이 각 섹션으로 스크롤합니다.

<br>

## 주요 기능

- **한국어 / English 전환** — 선택은 `localStorage`에 저장됩니다
- **유리(glass) 헤더** — 첫 진입에는 투명, 스크롤이 시작되면 블러 유리판이 깔립니다
- **DevOps ∞ 다이어그램** — 설계→배포→관측→개선 순환을 SVG 인피니티 리본으로 표현.
  옆의 역할 카드와 호버로 상호 강조됩니다
- **프로젝트 상세 모달** — 각 프로젝트의 배경·구조·성과를 다이어그램과 함께 보여 줍니다
- **반응형** — 브레이크포인트 고정값이 아니라 `clamp()` 기반으로 폭에 따라 이어집니다
- **3D 배경화면** — Babylon.js (`/space`)

<br>

## 기술 스택

| 구분 | 사용 |
| --- | --- |
| Runtime | Node 24.x |
| Language | TypeScript 5 |
| UI | React 18, MUI 5 |
| 상태 관리 | Redux Toolkit |
| 라우팅 | react-router-dom 6 |
| 번들러 | webpack 5 |
| 3D | Babylon.js |
| 기타 | react-pdf, react-modal, react-icons |
| 배포 | GitHub Actions → GitHub Pages |

<br>

## 시작하기

```bash
npm install
npm start          # 개발 서버 → http://localhost:9000
```

| 명령어 | 설명 |
| --- | --- |
| `npm start` | 개발 서버 (HMR) |
| `npm run build` | 프로덕션 번들 → `dist/` |
| `npx tsc --noEmit` | 타입 검사 |

사이트 메타데이터는 저장소에 포함된 `.env`에서 읽습니다
(`URL` `CUSTOM_URL` `TITLE` `TITLE_FULL` `DESCRIPTION` `KEYWORDS`).

<br>

## 구조

```
src/
├── pages/
│   ├── main/section/     home · profile · career · project · skill
│   ├── space/            3D 배경화면
│   ├── resume/           이력서
│   └── error/            404
├── components/
│   ├── layout/           header · footer · drawer · flop · scrollbar
│   ├── section/          devops(∞) · console · language · countup · babylon · logo …
│   ├── project/          프로젝트 상세 모달 · 다이어그램 · 블록
│   └── modal/
├── data/                 i18n · config · career · project · skill · link · og
├── assets/css/           style(토큰+본체) · dark · mobile · transition
├── store/slice/          offset · language · drawer · modal · loading
└── utils/                date · i18n

template/                 index.html · manifest.json · robots.txt · sitemap.xml · og.png
```

경로 별칭은 `webpack.config.js`와 `tsconfig.json` **양쪽에** 정의되어 있습니다.
하나만 고치면 빌드나 IDE 한쪽이 깨집니다.

```
@Components  @Layout  @Pages  @Data  @Store  @Style  @Utils  @Images  @Models  @Fonts
```

<br>

## 내용 수정하기

콘텐츠는 컴포넌트가 아니라 `src/data/` 아래 데이터 파일에 있습니다.

| 무엇을 | 어디서 |
| --- | --- |
| 이름 · 연락처 · 기본 프로필 | `data/config.tsx` |
| 경력 (회사 · 기간 · 역할) | `data/career.tsx` |
| 프로젝트 (요약 · 상세 · 성과) | `data/project.tsx` |
| 기술 스택 분류 | `pages/main/section/skill.tsx` |
| UI 문구 (섹션 제목 · 라벨) | `data/i18n.ts` |
| 내비 · 외부 링크 | `data/link.tsx` |

**다국어 원칙**

- UI 껍데기 문자열 → `data/i18n.ts`의 `translations.ko` / `.en`
- 구조가 있는 콘텐츠(경력 · 프로젝트) → 각 데이터 파일에서 필드 단위 `{ko, en}`

새 문구는 `ITranslations` 인터페이스에 **먼저** 추가하세요.
그래야 한쪽 언어를 빠뜨렸을 때 타입 에러로 잡힙니다.

<br>

## 디자인 시스템

색·반경·간격은 `src/assets/css/style.css`의 `:root` 토큰이 단일 출처입니다.
다크 테마는 `dark.css`에서 **같은 이름의 토큰을 덮어쓰는** 방식이라,
값을 직접 적으면 테마 전환에서 어긋납니다.

| 토큰 | 값 |
| --- | --- |
| `--grad-accent` | `linear-gradient(135deg, #6366f1, #8b5cf6)` |
| `--blue` / `--violet` | `#5b5bd6` / `#8b5cf6` |
| `--radius` / `--radius-sm` | `26px` / `18px` |
| `--content-width` | `1160px` |

> 현재 `template/index.html`에 `data-theme="dark"`가 고정되어 있어
> **라이트 테마는 실제로 렌더되지 않습니다.** 라이트 토큰은 방어적으로만 유지 중입니다.

**반응형 방침** — 크기·여백은 `clamp()`로 폭에 비례하게 두고,
미디어 쿼리는 레이아웃 **구조가 바뀔 때만** 씁니다 (열 수, 방향, 표시 여부).
브레이크포인트는 `1200 / 900 / 767 / 480`.

<br>

## 배포

`master`에 push되면 [`.github/workflows/cicd.yml`](.github/workflows/cicd.yml)이
빌드 후 `gh-pages` 브랜치로 배포합니다.

> ⚠️ **머지 = 즉시 실서비스 반영.** `master`에 직접 push하지 말고 브랜치를 따서 PR로 올리세요.

- Domain: `me.twinklelabs.kr` (Gabia)
- Hosting: GitHub Pages

<br>

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/DESIGN.md](docs/DESIGN.md) | 디자인 결정과 **그 이유**, 시행착오 기록 |
| [CLAUDE.md](CLAUDE.md) | 코드를 고칠 때의 규칙과 함정 |

`docs/DESIGN.md`에는 유리 헤더 · `clamp()` 반응형 · Timeline · Profile 구성 ·
DevOps ∞ 다이어그램을 만들며 **실패한 접근까지** 남겨 두었습니다.
같은 곳을 다시 손볼 일이 있다면 먼저 읽어 보세요.
