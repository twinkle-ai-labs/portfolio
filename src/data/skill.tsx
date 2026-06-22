import {ReactNode} from "react";
import {SiJquery, SiSpring, SiSpringboot} from "react-icons/si";
import {BiLogoTypescript} from "react-icons/bi";
import {FaCss3Alt, FaDatabase, FaGitAlt, FaGithub, FaHtml5} from "react-icons/fa6";
import {RiJavascriptFill} from "react-icons/ri";
import {GrMysql} from "react-icons/gr";

import IntelliJIcon from '@Images/tech_intellij.svg'
import JavaIcon from '@Images/tech_java.svg'
import MyBatisIcon from '@Images/tech_mybatis.png'
import StsIcon from '@Images/tech_sts.png'
import ApacheIcon from '@Images/tech_apache.svg'
import TomcatIcon from '@Images/tech_tomcat.svg'
import WebStormIcon from '@Images/tech_WebStorm.svg'
import PhpStormIcon from '@Images/tech_PhpStorm.svg'
import PhpIcon from '@Images/tech_php.svg'
import VSCodeIcon from '@Images/tech_vscode.svg'
import PostgresIcon from '@Images/tech_postgresql.svg'
import SqlServerIcon from '@Images/tech_sqlserver.svg'
import ReactIcon from '@Images/tech_react.svg'
import MongoDBIcon from '@Images/tech_mongodb.svg'
import GitHubActionIcon from '@Images/tech_githubactions.svg'
import ActiveMQIcon from '@Images/tech_activemq.png'
import KotlinIcon from '@Images/tech_kotlin.png';
import AndroidStudioIcon from '@Images/tech_android.png';
import SpringSecurityIcon from '@Images/tech_springsecurity.png'
import SwiftIcon from '@Images/tech_swift.svg';
import XCodeIcon from '@Images/tech_xcode.svg';
import FigmaIcon from '@Images/tech_figma.svg';
import {FcLinux} from "react-icons/fc";
import {LazyLoadImage} from "react-lazy-load-image-component";

export const SkillGroup = {
    CORE: 'core',
    FRONT: 'front',
    SERVER: 'server',
    RDBMS: 'rdbms',
    NOSQL: 'nosql',
    IDE: 'tool',
    VCS: 'vcs',
    APP: 'app',
    OTHER: 'other'
}

export interface ISKill {
    id: string
    name: string
    rating?: number
    description?: string
    features?: string[]
    icon?: ReactNode | undefined
    color?: string
    group?: string
    index?: number
}

