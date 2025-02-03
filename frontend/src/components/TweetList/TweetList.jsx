import React, { useState } from 'react';
import './TweetList.css';

const TweetList = () => {
  // Example tweets data. Replace with your fetched tweets.
  const [tweets, setTweets] = useState([
    { id: 1, text: 'Tweet number one', url: 'https://twitter.com/status/1', followers: 150000, verified: 'blue' },
    { id: 2, text: 'Tweet number two', url: 'https://twitter.com/status/2', followers: 90000, verified: 'none' },
    { id: 3, text: 'Tweet number three', url: 'https://twitter.com/status/3', followers: 200000, verified: 'yellow' }
  ]);

  const deleteTweet = (id) => {
    setTweets(tweets.filter(tweet => tweet.id !== id));
  };

  // Sorting functions can be expanded as needed
  const sortByFollowers = () => {
    const sorted = [...tweets].sort((a, b) => b.followers - a.followers);
    setTweets(sorted);
  };

  const sortByVerified = () => {
    const verifiedTweets = tweets.filter(tweet => tweet.verified !== 'none');
    setTweets(verifiedTweets);
  };

  return (
    <div className="tweet-list">
      <h2>Fetched Tweets</h2>
      <div className="sort-options">
        <button onClick={sortByFollowers}>Sort by Followers (100k+)</button>
        <button onClick={sortByVerified}>Sort by Verified</button>
      </div>
      <ul>
        {tweets.map(tweet => (
          <li key={tweet.id} className="tweet-item">
            <a href={tweet.url} target="_blank" rel="noopener noreferrer">{tweet.text}</a>
            <span className="tweet-info">
              {tweet.followers >= 100000 && <strong>100k+</strong>} {tweet.verified !== 'none' && <em>{tweet.verified} verified</em>}
            </span>
            <button className="delete-btn" onClick={() => deleteTweet(tweet.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TweetList;
