import {ReactNode} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";

import NicomLogo from '@Images/company_nicom.svg'
import KicLogo from '@Images/company_kic.png'

import InaviContent from "@Pages/main/section/career/inavi";
import NicomContent from "@Pages/main/section/career/nicom";
import KicContent from "@Pages/main/section/career/kic";

export interface ICareer {
    id: string;
    name: string;
    period?: Date[];
    link?: string;
    logo?: ReactNode | undefined;
    logoColor?: string;
    dotColor?: 'inherit' | 'grey' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined
    type?: '정규직' | '계약직' | '인턴' | '프리랜서' | string;
    company?: boolean
    position: string;
    features?: string[];
    projects?: string[];
    content?: ReactNode | string | undefined
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
        position: 'Backend Engineer · DevOps',
        features: [
            'DB 설계부터 API 개발, 테스트 반영까지 수행',
            'AWS/GCP 인프라 구축 및 운영 환경 구성',
            'Harbor, Jenkins 기반 CI/CD 자동화',
            'Filebeat, Slack, Prometheus, Grafana 기반 운영 관측',
        ],
        projects: [
            '아이나비 스탬프 오르다',
            '내비게이션 통합통계 시스템',
        ],
        content: <InaviContent/>,
    },
    {
        id: 'nicom',
        name: '(주) 나이콤 (NICOM)',
        company: true,
        type: '정규직',
        period: [new Date('2020.07.13'), new Date('2023.11.17')],
        link: 'http://enicom.co.kr/',
        dotColor: 'primary',
        logo: (<LazyLoadImage src={NicomLogo} alt={"Nicom 로고"} title={"Nicom 로고"}/>),
        logoColor: '#fff',
        position: '웹 솔루션 개발',
        features: [
            '10개+ 프로젝트에서 요구사항 분석부터 개발, 배포까지 수행',
            '관리자 솔루션 중심의 풀스택 개발',
            'API, Batch, 하이브리드 웹앱, 미들웨어 개발',
        ],
        projects: [
            '스마트도서관 시스템',
            '도서 위치 추적 시스템',
            '얼굴인식 출입통제 시스템',
        ],
        content: <NicomContent/>,
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
            'Atlassian 기반 ALM 아키텍처와 Linux 서버 환경 경험',
        ],
        projects: [
            'Atlassian ALM 아키텍처 구축 산출물',
        ],
        content: <KicContent />,
    },
]
export default careers;
