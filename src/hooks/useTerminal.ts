"use client";

import { useState, useEffect, useRef } from "react";
import { commands, commandList } from "@/config/commands";
import { portfolioData } from "@/data/portfolio";
import { closest } from "fastest-levenshtein";

type CommandHandler = (args: string[]) => string;

export const useTerminal = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const allCommandNames = Object.keys(commands);

  const styledPrompt = `<span class="text-green-400">daroh@portfolio-os</span><span class="text-gray-400">:</span><span class="text-blue-400">~</span><span class="text-gray-400">$</span>`;

  useEffect(() => {
    const welcomeMessage = [
      "Welcome to Daroh OS!",
      "Type 'help' to see the full list of commands.",
    ];
    setHistory(welcomeMessage);
  }, []);

  const commandHandlers: { [key: string]: CommandHandler } = {
    help: () => `Available commands:<br>${commandList.map((cmd) => `&nbsp;- ${cmd.name}: ${cmd.description}`).join("<br>")}`,
    fastfetch: () => {
      const { name, title, os, shell, packages, editor, contact, art } = portfolioData.fastfetch;
      return `
        <div class="flex">
          <div class="w-1/2 pr-4">${art.replace('class="text-green-400"', 'class="text-primary"')}</div>
          <div class="w-1/2">
            <p><span class="text-primary">${name}@${os}</span></p>
            <p>------------------</p>
            <p><span class="text-accent">Title:</span> ${title}</p>
            <p><span class="text-accent">OS:</span> ${os}</p>
            <p><span class="text-accent">Shell:</span> ${shell}</p>
            <p><span class="text-accent">Packages:</span> ${packages}</p>
            <p><span class="text-accent">Editor:</span> ${editor}</p>
            <br>
            <p><span class="text-accent">Contact:</span></p>
            <p>&nbsp;&nbsp;<span class="text-secondary">Email:</span> <a href="mailto:${contact.email}" class="hover:underline">${contact.email}</a></p>
            <p>&nbsp;&nbsp;<span class="text-secondary">GitHub:</span> <a href="https://github.com/${contact.github}" target="_blank" class="hover:underline">${contact.github}</a></p>
            <p>&nbsp;&nbsp;<span class="text-secondary">LinkedIn:</span> <a href="https://linkedin.com/in/${contact.linkedin}" target="_blank" class="hover:underline">${contact.linkedin}</a></p>
          </div>
        </div>
      `;
    },
    about: () => portfolioData.about,
    projects: () => portfolioData.projects,
    skills: () => portfolioData.skills,
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
    whoami: () => "daroh@portfolio-os",
    clear: () => {
      // This is handled specially in processCommand
      return "";
    },
    exit: () => {
        if (showGlobe) {
            setShowGlobe(false);
            return "Closing globe viewer...";
        }
        return "";
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const processCommand = async (command: string, currentHistory: string[]) => {
    let output = "";
    let commandName = command;
    let args: string[] = [];

    // Check if the full command is a registered command
    if (!commandHandlers[command]) {
      // If not, it might be a command with arguments
      const parts = command.split(" ");
      commandName = parts[0];
      args = parts.slice(1);
    }

    if (commandName === 'clear') {
        setHistory([]);
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

    if (output) {
      if (commandName === 'fastfetch' || command === 'fastfetch') {
        setHistory([...currentHistory, output]);
      } else {
        setIsTyping(true);
        // Add a placeholder for the output
        setHistory([...currentHistory, ""]); 

        await new Promise((res) => setTimeout(res, 50));

        let typedOutput = "";
        const typingDelay = 1;

        for (let i = 0; i < output.length; i++) {
            const tagMatch = output.substring(i).match(/^<[^>]+>/);
            if (tagMatch) {
                const tag = tagMatch[0];
                typedOutput += tag;
                i += tag.length - 1;
            } else {
                typedOutput += output[i];
            }
            
            // Update only the last line in the history
            setHistory(prevHistory => {
                const newHistory = [...prevHistory];
                newHistory[newHistory.length - 1] = typedOutput;
                return newHistory;
            });

            if (i < output.length - 1) {
                await new Promise((res) => setTimeout(res, typingDelay));
            }
        }
        setIsTyping(false);
      }
    } else {
        setHistory(currentHistory);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isTyping) {
      const prompt = styledPrompt;
      if (input.trim() === "") {
        setHistory([...history, prompt]);
        return;
      }
      const newCommandHistory = [...commandHistory, input];
      setCommandHistory(newCommandHistory);
      setHistoryIndex(newCommandHistory.length);
      const newHistory = [...history, `${styledPrompt}&nbsp;${input}`];
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
          `${styledPrompt}&nbsp;${input}`,
          matches.join("&nbsp;&nbsp;"),
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
  };

  return {
    history,
    input,
    isTyping,
    showGlobe,
    terminalRef,
    styledPrompt,
    handleInputChange,
    handleInputKeyDown,
    setShowGlobe,
  };
}; 