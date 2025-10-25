import React, { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';
import SessionManager from '../utils/sessionManager';

const VideoPlayer = ({ videoId, onEnd, onReady }) => {
  const [session, setSession] = useState(null);
  const [playerKey, setPlayerKey] = useState(0);
  const playerRef = useRef(null);

  // Generate new session on each video change or page reload
  useEffect(() => {
    const newSession = SessionManager.generateSession();
    setSession(newSession);
    setPlayerKey(prev => prev + 1); // Force complete player recreation
    
    // Log session for debugging
    console.log('New session generated:', newSession.id, 'Device:', newSession.deviceId);
  }, [videoId]);

  // Generate optimized player options
  const getPlayerOptions = () => {
    if (!session) return { height: '500', width: '100%', playerVars: { autoplay: 1 } };

    const playerVars = SessionManager.generatePlayerParams(videoId, session);
    
    return {
      height: '500',
      width: '100%',
      playerVars: playerVars,
      // Use nocookie domain for better privacy and tracking
      host: 'https://www.youtube-nocookie.com'
    };
  };

  // Enhanced ready handler with realistic user simulation
  const handleReady = (event) => {
    playerRef.current = event.target;
    
    if (session) {
      // Simulate realistic user behavior
      SessionManager.simulateUserBehavior(event.target, session);
      
      // Set viewport and device info if possible
      try {
        // Simulate different device capabilities
        const qualities = ['small', 'medium', 'large', 'hd720', 'hd1080'];
        const deviceQuality = qualities[Math.floor(Math.random() * qualities.length)];
        
        setTimeout(() => {
          event.target.setPlaybackQuality(deviceQuality);
        }, 500);
        
      } catch (error) {
        console.log('Player setup failed:', error);
      }
    }

    if (onReady) {
      onReady(event);
    }
  };

  // Enhanced end handler with session cleanup
  const handleEnd = (event) => {
    console.log('Video ended - Session:', session?.id);
    
    // Generate new session for next video to ensure fresh tracking
    setTimeout(() => {
      const newSession = SessionManager.generateSession();
      setSession(newSession);
    }, 100);
    
    if (onEnd) {
      onEnd(event);
    }
  };

  // Track play events
  const handlePlay = (event) => {
    if (session) {
      console.log('Video playing - Session:', session.id, 'Device:', session.platform);
      
      // Simulate additional user engagement
      setTimeout(() => {
        try {
          // Random interaction to simulate real user
          if (Math.random() > 0.7) {
            const currentTime = event.target.getCurrentTime();
            const randomSeek = currentTime + (Math.random() * 5 - 2.5); // ±2.5 seconds
            if (randomSeek > 0) {
              event.target.seekTo(randomSeek, true);
            }
          }
        } catch (e) {
          console.log('User simulation failed:', e);
        }
      }, Math.random() * 10000 + 5000); // 5-15 seconds
    }
  };

  // Track state changes for analytics
  const handleStateChange = (event) => {
    if (session) {
      const states = {
        '-1': 'unstarted',
        '0': 'ended',
        '1': 'playing',
        '2': 'paused',
        '3': 'buffering',
        '5': 'cued'
      };
      
      console.log('Player state:', states[event.data] || event.data, 'Session:', session.id);
    }
  };

  if (!session) {
    return <div className="video-player-container">Loading player...</div>;
  }

  return (
    <div className="video-player-container" data-session={session.id} data-device={session.deviceId}>
      {/* Main YouTube Player */}
      <YouTube
        key={`player_${videoId}_${playerKey}_${session.id}`}
        videoId={videoId}
        opts={getPlayerOptions()}
        onReady={handleReady}
        onEnd={handleEnd}
        onPlay={handlePlay}
        onPause={(event) => console.log('Video paused - Session:', session.id)}
        onStateChange={handleStateChange}
        onError={(event) => console.log('Player error:', event.data, 'Session:', session.id)}
      />
      
      {/* Additional tracking iframes to simulate multiple device views */}
      {[1, 2].map(index => (
        <iframe
          key={`tracker_${session.id}_${index}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&session=${session.id}_${index}&autoplay=0&controls=0&showinfo=0&modestbranding=1&rel=0`}
          style={{ 
            position: 'absolute', 
            left: '-9999px', 
            width: '1px', 
            height: '1px',
            opacity: 0,
            pointerEvents: 'none'
          }}
          title={`Tracker ${index}`}
          loading="lazy"
        />
      ))}
      
      {/* Session info for debugging */}
      <div style={{ display: 'none' }} id={`session-${session.id}`}>
        Session: {session.id} | Device: {session.platform} | UA: {session.userAgent.substring(0, 50)}...
      </div>
    </div>
  );
};

export default VideoPlayer;