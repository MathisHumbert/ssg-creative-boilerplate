import '../styles/index.scss';
import './utils/scroll';
import './classes/WindowEvents';

import AutoBind from 'auto-bind';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Stats from 'stats.js';

import Router from './classes/Router';

import Canvas from './canvas';

import Preloader from './components/Preloader';
import Grid from './components/Grid';

import Home from './pages/Home';
import About from './pages/About';

import { events } from './utils/events';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    AutoBind(this);

    this.url = window.location.pathname;
    this.lastUrl = window.location.pathname;
    this.isNavigating = true;

    if (import.meta.env.MODE === 'development') {
      this.createStats();
      this.createGrid();
    }

    this.init();
  }

  init() {
    this.createPages();
    this.createCanvas();
    this.createRouter();
    this.createPreloader();

    this.addEventListeners();

    this.update();
  }

  /**
   * Create.
   */
  createPages() {
    this.pages = {
      home: new Home(),
      about: new About(),
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

    this.page.set();
  }

  createCanvas() {
    this.canvas = new Canvas();
  }

  createRouter() {
    this.router = new Router(this);
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.preloadPage(this.page.element);

    events.on('loaded', this.onPreloaded);
  }

  createStats() {
    this.stats = new Stats();

    this.stats.showPanel(0);

    document.body.appendChild(this.stats.dom);
  }

  createGrid() {
    this.grid = new Grid();
  }

  /**
   * Events.
   */
  async onPreloaded() {
    this.canvas.onPreloaded();
    this.page.createPageLoader();

    events.emit('resize');

    await Promise.all([this.page.show(null), this.canvas.show(this.template)]);

    this.router.onPreloaded();
  }

  /**
   * Loop.
   */
  update() {
    if (this.stats) {
      this.stats.begin();
    }

    if (this.stats) {
      this.stats.end();
    }

    ScrollTrigger.update();
  }

  /***
   * Listeners.
   */
  addEventListeners() {
    events.on('update', this.update.bind(this));
  }
}

new App();
