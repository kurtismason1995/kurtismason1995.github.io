import { KeyPressListener } from "./KeyPressListener.js";
import { KeyboardMenu } from "./KeyboardMenu.js";
import { utils } from "./utils.js";

export class PauseMenu {
  constructor({ progress, onComplete }) {
    this.progress = progress;
    this.onComplete = onComplete;
    this.currentPageKey = "root";
  }

  getQuestOverview() {
    const activeQuests = window.playerState.getActiveQuests();

    if (!activeQuests.length) {
      return {
        label: "Quest Log: No active quests",
        description: "Talk to townsfolk and explore new areas to discover objectives.",
      };
    }

    return {
      label: `Quest Log: ${activeQuests.length} active`,
      description: "Open to review your active objectives and next steps.",
    };
  }

  getQuestOptions() {
    const activeQuests = window.playerState.getActiveQuests();

    if (!activeQuests.length) {
      return [
        {
          label: "No active quests",
          description: "Pick up quests by speaking to NPCs with story hints.",
          handler: () => {},
        },
        {
          label: "Back",
          description: "Back to the pause menu.",
          handler: () => this.setMenuPage("root"),
        },
      ];
    }

    const questRows = activeQuests.map((quest) => {
      const title = quest.title || quest.id;
      const stepNumber = Number.isFinite(quest.step) ? quest.step : 0;
      const nextStep = quest.nextStep || "Continue exploring for the next clue.";
      const description = quest.description || "No quest details yet.";

      return {
        label: `${title} (Step ${stepNumber})`,
        description: `${nextStep} ${description}`.trim(),
        handler: () => {},
      };
    });

    return [
      ...questRows,
      {
        label: "Back",
        description: "Back to the pause menu.",
        handler: () => this.setMenuPage("root"),
      },
    ];
  }

  getCurrentGoal() {
    const flags = window.playerState.storyFlags;

    if (flags.DEFEATED_BOSS) {
      return {
        label: "Current goal: Champion",
        description: "You rescued your dad and won the Hay Tournament. Train your team and explore the town.",
      };
    }
    if (flags.DEFEATED_ENEMY_1 && flags.DEFEATED_ENEMY_2 && flags.DEFEATED_ENEMY_3 && flags.DEFEATED_ENEMY_4) {
      return {
        label: "Current goal: Face Morgath",
        description: "All four challengers are defeated. Speak to the tournament leader in the arena.",
      };
    }
    if (flags.SEEN_ARENA_CUTSCENE) {
      return {
        label: "Current goal: Clear the arena",
        description: "Defeat the challengers in the Hay Tournament to reach Morgath and rescue your dad.",
      };
    }
    if (flags.SEEN_OLDMAN_CUTSCENE) {
      return {
        label: "Current goal: Reach the arena",
        description: "Build a balanced lineup, then follow the route to the Hay Tournament.",
      };
    }
    return {
      label: "Current goal: Find allies",
      description: "Explore the town, talk with people, and grow Rocky's team before facing stronger trainers.",
    };
  }

  getBadgeOptions() {
    const badgeDescriptions = {
      "Arena Seed": "Defeated the first Hay Tournament challenger.",
      "Arena Challenger": "Proved you can stand against the tournament's strongest trainers.",
      "Hay Tournament Champion": "Defeated Morgath and rescued your dad.",
    };
    const badges = window.playerState.badges || [];

    return [
      ...badges.map((badge) => ({
        label: badge,
        description: badgeDescriptions[badge] || "An achievement earned through your adventures.",
        handler: () => {},
      })),
      {
        label: "Back",
        description: "Back to the pause menu.",
        handler: () => this.keyboardMenu.setOptions(this.getOptions("root")),
      },
    ];
  }

  getOptions(pageKey) {
    if (pageKey === "badges") {
      return this.getBadgeOptions();
    }

    if (pageKey === "quests") {
      return this.getQuestOptions();
    }

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
        {
          ...this.getCurrentGoal(),
          handler: () => {},
        },
        ...lineupAnimals,
        {
          label: `Satchel: ${window.playerState.items.length} items`,
          description: `${window.playerState.coins || 0} farm coins. Items can be used in battle.`,
          handler: () => {},
        },
        {
          label: `Badges: ${(window.playerState.badges || []).length}`,
          description: "Win named challenges to earn farm badges.",
          handler: () => this.keyboardMenu.setOptions(this.getOptions("badges")),
        },
        {
          ...this.getQuestOverview(),
          handler: () => this.setMenuPage("quests"),
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
        <h2>Pause Menu</h2>
        <p class="PauseMenu__subtitle"></p>`;

    this.subtitleElement = this.element.querySelector(".PauseMenu__subtitle");
  }

  setMenuPage(pageKey) {
    this.currentPageKey = pageKey;
    this.keyboardMenu.setOptions(this.getOptions(pageKey));
    this.renderSubtitle();
  }

  renderSubtitle() {
    const activeQuestCount = window.playerState.getActiveQuests().length;

    if (this.currentPageKey === "quests") {
      this.subtitleElement.textContent = `Active objectives: ${activeQuestCount}`;
      return;
    }

    if (this.currentPageKey === "badges") {
      this.subtitleElement.textContent = `Farm badges earned: ${(window.playerState.badges || []).length}`;
      return;
    }

    this.subtitleElement.textContent = `Farm coins: ${window.playerState.coins || 0}`;
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
    this.setMenuPage("root");
    container.appendChild(this.element);

    await utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    });
  }
}
