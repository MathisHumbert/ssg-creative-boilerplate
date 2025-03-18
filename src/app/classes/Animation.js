import AutoBind from 'auto-bind';
import Prefix from 'prefix';

export default class Animation {
  constructor({ element, elements }) {
    AutoBind(this);

    const { delay, target, threshold } = element.dataset;

    this.element = element;
    this.elements = elements;

    this.delay = isNaN(Number(delay)) ? 0 : Number(delay);
    this.threshold = isNaN(Number(threshold)) ? 0 : Number(threshold);

    this.target = target ? element.closest(target) : element;
    this.transformPrefix = Prefix('transform');

    this.isVisible = false;
    this.isAnimated = false;
  }

  createAnimation() {
    if ('IntersectionObserver' in window) {
      this.animateOut();

      this.createObserver();
    } else {
      this.animateIn();
    }
  }

  destroyAnimation() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  hideAnimation() {
    this.animateOut();
  }

  createObserver() {
    this.observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!this.isVisible && entry.isIntersecting) {
            this.animateIn();

            // comment to repeat animation
            this.observer.unobserve(this.target);
          } else if (!entry.isIntersecting && this.isVisible) {
            this.animateOut();
          }
        });
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.target);
  }

  animateIn() {
    this.isVisible = true;
    this.isAnimated = true;
  }

  animateOut() {
    this.isVisible = false;
    this.isAnimated = false;
  }
}
