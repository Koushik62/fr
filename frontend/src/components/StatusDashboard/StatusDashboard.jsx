import React from 'react';
import './StatusDashboard.css';

const StatusDashboard = () => {
  const backendUrl = 'http://127.0.0.1:8888/'; // Replace with your backend URL

  const handleStart = async () => {
    try {
      const response = await fetch(`${backendUrl}/start`, { method: 'GET' });
      const data = await response.json();
      console.log('Start response:', data);
      // Handle the response as needed
    } catch (error) {
      console.error('Error starting the agent:', error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch(`${backendUrl}/stop`, { method: 'GET' });
      const data = await response.json();
      console.log('Stop response:', data);
      // Handle the response as needed
    } catch (error) {
      console.error('Error stopping the agent:', error);
    }
  };

  return (
    <div className="status-dashboard">
      <h2>AI Agent Status</h2>
      <div className="status-item">Status: Tweets fetched…</div>
      <div className="status-item">Status: Tweet #XXX replied…</div>
      <div className="status-item">Status: Waiting for responses…</div>
      <div className="status-item">Status: People responses sent…</div>
      <div className="status-item">
        Replies Quota: <span>25 done / 75 remaining</span>
      </div>
      <div className="controls">
        <button className="run-btn" onClick={handleStart}>Run Agent</button>
        <button className="stop-btn" onClick={handleStop}>Stop Agent</button>
      </div>
    </div>
  );
};

export default StatusDashboard;
