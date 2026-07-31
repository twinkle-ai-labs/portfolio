import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import galaxyImage from '@Images/galaxy.png';

interface IThreeSpaceProps {
    onLoaded?: () => void
}

const createAstronaut = () => {
    const astronaut = new THREE.Group();
    astronaut.name = 'walking-astronaut';

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
    astronaut.add(body);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.78, 0.2), accent);
    backpack.position.set(0, 1.36, 0.29);
    astronaut.add(backpack);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), suit);
    helmet.position.y = 2.16;
    astronaut.add(helmet);

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 16), visor);
    face.scale.set(1.12, 0.62, 0.28);
    face.position.set(0, 2.18, -0.31);
    astronaut.add(face);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.4), accent);
    belt.position.y = 0.82;
    astronaut.add(belt);

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

    Object.values(limbs).forEach(limb => astronaut.add(limb));
    astronaut.userData.limbs = limbs;

    const glow = new THREE.PointLight(0xa5b4fc, 1.4, 5);
    glow.position.set(0, 1.7, -0.6);
    astronaut.add(glow);

    astronaut.scale.setScalar(0.95);
    return astronaut;
};

const ThreeSpace = ({onLoaded}: IThreeSpaceProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020617, 0.038);

        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 220);
        camera.position.set(0, 5.2, 12);

        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x020617, 1);
        container.appendChild(renderer.domElement);
        renderer.domElement.className = 'babylon-canvas babylon-loaded';

        scene.add(new THREE.AmbientLight(0x6d7cff, 0.6));

        const moonLight = new THREE.DirectionalLight(0xffffff, 2.2);
        moonLight.position.set(4, 9, 6);
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
        galaxy.position.set(0, 7, -22);
        scene.add(galaxy);

        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(18, 96),
            new THREE.MeshStandardMaterial({
                color: 0x111827,
                roughness: 0.86,
                metalness: 0.18,
                transparent: true,
                opacity: 0.32,
            })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.04;
        scene.add(ground);

        const orbit = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(
                Array.from({length: 160}, (_, index) => {
                    const angle = (index / 160) * Math.PI * 2;
                    return new THREE.Vector3(Math.cos(angle) * 6.5, 0.015, Math.sin(angle) * 6.5);
                })
            ),
            new THREE.LineBasicMaterial({color: 0x818cf8, transparent: true, opacity: 0.38})
        );
        scene.add(orbit);

        const astronaut = createAstronaut();
        scene.add(astronaut);

        const clock = new THREE.Clock();
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const targetPosition = new THREE.Vector3(0, 0, 0);
        const hitPosition = new THREE.Vector3();
        let animationFrame = 0;
        let loaded = false;

        const setTargetFromPointer = (event: PointerEvent) => {
            const bounds = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.ray.intersectPlane(groundPlane, hitPosition);
            if (!hit) return;

            targetPosition.copy(hit);
            targetPosition.y = 0;

            if (targetPosition.length() > 8.5) {
                targetPosition.normalize().multiplyScalar(8.5);
            }
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
                astronaut.lookAt(
                    astronaut.position.x + nextStep.x,
                    0,
                    astronaut.position.z + nextStep.z
                );
            }

            const limbs = astronaut.userData.limbs;
            const stride = isWalking ? Math.sin(elapsed * 7.2) * 0.55 : Math.sin(elapsed * 1.4) * 0.08;
            limbs.leftArm.rotation.x = stride;
            limbs.rightArm.rotation.x = -stride;
            limbs.leftLeg.rotation.x = -stride;
            limbs.rightLeg.rotation.x = stride;
            astronaut.position.y = isWalking ? Math.abs(Math.sin(elapsed * 7.2)) * 0.08 : Math.sin(elapsed * 1.2) * 0.03;
            astronaut.rotation.z = Math.sin(elapsed * (isWalking ? 2.4 : 1.2)) * (isWalking ? 0.04 : 0.02);

            stars.rotation.y = elapsed * 0.012;
            stars.rotation.x = elapsed * 0.004;
            galaxy.rotation.z = Math.sin(elapsed * 0.08) * 0.08;

            camera.position.x = Math.sin(elapsed * 0.08) * 2.2;
            camera.lookAt(astronaut.position.x * 0.28, 1.15, astronaut.position.z * 0.28);

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
