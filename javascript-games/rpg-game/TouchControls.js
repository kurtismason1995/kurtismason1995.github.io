export class TouchControls {
  constructor() {
    this.directionCodes = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
  }

  emitKey(code, type) {
    document.dispatchEvent(
      new KeyboardEvent(type, {
        code,
        key: code,
        bubbles: true,
      })
    );
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TouchControls");
    this.element.innerHTML = `
      <div class="TouchControls_dpad" aria-label="Movement controls">
        <button type="button" class="TouchControls_up" data-key="ArrowUp" aria-label="Move up">Up</button>
        <button type="button" class="TouchControls_left" data-key="ArrowLeft" aria-label="Move left">Left</button>
        <button type="button" class="TouchControls_right" data-key="ArrowRight" aria-label="Move right">Right</button>
        <button type="button" class="TouchControls_down" data-key="ArrowDown" aria-label="Move down">Down</button>
      </div>
      <div class="TouchControls_actions">
        <button type="button" class="TouchControls_button" data-key="Enter" aria-label="Select or interact">A</button>
        <button type="button" class="TouchControls_button" data-key="Escape" aria-label="Open or close pause menu">Menu</button>
      </div>`;

    this.element.querySelectorAll("button[data-key]").forEach((button) => {
      const { key } = button.dataset;
      const isDirection = this.directionCodes.has(key);

      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.emitKey(key, "keydown");
      });

      const release = (event) => {
        event.preventDefault();
        this.emitKey(key, "keyup");
      };

      if (isDirection) {
        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("pointerleave", (event) => {
          if (event.buttons) {
            release(event);
          }
        });
      } else {
        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
      }
    });
  }

  init() {
    this.createElement();
    document.body.appendChild(this.element);
  }
}