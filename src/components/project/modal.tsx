import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {FaChevronLeft, FaChevronRight, FaXmark} from 'react-icons/fa6';
import {IProject} from '@Data/project';
import ProjectBlocks, {ProjectMediaView} from '@Components/project/blocks';
import translations from '@Data/i18n';
import {useLocale} from '@Utils/i18n';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface IProjectModalProps {
    project: IProject;
    onClose: () => void;
    onNavigate?: (direction: -1 | 1) => void;
    /** 전체 목록에서의 위치 — 이전/다음 버튼 활성 여부를 정합니다. */
    index?: number;
    total?: number;
}

const ProjectModal = ({project, onClose, onNavigate, index = 0, total = 1}: IProjectModalProps) => {
    const {language, t: tr} = useLocale();
    const t = translations[language].project;

    const scrollRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const restoreFocusRef = useRef<HTMLElement | null>(null);

    const chapterElement = (chapterId: string) =>
        scrollRef.current?.querySelector<HTMLElement>(`#pm-chapter-${CSS.escape(chapterId)}`) || null;

    const [activeChapter, setActiveChapter] = useState(project.chapters[0]?.id);
    const [progress, setProgress] = useState(0);
    /** 스크롤이 시작되면 헤더를 접어 본문 영역을 넓힙니다. */
    const [condensed, setCondensed] = useState(false);

    const hasPrev = index > 0;
    const hasNext = index < total - 1;

    /* 프로젝트가 바뀌면 처음 챕터로 되돌립니다. */
    useLayoutEffect(() => {
        setActiveChapter(project.chapters[0]?.id);
        setProgress(0);
        setCondensed(false);
        scrollRef.current?.scrollTo({top: 0});
    }, [project.id]);

    /* 배경 스크롤 잠금 — 스크롤바 폭만큼 보정해 레이아웃이 튀지 않게 합니다. */
    useEffect(() => {
        const {body} = document;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;

        body.style.overflow = 'hidden';
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;
        };
    }, []);

    /* 열릴 때 포커스를 모달로 옮기고, 닫힐 때 원래 위치로 되돌립니다. */
    useEffect(() => {
        restoreFocusRef.current = document.activeElement as HTMLElement;
        dialogRef.current?.focus();
        return () => restoreFocusRef.current?.focus?.();
    }, []);

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
            return;
        }

        if (event.key !== 'Tab') return;

        // 모달 밖으로 포커스가 빠져나가지 않도록 순환시킵니다.
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) || [])
            .filter((element) => element.offsetParent !== null);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && (active === first || active === dialogRef.current)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }, [onClose]);

    /* 스크롤 진행률 + 현재 챕터 추적 */
    const onScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollable = container.scrollHeight - container.clientHeight;
        setProgress(scrollable > 0 ? Math.min(1, container.scrollTop / scrollable) : 1);
        setCondensed(container.scrollTop > 24);

        // 컨테이너 상단에서 가장 가까우면서 이미 지나친 챕터를 현재 챕터로 봅니다.
        const containerTop = container.getBoundingClientRect().top;
        let current = project.chapters[0]?.id;
        project.chapters.forEach((chapter) => {
            const element = chapterElement(chapter.id);
            if (!element) return;
            if (element.getBoundingClientRect().top - containerTop <= 140) current = chapter.id;
        });
        setActiveChapter(current);
    }, [project.chapters]);

    const goToChapter = (chapterId: string) => {
        const container = scrollRef.current;
        const target = chapterElement(chapterId);
        if (!container || !target) return;

        const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
        container.scrollTo({top: container.scrollTop + offset - 16, behavior: 'smooth'});
    };

    return (
        <div className="pm-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}>
            <div
                className="pm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pm-title"
                tabIndex={-1}
                ref={dialogRef}
                onKeyDown={onKeyDown}
            >
                <header className={`pm-header ${condensed ? 'is-condensed' : ''}`}>
                    <div className="pm-header-main">
                        <div className="pm-header-copy">
                            <div className="pm-meta">
                                <span className="pm-meta-icon" aria-hidden="true">{project.icon}</span>
                                <span>{tr(project.period)}</span>
                                <span className="pm-meta-dot" aria-hidden="true"/>
                                <span>{tr(project.role)}</span>
                            </div>
                            <h2 id="pm-title" className="pm-title">{tr(project.title)}</h2>
                            <p className="pm-summary">{tr(project.summary)}</p>
                            <ul className="pm-stacks">
                                {project.stacks.map((stack) => <li key={stack}>{stack}</li>)}
                            </ul>
                        </div>

                        {project.thumbnail ? (
                            <div className="pm-header-thumb">
                                <ProjectMediaView media={project.thumbnail}/>
                            </div>
                        ) : null}
                    </div>

                    <ul className="pm-header-metrics">
                        {project.metrics.map((metric) => (
                            <li key={tr(metric.label)}>
                                <strong>{tr(metric.value)}</strong>
                                <span>{tr(metric.label)}</span>
                                {metric.delta ? <em>{tr(metric.delta)}</em> : null}
                            </li>
                        ))}
                    </ul>

                    <nav className="pm-chapter-nav" aria-label={t.tableOfContents}>
                        {project.chapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                type="button"
                                className={`pm-chapter-tab ${activeChapter === chapter.id ? 'is-active' : ''}`}
                                aria-current={activeChapter === chapter.id}
                                onClick={() => goToChapter(chapter.id)}
                            >
                                {chapter.icon ? <span aria-hidden="true">{chapter.icon}</span> : null}
                                {tr(chapter.label)}
                            </button>
                        ))}
                    </nav>

                    <div className="pm-progress" aria-hidden="true">
                        <span style={{transform: `scaleX(${progress})`}}/>
                    </div>

                    <div className="pm-header-actions">
                        {onNavigate ? (
                            <>
                                <button
                                    className="pm-nav-button"
                                    type="button"
                                    aria-label={t.prev}
                                    disabled={!hasPrev}
                                    onClick={() => onNavigate(-1)}
                                >
                                    <FaChevronLeft/>
                                </button>
                                <button
                                    className="pm-nav-button"
                                    type="button"
                                    aria-label={t.next}
                                    disabled={!hasNext}
                                    onClick={() => onNavigate(1)}
                                >
                                    <FaChevronRight/>
                                </button>
                            </>
                        ) : null}
                        <button className="pm-close" type="button" aria-label={t.close} onClick={onClose}>
                            <FaXmark/>
                        </button>
                    </div>
                </header>

                <div className="pm-scroll" ref={scrollRef} onScroll={onScroll}>
                    <div className="pm-body">
                        {project.chapters.map((chapter, chapterIndex) => (
                            <section
                                key={chapter.id}
                                id={`pm-chapter-${chapter.id}`}
                                className={`pm-chapter ${chapter.aside?.length ? 'has-aside' : ''}`}
                                aria-labelledby={`pm-chapter-title-${chapter.id}`}
                            >
                                <div className="pm-chapter-head">
                                    <span className="pm-chapter-index" aria-hidden="true">
                                        {String(chapterIndex + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <h3 id={`pm-chapter-title-${chapter.id}`} className="pm-chapter-title">
                                            {tr(chapter.title)}
                                        </h3>
                                        {chapter.lead ? <p className="pm-chapter-lead">{tr(chapter.lead)}</p> : null}
                                    </div>
                                </div>

                                <div className="pm-chapter-body">
                                    <div className="pm-chapter-main">
                                        <ProjectBlocks blocks={chapter.blocks}/>
                                    </div>
                                    {chapter.aside?.length ? (
                                        <div className="pm-chapter-aside">
                                            <ProjectBlocks blocks={chapter.aside}/>
                                        </div>
                                    ) : null}
                                </div>
                            </section>
                        ))}

                        <section className="pm-chapter pm-impact">
                            <div className="pm-chapter-head">
                                <span className="pm-chapter-index" aria-hidden="true">★</span>
                                <div>
                                    <h3 className="pm-chapter-title">{t.keyAchievements}</h3>
                                </div>
                            </div>
                            <ul className="pm-impact-list">
                                {project.impact.map((item) => <li key={tr(item)}>{tr(item)}</li>)}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
