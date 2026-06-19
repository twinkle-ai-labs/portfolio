import React from 'react';
import careers, {ICareer} from "@Data/career";
import {DateUtil} from "@Utils/date";

const Career = (career: ICareer & { index: number }) => {
    const period = career.period?.map(e => DateUtil.getDateToStr({date: e, returnType: 'day'})).join(" ~ ");

    return (
        <article className={career.company ? "career-card" : "career-card career-card-sub"}>
            <div className="career-card-aside">
                <div className="career-index">{career.company ? `0${career.index + 1}` : '•'}</div>
                <div className="career-period">
                    {period}
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
                        <span>주요 features</span>
                        <ul className="career-feature-list">
                            {career.features?.map((feature) => (
                                <li key={career.id + feature}>{feature}</li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <span>주요 projects</span>
                        <ul className="career-project-list">
                            {career.projects?.map((project) => (
                                <li key={career.id + project}>{project}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </article>
    );
}
const CareerSection = () => {
    const mainCareers = careers.filter(career => career.company);

    return (
        <section id="s_career" className="section">
            <p className="section-eyebrow">Career</p>
            <h2 className="section-title">Experience</h2>
            <p className="section-subtitle">
                회사별로 담당했던 주요 features와 대표 projects를 중심으로 경력을 정리했습니다.
            </p>
            <div className="section-content">
                <div className="career-list">
                    {mainCareers.map((career, index) => (
                        <Career key={"career-" + career.id} index={index} {...career}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareerSection;
