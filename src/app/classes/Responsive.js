export default class Responsive {
  constructor() {
    this.multiplier = 10;
    this.fontSize = 0;
    this.size = { width: 0, height: 0 };
    this.breakpoints = {
      phone: 768,
      tablet: 1024,
      desktop: 1920,
    };

    this.onResize();
  }

  onResize() {
    let width = 0;

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (this.size.width > this.breakpoints.desktop) {
      width = this.breakpoints.desktop;
    } else if (this.size.width >= this.breakpoints.tablet) {
      width = this.breakpoints.tablet;
    } else {
      width = this.breakpoints.phone;
    }

    this.fontSize = (this.size.width / width) * this.multiplier;
  }
}
