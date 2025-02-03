import React, { useState } from 'react';
import './AgentSettings.css';

const AgentSettings = () => {
  const [tweetPersonality, setTweetPersonality] = useState('');
  const [geminiSentences, setGeminiSentences] = useState(['', '', '']);
  const [commentPersonality, setCommentPersonality] = useState('');

  const handleGeminiChange = (index, value) => {
    const updated = [...geminiSentences];
    updated[index] = value;
    setGeminiSentences(updated);
  };

  return (
    <div className="agent-settings">
      <h2>Agent Dynamic Settings</h2>
      <div className="setting-group">
        <label>Agent Personality for Tweet Replies:</label>
        <input 
          type="text" 
          value={tweetPersonality} 
          onChange={(e) => setTweetPersonality(e.target.value)} 
          placeholder="Enter personality traits"
        />
      </div>
      <div className="setting-group">
        <label>Gemini API Rewritten Sentences:</label>
        {geminiSentences.map((sentence, idx) => (
          <input
            key={idx}
            type="text"
            value={sentence}
            onChange={(e) => handleGeminiChange(idx, e.target.value)}
            placeholder={`Sentence ${idx + 1}`}
          />
        ))}
      </div>
      <div className="setting-group">
        <label>Agent Personality for Comment Replies:</label>
        <input 
          type="text" 
          value={commentPersonality} 
          onChange={(e) => setCommentPersonality(e.target.value)} 
          placeholder="Enter personality traits"
        />
      </div>
    </div>
  );
};

export default AgentSettings;
