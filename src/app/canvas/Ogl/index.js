import { Renderer, Camera, Transform, Vec2, Post } from 'ogl';

import Home from './Home';
import About from './About';
import postFragment from '../../shaders/post-fragment.glsl';

export default class Canvas {
  constructor({ template }) {
    this.template = template;

    this.createRender();
    this.createScene();
    this.createCamera();
    this.createPost();

    this.onResize();
  }

  /**
   * THREE.
   */
  createRender() {
    this.renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    this.gl = this.renderer.gl;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.gl.canvas);
  }

  createScene() {
    this.scene = new Transform();
  }

  createCamera() {
    this.camera = new Camera(this.gl, {
      fov: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 100,
    });
    this.camera.position.z = 5;
  }

  createPost() {
    this.post = new Post(this.gl);
    this.pass = this.post.addPass({
      fragment: postFragment,
      uniforms: {
        uResolution: { value: new Vec2() },
      },
    });
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  /**
   * About.
   */
  createAbout() {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.createHome();
    this.createAbout();

    this.onChangeEnd(this.template);
  }

  onChangeStart() {
    if (this.template === '/') {
      this.home.hide();
    }

    if (this.template === '/about') {
      this.about.hide();
    }
  }

  onChangeEnd(template) {
    if (template === '/') {
      this.home.show();
    }

    if (template === '/about') {
      this.about.show();
    }

    this.template = template;
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.dpr = Math.min(window.devicePixelRatio, 2);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.post.resize();
    this.pass.uniforms.uResolution.value.set(
      this.screen.width,
      this.screen.height
    );

    this.viewport = { width, height };

    if (this.home && this.home.onResize) {
      this.home.onResize({ screen: this.screen, viewport: this.viewport });
    }

    if (this.about && this.about.onResize) {
      this.about.onResize({ screen: this.screen, viewport: this.viewport });
    }
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp() {}

  onWheel(normalized) {}

  /**
   * Loop.
   */
  update(scroll, time) {
    if (this.home && this.home.update) {
      this.home.update(scroll);
    }

    if (this.about && this.about.update) {
      this.about.update(scroll, time);
    }

    // this.renderer.render({ scene: this.scene, camera: this.camera });
    this.post.render({ scene: this.scene, camera: this.camera });
  }
}
