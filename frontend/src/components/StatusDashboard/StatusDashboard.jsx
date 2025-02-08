// import React from 'react';
// import './StatusDashboard.css';

// const StatusDashboard = () => {
//   const backendUrl = 'http://3.29.236.151/'; // Replace with your backend URL

//   const handleStart = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/start`, { method: 'GET' });
//       const data = await response.json();
//       console.log('Start response:', data);
//       // Handle the response as needed
//     } catch (error) {
//       console.error('Error starting the agent:', error);
//     }
//   };

//   const handleStop = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/stop`, { method: 'GET' });
//       const data = await response.json();
//       console.log('Stop response:', data);
//       // Handle the response as needed
//     } catch (error) {
//       console.error('Error stopping the agent:', error);
//     }
//   };

//   return (
//     <div className="status-dashboard">
//       <h2>AI Agent Status</h2>
//       <div className="status-item">Status: Tweets fetched…</div>
//       <div className="status-item">Status: Tweet #XXX replied…</div>
//       <div className="status-item">Status: Waiting for responses…</div>
//       <div className="status-item">Status: People responses sent…</div>
//       <div className="status-item">
//         Replies Quota: <span>25 done / 75 remaining</span>
//       </div>
//       <div className="controls">
//         <button className="run-btn" onClick={handleStart}>Run Agent</button>
//         <button className="stop-btn" onClick={handleStop}>Stop Agent</button>
//       </div>
//     </div>
//   );
// };

// export default StatusDashboard;


import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StatusDashboard.css";
import config from "../../config";

const StatusDashboard = () => {
  const [tweets, setTweets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metrics, setMetrics] = useState({ fetched: 0, replied: 0, responses: 0 });
  

  // Format date to match backend expected format (e.g., "YYYY-MM-DD")
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchTweets = async (date) => {
    const formattedDate = formatDate(date);

    try {
      const response = await fetch(`${config.API_BASE_URL}/tweets`);
      if (!response.ok) throw new Error("Failed to fetch tweets");
      const data = await response.json();

      const filteredTweets = data.filter((tweet) =>
        tweet.timestamp.includes(formattedDate)
      );

      const fetched = filteredTweets.length;
      const replied = filteredTweets.filter((tweet) => tweet.replyStatus === "yes").length;
      const responses = fetched - replied;

      setMetrics({ fetched, replied, responses });
      setTweets(filteredTweets);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTweets(selectedDate);
  }, [selectedDate]);

  const handleStart = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/start`, { method: "GET" });
      const data = await response.json();
      console.log("Start response:", data);
    } catch (error) {
      console.error("Error starting the agent:", error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/stop`, { method: "GET" });
      const data = await response.json();
      console.log("Stop response:", data);
    } catch (error) {
      console.error("Error stopping the agent:", error);
    }
  };

  return (
    <div className="status-dashboard">
      <h2 className="title">SuiMon Agent Status</h2>
      <div className="date-picker-container">
        <label htmlFor="date-picker">Select Date:</label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker"
        />
      </div>
      <p className="description">
        Below is the Daily Status of the Agent based on the Metrics including Tweets Fetched, Tweets Replied, Replies Sent to people's comments
      </p>
      <div className="metrics">
        <div className="metric-item">
          <h3>{metrics.fetched}</h3>
          <p>Tweets Fetched</p>
        </div>
        <div className="metric-item">
          <h3>{metrics.replied}</h3>
          <p>Tweets Replied</p>
        </div>
        <div className="metric-item">
          <h3>{metrics.responses}</h3>
          <p>People Responses</p>
        </div>
      </div>
      <div className="controls">
        <button className="start-btn" onClick={handleStart}>Start Agent</button>
        <button className="stop-btn" onClick={handleStop}>Stop Agent</button>
      </div>
    </div>
  );
};

export default StatusDashboard;
