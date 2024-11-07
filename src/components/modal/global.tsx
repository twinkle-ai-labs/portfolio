import React, {useEffect} from 'react';
import PdfViewerModal from "@Components/modal/pdfviewer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@Store/index";
import {closeModal} from "@Store/slice/modal";

export const MODAL_TYPES = {
    PDFModal: "pdf",
};
const MODAL_COMPONENTS = {
    [MODAL_TYPES.PDFModal]: PdfViewerModal,
};
const GlobalModal = () => {
    const dispatch = useDispatch();
    const { isOpen, type, props } = useSelector((state:RootState) => state.modal);
    useEffect(() => {
        console.log(isOpen)
    }, [isOpen]);

    const render = () => {
        if (!isOpen) {
            return null;
        }

        const ModalComponent = MODAL_COMPONENTS[type];
        return <ModalComponent
                    isOpen={true}
                    onClose={() => {
                        dispatch(closeModal());
                    }}
                    {...props} />;
    }
    return (
        <>
            {render()}
        </>
    );
};

export default GlobalModal;