import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import Animation from "../classes/Animation";
import { expoOut } from "../utils/easing";

export default class Title extends Animation {
  constructor({ element }) {
    super({ element, elements: { span: null } });

    this.rotate = this.element.dataset.rotate;

    this.elements.span = SplitText.create(this.element, {
      type: "lines",
      autoSplit: true,
      onSplit: (self) => {
        if (!this.isAnimated) {
          gsap.set(self.lines, {
            yPercent: 125,
            rotate: this.rotate ? "5deg" : 0,
          });
        }
      },
    });
  }

  animateIn() {
    gsap.to(this.elements.span.lines, {
      yPercent: 0,
      rotate: 0,
      ease: expoOut,
      duration: 1.5,
      delay: this.delay,
    });

    super.animateIn();
  }

  animateOut() {
    gsap.set(this.elements.span.lines, {
      yPercent: 125,
      rotate: this.rotate ? "5deg" : 0,
    });

    super.animateOut();
  }
}
