import * as THREE from 'three';

import Media from '../Media';

export default class About {
  constructor({ scene, geometry, screen, viewport }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.group = new THREE.Group();

    this.createMedia();
  }

  createMedia() {
    this.media = new Media({
      element: document.querySelector('.about__media'),
      scene: this.group,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      color: new THREE.Vector3(0, 0, 1),
    });
  }

  /**
   * Animations.
   */
  show() {
    this.scene.add(this.group);

    this.media.show();
  }

  hide() {
    this.scene.remove(this.group);

    this.media.hide();
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
