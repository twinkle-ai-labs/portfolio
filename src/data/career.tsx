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
    contractFreelance: {ko: '프리랜서', en: 'Contract · Freelance'},
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
            {
                ko: '신규 서비스의 서버·인프라 아키텍처 전주기 단독 설계 (Owner)',
                en: 'Sole owner of the full server & infrastructure architecture lifecycle for a new service',
            },
            {
                ko: 'AWS 클라우드 토폴로지와 Jenkins·Harbor 기반 CI/CD 파이프라인 단독 구축',
                en: 'Single-handedly built the AWS topology and the Jenkins·Harbor CI/CD pipeline',
            },
            {
                ko: '내비게이션 서비스 서버 운영과 BigQuery 기반 통합통계 시스템 신규 개발 병행',
                en: 'Ran navigation service servers while building a new BigQuery-based unified statistics system',
            },
            {
                ko: 'Prometheus·Grafana 실시간 관측 체계 구축 및 장애 대응 전담',
                en: 'Built real-time observability on Prometheus·Grafana and owned incident response',
            },
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
        /* 단기 계약 건이라 개별 사이트를 나열하지 않습니다 — 규모는 features 의 "5종" 으로만 전달합니다. */
        features: [
            {
                ko: '그누보드5 기반 병원·기업 홈페이지 5종 퍼블리싱',
                en: 'Published five hospital and corporate websites on Gnuboard5',
            },
            {
                ko: 'LAMP 스택 환경에서 사이트 운영 및 유지 관리',
                en: 'Operated and maintained the sites on a LAMP stack',
            },
            {
                ko: '반응형 레이아웃 구현 및 크로스 브라우징 대응',
                en: 'Implemented responsive layouts with cross-browser support',
            },
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
            {
                ko: '27개 언어를 제공하는 PHP 다국어 콘텐츠 플랫폼 단독 유지보수',
                en: 'Sole maintainer of a PHP multilingual content platform serving 27 languages',
            },
            {
                ko: 'CSRF 방어와 관리자 Role 정비 등 보안·인증·권한 체계 개선',
                en: 'Hardened security, authentication and authorization — CSRF defense, admin role cleanup',
            },
            {
                ko: '키 교체가 가능한 구조로 개인정보 암호화 체계 정립',
                en: 'Established personal-data encryption designed around rotatable keys',
            },
            {
                ko: '글로벌 SEO 구조 정리 및 운영 자동화 방향 수립',
                en: 'Restructured global SEO and set the direction for operational automation',
            },
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
            {
                ko: '기획부터 배포까지 SDLC 전 과정을 아우르는 10개+ 프로젝트 주도',
                en: 'Led 10+ projects end to end, from planning through deployment',
            },
            {
                ko: '무인 기기 연동을 위한 ActiveMQ·Socket·WebSocket 통신 계층 개발',
                en: 'Built ActiveMQ, socket and WebSocket layers for self-service kiosk integration',
            },
            {
                ko: '자사 웹 서버 인프라 구축 및 고객사 솔루션 배포 운영',
                en: 'Set up in-house web server infrastructure and ran customer solution deployments',
            },
            {
                ko: '하이브리드 앱 개발 및 Play Store · App Store 정식 출시',
                en: 'Developed hybrid apps released officially on the Play Store and App Store',
            },
            {
                ko: '공용 Java 라이브러리 설계 및 Maven 배포 체계 운영',
                en: 'Designed shared Java libraries and ran their Maven release process',
            },
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
            {
                ko: 'Jira · Confluence · Bitbucket · Crowd 연동 서버 구축',
                en: 'Built interconnected Jira, Confluence, Bitbucket and Crowd servers',
            },
            {
                ko: 'Linux 서버 초기 구성과 포트 포워딩 네트워크 환경 구축',
                en: 'Provisioned Linux servers and configured the port-forwarding network',
            },
        ],
        projects: [
            {label: {ko: 'Atlassian ALM 아키텍처 구축 산출물', en: 'Atlassian ALM architecture deliverables'}},
        ],
    },
]
export default careers;
