// 키보드·가상 조이스틱이 함께 쓰는 입력 상태. render 루프와 HUD가 같은 객체를 공유한다.
export interface SpaceKeys {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    shift: boolean;
    space: boolean;
    joystickX: number;
    joystickY: number;
}

export const createInitialKeys = (): SpaceKeys => ({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false,
    joystickX: 0,
    joystickY: 0
});
