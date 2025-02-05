import React, { useState, useEffect } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

const TweetTable = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch('http://http://3.29.236.151//tweets');
      if (!response.ok) throw new Error('Failed to fetch tweets');
      const data = await response.json();
      setTweets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Twitter Activity Log</h2>
        <p className="text-sm text-gray-500 mt-1">{tweets.length} tweets found</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Content</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Username</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Followers</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Engagement</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Interactions</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Reach</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b">Posted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tweets.map((tweet) => (
              <tr key={tweet.log_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="max-w-lg pr-4 text-gray-900 line-clamp-2">
                    {tweet.content}
                    {tweet.url && (
                      <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1 text-blue-500 hover:text-blue-600">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-blue-600 hover:text-blue-700">@{tweet.author_info?.username || 'anonymous'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">{tweet.author_info?.followers?.toLocaleString() || 0}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span className="font-medium">{tweet.engagement_metrics?.likes?.toLocaleString() || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <span>🔄</span>
                    <span className="font-medium">{tweet.engagement_metrics?.retweets?.toLocaleString() || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span className="font-medium">{tweet.engagement_metrics?.replies?.toLocaleString() || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1 text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase">Source:</span>
                      <span>{tweet.metadata?.source_device || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase">Media:</span>
                      <span>{tweet.metadata?.media_count || 0}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(tweet.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TweetTable;