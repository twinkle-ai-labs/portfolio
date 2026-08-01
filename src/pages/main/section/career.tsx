import React from 'react';
import careers, {ICareer, ICareerProject} from "@Data/career";
import {DateUtil} from "@Utils/date";
import {FaArrowDownLong, FaArrowUpRightFromSquare, FaBriefcase, FaLaptopCode} from "react-icons/fa6";
import translations, {ITranslations} from "@Data/i18n";
import {useLocale} from "@Utils/i18n";
import ProjectDefaultImg from "@Images/project_default.svg";

/**
 * 경력 카드의 프로젝트 한 줄.
 * 외부 링크 · 내부 이동 · 단순 표기 세 경우 모두 동일한 포맷(썸네일 + 이름 + 아이콘)으로 그립니다.
 */
const CareerProjectRow = ({project, careerId, t}: {
    project: ICareerProject;
    careerId: string;
    t: ITranslations['experience'];
}) => {
    const {t: tr} = useLocale();
    const label = tr(project.label);

    const thumb = (
        <span className="career-project-showcase-thumb">
            {/* 로고가 없는 프로젝트는 기본 썸네일로 대체합니다. */}
            <img src={project.image || ProjectDefaultImg} alt={`${label} ${t.logoAlt}`} loading="lazy"/>
        </span>
    );

    const body = (
        <>
            {thumb}
            <span className="career-project-showcase-label">{label}</span>
        </>
    );

    if (project.url) {
        return (
            <li>
                <a href={project.url} target="_blank" rel="noreferrer">
                    {body}
                    <FaArrowUpRightFromSquare className="career-project-showcase-icon" aria-hidden="true"/>
                </a>
            </li>
        );
    }

    if (project.projectId) {
        return (
            <li>
                <a
                    href={"#project-" + project.projectId}
                    aria-label={`${label} — ${t.jumpBadge}`}
                    onClick={(event) => {
                        event.preventDefault();
                        const target = document.getElementById("project-" + project.projectId);
                        target?.scrollIntoView({behavior: 'smooth', block: 'center'});
                        target?.classList.add('project-card-highlight');
                        setTimeout(() => target?.classList.remove('project-card-highlight'), 1600);
                    }}
                >
                    {body}
                    <FaArrowDownLong className="career-project-showcase-icon" aria-hidden="true"/>
                </a>
            </li>
        );
    }

    return (
        <li key={careerId + label}>
            <div className="career-project-static">{body}</div>
        </li>
    );
};

const Career = (career: ICareer & { index: number; t: ITranslations['experience'] }) => {
    const {t: tr} = useLocale();
    const t = career.t;

    const startStr = career.period?.[0] ? DateUtil.getDateToStr({date: career.period[0], returnType: 'day'}) : '';
    const isCurrent = career.isOngoing || career.id === 'inavi';
    const endStr = career.period?.[1] && !isCurrent
        ? DateUtil.getDateToStr({date: career.period[1], returnType: 'day'})
        : '';
    const startLabel = career.isFreelance ? t.start : t.joined;
    const endLabel = career.isFreelance ? t.end : t.left;
    const currentLabel = career.isFreelance ? t.maintaining : t.ongoing;

    return (
        <article className={[
            "career-card",
            career.company ? "" : "career-card-sub",
            isCurrent ? "career-card-current" : "",
        ].filter(Boolean).join(" ")}>
            <div className="career-card-aside">
                <div className="career-index">{career.company ? `0${career.index + 1}` : '•'}</div>
                <div className="career-period">
                    {career.periodText ? (
                        <div className="career-period-row">
                            <span className="career-period-label">{t.period}</span>
                            <span className="career-period-date">{tr(career.periodText)}</span>
                        </div>
                    ) : (
                        <>
                            <div className="career-period-row">
                                <span className="career-period-label">{startLabel}</span>
                                <span className="career-period-date">{startStr}</span>
                            </div>
                            {isCurrent ? (
                                <div className="career-period-row current">
                                    <span className="career-period-label current-label">{currentLabel}</span>
                                </div>
                            ) : (
                                <div className="career-period-row">
                                    <span className="career-period-label">{endLabel}</span>
                                    <span className="career-period-date">{endStr}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="career-main">
                <div className="career-card-head">
                    <div>
                        <h3 className={"career-title"}>{tr(career.name)}</h3>
                        <div className={"career-pos"}>{tr(career.position)}</div>
                    </div>
                    {career.type ? (
                        <div className="career-type">{tr(career.type)}</div>
                    ) : null}
                </div>
                {/* 나열할 프로젝트가 없는 경력은 Features 가 전체 폭을 씁니다. */}
                <div className={`career-summary-grid ${career.projects?.length ? '' : 'career-summary-solo'}`}>
                    <section>
                        <span>{t.features}</span>
                        <ul className="career-feature-list">
                            {career.features?.map((feature) => {
                                const text = tr(feature);
                                return <li key={career.id + text}>{text}</li>;
                            })}
                        </ul>
                    </section>
                    {career.projects?.length ? (
                        <section>
                            <span>{t.projects}</span>
                            <ul className="career-project-showcase">
                                {career.projects.map((project) => (
                                    <CareerProjectRow
                                        key={career.id + tr(project.label)}
                                        project={project}
                                        careerId={career.id}
                                        t={t}
                                    />
                                ))}
                            </ul>
                        </section>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

const CareerSection = () => {
    const {language} = useLocale();
    const t = translations[language].experience;

    const corporateCareers = careers.filter(career => career.company && !career.isFreelance);
    const freelanceCareers = careers.filter(career => career.company && career.isFreelance);

    return (
        <section id="s_career" className="section">
            <div className="section-head">
                <p className="section-eyebrow">{t.eyebrow}</p>
                <h2 className="section-title">{t.title[0]}<br className="mobile"/> <em>{t.title[1]}</em></h2>
                <p className="section-subtitle">{t.subtitle}</p>
            </div>
            <div className="section-content">
                <div className="career-group">
                    <h3 className="career-group-title">
                        <span className="career-group-icon"><FaBriefcase/></span>
                        <span className="career-group-label">{t.corporate}</span>
                        <span className="career-group-count">{corporateCareers.length}{t.countSuffix}</span>
                        <span className="career-group-rule" aria-hidden="true"></span>
                    </h3>
                    <div className="career-list">
                        {corporateCareers.map((career, index) => (
                            <Career key={"career-" + career.id} index={index} t={t} {...career}/>
                        ))}
                    </div>
                </div>

                {freelanceCareers.length > 0 && (
                    <div className="career-group career-group-spaced">
                        <h3 className="career-group-title">
                            <span className="career-group-icon"><FaLaptopCode/></span>
                            <span className="career-group-label">{t.freelance}</span>
                            <span className="career-group-count">{freelanceCareers.length}{t.countSuffix}</span>
                            <span className="career-group-rule" aria-hidden="true"></span>
                        </h3>
                        <div className="career-list">
                            {freelanceCareers.map((career, index) => (
                                <Career
                                    key={"career-" + career.id}
                                    index={corporateCareers.length + index}
                                    t={t}
                                    {...career}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CareerSection;
