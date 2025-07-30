import gsap from 'gsap';
import { CustomEase, ScrollTrigger, SplitText } from 'gsap/all';

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

class GSAP {
  constructor() {
    gsap.defaults({ ease: 'none' });
  }
}

new GSAP();
