import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const ThemeType = {
    LIGHT: 'light', DARK: 'dark'
}
const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: typeof document !== 'undefined' ? (document.body.dataset.theme || 'light') : 'light'
    },
    reducers: {
        changeTheme: (state, action: PayloadAction<string>) => {
            const val = action.payload.toLowerCase();
            if (val === ThemeType.LIGHT || val === ThemeType.DARK) {
                state.value = val;
            }
        }
    }
})

export const {changeTheme} = themeSlice.actions;
export default themeSlice;