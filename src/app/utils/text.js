export const wrapLines = (arr, wrapType, wrapClass) => {
  arr.forEach((el) => {
    const wrapEl = document.createElement(wrapType);

    if (wrapClass) {
      wrapEl.classList = wrapClass;
    }

    el.parentNode.appendChild(wrapEl);
    wrapEl.appendChild(el);
  });
};

export const wrapLine = (el, wrapType, wrapClass) => {
  const wrapEl = document.createElement(wrapType);

  if (wrapClass) {
    wrapEl.classList = wrapClass;
  }

  wrapEl.textContent = el.textContent;

  el.textContent = "";
  el.appendChild(wrapEl);
};
