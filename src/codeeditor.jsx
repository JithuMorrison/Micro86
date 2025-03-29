// CodeEditor.js
import "./App.css"
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';



const CodeEditor = ({code,setCode,handleSubmit,handleInter,model,setModel}) => {

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
      <div>
          <div className="button-row">
          <select
            style={{padding: "10px 15px",fontSize: "16px",borderRadius: "5px",border: "1px solid #ccc",backgroundColor: "#fff",color: "#333",appearance: "none",WebkitAppearance: "none",MozAppearance: "none",backgroundImage:"url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%233498db' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5L8 12l6.5-6.5h-13z'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",backgroundPosition: "right 10px center",backgroundSize: "16px 16px",width: "220px",cursor: "pointer",}}
            value={model} // Bind dropdown value to state
            onChange={(e) => setModel(e.target.value)} >
            <option value="dac">
              DAC
            </option>
            <option value="parallel_interface">Parallel Interface</option>
            <option value="keyboard_display">keyboard Display Controller</option>
            <option value="steppermotor">Stepper Motor</option>
          </select>
            <button className="btn" onClick={handleInter}>Interrupt</button>
            <button className="btn"onClick={handleSubmit}>Run</button>
            <button className="btn">Download</button>
            <button className="btn">Copy</button>
          </div>
          <div style={{ height: '500px' }}>
            <MonacoEditor
              height="100%"
              width="800px"
              language="assembly"
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
            />
          </div>
      </div>
    
  );
};

export default CodeEditor;
