import React from 'react';

type ProfileItem = string | {
    label: string;
    date?: string;
};

const profileCards = [
    {
        title: 'Professional Journey',
        items: [
            '설계부터 운영까지 책임지는 만 5년 차 백엔드 엔지니어',
            '아이나비시스템즈 — 데이터 모델 설계, 통계 파이프라인, CI/CD 인프라 구축 주도',
            '나이콤 — 스마트도서관·출입통제 등 10개+ 솔루션 전주기 개발',
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
        label: 'Reliable Backend',
        title: '견고한 백엔드',
        description: '도메인 책임을 명확히 나누고 데이터 계층을 분리해, 믿고 운영할 수 있는 서버를 만듭니다.',
    },
    {
        label: 'Automated Delivery',
        title: '배포 자동화',
        description: 'Docker · Jenkins · Harbor로 빌드부터 릴리즈까지 손댈 일 없는 파이프라인을 만듭니다.',
    },
    {
        label: 'Observability',
        title: '운영 관측',
        description: 'Prometheus · Grafana · Filebeat로 시스템과 비즈니스 지표를 항상 지켜봅니다.',
    },
    {
        label: 'Holistic View',
        title: '전체를 보는 시야',
        description: '풀스택 경험으로 아키텍처의 전체 흐름을 구조화하고, 시스템 복잡도를 낮춥니다.',
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
                        돌아가는 코드를 넘어, 비즈니스가 커져도 흔들리지 않는 구조를 만듭니다.
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
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ProfileSection;
