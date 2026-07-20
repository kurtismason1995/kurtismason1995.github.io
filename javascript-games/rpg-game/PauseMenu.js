import { KeyPressListener } from "./KeyPressListener.js";
import { KeyboardMenu } from "./KeyboardMenu.js";
import { utils } from "./utils.js";

export class PauseMenu {
  constructor({ progress, onComplete }) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {
    if (pageKey === "root") {
      const lineupAnimals = window.playerState.lineup.map((id) => {
        const { animalId } = playerState.animals[id];
        const base = window.Animals[animalId];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions(id));
          },
        };
      });

      return [
        ...lineupAnimals,
        {
          label: `Satchel: ${window.playerState.items.length} items`,
          description: `${window.playerState.coins || 0} farm coins. Items can be used in battle.`,
          handler: () => {},
        },
        {
          label: `Badges: ${(window.playerState.badges || []).length}`,
          description: "Win named challenges to earn farm badges.",
          handler: () => {},
        },
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            this.progress.save();
            this.close();
          },
        },
        {
          label: "Close",
          description: "Close menu",
          handler: () => {
            this.close();
          },
        },
      ];
    }

    // Options for a single farm animal
    const unequipped = Object.keys(window.playerState.animals)
      .filter((id) => {
        return window.playerState.lineup.indexOf(id) === -1;
      })
      .map((id) => {
        const { animalId } = playerState.animals[id];
        const base = window.Animals[animalId];
        return {
          label: `Swap for ${base.name}`,
          description: base.description,
          handler: () => {
            window.playerState.swapLineup(pageKey, id);
            this.keyboardMenu.setOptions(this.getOptions("root"));
          },
        };
      });

    return [
      ...unequipped,
      {
        label: "Move to front",
        description: "Move farm animal to front",
        handler: () => {
          window.playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions(this.getOptions("root"));
        },
      },
      {
        label: "Back",
        description: "back to main menu",
        handler: () => {
          this.keyboardMenu.setOptions(this.getOptions("root"));
        },
      },
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.classList.add("overlayMenu");

    this.element.innerHTML = `
        <h2>Pause Menu</h2>`;
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));
    container.appendChild(this.element);

    await utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    });
  }
}
