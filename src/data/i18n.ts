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
    },
};

export default translations;
