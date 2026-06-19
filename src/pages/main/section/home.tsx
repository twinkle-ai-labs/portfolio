import React from "react";
import config from "@Data/config";
import {FaArrowDown, FaGithub} from "react-icons/fa6";
import {Button} from "@mui/material";

const HomeSection = () => {
    return (
        <section id="s_home" className="section">
            <div className="hero-shell">
                <div className="hero-copy" data-aos="fade-up" data-aos-delay={300}>
                    <div className="hero-kicker">Product Engineer</div>
                    <h1 className="section-title">
                        서비스의 시작과 끝을 함께 만들어갑니다.
                    </h1>
                    <p className="hero-desc">
                        안녕하세요, 프로덕트 엔지니어 {config.profile.name.korean}입니다. <br />
                        기획서를 구현 가능한 데이터 구조와 API로 바꾸고,
                        개발 반영과 테스트, 상용 반영 이후의 운영 관측까지 고려해 서비스가 안정적으로 이어지는 흐름을 만듭니다.
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
                            프로젝트 보기
                            <FaArrowDown/>
                        </Button>
                        <a className="hero-secondary" href="https://github.com/hjkim1004" target="_blank"
                           rel="noreferrer">
                            <FaGithub/>
                            GitHub
                        </a>
                    </div>
                </div>
                <aside className="hero-panel hero-profile-panel" data-aos="fade-left" data-aos-delay={600}>
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
                                <p>Product Engineer</p>
                            </div>
                        </div>
                        <div className="hero-profile-basics">
                            <section>
                                <span>Career Summary</span>
                                <ul>
                                    <li>연차: 5년차</li>
                                    <li>현직장: 아이나비시스템즈</li>
                                    <li>직무: Product Engineer (Backend)</li>
                                </ul>
                            </section>
                            <section>
                                <span>Certificates</span>
                                <ul>
                                    <li>정보처리기사</li>
                                    <li>SQLD</li>
                                    <li>리눅스마스터 2급</li>
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
