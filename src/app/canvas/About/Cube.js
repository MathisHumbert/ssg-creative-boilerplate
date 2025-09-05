import { BoxGeometry, Mesh, MeshNormalMaterial } from "three";
import gsap from "gsap";

import { lenis } from "../../classes/Lenis";
import { responsive } from "../../classes/Responsive";

import { events } from "../../utils/events";

export default class Cube {
  constructor({ element, scene }) {
    this.element = element;
    this.scene = scene;

    this.isVisible = false;

    this.createMesh();

    this.addEventsListeners();
  }

  /**
   * Create.
   */
  createMesh() {
    this.geometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshNormalMaterial({
      opacity: 0,
      transparent: true,
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createBounds() {
    const rect = this.element.getBoundingClientRect();

    this.bounds = {
      top: rect.top + lenis.scroll,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    this.updateScale();
    this.updateY(lenis.scroll);
  }

  /**
   * Update.
   */
  updateScale() {
    this.scale =
      (responsive.viewport.width * this.bounds.width) /
      responsive.screen.width /
      2;

    this.mesh.scale.set(this.scale, this.scale, this.scale);
  }

  updateY(y = 0) {
    this.mesh.position.y =
      responsive.viewport.height / 2 -
      this.scale -
      ((this.bounds.top - y) / responsive.screen.height) *
        responsive.viewport.height;
  }

  /**
   * Animations.
   */
  show() {
    return new Promise((res) => {
      this.isVisible = true;

      gsap.set(this.material, { opacity: 1 });

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
  onResize() {
    this.createBounds();
  }

  onLenis(event) {
    this.updateY(event.scroll);
  }

  /**
   * Listeners.
   */
  addEventsListeners() {
    events.on("resize", this.onResize.bind(this));
    events.on("update", this.update.bind(this));
    events.on("lenis", this.onLenis.bind(this));
  }

  /**
   * Loop.
   */
  update({ deltaTime }) {
    if (!this.isVisible) return;

    this.mesh.rotation.x += deltaTime * 0.5;
    this.mesh.rotation.y += deltaTime * 0.5;
  }
}
