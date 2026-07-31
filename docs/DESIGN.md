# 디자인 노트

이 문서는 포트폴리오 리뉴얼에서 내린 결정과 **그 이유**를 남겨 둔 것입니다.
"무엇을 했는가"는 git 히스토리에 있으니, 여기에는 코드만 봐서는 알 수 없는
"왜 그렇게 했는가"와 시행착오를 적습니다.

---

## 1. 헤더 — 유리(glass) 디자인

### 규칙

| 상태 | 배경 | 블러 | 테두리 | 글자 |
| --- | --- | --- | --- | --- |
| 첫 진입 (`scrollY === 0`) | 없음 | 없음 | 없음 | 밝은 톤 |
| 스크롤 중 (`.scrolled`) | `--header-glass` | `blur(20px) saturate(180%)` | `--header-glass-border` | 기본 톤 |

첫 화면(`#s_home.hero-dark`)은 항상 어두운 격자 배경이라, 판이 깔리지 않은
동안에는 그 위에 글자가 놓입니다. 그래서 `.header:not(.scrolled)` 에서
로고 타이틀 · 내비 · 언어 선택 · 햄버거를 모두 흰 계열로 뒤집습니다.
라이트 테마에서도 마찬가지입니다 — 히어로가 어둡다는 사실은 테마와 무관합니다.

유리의 윗면 하이라이트는 `.header::before` 의 그라데이션으로 만들고,
`.header .inner { position: relative; z-index: 1 }` 로 내용이 그 위에 오게 합니다.

### 주의할 점

`offset` 은 스크롤 이벤트로만 갱신되므로, 새로고침으로 페이지 중간에 복원되면
첫 스크롤이 일어나기 전까지 헤더가 투명한 채로 밝은 본문 위에 놓입니다.
그래서 `Header` 마운트 시 `window.scrollY` 로 초기값을 한 번 맞춥니다.

```tsx
// src/components/layout/header/index.tsx
onScroll();                       // ← 초기 동기화
window.addEventListener('scroll', onScroll, {passive: true});
```

---

## 2. 반응형 — 브레이크포인트가 아니라 `clamp()`

### 문제

여백과 글자 크기가 브레이크포인트마다 고정값으로 갈아끼워져 있었습니다.
그래서 폭을 줄이면 값이 계단식으로 **툭 떨어지고**, 그 사이 구간에서는
데스크톱 값이 그대로 남아 "반응형 같지 않다"는 인상을 줬습니다.

### 방침

크기·여백은 미디어 쿼리가 아니라 `clamp()` 로 폭에 비례해 이어지게 합니다.
미디어 쿼리는 **레이아웃 구조가 바뀔 때만** 씁니다(열 수, 방향, 표시 여부).

```css
.section        { padding: clamp(3.75rem, 8vw, 7rem) 0; }
.section > *    { width: min(var(--content-width), 100% - clamp(2rem, 5vw, 8rem)); }
.section-title  { font-size: clamp(1.95rem, 1.35rem + 2.6vw, 3.1rem); }
```

`clamp()` 의 가운데 항에 `rem + vw` 를 섞으면 기울기를 완만하게 잡을 수 있습니다.
`vw` 만 쓰면 좁은 화면에서 너무 빨리 작아집니다.

### 브레이크포인트 역할

| 폭 | 하는 일 |
| --- | --- |
| `≤ 1200px` | 히어로 2열 → 1열, Profile 흐름 2열 → 1열 |
| `≤ 900px` | 내비 → 햄버거, 경력 카드 2열 → 1열, 우측 고정 메뉴 숨김 |
| `≤ 767px` | `.pc` / `.mobile` 전환, 프로젝트·기술 카드 1열, Timeline 축소 |
| `≤ 480px` | 로고 텍스트 숨김, 히어로 버튼 전폭 |

---

## 3. Timeline — 모바일에서 세로로 늘어지던 문제

