import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import {createInitialKeys} from './types';
import {loadCityScene, loadSkyScene} from './assets';
import {setupSky} from './sky';
import {createStarfield} from './starfield';
import {createAstronaut} from './astronaut';
import {prepareCity} from './city';
import {createFireflies} from './fireflies';
import {createEntranceBeacons, detectEntrances} from './entrances';
import {createCharacterController} from './character';
import {createCameraRig} from './camera-rig';
import {attachKeyboard} from './keyboard';
import SpaceHud from './hud';

interface IThreeSpaceProps {
    onLoaded?: () => void
    onProgress?: (percent: number) => void
}

// Space 페이지의 3D 월드 오케스트레이터.
// 씬/렌더러/라이트를 세우고, ./three 모듈들(하늘·별·도시·캐릭터·반딧불이·카메라·HUD)을
// 조립한 뒤 하나의 render 루프에서 각 모듈의 update만 호출한다.
const ThreeSpace = ({onLoaded, onProgress}: IThreeSpaceProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const keysRef = useRef(createInitialKeys());

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a1a, 0.012);
        scene.background = new THREE.Color(0x050510);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 20000);
        camera.position.set(0, 4, -10);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap; // Optimized PCF shadow mapping (fast hardware-filtered edges)
        // 그림자 맵을 매 프레임 다시 굽지 않는다. 도시(삼각형 128만 개)와 태양은 붙박이라
        // 그림자가 달라질 일이 없고, 움직이는 건 우주비행사 하나뿐이다. 아래 render 루프가
        // 몇 프레임에 한 번만 needsUpdate를 세운다.
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = true; // 첫 굽기

        // Enable modern Three.js sRGB color space output and cinema tone mapping
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35; // boost bright, rich colors in dark space

        container.appendChild(renderer.domElement);
        renderer.domElement.className = 'three-canvas three-loaded';

        // Lights
        const ambientLight = new THREE.AmbientLight(0x222244, 0.8);
        scene.add(ambientLight);

        // Hemispheric light for beautiful sky-to-ground gradients
        const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x111827, 0.8);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
        dirLight.position.set(40, 80, 30);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 80;
        dirLight.shadow.camera.bottom = -80;
        dirLight.shadow.camera.left = -80;
        dirLight.shadow.camera.right = 80;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 300;
        dirLight.shadow.mapSize.width = 1024; // Optimized from 2048 to 1024 for 4x faster shadow rendering
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.bias = -0.0005;
        scene.add(dirLight);

        // No flat ground or grid plane so that the building acts as a floating island in space!
        // To prevent the starry sky from showing through tiny gaps/cracks between floor tiles,
        // we add a solid dark backing plane slightly below the building (Y = -0.1).
        // Since the playable area has a max radius of 58.0 and the building max dimension is 120.0 (radius 60.0),
        // we use a circle of radius 60.0 so it never extends beyond the building boundaries or blocks stars outside.
        const backingGeom = new THREE.CircleGeometry(60, 32);
        backingGeom.rotateX(-Math.PI / 2);
        const backingMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000, // pitch black for natural shadow crevices
            side: THREE.DoubleSide
        });
        const backingMesh = new THREE.Mesh(backingGeom, backingMaterial);
        backingMesh.position.set(0, -0.1, 0);
        scene.add(backingMesh);

        const clock = new THREE.Clock();
        const loader = new GLTFLoader();

        // Real per-asset loading progress (sky dome, city) averaged into one 0-100 figure for the loading screen
        const assetProgress = {sky: 0, building: 0}; // the character itself is procedural — no download to track
        let assetsReady = false;      // every tracked asset has finished (or errored out) and been added to the scene
        let loadedDispatched = false; // onLoaded fired exactly once
        let framesSinceReady = 0;

        const reportProgress = () => {
            const values = Object.values(assetProgress);
            const overall = values.reduce((a, b) => a + b, 0) / values.length;
            onProgress?.(Math.min(100, Math.max(0, Math.round(overall * 100))));
            if (values.every((v) => v >= 1)) {
                assetsReady = true;
            }
        };
        const trackProgress = (key: keyof typeof assetProgress) => (xhr: ProgressEvent) => {
            if (xhr.lengthComputable) {
                // 다운로드 중에는 1에 닿지 못하게 묶는다. '다 됐다'는 도장은 아래 .then/.catch만
                // 찍을 수 있어야 한다 — 그래야 assetsReady가 '씬에 들어갔다'를 뜻한다.
                //
                // 묶지 않으면 이 값이 1을 훌쩍 넘는다. 서버가 모델을 압축해 보내면서
                // (dev 서버는 br, GitHub Pages는 gzip) 브라우저는 total에 압축된 크기를,
                // loaded에는 풀린 바이트를 담는다. 55MB짜리 정점 데이터는 4배 넘게 줄어드니
                // 비율이 4를 넘고, 그래서 로딩 화면에 400%가 찍혔다.
                //
                // 게다가 그 순간 every(v >= 1)이 참이 되어 도시가 씬에 들어가기도 전에
                // 로딩 화면이 걷혔다 — 바닥 없는 검은 허공에 캐릭터만 떠 있는 그 화면이다.
                assetProgress[key] = Math.min(xhr.loaded / xhr.total, 0.99);
                reportProgress();
            }
        };

        // --- Night sky dome + starfield -------------------------------------------------------
        loadSkyScene(loader, trackProgress('sky'))
            .then((skyScene: any) => {
                setupSky(scene, renderer, skyScene.clone());
                // Mark complete only now that the dome is actually in the scene
                assetProgress.sky = 1;
                reportProgress();
            })
            .catch((err: any) => {
                console.error('Error loading night sky GLTF model:', err);
                assetProgress.sky = 1; // don't let a failed asset stall the loading screen forever
                reportProgress();
            });

        const starfield = createStarfield(scene);

        // --- Astronaut + controller -----------------------------------------------------------
        // The astronaut is generated procedurally in code — instantly available, nothing to download.
        // Its boots sit exactly at local y = 0, so physics can drive the root position directly.
        const astronaut = createAstronaut();
        scene.add(astronaut.mesh);
        const characterController = createCharacterController(astronaut, keysRef.current);

        // --- Fireflies (앵커 높이는 도시 로드 후 실제 바닥으로 스냅) ----------------------------
        const fireflies = createFireflies(scene);

        // --- Future City ------------------------------------------------------------------------
        let buildingGroup: any | null = null;
        let entranceBeacons: ReturnType<typeof createEntranceBeacons> | null = null;

        loadCityScene(loader, trackProgress('building'))
            .then((cityScene: any) => {
                const {building, spawnHeight, sampleGroundY} = prepareCity(cityScene.clone());
                buildingGroup = building;

                // Place the character perfectly on top of the detected surface immediately
                characterController.respawnAt(spawnHeight);
                fireflies.settleOnGround(sampleGroundY);

                const entranceSpots = detectEntrances(building, spawnHeight);
                entranceBeacons = createEntranceBeacons(scene, entranceSpots);

                scene.add(building);

                // Mark complete only now that the city is actually in the scene
                assetProgress.building = 1;
                reportProgress();
            })
            .catch((error: any) => {
                console.warn('Error loading custom future_city.glb model:', error);
                assetProgress.building = 1;
                reportProgress();
            });

        // The loading screen normally waits for every asset to land AND a few frames to actually paint
        // (see the render loop). This is only a safety net: if a download stalls without ever firing
        // its load or error callback, don't strand the player behind the curtain forever.
        const loadTimer = setTimeout(() => {
            if (!loadedDispatched) {
                console.warn('Space assets still loading after 30s — revealing the scene anyway.');
                loadedDispatched = true;
                onLoaded?.();
            }
        }, 30000);

        // --- Inputs, resize, camera -------------------------------------------------------------
        const detachKeyboard = attachKeyboard(keysRef.current);
        const cameraRig = createCameraRig(camera, container);

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const width = entry.contentRect.width || container.clientWidth || window.innerWidth;
                const height = entry.contentRect.height || container.clientHeight || window.innerHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }
        });
        resizeObserver.observe(container);

        // --- Render loop ------------------------------------------------------------------------
        let animationFrame = 0;
        let frame = 0;

        const render = () => {
            // Clamp to guard against huge spikes (tab backgrounded/throttled, GC pause, heavy
            // synchronous GLTF parsing on load) — THREE.Vector3.lerp doesn't clamp its alpha,
            // so an unclamped delta can make camera/physics lerps overshoot wildly past their target.
            const delta = Math.min(clock.getDelta(), 0.1);
            const time = clock.getElapsedTime();

            starfield.update(time);
            fireflies.update(time);
            entranceBeacons?.update(time, astronaut.mesh.position);

            const {isWalking} = characterController.update(delta, time, buildingGroup);
            cameraRig.update(delta, astronaut.mesh, isWalking);

            // 우주비행사의 그림자만 따라오면 된다. 3프레임에 한 번이면 60fps에서 20Hz —
            // 최대 33ms 뒤처지는데 눈에 띄지 않고, 도시를 그림자 맵에 다시 그리는 일은
            // 3분의 1로 줄어든다.
            frame++;
            if (frame % 3 === 0) renderer.shadowMap.needsUpdate = true;

            renderer.render(scene, camera);

            // Only lift the loading screen once every asset is in the scene AND a few frames have
            // genuinely been painted — otherwise the curtain drops on a half-built world (the city
            // model in particular takes far longer to arrive than any fixed timer would guess).
            if (assetsReady && !loadedDispatched) {
                framesSinceReady++;
                if (framesSinceReady >= 3) {
                    loadedDispatched = true;
                    onLoaded?.();
                }
            }

            animationFrame = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            clearTimeout(loadTimer);
            window.cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            detachKeyboard();
            cameraRig.dispose();
            container.removeChild(renderer.domElement);

            scene.traverse((object: any) => {
                if (object.isMesh) {
                    object.geometry?.dispose?.();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat: any) => mat.dispose?.());
                    } else {
                        object.material?.dispose?.();
                    }
                }
            });
            starfield.dispose();
            fireflies.dispose();
            entranceBeacons?.dispose();
            renderer.dispose();
        };
    }, [onLoaded, onProgress]);

    return (
        <>
            <div ref={containerRef} className="three-canvas" />
            <SpaceHud keysRef={keysRef}/>
        </>
    );
};

export default ThreeSpace;
