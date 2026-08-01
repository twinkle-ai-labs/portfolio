import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import galaxyImage from '@Images/galaxy.png';

interface IThreeSpaceProps {
    onLoaded?: () => void
}

const createAstronaut = () => {
    const astronaut = new THREE.Group();
    astronaut.name = 'walking-astronaut';

    const rig = new THREE.Group();
    rig.name = 'astronaut-rig';
    astronaut.add(rig);

    const suit = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.42,
        metalness: 0.08,
    });
    const visor = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.18,
        metalness: 0.8,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.18,
    });
    const accent = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        roughness: 0.35,
        metalness: 0.25,
        emissive: 0x312e81,
        emissiveIntensity: 0.25,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.35), suit);
    body.position.y = 1.35;
    rig.add(body);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.78, 0.2), accent);
    backpack.position.set(0, 1.36, 0.29);
    rig.add(backpack);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), suit);
    helmet.position.y = 2.16;
    rig.add(helmet);

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 16), visor);
    face.scale.set(1.12, 0.62, 0.28);
    face.position.set(0, 2.18, -0.31);
    rig.add(face);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.4), accent);
    belt.position.y = 0.82;
    rig.add(belt);

    const limbs = {
        leftArm: new THREE.Group(),
        rightArm: new THREE.Group(),
        leftLeg: new THREE.Group(),
        rightLeg: new THREE.Group(),
    };

    const makeLimb = (height: number, radius: number) => {
        const limb = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), suit);
        limb.position.y = -height / 2;
        return limb;
    };

    limbs.leftArm.position.set(-0.5, 1.75, 0);
    limbs.rightArm.position.set(0.5, 1.75, 0);
    limbs.leftLeg.position.set(-0.22, 0.78, 0);
    limbs.rightLeg.position.set(0.22, 0.78, 0);

    limbs.leftArm.add(makeLimb(0.78, 0.09));
    limbs.rightArm.add(makeLimb(0.78, 0.09));
    limbs.leftLeg.add(makeLimb(0.82, 0.12));
    limbs.rightLeg.add(makeLimb(0.82, 0.12));

    Object.values(limbs).forEach(limb => rig.add(limb));
    astronaut.userData.limbs = limbs;
    astronaut.userData.rig = rig;

    const glow = new THREE.PointLight(0xa5b4fc, 1.4, 5);
    glow.position.set(0, 1.7, -0.6);
    rig.add(glow);

    astronaut.scale.setScalar(0.95);
    return astronaut;
};

const createBox = (
    name: string,
    size: [number, number, number],
    position: [number, number, number],
    color: number,
    options: {roughness?: number; metalness?: number; emissive?: number; emissiveIntensity?: number} = {}
) => {
    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: options.roughness ?? 0.72,
        metalness: options.metalness ?? 0.05,
        emissive: options.emissive ?? 0x000000,
        emissiveIntensity: options.emissiveIntensity ?? 0,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    return mesh;
};

const createCylinder = (
    name: string,
    radius: number,
    height: number,
    position: [number, number, number],
    color: number
) => {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, 24),
        new THREE.MeshStandardMaterial({color, roughness: 0.76, metalness: 0.04})
    );
    mesh.name = name;
    mesh.position.set(...position);
    return mesh;
};

