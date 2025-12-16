/* components/ProfoundButton.js: Voltage Button (CSP SAFE VERSION) */
import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
    0% { box-shadow: 0 0 10px #ff0066, 0 0 0 0 rgba(255, 0, 102, 0.5); }
    70% { box-shadow: 0 0 10px #ff0066, 0 0 25px 5px rgba(255, 0, 102, 0); }
    100% { box-shadow: 0 0 10px #ff0066, 0 0 0 0 rgba(255, 0, 102, 0.5); }
`;

const StyledWrapper = styled.div`
    .voltage-button { position: relative; }
    .voltage-button button {
        color: white; 
        background: #990033;
        padding: 1rem 1.5rem; 
        border-radius: 5rem;
        border: 5px solid #ff0066; 
        font-size: 1.2rem; 
        cursor: pointer;
        transition: all 0.3s ease;
        animation: none; /* Disables the unsafe, complex SVG/JS animation */
    }
    .voltage-button button:hover {
        background: #bb0044;
        animation: ${pulse} 1.5s infinite;
    }
`;

const ProfoundButton = ({ label, onClick, disabled }) => (
    <StyledWrapper>
        <div className="voltage-button">
            <button onClick={onClick} disabled={disabled}>{label}</button>
            {/* The complex SVG logic is removed entirely to comply with CSP */}
        </div>
    </StyledWrapper>
);

export default ProfoundButton;
