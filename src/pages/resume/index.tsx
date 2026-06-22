import Header from "@Layout/header";
import DrawerSection from "@Layout/drawer";
import HomeSection from "@Pages/resume/section/home";

const App = () => {
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
