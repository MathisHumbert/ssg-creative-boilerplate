import AutoBind from "auto-bind";

import { each } from "../utils/dom";

export default class Component {
  constructor({ classes, element, elements }) {
    AutoBind(this);

    this.classes = classes;
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };

    this.create();

    this.addEventListeners();
  }

  create() {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

    this.elements = {};

    each(this.selectorChildren, ([key, entry]) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = this.element.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(entry);
        }
      }
    });
  }

  addEventListeners() {}
}
