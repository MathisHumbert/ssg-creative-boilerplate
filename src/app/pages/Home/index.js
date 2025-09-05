import gsap from "gsap";

import Page from "../../classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      classes: { active: "home--active" },
      element: ".home",
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

    // if (nextTemplate === null) {
    //   tl = this.hideHome();
    // } else if (nextTemplate === 'about') {
    //   tl = this.hideHomeToAbout();
    // }

    return super.hide(tl);
  }

  hideHome() {
    const tl = gsap.timeline();

    return tl;
  }

  hideHomeToAbout() {
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
