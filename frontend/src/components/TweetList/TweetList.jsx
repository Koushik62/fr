import React, { useState, useEffect } from "react";
import { ExternalLink, Trash2, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import "./TweetList.css";
import config from "../../config";

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTweets, setSelectedTweets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Change number of tweets per page to 20
  const tweetsPerPage = 20;
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // NOTE: For this solution we assume the API returns all tweets (or a large set) in one fetch.
  // If you truly want to fetch everything only once, remove the "page" query parameter from your request.
  useEffect(() => {
    fetchTweets();
  }, []);

  useEffect(() => {
    if (sortField) {
      handleSort();
    }
  }, [sortField, sortOrder]);

  const fetchTweets = async () => {
    setLoading(true);
    try {
      // Option A: Server-side pagination (if your API supports it)
      // const response = await fetch(`${config.API_BASE_URL}/tweets?page=${currentPage}&limit=${tweetsPerPage}`);
      
      // Option B: Fetch all tweets at once (client-side pagination)
      const response = await fetch(`${config.API_BASE_URL}/tweets`);
      if (!response.ok) throw new Error("Failed to fetch tweets");
      const data = await response.json();
      setTweets(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    const sortedTweets = [...tweets].sort((a, b) => {
      switch (sortField) {
        case 'accountType': {
          const typeA = a.verified || 'Unknown';
          const typeB = b.verified || 'Unknown';
          return sortOrder === 'asc'
            ? typeA.localeCompare(typeB)
            : typeB.localeCompare(typeA);
        }
        case 'followers':
          return sortOrder === 'asc'
            ? a.followers - b.followers
            : b.followers - a.followers;
        case 'status': {
          const statusA = a.status === 'replied' ? 1 : 0;
          const statusB = b.status === 'replied' ? 1 : 0;
          return sortOrder === 'asc'
            ? statusA - statusB
            : statusB - statusA;
        }
        case 'replyTime': {
          const timeA = new Date(a.updated_at || 0).getTime();
          const timeB = new Date(b.updated_at || 0).getTime();
          return sortOrder === 'asc'
            ? timeA - timeB
            : timeB - timeA;
        }
        default:
          return 0;
      }
    });
    setTweets(sortedTweets);
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
        selectedTweets.map((log_id) =>
          fetch(`${config.API_BASE_URL}/tweets/${log_id}`, {
            method: "DELETE",
          })
        )
      );
      setTweets((prev) =>
        prev.filter((tweet) => !selectedTweets.includes(tweet.tweet_id))
      );
      setSelectedTweets([]);
    } catch (err) {
      console.error("Failed to delete tweets:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not replied yet';
    return new Date(dateString).toLocaleString();
  };

  // Calculate indices for client-side pagination
  const indexOfLastTweet = currentPage * tweetsPerPage;
  const indexOfFirstTweet = indexOfLastTweet - tweetsPerPage;
  // Use slice to render only the tweets for the current page
  const currentTweets = tweets.slice(indexOfFirstTweet, indexOfLastTweet);

  // Recalculate total pages based on all tweets
  const totalPages = Math.ceil(tweets.length / tweetsPerPage);

  // Build an array of page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Display up to 5 page buttons then show '...' and last page if needed
    for (let i = 1; i <= totalPages && i <= 5; i++) {
      pageNumbers.push(i);
    }
    if (totalPages > 5) {
      pageNumbers.push('...', totalPages);
    }
    return pageNumbers;
  };

  if (loading) return <div className="loading">Loading tweets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tweets-container">
      <h1>Tweets</h1>
      <p className="subtitle">
        List of tweets from Different Types of Accounts, Tweet Views and Tags
        Found inside each Tweet
      </p>

      <div className="sorting-controls">
        <select 
          value={sortField} 
          onChange={(e) => setSortField(e.target.value)}
          className="sort-select"
        >
          <option value="">Sort by...</option>
          <option value="accountType">Account Type</option>
          <option value="followers">Followers</option>
          <option value="status">Reply Status</option>
          <option value="replyTime">Reply Time</option>
        </select>
        &nbsp; 
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table className="tweets-table">
        <thead>
          <tr>
            <th>Account Type</th>
            <th>Tweet URL</th>
            <th>Username</th>
            <th>Followers</th>
            <th>Status</th>
            <th>Reply Time</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {currentTweets.map((tweet) => (
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
              <td>{tweet.followers?.toLocaleString()}</td>
              <td>
                {tweet.status === "replied" && tweet.reply_id ? (
                  <a
                    href={`https://twitter.com/SuimonAgent/status/${tweet.reply_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} /> View Reply
                  </a>
                ) : (
                  <span className="not-replied">Not Replied Yet</span>
                )}
              </td>
              <td>{formatDate(tweet.updated_at)}</td>
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
          Delete Selected ({selectedTweets.length})
        </button>
      )}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === "..." ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                onClick={() => setCurrentPage(pageNumber)}
                className={`pagination-button ${currentPage === pageNumber ? "active" : ""}`}
              >
                {pageNumber}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TweetList;
