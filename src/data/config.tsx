import React, {ReactNode} from "react";
import {FaCalendar, FaMailBulk, FaPhoneAlt, FaUser, FaUserGraduate, FaUserTie} from "react-icons/fa";
import {Tooltip} from "@mui/material";

export interface MultiLanguage {
    korean: string
    english?: string
    chinese?: string
}

export interface IPerson {
    name: MultiLanguage,
    nickname: string
    birth: string,
    tel: string,
    email: string
    degree: string
    jobs: string[]
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
        name: {korean: '김희정', english: 'Heejeong Kim', chinese: '金禧呈'},
        nickname: 'Twinkle',
        birth: '1997.08.06',
        tel: '010-5705-9594',
        email: 'developer.heejeong@gmail.com',
        degree: 'Bachelor of Computer Engineering',
        jobs: ['Full-Stack Developer', 'Backend Developer']
    }
}

export interface IProfile {
    title: string
    text: ReactNode | string
    icon: ReactNode | undefined
}

export const profiles: IProfile[] = [
    {title: '이름', text: config.profile.name.korean, icon: (<FaUser/>)},
    {title: '생년월일', text: config.profile.birth, icon: (<FaCalendar/>)},
    {title: '경력', text: "5년차 (4년 10개월)", icon: (<FaUserTie/>)},
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
