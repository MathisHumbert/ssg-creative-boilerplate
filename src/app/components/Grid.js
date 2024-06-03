import Component from '../classes/Component';
import { Detection } from '../classes/Detection';
import { each } from '../utils/dom';

export default class Grid extends Component {
  constructor({ desktop, mobile }) {
    super({ element: null, elements: {} });

    if (Detection.isMobile) {
      this.count = mobile.count;
      this.margin = mobile.margin;
      this.gutter = mobile.gutter;
    } else {
      this.count = desktop.count;
      this.margin = desktop.margin;
      this.gutter = desktop.gutter;
    }

    this.createGrid();
  }

  createGrid() {
    this.element = document.createElement('div');
    this.element.className = 'grid__wrapper';

    this.element.style.setProperty('--margin', `${this.margin / 10}rem`);
    this.element.style.setProperty('--gutter', `${this.gutter / 10}rem`);

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
    this.isVisible = false;

    document.body.removeChild(this.element);
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
