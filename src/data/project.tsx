import {ReactNode} from "react";
import {SiDocker, SiGrafana, SiKotlin, SiSpringboot} from "react-icons/si";
import {
    FaAws,
    FaChartLine,
    FaCloud,
    FaDatabase,
    FaDiagramProject,
    FaGaugeHigh,
    FaLayerGroup,
    FaMapLocationDot,
    FaMobileScreenButton,
    FaRocket,
    FaTableColumns,
    FaTowerObservation,
    FaUsers,
} from "react-icons/fa6";

import {
    AwsTopologyDiagram,
    CicdPipelineDiagram,
    DomainContextDiagram,
    ObservabilityDiagram,
    OperationScopeDiagram,
    SmartLibraryTopologyDiagram,
    StatisticsPipelineDiagram,
} from "@Components/project/diagram";
import {LocalizedText} from "@Utils/i18n";

import SmartLibraryDeviceImg from '@Images/smart_library.png';
import SmartLibraryAppImg from '@Images/smart_library_app.png';
import SmartLibrarySearchImg from '@Images/smart_library_search.png';
import SmartLibraryArchitectureImg from '@Images/smart_library_architecture.png';
import SmartLibrarySearchBeforeImg from '@Images/smart_library_search_before.png';
import SmartLibrarySearchAfterImg from '@Images/smart_library_search_after.png';
import SmartLibraryArtilleryBeforeImg from '@Images/smart_library_search_artillery_before.png';
import SmartLibraryArtilleryAfterImg from '@Images/smart_library_search_artillery_after.png';

/* ==========================================================================
   블록 모델 — 모든 프로젝트가 동일한 렌더링 경로를 타도록 정의합니다.
   사용자에게 보이는 문자열은 전부 LocalizedText({ko, en}) 입니다.
   ========================================================================== */

/** 이미지 또는 직접 그린 다이어그램 컴포넌트를 함께 담는 미디어 단위. */
export interface IProjectMedia {
    /** 실제 스크린샷이 있을 때 사용합니다. */
    src?: string;
    /** 스크린샷이 없어 다이어그램으로 생성한 경우 사용합니다. */
    node?: ReactNode;
    alt: LocalizedText;
    caption?: LocalizedText;
    /** plain: 여백만, card: 카드 배경, light: 밝은 배경이 필요한 도식/스크린샷 */
    frame?: 'plain' | 'card' | 'light';
    size?: 'sm' | 'md' | 'lg' | 'full';
}

export interface IProjectBullet {
    text: LocalizedText;
    children?: LocalizedText[];
}

export interface IProjectStep {
    title: LocalizedText;
    desc: LocalizedText;
}

export interface IProjectMetric {
    /** 숫자만 있는 값은 번역이 필요 없어 문자열도 허용합니다. */
    value: LocalizedText | string;
    label: LocalizedText;
    /** 변화량을 보여줄 때 (예: 7.5s → 93ms) */
    delta?: LocalizedText | string;
}

export type ProjectBlock =
    | { kind: 'bullets'; items: IProjectBullet[] }
    | { kind: 'flow'; label?: LocalizedText; steps: IProjectStep[] }
    | {
    kind: 'star';
    steps: { step: 'S' | 'T' | 'A' | 'R'; label: string; items: IProjectBullet[]; media?: IProjectMedia }[]
}
    | { kind: 'media'; media: IProjectMedia }
    | {
    kind: 'compare';
    label?: LocalizedText;
    before: { label: string; media: IProjectMedia };
    after: { label: string; media: IProjectMedia };
}
    | { kind: 'metrics'; label?: LocalizedText; items: IProjectMetric[] }
    | { kind: 'note'; title: LocalizedText; desc: LocalizedText };

export interface IProjectChapter {
    id: string;
    /** 상단 탭에 노출되는 짧은 라벨 */
    label: LocalizedText;
    title: LocalizedText;
    icon?: ReactNode;
    lead?: LocalizedText;
    blocks: ProjectBlock[];
    /** 우측 고정 열에 붙는 보조 블록 (없으면 단일 열) */
    aside?: ProjectBlock[];
}

export interface IProject {
    id: string;
    title: LocalizedText;
    period: LocalizedText;
    role: LocalizedText;
    summary: LocalizedText;
    /** 모달 헤더의 요약 지표 */
    metrics: IProjectMetric[];
    impact: LocalizedText[];
    /** 메인 카드용 짧은 하이라이트 */
    features: LocalizedText[];
    /** 기술명은 고유명사라 번역하지 않습니다. */
    stacks: string[];
    icon: ReactNode;
    /** 모달 헤더 우측에 놓이는 대표 이미지 (있는 경우) */
    thumbnail?: IProjectMedia;
    chapters: IProjectChapter[];
}

/* ==========================================================================
   프로젝트 데이터
   ========================================================================== */

