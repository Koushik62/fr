import React, { useState } from 'react';
import './Broadcast.css';
import config from '../../config';
const characters = [
  'sui', 'grum', 'stomp', 'blaze', 'brocco', 'yeti', 'nubb', 'nom',
  'cyclo', 'glint', 'fluff', 'captainboo', 'momo', 'slippy', 'whirl', 'twispy','pico','tuga', 'kai', 'ruk', 'pyro', 'grow', 'luna', 'floar','ecron'
];


const Broadcast = () => {
  const [requiredTags, setRequiredTags] = useState(['SUI', 'SuiGaming', 'Gaming']);
  const [optionalTags, setOptionalTags] = useState(['Blockchain']);
  const [tweetPersonality, setTweetPersonality] = useState(characters[0]);
  const [dynamicSentences, setDynamicSentences] = useState(['', '', '']);
  const [commentPersonality, setCommentPersonality] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('images');
  const [loading, setLoading] = useState(false);

  
  // Function to update hashtags
  const updateHashtags = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/update-hashtags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requiredTags, optionalTags }) // Send as an array

      });
      if (!response.ok) throw new Error('Failed to update hashtags');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTweetPersonality = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/updatereplypersonality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tweetPersonality })
      });
      if (!response.ok) throw new Error('Failed to update tweet personality');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating tweet personality:', error);
    } finally {
      setLoading(false);
    }
  };


  const updateCommentPersonality = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/updatecommentpersonality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentPersonality })
      });
      if (!response.ok) throw new Error('Failed to update comment personality');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating comment personality:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDynamicSentences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/updatedynamicpersonality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: dynamicSentences }) 
      });
      if (!response.ok) throw new Error('Failed to update dynamic sentences');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating dynamic sentences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Broadcast function
  const handleBroadcast = async (type) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaType: type })
      });
      if (!response.ok) throw new Error('Broadcast failed');
      console.log(await response.json());
      setSelectedMedia(type);
    } catch (error) {
      console.error('Broadcast error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dynamic-content">
      <h1>Dynamic Content</h1>
      <div className="content-container">
        <div className="left-section">
          <div className="parameters">
            <p>Below are the Dynamic Parameters which we can update:</p>
            <ol>
              <li>HashTags (Required and Optional)</li>
              <li>Personality of Agent when Replying to Tweets</li>
              <li>3 Dynamic Sentences that change every time</li>
              <li>Personality of Agent when Replying to Comments</li>
            </ol>
          </div>

          {/* Hashtags Section */}
          <div className="hashtags-section">
            <div className="hashtag-group">
              <h3>HashTags that Must be Present</h3>
              <input
  type="text"
  value={requiredTags.join(', ')} // Display as comma-separated
  onChange={(e) => setRequiredTags(
    e.target.value.split(',').map(tag => tag.trim()) // Trim spaces
  )}
/>
            </div>
            <div className="hashtag-group">
              <h3>HashTags that are Optional</h3>
              <input
  type="text"
  value={optionalTags.join(', ')}
  onChange={(e) => setOptionalTags(
    e.target.value.split(',').map(tag => tag.trim()) // Trim spaces
  )}
/>
            </div>
            <button className="update-btn" onClick={updateHashtags} disabled={loading}>
              {loading ? 'Updating...' : 'Update HashTags'}
            </button>
          </div>

          {/* Personality Sections */}
          <div className="personality-sections">
          <div className="personality-group">
          <label>Agent Personality for Tweet Replies:</label>
          <select
            value={tweetPersonality}
            onChange={(e) => setTweetPersonality(e.target.value)}
          >
            {characters.map((character, index) => (
              <option key={index} value={character}>{character}</option>
            ))}
          </select>
          <button onClick={updateTweetPersonality} disabled={loading}>
            {loading ? 'Updating...' : 'Update Personality for Replying to Tweets'}
          </button>
        </div>

            <div className="personality-group">
            <textarea
              value={dynamicSentences} // Keep it as a single string
              onChange={(e) => setDynamicSentences(e.target.value)} // No splitting
              placeholder="3 Dynamic Sentences Response"
            />

              <button onClick={updateDynamicSentences} disabled={loading}>
                {loading ? 'Updating...' : 'Update 3 Sentences Dynamic Response'}
              </button>
            </div>

            <div className="personality-group">
              <textarea
                value={commentPersonality}
                onChange={(e) => setCommentPersonality(e.target.value)}
                placeholder="Agent Personality for People Comments"
              />
              <button onClick={updateCommentPersonality} disabled={loading}>
                {loading ? 'Updating...' : "Update Personality for Replying to People's Comments"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Broadcast */}
        <div className="right-section">
          <div className="broadcast-info">
            <p>Select one of the buttons below to broadcast either an image, a video, or an audio podcast.</p>
          </div>
          <div className="broadcast-buttons">
            <button
              className={`broadcast-btn ${selectedMedia === 'images' ? 'active' : ''}`}
              onClick={() => handleBroadcast('images')}
              disabled={loading}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Images'}
            </button>
            <button
              className={`broadcast-btn ${selectedMedia === 'videos' ? 'active' : ''}`}
              onClick={() => handleBroadcast('videos')}
              disabled={loading}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Videos'}
            </button>
            <button
              className={`broadcast-btn ${selectedMedia === 'audios' ? 'active' : ''}`}
              onClick={() => handleBroadcast('audios')}
              disabled={loading}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Audios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
