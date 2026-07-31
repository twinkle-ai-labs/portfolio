import React from 'react';
import careers, {ICareer} from "@Data/career";
import {DateUtil} from "@Utils/date";
import {FaArrowUpRightFromSquare, FaBriefcase, FaLaptopCode} from "react-icons/fa6";

const Career = (career: ICareer & { index: number }) => {
    const startStr = career.period?.[0] ? DateUtil.getDateToStr({date: career.period[0], returnType: 'day'}) : '';
    const isCurrent = career.isOngoing || career.id === 'inavi';
    const endStr = career.period?.[1] && !isCurrent 
        ? DateUtil.getDateToStr({date: career.period[1], returnType: 'day'}) 
        : '';
    const startLabel = career.isFreelance ? '시작' : '입사';
    const endLabel = career.isFreelance ? '완료' : '퇴사';
    const currentLabel = career.isFreelance ? '유지보수중' : '재직중';

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
                            <span className="career-period-label">기간</span>
                            <span className="career-period-date">{career.periodText}</span>
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
                        <h3 className={"career-title"}>{career.name}</h3>
                        <div className={"career-pos"}>{career.position}</div>
                    </div>
                    {career.type ? (
                        <div className="career-type">
                            {career.type}
                        </div>
                    ) : null}
                </div>
                <div className="career-summary-grid">
                    <section>
                        <span>Features</span>
                        <ul className="career-feature-list">
                            {career.features?.map((feature) => (
                                <li key={career.id + feature}>{feature}</li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <span>Projects</span>
                        {career.projects?.some((project) => typeof project !== 'string' && project.image) ? (
                            <ul className="career-project-showcase">
                                {career.projects?.map((project) => {
                                    const label = typeof project === 'string' ? project : project.label;
                                    const url = typeof project === 'string' ? undefined : project.url;
                                    const image = typeof project === 'string' ? undefined : project.image;
                                    return (
                                        <li key={career.id + label}>
                                            <a href={url} target="_blank" rel="noreferrer">
                                                <span className="career-project-showcase-thumb">
                                                    <img src={image} alt={label + " 로고"} loading="lazy"/>
                                                </span>
                                                <span className="career-project-showcase-label">{label}</span>
                                                <FaArrowUpRightFromSquare className="career-project-showcase-icon"/>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <ul className="career-project-list">
                                {career.projects?.map((project) => {
                                    const label = typeof project === 'string' ? project : project.label;
                                    const projectId = typeof project === 'string' ? undefined : project.projectId;
                                    if (projectId) {
                                        return (
                                            <li key={career.id + label}>
                                                <a
                                                    href={"#project-" + projectId}
                                                    className="career-project-jump"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        const target = document.getElementById("project-" + projectId);
                                                        target?.scrollIntoView({behavior: 'smooth', block: 'center'});
                                                        target?.classList.add('project-card-highlight');
                                                        setTimeout(() => target?.classList.remove('project-card-highlight'), 1600);
                                                    }}
                                                >
                                                    {label}
                                                    <span className="career-project-jump-badge">Projects에서 보기 ↓</span>
                                                </a>
                                            </li>
                                        );
                                    }
                                    return <li key={career.id + label}>{label}</li>;
                                })}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </article>
    );
}
const CareerSection = () => {
    const corporateCareers = careers.filter(career => career.company && !career.isFreelance);
    const freelanceCareers = careers.filter(career => career.company && career.isFreelance);

    return (
        <section id="s_career" className="section">
            <p className="section-eyebrow">Career</p>
            <h2 className="section-title">숫자보다 구조로 증명한<br className="mobile" /> 5년의 궤적</h2>
            <p className="section-subtitle">
                정규직과 프리랜서를 넘나들며 맡았던 회사·프로젝트별 핵심 역할을 시간순으로 정리했습니다.
            </p>
            <div className="section-content">
                <div className="career-group">
                    <h3 className="career-group-title">
                        <span className="career-group-icon"><FaBriefcase/></span>
                        <span className="career-group-label">Corporate Experience</span>
                        <span className="career-group-count">{corporateCareers.length}개</span>
                        <span className="career-group-rule" aria-hidden="true"></span>
                    </h3>
                    <div className="career-list">
                        {corporateCareers.map((career, index) => (
                            <Career key={"career-" + career.id} index={index} {...career}/>
                        ))}
                    </div>
                </div>

                {freelanceCareers.length > 0 && (
                    <div className="career-group career-group-spaced">
                        <h3 className="career-group-title">
                            <span className="career-group-icon"><FaLaptopCode/></span>
                            <span className="career-group-label">Freelance &amp; Contract Projects</span>
                            <span className="career-group-count">{freelanceCareers.length}개</span>
                            <span className="career-group-rule" aria-hidden="true"></span>
                        </h3>
                        <div className="career-list">
                            {freelanceCareers.map((career, index) => (
                                <Career key={"career-" + career.id} index={corporateCareers.length + index} {...career}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CareerSection;
