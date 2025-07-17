"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";

interface GlobeProps {
  isOpen: boolean;
  onClose: () => void;
}

const Globe: React.FC<GlobeProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-10 bg-black bg-opacity-70 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-4/5 h-4/5 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg relative">
        <div className="absolute top-0 left-0 right-0 bg-gray-800 p-2 flex items-center justify-between z-20">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full mx-1"></div>
            <div className="text-gray-300 text-sm ml-4">Globe Viewer</div>
          </div>
          <button
            onClick={onClose}
            className="text-white font-bold hover:text-gray-400"
          >
            &times;
          </button>
        </div>
        <Canvas className="pt-10">
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} />
          <Sphere args={[2.5, 32, 32]}>
            <meshStandardMaterial color="#3498db" wireframe />
          </Sphere>
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default React.memo(Globe); 