경력 카드는 데스크톱에서 `170px | 1fr` 2열입니다. 왼쪽 열(`.career-card-aside`)에
번호와 입사·퇴사 날짜가 세로로 쌓입니다.

모바일에서 1열로 접히면 이 세로 배치가 그대로 남아, 번호 · 입사 · 퇴사가
각각 두 줄씩(라벨 + 값) 총 6줄을 먹었습니다. 카드 하나가 화면 한 장을 넘겼습니다.

**해결**: 1열이 되는 순간 aside 를 카드 머리의 **가로 띠**로 전환합니다.

```css
@media (max-width: 900px) {
    .career-card-aside { flex-direction: row; flex-wrap: wrap; align-items: center; }
    .career-period     { flex-direction: row; flex-wrap: wrap; }
    .career-period-row { flex-direction: row; align-items: baseline; }
}
```

결과: `01  입사 2024-12-16  재직중` 한 줄.

### 레일(점·선) 정렬

레일은 `.career-list` 의 `padding-left` 안쪽에 그립니다. 좌표가 서로 물려 있어
하나를 바꾸면 나머지도 함께 맞춰야 합니다.

```
padding-left        레일이 차지하는 폭
::before (점)       left: -(padding-left), top: 점 오프셋
::after  (선)       left: -(padding-left) + (점 지름 - 선 두께)/2
                    bottom: -(카드 간격 + 점 오프셋)   ← 다음 카드의 점까지 닿게
```

모바일에서는 `2rem → 1.35rem`, 점 `13 → 11px`, 선 `3 → 2px` 로 줄여
카드에 붙였습니다.

---

## 4. Profile 섹션 — 배치

### 문제

머리글(eyebrow + 제목 + 부제)이 2열 격자 **안에** 들어 있어 팩트표와 나란히
놓였습니다. "철학 문장 옆에 웬 표?" 처럼 읽혔고, 자격증 칩은 컨테이너 없이
떠 있었으며, ∞ 도식과 역할 카드는 아무 설명 없이 등장했습니다.
게다가 이 섹션만 다른 섹션(`Career`/`Project`/`Skill`)과 머리글 구조가 달랐습니다.

### 구조

위에서 아래로 읽히는 세 덩어리로 정리했습니다.

```
PROFILE                          ← nav 라벨과 동일 (섹션 eyebrow)
백엔드 엔지니어 김희정             ← 인물 소개가 섹션 제목
설계부터 운영까지 …
[역할·기술 태그]

경력 | 학력 | 현재 | 범위          ← 가로 4열 띠
CERTIFICATIONS
──────────────────────────────
ENGINEERING PHILOSOPHY           ← .profile-block
보이지 않는 곳의 완성도가 …
──────────────────────────────
HOW I WORK                       ← .profile-block (같은 CSS 공유)
설계부터 개선까지, 전 구간을 직접 맡습니다
[∞ 다이어그램]   ARCHITECTURE / DESIGN / DELIVER / OBSERVE
```

읽는 순서가 **누구(Profile) → 무엇을 믿는가(Philosophy) → 어떻게 일하는가(How I Work)** 로
이어집니다. `How I Work` 소제목이 있어야 ∞ 도식이 왜 거기 있는지 설명됩니다.

### 이름은 `config` 에서

섹션 제목의 강조 부분(이름)은 `config.profile.name` 에서 가져옵니다.
i18n 에도 이름을 적어 두면 두 곳이 갈라지므로 그렇게 하지 않았습니다.

```tsx
const name = language === 'ko' ? config.profile.name.korean : config.profile.name.english;
<h2 className="section-title">{t.title[0]} <em>{name}</em></h2>
```

그래서 `profile.title` 은 역할 하나만 든 길이 1 배열입니다.

---

## 5. DevOps 인피니티 다이어그램

`src/components/section/devops/index.tsx`.
시행착오가 가장 많았던 부분이라 실패한 접근까지 남깁니다.

