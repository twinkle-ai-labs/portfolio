import React, {useState} from 'react';
import DevOpsCycle from '@Components/section/devops';
import config from '@Data/config';
import translations from '@Data/i18n';
import {useLocale} from '@Utils/i18n';

/**
 * capability 카드는 i18n 의 capabilities 배열과 순서를 맞춥니다.
 * flowId 는 아래 인피니티 다이어그램에서 함께 켜질 단계이며,
 * 'all' 은 특정 단계가 아니라 루프 전체를 가리킵니다.
 */
const capabilities = [
    {id: 'architecture', label: 'Architecture', flowId: 'all'},
    {id: 'design', label: 'Design', flowId: 'design'},
    {id: 'deliver', label: 'Deliver', flowId: 'deploy'},
    {id: 'observe', label: 'Observe', flowId: 'monitor'},
];

const ProfileSection = () => {
    const {language} = useLocale();
    const t = translations[language].profile;
    const name = language === 'ko' ? config.profile.name.korean : config.profile.name.english;
    const [activeId, setActiveId] = useState<string | null>(null);

    /** 문장 대신 라벨/값으로 읽는 시간을 줄입니다. */
    const facts = [
        {label: t.factCareer, value: t.careerValue, note: t.careerNote},
        {label: t.factEducation, value: t.educationValue, note: t.educationNote},
        {label: t.factCurrent, value: t.currentValue, note: t.currentNote},
        {label: t.factScope, value: t.scopeValue, note: t.scopeNote},
    ];

    return (
        <section id="s_profile" className="section profile-section">
            {/* 섹션 머리글은 인물 소개 — 철학은 아래 하위 블록으로 내려갑니다. */}
            <div className="section-head">
                <p className="section-eyebrow">{t.eyebrow}</p>
                <h2 className="section-title">{t.title[0]}<br className="mobile"/> <em>{name}</em></h2>
                <p className="section-subtitle">{t.subtitle}</p>
                <ul className="profile-tags">
                    {t.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
            </div>

            <div className="section-content">
                {/* 1) 내가 누구인가 — 훑어 읽는 팩트 + 자격증 */}
                <div className="profile-facts">
                    <dl className="profile-fact-list">
                        {facts.map((fact) => (
                            <div className="profile-fact" key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd>
                                    <strong>{fact.value}</strong>
                                    <span>{fact.note}</span>
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="profile-cert">
                        <span className="profile-cert-label">{t.certLabel}</span>
                        <ul className="profile-cert-list">
                            {t.certificates.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                </div>

                {/* 2) 무엇을 믿는가 */}
                <section className="profile-block">
                    <p className="profile-block-eyebrow">{t.philosophyEyebrow}</p>
                    <h3 className="profile-block-title">
                        {t.philosophyTitle[0]}<br className="mobile"/> <em>{t.philosophyTitle[1]}</em>
                    </h3>
                    <p className="profile-block-desc">{t.philosophyDesc}</p>
                </section>

                {/* 3) 어떻게 일하는가 — 왼쪽은 머리글 + 흐름(∞), 오른쪽은 그 흐름에서 맡는 일 */}
                <section className="profile-block">
                    <div className="profile-flow">
                        <div className="profile-flow-lead">
                            <p className="profile-block-eyebrow">{t.howEyebrow}</p>
                            <h3 className="profile-block-title">{t.howTitle}</h3>
                            <DevOpsCycle activeId={activeId} onHover={setActiveId}/>
                        </div>

                        <div className="profile-capability-grid">
                            {t.capabilities.map((card, index) => {
                                const meta = capabilities[index];
                                return (
                                    <article
                                        className={`profile-capability-card ${activeId === meta.flowId ? 'is-active' : ''}`}
                                        key={meta.id}
                                        onMouseEnter={() => setActiveId(meta.flowId)}
                                        onMouseLeave={() => setActiveId(null)}
                                    >
                                        <span className="profile-capability-label">{meta.label}</span>
                                        <h4>{card.title}</h4>
                                        <p>{card.desc}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

            </div>
        </section>
    );
};

export default ProfileSection;
