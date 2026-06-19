import React from 'react';
import {Link} from "react-router-dom";
import config from "@Data/config";

const Logo = () => {
    return (
        <div className="logo" translate="no">
            <Link to={"/"} title={"메인페이지 이동"}>
                <div className="logo-mark">HJ</div>
                <div className="title">{config.profile.name.english}</div>
            </Link>
        </div>
    );
};

export default Logo;
