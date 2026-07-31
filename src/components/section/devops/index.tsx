import React, {ReactNode} from 'react';
import {FaArrowLeftLong, FaArrowsRotate, FaLayerGroup} from 'react-icons/fa6';
import {SiDocker, SiGrafana} from 'react-icons/si';
import translations from '@Data/i18n';
import {useLocale} from '@Utils/i18n';

export interface IDevOpsStage {
    id: string;
    /** 영문 단계명 — capability 카드의 라벨과 동일하게 맞춥니다. */
    label: string;
    icon: ReactNode;
}

/** 단계 제목과 태그는 번역 카탈로그에서, 아이콘·id 는 여기에서 가져옵니다. */
export const devopsStages: IDevOpsStage[] = [
    {id: 'design', label: 'Design', icon: <FaLayerGroup/>},
    {id: 'deliver', label: 'Deliver', icon: <SiDocker/>},
    {id: 'observe', label: 'Observe', icon: <SiGrafana/>},
    {id: 'improve', label: 'Improve', icon: <FaArrowsRotate/>},
];

interface IDevOpsCycleProps {
    /** 위쪽 capability 카드와 상호 강조하기 위한 현재 활성 단계 */
    activeId?: string | null;
    onHover?: (id: string | null) => void;
}

/**
 * 설계 → 배포 → 관측 → 개선으로 순환하는 DevOps 흐름 다이어그램.
 * 위 capability 카드와 같은 id를 공유해 서로를 강조합니다.
 */
const DevOpsCycle = ({activeId, onHover}: IDevOpsCycleProps) => {
    const {language} = useLocale();
    const t = translations[language].profile;

    return (
        <figure className="devops-cycle" aria-label={t.devopsCaption}>
            <ol className="devops-track">
                {devopsStages.map((stage, index) => (
                    <li
                        key={stage.id}
                        className={`devops-stage ${activeId === stage.id ? 'is-active' : ''}`}
                        onMouseEnter={() => onHover?.(stage.id)}
                        onMouseLeave={() => onHover?.(null)}
                    >
                        <div className="devops-stage-head">
                            <span className="devops-stage-icon" aria-hidden="true">{stage.icon}</span>
                            <span className="devops-stage-step">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <strong className="devops-stage-title">{t.devopsStages[index].title}</strong>
                        <span className="devops-stage-label">{stage.label}</span>
                        <ul className="devops-stage-tags">
                            {t.devopsStages[index].tags.map((tag) => <li key={tag}>{tag}</li>)}
                        </ul>
                    </li>
                ))}
            </ol>

            <figcaption className="devops-loop">
                <FaArrowLeftLong aria-hidden="true"/>
                {t.devopsLoop}
            </figcaption>
        </figure>
    );
};

export default DevOpsCycle;