const skills: ISKill[] = [
    /* Core */
    {
        id: 'java',
        name: 'Java',
        color: '#de0a17',
        icon: (<LazyLoadImage src={JavaIcon} alt={"Java Icon"} title={"Java Icon"}/>),
        group: SkillGroup.CORE
    },
    {
        id: 'spring',
        name: 'Spring',
        color: '#5cb230',
        icon: (<SiSpring/>),
        group: SkillGroup.CORE
    },
    {
        id: 'springboot',
        name: 'Spring Boot',
        icon: (<SiSpringboot/>),
        color: '#68bd45',
        group: SkillGroup.CORE
    },
    {
        id: 'mybatis',
        name: 'MyBatis',
        icon: (<LazyLoadImage src={MyBatisIcon} alt={"MyBatis Icon"} title={"MyBatis Icon"}/>),
        group: SkillGroup.CORE
    },
    {
        id: 'jpa',
        name: 'JPA + QueryDSL',
        icon: (<FaDatabase/>),
        color: '#68bd45',
        group: SkillGroup.CORE
    },
    {
        id: 'springsecurity',
        name: 'Spring Security',
        icon: (<LazyLoadImage src={SpringSecurityIcon} alt={"Spring Security Icon"} title={"Spring Security Icon"}/>),
        group: SkillGroup.CORE
    },

    /* Front End */
    {
        id: 'html',
        name: 'HTML',
        icon: (<FaHtml5/>),
        color: '#ff5722',
        group: SkillGroup.FRONT
    },
    {
        id: 'css',
        name: 'CSS',
        icon: (<FaCss3Alt/>),
        color: '#1775bb',
        group: SkillGroup.FRONT
    },
    {
        id: 'js',
        name: 'JavaScript',
        icon: (<RiJavascriptFill/>),
        color: '#fbaf41',
        group: SkillGroup.FRONT
    },
    {
        id: 'jquery',
        name: 'jQuery',
        icon: (<SiJquery/>),
        color: '#0868ac',
        group: SkillGroup.FRONT
    },
    {
        id: 'ts',
        name: 'TypeScript',
        icon: (<BiLogoTypescript/>),
        color: '#007bcd',
        group: SkillGroup.FRONT
    },
    {
        id: 'react',
        name: 'React',
        rating: 1.5,
        icon: (<LazyLoadImage src={ReactIcon} alt={"React Icon"} title={"React Icon"}/>),
        color: '#61dbfb',
        group: SkillGroup.FRONT
    },

    /* Server */
    {
        id: 'apache',
        name: 'Apache Web Server',
        icon: (<LazyLoadImage src={ApacheIcon} alt={"Apache Icon"} title={"Apache Icon"}/>),
        group: SkillGroup.SERVER
    },
    {
        id: 'tomcat',
        name: 'Tomcat',
        icon: (<LazyLoadImage src={TomcatIcon} alt={"Tomcat Icon"} title={"Tomcat Icon"}/>),
        group: SkillGroup.SERVER
    },
    {
        id: 'linux',
        name: 'Linux',
        icon: (<FcLinux/>),
        group: SkillGroup.SERVER
    },
    {
        id: 'githubactions',
        name: 'GitHub Actions',
        icon: (<LazyLoadImage src={GitHubActionIcon} alt={"GitHub Actions Icon"} title={"GitHub Actions Icon"}/>),
        group: SkillGroup.SERVER
    },

    /* Database */
    {
        id: 'postgres',
        name: 'PostgreSQL',
        icon: (<LazyLoadImage src={PostgresIcon} alt={"React Icon"} title={"React Icon"}/>),
        group: SkillGroup.RDBMS
    },
    {
        id: 'mssql',
        name: 'SQL Server',
        icon: (<LazyLoadImage src={SqlServerIcon} alt={"SQL Server Icon"} title={"SQL Server Icon"}/>),
        group: SkillGroup.RDBMS
    },
    {
        id: 'mysql',
        name: 'MySQL',
        icon: (<GrMysql/>),
        color: '#00718b',
        group: SkillGroup.RDBMS
    },
    {
        id: 'oracle',
        name: 'Oracle',
        icon: (<FaDatabase/>),
        color: '#f70000',
        group: SkillGroup.RDBMS
    },
    {
        id: 'mongo',
        name: 'MongoDB',
        rating: 1,
        icon: (<LazyLoadImage src={MongoDBIcon} alt={"MongoDB Icon"} title={"MongoDB Icon"}/>),
        group: SkillGroup.NOSQL
    },

    /* Tool */
    {
        id: 'sts',
        name: 'STS',
        icon: (<LazyLoadImage src={StsIcon} alt={"STS Icon"} title={"STS Icon"}/>),
        group: SkillGroup.IDE
    },
    {
        id: 'intellij',
        name: 'IntelliJ',
        icon: (<LazyLoadImage src={IntelliJIcon} alt={"IntelliJ Icon"} title={"IntelliJ Icon"}/>),
        group: SkillGroup.IDE
    },
    {
        id: 'webstorm',
        name: 'WebStorm',
        icon: (<LazyLoadImage src={WebStormIcon} alt={"WebStorm Icon"} title={"WebStorm Icon"}/>),
        group: SkillGroup.IDE
    },

    /* VCS */
    {
        id: 'git',
        name: 'Git',
        icon: (<FaGitAlt/>),
        color: '#e84d31',
        group: SkillGroup.VCS
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: (<FaGithub/>),
        color: '#000',
        group: SkillGroup.VCS
    },
    /* App */
    {
        id: 'kotlin',
        name: 'kotlin',
        rating: 1,
        icon: (<LazyLoadImage src={KotlinIcon} alt={"Kotlin Icon"} title={"Kotlin Icon"}/>),
        group: SkillGroup.APP
    },
    {
        id: 'android',
        name: 'Android Studio',
        rating: 1,
        icon: (<LazyLoadImage src={AndroidStudioIcon} alt={"Android Studio Icon"} title={"Android Studio Icon"}/>),
        group: SkillGroup.APP
    },
    {
        id: 'swift',
        name: 'swift',
        rating: 1,
        icon: (<LazyLoadImage src={SwiftIcon} alt={"Swift Icon"} title={"Swift Icon"}/>),
        group: SkillGroup.APP
    },
    {
        id: 'xcode',
        name: 'xcode',
        rating: 1,
        icon: (<LazyLoadImage src={XCodeIcon} alt={"XCode Icon"} title={"XCode Icon"}/>),
        group: SkillGroup.APP
    },

    /* Other */
    {
        id: 'php',
        name: 'PHP',
        rating: 1,
        icon: (<LazyLoadImage src={PhpIcon} alt={"Php Icon"} title={"Php Icon"}/>),
        group: SkillGroup.OTHER
    },
    {
        id: 'phpstorm',
        name: 'PhpStorm',
        icon: (<LazyLoadImage src={PhpStormIcon} alt={"PhpStorm Icon"} title={"PhpStorm Icon"}/>),
        group: SkillGroup.OTHER
    },
    {
        id: 'vscode',
        name: 'VS Code',
        icon: (<LazyLoadImage src={VSCodeIcon} alt={"VSCode Icon"} title={"VSCode Icon"}/>),
        group: SkillGroup.OTHER
    },

    {
        id: 'figma',
        name: 'figma',
        icon: (<LazyLoadImage src={FigmaIcon} alt={"Figma Icon"} title={"Figma Icon"}/>),
        group: SkillGroup.OTHER
    },
]
export default skills;