import React from 'react';
import {FaArrowRightLong, FaCheck} from 'react-icons/fa6';
import {IProjectBullet, IProjectMedia, ProjectBlock} from '@Data/project';
import {useLocale} from '@Utils/i18n';

export const ProjectMediaView = ({media}: { media: IProjectMedia }) => {
    const {t} = useLocale();
    return (
        <figure className={`pm-media frame-${media.frame || 'plain'} size-${media.size || 'md'}`}>
            {media.node ? (
                <div className="pm-media-node">{media.node}</div>
            ) : (
                <img className="pm-media-image" src={media.src} alt={t(media.alt)} loading="lazy"/>
            )}
            {media.caption ? <figcaption className="pm-media-caption">{t(media.caption)}</figcaption> : null}
        </figure>
    );
};

const BulletList = ({items, dense}: { items: IProjectBullet[]; dense?: boolean }) => {
    const {t} = useLocale();
    return (
        <ul className={`pm-bullets ${dense ? 'is-dense' : ''}`}>
            {items.map((item) => (
                <li key={t(item.text)}>
                    <strong className="pm-bullet-text">{t(item.text)}</strong>
                    {item.children?.length ? (
                        <ul className="pm-bullet-children">
                            {item.children.map((child) => <li key={t(child)}>{t(child)}</li>)}
                        </ul>
                    ) : null}
                </li>
            ))}
        </ul>
    );
};

const BlockLabel = ({children}: { children: React.ReactNode }) => (
    <span className="pm-block-label">{children}</span>
);

/** 단일 블록을 종류에 맞는 뷰로 그립니다. */
const ProjectBlockView = ({block}: { block: ProjectBlock }) => {
    const {t} = useLocale();

    switch (block.kind) {
        case 'bullets':
            return <BulletList items={block.items}/>;

        case 'flow':
            return (
                <div className="pm-flow">
                    {block.label ? <BlockLabel>{t(block.label)}</BlockLabel> : null}
                    <ol className="pm-flow-list">
                        {block.steps.map((step) => (
                            <li key={t(step.title)} className="pm-flow-item">
                                <strong className="pm-flow-title">{t(step.title)}</strong>
                                <span className="pm-flow-desc">{t(step.desc)}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            );

        case 'star':
            return (
                <ol className="pm-star">
                    {block.steps.map((step) => (
                        <li key={step.step} className={`pm-star-card step-${step.step.toLowerCase()}`}>
                            <div className="pm-star-head">
                                <span className="pm-star-badge" aria-hidden="true">{step.step}</span>
                                <strong className="pm-star-label">{step.label}</strong>
                            </div>
                            {step.media ? <ProjectMediaView media={step.media}/> : null}
                            <BulletList items={step.items} dense/>
                        </li>
                    ))}
                </ol>
            );

        case 'media':
            return <ProjectMediaView media={block.media}/>;

        case 'compare':
            return (
                <div className="pm-compare">
                    {block.label ? <BlockLabel>{t(block.label)}</BlockLabel> : null}
                    <div className="pm-compare-grid">
                        <div className="pm-compare-side is-before">
                            <span className="pm-compare-tag">{block.before.label}</span>
                            <ProjectMediaView media={block.before.media}/>
                        </div>
                        <span className="pm-compare-arrow" aria-hidden="true"><FaArrowRightLong/></span>
                        <div className="pm-compare-side is-after">
                            <span className="pm-compare-tag">{block.after.label}</span>
                            <ProjectMediaView media={block.after.media}/>
                        </div>
                    </div>
                </div>
            );

        case 'metrics':
            return (
                <div className="pm-metrics">
                    {block.label ? <BlockLabel>{t(block.label)}</BlockLabel> : null}
                    <ul className="pm-metric-grid">
                        {block.items.map((metric) => (
                            <li key={t(metric.label)} className="pm-metric">
                                <strong className="pm-metric-value">{t(metric.value)}</strong>
                                <span className="pm-metric-label">{t(metric.label)}</span>
                                {metric.delta ? <span className="pm-metric-delta">{t(metric.delta)}</span> : null}
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case 'note':
            return (
                <aside className="pm-note">
                    <span className="pm-note-icon" aria-hidden="true"><FaCheck/></span>
                    <div>
                        <strong className="pm-note-title">{t(block.title)}</strong>
                        <p className="pm-note-desc">{t(block.desc)}</p>
                    </div>
                </aside>
            );

        default:
            return null;
    }
};

export const ProjectBlocks = ({blocks}: { blocks: ProjectBlock[] }) => (
    <>
        {blocks.map((block, index) => (
            <div key={block.kind + index} className={`pm-block is-${block.kind}`}>
                <ProjectBlockView block={block}/>
            </div>
        ))}
    </>
);

export default ProjectBlocks;
