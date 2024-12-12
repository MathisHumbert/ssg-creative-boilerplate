import * as THREE from 'three';

import Cube from './Cube';

export default class About {
  constructor({ scene, screen, viewport }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.group = new THREE.Group();

    this.createCube();
  }

  createCube() {
    this.cube = new Cube({
      element: document.querySelector('.about__media'),
      scene: this.group,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  /**
   * Animations.
   */
  show() {
    this.scene.add(this.group);

    if (this.cube && this.cube.show) {
      this.cube.show();
    }
  }

  hide() {
    let promise;

    if (this.cube && this.cube.hide) {
      promise = this.cube.hide();
    }

    promise.then(() => {
      this.scene.remove(this.group);
    });

    return promise;
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
