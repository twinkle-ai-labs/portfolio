import React, {useEffect, useRef} from 'react';
import {
    Color4,
    Engine,
    EngineOptions,
    HemisphericLight,
    Scene,
    SceneLoader,
    SceneOptions,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";

import "@babylonjs/loaders";
import "@babylonjs/loaders/glTF";

interface IBabylonInterface {
    rootUrl: string,
    sceneFileName: string
    engineOptions?: EngineOptions
    sceneOptions?: SceneOptions
    onSceneReady?: (scene: Scene) => {}
    onRender?: (scene: Scene) => {}
    onMeshLoaded?: (result: any) => void
    characterUrl?: string
    characterFileName?: string
}

const Babylon = (props: IBabylonInterface) => {
    const reactCanvas = useRef(null);

    useEffect(() => {
        const {current: canvas} = reactCanvas;

        if (!canvas) return;

        const engine = new Engine(
            canvas,
            true,
            props.engineOptions,
            true
        );

        const createScene = (canvas: HTMLCanvasElement) => {
            const scene = new Scene(engine);
            scene.clearColor = new Color4(0, 0, 0, 0);

            const target = new Vector3(0, 0, 0);
            const camera = new UniversalCamera("Camera", new Vector3(0, 5, -10), scene);
            camera.setTarget(target);
            camera.attachControl(canvas, true);

            // Add a basic light
            const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
            light.intensity = 0.7;

            // Import Background Night Sky
            SceneLoader.ImportMeshAsync(
                null,
                props.rootUrl,
                props.sceneFileName,
                scene
            ).then(result => {
                const newMeshes = result.meshes
                newMeshes[0].position.y = 0;
                newMeshes[0].scaling = new Vector3(80, 80, 80);
                newMeshes[0].isPickable = false;

                canvas.className = 'babylon-canvas babylon-loaded';
                props.onMeshLoaded?.(result);
            });

            // Import Character if provided
            if (props.characterUrl && props.characterFileName) {
                SceneLoader.ImportMeshAsync(
                    null,
                    props.characterUrl,
                    props.characterFileName,
                    scene
                ).then(result => {
                    const { meshes, skeletons } = result;
                    const hero = meshes[0];
                    hero.scaling.scaleInPlace(0.05);
                    hero.position = new Vector3(0, 0, 0);

                    if (skeletons && skeletons.length > 0) {
                        const skeleton = skeletons[0];
                        const walkRange = skeleton.getAnimationRange("YBot_Walk");
                        const idleRange = skeleton.getAnimationRange("YBot_Idle");
                        
                        if (idleRange) {
                            scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
                        }

                        // Simple random movement
                        let isMoving = false;
                        scene.onBeforeRenderObservable.add(() => {
                            if (!isMoving && Math.random() < 0.005) {
                                isMoving = true;
                                const randomX = (Math.random() - 0.5) * 20;
                                const randomZ = (Math.random() - 0.5) * 20;
                                const targetPos = new Vector3(randomX, 0, randomZ);
                                
                                // Look at target
                                hero.lookAt(targetPos);
                                
                                if (walkRange) {
                                    scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
                                }

                                const moveInterval = setInterval(() => {
                                    const diff = targetPos.subtract(hero.position);
                                    if (diff.length() < 0.1) {
                                        clearInterval(moveInterval);
                                        isMoving = false;
                                        if (idleRange) {
                                            scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
                                        }
                                    } else {
                                        hero.position.addInPlace(diff.normalize().scale(0.05));
                                    }
                                }, 16);
                            }
                        });
                    }
                });
            }

            return scene
        }

        const scene = createScene(canvas);
        if (scene.isReady()) {
            props.onSceneReady?.(scene);
        } else {
            scene.onReadyObservable.addOnce((scene) => props.onSceneReady?.(scene));
        }

        engine.runRenderLoop(() => {
            scene.render();
            props.onRender?.(scene);
        });

        const resize = () => {
            scene.getEngine().resize();
        };

        if (window) {
            window.addEventListener("resize", resize);
        }

        return () => {
            engine.dispose();

            if (window) {
                window.removeEventListener("resize", resize);
            }
        };
    }, [props.sceneOptions, props.onRender, props.onSceneReady, props]);
    return (
        <canvas ref={reactCanvas} className="babylon-canvas"/>
    );
};

export default Babylon;
