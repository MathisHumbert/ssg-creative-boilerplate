import { Transform } from 'ogl';

import Cube from './Cube';

export default class About {
  constructor({ gl, scene, screen, viewport }) {
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.group = new Transform();

    this.createCube();
  }

  createCube() {
    this.cube = new Cube({
      element: document.querySelector('.about__media'),
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

    if (this.cube && this.cube.show) {
      this.cube.show();
    }
  }

  hide() {
    this.scene.removeChild(this.group);

    if (this.cube && this.cube.hide) {
      this.cube.hide();
    }
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    if (this.cube && this.cube.onResize) {
      this.cube.onResize({ screen, viewport });
    }
  }

  /**
   * Loop.
   */
  update(scroll, time) {
    if (this.cube && this.cube.update) {
      this.cube.update(scroll, time);
    }
  }
}
