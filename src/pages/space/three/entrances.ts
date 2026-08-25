import * as THREE from 'three';
import {raycastCity} from './city-raycast';

// Auto-detect walkable "doorway" gaps around each building's footprint by probing its
// perimeter with rays — the same technique the movement collision code uses — instead of
// trusting the model's node names (which turned out to collapse to one bogus shared
// position for every building here). Wherever a probe travels much farther than its
// neighbors before hitting the building, that's an opening in the wall.
// 건물 하나에서 뽑을 입구의 최대 개수.
//
// 실측하면 이 모델은 건물 9동에서 후보 76개가 나오는데, 그중 18개가 한 건물에 몰린다.
// 한 동의 사방을 다 표시해 봐야 플레이어에게 주는 정보는 "여기 들어갈 수 있다" 하나뿐이라
// 나머지는 화면만 어지럽힌다.
const MAX_PER_BUILDING = 3;

// 같은 건물 안에서 입구끼리 요구하는 최소 간격. 개구부 하나가 여러 탐침에 걸려
// 두세 개로 쪼개지는 걸 막는다.
const MIN_GAP_WITHIN_BUILDING = 8;

export const detectEntrances = (building: any, spawnHeight: number): Array<InstanceType<typeof THREE.Vector3>> => {
    const probeRay = new THREE.Raycaster();
    const probeHeight = spawnHeight + 0.8; // roughly waist height, matching the walk-collision probe
    const entranceCandidates: InstanceType<typeof THREE.Vector3>[] = [];
    // 건물별로 따로 담는다 — 마지막에 라운드로빈으로 섞어 내보내기 위해서다
    const perBuilding: Array<Array<InstanceType<typeof THREE.Vector3>>> = [];

    const buildingRoots: any[] = [];
    building.traverse((child: any) => {
        if (child.name && /^building/i.test(child.name)) {
            buildingRoots.push(child);
        }
    });

    buildingRoots.forEach((root) => {
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Skip tiny fragments and anything sitting outside the playable island (radius 58)
        if (size.x < 4 || size.z < 4) return;
        if (Math.sqrt(center.x * center.x + center.z * center.z) > 58) return;

        const sampleCount = 12;
        const margin = 1.5; // start each probe just outside the footprint
        const samples: Array<{ point: InstanceType<typeof THREE.Vector3>; dir: InstanceType<typeof THREE.Vector3>; dist: number | null }> = [];

        for (let i = 0; i < sampleCount; i++) {
            const t = i / sampleCount;
            // Walk the rectangular perimeter of the footprint bounding box
            let x: number, z: number;
            if (t < 0.25) { x = box.min.x + (t / 0.25) * size.x; z = box.min.z; }
            else if (t < 0.5) { x = box.max.x; z = box.min.z + ((t - 0.25) / 0.25) * size.z; }
            else if (t < 0.75) { x = box.max.x - ((t - 0.5) / 0.25) * size.x; z = box.max.z; }
            else { x = box.min.x; z = box.max.z - ((t - 0.75) / 0.25) * size.z; }

            const dir = new THREE.Vector3(center.x - x, 0, center.z - z).normalize();
            const origin = new THREE.Vector3(x - dir.x * margin, probeHeight, z - dir.z * margin);

            probeRay.set(origin, dir);
            probeRay.far = Math.max(size.x, size.z);
            const hits = raycastCity(probeRay, building);
            samples.push({point: origin, dir, dist: hits.length ? hits[0].distance : null});
        }

        const finiteDists = samples.map((s) => s.dist).filter((d): d is number => d !== null);
        if (finiteDists.length < sampleCount * 0.5) return; // too many misses on this facade — unreliable, skip
        const sorted = [...finiteDists].sort((a, b) => a - b);
        const baseline = sorted[Math.floor(sorted.length / 2)]; // median "solid wall" distance

        const found: Array<InstanceType<typeof THREE.Vector3>> = [];
        samples.forEach((s) => {
            if (found.length >= MAX_PER_BUILDING) return;
            if (s.dist !== null && s.dist > baseline + 3 && s.dist > baseline * 1.6) {
                // Found a gap — drop the marker a little way inside the opening
                const spot = s.point.clone().addScaledVector(s.dir, Math.min(s.dist * 0.5, 6));
                if (found.some((p) => p.distanceTo(spot) < MIN_GAP_WITHIN_BUILDING)) return;
                // 이웃 건물이 이미 잡은 자리와 겹치면 버린다 (좁은 골목을 사이에 둔 두 동)
                if (entranceCandidates.some((p) => p.distanceTo(spot) < 6)) return;
                found.push(spot);
                entranceCandidates.push(spot);
            }
        });
        if (found.length > 0) perBuilding.push(found);
    });

    // 건물 순서대로 이어 붙이면 앞쪽이 전부 한 건물 차지가 된다 — 실제로 첫 건물 하나가
    // 후보 18개를 내놨다. 앞에서 N개만 쓰는 쪽(별 조각)이 섬 한구석에 몰리지 않도록,
    // 각 건물의 첫 입구를 먼저 한 바퀴 돌고 그다음 두 번째를 도는 식으로 내보낸다.
    const spread: Array<InstanceType<typeof THREE.Vector3>> = [];
    for (let rank = 0; rank < MAX_PER_BUILDING; rank++) {
        perBuilding.forEach((list) => {
            if (list[rank]) spread.push(list[rank]);
        });
    }
    return spread;
};

