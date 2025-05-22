import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, XCircle } from 'lucide-react';

interface ConsoleEntry {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const CommandConsole: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<ConsoleEntry[]>([
    { 
      type: 'output', 
      content: 'Welcome to Plank.Dev Command Console v1.2.0', 
      timestamp: new Date() 
    },
    { 
      type: 'output', 
      content: 'Type "help" for a list of available commands.', 
      timestamp: new Date() 
    }
  ]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [history]);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add command to history
    const newEntry: ConsoleEntry = {
      type: 'input',
      content: command,
      timestamp: new Date()
    };
    
    setHistory([...history, newEntry]);
    
    // Process command
    processCommand(command);
    
    // Clear input
    setCommand('');
  };
  
  const processCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();
    
    setTimeout(() => {
      let response: ConsoleEntry;
      
      if (lowerCmd === 'help') {
        response = {
          type: 'output',
          content: 'Available commands:\n  - help: Show this help message\n  - clear: Clear console\n  - status: Check server status\n  - restart: Simulate device restart\n  - uptime: Show system uptime',
          timestamp: new Date()
        };
      } else if (lowerCmd === 'clear') {
        setHistory([]);
        return;
      } else if (lowerCmd === 'status') {
        response = {
          type: 'output',
          content: 'All systems operational. 5 devices online, 1 in warning state, 1 offline.',
          timestamp: new Date()
        };
      } else if (lowerCmd === 'restart') {
        response = {
          type: 'output',
          content: 'Initiating restart sequence...\nSending restart signal...\nWaiting for confirmation...\nDevice restart completed successfully.',
          timestamp: new Date()
        };
      } else if (lowerCmd === 'uptime') {
        response = {
          type: 'output',
          content: 'System uptime: 15 days, 7 hours, 23 minutes',
          timestamp: new Date()
        };
      } else {
        response = {
          type: 'error',
          content: `Command not recognized: "${cmd}". Type "help" for available commands.`,
          timestamp: new Date()
        };
      }
      
      setHistory(prev => [...prev, response]);
    }, 500);
  };
  
  const clearConsole = () => {
    setHistory([]);
  };
  
  const copyToClipboard = () => {
    const text = history.map(entry => 
      `[${entry.timestamp.toLocaleTimeString()}] ${entry.type === 'input' ? '>' : ''} ${entry.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
  };
  
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg shadow-md h-[400px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg border-b border-gray-700">
        <h3 className="font-medium">Command Console</h3>
        <div className="flex space-x-2">
          <button 
            onClick={copyToClipboard}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            title="Copy console output"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={clearConsole}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            title="Clear console"
          >
            <XCircle size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-start">
              <span className="text-xs text-gray-500 mr-2 min-w-[60px]">
                {entry.timestamp.toLocaleTimeString()}
              </span>
              {entry.type === 'input' && <span className="text-blue-400 mr-2">&gt;</span>}
              <span className={`
                ${entry.type === 'input' ? 'text-white font-semibold' : ''}
                ${entry.type === 'error' ? 'text-red-400' : ''}
                ${entry.type === 'output' ? 'text-green-400' : ''}
              `}>
                {formatContent(entry.content)}
              </span>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700">
        <div className="flex items-center bg-gray-800 rounded px-3 py-2">
          <span className="text-blue-400 mr-2">&gt;</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white"
            placeholder="Type a command..."
          />
          <button 
            type="submit"
            className="ml-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommandConsole;