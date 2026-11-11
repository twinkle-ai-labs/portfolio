import {useEffect} from "react";
import {useLocation} from "react-router-dom";
const seo = require("../../seo.config.cjs");
export default function RouteMetadata() {
    const {pathname} = useLocation();
    useEffect(() => {
        const root = pathname === "/";
        const files = /^\/files\/?$/.test(pathname);
        const space = /^\/space\/?$/.test(pathname);
        const title = root ? seo.title : files ? "자료 보관함 | Twinkle’s Portfolio" : space ? "Twinkle Space | Twinkle’s Portfolio" : "찾을 수 없는 페이지 | Twinkle’s Portfolio";
        const description = root ? seo.description : files ? "접근 권한이 필요한 개인 자료 보관함입니다." : space ? "김희정(twinkle)의 포트폴리오에서 탐색하는 3D 공간입니다." : "요청한 페이지를 찾을 수 없습니다.";
        document.title = title;
        for (const name of ["robots", "googlebot"]) {
            const tags = document.querySelectorAll<HTMLMetaElement>(`meta[name="${name}"]`);
            tags.forEach(tag => tag.content = root ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,follow");
        }
        for (const [selector, content] of [
            ['meta[name="title"]', title], ['meta[property="og:title"]', title], ['meta[name="twitter:title"]', title],
            ['meta[name="description"]', description], ['meta[property="og:description"]', description], ['meta[name="twitter:description"]', description],
            ['meta[property="og:url"]', root ? seo.url : new URL(pathname.replace(/\/$/, "") + "/", seo.url).href],
        ]) {
            const tag = document.querySelector<HTMLMetaElement>(selector);
            if (tag) tag.content = content;
        }
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (canonical) canonical.href = root ? seo.url : new URL(pathname.replace(/\/$/, "") + "/", seo.url).href;
    }, [pathname]);
    return null;
}
