import {ReactNode} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";

import NicomLogo from '@Images/company_nicom.svg'
import KicLogo from '@Images/company_kic.png'
import FillaDesignLogo from '@Images/company_filladesign.png'

import KappledenImg from '@Images/og_kappleden.png'
import IlegImg from '@Images/og_ileg.png'
import BarundcImg from '@Images/og_barundc.jpg'
import Dental100yearImg from '@Images/og_100dental.jpg'
import SsjobgyImg from '@Images/og_ssjobgy.jpg'

export interface ICareerProject {
    label: string;
    url?: string;
    image?: string;
    projectId?: string;
}

export interface ICareer {
    id: string;
    name: string;
    period?: Date[];
    periodText?: string;
    link?: string;
    logo?: ReactNode | undefined;
    logoColor?: string;
    dotColor?: 'inherit' | 'grey' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined
    type?: '정규직' | '계약직' | '인턴' | '프리랜서' | string;
    company?: boolean;
    isFreelance?: boolean;
    isOngoing?: boolean;
    position: string;
    features?: string[];
    projects?: (string | ICareerProject)[];
}

const careers: ICareer[] = [
    {
        id: 'inavi',
        name: '아이나비시스템즈 (Inavi Systems)',
        company: true,
        type: '정규직',
        period: [new Date('2024.12.16'), new Date()],
        link: 'https://www.inavisystems.com/',
        dotColor: 'info',
        position: 'Lead Backend Engineer · DevOps',
        features: [
            '서버·인프라 아키텍처 단독 설계 (Owner)',
            'AWS·CI/CD 파이프라인 단독 구축',
            '내비게이션 서비스 운영 및 통합통계 시스템 신규 개발',
            '실시간 관측 체계 구축 및 장애 대응 전담',
        ],
        projects: [
            {label: '아이나비 스탬프 오르다', projectId: 'orda'},
            {label: '내비게이션 서비스 운영 & 통합통계 시스템', projectId: 'navigation-statistics'},
        ],
    },
    {
        id: 'filladesign',
        name: '필러 디자인 (FillaDesign)',
        company: true,
        isFreelance: true,
        type: '계약직, 프리랜서',
        period: [new Date('2024.02.01'), new Date('2024.02.29')],
        periodText: '단기 계약 프로젝트',
        link: 'http://www.pillardesign.co.kr/',
        dotColor: 'primary',
        logo: (<LazyLoadImage src={FillaDesignLogo} alt={"FillaDesign 로고"} title={"FillaDesign 로고"}/>),
        logoColor: '#060606',
        position: 'Core Web Publisher',
        features: [
            '그누보드5 기반 홈페이지 퍼블리싱',
            'LAMP 기반 사이트 관리',
            '반응형 레이아웃 및 크로스 브라우징'
        ],
        projects: [
            {label: '김포사과나무치과', url: 'http://kappleden.com', image: KappledenImg},
            {label: '주식회사 아이레그', url: 'http://ilegcorp.com', image: IlegImg},
            {label: '왕십리 바른치과', url: 'http://barundc.com', image: BarundcImg},
            {label: '연세 백세치과', url: 'http://100yeardental.com', image: Dental100yearImg},
            {label: '왕십리 산부인과', url: 'http://ssjobgy.com', image: SsjobgyImg},
        ],
    },
    {
        id: 'newlifemission',
        name: '새생명선교회',
        company: true,
        isFreelance: true,
        isOngoing: true,
        type: '프리랜서',
        period: [new Date('2023.11.22'), new Date()],
        dotColor: 'primary',
        position: 'Web Maintenance / Security & SEO Engineer',
        features: [
            'PHP 기반 다국어 콘텐츠 플랫폼 유지보수 (27개 언어)',
            '보안·인증·권한 체계 개선 (CSRF, 관리자 Role)',
            '개인정보 암호화 체계 정립 (키 교체 가능 구조)',
            '글로벌 SEO 구조 정리 및 운영 자동화 방향 수립'
        ],
        projects: [
            'The New Life Mission 유지보수 및 고도화 (Full Stack)',
            'NLM Book Cafe 퍼블리싱 (Publisher)'
        ],
    },
    {
        id: 'nicom',
        name: '(주) 앤로보틱스 (NRobotics)',
        company: true,
        type: '정규직',
        period: [new Date('2020.07.13'), new Date('2023.11.17')],
        link: 'https://nrobotics.co.kr/',
        dotColor: 'primary',
        logo: (<LazyLoadImage src={NicomLogo} alt={"Nicom 로고"} title={"Nicom 로고"}/>),
        logoColor: '#fff',
        position: 'Full-Stack Engineer',
        features: [
            'SDLC 전반에 걸친 10개+ 프로젝트 주도 개발',
            'ActiveMQ·Socket·WebSocket 통신 개발 경험',
            '자사 웹 서버 구축 및 솔루션 배포',
            '하이브리드 웹앱 개발 및 Play/App Store 런칭',
            'JAVA 라이브러리 개발 및 Maven 배포'
        ],
        projects: [
            {label: '스마트도서관 시스템', projectId: 'smart-library'},
            '도서 위치 추적 시스템',
            '얼굴인식 출입통제 시스템',
        ],
    },
    {
        id: 'kic',
        name: '(주) KIC Consulting',
        company: true,
        type: '인턴',
        period: [new Date('2019.09.01'), new Date('2019.12.31')],
        link: 'https://kicco.com/',
        dotColor: 'secondary',
        logo: (<LazyLoadImage src={KicLogo} alt={"KIC 로고"} title={"KIC 로고"}/>),
        logoColor: '#333',
        position: 'Atlassian 솔루션 지원',
        features: [
            'Jira, Confluence, Bitbucket, Crowd 서버 구축',
            'Linux 서버 및 포트 포워딩 환경 구성',
        ],
        projects: [
            'Atlassian ALM 아키텍처 구축 산출물',
        ],
    },
]
export default careers;
