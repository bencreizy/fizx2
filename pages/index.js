import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
// Using mathjs for CSP-compliant math expression evaluation (no eval/Function needed)
import { evaluate } from 'mathjs';

/**
 * LUCA Terminal Interface Component
 * A functional component that provides an interactive terminal interface
 * for the LUCA (Logical Universal Computational Architecture) system
 */
const LucaTerminal = () => {
  // State management for terminal
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([
    {
      id: 0,
      type: 'welcome',
      content: 'Welcome to LUCA Terminal v2.0',
      timestamp: new Date(),
    },
    {
      id: 1,
      type: 'info',
      content: 'Type "help" for available commands',
      timestamp: new Date(),
    },
  ]);
  const [sessionData, setSessionData] = useState({
    user: 'guest',
    sessionId: Math.random().toString(36).substring(7),
    startTime: new Date(),
    commandCount: 0,
  });

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of terminal when new output is added
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Process and execute terminal commands
   */
  const processCommand = (command) => {
    const trimmedCommand = command.trim().toLowerCase();

    if (!trimmedCommand) {
      return;
    }

    // Add command to history
    setCommandHistory([...commandHistory, command]);

    // Add user input to output
    setTerminalOutput((prev) => [
      ...prev,
      {
        id: prev.length,
        type: 'command',
        content: `$ ${command}`,
        timestamp: new Date(),
      },
    ]);

    // Set processing state
    setIsProcessing(true);

    // Simulate command processing delay
    setTimeout(() => {
      let responseContent = '';
      let responseType = 'output';

      // Command parsing and execution
      switch (trimmedCommand) {
        case 'help':
          responseContent = `
Available Commands:
  help              - Display this help message
  clear             - Clear terminal output
  status            - Display system status
  about             - About LUCA Terminal
  time              - Display current time
  whoami            - Display current user
  echo <text>       - Echo text to terminal
  calculate <expr>  - Perform mathematical calculation
  history           - Display command history
  exit              - Exit terminal session
          `.trim();
          responseType = 'info';
          break;

        case 'clear':
          setTerminalOutput([
            {
              id: 0,
              type: 'info',
              content: 'Terminal cleared',
              timestamp: new Date(),
            },
          ]);
          setIsProcessing(false);
          setCurrentInput('');
          return;

        case 'status':
          responseContent = `
System Status Report
====================
CPU Usage: 24%
Memory Usage: 1.2GB / 8GB
Disk Usage: 256GB / 512GB
Network: Connected
Status: Operational
Session ID: ${sessionData.sessionId}
Uptime: ${Math.floor((new Date() - sessionData.startTime) / 1000)}s
          `.trim();
          responseType = 'info';
          break;

        case 'about':
          responseContent = `
LUCA Terminal v2.0
Logical Universal Computational Architecture
=============================================
A modern, interactive terminal interface for system management
and command execution. Built with Next.js and React.

Features:
- Real-time command processing
- Command history tracking
- Session management
- Extensible command framework
          `.trim();
          responseType = 'info';
          break;

        case 'time':
          const now = new Date();
          responseContent = `Current Time: ${now.toISOString()}`;
          responseType = 'info';
          break;

        case 'whoami':
          responseContent = `User: ${sessionData.user}`;
          responseType = 'info';
          break;

        case 'history':
          if (commandHistory.length === 0) {
            responseContent = 'No command history';
          } else {
            responseContent = `Command History:\n${commandHistory
              .map((cmd, idx) => `${idx + 1}. ${cmd}`)
              .join('\n')}`;
          }
          responseType = 'info';
          break;

        case 'exit':
          responseContent = `
Exiting LUCA Terminal...
Session Summary:
- Commands Executed: ${sessionData.commandCount + 1}
- Session Duration: ${Math.floor((new Date() - sessionData.startTime) / 1000)}s
- Session ID: ${sessionData.sessionId}

Thank you for using LUCA Terminal!
          `.trim();
          responseType = 'success';
          break;

        default:
          // Handle echo command
          if (trimmedCommand.startsWith('echo ')) {
            responseContent = trimmedCommand.substring(5);
            responseType = 'output';
          }
          // Handle calculate command
          else if (trimmedCommand.startsWith('calculate ')) {
            try {
              const expression = trimmedCommand.substring(10);
              // Use mathjs for safe evaluation without Function() or eval()
              // This complies with Content Security Policy restrictions
              const result = evaluate(expression);
              responseContent = `Result: ${result}`;
              responseType = 'success';
            } catch (error) {
              responseContent = `Error: Invalid expression - ${error.message}`;
              responseType = 'error';
            }
          } else {
            responseContent = `Command not found: ${command}. Type "help" for available commands.`;
            responseType = 'error';
          }
      }

      // Add response to output
      setTerminalOutput((prev) => [
        ...prev,
        {
          id: prev.length,
          type: responseType,
          content: responseContent,
          timestamp: new Date(),
        },
      ]);

      // Update session data
      setSessionData((prev) => ({
        ...prev,
        commandCount: prev.commandCount + 1,
      }));

      setIsProcessing(false);
      setCurrentInput('');
    }, 300);
  };

  /**
   * Handle command input submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isProcessing && currentInput.trim()) {
      processCommand(currentInput);
    }
  };

  /**
   * Handle keyboard navigation through history
   */
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      e.preventDefault();
      const lastCommand = commandHistory[commandHistory.length - 1];
      setCurrentInput(lastCommand);
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <>
      <Head>
        <title>LUCA Terminal</title>
        <meta name="description" content="LUCA Terminal Interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>LUCA Terminal</h1>
            <p className={styles.subtitle}>
              Logical Universal Computational Architecture
            </p>
          </div>

          <div className={styles.terminalContainer}>
            <div className={styles.terminalHeader}>
              <span className={styles.sessionInfo}>
                Session: {sessionData.sessionId} | User: {sessionData.user}
              </span>
              <span className={styles.commandCount}>
                Commands: {sessionData.commandCount}
              </span>
            </div>

            <div className={styles.terminalOutput}>
              {terminalOutput.map((line) => (
                <div
                  key={line.id}
                  className={`${styles.line} ${styles[line.type]}`}
                >
                  <span className={styles.timestamp}>
                    [{line.timestamp.toLocaleTimeString()}]
                  </span>
                  <span className={styles.content}>
                    {line.content.split('\n').map((text, idx) => (
                      <div key={idx}>{text}</div>
                    ))}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <span className={styles.prompt}>$</span>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Enter command..."
                autoFocus
              />
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Execute'}
              </button>
            </form>
          </div>

          <div className={styles.footer}>
            <p>
              LUCA Terminal v2.0 | Built with Next.js & React | Type 'help' for
              commands
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LucaTerminal;
