import React, {lazy, Suspense} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {mainLoaded} from "@Store/slice/loading";
import {openModal} from "@Store/slice/modal";
import {SyncLoader} from "react-spinners";
import translations from "@Data/i18n";
import {Button} from "@mui/material";

const ThreeSpaceComponent = lazy(() => import('@Components/section/three-space'));

const HomeSection = () => {
    const language = useSelector((state: RootState) => state.language.value) as 'ko' | 'en';
    const t = translations[language].space;
    const loading = useSelector((state: RootState) => state.loading.main);
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(openModal({
            type: 'SPACE_INFO',
            props: {
                title: t.title,
                content: t.desc,
            },
        }));
    };

    return (
        <section id="s_home" className="section h-100">
            <div className="section-bg">
                <Suspense fallback={<canvas className="babylon-canvas"/>}>
                    <ThreeSpaceComponent onLoaded={() => dispatch(mainLoaded())}/>
                </Suspense>
            </div>
            <Button
                type="button"
                variant="contained"
                onClick={handleOpenModal}
                sx={{
                    position: 'absolute',
                    top: { xs: 16, md: 24 },
                    right: { xs: 16, md: 24 },
                    zIndex: 2,
                    px: 2.2,
                    py: 1.1,
                    borderRadius: 999,
                    background: 'rgba(10, 11, 20, 0.66)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(129, 140, 248, 0.28)',
                    color: 'var(--ink)',
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
                    '&:hover': {
                        background: 'rgba(20, 22, 40, 0.86)',
                        borderColor: 'rgba(129, 140, 248, 0.55)',
                    },
                }}
            >
                {t.openModal}
            </Button>
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
