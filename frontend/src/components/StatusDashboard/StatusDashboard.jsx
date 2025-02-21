import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StatusDashboard.css";
import config from "../../config";

const StatusDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metrics, setMetrics] = useState({ fetched: 0, replied: 0});
  const [replies, setReplies] = useState(0);
  const [totalLimit, setTotalLimit] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState("");

  const formatDate = (date) => {
    if (!date) {
      console.error("Invalid date:", date);
      return null; // Return null or handle appropriately
    }
    return date.toISOString().split("T")[0];
  };

  
  const fetchTweetReplies = useCallback(async (date) => {
    const formattedDate = formatDate(date);
    try {
      const response = await fetch(`${config.API_BASE_URL}/tweetreplies`);
      if (!response.ok) throw new Error("Failed to fetch tweet replies");
      const data = await response.json();
      
      // Filter replies that match the selected date
      const filteredReplies = data.filter((reply) => reply.timestamp.includes(formattedDate));
      const responses = filteredReplies.length;  // Number of replies for the selected date
      
      setReplies(responses);
   
      
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  const fetchTweets = useCallback(async (date) => {
    const formattedDate = formatDate(date);
    try {
      const response = await fetch(`${config.API_BASE_URL}/tweets`);
      if (!response.ok) throw new Error("Failed to fetch tweets");
      const data = await response.json();
      
      const filteredTweets = data.filter((tweet) => tweet.timestamp.includes(formattedDate));
      
      const fetched = filteredTweets.length;
      const replied = filteredTweets.filter((tweet) => tweet.status === "replied").length;
      const responses = fetched - replied;
     
      // Filter tweets with replied_timestamp matching selected date
      const repliedTweets = data.filter((tweet) => tweet.updated_at && tweet.updated_at.includes(formattedDate)).length;
      
      setMetrics({ fetched, replied, responses });
      setTotalLimit(repliedTweets);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const [statusResponse, delayResponse] = await Promise.all([
        fetch(`${config.API_BASE_URL}/status`),
        fetch(`${config.API_BASE_URL}/get-delay`)
      ]);
  
      const statusData = await statusResponse.json();
      const delayData = await delayResponse.json();
  
      if (statusResponse.ok) {
        setIsRunning(statusData.status === "running");
      }
  
      if (delayResponse.ok) {
        setDelay(delayData.delay.toString());  // Convert to string for input field
      }
    } catch (error) {
      console.error("Error fetching status or delay:", error);
    }
  }, []);
  
  useEffect(() => {
    fetchTweets(selectedDate);
    fetchStatus();
    fetchTweetReplies(selectedDate);
  }, [selectedDate, fetchStatus, fetchTweets, fetchTweetReplies]);

  const handleStart = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/start`, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setStatusMessage("Agent started successfully!");
        setIsRunning(true);
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
        setStatusMessage("Agent stopped successfully!");
        setIsRunning(false);
      } else {
        setStatusMessage(`Failed to stop agent: ${data.message}`);
      }
    } catch (error) {
      console.error("Error stopping the agent:", error);
      setStatusMessage("An error occurred while stopping the agent.");
    }
  };
  const handleUpdateDelay = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/update-delay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delay: parseInt(delay, 10) || 0 })
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging log
  
      if (response.ok) {
        setStatusMessage("Delay updated successfully!");
      } else {
        setStatusMessage(`Failed to update delay: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating delay:", error);
      setStatusMessage("An error occurred while updating the delay.");
    }
  };

  const handleClearLogs = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/clear-logs`, { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setStatusMessage("Logs cleared successfully!");
      } else {
        setStatusMessage(`Failed to clear logs: ${data.error}`);
      }
    } catch (error) {
      console.error("Error clearing logs:", error);
      setStatusMessage("An error occurred while clearing logs.");
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
        Below is the Daily Status of the Agent based on the Metrics including Tweets Fetched, Tweets Replied, Replies Sent to people's comments.
      </p>
      <div className="metrics">
        <div className="metric-item"><h3>{metrics.fetched}</h3><p>Tweets Fetched</p></div>
        <div className="metric-item"><h3>{replies}</h3><p>Metions Replied</p></div>
        <div className="metric-item"><h3>{totalLimit+replies}</h3><p>Total Replied</p></div>
        
      </div>
      <div className="time-input-container">
        <input
          type="number"
          placeholder="Enter time in seconds"
          value={delay}
          onChange={(e) => setDelay(e.target.value)}
          className="delay-input"
        />
        <button className="update-btn" onClick={handleUpdateDelay}>Update Delay</button>
      </div>
      {statusMessage && <div className="status-message"><p>{statusMessage}</p></div>}
      <div className="controls">
        <button className="start-btn" onClick={handleStart} disabled={isRunning}>Start Agent</button>
        <button className="stop-btn" onClick={handleStop} disabled={!isRunning}>Stop Agent</button>
      </div>
      <div className="controls">
        <button className="clear-logs-btn" onClick={handleClearLogs}>Clear Logs</button>
      </div>
    </div>
  );
};

export default StatusDashboard;
