import Page from '../../classes/Page';

export default class About extends Page {
  constructor({ responsive }) {
    super({
      id: 'about',
      classes: { active: 'about--active' },
      element: '.about',
      elements: {},
      responsive,
    });
  }

  /**
   * Animations.
   */
  async show() {
    this.element.classList.add(this.classes.active);

    return super.show();
  }

  async hide() {
    this.element.classList.remove(this.classes.active);

    return super.hide();
  }
}