const createCozyRoom = (scene: any) => {
    const room = new THREE.Group();
    room.name = 'cozy-room';

    const floor = createBox('wood-floor', [18, 0.16, 14], [0, -0.08, 0], 0x7c4a2d);
    room.add(floor);

    const backWall = createBox('back-wall', [18, 6.2, 0.18], [0, 3.02, 6.9], 0x22314d);
    const leftWall = createBox('left-wall', [0.18, 6.2, 14], [-9, 3.02, 0], 0x1b2740);
    room.add(backWall, leftWall);

    const rug = createBox('soft-rug', [6.3, 0.08, 4.2], [0.1, 0.02, -0.4], 0x818cf8, {
        roughness: 0.95,
        emissive: 0x312e81,
        emissiveIntensity: 0.08,
    });
    room.add(rug);

    const bedBase = createBox('bed-base', [4.6, 0.6, 3.1], [-5.3, 0.3, 2.6], 0x334155);
    const mattress = createBox('mattress', [4.35, 0.35, 2.85], [-5.3, 0.82, 2.6], 0xf8fafc);
    const blanket = createBox('blanket', [3.1, 0.22, 2.85], [-4.65, 1.12, 2.6], 0xa78bfa, {
        roughness: 0.9,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.08,
    });
    const pillowA = createBox('pillow-a', [1.1, 0.28, 0.82], [-6.45, 1.22, 1.72], 0xe0f2fe);
    const pillowB = createBox('pillow-b', [1.1, 0.28, 0.82], [-6.45, 1.22, 2.77], 0xfce7f3);
    room.add(bedBase, mattress, blanket, pillowA, pillowB);

    const desk = createBox('desk-top', [4.2, 0.22, 1.45], [4.3, 1.18, 4.95], 0x8b5a3c);
    const deskLegs = [
        createBox('desk-leg-1', [0.16, 1.1, 0.16], [2.38, 0.56, 4.35], 0x4b5563),
        createBox('desk-leg-2', [0.16, 1.1, 0.16], [6.22, 0.56, 4.35], 0x4b5563),
        createBox('desk-leg-3', [0.16, 1.1, 0.16], [2.38, 0.56, 5.55], 0x4b5563),
        createBox('desk-leg-4', [0.16, 1.1, 0.16], [6.22, 0.56, 5.55], 0x4b5563),
    ];
    const monitor = createBox('monitor', [1.65, 1, 0.12], [4.2, 1.92, 4.26], 0x0f172a, {
        metalness: 0.25,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.2,
    });
    const monitorStand = createBox('monitor-stand', [0.22, 0.45, 0.18], [4.2, 1.44, 4.35], 0x0f172a);
    const keyboard = createBox('keyboard', [1.45, 0.07, 0.36], [4.2, 1.34, 5.04], 0x111827);
    room.add(desk, monitor, monitorStand, keyboard, ...deskLegs);

    const chairSeat = createBox('chair-seat', [1.1, 0.22, 1.05], [4.35, 0.72, 2.95], 0xf97316);
    const chairBack = createBox('chair-back', [1.1, 1.2, 0.2], [4.35, 1.35, 2.45], 0xea580c);
    const chairLeg = createCylinder('chair-leg', 0.1, 0.72, [4.35, 0.36, 2.95], 0x334155);
    room.add(chairSeat, chairBack, chairLeg);

    const shelf = createBox('wall-shelf', [4.2, 0.18, 0.55], [-2.1, 3.95, 6.72], 0x8b5a3c);
    const books = [
        createBox('book-1', [0.24, 0.7, 0.34], [-3.72, 4.38, 6.4], 0xf43f5e),
        createBox('book-2', [0.24, 0.62, 0.34], [-3.4, 4.34, 6.4], 0x22c55e),
        createBox('book-3', [0.24, 0.82, 0.34], [-3.08, 4.44, 6.4], 0x38bdf8),
        createBox('book-4', [0.24, 0.58, 0.34], [-2.76, 4.32, 6.4], 0xfacc15),
    ];
    room.add(shelf, ...books);

    const windowFrame = createBox('window-frame', [3.4, 2.35, 0.14], [3.4, 3.48, 6.78], 0xe2e8f0);
    const windowGlass = createBox('window-glass', [3.08, 2.02, 0.08], [3.4, 3.48, 6.65], 0x1e3a8a, {
        metalness: 0.2,
        emissive: 0x2563eb,
        emissiveIntensity: 0.28,
    });
    const curtainLeft = createBox('curtain-left', [0.28, 2.65, 0.12], [1.55, 3.38, 6.55], 0xc084fc, {
        roughness: 0.92,
    });
    const curtainRight = createBox('curtain-right', [0.28, 2.65, 0.12], [5.25, 3.38, 6.55], 0xc084fc, {
        roughness: 0.92,
    });
    room.add(windowFrame, windowGlass, curtainLeft, curtainRight);

    const plantPot = createCylinder('plant-pot', 0.36, 0.58, [-7.4, 0.3, -3.85], 0xf97316);
    const plantLeaves = [
        createBox('leaf-1', [0.18, 1.2, 0.18], [-7.6, 1.04, -3.82], 0x22c55e),
        createBox('leaf-2', [0.18, 1.05, 0.18], [-7.22, 1, -3.9], 0x16a34a),
        createBox('leaf-3', [0.18, 0.9, 0.18], [-7.4, 0.96, -3.55], 0x4ade80),
    ];
    plantLeaves[0].rotation.z = 0.42;
    plantLeaves[1].rotation.z = -0.36;
    plantLeaves[2].rotation.x = 0.32;
    room.add(plantPot, ...plantLeaves);

    const floorLampPole = createCylinder('floor-lamp-pole', 0.055, 2.8, [7.2, 1.4, -4.6], 0xeab308);
    const floorLampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.62, 0.75, 28),
        new THREE.MeshStandardMaterial({
            color: 0xfef3c7,
            roughness: 0.58,
            emissive: 0xfacc15,
            emissiveIntensity: 0.55,
        })
    );
    floorLampShade.name = 'floor-lamp-shade';
    floorLampShade.position.set(7.2, 2.96, -4.6);
    floorLampShade.rotation.x = Math.PI;
    const floorLampLight = new THREE.PointLight(0xffd166, 2.2, 9);
    floorLampLight.position.set(7.2, 2.55, -4.6);
    room.add(floorLampPole, floorLampShade, floorLampLight);

    const lights = new THREE.Group();
    lights.name = 'string-lights';
    for (let index = 0; index < 9; index += 1) {
        const x = -6.4 + index * 1.25;
        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 16, 12),
            new THREE.MeshStandardMaterial({
                color: 0xfef3c7,
                emissive: index % 2 === 0 ? 0xf59e0b : 0x38bdf8,
                emissiveIntensity: 0.85,
            })
        );
        bulb.name = `string-light-${index}`;
        bulb.position.set(x, 5.45 + Math.sin(index * 0.9) * 0.16, 6.62);
        lights.add(bulb);
    }
    room.add(lights);

    const frames = [
        createBox('poster-1', [1.15, 1.4, 0.08], [-6.8, 3.35, 6.58], 0xf9a8d4, {
            emissive: 0x831843,
            emissiveIntensity: 0.08,
        }),
        createBox('poster-2', [1.15, 1.4, 0.08], [-5.28, 3.35, 6.58], 0x93c5fd, {
            emissive: 0x1e3a8a,
            emissiveIntensity: 0.08,
        }),
    ];
    room.add(...frames);

    scene.add(room);
    return room;
};

