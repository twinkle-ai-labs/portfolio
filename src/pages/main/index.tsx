import React from 'react';

import Header from "@Layout/header";
import Footer from "@Layout/footer";
import FlopMenu from "@Layout/flop";
import ScrollBar from "@Layout/scrollbar";
import DrawerSection from "@Layout/drawer";

import HomeSection from "@Pages/main/section/home";
import ProfileSection from "@Pages/main/section/profile";
import SkillSection from "@Pages/main/section/skill";
import CareerSection from "@Pages/main/section/career";
import ProjectSection from "@Pages/main/section/project";

const App = () => {
    const handlePrintPdf = () => {
        window.print();
    };

    return (
        <>
            <ScrollBar/>
            <Header/>
            <main id="content">
                <HomeSection/>
                <ProfileSection/>
                <CareerSection/>
                <ProjectSection/>
                <SkillSection/>
            </main>
            <button className="pdf-export-button no-print" type="button" onClick={handlePrintPdf}>
                <span aria-hidden="true">📄</span>
                PDF 저장
            </button>

            <DrawerSection />
            <FlopMenu/>
            <Footer/>
        </>
    );
};

export default App;
