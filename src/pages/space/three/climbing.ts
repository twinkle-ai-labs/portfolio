import * as THREE from 'three';
import {raycastCity} from './city-raycast';
import {SpaceKeys} from './types';

const climbSpeed = 4.5;        // 벽을 오르는 속도 (units/s). 걷기보다 느려야 오르는 맛이 난다
const climbProbeHeight = 1.1;  // 가슴 높이에서 정면으로 쏘는 탐침 — 발끝 턱이 아니라 벽면을 봐야 한다
// 걷기를 막는 벽 판정(character.ts의 collisionRaycaster.far = 1.1)보다 길어야 한다.
// 짧으면 "벽에 부딪혀 멈췄는데 잡을 벽은 없다"는 상태가 생겨, 어떤 벽은 타지고 어떤 벽은
// 밀기만 하다 끝나는 들쭉날쭉한 조작이 된다.
const climbReach = 1.25;
const wallGrabDelay = 0.28;    // 땅에서는 이만큼 벽을 밀고 있어야 붙는다 (스치기만 해도 붙으면 성가시다)
const mantleBoost = 5.0;       // 꼭대기에서 벽이 끊길 때 난간을 넘어서도록 밀어 주는 힘
// 캐릭터 점프력(character.ts의 jumpStrength)의 0.9 정도. 여기 숫자로 박아 둔 이유는
// character.ts가 이 모듈을 import 하기 때문 — 반대로 끌어오면 순환 참조가 된다.
const wallJumpStrength = 9.45;

/** 컨트롤러가 이번 프레임까지 계산해 둔, 벽타기 판정에 필요한 물리 상태. */
export interface ClimbContext {
    verticalVelocity: number;
    /** 직전 프레임에 땅을 밟고 있었나 (이번 프레임 isGrounded는 아직 확정 전이다) */
    wasGrounded: boolean;
    /** 발밑에 바닥이 잡혔나 */
    hasGround: boolean;
    /** 발밑 바닥의 y */
    floorY: number;
}

export interface ClimbOutcome {
    /** 벽타기가 이번 프레임의 수직 이동을 대신 처리했는가. true면 호출자는 중력을 건너뛴다 */
    handled: boolean;
    /** 호출자가 이어받을 수직 속도 — 벽 차기·난간 넘기 부스트가 반영돼 있다 */
    verticalVelocity: number;
    /** 벽을 타고 내려와 바닥에 닿았는가 */
    grounded: boolean;
}

export interface WallClimber {
    update: (delta: number, buildingGroup: any | null, ctx: ClimbContext) => ClimbOutcome;
    /** 애니메이션이 등반 포즈를 고를 때 본다 */
    readonly isClimbing: boolean;
}

// 벽타기. 정면 가슴 높이로 짧은 레이 하나를 쏴서 붙잡을 벽이 있는지만 본다.
//
// 캐릭터가 A/D로 몸을 돌려 벽을 등지면 이 레이가 빗나가므로, 방향을 트는 것만으로 자연스럽게
// 벽에서 떨어진다 — 따로 놓기 키를 두지 않은 이유다.
//
// 매달려 있는 동안의 수직 이동(중력 정지 포함)은 이 모듈이 직접 처리하고, 그 사실을
// ClimbOutcome.handled로 알린다. 호출자는 handled면 자기 중력·착지 코드를 건너뛰면 된다.
export const createWallClimber = (
    characterGroup: InstanceType<typeof THREE.Group>,
    keys: SpaceKeys
): WallClimber => {
    let isClimbing = false;
    // "땅에서 벽을 밀고 있던 시간". wallGrabDelay를 넘어야 붙는다.
    let climbPush = 0;

    const probeOrigin = new THREE.Vector3();
    const probeDir = new THREE.Vector3();
    const probe = new THREE.Raycaster();
    probe.far = climbReach;
    // 벽이 있냐 없냐만 보면 된다 — BVH가 첫 교차에서 탐색을 멈추게 한다
    (probe as any).firstHitOnly = true;

    const wallAhead = (buildingGroup: any | null): boolean => {
        if (!buildingGroup) return false;
        characterGroup.getWorldDirection(probeDir);
        probeOrigin.copy(characterGroup.position);
        probeOrigin.y += climbProbeHeight;
        probe.set(probeOrigin, probeDir);
        return raycastCity(probe, buildingGroup).length > 0;
    };

    return {
        get isClimbing() {
            return isClimbing;
        },

        update: (delta, buildingGroup, ctx): ClimbOutcome => {
            const pushingForward = keys.w || keys.joystickY < -0.05;
            const pushingBack = keys.s || keys.joystickY > 0.05;
            const hasWall = wallAhead(buildingGroup);

            let verticalVelocity = ctx.verticalVelocity;

            if (isClimbing) {
                if (!hasWall) {
                    // 벽이 끊겼다 = 꼭대기에 닿았거나 옆으로 벗어났다. 오르던 중이었다면
                    // 살짝 밀어 올려 난간을 넘겨 준다 — 안 그러면 턱에 걸려 도로 미끄러진다.
                    isClimbing = false;
                    if (pushingForward) {
                        verticalVelocity = mantleBoost;
                        characterGroup.translateZ(0.45);
                    }
                } else if (keys.space) {
                    // 벽 차고 뛰어내리기
                    isClimbing = false;
                    verticalVelocity = wallJumpStrength;
                    characterGroup.translateZ(-0.5);
                    keys.space = false;
                }
            } else if (hasWall && pushingForward) {
                // 공중에서 벽에 부딪히면 즉시 매달린다(점프해서 붙는 맛). 땅에서는 잠깐 밀고
                // 있어야 붙는다 — 벽을 스칠 때마다 매달리면 걷기가 성가셔진다.
                if (!ctx.wasGrounded) {
                    isClimbing = true;
                    verticalVelocity = 0;
                } else {
                    climbPush += delta;
                    if (climbPush >= wallGrabDelay) {
                        isClimbing = true;
                        verticalVelocity = 0;
                    }
                }
            }
            if (!hasWall || !pushingForward) climbPush = 0;

            if (!isClimbing) {
                return {handled: false, verticalVelocity, grounded: false};
            }

            // 매달려 있는 동안은 중력을 끈다. 입력이 없으면 그 자리에 붙어 있는다.
            if (pushingForward) verticalVelocity = climbSpeed;
            else if (pushingBack) verticalVelocity = -climbSpeed * 0.85;
            else verticalVelocity = 0;
            characterGroup.position.y += verticalVelocity * delta;

            // 바닥까지 미끄러져 내려오면 그대로 착지시킨다.
            // 내려오는 중(또는 정지)일 때만 본다 — 올라가는 중에도 이걸 보면, 머리 위 1.5 안에
            // 걸리는 슬래브마다 몸이 위로 딸려 올라가 등반이 계단처럼 툭툭 끊긴다.
            if (ctx.hasGround && verticalVelocity <= 0 && characterGroup.position.y <= ctx.floorY) {
                characterGroup.position.y = ctx.floorY;
                isClimbing = false;
                return {handled: true, verticalVelocity: 0, grounded: true};
            }

            return {handled: true, verticalVelocity, grounded: false};
        }
    };
};
