import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Button} from '@mui/material';
import {FaArrowLeft, FaRocket} from 'react-icons/fa6';
import {RootState} from '@Store/index';
import translations from '@Data/i18n';

const STAR_COUNT = 40;

const NotFound = () => {
    const navigate = useNavigate();
    const language = useSelector((state: RootState) => state.language.value) as 'ko' | 'en';
    const t = translations[language].error;

    return (
        <section id="s_error" className="section hero-dark">
            {/* 히어로와 같은 별밭 — 404도 같은 밤하늘 아래 있는 것처럼 보이게 합니다. */}
            <div className="hero-stars" aria-hidden="true">
                {[...Array(STAR_COUNT)].map((_, i) => (
                    <div
                        key={i}
                        className="hero-star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 0.5}px`,
                            height: `${Math.random() * 2 + 0.5}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 4 + 3}s`
                        }}
                    />
                ))}
            </div>

            <div className="error-shell">
                <div className="error-badge">
                    <span className="hero-panel-status" aria-hidden="true"></span>
                    {t.badge}
                </div>

                {/* 숫자 자체가 일러스트 역할을 합니다 — 별밭 위에 떠 있는 커다란 그라디언트 404 */}
                <div className="error-code" aria-hidden="true">
                    <span>4</span>
                    <span className="error-code-orb"/>
                    <span>4</span>
                </div>

                <h1 className="error-title">
                    {t.title} <em>{t.titleAccent}</em>
                </h1>
                <p className="error-desc">{t.desc}</p>

                {/* 히어로의 CTA와 같은 조합(.hero-primary / .hero-secondary)을 그대로 씁니다 */}
                <div className="error-actions">
                    <Button className="hero-primary" onClick={() => navigate('/')}>
                        <FaArrowLeft/>
                        {t.home}
                    </Button>
                    <button type="button" className="hero-secondary" onClick={() => navigate('/space')}>
                        <FaRocket/>
                        {t.space}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
