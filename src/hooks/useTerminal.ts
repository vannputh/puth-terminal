"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { commands, commandList } from "@/config/commands";
import { portfolioData } from "@/data/portfolio";
import { closest } from "fastest-levenshtein";

type CommandHandler = (args: string[]) => string | Record<string, any>;

// Function to get real device information
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  
  // Get platform info using modern API or fallback
  let platform = "Unknown";
  
  // Try modern userAgentData API first
  if ('userAgentData' in navigator) {
    const userAgentData = (navigator as any).userAgentData;
    if (userAgentData && userAgentData.platform) {
      platform = userAgentData.platform;
    }
  }
  
  // Fallback to parsing userAgent if modern API not available
  if (platform === "Unknown") {
    if (userAgent.includes("Windows")) {
      platform = "Windows";
    } else if (userAgent.includes("Mac")) {
      platform = "macOS";
    } else if (userAgent.includes("Linux") && !userAgent.includes("Android")) {
      platform = "Linux";
    } else if (userAgent.includes("Android")) {
      platform = "Android";
    } else if (userAgent.includes("iPhone")) {
      platform = "iPhone";
    } else if (userAgent.includes("iPad")) {
      platform = "iPad";
    }
  }
  
  // Detect OS with more detail
  let os = "Unknown OS";
  let kernel = "Unknown";
  let deviceType = "Desktop";
  
  if (userAgent.includes("Windows")) {
    if (userAgent.includes("Windows NT 10.0")) {
      // Both Windows 10 and 11 use NT 10.0, but we can't reliably distinguish them
      // from browser User Agent strings, so we'll default to Windows 10
      os = "Windows 10";
      kernel = "NT 10.0";
    } else if (userAgent.includes("Windows NT 6.3")) {
      os = "Windows 8.1";
      kernel = "NT 6.3";
    } else if (userAgent.includes("Windows NT 6.2")) {
      os = "Windows 8";
      kernel = "NT 6.2";
    } else if (userAgent.includes("Windows NT 6.1")) {
      os = "Windows 7";
      kernel = "NT 6.1";
    } else if (userAgent.includes("Windows NT 6.0")) {
      os = "Windows Vista";
      kernel = "NT 6.0";
    } else {
      os = "Windows";
      kernel = "NT";
    }
  } else if (userAgent.includes("Mac OS X")) {
    const match = userAgent.match(/Mac OS X (\d+_\d+_?\d*)/);
    if (match) {
      const version = match[1].replace(/_/g, '.');
      os = `macOS ${version}`;
      kernel = `Darwin ${version}`;
    } else {
      os = "macOS";
      kernel = "Darwin";
    }
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
    kernel = "Linux";
    if (userAgent.includes("Ubuntu")) os = "Ubuntu";
    else if (userAgent.includes("Fedora")) os = "Fedora";
    else if (userAgent.includes("CentOS")) os = "CentOS";
  } else if (userAgent.includes("Android")) {
    deviceType = "Mobile";
    const match = userAgent.match(/Android (\d+\.?\d*)/);
    if (match) {
      os = `Android ${match[1]}`;
      kernel = `Linux ${match[1]}`;
    } else {
      os = "Android";
      kernel = "Linux";
    }
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    deviceType = userAgent.includes("iPad") ? "Tablet" : "Mobile";
    const match = userAgent.match(/OS (\d+_\d+_?\d*)/);
    if (match) {
      const version = match[1].replace(/_/g, '.');
      os = `iOS ${version}`;
      kernel = `XNU ${version}`;
    } else {
      os = "iOS";
      kernel = "XNU";
    }
  }

  // Detect Browser with more detail
  let shell = "Unknown Browser";
  let terminal = "Web Browser";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    const match = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
    shell = match ? `Chrome ${match[1]}` : "Chrome";
    terminal = "Chromium Engine";
  } else if (userAgent.includes("Firefox")) {
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    shell = match ? `Firefox ${match[1]}` : "Firefox";
    terminal = "Gecko Engine";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    shell = match ? `Safari ${match[1]}` : "Safari";
    terminal = "WebKit Engine";
  } else if (userAgent.includes("Edg")) {
    const match = userAgent.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/);
    shell = match ? `Edge ${match[1]}` : "Edge";
    terminal = "Chromium Engine";
  }

  // Get more detailed screen info
  const resolution = `${screen.width}x${screen.height}`;
  const colorDepth = `${screen.colorDepth}-bit`;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Get memory info (if available)
  let memory = "Unknown";
  let memoryUsed = "Unknown";
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    if (memInfo.totalJSHeapSize && memInfo.usedJSHeapSize) {
      const totalMB = Math.round(memInfo.totalJSHeapSize / 1024 / 1024);
      const usedMB = Math.round(memInfo.usedJSHeapSize / 1024 / 1024);
      memory = `${totalMB} MiB`;
      memoryUsed = `${usedMB} MiB / ${totalMB} MiB`;
    }
  }

  // Get CPU cores
  const cores = navigator.hardwareConcurrency || "Unknown";
  const cpu = cores !== "Unknown" ? `${cores} cores` : "Unknown CPU";

  // Get timezone and locale info
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const languages = navigator.languages ? navigator.languages.join(', ') : language;

  // Calculate uptime (session time)
  const uptime = Math.floor(performance.now() / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  // Detect GPU (basic)
  let gpu = "Unknown GPU";
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && 'getExtension' in gl && 'getParameter' in gl) {
      const webglContext = gl as WebGLRenderingContext;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer) {
          // Clean up the GPU string to extract just the GPU name
          let cleanGpu = renderer.toString();
          
          // Remove ANGLE wrapper info
          if (cleanGpu.includes('ANGLE (')) {
            const match = cleanGpu.match(/ANGLE \([^,]+,\s*([^(]+)/);
            if (match) {
              cleanGpu = match[1].trim();
            }
          }
          
          // Remove device ID and technical details
          cleanGpu = cleanGpu.replace(/\s*\(0x[0-9A-Fa-f]+\).*$/, '');
          cleanGpu = cleanGpu.replace(/\s*Direct3D.*$/, '');
          cleanGpu = cleanGpu.replace(/\s*OpenGL.*$/, '');
          cleanGpu = cleanGpu.replace(/\s*vs_\d+_\d+.*$/, '');
          
          // Add memory info if we can detect it (placeholder for now)
          // Note: WebGL doesn't provide VRAM info, so we'll show a generic format
          if (cleanGpu.includes('RTX') || cleanGpu.includes('GTX')) {
            cleanGpu += ' [Discrete]';
          } else if (cleanGpu.includes('Intel') && cleanGpu.includes('Graphics')) {
            cleanGpu += ' [Integrated]';
          } else if (cleanGpu.includes('AMD') || cleanGpu.includes('Radeon')) {
            cleanGpu += ' [Discrete]';
          }
          
          gpu = cleanGpu || "Unknown GPU";
        }
      }
    }
  } catch (e) {
    gpu = "Unknown GPU";
  }

  return {
    os,
    kernel,
    deviceType,
    shell,
    terminal,
    platform,
    resolution,
    colorDepth,
    pixelRatio,
    memory,
    memoryUsed,
    cpu,
    cores,
    gpu,
    timezone,
    language,
    languages,
    uptime: uptimeStr,
    userAgent: userAgent.length > 100 ? userAgent.substring(0, 100) + "..." : userAgent
  };
};

