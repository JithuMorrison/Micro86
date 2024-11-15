import React, { useState } from "react";

// Seven-segment LCD display component
const SevenSegmentDisplay = ({ value }) => {
  return (
    <div className="lcd-display">
      <span>{value}</span>
    </div>
  );
};

// 4x4 Keyboard Matrix component with 2 additional buttons (Ctrl and Shift)
const KeyboardMatrix = ({ onKeyPress }) => {
  const keys = [
    "1", "2", "3", "A",
    "4", "5", "6", "B",
    "7", "8", "9", "C",
    "*", "0", "#", "D",
  ];

  return (
    <div className="keyboard-matrix">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          className="key"
        >
          {key}
        </button>
      ))}
      <button className="key ctrl" onClick={() => onKeyPress("CTRL")}>CTRL</button>
      <button className="key shift" onClick={() => onKeyPress("SHIFT")}>SHIFT</button>
    </div>
  );
};

// Main controller component
const KeyboardDisplayController = () => {
  const [displayValue, setDisplayValue] = useState("");

  const handleKeyPress = (key) => {
    // Update display with the pressed key
    setDisplayValue((prev) => prev + key);
  };

  return (
    <div className="controller">
      <h2>Keyboard & Display Controller</h2>
      <div className="display">
        <SevenSegmentDisplay value={displayValue} />
      </div>
      <KeyboardMatrix onKeyPress={handleKeyPress} />
    </div>
  );
};

export default KeyboardDisplayController;
