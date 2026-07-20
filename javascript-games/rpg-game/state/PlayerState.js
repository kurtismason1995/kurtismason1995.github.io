import { utils } from "../utils.js";

export class PlayerState {
  constructor() {
    this.animals = {};
    this.lineup = [];
    this.items = [];
    this.storyFlags = {};
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
}
