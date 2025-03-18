import { LinearFilter, TextureLoader } from 'three';
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver';

import Component from '../classes/Component';
import { map } from '../utils/dom';
import { events } from '../utils/events';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
    });

    this.loadedTextureUrl = [];
    window.TEXTURES = {};

    this.textureLoader = new TextureLoader();
  }

  /**
   * Events.
   */
  preloadPage(content) {
    this.loadedTextureUrl.push(window.location.pathname);

    const images = content.querySelectorAll('data-src');

    const preloadImages = new Promise((res) => {
      imagesLoaded(content, { background: true }, res);
    });

    const preloadTextures = this.loadTextures([...images, 'texture.jpeg']);

    const preloadFonts = this.loadFonts();

    const preloaderAnimation = this.animatePreloader();

    Promise.all([
      preloadImages,
      preloadTextures,
      preloadFonts,
      preloaderAnimation,
    ]).then(() => {
      if (this.element) {
        this.element.parentNode.removeChild(this.element);
      }

      events.emit('loaded');
    });
  }

  loadPage(content) {
    const images = content.querySelectorAll('data-src');

    if (!this.loadedTextureUrl.includes(window.location.pathname)) {
      this.loadedTextureUrl.push(window.location.pathname);

      const loadImages = new Promise((res) => {
        imagesLoaded(content, { background: true }, res);
      });

      const loadTextures = this.loadTextures(images);

      return new Promise((res) => {
        Promise.all([loadImages, loadTextures]).then(() => {
          res();
        });
      });
    } else {
      const loadImages = new Promise((res) => {
        imagesLoaded(content, { background: true }, res);
      });

      return new Promise((res) => {
        loadImages.then(() => {
          res();
        });
      });
    }
  }

  loadFonts() {
    const satoshiFont = new FontFaceObserver('Satoshi');

    return Promise.all([satoshiFont.load()]);
  }

  loadTextures(images) {
    return Promise.all(
      map(
        images,
        (image) =>
          new Promise((res) => {
            this.textureLoader.load(image, (texture) => {
              texture.generateMipmaps = false;
              texture.minFilter = LinearFilter;
              texture.needsUpdate = true;

              window.TEXTURES[image] = texture;
              res();
            });
          })
      )
    );
  }

  /**
   * Animations.
   */
  animatePreloader() {
    return new Promise(async (res) => {
      res();
    });
  }
}
