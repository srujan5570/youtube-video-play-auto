import React, { useState } from 'react';

const ChannelInput = ({ onChannelSubmit }) => {
  const [channelUrl, setChannelUrl] = useState('');

  const handleSubmit = () => {
    if (channelUrl.trim()) {
      onChannelSubmit(channelUrl);
    }
  };

  return (
    <div className="channel-input-container">
      <h2>Enter YouTube Channel URL</h2>
      <div className="input-group">
        <input
          type="text"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          placeholder="Enter YouTube channel URL"
          className="channel-input"
        />
        <button onClick={handleSubmit} className="submit-button">
          Load Videos
        </button>
      </div>
    </div>
  );
};

export default ChannelInput;