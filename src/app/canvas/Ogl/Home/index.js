import { Transform } from 'ogl';

import Media from './Media';

export default class Home {
  constructor({ gl, scene, screen, viewport }) {
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.group = new Transform();

    this.createMedia();
  }

  createMedia() {
    this.media = new Media({
      element: document.querySelector('.home__media'),
      gl: this.gl,
      scene: this.group,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  /**
   * Animations.
   */
  show() {
    this.group.setParent(this.scene);

    if (this.media && this.media.show) {
      this.media.show();
    }
  }

  hide() {
    this.scene.removeChild(this.group);

    if (this.media && this.media.hide) {
      this.media.hide();
    }
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    if (this.media && this.media.onResize) {
      this.media.onResize({ screen, viewport });
    }
  }

  /**
   * Loop.
   */
  update(scroll) {
    if (this.media && this.media.update) {
      this.media.update(scroll);
    }
  }
}
