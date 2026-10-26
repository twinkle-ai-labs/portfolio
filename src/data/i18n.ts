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
        ctaProject: string;
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
        /** 메인 카드 겉면의 세 줄 라벨 */
        storyProblem: string;
        storyAction: string;
        storyResult: string;
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
        loading: string;
        loadingTips: string[];
        guide: {
            name: string;
            next: string;
            starLabel: string;
            intro: string[];
            complete: string[];
        };
    };
    error: {
        badge: string;
        title: string;
        titleAccent: string;
        desc: string;
        home: string;
        space: string;
    };
    /** /files — 키로 여는 문서함 */
    files: {
        badge: string;
        title: string;
        titleAccent: string;
        desc: string;
        keyLabel: string;
        keyPlaceholder: string;
        show: string;
        hide: string;
        note: string;
        size: string;
        updated: string;
        download: string;
        working: string;
        done: string;
        emptyKey: string;
        wrongKey: string;
        failed: string;
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
            kicker: 'Backend Engineer',
            desc: '내비게이션 회사에서 위치 기반 서비스의 백엔드를 혼자 세워 회원 7.1만 명까지 운영했습니다. 장애 두 번을 원인부터 닫았고, 검색 p99 를 7.5초에서 93ms 로 내린 적이 있습니다. 여기 적힌 숫자는 전부 코드와 보고서에 있는 것입니다.',
            ctaProject: '프로젝트 보기 🚀',
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
            subtitle: '내비게이션 회사에서 위치 기반 서비스의 백엔드를 혼자 세운 5년차 백엔드 엔지니어입니다.',
            factCareer: '경력',
            factEducation: '학력',
            factCurrent: '현재',
            factScope: '도메인',
            careerValue: '만 5년',
            careerNote: '서버 · 인프라 · 운영',
            educationValue: '컴퓨터공학 학사',
            educationNote: '4년제 학사 학위',
            currentValue: '아이나비시스템즈',
            currentNote: 'Backend Engineer · 주임 연구원',
            scopeValue: '내비게이션 · 위치 기반',
            scopeNote: '내비 서버 운영 · 스탬프 위치 인증 · 내비 로그 통계',
            certLabel: 'Certifications',
            certificates: ['리눅스마스터 2급', 'SQL 개발자', '정보처리기사'],
            tags: ['Backend Engineer', 'DevOps', '아키텍처 설계', 'Spring', 'Kotlin', 'AWS'],
            howEyebrow: 'How Do I Work',
            howTitle: '설계부터 개선까지, 전 구간을 직접 맡습니다',
            capabilities: [
                {title: '전체를 보는 시야', desc: '요구사항을 데이터 모델부터 인프라까지 하나의 흐름으로 구조화합니다. 전체가 한눈에 잡히는 설계가 복잡도를 낮춥니다.'},
                {title: '견고한 백엔드', desc: '도메인 경계를 따라 책임을 나누고 데이터 계층을 분리합니다. 비즈니스가 커져도 흔들리지 않는 구조를 만듭니다.'},
                {title: '배포 자동화', desc: '빌드·테스트·릴리즈를 파이프라인으로 묶어 손댈 일을 없앱니다. 배포가 두렵지 않아야 자주, 안전하게 내보낼 수 있습니다.'},
                {title: '운영 관측', desc: '로그·지표·알림으로 시스템과 비즈니스 상태를 항상 지켜봅니다. 관측에서 얻은 숫자는 다시 설계 개선으로 이어집니다.'},
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
            subtitle: '셋 다 «문제 → 한 일 → 결과»로 적었습니다. 카드를 누르면 설계 · 장애 · 코드 근거가 열립니다.',
            keyAchievements: 'Key Achievements',
            storyProblem: '문제',
            storyAction: '한 일',
            storyResult: '결과',
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
                twinkle: 'Twinkle Space',
                modalTitle: 'Twinkle Space',
                modalDesc: [
                    'Twinkle Space는 Three.js로 만든 미니 SF 도시를 캐릭터가 직접 걸어 다니며 탐험하는 공간입니다.',
                    'WASD나 화살표 키, 화면의 조이스틱으로 이동하고, Shift로 달리고, Space로 점프할 수 있어요.',
                    '반짝이는 표식이 보이는 건물은 안으로 들어가 내부까지 둘러볼 수 있습니다.'
                ],
            },
            space: {
                title: 'Twinkle Space',
                desc: [
                    'Three.js 엔진으로 만든 미니 SF 도시를 자유롭게 걸어 다니는 공간입니다.',
                    'WASD/화살표 키나 조이스틱으로 이동하고, Shift로 달리고, Space로 점프해보세요.',
                    '반짝이는 표식이 있는 건물은 안으로 들어가 내부까지 탐험할 수 있습니다.'
                ],
                loading: '로딩중',
                loadingTips: [
                    'Tip. W A S D 또는 화살표 키로 이동할 수 있어요.',
                    'Tip. Shift를 누르거나 조이스틱을 끝까지 밀면 달릴 수 있어요.',
                    'Tip. Space 또는 점프 버튼으로 뛰어오를 수 있어요.',
                    'Tip. 벽에 붙어 앞으로 계속 밀면 벽을 타고 올라갈 수 있어요.',
                    'Tip. 벽에 매달린 채 Space를 누르면 벽을 차고 뛰어내려요.',
                    'Tip. 하늘로 솟은 파란 빛기둥 아래에 별 조각이 있어요.',
                    'Tip. 벽 너머로 보이는 빛기둥은 건물 안에 있다는 뜻 — 입구로 들어가 보세요.'
                ],
                guide: {
                    name: '별이',
                    next: '클릭 / Enter',
                    starLabel: '별 조각',
                    intro: [
                        '안녕? 👋 Twinkle Space에 온 걸 환영해!',
                        '나는 이 도시의 길잡이 별, 별이야. 도시 여기저기에 별 조각 {count}개가 흩어져 있어.',
                        '하늘로 솟은 파란 빛기둥을 따라가 봐. 그 아래에 별 조각이 있어!',
                        '몇 개는 건물 안에 숨어 있어. 벽을 뚫고 보이는 빛기둥이 그거야 — 입구를 찾아서 들어가면 돼. 그럼 잘 부탁해! ✨'
                    ],
                    complete: [
                        '우와… 별 조각을 전부 모았어! 🎉',
                        '고마워, 덕분에 도시가 한층 더 반짝이게 됐어.',
                        '이제 마음껏 도시를 둘러봐. 건물 안에도 볼거리가 숨어 있을지 몰라! ✨'
                    ]
                }
            },
            error: {
                badge: 'Error 404',
                title: '길을 잃은',
                titleAccent: '페이지',
                desc: '찾으시는 주소가 사라졌거나, 처음부터 없던 페이지예요. 홈으로 돌아가거나 우주를 한 바퀴 걸어보세요.',
                home: '홈으로 돌아가기',
                space: 'Twinkle Space 둘러보기',
            },
            files: {
                badge: 'Files',
                title: '키로 여는',
                titleAccent: '문서함',
                desc: '이력서와 포트폴리오는 암호화된 채 실려 있습니다. 전달받은 키를 넣으면 이 기기 안에서 풀려 내려받아집니다 — 키는 어디로도 보내지 않습니다.',
                keyLabel: '키',
                keyPlaceholder: '전달받은 키를 입력하세요',
                show: '키 보이기',
                hide: '키 숨기기',
                note: '복호화는 브라우저 안에서만 일어납니다. 키가 틀리면 파일은 열리지 않습니다.',
                size: '크기',
                updated: '갱신',
                download: '내려받기',
                working: '여는 중…',
                done: '내려받았습니다',
                emptyKey: '먼저 키를 입력하세요.',
                wrongKey: '키가 맞지 않습니다.',
                failed: '파일을 가져오지 못했습니다. 잠시 뒤 다시 시도해 주세요.',
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
            kicker: 'Backend Engineer',
            desc: 'At a navigation company I built the backend of a location-based service alone and ran it to 71K members. I closed two outages from the root cause, and once took a search p99 from 7.5s to 93ms. Every number here comes from code or an incident report.',
            ctaProject: 'View Projects 🚀',
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
            subtitle: 'A backend engineer of five years who built a location-based service\'s backend alone at a navigation company.',
            factCareer: 'Experience',
            factEducation: 'Education',
            factCurrent: 'Current',
            factScope: 'Domain',
            careerValue: '5+ years',
            careerNote: 'Server · Infra · Ops',
            educationValue: 'B.S. in Computer Science',
            educationNote: "Four-year bachelor's degree",
            currentValue: 'INAVI Systems',
            currentNote: 'Backend Engineer · Associate Researcher',
            scopeValue: 'Navigation · location-based',
            scopeNote: 'Navi server ops · stamp location verification · navi log statistics',
            certLabel: 'Certifications',
            certificates: ['Linux Master Level 2', 'SQL Developer (SQLD)', 'Engineer Information Processing'],
            tags: ['Backend Engineer', 'DevOps', 'Architecture', 'Spring', 'Kotlin', 'AWS'],
            howEyebrow: 'How Do I Work',
            howTitle: 'From design to improvement — I own every stage',
            capabilities: [
                {title: 'Holistic View', desc: 'I structure requirements into one flow, from data model to infrastructure. A design you can see at a glance keeps complexity down.'},
                {title: 'Reliable Backend', desc: 'I split responsibilities along domain boundaries and isolate the data layer — a structure that holds steady as the business grows.'},
                {title: 'Automated Delivery', desc: 'Build, test, and release run as one pipeline with nothing left to touch by hand. Deploys should be frequent and safe, never scary.'},
                {title: 'Observability', desc: 'Logs, metrics, and alerts keep system and business health in view. What we observe feeds straight back into better design.'},
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
            subtitle: 'Each one reads problem → what I did → result. Open a card for the design, the outages and the code behind it.',
            keyAchievements: 'Key Achievements',
            storyProblem: 'Problem',
            storyAction: 'What I did',
            storyResult: 'Result',
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
                twinkle: 'Twinkle Space',
                modalTitle: 'Twinkle Space',
                modalDesc: [
                    'Twinkle Space is a miniature sci-fi city built with Three.js that you walk around and explore in person.',
                    'Move with WASD or the arrow keys (or the on-screen joystick), hold Shift to run, and press Space to jump.',
                    'Buildings marked with a glowing beacon can be entered — walk inside to look around.'
                ],
            },
            space: {
                title: 'Twinkle Space',
                desc: [
                    'A miniature sci-fi city built with the Three.js engine, free to walk around.',
                    'Move with WASD/arrow keys or the joystick, hold Shift to run, and press Space to jump.',
                    'Buildings marked with a glowing beacon can be entered and explored inside.'
                ],
                loading: 'Loading...',
                loadingTips: [
                    'Tip. Move with W A S D or the arrow keys.',
                    'Tip. Hold Shift or push the joystick all the way to run.',
                    'Tip. Press Space or the jump button to leap.',
                    'Tip. Push into a wall and keep holding forward to climb it.',
                    'Tip. While hanging on a wall, press Space to kick off it.',
                    'Tip. A star shard waits under every blue beam rising into the sky.',
                    'Tip. A beam visible through a wall means the shard is indoors — find the entrance and step in.'
                ],
                guide: {
                    name: 'Byeol',
                    next: 'Click / Enter',
                    starLabel: 'Star shards',
                    intro: [
                        'Hi there! 👋 Welcome to Twinkle Space!',
                        "I'm Byeol, the guide star of this city. {count} star shards are scattered around town.",
                        'Follow the blue beams of light rising into the sky — a shard waits under each one!',
                        'A few are hidden indoors. Those are the beams you can see through walls — find the entrance and walk right in. Good luck! ✨'
                    ],
                    complete: [
                        'Wow… you found every single star shard! 🎉',
                        'Thank you — the city shines a little brighter because of you.',
                        'Feel free to keep exploring. Who knows what else is hiding inside the buildings! ✨'
                    ]
                }
            },
            error: {
                badge: 'Error 404',
                title: 'This page went',
                titleAccent: 'off the map',
                desc: "The address you're looking for has moved, or never existed. Head back home — or take a walk through space instead.",
                home: 'Back to home',
                space: 'Explore Twinkle Space',
            },
            files: {
                badge: 'Files',
                title: 'Documents behind',
                titleAccent: 'a key',
                desc: 'The résumé and portfolio are stored encrypted. Enter the key you were given and they are decrypted on this device and downloaded — the key never leaves your browser.',
                keyLabel: 'Key',
                keyPlaceholder: 'Enter the key you were given',
                show: 'Show key',
                hide: 'Hide key',
                note: 'Decryption happens only in your browser. With the wrong key, nothing opens.',
                size: 'Size',
                updated: 'Updated',
                download: 'Download',
                working: 'Opening…',
                done: 'Downloaded',
                emptyKey: 'Enter the key first.',
                wrongKey: 'That key does not match.',
                failed: 'Could not fetch the file. Please try again shortly.',
            },
        },
};

export default translations;
