import React, {ReactNode} from "react";
import {SiVelog} from "react-icons/si";
import {FaEnvelope, FaGithub} from "react-icons/fa";
import {IoHome, IoIdCard, IoPersonCircle} from "react-icons/io5";
import {FaBriefcase, FaCode} from "react-icons/fa6";
import config from "@Data/config";

export interface ILink {
    id: string,
    name: string
    link: string
    color?: string
    icon?: ReactNode | undefined
}

export const links: ILink[] = [
    {id: 'email', name: '이메일', link: 'mailto:' + config.profile.email, color: '#ea4335', icon: (<FaEnvelope/>)},
    {id: 'blog', name: '블로그', link: 'https://velog.io/@developer_khj', color: '#20c997', icon: (<SiVelog/>)},
    {id: 'github', name: '깃허브', link: 'https://github.com/hjkim1004', color: '#fff', icon: (<FaGithub/>)}
]
export const menus: ILink[] = [
    {id: 'home', name: 'Home', link: '#s_home', icon: (<IoHome />)},
    {id: 'profile', name: 'Profile', link: '#s_profile', icon: (<IoPersonCircle />)},
    {id: 'career', name: 'Experience', link: '#s_career', icon: (<FaBriefcase />)},
    {id: 'project', name: 'Projects', link: '#s_project', icon: (<IoIdCard />)},
    {id: 'skill', name: 'Skills', link: '#s_skill', icon: (<FaCode />)},
]
