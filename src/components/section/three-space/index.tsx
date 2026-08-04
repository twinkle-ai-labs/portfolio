import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

interface IThreeSpaceProps {
    onLoaded?: () => void
    onProgress?: (percent: number) => void
}

interface IDPadKeys {
    up: string;
    left: string;
    right: string;
    down: string;
}

const DPAD_ARROWS: IDPadKeys = {up: '▲', left: '◀', right: '▶', down: '▼'};
const DPAD_WASD: IDPadKeys = {up: 'W', left: 'A', right: 'D', down: 'S'};

// Small directional-pad graphic: keys/icons laid out in their true up/left/right/down spatial
// arrangement (a plus/cross shape) instead of a flat row — used for both WASD and the arrow keys,
// since W/A/S/D sit in exactly the same cross shape on a real keyboard (W above, A/S/D below).
const DPad = ({keys = DPAD_ARROWS, size = 'sm'}: {keys?: IDPadKeys; size?: 'sm' | 'lg'}) => (
    <div className={`space-dpad space-dpad-${size}`}>
        <span className="space-dpad-cell space-dpad-up">{keys.up}</span>
        <span className="space-dpad-cell space-dpad-left">{keys.left}</span>
        <span className="space-dpad-cell space-dpad-center"/>
        <span className="space-dpad-cell space-dpad-right">{keys.right}</span>
        <span className="space-dpad-cell space-dpad-down">{keys.down}</span>
    </div>
);

