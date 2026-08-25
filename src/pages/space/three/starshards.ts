import * as THREE from 'three';
import {SampleGroundY} from './ground-repair';

export interface StarShards {
    total: number;
    update: (time: number, delta: number, playerPos: InstanceType<typeof THREE.Vector3>) => void;
    dispose: () => void;
}

// 수집 목표 개수. 후보 자리 중 실제 바닥이 잡히는 곳만 쓰므로 total은 이보다 적을 수 있다.
const SHARD_TARGET = 7;

// 그중 몇 개를 건물 안(입구 자리)에 둘지. 나머지는 길거리에 흩어진다 —
// 전부 실내에 두면 도시를 걷는 재미가 사라지고, 전부 밖에 두면 입구로 들어갈 이유가 없다.
const INDOOR_TARGET = 3;

// 길거리 조각이 놓일 후보 자리 (각도 라디안, 반지름). 스폰(0,0) 주변부터 섬 가장자리까지
// 산책 코스가 되도록 손으로 고른 값들 — 바닥 복구가 안 된 자리는 건너뛰기 때문에
// 목표 개수보다 넉넉하게 둔다.
const SHARD_CANDIDATES: Array<[number, number]> = [
    [0.4, 10], [2.2, 14], [4.1, 18], [1.2, 24], [5.3, 26],
    [3.3, 32], [0.1, 38], [2.8, 42], [4.8, 46], [1.8, 50],
    [5.9, 34], [3.9, 22], [0.9, 44], [2.5, 52]
];