export interface EntranceBeacons {
    update: (time: number, viewer: InstanceType<typeof THREE.Vector3>) => void;
    dispose: () => void;
}

// 동시에 켜 둘 입구 조명의 최대 개수.
//
// 포워드 렌더러에서 광원 하나는 도시 전 프래그먼트에 대해 평가된다 — fireflies.ts가
// 반딧불이에 PointLight를 안 쓰는 이유이자, 거기 적힌 "여덟 개만으로도 프레임레이트가
// 크게 떨어졌다"는 기록의 이유다. 입구는 모델에 따라 개수가 정해지므로 상한이 없으면
// 반딧불이에서 아낀 비용을 여기서 그대로 도로 낸다.
//
// 대신 캐릭터에서 가까운 것만 켠다. 멀리 있는 입구는 어차피 조명 반경(20) 밖이라
// 화면에서 달라지는 게 없다 — 비콘은 전부 그대로 떠 있다.
const MAX_LIGHTS = 3;
const REASSIGN_INTERVAL = 0.3; // 초. 매 프레임 정렬할 이유가 없다

// Each detected entrance gets a warm interior light + a pulsing beacon so it's noticeable
// from outside. Styled as slightly larger fireflies — warm and soft — kin to the swarm.
export const createEntranceBeacons = (
    scene: InstanceType<typeof THREE.Scene>,
    spots: Array<InstanceType<typeof THREE.Vector3>>
): EntranceBeacons => {
    const beaconGeom = new THREE.SphereGeometry(0.16, 12, 12);
    const beaconMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe9a8,
        emissive: 0xffc44d,
        emissiveIntensity: 3.2,
        transparent: true,
        opacity: 0.85
    });

    const beacons: Array<{ mesh: InstanceType<typeof THREE.Mesh>; seed: number; yBase: number }> = [];

    // 비콘은 입구마다 하나씩. 작은 구 하나라 광원과 달리 개수가 늘어도 거의 공짜다.
    spots.forEach((spot) => {
        const beacon = new THREE.Mesh(beaconGeom, beaconMaterial);
        const yBase = spot.y + 1.6;
        beacon.position.set(spot.x, yBase, spot.z);
        scene.add(beacon);
        beacons.push({mesh: beacon, seed: Math.random() * 100, yBase});
    });

    // 조명은 고정 개수의 풀. 입구를 옮겨 다니며 재사용한다.
    const lights: Array<InstanceType<typeof THREE.PointLight>> = [];
    for (let i = 0; i < Math.min(MAX_LIGHTS, spots.length); i++) {
        // Warm point light so the lobby actually reads as a lit room instead of a dark void
        const light = new THREE.PointLight(0xffd8a8, 8, 20, 2);
        light.visible = false; // 첫 배치 전까지는 꺼 둔다
        scene.add(light);
        lights.push(light);
    }

    // 재배치용 작업 버퍼 — 매번 새로 만들면 0.3초마다 쓰레기가 쌓인다
    const ranked = spots.map((spot, index) => ({index, dist: 0}));
    let nextReassign = -1;

    return {
        // gentle bob + pulse to draw the eye toward enterable buildings
        update: (time: number, viewer: InstanceType<typeof THREE.Vector3>) => {
            beacons.forEach((beacon) => {
                beacon.mesh.position.y = beacon.yBase + Math.sin(time * 1.6 + beacon.seed) * 0.25;
                const pulse = 0.85 + Math.sin(time * 2.4 + beacon.seed) * 0.2;
                beacon.mesh.scale.setScalar(pulse);
            });

            if (lights.length === 0 || time < nextReassign) return;
            nextReassign = time + REASSIGN_INTERVAL;

            for (let i = 0; i < ranked.length; i++) {
                ranked[i].dist = spots[ranked[i].index].distanceToSquared(viewer);
            }
            ranked.sort((a, b) => a.dist - b.dist);

            for (let i = 0; i < lights.length; i++) {
                const spot = spots[ranked[i].index];
                lights[i].position.set(spot.x, spot.y + 2.2, spot.z);
                lights[i].visible = true;
            }
        },
        dispose: () => {
            lights.forEach((light) => {
                scene.remove(light);
                light.dispose();
            });
            beacons.forEach((beacon) => scene.remove(beacon.mesh));
            beaconGeom.dispose();
            beaconMaterial.dispose();
        }
    };
};
