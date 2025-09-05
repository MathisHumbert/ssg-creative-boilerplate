import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { events } from "../utils/events";

class LenisScroll {
  constructor() {
    this.lenis = null;
    this.isActive = false;

    this.init();
  }

  init() {
    this.lenis = new Lenis({
      wrapper: document.getElementById("scroll-wrapper"),
      content: document.getElementById("scroll-content"),
      lerp: 0.125,
      wheelMultiplier: 0.75,
      touchMultiplier: 0.75,
      autoRaf: false,
      anchors: true,
    });

    this.lenis.on("scroll", ScrollTrigger.update);
    this.lenis.on("scroll", (e) => events.emit("lenis", e));

    events.on("start-update", this.update.bind(this));
  }

  update = ({ time }) => {
    if (this.lenis) {
      this.lenis.raf(time);
    }
  };

  start() {
    this.isActive = true;
    this.lenis.resize();
    this.lenis.start();
  }

  stop() {
    this.isActive = false;
    this.lenis.stop();
  }

  scrollTo(target, options) {
    this.lenis.scrollTo(target, options);
  }

  get scroll() {
    return this.lenis ? this.lenis.scroll : 0;
  }

  get velocity() {
    return this.lenis ? this.lenis.velocity : 0;
  }

  get direction() {
    return this.lenis ? this.lenis.direction : 0;
  }
}

export const lenis = new LenisScroll();
