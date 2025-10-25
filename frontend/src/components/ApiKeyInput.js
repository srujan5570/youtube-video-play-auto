import React from 'react';

const ApiKeyInput = ({ apiKey, setApiKey, onSubmit }) => {
  return (
    <div className="api-key-container">
      <h2>Enter YouTube API Key</h2>
      <div className="input-group">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your YouTube API Key"
          className="api-key-input"
        />
        <button onClick={onSubmit} className="submit-button">
          Submit
        </button>
      </div>
      <p className="api-key-help">
        You need a YouTube Data API key to use this application.
        <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener noreferrer">
          Learn how to get one
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput;