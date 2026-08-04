import React, {ReactNode} from "react";
import {FaCalendar, FaMailBulk, FaPhoneAlt, FaUser, FaUserGraduate, FaUserTie} from "react-icons/fa";
import {Tooltip} from "@mui/material";
import {LocalizedText} from "@Utils/i18n";

export interface IPerson {
    /** 화면에 나가는 값은 @Utils/i18n 의 Localized 규약을 따릅니다 — t(config.profile.name) 으로 씁니다. */
    name: LocalizedText,
    /** 표기용 보관값. 현재 화면에는 노출하지 않습니다. */
    nameChinese: string
    nickname: string
    birth: string,
    tel: string,
    email: string
    degree: string
    /** 이름 아래 한 줄로 붙는 직함 (사이드바 프로필) */
    job: LocalizedText
}

export interface IConfig {
    logoText: string
    titleText: string
    profile: IPerson
}

const config: IConfig = {
    logoText: 'Twinkle',
    titleText: "Twinkle's Portfolio",
    profile: {
        name: {ko: '김희정', en: 'Heejeong Kim'},
        nameChinese: '金禧呈',
        nickname: 'Twinkle',
        birth: '1997.08.06',
        tel: '010-5705-9594',
        email: 'developer.heejeong@gmail.com',
        degree: 'Bachelor of Computer Engineering',
        job: {ko: '백엔드 개발자', en: 'Backend Developer'}
    }
}

export interface IProfile {
    title: string
    text: ReactNode | string
    icon: ReactNode | undefined
}

export const profiles: IProfile[] = [
    {title: '이름', text: config.profile.name.ko, icon: (<FaUser/>)},
    {title: '생년월일', text: config.profile.birth, icon: (<FaCalendar/>)},
    {title: '경력', text: "실무 만 5년", icon: (<FaUserTie/>)},
    {
        title: '연락처', text: (
            <Tooltip title={"전화 걸기"} arrow={true}>
                <a href={"tel:" + config.profile.tel}>{config.profile.tel}</a>
            </Tooltip>), icon: (<FaPhoneAlt/>)
    },
    {
        title: '이메일',
        text: (
            <Tooltip title={"메일 보내기"} arrow={true}>
                <a href={"mailto:" + config.profile.email}>{config.profile.email}</a>
            </Tooltip>),
        icon: (<FaMailBulk/>)
    },
    {title: '학력', text: config.profile.degree, icon: (<FaUserGraduate/>)},
]

export interface mbtiProps {
    left: ReactNode | string
    right: ReactNode | string
    val: number
    color: "primary" | "inherit" | "secondary" | "error" | "info" | "success" | "warning" | undefined
    tooltip: string
}

export const mbti: mbtiProps[] = [
    {
        left: (<>I <span className={"pc"}>(Introverted)</span></>),
        right: (<>E <span className={"pc"}>(Extraverted)</span></>),
        val: 64,
        color: "primary",
        tooltip: 'E 64%'
    },
    {
        left: (<>N <span className={"pc"}> (Intuitive)</span></>),
        right: (<>S <span className={"pc"}> (Observant)</span></>),
        val: 46,
        color: "warning",
        tooltip: 'N 54%'
    },
    {
        left: (<>F <span className={"pc"}> (Feeling)</span></>),
        right: (<>T <span className={"pc"}> (Thinking) </span></>),
        val: 54,
        color: "success",
        tooltip: 'T 54%'
    },
    {
        left: (<>P <span className={"pc"}> (Prospecting)</span></>),
        right: (<>J <span className={"pc"}> (Judging)</span></>),
        val: 76,
        color: "secondary",
        tooltip: 'J 76%'
    },
    {
        left: (<>T <span className={"pc"}> (Turbulent)</span></>),
        right: (<>A <span className={"pc"}> (Assertive)</span></>),
        val: 67,
        color: "error",
        tooltip: 'A 67%'
    },
]
export default config;
