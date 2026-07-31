import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tippy.js/dist/tippy.css';
import '@Fonts/notokr/notokr.css'
import '@Fonts/default.css'
import '@Style/transition.css';
import '@Style/style.css';
import '@Style/dark.css';
import '@Style/mobile.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "@Store/index";

const MainApp = React.lazy(() => import("@Pages/main"));
const SpaceApp = React.lazy(() => import("@Pages/space"));
const ErrorApp = React.lazy(() => import("@Pages/error"));
const ResumeApp = React.lazy(() => import("@Pages/resume"));

import {createBrowserRouter, RouterProvider, useLocation,} from "react-router-dom";
import * as process from "process";
import GlobalModal from "@Components/modal/global";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const Root = () => {
    return (
        <div className="app-loading-screen" role="status" aria-live="polite">
            <div className="app-loading-card">
                <span className="app-loading-mark">HJ</span>
                <div className="app-loading-body">
                    <span className="app-loading-text">Loading...</span>
                    <span className="app-loading-bar" aria-hidden="true">
                        <i/>
                    </span>
                </div>
            </div>
        </div>
    )
}

const GA_MEASUREMENT_ID = 'G-5M8ND449DZ';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

const AnalyticsTracker = () => {
    const location = useLocation();

    React.useEffect(() => {
        if (typeof window.gtag !== 'function') {
            return;
        }

        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: location.pathname + location.search + location.hash,
            page_location: window.location.href,
        });
    }, [location]);

    return null;
};

const AppShell = ({children}: { children: React.ReactNode }) => {
    return (
        <React.Suspense fallback={<Root />}>
            <AnalyticsTracker/>
            {children}
        </React.Suspense>
    );
};

const routes = [
    {
        path: "/",
        element: <AppShell><MainApp/></AppShell>,
    },
    {
        path: "space",
        element: <AppShell><SpaceApp/></AppShell>,
    },
    {
        path: "resume",
        element: <AppShell><ResumeApp/></AppShell>
    },
    {
        path: "*",
        element: <AppShell><ErrorApp/></AppShell>,
    },
]

const router = createBrowserRouter(routes, {
    basename: process.env.PUBLIC_URL,
    future: {
        v7_fetcherPersist: true,
    },
});
const app = (
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} fallbackElement={<Root/>}/>
            <GlobalModal/>
        </Provider>
    </React.StrictMode>
);

if (process.env.NODE_ENV === 'development') {
    import('./dev/root').then(({default: DevRoot}) => root.render(<DevRoot>{app}</DevRoot>));
} else {
    root.render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
