import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tippy.js/dist/tippy.css';
import '@Fonts/notokr/notokr.css'
import '@Fonts/default.css'
import '@Style/transition.css';
import '@Style/style.css';
import '@Style/light.css';
import '@Style/dark.css';
import '@Style/mobile.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "@Store/index";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

import MainApp from "@Pages/main";
import SpaceApp from "@Pages/space";
import ErrorApp from "@Pages/error";
import ResumeApp from "@Pages/resume";

import {createBrowserRouter, RouterProvider, useLocation,} from "react-router-dom";
import * as process from "process";
import GlobalModal from "@Components/modal/global";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const Root = () => {
    return (
        <div>Loading</div>
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
        <>
            <AnalyticsTracker/>
            {children}
        </>
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
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <DevSupport ComponentPreviews={ComponentPreviews}
                        useInitialHook={useInitial}
            >
                <RouterProvider router={router} fallbackElement={<Root/>}/>
            </DevSupport>
            <GlobalModal/>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
