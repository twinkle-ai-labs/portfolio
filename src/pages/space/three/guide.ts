import * as THREE from 'three';

export interface GuideCompanion {
    update: (time: number, delta: number, playerPos: InstanceType<typeof THREE.Vector3>) => void;
    dispose: () => void;
}

// 가이드 별 "별이(Byeol)" — 우주비행사 곁을 떠다니는 작은 길잡이 별.
// 반딧불이와 같은 이유로 진짜 광원은 붙이지 않는다(fireflies.ts 참고) — 발광 재질과
// 가산 블렌딩 스프라이트만으로 충분히 빛나 보인다. 플레이어를 부드럽게 따라다니며
// 까딱까딱 떠 있고, 주위를 도는 작은 반짝이들이 살아있는 느낌을 준다.
export const createGuide = (scene: InstanceType<typeof THREE.Scene>): GuideCompanion => {
    const group = new THREE.Group();

    // Core: a chunky golden star (octahedron reads as a four-pointed star while spinning)
    const coreGeom = new THREE.OctahedronGeometry(0.3, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff7cc,
        emissive: 0xffd35c,
        emissiveIntensity: 2.8,
        roughness: 0.3,
        metalness: 0.1
    });
    const core = new THREE.Mesh(coreGeom, coreMaterial);
    group.add(core);

    // Soft halo sprite — same canvas-gradient trick as the fireflies' glow texture
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d');
    if (glowCtx) {
        const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(255,236,170,0.85)');
        gradient.addColorStop(0.7, 'rgba(255,214,110,0.2)');
        gradient.addColorStop(1, 'rgba(255,210,110,0)');
        glowCtx.fillStyle = gradient;
        glowCtx.fillRect(0, 0, 64, 64);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.setScalar(1.7);
    group.add(glow);

    // Tiny sparkles orbiting the core, like moons around a pocket-sized star
    const sparkleGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const sparkleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff1b8,
        emissiveIntensity: 3.5
    });
    const sparkles: Array<{ mesh: InstanceType<typeof THREE.Mesh>; phase: number; radius: number; tilt: number }> = [];
    for (let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(sparkleGeom, sparkleMaterial);
        group.add(mesh);
        sparkles.push({mesh, phase: (i / 3) * Math.PI * 2, radius: 0.55 + i * 0.08, tilt: 0.4 + i * 0.5});
    }

    group.position.set(0.9, 4.2, 1.2);
    scene.add(group);

    const followTarget = new THREE.Vector3();

    return {
        update: (time, delta, playerPos) => {
            // Hover beside and above the player's shoulder; exponential smoothing keeps the
            // chase frame-rate independent and gives a floaty, balloon-on-a-string feel.
            followTarget.set(playerPos.x + 0.9, playerPos.y + 2.4, playerPos.z + 0.6);
            group.position.lerp(followTarget, 1 - Math.exp(-2.5 * delta));
            group.position.y += Math.sin(time * 1.8) * 0.004; // gentle idle bob on top of the chase

            core.rotation.y = time * 1.4;
            core.rotation.x = Math.sin(time * 0.7) * 0.25;

            const pulse = 1 + Math.sin(time * 2.2) * 0.08;
            core.scale.setScalar(pulse);
            glowMaterial.opacity = 0.65 + Math.sin(time * 2.2) * 0.15;

            sparkles.forEach((sparkle) => {
                const t = time * 1.6 + sparkle.phase;
                sparkle.mesh.position.set(
                    Math.cos(t) * sparkle.radius,
                    Math.sin(t * 1.3 + sparkle.tilt) * sparkle.radius * 0.6,
                    Math.sin(t) * sparkle.radius
                );
            });
        },
        dispose: () => {
            scene.remove(group);
            coreGeom.dispose();
            coreMaterial.dispose();
            sparkleGeom.dispose();
            sparkleMaterial.dispose();
            glowMaterial.dispose();
            glowTexture.dispose();
        }
    };
};
