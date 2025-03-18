import { Group } from 'three';

import Cube from './Cube';

export default class About {
  constructor({ scene, screen }) {
    this.scene = scene;
    this.screen = screen;

    this.group = new Group();

    this.createCube();
  }

  createCube() {
    this.cube = new Cube({
      element: document.querySelector('.about__media'),
      scene: this.group,
    });
  }

  /**
   * Animations.
   */
  show(prevTemplate) {
    let promise;

    this.scene.add(this.group);

    if (this.cube && this.cube.show) {
      promise = this.cube.show(prevTemplate);
    }

    return promise;
  }

  hide(nextTemplate) {
    let promise;

    if (this.cube && this.cube.hide) {
      promise = this.cube.hide(nextTemplate);
    }

    promise.then(() => {
      this.scene.remove(this.group);
    });

    return promise;
  }
}
