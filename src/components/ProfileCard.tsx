import React from "react";
import Profile3DCard from "./Profile3DCard";

const ProfileCard = () => {
  return (
    <div className="bg-gray-900 bg-opacity-50 border-2 border-gray-700 rounded-lg shadow-lg text-center h-full flex flex-col justify-center items-center overflow-hidden">
      <div className="w-full h-full">
        <Profile3DCard />
      </div>
    </div>
  );
};

export default ProfileCard; 