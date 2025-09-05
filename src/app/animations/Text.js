import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import Animation from "../classes/Animation";
import { expoOut } from "../utils/easing";

export default class Text extends Animation {
  constructor({ element }) {
    super({ element, elements: { spans: null } });

    this.elements.spans = SplitText.create(this.element, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        if (!this.isAnimated) {
          gsap.set(self.lines, {
            yPercent: 125,
          });
        }
      },
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
}
