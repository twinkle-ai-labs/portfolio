import React, {useEffect, useRef, useState} from "react";

interface ILogLine {
    time: string;
    level: 'INFO' | 'WARN' | 'DEPLOY' | 'OK';
    text: string;
}

const LOG_LINES: ILogLine[] = [
    {time: '09:12:04', level: 'DEPLOY', text: 'jenkins » orda-api v2.4.1 → prod (harbor)'},
    {time: '09:12:11', level: 'OK', text: 'health-check passed · 12/12 instances'},
    {time: '09:13:02', level: 'INFO', text: 'bigquery batch: 4.2M rows → stats.daily'},
    {time: '09:13:40', level: 'WARN', text: 'p99 latency 812ms — tracing bottleneck'},
    {time: '09:14:07', level: 'INFO', text: 'query plan rewritten · index hit 99.2%'},
    {time: '09:14:09', level: 'OK', text: 'p99 7.5s → 93ms (≈80x faster)'},
    {time: '09:15:00', level: 'INFO', text: 'grafana dashboard synced · alerts green'},
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
                <span className="hero-console-title">hj@prod ~ tail -f service.log</span>
                <span className="hero-console-uptime">uptime 99.9%</span>
            </div>

            <div className="hero-console-body" ref={bodyRef}>
                {LOG_LINES.slice(0, visibleCount).map((line) => (
                    <p className="hero-console-line" key={line.time}>
                        <span className="log-time">{line.time}</span>
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
                    <span>p99 latency</span>
                    <strong>7.5s → 93ms</strong>
                </div>
            </div>

            <div className="hero-console-metrics">
                <div>
                    <strong>12/12</strong>
                    <span>instances up</span>
                </div>
                <div>
                    <strong>4.2M</strong>
                    <span>rows/day batch</span>
                </div>
                <div>
                    <strong>0</strong>
                    <span>alerts firing</span>
                </div>
            </div>
        </div>
    );
};

export default HeroConsole;
