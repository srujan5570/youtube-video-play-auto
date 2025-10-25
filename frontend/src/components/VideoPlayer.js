import React, { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';
import sessionManager from '../utils/sessionManager';

const VideoPlayer = ({ videoId, onEnd, onReady }) => {
  const [sessionData, setSessionData] = useState(null);
  const [playerKey, setPlayerKey] = useState(0);
  const playerRef = useRef(null);
  const viewStartTime = useRef(null);

  // Create new session for each video
  useEffect(() => {
    const newSession = sessionManager.createVideoSession(videoId);
    setSessionData(newSession);
    setPlayerKey(prev => prev + 1); // Force player re-render with new session
    viewStartTime.current = Date.now();

    // Simulate page reload behavior - clear any existing YouTube cookies/cache
    if (window.localStorage) {
      // Clear YouTube-related localStorage items
      Object.keys(window.localStorage).forEach(key => {
        if (key.includes('youtube') || key.includes('yt')) {
          window.localStorage.removeItem(key);
        }
      });
    }

    return () => {
      // Update final view duration when component unmounts or video changes
      if (viewStartTime.current && newSession) {
        const duration = (Date.now() - viewStartTime.current) / 1000;
        sessionManager.updateViewDuration(newSession.sessionId, duration);
      }
    };
  }, [videoId]);

  // Generate optimized player parameters for view counting
  const generatePlayerVars = () => {
    if (!sessionData) return { autoplay: 1 };

    const baseVars = {
      autoplay: 1,
      controls: 1,
      showinfo: 1,
      rel: 0, // Don't show related videos
      modestbranding: 1,
      iv_load_policy: 3, // Hide annotations
      fs: 1, // Allow fullscreen
      cc_load_policy: 0, // Don't show captions by default
      disablekb: 0, // Enable keyboard controls
      enablejsapi: 1, // Enable JS API
      origin: window.location.origin,
      playsinline: 1,
    };

    // Add session-specific randomization
    const sessionVars = {
      // Random start time (0-2 seconds) to simulate natural clicking
      start: Math.floor(Math.random() * 3),
      // Use session quality preference
      vq: sessionData.quality,
      // Random widget referrer from session
      widget_referrer: sessionData.referrer,
      // Add timestamp to make each embed unique
      t: Date.now(),
      // Random player theme
      theme: Math.random() > 0.5 ? 'dark' : 'light',
      // Random color scheme
      color: Math.random() > 0.5 ? 'red' : 'white',
    };

    return { ...baseVars, ...sessionVars };
  };

  const opts = {
    height: '500',
    width: '100%',
    playerVars: generatePlayerVars(),
    // Use youtube-nocookie.com for better privacy and unique sessions
    host: 'https://www.youtube-nocookie.com',
  };

  // Enhanced onReady handler with session simulation
  const handleReady = (event) => {
    const player = event.target;
    playerRef.current = player;
    
    if (!sessionData) return;

    // Simulate human-like behavior after player loads
    setTimeout(() => {
      // Random volume (20-100%)
      const volume = Math.floor(Math.random() * 80) + 20;
      player.setVolume(volume);

      // Simulate device-specific quality selection
      const qualities = player.getAvailableQualityLevels();
      if (qualities.length > 0) {
        const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
        player.setPlaybackQuality(randomQuality);
      }

      // Start periodic behavior simulation
      const behaviorInterval = setInterval(() => {
        sessionManager.simulateViewingBehavior(sessionData.sessionId);
        
        // Update view duration
        if (viewStartTime.current) {
          const duration = (Date.now() - viewStartTime.current) / 1000;
          sessionManager.updateViewDuration(sessionData.sessionId, duration);
        }
      }, 5000); // Every 5 seconds

      // Clean up interval when video ends or changes
      const cleanup = () => clearInterval(behaviorInterval);
      player.addEventListener('onStateChange', (state) => {
        if (state.data === 0) cleanup(); // Video ended
      });

    }, Math.random() * 3000 + 1000); // Random delay 1-4 seconds

    // Call original onReady
    if (onReady) {
      onReady(event);
    }
  };

  // Enhanced onEnd handler
  const handleEnd = (event) => {
    if (sessionData && viewStartTime.current) {
      const totalDuration = (Date.now() - viewStartTime.current) / 1000;
      sessionManager.updateViewDuration(sessionData.sessionId, totalDuration);
    }

    // Simulate human delay before next video
    setTimeout(() => {
      if (onEnd) {
        onEnd(event);
      }
    }, Math.random() * 2000 + 1000); // 1-3 second delay
  };

  // Enhanced state change handler for realistic engagement
  const handleStateChange = (event) => {
    const player = event.target;
    const state = event.data;
    
    if (!sessionData) return;

    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    switch (state) {
      case 1: // Playing
        // Simulate occasional user interactions during playback
        if (Math.random() < 0.15) { // 15% chance
          setTimeout(() => {
            const duration = player.getDuration();
            if (duration > 30) { // Only for videos longer than 30 seconds
              // Simulate seeking behavior (skip to different parts)
              const seekPositions = [
                Math.random() * duration * 0.1, // Beginning
                Math.random() * duration * 0.3 + duration * 0.2, // Early middle
                Math.random() * duration * 0.3 + duration * 0.5, // Late middle
                Math.random() * duration * 0.2 + duration * 0.7, // Near end
              ];
              
              const randomSeek = seekPositions[Math.floor(Math.random() * seekPositions.length)];
              player.seekTo(randomSeek, true);
            }
          }, Math.random() * 15000 + 5000); // 5-20 seconds after start
        }
        break;
        
      case 2: // Paused
        // Simulate resuming after random pause
        if (Math.random() < 0.7) { // 70% chance to resume
          setTimeout(() => {
            if (player.getPlayerState() === 2) { // Still paused
              player.playVideo();
            }
          }, Math.random() * 10000 + 2000); // 2-12 seconds
        }
        break;
        
      default:
        // Handle other states (unstarted, ended, buffering, cued)
        break;
    }
  };

  // Handle player errors by creating new session
  const handleError = (event) => {
    console.log('Player error, creating new session:', event);
    const newSession = sessionManager.createVideoSession(videoId);
    setSessionData(newSession);
    setPlayerKey(prev => prev + 1);
  };

  if (!sessionData) {
    return <div className="video-player-container">Loading player...</div>;
  }

  return (
    <div 
      className="video-player-container" 
      data-session={sessionData.sessionId}
      data-fingerprint={JSON.stringify(sessionData.fingerprint)}
    >
      <YouTube
        key={`${videoId}_${playerKey}_${sessionData.sessionId}`}
        videoId={videoId}
        opts={opts}
        onEnd={handleEnd}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={handleError}
      />
      
      {/* Hidden elements to simulate different device characteristics */}
      <div style={{ display: 'none' }}>
        <span data-ua={sessionData.userAgent}></span>
        <span data-ref={sessionData.referrer}></span>
        <span data-lang={sessionData.fingerprint.language}></span>
        <span data-tz={sessionData.fingerprint.timezone}></span>
      </div>
    </div>
  );
};

export default VideoPlayer;