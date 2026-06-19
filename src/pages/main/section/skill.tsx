import React from 'react';

const skillGroups = [
    {
        title: 'Backend',
        summary: 'Kotlin·Java와 Spring 기반으로 API, 배치, 인증, 데이터 접근 계층을 구현합니다.',
        sections: [
            {label: 'Language', items: ['Java', 'Kotlin']},
            {label: 'Framework', items: ['Spring Boot', 'Spring MVC', 'Spring WebFlux', 'Spring Security']},
            {label: 'Persistence', items: ['MyBatis', 'JPA/QueryDSL']},
            {label: 'Build Tool', items: ['Maven', 'Gradle']},
        ],
    },
    {
        title: 'Product / Full-stack',
        summary: '백오피스, 하이브리드 앱, 관리자 화면, 외부 연동 API까지 서비스 흐름을 연결합니다.',
        sections: [
            {label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS']},
            {label: 'Hybrid App', items: ['Android WebView', 'iOS WebView']},
            {label: 'Design Handoff', items: ['Figma']},
        ],
    },
    {
        title: 'Data / Batch',
        summary: '운영 로그와 서비스 데이터를 수집·가공하고 정기 집계 흐름을 설계합니다.',
        sections: [
            {label: 'Database', items: ['MySQL', 'MS-SQL', 'PostgreSQL']},
            {label: 'Analytics', items: ['BigQuery']},
            {label: 'Batch', items: ['Spring Batch', 'Quartz']},
        ],
    },
    {
        title: 'Infra / Operation',
        summary: '배포 파이프라인과 운영 관측 환경을 구성해 서비스 상태를 추적합니다.',
        sections: [
            {label: 'Cloud', items: ['AWS', 'GCP']},
            {label: 'Deploy', items: ['Docker', 'Jenkins', 'Harbor', 'Nginx']},
            {label: 'Monitoring', items: ['Filebeat', 'Slack', 'Prometheus', 'Grafana']},
        ],
    },
    {
        title: 'Collaboration',
        summary: 'Scrum 기반 협업에서 PM, 기획, 디자인, 앱, 어드민과 서버 개발을 조율합니다.',
        sections: [
            {label: 'Process', items: ['Agile', 'Scrum', 'Jira', 'Confluence']},
            {label: 'Version Control', items: ['Git', 'Bitbucket', 'GitHub']},
            {label: 'Communication', items: ['Slack']},
        ],
    },
];

const SkillSection = () => {
    return (
        <section id="s_skill" className="section skill-section">
            <p className="section-eyebrow">Skills</p>
            <h2 className="section-title">Tech Stack</h2>
            <p className="section-subtitle">
                단순 목록이 아니라 실제 서비스 개발, 배포, 운영에서 사용한 맥락을 기준으로 분류했습니다.
            </p>
            <div className="section-content">
                <div className="skill-matrix">
                    {skillGroups.map((group) => (
                        <article className="skill-row" key={group.title} data-aos="fade-up">
                            <div className="skill-row-copy">
                                <h3>{group.title}</h3>
                                <p>{group.summary}</p>
                            </div>
                            <div className="skill-section-list">
                                {group.sections.map((section) => (
                                    <div className="skill-category" key={group.title + section.label}>
                                        <div className="skill-category-label">{section.label}</div>
                                        <ul className="skill-tags">
                                            {section.items.map((skill) => (
                                                <li key={group.title + section.label + skill}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillSection;
