import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const scrollOffsetSlice = createSlice({
    name: 'offset',
    initialState: {
        value: typeof document !== 'undefined' ? document.body.offsetTop : 0
    },
    reducers: {
        changeOffset(state, action: PayloadAction<number>){
            state.value = action.payload
        }
    }
});

export const {changeOffset} = scrollOffsetSlice.actions;
export default scrollOffsetSlice;
