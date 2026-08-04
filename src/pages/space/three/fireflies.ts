import * as THREE from 'three';
import {SampleGroundY} from './ground-repair';

export interface Fireflies {
    update: (time: number) => void;
    settleOnGround: (sampleGroundY: SampleGroundY) => void;
    dispose: () => void;
}

// Fireflies — hundreds of tiny warm motes drifting over the streets (반딧불이).
// Rendered as one additive-blended point cloud (a single draw call, so "more lights"
// costs almost nothing), each with its own wander orbit, bob and blink phase. A soft
// radial sprite is painted onto a small canvas so every mote glows instead of squaring.
// NOTE: deliberately no real PointLights on the swarm — in a forward renderer every extra
// light is evaluated for every fragment of the whole 1.3M-triangle city, and even eight of
// them dragged the frame rate down badly. The additive sprites alone read as light sources.
export const createFireflies = (scene: InstanceType<typeof THREE.Scene>): Fireflies => {
    const FIREFLY_COUNT = 260;
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d');
    if (glowCtx) {
        const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.25, 'rgba(255,244,200,0.9)');
        gradient.addColorStop(0.6, 'rgba(255,220,130,0.28)');
        gradient.addColorStop(1, 'rgba(255,210,110,0)');
        glowCtx.fillStyle = gradient;
        glowCtx.fillRect(0, 0, 64, 64);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    const fireflyGeometry = new THREE.BufferGeometry();
    const fireflyPositions = new Float32Array(FIREFLY_COUNT * 3);
    const fireflyColors = new Float32Array(FIREFLY_COUNT * 3);
    // Per-mote flight plan: anchor point + orbit radii + phase/speed seeds
    const fireflies: Array<{
        ax: number; ay: number; az: number;
        rx: number; ry: number; rz: number;
        speed: number; blink: number; seed: number;
        grounded: boolean;
    }> = [];

    const fireflyPalette = [
        [1.0, 0.92, 0.55],  // warm lantern yellow
        [1.0, 0.82, 0.45],  // amber
        [0.85, 1.0, 0.65],  // soft yellow-green (the classic firefly)
        [0.75, 0.95, 1.0]   // a few cool ice-blue strays for the space mood
    ];

    for (let i = 0; i < FIREFLY_COUNT; i++) {
        // Scatter across the whole island; ground height is refined once the city loads
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 55; // sqrt → even area coverage
        fireflies.push({
            ax: Math.sin(angle) * radius,
            ay: 3.0 + Math.random() * 2.5, // provisional; snapped to ground + 0.4..2.2 on city load
            az: Math.cos(angle) * radius,
            rx: 0.6 + Math.random() * 1.6,
            ry: 0.25 + Math.random() * 0.7,
            rz: 0.6 + Math.random() * 1.6,
            speed: 0.25 + Math.random() * 0.6,
            blink: 0.6 + Math.random() * 1.8,
            seed: Math.random() * 100,
            grounded: false
        });
        const color = fireflyPalette[Math.random() < 0.12 ? 3 : Math.floor(Math.random() * 3)];
        fireflyColors[i * 3] = color[0];
        fireflyColors[i * 3 + 1] = color[1];
        fireflyColors[i * 3 + 2] = color[2];
    }

    fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
    fireflyGeometry.setAttribute('color', new THREE.BufferAttribute(fireflyColors, 3));

    const fireflyMaterial = new THREE.PointsMaterial({
        size: 0.55,
        map: glowTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    const fireflyPoints = new THREE.Points(fireflyGeometry, fireflyMaterial);
    fireflyPoints.frustumCulled = false; // one cloud spanning the island — always in view anyway
    scene.add(fireflyPoints);

    return {
        // Animate: every mote wanders a slow lissajous orbit around its anchor,
        // bobbing and blinking on its own rhythm — the whole swarm is one buffer write.
        update: (time: number) => {
            const posAttr = fireflyGeometry.attributes.position as any;
            const arr = posAttr.array as Float32Array;
            for (let i = 0; i < FIREFLY_COUNT; i++) {
                const fly = fireflies[i];
                const t = time * fly.speed + fly.seed;
                const o = i * 3;
                arr[o] = fly.ax + Math.sin(t) * fly.rx + Math.sin(t * 0.37) * 0.5;
                arr[o + 1] = fly.ay + Math.sin(t * 1.31 + fly.seed) * fly.ry;
                arr[o + 2] = fly.az + Math.cos(t * 0.83) * fly.rz + Math.cos(t * 0.29) * 0.5;
            }
            posAttr.needsUpdate = true;
            // Gentle group-level shimmer; individual blinking is faked cheaply via opacity beat
            fireflyMaterial.opacity = 0.8 + Math.sin(time * 1.7) * 0.15;
        },
        // Settle each firefly's anchor just above the actual street under it, so the swarm
        // hugs the walkable city instead of hanging at one arbitrary altitude
        settleOnGround: (sampleGroundY: SampleGroundY) => {
            fireflies.forEach((fly) => {
                const groundY = sampleGroundY(fly.ax, fly.az);
                if (groundY !== null && groundY < 8) {
                    fly.ay = groundY + 0.5 + Math.random() * 1.9;
                    fly.grounded = true;
                }
            });
        },
        dispose: () => {
            fireflyGeometry.dispose();
            fireflyMaterial.dispose();
            glowTexture.dispose();
        }
    };
};
