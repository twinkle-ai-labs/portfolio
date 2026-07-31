import {ReactNode} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {LocalizedText} from "@Utils/i18n";

import NicomLogo from '@Images/company_nicom.svg'
import KicLogo from '@Images/company_kic.png'
import FillaDesignLogo from '@Images/company_filladesign.png'

import OrdaLogo from '@Images/project_orda.png'
import NaviStatsLogo from '@Images/logo_inavi.png'
import SmartLibraryLogo from '@Images/project_smart_library.png'

import NlmImg from '@Images/og_nlm.png'
import KappledenImg from '@Images/og_kappleden.png'
import IlegImg from '@Images/og_ileg.png'
import BarundcImg from '@Images/og_barundc.jpg'
import Dental100yearImg from '@Images/og_100dental.jpg'
import SsjobgyImg from '@Images/og_ssjobgy.jpg'

export interface ICareerProject {
    label: LocalizedText;
    /** 외부 사이트로 나가는 링크 */
    url?: string;
    /** 썸네일 이미지. 생략하면 project_default.svg 가 대신 들어갑니다. */
    image?: string;
    /** Projects 섹션의 해당 카드로 이동 */
    projectId?: string;
}

export interface ICareer {
    id: string;
    name: LocalizedText;
    period?: Date[];
    periodText?: LocalizedText;
    link?: string;
    logo?: ReactNode | undefined;
    logoColor?: string;
    dotColor?: 'inherit' | 'grey' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined
    type?: LocalizedText;
    company?: boolean;
    isFreelance?: boolean;
    isOngoing?: boolean;
    position: LocalizedText;
    features?: LocalizedText[];
    projects?: ICareerProject[];
}

const EmploymentType = {
    fullTime: {ko: '정규직', en: 'Full-time'},
    contractFreelance: {ko: '계약직, 프리랜서', en: 'Contract · Freelance'},
    freelance: {ko: '프리랜서', en: 'Freelance'},
    intern: {ko: '인턴', en: 'Internship'},
};

