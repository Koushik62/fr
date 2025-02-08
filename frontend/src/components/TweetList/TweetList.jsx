// TweetTable.jsx
import React, { useState, useEffect } from "react";
import { ExternalLink , Trash2} from "lucide-react";
import "./TweetList.css";
import config from "../../config";
import { CheckCircle } from "lucide-react"; // Replace with your preferred icon library


const TweetList= () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTweets, setSelectedTweets] = useState([]);
  

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
    setSelectedTweets((prev) =>
      prev.includes(tweetId)
        ? prev.filter((id) => id !== tweetId)
        : [...prev, tweetId]
    );
  };
  

  const handleDeleteSelected = async () => {
    if (!window.confirm("Delete selected tweets?")) return;

    try {
        await Promise.all(
            selectedTweets.map(log_id =>  // Use log_id instead of tweet_id
                fetch(`${config.API_BASE_URL}/tweets/${log_id}`, {
                    method: 'DELETE'
                })
            )
        );
        setTweets(prev => prev.filter(tweet => !selectedTweets.includes(tweet.log_id)));
        setSelectedTweets([]);
    } catch (err) {
        console.error("Failed to delete tweets:", err);
    }
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

      <table className="tweets-table">
        <thead>
          <tr>
            <th>Account Type</th>
            <th>Tweet URL</th>
            <th>Username</th>
            <th>Followers</th>
            <th>Status</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {tweets.map((tweet) => (
            <tr key={tweet.id}>
              <td>
                {tweet.verified === "Blue" && (
                  <>
                    Blue <CheckCircle color="#1DA1F2" size={16} />
                  </>
                )}
                {tweet.verified === "Yellow" && (
                  <>
                    Yellow <CheckCircle color="gold" size={16} />
                  </>
                )}
                {tweet.verified === "Grey" && (
                  <>
                    Grey <CheckCircle color="gray" size={16} />
                  </>
                )}
                {!tweet.verified && <>Unknown ❓</>}
              </td>

              <td>
                <a 
                  href={`https://twitter.com/${tweet.username}/status/${tweet.tweet_id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} /> View Tweet
                </a>
                
              </td>
              <td>{tweet.username}</td>
              <td>{tweet.followers}</td>
              <td>
  {tweet.status === "replied" && tweet.reply_id && (
    <a
      href={`https://twitter.com/SuimonAgent/status/${tweet.reply_id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginLeft: "10px" }}
    >
      <ExternalLink size={16} /> View Reply
    </a>
  )}
</td>

              <td>
  <input
    type="checkbox"
    checked={selectedTweets.includes(tweet.tweet_id)}
    onChange={() => handleSelectTweet(tweet.tweet_id)}
  />
  {selectedTweets.includes(tweet.tweet_id) && (
    <button
      className="delete-icon"
      title="Delete Tweet"
      onClick={() => handleDeleteSelected(tweet.tweet_id)}
    >
      <Trash2 size={16} color="red" />
    </button>
  )}
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
