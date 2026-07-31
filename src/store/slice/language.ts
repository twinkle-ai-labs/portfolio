import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const LanguageType = {
    KO: 'ko', EN: 'en'
}

const getInitialLanguage = () => {
    if (typeof window === 'undefined') return LanguageType.KO;
    const saved = window.localStorage.getItem('lang');
    if (saved === LanguageType.KO || saved === LanguageType.EN) return saved;
    return LanguageType.KO;
}

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        value: getInitialLanguage()
    },
    reducers: {
        changeLanguage: (state, action: PayloadAction<string>) => {
            const val = action.payload.toLowerCase();
            if (val === LanguageType.KO || val === LanguageType.EN) {
                state.value = val;
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('lang', val);
                }
            }
        }
    }
})

export const {changeLanguage} = languageSlice.actions;
export default languageSlice;
