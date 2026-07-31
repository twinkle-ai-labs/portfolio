import React, {ReactNode} from 'react';
import {
    SiAmazonec2,
    SiAmazonrds,
    SiAmazonroute53,
    SiAmazons3,
    SiAndroid,
    SiApple,
    SiAwslambda,
    SiDocker,
    SiElasticstack,
    SiGooglebigquery,
    SiGooglecloud,
    SiGrafana,
    SiHarbor,
    SiJenkins,
    SiKotlin,
    SiMysql,
    SiPrometheus,
    SiSlack,
    SiSpringboot,
} from 'react-icons/si';
import {
    FaBell,
    FaBook,
    FaClockRotateLeft,
    FaCodeBranch,
    FaCube,
    FaDatabase,
    FaDesktop,
    FaGaugeHigh,
    FaLayerGroup,
    FaMobileScreenButton,
    FaServer,
    FaShieldHalved,
    FaTableColumns,
    FaTowerBroadcast,
    FaUsers,
} from 'react-icons/fa6';
import {LocalizedText, useLocale} from '@Utils/i18n';

export type DiagramTone = 'blue' | 'violet' | 'green' | 'amber' | 'rose' | 'neutral';

export interface IDiagramNode {
    /** 제품·서비스 고유명사는 번역하지 않으므로 문자열도 허용합니다. */
    label: LocalizedText | string;
    sub?: LocalizedText;
    icon?: ReactNode;
    tone?: DiagramTone;
}

export interface IDiagramTier {
    label: string;
    caption?: LocalizedText;
    tone?: DiagramTone;
    nodes: IDiagramNode[];
}

const DiagramNode = ({node}: { node: IDiagramNode }) => {
    const {t} = useLocale();
    return (
        <div className={`dgm-node tone-${node.tone || 'neutral'}`}>
            {node.icon ? <span className="dgm-node-icon">{node.icon}</span> : null}
            <span className="dgm-node-text">
                <strong>{t(node.label)}</strong>
                {node.sub ? <span>{t(node.sub)}</span> : null}
            </span>
        </div>
    );
};

/**
 * 계층형(Tier) 구조 다이어그램.
 * 상위 티어에서 하위 티어로 데이터가 흐르는 아키텍처 표현에 사용합니다.
 */
export const TierDiagram = ({tiers, caption}: { tiers: IDiagramTier[]; caption?: LocalizedText }) => {
    const {t} = useLocale();
    return (
        <figure className="dgm dgm-tier-diagram">
            <div className="dgm-tier-stack">
                {tiers.map((tier, index) => (
                    <React.Fragment key={tier.label}>
                        <div className={`dgm-tier tone-${tier.tone || 'neutral'}`}>
                            <div className="dgm-tier-head">
                                <span className="dgm-tier-label">{tier.label}</span>
                                {tier.caption ? <span className="dgm-tier-caption">{t(tier.caption)}</span> : null}
                            </div>
                            <div className="dgm-node-row">
                                {tier.nodes.map((node) => (
                                    <DiagramNode key={tier.label + t(node.label)} node={node}/>
                                ))}
                            </div>
                        </div>
                        {index < tiers.length - 1 ? <span className="dgm-tier-arrow" aria-hidden="true"/> : null}
                    </React.Fragment>
                ))}
            </div>
            {caption ? <figcaption className="dgm-caption">{t(caption)}</figcaption> : null}
        </figure>
    );
};

/**
 * 좌 → 우로 이어지는 파이프라인 다이어그램.
 * 빌드/배포, 데이터 수집 같은 순차 처리 흐름 표현에 사용합니다.
 */
export const PipelineDiagram = ({stages, caption}: { stages: IDiagramNode[]; caption?: LocalizedText }) => {
    const {t} = useLocale();
    return (
        <figure className="dgm dgm-pipeline-diagram">
            <ol className="dgm-pipeline">
                {stages.map((stage, index) => (
                    <li key={t(stage.label)} className={`dgm-stage tone-${stage.tone || 'neutral'}`}>
                        <span className="dgm-stage-index">{String(index + 1).padStart(2, '0')}</span>
                        {stage.icon ? <span className="dgm-node-icon">{stage.icon}</span> : null}
                        <strong className="dgm-stage-label">{t(stage.label)}</strong>
                        {stage.sub ? <span className="dgm-stage-sub">{t(stage.sub)}</span> : null}
                    </li>
                ))}
            </ol>
            {caption ? <figcaption className="dgm-caption">{t(caption)}</figcaption> : null}
        </figure>
    );
};

/* ==========================================================================
   생성 리소스 — 스크린샷이 없는 프로젝트를 위한 아키텍처 다이어그램
   ========================================================================== */

