import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PdfModalProps} from "@Components/modal/pdfviewer";

export interface ModalProps {
    type: string;
    props: PdfModalProps | {};
}
const modalSlice = createSlice({
    name: "modal",
    initialState: {
        isOpen: false,
        type: '',
        props: {},
    },
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