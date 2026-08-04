import * as THREE from 'three';

export interface AstronautLimb {
    shoulder?: InstanceType<typeof THREE.Group>;
    elbow?: InstanceType<typeof THREE.Group>;
    hip?: InstanceType<typeof THREE.Group>;
    knee?: InstanceType<typeof THREE.Group>;
}

export interface AstronautRig {
    mesh: InstanceType<typeof THREE.Group>;
    body: InstanceType<typeof THREE.Group>;
    leftArm: { shoulder: InstanceType<typeof THREE.Group>; elbow: InstanceType<typeof THREE.Group> };
    rightArm: { shoulder: InstanceType<typeof THREE.Group>; elbow: InstanceType<typeof THREE.Group> };
    leftLeg: { hip: InstanceType<typeof THREE.Group>; knee: InstanceType<typeof THREE.Group> };
    rightLeg: { hip: InstanceType<typeof THREE.Group>; knee: InstanceType<typeof THREE.Group> };
    flames: Array<InstanceType<typeof THREE.Mesh>>;
}

// Procedural Space Astronaut Character Construction
// Builds a cute chibi-style astronaut entirely in code — oversized helmet, chubby body,
// pastel-pink accents, glowing eyes and blush marks inside the visor. A proper joint
// hierarchy (shoulder → elbow, hip → knee) lets limbs genuinely bend while animating.
// The soles of the boots sit exactly at y = 0, so physics can drive the root directly.
export const createAstronaut = (): AstronautRig => {
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
