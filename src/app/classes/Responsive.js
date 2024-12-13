export default class Responsive {
  constructor() {
    this.multiplier = 10;
    this.fontSize = 0;
    this.size = { width: 0, height: 0 };

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

  onResize() {
    let width = 0;

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (this.size.width > this.sizes.mobile) {
      width = this.sizes.desktop;
    } else {
      width = this.sizes.mobile;
    }

    this.fontSize = (this.size.width / width) * this.multiplier;
  }
}
