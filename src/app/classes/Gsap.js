import gsap from "gsap";
import { CustomEase, ScrollTrigger, SplitText } from "gsap/all";

import { lenis } from "./Lenis";

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

class GSAP {
  constructor() {
    gsap.defaults({ ease: "none" });

    ScrollTrigger.scrollerProxy("#scroll-wrapper", {
      scrollTop: (value) => {
        if (arguments.length) {
          lenis.scrollTo(value);
        }
        return lenis.scroll || 0;
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: "#scroll-wrapper" });
    ScrollTrigger.refresh();
  }
}

new GSAP();
