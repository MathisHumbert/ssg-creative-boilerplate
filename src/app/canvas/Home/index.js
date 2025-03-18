import { PlaneGeometry, Group } from 'three';

import Media from './Media';

export default class Home {
  constructor({ scene, screen, viewport }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.geometry = new PlaneGeometry(1, 1, 16, 16);
    this.group = new Group();

    this.createMedia();
  }

  createMedia() {
    this.media = new Media({
      element: document.querySelector('.home__media'),
      scene: this.group,
      geometry: this.geometry,
    });
  }

  /**
   * Animations.
   */
  show(prevTemplate) {
    let promise;

    this.scene.add(this.group);

    if (this.media && this.media.show) {
      promise = this.media.show(prevTemplate);
    }

    return promise;
  }

  hide(nextTemplate) {
    let promise;

    if (this.media && this.media.hide) {
      promise = this.media.hide(nextTemplate);
    }

    promise.then(() => {
      this.scene.remove(this.group);
    });

    return promise;
  }
}
