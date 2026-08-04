import * as THREE from 'three';
import {raycastCity} from './city-raycast';

// Auto-detect walkable "doorway" gaps around each building's footprint by probing its
// perimeter with rays — the same technique the movement collision code uses — instead of
// trusting the model's node names (which turned out to collapse to one bogus shared
// position for every building here). Wherever a probe travels much farther than its
// neighbors before hitting the building, that's an opening in the wall.
export const detectEntrances = (building: any, spawnHeight: number): Array<InstanceType<typeof THREE.Vector3>> => {
    const probeRay = new THREE.Raycaster();
    const probeHeight = spawnHeight + 0.8; // roughly waist height, matching the walk-collision probe
    const entranceCandidates: InstanceType<typeof THREE.Vector3>[] = [];

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

        samples.forEach((s) => {
            if (s.dist !== null && s.dist > baseline + 3 && s.dist > baseline * 1.6) {
                // Found a gap — drop the marker a little way inside the opening
                const spot = s.point.clone().addScaledVector(s.dir, Math.min(s.dist * 0.5, 6));
                const nearby = entranceCandidates.some((p) => p.distanceTo(spot) < 6);
                if (!nearby) entranceCandidates.push(spot);
            }
        });
    });

    return entranceCandidates;
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
