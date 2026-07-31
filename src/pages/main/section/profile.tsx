import React, {useState} from 'react';
import DevOpsCycle, {devopsStages} from '@Components/section/devops';
import translations from '@Data/i18n';
import {useLocale} from '@Utils/i18n';

/** DevOps 단계와 1:1로 대응합니다 (id 공유). */
const capabilityIds = devopsStages.map((stage) => stage.id);

const ProfileSection = () => {
    const {language} = useLocale();
    const t = translations[language].profile;
    const [activeId, setActiveId] = useState<string | null>(null);

    /** 문장 대신 라벨/값으로 읽는 시간을 줄입니다. */
    const facts = [
        {label: t.factCareer, value: t.careerValue, note: t.careerNote},
        {label: t.factEducation, value: t.educationValue, note: t.educationNote},
        {label: t.factCurrent, value: t.currentValue, note: t.currentNote},
        {label: t.factScope, value: t.scopeValue, note: t.scopeNote},
    ];

    const stageLabel = (id: string) => devopsStages.find((stage) => stage.id === id)?.label ?? '';

    return (
        <section id="s_profile" className="section profile-section">
            <div className="profile-summary-layout">
                <div className="profile-summary-copy">
                    <p className="section-eyebrow">{t.eyebrow}</p>
                    <h2 className="section-title">{t.title[0]}<br className="mobile"/> {t.title[1]}</h2>
                    <p className="section-subtitle">{t.subtitle}</p>
                </div>

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
            </div>

            <div className="profile-capability-grid">
                {t.capabilities.map((card, index) => {
                    const id = capabilityIds[index];
                    return (
                        <article
                            className={`profile-capability-card ${activeId === id ? 'is-active' : ''}`}
                            key={id}
                            onMouseEnter={() => setActiveId(id)}
                            onMouseLeave={() => setActiveId(null)}
                        >
                            <span className="profile-capability-label">{stageLabel(id)}</span>
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </article>
                    );
                })}
            </div>

            <DevOpsCycle activeId={activeId} onHover={setActiveId}/>
        </section>
    );
};

export default ProfileSection;
