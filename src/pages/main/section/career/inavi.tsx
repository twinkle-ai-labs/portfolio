import React from 'react';

const InaviContent = () => {
    return (
        <>
            <div className={"title"}>수행 업무: <b>아이나비 서비스 백엔드 개발 · 운영</b></div>
            <div className={"desc"}>
                <ul>
                    <li>아이나비 스탬프 오르다 MVP부터 운영 안정화와 기능 확장 담당</li>
                    <li>AWS, Docker, Jenkins, Harbor 기반 배포 흐름과 운영 환경 개선</li>
                    <li>Prometheus, Grafana 기반 모니터링과 Slack 알림으로 관측 체계 구축</li>
                    <li>BigQuery, Batch, Grafana를 활용한 내비게이션 통합통계 시스템 개발</li>
                </ul>
            </div>
            <div>
                주요 프로젝트는 <b>아이나비 스탬프 오르다</b>와 <br className={"pc"}/>
                <b>내비게이션 통합통계 시스템</b>입니다.
            </div>
        </>
    );
};

export default InaviContent;
