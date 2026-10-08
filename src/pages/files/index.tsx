import React, {useEffect} from 'react';
import Header from "@Layout/header";
import Footer from "@Layout/footer";
import DrawerSection from "@Layout/drawer";
import FileVault from "@Pages/files/components/FileVault";
import * as process from "process";

const App = () => {
    useEffect(() => {
        document.title = process.env.TITLE + " | Files";
        // 키가 있어야 여는 문서라 검색에 실리지 않게 한다. SPA 라 라우트마다 meta 를 손으로 단다.
        const robots = document.createElement('meta');
        robots.name = 'robots';
        robots.content = 'noindex, nofollow';
        document.head.appendChild(robots);
        return () => {
            robots.remove();
        };
    }, []);

    return (
        <>
            <Header/>
            <main id="content">
                <FileVault/>
            </main>
            <DrawerSection/>
            <Footer/>
        </>
    );
};

export default App;
