# SEO 규칙

기준일: 2026-11-12. 브랜드는 **1인 개발자 twinkle과 AI가 함께 제품을 만들어가는 AI 연구소**다. 앱, 웹, 몽글숑 같은 캐릭터는 활동의 예시이며 영역은 언제든 확장될 수 있다. 검색어를 위해 정체성이나 활동 범위를 임의로 바꾸지 않는다.

## 이 사이트의 역할과 주소

김희정(twinkle) 개인의 백엔드 엔지니어 포트폴리오. 연구소와 개인의 소개를 구분한다. 정본은 `/`이며 별도 URL이 없는 언어 토글에는 hreflang을 만들지 않는다. 자료 보관함과 3D 데모는 noindex로 제공한다.

## 작성과 구현

- 사이트 제목은 해당 사이트의 역할, 상세 페이지 제목은 그 콘텐츠의 주제를 전달한다. 다른 사이트와 같은 소개를 복제하지 않는다. 실제 본문에 없는 기능·자격·평점·가격·성과를 추가하지 않는다.
- 제목과 설명은 같은 언어의 본문을 요약한다. 검색·Open Graph·Twitter 메타데이터는 같은 원본을 사용한다. 글자 수만으로 합격 기준을 정하지 않는다. [Google 제목 지침](https://developers.google.com/search/docs/appearance/title-link), [설명 지침](https://developers.google.com/search/docs/appearance/snippet).
- 정본은 공개 HTTPS 주소이고 query·fragment를 포함하지 않는다. 번역은 자기 참조 canonical을 유지한다. 기존 주소를 바꿔야 한다면 실제 호스팅의 이동 방식과 응답을 확인한다. [canonical 지침](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- hreflang에는 실제 존재하는 언어별 정본을 적고 자기 자신·상호 링크·기본 언어의 x-default를 유지한다. HTML과 사이트맵의 주소가 일치해야 한다. 본문 번역이 없는 글에 별도의 번역 정본을 만들지 않는다. [다국어 지침](https://developers.google.com/search/docs/specialty/international/localized-versions).
- 사이트맵에는 색인할 정본만 담는다. noindex·404·중복 주소는 제외한다. lastmod를 쓴다면 실제 콘텐츠 변경 시각으로 기록한다. 배포 시각으로 일괄 갱신하지 않는다. [사이트맵 지침](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- noindex는 크롤러가 읽을 수 있어야 한다. robots.txt 차단만으로 색인 제외를 대신하지 않는다. [색인 제외 지침](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- 정적 HTML에 주요 소개·제목·canonical을 제공한다. H1은 페이지 주제를 나타내고, 링크에는 실제 href를 쓴다. 의미 있는 이미지의 alt는 본문 언어로 쓰고 장식 이미지는 빈 alt를 허용한다.
- 공유 카드는 1200×630 PNG를 사용한다. 이미지 URL·언어·대체 텍스트를 확인한다. 다국어 이미지에는 번들 글꼴을 사용하며, 새 문자가 생기면 서브셋을 갱신한다. 같은 언어의 일반 목록은 공통 사이트 카드를 사용할 수 있다.
- JSON-LD는 실제 페이지의 언어·URL·주제를 따른다. 개인은 Person, 연구소는 Organization, 글은 BlogPosting/TechArticle, 학습 콘텐츠는 Course 등 실제 역할에 맞춘다. 앱 스키마를 다른 결과물에 사용하지 않는다. 구조화 데이터 문법 통과는 리치 결과 노출 보장이 아니다. [구조화 데이터 지침](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## 검증과 배포

`npm run build`는 내보낸 결과에 대해 `seo:check`를 실행한다. 검사는 사이트맵의 정본 존재, 제목·설명·공유 정보 일치, HTML·OG 언어, hreflang 상호 연결, 페이지 스키마, 이미지 파일·크기, 정적 H1, robots와 지정된 비색인 페이지를 확인한다. 전체 본문 번역의 품질, 내용의 사실성, 검색 순위나 실제 색인은 자동 검사가 보장하지 않는다.

문구 변경 시 대표 공유 카드를 눈으로 확인한다. 배포 후 공개 URL의 상태·canonical·메타데이터·사이트맵을 확인하고, 실제 색인은 Search Console에서 확인한다. 문서만 수정할 때는 링크와 실제 구현의 일치를 확인한다.
