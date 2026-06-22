import React, {useState} from 'react';
import projects, {IProject, projectHighlights} from "@Data/project";
import {FaXmark, FaCheck} from "react-icons/fa6";
import SmartLibraryDeviceImg from '@Images/smart_library.png';

const ProjectModal = ({project, onClose}: { project: IProject; onClose: () => void }) => {
    const visualType = project.visualType || 'side-wide';

    // Resolve the details sections data dynamically, supporting multiple chapters!
    const detailSections = project.detailSections || [
        {
            title: '상세 내용',
            messages: project.details
        }
    ];

    return (
        <div className="project-modal-backdrop" role="presentation" onClick={onClose}>
            <article 
                className={`project-modal ${visualType === 'title-left' || visualType === 'top-wide' ? 'layout-single-column' : ''}`}
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="project-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <button className="project-modal-close" type="button" aria-label="프로젝트 상세 닫기" onClick={onClose}>
                    <FaXmark/>
                </button>
                
                {/* 1. TOP-WIDE Banner (Type C) */}
                {visualType === 'top-wide' && project.images && project.images.length > 0 && (
                    <div className="project-modal-banner">
                        <img src={project.images[0]} alt={`${project.title} 배너`} />
                    </div>
                )}
                
                {visualType === 'title-left' || visualType === 'top-wide' ? (
                    /* Single column layout for Type A (title-left) & Type C (top-wide) */
                    <div className="project-modal-content padding-single-column">
                        
                        {/* Title and Description Grouped, with Small Kiosk Image on the Left (Type A / title-left) */}
                        <div className="project-modal-header-grouped">
                            
                            {/* Flat Small Device Image Badge on the left (Type A / title-left) */}
                            {visualType === 'title-left' && (
                                <img 
                                    src={SmartLibraryDeviceImg} 
                                    alt="Smart Library Kiosk" 
                                    className="project-modal-header-badge"
                                />
                            )}

                            {/* Grouped Text Div on the right */}
                            <div className="flex-1">
                                <div className="project-meta">{project.period} · {project.role}</div>
                                <h3 id="project-modal-title" className="title-left-heading">{project.title}</h3>
                                <p className="title-left-summary">{project.summary}</p>
                            </div>
                        </div>

                        {/* Flat Checkmarked Key Achievements Summary Box (Light/Dark Theme Compliant) */}
                        <div className="project-achievements-checklist">
                            <span className="project-achievements-checklist-title">🏆 Key Achievements Summary</span>
                            <ul className="project-achievements-checklist-list">
                                {project.impact.map((item, idx) => (
                                    <li key={idx} className="project-achievements-checklist-item">
                                        <FaCheck className="project-achievements-checklist-icon" />
                                        <span className="project-achievements-checklist-text">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <ul className="project-stack">
                            {project.stacks.map((stack) => (
                                <li key={project.id + 'modal' + stack}>{stack}</li>
                            ))}
                        </ul>
                        
                        {/* Custom Component Content or Default Data-driven array loop */}
                        {project.content ? (
                            project.content
                        ) : (
                            detailSections.map((section, sectionIdx) => (
                                <section key={project.id + 'section' + sectionIdx} className={`project-modal-section ${sectionIdx > 0 ? 'section-margin-top' : 'section-margin-top-first'}`}>
                                    <h4 className="styled-heading">{section.title}</h4>
                                    {section.image || section.images ? (
                                        <div className={`project-modal-split-grid ${section.layoutType ? `grid-${section.layoutType}` : ''}`}>
                                            <ul className="project-points no-margin">
                                                {section.messages.map((message, idx) => (
                                                    <li key={project.id + 'detail' + idx}>{message}</li>
                                                ))}
                                            </ul>
                                            <div className="project-modal-mockup-wrapper">
                                                {section.images ? (
                                                    section.images.map((img, imgIdx) => (
                                                        <img 
                                                            key={imgIdx}
                                                            src={img} 
                                                            alt={section.imageAlt || `Project Visual ${imgIdx + 1}`} 
                                                            className={`project-modal-mockup-image ${section.layoutType ? `image-${section.layoutType}` : ''}`}
                                                        />
                                                    ))
                                                ) : (
                                                    <img 
                                                        src={section.image} 
                                                        alt={section.imageAlt || 'Project UI/UX Mockup'} 
                                                        className={`project-modal-mockup-image ${section.layoutType ? `image-${section.layoutType}` : ''}`}
                                                    />
                                                )}
                                                {section.imageAlt && (
                                                    <span className="project-modal-mockup-caption">{section.imageAlt}</span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <ul className="project-points">
                                            {section.messages.map((message, idx) => (
                                                <li key={project.id + 'detail' + idx}>{message}</li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            ))
                        )}
                    </div>
                ) : (
                    /* Type B: Standard 2-column layout (side-wide) */
                    <>
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
                            
                            {/* Flat Checkmarked Key Achievements Summary Box (Light/Dark Theme Compliant) */}
                            <div className="project-achievements-checklist">
                                <span className="project-achievements-checklist-title">🏆 Key Achievements Summary</span>
                                <ul className="project-achievements-checklist-list">
                                    {project.impact.map((item, idx) => (
                                        <li key={idx} className="project-achievements-checklist-item">
                                            <FaCheck className="project-achievements-checklist-icon" />
                                            <span className="project-achievements-checklist-text">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <ul className="project-stack">
                                {project.stacks.map((stack) => (
                                    <li key={project.id + 'modal' + stack}>{stack}</li>
                                ))}
                            </ul>
                            
                            {/* Custom Component Content or Default Data-driven array loop */}
                            {project.content ? (
                                project.content
                            ) : (
                                detailSections.map((section, sectionIdx) => (
                                    <section key={project.id + 'section' + sectionIdx} className={`project-modal-section ${sectionIdx > 0 ? 'section-margin-top' : 'section-margin-top-first'}`}>
                                        <h4 className="styled-heading">{section.title}</h4>
                                        {section.image || section.images ? (
                                            <div className={`project-modal-split-grid ${section.layoutType ? `grid-${section.layoutType}` : ''}`}>
                                                <ul className="project-points no-margin">
                                                    {section.messages.map((message, idx) => (
                                                        <li key={project.id + 'detail' + idx}>{message}</li>
                                                    ))}
                                                </ul>
                                                <div className="project-modal-mockup-wrapper">
                                                    {section.images ? (
                                                        section.images.map((img, imgIdx) => (
                                                            <img 
                                                                key={imgIdx}
                                                                src={img} 
                                                                alt={section.imageAlt || `Project Visual ${imgIdx + 1}`} 
                                                                className={`project-modal-mockup-image ${section.layoutType ? `image-${section.layoutType}` : ''}`}
                                                            />
                                                        ))
                                                    ) : (
                                                        <img 
                                                            src={section.image} 
                                                            alt={section.imageAlt || 'Project UI/UX Mockup'} 
                                                            className={`project-modal-mockup-image ${section.layoutType ? `image-${section.layoutType}` : ''}`}
                                                        />
                                                    )}
                                                    {section.imageAlt && (
                                                        <span className="project-modal-mockup-caption">{section.imageAlt}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <ul className="project-points">
                                                {section.messages.map((message, idx) => (
                                                    <li key={project.id + 'detail' + idx}>{message}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))
                            )}
                        </div>
                    </>
                )}
            </article>
        </div>
    );
};

const ProjectSection = () => {
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    return (
        <section id="s_project" className="section">
            <p className="section-eyebrow">🚀 Projects</p>
            <h2 className="section-title">Featured Work 🧱</h2>
            <p className="section-subtitle">
                서버 1인 개발, 통계 파이프라인, 스마트도서관 시스템 고도화처럼 제품 흐름에 깊게 관여한 경험을 모았습니다.
            </p>
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
                        <button className="project-card" key={project.id}
                                onClick={() => setSelectedProject(project)}>
                            <div className="project-card-top">
                                <div className="project-icon">{project.icon}</div>
                                <div className="project-index">0{index + 1}</div>
                            </div>
                            <div className="project-card-body">
                                <div className="project-meta">{project.period} · {project.role}</div>
                                <h3>{project.title}</h3>
                                <p>{project.summary}</p>
                            </div>
                            <div className="project-card-detail">
                                <div className="project-impact">
                                    <span>🏆 Key Achievements</span>
                                    <ul>
                                        {project.features.map((feat, fIdx) => (
                                            <li key={project.id + 'feat' + fIdx}>
                                                <FaCheck/>
                                                <strong>{feat}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
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
            {selectedProject ? (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)}/>
            ) : null}
        </section>
    );
};

export default ProjectSection;
