import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {IconButton} from "@mui/material";
import {SlMenu} from "react-icons/sl";
import {changeOffset} from "@Store/slice/offset";
import {menus} from "@Data/link";
import {DrawerType, openDrawer} from "@Store/slice/drawer";
import {changeLanguage, LanguageType} from "@Store/slice/language";
import Logo from "@Components/section/logo";

const Header = () => {
    const dispatch = useDispatch()
    const offset = useSelector((state: RootState) => state.offset.value)
    const language = useSelector((state: RootState) => state.language.value)

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
                <button
                    className="lang-toggle"
                    type="button"
                    onClick={() => dispatch(changeLanguage(language === LanguageType.KO ? LanguageType.EN : LanguageType.KO))}
                    aria-label="Switch language"
                >
                    {language === LanguageType.KO ? 'KO' : 'EN'}
                </button>
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
