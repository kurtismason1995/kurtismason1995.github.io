import { Combatant } from "./Combatant.js";
import { TurnCycle } from "./TurnCycle.js";
import { BattleEvent } from "./BattleEvent.js";
import { Team } from "./Team.js";
import { utils } from "../utils.js";
import { TextMessage } from "../TextMessage.js";

export class Battle {
  constructor({ enemy, onComplete, arena }) {
    this.enemy = enemy || {
      name: "Unknown Opponent",
      src: "./assets/characters/people/hero.png",
      animals: {},
    };
    this.onComplete = onComplete;
    this.arena = arena;
    this.validationWarnings = [];

    if (!enemy) {
      this.validationWarnings.push("Battle could not find the selected enemy data.");
      utils.warn("Missing enemy definition for battle.");
    }

    this.combatants = {};

    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    // Dynamically adding player team
    const playerLineup = Array.isArray(window.playerState?.lineup) ? window.playerState.lineup : [];
    playerLineup.forEach((id) => {
      this.addCombatant(id, "player", window.playerState.animals?.[id]);
    });

    // Dynamically adding enemy team
    const enemyAnimals = this.enemy?.animals || {};
    Object.keys(enemyAnimals).forEach((key) => {
      this.addCombatant("e_" + key, "enemy", enemyAnimals[key]);
    });

    if (!Object.keys(enemyAnimals).length) {
      this.validationWarnings.push(`${this.enemy.name} has no valid battle animals configured.`);
      utils.warn("Enemy has no animals configured.", this.enemy?.name);
    }

    this.items = [];

    window.playerState.items.forEach((item) => {
      this.items.push({
        ...item,
        team: "player",
      });
    });

    this.usedInstanceIds = {};
    this.playerSynergies = [];

    if (typeof window.playerState?.getLineupSynergies === "function") {
      this.playerSynergies = window.playerState.getLineupSynergies();
    }
  }

  applyPlayerSynergyBonuses() {
    if (!this.playerSynergies.length) {
      return;
    }

    const combined = {
      attackMultiplier: 1,
      defenseMultiplier: 1,
      attackFlat: 0,
      defenseFlat: 0,
      energyRegenBonus: 0,
    };

    this.playerSynergies.forEach((synergy) => {
      const bonuses = synergy.bonuses || {};
      combined.attackMultiplier *= bonuses.attackMultiplier || 1;
      combined.defenseMultiplier *= bonuses.defenseMultiplier || 1;
      combined.attackFlat += bonuses.attackFlat || 0;
      combined.defenseFlat += bonuses.defenseFlat || 0;
      combined.energyRegenBonus += bonuses.energyRegenBonus || 0;
    });

    Object.values(this.combatants).forEach((combatant) => {
      if (combatant.team !== "player") {
        return;
      }

      combatant.attack = Math.max(1, Math.round(combatant.attack * combined.attackMultiplier + combined.attackFlat));
      combatant.defense = Math.max(
        1,
        Math.round(combatant.defense * combined.defenseMultiplier + combined.defenseFlat)
      );
      combatant.energyRegen = Math.max(1, combatant.energyRegen + combined.energyRegenBonus);
    });
  }

  addCombatant(id, team, config) {
    if (!config || !config.animalId) {
      this.validationWarnings.push(`Skipped ${team} combatant ${id} because animalId is missing.`);
      utils.warn("Combatant config missing animalId", { id, team, config });
      return;
    }

    const baseAnimal = window.Animals?.[config.animalId];
    if (!baseAnimal) {
      this.validationWarnings.push(
        `Skipped ${team} combatant ${id} because animal '${config.animalId}' does not exist.`
      );
      utils.warn("Combatant animalId not found", {
        id,
        team,
        animalId: config.animalId,
      });
      return;
    }

    this.combatants[id] = new Combatant(
      {
        ...baseAnimal,
        ...config,
        team,
        isPlayerControlled: team === "player",
      },
      this
    );

    if (this.combatants[id].validationWarnings?.length) {
      this.validationWarnings.push(...this.combatants[id].validationWarnings);
    }

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

    this.applyPlayerSynergyBonuses();

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

    if (!this.playerTeam.combatants.length || !this.enemyTeam.combatants.length) {
      const message =
        "Battle could not start because one team has missing animal data. Check content ids and try again.";
      new TextMessage({
        text: message,
        onComplete: () => {
          this.element.remove();
          this.onComplete(false);
        },
      }).init(document.querySelector(".game-container"));
      return;
    }

    const beginTurnCycle = async () => {
      if (this.playerSynergies.length) {
        await new Promise((resolve) => {
          new TextMessage({
            text: `Lineup synergies active: ${this.playerSynergies.map((s) => s.name).join(", ")}.`,
            onComplete: resolve,
          }).init(document.querySelector(".game-container"));
        });
      }

      this.turnCycle = new TurnCycle({
        battle: this,
        onNewEvent: (event) => {
          return new Promise((resolve) => {
            const battleEvent = new BattleEvent(event, this);
            battleEvent.init(resolve);
          });
        },
        onWinner: (winner) => {
          let resultMessage;
          if (winner === "player") {
            const reward = this.enemy.reward || 20;
            window.playerState.addCoins(reward);
            window.playerState.stats.battlesWon++;
            resultMessage = `Victory! You earned ${reward} farm coins.`;
          } else {
            resultMessage = "Your team needs a rest. Regroup and try again.";
          }
          this.updatePlayerState();
          this.element.remove();
          new TextMessage({
            text: resultMessage,
            onComplete: () => this.onComplete(winner === "player"),
          }).init(document.querySelector(".game-container"));
        },
        onFlee: () => {
          this.updatePlayerState();
          this.element.remove();
          new TextMessage({
            text: "You escaped safely. Find a healer before your next battle.",
            onComplete: () => this.onComplete(false),
          }).init(document.querySelector(".game-container"));
        },
      });

      this.turnCycle.init();
    };

    if (this.validationWarnings.length) {
      const warning = this.validationWarnings[0];
      new TextMessage({
        text: `Content warning: ${warning}`,
        onComplete: () => beginTurnCycle(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    beginTurnCycle();
  }
}
