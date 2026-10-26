import React, {useEffect, useRef, useState} from "react";

interface ILogLine {
    /** 어느 프로젝트의 사실인가 — 가짜 시각 대신 출처를 적습니다. */
    tag: 'lib' | 'orda' | 'navi';
    level: 'INFO' | 'WARN' | 'DEPLOY' | 'OK';
    text: string;
}

/**
 * 여기 적힌 줄은 전부 아래 프로젝트 카드 안에 근거가 있는 사실입니다.
 * 2026-10-14 까지는 «12/12 instances» «4.2M rows» 처럼 어디에도 없는 숫자가 실제 로그처럼 흐르고 있었다 —
 * 첫 화면에서 가장 구체적으로 보이는 값이 근거 없는 값이면 나머지 숫자까지 믿을 수 없게 된다.
 */
const LOG_LINES: ILogLine[] = [
    {tag: 'lib', level: 'WARN', text: 'search p99 7.5s — 3-tier socket middleware (Gandalf / Frodo)'},
    {tag: 'lib', level: 'OK', text: 'RoutingDataSource → kiosk DBs direct · p99 93ms (≈80x) @ 100 vu/s'},
    {tag: 'lib', level: 'DEPLOY', text: 'hybrid app → Play Store · App Store'},
    {tag: 'orda', level: 'DEPLOY', text: 'orda-api → AWS · 2 prod servers · jenkins → harbor'},
    {tag: 'orda', level: 'WARN', text: '03-01 09:00 mission open — 700 req/min, RDS saturated'},
    {tag: 'orda', level: 'OK', text: 'tour-list query 208ms → 30ms · push split delivery · 71K members'},
    {tag: 'navi', level: 'INFO', text: 'AIR + Toyota logs → bigquery 35 tables → 22 @Scheduled jobs → grafana'},
];

const LEVEL_CLASS: Record<ILogLine['level'], string> = {
    INFO: 'log-info',
    WARN: 'log-warn',
    DEPLOY: 'log-deploy',
    OK: 'log-ok',
};

const LINE_INTERVAL_MS = 1100;
const RESTART_DELAY_MS = 2600;

const HeroConsole = () => {
    const [visibleCount, setVisibleCount] = useState(0);
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const delay = visibleCount === LOG_LINES.length ? RESTART_DELAY_MS : LINE_INTERVAL_MS;
        const timer = setTimeout(() => {
            setVisibleCount((count) => (count >= LOG_LINES.length ? 0 : count + 1));
        }, delay);
        return () => clearTimeout(timer);
    }, [visibleCount]);

    useEffect(() => {
        bodyRef.current?.scrollTo({top: bodyRef.current.scrollHeight});
    }, [visibleCount]);

    return (
        <div className="hero-console">
            <div className="hero-console-head">
                <span className="hero-console-dot" aria-hidden="true"></span>
                <span className="hero-console-title">hj ~ cat highlights.log</span>
                <span className="hero-console-uptime">2020 → now</span>
            </div>

            <div className="hero-console-body" ref={bodyRef}>
                {LOG_LINES.slice(0, visibleCount).map((line, index) => (
                    <p className="hero-console-line" key={index}>
                        <span className="log-tag">{line.tag}</span>
                        <span className={`log-level ${LEVEL_CLASS[line.level]}`}>{line.level}</span>
                        <span className="log-text">{line.text}</span>
                    </p>
                ))}
                <p className="hero-console-line">
                    <span className="hero-console-cursor" aria-hidden="true"></span>
                </p>
            </div>

            <div className="hero-console-chart" aria-hidden="true">
                <svg viewBox="0 0 320 72" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="latencyLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f0abfc"/>
                            <stop offset="55%" stopColor="#a78bfa"/>
                            <stop offset="100%" stopColor="#4ade80"/>
                        </linearGradient>
                    </defs>
                    <polyline
                        className="hero-console-spark"
                        points="0,14 34,20 62,10 92,26 118,18 148,30 178,48 208,58 244,62 282,64 320,65"
                        fill="none" stroke="url(#latencyLine)" strokeWidth="2.4" strokeLinecap="round"
                    />
                </svg>
                <div className="hero-console-chart-meta">
                    <span>lib · search p99</span>
                    <strong>7.5s → 93ms</strong>
                </div>
            </div>

            <div className="hero-console-metrics">
                <div>
                    <strong>80x</strong>
                    <span>search p99 · lib</span>
                </div>
                <div>
                    <strong>71K</strong>
                    <span>members · orda</span>
                </div>
                <div>
                    <strong>216K</strong>
                    <span>participations · orda</span>
                </div>
            </div>
        </div>
    );
};

export default HeroConsole;
