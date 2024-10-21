import React, {useState} from 'react';
import Header from "@Layout/header";
import DrawerSection from "@Layout/drawer";

import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// react-pdf worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.mjs';

const App = () => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({numPages}: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <>
            <Header/>
            <main id="content" className={'resume'}>
                <Document file="pdf/jobkorea-resume.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber}/>
                </Document>
            </main>
            <DrawerSection/>
        </>
    );
};

export default App;
