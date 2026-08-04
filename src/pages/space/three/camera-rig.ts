import * as THREE from 'three';

export interface CameraRig {
    update: (delta: number, characterGroup: InstanceType<typeof THREE.Group>, isWalking: boolean) => void;
    dispose: () => void;
}

// Interactive Mouse Orbit & Zoom follow camera.
// 포인터 드래그로 궤도각, 휠로 줌을 조절하고 매 프레임 캐릭터 뒤를 부드럽게 따라간다.
export const createCameraRig = (
    camera: InstanceType<typeof THREE.PerspectiveCamera>,
    container: HTMLElement
): CameraRig => {
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
    container.addEventListener('wheel', handleWheel, {passive: false});

    const update = (delta: number, characterGroup: InstanceType<typeof THREE.Group>, isWalking: boolean) => {
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

        // Camera radial distance
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
    };

    const dispose = () => {
        container.removeEventListener('pointerdown', handlePointerDown);
        container.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        container.removeEventListener('wheel', handleWheel);
    };

    return {update, dispose};
};
