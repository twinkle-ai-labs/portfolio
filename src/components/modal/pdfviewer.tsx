import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import ReactModal from 'react-modal';
import { IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.mjs';

export interface PdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    file?: File | undefined;
}

const PdfViewerModal = (props: PdfModalProps) => {
    const [pageCount, setPageCount] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const thumbnailRefs = useRef<(HTMLLIElement | null)[]>([]); // Store refs for each thumbnail

    const createPages = () => (
        <>
            <IconButton
                disabled={pageNumber === 1}
                onClick={() => onPageChange(pageNumber - 1)}
            >
                <FaChevronLeft />
            </IconButton>
            <div>
                <b className={'color-blue'}>{pageNumber}</b> / {pageCount}
            </div>
            <IconButton
                disabled={pageNumber === pageCount}
                onClick={() => onPageChange(pageNumber + 1)}
            >
                <FaChevronRight />
            </IconButton>
        </>
    );

    const onPDFLoaded = ({ numPages }: { numPages: number }) => {
        setPageCount(numPages);
    };


    const onPageChange = (pageNumber: number) => {
        setPageNumber(pageNumber);
        thumbnailRefs.current[pageNumber - 1]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'start' });
    };

    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={props.onClose}
            shouldCloseOnOverlayClick={true}
            className={'modal'}
            overlayClassName={'modal-wrapper'}
            ariaHideApp={false}
        >
            <div className={'modal-header'}>
                <h4 className={'modal-title'}>{props.title}</h4>
                <div className={'modal-pages'}>{createPages()}</div>
                <div className={'modal-actions'}>
                    <IconButton onClick={props.onClose}>
                        <FaTimes />
                    </IconButton>
                </div>
            </div>
            <div className={'modal-body'}>
                <Document file={props?.file} onLoadSuccess={onPDFLoaded} className={'pdf-container'}>
                    <div className={"pdf-thumbnail"}>
                        <h6>미리 보기</h6>
                        <ul className={'pdf-thumbnail-list overflow-scrollbar'}>
                            {Array.from(new Array(pageCount), (el, index) => (
                                <li
                                    key={`thumbnail_${index + 1}`}
                                    onClick={() => onPageChange(index + 1)}
                                    className={'pdf-thumbnail-element' + (index + 1 === pageNumber ? ' active' : '')}
                                    ref={(el) => thumbnailRefs.current[index] = el} // Assign each thumbnail's ref
                                >
                                    <Page pageNumber={index + 1} width={300} renderTextLayer={false}
                                          renderAnnotationLayer={false}/>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={'pdf-content'}>
                        <Page pageNumber={pageNumber} width={1120}/>
                    </div>
                </Document>
            </div>
        </ReactModal>
    );
};

export default PdfViewerModal;
