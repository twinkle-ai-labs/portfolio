# CLAUDE.md

김희정(Twinkle) 포트폴리오 사이트. React + TypeScript + webpack, GitHub Pages 배포.

## 명령어

```bash
npm start          # 개발 서버 (webpack-dev-server, 9000 포트)
npm run build      # 프로덕션 번들 → dist/
npx tsc --noEmit   # 타입 검사
```

테스트 러너는 설정만 있고 실제 테스트는 없습니다. 변경 후에는
`npx tsc --noEmit` 과 `npm run build` 로 확인합니다.

## 배포

`master` 에 push 되면 `.github/workflows/cicd.yml` 이 빌드 후
`gh-pages` 브랜치로 배포합니다. **머지 = 즉시 실서비스 반영**입니다.
`master` 로 직접 push 하지 말고 브랜치를 따서 PR 로 올립니다.

## 구조

```
src/
  pages/main/
    section/            home · profile · career · project · skill  (각 섹션 = #s_xxx)
    components/         console · countup · devops(∞ 다이어그램)
  pages/space/
    section/home.tsx    로딩 화면 + ThreeSpace 마운트
    components/         SpaceLoading · TwinkleBadge
    three/              3D 월드. index.tsx 가 오케스트레이터이고 나머지는 전부
                        {create*() → {update(time|delta), dispose()}} 형태의 모듈:
                        sky · starfield · fireflies · entrances · city ·
                        ground-repair · astronaut · character · camera-rig ·
                        keyboard · assets(모델 프로미스 캐시) · hud.tsx
  components/           페이지 두 곳 이상이 쓰는 것만: layout/ · logo · language ·
                        modal · project
  data/
    i18n.ts             UI 문자열 카탈로그 (ko / en)
    config.tsx          프로필 · 사이트 메타
    career.tsx  project.tsx  link.tsx
  assets/css/
    style.css           토큰 + 전체 스타일 (단일 출처)
    dark.css            body[data-theme="dark"] 토큰 덮어쓰기
    mobile.css          미디어 쿼리 (1200 / 900 / 767 / 480)
    transition.css
  store/slice/          redux — offset · language · drawer · modal · loading
```

경로 별칭: `@Components` `@Layout` `@Pages` `@Data` `@Store` `@Style` `@Utils` `@Images`
(webpack.config.js 와 tsconfig.json 양쪽에 정의 — 하나만 고치면 안 됩니다)

## 이 저장소의 규칙

### 컴포넌트 배치

한 페이지에서만 쓰는 컴포넌트는 `pages/<page>/components/` 에 둡니다.
`components/` 최상위는 **두 페이지 이상이 실제로 import 하는 것**만 남깁니다 —
전부 `components/section/` 에 몰아넣던 시절엔 아무도 안 쓰는 컴포넌트가
섞여 있어도 티가 나지 않았습니다.

### Space 3D

`pages/space/three/` 의 모듈은 씬 그래프에 자기 오브젝트를 추가하고
`update`/`dispose` 를 돌려주는 팩토리입니다. render 루프(`index.tsx`)는
프레임마다 그 `update` 만 호출합니다 — 새 요소를 넣을 때도 루프를 건드리지 말고
모듈을 하나 더 만드세요.

* **모델은 `assets.ts` 를 통해서만 로드합니다.** 완성된 씬이 아니라 로딩
  *프로미스*를 캐시합니다. 같은 GLTF 를 동시에 두 번 파싱하면 `THREE.Cache`
  를 두고 경쟁하다 진 쪽 텍스처가 빈 채로 남아 밤하늘이 통째로 검게 나옵니다.
* **실제 광원(PointLight)을 늘리지 마세요.** forward 렌더러라 조명 하나가
  130만 삼각형 도시 전체의 프래그먼트 비용에 곱해집니다. "불빛이 많아 보이는"
  연출은 additive 스프라이트(`fireflies.ts`)로 합니다.

