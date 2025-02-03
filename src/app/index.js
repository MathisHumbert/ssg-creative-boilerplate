import '../styles/index.scss';
import './utils/scroll';

import AutoBind from 'auto-bind';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Stats from 'stats.js';
import Lenis from 'lenis';

import Canvas from './canvas';

import Preloader from './components/Preloader';
import Grid from './components/Grid';

import Clock from './classes/Clock';
import Responsive from './classes/Responsive';

import Home from './pages/Home';
import About from './pages/About';

import { each } from './utils/dom';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    AutoBind(this);

    this.clock = new Clock();
    this.url = window.location.pathname;
    this.lastUrl = window.location.pathname;
    this.isNavigating = true;
    this.odlElapsedTime = 0;
    this.lenis = null;

    if (import.meta.env.MODE === 'development') {
      this.createStats();
      this.createGrid();
    }

    this.init();
  }

  init() {
    this.createResponsive();

    this.createPages();
    this.createCanvas();

    this.createPreloader();
    this.createLenis();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  /**
   * Create.
   */
  createPages() {
    this.pages = {
      home: new Home({ responsive: this.responsive }),
      about: new About({ responsive: this.responsive }),
    };

    this.templates = {
      '/': 'home',
      '/about': 'about',
    };

    if (this.url !== '/' && this.url.endsWith('/')) {
      this.url = this.url.slice(0, -1);
    }

    this.template = this.templates[this.url];
    this.page = this.pages[this.template];
  }

  createCanvas() {
    this.canvas = new Canvas({
      size: this.responsive.size,
    });
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.preloadPage(this.page.element);

    this.preloader.once('loaded', this.onPreloaded);
  }

  createStats() {
    this.stats = new Stats();

    this.stats.showPanel(0);

    document.body.appendChild(this.stats.dom);
  }

  createGrid() {
    this.grid = new Grid();
  }

  createResponsive() {
    this.responsive = new Responsive();
  }

  createLenis() {
    this.lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.125,
    });
    this.lenis.stop();
    this.lenis.on('scroll', ScrollTrigger.update);
    this.lenis.on('scroll', this.onWheel);

    this.page.lenis = this.lenis;
  }

  /**
   * Events.
   */
  async onPreloaded() {
    this.onResize();

    this.canvas.onPreloaded();
    this.page.createPageLoader();

    await Promise.all([this.page.show(null), this.canvas.show(this.template)]);

    this.lenis.start();

    this.isNavigating = false;
  }

  onPopState(e) {
    if (this.isNavigating) {
      e.preventDefault();
      window.history.pushState({}, '', this.lastUrl);
      return;
    }

    this.lastUrl = window.location.pathname;

    this.onChange({
      url: window.location.href,
      push: false,
    });
  }

  async onChange({ url, push = true }) {
    url = url.replace(window.location.origin, '');

    if (url === this.url || this.isNavigating) return;

    this.url = url;
    this.isNavigating = true;

    this.lenis.stop();
    this.page.lenis = null;

    const nextTemplate = this.templates[url];
    const page = this.pages[nextTemplate];

    await Promise.all([
      this.page.hide(nextTemplate),
      this.canvas.hide(nextTemplate),
    ]);

    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (push) {
      window.history.pushState({}, '', url);
    }

    const prevTemplate = this.template;

    this.template = nextTemplate;
    this.page = page;

    this.lenis.scrollTo(0, { immediate: true, force: true });
    this.page.lenis = this.lenis;

    await this.preloader.loadPage(this.page.element);

    this.page.createPageLoader();

    this.onResize();

    await Promise.all([
      this.page.show(prevTemplate),
      this.canvas.show(this.template),
    ]);

    this.lenis.start();

    this.isNavigating = false;
  }

  onResize() {
    if (this.responsive && this.responsive.onResize) {
      this.responsive.onResize();
    }

    if (this.page && this.page.onResize) {
      this.page.onResize(this.responsive.size, this.responsive.fontSize);
    }

    if (this.grid && this.grid.onResize) {
      this.grid.onResize();
    }

    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize(this.responsive.size);
      }
    });
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }
  }

  onWheel(event) {
    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(event);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(event);
    }
  }

  /**
   * Loop.
   */
  update(time) {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.odlElapsedTime;
    this.odlElapsedTime = elapsedTime;

    if (this.stats) {
      this.stats.begin();
    }

    if (!this.isNavigating) {
      this.lenis.raf(time);
    }

    if (this.page) {
      this.page.update(this.lenis.scroll, deltaTime);
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.lenis.scroll, deltaTime);
    }

    if (this.stats) {
      this.stats.end();
    }

    ScrollTrigger.update();

    window.requestAnimationFrame(this.update.bind(this));
  }

  /***
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('popstate', this.onPopState, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    window.addEventListener('mousedown', this.onTouchDown, {
      passive: true,
    });
    window.addEventListener('mousemove', this.onTouchMove, {
      passive: true,
    });
    window.addEventListener('mouseup', this.onTouchUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchDown, {
      passive: true,
    });
    window.addEventListener('touchmove', this.onTouchMove, {
      passive: true,
    });
    window.addEventListener('touchend', this.onTouchUp, { passive: true });
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;
      const isAnchor = link.href.indexOf('#') > -1;

      const isNotEmail = link.href.indexOf('mailto') === -1;
      const isNotPhone = link.href.indexOf('tel') === -1;

      if (isLocal) {
        link.onclick = (event) => {
          event.preventDefault();

          if (!isAnchor) {
            this.onChange({
              url: link.href,
            });
          }
        };
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }
}

new App();
