import React, { useEffect, useState } from "react";

const CROSignal = ({ data,change }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (typeof data === 'number' && !isNaN(data)) {
      setPoints((prevPoints) => {
        const newPoints = [...prevPoints, data];
        if (newPoints.length > 100) newPoints.shift(); // Limit points

        return newPoints;
      });
    }
  }, [change,data]);

  return (
    <div style={{ position: "relative", width: "100%", height: "200px", overflow: "hidden", backgroundColor: "#000" }}>
      <svg width="100%" height="100%">
        <polyline
          fill="none"
          stroke="#00ff00"
          strokeWidth="2"
          points={points.map((point, index) => `${index * 20},${150 - (point / 10)}`).join(" ")}
        />
      </svg>
    </div>
  );
};

export default CROSignal;
