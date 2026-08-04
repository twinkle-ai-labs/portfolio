import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {IconButton} from "@mui/material";
import {SlMenu} from "react-icons/sl";
import {changeOffset} from "@Store/slice/offset";
import {menus} from "@Data/link";
import {DrawerType, openDrawer} from "@Store/slice/drawer";
import Logo from "@Components/logo";
import LanguageSelect from "@Components/language";

interface HeaderState {
    showMenu?: boolean;
}

const Header = (
    props: HeaderState
) => {
    const dispatch = useDispatch()
    const offset = useSelector((state: RootState) => state.offset.value)
    
    // Default showMenu to true if not explicitly set to false
    const showMenu = props.showMenu !== false;

    useEffect(() => {
        const onScroll = () => dispatch(changeOffset(window.scrollY));

        // 새로고침으로 중간 지점에 복원된 경우에도 유리판이 바로 깔리도록 초기값을 맞춥니다.
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);


    return (
        <header className={offset > 0 ? "header scrolled" : "header"}>
            <div className="inner">
                <Logo/>
                <div className="flex-1"></div>
                {showMenu && (
                    <ul className="header-nav">
                        {menus.map(menu => {
                            return (
                                <li key={'menu_' + menu.id}>
                                    <a href={menu.link}
                                       title={menu.name}
                                       translate="no"
                                       onClick={(event) => {
                                           // Extract the target hash (e.g. "/#s_profile" -> "#s_profile")
                                           const hashIndex = menu.link.indexOf('#');
                                           if (hashIndex === -1) return;
                                           
                                           const hash = menu.link.slice(hashIndex);
                                           
                                           // Detect if the user is on the main landing page (local dev, production, or GitHub Pages subpath)
                                           const isHomePage = window.location.pathname === '/' || 
                                                              window.location.pathname === '/index.html' || 
                                                              window.location.pathname === '/hjkim1004.github.io/' ||
                                                              window.location.pathname.endsWith('/index.html');
                                           
                                           if (isHomePage) {
                                               event.preventDefault();
                                               document.querySelector(hash)?.scrollIntoView({
                                                   behavior: 'smooth',
                                                   block: 'start'
                                               });
                                               // Update URL hash cleanly without a full page reload
                                               window.history.pushState(null, '', hash);
                                           }
                                           // If on a subpage (e.g. /space or /resume), let the browser redirect to "/" with the hash.
                                       }}
                                    >{menu.name}</a>
                                </li>
                            )
                        })}
                    </ul>
                )}

                <LanguageSelect/>
                <IconButton className="header-icon" onClick={() => {
                    dispatch(openDrawer(DrawerType.SIDEBAR))
                }}>
                    <SlMenu/>
                </IconButton>
            </div>
        </header>
    );
};

export default Header;
