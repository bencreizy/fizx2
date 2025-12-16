import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .switch {
    position: relative;
    width: 80px;
    height: 120px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .button {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
    transition: 0.4s;
    border-radius: 40px;
    border: 3px solid #ff006e;
    box-shadow: 0 0 20px rgba(255, 0, 110, 0.3),
                inset 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .button:before {
    position: absolute;
    content: "";
    height: 50px;
    width: 50px;
    left: 12px;
    bottom: 10px;
    background: linear-gradient(145deg, #ff006e, #c70058);
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255, 0, 110, 0.5),
                inset 0 0 10px rgba(255, 255, 255, 0.2);
  }

  input:checked + .button {
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
    border-color: #00ffff;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5),
                inset 0 0 15px rgba(0, 0, 0, 0.5);
  }

  input:checked + .button:before {
    transform: translateY(-50px);
    background: linear-gradient(145deg, #00ffff, #00cccc);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.8),
                inset 0 0 10px rgba(255, 255, 255, 0.3);
  }

  .button:hover {
    box-shadow: 0 0 30px rgba(255, 0, 110, 0.5),
                inset 0 0 15px rgba(0, 0, 0, 0.5);
  }

  input:checked + .button:hover {
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.7),
                inset 0 0 20px rgba(0, 0, 0, 0.5);
  }
`;

export default function SystemToggle({ isRunning, onToggle, label }) {
  return (
    <Wrapper>
      <label className="switch">
        <input type="checkbox" checked={isRunning} onChange={onToggle} />
        <div className="button" />
      </label>
    </Wrapper>
  );
}
