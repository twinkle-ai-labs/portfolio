import React from 'react';

type ProfileItem = string | {
    label: string;
    date?: string;
};

const profileCards = [
    {
        title: 'Professional Journey',
        items: [
            '실무 만 5년을 기반으로 서비스 설계, 개발, 배포, 운영까지 책임지는 백엔드 엔지니어입니다.',
            '아이나비시스템즈(INAVI Systems)에서 클라우드 데이터 모델 설계, 고성능 API 엔지니어링, 대량의 통계 배치 파이프라인 및 CI/CD 인프라 구축 주도',
            '나이콤(Nicom)에서 10개 이상의 스마트 도서관 및 출입 통제 엔터프라이즈 솔루션 전주기 설계 및 개발',
        ],
    },
    {
        title: 'Expertise & Standards',
        items: [
            {label: '컴퓨터공학 학사'},
            {label: '국비지원 개발자 교육 수료', date: '2개월'},
            {label: '리눅스마스터 2급', date: '2024.07'},
            {label: 'SQL 개발자', date: '2022.07'},
            {label: '정보처리기사', date: '2019.05'},
        ],
    },
];

const capabilityCards = [
    {
        label: 'Reliable Core Backend',
        description: '요구사항 분석을 바탕으로 도메인 책임을 정교하게 식별하며, 최적화된 데이터 접근 계층과 도메인 로직을 격리하여 신뢰성 높은 백엔드를 만듭니다.',
    },
    {
        label: 'Automated Delivery Pipeline',
        description: 'AWS/GCP 클라우드 위에 Docker, Harbor, Jenkins를 조합하여 번거로운 빌드 및 릴리즈 프로세스를 물 흐르듯 가볍고 유연하게 자동화합니다.',
    },
    {
        label: 'Observed System Health',
        description: '운영의 핵심은 예측 가능성에 있다고 믿으며, Prometheus, Grafana, Filebeat를 통해 시스템 리소스와 비즈니스 지표를 정밀하게 관측하고 관제합니다.',
    },
    {
        label: 'Holistic Engineering View',
        description: '풀스택 배경을 바탕으로 전체적인 아키텍처 흐름을 직관적으로 구조화하며, 분산된 시스템 구조를 단순하게 통합하여 시스템 복잡도를 혁신적으로 낮춥니다.',
    },
];

const ProfileSection = () => {
    return (
        <section id="s_profile" className="section profile-section">
            <div className="profile-summary-layout">
                <div className="profile-summary-copy">
                    <p className="section-eyebrow">Engineering Philosophy</p>
                    <h2 className="section-title">보이지 않는 곳의 완성도가<br className="mobile" /> 서비스의 수준을 결정합니다</h2>
                    <p className="section-subtitle">
                        컴파일되는 코드를 넘어, 비즈니스의 성장 속도와 기술적 도전에 유연하게 대응할 수 있는
                        아키텍처를 지향합니다. 아래는 그 기준을 지켜온 발자취입니다.
                    </p>
                </div>
                <div className="profile-summary-grid">
                    {profileCards.map((card) => (
                        <article className="profile-summary-card" key={card.title}>
                            <h3>{card.title}</h3>
                            <ul>
                                {card.items.map((item: ProfileItem) => (
                                    <li key={card.title + (typeof item === 'string' ? item : item.label)}>
                                        {typeof item === 'string' ? item : (
                                            <>
                                                <strong className="profile-item-label">{item.label}</strong>
                                                {item.date && <span className="profile-item-date">({item.date})</span>}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
            <div className="profile-capability-grid">
                {capabilityCards.map((card) => (
                    <article className="profile-capability-card" key={card.label}>
                        <span>{card.label}</span>
                        <p>{card.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ProfileSection;
