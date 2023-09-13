import UAParser from 'ua-parser-js';

class DetectionManager {
  constructor() {
    this.parser = new UAParser();
    this.type = this.determineDeviceType(this.parser.getDevice().type);

    this.isMobile = this.type !== 'desktop';
    this.isPhone = this.type === 'phone';
    this.isTablet = this.type === 'tablet';
    this.isDesktop = this.type === 'desktop';

    this.isMixBlendModeUnsupported =
      typeof window.getComputedStyle(document.body).mixBlendMode ===
      'undefined';

    this.setHTMLClass();
  }

  determineDeviceType(deviceType) {
    if (deviceType === 'mobile') {
      return 'phone';
    } else if (['desktop', 'phone', 'tablet'].includes(deviceType)) {
      return deviceType;
    } else {
      return 'desktop';
    }
  }

  setHTMLClass() {
    const htmlElement = document.documentElement;
    htmlElement.classList.add(this.isMobile ? 'mobile' : 'desktop');
  }

  isWebGLAvailable() {
    if (!this.webGLAvailable) {
      const canvas = document.createElement('canvas');
      this.webGLAvailable =
        !!window.WebGLRenderingContext &&
        !!(
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        );
    }
    return this.webGLAvailable;
  }

  isWebPSupported() {
    if (this.webPSupported === false) {
      const element = document.createElement('canvas');
      if (element.getContext('2d')) {
        this.webPSupported = element
          .toDataURL('image/webp')
          .startsWith('data:image/webp');
      } else {
        this.webPSupported = false;
      }
    }
    return this.webPSupported;
  }

  isAppBrowser() {
    const ua = navigator.userAgent;
    return /FBAN|FBAV|Twitter/.test(ua);
  }

  check({ onErrorWebGL, onSuccess }) {
    if (!this.isWebGLAvailable()) {
      onErrorWebGL();
    } else {
      onSuccess();
    }
  }
}

export const Detection = new DetectionManager();
