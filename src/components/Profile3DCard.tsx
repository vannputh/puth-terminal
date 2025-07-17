"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, useTexture, Cylinder } from "@react-three/drei";

const Card = () => {
  const texture = useTexture("/profile-photo.jpg");

  return (
    <mesh>
      <boxGeometry args={[3.5, 5, 0.1]} />
      {/* Side materials */}
      <meshStandardMaterial attach="material-0" color="#2d2d2d" />
      <meshStandardMaterial attach="material-1" color="#2d2d2d" />
      <meshStandardMaterial attach="material-2" color="#2d2d2d" />
      <meshStandardMaterial attach="material-3" color="#2d2d2d" />

      {/* Front material with photo */}
      <meshStandardMaterial attach="material-4" map={texture} />

      {/* Back material */}
      <meshStandardMaterial attach="material-5" color="#2d2d2d" />

      {/* Text on the back of the card */}
      <Text
        position={[0, 0.5, -0.06]}
        rotation-y={Math.PI}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Daroh
      </Text>
      <Text
        position={[0, -0.1, -0.06]}
        rotation-y={Math.PI}
        fontSize={0.2}
        color="#ccc"
        anchorX="center"
        anchorY="middle"
      >
        Software Engineer
      </Text>
    </mesh>
  );
};

const Lanyard = () => {
  return (
    <Cylinder args={[0.05, 0.05, 1, 32]} position={[0, 2.9, 0]}>
      <meshStandardMaterial color="#1a1a1a" />
    </Cylinder>
  );
};

const Profile3DCard = () => {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <group>
        <Card />
        <Lanyard />
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2.0}
      />
    </Canvas>
  );
};

export default Profile3DCard; 