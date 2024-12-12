import autoBind from 'auto-bind';
import EventEmitter from 'events';
import gsap from 'gsap';

import LazyLoad from './LazyLoad';
import PageLoad from './PageLoad';

import { map, each } from '../utils/dom';

import Appear from '../animations/Appear';
import Text from '../animations/Text';
import Title from '../animations/Title';

export default class Page extends EventEmitter {
  constructor({ classes, id, element, elements, responsive }) {
    super();

    autoBind(this);

    this.classes = { ...classes };
    this.id = id;
    this.selectors = {
      element,
      elements: {
        lazyLoaders: '[lazy-src]',
        pageLoaders: '[page-src]',

        animationsAppears: '[data-animation="appear"]',
        animationsTexts: '[data-animation="text"]',
        animationsTitles: '[data-animation="title"]',

        ...elements,
      },
    };

    this.fontSize = responsive.fontSize;
    this.size = responsive.size;
    this.scroll = 0;

    this.isVisible = false;

    this.create();
  }

  create() {
    this.animations = [];

    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors.elements, ([key, selector]) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements[key] = selector;
      } else if (Array.isArray(selector)) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });

    this.createAnimations();
    this.createLazyLoader();
    this.addEventListeners();
  }

  /**
   * Animations.
   */
  createAnimations() {
    /**
     * Appear.
     */
    this.animationsAppear = map(this.elements.animationsAppears, (element) => {
      return new Appear({ element });
    });

    this.animations.push(...this.animationsAppear);

    /**
     * Text.
     */
    this.animationsText = map(this.elements.animationsTexts, (element) => {
      return new Text({ element });
    });

    this.animations.push(...this.animationsText);

    /**
     * Title.
     */
    this.animationsTitle = map(this.elements.animationsTitles, (element) => {
      return new Title({ element });
    });

    this.animations.push(...this.animationsTitle);
  }

  /**
   * Loaders.
   */
  createLazyLoader() {
    this.preloaders = map(
      this.elements.preloaders,
      (element) =>
        new LazyLoad({
          element,
        })
    );
  }

  createPageLoader() {
    if (this.imagesLoaded) return;

    this.imagesLoaded = true;

    map(this.elements.pagePreloaders, (element) => new PageLoad({ element }));
  }

  /**
   * Animations.
   */

  show() {
    this.lenis.scrollTo(0, { immediate: true, force: true });
    this.scroll = 0;

    each(this.animations, (animation) => animation.createAnimation());

    return new Promise((res) => {
      const tl = gsap.timeline();

      tl.set(document.documentElement, {
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color'),
      })
        .set(this.element, { autoAlpha: 1 }, 0)
        .call(() => {
          this.lenis.start();
          this.isVisible = true;
          res();
        });
    });
  }

  hide() {
    this.isVisible = false;

    each(this.animations, (animation) => animation.destroyAnimation());

    return new Promise((res) => {
      const tl = gsap.timeline();

      tl.set(this.element, { autoAlpha: 0 }).call(() => res());
    });
  }

  /**
   * Events.
   */
  onResize(size, fontSize) {
    this.fontSize = fontSize;
    this.size = size;

    window.requestAnimationFrame(() => {
      each(this.animations, (animation) => {
        if (animation.onResize) {
          animation.onResize();
        }
      });
    });
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp() {}

  onWheel(event) {
    this.scroll = event.scroll;
  }

  /**
   * Listeners.
   */
  addEventListeners() {}

  /**
   * Loop.
   */
  update(time) {
    if (!this.isVisible) return;

    if (this.lenis) {
      this.lenis.raf(time);
    }

    each(this.animations, (animation) => {
      if (animation.update) {
        animation.update(this.lenis.scroll);
      }
    });
  }
}
