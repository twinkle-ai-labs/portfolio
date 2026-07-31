import React from "react";
import {useSelector} from "react-redux";
import config from "@Data/config";
import {RootState} from "@Store/index";
import translations from "@Data/i18n";
import {FaArrowDown, FaGithub} from "react-icons/fa6";
import {Button} from "@mui/material";
import CountUp from "@Components/section/countup";
import HeroConsole from "@Components/section/console";

const HomeSection = () => {
    const language = useSelector((state: RootState) => state.language.value) as 'ko' | 'en';
    const t = translations[language];

    return (
        <section id="s_home" className="section hero-dark">
            <div className="hero-shell">
                <div className="hero-copy">
                    <div className="hero-status">
                        <span className="hero-panel-status" aria-hidden="true"></span>
                        {t.hero.available}
                    </div>
                    <div className="hero-kicker">{t.hero.kicker}</div>
                    <h1 className="hero-title">
                        {language === 'ko' ? (
                            <>안녕하세요,<br/><em>{config.profile.name.korean}</em>입니다.</>
                        ) : (
                            <>Hello I'm<br/><em>{config.profile.name.english}</em></>
                        )}
                    </h1>
                    <p className="hero-desc">
                        {t.hero.desc}
                    </p>
                    <ul className="hero-ready-list">
                        {t.hero.ready.map((item) => <li key={item}>{item}</li>)}
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
                            {t.hero.ctaProject}
                            <FaArrowDown/>
                        </Button>
                        <a className="hero-secondary" href="https://github.com/hjkim1004" target="_blank"
                           rel="noreferrer">
                            <FaGithub/>
                            GitHub
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <HeroConsole/>
                </div>
            </div>
            <div className="stats-bar">
                <div className="stats-bar-inner">
                    <div className="stats-bar-item">
                        <strong><CountUp value={5}/><span>+</span></strong>
                        <p>{t.stats.years}</p>
                    </div>
                    <div className="stats-bar-item">
                        <strong><CountUp value={10}/><span>+</span></strong>
                        <p>{t.stats.projects}</p>
                    </div>
                    <div className="stats-bar-item">
                        <strong><CountUp value={80}/><span>x</span></strong>
                        <p>{t.stats.perf}</p>
                    </div>
                    <div className="stats-bar-item">
                        <strong><CountUp value={70}/><span>K+</span></strong>
                        <p>{t.stats.users}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default HomeSection;
