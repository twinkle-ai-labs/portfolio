import * as THREE from 'three';

export interface Starfield {
    update: (time: number) => void;
    dispose: () => void;
}

// Procedural Twinkling Starfield Particle System
export const createStarfield = (scene: InstanceType<typeof THREE.Scene>): Starfield => {
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

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

    return {
        update: (time: number) => {
            starfield.rotation.y = time * 0.005; // slowly rotate the cosmos
        },
        dispose: () => {
            starGeometry.dispose();
            starMaterial.dispose();
        }
    };
};