/** 오르다: AWS 클라우드 인프라 토폴로지 */
export const AwsTopologyDiagram = () => (
    <TierDiagram
        caption={{ko: 'AWS 기반 오르다 인프라 토폴로지', en: 'ORDA infrastructure topology on AWS'}}
        tiers={[
            {
                label: 'Edge',
                caption: {ko: '도메인 · 트래픽 분배', en: 'Domain · traffic distribution'},
                tone: 'violet',
                nodes: [
                    {label: 'Route 53', sub: {ko: 'DNS / 도메인', en: 'DNS / domains'}, icon: <SiAmazonroute53/>, tone: 'violet'},
                    {label: 'ALB', sub: {ko: 'HTTPS 종단 · 라우팅', en: 'HTTPS termination · routing'}, icon: <FaTowerBroadcast/>, tone: 'violet'},
                ],
            },
            {
                label: 'Application',
                caption: {ko: '컨테이너 기반 API 서버', en: 'Container-based API servers'},
                tone: 'blue',
                nodes: [
                    {label: 'EC2', sub: {ko: 'Docker 런타임', en: 'Docker runtime'}, icon: <SiAmazonec2/>, tone: 'blue'},
                    {label: 'Spring Boot', sub: {ko: 'Kotlin API', en: 'Kotlin API'}, icon: <SiSpringboot/>, tone: 'blue'},
                    {label: 'Lambda', sub: {ko: '비동기 후처리', en: 'Async post-processing'}, icon: <SiAwslambda/>, tone: 'blue'},
                ],
            },
            {
                label: 'Data',
                caption: {ko: '영속 계층 · 정적 자산', en: 'Persistence · static assets'},
                tone: 'green',
                nodes: [
                    {label: 'RDS', sub: {ko: '트랜잭션 DB', en: 'Transactional DB'}, icon: <SiAmazonrds/>, tone: 'green'},
                    {label: 'S3', sub: {ko: '이미지 · 스탬프 자산', en: 'Image & stamp assets'}, icon: <SiAmazons3/>, tone: 'green'},
                ],
            },
        ]}
    />
);

/** 오르다: 빌드 · 배포 자동화 파이프라인 */
export const CicdPipelineDiagram = () => (
    <PipelineDiagram
        caption={{ko: 'Jenkins · Harbor 기반 배포 자동화 파이프라인', en: 'Deployment automation pipeline on Jenkins and Harbor'}}
        stages={[
            {label: 'Commit', sub: {ko: '브랜치 전략 기반 형상 관리', en: 'Branch-strategy source control'}, icon: <FaCodeBranch/>, tone: 'neutral'},
            {label: 'Jenkins', sub: {ko: '빌드 · 테스트 자동 트리거', en: 'Automated build & test triggers'}, icon: <SiJenkins/>, tone: 'blue'},
            {label: 'Docker', sub: {ko: '이미지 빌드 · 태깅', en: 'Image build & tagging'}, icon: <SiDocker/>, tone: 'blue'},
            {label: 'Harbor', sub: {ko: '사설 레지스트리 적재', en: 'Private registry push'}, icon: <SiHarbor/>, tone: 'violet'},
            {label: 'Deploy', sub: {ko: 'EC2 무중단 롤아웃', en: 'Zero-downtime rollout to EC2'}, icon: <SiAmazonec2/>, tone: 'green'},
        ]}
    />
);

/** 오르다: 로그 수집 · 관측 체계 */
export const ObservabilityDiagram = () => (
    <TierDiagram
        caption={{ko: 'Filebeat · Prometheus · Grafana 관측 체계', en: 'Observability stack on Filebeat, Prometheus and Grafana'}}
        tiers={[
            {
                label: 'Collect',
                caption: {ko: '로그 · 메트릭 수집', en: 'Log & metric collection'},
                tone: 'blue',
                nodes: [
                    {label: 'Filebeat', sub: {ko: '애플리케이션 로그 추적', en: 'Application log shipping'}, icon: <SiElasticstack/>, tone: 'blue'},
                    {label: 'Exporter', sub: {ko: '시스템 자원 메트릭', en: 'System resource metrics'}, icon: <FaGaugeHigh/>, tone: 'blue'},
                ],
            },
            {
                label: 'Store & Rule',
                caption: {ko: '시계열 저장 · 임계치 판정', en: 'Time-series storage · threshold rules'},
                tone: 'amber',
                nodes: [
                    {label: 'Prometheus', sub: {ko: '시계열 저장 · 알림 룰', en: 'Time-series store & alert rules'}, icon: <SiPrometheus/>, tone: 'amber'},
                ],
            },
            {
                label: 'Observe',
                caption: {ko: '시각화 · 선제 통보', en: 'Visualization · proactive alerting'},
                tone: 'green',
                nodes: [
                    {label: 'Grafana', sub: {ko: '대시보드 · 임계치 패널', en: 'Dashboards & threshold panels'}, icon: <SiGrafana/>, tone: 'green'},
                    {label: 'Slack', sub: {ko: '장애 알림 채널 연동', en: 'Incident alert channel'}, icon: <SiSlack/>, tone: 'green'},
                    {label: 'On-call', sub: {ko: '선제 대응 · 원인 추적', en: 'Proactive response & root cause'}, icon: <FaBell/>, tone: 'green'},
                ],
            },
        ]}
    />
);

