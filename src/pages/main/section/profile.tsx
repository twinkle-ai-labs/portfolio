import React from 'react';
import config from "@Data/config";

const profileCards = [
    {
        title: 'Career Summary',
        items: [
            '5년차 Product Engineer (Backend & DevOps & Fullstack)',
            'INAVI Systems에서 DB 설계, API 개발, 테스트 반영, 인프라, CI/CD, 운영 관측 경험',
            'Nicom에서 10개+ 프로젝트와 관리자 솔루션 풀스택 개발 경험',
        ],
    },
    {
        title: 'Certificates',
        items: [
            '정보처리기사',
            'SQLD',
            '리눅스마스터 2급',
        ],
    },
];

const capabilityCards = [
    {
        label: 'Backend Delivery',
        description: 'Figma 기획서와 요구사항을 바탕으로 DB 구조, API, 배치, 인증, 데이터 접근 계층을 설계하고 구현합니다.',
    },
    {
        label: 'Infra / Delivery',
        description: 'AWS/GCP 인프라, Docker, Harbor, Jenkins 기반 CI/CD 파이프라인을 구성하고 배포 흐름을 자동화합니다.',
    },
    {
        label: 'Operation',
        description: 'Filebeat와 Slack으로 장애 알림을 연결하고 Prometheus, Grafana로 리소스와 서비스 상태를 관측합니다.',
    },
    {
        label: 'Full-stack Background',
        description: '백오피스, 하이브리드 웹앱, API, 배치, 도서관 자동화 시스템 등 다양한 서비스 화면과 서버 흐름을 경험했습니다.',
    },
];

const ProfileSection = () => {
    return (
        <section id="s_profile" className="section profile-section">
            <div className="profile-summary-layout">
                <div className="profile-summary-copy" data-aos="fade-up">
                    <p className="section-eyebrow">Profile</p>
                    <h2 className="section-title">Profile Summary</h2>
                    <p className="section-subtitle">
                        {config.profile.name.korean}은 풀스택 개발 경험을 기반으로 백엔드 개발과 운영 영역을 확장해 온 엔지니어입니다.
                        요구사항을 구현 가능한 구조로 바꾸고, 배포와 관측까지 고려해 서비스가 안정적으로 이어지도록 설계합니다.
                    </p>
                </div>
                <div className="profile-summary-grid" data-aos="fade-up" data-aos-delay={100}>
                    {profileCards.map((card) => (
                        <article className="profile-summary-card" key={card.title}>
                            <h3>{card.title}</h3>
                            <ul>
                                {card.items.map((item) => (
                                    <li key={card.title + item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
            <div className="profile-capability-grid" data-aos="fade-up" data-aos-delay={200}>
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
