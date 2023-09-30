import Component from './Component';

export default class AsyncLoad extends Component {
  constructor({ element }) {
    super({ element });

    this.element = element;
    this.createObserver();
  }

  createObserver() {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const dataSrc = this.element.getAttribute('data-src');
          if (!this.element.src && dataSrc) {
            this.element.src = dataSrc;
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
