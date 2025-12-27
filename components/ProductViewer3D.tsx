'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { Skeleton } from './ui';

interface ProductViewer3DProps {
    modelUrl: string;
    fallbackImage?: string;
}

function Model({ url }: { url: string }) {
    const gltf = useLoader(GLTFLoader, url);
    const modelRef = useRef<THREE.Group>(null);

    // Auto-rotate when not interacting
    useFrame((state) => {
        if (modelRef.current) {
            modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={gltf.scene}
            scale={1}
            position={[0, -0.5, 0]}
        />
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 0.3, 2]} />
            <meshStandardMaterial color="#e2e8f0" wireframe />
        </mesh>
    );
}

export function ProductViewer3D({ modelUrl, fallbackImage }: ProductViewer3DProps) {
    if (!modelUrl) {
        return fallbackImage ? (
            <div className="w-full h-full relative">
                <img
                    src={fallbackImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                />
            </div>
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--gray-100)]">
                <p className="text-[var(--gray-500)]">No 3D model available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[400px] bg-gradient-to-b from-[var(--gray-50)] to-white rounded-[var(--radius-xl)] overflow-hidden">
            <Canvas
                camera={{ position: [0, 1, 4], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <PresentationControls
                    global
                    config={{ mass: 2, tension: 500 }}
                    snap={{ mass: 4, tension: 1500 }}
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                >
                    <Suspense fallback={<LoadingFallback />}>
                        <Model url={modelUrl} />
                    </Suspense>
                </PresentationControls>

                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={4}
                />

                <Environment preset="city" />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={8}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>

            {/* Controls Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                Drag to rotate • Scroll to zoom
            </div>
        </div>
    );
}

// Wrapper component with loading state
export function ProductViewer3DWithLoader({ modelUrl, fallbackImage }: ProductViewer3DProps) {
    return (
        <Suspense
            fallback={
                <div className="w-full h-full min-h-[400px] flex items-center justify-center">
                    <Skeleton width="100%" height="100%" />
                </div>
            }
        >
            <ProductViewer3D modelUrl={modelUrl} fallbackImage={fallbackImage} />
        </Suspense>
    );
}
