import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ModalProps {
    type: string;
    props: Record<string, unknown>;
}

export interface ModalState {
    isOpen: boolean;
    type: string;
    props: Record<string, unknown>;
}

const initialState: ModalState = {
    isOpen: false,
    type: '',
    props: {},
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<ModalProps>) => {
            const {type, props} = action.payload;
            state.type = type;
            state.props = props;
            state.isOpen = true;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.type = '';
            state.props = {};
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice;
