import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../../shaders/fragment.glsl';
import vertex from '../../../shaders/vertex.glsl';

export default class Media {
  constructor({ element, scene, geometry, screen, viewport }) {
    this.element = element;
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.scroll = 0;
    this.isVisible = false;

    this.createMaterial();
    this.createMesh();

    this.onResize({ viewport, screen });
  }

  /**
   * Create.
   */

  createMaterial() {
    const texture = window.TEXTURES['texture.jpeg'];

    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uAlpha: { value: 0 },
        uTexture: { value: texture },
        uResolution: {
          value: new THREE.Vector2(),
        },
        uImageResolution: {
          value: new THREE.Vector2(texture.image.width, texture.image.height),
        },
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createBounds() {
    const rect = this.element.getBoundingClientRect();

    this.bounds = {
      top: rect.top + this.scroll,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    this.updateScale();
    this.updateX();
    this.updateY(this.scroll);
  }

  /**
   * Update.
   */
  updateScale() {
    this.mesh.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.mesh.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;

    this.material.uniforms.uResolution.value.set(
      this.mesh.scale.x,
      this.mesh.scale.y
    );
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -this.viewport.width / 2 +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height;
  }

  /**
   * Animations.
   */
  show() {
    this.isVisible = true;

    gsap.fromTo(this.material.uniforms.uAlpha, { value: 0 }, { value: 1 });
  }

  hide() {
    this.isVisible = false;

    gsap.to(this.material.uniforms.uAlpha, {
      value: 0,
    });
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.createBounds();
  }

  /**
   * Loop.
   */
  update(scroll) {
    if (!this.isVisible) return;

    this.updateY(scroll);

    this.scroll = scroll;
  }
}
