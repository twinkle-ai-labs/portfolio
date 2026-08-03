import React, {lazy, Suspense} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {mainLoaded} from "@Store/slice/loading";
import {SyncLoader} from "react-spinners";
import translations from "@Data/i18n";

const ThreeSpaceComponent = lazy(() => import('@Components/section/three-space'));

const HomeSection = () => {
    const language = useSelector((state: RootState) => state.language.value) as 'ko' | 'en';
    const t = translations[language].space;
    const loading = useSelector((state: RootState) => state.loading.main);
    const dispatch = useDispatch();

    return (
        <section id="s_home" className="section h-100">
            <div className="section-bg">
                <Suspense fallback={<canvas className="three-canvas"/>}>
                    <ThreeSpaceComponent onLoaded={() => dispatch(mainLoaded())}/>
                </Suspense>
            </div>
            <div className={loading ? "loading" : 'loading hide'}>
                <SyncLoader
                    margin={5}
                    size={10}
                    color={"rgba(255,255,255,0.8)"}
                />
                <div className={"loading-title"}>{t.loading}</div>
            </div>
        </section>
    );
};

export default HomeSection;
