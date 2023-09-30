import gsap from 'gsap';

import Animation from '../classes/Animation';
import { smooth } from '../utils/easing';

export default class Highlight extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });
  }

  animateIn() {
    gsap.to(this.element, {
      opacity: 1,
      delay: this.delay,
      duration: 1,
      ease: smooth,
    });

    super.animateIn();
  }

  animateOut() {
    gsap.set(this.element, { opacity: 0 });

    super.animateOut();
  }
}
