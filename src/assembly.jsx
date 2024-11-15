import React, { useState } from 'react';

// Function to process assembly code
const processAssemblyCode = (code) => {
  // Define initial state for registers and memory
  const registers = { AX: 0, BX: 0 };
  const memory = {2000: 500, 2001: 30, 2002: 0, 2003: 0, 2004: 0, 2005: 0,};

  // Split code into lines
  const lines = code.split('\n').filter(line => line.trim() !== '');

  // Process each line
  lines.forEach(line => {
    const parts = line.trim().split(/[\s,]+/); // Split by whitespace
    const instruction = parts[0];

    switch (instruction) {
      case 'MOV':
        // MOV reg, value
        if (['AX', 'BX'].includes(parts[1]) && parts[2]!=null && !(parts[2].endsWith(']') && parts[2].startsWith('[')) && !(['AX', 'BX'].includes(parts[2]))) {
          const [reg, value] = [parts[1], parseInt(parts[2])];
          registers[reg] = value;
        }
          else if (['AX', 'BX'].includes(parts[1]) && parts[2].endsWith(']') && parts[2].startsWith('[') && !(['AX', 'BX'].includes(parts[2]))) {
            const [reg, value] = [parts[1], parseInt(parts[2].slice(1, -1))];
            registers[reg] = memory[value];
          }
        // MOV [mem], reg
        else if (parts[1].startsWith('[') && parts[1].endsWith(']') && ['AX', 'BX'].includes(parts[2]) && !(['AX', 'BX'].includes(parts[1]))) {
          const addr = parts[1].slice(1, -1); // Remove brackets
          const reg = parts[2];
          memory[addr] = registers[reg];
        }
        // MOV reg, reg
        else if (['AX', 'BX'].includes(parts[1]) && ['AX', 'BX'].includes(parts[2])) {
          const [dest, src] = [parts[1], parts[2]];
          registers[dest] = registers[src];
        }
        break;

      case 'ADD':
        // ADD reg1, reg2
        if (['AX', 'BX'].includes(parts[1]) && ['AX', 'BX'].includes(parts[2])) {
          const [dest, src] = [parts[1], parts[2]];
          registers[dest] += registers[src];
        }
        break;

      // Handle other instructions or provide warnings
      default:
        console.warn(`Unsupported instruction: ${instruction}`);
    }
  });

  return {
    registers,
    memory
  };
};

// AssemblyCodeProcessor Component
const AssemblyCodeProcessor = () => {
  const [code, setCode] = useState('');
  const [results, setResults] = useState({ registers: {}, memory: {} });

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const processedResults = processAssemblyCode(code);
    setResults(processedResults);
  };

  return (
    <div>
      <h1>Assembly Code Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="10"
          cols="50"
          placeholder="Paste your assembly code here..."
        />
        <br />
        <button type="submit" >Process Code</button>
      </form>
      {results && (
        <div>
          <h2>Processing Results</h2>
          <h3>Registers</h3>
          <ul>
            {Object.entries(results.registers).map(([reg, value]) => (
              <li key={reg}><strong>{reg}:</strong> {value}</li>
            ))}
          </ul>
          <h3>Memory</h3>
          <ul>
            {Object.entries(results.memory).map(([addr, value]) => (
              <li key={addr}><strong>[{addr}]:</strong> {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssemblyCodeProcessor;
