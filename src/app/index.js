import '../styles/index.scss';
import './utils/polyfill';
import './utils/scroll';

import FontFaceObserver from 'fontfaceobserver';
import AutoBind from 'auto-bind';
import NormalizeWheel from 'normalize-wheel';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Stats from 'stats.js';
import * as THREE from 'three';

import Canvas from './components/Canvas';
import Preloader from './components/Preloader';

import Home from './pages/Home';
import About from './pages/About';

import { each } from './utils/dom';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    this.template = window.location.pathname;
    this.isLoading = false;
    this.clock = new THREE.Clock();
    this.odlElapsedTime = 0;

    if (import.meta.env.VITE_DEV_MODE) {
      this.createStats();
    }

    AutoBind(this);

    this.init();
  }

  init() {
    this.createCanvas();
    this.createPreloader();

    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.once('loaded', this.onPreloaded);
  }

  createPages() {
    this.home = new Home();
    this.about = new About();

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

  createScrollTrigger() {
    ScrollTrigger.scrollerProxy('#wrapper', {
      scrollTop: (value) => {
        if (arguments.length) {
          this.page.scroll.current = value;
        }
        return this.page.scroll.current;
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

    ScrollTrigger.defaults({ scroller: '#wrapper' });
  }

  createStats() {
    this.stats = new Stats();

    this.stats.showPanel(0);

    document.body.appendChild(this.stats.dom);
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onResize();

    this.update();

    this.createScrollTrigger();

    this.canvas.onPreloaded();

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

    const page = this.pages[url];

    page.createPageLoader();

    this.canvas.onChangeStart();

    await this.page.hide();

    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (push) {
      window.history.pushState({}, '', url);
    }

    this.template = window.location.pathname;
    this.page = page;

    this.createScrollTrigger();

    this.canvas.onChangeEnd(this.template);

    this.page.show();

    this.onResize();

    this.isLoading = false;
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
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
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
  }

  /**
   * Loop.
   */
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.odlElapsedTime;
    this.odlElapsedTime = elapsedTime;

    if (this.stats) {
      this.stats.begin();
    }

    if (this.page) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll.current, deltaTime);
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

    window.addEventListener('wheel', this.onWheel, { passive: true });
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
