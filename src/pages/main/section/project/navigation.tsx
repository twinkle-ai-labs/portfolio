import React from 'react';

const NavigationStatisticsContent = () => {
    return (
        <section className="project-modal-section section-margin-top-first">
            <h4 className="styled-heading">데이터 엔지니어링 및 분석 대시보드 구축</h4>
            <ul className="project-points">
                <li>다원화된 내비게이션 서비스의 대량 로그를 유실 없이 수집하고 일/월 단위 분석 데이터로 정제하는 백엔드 프로세스를 이끌었습니다.</li>
                <li>도메인 간 높은 응집도와 낮은 결합도를 지향해 유지보수의 품격을 한 단계 높였습니다.</li>
                <li>GCP 클라우드 내 BigQuery, Batch, Grafana를 연결하여 원시 데이터 유입부터 경영 지표 표출까지 하나의 선으로 연결된 아름다운 파이프라인을 실현했습니다.</li>
            </ul>
        </section>
    );
};

export default NavigationStatisticsContent;