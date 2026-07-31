import React from "react";
import config from "@Data/config";
import {FaArrowDown, FaGithub} from "react-icons/fa6";
import {Button} from "@mui/material";

const HomeSection = () => {
    return (
        <section id="s_home" className="section">
            <div className="hero-shell">
                <div className="hero-copy">
                    <div className="hero-kicker">Backend Engineer · Systems Architect</div>
                    <h1 className="section-title">
                        설계부터 운영까지,<br className="mobile" /> 흔들리지 않는 백엔드를 만듭니다.
                    </h1>
                    <p className="hero-desc">
                        안녕하세요, 백엔드 개발자 {config.profile.name.korean}입니다. <br />
                        복잡한 비즈니스 로직을 견고한 데이터 모델과 유연한 API로 구체화하고,
                        자동화된 배포 파이프라인과 정교한 모니터링으로 서비스가 멈추지 않게 만듭니다.
                    </p>
                    <ul className="hero-ready-list">
                        <li>서버·인프라 아키텍처 설계</li>
                        <li>클라우드 배포 자동화</li>
                        <li>장애 대응 · 운영 관측</li>
                        <li>API 설계 및 성능 최적화</li>
                    </ul>
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
                    <div className="hero-panel-header">
                        <span className="hero-panel-status" aria-hidden="true"></span>
                        available for work
                    </div>
                    <div className="hero-profile-panel-body">
                        <div className="hero-profile-card">
                            <div className="hero-profile-mark">HJ</div>
                            <div>
                                <strong>{config.profile.name.english}</strong>
                                <p>Backend Engineer</p>
                            </div>
                        </div>
                        <div className="hero-stat-row">
                            <div className="hero-stat">
                                <strong>5<span>년+</span></strong>
                                <p>실무 경력</p>
                            </div>
                            <div className="hero-stat">
                                <strong>10<span>개+</span></strong>
                                <p>주도 프로젝트</p>
                            </div>
                            <div className="hero-stat">
                                <strong>80<span>배</span></strong>
                                <p>검색 응답 개선</p>
                            </div>
                        </div>
                        <div className="hero-profile-basics">
                            <section>
                                <span>Career Summary</span>
                                <ul>
                                    <li>실무 경력: 만 5년</li>
                                    <li>현직장: 아이나비시스템즈</li>
                                    <li>직무: Lead Backend Engineer · DevOps</li>
                                </ul>
                            </section>
                            <section>
                                <span>Core Strengths</span>
                                <ul>
                                    <li>서버·인프라 아키텍처 전주기 단독 설계</li>
                                    <li>클라우드 배포 자동화와 운영 관측 체계 구축</li>
                                    <li>대량 로그·배치·분석 대시보드 파이프라인 구현</li>
                                    <li>레거시 병목 제거 및 p99 검색 응답 약 80배 개선</li>
                                    <li>백오피스·하이브리드 앱·외부 API를 잇는 풀스택 제품 경험</li>
                                    <li>보안·권한·SEO·문서화까지 고려한 운영형 개발</li>
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
