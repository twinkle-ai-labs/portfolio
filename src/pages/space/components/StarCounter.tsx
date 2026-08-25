import React, {useEffect, useRef, useState} from 'react';
import {useLocale} from '@Utils/i18n';
import translations from '@Data/i18n';

interface IStarCounterProps {
    collected: number;
    total: number;
}

// 별 조각 수집 현황 HUD 칩. 조각을 주울 때마다 잠깐 반짝이고,
// 전부 모으면 금색 COMPLETE 상태로 바뀐다.
const StarCounter = ({collected, total}: IStarCounterProps) => {
    const {language} = useLocale();
    const guide = translations[language].space.guide;

    // Flash the chip for a beat whenever the count goes up
    const [flash, setFlash] = useState(false);
    const prevCollected = useRef(collected);
    useEffect(() => {
        const increased = collected > prevCollected.current;
        prevCollected.current = collected;
        if (!increased) return;
        setFlash(true);
        const timer = setTimeout(() => setFlash(false), 600);
        return () => clearTimeout(timer);
    }, [collected]);

    if (total <= 0) return null;

    const complete = collected >= total;

    return (
        <div className={`space-star-counter${flash ? ' flash' : ''}${complete ? ' complete' : ''}`}>
            <span className="space-star-counter-icon">✦</span>
            <span className="space-star-counter-label">{guide.starLabel}</span>
            <span className="space-star-counter-count">{collected} / {total}</span>
        </div>
    );
};

export default StarCounter;
