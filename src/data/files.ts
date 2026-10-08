import {LocalizedText} from "@Utils/i18n";

/**
 * /files 에서 내려받을 수 있는 문서. 파일은 src/assets/sealed/<file>.enc 로 봉한 채 실리고,
 * 크기·날짜는 같은 폴더의 manifest.json 이 안다(scripts/encrypt-files.mjs 가 쓴다).
 * 여기는 사람이 읽는 이름과 설명만 든다 — 새 PDF 를 더하면 여기에도 한 줄을 더한다.
 */
export interface ISealedFile {
    id: string
    /** src/assets/pdf/ 안의 원본 이름 — 내려받을 때의 파일 이름이기도 하다 */
    file: string
    name: LocalizedText
    desc: LocalizedText
}

export const sealedFiles: ISealedFile[] = [
    {
        id: 'resume',
        file: 'jobkorea-resume.pdf',
        name: {ko: '이력서', en: 'Résumé'},
        desc: {ko: '경력 · 학력 · 자격을 한 장으로', en: 'Career, education and certificates on one page'},
    },
    {
        id: 'portfolio',
        file: 'portfolio.pdf',
        name: {ko: '포트폴리오', en: 'Portfolio'},
        desc: {ko: '주도한 프로젝트와 그 결과', en: 'Projects I led and what came of them'},
    },
    {
        id: 'portfolio-2',
        file: 'portfolio-2.pdf',
        name: {ko: '포트폴리오 II', en: 'Portfolio II'},
        desc: {ko: '두 번째 묶음', en: 'The second volume'},
    },
    {
        id: 'presentation',
        file: 'presentation.pdf',
        name: {ko: '발표 자료', en: 'Presentation'},
        desc: {ko: '소개 발표에 쓴 슬라이드', en: 'Slides from the introduction talk'},
    },
];
