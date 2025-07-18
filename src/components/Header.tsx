"use client";

import React from "react";
import { portfolioData } from "@/data/portfolio";

const Header = () => {
  const { name, title } = portfolioData.fastfetch;

  return (
    <div className="w-full p-4 border-b-2 border-green-500">
      <h1 className="text-2xl font-bold text-green-400">{name}</h1>
      <p className="text-gray-400">{title}</p>
    </div>
  );
};

export default Header; 