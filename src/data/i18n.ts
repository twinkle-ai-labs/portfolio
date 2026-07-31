/**
 * UI 껍데기(섹션 제목, 라벨, 버튼 등) 문자열 카탈로그.
 *
 * 프로젝트·경력처럼 구조가 있는 콘텐츠는 이 파일이 아니라 각 데이터 파일에서
 * 필드 단위로 {ko, en} (LocalizedText) 를 들고 있습니다. @Utils/i18n 참고.
 */
export interface ITranslations {
    nav: {
        home: string;
        profile: string;
        career: string;
        project: string;
        skill: string;
    };
    hero: {
        kicker: string;
        desc: string;
        ready: string[];
        ctaProject: string;
        available: string;
        careerSummaryLabel: string;
        careerSummary: string[];
        coreStrengthsLabel: string;
        coreStrengths: string[];
    };
    stats: {
        years: string;
        projects: string;
        perf: string;
        users: string;
    };
    language: {
        /** 셀렉트 박스에 노출되는 언어 이름 — 현재 언어 기준으로 표기합니다. */
        ko: string;
        en: string;
        select: string;
        current: string;
    };
    profile: {
        eyebrow: string;
        title: string[];
        subtitle: string;
        factCareer: string;
        factEducation: string;
        factCurrent: string;
        factScope: string;
        careerValue: string;
        careerNote: string;
        educationValue: string;
        educationNote: string;
        currentValue: string;
        currentNote: string;
        scopeValue: string;
        scopeNote: string;
        certLabel: string;
        certificates: string[];
        /** 머리글 바로 아래에 붙는 역할·기술 태그 */
        tags: string[];
        /** 섹션 안의 하위 블록 — 무엇을 믿는가 */
        philosophyEyebrow: string;
        philosophyTitle: string[];
        philosophyDesc: string;
        /** 섹션 안의 하위 블록 — 어떻게 일하는가 (DevOps 도식이 왜 있는지 알려 줍니다) */
        howEyebrow: string;
        howTitle: string;
        capabilities: { title: string; desc: string }[];
        /** DevOps 인피니티 다이어그램의 단계명 — Dev 루프 4개, Ops 루프 4개. */
        devopsFlow: { dev: string[]; ops: string[] };
        devopsCaption: string;
        devopsLoop: string;
    };
    experience: {
        eyebrow: string;
        title: string[];
        subtitle: string;
        corporate: string;
        freelance: string;
        countSuffix: string;
        features: string;
        projects: string;
        start: string;
        end: string;
        joined: string;
        left: string;
        ongoing: string;
        maintaining: string;
        period: string;
        jumpBadge: string;
        logoAlt: string;
    };
    project: {
        eyebrow: string;
        title: string[];
        subtitle: string;
        keyAchievements: string;
        techStack: string;
        close: string;
        prev: string;
        next: string;
        tableOfContents: string;
    };
    skill: {
        eyebrow: string;
        title: string[];
        subtitle: string;
        groups: { title: string; summary: string }[];
    };
    badge: {
        twinkle: string;
        modalTitle: string;
        modalDesc: string[];
    };
    space: {
        title: string;
        desc: string[];
        openModal: string;
        loading: string;
    };
}