/** 통합통계: 도메인 분리(DDD) 구조 */
export const DomainContextDiagram = () => (
    <TierDiagram
        caption={{ko: '수집 · 배치 · 조회 컨텍스트 분리 구조', en: 'Collection, batch and query contexts kept separate'}}
        tiers={[
            {
                label: 'Collection Context',
                caption: {ko: '원시 로그 인입', en: 'Raw log ingestion'},
                tone: 'blue',
                nodes: [
                    {
                        label: {ko: '아이나비 에어', en: 'INAVI AIR'},
                        sub: {ko: '내비게이션 사용 로그', en: 'Navigation usage logs'},
                        icon: <FaMobileScreenButton/>,
                        tone: 'blue',
                    },
                    {
                        label: {ko: '토요타 하이브리드', en: 'Toyota hybrid'},
                        sub: {ko: '차량 연동 로그', en: 'In-vehicle logs'},
                        icon: <FaCube/>,
                        tone: 'blue',
                    },
                    {
                        label: {ko: '수집 API', en: 'Ingestion API'},
                        sub: {ko: '스키마 검증 · 적재', en: 'Schema validation & load'},
                        icon: <FaServer/>,
                        tone: 'blue',
                    },
                ],
            },
            {
                label: 'Batch Context',
                caption: {ko: '정기 집계 · 정제', en: 'Scheduled aggregation & cleansing'},
                tone: 'amber',
                nodes: [
                    {label: 'BigQuery', sub: {ko: '일 단위 파티션 원본', en: 'Daily-partitioned source'}, icon: <SiGooglebigquery/>, tone: 'amber'},
                    {
                        label: 'Quartz Batch',
                        sub: {ko: '일 · 월 집계 스케줄', en: 'Daily & monthly schedules'},
                        icon: <FaClockRotateLeft/>,
                        tone: 'amber',
                    },
                ],
            },
            {
                label: 'Query Context',
                caption: {ko: '사용자 · 경영 지표 조회', en: 'User & business metric queries'},
                tone: 'green',
                nodes: [
                    {label: 'MySQL', sub: {ko: '집계 결과 적재', en: 'Aggregated result store'}, icon: <SiMysql/>, tone: 'green'},
                    {label: 'Grafana', sub: {ko: '실시간 분석 대시보드', en: 'Real-time analytics dashboard'}, icon: <SiGrafana/>, tone: 'green'},
                ],
            },
        ]}
    />
);

/** 통합통계: 로그 수집 → 지표 표출 파이프라인 */
export const StatisticsPipelineDiagram = () => (
    <PipelineDiagram
        caption={{
            ko: '원시 로그 인입부터 경영 지표 표출까지의 데이터 흐름',
            en: 'Data flow from raw log ingestion to business metric reporting',
        }}
        stages={[
            {
                label: {ko: '서비스 로그', en: 'Service logs'},
                sub: {ko: '다수 내비게이션 서비스 인입', en: 'Ingested from multiple navigation services'},
                icon: <FaUsers/>,
                tone: 'neutral',
            },
            {
                label: {ko: 'GCP 적재', en: 'Load into GCP'},
                sub: {ko: 'BigQuery 일 단위 파티션', en: 'BigQuery daily partitions'},
                icon: <SiGooglecloud/>,
                tone: 'blue',
            },
            {
                label: {ko: '정기 배치', en: 'Scheduled batch'},
                sub: {ko: 'Quartz 스케줄 집계 · 정제', en: 'Quartz-scheduled aggregation'},
                icon: <FaClockRotateLeft/>,
                tone: 'amber',
            },
            {
                label: {ko: '통계 적재', en: 'Statistics store'},
                sub: {ko: 'MySQL 집계 테이블 엔진', en: 'MySQL aggregate table engine'},
                icon: <SiMysql/>,
                tone: 'violet',
            },
            {
                label: {ko: '지표 표출', en: 'Metric reporting'},
                sub: {ko: 'Grafana 대시보드 시각화', en: 'Grafana dashboard visualization'},
                icon: <FaTableColumns/>,
                tone: 'green',
            },
        ]}
    />
);

