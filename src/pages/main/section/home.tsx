import React from "react";
import config from "@Data/config";
import {FaArrowDown, FaGithub} from "react-icons/fa6";
import {Button} from "@mui/material";

const HomeSection = () => {
    return (
        <section id="s_home" className="section">
            <div className="hero-shell">
                <div className="hero-copy">
                    <div className="hero-kicker">✨ Backend Engineer & Architect</div>
                    <h1 className="section-title">
                        보이지 않는 곳에서,<br className="mobile" /> 흔들림 없는 가치를 설계합니다.
                    </h1>
                    <p className="hero-desc">
                        안녕하세요, 백엔드 개발자 {config.profile.name.korean}입니다. <br />
                        추상적인 비즈니스 모델을 견고한 데이터 모델과 유연한 API로 정밀하게 구체화하며,
                        지속 가능한 배포 자동화와 안정성 높은 모니터링 환경을 통해 신뢰할 수 있는 서비스 생태계를 가꿉니다.
                    </p>
                    <div className="hero-actions">
                        <Button
                            className="hero-primary"
                            onClick={() => {
                                const next = document.getElementById('s_project');
                                if (next != null) {
                                    next.scrollIntoView({behavior: 'smooth', block: 'start'});
                                }
                            }}
                        >
                            프로젝트 보기 🚀
                            <FaArrowDown/>
                        </Button>
                        <a className="hero-secondary" href="https://github.com/hjkim1004" target="_blank"
                           rel="noreferrer">
                            <FaGithub/>
                            GitHub
                        </a>
                    </div>
                </div>
                <aside className="hero-panel hero-profile-panel">
                    <div className="hero-panel-header" aria-hidden="true">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="hero-profile-panel-body">
                        <div className="hero-profile-card">
                            <div className="hero-profile-mark">HJ</div>
                            <div>
                                <strong>{config.profile.name.english}</strong>
                                <p>Backend Engineer</p>
                            </div>
                        </div>
                        <div className="hero-profile-basics">
                            <section>
                                <span>Career Summary</span>
                                <ul>
                                    <li>연차: 5년차</li>
                                    <li>현직장: 아이나비시스템즈</li>
                                    <li>직무: Backend Engineer · DevOps</li>
                                </ul>
                            </section>
                            <section>
                                <span>Certificates</span>
                                <ul>
                                    <li>
                                        <strong className="profile-item-label">리눅스마스터 2급</strong>
                                        <span className="profile-item-date">(2024.07)</span>
                                    </li>
                                    <li>
                                        <strong className="profile-item-label">SQL 개발자</strong>
                                        <span className="profile-item-date">(2022.07)</span>
                                    </li>
                                    <li>
                                        <strong className="profile-item-label">정보처리기사</strong>
                                        <span className="profile-item-date">(2019.05)</span>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
};


export default HomeSection;
