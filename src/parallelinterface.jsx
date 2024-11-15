import React, { useState } from 'react';

// Single Button Component
const Button = ({ isOn, onToggle, label }) => (
  <button onClick={onToggle} style={{ margin: '5px', padding: '10px', backgroundColor: isOn ? 'green' : 'gray' }}>
    {label}
  </button>
);

// Single Light Component
const Light = ({ isOn, label }) => (
  <div style={{ margin: '5px', padding: '10px', backgroundColor: isOn ? 'red' : 'black', color: 'white', textAlign: 'center' }}>
    {label}
  </div>
);

// Main App Component
const ParallelInterface = ({portA,portB,portC,setPortA,setPortC}) => {

  // Handlers for each button toggle
  const togglePortAButton = (index) => {
    const newPortA = [...portA];
    newPortA[index] = !newPortA[index];
    setPortA(newPortA);
  };

  const togglePortCButton = (index) => {
    const newButtons = [...portC.buttons];
    newButtons[index] = !newButtons[index];
    setPortC({ ...portC, buttons: newButtons });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>8255 Interface Simulation</h1>

      {/* Port A */}
      <div>
        <h2>Port A - Buttons</h2>
        {portA.map((isOn, index) => (
          <Button key={index} isOn={isOn} label={`A${index + 1}`} onToggle={() => togglePortAButton(index)} />
        ))}
      </div>

      {/* Port B */}
      <div>
        <h2>Port B - Lights</h2>
        {portB.map((isOn, index) => (
          <Light key={index} isOn={isOn} label={`B${index + 1}`} />
        ))}
      </div>

      {/* Port C */}
      <div>
        <h2>Port C - Lights and Buttons</h2>
        <div>
          {portC.lights.map((isOn, index) => (
            <Light key={index} isOn={isOn} label={index<2?`PC${index }`:index==2?`PC3`:index==3?`PC5`:`PC7`} />
          ))}
        </div>
        <div>
          {portC.buttons.map((isOn, index) => (
            <Button key={index} isOn={isOn} label={`PC${(index + 1)*2}`} onToggle={() => togglePortCButton(index)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParallelInterface;
