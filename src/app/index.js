import '../styles/index.scss';
import './utils/scroll';

import FontFaceObserver from 'fontfaceobserver';
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
    this.template = window.location.pathname;
    this.isLoading = false;
    this.odlElapsedTime = 0;

    if (import.meta.env.VITE_DEV_MODE === 'true') {
      this.createStats();
      this.createGrid();
    }

    this.init();
  }

  init() {
    this.createResponsive();
    this.createCanvas();
    this.createPreloader();

    this.createPages();
    this.createLenis();

    this.addEventListeners();
    this.addLinkListeners();
  }

  createCanvas() {
    this.canvas = null;

    this.canvas = new Canvas({
      template: this.template,
      size: this.responsive.size,
    });
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.once('loaded', this.onPreloaded);
  }

  createPages() {
    this.home = new Home({ responsive: this.responsive });
    this.about = new About({ responsive: this.responsive });

    this.pages = {
      '/': this.home,
      '/about': this.about,
    };

    if (this.template !== '/' && this.template.endsWith('/')) {
      this.template = this.template.slice(0, -1);
    }

    this.page = this.pages[this.template];

    this.page.createPageLoader();
  }

  createStats() {
    this.stats = new Stats();

    this.stats.showPanel(0);

    document.body.appendChild(this.stats.dom);
  }

  createGrid() {
    new Grid({
      desktop: { count: 12, margin: 32, gutter: 20 },
      mobile: { count: 4, margin: 24, gutter: 20 },
    });
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
  onPreloaded() {
    this.onResize();

    this.update();

    this.canvas.onPreloaded();

    this.page.createPageLoader();
    this.page.show();
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push = true }) {
    url = url.replace(window.location.origin, '');

    if (this.template === url || this.isLoading) return;

    this.isLoading = true;

    this.lenis.stop();
    this.page.lenis = null;

    const page = this.pages[url];

    page.createPageLoader();

    await Promise.all([this.page.hide(), this.canvas.hide()]);

    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (push) {
      window.history.pushState({}, '', url);
    }

    this.template = window.location.pathname;
    this.page = page;

    this.page.lenis = this.lenis;

    this.canvas.show(this.template);

    this.page.createPageLoader();
    this.page.show();

    this.onResize();

    this.isLoading = false;
  }

  onResize() {
    if (this.responsive && this.responsive.onResize) {
      this.responsive.onResize();
    }

    if (this.page && this.page.onResize) {
      this.page.onResize(this.responsive.size, this.responsive.fontSize);
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

    if (this.page) {
      this.page.update(time);
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

const satoshiFont = new FontFaceObserver('Satoshi');

Promise.all([satoshiFont.load()])
  .then(() => new App())
  .catch(() => new App());
