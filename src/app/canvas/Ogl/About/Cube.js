import gsap from 'gsap';
import { Box, Mesh, Program } from 'ogl';

export default class Cube {
  constructor({ element, gl, scene, screen, viewport }) {
    this.element = element;
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.scroll = 0;
    this.isVisible = false;

    this.createMesh();

    this.onResize({ viewport, screen });
  }

  /**
   * Create.
   */
  createMesh() {
    this.geometry = new Box(this.gl);
    this.material = new Program(this.gl, {
      uniforms: {
        uAlpha: { value: 0 },
      },
      vertex: /* glsl */ `
        attribute vec3 position;
        attribute vec3 normal;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat3 normalMatrix;

        varying vec3 vNormal;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;

        uniform float uAlpha;

        varying vec3 vNormal;

        void main() {
          vec3 normal = normalize(vNormal);
          gl_FragColor = vec4(normal, uAlpha);
        }
      `,
      cullFace: false,
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
    this.updateY(this.scroll);
  }

  /**
   * Update.
   */
  updateScale() {
    this.scale =
      (this.viewport.width * this.bounds.width) / this.screen.width / 2;

    this.mesh.scale.set(this.scale, this.scale, this.scale);
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.scale -
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

    gsap.to(this.material.uniforms.uAlpha, { value: 0 });
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
  update(scroll, time) {
    if (!this.isVisible) return;

    this.updateY(scroll);

    this.mesh.rotation.x += time * 0.5;
    this.mesh.rotation.y += time * 0.5;

    this.scroll = scroll;
  }
}
