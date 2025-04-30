import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import AinShamsLogo from "./AinShamsLogo.jpeg";
import RobotPhoto from "./rrrobot.jpeg";

const USERNAME = "admin";
const PASSWORD = "alyhanykhaledhatem";
const AUTH_HEADER = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);
const BASE_URL =
  "https://robo-new-backend-bqouarho5-aly-awnys-projects.vercel.app";

function App() {
  const [mode, setMode] = useState("default");
  const [robotState, setRobotState] = useState("Idle");
  const [robotData, setRobotData] = useState({
    position: { x: 0, y: 0 },
    battery: 0,
    speed: 0,
    state: "Idle",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Poll robot data every 2 seconds if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetch(`${BASE_URL}/api/robot/status`, {
        headers: {
          Authorization: AUTH_HEADER,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRobotData((prev) => ({ ...prev, ...data }));
        })
        .catch((err) => {
          console.error("Error fetching robot data:", err);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = () => {
    // Perform authentication check
    fetch(`${BASE_URL}/protected`, {
      headers: {
        Authorization: AUTH_HEADER,
      },
    })
      .then((res) => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false));
  };

  const sendCommand = (command, stateLabel) => {
    fetch(`${BASE_URL}/api/robot/command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_HEADER,
      },
      body: JSON.stringify({ command }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Command failed");
        if (stateLabel) setRobotState(stateLabel);
      })
      .catch((err) => {
        console.error("Error sending command:", err);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <img src={AinShamsLogo} alt="Logo" className="login-logo" />
        <img src={RobotPhoto} alt="Robot" className="login-robot" />
        <Login onLoginSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={AinShamsLogo}
          className="App-logo-center"
          alt="Ain Shams Logo"
        />
        <h1>Robot Control Dashboard</h1>
        <h2>Faculty of Engineering - Ain Shams University</h2>

        <div className="controls">
          <button
            onClick={() => {
              setMode("default");
              setRobotState("Idle");
            }}
          >
            Autonomous Mode
          </button>
          <button onClick={() => setMode("manual")}>Manual Mode</button>
        </div>

        {mode === "manual" && (
          <div className="manual-tab">
            <h3>Manual Controls</h3>
            <div className="arrow-controls">
              <button
                onClick={() => sendCommand("move:forward", "Moving Forward")}
              >
                ↑
              </button>
              <div>
                <button
                  onClick={() => sendCommand("move:left", "Turning Left")}
                >
                  ←
                </button>
                <button onClick={() => sendCommand("move:stop", "Stopped")}>
                  ■
                </button>
                <button
                  onClick={() => sendCommand("move:right", "Turning Right")}
                >
                  →
                </button>
              </div>
              <button
                onClick={() => sendCommand("move:backward", "Moving Backward")}
              >
                ↓
              </button>
            </div>

            <div className="controls">
              <button
                onClick={() => sendCommand("action:lift", "Lifting Shelf")}
              >
                Lift Shelf
              </button>
              <button
                onClick={() => sendCommand("action:lower", "Lowering Shelf")}
              >
                Lower Shelf
              </button>
            </div>

            <button
              className="back-button"
              onClick={() => {
                setMode("default");
                setRobotState("Idle");
              }}
            >
              Back
            </button>
          </div>
        )}

        <div className="robot-info">
          <div className="info-card">
            <strong>Battery:</strong> {robotData.battery} V
          </div>
          <div className="info-card">
            <strong>Position:</strong> X: {robotData.position.x}, Y:{" "}
            {robotData.position.y}
          </div>
          <div className="info-card">
            <strong>Speed:</strong> {robotData.speed} m/s
          </div>
          <div className="info-card">
            <strong>State:</strong> {robotState}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
