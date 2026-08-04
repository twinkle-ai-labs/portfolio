import * as THREE from 'three';

// 이 프로젝트의 GLTFLoader 타입 선언은 namespace로 잡혀 타입 위치에 쓸 수 없어
// 로더 인스턴스는 구조적으로만 받는다 (load 시그니처만 있으면 됨)
type LoaderLike = { load: (url: string, onLoad: (gltf: any) => void, onProgress?: (e: ProgressEvent) => void, onError?: (e: any) => void) => void };

// Enable Three.js loader-level resource caching
THREE.Cache.enabled = true;

// Module-level cache to persist loaded 3D models across React component remounts.
// These hold the in-flight *promise*, not just the finished scene: React runs the space effect
// more than once (StrictMode double-invokes it in development, and any remount re-runs it),
// and two GLTFLoader parses of the same URL racing each other fight over THREE.Cache — the loser
// ends up with textures whose image data never arrives. That is what silently blacked out the
// night sky: the losing parse won the cache slot, so every later mount cloned a textureless dome.
// Caching the promise means every mount shares one single parse.
let skyScenePromise: Promise<any> | null = null;
let cityScenePromise: Promise<any> | null = null;

// 로딩 진행률 콜백은 최초 로드에만 붙는다 — 이후 마운트는 캐시된 프로미스를 그대로 받으므로
// 즉시 resolve되고, 호출부의 .then에서 progress를 1로 마감 처리한다.
export const loadSkyScene = (loader: LoaderLike, onProgress: (xhr: ProgressEvent) => void): Promise<any> => {
    if (!skyScenePromise) {
        skyScenePromise = new Promise((resolve, reject) => {
            loader.load('/models/night_sky/scene.gltf', (gltf: any) => resolve(gltf.scene), onProgress, reject);
        });
    }
    return skyScenePromise;
};

export const loadCityScene = (loader: LoaderLike, onProgress: (xhr: ProgressEvent) => void): Promise<any> => {
    if (!cityScenePromise) {
        cityScenePromise = new Promise((resolve, reject) => {
            loader.load('/models/future_city.glb', (gltf: any) => resolve(gltf.scene), onProgress, reject);
        });
    }
    return cityScenePromise;
};
