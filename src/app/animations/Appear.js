import gsap from "gsap";

import Animation from "../classes/Animation";
import { easeInOut } from "../utils/easing";

export default class Appear extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });
  }

  animateIn() {
    gsap.to(this.element, {
      opacity: 1,
      delay: this.delay,
      duration: 1,
      ease: easeInOut,
    });

    super.animateIn();
  }

  animateOut() {
    gsap.set(this.element, { opacity: 0 });

    super.animateOut();
  }
}
