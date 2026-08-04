import * as THREE from 'three';

// Night Sky GLTF environment with critical fog & culling bugfixes.
// 씬에 돔을 추가하고, 하늘을 environment map으로 구워 금속 재질에 성운이 비치게 한다.
export const setupSky = (
    scene: InstanceType<typeof THREE.Scene>,
    renderer: InstanceType<typeof THREE.WebGLRenderer>,
    sky: any
): void => {
    // Scale up sky dome safely within the camera's far clipping plane (500 units radius)
    sky.scale.setScalar(500);
    sky.position.set(0, 0, 0);

    sky.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;

            // Support both single materials and multi-material arrays safely
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material: any) => {
                if (material) {
                    // FIX 1: Prevent black fog from obscuring the distant sky dome
                    material.fog = false;
                    material.depthWrite = false;

                    // FIX 2: Enable double-sided rendering so the dome faces are visible from the inside
                    material.side = THREE.DoubleSide;

                    // FIX 3: Boost emissive brightness so the nebula and stars glow vibrantly in modern light units
                    if (material.emissive) {
                        if (material.emissive.getHex() === 0) {
                            material.emissive.setHex(0xffffff); // Force glowing if it was black
                        }
                        material.emissiveIntensity = 3.5; // High brightness boost
                    }
                }
            });
        }
    });
    scene.add(sky);

    // Generate environment map from the loaded sky so metallic parts look gorgeous with reflections of the nebula/stars!
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    try {
        const envMap = pmremGenerator.fromScene(sky).texture;
        scene.environment = envMap;
    } catch (e) {
        console.warn('Could not generate environment map from sky scene:', e);
    } finally {
        pmremGenerator.dispose(); // clean up resources of the generator itself
    }
};
