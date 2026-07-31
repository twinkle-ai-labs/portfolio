import React, {lazy, Suspense} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {mainLoaded} from "@Store/slice/loading";
import {SyncLoader} from "react-spinners";

const BabylonComponent = lazy(() => import('@Components/section/babylon'));

const HomeSection = () => {
    const loading = useSelector((state: RootState) => state.loading.main);
    const dispatch = useDispatch();

    return (
        <section id="s_home" className="section h-100">
            <div className="section-bg">
                <Suspense fallback={<canvas className="babylon-canvas"/>}>
                    <BabylonComponent
                        rootUrl={"models/night_sky/"}
                        sceneFileName={"scene.gltf"}
                        onMeshLoaded={() => dispatch(mainLoaded())}
                    />
                </Suspense>
            </div>
            <h1 className="section-title">
                Night sky
            </h1>
            <div className={"section-desc"}>
                I have implemented a 3D night sky scene <br className={'pc'}/>
                with 'Twinkle' as the theme <br className={'pc'}/>
                using the Babylon engine.<br/><br/>
                You can explore the night sky space <br className={'pc'}/>
                by grabbing the mouse and moving it.
            </div>
            <div className={loading ? "loading" : 'loading hide'}>
                <SyncLoader
                    margin={5}
                    size={10}
                    color={"rgba(255,255,255,0.8)"}
                />
                <div className={"loading-title"}>3D Loading...</div>
            </div>
        </section>
    );
};

export default HomeSection;
