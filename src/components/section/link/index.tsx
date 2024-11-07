import {useEffect, useState} from 'react';
import og, {OgData} from "@Data/og";
import {LazyLoadImage} from "react-lazy-load-image-component";
import NextIcon from "@Images/icon-next.svg";

export interface ILink {
    url: string
    title: string
}

const LinkPreview = (props: ILink) => {
    const [ogData, setOgData] = useState<OgData | null>(null);

    useEffect(() => {
        const data = og.get(props.url);
        if (data != null) {
            setOgData(data);
        }
    }, [props.url]);

    return (
        <a href={props.url} target={"_blank"} className={"og-container"}>
            {ogData ? (
                <>
                    <div className={"og-img"}>
                        <LazyLoadImage src={ogData.image} alt={ogData.title}/>
                    </div>
                    <div className={"og-info"}>
                        <h3 className={"og-title"}>{ogData.title}</h3>
                        <div className={"og-link-preview"}>{props.url}</div>
                        <p>{ogData.description}</p>
                    </div>
                    <div className={"og-link"}>
                        <img src={NextIcon} alt={ogData.title + " 바로가기"}/>
                    </div>
                </>
            ) : (
                <>
                    <div className={"og-info"}>
                        <h3 className={"og-title"}>{props.title}</h3>
                        <div className={"og-link-preview"}>{props.url}</div>
                    </div>
                    <div className={"og-link"}>
                        <img src={NextIcon} alt={props.title + " 바로가기"}/>
                    </div>
                </>
            )}
        </a>
    );
};

export default LinkPreview;
