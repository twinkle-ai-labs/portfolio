import React, {useRef} from 'react';
import {SpaceKeys} from './types';

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

interface ISpaceHudProps {
    keysRef: React.MutableRefObject<SpaceKeys>;
}

// 조작 안내 바 + 가상 조이스틱/점프 버튼 HUD.
// keysRef의 상태를 직접 갱신하고, 시각 효과(화살표 점등·러닝 글로우)는 리렌더 없이
// DOM 클래스 토글로만 처리해 60fps 드래그를 유지한다.
const SpaceHud = ({keysRef}: ISpaceHudProps) => {
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

    return (
        <>
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

export default SpaceHud;
