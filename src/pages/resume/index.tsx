import Header from "@Layout/header";
import DrawerSection from "@Layout/drawer";
import HomeSection from "@Pages/resume/section/home";

import '@Style/lib/aos/2.3.1/aos.css'
import AOS from "aos";
import {useEffect} from "react";

const App = () => {
    useEffect(() => {
        AOS.init({duration: 1000});
    }, []);

    return (
        <>
            <Header/>
            <main id="content" className={'resume'}>
                <HomeSection />
            </main>
            <DrawerSection />
        </>
    );
};

export default App;
