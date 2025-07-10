"use client";

import React, { useState, useEffect, useRef } from "react";
import Globe from "./Globe";

const Terminal = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    help: "Show available commands",
    about: "Learn about me",
    projects: "View my projects",
    skills: "See my technical skills",
    experience: "View my work experience",
    education: "See my education background",
    contact: "Get my contact information",
    clear: "Clear the terminal",
    "launch globe": "Launch 3D globe viewer",
    sudo: "Try to get root access (just for fun)",
    echo: "Echo back your text",
    date: "Show current date and time",
    whoami: "Display current user",
  };
  const commandList = Object.keys(commands);

  const styledPrompt = `<span class="text-green-400">guest@daroh-os</span><span class="text-gray-400">:</span><span class="text-blue-400">~</span><span class="text-gray-400">$</span>`;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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

      const matches = commandList.filter((cmd) =>
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

  const processCommand = async (command: string, currentHistory: string[]) => {
    if (command === "clear") {
      setHistory([]);
      return;
    }

    let output = "";
    
    // Handle exit command when globe is showing
    if (showGlobe && command === "exit") {
      setShowGlobe(false);
      output = "Closing globe viewer...";
    } else if (command === "launch globe") {
      setShowGlobe(true);
      output =
        "Launching globe viewer... Type 'exit' to close, or use the close button.";
    } else if (command === "help") {
      output = `Available commands:<br>${commandList
        .map((cmd) => `&nbsp;- ${cmd}: ${commands[cmd as keyof typeof commands]}`)
        .join("<br>")}`;
    } else if (command === "about") {
      output = `<span class="text-green-400">About Me</span><br>
      My name is Daroh. I'm a passionate full-stack developer with expertise in modern web technologies.<br>
      I love building interactive and user-friendly applications that make a difference.<br><br>
      Type 'skills' to see my technical skills or 'projects' to view my work.`;
    } else if (command === "skills") {
      output = `<span class="text-green-400">Technical Skills</span><br>
      <span class="text-yellow-400">Languages:</span> JavaScript, TypeScript, Python, Java<br>
      <span class="text-yellow-400">Frontend:</span> React, Next.js, Vue.js, Tailwind CSS<br>
      <span class="text-yellow-400">Backend:</span> Node.js, Express, Django, Spring Boot<br>
      <span class="text-yellow-400">Database:</span> PostgreSQL, MongoDB, Redis<br>
      <span class="text-yellow-400">Tools:</span> Git, Docker, AWS, CI/CD`;
    } else if (command === "experience") {
      output = `<span class="text-green-400">Work Experience</span><br>
      <span class="text-yellow-400">Software Engineer @ Tech Company</span><br>
      2022 - Present<br>
      - Developed scalable web applications<br>
      - Led frontend architecture decisions<br>
      - Mentored junior developers<br><br>
      <span class="text-yellow-400">Full Stack Developer @ Startup</span><br>
      2020 - 2022<br>
      - Built MVP from scratch<br>
      - Implemented CI/CD pipelines<br>
      - Worked directly with clients`;
    } else if (command === "education") {
      output = `<span class="text-green-400">Education</span><br>
      <span class="text-yellow-400">Bachelor of Science in Computer Science</span><br>
      University Name, 2016 - 2020<br>
      - GPA: 3.8/4.0<br>
      - Dean's List<br>
      - Computer Science Society President`;
    } else if (command === "projects") {
      output = `<span class="text-green-400">Featured Projects</span><br>
      <span class="text-yellow-400">1. E-Commerce Platform</span><br>
      - Full-stack application with React and Node.js<br>
      - Integrated payment processing and inventory management<br>
      - <a href="#" class="text-blue-400 hover:underline">View Project →</a><br><br>
      <span class="text-yellow-400">2. Real-time Chat Application</span><br>
      - WebSocket-based chat with React and Socket.io<br>
      - End-to-end encryption and file sharing<br>
      - <a href="#" class="text-blue-400 hover:underline">View Project →</a><br><br>
      <span class="text-yellow-400">3. AI-Powered Task Manager</span><br>
      - Next.js app with OpenAI integration<br>
      - Smart task prioritization and scheduling<br>
      - <a href="#" class="text-blue-400 hover:underline">View Project →</a>`;
    } else if (command === "contact") {
      output = `<span class="text-green-400">Contact Information</span><br>
      <span class="text-yellow-400">Email:</span> <a href='mailto:your.email@example.com' class='text-blue-400 hover:underline'>your.email@example.com</a><br>
      <span class="text-yellow-400">GitHub:</span> <a href='https://github.com/yourusername' class='text-blue-400 hover:underline' target='_blank'>github.com/yourusername</a><br>
      <span class="text-yellow-400">LinkedIn:</span> <a href='https://linkedin.com/in/yourusername' class='text-blue-400 hover:underline' target='_blank'>linkedin.com/in/yourusername</a><br>
      <span class="text-yellow-400">Twitter:</span> <a href='https://twitter.com/yourusername' class='text-blue-400 hover:underline' target='_blank'>@yourusername</a>`;
    } else if (command === "sudo" || command.startsWith("sudo ")) {
      output = `<span class="text-red-400">Permission denied.</span> Nice try though! 😄`;
    } else if (command.startsWith("echo ")) {
      output = command.substring(5);
    } else if (command === "echo") {
      output = "";
    } else if (command === "date") {
      output = new Date().toString();
    } else if (command === "whoami") {
      output = "guest@daroh-os";
    } else if (command === "") {
      setHistory(currentHistory);
      return;
    } else {
      output = `<span class="text-red-400">Command not found: ${command}</span><br>Type 'help' for a list of available commands.`;
    }

    setIsTyping(true);
    setHistory(currentHistory);

    await new Promise((res) => setTimeout(res, 50));

    let typedOutput = "";
    const typingDelay = 10;

    for (let i = 0; i < output.length; i++) {
      const tagMatch = output.substring(i).match(/^<[^>]+>/);
      if (tagMatch) {
        const tag = tagMatch[0];
        typedOutput += tag;
        i += tag.length - 1;
      } else {
        typedOutput += output[i];
      }

      setHistory([...currentHistory, typedOutput]);

      if (i < output.length - 1) {
        await new Promise((res) => setTimeout(res, typingDelay));
      }
    }

    setIsTyping(false);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <>
      <div className="w-full h-[80vh] bg-black border-2 border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 p-2 flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mx-1"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-1"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full mx-1"></div>
          <div className="text-gray-300 text-sm ml-4">Daroh OS</div>
        </div>
        <div
          ref={terminalRef}
          className="p-4 text-white font-mono h-full overflow-y-auto"
          onClick={() => document.getElementById("terminal-input")?.focus()}
        >
          <div>
            {history.map((line, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
          {!isTyping && (
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-2">
                <span className="text-green-400">guest@daroh-os</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400">$</span>
              </div>
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
      {showGlobe && <Globe onClose={() => setShowGlobe(false)} />}
    </>
  );
};

export default Terminal; 