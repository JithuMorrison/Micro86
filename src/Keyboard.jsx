import React, { useState } from "react";

// Seven-segment display for binary value
const SevenSegmentDisplay = ({ value }) => {
  // Function to convert a number to a 7-segment representation
  const getSegmentStyle = (segment, active) => ({
    position: "absolute",
    width: "8px",
    height: "30px",
    backgroundColor: active ? "lime" : "transparent",
    borderRadius: "3px",
    transformOrigin: "center",
    transition: "background-color 0.3s",
    ...segment,
  });

  const segments = [
    // Define the segment positions for a 7-segment display
    { id: "a", transform: { top: "0px", left: "50%" }, rotate: "rotate(0deg)" },
    { id: "b", transform: { top: "25%", left: "100%" }, rotate: "rotate(90deg)" },
    { id: "c", transform: { bottom: "25%", left: "100%" }, rotate: "rotate(90deg)" },
    { id: "d", transform: { bottom: "0px", left: "50%" }, rotate: "rotate(180deg)" },
    { id: "e", transform: { bottom: "25%", left: "0%" }, rotate: "rotate(-90deg)" },
    { id: "f", transform: { top: "25%", left: "0%" }, rotate: "rotate(-90deg)" },
    { id: "g", transform: { top: "50%", left: "50%" }, rotate: "rotate(0deg)" },
  ];

  // Mapping of segment states (1 = active, 0 = inactive) for each digit
  const segmentMapping = [
    [1, 0, 1, 1, 1, 0, 1],  // 0
    [0, 0, 1, 0, 0, 1, 0],  // 1
    [1, 0, 1, 1, 1, 0, 1],  // 2
    [1, 0, 1, 1, 0, 1, 1],  // 3
    [0, 1, 1, 1, 0, 1, 1],  // 4
    [1, 1, 0, 1, 0, 1, 1],  // 5
    [1, 1, 0, 1, 1, 1, 1],  // 6
    [1, 0, 1, 0, 0, 1, 0],  // 7
    [1, 1, 1, 1, 1, 1, 1],  // 8
    [1, 1, 1, 1, 0, 1, 1],  // 9
  ];

  const currentValue = value % 10;  // Get the last digit of the value
  const activeSegments = segmentMapping[currentValue];

  return (
    <div style={{ position: "relative", width: "60px", height: "120px", margin: "auto" }}>
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          style={{
            ...getSegmentStyle(segment, activeSegments[index]),
            transform: `translate(-50%, -50%) ${segment.rotate}`,
            top: `${segment.transform.top}`,
            left: `${segment.transform.left}`,
          }}
        />
      ))}
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
const KeyboardDisplayController = ({keyboardValue,setKeyboardValue,keypress,setkeypress}) => {
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
      <h2>7-Segment Display & Keyboard Controller</h2>
      <div style={displayContainerStyle}>
        <SevenSegmentDisplay value={displayValue} />
      </div>
      <KeyboardMatrix onKeyPress={handleKeyPress} />
    </div>
  );
};

export default KeyboardDisplayController;
