import Component from './Component';

export default class LazyLoad extends Component {
  constructor({ element }) {
    super({ element });

    this.element = element;
    this.src = this.element.getAttribute('lazy-src');

    this.createObserver();
  }

  createObserver() {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.element.src && this.src) {
            this.element.src = this.src;

            this.element.onload = () => {
              this.observer.unobserve(this.element);
            };
          }
        }
      });
    });

    this.observer.observe(this.element);
  }
}
