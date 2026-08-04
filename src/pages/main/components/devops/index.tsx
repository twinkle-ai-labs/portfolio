import React, {useCallback, useEffect, useRef, useState} from 'react';
import translations from '@Data/i18n';
import {useLocale} from '@Utils/i18n';

/*
 * 인피니티(∞) 리본.
 * 두 고리는 반지름이 같은 '정원' 이어야 찌그러져 보이지 않으므로
 * 각 고리를 290° 원호로 두고, 안쪽으로 열린 틈은 가운데에서 X 로
 * 교차하는 직선 밴드 두 개로 잇습니다.
 *
 *   좌원 중심 (285,210) · 우원 중심 (615,210) · 반지름 150
 *   원호 끝점 A(408,124) B(408,296) C(492,124) D(492,296)
 */
/** 두 정원의 공통 반지름 — 라벨용 원호도 이 값을 씁니다. */
const RADIUS = 150;

/**
 * 구간 사이에 '눈에 보이는' 틈 (사용자 좌표계 기준).
 * 0 이면 둥근 끝끼리 정확히 맞닿아 마디가 이어진 하나의 리본으로 읽힙니다.
 */
const SEGMENT_GAP = 0;
const SEGMENTS = 4;

const DEV_LOOP = 'M408 124 A150 150 0 1 0 408 296';
const OPS_LOOP = 'M492 124 A150 150 0 1 1 492 296';
/** Dev 끝(B) → Ops 시작(C): 아래에서 위로 올라가는 밴드 */
const CROSS_UP = 'M408 296 L492 124';
/** Ops 끝(D) → Dev 시작(A): 위에서 아래로 내려오는 밴드 */
const CROSS_DOWN = 'M492 296 L408 124';
/** 빛이 달리는 전체 순환 경로 — 설계→…→테스트→(X)→배포→…→개선→(X)→처음 */
const FULL_LOOP = 'M408 124 A150 150 0 1 0 408 296 L492 124 A150 150 0 1 1 492 296 L408 124';

const devIds = ['design', 'code', 'build', 'test'];
const opsIds = ['deploy', 'operate', 'monitor', 'improve'];

/** 리본 위 한 점 — 라벨이 이 점을 중심으로 곡선을 따라 흐릅니다. */
interface IAnchor {
    x: number;
    y: number;
}

interface IDevOpsCycleProps {
    /** 옆의 capability 카드와 상호 강조하기 위한 현재 활성 단계 */
    activeId?: string | null;
    onHover?: (id: string | null) => void;
}

/**
 * 원호를 네 구간으로 끊고, 각 구간 가운데의 좌표를 잽니다.
 * 좌표를 손으로 적어 두면 경로를 손볼 때마다 어긋나므로 실제 경로에서 직접 재 옵니다.
 *
 * 끝을 둥글게 하면 캡이 stroke-width 의 절반씩 양쪽으로 삐져나옵니다.
 * 그래서 dasharray 의 틈은 '보이는 틈 + stroke-width' 여야 하고,
 * 반대로 각 구간은 그만큼 짧게 잡아야 시각적으로 균등해집니다.
 */
