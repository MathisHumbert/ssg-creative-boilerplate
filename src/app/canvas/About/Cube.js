import * as THREE from 'three';
import gsap from 'gsap';

export default class Cube {
  constructor({ element, scene, screen, viewport }) {
    this.element = element;
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
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshNormalMaterial({
      opacity: 0,
      transparent: true,
    });

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
    return new Promise((res) => {
      this.isVisible = true;

      gsap.fromTo(this.material, { opacity: 0 }, { opacity: 1 });

      res();
    });
  }

  hide() {
    return new Promise((res) => {
      this.isVisible = false;

      gsap.set(this.material, {
        opacity: 0,
      });

      res();
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
  update(scroll, time) {
    if (!this.isVisible) return;

    this.updateY(scroll);

    this.mesh.rotation.x += time * 0.5;
    this.mesh.rotation.y += time * 0.5;

    this.scroll = scroll;
  }

  /**
   * Destroy.
   */
  destroyGeometry() {
    if (this.geometry) {
      this.geometry.dispose();
    }
  }

  destroyMaterial() {
    if (this.material) {
      this.material.dispose();
    }
  }

  destroyMesh() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
  }

  destroy() {
    this.destroyGeometry();
    this.destroyMaterial();
    this.destroyMesh();
  }
}
