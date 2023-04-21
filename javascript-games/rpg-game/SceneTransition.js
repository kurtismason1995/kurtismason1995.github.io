export class SceneTransition {
  constructor() {
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("SceneTransition");
  }

  fadeOut() {
    if (this.element?.classList) {
      this.element.classList.add("fade-out");
      this.element.addEventListener(
        "animationend",
        () => {
          this.element.remove();
        },
        { once: true }
      );
    }
  }

  init(container, callback) {
    this.createElement();
    container.appendChild(this.element);

    this.element.addEventListener(
      "animationend",
      () => {
        callback();
      },
      { once: true }
    );
  }
}
