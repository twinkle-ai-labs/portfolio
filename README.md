# Portfolio Page

김희정(Twinkle)의 개인 포트폴리오 사이트입니다.

**https://twinklekhj.xyz**

<br>

## 1. Inspiration
저는 많은 곳에서 `Twinkle`이라는 별명을 사용할 정도로 애착이 있습니다. 
저에게 있어 `Twinkle`은, "언제나 빛나는 별처럼, 애써 드러내지 않아도 여전히 빛나고 있나고 있음을 의미"합니다.

twinkle을 테마로 밤하늘 배경화면과 컬러, 메인 아이콘들을 잡았습니다.

<br>

### Main Color
강조색은 인디고 → 바이올렛 그라데이션입니다.

| 토큰 | 값 |
| - | - |
| `--grad-accent` | `linear-gradient(135deg, #6366f1, #8b5cf6)` |
| `--blue` | `#5b5bd6` |
| `--violet` | `#8b5cf6` |

색·반경·간격은 `src/assets/css/style.css`의 `:root` 토큰이 단일 출처이며,
다크 테마는 `dark.css`에서 같은 이름의 토큰을 덮어씁니다.

<br>

### Main Background
![로고 이미지](https://twinklekhj.xyz/og.png)

[Wallpaper](https://twinklekhj.xyz/space) 페이지에서 3D 배경화면을 보실 수 있습니다.

<br>

### Main Icon
| 로고 | Favicon |
| - | - |
| ![로고 이미지](https://twinklekhj.xyz/logo.png) | ![Favicon 이미지](https://twinklekhj.xyz/favicon.png) |

<br>


## 2. Hosting
* Domain - 'twinklekhj.xyz'
* Hosting by GitHub, Gabia

`master`에 push되면 GitHub Actions(`.github/workflows/cicd.yml`)가 빌드 후
`gh-pages` 브랜치로 배포합니다. **머지 즉시 실서비스에 반영됩니다.**

<br>

## 3. Stack
### Basic
* Runtime: Node 24.x
* Language: TypeScript
* Framework: React 18
* Bundler: webpack 5
* CI/CD: GitHub Actions + gh-pages

<br>

### Related Library
* `redux`, `redux toolkit` - redux를 사용한 전역 상태 관리
* `webpack` - webpack을 이용한 리소스 번들링
* `babylon` - 3D 배경화면 구현
* `react-router-dom` - 여러 페이지 개발
* `react-modal` - modal 창 구현 (with redux)
* `react-pdf` - pdf viewer 사용
* `material-ui` - ui 구현

<br>

## 4. Getting Started

```bash
npm install
npm start          # 개발 서버 (http://localhost:9000)
npm run build      # 프로덕션 번들 → dist/
npx tsc --noEmit   # 타입 검사
```

<br>

## 5. Structure

```
src/
  pages/main/section/   home · profile · career · project · skill
  components/
    layout/             header · footer · drawer · flop · scrollbar
    section/            devops(∞ 다이어그램) · console · language · countup · babylon …
  data/                 i18n · config · career · project · skill · link
  assets/css/           style(토큰+본체) · dark · mobile · transition
  store/slice/          offset · language · drawer · modal · loading
```

경로 별칭 `@Components` `@Layout` `@Pages` `@Data` `@Store` `@Style` `@Utils` `@Images`는
`webpack.config.js`와 `tsconfig.json` 양쪽에 정의되어 있습니다.

<br>

## 6. Documentation

* [docs/DESIGN.md](docs/DESIGN.md) — 디자인 결정과 그 이유, 시행착오 기록
  (유리 헤더 · `clamp()` 기반 반응형 · Timeline · Profile 구성 · DevOps ∞ 다이어그램)
* [CLAUDE.md](CLAUDE.md) — 이 저장소에서 코드를 고칠 때의 규칙과 함정
