import Clock from './Clock';
import { lenis } from './Lenis';
import { responsive } from './Responsive';

import { events } from '../utils/events';

class WindowEvents {
  constructor() {
    this.clock = new Clock();

    this.oldElapsedTime = 0;

    this.addEventListeners();
    this.update();
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize, { passive: true });

    window.addEventListener('click', this.onClick, { passive: true });

    window.addEventListener('mousedown', this.onTouchDown, { passive: true });
    window.addEventListener('mousemove', this.onTouchMove, { passive: true });
    window.addEventListener('mouseup', this.onTouchUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchDown, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchUp, { passive: true });

    window.addEventListener('wheel', this.onWheel, { passive: true });
  }

  onResize = () => {
    responsive.onResize();

    events.emit('resize', {
      screen: responsive.screen,
      viewport: responsive.viewport,
      fontSize: responsive.fontSize,
    });
  };

  onTouchDown = (event) => {
    events.emit('touchdown', event);
  };

  onTouchMove = (event) => {
    events.emit('touchmove', event);
  };

  onTouchUp = (event) => {
    events.emit('touchup', event);
  };

  onClick = (event) => {
    events.emit('click', event);
  };

  onWheel = (event) => {
    events.emit('wheel', event);
  };

  update(time) {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    events.emit('start-update', {
      time,
      deltaTime,
    });

    events.emit('update', {
      time,
      deltaTime,
      scroll: lenis.scroll,
      velocity: lenis.velocity,
      direction: lenis.direction,
    });

    events.emit('end-update', {
      time,
      deltaTime,
    });

    window.requestAnimationFrame(this.update.bind(this));
  }
}

export const windowEvents = new WindowEvents();
