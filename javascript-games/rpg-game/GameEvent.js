import { TextMessage } from "./TextMessage.js";
import { utils } from "./utils.js";
import { SceneTransition } from "./SceneTransition.js";
import { Battle } from "./Battle/Battle.js";
import { PauseMenu } from "./PauseMenu.js";
import { CraftingMenu } from "./CraftingMenu.js";
import { ShopMenu } from "./ShopMenu.js";
import { KeyboardMenu } from "./KeyboardMenu.js";
import { KeyPressListener } from "./KeyPressListener.js";

export class GameEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  getSpeakerMetadata() {
    const speakerConfig = this.event.speaker;
    const speaker = typeof speakerConfig === "string" ? { name: speakerConfig } : { ...(speakerConfig || {}) };
    const speakerId = speaker.id || this.event.speakerId || this.event.faceHero || this.event.who;
    const speakerObject = speakerId ? this.map.gameObjects[speakerId] : null;

    if (!speaker.portrait && speakerObject?.sprite?.image?.src) {
      //speaker.portrait = speakerObject.sprite.image.src;
    }

    if (!speaker.name && speakerObject?.id) {
      speaker.name = speakerObject.id.charAt(0).toUpperCase() + speakerObject.id.slice(1);
    }

    if (!speaker.name && !speaker.portrait) {
      return null;
    }

