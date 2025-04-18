import AutoBind from 'auto-bind';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { lenis } from './Lenis';
import { each } from '../utils/dom';
import { events } from '../utils/events';

export default class Router {
  constructor(app) {
    AutoBind(this);

    this.app = app;
    this.isNavigating = true;
    this.url = window.location.pathname;
    this.lastUrl = window.location.pathname;

    this.addEventListeners();
    this.addLinkListeners();
  }

  onPreloaded() {
    lenis.start();

    this.isNavigating = false;
  }

  async onChange({ url, push }) {
    url = url.replace(window.location.origin, '');

    if (url === this.url || this.isNavigating) return;

    this.url = url;
    this.lastUrl = url;
    this.isNavigating = true;

    lenis.stop();

    const nextTemplate = this.app.templates[url];
    const page = this.app.pages[nextTemplate];

    await Promise.all([
      this.app.page.hide(nextTemplate),
      this.app.canvas.hide(nextTemplate),
    ]);

    this.app.page.remove();

    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (push) {
      window.history.pushState({}, '', url);
    }

    const prevTemplate = this.app.template;

    this.app.template = nextTemplate;
    this.app.page = page;

    lenis.scrollTo(0, { immediate: true, force: true });

    await this.app.preloader.loadPage(this.app.page.element);

    this.app.page.set();

    this.app.page.createPageLoader();

    const waitPageShow = this.app.page.show(prevTemplate);
    const waitCanvasShow = this.app.canvas.show(this.app.template);

    events.emit('resize');

    await Promise.all([waitPageShow, waitCanvasShow]);

    lenis.start();

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
              push: true,
            });
          }
        };
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }

  addEventListeners() {
    window.addEventListener('popstate', this.onPopState, { passive: true });
  }
}
