import * as THREE from 'three';
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from 'three-mesh-bvh';

// three-mesh-bvh를 three에 붙인다 — 이 모듈을 한 번 import하면 그 뒤의 모든 레이캐스트가
// BVH를 탄다 (트리가 만들어진 지오메트리에 한해서. 없으면 원래대로 선형 탐색).
//
// 왜 필요한가: 도시 모델은 삼각형이 128만 개고, 캐릭터는 매 프레임 지면과 벽을 향해
// 레이를 쏜다. 트리 없이는 한 번 쏠 때마다 삼각형을 전부 훑어서 실측 4.3ms가 나왔다 —
// 60fps 예산 16.7ms의 4분의 1을 레이캐스트 하나가 먹는다.
//
// 프로토타입을 건드리는 건 three-mesh-bvh가 안내하는 표준 사용법이다. 부작용이 있는
// import라 파일을 따로 뒀다 — city.ts 한가운데 숨어 있으면 character.ts가 무엇 덕분에
// 빨라졌는지 읽어낼 수 없다.
(THREE.BufferGeometry.prototype as any).computeBoundsTree = computeBoundsTree;
(THREE.BufferGeometry.prototype as any).disposeBoundsTree = disposeBoundsTree;
(THREE.Mesh.prototype as any).raycast = acceleratedRaycast;
