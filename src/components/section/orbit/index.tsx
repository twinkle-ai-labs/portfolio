import React from "react";

const OrbitGraphic = () => {
    return (
        <svg className="orbit-graphic" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <linearGradient id="orbitCore" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8"/>
                    <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
            </defs>

            <circle className="orbit-ring orbit-ring-outer" cx="150" cy="150" r="140" stroke="url(#orbitCore)" strokeOpacity="0.18" strokeWidth="1.4" strokeDasharray="2 10" strokeLinecap="round"/>
            <circle className="orbit-ring orbit-ring-inner" cx="150" cy="150" r="112" stroke="url(#orbitCore)" strokeOpacity="0.28" strokeWidth="1.2" strokeDasharray="1 7" strokeLinecap="round"/>

            <g className="orbit-lines" stroke="url(#orbitCore)" strokeOpacity="0.4" strokeWidth="1.4">
                <line x1="150" y1="150" x2="150" y2="58"/>
                <line x1="150" y1="150" x2="228" y2="196"/>
                <line x1="150" y1="150" x2="72" y2="196"/>
            </g>

            <circle cx="150" cy="150" r="30" fill="url(#orbitCore)" fillOpacity="0.14"/>
            <circle cx="150" cy="150" r="19" fill="url(#orbitCore)"/>
            <rect x="141" y="141" width="18" height="18" rx="4" fill="white" fillOpacity="0.92"/>

            <g className="orbit-node orbit-node-1">
                <circle cx="150" cy="58" r="13" fill="#14151f"/>
                <circle cx="150" cy="58" r="13" stroke="url(#orbitCore)" strokeWidth="1.6"/>
                <rect x="144" y="52" width="12" height="12" rx="3" fill="url(#orbitCore)"/>
            </g>

            <g className="orbit-node orbit-node-2">
                <circle cx="228" cy="196" r="13" fill="#14151f"/>
                <circle cx="228" cy="196" r="13" stroke="url(#orbitCore)" strokeWidth="1.6"/>
                <path d="M222 196h12M228 190v12" stroke="url(#orbitCore)" strokeWidth="1.8" strokeLinecap="round"/>
            </g>

            <g className="orbit-node orbit-node-3">
                <circle cx="72" cy="196" r="13" fill="#14151f"/>
                <circle cx="72" cy="196" r="13" stroke="url(#orbitCore)" strokeWidth="1.6"/>
                <circle cx="72" cy="196" r="4" fill="url(#orbitCore)"/>
            </g>

            <g className="orbit-satellite">
                <circle cx="150" cy="10" r="4.5" fill="url(#orbitCore)"/>
            </g>
        </svg>
    );
};

export default OrbitGraphic;
