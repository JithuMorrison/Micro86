import React, { useState, useEffect } from "react";
import CodeEditor from "./codeeditor";
import "./App.css";
import TableComponent from "./Table";
import ParallelInterface from "./parallelinterface";
import CROSignal from "./cro";
import KeyboardDisplayController from "./Keyboard";
import StepperMotor from "./stepper";

let interupt = false;
let keyboardValue = -1;
let keypressed = false;

const processAssemblyCode = async (code, hexDict,setPortC,setPortB,portA,portC,model,setData,setResults) => {
  const registers = { AX: 0, BX: 0, CX: 0, DX: 0 };
  const memory = { ...hexDict };
  const pointers = { SI: 0, DI: 0, BP: 0, SP: 0 };
  const ch = {
    BH: "BX",
    BL: "BX",
    AL: "AX",
    AH: "AX",
    CL: "CX",
    DL: "DX",
    CH: "CX",
    DH: "DX",
  };
  const flag = {
    OF: 0,
    DF: 0,
    IF: 0,
    TF: 0,
    SF: 0,
    ZF: 0,
    AF: 0,
    PF: 0,
    CF: 0,
  };
  var vki = 1;

  const lines = code.split("\n").filter((line) => line.trim() !== "");
  const convertHexToBCD = (hexNum) => {
    hexNum = parseInt(hexNum).toString(16).toUpperCase();
    if (hexNum.length !== 2) {
      return 'Invalid input: Enter a two-digit hex number';
    }
    const bcdHigh = parseInt(hexNum[0], 16).toString(2).padStart(4, '0');
    const bcdLow = parseInt(hexNum[1], 16).toString(2).padStart(4, '0');
    return bcdHigh + bcdLow;
  };
  let i = 0;
  let controlword=0;
  let mode=0;
  while (i < lines.length && !interupt) {
    const line = lines[i];
    const parts = line.trim().split(/[\s,]+/);
    const instruction = parts[0];

    switch (instruction) {
      case "MOV":
        if (
          ["AX", "BX", "CX", "DX"].includes(parts[1]) &&
          parts[2] != null &&
          !(parts[2].endsWith("]") && parts[2].startsWith("[")) &&
          !["AX", "BX", "CX", "DX"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parseInt(parts[2],16)];
          registers[reg] = value;
        } else if (
          ["AX", "BX", "CX", "DX"].includes(parts[1]) &&
          parts[2].endsWith("]") &&
          parts[2].startsWith("[") &&
          !["AX", "BX", "CX", "DX"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parts[2].slice(1, -1)];
          if (["SI", "DI", "BP", "SP"].includes(value)) {
            registers[reg] =
              memory[pointers[value].toString(16).toUpperCase()] +
              memory[
                (parseInt(pointers[value]) + 1).toString(16).toUpperCase()
              ] *
                256;
            vki = 2;
          } else {
            const numericValue = parseInt(value, 16);
            registers[reg] =
              memory[value] +
              memory[(numericValue + 1).toString(16).toUpperCase()] * 256;
          }
        } else if (
          parts[1].startsWith("[") &&
          parts[1].endsWith("]") &&
          ["AX", "BX", "CX", "DX"].includes(parts[2]) &&
          !["AX", "BX", "CX", "DX"].includes(parts[1])
        ) {
          const addr = parts[1].slice(1, -1);
          if (["SI", "DI", "BP", "SP"].includes(addr)) {
            const reg = parts[2];
            memory[pointers[addr].toString(16).toUpperCase()] =
              registers[reg] % 256;
            memory[(parseInt(pointers[addr]) + 1).toString(16).toUpperCase()] =
              parseInt(registers[reg] / 256);
            vki = 2;
          } else {
            const numericValue = parseInt(addr, 16);
            const reg = parts[2];
            memory[addr] = registers[reg] % 256;
            memory[(numericValue + 1).toString(16).toUpperCase()] = parseInt(
              registers[reg] / 256,
            );
          }
        } else if (
          ["AX", "BX", "CX", "DX"].includes(parts[1]) &&
          ["AX", "BX", "CX", "DX"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[dest] = registers[src];
        } else if (
          ["AL", "BL", "CL", "DL"].includes(parts[1]) &&
          parts[2] != null &&
          !(parts[2].endsWith("]") && parts[2].startsWith("[")) &&
          !["AL", "BL", "CL", "DL"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parseInt(parts[2],16)];
          registers[ch[reg]] = value;
        } else if (
          ["AL", "BL", "CL", "DL"].includes(parts[1]) &&
          parts[2].endsWith("]") &&
          parts[2].startsWith("[") &&
          !["AL", "BL", "CL", "DL"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parts[2].slice(1, -1)];
          if (["SI", "DI", "BP", "SP"].includes(value)) {
            registers[ch[reg]] =
              memory[pointers[value].toString(16).toUpperCase()];
            vki = 1;
          } else {
            registers[ch[reg]] = memory[value];
          }
        } else if (
          parts[1].startsWith("[") &&
          parts[1].endsWith("]") &&
          ["AL", "BL", "CL", "DL"].includes(parts[2]) &&
          !["AL", "BL", "CL", "DL"].includes(parts[1])
        ) {
          const addr = parts[1].slice(1, -1);
          if (["SI", "DI", "BP", "SP"].includes(addr)) {
            const reg = parts[2];
            memory[pointers[addr].toString(16).toUpperCase()] =
            parseInt(registers[ch[reg]].toString(16).slice(-2),16);
            vki = 1;
          } else {
            const reg = parts[2];
            memory[addr] = parseInt(registers[ch[reg]].toString(16).slice(-2),16);
          }
        } else if (
          ["AL", "BL", "CL", "DL"].includes(parts[1]) &&
          ["AL", "BL", "CL", "DL"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[ch[dest]] = parseInt(registers[ch[src]].toString(16).slice(-2),16);
        } else if (
          ["AH", "BH", "CH", "DH"].includes(parts[1]) &&
          parts[2] != null &&
          !(parts[2].endsWith("]") && parts[2].startsWith("[")) &&
          !["AH", "BH", "CH", "DH"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parseInt(parts[2],16)];
          registers[ch[reg]] = value * 256;
        } else if (
          ["AH", "BH", "CH", "DH"].includes(parts[1]) &&
          parts[2].endsWith("]") &&
          parts[2].startsWith("[") &&
          !["AH", "BH", "CH", "DH"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parts[2].slice(1, -1)];
          if (["SI", "DI", "BP", "SP"].includes(value)) {
            registers[ch[reg]] =
              memory[pointers[value].toString(16).toUpperCase()] * 256;
            vki = 1;
          } else {
            registers[ch[reg]] = memory[value] * 256;
          }
        } else if (
          parts[1].startsWith("[") &&
          parts[1].endsWith("]") &&
          ["AH", "BH", "CH", "DH"].includes(parts[2]) &&
          !["AH", "BH", "CH", "DH"].includes(parts[1])
        ) {
          const addr = parts[1].slice(1, -1);
          if (["SI", "DI", "BP", "SP"].includes(addr)) {
            const reg = parts[2];
            memory[pointers[addr].toString(16).toUpperCase()] =
              registers[ch[reg]];
            vki = 1;
          } else {
            const reg = parts[2];
            let hexVal = parseInt(registers[ch[reg]]);
            let secondByteFromRight = (hexVal >> 8) & 0xFF;
            memory[addr] = secondByteFromRight.toString(16).padStart(2, '0');
          }
        } else if (
          ["AH", "BH", "CH", "DH"].includes(parts[1]) &&
          ["AH", "BH", "CH", "DH"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[ch[dest]] = registers[ch[src]];
        } else if (
          ["SI", "DI", "BP", "SP"].includes(parts[1]) &&
          !(parts[2].endsWith("]") && parts[2].startsWith("[")) &&
          !["AX", "BX", "CX", "DX"].includes(parts[2])
        ) {
          const [reg, value] = [parts[1], parseInt(parts[2], 16)];
          pointers[reg] = value;
        }
        break;

      case "ADD":
        if (
          ["AX", "BX"].includes(parts[1]) &&
          ["AX", "BX"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[dest] += registers[src];
          if (registers[dest] >= 65536) {
            flag["CF"] = 1;
          } else {
            flag["CF"] = 0;
          }
        } else if (
          ["AL", "BL"].includes(parts[1]) &&
          ["AL", "BL"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[ch[dest]] += registers[ch[src]];
          if (registers[ch[dest]] >= 256) {
            flag["CF"] = 1;
          } else {
            flag["CF"] = 0;
          }
        } else if (
          ["AH", "BH"].includes(parts[1]) &&
          ["AH", "BH"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[ch[dest]] += registers[ch[src]];
          if (registers[ch[dest]] >= 65536) {
            flag["CF"] = 1;
          } else {
            flag["CF"] = 0;
          }
        }
        break;

      case "MUL":
        if (["BL", "DL"].includes(parts[1])) {
          const [src] = [parts[1]];
          registers["AX"] *= registers[ch[src]];
        } else if (["BX", "DX"].includes(parts[1])) {
          const [src] = [parts[1]];
          registers["AX"] *= registers[src];
          registers["DX"] = parseInt(registers["AX"] / 65536);
        } else if (["BH", "DH"].includes(parts[1])) {
          const [src] = [parts[1]];
          registers["AX"] =
            parseInt(registers["AX"] / 256) *
            parseInt(registers[ch[src]] / 256);
        }
        break;

      case "DIV":
        if (["BL", "DL"].includes(parts[1])) {
          const [src] = [parts[1]];
          registers["AX"] =
            parseInt(registers["AX"] / registers[ch[src]]) * 256 +
            (registers["AX"] % registers[ch[src]]);
        } else if (["BX", "DX"].includes(parts[1])) {
          const [src] = [parts[1]];
          registers["DX"] = parseInt(registers["AX"] / registers[src]);
          registers["AX"] = registers["AX"] % registers[src];
        } else if (["BH", "DH"].includes(parts[1])) {
          const [src] = [parts[1]];
          registers["AX"] =
            parseInt(
              parseInt(registers["AX"] / 256) /
                parseInt(registers[ch[src]] / 256),
            ) *
              256 +
            (parseInt(registers["AX"] / 256) %
              parseInt(registers[ch[src]] / 256));
        }
        break;

      case "SUB":
        if (
          ["AX", "BX"].includes(parts[1]) &&
          ["AX", "BX"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[dest] -= registers[src];
          if (registers[dest] < 0) {
            flag["CF"] = 1;
            registers[dest] = -1 * registers[dest];
          } else {
            flag["CF"] = 0;
          }
        } else if (
          ["AL", "BL"].includes(parts[1]) &&
          ["AL", "BL"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[ch[dest]] -= registers[ch[src]];
          if (registers[ch[dest]] < 0) {
            flag["CF"] = 1;
            registers[ch[dest]] = -1 * registers[ch[dest]];
          } else {
            flag["CF"] = 0;
          }
        } else if (
          ["AH", "BH"].includes(parts[1]) &&
          ["AH", "BH"].includes(parts[2])
        ) {
          const [dest, src] = [parts[1], parts[2]];
          registers[ch[dest]] -= registers[ch[src]];
          if (registers[ch[dest]] < 0) {
            flag["CF"] = 1;
            registers[ch[dest]] = -1 * registers[ch[dest]];
          } else {
            flag["CF"] = 0;
          }
        }
        break;

      case "JNC":
        if (flag["CF"] == 0 && i != parseInt(parts[1]) - 1) {
          i = parseInt(parts[1]) - 2;
        }
        break;

      case "JNB":
        if (flag["CF"] == 0 && i != parseInt(parts[1]) - 1) {
          i = parseInt(parts[1]) - 2;
        }
        break;

      case "JNZ":
        if (flag["ZF"] == 1 && i != parseInt(parts[1]) - 1) {
          i = parseInt(parts[1]) - 2;
        }
        break;

      case "JC":
        if (flag["CF"] != 0 && i != parseInt(parts[1]) - 1) {
          i = parseInt(parts[1]) - 2;
        }
        break;

      case "JB":
        if (flag["CF"] != 0 && i != parseInt(parts[1]) - 1) {
          i = parseInt(parts[1]) - 2;
        }
        break;

      case "JZ":
        if (flag["ZF"] != 1 && i != parseInt(parts[1]) - 1) {
          i = parseInt(parts[1]) - 2;
        }
        break;
      
      case "JMP":
        i = parseInt(parts[1])-2;
        flag["CF"] = 0;
        console.log("jump"+i);
        break;

      case "INC": //increment
        if (["CX"].includes(parts[1])) {
          registers["CX"]++;
        } else if (["CH"].includes(parts[1])) {
          registers["CX"]+=256;
        } else if (["CL"].includes(parts[1])) {
          registers["CX"]++;
        } else if (["AL"].includes(parts[1])) {
          registers["AX"]++;
          if(registers["AX"]>255){
            registers["AX"]-=256;
            flag["CF"] = 1;
            flag["ZF"] = 0;
          }
          else{
            flag["CF"] = 0;
            flag["ZF"] = 1;
          }
        } else if (["BL"].includes(parts[1])) {
          registers["BX"]++;
        } else if (["SI", "DI", "BP", "SP"].includes(parts[1])) {
          pointers[parts[1]] = pointers[parts[1]] + vki;
        }
        break;

      case "DEC":
        if (["CX"].includes(parts[1])) {
          registers["CX"]--;
        } else if (["CH"].includes(parts[1])) {
          registers["CX"]--;
        } else if (["CL"].includes(parts[1])) {
          registers["CX"]--;
        }
        break;

      case "CMP":
        if (
          ["AX", "BX", "CX", "DX"].includes(parts[1]) &&
          ["AX", "BX", "CX", "DX"].includes(parts[2])
        ) {
          if (registers[parts[1]] == registers[parts[2]]) {
            flag["ZF"] = 0;
          } else {
            flag["ZF"] = 1;
          }
        }
        break;
      case "OUT":
        if(model == "parallel_interface"){
          if(["C6"].includes(parts[1])){
            if(parts[2]=="AL"){
              controlword = convertHexToBCD(registers["AX"].toString());
            }
            else{
              controlword = convertHexToBCD(parts[2]);
            }
            if(controlword[0]=="0"){
              const binaryValue = controlword.slice(4, 7); 
              let lightIndex = parseInt(binaryValue, 2);
              if (lightIndex < 2 || lightIndex==3 || lightIndex==5 || lightIndex==7) { 
                if(lightIndex==3){
                  lightIndex=2;
                }
                if(lightIndex==5){
                  lightIndex=3;
                }
                if(lightIndex==7){
                  lightIndex=4;
                }
                const bitValue = controlword[7] === '1'; 
                setPortC((prevPortC) => {
                  const newLights = [...prevPortC.lights];
                  newLights[lightIndex] = bitValue;
                  return { ...prevPortC, lights: newLights };
                });
              }
            }
            else{
              if (controlword[1]=="0"){
                if(controlword[2]=="0"){
                  mode = 0
                }
                else{
                  mode=1
                }
              }
              else{
                mode = 2
              }
            }
          }
          else if(parts[1]=="C2"){
            if(controlword[6]=="0"){
              if(parts[2]=="AL"){
                const valnew = registers["AX"];
                if(mode==0){
                  let binaryString = parseInt(valnew, 16).toString(2);
                  binaryString = binaryString.padStart(8, '0');
                  setPortB(Array.from(binaryString).map(bit => bit === '1'));
                }
                else if(mode==1){
                  let binaryString = parseInt(valnew, 16).toString(2);
                  binaryString = binaryString.padStart(8, '0');
                  setPortB(Array.from(binaryString).map(bit => bit === '1'));
                }
              }
            }
          }
          else if(parts[1]=="C4"){
            if(controlword[4]=="0"){
              if(parts[2]=="AL"){
                const valnew = registers["AX"];
                let binaryString = parseInt(valnew, 16).toString(2);
                binaryString = binaryString.padStart(8, '0');
                const indicesOfOnes = [];
                let k=0;
                for (let i = 0; i < 8; i++) {
                  if (binaryString[i] === '1') {
                    indicesOfOnes.push(i);
                    k+=1;
                  }
                }
                for (let i = 0; i < k; i++) {
                  let lightIndex = 7-indicesOfOnes[i];
                  if (lightIndex < 2 || lightIndex==3 || lightIndex==5 || lightIndex==7) { 
                    if(lightIndex==3){
                      lightIndex=2;
                    }
                    if(lightIndex==5){
                      lightIndex=3;
                    }
                    if(lightIndex==7){
                      lightIndex=4;
                    }
                    const bitValue = true; 
                    setPortC((prevPortC) => {
                      const newLights = [...prevPortC.lights];
                      newLights[lightIndex] = bitValue;
                      return { ...prevPortC, lights: newLights };
                    });
                  }
                }
              }
            }
          }
        }
        else if(model == "dac"){//dac
          if(["C8"].includes(parts[1])){
            let varil = parseInt(parts[2],16);
            if(parts[2]=="AL"){
              varil = registers["AX"]*5;
            }
            setData(varil);
          }
        }
        break;
      case "IN":
        if(model == "parallel_interface"){
          if(["C0"].includes(parts[2])){
            console.log(controlword);
            if(controlword[3]=="1"){
            const binaryString = portA.map(bit => (bit ? '1' : '0')).join('');
            const hexValue = parseInt(binaryString, 2).toString(16).toUpperCase();
            if(parts[1]=="AL"){
              registers["AX"] = hexValue;
            }
          }
        }
        if(["C4"].includes(parts[2])){
          const orderedPortC = [
            portC.lights[4], 
            portC.buttons[2], 
            portC.lights[3], 
            portC.buttons[1], 
            portC.lights[2], 
            portC.buttons[0], 
            portC.lights[1], 
            portC.lights[0]
        ];
          const binaryString = orderedPortC.map(bit => (bit ? '1' : '0')).join('');
          const bcdValue = parseInt(binaryString, 2); // Convert binary string to decimal as BCD
          const hexValue = bcdValue.toString(16).toUpperCase();
          if (parts[1] === "AL") {
            registers["AX"] = hexValue;
          }
        }
      }
      else if(model == "keyboard_display"){
        if(["C2"].includes(parts[2])){
          console.log(keypressed);
          if(parts[1]=="AL" && keypressed){
            registers["AX"] = (0).toString(16).toUpperCase();
          }
          else{
            registers["AX"] = (1).toString(16).toUpperCase();
          }
        }
      }
      break;
      case "AND":
        let hex1=0;
        let hex2="";
        if (parts[1] === "AL") {
          hex1 = registers["AX"];
        }
        hex2=parts[2];
        if(hex2=="20"){
          hex2 = "10";
        }
        const decimal1 = parseInt(hex1,16);
        const decimal2 = parseInt(hex2,16);
        const andR = decimal1 & decimal2;
        console.log(andR);
        if(andR==0){
          flag["ZF"] = 0;
        }
        else{
          flag["ZF"] = 1;
        }
      break;
      case "TEST":
        let hex3=0;
        let hex4="";
        if (parts[1] === "AL") {
          hex3 = registers["AX"];
        }
        hex4=parts[2];
        const decimal3 = parseInt(hex3,16);
        const decimal4 = parseInt(hex4,16);
        const andr = decimal3 & decimal4;
        console.log(andr);
        if(andr==0){
          flag["ZF"] = 0;
        }
        else{
          flag["ZF"] = 1;
        }
    }
    setResults({
      registers: { ...registers },
      memory: { ...memory },
      flag: { ...flag },
      pointers: { ...pointers }
    });

    i++;
    await delay(1);
  }
  interupt = false;
  setResults({
    registers,
    memory,
    flag,
    pointers
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function Compiler() {
  const [hexDict, setHexDict] = useState({});
  const [results, setResults] = useState({
    registers: { AX: 0, BX: 0, CX: 0, DX: 0 },
    memory: {},
    flag: { OF: 0, DF: 0, IF: 0, TF: 0, SF: 0, ZF: 0, AF: 0, PF: 0, CF: 0 },
    pointers: { SI: 0, DI: 0, BP: 0, SP: 0 },
  });
  const [code, setCode] = useState("// type your code here");

  useEffect(() => {
    const newHexDict = {};
    for (let i = 0x1000; i <= 0x3fff; i++) {
      const hexKey = i.toString(16).toUpperCase();
      newHexDict[hexKey] = 0;
    }
    setHexDict(newHexDict);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(hexDict).length > 0) {
      processAssemblyCode(code, hexDict,setPortC,setPortB,portA,portC,model,setData,setResults);
    } else {
      console.warn("Memory not initialized yet.");
    }
  };

  const [text, setText] = useState('');
  const [text1, setText1] = useState('');  

  const handleInter = () => {
    interupt = true;
  }

  const handleButtonClick = () => {
    setResults(prevResults => ({
      ...prevResults,
      memory: {
        ...prevResults.memory,
        [text]: parseInt(text1, 16)
      }
    }));
    setHexDict(prevHexDict => ({
      ...prevHexDict,
      [text]: parseInt(text1, 16) 
    }));
  };

  const [portA, setPortA] = useState(Array(8).fill(false)); // 7 Buttons for Port A
  const [portB, setPortB] = useState(Array(8).fill(false)); // 7 Lights for Port B
  const [portC, setPortC] = useState({
    lights: Array(5).fill(false), // 5 Lights for Port C
    buttons: Array(3).fill(false)  // 3 Buttons for Port C
  });

  const [data, setData] = useState(50);
  const [change, setChange] = useState(1);
  const [model,setModel] = useState("dac");

  const handleKeyPress = (key,press) => {
    const hexValue = parseInt(key, 16); 
    keypressed = press;
    keyboardValue = hexValue;
  };

  return (
    <div className="app-container">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 className="fontfam padbot">Compiler</h1>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '200px', marginRight: '11px',marginLeft: '160px', marginTop: '20px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter Address to store value"
          />
          <input
            type="text"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            style={{ width: '200px', marginRight: '16px',marginLeft: '5px', marginTop: '20px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Enter value"
          />
          <button
            onClick={handleButtonClick}
            className="btn"
            style={{ padding: '8px 16px', border: 'none', marginTop: '20px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Submit
          </button>
        </div>
        <CodeEditor code={code} setCode={setCode} handleInter={handleInter} handleSubmit={handleSubmit} model={model} setModel={setModel} />
        {results && (
          <div>
            <div style={{marginTop:'20px'}}>
              <CROSignal data={data} change={change}/>
            </div>
            <h2>Processing Results</h2>
            <h3>Registers</h3>
            <ul>
              {Object.entries(results.registers).map(([reg, value]) => (
                <li key={reg}>
                  <strong>{reg}:</strong> {value}
                </li>
              ))}
            </ul>
            <h3>Memory</h3>
            <ul>
              {Object.entries(results.memory)
                .slice(0, 20)
                .map(([addr, value]) => (
                  <li key={addr}>
                    <strong>{addr}:</strong> {value}
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div>
          <h1>Memory</h1>
          <ul>
            {Object.entries(hexDict)
              .slice(3000, 3010)
              .map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="container-two">
        <TableComponent registers={results.registers} flag={results.flag} pointers={results.pointers} hexDict={results.memory}/>
      </div>
      <div>
        <ParallelInterface portA={portA} portB={portB} portC={portC} setPortA={setPortA} setPortC={setPortC}/>
        <KeyboardDisplayController onMouse={handleKeyPress}/>
      </div>
      <StepperMotor/>
    </div>
  );
}

export default Compiler;