const translations: Record<'ko' | 'en', ITranslations> = {
    ko: {
        nav: {
            home: 'Home',
            profile: 'Profile',
            career: 'Experience',
            project: 'Projects',
            skill: 'Skills',
        },
        hero: {
            kicker: 'Backend Engineer · Systems Architect',
            desc: '복잡한 비즈니스 로직을 견고한 데이터 모델과 유연한 API로 구체화하고, 자동화된 배포 파이프라인과 정교한 모니터링으로 서비스가 멈추지 않게 만듭니다.',
            ready: ['서버·인프라 아키텍처 설계', '클라우드 배포 자동화', '장애 대응 · 운영 관측', 'API 설계 및 성능 최적화'],
            ctaProject: '프로젝트 보기 🚀',
            available: 'available for work',
            careerSummaryLabel: 'Career Summary',
            careerSummary: ['실무 경력: 만 5년', '현직장: 아이나비시스템즈', '직무: Lead Backend Engineer · DevOps'],
            coreStrengthsLabel: 'Core Strengths',
            coreStrengths: [
                '서버·인프라 아키텍처 전주기 단독 설계',
                '클라우드 배포 자동화와 운영 관측 체계 구축',
                '대량 로그·배치·분석 대시보드 파이프라인 구현',
                '레거시 병목 제거 및 p99 검색 응답 약 80배 개선',
                '백오피스·하이브리드 앱·외부 API를 잇는 풀스택 제품 경험',
                '보안·권한·SEO·문서화까지 고려한 운영형 개발',
            ],
        },
        stats: {
            years: 'YEARS · 실무 경력',
            projects: 'PROJECTS LED · 주도 프로젝트',
            perf: 'PERF BOOST · 응답 속도 개선',
            users: 'USERS SERVED · 서비스 이용자',
        },
        language: {
            ko: 'Korean',
            en: 'English',
            select: '언어 선택',
            current: '현재 언어',
        },
        profile: {
            eyebrow: 'Profile',
            /* [0] 은 역할, 강조되는 이름은 config 의 프로필에서 가져옵니다. */
            title: ['백엔드 엔지니어'],
            subtitle: '설계부터 운영까지 서버의 전 구간을 맡아 온 5년차 백엔드 엔지니어입니다.',
            factCareer: '경력',
            factEducation: '학력',
            factCurrent: '현재',
            factScope: '범위',
            careerValue: '만 5년',
            careerNote: 'Backend · DevOps',
            educationValue: '컴퓨터공학 학사',
            educationNote: '4년제 학사 학위',
            currentValue: '아이나비시스템즈',
            currentNote: 'Lead Backend Engineer',
            scopeValue: '설계 → 배포 → 운영',
            scopeNote: '전 구간 단독 수행',
            certLabel: 'Certifications',
            certificates: ['리눅스마스터 2급', 'SQL 개발자', '정보처리기사'],
            tags: ['Backend Engineer', 'DevOps', '아키텍처 설계', 'Spring', 'Kotlin', 'AWS'],
            philosophyEyebrow: 'Engineering Philosophy',
            philosophyTitle: ['보이지 않는 곳의 완성도가', '서비스의 수준을 결정합니다'],
            philosophyDesc: '돌아가는 코드를 넘어, 비즈니스가 커져도 흔들리지 않는 구조를 만듭니다.',
            howEyebrow: 'How I Work',
            howTitle: '설계부터 개선까지, 전 구간을 직접 맡습니다',
            capabilities: [
                {title: '전체를 보는 시야', desc: '전체 흐름을 구조화해 복잡도를 낮춥니다.'},
                {title: '견고한 백엔드', desc: '도메인 책임을 나누고 데이터 계층을 분리합니다.'},
                {title: '배포 자동화', desc: '빌드부터 릴리즈까지 손댈 일을 없앱니다.'},
                {title: '운영 관측', desc: '시스템과 비즈니스 지표를 항상 지켜봅니다.'},
            ],
            devopsFlow: {
                dev: ['설계', '개발', '빌드', '테스트'],
                ops: ['배포', '운영', '관측', '개선'],
            },
            devopsCaption: '설계에서 개선으로 순환하는 DevOps 흐름',
            devopsLoop: '관측에서 얻은 지표를 다시 설계로 되돌리는 지속 개선 루프',
        },
        experience: {
            eyebrow: 'Experience',
            title: ['숫자보다 구조로 증명한', '5년의 궤적'],
            subtitle: '정규직과 프리랜서를 넘나들며 맡았던 회사·프로젝트별 핵심 역할을 시간순으로 정리했습니다.',
            corporate: 'Corporate Experience',
            freelance: 'Freelance & Contract Projects',
            countSuffix: '개',
            features: 'Features',
            projects: 'Projects',
            start: '시작',
            end: '완료',
            joined: '입사',
            left: '퇴사',
            ongoing: '재직중',
            maintaining: '유지보수중',
            period: '기간',
            jumpBadge: 'Projects에서 보기 ↓',
            logoAlt: '로고',
        },
        project: {
            eyebrow: 'Projects',
            title: ['직접 설계하고', '끝까지 책임진 프로젝트'],
            subtitle: '서버 1인 개발, 통계 파이프라인 구축, 스마트도서관 시스템 고도화까지 — 제품 흐름에 깊게 관여한 경험만 골랐습니다.',
            keyAchievements: 'Key Achievements',
            techStack: 'Tech Stack',
            close: '프로젝트 상세 닫기',
            prev: '이전 프로젝트',
            next: '다음 프로젝트',
            tableOfContents: '프로젝트 상세 목차',
        },
        skill: {
            eyebrow: 'Skills',
            title: ['나열이 아닌,', '맥락으로 정리한 기술'],
            subtitle: '단순 목록이 아니라 실제 서비스 개발, 배포, 운영에서 사용한 맥락을 기준으로 분류했습니다.',
            groups: [
                {title: 'Backend', summary: 'Kotlin·Java와 Spring 기반으로 API, 배치, 인증, 데이터 접근 계층을 구현합니다.'},
                {title: 'Product / Full-stack', summary: '백오피스, 하이브리드 앱, 관리자 화면, 외부 연동 API까지 서비스 흐름을 연결합니다.'},
                {title: 'Data / Batch', summary: '운영 로그와 서비스 데이터를 수집·가공하고 정기 집계 흐름을 설계합니다.'},
                {title: 'Infra / Operation', summary: '배포 파이프라인과 운영 관측 환경을 구성해 서비스 상태를 추적합니다.'},
                {title: 'Collaboration', summary: 'Scrum 기반 협업에서 PM, 기획, 디자인, 앱, 어드민과 서버 개발을 조율합니다.'},
            ],
        },
            badge: {
                twinkle: 'Twinkle Night Sky',
                modalTitle: 'Twinkle Night Sky',
                modalDesc: [
                    'Twinkle Night Sky는 사용자의 시선이 머무는 곳마다 별이 반짝이는 신비로운 밤하늘을 테마로 합니다.',
                    'Three.js를 활용하여 구현된 3D 우주 공간과 사용자의 포인터를 따라 걷는 캐릭터는 정적인 포트폴리오에 생동감을 불어넣습니다.',
                    '어두운 밤하늘(Deep Navy & Night Black) 색감은 콘텐츠에 대한 집중도를 높이며, 반짝이는 별 효과는 미래지향적이고 감각적인 사용자 경험을 선사합니다.'
                ],
            },
            space: {
                title: 'Twinkle Night Sky',
                desc: [
                    'Three.js 엔진을 활용하여 구현한 3D 밤하늘 공간입니다.',
                    '마우스나 터치로 화면 위 위치를 가리키면 캐릭터가 그 방향으로 걸어갑니다.',
                    '우주 공간 위에서 캐릭터를 직접 움직이며 탐험해보세요.'
                ],
                openModal: '공간 소개 보기',
                loading: '3D 공간을 불러오는 중...',
            },
        },
    en: {
        nav: {
            home: 'Home',
            profile: 'Profile',
            career: 'Experience',
            project: 'Projects',
            skill: 'Skills',
        },
        hero: {
            kicker: 'Backend Engineer · Systems Architect',
            desc: 'I turn complex business logic into solid data models and flexible APIs, and keep services running with automated deployment pipelines and precise monitoring.',
            ready: ['Server & infra architecture design', 'Cloud deployment automation', 'Incident response · observability', 'API design & performance tuning'],
            ctaProject: 'View Projects 🚀',
            available: 'available for work',
            careerSummaryLabel: 'Career Summary',
            careerSummary: ['Experience: 5+ years', 'Current: INAVI Systems', 'Role: Lead Backend Engineer · DevOps'],
            coreStrengthsLabel: 'Core Strengths',
            coreStrengths: [
                'Solo end-to-end design of server & infra architecture',
                'Built cloud deployment automation & observability stack',
                'Implemented large-scale log/batch/analytics dashboard pipelines',
                'Removed legacy bottlenecks, ~80x p99 search latency improvement',
                'Full-stack product experience across back office, hybrid apps & external APIs',
                'Operations-minded development covering security, access control, SEO & docs',
            ],
        },
        stats: {
            years: 'YEARS OF EXPERIENCE',
            projects: 'PROJECTS LED',
            perf: 'PERF BOOST',
            users: 'USERS SERVED',
        },
        language: {
            ko: 'Korean',
            en: 'English',
            select: 'Select language',
            current: 'Current language',
        },
        profile: {
            eyebrow: 'Profile',
            /* [0] 은 역할, 강조되는 이름은 config 의 프로필에서 가져옵니다. */
            title: ['Backend Engineer'],
            subtitle: 'A backend engineer of five years, owning servers end to end — from design through operation.',
            factCareer: 'Experience',
            factEducation: 'Education',
            factCurrent: 'Current',
            factScope: 'Scope',
            careerValue: '5+ years',
            careerNote: 'Backend · DevOps',
            educationValue: 'B.S. in Computer Science',
            educationNote: "Four-year bachelor's degree",
            currentValue: 'INAVI Systems',
            currentNote: 'Lead Backend Engineer',
            scopeValue: 'Design → Deploy → Operate',
            scopeNote: 'Owned end to end',
            certLabel: 'Certifications',
            certificates: ['Linux Master Level 2', 'SQL Developer (SQLD)', 'Engineer Information Processing'],
            tags: ['Backend Engineer', 'DevOps', 'Architecture', 'Spring', 'Kotlin', 'AWS'],
            philosophyEyebrow: 'Engineering Philosophy',
            philosophyTitle: ['The quality of what you cannot see', 'defines the quality of the service'],
            philosophyDesc: 'Beyond code that merely runs, I build structures that hold steady as the business grows.',
            howEyebrow: 'How I Work',
            howTitle: 'From design to improvement — I own every stage',
            capabilities: [
                {title: 'Holistic View', desc: 'I structure the whole flow to reduce complexity.'},
                {title: 'Reliable Backend', desc: 'I separate domain responsibilities and isolate the data layer.'},
                {title: 'Automated Delivery', desc: 'I remove manual work from build through release.'},
                {title: 'Observability', desc: 'I keep system and business metrics always in view.'},
            ],
            devopsFlow: {
                dev: ['Design', 'Code', 'Build', 'Test'],
                ops: ['Deploy', 'Operate', 'Monitor', 'Improve'],
            },
            devopsCaption: 'The DevOps loop running from design through improvement',
            devopsLoop: 'A continuous improvement loop that feeds observed metrics back into design',
        },
        experience: {
            eyebrow: 'Career',
            title: ['Five years proven by structure,', 'not by numbers'],
            subtitle: 'The core roles I held at each company and project, across full-time and freelance work, in chronological order.',
            corporate: 'Corporate Experience',
            freelance: 'Freelance & Contract Projects',
            countSuffix: '',
            features: 'Features',
            projects: 'Projects',
            start: 'Start',
            end: 'End',
            joined: 'Joined',
            left: 'Left',
            ongoing: 'Current',
            maintaining: 'Maintaining',
            period: 'Period',
            jumpBadge: 'See in Projects ↓',
            logoAlt: 'logo',
        },
        project: {
            eyebrow: 'Projects',
            title: ['Projects I designed', 'and owned to the end'],
            subtitle: 'Solo server development, statistics pipelines, smart library modernization — only the work where I was deeply involved in the product flow.',
            keyAchievements: 'Key Achievements',
            techStack: 'Tech Stack',
            close: 'Close project details',
            prev: 'Previous project',
            next: 'Next project',
            tableOfContents: 'Project detail contents',
        },
        skill: {
            eyebrow: 'Tech Stack',
            title: ['Not a list —', 'skills organized by context'],
            subtitle: 'Grouped by the context in which I actually used them for service development, deployment and operations, rather than as a flat list.',
            groups: [
                {title: 'Backend', summary: 'I build API, batch, authentication and data access layers on Kotlin/Java with Spring.'},
                {title: 'Product / Full-stack', summary: 'I connect the service flow across back office, hybrid apps, admin screens and external APIs.'},
                {title: 'Data / Batch', summary: 'I collect and process operational logs and service data, and design scheduled aggregation flows.'},
                {title: 'Infra / Operation', summary: 'I set up deployment pipelines and observability environments to track service health.'},
                {title: 'Collaboration', summary: 'I coordinate server development with PM, planning, design, app and admin teams in Scrum.'},
            ],
        },
            badge: {
                twinkle: 'Twinkle Night Sky',
                modalTitle: 'Twinkle Night Sky',
                modalDesc: [
                    'Twinkle Night Sky is themed around a mysterious night sky where stars twinkle wherever your gaze lingers.',
                    'The 3D outer space implemented using Three.js and the character walking toward your pointer bring life to the static portfolio.',
                    'The deep navy and night black colors enhance focus on content, while the sparkling star effects provide a futuristic and sensory user experience.'
                ],
            },
            space: {
                title: 'Twinkle Night Sky',
                desc: [
                    'This is a 3D night sky space implemented using the Three.js engine.',
                    'Move your mouse or touch the screen to guide the character across the space.',
                    'Explore the universe by directly steering the character.'
                ],
                openModal: 'View space intro',
                loading: 'Loading 3D Space...',
            },
        },
};

export default translations;
