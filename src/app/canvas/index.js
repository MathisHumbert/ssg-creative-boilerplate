import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import AutoBind from 'auto-bind';

import Home from './Home';
import About from './About';

import { responsive } from '../classes/Responsive';

import { events } from '../utils/events';

export default class Canvas {
  constructor() {
    AutoBind(this);

    this.template = null;

    this.createScene();
    this.createCamera();
    this.createRender();

    this.addEventListeners();
  }

  /**
   * THREE.
   */
  createScene() {
    this.scene = new Scene();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      45,
      responsive.screen.width / responsive.screen.height,
      0.1,
      100
    );
    this.camera.position.z = 5;

    responsive.setCamera(this.camera);
  }

  createRender() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(responsive.screen.width, responsive.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      scene: this.scene,
    });
  }

  /**
   * About.
   */
  createAbout() {
    this.about = new About({
      scene: this.scene,
    });
  }

  onPreloaded() {
    this.createHome();
    this.createAbout();
  }

  /**
   * Animations.
   */
  hide(nextTemplate) {
    let promise;

    if (this.template === 'home') {
      promise = this.home.hide(nextTemplate);
    }

    if (this.template === 'about') {
      promise = this.about.hide(nextTemplate);
    }

    return promise;
  }

  show(template) {
    let promise;

    if (template === 'home') {
      promise = this.home.show(this.template);
    }

    if (template === 'about') {
      promise = this.about.show(this.template);
    }

    this.template = template;

    return promise;
  }

  /**
   * Events.
   */
  onResize(size) {
    this.renderer.setSize(responsive.screen.width, responsive.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = responsive.screen.width / responsive.screen.height;
    this.camera.updateProjectionMatrix();
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp() {}

  onLenis(event) {}

  /**
   * Listeners.
   */
  addEventListeners() {
    events.on('resize', this.onResize);
    events.on('touchdown', this.onTouchDown);
    events.on('touchmove', this.onTouchMove);
    events.on('touchup', this.onTouchUp);
    events.on('lenis', this.onLenis);
    events.on('end-update', this.update);
  }

  /**
   * Loop.
   */
  update() {
    this.renderer.render(this.scene, this.camera);
  }
}
