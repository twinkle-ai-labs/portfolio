import * as THREE from 'three';
import {AstronautRig} from './astronaut';
import {raycastCity} from './city-raycast';
import {SpaceKeys} from './types';

const walkSpeed = 7;
const runSpeed = 12;
const rotationSpeed = 3.5;
const gravity = 28; // standard gravity acceleration (units/s^2)
const jumpStrength = 10.5; // jumping initial velocity (units/s)

export interface CharacterController {
    update: (delta: number, time: number, buildingGroup: any | null) => { isWalking: boolean };
    respawnAt: (y: number) => void;
}

// 중력·점프·벽 충돌·이동 물리와 걷기/달리기/점프/대기 절차 애니메이션을 한 프레임 단위로
// 굴리는 컨트롤러. 원본 render 루프의 클로저 상태를 그대로 내부 상태로 옮겨 왔다.
export const createCharacterController = (astronaut: AstronautRig, keys: SpaceKeys): CharacterController => {
    const characterGroup = astronaut.mesh;
    const characterBaseY = 0;

    let verticalVelocity = 0;
    let turnRate = 0; // current eased angular velocity (rad/s); ramps toward the target turn speed instead of snapping so direction changes feel smooth, not twitchy

    // Pre-allocated vectors, raycasters, and state variables for rendering performance optimization
    const rayOrigin = new THREE.Vector3();
    const rayDirection = new THREE.Vector3(0, -1, 0);
    const collisionOrigin = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const collisionRaycaster = new THREE.Raycaster();
    collisionRaycaster.far = 1.1;
    // 벽 판정은 "하나라도 맞았나"만 본다 — BVH가 첫 교차에서 탐색을 멈추게 한다.
    // (지면 레이는 쓸 수 없다. 아래에서 모든 교차를 훑어 캐릭터 높이에 가장 가까운
    //  면을 고르기 때문이다.)
    (collisionRaycaster as any).firstHitOnly = true;

    let lastCharX = Infinity;
    let lastCharZ = Infinity;
    let cachedTargetY = 0;
    let cachedHasGround = false;
    let isGrounded = false;

    const update = (delta: number, time: number, buildingGroup: any | null): { isWalking: boolean } => {
        let isWalking = false;

        // Calculate current elevation on top of buildings (acting as our floating island)
        // Performance Optimization: Only perform the heavy recursive raycast against the high-poly building model (54MB)
        // if the character has actually moved horizontally or is currently airborne (jumping/falling).
        // If they are static and grounded, the floor height under them cannot change, so we can reuse the cached result!
        const charPosChanged = Math.abs(characterGroup.position.x - lastCharX) > 0.0001 ||
                               Math.abs(characterGroup.position.z - lastCharZ) > 0.0001;

        const needsRaycast = charPosChanged || !isGrounded || lastCharX === Infinity;

        if (needsRaycast) {
            lastCharX = characterGroup.position.x;
            lastCharZ = characterGroup.position.z;

            if (buildingGroup) {
                rayOrigin.set(characterGroup.position.x, 200, characterGroup.position.z);
                raycaster.set(rayOrigin, rayDirection);

                // Recursively intersect with the entire building group
                const intersects = raycastCity(raycaster, buildingGroup);
                if (intersects.length > 0) {
                    cachedHasGround = true;
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
                        cachedTargetY = bestY;
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
                        cachedTargetY = closestY;
                    }
                } else {
                    cachedHasGround = false;
                    cachedTargetY = 0;
                }
            } else {
                // If the building is still loading, pretend we have ground at y = 0
                // so the character doesn't fall into the void before the island loads!
                cachedHasGround = true;
                cachedTargetY = 0;
            }
        }

        const targetY = cachedTargetY;
        const hasGround = cachedHasGround;
        const currentBaseY = targetY + characterBaseY;

        // Reset isGrounded state for the current frame's evaluation (its value was preserved in parent scope to optimize raycasting)
        isGrounded = false;

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

        // Hard safety clamp: prevent the character from ever falling below Y = 0 (the absolute base of the city)
        if (characterGroup.position.y < 0) {
            characterGroup.position.y = 0;
            verticalVelocity = 0;
            isGrounded = true;
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
                // Performance Optimization: Use pre-allocated collisionOrigin and collisionRaycaster objects to avoid frame allocations
                if (buildingGroup) {
                    collisionOrigin.copy(characterGroup.position);
                    collisionOrigin.y += 0.8; // waist height of 2-unit tall character

                    collisionRaycaster.set(collisionOrigin, moveDir);
                    const wallIntersects = raycastCity(collisionRaycaster, buildingGroup);
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
        {
            const P = astronaut;
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

        return {isWalking};
    };

    // 도시 로드가 끝나 스폰 높이가 확정됐을 때 캐릭터를 그 표면 위로 옮긴다
    const respawnAt = (y: number) => {
        characterGroup.position.set(0, y, 0);
    };

    return {update, respawnAt};
};
