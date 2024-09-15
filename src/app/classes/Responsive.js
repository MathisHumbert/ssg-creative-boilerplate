export default class Responsive {
  constructor() {
    this.multiplier = 10;
    this.fontSize = 0;
    this.size = { width: 0, height: 0 };
    this.breakpoints = {
      phone: 768,
      desktop: 1920,
    };
    this.sizes = {
      phone: 375,
      desktop: 1600,
    };

    this.onResize();
  }

  onResize() {
    let width = 0;

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (this.size.width > this.sizes.phone) {
      width = this.sizes.desktop;
    } else {
      width = this.sizes.phone;
    }

    this.fontSize = (this.size.width / width) * this.multiplier;
  }
}
