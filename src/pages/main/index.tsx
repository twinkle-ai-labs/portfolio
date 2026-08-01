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
    return (
        <>
            <ScrollBar/>
            <Header showMenu={true}/>
            <main id="content">
                <HomeSection/>
                <ProfileSection/>
                <CareerSection/>
                <ProjectSection/>
                <SkillSection/>
            </main>

            <DrawerSection />
            <FlopMenu/>
            <Footer/>
        </>
    );
};

export default App;
