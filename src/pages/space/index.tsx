import React from 'react';

import HomeSection from "@Pages/space/section/home";
import Header from "@Layout/header";
import DrawerSection from "@Layout/drawer";
import TwinkleBadge from "@Components/badge/TwinkleBadge";

const App = () => {
    return (
        <>
            <Header/>
            <main id="content" className={'wallpaper'}>
                <HomeSection />
            </main>
            <DrawerSection />
            <TwinkleBadge/>
        </>
    );
};

export default App;
