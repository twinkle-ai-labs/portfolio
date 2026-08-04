import React, {useEffect} from 'react';
import NotFound from "@Pages/error/404";
import Header from "@Layout/header";
import DrawerSection from "@Layout/drawer";
import * as process from "process";

const App = () => {
    useEffect(() => {
        document.title = process.env.TITLE + " | 404 NOT FOUND";
    }, []);

    return (
        <>
            {/* 헤더 메뉴는 서브페이지에서 "/#s_xxx" 로 홈에 착지하므로 404에서도 그대로 쓸 수 있습니다.
                모바일 햄버거가 여는 서랍이 이 페이지에도 있어야 빈 버튼이 되지 않습니다. */}
            <Header/>
            <main id="content">
                <NotFound/>
            </main>
            <DrawerSection/>
        </>
    );
};

export default App;
