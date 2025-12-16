// pages/index.js - Complete LUCA Terminal Interface
import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import styled, { keyframes, css } from 'styled-components';

// Import all components
import ActionButton from '../components/ActionButton'; 
import ProfoundButton from '../components/ProfoundButton'; 
import ParanormalKnob from '../components/ParanormalKnob'; 
import SystemToggle from '../components/SystemToggle'; 

// Cyberpunk glitch animation
const glitch = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  }
  20% {
    text-shadow: 0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e;
  }
  40% {
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  }
  60% {
    text-shadow: 0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e;
  }
  80% {
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1f 0%, #0d1127 50%, #1a0a1f 100%);
  color: #00ffff;
  padding: 2rem;
  font-family: 'Courier New', monospace;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #00ffff;
  padding-bottom: 1rem;
  
  h1 {
    font-size: 3rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.3rem;
    ${css`animation: ${glitch} 3s infinite;`}
  }
  
  p {
    font-size: 1rem;
    color: #ff006e;
    margin: 0.5rem 0 0 0;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: rgba(13, 17, 39, 0.8);
  border: 2px solid ${props => props.$borderColor || '#00ffff'};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 20px ${props => props.$glowColor || 'rgba(0, 255, 255, 0.3)'};
  backdrop-filter: blur(10px);
  
  h2 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    color: ${props => props.$titleColor || '#00ffff'};
    text-align: center;
    border-bottom: 1px solid ${props => props.$borderColor || '#00ffff'};
    padding-bottom: 0.5rem;
  }
`;

const ControlsPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const TerminalPanel = styled(Panel)`
  min-height: 500px;
  display: flex;
  flex-direction: column;
`;

const Terminal = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ffff;
  border-radius: 5px;
  padding: 1rem;
  overflow-y: auto;
  max-height: 400px;
  font-size: 0.9rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-radius: 4px;
  }
`;

const TerminalLine = styled.div`
  margin-bottom: 0.5rem;
  color: ${props => {
    switch(props.type) {
      case 'error': return '#ff006e';
      case 'success': return '#00ff88';
      case 'warning': return '#ffaa00';
      default: return '#00ffff';
    }
  }};
  
  span.timestamp {
    color: #888;
    margin-right: 0.5rem;
  }
`;

const InputArea = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  input {
    flex: 1;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #00ffff;
    border-radius: 5px;
    padding: 0.75rem;
    color: #00ffff;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
    
    &::placeholder {
      color: rgba(0, 255, 255, 0.5);
    }
  }
`;

const StatusPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.$active ? '#00ff88' : '#00ffff'};
  border-radius: 5px;
  
  .label {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.85rem;
  }
  
  .value {
    color: ${props => props.$active ? '#00ff88' : '#ff006e'};
    font-size: 1rem;
    ${props => props.$active && css`animation: ${pulse} 2s infinite;`}
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export default function LucaTerminal() {
  const [isRunning, setIsRunning] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [terminalOutput, setTerminalOutput] = useState([
    { id: 0, type: 'info', content: '=== LUCA SYSTEM INITIALIZED ===', timestamp: new Date() },
    { id: 1, type: 'info', content: 'Logical Universal Computational Architecture v2.0', timestamp: new Date() },
    { id: 2, type: 'info', content: 'All systems nominal. Ready for commands.', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [systemStats, setSystemStats] = useState({
    cycles: 0,
    integrity: 100,
    memoryNodes: 0,
    generation: 0,
  });

  const addTerminalLine = useCallback((content, type = 'info') => {
    setTerminalOutput(prev => [
      ...prev,
      { 
        id: prev.length, 
        type, 
        content, 
        timestamp: new Date() 
      }
    ]);
  }, []);

  const handleToggleSystem = () => {
    setIsRunning(prev => !prev);
    if (!isRunning) {
      addTerminalLine('> SYSTEM ACTIVATED', 'success');
      addTerminalLine('> Initializing memory mesh...', 'info');
      addTerminalLine('> Starting genome evolution...', 'info');
    } else {
      addTerminalLine('> SYSTEM DEACTIVATED', 'warning');
    }
  };

  const handleIntensityChange = (value) => {
    setIntensity(value);
    addTerminalLine(`> Intensity adjusted to ${value}%`, 'info');
  };

  const handleAnalyze = useCallback(() => {
    if (!isRunning) {
      addTerminalLine('> ERROR: System must be active', 'error');
      return;
    }
    addTerminalLine('> Running analysis cycle...', 'info');
    const timeoutId = setTimeout(() => {
      setSystemStats(prev => ({
        ...prev,
        cycles: prev.cycles + 1,
        integrity: Math.max(50, prev.integrity - Math.random() * 5),
        memoryNodes: prev.memoryNodes + Math.floor(Math.random() * 10),
      }));
      addTerminalLine(`> Analysis complete. Intensity factor: ${intensity}%`, 'success');
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [isRunning, intensity, addTerminalLine]);

  const handleCalibrate = useCallback(() => {
    if (!isRunning) {
      addTerminalLine('> ERROR: System must be active', 'error');
      return;
    }
    addTerminalLine('> Calibrating genome parameters...', 'info');
    const timeoutId = setTimeout(() => {
      setSystemStats(prev => ({
        ...prev,
        integrity: Math.min(100, prev.integrity + 20),
        generation: prev.generation + 1,
      }));
      addTerminalLine('> Calibration successful. Integrity restored.', 'success');
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [isRunning, addTerminalLine]);

  const handleExecute = useCallback(() => {
    if (!isRunning) {
      addTerminalLine('> ERROR: System must be active', 'error');
      return;
    }
    if (!inputValue.trim()) {
      addTerminalLine('> ERROR: No command provided', 'error');
      return;
    }
    addTerminalLine(`> EXEC: ${inputValue}`, 'info');
    const timeoutId = setTimeout(() => {
      addTerminalLine(`> Command executed: ${inputValue}`, 'success');
      setInputValue('');
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [isRunning, inputValue, addTerminalLine]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleExecute();
    }
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setSystemStats(prev => ({
          ...prev,
          integrity: Math.max(40, prev.integrity - 0.1),
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <>
      <Head>
        <title>LUCA Terminal - Savior Engine</title>
        <meta name="description" content="Logical Universal Computational Architecture" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Header>
          <h1>LUCA Terminal</h1>
          <p>Savior Engine v2.0 - Cybernetic Interface</p>
        </Header>

        <MainGrid>
          {/* Left Panel - Controls */}
          <ControlsPanel $borderColor="#ff006e" $glowColor="rgba(255, 0, 110, 0.3)" $titleColor="#ff006e">
            <h2>System Controls</h2>
            
            <SystemToggle 
              isRunning={isRunning} 
              onToggle={handleToggleSystem}
              label="System Power"
            />
            
            <ParanormalKnob 
              intensity={intensity}
              onIntensityChange={handleIntensityChange}
              disabled={!isRunning}
              label="Intensity"
            />
            
            <ButtonGroup>
              <ActionButton 
                label="Analyze"
                onClick={handleAnalyze}
                disabled={!isRunning}
              />
              <ProfoundButton 
                label="Calibrate"
                onClick={handleCalibrate}
                disabled={!isRunning}
              />
            </ButtonGroup>
          </ControlsPanel>

          {/* Center Panel - Terminal */}
          <TerminalPanel>
            <h2>System Terminal</h2>
            <Terminal>
              {terminalOutput.map(line => (
                <TerminalLine key={line.id} type={line.type}>
                  <span className="timestamp">
                    [{line.timestamp.toLocaleTimeString()}]
                  </span>
                  {line.content}
                </TerminalLine>
              ))}
            </Terminal>
            <InputArea>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Enter command..."
                disabled={!isRunning}
              />
              <ActionButton 
                label="Execute"
                onClick={handleExecute}
                disabled={!isRunning}
              />
            </InputArea>
          </TerminalPanel>

          {/* Right Panel - Status */}
          <StatusPanel $borderColor="#00ff88" $glowColor="rgba(0, 255, 136, 0.3)" $titleColor="#00ff88">
            <h2>System Status</h2>
            
            <StatusItem $active={isRunning}>
              <span className="label">Status</span>
              <span className="value">{isRunning ? 'ONLINE' : 'OFFLINE'}</span>
            </StatusItem>
            
            <StatusItem $active={systemStats.integrity > 70}>
              <span className="label">Integrity</span>
              <span className="value">{systemStats.integrity.toFixed(1)}%</span>
            </StatusItem>
            
            <StatusItem $active={isRunning}>
              <span className="label">Cycles</span>
              <span className="value">{systemStats.cycles}</span>
            </StatusItem>
            
            <StatusItem $active={systemStats.memoryNodes > 0}>
              <span className="label">Memory Nodes</span>
              <span className="value">{systemStats.memoryNodes}</span>
            </StatusItem>
            
            <StatusItem $active={isRunning}>
              <span className="label">Generation</span>
              <span className="value">{systemStats.generation}</span>
            </StatusItem>
            
            <StatusItem $active={isRunning}>
              <span className="label">Intensity</span>
              <span className="value">{intensity}%</span>
            </StatusItem>
          </StatusPanel>
        </MainGrid>
      </Container>
    </>
  );
}
