import { KeyPressListener } from "./KeyPressListener.js";
import { KeyboardMenu } from "./KeyboardMenu.js";

export class ShopMenu {
  constructor({ inventory, onComplete }) {
    this.inventory = inventory;
    this.onComplete = onComplete;
  }

  getOptions() {
    return [
      ...this.inventory.map((item) => {
        const action = window.Actions[item.itemId];
        return {
          label: `${action.name} - ${item.price}c`,
          description: action.description,
          right: () => `${window.playerState.coins}c`,
          handler: () => {
            if (!window.playerState.spendCoins(item.price)) {
              return;
            }
            window.playerState.addItem(item.itemId);
            this.keyboardMenu.setOptions(this.getOptions());
          },
          disabled: window.playerState.coins < item.price,
        };
      }),
      {
        label: "Leave shop",
        description: "Return to the village.",
        handler: () => this.close(),
      },
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("ShopMenu", "overlayMenu");
    this.element.innerHTML = "<h2>Farm Supply Shop</h2>";
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({ descriptionContainer: container });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions());
    container.appendChild(this.element);
    this.esc = new KeyPressListener("Escape", () => this.close());
  }
}