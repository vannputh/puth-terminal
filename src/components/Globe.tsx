"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";

interface GlobeProps {
  isOpen: boolean;
  onClose: () => void;
}

const Globe: React.FC<GlobeProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-10 bg-black bg-opacity-70 flex items-center justify-center p-2 md:p-4 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-full h-full md:w-4/5 md:h-4/5 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg relative">
        <div className="absolute top-0 left-0 right-0 bg-gray-800 p-2 md:p-3 flex items-center justify-between z-20 rounded-t-lg">
          <div className="flex-grow text-center text-gray-300 text-sm md:text-base font-mono">Globe Viewer</div>
          <button
            onClick={onClose}
            className="text-white font-bold hover:text-gray-400 pr-1 md:pr-2 text-lg md:text-xl touch-manipulation"
            aria-label="Close Globe"
          >
            &times;
          </button>
        </div>
        <Canvas className="pt-10 md:pt-12 touch-manipulation">
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} />
          <Sphere args={[2.5, 32, 32]}>
            <meshStandardMaterial color="#3498db" wireframe />
          </Sphere>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            zoomSpeed={0.5}
            panSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={2}
            maxDistance={10}
            touches={{
              ONE: 2,
              TWO: 1  
            }}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Globe; 