export const useTerminal = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const typingInterruptRef = useRef(false); // Add ref to track interruption

  const allCommandNames = Object.keys(commands);

  const promptLine1 = `<span class="text-green-400">┌─(</span><span class="text-indigo-500 font-bold">daroh@terminal</span><span class="text-green-400">)-[~]</span>`;
  const promptLine2 = `<span class="text-green-400">└─</span><span class="text-indigo-500">$</span>&nbsp;`;

  const commandHandlers: { [key: string]: CommandHandler } = useMemo(
    () => ({
      help: () =>
        `Available commands:<br>${commandList
          .map((cmd) => `&nbsp;- ${cmd.name}: ${cmd.description}`)
          .join("<br>")}`,
      fastfetch: () => {
        const deviceInfo = getDeviceInfo();
        return {
          type: "fastfetch",
          data: {
            name: portfolioData.fastfetch.name,
            title: portfolioData.fastfetch.title,
            os: deviceInfo.os,
            kernel: deviceInfo.kernel,
            uptime: deviceInfo.uptime,
            shell: deviceInfo.shell,
            terminal: deviceInfo.terminal,
            resolution: deviceInfo.resolution,
            colorDepth: deviceInfo.colorDepth,
            pixelRatio: deviceInfo.pixelRatio,
            cpu: deviceInfo.cpu,
            gpu: deviceInfo.gpu,
            memory: deviceInfo.memory,
            memoryUsed: deviceInfo.memoryUsed,
            deviceType: deviceInfo.deviceType,
            platform: deviceInfo.platform,
            timezone: deviceInfo.timezone,
            language: deviceInfo.language,
            languages: deviceInfo.languages,
            contact: portfolioData.fastfetch.contact,
            art: portfolioData.fastfetch.art
          },
        };
      },
      about: () => portfolioData.about,
      projects: () => {
        const title = `<span class="text-green-400">All Projects</span><br><br>`;
        
        // Regular projects with dates
        const regularProjectsTitle = `<span class="text-yellow-400">Development Projects</span><br>`;
        const projectsList = portfolioData.projects
          .map(
            (p, i) =>
              `&nbsp;&nbsp;<span class="text-cyan-400">${i + 1}. ${
                p.title
              }</span> <span class="text-gray-400">(${p.date})</span><br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;${p.description}<br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-400">Tech:</span> ${p.stack}`
          )
          .join("<br><br>");
        
        // ML projects
        const mlProjectsTitle = `<br><br><span class="text-yellow-400">Machine Learning Projects</span><br>`;
        const mlProjectsList = portfolioData.mlProjects
          .map(
            (p, i) =>
              `&nbsp;&nbsp;<span class="text-cyan-400">${portfolioData.projects.length + i + 1}. ${
                p.title
              }</span><br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;${p.description}<br>` +
              `&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-400">Tech:</span> ${p.stack}`
          )
          .join("<br><br>");
        
        return title + regularProjectsTitle + projectsList + mlProjectsTitle + mlProjectsList;
      },
      skills: () => {
        const title = `<span class="text-green-400">Technical Skills</span><br>`;
        const skillsList = portfolioData.skills
          .map(
            (s) =>
              `&nbsp;&nbsp;<span class="text-yellow-400">${s.category}:</span> ${s.items}`
          )
          .join("<br>");
        return title + skillsList;
      },
      experience: () => portfolioData.experience,
      education: () => portfolioData.education,
      contact: () => portfolioData.contact,
      "launch globe": () => {
        setShowGlobe(true);
        return "Launching globe viewer... Type 'exit' to close, or use the close button.";
      },
      sudo: () => `<span class="text-red">Permission denied.</span> Nice try though! 😄`,
      echo: (args) => args.join(" "),
      date: () => new Date().toString(),
      whoami: () => "daroh@terminal",
      clear: () => {
        setHistory([]);
        return "";
      },
      exit: () => {
        if (showGlobe) {
          setShowGlobe(false);
          return "Closing globe viewer...";
        }
        return "";
      },
    }),
    [showGlobe]
  );

  const processCommand = useCallback(
    async (command: string, currentHistory: any[]) => {
      let output: string | Record<string, any> = "";
      let commandName = command;
      let args: string[] = [];

      if (!commandHandlers[command]) {
        const parts = command.split(" ");
        commandName = parts[0];
        args = parts.slice(1);
      }

      if (commandName === "clear") {
        commandHandlers.clear([]);
        return;
      }

      if (commandHandlers[commandName]) {
        output = commandHandlers[commandName](args);
      } else if (command.trim() !== "") {
        const singleWordCommand = command.split(" ")[0];
        const suggestion = closest(singleWordCommand, allCommandNames);
        let suggestionText = "";
        if (suggestion) {
          suggestionText = `<br>Did you mean '<span class="text-yellow-400">${suggestion}</span>'?`;
        }
        output = `<span class="text-red-400">Command not found: ${singleWordCommand}</span><br>Type 'help' for a list of available commands.${suggestionText}`;
      }

      if (typeof output === "object") {
        setHistory([...currentHistory, output, ""]);
        setIsTyping(false);
      } else if (typeof output === "string") {
        setIsTyping(true);
        typingInterruptRef.current = false; // Reset interrupt flag
        setHistory([...currentHistory, ""]);

        await new Promise((res) => setTimeout(res, 50));

        let typedOutput = "";
        const typingDelay = 1;

        for (let i = 0; i < output.length; i++) {
            // Check for interruption signal
            if (typingInterruptRef.current) {
                setHistory(prevHistory => [...prevHistory, '']);
                setIsTyping(false);
                return;
            }

            const tagMatch = output.substring(i).match(/^<[^>]+>/);
            if (tagMatch) {
                const tag = tagMatch[0];
                typedOutput += tag;
                i += tag.length - 1;
            } else {
                typedOutput += output[i];
            }
            
            setHistory(prevHistory => {
                const newHistory = [...prevHistory];
                newHistory[newHistory.length - 1] = typedOutput;
                return newHistory;
            });

            if (i < output.length - 1) {
                await new Promise((res) => setTimeout(res, typingDelay));
            }
        }
        
        setHistory(prevHistory => [...prevHistory, '']);
        setIsTyping(false);
      }
    },
    [allCommandNames, commandHandlers, showGlobe]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle Ctrl+C with multiple detection methods
      if ((e.ctrlKey && (e.key === "c" || e.key === "C")) || 
          (e.ctrlKey && e.keyCode === 67) ||
          (e.metaKey && (e.key === "c" || e.key === "C"))) {
        e.preventDefault();
        e.stopPropagation();
        // Interrupt current typing or command
        typingInterruptRef.current = true; // Set interrupt flag
        setIsTyping(false);
        const interruptedInput = input ? input : "";
        const newHistory = [
          ...history,
          `${promptLine1}<br>${promptLine2}<span class="text-green-400">${interruptedInput}</span><span class="text-red-400">^C</span>`,
          ""
        ];
        setHistory(newHistory);
        setInput("");
        return;
      }
      
      if (e.key === "Enter" && !isTyping) {
        if (input.trim() === "") {
          setHistory([...history, `${promptLine1}<br>${promptLine2}`, ""]);
          setInput("");
          return;
        }
        const newCommandHistory = [...commandHistory, input];
        setCommandHistory(newCommandHistory);
        setHistoryIndex(newCommandHistory.length);
        const newHistory = [
          ...history,
          `${promptLine1}<br>${promptLine2}<span class="text-green-400">${input}</span>`,
        ];
        processCommand(input.toLowerCase(), newHistory);
        setInput("");
      } else if (e.key === "Tab") {
        e.preventDefault();
        const currentInput = input.trim();
        if (!currentInput) return;

        const matches = allCommandNames.filter((cmd) =>
          cmd.startsWith(currentInput)
        );

        if (matches.length === 1) {
          setInput(matches[0] + " ");
        } else if (matches.length > 1) {
          const newHistory = [
            ...history,
            `${promptLine1}<br>${promptLine2}${input}`,
            matches.join("\u00A0\u00A0"),
          ];
          setHistory(newHistory);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
          setInput(commandHistory[historyIndex - 1]);
        } else if (commandHistory.length > 0) {
          const newIndex = commandHistory.length - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          setHistoryIndex(historyIndex + 1);
          setInput(commandHistory[historyIndex + 1]);
        } else {
          setHistoryIndex(commandHistory.length);
          setInput("");
        }
      }
    },
    [
      allCommandNames,
      commandHistory,
      history,
      historyIndex,
      input,
      isTyping,
      processCommand,
      promptLine1,
      promptLine2,
    ]
  );

  const executeCommand = useCallback(
    (command: string) => {
      const newCommandHistory = [...commandHistory, command];
      setCommandHistory(newCommandHistory);
      setHistoryIndex(newCommandHistory.length);
      const newHistory = [
        ...history,
        `${promptLine1}<br>${promptLine2}<span class="text-green-400">${command}</span>`,
      ];
      processCommand(command.toLowerCase(), newHistory);
      setInput("");
    },
    [commandHistory, history, processCommand, promptLine1, promptLine2]
  );

  useEffect(() => {
    const initialCommand = "welcome";
    const welcomeMessage =
      "Welcome to my portfolio terminal!<br>Type 'help' to see available commands.";
    const newHistory = [
      `${promptLine1}<br>${promptLine2}<span class="text-green-400">${initialCommand}</span>`,
    ];

    const typeMessage = async () => {
      setIsTyping(true);
      typingInterruptRef.current = false; // Reset interrupt flag for welcome message
      setHistory([...newHistory, ""]);

      await new Promise((res) => setTimeout(res, 50));

      let typedOutput = "";
      const typingDelay = 1;

      for (let i = 0; i < welcomeMessage.length; i++) {
        // Check for interruption signal
        if (typingInterruptRef.current) {
          setHistory((prevHistory) => [...prevHistory, ""]);
          setIsTyping(false);
          return;
        }

        const tagMatch = welcomeMessage.substring(i).match(/^<[^>]+>/);
        if (tagMatch) {
          const tag = tagMatch[0];
          typedOutput += tag;
          i += tag.length - 1;
        } else {
          typedOutput += welcomeMessage[i];
        }

        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[newHistory.length - 1] = typedOutput;
          return newHistory;
        });

        if (i < welcomeMessage.length - 1) {
          await new Promise((res) => setTimeout(res, typingDelay));
        }
      }

      setHistory((prevHistory) => [...prevHistory, ""]);
      setIsTyping(false);
    };

    // Add global Ctrl+C listener
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === "c" || e.key === "C")) || 
          (e.ctrlKey && e.keyCode === 67) ||
          (e.metaKey && (e.key === "c" || e.key === "C"))) {
        e.preventDefault();
        e.stopPropagation();
        // Only interrupt if we're in the terminal context
        const isInTerminal = document.activeElement?.id === "terminal-input" || 
                           document.activeElement?.closest('.terminal') ||
                           document.querySelector('.terminal')?.contains(document.activeElement);
        
        if (isInTerminal) {
          typingInterruptRef.current = true; // Set interrupt flag
          setIsTyping(false);
          const currentInput = (document.getElementById('terminal-input') as HTMLInputElement)?.value || "";
          setHistory((prevHistory) => [
            ...prevHistory,
            `${promptLine1}<br>${promptLine2}<span class="text-green-400">${currentInput}</span><span class="text-red-400">^C</span>`,
            ""
          ]);
          setInput("");
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    typeMessage();

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return {
    history,
    input,
    isTyping,
    showGlobe,
    terminalRef,
    promptLine1,
    promptLine2,
    handleInputChange,
    handleInputKeyDown,
    setShowGlobe,
    executeCommand,
  };
}; 