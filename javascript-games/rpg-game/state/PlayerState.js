import { utils } from "../utils.js";

export class PlayerState {
  constructor() {
    this.questStates = {
      LOCKED: "locked",
      ACTIVE: "active",
      COMPLETED: "completed",
      FAILED: "failed",
    };
    this.animals = {};
    this.lineup = [];
    this.items = [];
    this.storyFlags = {};
    this.quests = {};
    this.coins = 0;
    this.badges = [];
    this.stats = {
      battlesWon: 0,
      animalsRescued: 0,
    };
    this.nextId = 1;
  }

  createId(prefix) {
    const id = `${prefix}_${Date.now()}_${this.nextId}`;
    this.nextId++;
    return id;
  }

  healAnimals() {
    Object.keys(this.animals).forEach((key) => {
      this.animals[key].hp = this.animals[key].maxHp;
    });
  }

  addItem(itemId) {
    const newInstanceId = this.createId("i");
    this.items.push({
      actionId: itemId,
      instanceId: newInstanceId,
    });
    utils.emitEvent("PlayerStateUpdated");
  }

  addAnimal(animalId, hp = null) {
    const newId = this.createId("p");
    const startingHp = hp || 50;
    this.animals[newId] = {
      animalId,
      hp: startingHp,
      maxHp: startingHp,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null,
    };

    this.stats.animalsRescued++;

    if (this.lineup.length < 3) {
      this.lineup.push(newId);
      utils.emitEvent("LineupChanged");
    }

    utils.emitEvent("PlayerStateUpdated");
  }

  addCoins(amount) {
    this.coins = Math.max(0, this.coins + amount);
    utils.emitEvent("PlayerStateUpdated");
  }

  spendCoins(amount) {
    if (this.coins < amount) {
      return false;
    }
    this.coins -= amount;
    utils.emitEvent("PlayerStateUpdated");
    return true;
  }

  addBadge(badgeId) {
    if (!this.badges.includes(badgeId)) {
      this.badges.push(badgeId);
      utils.emitEvent("PlayerStateUpdated");
    }
  }

  normalizeQuestState(state) {
    const validStates = Object.values(this.questStates);
    return validStates.includes(state) ? state : this.questStates.LOCKED;
  }

  ensureQuest(questId, questPatch = {}) {
    if (!questId) {
      return null;
    }

    const existing = this.quests[questId] || {
      id: questId,
      title: questPatch.title || questId,
      description: questPatch.description || "",
      state: this.questStates.LOCKED,
      step: 0,
      nextStep: "",
    };

    this.quests[questId] = {
      ...existing,
      ...questPatch,
      id: questId,
      state: this.normalizeQuestState(questPatch.state || existing.state),
      step: Number.isFinite(questPatch.step) ? questPatch.step : existing.step,
    };

    return this.quests[questId];
  }

  startQuest(questId, questPatch = {}) {
    const quest = this.ensureQuest(questId, {
      ...questPatch,
      state: this.questStates.ACTIVE,
      step: Number.isFinite(questPatch.step) ? questPatch.step : 1,
    });

    if (quest) {
      utils.emitEvent("PlayerStateUpdated");
    }
  }

  advanceQuestStep(questId, questPatch = {}) {
    const quest = this.ensureQuest(questId, {
      ...questPatch,
      state: this.questStates.ACTIVE,
    });

    if (!quest) {
      return;
    }

    if (Number.isFinite(questPatch.step)) {
      quest.step = questPatch.step;
    } else {
      quest.step = (Number.isFinite(quest.step) ? quest.step : 0) + 1;
    }

    this.quests[questId] = {
      ...quest,
      ...questPatch,
      id: questId,
      state: this.questStates.ACTIVE,
      step: quest.step,
    };

    utils.emitEvent("PlayerStateUpdated");
  }

  completeQuest(questId, questPatch = {}) {
    const quest = this.ensureQuest(questId, {
      ...questPatch,
      state: this.questStates.COMPLETED,
    });

    if (!quest) {
      return;
    }

    this.quests[questId] = {
      ...quest,
      ...questPatch,
      id: questId,
      state: this.questStates.COMPLETED,
      nextStep: questPatch.nextStep || "Completed",
    };

    utils.emitEvent("PlayerStateUpdated");
  }

  failQuest(questId, questPatch = {}) {
    const quest = this.ensureQuest(questId, {
      ...questPatch,
      state: this.questStates.FAILED,
    });

    if (!quest) {
      return;
    }

    this.quests[questId] = {
      ...quest,
      ...questPatch,
      id: questId,
      state: this.questStates.FAILED,
      nextStep: questPatch.nextStep || "Failed",
    };

    utils.emitEvent("PlayerStateUpdated");
  }

  getActiveQuests() {
    return Object.values(this.quests || {})
      .filter((quest) => quest.state === this.questStates.ACTIVE)
      .sort((a, b) => {
        const stepA = Number.isFinite(a.step) ? a.step : 0;
        const stepB = Number.isFinite(b.step) ? b.step : 0;
        return stepA - stepB;
      });
  }

  gainXp(animalId, amount) {
    const animal = this.animals[animalId];
    if (!animal) {
      return { levelsGained: 0 };
    }

    let levelsGained = 0;
    animal.xp += amount;
    while (animal.xp >= animal.maxXp) {
      animal.xp -= animal.maxXp;
      animal.level++;
      animal.maxXp = 100 + (animal.level - 1) * 35;
      animal.maxHp += 8;
      animal.hp = Math.min(animal.maxHp, animal.hp + 8);
      levelsGained++;
    }
    return { levelsGained };
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent("LineupChanged");
  }

  moveToFront(frontId) {
    this.lineup = this.lineup.filter((id) => id !== frontId);
    this.lineup.unshift(frontId);
    utils.emitEvent("LineupChanged");
  }

  getLineupTypeCounts() {
    const counts = {};

    this.lineup.forEach((lineupId) => {
      const animalId = this.animals?.[lineupId]?.animalId;
      const type = window.Animals?.[animalId]?.type;
      if (!type) {
        return;
      }

      counts[type] = (counts[type] || 0) + 1;
    });

    return counts;
  }

  getLineupSynergies() {
    const typeCounts = this.getLineupTypeCounts();
    const uniqueTypeCount = Object.keys(typeCounts).length;
    const has = (type) => (typeCounts[type] || 0) > 0;
    const synergies = [];

    if (uniqueTypeCount >= 3) {
      synergies.push({
        id: "mixed-pack-momentum",
        name: "Mixed Pack Momentum",
        description: "Three different lineup types sharpen battle instincts.",
        bonuses: {
          attackMultiplier: 1.08,
        },
      });
    }

    if (has("stone") && has("nature")) {
      synergies.push({
        id: "stone-grove-ward",
        name: "Stone Grove Ward",
        description: "Stone and nature allies reinforce each other defensively.",
        bonuses: {
          defenseMultiplier: 1.12,
        },
      });
    }

    if (has("water") && has("fly")) {
      synergies.push({
        id: "sky-current-tempo",
        name: "Sky Current Tempo",
        description: "Water and fly allies recover stamina faster each turn.",
        bonuses: {
          energyRegenBonus: 4,
        },
      });
    }

    if (has("fire") && has("shadow")) {
      synergies.push({
        id: "ember-night-ambush",
        name: "Ember Night Ambush",
        description: "Fire and shadow allies gain extra striking power.",
        bonuses: {
          attackFlat: 2,
        },
      });
    }

    return synergies;
  }
}
