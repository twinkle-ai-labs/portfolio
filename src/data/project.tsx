import {ReactNode} from "react";
import {SiAmazonaws, SiDocker, SiGrafana, SiKotlin, SiSpringboot} from "react-icons/si";
import {FaChartLine, FaDatabase, FaLayerGroup, FaMobileScreenButton} from "react-icons/fa6";

export interface IProject {
    id: string;
    title: string;
    period: string;
    role: string;
    summary: string;
    impact: string;
    stacks: string[];
    points: string[];
    details: string[];
    images?: string[];
    icon: ReactNode;
}

const projects: IProject[] = [
    {
        id: 'orda',
        title: '아이나비 스탬프 오르다',
        period: '2024.12 - 현재',
        role: 'Server Developer',
        summary: 'PM, 기획, 디자인, Android/iOS 앱, 어드민과 Scrum 방식으로 협업하며 서버 영역을 1인 개발했습니다.',
        impact: '서버 1인 개발 · 주요 로직 개발 · AWS 인프라 · CI/CD · 운영 모니터링',
        stacks: ['Kotlin', 'Spring Boot', 'AWS', 'Jenkins', 'Filebeat', 'Slack', 'Prometheus', 'Grafana'],
        points: [
            '서버 개발: 데이터 설계, API, 배치, 관리자 연동, 핵심 비즈니스 로직 담당',
            'Agile Scrum 협업: PM, 기획, 디자인, Android/iOS 앱, 어드민 등 다양한 파트와 협업하여 스프린트 단위 개발',
            'DevOps: AWS 인프라 설계와 CI/CD 배포 파이프라인 구성',
            '운영 모니터링: Filebeat와 Slack 으로 장애 알림, Prometheus와 Grafana로 리소스는 추적',
        ],
        details: [
            'PM, 기획, 디자인, 앱, 어드민 파트와 Scrum 방식으로 협업하며 서버 개발 범위를 담당했습니다.',
            '초기 MVP 런칭부터 핵심 비즈니스 로직, 관리자 연동, 운영 안정화까지 서버 영역을 1인 개발했습니다.',
            '배포 파이프라인과 운영 관측 환경을 구성해 상용 반영 이후의 장애 대응 흐름까지 연결했습니다.',
        ],
        images: [],
        icon: <SiKotlin/>,
    },
    {
        id: 'navigation-statistics',
        title: '내비게이션 통합통계 시스템',
        period: '2025.11 - 2026.05',
        role: 'Backend · Data · Infra',
        summary: '여러 내비게이션 서비스의 로그를 일·월 통계로 가공해 대시보드에 제공하는 시스템입니다.',
        impact: 'DDD 기반 수집·통계·조회 책임 분리, BigQuery·Batch·Grafana 파이프라인 구축',
        stacks: ['Java/Kotlin', 'Spring Boot', 'BigQuery', 'Batch', 'Quartz', 'Grafana', 'GCP'],
        points: [
            '수집 Context, 통계 Context, 조회 Context로 도메인 책임 분리',
            'BigQuery 일 단위 파티션과 Batch·Quartz 기반 정기 집계 구성',
            'MySQL 통계 모델과 Grafana Dashboard로 운영 지표 제공',
        ],
        details: [
            '내비게이션 서비스 로그를 수집하고 일/월 단위 통계로 가공하는 백엔드 파이프라인을 구성했습니다.',
            '도메인 책임을 수집, 통계, 조회 Context로 분리해 운영과 확장성을 고려했습니다.',
            'BigQuery, Batch, Grafana를 연결해 데이터 처리와 운영 대시보드까지 이어지는 흐름을 만들었습니다.',
        ],
        images: [],
        icon: <FaChartLine/>,
    },
    {
        id: 'smart-library',
        title: '스마트도서관',
        period: '2021.01 - 2022.06',
        role: 'Full-stack Solution',
        summary: '스마트도서관 앱, 관리자, 스케줄러·상세정보·검색 API를 통합 개발했습니다.',
        impact: '운영 프로젝트 3개에서 1개로 축소, 배포 단위 2+N에서 1개로 축소, p99 7.5s에서 93ms 개선',
        stacks: ['Java', 'Spring MVC/Boot', 'MyBatis/JPA', 'MS-SQL', 'Android', 'iOS'],
        points: [
            'Web/App, Middleware, DB로 분산된 구조를 Spring Application 중심으로 단순화',
            'RoutingDataSource 기반 DB 직접 연결 구조로 운영 복잡도 감소',
            '도서 상세 배치·API와 모바일 WebView UX 개선',
        ],
        details: [
            '스마트도서관 웹앱, 관리자, 스케줄러 API, 상세정보 Batch/API, 검색 API를 통합 개발했습니다.',
            '기존 3-tier 구조를 단순화해 유지보수 프로젝트 수와 배포 단위를 줄였습니다.',
            'RoutingDataSource 기반 다중 DB 연결로 검색 성능과 운영 효율을 개선했습니다.',
        ],
        images: [],
        icon: <FaMobileScreenButton/>,
    },
];

export const projectHighlights = [
    {label: 'Cloud / DevOps', icon: <SiAmazonaws/>},
    {label: 'Spring Backend', icon: <SiSpringboot/>},
    {label: 'Container Deploy', icon: <SiDocker/>},
    {label: 'Data Pipeline', icon: <FaDatabase/>},
    {label: 'Monitoring', icon: <SiGrafana/>},
    {label: 'Architecture', icon: <FaLayerGroup/>},
];

export default projects;