const ThreeSpace = ({onLoaded, onProgress}: IThreeSpaceProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const keysRef = useRef({ 
        w: false, 
        a: false, 
        s: false, 
        d: false, 
        shift: false, 
        space: false,
        joystickX: 0,
        joystickY: 0
    });
    const joystickBaseRef = useRef<HTMLDivElement | null>(null);
    const joystickHandleRef = useRef<HTMLDivElement | null>(null);
    const arrowUpRef = useRef<HTMLDivElement | null>(null);
    const arrowDownRef = useRef<HTMLDivElement | null>(null);
    const arrowLeftRef = useRef<HTMLDivElement | null>(null);
    const arrowRightRef = useRef<HTMLDivElement | null>(null);

    // Light up a directional arrow around the joystick rim when pushed that way (see .space-joystick-arrow.active in style.css)
    const setArrowActive = (el: HTMLDivElement | null, active: boolean) => {
        el?.classList.toggle('active', active);
    };

    // Turn the joystick ring red-pink while in "run" mode (see .space-joystick-base.running in style.css)
    const setRunGlow = (running: boolean) => {
        joystickBaseRef.current?.classList.toggle('running', running);
    };

    const updateJoystickVisuals = () => {
        const keys = keysRef.current;
        setArrowActive(arrowUpRef.current, keys.w);
        setArrowActive(arrowDownRef.current, keys.s);
        setArrowActive(arrowLeftRef.current, keys.a);
        setArrowActive(arrowRightRef.current, keys.d);
        setRunGlow(keys.shift);
    };

    const handleJumpStart = () => {
        keysRef.current.space = true;
    };
    const handleJumpEnd = () => {
        keysRef.current.space = false;
    };

    // Track active joystick dragging state
    const joystickDragState = useRef({
        active: false,
        startX: 0,
        startY: 0
    });

    const handleJoystickStart = (e: React.PointerEvent<HTMLDivElement>) => {
        const base = joystickBaseRef.current;
        if (!base) return;

        // Start tracking
        const rect = base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        joystickDragState.current = {
            active: true,
            startX: centerX,
            startY: centerY
        };

        // Disable snap back transition during drag
        const handle = joystickHandleRef.current;
        if (handle) {
            handle.style.transition = 'none';
            handle.setPointerCapture(e.pointerId);
        }
    };

    const handleJoystickMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!joystickDragState.current.active) return;

        const base = joystickBaseRef.current;
        const handle = joystickHandleRef.current;
        if (!base || !handle) return;

        // Distance from start center
        let dx = e.clientX - joystickDragState.current.startX;
        let dy = e.clientY - joystickDragState.current.startY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = 40; // max drag radius in pixels

        // Clamp distance to circular bounds
        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        // Apply visual transform to the knob immediately in the DOM (buttery smooth 60fps!)
        handle.style.transform = `translate(${dx}px, ${dy}px)`;

        // Convert coordinates to key states
        const keys = keysRef.current;
        const deadzone = 8; // deadzone to prevent accidental movement

        if (distance > deadzone) {
            const amt = Math.min(distance / maxRadius, 1.0);
            const nx = dx / distance;
            const ny = dy / distance;

            // Set the analog inputs!
            keys.joystickX = nx * amt;
            keys.joystickY = ny * amt;

            // Thresholds for diagonal movement
            const angleThreshold = 0.38; // cos(approx 67 deg), allows nice diagonal combos

            // Vertical movement (Y is inverted in screens: up is negative, down is positive)
            keys.w = ny < -angleThreshold;
            keys.s = ny > angleThreshold;

            // Horizontal movement
            keys.a = nx < -angleThreshold;
            keys.d = nx > angleThreshold;

            // Run mode if dragged nearly to the maximum limit (e.g. distance > 32px)
            keys.shift = distance > 32;
        } else {
            // Inside deadzone -> stand still
            keys.joystickX = 0;
            keys.joystickY = 0;
            keys.w = false;
            keys.s = false;
            keys.a = false;
            keys.d = false;
            keys.shift = false;
        }

        updateJoystickVisuals();
    };

    const handleJoystickEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!joystickDragState.current.active) return;

        joystickDragState.current.active = false;

        // Reset visual handle knob position back to center with smooth snap-back transition
        const handle = joystickHandleRef.current;
        if (handle) {
            handle.style.transition = 'transform 0.15s ease-out';
            handle.style.transform = 'translate(0px, 0px)';
            handle.releasePointerCapture(e.pointerId);
        }

        // Reset key states
        const keys = keysRef.current;
        keys.joystickX = 0;
        keys.joystickY = 0;
        keys.w = false;
        keys.s = false;
        keys.a = false;
        keys.d = false;
        keys.shift = false;

        updateJoystickVisuals();
    };

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
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
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
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.bias = -0.0005;
        scene.add(dirLight);

        // No flat ground or grid plane so that the building acts as a floating island in space!

        const clock = new THREE.Clock();
        const loader = new GLTFLoader();
        const raycaster = new THREE.Raycaster();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        let sky: InstanceType<typeof THREE.Group> | null = null;

        // Real per-asset loading progress (sky dome, city) averaged into one 0-100 figure for the loading screen
        const assetProgress = {sky: 0, building: 0}; // the character itself is procedural — no download to track
        let assetsReady = false;      // every tracked asset has finished (or errored out) and been added to the scene
        let loadedDispatched = false; // onLoaded fired exactly once
        let framesSinceReady = 0;

        const reportProgress = () => {
            const values = Object.values(assetProgress);
            const overall = values.reduce((a, b) => a + b, 0) / values.length;
            onProgress?.(Math.round(overall * 100));
            if (values.every((v) => v >= 1)) {
                assetsReady = true;
            }
        };
        const trackProgress = (key: keyof typeof assetProgress) => (xhr: ProgressEvent) => {
            if (xhr.lengthComputable) {
                assetProgress[key] = xhr.loaded / xhr.total;
                reportProgress();
            }
        };

        // Load original Night Sky GLTF environment with critical fog & culling bugfixes
        loader.load('/models/night_sky/scene.gltf', (gltf: any) => {
            sky = gltf.scene;
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
            try {
                const envMap = pmremGenerator.fromScene(sky).texture;
                scene.environment = envMap;
                pmremGenerator.dispose(); // clean up resources of the generator itself
            } catch (e) {
                console.warn('Could not generate environment map from sky scene:', e);
            }

            // Mark complete only now that the dome is actually in the scene
            assetProgress.sky = 1;
            reportProgress();
        }, trackProgress('sky'), (err: any) => {
            console.error('Error loading night sky GLTF model:', err);
            assetProgress.sky = 1; // don't let a failed asset stall the loading screen forever
            reportProgress();
        });

        // 1. Procedural Twinkling Starfield Particle System
        const starCount = 3500;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const starSpeeds = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            // Distribute stars spherically at a distance of 400 - 900 units from the origin
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 400 + Math.random() * 500;

            const idx = i * 3;
            starPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
            starPositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
            starPositions[idx + 2] = r * Math.cos(phi);

            // Variety of star colors: white, ice-blue, and soft orange
            const colorRand = Math.random();
            if (colorRand > 0.85) {
                // Ice-Blue
                starColors[idx] = 0.75;
                starColors[idx + 1] = 0.9;
                starColors[idx + 2] = 1.0;
            } else if (colorRand > 0.7) {
                // Pale Yellow/Orange
                starColors[idx] = 1.0;
                starColors[idx + 1] = 0.9;
                starColors[idx + 2] = 0.75;
            } else {
                // Pure White
                starColors[idx] = 1.0;
                starColors[idx + 1] = 1.0;
                starColors[idx + 2] = 1.0;
            }

            starSpeeds[i] = 0.5 + Math.random() * 2.0; // Individual twinkling speed multiplier
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 1.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            sizeAttenuation: true
        });

        const starfield = new THREE.Points(starGeometry, starMaterial);
        scene.add(starfield);

        // 2. Procedural Space Astronaut Character Construction
        // Builds a cute chibi-style astronaut entirely in code — oversized helmet, chubby body,
        // pastel-pink accents, glowing eyes and blush marks inside the visor. A proper joint
        // hierarchy (shoulder → elbow, hip → knee) lets limbs genuinely bend while animating.
        // The soles of the boots sit exactly at y = 0, so physics can drive the root directly.
        const createAstronaut = () => {
            const root = new THREE.Group();
            // Animation bobs and leans this inner group, so the root's y stays owned purely by physics
            const body = new THREE.Group();
            root.add(body);

            const suitMaterial = new THREE.MeshStandardMaterial({
                color: 0xfdf2f8, // Milky white with the faintest pink blush
                roughness: 0.5,
                metalness: 0.08
            });

            const accentMaterial = new THREE.MeshStandardMaterial({
                color: 0xf472b6, // Candy pink plating
                roughness: 0.35,
                metalness: 0.35
            });

            const jointMaterial = new THREE.MeshStandardMaterial({
                color: 0xc4b5fd, // Soft lavender joints
                roughness: 0.7,
                metalness: 0.15
            });

            const visorGlassMaterial = new THREE.MeshStandardMaterial({
                color: 0x312e81, // Deep indigo glass
                roughness: 0.12,
                metalness: 0.85,
                emissive: 0x312e81,
                emissiveIntensity: 0.25
            });

            const eyeMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1.8
            });

            const blushMaterial = new THREE.MeshStandardMaterial({
                color: 0xfda4af, // Rosy cheeks
                emissive: 0xfb7185,
                emissiveIntensity: 0.55,
                roughness: 0.6
            });

            const glowPinkMaterial = new THREE.MeshStandardMaterial({
                color: 0xf9a8d4,
                emissive: 0xf472b6,
                emissiveIntensity: 2.2
            });

            const add = (
                parent: InstanceType<typeof THREE.Object3D>,
                geom: any,
                mat: any,
                x: number, y: number, z: number
            ) => {
                const mesh = new THREE.Mesh(geom, mat);
                mesh.position.set(x, y, z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                parent.add(mesh);
                return mesh;
            };

            // --- Torso: small round marshmallow body (chibi proportions: body < head) ---
            add(body, new THREE.CapsuleGeometry(0.26, 0.16, 6, 18), suitMaterial, 0, 0.82, 0);
            // Heart-light on the chest
            add(body, new THREE.SphereGeometry(0.05, 12, 12), glowPinkMaterial, 0, 0.88, 0.24);
            // Tiny belt line
            add(body, new THREE.CylinderGeometry(0.235, 0.235, 0.06, 18), accentMaterial, 0, 0.63, 0);

            // Rounded mini backpack with twin thrusters
            add(body, new THREE.CapsuleGeometry(0.16, 0.16, 6, 14), accentMaterial, 0, 0.86, -0.28);
            const thrusterGeom = new THREE.CylinderGeometry(0.05, 0.065, 0.10, 10);
            add(body, thrusterGeom, jointMaterial, -0.09, 0.66, -0.28);
            add(body, thrusterGeom, jointMaterial, 0.09, 0.66, -0.28);

            // --- Head: BIG bubble helmet ---
            add(body, new THREE.CylinderGeometry(0.13, 0.13, 0.07, 16), jointMaterial, 0, 1.06, 0); // neck ring
            add(body, new THREE.SphereGeometry(0.36, 24, 24), suitMaterial, 0, 1.40, 0);
            // Visor glass: a big friendly window across the face.
            // (three.js sphere phi=π/2 faces +Z, so start at π/2 − length/2 to center the window on the face)
            const visorPhiLength = Math.PI / 1.2;
            const visor = add(
                body,
                new THREE.SphereGeometry(0.37, 24, 20, Math.PI / 2 - visorPhiLength / 2, visorPhiLength, Math.PI / 4.2, Math.PI / 2.4),
                visorGlassMaterial,
                0, 1.40, 0
            );
            visor.castShadow = false;
            // Sparkly eyes (slightly oval) + tiny highlight dots
            const eyeGeom = new THREE.SphereGeometry(0.045, 12, 12);
            const leftEye = add(body, eyeGeom, eyeMaterial, -0.11, 1.43, 0.335);
            const rightEye = add(body, eyeGeom, eyeMaterial, 0.11, 1.43, 0.335);
            leftEye.scale.set(1, 1.5, 0.5);
            rightEye.scale.set(1, 1.5, 0.5);
            // Rosy blush cheeks just under the eyes
            const blushGeom = new THREE.SphereGeometry(0.035, 10, 10);
            const leftBlush = add(body, blushGeom, blushMaterial, -0.19, 1.33, 0.30);
            const rightBlush = add(body, blushGeom, blushMaterial, 0.19, 1.33, 0.30);
            leftBlush.scale.set(1.3, 0.8, 0.5);
            rightBlush.scale.set(1.3, 0.8, 0.5);
            // Side pods — like little space headphones
            add(body, new THREE.SphereGeometry(0.09, 12, 12), accentMaterial, -0.34, 1.40, 0);
            add(body, new THREE.SphereGeometry(0.09, 12, 12), accentMaterial, 0.34, 1.40, 0);
            // Bouncy antenna with a glowing pink bobble
            add(body, new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6), jointMaterial, 0, 1.82, 0);
            add(body, new THREE.SphereGeometry(0.05, 10, 10), glowPinkMaterial, 0, 1.91, 0);

            // --- Arms: stubby and huggable (shoulder pivot → elbow pivot → mitten) ---
            const createArm = (isLeft: boolean) => {
                const side = isLeft ? -1 : 1;

                const shoulder = new THREE.Group();
                shoulder.position.set(side * 0.30, 0.96, 0);
                body.add(shoulder);

                add(shoulder, new THREE.SphereGeometry(0.09, 12, 12), accentMaterial, 0, 0, 0);
                add(shoulder, new THREE.CapsuleGeometry(0.07, 0.10, 4, 10), suitMaterial, 0, -0.11, 0);

                const elbow = new THREE.Group();
                elbow.position.set(0, -0.22, 0);
                shoulder.add(elbow);

                add(elbow, new THREE.SphereGeometry(0.06, 10, 10), jointMaterial, 0, 0, 0);
                add(elbow, new THREE.CapsuleGeometry(0.065, 0.08, 4, 10), suitMaterial, 0, -0.09, 0);
                add(elbow, new THREE.SphereGeometry(0.085, 12, 12), accentMaterial, 0, -0.20, 0); // mitten

                return {shoulder, elbow};
            };

            const leftArm = createArm(true);
            const rightArm = createArm(false);

            // --- Legs: short and chubby (hip pivot → knee pivot → rounded bootie) ---
            const createLeg = (isLeft: boolean) => {
                const side = isLeft ? -1 : 1;

                const hip = new THREE.Group();
                hip.position.set(side * 0.13, 0.55, 0);
                body.add(hip);

                add(hip, new THREE.SphereGeometry(0.10, 12, 12), jointMaterial, 0, 0, 0);
                add(hip, new THREE.CapsuleGeometry(0.09, 0.10, 4, 10), suitMaterial, 0, -0.11, 0);

                const knee = new THREE.Group();
                knee.position.set(0, -0.24, 0);
                hip.add(knee);

                add(knee, new THREE.SphereGeometry(0.075, 10, 10), jointMaterial, 0, 0, 0);
                add(knee, new THREE.CapsuleGeometry(0.08, 0.08, 4, 10), suitMaterial, 0, -0.09, 0);
                const bootie = add(knee, new THREE.SphereGeometry(0.10, 14, 14), accentMaterial, 0, -0.24, 0.03);
                bootie.scale.set(1.1, 0.7, 1.4); // squished into a cute rounded shoe

                return {hip, knee};
            };

            const leftLeg = createLeg(true);
            const rightLeg = createLeg(false);

            // --- Jump exhaust: pink sparkle flames out of the mini backpack while airborne ---
            const flameGeom = new THREE.ConeGeometry(0.07, 0.28, 10);
            const flameMaterial = new THREE.MeshBasicMaterial({
                color: 0xf9a8d4,
                transparent: true,
                opacity: 0.85
            });
            const flames = [-0.09, 0.09].map((x) => {
                const flame = new THREE.Mesh(flameGeom, flameMaterial);
                flame.position.set(x, 0.50, -0.28);
                flame.rotation.x = Math.PI; // point downward
                flame.visible = false;
                body.add(flame);
                return flame;
            });

            return {
                mesh: root,
                body,
                leftArm,
                rightArm,
                leftLeg,
                rightLeg,
                flames
            };
        };

        let characterGroup: InstanceType<typeof THREE.Group> | null = null;
        let astronautParts: any = null;
        let characterBaseY = 0;
        let buildingGroup: InstanceType<typeof THREE.Group> | null = null;
        let verticalVelocity = 0;
        let spawnHeight = 0;
        let turnRate = 0; // current eased angular velocity (rad/s); ramps toward the target turn speed instead of snapping so direction changes feel smooth, not twitchy
        const entranceBeacons: Array<{ mesh: InstanceType<typeof THREE.Mesh>; seed: number; yBase: number }> = [];

        // The astronaut is generated procedurally in code — instantly available, nothing to download.
        // Its boots sit exactly at local y = 0, so physics can drive the root position directly.
        const astronaut = createAstronaut();
        characterGroup = astronaut.mesh;
        astronautParts = astronaut;
        characterBaseY = 0;
        characterGroup.position.set(0, spawnHeight || 0, 0);
        scene.add(characterGroup);

        // Shared geometry/material for the entrance beacons that mark walkable building interiors (see below)
        const beaconGeom = new THREE.SphereGeometry(0.32, 16, 16);
        const beaconMaterial = new THREE.MeshStandardMaterial({
            color: 0x67e8f9,
            emissive: 0x22d3ee,
            emissiveIntensity: 2.4,
            transparent: true,
            opacity: 0.9
        });

        // Load the custom Future City GLB building model
        loader.load('/models/future_city.glb', (gltf: any) => {
            const building = gltf.scene;
            buildingGroup = building;

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

            // Dynamically detect the exact floor height at (0, 0) by casting a test ray down
            const testRaycaster = new THREE.Raycaster();
            const testOrigin = new THREE.Vector3(0, 500, 0);
            const testDirection = new THREE.Vector3(0, -1, 0);
            testRaycaster.set(testOrigin, testDirection);
            
            const testIntersects = testRaycaster.intersectObject(building, true);
            let centerFloorY = 0;
            if (testIntersects.length > 0) {
                centerFloorY = testIntersects[0].point.y;
                console.log('Dynamically detected central floor height:', centerFloorY);
            }
            spawnHeight = centerFloorY;

            // If the character is already loaded, place them perfectly on top of this surface immediately!
            if (characterGroup) {
                characterGroup.position.set(0, spawnHeight, 0);
            }

            building.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Boost materials if needed, e.g., enabling emissive lighting for window glows
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach((material: any) => {
                        if (material) {
                            // Force DoubleSide so raycasting hits floors/ceilings from either side!
                            material.side = THREE.DoubleSide;
                            material.roughness = Math.max(material.roughness, 0.4);
                            if (material.emissive && material.emissive.getHex() !== 0) {
                                material.emissiveIntensity = Math.max(material.emissiveIntensity, 1.5);
                            }
                        }
                    });
                }
            });

            // Auto-detect walkable "doorway" gaps around each building's footprint by probing its
            // perimeter with rays — the same technique the movement collision code uses — instead of
            // trusting the model's node names (which turned out to collapse to one bogus shared
            // position for every building here). Wherever a probe travels much farther than its
            // neighbors before hitting the building, that's an opening in the wall. Each one gets a
            // warm interior light + a pulsing beacon so it's noticeable from outside.
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
                    const hits = probeRay.intersectObject(buildingGroup as any, true);
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

            entranceCandidates.forEach((spot) => {
                // Warm point light so the lobby actually reads as a lit room instead of a dark void
                const interiorLight = new THREE.PointLight(0xffd8a8, 8, 20, 2);
                interiorLight.position.set(spot.x, spot.y + 2.2, spot.z);
                scene.add(interiorLight);

                // Small glowing beacon hovering near the entrance — visible through the opening as a hint
                const beacon = new THREE.Mesh(beaconGeom, beaconMaterial);
                const yBase = spot.y + 1.6;
                beacon.position.set(spot.x, yBase, spot.z);
                scene.add(beacon);
                entranceBeacons.push({mesh: beacon, seed: Math.random() * 100, yBase});
            });

            scene.add(building);

            // Mark complete only now that the city is actually in the scene
            assetProgress.building = 1;
            reportProgress();
        }, trackProgress('building'), (error: any) => {
            console.warn('Error loading custom future_city.glb model:', error);
            assetProgress.building = 1;
            reportProgress();
        });

        // 3. Floating Glowing Cosmic Crystals (Creates dynamic movement depth)
        const crystalGroup = new THREE.Group();
        const crystalGeom = new THREE.OctahedronGeometry(0.8, 0);
        const crystalMaterial = new THREE.MeshStandardMaterial({
            color: 0x818cf8, // Indigo glows
            emissive: 0x312e81,
            emissiveIntensity: 0.6,
            roughness: 0.15,
            metalness: 0.9,
            flatShading: true
        });

        const crystals: Array<{ mesh: InstanceType<typeof THREE.Mesh>; seed: number; speed: number; yBase: number }> = [];

        for (let i = 0; i < 35; i++) {
            const crystal = new THREE.Mesh(crystalGeom, crystalMaterial);
            
            // Distribute crystals around the celestial plain (20 to 100 distance from center)
            const angle = Math.random() * Math.PI * 2;
            const radius = 25 + Math.random() * 85;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const yBase = 1.0 + Math.random() * 4.5; // floating heights

            crystal.position.set(x, yBase, z);

            // Randomize size scaling to feel procedural
            const scaleX = 0.4 + Math.random() * 0.8;
            const scaleY = 0.8 + Math.random() * 1.5; // taller crystals
            const scaleZ = 0.4 + Math.random() * 0.8;
            crystal.scale.set(scaleX, scaleY, scaleZ);

            crystal.castShadow = true;
            crystal.receiveShadow = true;

            crystalGroup.add(crystal);
            crystals.push({
                mesh: crystal,
                seed: Math.random() * 100,
                speed: 0.4 + Math.random() * 1.2,
                yBase
            });
        }
        scene.add(crystalGroup);

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

        // Keyboard inputs (robust mapping using e.code to bypass Korean IME / '한영 키' lock)
        const keys = keysRef.current;
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const code = e.code;

            if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
                keys.shift = true;
            }
            if (key === 'w' || code === 'KeyW' || code === 'ArrowUp') keys.w = true;
            if (key === 'a' || code === 'KeyA' || code === 'ArrowLeft') keys.a = true;
            if (key === 's' || code === 'KeyS' || code === 'ArrowDown') keys.s = true;
            if (key === 'd' || code === 'KeyD' || code === 'ArrowRight') keys.d = true;
            if (key === ' ' || code === 'Space') keys.space = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const code = e.code;

            if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
                keys.shift = false;
            }
            if (key === 'w' || code === 'KeyW' || code === 'ArrowUp') keys.w = false;
            if (key === 'a' || code === 'KeyA' || code === 'ArrowLeft') keys.a = false;
            if (key === 's' || code === 'KeyS' || code === 'ArrowDown') keys.s = false;
            if (key === 'd' || code === 'KeyD' || code === 'ArrowRight') keys.d = false;
            if (key === ' ' || code === 'Space') keys.space = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Resize handler using ResizeObserver
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

        let animationFrame = 0;

        const walkSpeed = 7;
        const runSpeed = 12;
        const rotationSpeed = 3.5;

        // Interactive Mouse Orbit & Zoom Camera States
        let orbitTheta = Math.PI;     // Horizontal orbital angle (rad) (Math.PI starts exactly at the front)
        let orbitPhi = 0.35;          // Vertical pitch angle (rad) above ground
        let zoomFactor = 1.0;         // Camera distance scaling factor

        let targetOrbitTheta = Math.PI; // Start looking directly at the front of the character!
        let targetOrbitPhi = 0.35;
        let targetZoomFactor = 1.0;

        let isPointerDown = false;
        let prevPointerX = 0;
        let prevPointerY = 0;

        const handlePointerDown = (e: PointerEvent) => {
            isPointerDown = true;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!isPointerDown) return;
            const deltaX = e.clientX - prevPointerX;
            const deltaY = e.clientY - prevPointerY;

            prevPointerX = e.clientX;
            prevPointerY = e.clientY;

            // Horizontal rotation sensitivity
            const horizontalSensitivity = 0.007;
            targetOrbitTheta -= deltaX * horizontalSensitivity;

            // Vertical pitch sensitivity, clamped to prevent going underground or fully top-down
            const verticalSensitivity = 0.006;
            targetOrbitPhi = Math.max(0.05, Math.min(targetOrbitPhi + deltaY * verticalSensitivity, Math.PI / 2.15));
        };

        const handlePointerUp = () => {
            isPointerDown = false;
        };

        const handleWheel = (e: WheelEvent) => {
            // Prevent scrolling the browser window when zooming
            e.preventDefault();
            const wheelSensitivity = 0.001;
            targetZoomFactor = Math.max(0.35, Math.min(targetZoomFactor + e.deltaY * wheelSensitivity, 3.0));
        };

        container.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        container.addEventListener('wheel', handleWheel, { passive: false });

        const render = () => {
            // Clamp to guard against huge spikes (tab backgrounded/throttled, GC pause, heavy
            // synchronous GLTF parsing on load) — THREE.Vector3.lerp doesn't clamp its alpha,
            // so an unclamped delta can make camera/physics lerps overshoot wildly past their target.
            const delta = Math.min(clock.getDelta(), 0.1);
            const time = clock.getElapsedTime();

            // 1. Twinkling Stars Animation (oscillate opacity in custom logic)
            if (starfield) {
                starfield.rotation.y = time * 0.005; // slowly rotate the cosmos
            }

            // 2. Animate Space Crystals (floating, rotating)
            crystals.forEach((crystal) => {
                crystal.mesh.rotation.y += delta * crystal.speed * 0.4;
                crystal.mesh.rotation.z += delta * crystal.speed * 0.2;
                crystal.mesh.position.y = crystal.yBase + Math.sin(time * crystal.speed + crystal.seed) * 0.35;
            });

            // 2b. Animate Entrance Beacons (gentle bob + pulse to draw the eye toward enterable buildings)
            entranceBeacons.forEach((beacon) => {
                beacon.mesh.position.y = beacon.yBase + Math.sin(time * 1.6 + beacon.seed) * 0.25;
                const pulse = 0.85 + Math.sin(time * 2.4 + beacon.seed) * 0.2;
                beacon.mesh.scale.setScalar(pulse);
            });

            // 3. Astronaut Controller & Procedural Rig Animation
            if (characterGroup) {
                let isWalking = false;

                // Calculate current elevation on top of buildings (acting as our floating island)
                let targetY = 0;
                let hasGround = false;
                if (buildingGroup) {
                    const rayOrigin = new THREE.Vector3(characterGroup.position.x, 200, characterGroup.position.z);
                    const rayDirection = new THREE.Vector3(0, -1, 0);
                    raycaster.set(rayOrigin, rayDirection);
                    
                    // Recursively intersect with the entire building group
                    const intersects = raycaster.intersectObject(buildingGroup, true);
                    if (intersects.length > 0) {
                        hasGround = true;
                        // Find the intersection that is closest to the character's current height,
                        // ignoring surfaces that are far above their torso (such as high ceilings/roofs)
                        let bestY = 0;
                        let minDiff = Infinity;
                        const charY = characterGroup.position.y;

                        for (let i = 0; i < intersects.length; i++) {
                            const intersectY = intersects[i].point.y;
                            // Consider any surface below or slightly above the character's current position (waist/chest height buffer of +1.5)
                            if (intersectY <= charY + 1.5) {
                                const diff = Math.abs(intersectY - charY);
                                if (diff < minDiff) {
                                    minDiff = diff;
                                    bestY = intersectY;
                                }
                            }
                        }
                        
                        if (minDiff !== Infinity) {
                            targetY = bestY;
                        } else {
                            // If all intersections are above (e.g. initial spawn), fall back to the closest overall
                            let closestY = 0;
                            let closestDiff = Infinity;
                            for (let i = 0; i < intersects.length; i++) {
                                const intersectY = intersects[i].point.y;
                                const diff = Math.abs(intersectY - charY);
                                if (diff < closestDiff) {
                                    closestDiff = diff;
                                    closestY = intersectY;
                                }
                            }
                            targetY = closestY;
                        }
                    }
                } else {
                    // If the building is still loading, pretend we have ground at y = 0
                    // so the character doesn't fall into the void before the island loads!
                    hasGround = true;
                    targetY = 0;
                }
                const currentBaseY = targetY + characterBaseY;
                const gravity = 28; // standard gravity acceleration (units/s^2)
                const jumpStrength = 10.5; // jumping initial velocity (units/s)
                let isGrounded = false;

                if (hasGround) {
                    const floorY = currentBaseY;
                    // If character is at or below the floor level, and we aren't rising (verticalVelocity <= 0)
                    if (characterGroup.position.y <= floorY + 0.05 && verticalVelocity <= 0) {
                        characterGroup.position.y = floorY;
                        verticalVelocity = 0;
                        isGrounded = true;
                    }
                }

                if (isGrounded) {
                    // Trigger jump!
                    if (keys.space) {
                        verticalVelocity = jumpStrength;
                        isGrounded = false;
                        keys.space = false; // consume jump trigger
                    }
                } else {
                    // We are in the air (either jumped, or walked off the island)
                    // Apply gravity
                    verticalVelocity -= gravity * delta;
                    characterGroup.position.y += verticalVelocity * delta;

                    // Check if we have landed back on the building floor while falling down
                    if (hasGround && verticalVelocity <= 0) {
                        const floorY = currentBaseY;
                        if (characterGroup.position.y <= floorY) {
                            characterGroup.position.y = floorY;
                            verticalVelocity = 0;
                            isGrounded = true;
                        }
                    }

                    // Fall trigger below -40 units -> respawn safely back on the island
                    if (characterGroup.position.y < -40) {
                        // Respawn slightly in the air above center (X=0, Z=0) so we fall cleanly onto the highest building surface
                        characterGroup.position.set(0, 15, 0);
                        characterGroup.rotation.set(0, 0, 0); // reset rotation to face forward
                        verticalVelocity = 0;
                        isGrounded = false;
                    }
                }

                const joystickActive = Math.abs(keys.joystickX) > 0.05 || Math.abs(keys.joystickY) > 0.05;

                if (keys.w || keys.s || keys.a || keys.d || joystickActive) {
                    isWalking = true;
                    const speed = keys.shift ? runSpeed : walkSpeed;


                    // 1. Calculate rotation first — ease the turn rate itself (instead of snapping straight
                    // to full angular speed) so changing direction ramps smoothly rather than whipping around.
                    // The joystick gets a gentler ease than the keyboard: its target constantly drifts as the
                    // thumb moves, so catching up to it as fast as a discrete keypress feels twitchy/whippy.
                    let targetTurnRate = 0;
                    let turnEase = 10;
                    if (keys.a) {
                        targetTurnRate = rotationSpeed;
                    } else if (keys.d) {
                        targetTurnRate = -rotationSpeed;
                    } else if (Math.abs(keys.joystickX) > 0.05) {
                        // Smooth, analog-scaled rotation speed!
                        // Scaled down (by 0.4) for beautiful, cinematic precision instead of rapid spinning!
                        targetTurnRate = -keys.joystickX * rotationSpeed * 0.4;
                        turnEase = 6;
                    }
                    turnRate = THREE.MathUtils.lerp(turnRate, targetTurnRate, turnEase * delta);
                    characterGroup.rotation.y += turnRate * delta;

                    // 2. Prepare predicted translation
                    let moveDistance = speed * delta;
                    const moveDir = new THREE.Vector3();
                    let hasTranslation = false;

                    if (keys.w) {
                        characterGroup.getWorldDirection(moveDir); // forward vector
                        hasTranslation = true;
                    } else if (keys.s) {
                        characterGroup.getWorldDirection(moveDir);
                        moveDir.negate(); // backward vector
                        hasTranslation = true;
                    } else if (Math.abs(keys.joystickY) > 0.05) {
                        characterGroup.getWorldDirection(moveDir);
                        if (keys.joystickY > 0) {
                            moveDir.negate(); // backward vector
                        }
                        // Scale moveDistance by the analog drag amount!
                        moveDistance = moveDistance * Math.abs(keys.joystickY);
                        hasTranslation = true;
                    }

                    let canTranslate = true;

                    if (hasTranslation && moveDir.lengthSq() > 0) {
                        moveDir.normalize();

                        // A. Check wall collision in the translation direction against the city buildings
                        if (buildingGroup) {
                            const collisionOrigin = characterGroup.position.clone();
                            collisionOrigin.y += 0.8; // waist height of 2-unit tall character

                            const collisionRaycaster = new THREE.Raycaster();
                            collisionRaycaster.set(collisionOrigin, moveDir);
                            collisionRaycaster.far = 1.1; // wall detection distance (slightly larger than character radius)

                            const wallIntersects = collisionRaycaster.intersectObject(buildingGroup, true);
                            if (wallIntersects.length > 0) {
                                canTranslate = false; // block walking through walls/buildings!
                            }
                        }

                        // B. Check boundary of the island (max radius 58 units) so character can't fall off
                        const predictedPos = characterGroup.position.clone();
                        predictedPos.addScaledVector(moveDir, moveDistance);
                        const distFromCenter = Math.sqrt(predictedPos.x * predictedPos.x + predictedPos.z * predictedPos.z);
                        if (distFromCenter > 58.0) {
                            canTranslate = false; // block going outside the floating city!
                        }
                    }

                    if (canTranslate && hasTranslation) {
                        // Standard translation in local coordinate space (translateZ works beautifully on local axis)
                        if (keys.w || (Math.abs(keys.joystickY) > 0.05 && keys.joystickY <= 0)) {
                            characterGroup.translateZ(moveDistance);
                        } else if (keys.s || (Math.abs(keys.joystickY) > 0.05 && keys.joystickY > 0)) {
                            characterGroup.translateZ(-moveDistance);
                        }
                    }
                }

                // Procedural astronaut animation: every pose eases toward per-state targets, so
                // transitions between jump / walk / run / idle blend smoothly instead of snapping.
                if (astronautParts) {
                    const P = astronautParts;
                    const ease = 12 * delta;
                    const lerpTo = (obj: any, axis: 'x' | 'y' | 'z', target: number, factor = ease) => {
                        obj.rotation[axis] = THREE.MathUtils.lerp(obj.rotation[axis], target, factor);
                    };

                    if (!isGrounded) {
                        // --- Airborne: tucked jump pose, arms flared, thrusters firing ---
                        lerpTo(P.leftArm.shoulder, 'x', -0.7);
                        lerpTo(P.rightArm.shoulder, 'x', -0.7);
                        lerpTo(P.leftArm.shoulder, 'z', -0.5);
                        lerpTo(P.rightArm.shoulder, 'z', 0.5);
                        lerpTo(P.leftArm.elbow, 'x', -0.6);
                        lerpTo(P.rightArm.elbow, 'x', -0.6);

                        lerpTo(P.leftLeg.hip, 'x', -0.45);
                        lerpTo(P.rightLeg.hip, 'x', -0.25);
                        lerpTo(P.leftLeg.knee, 'x', 0.95);
                        lerpTo(P.rightLeg.knee, 'x', 0.7);

                        lerpTo(P.body, 'x', -0.08);
                        P.body.position.y = THREE.MathUtils.lerp(P.body.position.y, 0, ease);

                        // Thruster exhaust: visible with a rapid flicker while in the air
                        P.flames.forEach((flame: any, i: number) => {
                            flame.visible = true;
                            const flicker = 0.75 + Math.sin(time * 42 + i * 2.7) * 0.25;
                            flame.scale.set(flicker, 0.8 + flicker * 0.5, flicker);
                        });
                    } else {
                        P.flames.forEach((flame: any) => { flame.visible = false; });

                        if (isWalking) {
                            // --- Walk / run gait: opposite arm-leg swings with real elbow & knee bends ---
                            const running = keys.shift;
                            const swingFreq = time * (running ? 15.5 : 11);
                            const stride = running ? 0.78 : 0.52;
                            const s = Math.sin(swingFreq);

                            lerpTo(P.leftLeg.hip, 'x', s * stride);
                            lerpTo(P.rightLeg.hip, 'x', -s * stride);
                            // Knees only ever flex backward (anatomically), deepest mid-swing
                            const kneeBend = running ? 1.05 : 0.6;
                            lerpTo(P.leftLeg.knee, 'x', (Math.sin(swingFreq - Math.PI / 2) + 1.0) * 0.5 * kneeBend);
                            lerpTo(P.rightLeg.knee, 'x', (Math.sin(swingFreq + Math.PI / 2) + 1.0) * 0.5 * kneeBend);

                            // Arms swing opposite their same-side leg, elbows pumped while running
                            const armSwing = stride * 0.8;
                            lerpTo(P.leftArm.shoulder, 'x', -s * armSwing);
                            lerpTo(P.rightArm.shoulder, 'x', s * armSwing);
                            lerpTo(P.leftArm.shoulder, 'z', -0.06);
                            lerpTo(P.rightArm.shoulder, 'z', 0.06);
                            lerpTo(P.leftArm.elbow, 'x', running ? -0.95 : -0.35);
                            lerpTo(P.rightArm.elbow, 'x', running ? -0.95 : -0.35);

                            // Forward lean + step bob (on the inner body group so physics owns the root)
                            lerpTo(P.body, 'x', running ? 0.14 : 0.05);
                            P.body.position.y = THREE.MathUtils.lerp(
                                P.body.position.y,
                                Math.abs(Math.sin(swingFreq)) * (running ? 0.07 : 0.04),
                                ease
                            );
                        } else {
                            // --- Idle: relaxed stance with a soft breathing sway ---
                            const breathFreq = time * 2.0;
                            const settle = 6 * delta;

                            lerpTo(P.leftArm.shoulder, 'x', Math.sin(breathFreq) * 0.05, settle);
                            lerpTo(P.rightArm.shoulder, 'x', -Math.sin(breathFreq) * 0.05, settle);
                            lerpTo(P.leftArm.shoulder, 'z', -0.1, settle);
                            lerpTo(P.rightArm.shoulder, 'z', 0.1, settle);
                            lerpTo(P.leftArm.elbow, 'x', -0.25, settle);
                            lerpTo(P.rightArm.elbow, 'x', -0.25, settle);

                            lerpTo(P.leftLeg.hip, 'x', 0, settle);
                            lerpTo(P.rightLeg.hip, 'x', 0, settle);
                            lerpTo(P.leftLeg.knee, 'x', 0.05, settle);
                            lerpTo(P.rightLeg.knee, 'x', 0.05, settle);

                            lerpTo(P.body, 'x', 0, settle);
                            P.body.position.y = THREE.MathUtils.lerp(
                                P.body.position.y,
                                Math.sin(breathFreq) * 0.018,
                                settle
                            );
                        }
                    }
                }

                if (!isWalking) {
                    // No turn input this frame — decay the eased turn rate back to rest so the next
                    // turn ramps up from a standstill instead of resuming from a stale leftover rate
                    turnRate = THREE.MathUtils.lerp(turnRate, 0, 10 * delta);
                }

                // 4. Smooth Follow & Orbit Zoom Camera
                // Interpolate current angles and zoom factors towards target values for smooth inertia feel
                orbitTheta = THREE.MathUtils.lerp(orbitTheta, targetOrbitTheta, 8 * delta);
                orbitPhi = THREE.MathUtils.lerp(orbitPhi, targetOrbitPhi, 8 * delta);
                zoomFactor = THREE.MathUtils.lerp(zoomFactor, targetZoomFactor, 8 * delta);

                if (isWalking) {
                    // Smoothly auto-align camera back behind the character when they start walking (standard game mechanics)
                    targetOrbitTheta = THREE.MathUtils.lerp(targetOrbitTheta, 0, 3 * delta);
                    targetOrbitPhi = THREE.MathUtils.lerp(targetOrbitPhi, 0.403, 3 * delta);
                }

                const idealCameraPos = characterGroup.position.clone();
                const charRot = characterGroup.rotation.y;
                
                // Camera radial distance (base is 8.15 units)
                const r = 6.8 * zoomFactor; // pulled in a touch — the chibi astronaut is small, so closer framing keeps her readable
                const hAngle = charRot + Math.PI + orbitTheta; // add PI so we start behind the character
                const vAngle = orbitPhi;

                // Spherical to Cartesian coordinate transformation (relative to character)
                idealCameraPos.x += r * Math.cos(vAngle) * Math.sin(hAngle);
                idealCameraPos.z += r * Math.cos(vAngle) * Math.cos(hAngle);
                idealCameraPos.y += r * Math.sin(vAngle);

                camera.position.lerp(idealCameraPos, 10 * delta);
                
                const lookAtPos = characterGroup.position.clone();
                lookAtPos.y += 1.1; // focus on the chibi's big helmet/face
                camera.lookAt(lookAtPos);
            }

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
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            container.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            container.removeEventListener('wheel', handleWheel);
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
            starGeometry.dispose();
            starMaterial.dispose();
            crystalGeom.dispose();
            crystalMaterial.dispose();
            beaconGeom.dispose();
            beaconMaterial.dispose();
            renderer.dispose();
        };
    }, [onLoaded, onProgress]);

    return (
        <>
            <div ref={containerRef} className="three-canvas" />

            {/* Walk Controls HUD Instruction (game-style keycaps) */}
            <div className="space-hud-bar">
                <DPad keys={DPAD_WASD} size="sm"/>
                <span className="space-hud-sep">/</span>
                <DPad size="sm"/>
                <span className="space-hud-accent">MOVE</span>
                <span className="space-hud-divider">|</span>
                <span className="space-keycap">SPACE</span>
                <span className="space-hud-accent">JUMP</span>
                <span className="space-hud-divider">|</span>
                <span className="space-keycap">SHIFT</span>
                <span className="space-hud-run">RUN</span>
            </div>

            {/* Touch controls cluster: jump button + joystick, laid out with flex so they scale and
                stay glued together across every viewport size instead of using magic offsets */}
            <div className="space-controls-cluster">
                {/* Virtual Jump Button: chunky 3D arcade button next to the joystick */}
                <div
                    className="space-jump-btn"
                    onPointerDown={(e) => {
                        handleJumpStart();
                        e.currentTarget.classList.add('pressed');
                    }}
                    onPointerUp={(e) => {
                        handleJumpEnd();
                        e.currentTarget.classList.remove('pressed');
                    }}
                    onPointerCancel={(e) => {
                        handleJumpEnd();
                        e.currentTarget.classList.remove('pressed');
                    }}
                >
                    <div className="space-jump-icon">▲</div>
                    <div className="space-jump-label">JUMP</div>
                </div>

                {/* Joystick column: a graphical up/left/right/down legend hovering above the stick itself */}
                <div className="space-joystick-wrapper">
                    <div className="space-dpad-legend">
                        <DPad size="lg"/>
                        <div className="space-dpad-legend-label">MOVE</div>
                    </div>

                    {/* Virtual Joystick: gamepad-style base with glowing directional arrows */}
                    <div ref={joystickBaseRef} className="space-joystick-base">
                        {/* Slowly rotating dashed radar ring */}
                        <div className="space-radar-ring" />
                        {/* Inner crosshair guide ring */}
                        <div className="space-crosshair-ring" />

                        {/* Directional arrows on the rim: light up cyan when the stick pushes that way */}
                        <div ref={arrowUpRef} className="space-joystick-arrow space-arrow-up">▲</div>
                        <div ref={arrowDownRef} className="space-joystick-arrow space-arrow-down">▼</div>
                        <div ref={arrowLeftRef} className="space-joystick-arrow space-arrow-left">◀</div>
                        <div ref={arrowRightRef} className="space-joystick-arrow space-arrow-right">▶</div>

                        {/* Joystick Knob Handle: glossy thumbstick with grip lines */}
                        <div
                            ref={joystickHandleRef}
                            className="space-joystick-handle"
                            onPointerDown={handleJoystickStart}
                            onPointerMove={handleJoystickMove}
                            onPointerUp={handleJoystickEnd}
                            onPointerCancel={handleJoystickEnd}
                        >
                            {/* Thumb grip lines */}
                            <div className="space-grip-line" />
                            <div className="space-grip-line wide" />
                            <div className="space-grip-line" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThreeSpace;
