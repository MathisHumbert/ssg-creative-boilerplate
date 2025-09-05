const toArray = (element) => {
  if (element == null) {
    return [];
  } else if (Array.isArray(element)) {
    return element;
  } else if (element instanceof NodeList || element instanceof HTMLCollection) {
    return Array.from(element);
  } else if (typeof element === "object") {
    return Object.entries(element);
  } else {
    return [element];
  }
};

export const findAncestor = (element, selector) => {
  while (
    (element = element.parentElement) &&
    !(element.matches || element.matchesSelector).call(element, selector)
  ) {
    return element;
  }
};

export const getOffset = (element, scroll = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
  };
};

export function getIndex(node) {
  let index = 0;

  // eslint-disable-next-line no-extra-parens
  while ((node = node.previousElementSibling)) {
    index++;
  }

  return index;
}

export function map(element, callback) {
  if (element instanceof window.HTMLElement) {
    return [callback(element)];
  }

  const nodes = toArray(element);

  return nodes.map(callback);
}

export function each(element, callback) {
  if (element instanceof window.HTMLElement) {
    return [callback(element)];
  }

  const nodes = toArray(element);

  return nodes.forEach(callback);
}
