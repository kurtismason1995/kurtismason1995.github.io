import { TextMessage } from "./TextMessage.js";
import { utils } from "./utils.js";
import { SceneTransition } from "./SceneTransition.js";
import { Battle } from "./Battle/Battle.js";
import { PauseMenu } from "./PauseMenu.js";
import { CraftingMenu } from "./CraftingMenu.js";
import { ShopMenu } from "./ShopMenu.js";

export class GameEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
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
      text: this.event.text,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector(".game-container"));
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
    const battle = new Battle({
      enemy: window.Enemies[this.event.enemyId],
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
