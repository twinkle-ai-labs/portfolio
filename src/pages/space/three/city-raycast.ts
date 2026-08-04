import * as THREE from 'three';
import './bvh'; // 부작용 import — 아래 레이캐스트가 BVH를 탄다

// 도시의 재질들. raycastCity가 충돌 판정 동안만 양면으로 젖히기 위해 들고 있는다.
// 도시는 씬에 하나뿐이라 모듈 레벨에 두는 편이 인자로 끌고 다니는 것보다 낫다
// (assets.ts의 모델 캐시와 같은 이유다).
let cityMaterials: any[] = [];

export const setCityMaterials = (materials: any[]): void => {
    cityMaterials = materials;
};

/**
 * 도시를 향한 레이캐스트. 반드시 이걸 거쳐야 한다 —
 * raycaster.intersectObject를 직접 부르면 뒷면을 놓친다.
 *
 * 렌더링은 FrontSide(뒷면을 컬링해 프래그먼트 작업을 덜어낸다)인데, 충돌 판정은
 * DoubleSide여야 한다. 이 모델의 바닥·천장은 감긴 방향이 제각각이고
 * (ground-repair.ts가 존재하는 이유가 바로 그것이다) 앞면만 보면 바닥을 통과해 떨어진다.
 *
 * 그래서 판정하는 순간에만 양면으로 젖혔다 되돌린다. side는 셰이더 프로그램 캐시 키가
 * 아니라 그리는 시점의 GL 상태라, 렌더와 렌더 사이에 바꿔도 재컴파일이 일어나지 않는다 —
 * 재질 수십 개에 대한 속성 대입이 전부다.
 */
export const raycastCity = (raycaster: any, building: any): any[] => {
    for (let i = 0; i < cityMaterials.length; i++) cityMaterials[i].side = THREE.DoubleSide;
    try {
        return raycaster.intersectObject(building, true);
    } finally {
        for (let i = 0; i < cityMaterials.length; i++) cityMaterials[i].side = THREE.FrontSide;
    }
};
