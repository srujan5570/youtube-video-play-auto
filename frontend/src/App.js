import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ApiKeyInput from './components/ApiKeyInput';
import ChannelInput from './components/ChannelInput';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiKeySubmitted, setApiKeySubmitted] = useState(false);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'long', 'shorts'

  // Handle API key submission
  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setApiKeySubmitted(true);
    }
  };

  // Extract channel ID from URL
  const handleChannelSubmit = async (channelUrl) => {
    setLoading(true);
    setError('');
    
    try {
      // Extract channel ID or username from URL
      let channelIdentifier = '';
      
      if (channelUrl.includes('/channel/')) {
        channelIdentifier = channelUrl.split('/channel/')[1].split('/')[0];
        await fetchChannelVideos(channelIdentifier, 'id');
      } else if (channelUrl.includes('/user/')) {
        channelIdentifier = channelUrl.split('/user/')[1].split('/')[0];
        await fetchChannelVideos(channelIdentifier, 'username');
      } else if (channelUrl.includes('/c/')) {
        channelIdentifier = channelUrl.split('/c/')[1].split('/')[0];
        await fetchChannelVideos(channelIdentifier, 'customUrl');
      } else if (channelUrl.includes('@')) {
        channelIdentifier = channelUrl.split('@')[1].split('/')[0];
        await fetchChannelVideos(channelIdentifier, 'handle');
      } else {
        throw new Error('Invalid channel URL format');
      }
    } catch (err) {
      setError('Error fetching channel videos: ' + err.message);
      setLoading(false);
    }
  };

  // Fetch channel videos
  const fetchChannelVideos = async (identifier, identifierType) => {
    try {
      let channelId = identifier;
      
      // If identifier is not a direct channel ID, we need to get the channel ID first
      if (identifierType !== 'id') {
        let endpoint = '';
        let params = {};
        
        if (identifierType === 'username') {
          endpoint = 'https://www.googleapis.com/youtube/v3/channels';
          params = {
            part: 'id',
            forUsername: identifier,
            key: apiKey
          };
        } else if (identifierType === 'customUrl' || identifierType === 'handle') {
          endpoint = 'https://www.googleapis.com/youtube/v3/search';
          params = {
            part: 'snippet',
            q: identifier,
            type: 'channel',
            key: apiKey
          };
        }
        
        const response = await axios.get(endpoint, { params });
        
        if (response.data.items && response.data.items.length > 0) {
          if (identifierType === 'username') {
            channelId = response.data.items[0].id;
          } else {
            channelId = response.data.items[0].id.channelId;
          }
        } else {
          throw new Error('Channel not found');
        }
      }
      
      // Now fetch the channel's uploads playlist
      const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'contentDetails',
          id: channelId,
          key: apiKey
        }
      });
      
      if (channelResponse.data.items && channelResponse.data.items.length > 0) {
        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
        
        // Fetch videos from the uploads playlist
        const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
          params: {
            part: 'snippet,contentDetails',
            playlistId: uploadsPlaylistId,
            maxResults: 50,
            key: apiKey
          }
        });
        
        if (videosResponse.data.items && videosResponse.data.items.length > 0) {
          // Get video details for duration info
          const videoIds = videosResponse.data.items.map(item => item.contentDetails.videoId).join(',');
          
          const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
              part: 'contentDetails,snippet',
              id: videoIds,
              key: apiKey
            }
          });
          
          const videoList = videoDetailsResponse.data.items.map(video => {
            // Parse duration from ISO 8601 format
            const duration = video.contentDetails.duration;
            let isShort = true;
            
            try {
              // Check if it's a short video (less than 5 minutes)
              if (duration.includes('M')) {
                const match = duration.match(/PT(?:(\d+)H)?(\d+)M/);
                if (match) {
                  const hours = match[1] ? parseInt(match[1]) : 0;
                  const minutes = parseInt(match[2]);
                  isShort = hours === 0 && minutes < 5;
                }
              }
            } catch (error) {
              console.error('Error determining if video is short:', error);
            }
            
            return {
              id: video.id,
              title: video.snippet.title,
              thumbnail: video.snippet.thumbnails.high.url,
              publishedAt: video.snippet.publishedAt,
              duration: formatDuration(video.contentDetails.duration),
              isShort: isShort
            };
          });
          
          setVideos(videoList);
          setFilteredVideos(videoList);
          setCurrentVideoIndex(0);
        } else {
          throw new Error('No videos found for this channel');
        }
      } else {
        throw new Error('Channel not found');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error fetching videos: ' + err.message);
      setLoading(false);
    }
  };

  // Format ISO 8601 duration to readable format
  const formatDuration = (isoDuration) => {
    try {
      const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      
      if (!match) return '0:00'; // Return default if no match
      
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;
      
      let formattedDuration = '';
      
      if (hours > 0) {
        formattedDuration += `${hours}:`;
        formattedDuration += `${minutes < 10 ? '0' : ''}${minutes}:`;
      } else {
        formattedDuration += `${minutes}:`;
      }
      
      formattedDuration += `${seconds < 10 ? '0' : ''}${seconds}`;
      
      return formattedDuration;
    } catch (error) {
      console.error('Error parsing duration:', error);
      return '0:00'; // Return default duration on error
    }
  };

  // Handle video selection
  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index);
  };

  // Handle video end (autoplay next)
  const handleVideoEnd = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  // Apply filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredVideos(videos);
    } else if (filter === 'long') {
      setFilteredVideos(videos.filter(video => !video.isShort));
    } else if (filter === 'shorts') {
      setFilteredVideos(videos.filter(video => video.isShort));
    }
    
    // Reset current video index when filter changes
    setCurrentVideoIndex(0);
  }, [filter, videos]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>YouTube Channel Auto Player</h1>
      </header>
      
      <main className="app-main">
        {!apiKeySubmitted ? (
          <ApiKeyInput 
            apiKey={apiKey} 
            setApiKey={setApiKey} 
            onSubmit={handleApiKeySubmit} 
          />
        ) : (
          <>
            {videos.length === 0 ? (
              <ChannelInput onChannelSubmit={handleChannelSubmit} />
            ) : (
              <div className="content-container">
                {filteredVideos.length > 0 && (
                  <VideoPlayer 
                    videoId={filteredVideos[currentVideoIndex].id} 
                    onEnd={handleVideoEnd}
                  />
                )}
                
                <div className="filter-buttons">
                  <button 
                    className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Videos
                  </button>
                  <button 
                    className={`filter-button ${filter === 'long' ? 'active' : ''}`}
                    onClick={() => setFilter('long')}
                  >
                    Long Videos
                  </button>
                  <button 
                    className={`filter-button ${filter === 'shorts' ? 'active' : ''}`}
                    onClick={() => setFilter('shorts')}
                  >
                    Shorts
                  </button>
                </div>
                
                <VideoList 
                  videos={filteredVideos} 
                  onVideoSelect={handleVideoSelect}
                  currentVideoIndex={currentVideoIndex}
                />
              </div>
            )}
          </>
        )}
        
        {loading && <div className="loader">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
      </main>
    </div>
  );
}

export default App;
