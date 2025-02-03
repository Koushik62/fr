import React, { useState } from 'react';
import './MediaUpload.css';

const MediaUpload = () => {
  const [mediaType, setMediaType] = useState('image');
  const [message, setMessage] = useState('');

  return (
    <div className="media-upload">
      <h2>Upload Media</h2>
      <div className="media-controls">
        <label htmlFor="mediaType">Select Media Type:</label>
        <select 
          id="mediaType" 
          value={mediaType} 
          onChange={(e) => {
            setMediaType(e.target.value);
            setMessage(''); // reset message on type change
          }}
        >
          <option value="image">Image</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
      </div>
      <div className="media-message">
        <label>
          Message for {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Post:
        </label>
        <textarea 
          placeholder={`Enter message for ${mediaType} post`} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="media-file">
        <input 
          type="file" 
          accept={mediaType === 'image' ? 'image/*' : mediaType === 'audio' ? 'audio/*' : 'video/*'} 
        />
      </div>
    </div>
  );
};

export default MediaUpload;
