import SmartLibraryApp from "@Images/og_smart.png"
import SmartLibrarySearch from "@Images/og_smart_search.png"
import ssjobgy from "@Images/og_ssjobgy.jpg"
import dental100year from "@Images/og_100dental.jpg"
import barundc from "@Images/og_barundc.jpg"
import kappleden from "@Images/og_kappleden.png"
import nlm from "@Images/og_nlm.png"
import ileg from "@Images/og_ileg.png"

export interface OgData {
    url: string;
    title: string;
    description: string;
    image: string;
    site_name?: string;
}

const og = new Map<string, OgData>();
og.set("http://barundc.com", {
    "url": "http://barundc.com",
    "title": "바른치과의원",
    "description": "정확하고 안전한 디지털진료로 환자를 먼저 생각하는 바른치과는 언제나 기본에 충실하고 올바르게 진료합니다.",
    "image": barundc,
    "site_name": "바른치과의원"
});

og.set("http://ssjobgy.com", {
    "url": "http://ssjobgy.com/",
    "title": "삼성제이여성의원",
    "description": "왕십리역 삼성제이여성의원은 20여 년간 축적한 임상경험과 노하우를 바탕으로 여성질환, 자궁, 난소암 검진, 여성생식기 재생 및 성형술에 특화된 산부인과입니다.",
    "image": ssjobgy,
    "site_name": "삼성제이여성의원"
});

og.set("http://100yeardental.com", {
    "url": "http://100yeardental.com",
    "title": "연세백세치과의원",
    "description": "자연치아를 살리기 위해 노력하고 환자를 먼저 생각하는 연세백세치과는 언제나 기본에 충실하고 올바르게 진료합니다",
    "image": dental100year,
    "site_name": "연세백세치과의원"
})

og.set("http://kappleden.com", {
    "url": "http://kappleden.com",
    "title": "김포사과나무치과",
    "description": "김포치과, 장기동치과, 김포 임플란트, 전체 임플란트, 소아진료, 심미보철, 잇몸치료, 틀니, 턱관절 치료, 사랑니",
    "image": kappleden,
    "site_name": "김포사과나무치과"
})

og.set("http://ilegcorp.com", {
    "url": "http://ilegcorp.com",
    "title": "주식회사 아이레그",
    "description": "다리교정기, 안짱다리 교정, 오다리 교정, X다리 교정, 휜다리 교정, 평발 교정, 발보조기",
    "image": ileg,
    "site_name": "주식회사 아이레그"
})

og.set("https://nlmbookcafe.com", {
    "url": "https://www.nlmbookcafe.com/en/",
    "title": "The New Life Mission Blogs",
    "description": "The New Life Mission Blogs",
    "image": nlm,
    "site_name": "The New Life Mission"
});

og.set("https://m.smartlib.co.kr", {
    "url": "https://m.smartlib.co.kr/",
    "title": "스마트도서관 앱",
    "description": "스마트도서관(U-도서관)을 보다 편리하고 스마트하게 이용할 수 있도록 도와주는 앱 입니다.",
    image: SmartLibraryApp
})

og.set("https://smart.gdlibrary.or.kr:9525", {
    url: "https://smart.gdlibrary.or.kr:9525/",
    title: "스마트도서관 검색페이지",
    description: "도서관 방문이 어려운 이용자를 위해 별도의 예약신청 없이 가까운 스마트 대출반납기에 비치된 도서를 현장에서 바로 대출할 수 있는 서비스를 제공합니다.",
    image: SmartLibrarySearch
})

export default og;