// Browser fingerprinting simulation to make each session appear unique
class FingerprintingManager {
  
  // Generate a unique browser fingerprint for each session
  static generateFingerprint() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    
    return {
      // Canvas fingerprinting simulation
      canvas: this.generateCanvasFingerprint(),
      
      // WebGL fingerprinting simulation
      webgl: this.generateWebGLFingerprint(),
      
      // Audio context fingerprinting simulation
      audio: this.generateAudioFingerprint(),
      
      // Screen and hardware simulation
      screen: this.generateScreenFingerprint(),
      
      // Browser features simulation
      features: this.generateBrowserFeatures(),
      
      // Timezone and locale simulation
      locale: this.generateLocaleFingerprint(),
      
      // Plugin simulation
      plugins: this.generatePluginFingerprint(),
      
      // Font detection simulation
      fonts: this.generateFontFingerprint(),
      
      // Session identifier
      sessionId: `fp_${timestamp}_${random}`,
      
      // Timestamp for tracking
      created: timestamp
    };
  }
  
  // Simulate canvas fingerprinting
  static generateCanvasFingerprint() {
    const variations = [
      'canvas_fp_1a2b3c4d5e6f',
      'canvas_fp_7g8h9i0j1k2l',
      'canvas_fp_3m4n5o6p7q8r',
      'canvas_fp_9s0t1u2v3w4x',
      'canvas_fp_5y6z7a8b9c0d'
    ];
    
    return variations[Math.floor(Math.random() * variations.length)] + 
           '_' + Math.random().toString(36).substring(2, 8);
  }
  
  // Simulate WebGL fingerprinting
  static generateWebGLFingerprint() {
    const renderers = [
      'ANGLE (Intel(R) HD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
      'ANGLE (NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0)',
      'ANGLE (AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0)',
      'ANGLE (Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)',
      'ANGLE (NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0)'
    ];
    
    const vendors = [
      'Google Inc. (Intel)',
      'Google Inc. (NVIDIA)',
      'Google Inc. (AMD)',
      'Google Inc. (Intel)',
      'Google Inc. (NVIDIA)'
    ];
    
    const index = Math.floor(Math.random() * renderers.length);
    
    return {
      renderer: renderers[index],
      vendor: vendors[index],
      version: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
      extensions: this.generateWebGLExtensions()
    };
  }
  
  // Generate WebGL extensions
  static generateWebGLExtensions() {
    const allExtensions = [
      'ANGLE_instanced_arrays',
      'EXT_blend_minmax',
      'EXT_color_buffer_half_float',
      'EXT_disjoint_timer_query',
      'EXT_float_blend',
      'EXT_frag_depth',
      'EXT_shader_texture_lod',
      'EXT_texture_compression_rgtc',
      'EXT_texture_filter_anisotropic',
      'WEBKIT_EXT_texture_filter_anisotropic',
      'EXT_sRGB',
      'OES_element_index_uint',
      'OES_fbo_render_mipmap',
      'OES_standard_derivatives',
      'OES_texture_float',
      'OES_texture_float_linear',
      'OES_texture_half_float',
      'OES_texture_half_float_linear',
      'OES_vertex_array_object',
      'WEBGL_color_buffer_float',
      'WEBGL_compressed_texture_s3tc',
      'WEBKIT_WEBGL_compressed_texture_s3tc',
      'WEBGL_compressed_texture_s3tc_srgb',
      'WEBGL_debug_renderer_info',
      'WEBGL_debug_shaders',
      'WEBGL_depth_texture',
      'WEBKIT_WEBGL_depth_texture',
      'WEBGL_draw_buffers',
      'WEBGL_lose_context',
      'WEBKIT_WEBGL_lose_context'
    ];
    
    // Return random subset of extensions
    const numExtensions = Math.floor(Math.random() * 10) + 15; // 15-25 extensions
    const shuffled = allExtensions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numExtensions);
  }
  
  // Simulate audio context fingerprinting
  static generateAudioFingerprint() {
    const sampleRates = [44100, 48000, 96000];
    const channelCounts = [2, 6, 8];
    
    return {
      sampleRate: sampleRates[Math.floor(Math.random() * sampleRates.length)],
      maxChannelCount: channelCounts[Math.floor(Math.random() * channelCounts.length)],
      numberOfInputs: Math.floor(Math.random() * 4) + 1,
      numberOfOutputs: Math.floor(Math.random() * 4) + 1,
      channelCount: 2,
      channelCountMode: 'max',
      channelInterpretation: 'speakers',
      hash: 'audio_' + Math.random().toString(36).substring(2, 12)
    };
  }
  
  // Simulate screen fingerprinting
  static generateScreenFingerprint() {
    const resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 },
      { width: 1600, height: 900 },
      { width: 2560, height: 1440 },
      { width: 3840, height: 2160 }
    ];
    
    const colorDepths = [24, 32];
    const pixelDepths = [24, 32];
    
    const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
    
    return {
      width: resolution.width,
      height: resolution.height,
      availWidth: resolution.width,
      availHeight: resolution.height - Math.floor(Math.random() * 100) - 30, // Account for taskbar
      colorDepth: colorDepths[Math.floor(Math.random() * colorDepths.length)],
      pixelDepth: pixelDepths[Math.floor(Math.random() * pixelDepths.length)],
      devicePixelRatio: [1, 1.25, 1.5, 2][Math.floor(Math.random() * 4)]
    };
  }
  
  // Simulate browser features
  static generateBrowserFeatures() {
    return {
      cookieEnabled: true,
      doNotTrack: Math.random() > 0.5 ? '1' : null,
      language: this.generateLanguage(),
      languages: this.generateLanguages(),
      onLine: true,
      platform: this.generatePlatform(),
      userAgent: this.generateUserAgent(),
      javaEnabled: Math.random() > 0.8, // Most browsers disable Java
      pdfViewerEnabled: Math.random() > 0.2,
      hardwareConcurrency: [2, 4, 6, 8, 12, 16][Math.floor(Math.random() * 6)]
    };
  }
  
  // Generate locale fingerprint
  static generateLocaleFingerprint() {
    const timezones = [
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'Europe/London',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
      'America/Toronto',
      'Europe/Paris'
    ];
    
    const locales = [
      'en-US',
      'en-GB',
      'de-DE',
      'fr-FR',
      'es-ES',
      'ja-JP',
      'zh-CN',
      'pt-BR',
      'ru-RU',
      'it-IT'
    ];
    
    return {
      timezone: timezones[Math.floor(Math.random() * timezones.length)],
      timezoneOffset: Math.floor(Math.random() * 24) - 12, // -12 to +12 hours
      locale: locales[Math.floor(Math.random() * locales.length)],
      dateFormat: this.generateDateFormat(),
      numberFormat: this.generateNumberFormat()
    };
  }
  
  // Generate plugin fingerprint
  static generatePluginFingerprint() {
    const commonPlugins = [
      'Chrome PDF Plugin',
      'Chrome PDF Viewer',
      'Native Client',
      'Widevine Content Decryption Module',
      'Microsoft Edge PDF Plugin',
      'WebKit built-in PDF'
    ];
    
    // Return random subset of plugins
    const numPlugins = Math.floor(Math.random() * 4) + 2; // 2-6 plugins
    const shuffled = commonPlugins.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numPlugins);
  }
  
  // Generate font fingerprint
  static generateFontFingerprint() {
    const commonFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Sans Unicode',
      'Tahoma', 'Lucida Console', 'Monaco', 'Courier', 'Bradley Hand',
      'Brush Script MT', 'Luminari', 'Chalkduster'
    ];
    
    // Return random subset of fonts
    const numFonts = Math.floor(Math.random() * 10) + 10; // 10-20 fonts
    const shuffled = commonFonts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFonts);
  }
  
  // Helper methods
  static generateLanguage() {
    const languages = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'zh-CN'];
    return languages[Math.floor(Math.random() * languages.length)];
  }
  
  static generateLanguages() {
    const primary = this.generateLanguage();
    const secondary = ['en', 'en-US', 'de', 'fr', 'es'];
    return [primary, ...secondary.filter(lang => lang !== primary).slice(0, 2)];
  }
  
  static generatePlatform() {
    const platforms = ['Win32', 'MacIntel', 'Linux x86_64', 'Linux armv7l'];
    return platforms[Math.floor(Math.random() * platforms.length)];
  }
  
  static generateUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
  
  static generateDateFormat() {
    const formats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'];
    return formats[Math.floor(Math.random() * formats.length)];
  }
  
  static generateNumberFormat() {
    const formats = ['1,234.56', '1.234,56', '1 234,56', '1234.56'];
    return formats[Math.floor(Math.random() * formats.length)];
  }
  
  // Apply fingerprint to current session
  static applyFingerprint(fingerprint) {
    try {
      // Store fingerprint data in session storage for consistency
      sessionStorage.setItem('browserFingerprint', JSON.stringify(fingerprint));
      
      // Apply some fingerprint data to DOM for tracking
      document.documentElement.setAttribute('data-fp-canvas', fingerprint.canvas);
      document.documentElement.setAttribute('data-fp-webgl', fingerprint.webgl.renderer.substring(0, 50));
      document.documentElement.setAttribute('data-fp-audio', fingerprint.audio.hash);
      document.documentElement.setAttribute('data-fp-screen', `${fingerprint.screen.width}x${fingerprint.screen.height}`);
      document.documentElement.setAttribute('data-fp-session', fingerprint.sessionId);
      
      console.log('Browser fingerprint applied:', {
        sessionId: fingerprint.sessionId,
        canvas: fingerprint.canvas,
        webgl: fingerprint.webgl.renderer.substring(0, 50) + '...',
        screen: `${fingerprint.screen.width}x${fingerprint.screen.height}`,
        platform: fingerprint.features.platform
      });
      
      return true;
    } catch (error) {
      console.error('Failed to apply fingerprint:', error);
      return false;
    }
  }
  
  // Get current session fingerprint
  static getCurrentFingerprint() {
    try {
      const stored = sessionStorage.getItem('browserFingerprint');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to retrieve fingerprint:', error);
      return null;
    }
  }
  
  // Generate and apply new fingerprint
  static initializeFingerprint() {
    const fingerprint = this.generateFingerprint();
    this.applyFingerprint(fingerprint);
    return fingerprint;
  }
}

export default FingerprintingManager;