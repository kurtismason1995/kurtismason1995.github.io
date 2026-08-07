const gridSize = 16;
const DEFAULT_DEBUG_ENABLED = false;

if (typeof window !== "undefined" && typeof window.__RPG_DEBUG__ === "undefined") {
  window.__RPG_DEBUG__ = DEFAULT_DEBUG_ENABLED;
}

export const utils = {
  withGrid(n) {
    return n * gridSize;
  },
  asGridCoord(x, y) {
    return `${x * gridSize},${y * gridSize}`;
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;

    if (direction === "left") {
      x -= gridSize;
    } else if (direction === "right") {
      x += gridSize;
    } else if (direction === "up") {
      y -= gridSize;
    } else if (direction === "down") {
      y += gridSize;
    }
    return { x, y };
  },
  oppositeDirection(direction) {
    if (direction === "left") return "right";
    if (direction === "right") return "left";
    if (direction === "up") return "down";
    return "up";
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  isDebugEnabled() {
    return typeof window !== "undefined" && !!window.__RPG_DEBUG__;
  },
  setDebugEnabled(enabled) {
    if (typeof window !== "undefined") {
      window.__RPG_DEBUG__ = !!enabled;
    }
  },
  debug(...args) {
    if (this.isDebugEnabled()) {
      console.log("[RPG]", ...args);
    }
  },
  warn(...args) {
    if (this.isDebugEnabled()) {
      console.warn("[RPG]", ...args);
    }
  },
  error(...args) {
    if (this.isDebugEnabled()) {
      console.error("[RPG]", ...args);
    }
  },
};
