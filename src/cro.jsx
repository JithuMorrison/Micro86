import React, { useEffect, useState } from "react";

const CROSignal = ({ data, change }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (typeof data === 'number' && !isNaN(data)) {
      setPoints((prevPoints) => {
        const newPoints = [...prevPoints, data];
        if (newPoints.length > 1000) newPoints.shift(); // Limit points
        return newPoints;
      });
    }
  }, [change, data]);

  const clearPoints = () => {
    setPoints([]);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "300px", overflow: "hidden", backgroundColor: "#000" }}>
      <button 
        onClick={clearPoints} 
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Clear
      </button>
      <svg width="100%" height="100%">
        <polyline
          fill="none"
          stroke="#00ff00"
          strokeWidth="2"
          points={points.map((point, index) => `${index},${150 - (point / 10)}`).join(" ")}
        />
      </svg>
    </div>
  );
};

export default CROSignal;