const careers: ICareer[] = [
    {
        id: 'inavi',
        name: {ko: '아이나비시스템즈 (Inavi Systems)', en: 'INAVI Systems'},
        company: true,
        type: EmploymentType.fullTime,
        period: [new Date('2024.12.16'), new Date()],
        link: 'https://www.inavisystems.com/',
        dotColor: 'info',
        position: {ko: 'Lead Backend Engineer · DevOps', en: 'Lead Backend Engineer · DevOps'},
        features: [
            {ko: '서버·인프라 아키텍처 단독 설계 (Owner)', en: 'Sole owner of server & infrastructure architecture'},
            {ko: 'AWS·CI/CD 파이프라인 단독 구축', en: 'Built the AWS and CI/CD pipeline single-handedly'},
            {ko: '내비게이션 서비스 운영 및 통합통계 시스템 신규 개발', en: 'Operated navigation services and built a new unified statistics system'},
            {ko: '실시간 관측 체계 구축 및 장애 대응 전담', en: 'Established real-time observability and owned incident response'},
        ],
        projects: [
            {label: {ko: '아이나비 스탬프 오르다', en: 'INAVI Stamp ORDA'}, projectId: 'orda', image: OrdaLogo},
            {
                label: {ko: '내비게이션 서비스 운영 & 통합통계 시스템', en: 'Navigation service operations & unified statistics system'},
                projectId: 'navigation-statistics',
                image: NaviStatsLogo,
            },
        ],
    },
    {
        id: 'filladesign',
        name: {ko: '필러 디자인 (FillaDesign)', en: 'FillaDesign'},
        company: true,
        isFreelance: true,
        type: EmploymentType.contractFreelance,
        period: [new Date('2024.02.01'), new Date('2024.02.29')],
        periodText: {ko: '단기 계약 프로젝트', en: 'Short-term contract'},
        link: 'http://www.pillardesign.co.kr/',
        dotColor: 'primary',
        logo: (<LazyLoadImage src={FillaDesignLogo} alt={"FillaDesign"} title={"FillaDesign"}/>),
        logoColor: '#060606',
        position: {ko: 'Core Web Publisher', en: 'Core Web Publisher'},
        features: [
            {ko: '그누보드5 기반 홈페이지 퍼블리싱', en: 'Website publishing on Gnuboard5'},
            {ko: 'LAMP 기반 사이트 관리', en: 'LAMP-based site maintenance'},
            {ko: '반응형 레이아웃 및 크로스 브라우징', en: 'Responsive layouts and cross-browser support'},
        ],
        projects: [
            {label: {ko: '김포사과나무치과', en: 'Gimpo Appletree Dental'}, url: 'http://kappleden.com', image: KappledenImg},
            {label: {ko: '주식회사 아이레그', en: 'ILEG Corp.'}, url: 'http://ilegcorp.com', image: IlegImg},
            {label: {ko: '왕십리 바른치과', en: 'Wangsimni Barun Dental'}, url: 'http://barundc.com', image: BarundcImg},
            {label: {ko: '연세 백세치과', en: 'Yonsei Baekse Dental'}, url: 'http://100yeardental.com', image: Dental100yearImg},
            {label: {ko: '왕십리 산부인과', en: "Wangsimni OB/GYN"}, url: 'http://ssjobgy.com', image: SsjobgyImg},
        ],
    },
    {
        id: 'newlifemission',
        name: {ko: '새생명선교회', en: 'The New Life Mission'},
        company: true,
        isFreelance: true,
        isOngoing: true,
        type: EmploymentType.freelance,
        period: [new Date('2023.11.22'), new Date()],
        dotColor: 'primary',
        position: {ko: 'Web Maintenance / Security & SEO Engineer', en: 'Web Maintenance / Security & SEO Engineer'},
        features: [
            {ko: 'PHP 기반 다국어 콘텐츠 플랫폼 유지보수 (27개 언어)', en: 'Maintained a PHP multilingual content platform (27 languages)'},
            {ko: '보안·인증·권한 체계 개선 (CSRF, 관리자 Role)', en: 'Improved security, authentication and authorization (CSRF, admin roles)'},
            {ko: '개인정보 암호화 체계 정립 (키 교체 가능 구조)', en: 'Established personal-data encryption with a key-rotatable design'},
            {ko: '글로벌 SEO 구조 정리 및 운영 자동화 방향 수립', en: 'Restructured global SEO and set the direction for operational automation'},
        ],
        projects: [
            {
                label: {ko: '새생명선교회 메인사이트', en: 'The New Life Mission'},
                url: 'https://bjnewlife.org/en/',
                image: NlmImg,
            },
            {
                label: {ko: '새생명선교회 북카페', en: 'The NLM Book Cafe'},
                url: 'https://www.nlmbookcafe.com/en/',
                image: NlmImg,
            },
        ],
    },
    {
        id: 'nicom',
        name: {ko: '(주) 앤로보틱스 (NRobotics)', en: 'NRobotics'},
        company: true,
        type: EmploymentType.fullTime,
        period: [new Date('2020.07.13'), new Date('2023.11.17')],
        link: 'https://nrobotics.co.kr/',
        dotColor: 'primary',
        logo: (<LazyLoadImage src={NicomLogo} alt={"NRobotics"} title={"NRobotics"}/>),
        logoColor: '#fff',
        position: {ko: 'Full-Stack Engineer', en: 'Full-Stack Engineer'},
        features: [
            {ko: 'SDLC 전반에 걸친 10개+ 프로젝트 주도 개발', en: 'Led 10+ projects across the full SDLC'},
            {ko: 'ActiveMQ·Socket·WebSocket 통신 개발 경험', en: 'Built ActiveMQ, socket and WebSocket communication layers'},
            {ko: '자사 웹 서버 구축 및 솔루션 배포', en: 'Set up in-house web servers and deployed solutions'},
            {ko: '하이브리드 웹앱 개발 및 Play/App Store 런칭', en: 'Developed hybrid web apps and launched on Play/App Store'},
            {ko: 'JAVA 라이브러리 개발 및 Maven 배포', en: 'Developed Java libraries and published via Maven'},
        ],
        projects: [
            {
                label: {ko: '스마트도서관 시스템', en: 'Smart Library system'},
                projectId: 'smart-library',
                image: SmartLibraryLogo,
            },
            {label: {ko: '도서 위치 추적 시스템', en: 'Book location tracking system'}},
            {label: {ko: '얼굴인식 출입통제 시스템', en: 'Face recognition access control system'}},
        ],
    },
    {
        id: 'kic',
        name: {ko: '(주) KIC Consulting', en: 'KIC Consulting'},
        company: true,
        type: EmploymentType.intern,
        period: [new Date('2019.09.01'), new Date('2019.12.31')],
        link: 'https://kicco.com/',
        dotColor: 'secondary',
        logo: (<LazyLoadImage src={KicLogo} alt={"KIC Consulting"} title={"KIC Consulting"}/>),
        logoColor: '#333',
        position: {ko: 'Atlassian 솔루션 지원', en: 'Atlassian Solutions Support'},
        features: [
            {ko: 'Jira, Confluence, Bitbucket, Crowd 서버 구축', en: 'Set up Jira, Confluence, Bitbucket and Crowd servers'},
            {ko: 'Linux 서버 및 포트 포워딩 환경 구성', en: 'Configured Linux servers and port forwarding'},
        ],
        projects: [
            {label: {ko: 'Atlassian ALM 아키텍처 구축 산출물', en: 'Atlassian ALM architecture deliverables'}},
        ],
    },
]
export default careers;
