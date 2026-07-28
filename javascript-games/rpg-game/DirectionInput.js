export class DirectionInput {
  constructor() {
    this.heldDirections = [];
    this.map = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",

      KeyW: "up",
      KeyS: "down",
      KeyA: "left",
      KeyD: "right",
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  press(direction) {
    if (direction && this.heldDirections.indexOf(direction) === -1) {
      this.heldDirections.unshift(direction);
    }
  }

  release(direction) {
    const index = this.heldDirections.indexOf(direction);
    if (direction && index !== -1) {
      this.heldDirections.splice(index, 1);
    }
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.map[e.code];
      this.press(dir);
    });

    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];
      this.release(dir);
    });
  }
}
