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
   * Create.
   */
  create() {
    super.create();
  }

  /**
   * Animations.
   */
  show(prevTemplate) {
    let tl = null;

    this.element.classList.add(this.classes.active);

    // if (prevTemplate === null) {
    //   tl = this.showAbout();
    // } else if (prevTemplate === 'about') {
    //   tl = this.showAboutFromHome();
    // }

    return super.show(tl);
  }

  showAbout() {
    const tl = gsap.timeline();

    return tl;
  }

  showAboutFromHome() {
    const tl = gsap.timeline();

    return tl;
  }

  hide(nextTemplate) {
    let tl = null;

    this.element.classList.remove(this.classes.active);

    // if (nextTemplate === null) {
    //   tl = this.hideAbout();
    // } else if (nextTemplate === 'home') {
    //   tl = this.hideAboutToHome();
    // }

    return super.hide(tl);
  }

  hideAbout() {
    const tl = gsap.timeline({
      onComplete: () => this.element.classList.remove(this.classes.active),
    });

    return tl;
  }

  hideAboutToHome() {
    const tl = gsap.timeline({
      onComplete: () => this.element.classList.remove(this.classes.active),
    });

    return tl;
  }

  /**
   * Events
   */
  onResize(size, fontSize) {
    super.onResize(size, fontSize);

    this.fontSize = fontSize;
    this.size = size;
  }

  /**
   * Listeners.
   */
  addEventListeners() {}

  /**
   * Loop.
   */
  update(scroll, time) {
    super.update(scroll, time);
  }
}
