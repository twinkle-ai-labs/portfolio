import React, {useEffect, useRef, useState} from "react";

export interface ICountUp {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
}

const CountUp = ({value, prefix = '', suffix = '', duration = 1400}: ICountUp) => {
    const [display, setDisplay] = useState(0);
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
