/* components/ParanormalKnob.js (CSP SAFE VERSION) */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .radio-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    position: relative;
  }

  .radio-input input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .knob-container {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .knob {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(145deg, #1a1a2e, #0f0f1a);
    border: 3px solid #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
                inset 0 0 10px rgba(0, 255, 255, 0.1);
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .knob:hover {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5),
                inset 0 0 15px rgba(0, 255, 255, 0.2);
  }

  .knob::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 30px;
    background: #00ffff;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  }

  .knob-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ffff;
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  }

  .intensity-labels {
    display: flex;
    justify-content: space-around;
    width: 140px;
    margin-top: 10px;
    font-size: 0.8rem;
    color: #00ffff;
    text-transform: uppercase;
  }

  .intensity-label {
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  .intensity-label.active {
    opacity: 1;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  }
`;

const ParanormalKnob = ({ intensity = 50, onIntensityChange, disabled, label = "Intensity" }) => {
  const [localIntensity, setLocalIntensity] = useState(intensity);
  
  // Sync local state with prop changes
  useEffect(() => {
    setLocalIntensity(intensity);
  }, [intensity]);
  
  const handleChange = (value) => {
    if (!disabled) {
      setLocalIntensity(value);
      if (onIntensityChange) {
        onIntensityChange(value);
      }
    }
  };

  // Calculate rotation based on intensity (0-100 maps to -135 to 135 degrees)
  const rotation = ((localIntensity / 100) * 270) - 135;

  const handleKnobClick = (e) => {
    if (disabled) return;
    
    const knob = e.currentTarget;
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    // Convert to rotation where top is 0, and ranges from -135 to 135
    // atan2 gives us -180 to 180 where 0 is to the right
    // We want -135 (bottom left) to 135 (bottom right), with 0 at top
    angle = angle + 90; // Rotate so top is 0
    
    // Normalize to -180 to 180 range
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    
    // Clamp to valid knob range (-135 to 135)
    angle = Math.max(-135, Math.min(135, angle));
    
    // Map angle to intensity (0 to 100)
    const newIntensity = ((angle + 135) / 270) * 100;
    
    handleChange(Math.round(newIntensity));
  };

  return (
    <StyledWrapper>
      <div className="radio-input">
        <div className="knob-container">
          <div className="knob" onClick={handleKnobClick} style={{ transform: `rotate(${rotation}deg)` }}>
            <span className="knob-label">{Math.round(localIntensity)}</span>
          </div>
        </div>
        <div className="intensity-labels">
          <span className={`intensity-label ${localIntensity < 33 ? 'active' : ''}`}>Low</span>
          <span className={`intensity-label ${localIntensity >= 33 && localIntensity < 67 ? 'active' : ''}`}>Med</span>
          <span className={`intensity-label ${localIntensity >= 67 ? 'active' : ''}`}>High</span>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default ParanormalKnob;
