// CodeEditor.js
import "./App.css"
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';



const CodeEditor = ({code,setCode,handleSubmit,handleInter}) => {

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
      <div>
          <div className="button-row">
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
