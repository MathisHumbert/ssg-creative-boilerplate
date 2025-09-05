import Component from "../classes/Component";

export default class PageLoad extends Component {
  constructor({ element }) {
    super({ element });

    this.createLoader();
  }

  createLoader() {
    const src = this.element.getAttribute("page-src");

    if (src) {
      this.element.src = src;
    }
  }
}