    return speaker;
  }

  getLeadAnimalName() {
    const leadId = window.playerState?.lineup?.[0];
    const leadAnimalState = leadId ? window.playerState.animals?.[leadId] : null;
    const baseAnimal = leadAnimalState ? window.Animals?.[leadAnimalState.animalId] : null;
    return baseAnimal?.name || "your lead animal";
  }

  getDialogueTokenValues() {
    const playerState = window.playerState;
    const badges = playerState.badges || [];
    const stats = playerState.stats || {};

    return {
      PLAYER_COINS: String(playerState.coins || 0),
      PLAYER_BADGES_COUNT: String(badges.length),
      PLAYER_BADGES_LIST: badges.length ? badges.join(", ") : "none",
      PLAYER_BATTLES_WON: String(stats.battlesWon || 0),
      PLAYER_ANIMALS_RESCUED: String(stats.animalsRescued || 0),
      LEAD_ANIMAL_NAME: this.getLeadAnimalName(),
    };
  }

  applyDialogueTokens(text = "") {
    const tokenValues = this.getDialogueTokenValues();
    return String(text).replace(/\{([A-Z0-9_]+)\}/g, (match, key) => {
      return tokenValues[key] ?? match;
    });
  }

  async runEventList(events = []) {
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new GameEvent({
        event: events[i],
        map: this.map,
      });

      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        return result;
      }
    }

    return null;
  }

  buildChoiceEvents(option) {
    if (Array.isArray(option.events) && option.events.length) {
      return option.events;
    }

    const events = [];

    if (option.flag) {
      events.push({ type: "addStoryFlag", flag: option.flag });
    }

    if (option.itemId) {
      events.push({ type: "addItem", itemId: option.itemId });
    }

    if (typeof option.coins === "number") {
      events.push({ type: "addCoins", amount: option.coins });
    }

    if (option.badgeId) {
      events.push({ type: "addBadge", badgeId: option.badgeId });
    }

    if (option.enemyId) {
      events.push({ type: "battle", enemyId: option.enemyId, arena: option.arena });
    }

    if (Array.isArray(option.inventory)) {
      events.push({ type: "shop", inventory: option.inventory });
    }

    if (option.text) {
      events.push({
        type: "textMessage",
        text: option.text,
        speaker: option.speaker,
        speakerId: option.speakerId,
        speed: option.speed,
        autoAdvanceDelay: option.autoAdvanceDelay,
      });
    }

    if (Array.isArray(option.nextEvents) && option.nextEvents.length) {
      events.push(...option.nextEvents);
    }

    return events;
  }

  resolveEventType(type) {
    if (!type) {
      return null;
    }

    if (typeof this[type] === "function") {
      return type;
    }

    const aliasMap = {
      textmessage: "textMessage",
      choicemenu: "choiceMenu",
      changemap: "changeMap",
      addstoryflag: "addStoryFlag",
      startquest: "startQuest",
      advancequeststep: "advanceQuestStep",
      completequest: "completeQuest",
      failquest: "failQuest",
      craftingmenu: "craftingMenu",
      addanimal: "addAnimal",
      additem: "addItem",
      addcoins: "addCoins",
      addbadge: "addBadge",
      healanimals: "healAnimals",
    };

    const normalizedType = String(type).toLowerCase();
    if (aliasMap[normalizedType] && typeof this[aliasMap[normalizedType]] === "function") {
      return aliasMap[normalizedType];
    }

    return null;
  }

  init() {
    return new Promise((resolve) => {
      const resolvedType = this.resolveEventType(this.event.type);
      if (!resolvedType) {
        utils.warn("Unknown event type", this.event);
        new TextMessage({
          text: `Event error: '${this.event.type}' is not a recognized event type.`,
          onComplete: () => resolve(),
        }).init(document.querySelector(".game-container"));
        return;
      }
      this[resolvedType](resolve);
    });
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehaviour(
      { map: this.map },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    // Handler when event completes
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonStandingComplete", completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehaviour(
      { map: this.map },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    );

    // Handler when event completes
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.applyDialogueTokens(this.event.text),
      speaker: this.getSpeakerMetadata(),
      speed: this.event.speed,
      autoAdvanceDelay: this.event.autoAdvanceDelay,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector(".game-container"));
  }

  choiceMenu(resolve) {
    const options = Array.isArray(this.event.options) ? this.event.options : [];
    if (!options.length) {
      new TextMessage({
        text: "Choice menu error: no options were provided.",
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    const container = document.querySelector(".game-container");
    const menuElement = document.createElement("div");
    menuElement.classList.add("ChoiceMenu", "overlayMenu");
    menuElement.innerHTML = `<h2>${this.applyDialogueTokens(this.event.title || "Make a choice")}</h2>`;

    const keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    keyboardMenu.init(menuElement);

    const closeMenu = () => {
      esc?.unbind();
      keyboardMenu.end();
      menuElement.remove();
    };

    const mappedOptions = options.map((option) => {
      return {
        label: this.applyDialogueTokens(option.label || "Option"),
        description: this.applyDialogueTokens(option.description || ""),
        disabled: !!option.disabled,
        handler: async () => {
          closeMenu();
          const optionEvents = this.buildChoiceEvents(option);
          if (!optionEvents.length) {
            resolve();
            return;
          }
          const result = await this.runEventList(optionEvents);
          resolve(result);
        },
      };
    });

    keyboardMenu.setOptions(mappedOptions);
    container.appendChild(menuElement);

    const esc = new KeyPressListener("Escape", () => {
      closeMenu();
      resolve();
    });
  }

  changeMap(resolve) {
    //Deactivate old objects
    Object.values(this.map.gameObjects).forEach((obj) => {
      obj.isMounted = false;
    });

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.game.startMap(
        window.GameMaps[this.event.map],
        {
          x: this.event.x,
          y: this.event.y,
          direction: this.event.direction,
        },
        sceneTransition
      );
      resolve();
    });
  }

  battle(resolve) {
    const enemy = window.Enemies?.[this.event.enemyId];
    if (!enemy) {
      utils.warn("Missing enemyId in battle event", this.event.enemyId);
      new TextMessage({
        text: `Battle error: enemy '${this.event.enemyId}' was not found.`,
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    const battle = new Battle({
      enemy,
      arena: this.event.arena || null,
      onComplete: (didWin) => {
        resolve(didWin ? `WON_BATTLE` : `LOST_BATTLE`);
      },
    });
    battle.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    utils.emitEvent("PlayerStateUpdated");
    resolve();
  }

  startQuest(resolve) {
    if (!this.event.questId) {
      utils.warn("Missing questId in startQuest event", this.event);
      new TextMessage({
        text: "Quest error: missing questId for startQuest.",
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    window.playerState.startQuest(this.event.questId, {
      title: this.event.title,
      description: this.event.description,
      step: this.event.step,
      nextStep: this.applyDialogueTokens(this.event.nextStep || ""),
    });
    resolve();
  }

  advanceQuestStep(resolve) {
    if (!this.event.questId) {
      utils.warn("Missing questId in advanceQuestStep event", this.event);
      new TextMessage({
        text: "Quest error: missing questId for advanceQuestStep.",
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    window.playerState.advanceQuestStep(this.event.questId, {
      title: this.event.title,
      description: this.event.description,
      step: this.event.step,
      nextStep: this.applyDialogueTokens(this.event.nextStep || ""),
    });
    resolve();
  }

  completeQuest(resolve) {
    if (!this.event.questId) {
      utils.warn("Missing questId in completeQuest event", this.event);
      new TextMessage({
        text: "Quest error: missing questId for completeQuest.",
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    window.playerState.completeQuest(this.event.questId, {
      title: this.event.title,
      description: this.event.description,
      step: this.event.step,
      nextStep: this.applyDialogueTokens(this.event.nextStep || "Completed"),
    });
    resolve();
  }

  failQuest(resolve) {
    if (!this.event.questId) {
      utils.warn("Missing questId in failQuest event", this.event);
      new TextMessage({
        text: "Quest error: missing questId for failQuest.",
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    window.playerState.failQuest(this.event.questId, {
      title: this.event.title,
      description: this.event.description,
      step: this.event.step,
      nextStep: this.applyDialogueTokens(this.event.nextStep || "Failed"),
    });
    resolve();
  }

  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      animals: this.event.animals,
      onComplete: () => {
        resolve();
      },
    });
    menu.init(document.querySelector(".game-container"));
  }

  addAnimal(resolve) {
    if (!window.Animals?.[this.event.animalId]) {
      utils.warn("Missing animalId in addAnimal event", this.event.animalId);
      new TextMessage({
        text: `Recruit error: animal '${this.event.animalId}' was not found.`,
        onComplete: () => resolve(),
      }).init(document.querySelector(".game-container"));
      return;
    }

    window.playerState.addAnimal(this.event.animalId, this.event.hp);
    resolve();
  }

  addItem(resolve) {
    window.playerState.addItem(this.event.itemId);
    resolve();
  }

  addCoins(resolve) {
    window.playerState.addCoins(this.event.amount);
    resolve();
  }

  addBadge(resolve) {
    window.playerState.addBadge(this.event.badgeId);
    resolve();
  }

  healAnimals(resolve) {
    window.playerState.healAnimals();
    utils.emitEvent("PlayerStateUpdated");
    resolve();
  }

  shop(resolve) {
    const menu = new ShopMenu({
      inventory: this.event.inventory,
      onComplete: () => resolve(),
    });
    menu.init(document.querySelector(".game-container"));
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.game.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.game.startGameLoop();
      },
    });
    menu.init(document.querySelector(".game-container"));
  }
}
