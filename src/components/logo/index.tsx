import React from 'react';
import {Link} from "react-router-dom";
import config from "@Data/config";
import {useLocale} from "@Utils/i18n";

const Logo = () => {
    const {t} = useLocale();

    return (
        <div className="logo" translate="no">
            <Link to={"/"} title={t({ko: '메인페이지 이동', en: 'Go to home'})}>
                <div className="logo-mark">HJ</div>
                <div className="title">{t(config.profile.name)}</div>
            </Link>
        </div>
    );
};

export default Logo;
