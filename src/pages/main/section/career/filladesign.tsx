import React from 'react';
import LinkPreview from "@Components/section/link";

const FillaDesignContent = () => {
    return (
        <>
            <div className={"title"}>수행 업무: <b>홈페이지 제작 퍼블리싱</b></div>
            <div className={"desc"}>
                <ul>
                    <li><b>그누보드5 솔루션</b> 기반 홈페이지 제작 - LAMP(Linux, Apache, MySQL, PHP) 스택</li>
                    <li>주로 병원 홈페이지 제작</li>
                    <li>작업물은 아래 사이트에서 보실 수 있습니다.</li>
                </ul>
            </div>
            <ul>
                <li><LinkPreview title="삼성제이여성의원" url={"http://ssjobgy.com"}/></li>
                <li><LinkPreview title="바른치과의원" url={"http://barundc.com"}/></li>
                <li><LinkPreview title="연세백세치과의원" url={"http://100yeardental.com"}/></li>
                <li><LinkPreview title="김포사과나무치과" url={"http://kappleden.com"}/></li>
                <li><LinkPreview title="아이레그" url={"http://ilegcorp.com"}/></li>
            </ul>
        </>
    );
};

export default FillaDesignContent;
