import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";

function AnimatedBlob() {
  return (
    <Sphere args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#5dd6c0"
        attach="material"
        distort={0.5}
        speed={1.5}
        roughness={0.2}
      />
    </Sphere>
  );
}

export default function HeroCanvas() {
  return (
    <div style={{ width: "100%", height: "360px" }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 3]} intensity={1} />
          <AnimatedBlob />
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}