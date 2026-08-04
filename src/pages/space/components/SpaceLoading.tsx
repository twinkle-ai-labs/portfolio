import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@Store/index';
import translations from '@Data/i18n';

interface ISpaceLoadingProps {
    /** 0-100 asset download progress. Defaults to 0 for the route-chunk stage, which can't measure it yet. */
    progress?: number;
    /** Which rotating gameplay tip to show. */
    tipIndex?: number;
    /** Fades the screen out once the world is ready. */
    hidden?: boolean;
}

/**
 * The Space page's loading screen.
 *
 * Deliberately shared between two consumers so the player only ever perceives ONE screen:
 * the router-level Suspense fallback (while the Space JS chunk downloads) and the in-page
 * screen (while the 3D assets download) render identical markup, so the handoff between
 * them is invisible instead of popping between two different-looking loaders.
 */
const SpaceLoading = ({progress = 0, tipIndex = 0, hidden = false}: ISpaceLoadingProps) => {
    const language = useSelector((state: RootState) => state.language.value) as 'ko' | 'en';
    const t = translations[language].space;

    return (
        <div className={hidden ? 'space-loading-screen hide' : 'space-loading-screen'} role="status" aria-live="polite">
            <div className="space-loading-orbit">
                <div className="space-loading-ring"/>
                <div className="space-loading-ring space-loading-ring-2"/>
                <div className="space-loading-core"/>
            </div>
            <div className="space-loading-title">{t.loading}</div>
            <div className="space-loading-bar">
                <div className="space-loading-bar-fill" style={{width: `${progress}%`}}/>
            </div>
            <div className="space-loading-percent">{progress}%</div>
            <div key={tipIndex} className="space-loading-tip">{t.loadingTips[tipIndex]}</div>
        </div>
    );
};

export default SpaceLoading;
