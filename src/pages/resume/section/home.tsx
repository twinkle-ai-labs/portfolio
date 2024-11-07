import React from 'react';
import {useDispatch} from "react-redux";
import {openModal} from "@Store/slice/modal";

const HomeSection = () => {
    const dispatch = useDispatch();
    const onPdfButtonClick = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
        console.info(type, e)
        if (type === 'portfolio') {
            dispatch(
                openModal({
                    type: "pdf",
                    props: {
                        title: '포트폴리오',
                        file: 'pdf/portfolio.pdf'
                    }
                })
            );
        } else if (type === 'resume') {
            dispatch(
                openModal({
                    type: "pdf",
                    props: {
                        title: '잡코리아 이력서',
                        file: 'pdf/jobkorea-resume.pdf'
                    }
                })
            );
        } else if (type === 'presentation') {
            dispatch(
                openModal({
                    type: "pdf",
                    props: {
                        title: '프리젠테이션',
                        file: 'pdf/presentation.pdf'
                    }
                })
            );
        }
    }
    return (
        <>
            <section id="s_home" className="section h-100">
                <div className="section-bg"></div>
                <h1 className="section-title" data-aos="fade-up" data-aos-delay={100}>
                    PDF Viewer
                </h1>
                <div className={"section-desc"} data-aos="fade-up" data-aos-delay={200}>
                    You can see the PDF files <br className={"mobile"}/> of Resume, Portfolio, Presentation.
                </div>
                <div className={"section-content"} data-aos="fade-up" data-aos-delay={300}>
                    <ul>
                        <li>
                            <button onClick={e =>
                                onPdfButtonClick(e, 'resume')}>Resume
                            </button>
                        </li>
                        <li>
                            <button onClick={e =>
                                onPdfButtonClick(e, 'portfolio')}>Portfolio
                            </button>
                        </li>
                        <li>
                            <button onClick={e =>
                                onPdfButtonClick(e, 'presentation')}>Presentation
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default HomeSection;