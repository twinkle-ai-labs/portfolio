import {SpaceKeys} from './types';

// Keyboard inputs (robust mapping using e.code to bypass Korean IME / '한영 키' lock).
// window에 리스너를 걸고 해제 함수를 돌려준다.
export const attachKeyboard = (keys: SpaceKeys): (() => void) => {
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

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
};
