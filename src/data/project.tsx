import {ReactNode} from "react";
import {SiDocker, SiKotlin} from "react-icons/si";
import {
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
    FaTriangleExclamation,
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

export interface IProjectStory {
    problem: LocalizedText;
    action: LocalizedText;
    result: LocalizedText;
}

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
    /** 메인 카드 겉면 — 무엇이 문제였고, 무엇을 했고, 그래서 무엇이 달라졌나. 기술명은 stacks 에만 둡니다. */
    story: IProjectStory;
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
        role: {ko: 'Backend Engineer · 서버 단독', en: 'Backend Engineer · sole server owner'},
        summary: {
            ko: '내비게이션 회사의 위치 기반 스탬프 · 미션 서비스. 백엔드와 인프라를 혼자 세워 2025년 2월부터 운영 중입니다.',
            en: 'A location-based stamp and mission service at a navigation company. I built the backend and infrastructure alone and have run it since February 2025.',
        },
        metrics: [
            {value: {ko: '7.1만', en: '71K'}, label: {ko: '가입 회원', en: 'Registered members'}},
            {value: {ko: '21.6만', en: '216K'}, label: {ko: '누적 투어 · 미션 참여', en: 'Tour & mission participations'}},
            {value: {ko: '3.6만/월', en: '36K/mo'}, label: {ko: '월 최대 미션 참여', en: 'Peak monthly participants'}},
            {value: '1,632', label: {ko: '단독 커밋 (전체 1,693)', en: 'Own commits (of 1,693)'}},
        ],
        impact: [
            {
                ko: '스탬프 위치 인증 설계 — MySQL ST_Distance_Sphere 반경 판정, 코스 매칭률, NFC·QR 키. 반경·시간·방식은 스탬프마다 데이터로',
                en: 'Designed stamp verification: MySQL ST_Distance_Sphere radius checks, course match rate, NFC and QR keys, with radius, hours and method stored per stamp',
            },
            {
                ko: '동시성 제어 — 선착순 재고는 FOR UPDATE 행 잠금 + 신청 행 분리, 투어 정원은 조건부 UPDATE + 유니크 키, 스탬프 중복은 잠금 + 유니크 키의 이중 방어',
                en: 'Concurrency control: FOR UPDATE on reward stock with separate claim rows, conditional UPDATE plus unique keys for tour capacity, lock plus unique key against duplicate stamps',
            },
            {
                ko: '3 스키마 133 테이블을 MyBatis 로 설계, 컨트롤러 53개 · 엔드포인트 211개, 테스트 1,431건(Testcontainers · 동시성 통합 테스트 포함)',
                en: 'Designed 133 tables across 3 schemas on MyBatis, 53 controllers and 211 endpoints, 1,431 tests including Testcontainers and concurrency integration tests',
            },
            {
                ko: '장애 둘을 원인부터 닫음 — 3/1 RDS 포화(쿼리 208ms → 30ms, 푸시 분할 발송), 10/1 자정 커넥션 풀 소진(1초 캐시, 데드락 제거, DB 타임아웃 4단계)',
                en: 'Closed two outages from the root cause: RDS saturation on 3/1 (query 208ms → 30ms, split push delivery) and midnight pool exhaustion on 10/1 (1-second caches, deadlock removal, four-tier DB timeouts)',
            },
            {
                ko: 'AWS 인프라 · Jenkins/Harbor 배포 · Prometheus/Grafana 관측을 혼자 세우고 상용 2대를 운영',
                en: 'Built the AWS infrastructure, Jenkins/Harbor delivery and Prometheus/Grafana observability alone and ran two production servers',
            },
        ],
        story: {
            problem: {
                ko: '서버 인력이 없는 신규 서비스. 위치 인증과 선착순 리워드처럼 틀리면 돈이 나가는 규칙을 맡을 사람이 없었다.',
                en: 'A new service with no server engineer, and nobody to own the rules that cost money when wrong: location verification and first-come rewards.',
            },
            action: {
                ko: '백엔드를 혼자 설계 — GPS · 코스 · NFC · QR 위치 인증, FOR UPDATE + 유니크 키의 동시성 제어, 그 위에 AWS 인프라 · 배포 · 관측.',
                en: 'Designed the backend alone: GPS, course, NFC and QR verification, concurrency control with FOR UPDATE plus unique keys, and the AWS infrastructure, delivery and observability on top.',
            },
            result: {
                ko: '회원 7.1만 · 누적 참여 21.6만 회. 장애 둘을 원인부터 닫았다 — 쿼리 208ms → 30ms, 데드락 제거, DB 타임아웃 4단계.',
                en: '71K members, 216K participations. Two outages closed from the root cause: query 208ms → 30ms, deadlock removed, four-tier DB timeouts.',
            },
        },
        stacks: ['Kotlin', 'Spring Boot', 'MyBatis', 'MySQL · RDS', 'AWS', 'Prometheus · Grafana'],
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
                                text: {
                                    ko: '스탬프 투어 서비스의 서버 도메인 단독 설계',
                                    en: 'Solo design of the stamp tour service domain'
                                },
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
                                    {
                                        ko: '계정·네트워크 설계부터 배포·모니터링까지 단독 구축',
                                        en: 'Built everything from account and network design through deployment and monitoring'
                                    },
                                    {
                                        ko: '초기 MVP 구성에서 성능 안정화 단계까지 단계적으로 확장',
                                        en: 'Scaled progressively from the initial MVP to performance stabilization'
                                    },
                                ],
                            },
                            {
                                text: {ko: '크로스 도메인 협업 주도', en: 'Led cross-domain collaboration'},
                                children: [
                                    {
                                        ko: 'Scrum 기반으로 기획·디자인·모바일·어드민 요구사항을 API 계약으로 정리',
                                        en: 'Turned requirements from planning, design, mobile and admin into API contracts under Scrum',
                                    },
                                    {
                                        ko: '릴리즈 일정에 맞춘 서버 스펙 확정 및 연동 이슈 조율',
                                        en: 'Locked server specs to the release schedule and resolved integration issues'
                                    },
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
                            {
                                value: {ko: '2024.12~', en: 'Since 2024.12'},
                                label: {ko: '운영 지속', en: 'Still in operation'}
                            },
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
                /* 근거: server-orda-stamp — StampEarnRule.kt · StampMapper.kt · RewardMapper.kt · TourMapper.kt · RewardApplyTxService.kt · TourStartService.kt · StampEarnConcurrencyTests.kt */
                id: 'design',
                label: {ko: '설계', en: 'Design'},
                title: {ko: '위치 인증과 동시성 — 틀리면 돈이 나가는 두 규칙', en: 'Location verification and concurrency — the two rules that cost money when wrong'},
                icon: <FaMapLocationDot/>,
                lead: {
                    ko: '스탬프는 현장에서만 찍혀야 하고, 선착순 리워드는 재고보다 한 장도 더 나가면 안 됩니다. 둘 다 DB 가 마지막 방어선입니다.',
                    en: 'A stamp must only be earned on site, and a first-come reward must never exceed its stock by a single unit. For both, the database is the last line of defense.',
                },
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: '위치 인증 네 가지 — 방식과 임계치는 스탬프마다 데이터로', en: 'Four verification methods, with method and thresholds stored per stamp'},
                                children: [
                                    {
                                        ko: 'GPS: MySQL ST_Distance_Sphere 로 거리를 재고 스탬프별 gps_radius 와 비교. 운영 시간은 자정 넘김까지 SQL CASE 로 판정. 앱 쪽 하버사인은 같은 반지름을 써서 SQL 결과와 맞춘다',
                                        en: 'GPS: distance from MySQL ST_Distance_Sphere against the stamp\'s own gps_radius; operating hours judged in a SQL CASE including past-midnight windows; the app-side haversine uses the same radius so results agree',
                                    },
                                    {
                                        ko: '코스: WGS84 좌표열의 매칭률이 스탬프별 course_rate 이상일 때만. NFC·QR: 등록된 키와 일치해야 하고 QR 키는 유니크',
                                        en: 'Course: WGS84 track match rate must reach the stamp\'s course_rate; NFC and QR: must match the registered key, QR keys unique',
                                    },
                                    {
                                        ko: '다른 투어의 스탬프 ID 로 적립하는 경로를 쿼리 조건으로 막고, 좌표 열에는 SPATIAL INDEX',
                                        en: 'The query itself blocks earning with another tour\'s stamp ID, and the position column carries a SPATIAL INDEX',
                                    },
                                ],
                            },
                            {
                                text: {ko: '동시성 — 잠금 하나로 끝내지 않고 유니크 키를 뒤에 세운다', en: 'Concurrency — never a lock alone; a unique key stands behind it'},
                                children: [
                                    {
                                        ko: '선착순 재고: 재고 행을 FOR UPDATE 로 잠가 remain_cnt 를 깎고, 신청은 복합 PK 행에 ON DUPLICATE KEY 로. 외부 결제 호출은 잠금 밖으로 — claim → 구매 → complete 세 단계',
                                        en: 'First-come stock: lock the stock row with FOR UPDATE and decrement remain_cnt; claims go to a composite-PK row with ON DUPLICATE KEY. External payment calls stay outside the lock — claim → purchase → complete',
                                    },
                                    {
                                        ko: '투어 정원: UPDATE … WHERE total_user_count < limit_cnt 한 문장, 0행이면 롤백. 같은 회원의 중복 참여는 유니크 키의 DuplicateKeyException 으로',
                                        en: 'Tour capacity: a single UPDATE … WHERE total_user_count < limit_cnt, rolled back on zero rows. Duplicate participation by the same member surfaces as a unique-key DuplicateKeyException',
                                    },
                                    {
                                        ko: '스탬프 중복: FOR UPDATE + UQ_MEMBER_TOUR_STAMP 이중 방어. 통합 테스트는 5 스레드가 동시에 찍어 적립 행이 1건임을 확인한다',
                                        en: 'Duplicate stamps: FOR UPDATE plus UQ_MEMBER_TOUR_STAMP. The integration test fires 5 threads at once and asserts exactly one earned row',
                                    },
                                    {
                                        ko: '지갑 출금: 행 잠금 + balance ≥ amount 조건. 다중 인스턴스 배치: 만료 시각과 holder 조건을 건 DB 리스 락 — 두 인스턴스 테스트로 한 쪽만 도는 것을 확인',
                                        en: 'Wallet withdrawals: row lock plus a balance ≥ amount guard. Multi-instance batches: a DB lease lock keyed on expiry and holder — a two-instance test proves only one runs',
                                    },
                                ],
                            },
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'note',
                        title: {ko: '잠금에서 배운 것', en: 'What the locks taught me'},
                        desc: {
                            ko: '«투어 시작하기»의 FOR UPDATE 읽기는 첫 참여자의 빈 결과에 갭 잠금을 걸어 동시 요청에서 데드락이 났습니다(10/1). 잠금 읽기를 걷고 조건부 UPDATE 와 유니크 키만 남겼습니다 — 빈 결과를 잠그는 것은 아무것도 지키지 않습니다.',
                            en: 'The FOR UPDATE read in "start tour" put a gap lock on a first participant\'s empty result and deadlocked under concurrent requests (10/1). I removed the locking read and kept only the conditional UPDATE and the unique key — locking an empty result protects nothing.',
                        },
                    },
                    {
                        kind: 'metrics',
                        label: {ko: '규모', en: 'Scale'},
                        items: [
                            {value: '133', label: {ko: '테이블 · 3 스키마', en: 'Tables · 3 schemas'}},
                            {value: '211', label: {ko: 'API 엔드포인트', en: 'API endpoints'}},
                            {value: '1,431', label: {ko: '테스트', en: 'Tests'}},
                            {value: '21', label: {ko: 'Caffeine 캐시', en: 'Caffeine caches'}},
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
                                    {
                                        ko: '경기관광공사 평화누리길·평화누리 자전거길, 경기둘레길 스탬프투어',
                                        en: 'Gyeonggi Tourism Organization: Peace Nuri trail, Peace Nuri bike route and Gyeonggi Dulle-gil stamp tours'
                                    },
                                    {
                                        ko: '경기도 이천시 도자기 축제, 쌀문화축제, 설봉 둘레길 등 다수 운영',
                                        en: 'Icheon: ceramics festival, rice culture festival and Seolbong trail challenges'
                                    },
                                    {
                                        ko: '경상남도 양산시 낙동강 자전거길·힐링걷기, 국립세종수목원 정원 투어',
                                        en: 'Yangsan Nakdong River routes and the Sejong National Arboretum garden tour'
                                    },
                                ],
                            },
                            {
                                text: {
                                    ko: '화성시 "쓰리 Go" 챌린지 정기 운영',
                                    en: 'Recurring "Three GO" challenge for Hwaseong City'
                                },
                                children: [
                                    {
                                        ko: '화성시 체육회와 월 단위 스포츠DAY 미션을 연속 개설',
                                        en: 'Ran monthly Sports DAY missions with the Hwaseong City Sports Council'
                                    },
                                    {
                                        ko: '만보기·자전거·등산 세 가지 운동 유형과 지역화폐 리워드 연동',
                                        en: 'Supported pedometer, cycling and hiking modes tied to local-currency rewards'
                                    },
                                ],
                            },
                            {
                                text: {
                                    ko: '상시 · 단기 투어를 같은 구조로 수용',
                                    en: 'One structure for both always-on and short-run tours'
                                },
                                children: [
                                    {
                                        ko: '하루짜리 축제 투어부터 2030년까지 열리는 상시 투어까지 동일 스키마로 운영',
                                        en: 'From single-day festival tours to always-on tours scheduled through 2030, all on one schema'
                                    },
                                    {
                                        ko: '주최 기관별 참여 조건과 안내 문구를 데이터로 분리해 서버 배포 없이 개설',
                                        en: 'Kept per-organizer rules and copy as data so new tours open without a server release'
                                    },
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
                /* 근거: 서비스 장애 보고서 (2026-03-06). 수치는 보고서의 것만 쓴다. */
                id: 'incident',
                label: {ko: '장애', en: 'Incident'},
                title: {ko: '미션 오픈 정각의 접속 급증 — 장애 두 번', en: 'Traffic spikes at mission launch — two outages'},
                icon: <FaTriangleExclamation/>,
                lead: {
                    ko: '2026-03-01 09:00, 화성시 미션 오픈과 동시에 접속이 분당 700회 이상으로 뛰며 RDS 가 포화됐습니다. 원인은 트래픽 자체가 아니라 메인 화면의 투어 목록 쿼리였습니다.',
                    en: 'At 09:00 on 2026-03-01 a Hwaseong mission opened and requests jumped past 700 per minute, saturating RDS. The real cause was not the traffic but the tour-list query on the main screen.',
                },
                blocks: [
                    {
                        kind: 'flow',
                        label: {ko: '타임라인', en: 'Timeline'},
                        steps: [
                            {
                                title: {ko: '09:00 · 발생', en: '09:00 · Onset'},
                                desc: {
                                    ko: '미션 오픈 정각에 초기 접속이 분당 700회 이상으로 급증. 앱 접속 불가, 메인 화면 투어 조회 실패. 영향 예상 대상 3,749명.',
                                    en: 'Initial requests spiked past 700 per minute at launch. The app could not connect and the main screen failed to load tours. An estimated 3,749 users were affected.',
                                },
                            },
                            {
                                title: {ko: '09:19 · 인지와 재기동', en: '09:19 · Detected, restarted'},
                                desc: {
                                    ko: '인지 후 내부 전파와 긴급 재기동. 장애 지속. 09:47 인스턴스 1대 증설, 09:57 에도 지속 — 병목은 WAS 가 아니었습니다.',
                                    en: 'Escalated internally and restarted. Still down. Added an instance at 09:47, still down at 09:57 — the bottleneck was not the app server.',
                                },
                            },
                            {
                                title: {ko: '10:20 · RDS 증설로 복구', en: '10:20 · Recovered by scaling RDS'},
                                desc: {
                                    ko: 'RDS 를 c2m16 → c8m64 로 올려 정상화. 11:30 트래픽이 안정된 뒤 증설한 인스턴스 제거.',
                                    en: 'Scaled RDS from c2m16 to c8m64 and the service recovered. Removed the extra instance at 11:30 once traffic settled.',
                                },
                            },
                            {
                                title: {ko: '03-03 · 원인 쿼리 튜닝', en: '03-03 · Tuned the root-cause query'},
                                desc: {
                                    ko: '투어 목록 조회가 전체 사용자의 참여 이력을 훑고 있었습니다. UV 산정 로직을 고쳐 평균 응답 208ms → 30ms.',
                                    en: 'The tour-list query was scanning every user\'s participation history. Rewrote the UV calculation: average response 208ms → 30ms.',
                                },
                            },
                            {
                                title: {ko: '03-04 · 유입을 고르게', en: '03-04 · Flattening the inflow'},
                                desc: {
                                    ko: '홍보 푸시가 사용자를 한 시각에 모으지 않도록 분할 발송 스케줄링을 넣고, RDS 를 c4m32 로 내렸습니다. 03-05 전체 푸시를 그 위에서 발송.',
                                    en: 'Added scheduled, split push delivery so promotions no longer herd users into one minute, then stepped RDS down to c4m32. Sent the full push on 03-05 over that setup.',
                                },
                            },
                        ],
                    },
                    {
                        kind: 'metrics',
                        label: {ko: '검증', en: 'Verified'},
                        items: [
                            {value: '30ms', label: {ko: '투어 목록 평균 응답', en: 'Tour-list average response'}, delta: '208ms → 30ms'},
                            {value: {ko: '700회/분', en: '700/min'}, label: {ko: '오픈 정각 유입', en: 'Requests at launch'}},
                            {value: 'c4m32', label: {ko: 'RDS 최종 사양', en: 'Final RDS size'}, delta: 'c2m16 → c8m64 → c4m32'},
                            {value: '3,749', label: {ko: '영향 예상 대상', en: 'Users affected'}},
                        ],
                    },
                ],
                aside: [
                    {
                        kind: 'note',
                        title: {ko: '남은 것', en: 'What remained'},
                        desc: {
                            ko: '정합성을 위해 쓰던 FOR UPDATE 를 걷는 작업, 로그 보관 주기 90일 → 30일, 그리고 20~30초 만에 성공하는 쿼리는 알림이 울리지 않는다는 문제 — DB 타임아웃 정책이 뒤따랐습니다.',
                            en: 'Removing the FOR UPDATE used for consistency, cutting log retention from 90 to 30 days, and the fact that a query succeeding in 20–30 seconds never fires an alert — a DB timeout policy followed.',
                        },
                    },
                    {
                        kind: 'note',
                        title: {ko: '두 번째 — 10/1 자정', en: 'The second one — midnight, 10/1'},
                        desc: {
                            ko: '화성시 미션이 자정에 열리자 /init 회원이 전날 102명에서 5,895명으로 뛰었고, 커넥션 획득 실패 59만 건 · 데드락 15건 · 동시 요청 4,075건으로 Tomcat 스레드 상한(4,096)에 닿아 OOM 이 났습니다. 조치는 회원 무관 조회의 1초 캐시(투어 전체 1.1ms + 지역 0.6ms + 집계 3.6ms), 같은 키에 몰린 요청이 한 번의 적재를 나눠 받는 SharedLoadCaffeineCache, 투어 시작의 데드락 제거, (회원, 일시) 인덱스, DB 타임아웃 4단계(잠금 10초 < 문장 15초 < 소켓 30초 < 트랜잭션 60초). 부하 재현 검증은 아직 하지 않았습니다 — 그래서 «검증 완료»라고 적지 않습니다.',
                            en: 'When a Hwaseong mission opened at midnight, /init members jumped from 102 the day before to 5,895; 599,987 connection acquisition failures, 15 deadlocks and 4,075 concurrent requests hit the Tomcat thread cap (4,096) and the JVM ran out of memory. Fixes: 1-second caches for member-independent reads (all tours 1.1ms + regions 0.6ms + aggregates 3.6ms), a SharedLoadCaffeineCache so requests piling onto one key share a single load, the start-tour deadlock removal, a (member, timestamp) index, and four-tier DB timeouts (lock 10s < statement 15s < socket 30s < transaction 60s). Load reproduction has not been run yet — which is why this is not marked verified.',
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
                            alt: {
                                ko: 'AWS 기반 오르다 인프라 토폴로지 다이어그램',
                                en: 'Diagram of the ORDA infrastructure topology on AWS'
                            },
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
                                    {
                                        ko: 'Route 53으로 서비스 도메인과 환경별 레코드 관리',
                                        en: 'Managed service domains and per-environment records in Route 53'
                                    },
                                    {
                                        ko: 'ALB에서 HTTPS 종단 처리 및 헬스체크 기반 라우팅',
                                        en: 'Terminated HTTPS at the ALB and routed on health checks'
                                    },
                                ],
                            },
                            {
                                text: {
                                    ko: 'Application — API 계층',
                                    en: 'Application — the API layer'
                                },
                                children: [
                                    {
                                        ko: '상용 EC2 2대에서 Kotlin/Spring Boot API 구동 — HikariCP 100 · Tomcat 스레드 4,096. 개발 서버는 Docker 이미지',
                                        en: 'The Kotlin/Spring Boot API runs on two production EC2 instances — HikariCP 100, Tomcat threads 4,096. The dev server runs the Docker image'
                                    },
                                    {
                                        ko: '이미지 리사이징 등 비동기 후처리는 Lambda로 분리',
                                        en: 'Split async post-processing such as image resizing into Lambda'
                                    },
                                ],
                            },
                            {
                                text: {
                                    ko: 'Data — 영속 계층과 정적 자산 분리',
                                    en: 'Data — separating persistence from static assets'
                                },
                                children: [
                                    {
                                        ko: 'RDS에 트랜잭션 데이터, S3에 스탬프·이미지 자산 적재',
                                        en: 'Transactional data in RDS, stamp and image assets in S3'
                                    },
                                    {
                                        ko: 'RDS 는 Aurora 클러스터 — 3/1 장애 뒤 c2m16 → c4m32, 10/1 뒤 DB 타임아웃 4단계(잠금 10초 < 문장 15초 < 소켓 30초 < 트랜잭션 60초)',
                                        en: 'RDS is an Aurora cluster — c2m16 → c4m32 after the 3/1 outage, four-tier DB timeouts after 10/1 (lock 10s < statement 15s < socket 30s < transaction 60s)'
                                    },
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
                    ko: '커밋에서 테스트·이미지·레지스트리·개발 서버까지를 Jenkins 한 흐름으로 묶었습니다. 상용은 서버 2대에 사람이 올립니다.',
                    en: 'Commit through tests, image, registry and the dev server runs as one Jenkins flow. Production is two servers that a person deploys to.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <CicdPipelineDiagram/>,
                            alt: {
                                ko: 'Jenkins와 Harbor 기반 배포 파이프라인 다이어그램',
                                en: 'Diagram of the Jenkins and Harbor deployment pipeline'
                            },
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
                                    {
                                        ko: '브랜치 전략에 맞춘 자동 빌드·테스트 트리거 구성',
                                        en: 'Wired automatic build and test triggers to the branch strategy'
                                    },
                                    {
                                        ko: '환경별(dev/prod) 파라미터 분리로 잘못된 배포 차단',
                                        en: 'Separated dev/prod parameters to block mistaken deployments'
                                    },
                                ],
                            },
                            {
                                text: {ko: 'Harbor 사설 레지스트리 운영', en: 'Running a private Harbor registry'},
                                children: [
                                    {
                                        ko: '이미지 태깅 규칙을 정해 롤백 지점을 명확히 확보',
                                        en: 'Defined image tagging rules so rollback points stay unambiguous'
                                    },
                                    {
                                        ko: '외부 레지스트리 의존 없이 내부에서 이미지 수명 관리',
                                        en: 'Managed image lifecycle in-house without external registry dependencies'
                                    },
                                ],
                            },
                            {
                                text: {ko: '배포 리스크 축소', en: 'Reducing deployment risk'},
                                children: [
                                    {
                                        ko: '테스트 → Qodana 정적 분석 → 이미지 빌드 → Harbor 푸시 → 개발 서버 SSH 배포. 상용 2대는 jar 를 올려 한 대씩 재기동 — 롤링 스크립트는 아직 없다',
                                        en: 'Tests → Qodana static analysis → image build → Harbor push → SSH deploy to dev. Production is two servers that get the jar and restart one at a time — no rolling script yet'
                                    },
                                    {
                                        ko: '배포 결과를 Slack 채널로 통보해 실패를 즉시 인지',
                                        en: 'Reported deployment results to a Slack channel so failures surface immediately'
                                    },
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
                    ko: '예외 로그는 Logstash 파일을 거쳐 Slack 으로, 메트릭은 Prometheus 로. 10/1 자정 장애 뒤에 Prometheus·Grafana 스택을 세웠습니다.',
                    en: 'Exception logs reach Slack through Logstash files; metrics go to Prometheus. The Prometheus and Grafana stack went up after the 10/1 midnight outage.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <ObservabilityDiagram/>,
                            alt: {
                                ko: 'Logstash 로그, Prometheus, Grafana 기반 관측 체계 다이어그램',
                                en: 'Diagram of the observability stack on Logstash logs, Prometheus and Grafana',
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
                                    {
                                        ko: '예외 로그는 Logstash 파일(시간 단위 롤링 · 비동기 appender)로 남겨 Slack 채널까지 흐른다',
                                        en: 'Exception logs land in Logstash files (hourly rolling, async appender) and flow on to a Slack channel'
                                    },
                                    {
                                        ko: 'Actuator + Micrometer 로 HTTP · JVM · HikariCP 메트릭을 Prometheus 가 15초마다 긁는다',
                                        en: 'Actuator and Micrometer expose HTTP, JVM and HikariCP metrics that Prometheus scrapes every 15 seconds'
                                    },
                                ],
                            },
                            {
                                text: {ko: '임계치 규칙 4종', en: 'Four threshold rules'},
                                children: [
                                    {
                                        ko: '인스턴스 다운 2분 · 5xx 비율 5% 초과 5분 · Hikari 대기 커넥션 3분 · 힙 90% 10분',
                                        en: 'Instance down for 2 min, 5xx ratio over 5% for 5 min, pending Hikari connections for 3 min, heap above 90% for 10 min'
                                    },
                                    {
                                        ko: '규칙은 평가되지만 Alertmanager 는 아직 붙이지 않았다 — 발송은 다음 일이다',
                                        en: 'The rules are evaluated, but Alertmanager is not wired yet — delivery is the next step'
                                    },
                                ],
                            },
                            {
                                text: {ko: 'Grafana 대시보드와 지연 분석', en: 'Grafana dashboards and latency analysis'},
                                children: [
                                    {
                                        ko: 'HTTP · JVM · Hikari · 로그 네 묶음의 대시보드 하나',
                                        en: 'One dashboard in four groups: HTTP, JVM, Hikari and logs'
                                    },
                                    {
                                        ko: '로그에서 API 별 호출 수 · 평균 · p90 · p95 · p99 · 1초 초과 건수를 표로 내는 스크립트 — 10/1 장애의 1위 쿼리를 이것으로 찾았다',
                                        en: 'A script that tables per-API call counts, average, p90, p95, p99 and over-1s counts from logs — it found the top query of the 10/1 outage'
                                    },
                                ],
                            },
                        ],
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
                                    {
                                        ko: '과한 선반영 대신 필요한 시점에 계층을 확장하는 방식 선택',
                                        en: 'Chose to add layers when needed instead of over-engineering upfront'
                                    },
                                    {
                                        ko: '운영 인력이 적어도 이해 가능한 토폴로지 유지',
                                        en: 'Kept a topology a small ops team can still reason about'
                                    },
                                ],
                            },
                            {
                                text: {
                                    ko: '릴리즈 이후 리스크 관리 가능한 상태로 인계 가능',
                                    en: 'Left it in a state where risk stays manageable post-release'
                                },
                                children: [
                                    {
                                        ko: '배포·모니터링·알림이 문서 없이도 동작하도록 자동화',
                                        en: 'Automated deployment, monitoring and alerting so they run without a runbook'
                                    },
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
        period: {ko: '2025.01 - 현재', en: '2025.01 - Present'},
        role: {ko: 'Backend Engineer · 통계 Owner', en: 'Backend Engineer · stats owner'},
        summary: {
            ko: '내비 서버 운영을 맡으면서, 흩어진 로그 통계를 서버 하나의 파이프라인으로 모았습니다.',
            en: 'While running the navigation servers, I pulled scattered log statistics into one server\'s pipeline.',
        },
        metrics: [
            {value: '2', label: {ko: '운영 내비 서비스 (AIR · Toyota)', en: 'Navigation services (AIR · Toyota)'}},
            {value: '35', label: {ko: 'BigQuery 원천 테이블 · 3 데이터셋', en: 'BigQuery source tables · 3 datasets'}},
            {value: '22', label: {ko: '@Scheduled 집계 잡 · MySQL 테이블', en: '@Scheduled jobs · MySQL tables'}},
            {value: '4', label: {ko: 'Grafana 대시보드', en: 'Grafana dashboards'}},
        ],
        impact: [
            {
                ko: 'iNavi AIR · Toyota 내비 서버 운영 — 탐색 프로토콜 v2.2.9(위수지역 회피) 대응, 로그 API 연동, 오퍼월 중복지급 방어, 핫픽스',
                en: 'Ran the iNavi AIR and Toyota navigation servers: routing protocol v2.2.9 (military-zone avoidance), log API integration, offerwall double-payment guard, hotfixes',
            },
            {
                ko: 'Toyota API 로그 → BigQuery 적재 경로 구축 — 응답 AOP 가 JSON 한 줄로 남기고, 새벽 cron 이 GCS 를 거쳐 bq load. 날짜를 주면 재적재',
                en: 'Built the Toyota API log path into BigQuery: a response AOP writes one JSON line per call, a nightly cron loads it through GCS with bq load, and a date argument reloads a day',
            },
            {
                ko: '통합통계 서버를 Kotlin 으로 새로 설계 — 헥사고날 계층(domain · application · infrastructure · presentation) 위에 AIR · Toyota 모듈, 도메인 6개',
                en: 'Designed the unified statistics server in Kotlin: hexagonal layers (domain, application, infrastructure, presentation) with AIR and Toyota modules over six domains',
            },
            {
                ko: 'BigQuery 35 테이블 → @Scheduled 잡 22개 → MySQL 집계 22 테이블 → Grafana 대시보드 4개 + 운영 대시보드 + MCP 서버(도구 6)',
                en: '35 BigQuery tables → 22 @Scheduled jobs → 22 MySQL aggregate tables → 4 Grafana dashboards, an ops dashboard and an MCP server with 6 tools',
            },
        ],
        story: {
            problem: {
                ko: 'AIR · Toyota 로그가 BigQuery 프로젝트 둘에 흩어져 있고, Python 수집기 일곱 개가 제각각 통계를 뽑았다.',
                en: 'AIR and Toyota logs sat across two BigQuery projects, and seven Python collectors each pulled their own statistics.',
            },
            action: {
                ko: '통계 서버를 Kotlin 으로 새로 — 헥사고날 계층 위 AIR · Toyota 모듈, BigQuery 35 테이블 → @Scheduled 22 잡 → MySQL → Grafana 4.',
                en: 'A new Kotlin statistics server: AIR and Toyota modules on hexagonal layers, 35 BigQuery tables → 22 @Scheduled jobs → MySQL → 4 Grafana boards.',
            },
            result: {
                ko: '수집기 일곱을 서버 하나로. 늦은 로그는 월간 재적재로, 날짜 없는 행은 경보로. 내비 서버 운영은 그 옆에서 계속.',
                en: 'Seven collectors became one server. Late logs are caught by monthly reloads, dateless rows by an alert. Navigation server ops continued alongside.',
            },
        },
        stacks: ['Kotlin', 'Spring Boot', 'BigQuery', 'MySQL', 'Grafana', 'GCP'],
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
                            alt: {
                                ko: '운영 및 유지보수 전담 서비스 범위 다이어그램',
                                en: 'Diagram of the services under my operations ownership'
                            },
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {
                                    ko: '운영 — 다원화된 내비게이션 서비스 전담',
                                    en: 'Operations — owning a diverse set of navigation services'
                                },
                                children: [
                                    {
                                        ko: '아이나비 에어, 토요타 하이브리드 등 서버 운영·배포·릴리즈 관리',
                                        en: 'Server operations, deployment and release management for INAVI AIR, Toyota hybrid and others',
                                    },
                                    {
                                        ko: '장애 발생 시 원인 추적과 핫픽스까지 대응',
                                        en: 'Handled root cause analysis through hotfix during incidents'
                                    },
                                ],
                            },
                            {
                                text: {
                                    ko: '신규 — 통합통계 시스템 설계·개발',
                                    en: 'New build — designing the unified statistics system'
                                },
                                children: [
                                    {
                                        ko: '여러 서비스에서 인입되는 로그를 하나의 분석 기반으로 통합',
                                        en: 'Unified logs arriving from several services into a single analytics base'
                                    },
                                    {
                                        ko: '원시 로그부터 경영 지표 표출까지 전 구간 직접 구현',
                                        en: 'Implemented every stage from raw logs to business metric reporting'
                                    },
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
                            ko: '로그가 BigQuery 프로젝트 둘, 데이터셋 셋에 흩어져 있고 Python 수집기 일곱 개가 제각각 통계를 뽑았습니다. 이것을 서버 하나의 파이프라인으로 대체했습니다.',
                            en: 'Logs sat across two BigQuery projects and three datasets, and seven Python collectors each pulled their own numbers. I replaced that with one server\'s pipeline.',
                        },
                    },
                ],
            },
            {
                id: 'domain',
                label: {ko: '구조', en: 'Structure'},
                title: {ko: '헥사고날 계층과 시스템 모듈', en: 'Hexagonal layers and system modules'},
                icon: <FaDiagramProject/>,
                lead: {
                    ko: '도메인은 포트만 알고, AIR 와 Toyota 는 같은 계층 위의 모듈입니다. 잡 하나를 더하는 일은 Reader · Job · Entity 한 벌을 더하는 일로 끝납니다.',
                    en: 'The domain knows only its ports, and AIR and Toyota are modules on the same layers. Adding a job means adding one Reader, Job and Entity set.',
                },
                blocks: [
                    {
                        kind: 'media',
                        media: {
                            node: <DomainContextDiagram/>,
                            alt: {
                                ko: '헥사고날 계층과 AIR · Toyota 시스템 모듈 구조 다이어그램',
                                en: 'Diagram of the hexagonal layers and the AIR and Toyota system modules'
                            },
                            frame: 'plain',
                            size: 'full',
                        },
                    },
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: 'Domain — 도메인 6개와 포트', en: 'Domain — six domains and their ports'},
                                children: [
                                    {
                                        ko: 'lifecycle · map · rank · route · search · service. 각 도메인은 Port 인터페이스만 알고 BigQuery 도 MySQL 도 모른다',
                                        en: 'lifecycle, map, rank, route, search, service. Each domain knows only its Port interface, neither BigQuery nor MySQL',
                                    },
                                    {
                                        ko: '경로 도메인의 재탐색 판정은 BigQuery Geography 로 — ST_DISTANCE 가 100m 를 넘고 앞뒤 300초가 떨어진 점을 이탈로 센다. 출퇴근 피크(07–09 · 16–19시)를 따로 가른다',
                                        en: 'Route re-search detection runs on BigQuery Geography: a point counts as a deviation when ST_DISTANCE exceeds 100m with 300s on either side; commute peaks (07–09, 16–19) are split out',
                                    },
                                ],
                            },
                            {
                                text: {ko: 'Application — 청크 동기화와 배치 러너', en: 'Application — chunked sync and the batch runner'},
                                children: [
                                    {
                                        ko: 'BigQuery 는 6개월 단위로 읽고 MySQL 은 500행 청크로 쓴다. 청크 하나가 실패해도 다음 청크로 간다',
                                        en: 'BigQuery is read in six-month windows and MySQL written in 500-row chunks; a failed chunk does not stop the next',
                                    },
                                    {
                                        ko: '전체 동기화는 범위 검증 뒤에야 TRUNCATE 한다 — 조회가 실패해도 테이블이 빈 채로 남지 않게. 실행 결과는 batch_run 에 남긴다',
                                        en: 'A full sync TRUNCATEs only after the range is validated, so a failed read never leaves an empty table. Every run is recorded in batch_run',
                                    },
                                ],
                            },
                            {
                                text: {ko: 'Infrastructure · Presentation', en: 'Infrastructure and presentation'},
                                children: [
                                    {
                                        ko: '시스템마다 BigQuery 클라이언트와 Reader 를 따로 두고(서비스 계정이 다르다), 저장은 JPA 로. 일간 테이블의 PK 는 날짜라 재적재가 merge 가 된다',
                                        en: 'Each system has its own BigQuery client and Readers (separate service accounts); persistence is JPA. Daily tables key on the date, so a reload is a merge',
                                    },
                                    {
                                        ko: 'Thymeleaf 운영 대시보드(Caffeine 1시간 캐시)와 Spring AI MCP 서버 — 토큰 해시로 인증하는 도구 6개(목록 · 조회 · 요약 · 동기화 상태 · 동기화 실행)',
                                        en: 'A Thymeleaf ops dashboard (1-hour Caffeine cache) and a Spring AI MCP server with six token-authenticated tools (list, read, summary, sync status, run sync)',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kind: 'note',
                        title: {ko: '설계 기준', en: 'The design principle'},
                        desc: {
                            ko: '시스템이 하나 더 늘어도 계층은 늘지 않고 모듈이 하나 는다. 수동 동기화는 compareAndSet 으로 한 번에 하나만 돌고, 겹치면 409 로 답한다.',
                            en: 'One more system adds a module, not a layer. Manual sync runs one at a time behind compareAndSet and answers 409 when it overlaps.',
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
                                title: {ko: '1. 로그 인입 — 원천 35 테이블', en: '1. Log intake — 35 source tables'},
                                desc: {
                                    ko: 'AIR 앱·SDK 로그는 데이터셋 둘(13 + 13 테이블). Toyota 는 API 응답 AOP 가 JSON 한 줄로 남기고 새벽 3:35 cron 이 GCS 를 거쳐 bq load 로 9 테이블에 적재 — 이 경로를 직접 세웠습니다. 테이블 이름은 event_<op>_a / _x 로 같은 꼴.',
                                    en: 'AIR app and SDK logs live in two datasets (13 + 13 tables). For Toyota, a response AOP writes one JSON line per call and a 03:35 cron loads it via GCS with bq load into 9 tables — a path I built. Tables share the event_<op>_a / _x naming.',
                                },
                            },
                            {
                                title: {ko: '2. 파티션 범위 — INFORMATION_SCHEMA', en: '2. Partition range — INFORMATION_SCHEMA'},
                                desc: {
                                    ko: 'INFORMATION_SCHEMA.PARTITIONS 에서 min/max 날짜를 읽어 동기화 범위를 정하고, 모든 쿼리는 log_dt BETWEEN 으로 파티션만 훑습니다. 날짜 없이 쌓인 __NULL__ 파티션이 범위를 무너뜨린 적이 있어 그 행은 경보로 잡습니다.',
                                    en: 'The sync window comes from min/max dates in INFORMATION_SCHEMA.PARTITIONS, and every query scans only partitions via log_dt BETWEEN. A __NULL__ partition once broke the window, so rows without a date now raise an alert.',
                                },
                            },
                            {
                                title: {ko: '3. @Scheduled 잡 22개', en: '3. 22 @Scheduled jobs'},
                                desc: {
                                    ko: 'AIR 일간 9개(06:10) · Toyota 일간 9개(06:30) · 월간 4개(07:00). 월간 잡은 매일 그 달 전체를 다시 적재해 늦게 온 로그를 반영합니다. 실행 결과는 batch_run 에.',
                                    en: 'Nine AIR daily jobs (06:10), nine Toyota daily jobs (06:30), four monthly jobs (07:00). Monthly jobs reload the whole month every day so late logs are counted. Runs are logged to batch_run.',
                                },
                            },
                            {
                                title: {ko: '4. MySQL 집계 — air · toyota 스키마', en: '4. MySQL aggregates — air and toyota schemas'},
                                desc: {
                                    ko: '스키마 둘에 집계 테이블 11 + 11. 기간 동기화는 그 기간을 지우고 다시 넣고, 일간 테이블은 날짜가 PK 라 재적재가 merge 입니다.',
                                    en: 'Two schemas with 11 + 11 aggregate tables. A range sync deletes and reinserts that range; daily tables key on the date, so a reload is a merge.',
                                },
                            },
                            {
                                title: {ko: '5. Grafana 4 · 운영 대시보드 · MCP', en: '5. Four Grafana boards, an ops dashboard and MCP'},
                                desc: {
                                    ko: 'AIR·Toyota 일간·월간 대시보드 넷이 MySQL 을 직접 봅니다. 자체 운영 대시보드는 1시간 캐시, MCP 서버는 토큰 인증 도구 6개로 동기화 상태를 묻고 실행합니다.',
                                    en: 'Four AIR and Toyota daily and monthly boards read MySQL directly. The ops dashboard caches for an hour, and the MCP server exposes six token-authenticated tools to query sync status and trigger runs.',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                /* 근거: air · server-routelib2 · server-toyota-hbnavi · server-traffic-trafficadminv2 · server-united-navi 의 사용자 커밋 */
                id: 'operations',
                label: {ko: '내비 운영', en: 'Navi ops'},
                title: {ko: '내비 서버에서 한 일 — 배경이지 성과가 아니다', en: 'Work on the navigation servers — background, not a headline'},
                icon: <FaMapLocationDot/>,
                lead: {
                    ko: '내비 운영은 특이점 없는 유지보수가 대부분입니다. 부풀리지 않고 커밋에 있는 것만 적습니다.',
                    en: 'Navigation operations were mostly unremarkable maintenance. Only what the commits show is listed here, without inflation.',
                },
                blocks: [
                    {
                        kind: 'bullets',
                        items: [
                            {
                                text: {ko: 'iNavi AIR (Groovy · Spring Boot 2.1)', en: 'iNavi AIR (Groovy, Spring Boot 2.1)'},
                                children: [
                                    {
                                        ko: '탐색 프로토콜 v2.2.9 대응 — 위수지역 회피 옵션을 패킷 비트 플래그로. 처음 넣은 플래그 값이 틀려(0x32 · 0x64) 석 달 뒤 0x20 · 0x40 으로 고쳤다',
                                        en: 'Routing protocol v2.2.9: military-zone avoidance as packet bit flags. The first flag values were wrong (0x32, 0x64) and were corrected to 0x20, 0x40 three months later',
                                    },
                                    {
                                        ko: '로그 API 연동(CCTV · 캐시 이벤트), AIR × 오르다 연동 API, 길찾기 버그 수정, 오퍼월 중복지급 방어(거래 ID + AppKey)',
                                        en: 'Log API integration (CCTV and cache events), AIR × ORDA integration API, routing bug fix, offerwall double-payment guard keyed on transaction ID and AppKey',
                                    },
                                    {
                                        ko: '핫픽스 롤백 두 번 뒤 12시간 정책 재적용 — 되돌린 것도 커밋에 남아 있다',
                                        en: 'Two hotfix rollbacks, then the 12-hour policy re-applied — the reversals are in the commits too',
                                    },
                                ],
                            },
                            {
                                text: {ko: 'Toyota · 교통 · 통합', en: 'Toyota, traffic and unification'},
                                children: [
                                    {
                                        ko: 'Toyota: API 로그 → BigQuery 적재 경로, 헬스체크 저장소(최근 100건 윈도우 · 실패 코드 집계 — 동료와 함께), CALC_ROUTE_X 신규 규격, CCTV 처리 리팩토링',
                                        en: 'Toyota: API log path into BigQuery, a health-status store (100-sample window, failure-code tally — with a colleague), the new CALC_ROUTE_X spec, CCTV processing refactor',
                                    },
                                    {
                                        ko: '교통정보 배포 서버: CDN FTP 설정 구조 정리, SKB CDN 로그인 실패 수정',
                                        en: 'Traffic distribution server: restructured CDN FTP configuration, fixed an SKB CDN login failure',
                                    },
                                    {
                                        ko: 'Groovy 내비 에이전트를 Kotlin 으로 옮기는 통합 서버 — SIRE 클라이언트와 통합 검색 API까지, 아직 초기',
                                        en: 'A unified server moving the Groovy navigation agent to Kotlin — SIRE client and unified search API so far, still early',
                                    },
                                ],
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
                                    {
                                        ko: '서비스별로 흩어져 있던 로그를 단일 파이프라인으로 통합',
                                        en: 'Logs scattered across services now flow through one pipeline'
                                    },
                                    {
                                        ko: '지표 요청이 올 때마다 반복하던 추출 작업을 자동화로 대체',
                                        en: 'The extraction repeated on every metric request is now automated'
                                    },
                                ],
                            },
                            {
                                text: {ko: '유지보수 비용 절감', en: 'Lower maintenance cost'},
                                children: [
                                    {
                                        ko: 'Python 수집기 일곱 개를 걷고 Kotlin 서버 하나로 — 레거시 통계 코드 제거 커밋 하나로 끝났다',
                                        en: 'Seven Python collectors replaced by one Kotlin server — the legacy statistics code left in a single commit'
                                    },
                                    {
                                        ko: '잡 하나를 더하는 일이 Reader · Job · Entity 한 벌이라 영향 범위가 그 셋으로 닫힌다',
                                        en: 'Adding a job is one Reader, Job and Entity set, so the blast radius closes on those three'
                                    },
                                ],
                            },
                            {
                                text: {ko: '남은 것', en: 'What remains'},
                                children: [
                                    {
                                        ko: 'BigQuery 예외를 삼켜 «성공 0행»으로 보이는 자리와 전체 동기화 실패 시 빈 테이블 — 알고 있고 아직 안 고쳤다',
                                        en: 'A swallowed BigQuery exception that reads as "0 rows, success", and an empty table if a full sync fails — known, not yet fixed'
                                    },
                                ],
                            },
                            {
                                text: {ko: '의사결정 속도 개선', en: 'Faster decision-making'},
                                children: [
                                    {
                                        ko: '경영 지표를 대시보드에서 상시 확인 가능한 상태로 전환',
                                        en: 'Business metrics became continuously visible on a dashboard'
                                    },
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
        role: {ko: 'Full-Stack Engineer', en: 'Full-Stack Engineer'},
        summary: {
            ko: '무인 도서관 기기 · 서버 · 앱을 한 플랫폼으로 묶고 검색 병목을 걷어낸 고도화.',
            en: 'Modernization that tied kiosks, server and app into one platform and removed the search bottleneck.',
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
        story: {
            problem: {
                ko: '소켓 미들웨어 뒤에서 검색 p99 가 7.5초. 연결 유실과 스레드 락이 반복됐고 스택은 Node · Angular · Go 로 갈라져 있었다.',
                en: 'Search p99 was 7.5s behind a socket middleware that kept dropping connections and locking threads; the stack was split across Node, Angular and Go.',
            },
            action: {
                ko: 'Spring RoutingDataSource 로 기기 DB 에 직접 붙여 미들웨어를 걷고, 스택을 Java/Spring 하나로 모으고, 하이브리드 앱을 두 스토어에 출시.',
                en: 'Routed straight to kiosk databases with Spring RoutingDataSource and removed the middleware, unified the stack on Java/Spring, shipped the hybrid app to both stores.',
            },
            result: {
                ko: 'p99 7.5s → 93ms (약 80배 · 100 vu/s 검증). 유지보수 단위 3 → 1, 조회 단계 4 → 2.',
                en: 'p99 7.5s → 93ms (~80x, verified at 100 vu/s). Maintenance units 3 → 1, browsing steps 4 → 2.',
            },
        },
        stacks: ['Java', 'Spring', 'MyBatis / JPA', 'MS-SQL', 'Android · iOS'],
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
                                    {
                                        ko: '무인 대출·반납 기기와 중앙 서버를 표준 연동 규격으로 연결',
                                        en: 'Connected kiosks to the central server through a standard integration spec'
                                    },
                                    {
                                        ko: '관리자 프로그램에서 현장 상태를 일괄 확인 가능하도록 개선',
                                        en: 'Made field status visible in one place from the admin program'
                                    },
                                ],
                            },
                            {
                                text: {ko: '레거시 스택 정리', en: 'Cleaning up the legacy stack'},
                                children: [
                                    {
                                        ko: 'Node.js, Angular, Go 등 파편화된 스택을 Java/Spring 기반으로 통합',
                                        en: 'Consolidated a fragmented Node.js/Angular/Go stack onto Java/Spring'
                                    },
                                    {
                                        ko: '기술 스택 단일화로 인수인계와 유지보수 난이도 완화',
                                        en: 'A single stack made handover and maintenance markedly easier'
                                    },
                                ],
                            },
                            {
                                text: {ko: '이용자 접점 강화', en: 'Strengthening user touchpoints'},
                                children: [
                                    {
                                        ko: '자체 하이브리드 앱을 Play Store · App Store에 정식 출시',
                                        en: 'Released our own hybrid app on the Play Store and App Store'
                                    },
                                    {
                                        ko: '외부 도서 API를 연계해 검색 결과의 정보량 확대',
                                        en: 'Enriched search results by integrating external book APIs'
                                    },
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
                            {
                                value: '80x',
                                label: {ko: '검색 응답 속도', en: 'Search response speed'},
                                delta: 'p99 7.5s → 93ms'
                            },
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
                                    {
                                        ko: 'Google Play Store 및 Apple App Store 런칭',
                                        en: 'Launched on the Google Play Store and Apple App Store'
                                    },
                                    {
                                        ko: '모바일 서비스 운영·배포 체계 구축',
                                        en: 'Established a mobile release and operations process'
                                    },
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
                                    {
                                        ko: '파편화된 인기도서 메뉴를 인기·연관 도서 추천 엔진으로 결합',
                                        en: 'Merged scattered popular-book menus into a popularity and relatedness engine'
                                    },
                                    {
                                        ko: '검색 컨텍스트 안에서 추천 도서 접근성 개선',
                                        en: 'Made recommendations reachable within the search context'
                                    },
                                ],
                            },
                            {
                                text: {ko: '모바일 앱 사용성 최적화', en: 'Mobile usability tuning'},
                                children: [
                                    {
                                        ko: '웹뷰 로딩 중 흰 화면 깜빡임을 스플래시 동기화로 개선',
                                        en: 'Removed the white flash during WebView load by syncing the splash screen'
                                    },
                                    {
                                        ko: '하이브리드 제스처 브릿지로 네이티브 수준의 인터랙션 제공',
                                        en: 'Delivered native-level interaction through a hybrid gesture bridge'
                                    },
                                ],
                            },
                            {
                                text: {ko: 'iOS 환경 대응 강화', en: 'Better iOS support'},
                                children: [
                                    {
                                        ko: '아이폰 노치 영역 대응 풀스크린 최적화',
                                        en: 'Full-screen optimization around the iPhone notch'
                                    },
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
                                        text: {
                                            ko: '분산 기기 도서 목록 통합 조회 필요',
                                            en: 'A unified view over books spread across kiosks was needed'
                                        },
                                        children: [
                                            {
                                                ko: '관할지별로 물리 분산된 스마트도서관 기기 DB 조회',
                                                en: 'Kiosk databases were physically distributed by jurisdiction'
                                            },
                                            {
                                                ko: '이용자는 하나의 검색 화면에서 전체 도서 목록 확인 필요',
                                                en: 'Users expected the full catalog on one search screen'
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                step: 'T',
                                label: 'Task & Problem',
                                media: {
                                    src: SmartLibrarySearchBeforeImg,
                                    alt: {
                                        ko: '기존 3-Tier 소켓 미들웨어 구조도',
                                        en: 'Diagram of the legacy three-tier socket middleware'
                                    },
                                    caption: {
                                        ko: '기존 3-Tier 소켓 미들웨어 구조 (Gandalf / Frodo)',
                                        en: 'Legacy three-tier socket middleware (Gandalf / Frodo)'
                                    },
                                    frame: 'light',
                                },
                                items: [
                                    {
                                        text: {
                                            ko: '3-Tier 소켓 미들웨어 병목 발생',
                                            en: 'The three-tier socket middleware was the bottleneck'
                                        },
                                        children: [
                                            {
                                                ko: '서버(Gandalf) - 장비(Frodo) 간 양방향 통신 의존',
                                                en: 'Everything depended on bidirectional server (Gandalf) to device (Frodo) traffic'
                                            },
                                            {
                                                ko: '연결 유실, 스레드 락킹, 검색 지연이 반복 발생',
                                                en: 'Dropped connections, thread locking and search latency recurred'
                                            },
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
                                            {
                                                ko: 'Spring RoutingDataSource 기반 동적 DB 라우팅 구현',
                                                en: 'Implemented dynamic DB routing with Spring RoutingDataSource'
                                            },
                                            {
                                                ko: '미들웨어를 거치지 않고 서버에서 각 기기 DB로 직접 연결',
                                                en: 'The server connects to each kiosk DB directly, bypassing middleware'
                                            },
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
                                            {
                                                ko: 'Gandalf/Frodo 양방향 미들웨어 레이어 제거',
                                                en: 'Removed the bidirectional Gandalf/Frodo middleware layer'
                                            },
                                            {
                                                ko: '유지보수 단위를 3개에서 1개로 단일화',
                                                en: 'Consolidated three maintenance units into one'
                                            },
                                        ],
                                    },
                                    {
                                        text: {ko: '검색 응답 성능 80배 개선', en: 'Search response improved ~80x'},
                                        children: [
                                            {
                                                ko: 'p99 응답시간을 7.5초에서 93ms로 단축',
                                                en: 'p99 latency dropped from 7.5s to 93ms'
                                            },
                                            {
                                                ko: '부하 조건을 5 vu/s에서 100 vu/s까지 확대 검증',
                                                en: 'Verified under load from 5 vu/s up to 100 vu/s'
                                            },
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
                                alt: {
                                    ko: 'Artillery 부하 테스트 개선 전 결과',
                                    en: 'Artillery load test result before the change'
                                },
                                caption: {ko: '최대 7.5s 지연 (동시성 5 vu/s)', en: 'Up to 7.5s latency at 5 vu/s'},
                                frame: 'light',
                            },
                        },
                        after: {
                            label: 'After',
                            media: {
                                src: SmartLibraryArtilleryAfterImg,
                                alt: {
                                    ko: 'Artillery 부하 테스트 개선 후 결과',
                                    en: 'Artillery load test result after the change'
                                },
                                caption: {
                                    ko: 'p99 93ms로 안정 수렴 (동시성 100 vu/s)',
                                    en: 'Settles at p99 93ms under 100 vu/s'
                                },
                                frame: 'light',
                            },
                        },
                    },
                    {
                        kind: 'metrics',
                        label: {ko: '성능 테스트 지표', en: 'Load test results'},
                        items: [
                            {value: '93ms', label: {ko: 'p99 응답시간', en: 'p99 latency'}, delta: '7.5s → 93ms'},
                            {
                                value: '100 vu/s',
                                label: {ko: '검증 동시성', en: 'Verified concurrency'},
                                delta: '5 vu/s → 100 vu/s'
                            },
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
                            caption: {
                                ko: '다중 기기 DB 연동 도서 검색 웹앱',
                                en: 'Search web app querying multiple kiosk databases'
                            },
                            frame: 'card',
                        },
                    },
                ],
            },
        ],
    },
];


export default projects;
