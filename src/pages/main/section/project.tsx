import React, {useState} from 'react';
import projects, {IProject, projectHighlights} from "@Data/project";
import {FaXmark} from "react-icons/fa6";

const ProjectModal = ({project, onClose}: { project: IProject; onClose: () => void }) => {
    return (
        <div className="project-modal-backdrop" role="presentation" onClick={onClose}>
            <article className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"
                     onClick={(event) => event.stopPropagation()}>
                <button className="project-modal-close" type="button" aria-label="프로젝트 상세 닫기" onClick={onClose}>
                    <FaXmark/>
                </button>
                <div className="project-modal-visual">
                    {project.images && project.images.length > 0 ? (
                        project.images.map((image) => (
                            <img key={image} src={image} alt={`${project.title} 화면`}/>
                        ))
                    ) : (
                        <div className="project-modal-placeholder">
                            <span>Image Area</span>
                            <p>프로젝트 이미지가 들어갈 영역입니다.</p>
                        </div>
                    )}
                </div>
                <div className="project-modal-content">
                    <div className="project-meta">{project.period} · {project.role}</div>
                    <h3 id="project-modal-title">{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="project-impact">
                        <span>Feature</span>
                        {project.impact}
                    </div>
                    <ul className="project-stack">
                        {project.stacks.map((stack) => (
                            <li key={project.id + 'modal' + stack}>{stack}</li>
                        ))}
                    </ul>
                    <section className="project-modal-section">
                        <h4>상세 내용</h4>
                        <ul className="project-points">
                            {project.details.map((detail) => (
                                <li key={project.id + detail}>{detail}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </article>
        </div>
    );
};

const ProjectSection = () => {
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    return (
        <section id="s_project" className="section">
            <p className="section-eyebrow">Projects</p>
            <h2 className="section-title">Featured Work</h2>
            <p className="section-subtitle">
                서버 1인 개발, 통계 파이프라인, 스마트도서관 시스템 고도화처럼 제품 흐름에 깊게 관여한 경험을 모았습니다.
            </p>
            <div className="section-content">
                <ul className="project-highlight-list" data-aos="fade-up">
                    {projectHighlights.map((item) => (
                        <li key={item.label}>
                            <span>{item.icon}</span>
                            {item.label}
                        </li>
                    ))}
                </ul>
                <div className="project-grid">
                    {projects.map((project, index) => (
                        <button className="project-card" key={project.id} data-aos="fade-up"
                                data-aos-delay={(index + 1) * 100}
                                onClick={() => setSelectedProject(project)}>
                            <div className="project-card-top">
                                <div className="project-icon">{project.icon}</div>
                                <div className="project-index">0{index + 1}</div>
                            </div>
                            <div className="project-meta">{project.period} · {project.role}</div>
                            <h3>{project.title}</h3>
                            <p>{project.summary}</p>
                            <div className="project-impact">
                                <span>Feature</span>
                                {project.impact}
                            </div>
                            <ul className="project-stack">
                                {project.stacks.map((stack) => (
                                    <li key={project.id + stack}>{stack}</li>
                                ))}
                            </ul>
                            <ul className="project-points">
                                {project.points.map((point) => (
                                    <li key={project.id + point}>{point}</li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>
            </div>
            {selectedProject ? (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)}/>
            ) : null}
        </section>
    );
};

export default ProjectSection;
