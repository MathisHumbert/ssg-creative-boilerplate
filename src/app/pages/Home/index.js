import gsap from 'gsap';

import Page from '../../classes/Page';

export default class Home extends Page {
  constructor({ responsive }) {
    super({
      id: 'home',
      classes: { active: 'home--active' },
      element: '.home',
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
    //   tl = this.showHome();
    // } else if (prevTemplate === 'about') {
    //   tl = this.showHomeFromAbout();
    // }

    return super.show(tl);
  }

  showHome() {
    const tl = gsap.timeline();

    return tl;
  }

  showHomeFromAbout() {
    const tl = gsap.timeline();

    return tl;
  }

  hide(nextTemplate) {
    let tl = null;

    this.element.classList.remove(this.classes.active);

    // if (nextTemplate === null) {
    //   tl = this.hideHome();
    // } else if (nextTemplate === 'about') {
    //   tl = this.hideHomeToAbout();
    // }

    return super.hide(tl);
  }

  hideHome() {
    const tl = gsap.timeline({
      onComplete: () => this.element.classList.remove(this.classes.active),
    });

    return tl;
  }

  hideHomeToAbout() {
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
