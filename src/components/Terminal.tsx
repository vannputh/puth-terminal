"use client";

import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTerminal } from "@/hooks/useTerminal";
import { commandList } from "@/config/commands";

const Globe = dynamic(() => import("./Globe"));

const Terminal = () => {
  const {
    history,
    input,
    isTyping,
    showGlobe,
    terminalRef,
    styledPrompt,
    handleInputChange,
    handleInputKeyDown,
    setShowGlobe,
  } = useTerminal();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  return (
    <>
      <div className="w-full h-full bg-black shadow-lg overflow-hidden flex flex-col">
        <div className="bg-black p-2 text-center flex-shrink-0 border-b-2 border-green-500">
          <div className="mt-2 flex items-center justify-center flex-wrap">
            {commandList.map((cmd, index) => (
              <React.Fragment key={cmd.name}>
                <span className="text-green-400 mx-2 my-1 text-xs">{cmd.name}</span>
                {index < commandList.length - 1 && (
                  <span className="text-gray-400 hidden md:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div
          ref={terminalRef}
          className="p-4 text-white font-mono flex-grow overflow-y-auto"
          onClick={() => document.getElementById("terminal-input")?.focus()}
        >
          <div>
            {history.map((line, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
          {!isTyping && (
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-2" dangerouslySetInnerHTML={{ __html: styledPrompt }}></div>
              <input
                id="terminal-input"
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className="bg-transparent border-none text-white w-full focus:outline-none"
                autoFocus
                disabled={isTyping}
              />
            </div>
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <Globe isOpen={showGlobe} onClose={() => setShowGlobe(false)} />
      </Suspense>
    </>
  );
};

export default Terminal; 