import {configureStore} from '@reduxjs/toolkit'
import scrollOffsetSlice from "@Store/slice/offset";
import drawerSlice from "@Store/slice/drawer";
import loadingSlice from "@Store/slice/loading";
import modalSlice from "@Store/slice/modal";
import languageSlice from "@Store/slice/language";

export const store = configureStore({
    reducer: {
        offset: scrollOffsetSlice.reducer,
        drawer: drawerSlice.reducer,
        loading: loadingSlice.reducer,
        modal: modalSlice.reducer,
        language: languageSlice.reducer,
    }
})
export type RootState = ReturnType<typeof store.getState>