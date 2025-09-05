import gsap from "gsap";

import Page from "../../classes/Page";

export default class About extends Page {
  constructor() {
    super({
      id: "about",
      classes: { active: "about--active" },
      element: ".about",
      elements: {},
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

    // if (nextTemplate === null) {
    //   tl = this.hideAbout();
    // } else if (nextTemplate === 'home') {
    //   tl = this.hideAboutToHome();
    // }

    return super.hide(tl);
  }

  hideAbout() {
    const tl = gsap.timeline();

    return tl;
  }

  hideAboutToHome() {
    const tl = gsap.timeline();

    return tl;
  }

  /**
   * Events
   */
  onResize(event) {
    super.onResize(event);
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    super.addEventListeners();
  }

  removeEventListeners() {
    super.removeEventListeners();
  }

  /**
   * Loop.
   */
  update(event) {
    super.update(event);
  }
}
