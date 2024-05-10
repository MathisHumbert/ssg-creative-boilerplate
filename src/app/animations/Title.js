import gsap from 'gsap';

import Animation from '../classes/Animation';
import { expoOut } from '../utils/easing';
import { wrapLine } from '../utils/text';

export default class Title extends Animation {
  constructor({ element }) {
    super({ element, elements: { span: null } });

    wrapLine(this.element, 'span');

    this.elements.span = element.querySelector('span');

    this.rotate = element.dataset.rotate;
  }

  animateIn() {
    gsap.to(this.elements.span, {
      yPercent: 0,
      rotate: 0,
      ease: expoOut,
      duration: 1.5,
      delay: this.delay,
    });

    super.animateIn();
  }

  animateOut() {
    gsap.set(this.elements.span, {
      yPercent: 125,
      rotate: this.rotate ? '5deg' : 0,
    });

    super.animateOut();
  }
}
