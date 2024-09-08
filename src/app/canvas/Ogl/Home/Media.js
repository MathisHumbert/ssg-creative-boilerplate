import { Program, Vec2, Mesh, Plane } from 'ogl';
import gsap from 'gsap';

import fragment from '../../../shaders/fragment.glsl';
import vertex from '../../../shaders/vertex.glsl';

export default class Media {
  constructor({ element, gl, scene, screen, viewport }) {
    this.element = element;
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.scroll = 0;
    this.isVisible = false;

    this.createMaterial();
    this.createMesh();

    this.onResize({ viewport, screen });
  }

  /**
   * Create.   */

  createMaterial() {
    const texture = window.TEXTURES['texture.jpeg'];

    this.material = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        uTexture: { value: texture },
        uResolution: { value: new Vec2(0) },
        uImageResolution: {
          value: new Vec2(
            texture.image.naturalWidth,
            texture.image.naturalHeight
          ),
        },
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });
  }

  createMesh() {
    this.geometry = new Plane(this.gl, {
      widthSegments: 16,
      heightSegments: 16,
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.material,
    });
    this.mesh.setParent(this.scene);
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
