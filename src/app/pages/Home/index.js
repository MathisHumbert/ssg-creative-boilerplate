import Page from '../../classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      classes: { active: 'home--active' },
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
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