### 5.1 고리는 반드시 '정원'

처음에는 베지에로 lemniscate 를 그렸습니다. 결과적으로 고리가
`rx 200 / ry 155` 타원이 되어 **찌그러져 보였습니다**.

지금은 반지름이 같은 정원 두 개를 씁니다.

```
좌원 중심 (285, 210) · 우원 중심 (615, 210) · 반지름 150
```

### 5.2 교차는 별도의 밴드로

두 원을 교차점에서 맞물리게 하면, 그 지점의 접선이 양쪽 모두 수직이라
**뾰족하게 맞닿기만 하고 X 로 교차하지 않습니다**. 원 두 개를 붙여 놓은 것처럼 보입니다.

그래서 각 고리를 290° 원호로 열어 두고, 안쪽으로 열린 틈을 가운데에서
X 로 교차하는 직선 밴드 두 개로 잇습니다.

```
원호 끝점  A(408,124)  B(408,296)  C(492,124)  D(492,296)

DEV_LOOP   A →(반시계 290°)→ B
OPS_LOOP   C →(시계 290°)→ D
CROSS_UP   B → C     (아래에서 위로)
CROSS_DOWN D → A     (위에서 아래로)
```

그리는 순서로 위빙을 만듭니다: `CROSS_DOWN` 먼저, `CROSS_UP` 나중.
아래 밴드를 반투명하게 두면 겹치는 자리에 배경이 비쳐 **얼룩처럼 보이므로**
둘 다 불투명하게 둡니다.

### 5.3 둥근 끝 + 분절 — 캡 보정이 필요합니다

`stroke-linecap: round` 는 각 dash 를 **stroke-width 의 절반씩 양쪽으로** 늘립니다.
그래서 `dasharray` 의 틈을 그냥 20 으로 주면 캡이 틈을 통째로 삼켜
분절이 전혀 보이지 않습니다. (처음에 분절이 안 보였던 원인이 이것이었습니다.)

```
dasharray 의 틈 = 보이고 싶은 틈 + stroke-width
```

그리고 틈은 구간 **사이**에만 세 번 들어갑니다. `4s + 3g = L` 로 풀어야
원호가 교차 밴드까지 꽉 찹니다. `L/4 - g` 로 잡으면 끝에 틈이 하나 더 남고,
그 자리가 하필 밴드가 붙는 지점이라 밴드가 떨어져 보입니다.

```ts
const gap  = SEGMENT_GAP + strokeWidth;      // SEGMENT_GAP === 0 → 캡끼리 정확히 맞닿음
const dash = (length - gap * (SEGMENTS - 1)) / SEGMENTS;
```

`stroke-width` 는 미디어 쿼리로 달라지므로 **CSS 계산값을 읽고**
`resize` 에도 다시 잽니다. 하드코딩하면 모바일에서 어긋납니다.

### 5.4 라벨은 `textPath` 로

좌표에 글자를 얹고 접선 각도로 회전시키는 방식을 먼저 썼습니다.
회전각은 접선의 **근사값**이라 글자 기울기와 리본 곡률이 미세하게 어긋나고,
한글처럼 글자 폭이 있으면 양끝이 리본 밖으로 삐져나와 **떠 보입니다**.

지금은 앵커를 중심으로 하는 짧은 원호(반지름은 리본과 동일한 150)를 만들어
`<textPath>` 로 흘립니다. 글자가 리본에 새겨진 것처럼 붙습니다.

