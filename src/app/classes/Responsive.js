class Responsive {
  constructor() {
    this.multiplier = 10;
    this.fontSize = 0;
    this.screen = { width: 0, height: 0 };
    this.viewport = { width: 0, height: 0 };
    this.camera = null;

    const breakpointsDesktop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--breakpoints-desktop'
      )
    );
    const breakpointsMobile = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--breakpoints-mobile'
      )
    );

    const sizesDesktop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--sizes-desktop'
      )
    );
    const sizesMobile = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--sizes-mobile'
      )
    );

    this.breakpoints = {
      desktop: breakpointsDesktop,
      mobile: breakpointsMobile,
    };
    this.sizes = {
      desktop: sizesDesktop,
      mobile: sizesMobile,
    };

    this.onResize();
  }

  setCamera(camera) {
    this.camera = camera;
    this.calculateViewport();
  }

  onResize() {
    let width = 0;

    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (this.screen.width > this.sizes.mobile) {
      width = this.sizes.desktop;
    } else {
      width = this.sizes.mobile;
    }

    this.fontSize = (this.screen.width / width) * this.multiplier;

    if (this.camera) {
      this.calculateViewport();
    }
  }

  calculateViewport() {
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };
  }
}

export const responsive = new Responsive();
