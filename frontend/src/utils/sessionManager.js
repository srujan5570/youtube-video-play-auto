// Session management utilities for YouTube view optimization
import FingerprintingManager from './fingerprinting.js';

class SessionManager {
  constructor() {
    this.currentSession = null;
    this.sessionHistory = [];
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    ];
  }

  // Generate a unique session with device simulation
  generateSession() {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const deviceId = Math.random().toString(36).substring(2, 10);
    const userAgent = this.getRandomUserAgent();
    
    // Generate browser fingerprint for this session
    const fingerprint = FingerprintingManager.generateFingerprint();
    
    const session = {
      id: `${timestamp}_${randomId}`,
      deviceId: deviceId,
      userAgent: userAgent,
      timestamp: timestamp,
      viewportWidth: this.getRandomViewport().width,
      viewportHeight: this.getRandomViewport().height,
      timezone: this.getRandomTimezone(),
      language: this.getRandomLanguage(),
      referrer: this.generateRandomReferrer(),
      screenResolution: this.getRandomScreenResolution(),
      colorDepth: this.getRandomColorDepth(),
      platform: this.extractPlatform(userAgent),
      fingerprint: fingerprint
    };

    this.currentSession = session;
    this.sessionHistory.push(session);
    
    // Apply the fingerprint to the browser environment
    FingerprintingManager.applyFingerprint(fingerprint);
    
    // Keep only last 100 sessions to prevent memory issues
    if (this.sessionHistory.length > 100) {
      this.sessionHistory = this.sessionHistory.slice(-100);
    }

    return session;
  }

  // Get random user agent
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  // Get random viewport size
  getRandomViewport() {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1536, height: 864 },
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 375, height: 667 },  // iPhone
      { width: 414, height: 896 },  // iPhone Pro
      { width: 768, height: 1024 }, // iPad
      { width: 360, height: 640 },  // Android
      { width: 412, height: 915 }   // Android Large
    ];
    return viewports[Math.floor(Math.random() * viewports.length)];
  }

  // Get random timezone
  getRandomTimezone() {
    const timezones = [
      'America/New_York', 'America/Los_Angeles', 'Europe/London', 
      'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
      'America/Chicago', 'Europe/Berlin', 'Asia/Mumbai'
    ];
    return timezones[Math.floor(Math.random() * timezones.length)];
  }

  // Get random language
  getRandomLanguage() {
    const languages = [
      'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 
      'ja-JP', 'zh-CN', 'pt-BR', 'ru-RU', 'it-IT'
    ];
    return languages[Math.floor(Math.random() * languages.length)];
  }

  // Generate random referrer
  generateRandomReferrer() {
    const referrers = [
      'https://www.google.com/',
      'https://www.youtube.com/',
      'https://www.facebook.com/',
      'https://www.twitter.com/',
      'https://www.reddit.com/',
      'https://www.instagram.com/',
      'https://www.tiktok.com/',
      'direct', // Direct access
      ''  // No referrer
    ];
    return referrers[Math.floor(Math.random() * referrers.length)];
  }

  // Get random screen resolution
  getRandomScreenResolution() {
    const resolutions = [
      '1920x1080', '1366x768', '1536x864', '1440x900', 
      '1280x720', '2560x1440', '3840x2160', '1024x768'
    ];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
  }

  // Get random color depth
  getRandomColorDepth() {
    const depths = [24, 32, 16];
    return depths[Math.floor(Math.random() * depths.length)];
  }

  // Extract platform from user agent
  extractPlatform(userAgent) {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Macintosh')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('iPhone')) return 'iOS';
    if (userAgent.includes('iPad')) return 'iPadOS';
    if (userAgent.includes('Android')) return 'Android';
    return 'Unknown';
  }

  // Generate YouTube player parameters optimized for view counting
  generatePlayerParams(videoId, session) {
    return {
      // Core playback settings
      autoplay: 1,
      enablejsapi: 1,
      
      // Randomize start position (0-3 seconds)
      start: Math.floor(Math.random() * 4),
      
      // Random quality preference
      quality: ['small', 'medium', 'large', 'hd720', 'hd1080'][Math.floor(Math.random() * 5)],
      
      // Randomize UI elements (but always keep controls enabled for user experience)
      controls: 1, // Always show controls for better user experience
      showinfo: Math.random() > 0.5 ? 1 : 0,
      modestbranding: Math.random() > 0.5 ? 1 : 0,
      
      // Disable related videos to keep focus
      rel: 0,
      
      // Session and tracking parameters
      origin: window.location.origin,
      widget_referrer: `${window.location.href}?session=${session.id}&device=${session.deviceId}`,
      
      // Random playback rate
      playsinline: 1,
      
      // Additional tracking parameters
      cc_load_policy: Math.random() > 0.7 ? 1 : 0,
      hl: session.language.split('-')[0],
      
      // Simulate different embedding contexts
      wmode: 'transparent',
      theme: Math.random() > 0.5 ? 'dark' : 'light',
      color: Math.random() > 0.5 ? 'red' : 'white'
    };
  }

  // Simulate realistic user behavior
  simulateUserBehavior(player, session) {
    // Add safety check for player object
    if (!player || typeof player !== 'object') {
      console.log('Invalid player object provided to simulateUserBehavior');
      return;
    }

    const behaviors = [
      // Random seek within first 10 seconds
      () => {
        setTimeout(() => {
          const seekTime = Math.random() * 10;
          try {
            if (player && typeof player.seekTo === 'function') {
              player.seekTo(seekTime, true);
            }
          } catch (e) {
            console.log('Seek failed:', e);
          }
        }, Math.random() * 3000 + 1000);
      },
      
      // Random quality change
      () => {
        setTimeout(() => {
          const qualities = ['small', 'medium', 'large', 'hd720', 'hd1080'];
          const quality = qualities[Math.floor(Math.random() * qualities.length)];
          try {
            if (player && typeof player.setPlaybackQuality === 'function') {
              player.setPlaybackQuality(quality);
            }
          } catch (e) {
            console.log('Quality change failed:', e);
          }
        }, Math.random() * 5000 + 2000);
      },
      
      // Random volume adjustment
      () => {
        setTimeout(() => {
          const volume = Math.floor(Math.random() * 30) + 70; // 70-100
          try {
            if (player && typeof player.setVolume === 'function') {
              player.setVolume(volume);
            }
          } catch (e) {
            console.log('Volume change failed:', e);
          }
        }, Math.random() * 4000 + 1500);
      }
    ];

    // Execute random behaviors with additional safety checks
    behaviors.forEach(behavior => {
      if (Math.random() > 0.5) {
        try {
          behavior();
        } catch (e) {
          console.log('Behavior execution failed:', e);
        }
      }
    });
  }

  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }

  // Clear session history
  clearHistory() {
    this.sessionHistory = [];
  }
}

// Export singleton instance
const sessionManager = new SessionManager();
export default sessionManager;