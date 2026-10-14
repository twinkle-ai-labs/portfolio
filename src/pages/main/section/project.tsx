import React, {useState} from 'react';
import projects, {projectHighlights} from "@Data/project";
import ProjectModal from "@Components/project/modal";
import translations from "@Data/i18n";
import {useLocale} from "@Utils/i18n";

const ProjectSection = () => {
    const {language, t: tr} = useLocale();
    const t = translations[language].project;

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedProject = selectedIndex === null ? null : projects[selectedIndex];

    return (
        <section id="s_project" className="section">
            <div className="section-head">
                <p className="section-eyebrow">{t.eyebrow}</p>
                <h2 className="section-title">{t.title[0]}<br className="mobile"/> <em>{t.title[1]}</em></h2>
                <p className="section-subtitle">{t.subtitle}</p>
            </div>
            <div className="section-content">
                <ul className="project-highlight-list">
                    {projectHighlights.map((item) => (
                        <li key={item.label}>
                            <span>{item.icon}</span>
                            {item.label}
                        </li>
                    ))}
                </ul>
                <div className="project-grid">
                    {projects.map((project, index) => (
                        <button className="project-card" id={"project-" + project.id} key={project.id}
                                onClick={() => setSelectedIndex(index)}>
                            <div className="project-card-top">
                                <div className="project-icon">{project.icon}</div>
                                <div className="project-index">0{index + 1}</div>
                            </div>
                            <div className="project-card-body">
                                <div className="project-meta">{tr(project.period)} · {tr(project.role)}</div>
                                <h3>{tr(project.title)}</h3>
                                <p>{tr(project.summary)}</p>
                            </div>
                            <div className="project-card-detail">
                                {/* 겉면은 세 줄로 끝납니다 — 문제 · 한 일 · 결과. 기술명은 아래 칩이 맡습니다. */}
                                <dl className="project-story">
                                    <div>
                                        <dt>{t.storyProblem}</dt>
                                        <dd>{tr(project.story.problem)}</dd>
                                    </div>
                                    <div>
                                        <dt>{t.storyAction}</dt>
                                        <dd>{tr(project.story.action)}</dd>
                                    </div>
                                    <div className="is-result">
                                        <dt>{t.storyResult}</dt>
                                        <dd>{tr(project.story.result)}</dd>
                                    </div>
                                </dl>
                            </div>
                            <ul className="project-stack">
                                {project.stacks.map((stack) => (
                                    <li key={project.id + stack}>{stack}</li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>
            </div>
            {selectedProject && selectedIndex !== null ? (
                <ProjectModal
                    project={selectedProject}
                    index={selectedIndex}
                    total={projects.length}
                    onClose={() => setSelectedIndex(null)}
                    onNavigate={(direction) => setSelectedIndex((current) => {
                        if (current === null) return current;
                        const next = current + direction;
                        return next >= 0 && next < projects.length ? next : current;
                    })}
                />
            ) : null}
        </section>
    );
};

export default ProjectSection;