const useLoopGeometry = () => {
    const ref = useRef<SVGPathElement>(null);
    const [geometry, setGeometry] = useState<{ dash: number; gap: number; anchors: IAnchor[] } | null>(null);

    const measure = useCallback(() => {
        const path = ref.current;
        if (!path) return;

        const length = path.getTotalLength();
        // stroke-width 는 미디어 쿼리로 달라지므로 CSS 에서 실제 값을 읽어 옵니다.
        const width = parseFloat(getComputedStyle(path).strokeWidth) || 0;
        const gap = SEGMENT_GAP + width;
        const dash = (length - gap * (SEGMENTS - 1)) / SEGMENTS;

        const anchors = [0, 1, 2, 3].map((index) => {
            const {x, y} = path.getPointAtLength(index * (dash + gap) + dash / 2);
            return {x, y};
        });

        setGeometry({dash, gap, anchors});
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [measure]);

    return {ref, geometry};
};

/**
 * 설계 → 배포 → 관측 → 개선으로 순환하는 DevOps 흐름을 인피니티(∞) 리본으로 그립니다.
 * 왼쪽 고리는 Development, 오른쪽 고리는 Operation이며
 * 옆의 capability 카드와 id를 공유해 서로를 강조합니다.
 */
const DevOpsCycle = ({activeId, onHover}: IDevOpsCycleProps) => {
    const {language} = useLocale();
    const t = translations[language].profile;

    const dev = useLoopGeometry();
    const ops = useLoopGeometry();

    const isOn = (id: string) => activeId === id || activeId === 'all';

    /*
     * 라벨은 좌표에 얹어 회전시키는 대신 textPath 로 리본 곡선 자체를 따라 흐르게 합니다.
     * 좌표+회전 방식은 글자의 기울기와 리본의 곡률이 미묘하게 어긋나 붕 떠 보입니다.
     *
     * 각 라벨마다 앵커를 중심으로 하는 짧은 원호를 만들어 텍스트 경로로 씁니다.
     * 위쪽 반원은 왼→오른쪽(시계), 아래쪽 반원은 반대로 감아야 글자가 뒤집히지 않습니다.
     */
    const labelArc = (anchor: IAnchor, cx: number) => {
        const cy = 210;
        const angle = Math.atan2(anchor.y - cy, anchor.x - cx);
        const spread = 0.75;
        const isBottom = anchor.y > cy;
        const from = isBottom ? angle + spread : angle - spread;
        const to = isBottom ? angle - spread : angle + spread;
        const point = (a: number) => `${cx + RADIUS * Math.cos(a)} ${cy + RADIUS * Math.sin(a)}`;
        return `M${point(from)} A${RADIUS} ${RADIUS} 0 0 ${isBottom ? 0 : 1} ${point(to)}`;
    };

    const renderLabels = (anchors: IAnchor[] | null, ids: string[], labels: string[], cx: number) =>
        anchors?.map((anchor, index) => (
            <g
                key={ids[index]}
                className={`dvi-node ${isOn(ids[index]) ? 'is-active' : ''}`}
                onMouseEnter={() => onHover?.(ids[index])}
                onMouseLeave={() => onHover?.(null)}
            >
                <path id={`dvi-label-${ids[index]}`} d={labelArc(anchor, cx)} fill="none"/>
                <text>
                    <textPath href={`#dvi-label-${ids[index]}`} startOffset="50%">{labels[index]}</textPath>
                </text>
            </g>
        ));

    return (
        <figure className={`devops-cycle ${activeId ? 'is-focused' : ''}`}>
            <div className="dvi-frame">
                <svg
                    className="dvi-svg"
                    viewBox="60 5 780 410"
                    role="img"
                    aria-label={t.devopsCaption}
                >
                    <defs>
                        {/* 좌→우로 이어지는 브랜드 그라데이션. 교차 밴드도 같은 축을 공유합니다. */}
                        <linearGradient id="dvi-dev" x1="112" y1="210" x2="450" y2="210" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="var(--dvi-dev-from)"/>
                            <stop offset="100%" stopColor="var(--dvi-dev-to)"/>
                        </linearGradient>
                        <linearGradient id="dvi-ops" x1="450" y1="210" x2="788" y2="210" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="var(--dvi-ops-from)"/>
                            <stop offset="100%" stopColor="var(--dvi-ops-to)"/>
                        </linearGradient>
                        <linearGradient id="dvi-cross" x1="408" y1="210" x2="492" y2="210" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="var(--dvi-dev-to)"/>
                            <stop offset="100%" stopColor="var(--dvi-ops-from)"/>
                        </linearGradient>
                    </defs>

                    <g>
                        {/* 뒤에 깔리는 글로우 — 리본과 같은 모양을 흐려서 한 번 더 그립니다. */}
                        <g className="dvi-halo" aria-hidden="true">
                            <path d={DEV_LOOP} stroke="var(--dvi-dev-to)"/>
                            <path d={OPS_LOOP} stroke="var(--dvi-ops-from)"/>
                        </g>

                        {/* 리본 본체 — 단계마다 끊고, 끊긴 끝을 둥글게 굴립니다. */}
                        <path
                            ref={dev.ref}
                            className="dvi-ribbon dvi-ribbon-arc"
                            d={DEV_LOOP}
                            stroke="url(#dvi-dev)"
                            strokeDasharray={dev.geometry ? `${dev.geometry.dash} ${dev.geometry.gap}` : undefined}
                        />
                        <path
                            ref={ops.ref}
                            className="dvi-ribbon dvi-ribbon-arc"
                            d={OPS_LOOP}
                            stroke="url(#dvi-ops)"
                            strokeDasharray={ops.geometry ? `${ops.geometry.dash} ${ops.geometry.gap}` : undefined}
                        />

                        {/* 교차 밴드 — 아래를 먼저, 위를 나중에 그려 한쪽이 지나가는 것처럼 보이게 합니다. */}
                        <path className="dvi-ribbon dvi-cross-under" d={CROSS_DOWN} stroke="url(#dvi-cross)"/>
                        <path className="dvi-ribbon" d={CROSS_UP} stroke="url(#dvi-cross)"/>

                        {/* 리본을 따라 도는 빛 — 흐름의 방향을 알려 줍니다. */}
                        <path className="dvi-spark" d={FULL_LOOP}/>
                        <path className="dvi-spark dvi-spark-late" d={FULL_LOOP}/>

                        {/* 고리 한가운데의 이름 — 약칭을 크게, 풀네임을 그 아래 작게. */}
                        <g className="dvi-lobes">
                            <text className="dvi-lobe-short" x="285" y="196">Dev</text>
                            <text className="dvi-lobe-full" x="285" y="236">Development</text>
                            <text className="dvi-lobe-short" x="615" y="196">Ops</text>
                            <text className="dvi-lobe-full" x="615" y="236">Operation</text>
                        </g>

                        {renderLabels(dev.geometry?.anchors ?? null, devIds, t.devopsFlow.dev, 285)}
                        {renderLabels(ops.geometry?.anchors ?? null, opsIds, t.devopsFlow.ops, 615)}
                    </g>
                </svg>
            </div>

            <figcaption className="devops-loop">{t.devopsLoop}</figcaption>
        </figure>
    );
};

export default DevOpsCycle;