/** 통합통계: 운영·유지보수 대상 서비스 범위 */
export const OperationScopeDiagram = () => (
    <TierDiagram
        caption={{ko: '운영 · 유지보수 전담 서비스 범위', en: 'Services under my direct operations ownership'}}
        tiers={[
            {
                label: 'Service',
                caption: {ko: '운영 대상 내비게이션 서비스', en: 'Navigation services in operation'},
                tone: 'blue',
                nodes: [
                    {
                        label: {ko: '아이나비 에어', en: 'INAVI AIR'},
                        sub: {ko: '커넥티드 내비게이션', en: 'Connected navigation'},
                        icon: <FaMobileScreenButton/>,
                        tone: 'blue',
                    },
                    {
                        label: {ko: '토요타 하이브리드', en: 'Toyota hybrid'},
                        sub: {ko: '차량 임베디드 연동', en: 'Embedded in-vehicle integration'},
                        icon: <FaCube/>,
                        tone: 'blue',
                    },
                ],
            },
            {
                label: 'Ownership',
                caption: {ko: '전담 운영 범위', en: 'Scope I own'},
                tone: 'violet',
                nodes: [
                    {
                        label: {ko: '서버 운영', en: 'Server operations'},
                        sub: {ko: '배포 · 릴리즈 관리', en: 'Deployment & release management'},
                        icon: <SiSpringboot/>,
                        tone: 'violet',
                    },
                    {
                        label: {ko: '장애 대응', en: 'Incident response'},
                        sub: {ko: '원인 추적 · 핫픽스', en: 'Root cause analysis & hotfixes'},
                        icon: <FaShieldHalved/>,
                        tone: 'violet',
                    },
                    {
                        label: {ko: '기능 유지보수', en: 'Feature maintenance'},
                        sub: {ko: '레거시 개선 · 확장', en: 'Legacy improvement & extension'},
                        icon: <SiKotlin/>,
                        tone: 'violet',
                    },
                ],
            },
        ]}
    />
);

/** 스마트도서관: 기기 ↔ 중앙 서버 ↔ 채널 구조 */
export const SmartLibraryTopologyDiagram = () => (
    <TierDiagram
        caption={{
            ko: '무인 기기 · 중앙 서버 · 서비스 채널 연결 구조',
            en: 'How kiosks, the central server and service channels connect',
        }}
        tiers={[
            {
                label: 'Device',
                caption: {ko: '현장 무인 대출 · 반납 기기', en: 'On-site self-service kiosks'},
                tone: 'blue',
                nodes: [
                    {
                        label: {ko: '무인 기기', en: 'Kiosk'},
                        sub: {ko: '지하철역 등 물리 분산 설치', en: 'Distributed across subway stations'},
                        icon: <FaBook/>,
                        tone: 'blue',
                    },
                    {
                        label: {ko: '로컬 DB', en: 'Local DB'},
                        sub: {ko: '기기별 대출 이력 보관', en: 'Per-device loan history'},
                        icon: <FaDatabase/>,
                        tone: 'blue',
                    },
                ],
            },
            {
                label: 'Central',
                caption: {ko: '중앙 서버 · 외부 연계', en: 'Central server & external integrations'},
                tone: 'violet',
                nodes: [
                    {
                        label: {ko: '동기화 API', en: 'Sync API'},
                        sub: {ko: 'HTTPS 이벤트 수신', en: 'Receives events over HTTPS'},
                        icon: <FaServer/>,
                        tone: 'violet',
                    },
                    {
                        label: {ko: '라우팅 계층', en: 'Routing layer'},
                        sub: {ko: '다중 기기 DB 동적 조회', en: 'Dynamic multi-device DB queries'},
                        icon: <FaLayerGroup/>,
                        tone: 'violet',
                    },
                    {
                        label: {ko: '외부 도서 API', en: 'External book APIs'},
                        sub: {ko: '카카오 · 인터파크 · 정보나루', en: 'Kakao · Interpark · Data4Library'},
                        icon: <FaCube/>,
                        tone: 'violet',
                    },
                ],
            },
            {
                label: 'Channel',
                caption: {ko: '이용자 · 운영자 접점', en: 'User & operator touchpoints'},
                tone: 'green',
                nodes: [
                    {
                        label: {ko: '검색 웹앱', en: 'Search web app'},
                        sub: {ko: '통합 도서 검색', en: 'Unified book search'},
                        icon: <FaDesktop/>,
                        tone: 'green',
                    },
                    {label: 'Android', sub: {ko: 'Play Store 배포', en: 'Play Store release'}, icon: <SiAndroid/>, tone: 'green'},
                    {label: 'iOS', sub: {ko: 'App Store 배포', en: 'App Store release'}, icon: <SiApple/>, tone: 'green'},
                ],
            },
        ]}
    />
);
