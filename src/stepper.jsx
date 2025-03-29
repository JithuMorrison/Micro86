import React, { useState } from "react";

const StepperMotor = () => {
  const [steps, setSteps] = useState(0);
  const [angle, setAngle] = useState(0);

  // Function to handle the step change and rotate motor
  const handleStepsChange = (event) => {
    const stepValue = event.target.value;
    setSteps(stepValue);
    setAngle(stepValue * 1.8); // Assuming 1 step = 1.8 degrees (for 200 steps per revolution motor)
  };

  return (
    <div className="container">
      <h1>Stepper Motor Simulator</h1>
      <div className="motor-container">
        <div
          className="motor-pointer"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: "transform 0.5s ease",
            zIndex: '999'
          }}
        />
        <div className="motor-body"></div>
      </div>

      <div className="controls">
        <label>
          Enter number of steps (200 steps = 360°):
          <input
            type="number"
            value={steps}
            onChange={handleStepsChange}
            min="0"
            max="200"
            className="input"
          />
        </label>
        <p>Rotation: {angle.toFixed(2)}°</p>
      </div>

      <style>
        {`
          .container {
            text-align: center;
            padding: 20px;
          }

          .motor-container {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto;
          }

          .motor-body {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 10px solid #333;
            border-radius: 50%;
            background-color: #eee;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .motor-pointer {
            position: absolute;
            width: 50%;
            height: 2px;
            background-color: #ff0000;
            top: 55%;
            left: 5.5%;
            transform-origin: 100% 50%;
            transform: rotate(0deg);
          }

          .controls {
            margin-top: 20px;
          }

          .controls input {
            margin-left: 10px;
            width: 60px;
            padding: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default StepperMotor;
