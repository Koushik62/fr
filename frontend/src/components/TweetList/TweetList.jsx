// TweetTable.jsx
import React, { useState, useEffect } from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import "./TweetList.css";
import config from "../../config";

const TweetList= () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTweets, setSelectedTweets] = useState([]);
  const [sortBy, setSortBy] = useState("timestamp");

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/tweets`);
      if (!response.ok) throw new Error("Failed to fetch tweets");
      const data = await response.json();
      console.log(data);
      setTweets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTweet = (tweetId) => {
    setSelectedTweets(prev => 
      prev.includes(tweetId) 
        ? prev.filter(id => id !== tweetId)
        : [...prev, tweetId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Delete selected tweets?")) return;
    
    try {
      await Promise.all(
        selectedTweets.map(id =>
          fetch(`${process.env.REACT_APP_API_URL}/tweets/${id}`, {
            method: 'DELETE'
          })
        )
      );
      setTweets(prev => prev.filter(tweet => !selectedTweets.includes(tweet.id)));
      setSelectedTweets([]);
    } catch (err) {
      console.error("Failed to delete tweets:", err);
    }
  };

  const sortTweets = (type) => {
    setSortBy(type);
    const sorted = [...tweets].sort((a, b) => {
      switch(type) {
        case 'views':
          return b.views - a.views;
        case 'tags':
          return b.tags.length - a.tags.length;
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
    setTweets(sorted);
  };

  if (loading) return <div className="loading">Loading tweets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tweets-container">
      <h1>Tweets</h1>
      <p className="subtitle">
        List of tweets from Different Types of Accounts, Tweet Views and
        Tags Found inside each Tweet
      </p>

      <div className="table-controls">
        <select 
          className="sort-by"
          onChange={(e) => sortTweets(e.target.value)}
          value={sortBy}
        >
          <option value="timestamp">Sort By</option>
          <option value="views">Views</option>
          <option value="tags">Tags</option>
          <option value="timestamp">Date</option>
        </select>
      </div>

      <table className="tweets-table">
        <thead>
          <tr>
            <th>Account Type</th>
            <th>Tweet URL</th>
            <th>Tweet Views</th>
            <th>Number of Tags</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {tweets.map((tweet) => (
            <tr key={tweet.id}>
              <td>{tweet.verified || 'Unknown'}</td>
              <td>
                <a 
                  href={`https://twitter.com/${tweet.username}/status/${tweet.tweet_id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} /> View Tweet
                </a>
              </td>
              <td>{(tweet.views || 0).toLocaleString()}</td>
              <td>{tweet.tags?.length || 0}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedTweets.includes(tweet.id)}
                  onChange={() => handleSelectTweet(tweet.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedTweets.length > 0 && (
        <button className="delete-selected" onClick={handleDeleteSelected}>
          Delete Selected
        </button>
      )}
    </div>
  );
};

export default TweetList;
