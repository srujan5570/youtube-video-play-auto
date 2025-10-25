class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.userAgents = [
      // Desktop browsers
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      
      // Mobile browsers
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      
      // Smart TV and other devices
      'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/6.0 TV Safari/537.36',
      'Mozilla/5.0 (PlayStation 5 6.00) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
    ];
    
    this.referrers = [
      'https://www.google.com/',
      'https://www.youtube.com/',
      'https://www.facebook.com/',
      'https://www.twitter.com/',
      'https://www.reddit.com/',
      'https://www.instagram.com/',
      'https://www.tiktok.com/',
      'https://www.linkedin.com/',
      'https://www.pinterest.com/',
      'https://www.discord.com/',
      'https://www.twitch.tv/',
      'https://duckduckgo.com/',
      'https://www.bing.com/',
      'https://search.yahoo.com/',
      '',  // Direct access
    ];

    this.qualities = ['small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'hd2160'];
    this.languages = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN'];
    this.timezones = [
      'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver',
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
      'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Mumbai',
      'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
    ];
  }

  // Generate unique device fingerprint
  generateDeviceFingerprint() {
    const screens = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 },
      { width: 1280, height: 720 },
      { width: 375, height: 667 },   // iPhone
      { width: 414, height: 896 },   // iPhone Pro
      { width: 390, height: 844 },   // iPhone 12/13
      { width: 360, height: 640 },   // Android
      { width: 412, height: 915 },   // Android large
    ];

    const screen = screens[Math.floor(Math.random() * screens.length)];
    
    return {
      screenWidth: screen.width,
      screenHeight: screen.height,
      colorDepth: Math.random() > 0.8 ? 32 : 24,
      pixelRatio: Math.random() > 0.5 ? 2 : 1,
      language: this.languages[Math.floor(Math.random() * this.languages.length)],
      timezone: this.timezones[Math.floor(Math.random() * this.timezones.length)],
      platform: Math.random() > 0.7 ? 'MacIntel' : Math.random() > 0.5 ? 'Win32' : 'Linux x86_64',
      cookieEnabled: Math.random() > 0.05, // 95% have cookies enabled
      doNotTrack: Math.random() > 0.7 ? '1' : '0',
      hardwareConcurrency: Math.floor(Math.random() * 8) + 2, // 2-10 cores
      deviceMemory: [2, 4, 8, 16, 32][Math.floor(Math.random() * 5)],
      connection: ['4g', 'wifi', '3g', 'ethernet'][Math.floor(Math.random() * 4)],
    };
  }

  // Create a new video session with unique characteristics
  createVideoSession(videoId) {
    const sessionId = this.generateUniqueSessionId();
    const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    const referrer = this.referrers[Math.floor(Math.random() * this.referrers.length)];
    const quality = this.qualities[Math.floor(Math.random() * this.qualities.length)];
    const fingerprint = this.generateDeviceFingerprint();

    // Simulate network conditions and viewing patterns
    const networkDelay = Math.floor(Math.random() * 200) + 50; // 50-250ms
    const bandwidthKbps = Math.floor(Math.random() * 50000) + 5000; // 5-55 Mbps
    
    const sessionData = {
      sessionId,
      videoId,
      userAgent,
      referrer,
      quality,
      fingerprint,
      networkDelay,
      bandwidthKbps,
      startTime: Date.now(),
      viewDuration: 0,
      interactions: 0,
      seekEvents: [],
      volumeChanges: [],
      qualityChanges: [],
      pauseEvents: [],
      bufferEvents: [],
      // Simulate viewing behavior patterns
      viewingPattern: {
        attentionSpan: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
        seekProbability: Math.random() * 0.3, // 0-30% chance to seek
        pauseProbability: Math.random() * 0.2, // 0-20% chance to pause
        volumeAdjustProbability: Math.random() * 0.4, // 0-40% chance to adjust volume
        qualityChangeProbability: Math.random() * 0.15, // 0-15% chance to change quality
      }
    };

    this.sessions.set(sessionId, sessionData);
    
    // Set unique browser characteristics for this session
    this.setBrowserCharacteristics(sessionData);
    
    return sessionData;
  }

  // Set browser characteristics to simulate different devices
  setBrowserCharacteristics(sessionData) {
    try {
      // Temporarily override navigator properties (if possible)
      if (typeof window !== 'undefined' && window.navigator) {
        // Set screen properties
        if (window.screen) {
          Object.defineProperty(window.screen, 'width', {
            value: sessionData.fingerprint.screenWidth,
            configurable: true
          });
          Object.defineProperty(window.screen, 'height', {
            value: sessionData.fingerprint.screenHeight,
            configurable: true
          });
          Object.defineProperty(window.screen, 'colorDepth', {
            value: sessionData.fingerprint.colorDepth,
            configurable: true
          });
        }

        // Set timezone
        if (Intl && Intl.DateTimeFormat) {
          const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
          Intl.DateTimeFormat.prototype.resolvedOptions = function() {
            const options = originalResolvedOptions.call(this);
            options.timeZone = sessionData.fingerprint.timezone;
            return options;
          };
        }
      }
    } catch (error) {
      console.log('Could not override browser characteristics:', error);
    }
  }

  // Generate unique session ID
  generateUniqueSessionId() {
    const timestamp = Date.now();
    const random1 = Math.random().toString(36).substring(2, 15);
    const random2 = Math.random().toString(36).substring(2, 15);
    const deviceId = Math.random().toString(36).substring(2, 10);
    return `yt_${timestamp}_${random1}_${random2}_${deviceId}`;
  }

  // Simulate realistic viewing behavior
  simulateViewingBehavior(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.interactions++;
    
    const pattern = session.viewingPattern;
    const currentTime = Date.now();
    const sessionDuration = (currentTime - session.startTime) / 1000;

    // Simulate various user behaviors based on patterns
    if (Math.random() < pattern.seekProbability / 100) {
      session.seekEvents.push({
        time: currentTime,
        duration: sessionDuration,
        type: 'user_seek'
      });
    }

    if (Math.random() < pattern.pauseProbability / 100) {
      session.pauseEvents.push({
        time: currentTime,
        duration: sessionDuration,
        reason: 'user_pause'
      });
    }

    if (Math.random() < pattern.volumeAdjustProbability / 100) {
      const newVolume = Math.floor(Math.random() * 100);
      session.volumeChanges.push({
        time: currentTime,
        volume: newVolume,
        duration: sessionDuration
      });
    }

    if (Math.random() < pattern.qualityChangeProbability / 100) {
      const newQuality = this.qualities[Math.floor(Math.random() * this.qualities.length)];
      session.qualityChanges.push({
        time: currentTime,
        quality: newQuality,
        duration: sessionDuration
      });
    }

    // Simulate network buffering events
    if (Math.random() < 0.05) { // 5% chance of buffering
      session.bufferEvents.push({
        time: currentTime,
        duration: sessionDuration,
        bufferHealth: Math.random() * 10 + 2 // 2-12 seconds of buffer
      });
    }

    // Update session data
    this.sessions.set(sessionId, session);
  }

  // Update view duration for analytics
  updateViewDuration(sessionId, duration) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.viewDuration = Math.max(session.viewDuration, duration);
      this.sessions.set(sessionId, session);
    }
  }

  // Get session analytics
  getSessionAnalytics(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    return {
      sessionId: session.sessionId,
      videoId: session.videoId,
      totalDuration: session.viewDuration,
      interactions: session.interactions,
      userAgent: session.userAgent,
      referrer: session.referrer,
      quality: session.quality,
      fingerprint: session.fingerprint,
      engagementScore: this.calculateEngagementScore(session),
      viewingQuality: this.calculateViewingQuality(session),
    };
  }

  // Calculate engagement score based on user interactions
  calculateEngagementScore(session) {
    let score = 0;
    
    // Base score for view duration
    score += Math.min(session.viewDuration / 30, 10); // Max 10 points for 30+ seconds
    
    // Points for interactions
    score += Math.min(session.interactions * 0.5, 5); // Max 5 points for interactions
    
    // Points for seeking (shows engagement)
    score += Math.min(session.seekEvents.length * 2, 8); // Max 8 points for seeking
    
    // Deduct points for excessive pausing
    score -= Math.max(session.pauseEvents.length - 2, 0) * 1; // Penalty after 2 pauses
    
    return Math.max(0, Math.min(score, 20)); // Score between 0-20
  }

  // Calculate viewing quality score
  calculateViewingQuality(session) {
    let quality = 100; // Start with perfect score
    
    // Deduct for short view duration
    if (session.viewDuration < 10) quality -= 30;
    else if (session.viewDuration < 30) quality -= 15;
    
    // Deduct for excessive buffering
    quality -= session.bufferEvents.length * 5;
    
    // Deduct for too many quality changes (network issues)
    quality -= Math.max(session.qualityChanges.length - 1, 0) * 10;
    
    // Deduct for excessive pausing
    quality -= Math.max(session.pauseEvents.length - 2, 0) * 8;
    
    return Math.max(0, Math.min(quality, 100)); // Score between 0-100
  }

  // Clean up old sessions (call periodically)
  cleanupOldSessions(maxAge = 3600000) { // 1 hour default
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.startTime > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Get all active sessions
  getActiveSessions() {
    return Array.from(this.sessions.values());
  }

  // Export session data for analytics
  exportSessionData() {
    return {
      totalSessions: this.sessions.size,
      sessions: Array.from(this.sessions.values()),
      timestamp: Date.now(),
    };
  }
}

// Create and export singleton instance
const sessionManager = new SessionManager();

// Clean up old sessions every 30 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    sessionManager.cleanupOldSessions();
  }, 1800000); // 30 minutes
}

export default sessionManager;