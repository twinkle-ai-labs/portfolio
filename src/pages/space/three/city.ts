import * as THREE from 'three';
import {raycastCity, setCityMaterials} from './city-raycast';
import {repairCityGround, SampleGroundY} from './ground-repair';

export interface PreparedCity {
    building: any;
    spawnHeight: number;
    sampleGroundY: SampleGroundY;
}

// Future City GLB 원본 씬(clone)을 받아 월드에 세울 수 있는 상태로 다듬는다:
// 스케일·바닥 정렬, 스폰 높이 탐지, 재질 보정, 그리고 빠진 바닥의 자동 복구까지.
export const prepareCity = (building: any): PreparedCity => {
    // Calculate bounding box of the loaded building to automatically scale it
    const box = new THREE.Box3().setFromObject(building);
    const size = box.getSize(new THREE.Vector3());

    // Scale building safely so that it spans a reasonable width/depth (around 120 units wide/deep)
    const maxDim = Math.max(size.x, size.z);
    const targetDim = 120.0;
    const scaleFactor = targetDim / (maxDim || 1.0);
    building.scale.setScalar(scaleFactor);

    // Align bottom of the building to the ground (y = 0)
    const bY = -box.min.y * scaleFactor;
    building.position.y = bY;
    building.position.x = 0;
    building.position.z = 0;

    // Force world matrix update immediately so Raycaster can query accurate world coords
    building.updateMatrixWorld(true);

    const allMaterials: any[] = [];
    building.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // 삼각형 128만 개짜리 모델이다. 트리를 미리 세워두지 않으면 레이 한 방마다
            // 전부 훑는다. clone()은 지오메트리를 공유하므로 재마운트해도 다시 짓지 않는다.
            if (child.geometry && !child.geometry.boundsTree) {
                child.geometry.computeBoundsTree();
            }

            // Boost materials if needed, e.g., enabling emissive lighting for window glows
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material: any) => {
                if (material) {
                    // 그릴 때는 앞면만 — 뒷면 컬링이 꺼져 있으면 건물 안쪽의 보이지도 않는
                    // 면까지 전부 래스터라이즈된다. 충돌 판정용 양면은 raycastCity가 맡는다.
                    material.side = THREE.FrontSide;
                    material.roughness = Math.max(material.roughness, 0.4);
                    if (material.emissive && material.emissive.getHex() !== 0) {
                        material.emissiveIntensity = Math.max(material.emissiveIntensity, 1.5);
                    }
                    allMaterials.push(material);
                }
            });
        }
    });
    setCityMaterials(allMaterials);

    // Dynamically detect the exact floor height at (0, 0) by casting a test ray down
    const testRaycaster = new THREE.Raycaster();
    const testOrigin = new THREE.Vector3(0, 500, 0);
    const testDirection = new THREE.Vector3(0, -1, 0);
    testRaycaster.set(testOrigin, testDirection);

    const testIntersects = raycastCity(testRaycaster, building);
    let spawnHeight = 0;
    if (testIntersects.length > 0) {
        spawnHeight = testIntersects[0].point.y;
    }

    const sampleGroundY = repairCityGround(building);

    // 복구 패치도 캐릭터가 밟는 바닥이다 — 여기 트리가 없으면 그 위를 걷는 동안만
    // 레이캐스트가 선형 탐색으로 되돌아간다.
    building.traverse((child: any) => {
        if (child.isMesh && child.geometry && !child.geometry.boundsTree) {
            child.geometry.computeBoundsTree();
        }
    });

    return {building, spawnHeight, sampleGroundY};
};
