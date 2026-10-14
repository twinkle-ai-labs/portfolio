import React, {useEffect, useRef, useState} from "react";

export interface ICountUp {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
}

const CountUp = ({value, prefix = '', suffix = '', duration = 1400}: ICountUp) => {
    /* 첫 그림부터 최종 값을 둔다 — 텍스트로 읽히거나 스크립트가 늦게 설 때 0 이 보이지 않게. 애니메이션은 보일 때 0 부터 다시 센다. */
    const [display, setDisplay] = useState(value);
    const ref = useRef<HTMLSpanElement>(null);
    const played = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || played.current) return;
            played.current = true;

            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplay(Math.round(value * eased));
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
        }, {threshold: 0.4});

        observer.observe(el);
        return () => observer.disconnect();
    }, [value, duration]);

    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

export default CountUp;
