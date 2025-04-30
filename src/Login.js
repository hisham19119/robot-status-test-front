import React, { useState } from 'react';
import './App.css';
import AinShamsLogo from './AinShamsLogo.jpeg';
import RobotPhoto from './rrrobot.jpeg';

function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'alyhanykhaledhatem') {
      onLoginSuccess();
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={AinShamsLogo} className="App-logo" alt="Logo" />
        <img src={RobotPhoto} className="Robot-image" alt="Robot" />

        <h1>Robot Control Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '10px',
              width: '250px'
            }}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </header>
    </div>
  );
}

export default Login;
