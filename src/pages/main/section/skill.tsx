import React from 'react';
import translations from '@Data/i18n';
import {useLocale} from '@Utils/i18n';

/** 그룹 제목·설명은 번역 카탈로그(i18n.skill.groups)와 순서를 맞춥니다. 기술명은 고유명사라 그대로 둡니다. */
const skillGroups = [
    {
        id: 'backend',
        sections: [
            {label: 'Language', items: ['Java', 'Kotlin']},
            {label: 'Framework', items: ['Spring Boot', 'Spring MVC', 'Spring WebFlux', 'Spring Security']},
            {label: 'Persistence', items: ['MyBatis', 'JPA/QueryDSL']},
            {label: 'Build Tool', items: ['Maven', 'Gradle']},
        ],
    },
    {
        id: 'product',
        sections: [
            {label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS']},
            {label: 'Hybrid App', items: ['Android WebView', 'iOS WebView']},
            {label: 'Design Handoff', items: ['Figma']},
        ],
    },
    {
        id: 'data',
        sections: [
            {label: 'Database', items: ['MySQL', 'MS-SQL', 'PostgreSQL']},
            {label: 'Analytics', items: ['BigQuery']},
            {label: 'Batch', items: ['Spring Batch', 'Quartz']},
        ],
    },
    {
        id: 'infra',
        sections: [
            {label: 'Cloud', items: ['AWS', 'GCP']},
            {label: 'Deploy', items: ['Docker', 'Jenkins', 'Harbor', 'Nginx']},
            {label: 'Monitoring', items: ['Filebeat', 'Slack', 'Prometheus', 'Grafana']},
        ],
    },
    {
        id: 'collaboration',
        sections: [
            {label: 'Process', items: ['Agile', 'Scrum', 'Jira', 'Confluence']},
            {label: 'Version Control', items: ['Git', 'Bitbucket', 'GitHub']},
            {label: 'Communication', items: ['Slack']},
        ],
    },
];

const SkillSection = () => {
    const {language} = useLocale();
    const t = translations[language].skill;

    return (
        <section id="s_skill" className="section skill-section">
            <div className="section-head">
                <p className="section-eyebrow">{t.eyebrow}</p>
                <h2 className="section-title">{t.title[0]}<br className="mobile"/> <em>{t.title[1]}</em></h2>
                <p className="section-subtitle">{t.subtitle}</p>
            </div>
            <div className="section-content">
                <div className="skill-matrix">
                    {skillGroups.map((group, index) => (
                        <article className="skill-row" key={group.id}>
                            <div className="skill-row-copy">
                                <h3>{t.groups[index].title}</h3>
                                <p>{t.groups[index].summary}</p>
                            </div>
                            <div className="skill-section-list">
                                {group.sections.map((section) => (
                                    <div className="skill-category" key={group.id + section.label}>
                                        <div className="skill-category-label">{section.label}</div>
                                        <ul className="skill-tags">
                                            {section.items.map((skill) => (
                                                <li key={group.id + section.label + skill}>{skill}</li>
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
