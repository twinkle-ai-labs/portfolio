import React from 'react';
import LinkPreview from "@Components/section/link";

const NicomContent = () => {
    return (
        <>
            <div className={"title"}>수행 업무: <b>나이콤 웹 솔루션 개발</b></div>
            <div className={"desc"}>
                <ul>
                    <li>총 10개 이상의 프로젝트에서 요구사항 분석부터 개발, 배포까지 수행</li>
                    <li>주로 백오피스(관리자 프로그램) 개발</li>
                    <li>외부 API, Batch, 하이브리드 웹앱, 미들웨어 등 개발</li>
                </ul>
            </div>

            <div>
                링크로 볼 수 있는 프로젝트로는 <b>스마트도서관 시스템</b>의 <br className={"pc"} />
                <b>스마트도서관 앱</b>과 <b>도서 검색페이지</b>가 있습니다.
            </div>
            <ul>
                <li><LinkPreview url={"https://m.smartlib.co.kr"} title={"스마트도서관 앱"}/></li>
                <li><LinkPreview url={"https://smart.gdlibrary.or.kr:9525"} title={"강동구 스마트도서관 검색페이지"}/></li>
            </ul>
        </>
    );
};

export default NicomContent;
