import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId, onEnd, onReady }) => {
  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="video-player-container">
      <YouTube
        videoId={videoId}
        opts={opts}
        onEnd={onEnd}
        onReady={onReady}
      />
    </div>
  );
};

export default VideoPlayer;