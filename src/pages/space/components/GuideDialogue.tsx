import React, {useEffect, useMemo, useState} from 'react';
import {useLocale} from '@Utils/i18n';
import translations from '@Data/i18n';

export type GuideDialogueKey = 'intro' | 'complete';

interface IGuideDialogueProps {
    dialogueKey: GuideDialogueKey | null;
    starTotal: number;
    onClose: () => void;
}

const TYPE_INTERVAL_MS = 28;

// 가이드 별 "별이"의 RPG풍 대화창. 화면 하단 중앙에 뜨고, 한 글자씩 타이핑되며,
// 클릭이나 Enter로 다음 대사로 넘어간다. Space는 점프 키라서 일부러 안 쓴다.
const GuideDialogue = ({dialogueKey, starTotal, onClose}: IGuideDialogueProps) => {
    const {language} = useLocale();
    const guide = translations[language].space.guide;

    const lines = useMemo(() => {
        if (!dialogueKey) return [];
        return guide[dialogueKey].map((line) => line.replace('{count}', String(starTotal)));
    }, [dialogueKey, guide, starTotal]);

    const [lineIndex, setLineIndex] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // New dialogue (or language switch) restarts from the first line
    useEffect(() => {
        setLineIndex(0);
        setCharCount(0);
    }, [dialogueKey, language]);

    const currentLine = lines[lineIndex] ?? '';
    const typing = charCount < currentLine.length;

    // Typewriter effect: reveal one character per tick
    useEffect(() => {
        if (!dialogueKey || !typing) return;
        const interval = setInterval(() => {
            setCharCount((c) => Math.min(c + 1, currentLine.length));
        }, TYPE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [dialogueKey, typing, currentLine.length]);

    // Advance: finish typing first, then step to the next line, then close
    const advance = () => {
        if (typing) {
            setCharCount(currentLine.length);
        } else if (lineIndex + 1 < lines.length) {
            setLineIndex((i) => i + 1);
            setCharCount(0);
        } else {
            onClose();
        }
    };

    useEffect(() => {
        if (!dialogueKey) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') advance();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (!dialogueKey || lines.length === 0) return null;

    return (
        <div className="space-dialogue" onClick={advance} role="button">
            {/* 말하는 주체를 한눈에 — 별이의 초상. 대사 타이핑 중에는 링이 빠르게 돈다 */}
            <div className={`space-dialogue-avatar${typing ? ' talking' : ''}`} aria-hidden="true">
                <span className="space-dialogue-avatar-ring"/>
                <span className="space-dialogue-avatar-core">✦</span>
            </div>

            <div className="space-dialogue-body">
                <div className="space-dialogue-name">{guide.name}</div>

                <p className="space-dialogue-text">
                    {currentLine.slice(0, charCount)}
                    {typing && <span className="space-dialogue-caret"/>}
                </p>

                <div className="space-dialogue-footer">
                    {/* 남은 대사가 얼마나 되는지 — 점 하나가 대사 한 줄 */}
                    <div className="space-dialogue-dots">
                        {lines.map((_, i) => (
                            <span
                                key={i}
                                className={`space-dialogue-dot${i === lineIndex ? ' active' : ''}${i < lineIndex ? ' done' : ''}`}
                            />
                        ))}
                    </div>
                    {/* 타이핑 중에도 자리를 지킨다 — 나타났다 사라지면 대화창 높이가 들썩인다 */}
                    <span className={`space-dialogue-next${typing ? ' waiting' : ''}`}>
                        {guide.next}
                        <span className="space-dialogue-chevron">▾</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GuideDialogue;
