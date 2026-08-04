import React, {lazy, Suspense, useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {mainLoaded} from "@Store/slice/loading";
import translations from "@Data/i18n";
import SpaceLoading from "@Components/loading/SpaceLoading";

const ThreeSpaceComponent = lazy(() => import('@Components/section/three-space'));

const HomeSection = () => {
    const language = useSelector((state: RootState) => state.language.value) as 'ko' | 'en';
    const t = translations[language].space;
    const loading = useSelector((state: RootState) => state.loading.main);
    const dispatch = useDispatch();

    const [progress, setProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);

    // Stable references: an inline arrow here would change identity on every render and
    // force ThreeSpace's asset-loading effect to tear down and re-mount unnecessarily.
    const handleLoaded = useCallback(() => {
        dispatch(mainLoaded());
    }, [dispatch]);

    const handleProgress = useCallback((percent: number) => {
        setProgress(percent);
    }, []);

    useEffect(() => {
        if (!loading || t.loadingTips.length <= 1) return;
        const interval = setInterval(() => {
            setTipIndex((i) => (i + 1) % t.loadingTips.length);
        }, 2600);
        return () => clearInterval(interval);
    }, [loading, t.loadingTips.length]);

    return (
        <section id="s_home" className="section h-100">
            <div className="section-bg">
                <Suspense fallback={<canvas className="three-canvas"/>}>
                    <ThreeSpaceComponent onLoaded={handleLoaded} onProgress={handleProgress}/>
                </Suspense>
            </div>
            <SpaceLoading progress={progress} tipIndex={tipIndex} hidden={!loading}/>
        </section>
    );
};

export default HomeSection;
