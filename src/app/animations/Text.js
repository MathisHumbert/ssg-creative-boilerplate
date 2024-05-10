import gsap from 'gsap';
import SplitType from 'split-type';

import Animation from '../classes/Animation';
import { expoOut } from '../utils/easing';
import { wrapLines } from '../utils/text';

export default class Text extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });

    this.elements.spans = new SplitType(this.element, {
      types: 'lines',
      tagName: 'span',
      lineClass: '',
    });
    wrapLines(this.elements.spans.lines, 'span');

    gsap.set(this.elements.spans.lines, {
      yPercent: 125,
    });
  }

  animateIn() {
    gsap.to(this.elements.spans.lines, {
      yPercent: 0,
      ease: expoOut,
      duration: 1.5,
      stagger: 0.1,
      delay: this.delay,
    });

    super.animateIn();
  }

  animateOut() {
    gsap.set(this.elements.spans.lines, {
      yPercent: 125,
    });

    super.animateOut();
  }

  onResize() {
    this.elements.spans.split();

    wrapLines(this.elements.spans.lines, 'span');

    if (!this.isAnimated) {
      gsap.set(this.elements.spans.lines, {
        yPercent: 125,
      });
    }
  }
}
