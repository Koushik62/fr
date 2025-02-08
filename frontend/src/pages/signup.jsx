import React, { useState } from 'react';
import DashboardPage from './DashboardPage';
import './signup.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@nearfold.com' && password === 'Near@468') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  if (isAuthenticated) {
    return <DashboardPage />;
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="signup-form">
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
