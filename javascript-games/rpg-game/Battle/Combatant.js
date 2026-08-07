import { utils } from "../utils.js";

function ensureFallbackAction() {
  if (!window.Actions) {
    window.Actions = {};
  }

  if (!window.Actions.__fallback_action__) {
    window.Actions.__fallback_action__ = {
      name: "Struggle",
      description: "A basic move used when no valid actions are available.",
      accuracy: 1,
      energyCost: 0,
      cooldownTurns: 0,
      success: [
        { type: "textMessage", text: "{CASTER} struggles to attack!" },
        { type: "stateChange", damage: 10, damageType: "stone" },
      ],
    };
  }

  return "__fallback_action__";
}

export class Combatant {
  constructor(config, battle) {
    this.validationWarnings = [];

    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });

    this.name = this.name || "Unknown Animal";
    this.type = this.type || "stone";
    this.src = this.src || "./assets/characters/animals/static/cow.png";
    this.icon = this.icon || "./assets/icons/stone.png";
    this.level = this.level || 1;
    this.attack = this.attack || 10;
    this.defense = this.defense || 10;
    this.maxHp = this.maxHp || 50;
    this.maxXp = this.maxXp || 100;
    this.xp = typeof this.xp === "number" ? this.xp : 0;
    this.maxEnergy = this.maxEnergy || 100;
    this.energyRegen = this.energyRegen || 12;

    const fallbackActionId = ensureFallbackAction();
    const sourceActions = Array.isArray(this.actions) ? this.actions : [];
    const invalidActions = [];
    this.actions = sourceActions.filter((actionId) => {
      const isValid = !!window.Actions?.[actionId];
      if (!isValid) {
        invalidActions.push(actionId);
      }
      return isValid;
    });

    if (invalidActions.length) {
      this.validationWarnings.push(
        `${this.name} has missing action ids: ${invalidActions.join(", ")}. Added fallback action instead.`
      );
      utils.warn("Combatant action validation failed", {
        combatant: this.name,
        invalidActions,
      });
    }

    if (!this.actions.length) {
      this.actions = [fallbackActionId];
    }

    this.hp = typeof this.hp === "undefined" ? this.maxHp : this.hp;
    this.energy = typeof this.energy === "number" ? this.energy : this.maxEnergy;
    this.actionCooldowns = this.actionCooldowns || {};
    this.battle = battle;
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;
    return percent < 0 ? 0 : percent;
  }

  get xpPercent() {
    const percent = (this.xp / this.maxXp) * 100;
    return percent;
  }

  get isActive() {
    return this.battle?.activeCombatants[this.team] === this.id;
  }

  get givesXp() {
    return this.level * 15 + 40;
  }

  getAccuracyMultiplier() {
    let multiplier = 1;
    if (this.status?.type === "clumsy") {
      multiplier *= 0.85;
    }
    if (this.status?.type === "soaked") {
      multiplier *= 0.9;
    }
    return multiplier;
  }

  getEvasionMultiplier() {
    let multiplier = 1;
    if (this.status?.type === "soaked") {
      multiplier *= 0.8;
    }
    if (this.status?.type === "harden") {
      multiplier *= 0.9;
    }
    return multiplier;
  }

  getActionData(actionId) {
    return window.Actions?.[actionId] || null;
  }

  getActionEnergyCost(action) {
    return typeof action?.energyCost === "number" ? Math.max(0, action.energyCost) : 0;
  }

  getActionCooldown(action) {
    return typeof action?.cooldownTurns === "number" ? Math.max(0, action.cooldownTurns) : 0;
  }

  getActionAccuracy(action) {
    return typeof action?.accuracy === "number" ? Math.min(1, Math.max(0.05, action.accuracy)) : 1;
  }

  getActionCooldownRemaining(actionId) {
    return this.actionCooldowns[actionId] || 0;
  }

  canUseAction(actionId) {
    const action = this.getActionData(actionId);
    if (!action) {
      return false;
    }

    if (this.getActionCooldownRemaining(actionId) > 0) {
      return false;
    }

    return this.energy >= this.getActionEnergyCost(action);
  }

  getActionBlockReason(actionId) {
    const action = this.getActionData(actionId);
    if (!action) {
      return "Unavailable";
    }

    const turnsLeft = this.getActionCooldownRemaining(actionId);
    if (turnsLeft > 0) {
      return `Cooldown: ${turnsLeft} turn${turnsLeft === 1 ? "" : "s"}`;
    }

    const cost = this.getActionEnergyCost(action);
    if (this.energy < cost) {
      return `Need ${cost} energy`;
    }

    return "Ready";
  }

  getUsableActionIds() {
    return this.actions.filter((actionId) => this.canUseAction(actionId));
  }

  tickActionCooldowns() {
    Object.keys(this.actionCooldowns).forEach((actionId) => {
      const nextValue = Math.max(0, (this.actionCooldowns[actionId] || 0) - 1);
      if (nextValue === 0) {
        delete this.actionCooldowns[actionId];
      } else {
        this.actionCooldowns[actionId] = nextValue;
      }
    });
  }

  beginTurn() {
    this.tickActionCooldowns();
    this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen);
    this.update();
  }

  commitAction(actionId) {
    if (!actionId) {
      return;
    }
    const action = this.getActionData(actionId);
    if (!action) {
      return;
    }

    const cost = this.getActionEnergyCost(action);
    const cooldown = this.getActionCooldown(action);

    this.energy = Math.max(0, this.energy - cost);
    if (cooldown > 0) {
      this.actionCooldowns[actionId] = cooldown;
    }

    this.lastActionId = actionId;

    this.update();
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.setAttribute("data-status", this.status);
    this.hudElement.innerHTML = `
      <p class="Combatant_name">${this.name}</p>
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
      </div>
      <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 26 3" class="Combatant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 26 2" class="Combatant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
      </svg>
      <p class="Combatant_status"></p>
    `;

    this.animalElement = document.createElement("img");
    this.animalElement.classList.add("Animal");
    this.animalElement.setAttribute("src", this.src);
    this.animalElement.setAttribute("alt", this.name);
    this.animalElement.setAttribute("data-team", this.team);

    this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
  }

  update(changes = {}) {
    Object.keys(changes).forEach((key) => {
      this[key] = changes[key];
    });

    this.hudElement.setAttribute("data-active", this.isActive);
    this.animalElement.setAttribute("data-active", this.isActive);

    this.hpFills.forEach((fill) => (fill.style.width = `${this.hpPercent}%`));
    this.xpFills.forEach((fill) => (fill.style.width = `${this.xpPercent}%`));

    this.hudElement.querySelector(".Combatant_level").innerHTML = this.level;

    const statusElement = this.hudElement.querySelector(".Combatant_status");
    if (this.status) {
      statusElement.innerHTML = this.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerHTML = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents) {
    if (this.status?.type === "stunned") {
      return [{ type: "textMessage", text: `${this.name} is stunned and cannot move!` }];
    }
    if (this.status?.type === "clumsy" && utils.randomFromArray([true, false, false])) {
      return [{ type: "textMessage", text: `${this.name} is stumbling around.` }];
    }
    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "regen") {
      return [
        { type: "textMessage", text: "You regenerate some health" },
        { type: "stateChange", recover: 10, onCaster: true },
      ];
    }
    if (this.status?.type === "burned") {
      return [
        { type: "textMessage", text: `${this.name} is hurt by the burn!` },
        { type: "stateChange", damage: 6, damageType: "fire", onCaster: true },
      ];
    }
    if (this.status?.type === "soaked") {
      return [
        { type: "textMessage", text: `${this.name} is dripping wet and off balance.` },
      ];
    }
    return [];
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn--;
      if (this.status.expiresIn <= 0) {
        const statusType = this.status.type;
        this.update({ status: null });
        return {
          type: "textMessage",
          text: `{CASTER} is no longer ${statusType}!`,
        };
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.animalElement);
    this.update();
  }
}
