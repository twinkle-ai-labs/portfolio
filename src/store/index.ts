import {configureStore} from '@reduxjs/toolkit'
import scrollOffsetSlice from "@Store/slice/offset";
import drawerSlice from "@Store/slice/drawer";
import themeSlice from "@Store/slice/theme";
import loadingSlice from "@Store/slice/loading";
import modalSlice from "@Store/slice/modal";

export const store = configureStore({
    reducer: {
        offset: scrollOffsetSlice.reducer,
        drawer: drawerSlice.reducer,
        theme: themeSlice.reducer,
        loading: loadingSlice.reducer,
        modal: modalSlice.reducer,
    }
})
export type RootState = ReturnType<typeof store.getState>