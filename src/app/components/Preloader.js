import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';
import { Texture } from 'ogl';

import Component from '../classes/Component';

export default class Preloader extends Component {
  constructor({ gl, library }) {
    super({
      element: '.preloader',
    });

    this.gl = gl;
    this.library = library;
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

    let preloadTextures;

    if (this.library === 'three') {
      preloadTextures = Promise.all(
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
    } else {
      preloadTextures = Promise.all(
        [...window.ASSETS, 'texture.jpeg'].map((src) => {
          return new Promise((res) => {
            const texture = new Texture(this.gl, {
              generateMipmaps: false,
            });

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = src;

            img.onload = () => {
              texture.image = img;
              window.TEXTURES[src] = texture;
              res();
            };
          });
        })
      );
    }

    Promise.all([preloadImages, preloadTextures]).then(() => {
      this.emit('loaded');
    });
  }
}
