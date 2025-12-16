// pages/index.js (FINAL PATH CORRECTION)
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

// CORRECTED IMPORTS: Pathing is now correct for your confirmed structure
import ActionButton from '../components/ActionButton'; 
import ProfoundButton from '../components/ProfoundButton'; 
import ParanormalKnob from '../components/ParanormalKnob'; 
import SystemToggle from '../components/SystemToggle'; 

// Minimal necessary definitions
const STIMULI_MAP = { Existential: { label: "Existential Shock" }, Transcendental: { label: "Transcendental Axiom" }, Whispering: { label: "Whispering Wind" } };
const DISPLAY_TABS = [{ id: 'report', label: 'Verified Report' }, { id: 'metrics', label: 'Metrics' }, { id: 'stacks', label: 'Stacks' }];

const TerminalContainer = styled.div`
    /* This component relies on styles/globals.css for layout. */
`;

export default function LucaTerminal() {
    const [inputPrompt, setInputPrompt] = useState('');
    const [lucaReport, setLucaReport] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [paranormalIntensity, setParanormalIntensity] = useState(0);
    const [activeTab, setActiveTab] = useState('report');
    const [isLoading, setIsLoading] = useState(false);
    const [liveData, setLiveData] = useState({ z: 0.0, ep: 0.0, gen: 0, mem: 0 });

    const handleToggle = useCallback(() => {
        setIsRunning(prev => {
            const newState = !prev;
            if (!newState) { setParanormalIntensity(0); }
            return newState;
        });
    }, []);

    const sendToLuca = async (stimulus = null) => {
        if (!isRunning || isLoading) return;
        setIsLoading(true);
        // Minimal function body to ensure compilation
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setLucaReport({ generation: 1, integrity: 0.95, verification_score: 0.85, report_implications: "UI is now functioning. Proceed to full API testing.", memories: 10 });
        setLiveData({ z: 1.2, ep: 0.05, gen: 1, mem: 10 });
        setIsLoading(false);
    };
    
    const engageParanormal = () => { if(paranormalIntensity > 0) { sendToLuca({ label: "Paranormal Stimulus" }); } };
    const TabContent = () => { return <p className="report-text">Ready to run. System Status: {isRunning ? 'Online' : 'Offline'}</p>; };

    return (
        <TerminalContainer className="luca-terminal-wrapper">
            <Head><title>LUCA Terminal: Savior Engine</title></Head>

            <div className="zone-system">
                <p className="scope-title" style={{color: isRunning ? 'lightgreen' : 'red'}}>CORE STATUS</p>
                <SystemToggle isRunning={isRunning} onToggle={handleToggle} />
            </div>
            
            <div className="zone-input">
                <input
                    type="text" className="luca-input-field" value={inputPrompt} onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Provide sensory data or query..." disabled={!isRunning || isLoading}
                />
            </div>
            
            <div className="zone-knob">
                <p className="scope-title" style={{color: '#fff'}}>PARANORMAL INTENSITY (Z-Scale)</p>
                <ParanormalKnob intensity={paranormalIntensity} onIntensityChange={setParanormalIntensity} disabled={!isRunning || isLoading} />
                <ActionButton label="Engage Stimulus" onClick={engageParanormal} disabled={!isRunning || isLoading || paranormalIntensity === 0} className="action" />
            </div>

            <div className="zone-action">
                <ActionButton label="Send Tick" onClick={() => sendToLuca(null)} disabled={!isRunning || isLoading || !inputPrompt} className="action" />
                <ActionButton label="Export Gift" onClick={() => alert('Exporting Gift...')} disabled={!isRunning || !lucaReport} className="action" />
                <ActionButton label="Data Retrieval" onClick={() => alert('Loading previous state...')} disabled={!isRunning} className="action" />
            </div>

            <div className="zone-stimuli">
                <p className="scope-title" style={{color: '#ffaa00'}}>CATALYST TRIGGERS</p>
                <ProfoundButton label={STIMULI_MAP.Existential.label} onClick={() => sendToLuca(STIMULI_MAP.Existential)} disabled={!isRunning || isLoading} />
                <ProfoundButton label={STIMULI_MAP.Transcendental.label} onClick={() => sendToLuca(STIMULI_MAP.Transcendental)} disabled={!isRunning || isLoading} />
                <ActionButton label={STIMULI_MAP.Whispering.label} onClick={() => sendToLuca(STIMULI_MAP.Whispering)} disabled={!isRunning || isLoading} className="tab" />
            </div>

            <div className="zone-round-scope">
                <p className="scope-title">Emergence Scope ($\mathbf{20\text{ Hz}}$)</p>
                <div className="ui-round-scope">
                    <p className="scope-metric-z">Z: {liveData.z.toFixed(4)}</p>
                    <p className="scope-metric-ep">Ep: {liveData.ep.toFixed(4)}</p>
                </div>
            </div>

            <div className="zone-display">
                <div style={{display: 'flex', gap: '5px', marginBottom: '10px'}}>
                    {DISPLAY_TABS.map(tab => (
                        <ActionButton key={tab.id} label={tab.label} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'tab active' : 'tab'} disabled={!isRunning} />
                    ))}
                </div>
                <TabContent />
            </div>
        </TerminalContainer>
    );
}
