import Page from '@classes/Page';

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
  async show(url) {
    this.element.classList.add(this.classes.active);

    return super.show(url);
  }

  async hide(url) {
    this.element.classList.remove(this.classes.active);

    return super.hide(url);
  }
}
