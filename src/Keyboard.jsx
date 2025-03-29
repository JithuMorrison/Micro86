import React, { useState, useEffect } from "react";

// Seven-segment display for binary value
const SevenSegmentDisplay = ({ value }) => {
  const [displayData, setDisplayData] = useState([[0,0,0,0,0,0,0,0]]);

  // Convert hex character to binary array [D, C, B, A]
  const hexToBinary = (hexChar) => {
    const binary = parseInt(hexChar, 16).toString(2).padStart(4, '0');
    return binary.split('').map(Number);
  };

  // Handle value updates
  useEffect(() => {
    if (value === undefined || value === null) return;

    // Convert to 2-digit hex string, upper case
    const hexString = value.toString(16).toUpperCase().padStart(2, '0');
    const newDigits = hexString.split("");
    const combined = hexToBinary(newDigits[0]).concat(hexToBinary(newDigits[1]));

    setDisplayData(prev => {
      const updated = [...prev, combined];
      return updated.slice(-2); // Keep last 2 only
    });
  }, [value]);

  const getSegmentStyle = (segment, active) => ({
    position: "absolute",
    width: "8px",
    height: "30px",
    backgroundColor: active ? "lime" : "#333",
    borderRadius: "3px",
    transformOrigin: "center",
    transition: "background-color 0.3s",
    ...segment,
  });

  const segments = [
    { id: "d", transform: { top: "75%", left: "0%" }, rotate: "rotate(90deg)" },
    { id: "c", transform: { top: "50%", left: "50%" }, rotate: "rotate(0deg)" },
    { id: "b", transform: { top: "0px", left: "50%" }, rotate: "rotate(180deg)" },
    { id: "a", transform: { top: "-25%", left: "0%" }, rotate: "rotate(-90deg)" },
    { id: ".", transform: { top: "90%", left: "0%" }, rotate: "rotate(-90deg)" },
    { id: "g", transform: { top: "25%", left: "0%" }, rotate: "rotate(-90deg)" },
    { id: "f", transform: { top: "0px", left: "-50%" }, rotate: "rotate(0deg)" },
    { id: "e", transform: { top: "50%", left: "-50%" }, rotate: "rotate(0deg)" },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      {displayData.map((char, idx) => {
        const activeSegments = char;

        return (
          <div
            key={idx}
            style={{
              position: "relative",
              width: "60px",
              height: "120px",
              marginTop: "30px",
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                style={{
                  ...getSegmentStyle(segment, activeSegments[index]),
                  transform: `translate(-50%, -50%) ${segment.rotate}`,
                  top: segment.transform.top,
                  left: segment.transform.left,
                }}
              />
            ))}
          </div>
        );
      })}
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
    gridColumn: "span 2", // Makes them take two grid columns
    width: "105px", // Manually extend width (50px + 50px + gap)
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
          onMouseDown={() => onKeyPress(key, true)}
          onMouseUp={() => onKeyPress(key, false)}
          style={keyStyle}
        >
          {key}
        </button>
      ))}
      <button
        style={ctrlShiftStyle}
        onMouseDown={() => onKeyPress("CTRL", true)}
        onMouseUp={() => onKeyPress("CTRL", false)}
      >
        CTRL
      </button>
      <button
        style={ctrlShiftStyle}
        onMouseDown={() => onKeyPress("SHIFT", true)}
        onMouseUp={() => onKeyPress("SHIFT", false)}
      >
        SHIFT
      </button>
    </div>
  );
};

// Main controller component
const KeyboardDisplayController = ({onMouse}) => {
  const [displayValue, setDisplayValue] = useState("60");

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
      <KeyboardMatrix onKeyPress={onMouse}/>
    </div>
  );
};

export default KeyboardDisplayController;