const ThreeSpace = ({onLoaded}: IThreeSpaceProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 220);
        camera.position.set(0, 5.8, 12);

        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x111827, 1);
        container.appendChild(renderer.domElement);
        renderer.domElement.className = 'babylon-canvas babylon-loaded';

        scene.add(new THREE.AmbientLight(0xfff1e6, 0.72));

        const moonLight = new THREE.DirectionalLight(0xffffff, 2.2);
        moonLight.position.set(4, 9, -5);
        scene.add(moonLight);

        const starGeometry = new THREE.BufferGeometry();
        const starPositions = [];
        for (let index = 0; index < 1400; index += 1) {
            const radius = 45 + Math.random() * 90;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            starPositions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(
            starGeometry,
            new THREE.PointsMaterial({color: 0xffffff, size: 0.08, transparent: true, opacity: 0.92})
        );
        scene.add(stars);

        const galaxyTexture = new THREE.TextureLoader().load(galaxyImage);
        const galaxy = new THREE.Mesh(
            new THREE.PlaneGeometry(42, 24),
            new THREE.MeshBasicMaterial({
                map: galaxyTexture,
                transparent: true,
                opacity: 0.5,
                depthWrite: false,
            })
        );
        galaxy.position.set(3.4, 3.48, 6.48);
        galaxy.scale.set(0.15, 0.15, 0.15);
        galaxy.rotation.y = Math.PI;
        scene.add(galaxy);

        createCozyRoom(scene);

        const orbit = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(
                Array.from({length: 160}, (_, index) => {
                    const angle = (index / 160) * Math.PI * 2;
                    return new THREE.Vector3(Math.cos(angle) * 4.2, 0.025, Math.sin(angle) * 2.75 - 0.2);
                })
            ),
            new THREE.LineBasicMaterial({color: 0x818cf8, transparent: true, opacity: 0.38})
        );
        scene.add(orbit);

        const astronaut = createAstronaut();
        scene.add(astronaut);

        const clock = new THREE.Clock();
        const characterLoader = new GLTFLoader();
        let characterMixer: any = null;
        let characterModel: any = null;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const targetPosition = new THREE.Vector3(0, 0, 0);
        const hitPosition = new THREE.Vector3();
        let animationFrame = 0;
        let loaded = false;

        characterLoader.load(
            '/models/character/esper.glb',
            (gltf: any) => {
                characterModel = gltf.scene;
                characterModel.name = 'esper-character';
                characterModel.scale.setScalar(1.15);
                characterModel.rotation.y = Math.PI;
                characterModel.position.y = 0;
                astronaut.userData.rig.visible = false;
                astronaut.add(characterModel);

                characterModel.traverse((object: any) => {
                    if (object.isMesh) {
                        object.castShadow = false;
                        object.receiveShadow = false;
                    }
                });

                if (gltf.animations.length > 0) {
                    characterMixer = new THREE.AnimationMixer(characterModel);
                    const clip = gltf.animations.find((animation: any) => /walk|run/i.test(animation.name)) || gltf.animations[0];
                    characterMixer.clipAction(clip).play();
                }
            },
            undefined,
            (error: any) => {
                console.warn('Failed to load character GLB. Falling back to procedural character.', error);
            }
        );

        const setTargetFromPointer = (event: PointerEvent) => {
            const bounds = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.ray.intersectPlane(groundPlane, hitPosition);
            if (!hit) return;

            targetPosition.copy(hit);
            targetPosition.y = 0;

            targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -8.1, 8.1);
            targetPosition.z = THREE.MathUtils.clamp(targetPosition.z, -6.1, 5.9);
        };

        const resize = () => {
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        const render = () => {
            const delta = clock.getDelta();
            const elapsed = clock.elapsedTime;
            const direction = targetPosition.clone().sub(astronaut.position);
            direction.y = 0;
            const distance = direction.length();
            const isWalking = distance > 0.08;

            if (isWalking) {
                const nextStep = direction.normalize().multiplyScalar(Math.min(distance, delta * 4.2));
                astronaut.position.add(nextStep);
                astronaut.position.y = 0;
                astronaut.rotation.set(0, Math.atan2(-nextStep.x, -nextStep.z), 0);
            }

            const limbs = astronaut.userData.limbs;
            const rig = astronaut.userData.rig;
            const stride = isWalking ? Math.sin(elapsed * 7.2) * 0.55 : Math.sin(elapsed * 1.4) * 0.08;
            if (characterMixer) {
                characterMixer.update(isWalking ? delta : delta * 0.18);
            }
            limbs.leftArm.rotation.x = stride;
            limbs.rightArm.rotation.x = -stride;
            limbs.leftLeg.rotation.x = -stride;
            limbs.rightLeg.rotation.x = stride;
            astronaut.position.y = 0;
            rig.position.y = isWalking ? Math.abs(Math.sin(elapsed * 7.2)) * 0.08 : Math.sin(elapsed * 1.2) * 0.03;
            rig.rotation.set(0, 0, Math.sin(elapsed * (isWalking ? 2.4 : 1.2)) * (isWalking ? 0.04 : 0.02));
            if (characterModel) {
                characterModel.position.y = isWalking ? Math.abs(Math.sin(elapsed * 7.2)) * 0.04 : Math.sin(elapsed * 1.2) * 0.015;
            }

            stars.rotation.y = elapsed * 0.012;
            stars.rotation.x = elapsed * 0.004;
            galaxy.rotation.z = Math.sin(elapsed * 0.08) * 0.08;

            camera.position.x = Math.sin(elapsed * 0.08) * 1.3;
            camera.lookAt(astronaut.position.x * 0.18, 1.2, astronaut.position.z * 0.18);

            renderer.render(scene, camera);

            if (!loaded) {
                loaded = true;
                onLoaded?.();
            }

            animationFrame = window.requestAnimationFrame(render);
        };

        resize();
        renderer.domElement.style.cursor = 'crosshair';
        renderer.domElement.style.touchAction = 'none';
        renderer.domElement.addEventListener('pointermove', setTargetFromPointer);
        renderer.domElement.addEventListener('pointerdown', setTargetFromPointer);
        render();
        window.addEventListener('resize', resize);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
            renderer.domElement.removeEventListener('pointermove', setTargetFromPointer);
            renderer.domElement.removeEventListener('pointerdown', setTargetFromPointer);
            container.removeChild(renderer.domElement);
            scene.traverse((object: any) => {
                const mesh = object as any;
                mesh.geometry?.dispose?.();
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material: any) => material.dispose?.());
                } else {
                    mesh.material?.dispose?.();
                }
            });
            galaxyTexture.dispose();
            renderer.dispose();
        };
    }, [onLoaded]);

    return <div ref={containerRef} className="babylon-canvas"/>;
};

export default ThreeSpace;
