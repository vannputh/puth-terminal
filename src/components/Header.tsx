"use client";

import React, { FC } from "react";

const Header: FC = () => {
  return (
    <div className="w-full p-3 md:p-4 border-b-2 border-green-500">
      <h1 className="text-xl md:text-2xl font-bold text-green-400">Suon Vannputhika</h1>
      <p className="text-gray-400 text-sm md:text-base">Software Engineering Student</p>
    </div>
  );
};

export default Header; 