```tsx
<path id={`dvi-label-${id}`} d={labelArc(anchor, cx)} fill="none"/>
<text><textPath href={`#dvi-label-${id}`} startOffset="50%">{label}</textPath></text>
```

아래쪽 반원은 원호를 **반대 방향으로 감아야** 글자가 뒤집히지 않습니다
(`labelArc` 의 `isBottom` 분기).

### 5.5 좌표는 재서 씁니다

각 구간의 중심 좌표를 손으로 적어 두면 경로를 손볼 때마다 어긋납니다.
`getTotalLength()` / `getPointAtLength()` 로 실제 경로에서 직접 잽니다.

### 5.6 그 밖

* 고리 가운데는 약칭을 크게(`Dev`), 풀네임을 작게(`DEVELOPMENT`) 두 줄로 씁니다.
* 모바일에서도 **세로로 세우지 않고** 가로 한 줄을 유지합니다. SVG 는 `max-width: 500px`.
* 옆의 capability 카드와 `flowId` 를 공유해 호버 시 서로 강조합니다.
  `'all'` 은 특정 단계가 아니라 루프 전체를 가리키며 `Architecture` 카드가 씁니다.

---

## 6. 섹션 머리글

`Career` / `Project` / `Skill` 은 머리글이 가운데 정렬인데 본문은 좌측 정렬이라
어긋나 보였습니다. `.section-head` 래퍼로 묶어 좌측 정렬로 통일했습니다.

래퍼가 필요한 이유: `.section > *` 가 모든 **직계 자식**에 콘텐츠 폭과
`margin: auto` 를 강제합니다. 제목을 직계 자식으로 두고 `text-align: left` 만
주면, `max-width` 로 좁아진 블록이 가운데 정렬된 채 글자만 왼쪽에 붙어
왼쪽 여백이 어긋납니다. 한 겹 감싸면 이 규칙에서 벗어납니다.

제목 뒷 구절은 `<em>` + 그라데이션으로 강조합니다.

```tsx
<h2 className="section-title">{t.title[0]}<br className="mobile"/> <em>{t.title[1]}</em></h2>
```

---

## 7. 디자인 토큰

`src/assets/css/style.css` 의 `:root` 가 단일 출처입니다.
`dark.css` 는 같은 이름의 토큰을 `body[data-theme="dark"]` 에서 덮어씁니다.

| 토큰 | 값 | 비고 |
| --- | --- | --- |
| `--grad-accent` | `linear-gradient(135deg, #6366f1, #8b5cf6)` | 강조 전반 |
| `--radius` | `26px` | 카드·패널 |
| `--radius-sm` | `18px` | 작은 요소 |
| `--content-width` | `1160px` | |
| `--header-height` | `88px` / `68px`(scrolled) | |
| `--header-glass*` | 헤더 유리판 3종 | 스크롤 후에만 사용 |

모서리는 전반적으로 둥근 편을 씁니다. 알약(`999px`)과 원형(`50%`)은 예외입니다.

> **주의**: 현재 `template/index.html` 에 `data-theme="dark"` 가 고정되어 있어
> 라이트 테마는 실제로 렌더되지 않습니다. 라이트 토큰은 방어적으로만 유지 중이며
> 검증되지 않았습니다.

---

## 8. i18n

* UI 껍데기 문자열: `src/data/i18n.ts` 의 `translations[ko|en]`
* 구조가 있는 콘텐츠(경력·프로젝트): 각 데이터 파일에서 필드 단위 `{ko, en}`

새 문자열을 넣을 때는 `ITranslations` 인터페이스에 먼저 추가합니다.
그러면 한쪽 언어를 빠뜨렸을 때 타입 에러로 잡힙니다.

언어 선택 UI 는 각 언어의 **자칭**(`한국어` / `English`)으로 표기합니다.
현재 언어 기준으로 번역하면(`영어` / `Korean`) 그 언어를 못 읽는 사람에게
아무 도움이 안 됩니다.

---

## 남은 것

* 라이트 테마: 토큰만 있고 검증되지 않음 (`data-theme` 가 dark 로 고정)
* 번들 크기: `main` 481 KiB 로 webpack 권장치(244 KiB) 초과. babylon(3D 배경화면)과
  pdf.js 가 대부분을 차지합니다.
* `/resume` 라우트는 빈 페이지를 렌더합니다.
