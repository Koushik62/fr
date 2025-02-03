import React, { useState } from 'react';
import './HashtagManager.css';

const HashtagManager = () => {
  const [requiredTags, setRequiredTags] = useState([]);
  const [optionalTags, setOptionalTags] = useState([]);
  const [newReq, setNewReq] = useState('');
  const [newOpt, setNewOpt] = useState('');

  const addRequired = () => {
    if(newReq) {
      setRequiredTags([...requiredTags, newReq]);
      setNewReq('');
    }
  };

  const addOptional = () => {
    if(newOpt) {
      setOptionalTags([...optionalTags, newOpt]);
      setNewOpt('');
    }
  };

  return (
    <div className="hashtag-manager">
      <h2>Hashtag Management</h2>
      <div className="hashtag-section">
        <h3>Required Hashtags</h3>
        <input 
          type="text" 
          value={newReq} 
          onChange={(e) => setNewReq(e.target.value)} 
          placeholder="Enter required hashtag" 
        />
        <button onClick={addRequired}>Add</button>
        <ul>
          {requiredTags.map((tag, index) => (
            <li key={index}>#{tag}</li>
          ))}
        </ul>
      </div>
      <div className="hashtag-section">
        <h3>Optional Hashtags</h3>
        <input 
          type="text" 
          value={newOpt} 
          onChange={(e) => setNewOpt(e.target.value)} 
          placeholder="Enter optional hashtag" 
        />
        <button onClick={addOptional}>Add</button>
        <ul>
          {optionalTags.map((tag, index) => (
            <li key={index}>#{tag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HashtagManager;
