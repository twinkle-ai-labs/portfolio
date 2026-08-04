import * as THREE from 'three';

// 격자 해상도·탐색 범위 등 지형 복구 튜닝 값
const CELL = 0.3;               // grid resolution — fine enough that patch edges read as straight
const GRID_HALF = 62;           // the island's max radius (the model spans ±60)
const GRID_N = Math.ceil((GRID_HALF * 2) / CELL);
const FLOOR_CEIL = 8;           // anything higher than this is a roof/awning, not the ground
const PLAY_RADIUS = 58;         // matches the movement clamp in the character controller
const DROP = 0.4;               // a neighbour this much higher counts as "the floor around it"
const MAX_SPAN = 60;            // ≈18 units — how far to look sideways for that floor

export type SampleGroundY = (x: number, z: number) => number | null;

// --- Ground repair: stitch the missing pieces of the street deck back in ------------
// The city model's walkable deck sits at y ≈ 2.25, but whole strips of it are simply
// absent: you either see straight through to the black backing plane or drop onto the
// bare base slab at y = 0. Rather than hand-patching, sample every up-facing triangle
// into a coarse height grid, find the cells that sit well below (or have nothing under)
// the floor surrounding them, and stitch a quad back in at that surrounding height.
export const repairCityGround = (building: any): SampleGroundY => {
    const patchStart = performance.now();

    const cellHeight = new Float32Array(GRID_N * GRID_N).fill(-Infinity);
    const cellCovered = new Uint8Array(GRID_N * GRID_N);
    const gIdx = (i: number, j: number) => j * GRID_N + i;
    const gPos = (i: number) => -GRID_HALF + (i + 0.5) * CELL;

    {
        const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
        const eAB = new THREE.Vector3(), eAC = new THREE.Vector3(), triNormal = new THREE.Vector3();

        building.traverse((child: any) => {
            if (!child.isMesh) return;
            const geometry = child.geometry;
            const posAttr = geometry.attributes.position;
            if (!posAttr) return;
            const index = geometry.index;
            const vertexCount = index ? index.count : posAttr.count;
            const matrix = child.matrixWorld;

            for (let t = 0; t < vertexCount; t += 3) {
                const a = index ? index.getX(t) : t;
                const b = index ? index.getX(t + 1) : t + 1;
                const c = index ? index.getX(t + 2) : t + 2;
                vA.fromBufferAttribute(posAttr, a).applyMatrix4(matrix);
                vB.fromBufferAttribute(posAttr, b).applyMatrix4(matrix);
                vC.fromBufferAttribute(posAttr, c).applyMatrix4(matrix);

                // Only horizontal-ish surfaces down at street level can be "the ground"
                if (Math.min(vA.y, vB.y, vC.y) > FLOOR_CEIL) continue;
                eAB.subVectors(vB, vA);
                eAC.subVectors(vC, vA);
                triNormal.crossVectors(eAB, eAC).normalize();
                if (Math.abs(triNormal.y) < 0.7) continue;

                const iMin = Math.max(0, Math.floor((Math.min(vA.x, vB.x, vC.x) + GRID_HALF) / CELL));
                const iMax = Math.min(GRID_N - 1, Math.floor((Math.max(vA.x, vB.x, vC.x) + GRID_HALF) / CELL));
                const jMin = Math.max(0, Math.floor((Math.min(vA.z, vB.z, vC.z) + GRID_HALF) / CELL));
                const jMax = Math.min(GRID_N - 1, Math.floor((Math.max(vA.z, vB.z, vC.z) + GRID_HALF) / CELL));

                for (let i = iMin; i <= iMax; i++) {
                    const px = gPos(i);
                    for (let j = jMin; j <= jMax; j++) {
                        const pz = gPos(j);
                        // Point-in-triangle on the XZ plane (same-sign edge cross products)
                        const d1 = (px - vB.x) * (vA.z - vB.z) - (vA.x - vB.x) * (pz - vB.z);
                        const d2 = (px - vC.x) * (vB.z - vC.z) - (vB.x - vC.x) * (pz - vC.z);
                        const d3 = (px - vA.x) * (vC.z - vA.z) - (vC.x - vA.x) * (pz - vA.z);
                        if ((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)) continue;

                        // Height of the triangle's plane directly above this cell centre
                        const y = vA.y - (triNormal.x * (px - vA.x) + triNormal.z * (pz - vA.z)) / (triNormal.y || 1e-6);
                        if (y > FLOOR_CEIL) continue;

                        const k = gIdx(i, j);
                        cellCovered[k] = 1;
                        if (y > cellHeight[k]) cellHeight[k] = y;
                    }
                }
            }
        });
    }

    // The dominant surface height inside the play disc IS the walkable deck (y ≈ 2.25 here,
    // covering ~90% of cells) — only cells sunk beneath it are candidates for repair, so
    // plazas and rooftops that legitimately stand above the deck are never touched.
    const levelHist = new Map<number, number>();
    for (let i = 0; i < GRID_N; i++) {
        const px = gPos(i);
        for (let j = 0; j < GRID_N; j++) {
            const pz = gPos(j);
            if (Math.sqrt(px * px + pz * pz) > PLAY_RADIUS) continue;
            const k = gIdx(i, j);
            if (!cellCovered[k]) continue;
            const bucket = Math.round(cellHeight[k] * 20) / 20;
            levelHist.set(bucket, (levelHist.get(bucket) || 0) + 1);
        }
    }
    let deckLevel = 0, deckBest = -1;
    levelHist.forEach((count, y) => {
        if (count > deckBest) { deckBest = count; deckLevel = y; }
    });

    // A sunken/empty cell is repaired when deck-level floor stands above it on ANY side
    // within reach — some of the missing street strips run clear off the island's edge, so
    // demanding floor on opposite flanks would leave those forever black. Growth past the
    // island is bounded twice over: only cells inside PLAY_RADIUS are considered, and the
    // deckLevel guard means genuine upper plazas are never treated as repairs.
    // Patching runs over its own copy of the grid and repeats: a cell whose only immediate
    // neighbour is another hole can only settle at the right height once that neighbour has
    // been filled, so a couple of passes let the correct deck level spread inwards.
    const scanDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const patchHeight = new Float32Array(GRID_N * GRID_N);
    const patched = new Uint8Array(GRID_N * GRID_N);
    const workHeight = Float32Array.from(cellHeight);
    const workCovered = Uint8Array.from(cellCovered);
    const patchCells: number[] = [];

    for (let pass = 0; pass < 4; pass++) {
        const found: Array<number | null> = [null, null, null, null];
        const settled: Array<[number, number]> = [];

        for (let i = 0; i < GRID_N; i++) {
            const px = gPos(i);
            for (let j = 0; j < GRID_N; j++) {
                const pz = gPos(j);
                if (Math.sqrt(px * px + pz * pz) > PLAY_RADIUS) continue;

                const k = gIdx(i, j);
                const here = workCovered[k] ? workHeight[k] : -Infinity;
                if (here > deckLevel - DROP) continue; // already at (or above) the city's deck

                for (let d = 0; d < 4; d++) {
                    const [di, dj] = scanDirs[d];
                    let hit: number | null = null;
                    for (let step = 1; step <= MAX_SPAN; step++) {
                        const ni = i + di * step;
                        const nj = j + dj * step;
                        if (ni < 0 || nj < 0 || ni >= GRID_N || nj >= GRID_N) break;
                        const nk = gIdx(ni, nj);
                        if (!workCovered[nk]) continue;          // a gap — keep looking past it
                        const h = workHeight[nk];
                        if (h > here + DROP) { hit = h; break; } // floor standing above us: a rim
                        if (h < here - DROP) break;              // it only drops further this way
                    }
                    found[d] = hit;
                }

                let hasRim = false;
                for (const h of found) if (h !== null) { hasRim = true; break; }
                if (!hasRim) continue;

                // Settle flush with the lowest surrounding rim so a patch never buries a step
                let fill = Infinity;
                for (const h of found) if (h !== null && h < fill) fill = h;
                if (workCovered[k] && fill <= here + DROP) continue; // already flush with its surroundings
                settled.push([k, fill]);
            }
        }

        if (settled.length === 0) break;
        for (const [k, fill] of settled) {
            if (!patched[k]) patchCells.push(k);
            patched[k] = 1;
            patchHeight[k] = fill;
            workCovered[k] = 1;
            workHeight[k] = fill;
        }
    }

    if (patchCells.length > 0) {
        // Borrow the look of the real deck: rain sample rays across the island, keep only
        // hits landing at deck height, and clone whichever material the deck wears most
        // often (a single lucky ray once hit the black circuit-road and painted every
        // patch pitch black — majority vote can't be fooled like that). Texture maps are
        // left off since their UVs mean nothing on our stitched quads.
        // DoubleSide to match the rest of the city (whose materials are all forced
        // DoubleSide on load) — and so the down-facing ground raycasts can never miss it
        const deckMaterial = new THREE.MeshStandardMaterial({color: 0x2b2f3d, roughness: 0.85, metalness: 0.1, side: THREE.DoubleSide});
        const sampleRay = new THREE.Raycaster();
        const sampleDir = new THREE.Vector3(0, -1, 0);
        const materialVotes = new Map<string, { mat: any; votes: number }>();
        for (let sx = -48; sx <= 48; sx += 12) {
            for (let sz = -48; sz <= 48; sz += 12) {
                if (Math.sqrt(sx * sx + sz * sz) > PLAY_RADIUS) continue;
                sampleRay.set(new THREE.Vector3(sx, 200, sz), sampleDir);
                const hit = sampleRay.intersectObject(building, true)
                    .find((h: any) => Math.abs(h.point.y - deckLevel) < 0.5);
                const hitMat = hit && (Array.isArray((hit.object as any).material) ? (hit.object as any).material[0] : (hit.object as any).material);
                if (!hitMat || !hitMat.color) continue;
                const entry = materialVotes.get(hitMat.uuid);
                if (entry) entry.votes++;
                else materialVotes.set(hitMat.uuid, {mat: hitMat, votes: 1});
            }
        }
        let bestVotes = 0;
        materialVotes.forEach(({mat, votes}) => {
            if (votes > bestVotes) {
                bestVotes = votes;
                deckMaterial.color.copy(mat.color);
                if (typeof mat.roughness === 'number') deckMaterial.roughness = mat.roughness;
                if (typeof mat.metalness === 'number') deckMaterial.metalness = mat.metalness;
            }
        });

        const half = CELL / 2 + 0.004; // hair of overlap so neighbouring quads leave no seam
        const positions = new Float32Array(patchCells.length * 18);
        const normals = new Float32Array(patchCells.length * 18);
        let o = 0;
        for (const k of patchCells) {
            const i = k % GRID_N;
            const j = Math.floor(k / GRID_N);
            const px = gPos(i);
            const pz = gPos(j);
            const y = patchHeight[k];
            // Counter-clockwise seen from above, so the face normal points up (+y)
            const quad = [
                [px - half, y, pz - half], [px + half, y, pz + half], [px + half, y, pz - half],
                [px - half, y, pz - half], [px - half, y, pz + half], [px + half, y, pz + half]
            ];
            for (const [vx, vy, vz] of quad) {
                positions[o] = vx; positions[o + 1] = vy; positions[o + 2] = vz;
                normals[o] = 0; normals[o + 1] = 1; normals[o + 2] = 0;
                o += 3;
            }
        }

        const patchGeometry = new THREE.BufferGeometry();
        patchGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        patchGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        // Built in world space, but parented to the city so every existing raycast (ground
        // probe, wall collision, entrance detection) sees the patches for free
        patchGeometry.applyMatrix4(new THREE.Matrix4().copy(building.matrixWorld).invert());

        const patchMesh = new THREE.Mesh(patchGeometry, deckMaterial);
        patchMesh.name = 'GroundPatch';
        patchMesh.receiveShadow = true;
        building.add(patchMesh);
        building.updateMatrixWorld(true);

        console.log(`Ground repair: patched ${patchCells.length} cells (${(patchCells.length * CELL * CELL).toFixed(0)} sq units) in ${Math.round(performance.now() - patchStart)}ms`);
    }

    // Height of the repaired ground under any point, for scattering fireflies just above it
    return (x: number, z: number): number | null => {
        const i = Math.round((x + GRID_HALF) / CELL - 0.5);
        const j = Math.round((z + GRID_HALF) / CELL - 0.5);
        if (i < 0 || j < 0 || i >= GRID_N || j >= GRID_N) return null;
        const k = gIdx(i, j);
        if (patched[k]) return patchHeight[k];
        return cellCovered[k] ? cellHeight[k] : null;
    };
};