// 별 조각 수집품. 도시 곳곳에 반짝이는 조각을 흩어 두고, 캐릭터가 다가가면 팝 애니메이션과
// 함께 줍는다. 광원은 쓰지 않는다(fireflies.ts의 교훈) — 발광 재질 + 스프라이트 글로우만.
//
// entranceSpots는 entrances.ts가 찾아낸 건물 개구부 안쪽 좌표다. 레이가 실제로
// 통과한 자리라서 걸어 들어갈 수 있다는 게 보장되므로, 일부 조각을 여기 심어
// "입구로 들어가야 주울 수 있는 조각"을 만든다.
export const createStarShards = (
    scene: InstanceType<typeof THREE.Scene>,
    sampleGroundY: SampleGroundY,
    entranceSpots: Array<InstanceType<typeof THREE.Vector3>>,
    onCollect: (collected: number, total: number) => void
): StarShards => {
    const shardGeom = new THREE.OctahedronGeometry(0.35, 0);

    // Shared halo texture (canvas radial gradient, same recipe as fireflies/guide)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d');
    if (glowCtx) {
        const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(200,235,255,0.8)');
        gradient.addColorStop(0.7, 'rgba(140,200,255,0.18)');
        gradient.addColorStop(1, 'rgba(140,200,255,0)');
        glowCtx.fillStyle = gradient;
        glowCtx.fillRect(0, 0, 64, 64);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    // 빛기둥 텍스처 — 아래는 밝고 위로 갈수록 사라지는 세로 그라데이션.
    // 조각이 건물 뒤에 숨어 있어도 기둥은 지붕 위로 솟아 멀리서도 위치가 보인다.
    const beamCanvas = document.createElement('canvas');
    beamCanvas.width = 16;
    beamCanvas.height = 128;
    const beamCtx = beamCanvas.getContext('2d');
    if (beamCtx) {
        const gradient = beamCtx.createLinearGradient(0, 128, 0, 0);
        gradient.addColorStop(0, 'rgba(160,220,255,0.55)');
        gradient.addColorStop(0.4, 'rgba(140,205,255,0.22)');
        gradient.addColorStop(1, 'rgba(140,205,255,0)');
        beamCtx.fillStyle = gradient;
        beamCtx.fillRect(0, 0, 16, 128);
    }
    const beamTexture = new THREE.CanvasTexture(beamCanvas);
    const BEAM_HEIGHT = 26;
    const beamGeom = new THREE.CylinderGeometry(0.32, 0.32, BEAM_HEIGHT, 8, 1, true);

    interface Shard {
        group: InstanceType<typeof THREE.Group>;
        material: InstanceType<typeof THREE.MeshStandardMaterial>;
        glowMaterial: InstanceType<typeof THREE.SpriteMaterial>;
        beamMaterial: InstanceType<typeof THREE.MeshBasicMaterial>;
        baseY: number;
        seed: number;
        collected: boolean;
        popT: number; // seconds since pickup, drives the pop-and-fade animation
        removed: boolean;
    }

    const shards: Shard[] = [];
    const placed: Array<{ x: number; z: number }> = [];

    // 실내 자리(입구)를 앞에, 길거리 자리를 뒤에 세운다. entrances.ts가 건물별로 한 바퀴씩
    // 돌며 내보내므로 앞에서부터 집기만 해도 서로 다른 건물에 흩어진다.
    // 입구 좌표의 y는 레이 탐침 높이(허리쯤)라 바닥이 아니다. 바닥은 아래에서 다시 샘플링한다.
    const placements: Array<{ x: number; z: number; indoor: boolean }> = [
        ...entranceSpots.map((spot) => ({x: spot.x, z: spot.z, indoor: true})),
        ...SHARD_CANDIDATES.map(([angle, radius]) => ({
            x: Math.sin(angle) * radius,
            z: Math.cos(angle) * radius,
            indoor: false
        }))
    ];

    // 실내 목표치는 여기서 센다. 후보를 미리 세 개로 잘라 두면 그중 하나가 아래 바닥
    // 검사에서 떨어졌을 때 실내 조각이 두 개로 줄어든다 — 후보는 전부 넘기고 세는 건 여기서.
    let indoorPlaced = 0;

    for (const placement of placements) {
        if (shards.length >= SHARD_TARGET) break;
        const {x, z, indoor} = placement;
        if (indoor && indoorPlaced >= INDOOR_TARGET) continue;
        // 조각끼리 너무 붙어 있으면 하나만 남긴다 (길거리 후보가 입구 바로 앞인 경우 등)
        if (placed.some((p) => Math.hypot(p.x - x, p.z - z) < 12)) continue;
        const groundY = sampleGroundY(x, z);
        // 바닥이 없거나 지붕 위(높이 8+)로 잡힌 자리는 걸어서 닿을 수 없으니 버린다
        if (groundY === null || groundY > 8) continue;

        // 조각마다 재질을 따로 두는 이유: 줍는 순간 그 조각만 페이드아웃해야 한다
        const material = new THREE.MeshStandardMaterial({
            color: 0xe0f2ff,
            emissive: 0x7dd3fc,
            emissiveIntensity: 2.6,
            transparent: true,
            opacity: 1
        });
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // 하늘로 솟는 빛기둥 — 가산 블렌딩이라 겹쳐도 밝아질 뿐, 광원 비용은 없다.
        // 실내 조각은 깊이 테스트를 끈다: 그러지 않으면 지붕에 가려 기둥이 통째로 사라져
        // "저 건물 안에 있다"는 신호가 되지 못한다. 벽을 뚫고 보이는 웨이포인트인 셈.
        const beamMaterial = new THREE.MeshBasicMaterial({
            map: beamTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: !indoor,
            side: THREE.DoubleSide
        });

        const group = new THREE.Group();
        group.add(new THREE.Mesh(shardGeom, material));
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.setScalar(1.5);
        group.add(glow);
        const beam = new THREE.Mesh(beamGeom, beamMaterial);
        beam.position.y = BEAM_HEIGHT / 2;
        // 깊이 테스트를 끈 실내 기둥은 마지막에 그려야 도시 위로 얹힌다
        if (indoor) beam.renderOrder = 2;
        group.add(beam);

        const baseY = groundY + 1.1;
        group.position.set(x, baseY, z);
        scene.add(group);

        shards.push({group, material, glowMaterial, beamMaterial, baseY, seed: Math.random() * 100, collected: false, popT: 0, removed: false});
        placed.push({x, z});
        if (indoor) indoorPlaced++;
    }

    const total = shards.length;
    let collectedCount = 0;

    return {
        total,
        update: (time, delta, playerPos) => {
            for (const shard of shards) {
                if (shard.removed) continue;

                if (shard.collected) {
                    // Pop: balloon up + fade out over ~0.45s, then leave the scene for good
                    shard.popT += delta;
                    const k = Math.min(shard.popT / 0.45, 1);
                    shard.group.scale.setScalar(1 + k * 2.2);
                    shard.group.position.y = shard.baseY + k * 1.4;
                    shard.material.opacity = 1 - k;
                    shard.glowMaterial.opacity = 0.7 * (1 - k);
                    // 기둥은 그룹 스케일을 따라 80유닛짜리 섬광이 되어버리므로 즉시 끈다
                    shard.beamMaterial.opacity = 0;
                    if (k >= 1) {
                        scene.remove(shard.group);
                        shard.removed = true;
                    }
                    continue;
                }

                // Idle: spin + bob so shards catch the eye from across the street
                shard.group.rotation.y = time * 1.6 + shard.seed;
                shard.group.position.y = shard.baseY + Math.sin(time * 2 + shard.seed) * 0.18;

                const dx = playerPos.x - shard.group.position.x;
                const dz = playerPos.z - shard.group.position.z;
                const dy = playerPos.y - shard.baseY;
                // 수평 2.2 이내 + 높이 차 2.5 이내면 획득 — 점프 중에도 스칠 수 있게 넉넉히
                if (dx * dx + dz * dz < 2.2 * 2.2 && Math.abs(dy) < 2.5) {
                    shard.collected = true;
                    collectedCount++;
                    onCollect(collectedCount, total);
                }
            }
        },
        dispose: () => {
            shards.forEach((shard) => {
                if (!shard.removed) scene.remove(shard.group);
                shard.material.dispose();
                shard.glowMaterial.dispose();
                shard.beamMaterial.dispose();
            });
            shardGeom.dispose();
            beamGeom.dispose();
            glowTexture.dispose();
            beamTexture.dispose();
        }
    };
};
