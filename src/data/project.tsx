import {ReactNode} from "react";
import {SiDocker, SiGrafana, SiKotlin, SiSpringboot} from "react-icons/si";
import {FaAws, FaChartLine, FaDatabase, FaLayerGroup, FaMobileScreenButton} from "react-icons/fa6";

import OrdaContent from "@Pages/main/section/project/orda";
import NavigationStatisticsContent from "@Pages/main/section/project/navigation";
import SmartLibraryContent from "@Pages/main/section/project/smartlibrary";

export interface IProjectDetailSection {
    title: string;
    messages: string[];
    image?: string;
    images?: string[];
    imageAlt?: string;
    layoutType?: 'wide' | 'narrow';
}

export interface IProject {
    id: string;
    title: string;
    period: string;
    role: string;
    summary: string;
    impact: string[];
    features: string[]; // Decoupled concise highlights for main page card list
    stacks: string[];
    points: string[];
    details: string[];
    detailSections?: IProjectDetailSection[];
    artilleryImage?: string;
    artilleryImageAlt?: string;
    images?: string[];
    icon: ReactNode;
    visualType?: 'title-left' | 'side-wide' | 'top-wide';
    content?: ReactNode;
}

const projects: IProject[] = [
    {
        id: 'orda',
        title: '아이나비 스탬프 오르다',
        period: '2024.12 - 현재',
        role: 'Lead Server Developer',
        summary: '크로스 도메인 협업 속에서 클라우드 네이티브 서버 아키텍처 및 전용 인프라의 전주기를 단독 설계하고 구축했습니다.',
        impact: [
            '서버 아키텍처 단독 설계 및 핵심 비즈니스 도메인 수립 완료',
            '안정적이고 확장 가능한 AWS 클라우드 인프라 토폴로지 설계',
            'Jenkins, Harbor 기반의 빌드/배포 파이프라인 자동화 구현',
            'Filebeat 및 Prometheus/Grafana 기반 실시간 장애 선제 관측 체계 구축'
        ],
        features: [
            'AWS Cloud 및 인프라 아키텍처링 단독 전담',
            'Kotlin / Spring Boot 기반 고성능 서버 구축',
            'Docker, Harbor, Jenkins CI/CD 자동화 수립',
            'Filebeat / Prometheus / Grafana 실시간 장애 관측'
        ],
        stacks: ['Kotlin', 'Spring Boot', 'AWS', 'Jenkins', 'Filebeat', 'Slack', 'Prometheus', 'Grafana'],
        points: [
            '서버 및 인프라 아키텍처링 단독 설계 및 구축 (Kotlin/Spring, AWS)',
            'Scrum 방식 교차 협업 주도 (기획 · 디자인 · 모바일 · 어드민 등)',
            'Docker, Harbor, Jenkins 기반 지속적 빌드 및 배포 자동화',
            'Filebeat 로그 추적 및 Prometheus/Grafana 기반 실시간 자원 모니터링'
        ],
        details: [
            '기획 및 디자인 단계를 명확한 구조로 해석하여 인프라 및 서버 설계 전주기를 주도했습니다.',
            '초기 MVP 런칭부터 성능 안정화 단계에 이르기까지 비즈니스의 성장 속도에 맞춰 인프라 구조를 단순화하고 우아하게 유지했습니다.',
            '지속 가능한 모니터링 환경을 설계하여 시스템 상용 릴리즈 이후 선제적인 리스크 관리가 가능한 생태계를 구현했습니다.',
        ],
        images: [],
        icon: <SiKotlin/>,
        content: <OrdaContent/>,
    },
    {
        id: 'navigation-statistics',
        title: '내비게이션 통합통계 대시보드 시스템',
        period: '2025.11 - 2026.05',
        role: 'Data & Server Architect',
        summary: '다수의 내비게이션 서비스에서 인입되는 방대한 사용자 로그를 수집·정제하여 대시보드에 안정적으로 통계 지표를 공급하는 고성능 데이터 파이프라인입니다.',
        impact: [
            '도메인 수집·정기 배치·사용자 조회 맥락 격리 (DDD 설계)',
            'BigQuery 일 단위 파티션 설계 및 Quartz 기반 정기 배치 자동화',
            'MySQL 통계 적재 엔진 및 Grafana 실시간 분석 대시보드 시각화 연동'
        ],
        features: [
            'GCP BigQuery 기반 일 단위 대량 로그 수집 파이프라인',
            'Spring Batch / Quartz 기반 통계 배치 정밀 자동화',
            'MySQL 통계 적재 엔진 및 Grafana 실시간 분석 대시보드'
        ],
        stacks: ['Java/Kotlin', 'Spring Boot', 'BigQuery', 'Batch', 'Quartz', 'Grafana', 'GCP'],
        points: [
            '도메인 분리(DDD): 수집 Context, 정기 배치 Context, 사용자 조회 Context 분리',
            'BigQuery 일 단위 파티션 아키텍처 설계와 Batch 및 Quartz 기반 정기 스케줄 수집 정제 구축',
            'MySQL 통계 적재 엔진 구현 및 Grafana Dashboard 실시간 모니터링 시각화 연동'
        ],
        details: [
            '다원화된 내비게이션 서비스의 대량 로그를 유실 없이 수집하고 일/월 단위 분석 데이터로 정제하는 백엔드 프로세스를 이끌었습니다.',
            '도메인 간 높은 응집도와 낮은 결합도를 지향해 유지보수의 품격을 한 단계 높였습니다.',
            'GCP 클라우드 내 BigQuery, Batch, Grafana를 연결하여 원시 데이터 유입부터 경영 지표 표출까지 하나의 선으로 연결된 아름다운 파이프라인을 실현했습니다.',
        ],
        images: [],
        icon: <FaChartLine/>,
        content: <NavigationStatisticsContent/>,
    },
    {
        id: 'smart-library',
        title: '스마트도서관 시스템 고도화',
        period: '2021.01 - 2022.06',
        role: 'Full-stack Solution Architect',
        summary: '무인 도서 대출·반납 기기, 중앙 서버, 관리자 도구, 모바일 앱을 하나의 운영 플랫폼으로 연결하고 서비스 전반의 검색·동기화·이용자 경험을 고도화했습니다.',
        impact: [
            '무인 대출·반납 기기와 중앙 서버를 연결하는 스마트도서관 운영 플랫폼 고도화',
            '도서 검색, 실시간 동기화, 외부 도서 API 연계를 하나의 서비스 흐름으로 통합',
            '관리자 운영 도구와 모바일 하이브리드 앱을 개선해 현장 운영성과 사용자 접근성 강화'
        ],
        features: [
            '무인 도서 대출·반납 서비스 운영 플랫폼 통합',
            '기기 데이터 동기화 및 외부 도서 정보 연계 구조 고도화',
            '관리자 프로그램과 모바일 앱 중심의 운영·사용자 경험 개선'
        ],
        stacks: ['Java', 'Spring MVC/Boot', 'MyBatis/JPA', 'MS-SQL', 'Android', 'iOS'],
        points: [
            '자체 서비스 개발: Play Store 및 App Store에 자체 앱 출시',
            '도서 조회 화면 동선 대폭 축소 및 간소화 (기존 4 ➔ 2 단계)',
            '파편화된 인기도서 메뉴를 지능형 인기/연관 도서 추천 엔진으로 결합',
            '웹뷰 흰 화면(White-screen) 제거 스플래시 싱크 및 모바일 제스처 브릿지 연동',
            'Node.js, Angular, Go 등의 파편화된 레거시 스택을 Java/Spring 기반 표준 아키텍처로 통합'
        ],
        details: [],
        detailSections: [],
        images: [],
        icon: <FaMobileScreenButton/>,
        visualType: 'title-left',
        content: <SmartLibraryContent/>,
    },
];

export const projectHighlights = [
    {label: 'Cloud / DevOps', icon: <FaAws/>},
    {label: 'Spring Backend', icon: <SiSpringboot/>},
    {label: 'Container Deploy', icon: <SiDocker/>},
    {label: 'Data Pipeline', icon: <FaDatabase/>},
    {label: 'Monitoring', icon: <SiGrafana/>},
    {label: 'Architecture', icon: <FaLayerGroup/>},
];

export default projects;
