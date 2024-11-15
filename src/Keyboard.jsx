import React, { useState } from "react";

// Eight-bit LCD display component
const EightBitLCDDisplay = ({ value }) => {
  const lcdStyle = {
    width: "200px",
    height: "50px",
    backgroundColor: "black",
    color: "lime",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #333",
    marginBottom: "20px",
  };

  // Convert the decimal value to an 8-bit binary string
  const binaryValue = value.toString(2).padStart(8, "0");

  return (
    <div style={lcdStyle}>
      <span>{binaryValue}</span>
    </div>
  );
};

// 4x4 Keyboard Matrix component with 2 additional buttons (Ctrl and Shift)
const KeyboardMatrix = ({ onKeyPress }) => {
  const matrixStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 50px)",
    gap: "5px",
  };

  const keyStyle = {
    width: "50px",
    height: "50px",
    backgroundColor: "lightgray",
    border: "1px solid #333",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const ctrlShiftStyle = {
    ...keyStyle,
    gridColumn: "span 2",
    backgroundColor: "darkgray",
  };

  const keys = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "A", "B", "C",
    "D", "E", "F", "0",
  ];

  return (
    <div style={matrixStyle}>
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          style={keyStyle}
        >
          {key}
        </button>
      ))}
      <button style={ctrlShiftStyle} onClick={() => onKeyPress("CTRL")}>CTRL</button>
      <button style={ctrlShiftStyle} onClick={() => onKeyPress("SHIFT")}>SHIFT</button>
    </div>
  );
};

// Main controller component
const KeyboardDisplayController = () => {
  const [displayValue, setDisplayValue] = useState(0);

  const handleKeyPress = (key) => {
    // Increment the 8-bit value on each key press (for demonstration)
    setDisplayValue((prev) => (prev + 1) & 0xff); // Ensure it's 8-bit (0-255)
  };

  const controllerStyle = {
    textAlign: "center",
    marginTop: "20px",
  };

  const displayContainerStyle = {
    marginBottom: "20px",
  };

  return (
    <div style={controllerStyle}>
      <h2>8-Bit LCD Display & Keyboard Controller</h2>
      <div style={displayContainerStyle}>
        <EightBitLCDDisplay value={displayValue} />
      </div>
      <KeyboardMatrix onKeyPress={handleKeyPress} />
    </div>
  );
};

export default KeyboardDisplayController;