### CSS

* **크기·여백은 `clamp()`, 미디어 쿼리는 레이아웃 구조 변경에만.**
  브레이크포인트에서 고정값을 갈아끼우면 폭에 따라 값이 계단식으로 튀어
  반응형처럼 보이지 않습니다.
* 색·반경·간격은 `:root` 토큰을 쓰고 값을 직접 적지 않습니다.
  다크 테마 대응이 `dark.css` 의 토큰 덮어쓰기로 이뤄지기 때문입니다.
* `.section > *` 가 직계 자식에 콘텐츠 폭과 `margin: auto` 를 강제합니다.
  좌측 정렬 머리글은 `.section-head` 처럼 한 겹 감싸야 합니다.

### 주석

한국어로, **무엇이 아니라 왜**를 적습니다. 좌표 계산이나 캡 보정처럼
"이 숫자가 왜 이 값인지" 코드만 봐서는 알 수 없는 곳에 남깁니다.

### i18n

새 문자열은 `ITranslations` 인터페이스 → `ko` → `en` 순으로 추가합니다.
인터페이스에 먼저 넣어야 한쪽 언어 누락이 타입 에러로 잡힙니다.
사람 이름·회사명 같은 고유 데이터는 `config.tsx` 에서 가져오고
i18n 에 중복해 적지 않습니다.

## 손대기 전에 알아야 할 것

### 헤더

`scrollY > 0` 일 때만 유리판이 깔립니다. 판이 없는 동안에는 어두운 히어로 위에
글자가 놓이므로 `.header:not(.scrolled)` 에서 전경색을 밝은 톤으로 뒤집습니다.
이 뒤집기는 라이트 테마에도 적용됩니다 — 히어로가 어둡다는 사실은 테마와 무관합니다.

### DevOps ∞ 다이어그램 (`components/section/devops`)

건드리기 전에 [docs/DESIGN.md](docs/DESIGN.md) 5장을 읽으세요. 함정이 있습니다.

* 고리는 **정원 두 개** + 가운데 X 교차 밴드. 하나의 lemniscate 로 그리면
  고리가 타원이 되어 찌그러지고, 교차점 접선이 수직이라 교차하지 않습니다.
* `stroke-linecap: round` 는 dash 를 stroke-width 의 절반씩 늘립니다.
  `dasharray` 의 틈 = `보이는 틈 + stroke-width` 로 보정해야 합니다.
* 구간 길이는 `4s + 3g = L`. `L/4 - g` 로 잡으면 끝에 틈이 남습니다.
* `stroke-width` 가 미디어 쿼리로 바뀌므로 CSS 계산값을 읽고 `resize` 에 재측정합니다.
* 라벨은 `<textPath>`. 좌표 + 회전 방식은 글자가 리본에서 떠 보입니다.
* 좌표는 `getPointAtLength()` 로 재서 씁니다. 하드코딩하면 경로 수정 시 어긋납니다.

### 테마

`template/index.html` 에 `data-theme="dark"` 가 고정되어 있어 **라이트 테마는
실제로 렌더되지 않습니다**. 라이트 토큰은 방어적으로만 유지 중이며 검증되지
않았으니, 확인했다고 말하지 마세요.

### 번들 크기

`main` 481 KiB 로 webpack 권장치를 넘습니다(경고 2건). babylon(3D 배경)과
pdf.js 가 대부분이며 의도된 상태입니다. 새로 경고가 늘었다면 그건 확인이 필요합니다.

## 검증

브라우저 미리보기로 확인할 때는 폭을 바꿔 가며 봅니다:
`375` (모바일) · `768` (태블릿) · `1280` (데스크톱).
`.section` 이 `overflow: hidden` 이라 가로 넘침이 스크롤 대신 잘려 나가므로,
`document.documentElement.scrollWidth` 만으로는 넘침을 잡을 수 없습니다.
