import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {IconButton} from "@mui/material";
import {SlMenu} from "react-icons/sl";
import {changeOffset} from "@Store/slice/offset";
import {menus} from "@Data/link";
import {DrawerType, openDrawer} from "@Store/slice/drawer";
import Logo from "@Components/section/logo";
import LanguageSelect from "@Components/section/language";

const Header = () => {
    const dispatch = useDispatch()
    const offset = useSelector((state: RootState) => state.offset.value)

    useEffect(() => {
        const onScroll = () => dispatch(changeOffset(window.scrollY));

        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);


    return (
        <header className={offset > 0 ? "header scrolled" : "header"}>
            <div className="inner">
                <Logo/>
                <div className="flex-1"></div>
                <ul className="header-nav">
                    {menus.map(menu => {
                        return (
                            <li key={'menu_' + menu.id}>
                                <a href={menu.link}
                                   title={menu.name}
                                   translate="no"
                                   onClick={(event) => {
                                       if (!menu.link.startsWith('#')) return;
                                       event.preventDefault();
                                       document.querySelector(menu.link)?.scrollIntoView({
                                           behavior: 'smooth',
                                           block: 'start'
                                       });
                                   }}
                                >{menu.name}</a>
                            </li>
                        )
                    })}
                </ul>
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
