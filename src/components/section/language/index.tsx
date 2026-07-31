import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import {changeLanguage, Language, LanguageType} from "@Store/slice/language";
import {FaCheck, FaChevronDown} from "react-icons/fa6";
import translations from "@Data/i18n";
import {useLocale} from "@Utils/i18n";

interface ILanguageOption {
    value: Language;
    /** 국기 이모지 — 국기 폰트가 없는 환경에서는 국가 코드 문자로 대체 표시됩니다. */
    flag: string;
    /** 화면에 노출하는 이름은 항상 그 언어 자신의 표기(자칭)로 둡니다. */
    label: string;
}

const options: ILanguageOption[] = [
    {value: LanguageType.KO, flag: '🇰🇷', label: '한국어'},
    {value: LanguageType.EN, flag: '🇺🇸', label: 'English'},
];

/**
 * 국기가 포함된 언어 선택 박스.
 * 선택값은 redux language 슬라이스를 통해 localStorage에 저장됩니다.
 * 각 언어 이름은 "현재" 언어로 표기됩니다 (한글: 한국어/영어, 영문: Korean/English).
 */
const LanguageSelect = () => {
    const dispatch = useDispatch();
    const {language} = useLocale();
    const t = translations[language].language;
    const labelOf = (value: Language) => (value === LanguageType.KO ? t.ko : t.en);

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === language));
    const selected = options[selectedIndex];

    // 열릴 때 현재 선택 항목에 포커스를 맞춰 키보드 탐색의 시작점을 잡아 줍니다.
    useEffect(() => {
        if (!open) return;
        setActiveIndex(selectedIndex);
        listRef.current?.focus();
    }, [open, selectedIndex]);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent | TouchEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('touchstart', onPointerDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('touchstart', onPointerDown);
        };
    }, [open]);

    const select = (option: ILanguageOption) => {
        dispatch(changeLanguage(option.value));
        setOpen(false);
    };

    const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex((index) => (index + 1) % options.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex((index) => (index - 1 + options.length) % options.length);
                break;
            case 'Home':
                event.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setActiveIndex(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                select(options[activeIndex]);
                break;
            case 'Escape':
                event.preventDefault();
                setOpen(false);
                break;
            case 'Tab':
                setOpen(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className={`lang-select ${open ? 'is-open' : ''}`} ref={rootRef}>
            <button
                className="lang-select-trigger"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`${t.current}: ${labelOf(selected.value)}`}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        event.preventDefault();
                        setOpen(true);
                    }
                }}
            >
                <span className="lang-select-flag" aria-hidden="true">{selected.flag}</span>
                <span className="lang-select-name">{selected.label}</span>
                <FaChevronDown className="lang-select-arrow" aria-hidden="true"/>
            </button>

            {open ? (
                <ul
                    className="lang-select-list"
                    ref={listRef}
                    role="listbox"
                    tabIndex={-1}
                    aria-label={t.select}
                    aria-activedescendant={`lang-option-${options[activeIndex].value}`}
                    onKeyDown={onListKeyDown}
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            id={`lang-option-${option.value}`}
                            className={`lang-select-option ${index === activeIndex ? 'is-active' : ''}`}
                            role="option"
                            aria-selected={option.value === language}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => select(option)}
                        >
                            <span className="lang-select-flag" aria-hidden="true">{option.flag}</span>
                            <span className="lang-select-label">{option.label}</span>
                            {option.value === language ? <FaCheck className="lang-select-check" aria-hidden="true"/> : null}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default LanguageSelect;
