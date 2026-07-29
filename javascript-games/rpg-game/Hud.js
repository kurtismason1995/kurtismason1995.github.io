import { Combatant } from "./Battle/Combatant.js";

export class Hud {
  constructor() {
    this.scoreboards = [];
  }

  update() {
    this.scoreboards.forEach((scoreBoard) => {
      scoreBoard.update(window.playerState.animals[scoreBoard.id]);
    });

    if (this.progressElement) {
      const { coins, badges, stats } = window.playerState;
      this.progressElement.innerHTML = `
        <span class="Hud_stat">$${coins}</span>
        <span class="Hud_stat">Wins ${stats.battlesWon}</span>
        <span class="Hud_stat">Rescues ${stats.animalsRescued}</span>
        <span class="Hud_stat">Badges ${badges.length}</span>
      `;
    }
  }

  createElement() {
    if (this.element) {
      this.element.remove();
      this.scoreboards = [];
    }

    this.element = document.createElement("div");
    this.element.classList.add("Hud");

    this.progressElement = document.createElement("div");
    this.progressElement.classList.add("Hud_progress");
    this.element.appendChild(this.progressElement);

    const { playerState } = window;
    playerState.lineup.forEach((key) => {
      const animal = playerState.animals[key];
      const scoreBoard = new Combatant(
        {
          id: key,
          ...window.Animals[animal.animalId],
          ...animal,
        },
        null
      );

      scoreBoard.createElement();
      this.scoreboards.push(scoreBoard);
      this.element.appendChild(scoreBoard.hudElement);
    });

    this.update();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    document.addEventListener("PlayerStateUpdated", () => {
      this.update();
    });

    document.addEventListener("LineupChanged", () => {
      this.createElement();
      container.appendChild(this.element);
    });
  }
}
