import Page from '../../classes/Page';

export default class About extends Page {
  constructor() {
    super({
      id: 'about',
      classes: { active: 'about--active' },
      element: '.about',
      elements: {
        wrapper: '.about__wrapper',
      },
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
