import React from 'react';
import {links} from "@Data/link";
import Logo from "@Components/logo";
import {useLocale} from "@Utils/i18n";

const Footer = () => {
    const {t} = useLocale();

    return (
        <footer className="footer section">
            <Logo/>
            <div>
                Copyright 2024. Heejeong Kim. All rights reserved.
            </div>

            <ul className="footer-link">
                {links.map(e => {
                    const name = t(e.name);
                    return (
                        <li key={"footer-link-" + e.id}>
                            {/* 아이콘만 있는 링크라 접근 가능한 이름을 별도로 붙입니다. */}
                            <a href={e.link} target="_blank" rel="noreferrer" aria-label={name} title={name}>
                                {e.icon}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </footer>
    );
};

export default Footer;
