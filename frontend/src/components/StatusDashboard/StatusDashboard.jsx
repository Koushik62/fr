import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StatusDashboard.css";
import config from "../../config";

const StatusDashboard = () => {
  const [tweets, setTweets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metrics, setMetrics] = useState({ fetched: 0, replied: 0, responses: 0 });
  const [statusMessage, setStatusMessage] = useState(""); // State for feedback messages

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

      if (response.ok) {
        setStatusMessage("Agent started successfully!"); // Display success message
      } else {
        setStatusMessage(`Failed to start agent: ${data.message}`);
      }
    } catch (error) {
      console.error("Error starting the agent:", error);
      setStatusMessage("An error occurred while starting the agent.");
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/stop`, { method: "GET" });
      const data = await response.json();

      if (response.ok) {
        setStatusMessage("Agent stopped successfully!"); // Display success message
      } else {
        setStatusMessage(`Failed to stop agent: ${data.message}`);
      }
    } catch (error) {
      console.error("Error stopping the agent:", error);
      setStatusMessage("An error occurred while stopping the agent.");
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
      {statusMessage && (
        <div className="status-message">
          <p>{statusMessage}</p>
        </div>
      )}
      <div className="controls">
        <button className="start-btn" onClick={handleStart}>Start Agent</button>
        <button className="stop-btn" onClick={handleStop}>Stop Agent</button>
      </div>
    </div>
  );
};

export default StatusDashboard;
