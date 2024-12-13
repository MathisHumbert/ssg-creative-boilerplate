import Component from '../classes/Component';
import { each } from '../utils/dom';

export default class Grid extends Component {
  constructor() {
    super({ element: null, elements: {} });

    this.count = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--grid-count'
      )
    );

    this.breakpointsMobile = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--breakpoints-mobile'
      )
    );

    this.createGrid();
  }

  createGrid() {
    this.element = document.createElement('div');
    this.element.className = 'grid__wrapper';

    each(Array.from(Array(this.count).keys()), (_) => {
      const element = document.createElement('div');
      element.className = 'grid';

      this.element.appendChild(element);
    });
  }

  showGrid() {
    this.isVisible = true;

    document.body.appendChild(this.element);
  }

  hideGrid() {
    u;
    this.isVisible = false;

    document.body.removeChild(this.element);
  }

  onResize() {
    const count = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--grid-count'
      )
    );

    if (this.count !== count) {
      this.count = count;

      this.element.textContent = '';

      each(Array.from(Array(this.count).keys()), (_) => {
        const element = document.createElement('div');
        element.className = 'grid';

        this.element.appendChild(element);
      });
    }
  }

  addEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'g') {
        if (this.isVisible) {
          this.hideGrid();
        } else {
          this.showGrid();
        }
      }
    });
  }
}
