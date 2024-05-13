import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';

import Component from '../classes/Component';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
    });

    window.TEXTURES = {};

    this.createLoader();
  }

  createLoader() {
    const preloadImages = new Promise((resolve) => {
      imagesLoaded(
        document.querySelectorAll('img'),
        { background: true },
        resolve
      );
    });

    const textureLoader = new THREE.TextureLoader();

    const preloadTextures = Promise.all(
      [...window.ASSETS, 'texture.jpeg'].map(
        (image) =>
          new Promise((resolve) => {
            textureLoader.load(image, (texture) => {
              texture.generateMipmaps = false;
              texture.minFilter = THREE.LinearFilter;
              texture.needsUpdate = true;

              window.TEXTURES[image] = texture;

              resolve();
            });
          })
      )
    );

    Promise.all([preloadImages, preloadTextures]).then(() => {
      this.emit('loaded');
    });
  }
}
