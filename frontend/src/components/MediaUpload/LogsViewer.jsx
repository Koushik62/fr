import React, { useState, useEffect } from "react";
import "./LogsViewer.css";
import config from "../../config"; // Ensure this contains API_BASE_URL

const LogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [processOutput, setProcessOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/logs`);
        const data = await response.json();

        if (response.ok) {
          setLogs(data.logs);
          setProcessOutput(data.process_output);
        } else {
          throw new Error(data.error || "Failed to fetch logs");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Auto-refresh logs every 5 sec
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="logs-viewer">
      <h2>Application Logs</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="logs-container">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))
        ) : (
          <p className="no-logs">No logs available.</p>
        )}
      </div>
      <h3>Process Output</h3>
      <pre className="process-output">{processOutput || "No process output"}</pre>
    </div>
  );
};

export default LogsViewer;
