import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const LanguageType = {
    KO: 'ko', EN: 'en'
} as const;

export type Language = typeof LanguageType[keyof typeof LanguageType];

const STORAGE_KEY = 'lang';

const isLanguage = (value: unknown): value is Language =>
    value === LanguageType.KO || value === LanguageType.EN;

/** Safari 프라이빗 모드 등 localStorage 접근이 막힌 환경에서도 앱이 죽지 않도록 감쌉니다. */
const readStoredLanguage = (): Language | null => {
    if (typeof window === 'undefined') return null;
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return isLanguage(saved) ? saved : null;
    } catch {
        return null;
    }
};

const writeStoredLanguage = (value: Language) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
        /* 저장에 실패해도 현재 세션의 언어 전환은 그대로 동작합니다. */
    }
};

const applyDocumentLanguage = (value: Language) => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = value === LanguageType.EN ? 'en' : 'ko';
};

const getInitialLanguage = (): Language => {
    const stored = readStoredLanguage();
    if (stored) return stored;

    // 저장된 값이 없으면 브라우저 언어를 따르되, 한국어가 아니면 영어로 시작합니다.
    if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language.toLowerCase().startsWith('ko') ? LanguageType.KO : LanguageType.EN;
    }
    return LanguageType.KO;
};

const initialLanguage = getInitialLanguage();
applyDocumentLanguage(initialLanguage);

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        value: initialLanguage as Language
    },
    reducers: {
        changeLanguage: (state, action: PayloadAction<string>) => {
            const val = action.payload.toLowerCase();
            if (!isLanguage(val) || state.value === val) return;

            state.value = val;
            writeStoredLanguage(val);
            applyDocumentLanguage(val);
        }
    }
})

export const {changeLanguage} = languageSlice.actions;
export default languageSlice;
