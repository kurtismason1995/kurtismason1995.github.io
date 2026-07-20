import { Combatant } from "./Combatant.js";
import { TurnCycle } from "./TurnCycle.js";
import { BattleEvent } from "./BattleEvent.js";
import { Team } from "./Team.js";
import { utils } from "../utils.js";

export class Battle {
  constructor({ enemy, onComplete, arena }) {
    this.enemy = enemy;
    this.onComplete = onComplete;
    this.arena = arena;

    this.combatants = {};

    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    // Dynamically adding player team
    window.playerState.lineup.forEach((id) => {
      this.addCombatant(id, "player", window.playerState.animals[id]);
    });

    // Dynamically adding enemy team
    Object.keys(this.enemy.animals).forEach((key) => {
      this.addCombatant("e_" + key, "enemy", this.enemy.animals[key]);
    });

    this.items = [];

    window.playerState.items.forEach((item) => {
      this.items.push({
        ...item,
        team: "player",
      });
    });

    this.usedInstanceIds = {};
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant(
      {
        ...window.Animals[config.animalId],
        ...config,
        team,
        isPlayerControlled: team === "player",
      },
      this
    );

    // Populate first active Animal
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");

    // If provided, add a CSS class for setting the arena background
    if (this.arena) {
      this.element.classList.add(this.arena);
    }

    this.element.innerHTML = `
    <div class="Battle_hero">
      <img src="${"./assets/characters/people/hero.png"}" alt="Hero" />
    </div>
    <div class="Battle_enemy">
      <img src=${this.enemy.src} alt=${this.enemy.name} />
    </div>
    `;
  }

  updatePlayerState() {
    const playerState = window.playerState;
    Object.keys(playerState.animals).forEach((id) => {
      const playerStateAnimal = playerState.animals[id];
      const combatant = this.combatants[id];
      if (combatant) {
        playerStateAnimal.hp = combatant.hp;
        playerStateAnimal.xp = combatant.xp;
        playerStateAnimal.maxHp = combatant.maxHp;
        playerStateAnimal.level = combatant.level;
        playerStateAnimal.status = combatant.status;
      }
    });

    playerState.items = playerState.items.filter((item) => {
      return !this.usedInstanceIds[item.instanceId];
    });

    utils.emitEvent("PlayerStateUpdated");
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "hero");
    this.enemyTeam = new Team("enemy", "Meany");

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
      onWinner: (winner) => {
        if (winner === "player") {
          const reward = this.enemy.reward || 20;
          window.playerState.addCoins(reward);
          window.playerState.stats.battlesWon++;
        }
        this.updatePlayerState();
        this.element.remove();
        this.onComplete(winner === "player");
      },
      onFlee: () => {
        this.updatePlayerState();
        this.element.remove();
        this.onComplete(false);
      },
    });

    this.turnCycle.init();
  }
}
