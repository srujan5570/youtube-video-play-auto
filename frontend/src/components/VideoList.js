import React from 'react';

const VideoList = ({ videos, onVideoSelect, currentVideoIndex }) => {
  return (
    <div className="video-list-container">
      <h2>Videos</h2>
      <div className="filter-controls">
        <button className="filter-button">All Videos</button>
        <button className="filter-button">Long Videos</button>
        <button className="filter-button">Shorts</button>
      </div>
      <div className="video-list">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className={`video-item ${index === currentVideoIndex ? 'active' : ''}`}
            onClick={() => onVideoSelect(index)}
          >
            <div className="thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <span className="duration">{video.duration}</span>
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <p className="video-date">{new Date(video.publishedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;