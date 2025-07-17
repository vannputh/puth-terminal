"use client";

import React from "react";

const commands = [
  "help",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "contact",
  "clear",
  "launch globe",
];

const Header = () => {
  return (
    <div className="w-full text-center p-2 mb-4 border-b-2 border-green-500">
      <nav className="flex items-center justify-center flex-wrap">
        {commands.map((cmd, index) => (
          <React.Fragment key={cmd}>
            <span className="text-green-400 mx-2 my-1">{cmd}</span>
            {index < commands.length - 1 && (
              <span className="text-gray-600 hidden md:inline">|</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default Header; 