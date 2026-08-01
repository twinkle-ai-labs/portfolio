import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

interface IThreeSpaceProps {
    onLoaded?: () => void
}

const ThreeSpace = ({onLoaded}: IThreeSpaceProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

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
        container.appendChild(renderer.domElement);
        renderer.domElement.className = 'babylon-canvas babylon-loaded';

        // Lights
        const ambientLight = new THREE.AmbientLight(0x222244, 0.8);
        scene.add(ambientLight);

        // Hemispheric light for beautiful sky-to-ground gradients
        const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x111827, 0.8);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
        dirLight.position.set(15, 30, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 25;
        dirLight.shadow.camera.bottom = -25;
        dirLight.shadow.camera.left = -25;
        dirLight.shadow.camera.right = 25;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.bias = -0.0005;
        scene.add(dirLight);

        // Ground setup
        const groundGeometry = new THREE.PlaneGeometry(300, 300);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x070714,
            roughness: 0.85,
            metalness: 0.15
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Cool neon spatial grid
        const grid = new THREE.GridHelper(300, 150, 0x4f46e5, 0x1e1b4b);
        grid.position.y = 0.01;
        scene.add(grid);

        const clock = new THREE.Clock();
        const loader = new GLTFLoader();
        let sky: InstanceType<typeof THREE.Group> | null = null;

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
        }, undefined, (err: any) => {
            console.error('Error loading night sky GLTF model:', err);
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
        const createAstronaut = () => {
            const group = new THREE.Group();

            // Quality materials with nice metallic/roughness adjustments
            const suitMaterial = new THREE.MeshStandardMaterial({
                color: 0xf8fafc, // Clean slate white
                roughness: 0.5,
                metalness: 0.15
            });

            const armorMaterial = new THREE.MeshStandardMaterial({
                color: 0x4f46e5, // Cosmic Indigo accents
                roughness: 0.3,
                metalness: 0.7
            });

            const visorMaterial = new THREE.MeshStandardMaterial({
                color: 0x06b6d4, // Cyan visor
                emissive: 0x0891b2, // Glowing
                emissiveIntensity: 0.9,
                roughness: 0.1,
                metalness: 0.9
            });

            const rubberMaterial = new THREE.MeshStandardMaterial({
                color: 0x1e293b, // Dark joints/details
                roughness: 0.8,
                metalness: 0.1
            });

            // Torso (Main spacesuit body)
            const torsoGeom = new THREE.CylinderGeometry(0.4, 0.32, 1.0, 16);
            const torso = new THREE.Mesh(torsoGeom, suitMaterial);
            torso.position.y = 0.95;
            torso.castShadow = true;
            torso.receiveShadow = true;
            group.add(torso);

            // Jetpack (Cosmic backpack)
            const packGeom = new THREE.BoxGeometry(0.55, 0.75, 0.32);
            const jetpack = new THREE.Mesh(packGeom, armorMaterial);
            jetpack.position.set(0, 0.95, -0.3);
            jetpack.castShadow = true;
            group.add(jetpack);

            // Life Support Chest Plate
            const chestGeom = new THREE.BoxGeometry(0.4, 0.28, 0.12);
            const chestPlate = new THREE.Mesh(chestGeom, armorMaterial);
            chestPlate.position.set(0, 1.05, 0.22);
            chestPlate.castShadow = true;
            group.add(chestPlate);

            // Head (Round helmet)
            const headGeom = new THREE.SphereGeometry(0.36, 20, 20);
            const helmet = new THREE.Mesh(headGeom, suitMaterial);
            helmet.position.set(0, 1.62, 0);
            helmet.castShadow = true;
            group.add(helmet);

            // Glowing Visor (Cyber Astronaut Face)
            const visorGeom = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
            const visor = new THREE.Mesh(visorGeom, visorMaterial);
            visor.rotation.x = Math.PI / 1.9;
            visor.position.set(0, 1.62, 0.14);
            group.add(visor);

            // Neck ring
            const neckGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16);
            const neck = new THREE.Mesh(neckGeom, rubberMaterial);
            neck.position.y = 1.45;
            group.add(neck);

            // Arm parts helper
            const createArm = (isLeft: boolean) => {
                const armGroup = new THREE.Group();
                const shoulderOffset = isLeft ? -0.52 : 0.52;
                armGroup.position.set(shoulderOffset, 1.3, 0);

                // Upper arm
                const upperArmGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8);
                const upperArm = new THREE.Mesh(upperArmGeom, suitMaterial);
                upperArm.position.y = -0.22;
                upperArm.castShadow = true;
                armGroup.add(upperArm);

                // Shoulder joint
                const shoulderGeom = new THREE.SphereGeometry(0.14, 12, 12);
                const shoulder = new THREE.Mesh(shoulderGeom, rubberMaterial);
                shoulder.position.set(0, 0, 0);
                armGroup.add(shoulder);

                // Glove
                const gloveGeom = new THREE.SphereGeometry(0.1, 10, 10);
                const glove = new THREE.Mesh(gloveGeom, armorMaterial);
                glove.position.set(0, -0.48, 0);
                armGroup.add(glove);

                return armGroup;
            };

            const leftArm = createArm(true);
            const rightArm = createArm(false);
            group.add(leftArm);
            group.add(rightArm);

            // Leg parts helper
            const createLeg = (isLeft: boolean) => {
                const legGroup = new THREE.Group();
                const hipOffset = isLeft ? -0.22 : 0.22;
                legGroup.position.set(hipOffset, 0.5, 0);

                // Leg shaft
                const legGeom = new THREE.CylinderGeometry(0.14, 0.11, 0.58, 8);
                const leg = new THREE.Mesh(legGeom, suitMaterial);
                leg.position.y = -0.25;
                leg.castShadow = true;
                legGroup.add(leg);

                // Hip joint
                const hipGeom = new THREE.SphereGeometry(0.15, 12, 12);
                const hip = new THREE.Mesh(hipGeom, rubberMaterial);
                hip.position.set(0, 0, 0);
                legGroup.add(hip);

                // Boot (Astronaut space shoe)
                const bootGeom = new THREE.BoxGeometry(0.18, 0.12, 0.32);
                const boot = new THREE.Mesh(bootGeom, armorMaterial);
                boot.position.set(0, -0.56, 0.06);
                boot.castShadow = true;
                legGroup.add(boot);

                return legGroup;
            };

            const leftLeg = createLeg(true);
            const rightLeg = createLeg(false);
            group.add(leftLeg);
            group.add(rightLeg);

            return {
                mesh: group,
                leftArm,
                rightArm,
                leftLeg,
                rightLeg,
                torso
            };
        };

        let characterGroup: InstanceType<typeof THREE.Group> | null = null;
        let mixer: InstanceType<typeof THREE.AnimationMixer> | null = null;
        let walkAction: InstanceType<typeof THREE.AnimationAction> | null = null;
        let idleAction: InstanceType<typeof THREE.AnimationAction> | null = null;
        let currentAction: InstanceType<typeof THREE.AnimationAction> | null = null;
        let isProcedural = false;
        let astronautParts: any = null;

        // Load the custom Nova GLB character with robust automatic scaling & procedural fallback
        loader.load('/models/character/nova.glb', (gltf: any) => {
            const character = gltf.scene;
            characterGroup = character;
            
            // Calculate bounding box of the loaded model to automatically set the scale and position
            const box = new THREE.Box3().setFromObject(character);
            const size = box.getSize(new THREE.Vector3());
            
            // Set scale based on height so character is exactly 2 units tall
            const targetHeight = 2.0;
            const scaleFactor = targetHeight / (size.y || 1.0);
            character.scale.setScalar(scaleFactor);
            
            // Align feet to the ground (y = 0)
            character.position.y = -box.min.y * scaleFactor;
            character.position.x = 0;
            character.position.z = 0;
            
            character.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.roughness = Math.min(child.material.roughness, 0.7);
                    }
                }
            });

            scene.add(character);

            // Smart animation mapping by checking names for keywords (highly robust for custom GLBs)
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(character);
                
                const idleClip = gltf.animations.find((clip: any) => 
                    clip.name.toLowerCase().includes('idle') || 
                    clip.name.toLowerCase().includes('breath') ||
                    clip.name.toLowerCase().includes('stand')
                ) || gltf.animations[0];
                
                const walkClip = gltf.animations.find((clip: any) => 
                    clip.name.toLowerCase().includes('walk') || 
                    clip.name.toLowerCase().includes('run') || 
                    clip.name.toLowerCase().includes('move') ||
                    clip.name.toLowerCase().includes('play')
                ) || gltf.animations[1] || gltf.animations[0];
                
                idleAction = mixer.clipAction(idleClip);
                walkAction = mixer.clipAction(walkClip);
                
                idleAction.play();
                currentAction = idleAction;
            }
        }, undefined, (error: any) => {
            console.warn('Error loading custom Nova GLB model, falling back to procedural astronaut:', error);
            
            // Fallback to beautiful procedural astronaut
            const astronaut = createAstronaut();
            characterGroup = astronaut.mesh;
            astronautParts = astronaut;
            isProcedural = true;
            scene.add(characterGroup);
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

        // Dispatch load completion immediately as everything is procedurally made (brief artificial delay for smooth transition)
        const loadTimer = setTimeout(() => {
            if (onLoaded) onLoaded();
        }, 600);

        // Keyboard inputs (robust mapping using e.code to bypass Korean IME / '한영 키' lock)
        const keys = { w: false, a: false, s: false, d: false, shift: false };
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

        const walkSpeed = 5;
        const runSpeed = 9;
        const rotationSpeed = 3.5;
        
        // Follow camera offset configuration
        const cameraOffset = new THREE.Vector3(0, 3.2, -7.5); 
        
        const render = () => {
            const delta = clock.getDelta();
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

            // 3. Astronaut Controller & Procedural Rig Animation
            if (characterGroup) {
                let isWalking = false;
                let speedMultiplier = 1;

                if (keys.w || keys.s || keys.a || keys.d) {
                    isWalking = true;
                    const speed = keys.shift ? runSpeed : walkSpeed;
                    speedMultiplier = keys.shift ? 1.7 : 1;
                    
                    if (keys.w) {
                        characterGroup.translateZ(speed * delta);
                    }
                    if (keys.s) {
                        characterGroup.translateZ(-speed * delta);
                    }
                    if (keys.a) {
                        characterGroup.rotation.y += rotationSpeed * delta;
                    }
                    if (keys.d) {
                        characterGroup.rotation.y -= rotationSpeed * delta;
                    }
                }

                // Smoothly animate limb swinging (procedural) or play GLTF animations (gltf mixer)
                if (isWalking) {
                    if (isProcedural && astronautParts) {
                        const swingFreq = time * (keys.shift ? 15 : 9.5);
                        const swingAngle = 0.55;

                        // Opposite swings for natural biomechanics
                        astronautParts.leftArm.rotation.x = Math.sin(swingFreq) * swingAngle;
                        astronautParts.rightArm.rotation.x = -Math.sin(swingFreq) * swingAngle;

                        astronautParts.leftLeg.rotation.x = -Math.sin(swingFreq) * swingAngle * 0.9;
                        astronautParts.rightLeg.rotation.x = Math.sin(swingFreq) * swingAngle * 0.9;

                        // Slight hip bobbing up and down while walking
                        astronautParts.torso.position.y = 0.95 + Math.abs(Math.sin(swingFreq * 2)) * 0.06;
                    } else if (walkAction) {
                        // Play walk/run GLTF animation
                        const targetAction = walkAction;
                        if (currentAction !== targetAction && targetAction) {
                            currentAction.fadeOut(0.25);
                            targetAction.reset().fadeIn(0.25).play();
                            currentAction = targetAction;
                        }
                    }
                } else {
                    if (isProcedural && astronautParts) {
                        // Soft, floating "astronaut weightless breathing" idle animation
                        const breathFreq = time * 2.2;
                        astronautParts.leftArm.rotation.x = Math.sin(breathFreq) * 0.08;
                        astronautParts.rightArm.rotation.x = -Math.sin(breathFreq) * 0.08;

                        // Revert legs to resting position
                        astronautParts.leftLeg.rotation.x = THREE.MathUtils.lerp(astronautParts.leftLeg.rotation.x, 0, 5 * delta);
                        astronautParts.rightLeg.rotation.x = THREE.MathUtils.lerp(astronautParts.rightLeg.rotation.x, 0, 5 * delta);

                        astronautParts.torso.position.y = 0.95 + Math.sin(breathFreq) * 0.025;
                    } else if (idleAction) {
                        // Play idle/stand GLTF animation
                        const targetAction = idleAction;
                        if (currentAction !== targetAction && targetAction) {
                            currentAction.fadeOut(0.25);
                            targetAction.reset().fadeIn(0.25).play();
                            currentAction = targetAction;
                        }
                    }
                }

                // Update the GLTF animation mixer if active
                if (mixer) {
                    mixer.update(delta * speedMultiplier);
                }

                // 4. Smooth Follow Camera
                const idealCameraPos = characterGroup.position.clone();
                const charRot = characterGroup.rotation.y;
                
                // Camera offsets relative to character's local coordinate system
                idealCameraPos.x += Math.sin(charRot) * cameraOffset.z;
                idealCameraPos.z += Math.cos(charRot) * cameraOffset.z;
                idealCameraPos.y += cameraOffset.y;

                camera.position.lerp(idealCameraPos, 5 * delta);
                
                const lookAtPos = characterGroup.position.clone();
                lookAtPos.y += 1.4; // look straight at helmet/chest plate
                camera.lookAt(lookAtPos);
            }

            renderer.render(scene, camera);
            animationFrame = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            clearTimeout(loadTimer);
            window.cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
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
            renderer.dispose();
        };
    }, [onLoaded]);

    return (
        <>
            <div ref={containerRef} className="babylon-canvas" style={{ touchAction: 'none' }} />
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#cbd5e1',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '12px 24px',
                borderRadius: '999px',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                pointerEvents: 'none',
                zIndex: 10,
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                border: '1px solid rgba(129, 140, 248, 0.2)'
            }}>
                Use <b>W A S D</b> to walk &nbsp;•&nbsp; Hold <b>Shift</b> to run
            </div>
        </>
    );
};

export default ThreeSpace;
