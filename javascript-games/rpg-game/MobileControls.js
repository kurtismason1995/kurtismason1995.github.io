export class MobileControls {
  constructor({ directionInput, onConfirm, onCancel }) {
    this.directionInput = directionInput;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
  }

  init(container) {
    this.element = container.parentElement.querySelector(".mobile-controls");

    if (!this.element) {
      return;
    }

    this.bindDirectionButtons();
    this.bindActionButtons();
    window.addEventListener("blur", () => this.releaseDirections());
  }

  bindDirectionButtons() {
    ["up", "down", "left", "right"].forEach((direction) => {
      const button = this.element.querySelector(`[data-direction="${direction}"]`);
      if (!button) {
        return;
      }

      this.bindHeldButton(button, () => this.directionInput.press(direction), () => this.directionInput.release(direction));
    });
  }

  bindActionButtons() {
    const confirmButton = this.element.querySelector('[data-action="confirm"]');
    const cancelButton = this.element.querySelector('[data-action="cancel"]');

    if (confirmButton) {
      this.bindTapButton(confirmButton, this.onConfirm);
    }

    if (cancelButton) {
      this.bindTapButton(cancelButton, this.onCancel);
    }
  }

  bindHeldButton(button, onPress, onRelease) {
    const start = (event) => {
      event.preventDefault();
      button.classList.add("is-active");
      onPress();
      if (button.setPointerCapture) {
        button.setPointerCapture(event.pointerId);
      }
    };

    const end = (event) => {
      event.preventDefault();
      button.classList.remove("is-active");
      onRelease();
    };

    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("lostpointercapture", end);
  }

  bindTapButton(button, callback) {
    const clearActive = () => {
      button.classList.remove("is-active");
    };

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      callback();
      button.classList.add("is-active");
    });
    button.addEventListener("pointerup", clearActive);
    button.addEventListener("pointercancel", clearActive);
    button.addEventListener("lostpointercapture", clearActive);
  }

  releaseDirections() {
    ["up", "down", "left", "right"].forEach((direction) => {
      this.directionInput.release(direction);
      const button = this.element.querySelector(`[data-direction="${direction}"]`);
      if (button) {
        button.classList.remove("is-active");
      }
    });
  }
}