const projects: IProject[] = [
    {
        id: 'orda',
        title: {ko: '아이나비 스탬프 오르다', en: 'INAVI Stamp ORDA'},
        period: {ko: '2024.12 - 현재', en: '2024.12 - Present'},
        role: {ko: 'Lead Server Developer', en: 'Lead Server Developer'},
        summary: {
            ko: '크로스 도메인 협업 속에서 클라우드 네이티브 서버 아키텍처 및 전용 인프라의 전주기를 단독 설계하고 구축했습니다.',
            en: 'Working across domains, I single-handedly designed and built the full lifecycle of a cloud-native server architecture and its dedicated infrastructure.',
        },
        metrics: [
            {value: '70K+', label: {ko: '서비스 회원', en: 'Registered members'}},
            {value: '25', label: {ko: '운영 투어 · 미션', en: 'Tours & missions run'}},
            {value: '9', label: {ko: '주최 기관 · 지자체', en: 'Partner organizations'}},
            {value: '100%', label: {ko: '서버·인프라 단독 설계', en: 'Solo-owned architecture'}},
        ],
        impact: [
            {
                ko: '서버 아키텍처 단독 설계 및 핵심 비즈니스 도메인 수립 완료',
                en: 'Designed the server architecture alone and established the core business domain',
            },
            {
                ko: 'EC2, RDS, S3, ALB, Route53, Lambda 등 AWS 클라우드 인프라 토폴로지 설계',
                en: 'Designed the AWS topology across EC2, RDS, S3, ALB, Route 53 and Lambda',
            },
            {
                ko: 'Jenkins, Harbor 기반의 빌드/배포 파이프라인 자동화 구현',
                en: 'Automated the build and deployment pipeline with Jenkins and Harbor',
            },
            {
                ko: 'Filebeat 및 Prometheus/Grafana 기반 실시간 장애 선제 관측 체계 구축',
                en: 'Built proactive real-time observability with Filebeat and Prometheus/Grafana',
            },
            {
                ko: '회원 약 7만 명 규모 서비스 운영 · 지자체 및 공공기관 투어 25건 운영',
                en: 'Operated a service of ~70K members and ran 25 tours for municipalities and public agencies',
            },
        ],
        features: [
            {ko: 'AWS Cloud 및 인프라 아키텍처링 단독 전담', en: 'Sole owner of AWS cloud and infrastructure architecture'},
            {ko: 'Kotlin / Spring Boot 기반 고성능 서버 구축', en: 'High-performance server built on Kotlin / Spring Boot'},
            {ko: 'Docker, Harbor, Jenkins CI/CD 자동화 수립', en: 'CI/CD automation with Docker, Harbor and Jenkins'},
            {ko: 'Filebeat / Prometheus / Grafana 실시간 장애 관측', en: 'Real-time incident observability via Filebeat / Prometheus / Grafana'},
        ],
        stacks: ['Kotlin', 'Spring Boot', 'AWS', 'Jenkins', 'Filebeat', 'Slack', 'Prometheus', 'Grafana'],
        icon: <SiKotlin/>,
        chapters: [
            {
                id: 'overview',
                label: {ko: '개요', en: 'Overview'},
                title: {ko: '프로젝트 개요와 담당 범위', en: 'Project overview and my scope'},
                icon: <FaRocket/>,
                lead: {
                    ko: '기획·디자인·모바일·어드민이 동시에 움직이는 환경에서 서버와 인프라를 혼자 책임졌습니다.',
                    en: 'With planning, design, mobile and admin teams all moving at once, I owned the server and infrastructure alone.',
                },
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '스탬프 투어 서비스의 서버 도메인 단독 설계', en: 'Solo design of the stamp tour service domain'},
                                children: [
                                    {
                                        ko: '스탬프 적립·인증·리워드 등 핵심 비즈니스 도메인 모델링',
                                        en: 'Modeled core domains: stamp collection, verification and rewards',
                                    },
                                    {
                                        ko: '공공기관·지자체 투어와 챌린지 운영을 담을 수 있는 확장 구조 수립',
                                        en: 'Built an extensible structure for public agency and municipal tours and challenges',
                                    },
                                ],
                            },
                            {
                                text: {ko: '인프라 전주기 소유 (Owner)', en: 'Owned the full infrastructure lifecycle'},
                                children: [
                                    {ko: '계정·네트워크 설계부터 배포·모니터링까지 단독 구축', en: 'Built everything from account and network design through deployment and monitoring'},
                                    {ko: '초기 MVP 구성에서 성능 안정화 단계까지 단계적으로 확장', en: 'Scaled progressively from the initial MVP to performance stabilization'},
                                ],
                            },
                            {
                                text: {ko: '크로스 도메인 협업 주도', en: 'Led cross-domain collaboration'},
                                children: [
                                    {
                                        ko: 'Scrum 기반으로 기획·디자인·모바일·어드민 요구사항을 API 계약으로 정리',
                                        en: 'Turned requirements from planning, design, mobile and admin into API contracts under Scrum',
                                    },
                                    {ko: '릴리즈 일정에 맞춘 서버 스펙 확정 및 연동 이슈 조율', en: 'Locked server specs to the release schedule and resolved integration issues'},
                                ],
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'metrics',
                        label: {ko: '운영 지표', en: 'Operating figures'},
                        items: [
                            {value: '70K+', label: {ko: '누적 회원', en: 'Cumulative members'}},
                            {value: {ko: '2024.12~', en: 'Since 2024.12'}, label: {ko: '운영 지속', en: 'Still in operation'}},
                        ],
                    },
                    {
                        kind: 'note',
                        title: {ko: '왜 단독 설계였나', en: 'Why I designed it alone'},
                        desc: {
                            ko: '서버 인력이 없던 신규 프로덕트라 아키텍처 결정부터 운영 대응까지 한 사람이 끝까지 책임지는 구조가 필요했습니다.',
                            en: 'It was a new product with no server staff, so one person had to carry it from architecture decisions through day-to-day operations.',
                        },
                    },
                ],
            },
            {
                id: 'infra',
                label: {ko: '인프라', en: 'Infra'},
                title: {ko: 'AWS 클라우드 인프라 토폴로지', en: 'AWS cloud infrastructure topology'},
                icon: <FaCloud/>,
                lead: {
                    ko: '비즈니스 성장 속도에 맞춰 단순하게 유지할 수 있는 최소 구성으로 설계했습니다.',
                    en: 'I designed the smallest configuration that could stay simple as the business grew.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <AwsTopologyDiagram/>,
                            alt: {ko: 'AWS 기반 오르다 인프라 토폴로지 다이어그램', en: 'Diagram of the ORDA infrastructure topology on AWS'},
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: 'Edge — 도메인과 트래픽 진입 정리', en: 'Edge — organizing domains and traffic entry'},
                                children: [
                                    {ko: 'Route 53으로 서비스 도메인과 환경별 레코드 관리', en: 'Managed service domains and per-environment records in Route 53'},
                                    {ko: 'ALB에서 HTTPS 종단 처리 및 헬스체크 기반 라우팅', en: 'Terminated HTTPS at the ALB and routed on health checks'},
                                ],
                            },
                            {
                                text: {ko: 'Application — 컨테이너 기반 API 계층', en: 'Application — a container-based API layer'},
                                children: [
                                    {ko: 'EC2 위 Docker 런타임으로 Kotlin/Spring Boot API 구동', en: 'Ran the Kotlin/Spring Boot API on a Docker runtime on EC2'},
                                    {ko: '이미지 리사이징 등 비동기 후처리는 Lambda로 분리', en: 'Split async post-processing such as image resizing into Lambda'},
                                ],
                            },
                            {
                                text: {ko: 'Data — 영속 계층과 정적 자산 분리', en: 'Data — separating persistence from static assets'},
                                children: [
                                    {ko: 'RDS에 트랜잭션 데이터, S3에 스탬프·이미지 자산 적재', en: 'Transactional data in RDS, stamp and image assets in S3'},
                                    {ko: '백업·스냅샷 주기를 운영 기준에 맞춰 정의', en: 'Set backup and snapshot cadence against operational requirements'},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'cicd',
                label: {ko: '배포', en: 'Delivery'},
                title: {ko: '빌드 · 배포 파이프라인 자동화', en: 'Build and deployment pipeline automation'},
                icon: <SiDocker/>,
                lead: {
                    ko: '수동 배포를 없애고 커밋에서 배포까지 하나의 흐름으로 이어지도록 만들었습니다.',
                    en: 'I eliminated manual deploys and connected commit to release as a single flow.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <CicdPipelineDiagram/>,
                            alt: {ko: 'Jenkins와 Harbor 기반 배포 파이프라인 다이어그램', en: 'Diagram of the Jenkins and Harbor deployment pipeline'},
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: 'Jenkins 기반 빌드 자동화', en: 'Build automation on Jenkins'},
                                children: [
                                    {ko: '브랜치 전략에 맞춘 자동 빌드·테스트 트리거 구성', en: 'Wired automatic build and test triggers to the branch strategy'},
                                    {ko: '환경별(dev/prod) 파라미터 분리로 잘못된 배포 차단', en: 'Separated dev/prod parameters to block mistaken deployments'},
                                ],
                            },
                            {
                                text: {ko: 'Harbor 사설 레지스트리 운영', en: 'Running a private Harbor registry'},
                                children: [
                                    {ko: '이미지 태깅 규칙을 정해 롤백 지점을 명확히 확보', en: 'Defined image tagging rules so rollback points stay unambiguous'},
                                    {ko: '외부 레지스트리 의존 없이 내부에서 이미지 수명 관리', en: 'Managed image lifecycle in-house without external registry dependencies'},
                                ],
                            },
                            {
                                text: {ko: '배포 리스크 축소', en: 'Reducing deployment risk'},
                                children: [
                                    {ko: '헬스체크 통과 후 트래픽을 넘기는 무중단 롤아웃 적용', en: 'Adopted zero-downtime rollout that shifts traffic only after health checks pass'},
                                    {ko: '배포 결과를 Slack으로 통보해 실패를 즉시 인지', en: 'Reported deployment results to Slack so failures surface immediately'},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'observability',
                label: {ko: '관측', en: 'Observability'},
                title: {ko: '장애 선제 대응을 위한 관측 체계', en: 'Observability built for proactive incident response'},
                icon: <FaTowerObservation/>,
                lead: {
                    ko: '상용 릴리즈 이후 문제가 커지기 전에 발견할 수 있는 생태계를 목표로 했습니다.',
                    en: 'After the production release, the goal was an environment that catches problems before they grow.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <ObservabilityDiagram/>,
                            alt: {
                                ko: 'Filebeat, Prometheus, Grafana 기반 관측 체계 다이어그램',
                                en: 'Diagram of the observability stack on Filebeat, Prometheus and Grafana',
                            },
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '로그와 메트릭을 분리해 수집', en: 'Collecting logs and metrics separately'},
                                children: [
                                    {ko: 'Filebeat로 애플리케이션 로그를 수집해 장애 원인 추적 경로 확보', en: 'Shipped application logs with Filebeat to keep a root-cause trail'},
                                    {ko: 'Exporter로 CPU·메모리·디스크 등 시스템 자원 메트릭 수집', en: 'Collected CPU, memory and disk metrics through exporters'},
                                ],
                            },
                            {
                                text: {ko: '임계치 기반 선제 알림', en: 'Threshold-based proactive alerting'},
                                children: [
                                    {ko: 'Prometheus 알림 룰로 위험 구간을 사전에 정의', en: 'Defined danger zones up front as Prometheus alert rules'},
                                    {ko: 'Slack 채널 연동으로 담당자가 즉시 인지하도록 구성', en: 'Routed alerts to Slack so the on-call engineer knows right away'},
                                ],
                            },
                            {
                                text: {ko: 'Grafana 대시보드 상시 운영', en: 'Always-on Grafana dashboards'},
                                children: [
                                    {ko: '서비스 지표와 자원 지표를 한 화면에서 확인', en: 'Service and resource metrics visible on one screen'},
                                    {ko: '릴리즈 전후 비교가 가능한 패널 구성으로 회귀 감지', en: 'Panels that compare before and after a release to catch regressions'},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'operation',
                label: {ko: '운영', en: 'Operations'},
                title: {ko: '투어 · 미션 운영 현황', en: 'Tour and mission operations'},
                icon: <FaMapLocationDot/>,
                lead: {
                    ko: '지자체·공공기관·민간이 각자 다른 규칙으로 여는 투어를 하나의 서버 구조 위에서 운영했습니다.',
                    en: 'Municipalities, public agencies and private partners each open tours with their own rules — all running on one server structure.',
                },
                blocks: [
                    {
                        kind: 'metrics',
                        label: {ko: '운영 현황', en: 'Operations at a glance'},
                        items: [
                            {value: '25', label: {ko: '운영 투어 · 미션', en: 'Tours & missions'}},
                            {value: '9', label: {ko: '주최 기관', en: 'Partner organizations'}},
                            {value: '5', label: {ko: '광역 지자체 권역', en: 'Metropolitan regions'}},
                        ],
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '지자체 · 공공기관 투어', en: 'Municipal and public agency tours'},
                                children: [
                                    {ko: '경기관광공사 평화누리길·평화누리 자전거길, 경기둘레길 스탬프투어', en: 'Gyeonggi Tourism Organization: Peace Nuri trail, Peace Nuri bike route and Gyeonggi Dulle-gil stamp tours'},
                                    {ko: '경기도 이천시 도자기 축제, 쌀문화축제, 설봉 둘레길 등 다수 운영', en: 'Icheon: ceramics festival, rice culture festival and Seolbong trail challenges'},
                                    {ko: '경상남도 양산시 낙동강 자전거길·힐링걷기, 국립세종수목원 정원 투어', en: 'Yangsan Nakdong River routes and the Sejong National Arboretum garden tour'},
                                ],
                            },
                            {
                                text: {ko: '화성시 "쓰리 Go" 챌린지 정기 운영', en: 'Recurring "Three GO" challenge for Hwaseong City'},
                                children: [
                                    {ko: '화성시 체육회와 월 단위 스포츠DAY 미션을 연속 개설', en: 'Ran monthly Sports DAY missions with the Hwaseong City Sports Council'},
                                    {ko: '만보기·자전거·등산 세 가지 운동 유형과 지역화폐 리워드 연동', en: 'Supported pedometer, cycling and hiking modes tied to local-currency rewards'},
                                ],
                            },
                            {
                                text: {ko: '상시 · 단기 투어를 같은 구조로 수용', en: 'One structure for both always-on and short-run tours'},
                                children: [
                                    {ko: '하루짜리 축제 투어부터 2030년까지 열리는 상시 투어까지 동일 스키마로 운영', en: 'From single-day festival tours to always-on tours scheduled through 2030, all on one schema'},
                                    {ko: '주최 기관별 참여 조건과 안내 문구를 데이터로 분리해 서버 배포 없이 개설', en: 'Kept per-organizer rules and copy as data so new tours open without a server release'},
                                ],
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'note',
                        title: {ko: '설계가 증명된 지점', en: 'Where the design proved itself'},
                        desc: {
                            ko: '주최 기관마다 참여 자격·리워드·기간이 전부 달랐지만, 투어를 데이터로 다루는 구조 덕분에 신규 개설에 서버 코드 변경이 필요하지 않았습니다.',
                            en: 'Every organizer had different eligibility, rewards and durations, yet because tours are handled as data, opening a new one required no server code change.',
                        },
                    },
                ],
            },
            {
                id: 'result',
                label: {ko: '성과', en: 'Outcome'},
                title: {ko: '운영 성과와 남은 것', en: 'What it achieved and what remains'},
                icon: <FaUsers/>,
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '성장 속도에 맞춰 구조를 단순하게 유지', en: 'Kept the structure simple as it grew'},
                                children: [
                                    {ko: '과한 선반영 대신 필요한 시점에 계층을 확장하는 방식 선택', en: 'Chose to add layers when needed instead of over-engineering upfront'},
                                    {ko: '운영 인력이 적어도 이해 가능한 토폴로지 유지', en: 'Kept a topology a small ops team can still reason about'},
                                ],
                            },
                            {
                                text: {ko: '릴리즈 이후 리스크 관리 가능한 상태로 인계 가능', en: 'Left it in a state where risk stays manageable post-release'},
                                children: [
                                    {ko: '배포·모니터링·알림이 문서 없이도 동작하도록 자동화', en: 'Automated deployment, monitoring and alerting so they run without a runbook'},
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'navigation-statistics',
        title: {ko: '내비게이션 서비스 운영 & 통합통계 시스템', en: 'Navigation service operations & unified statistics system'},
        period: {ko: '2025.03 - 현재', en: '2025.03 - Present'},
        role: {ko: 'Lead Backend Engineer (Owner)', en: 'Lead Backend Engineer (Owner)'},
        summary: {
            ko: '아이나비 에어·토요타 하이브리드 등 내비게이션 서비스의 서버 운영·유지보수를 전담하는 동시에, 다수 서비스에서 인입되는 방대한 사용자 로그를 수집·정제해 대시보드에 공급하는 통합통계 시스템을 신규로 설계·개발했습니다.',
            en: 'While owning server operations and maintenance for navigation services such as INAVI AIR and Toyota hybrid, I designed and built a new unified statistics system that collects and refines huge volumes of user logs and feeds them to dashboards.',
        },
        metrics: [
            {value: {ko: '2종+', en: '2+'}, label: {ko: '운영 내비게이션 서비스', en: 'Navigation services operated'}},
            {value: {ko: '일 단위', en: 'Daily'}, label: {ko: 'BigQuery 파티션 집계', en: 'BigQuery partition aggregation'}},
            {value: '3 Context', label: {ko: 'DDD 도메인 분리', en: 'DDD bounded contexts'}},
            {value: 'Grafana', label: {ko: '실시간 지표 표출', en: 'Real-time metric reporting'}},
        ],
        impact: [
            {
                ko: '아이나비 에어, 토요타 하이브리드 등 내비게이션 서비스 서버 운영 및 유지보수 전담',
                en: 'Owned server operations and maintenance for INAVI AIR, Toyota hybrid and other navigation services',
            },
            {
                ko: '도메인 수집·정기 배치·사용자 조회 맥락 격리 (DDD 설계)로 통합통계 시스템 신규 개발',
                en: 'Built the unified statistics system with collection, batch and query contexts isolated by DDD',
            },
            {
                ko: 'BigQuery 일 단위 파티션 설계 및 Quartz 기반 정기 배치 자동화',
                en: 'Designed daily BigQuery partitions and automated scheduled batches with Quartz',
            },
            {
                ko: 'MySQL 통계 적재 엔진 및 Grafana 실시간 분석 대시보드 시각화 연동',
                en: 'Built the MySQL statistics engine and wired it to real-time Grafana dashboards',
            },
        ],
        features: [
            {
                ko: '내비게이션 서비스(아이나비 에어, 토요타 하이브리드 등) 서버 운영·유지보수',
                en: 'Server operations for navigation services (INAVI AIR, Toyota hybrid and more)',
            },
            {ko: 'GCP BigQuery 기반 일 단위 대량 로그 수집 파이프라인 신규 구축', en: 'New daily bulk log pipeline on GCP BigQuery'},
            {ko: 'Spring Batch / Quartz 기반 통계 배치 정밀 자동화', en: 'Precise statistics batch automation with Spring Batch / Quartz'},
            {ko: 'MySQL 통계 적재 엔진 및 Grafana 실시간 분석 대시보드', en: 'MySQL statistics engine and real-time Grafana dashboards'},
        ],
        stacks: ['Java/Kotlin', 'Spring Boot', 'BigQuery', 'Batch', 'Quartz', 'Grafana', 'GCP'],
        icon: <FaChartLine/>,
        chapters: [
            {
                id: 'overview',
                label: {ko: '개요', en: 'Overview'},
                title: {ko: '운영 전담과 신규 개발의 병행', en: 'Running operations while building something new'},
                icon: <FaRocket/>,
                lead: {
                    ko: '기존 내비게이션 서비스를 안정적으로 운영하면서, 동시에 통합통계 시스템을 처음부터 설계했습니다.',
                    en: 'I kept the existing navigation services stable while designing the unified statistics system from scratch.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <OperationScopeDiagram/>,
                            alt: {ko: '운영 및 유지보수 전담 서비스 범위 다이어그램', en: 'Diagram of the services under my operations ownership'},
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '운영 — 다원화된 내비게이션 서비스 전담', en: 'Operations — owning a diverse set of navigation services'},
                                children: [
                                    {
                                        ko: '아이나비 에어, 토요타 하이브리드 등 서버 운영·배포·릴리즈 관리',
                                        en: 'Server operations, deployment and release management for INAVI AIR, Toyota hybrid and others',
                                    },
                                    {ko: '장애 발생 시 원인 추적과 핫픽스까지 단독 대응', en: 'Handled root cause analysis through hotfix alone during incidents'},
                                ],
                            },
                            {
                                text: {ko: '신규 — 통합통계 시스템 설계·개발', en: 'New build — designing the unified statistics system'},
                                children: [
                                    {ko: '여러 서비스에서 인입되는 로그를 하나의 분석 기반으로 통합', en: 'Unified logs arriving from several services into a single analytics base'},
                                    {ko: '원시 로그부터 경영 지표 표출까지 전 구간 직접 구현', en: 'Implemented every stage from raw logs to business metric reporting'},
                                ],
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'note',
                        title: {ko: '해결해야 했던 문제', en: 'The problem I had to solve'},
                        desc: {
                            ko: '서비스마다 로그 형태와 적재 위치가 달라 통합 지표를 뽑는 데 매번 수작업이 필요했습니다. 이를 자동화된 단일 파이프라인으로 대체했습니다.',
                            en: 'Each service had its own log shape and storage location, so every unified metric took manual work. I replaced that with one automated pipeline.',
                        },
                    },
                ],
            },
            {
                id: 'domain',
                label: {ko: '도메인', en: 'Domain'},
                title: {ko: 'DDD 기반 컨텍스트 분리 설계', en: 'Context separation by DDD'},
                icon: <FaDiagramProject/>,
                lead: {
                    ko: '수집·배치·조회가 서로의 변경에 끌려가지 않도록 맥락을 분리했습니다.',
                    en: 'I separated the contexts so collection, batch and query would not drag each other along on every change.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <DomainContextDiagram/>,
                            alt: {ko: '수집, 배치, 조회 컨텍스트 분리 구조 다이어그램', en: 'Diagram of the separated collection, batch and query contexts'},
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: 'Collection Context — 인입 책임만 담당', en: 'Collection context — responsible only for ingestion'},
                                children: [
                                    {ko: '서비스별 로그 스키마 검증 후 원본 그대로 적재', en: 'Validates per-service log schemas and stores the raw payload as is'},
                                    {ko: '수집 실패가 집계 로직에 전파되지 않도록 경계 설정', en: 'Draws a boundary so ingestion failures never reach aggregation logic'},
                                ],
                            },
                            {
                                text: {ko: 'Batch Context — 집계 규칙의 단일 소유', en: 'Batch context — single owner of aggregation rules'},
                                children: [
                                    {ko: '일·월 단위 집계 정의를 한 곳에서 관리', en: 'Keeps daily and monthly aggregation definitions in one place'},
                                    {ko: '재집계가 필요할 때 특정 기간만 안전하게 재실행', en: 'Re-runs only the affected period safely when a recount is needed'},
                                ],
                            },
                            {
                                text: {ko: 'Query Context — 조회 성능에 최적화', en: 'Query context — optimized for read performance'},
                                children: [
                                    {ko: '집계 결과만 별도 저장소에 두어 조회 부하를 분리', en: 'Keeps only aggregated results in a separate store to isolate read load'},
                                    {ko: '대시보드 요구가 바뀌어도 수집·배치에 영향 없음', en: 'Dashboard changes leave collection and batch untouched'},
                                ],
                            },
                        ],
                    },
                    {
                        kind: 'note',
                        title: {ko: '설계 기준', en: 'The design principle'},
                        desc: {
                            ko: '도메인 간 응집도는 높이고 결합도는 낮춰, 한 컨텍스트의 변경이 다른 컨텍스트의 배포를 요구하지 않도록 했습니다.',
                            en: 'High cohesion within domains and low coupling between them, so a change in one context never forces a deploy of another.',
                        },
                    },
                ],
            },
            {
                id: 'pipeline',
                label: {ko: '파이프라인', en: 'Pipeline'},
                title: {ko: '로그 수집부터 지표 표출까지', en: 'From log collection to metric reporting'},
                icon: <FaDatabase/>,
                lead: {
                    ko: '원시 데이터 유입에서 경영 지표까지 하나의 선으로 이어지는 파이프라인을 구현했습니다.',
                    en: 'I built a pipeline that runs as one line from raw data intake to business metrics.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <StatisticsPipelineDiagram/>,
                            alt: {
                                ko: '로그 수집부터 지표 표출까지의 데이터 파이프라인 다이어그램',
                                en: 'Diagram of the data pipeline from log collection to metric reporting',
                            },
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'flow',
                        label: {ko: '처리 단계별 설계 포인트', en: 'Design decisions at each stage'},
                        steps: [
                            {
                                title: {ko: '1. 대량 로그 인입', en: '1. Bulk log intake'},
                                desc: {
                                    ko: '다수 내비게이션 서비스에서 발생하는 사용자 로그를 유실 없이 받아내는 것을 1순위 기준으로 삼았습니다.',
                                    en: 'Receiving user logs from many navigation services without loss was the first priority.',
                                },
                            },
                            {
                                title: {ko: '2. BigQuery 일 단위 파티션', en: '2. Daily BigQuery partitions'},
                                desc: {
                                    ko: '날짜 파티션 구조로 스캔 범위를 좁혀 집계 비용과 시간을 함께 줄였습니다.',
                                    en: 'Date partitioning narrows the scan range, cutting both aggregation cost and time.',
                                },
                            },
                            {
                                title: {ko: '3. Quartz 정기 배치', en: '3. Scheduled Quartz batches'},
                                desc: {
                                    ko: '스케줄 기반으로 일·월 집계를 자동 수행하고, 실패 구간만 선별 재처리할 수 있게 구성했습니다.',
                                    en: 'Daily and monthly aggregation runs on a schedule, with selective reprocessing of only the failed window.',
                                },
                            },
                            {
                                title: {ko: '4. MySQL 통계 적재', en: '4. Loading into MySQL'},
                                desc: {
                                    ko: '조회 전용 집계 테이블에 결과를 적재해 대시보드가 원본을 직접 때리지 않도록 했습니다.',
                                    en: 'Results land in read-only aggregate tables so dashboards never hit the raw source.',
                                },
                            },
                            {
                                title: {ko: '5. Grafana 지표 표출', en: '5. Reporting in Grafana'},
                                desc: {
                                    ko: '경영 지표와 서비스 지표를 동일한 대시보드에서 실시간으로 확인할 수 있게 연동했습니다.',
                                    en: 'Business and service metrics became visible in real time on the same dashboard.',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                id: 'result',
                label: {ko: '성과', en: 'Outcome'},
                title: {ko: '운영 관점에서의 변화', en: 'What changed operationally'},
                icon: <FaTableColumns/>,
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '수작업 집계 제거', en: 'Manual aggregation eliminated'},
                                children: [
                                    {ko: '서비스별로 흩어져 있던 로그를 단일 파이프라인으로 통합', en: 'Logs scattered across services now flow through one pipeline'},
                                    {ko: '지표 요청이 올 때마다 반복하던 추출 작업을 자동화로 대체', en: 'The extraction repeated on every metric request is now automated'},
                                ],
                            },
                            {
                                text: {ko: '유지보수 비용 절감', en: 'Lower maintenance cost'},
                                children: [
                                    {ko: '컨텍스트 분리로 변경 영향 범위를 예측 가능하게 만듦', en: 'Context separation makes the blast radius of a change predictable'},
                                    {ko: '집계 로직 수정 시 수집·조회 계층 배포 불필요', en: 'Changing aggregation logic no longer requires deploying collection or query layers'},
                                ],
                            },
                            {
                                text: {ko: '의사결정 속도 개선', en: 'Faster decision-making'},
                                children: [
                                    {ko: '경영 지표를 대시보드에서 상시 확인 가능한 상태로 전환', en: 'Business metrics became continuously visible on a dashboard'},
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'smart-library',
        title: {ko: '스마트도서관 시스템 고도화', en: 'Smart Library system modernization'},
        period: {ko: '2021.01 - 2022.06', en: '2021.01 - 2022.06'},
        role: {ko: 'Full-stack Solution Architect', en: 'Full-stack Solution Architect'},
        summary: {
            ko: '무인 도서 대출·반납 기기, 중앙 서버, 관리자 도구, 모바일 앱을 하나의 운영 플랫폼으로 연결하고 서비스 전반의 검색·동기화·이용자 경험을 고도화했습니다.',
            en: 'I connected self-service loan kiosks, the central server, admin tools and the mobile app into one operating platform, and modernized search, synchronization and the overall user experience.',
        },
        metrics: [
            {value: '80x', label: {ko: '검색 응답 개선', en: 'Search response improvement'}, delta: 'p99 7.5s → 93ms'},
            {value: '3 → 1', label: {ko: '유지보수 단위 축소', en: 'Maintenance units reduced'}},
            {value: '4 → 2', label: {ko: '도서 조회 단계', en: 'Steps to browse books'}},
            {value: '2 Store', label: {ko: '자체 앱 정식 출시', en: 'Own app officially released'}},
        ],
        impact: [
            {
                ko: '무인 대출·반납 기기와 중앙 서버를 연결하는 스마트도서관 운영 플랫폼 고도화',
                en: 'Modernized the operating platform linking self-service kiosks to the central server',
            },
            {
                ko: '도서 검색, 실시간 동기화, 외부 도서 API 연계를 하나의 서비스 흐름으로 통합',
                en: 'Unified book search, real-time sync and external book APIs into a single service flow',
            },
            {
                ko: '관리자 운영 도구와 모바일 하이브리드 앱을 개선해 현장 운영성과 사용자 접근성 강화',
                en: 'Improved admin tooling and the hybrid mobile app to strengthen field operations and user access',
            },
        ],
        features: [
            {ko: '무인 도서 대출·반납 서비스 운영 플랫폼 통합', en: 'Unified the self-service loan and return operating platform'},
            {ko: '기기 데이터 동기화 및 외부 도서 정보 연계 구조 고도화', en: 'Modernized device data sync and external book data integration'},
            {ko: '관리자 프로그램과 모바일 앱 중심의 운영·사용자 경험 개선', en: 'Improved operations and user experience across the admin program and mobile app'},
        ],
        stacks: ['Java', 'Spring MVC/Boot', 'MyBatis/JPA', 'MS-SQL', 'Android', 'iOS'],
        icon: <FaMobileScreenButton/>,
        thumbnail: {
            src: SmartLibraryDeviceImg,
            alt: {ko: '스마트도서관 무인 대출·반납 기기', en: 'Smart Library self-service loan kiosk'},
            frame: 'plain',
        },
        chapters: [
            {
                id: 'overview',
                label: {ko: '개요', en: 'Overview'},
                title: {ko: '흩어진 시스템을 하나의 플랫폼으로', en: 'Turning scattered systems into one platform'},
                icon: <FaRocket/>,
                lead: {
                    ko: '기기·서버·관리자 도구·모바일 앱이 따로 놀던 구조를 하나의 운영 흐름으로 묶었습니다.',
                    en: 'Kiosks, server, admin tools and the mobile app had been running apart; I tied them into one operating flow.',
                },
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '플랫폼 통합', en: 'Platform unification'},
                                children: [
                                    {ko: '무인 대출·반납 기기와 중앙 서버를 표준 연동 규격으로 연결', en: 'Connected kiosks to the central server through a standard integration spec'},
                                    {ko: '관리자 프로그램에서 현장 상태를 일괄 확인 가능하도록 개선', en: 'Made field status visible in one place from the admin program'},
                                ],
                            },
                            {
                                text: {ko: '레거시 스택 정리', en: 'Cleaning up the legacy stack'},
                                children: [
                                    {ko: 'Node.js, Angular, Go 등 파편화된 스택을 Java/Spring 기반으로 통합', en: 'Consolidated a fragmented Node.js/Angular/Go stack onto Java/Spring'},
                                    {ko: '기술 스택 단일화로 인수인계와 유지보수 난이도 완화', en: 'A single stack made handover and maintenance markedly easier'},
                                ],
                            },
                            {
                                text: {ko: '이용자 접점 강화', en: 'Strengthening user touchpoints'},
                                children: [
                                    {ko: '자체 하이브리드 앱을 Play Store · App Store에 정식 출시', en: 'Released our own hybrid app on the Play Store and App Store'},
                                    {ko: '외부 도서 API를 연계해 검색 결과의 정보량 확대', en: 'Enriched search results by integrating external book APIs'},
                                ],
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'metrics',
                        label: {ko: '핵심 개선 지표', en: 'Headline improvements'},
                        items: [
                            {value: '80x', label: {ko: '검색 응답 속도', en: 'Search response speed'}, delta: 'p99 7.5s → 93ms'},
                            {value: '50%', label: {ko: '도서 조회 동선 단축', en: 'Shorter path to browse books'}},
                        ],
                    },
                ],
            },
            {
                id: 'platform',
                label: {ko: '시스템 구조', en: 'Architecture'},
                title: {ko: '전체 시스템 및 데이터 동기화 흐름', en: 'System structure and data synchronization flow'},
                icon: <FaLayerGroup/>,
                lead: {
                    ko: '물리적으로 분산된 기기의 데이터가 중앙을 거쳐 이용자 화면까지 도달하는 경로입니다.',
                    en: 'How data from physically distributed kiosks travels through the center to the user screen.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <SmartLibraryTopologyDiagram/>,
                            alt: {
                                ko: '무인 기기, 중앙 서버, 서비스 채널 연결 구조 다이어그램',
                                en: 'Diagram connecting kiosks, the central server and service channels',
                            },
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'flow',
                        label: {ko: '실시간 데이터 동기화 플로우', en: 'Real-time synchronization flow'},
                        steps: [
                            {
                                title: {ko: '1. [로컬 기기] 대출 · 반납 발생', en: '1. [Kiosk] A loan or return happens'},
                                desc: {
                                    ko: '지하철역 등에 설치된 물리 기기에서 대출·반납이 발생하면 기기 로컬 DB를 즉시 갱신하고 보관합니다.',
                                    en: 'When a loan or return occurs at a kiosk in a subway station, the local DB updates and stores it immediately.',
                                },
                            },
                            {
                                title: {ko: '2. [스케줄러] 중앙 서버 동기화', en: '2. [Scheduler] Sync to the central server'},
                                desc: {
                                    ko: '기기 내 동기화 데몬이 수집한 이벤트를 중앙 API 수신기로 HTTPS 통신을 통해 전송합니다.',
                                    en: 'A sync daemon on the device sends collected events to the central API receiver over HTTPS.',
                                },
                            },
                            {
                                title: {ko: '3. [외부 API] 도서 메타 수집', en: '3. [External APIs] Gathering book metadata'},
                                desc: {
                                    ko: '중앙 서버가 카카오·인터파크·도서관정보나루 등 외부 검색 API를 제어해 도서 정보를 가공·수렴합니다.',
                                    en: 'The central server calls external search APIs such as Kakao, Interpark and Data4Library to enrich book data.',
                                },
                            },
                            {
                                title: {ko: '4. [웹 · 앱] 실시간 표출', en: '4. [Web & app] Real-time display'},
                                desc: {
                                    ko: '모바일 하이브리드 앱, 백오피스, 도서 검색 페이지에 실시간 도서 정보를 제공합니다.',
                                    en: 'Live book information reaches the hybrid app, the back office and the book search page.',
                                },
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'media',
                        media: {
                            src: SmartLibraryArchitectureImg,
                            alt: {ko: '스마트도서관 전체 플랫폼 시스템 아키텍처', en: 'Smart Library full platform system architecture'},
                            caption: {ko: '실제 플랫폼 아키텍처 산출물', en: 'The actual platform architecture deliverable'},
                            frame: 'light',
                        },
                    },
                ],
            },
            {
                id: 'app',
                label: {ko: '모바일 앱', en: 'Mobile app'},
                title: {ko: '고도화 사례 1 — 하이브리드 앱 정식 출시', en: 'Case 1 — Releasing the hybrid app'},
                icon: <FaMobileScreenButton/>,
                lead: {
                    ko: '웹뷰 기반의 한계를 보완해 네이티브에 가까운 사용성을 확보했습니다.',
                    en: 'I compensated for the limits of a WebView shell to get close to native usability.',
                },
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '자체 하이브리드 앱 정식 출시', en: 'Official release of our own hybrid app'},
                                children: [
                                    {ko: 'Google Play Store 및 Apple App Store 런칭', en: 'Launched on the Google Play Store and Apple App Store'},
                                    {ko: '모바일 서비스 운영·배포 체계 구축', en: 'Established a mobile release and operations process'},
                                ],
                            },
                            {
                                text: {ko: '도서 검색 동선 50% 단축', en: 'Halved the path to search for a book'},
                                children: [
                                    {ko: '불필요한 화면 분기 제거', en: 'Removed unnecessary screen branches'},
                                    {ko: '도서 목록 조회 단계를 4단계에서 2단계로 축소', en: 'Cut browsing from four steps to two'},
                                ],
                            },
                            {
                                text: {ko: '검색 기반 추천 경험 강화', en: 'Stronger search-driven recommendations'},
                                children: [
                                    {ko: '파편화된 인기도서 메뉴를 인기·연관 도서 추천 엔진으로 결합', en: 'Merged scattered popular-book menus into a popularity and relatedness engine'},
                                    {ko: '검색 컨텍스트 안에서 추천 도서 접근성 개선', en: 'Made recommendations reachable within the search context'},
                                ],
                            },
                            {
                                text: {ko: '모바일 앱 사용성 최적화', en: 'Mobile usability tuning'},
                                children: [
                                    {ko: '웹뷰 로딩 중 흰 화면 깜빡임을 스플래시 동기화로 개선', en: 'Removed the white flash during WebView load by syncing the splash screen'},
                                    {ko: '하이브리드 제스처 브릿지로 네이티브 수준의 인터랙션 제공', en: 'Delivered native-level interaction through a hybrid gesture bridge'},
                                ],
                            },
                            {
                                text: {ko: 'iOS 환경 대응 강화', en: 'Better iOS support'},
                                children: [
                                    {ko: '아이폰 노치 영역 대응 풀스크린 최적화', en: 'Full-screen optimization around the iPhone notch'},
                                    {ko: '뒤로가기 스와이프 제스처 브릿지 연동', en: 'Bridged the back-swipe gesture'},
                                ],
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'media',
                        media: {
                            src: SmartLibraryAppImg,
                            alt: {ko: '스마트도서관 모바일 하이브리드 앱 UI', en: 'Smart Library hybrid mobile app UI'},
                            caption: {ko: '모바일 하이브리드 앱 UI 목업', en: 'Hybrid mobile app UI mockup'},
                            frame: 'card',
                        },
                    },
                ],
            },
            {
                id: 'search',
                label: {ko: '검색 성능', en: 'Search performance'},
                title: {ko: '고도화 사례 2 — 검색 구조 및 성능 혁신', en: 'Case 2 — Rebuilding search structure and performance'},
                icon: <FaGaugeHigh/>,
                lead: {
                    ko: '기존 미들웨어 병목을 진단하고 직접 DB 라우팅 구조로 전환한 과정을 STAR로 정리했습니다.',
                    en: 'Diagnosing the middleware bottleneck and moving to direct DB routing, told as a STAR narrative.',
                },
                blocks: [
                    {
                        kind: 'star',
                        steps: [
                            {
                                step: 'S',
                                label: 'Situation',
                                items: [
                                    {
                                        text: {ko: '분산 기기 도서 목록 통합 조회 필요', en: 'A unified view over books spread across kiosks was needed'},
                                        children: [
                                            {ko: '관할지별로 물리 분산된 스마트도서관 기기 DB 조회', en: 'Kiosk databases were physically distributed by jurisdiction'},
                                            {ko: '이용자는 하나의 검색 화면에서 전체 도서 목록 확인 필요', en: 'Users expected the full catalog on one search screen'},
                                        ],
                                    },
                                ],
                            },
                            {
                                step: 'T',
                                label: 'Task & Problem',
                                media: {
                                    src: SmartLibrarySearchBeforeImg,
                                    alt: {ko: '기존 3-Tier 소켓 미들웨어 구조도', en: 'Diagram of the legacy three-tier socket middleware'},
                                    caption: {ko: '기존 3-Tier 소켓 미들웨어 구조 (Gandalf / Frodo)', en: 'Legacy three-tier socket middleware (Gandalf / Frodo)'},
                                    frame: 'light',
                                },
                                items: [
                                    {
                                        text: {ko: '3-Tier 소켓 미들웨어 병목 발생', en: 'The three-tier socket middleware was the bottleneck'},
                                        children: [
                                            {ko: '서버(Gandalf) - 장비(Frodo) 간 양방향 통신 의존', en: 'Everything depended on bidirectional server (Gandalf) to device (Frodo) traffic'},
                                            {ko: '연결 유실, 스레드 락킹, 검색 지연이 반복 발생', en: 'Dropped connections, thread locking and search latency recurred'},
                                        ],
                                    },
                                ],
                            },
                            {
                                step: 'A',
                                label: 'Action',
                                media: {
                                    src: SmartLibrarySearchAfterImg,
                                    alt: {ko: '개선된 1-Tier 라우팅 구조도', en: 'Diagram of the improved single-tier routing'},
                                    caption: {
                                        ko: '개선 후 1-Tier RoutingDataSource 동적 다중 DB 라우팅',
                                        en: 'After: single-tier dynamic multi-DB routing via RoutingDataSource',
                                    },
                                    frame: 'light',
                                },
                                items: [
                                    {
                                        text: {ko: '기기 DB 직접 라우팅 적용', en: 'Routed straight to the kiosk databases'},
                                        children: [
                                            {ko: 'Spring RoutingDataSource 기반 동적 DB 라우팅 구현', en: 'Implemented dynamic DB routing with Spring RoutingDataSource'},
                                            {ko: '미들웨어를 거치지 않고 서버에서 각 기기 DB로 직접 연결', en: 'The server connects to each kiosk DB directly, bypassing middleware'},
                                        ],
                                    },
                                ],
                            },
                            {
                                step: 'R',
                                label: 'Result',
                                items: [
                                    {
                                        text: {ko: '운영 · 배포 구조 단순화', en: 'Simpler operations and deployment'},
                                        children: [
                                            {ko: 'Gandalf/Frodo 양방향 미들웨어 레이어 제거', en: 'Removed the bidirectional Gandalf/Frodo middleware layer'},
                                            {ko: '유지보수 단위를 3개에서 1개로 단일화', en: 'Consolidated three maintenance units into one'},
                                        ],
                                    },
                                    {
                                        text: {ko: '검색 응답 성능 80배 개선', en: 'Search response improved ~80x'},
                                        children: [
                                            {ko: 'p99 응답시간을 7.5초에서 93ms로 단축', en: 'p99 latency dropped from 7.5s to 93ms'},
                                            {ko: '부하 조건을 5 vu/s에서 100 vu/s까지 확대 검증', en: 'Verified under load from 5 vu/s up to 100 vu/s'},
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kind: 'compare',
                        label: {ko: 'Artillery 부하 테스트 Before / After', en: 'Artillery load test — before / after'},
                        before: {
                            label: 'Before',
                            media: {
                                src: SmartLibraryArtilleryBeforeImg,
                                alt: {ko: 'Artillery 부하 테스트 개선 전 결과', en: 'Artillery load test result before the change'},
                                caption: {ko: '최대 7.5s 지연 (동시성 5 vu/s)', en: 'Up to 7.5s latency at 5 vu/s'},
                                frame: 'light',
                            },
                        },
                        after: {
                            label: 'After',
                            media: {
                                src: SmartLibraryArtilleryAfterImg,
                                alt: {ko: 'Artillery 부하 테스트 개선 후 결과', en: 'Artillery load test result after the change'},
                                caption: {ko: 'p99 93ms로 안정 수렴 (동시성 100 vu/s)', en: 'Settles at p99 93ms under 100 vu/s'},
                                frame: 'light',
                            },
                        },
                    },
                    {
                        kind: 'metrics',
                        label: {ko: '성능 테스트 지표', en: 'Load test results'},
                        items: [
                            {value: '93ms', label: {ko: 'p99 응답시간', en: 'p99 latency'}, delta: '7.5s → 93ms'},
                            {value: '100 vu/s', label: {ko: '검증 동시성', en: 'Verified concurrency'}, delta: '5 vu/s → 100 vu/s'},
                            {value: {ko: '약 80배', en: '~80x'}, label: {ko: '검색 응답 개선', en: 'Search response gain'}},
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'media',
                        media: {
                            src: SmartLibrarySearchImg,
                            alt: {ko: '도서 검색 페이지 UI', en: 'Book search page UI'},
                            caption: {ko: '다중 기기 DB 연동 도서 검색 웹앱', en: 'Search web app querying multiple kiosk databases'},
                            frame: 'card',
                        },
                    },
                ],
            },
        ],
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
