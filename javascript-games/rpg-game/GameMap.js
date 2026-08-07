import { GameEvent } from "./GameEvent.js";
import { Person } from "./GameObjects/Person.js";
import { Fire } from "./GameObjects/Fire.js";
import { Cow } from "./GameObjects/Cow.js";
import { utils } from "./utils.js";
import { Chest } from "./GameObjects/Chest.js";
import { Chicken } from "./GameObjects/Chicken.js";

export class GameMap {
  constructor(config, sceneTransition) {
    this.game = null;
    this.gameObjects = {}; // Live objects are in here
    this.configObjects = config.configObjects;

    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.lowerImage.onload = () => {
      sceneTransition.fadeOut();
    };

    this.hugMapCorners = config.hugMapCorners || false;
    this.isCutscenePlaying = false;
    this.isCutScenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    const imageWidth = this.lowerImage.naturalWidth;
    const imageHeight = this.upperImage.naturalHeight;
    let x = utils.withGrid(10.5) - cameraPerson.x;
    let y = utils.withGrid(6) - cameraPerson.y;

    /** Code to hug map to edges when player is on edge of map */

    if (this.hugMapCorners) {
      // Left
      if (cameraPerson.x < utils.withGrid(10.5)) {
        x = 0;
      }

      // Right
      if (cameraPerson.x > imageWidth - utils.withGrid(11.5)) {
        x = -imageWidth + utils.withGrid(22);
      }

      // Top
      if (cameraPerson.y < utils.withGrid(6)) {
        y = 0;
      }

      // Bottom
      if (cameraPerson.y > imageHeight - utils.withGrid(7)) {
        y = -imageHeight + utils.withGrid(13);
      }
    }
    /** End Code to hug map to edges when player is on edge of map */

    ctx.drawImage(this.lowerImage, x, y);
  }

  drawUpperImage(ctx, cameraPerson) {
    const imageWidth = this.upperImage.naturalWidth;
    const imageHeight = this.upperImage.naturalHeight;
    let x = utils.withGrid(10.5) - cameraPerson.x;
    let y = utils.withGrid(6) - cameraPerson.y;

    /** Code to hug map to edges when player is on edge of map */
    if (this.hugMapCorners) {
      // Left
      if (cameraPerson.x < utils.withGrid(10.5)) {
        x = 0;
      }

      // Right
      if (cameraPerson.x > imageWidth - utils.withGrid(11.5)) {
        x = -imageWidth + utils.withGrid(22);
      }

      // Top
      if (cameraPerson.y < utils.withGrid(6)) {
        y = 0;
      }

      // Bottom
      if (cameraPerson.y > imageHeight - utils.withGrid(7)) {
        y = -imageHeight + utils.withGrid(13);
      }
    }
    /** End Code to hug map to edges when player is on edge of map */

    ctx.drawImage(this.upperImage, x, y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);

    // Check for wall collisions
    if (this.walls[`${x},${y}`]) {
      return true;
    }

    // Check for game objects at this position
    return Object.values(this.gameObjects).find((obj) => {
      if (obj.x === x && obj.y === y) {
        return true;
      }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) {
        return true;
      }
      return false;
    });
  }

  mountObjects() {
    Object.keys(this.configObjects).forEach((key) => {
      let configObj = this.configObjects[key];
      configObj.id = key;

      let instance;
      if (configObj.type === "Person") {
        instance = new Person(configObj);
      }
      if (configObj.type === "Chest") {
        instance = new Chest({
          ...configObj,
          src: "./assets/characters/chest.png",
        });
      }
      if (configObj.type === "Fire") {
        instance = new Fire({
          ...configObj,
          src: "./assets/characters/fire.png",
        });
      }
      if (configObj.type === "Cow") {
        instance = new Cow({
          ...configObj,
          src: "./assets/characters/animals/cow.png",
        });
      }
      if (configObj.type === "Chicken") {
        instance = new Chicken({
          ...configObj,
          src: `./assets/characters/animals/chicken_${configObj.color || "white"}.png`,
        });
      }
      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;

      instance.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;
    this.isCutScenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new GameEvent({
        event: events[i],
        map: this,
      });
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }

    this.isCutscenePlaying = false;
    this.isCutScenePlaying = false;
  }

  // Legacy typo kept for backwards compatibility with existing callers.
  async startCustscene(events) {
    await this.startCutscene(events);
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((gameObject) => {
      return `${gameObject.x},${gameObject.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((sf) => {
          return window.playerState.storyFlags[sf];
        });
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects.hero;
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      const relevantScenario = match.find((scenario) => {
        const requiredFlags = (scenario.required || []).every((sf) => {
          return window.playerState.storyFlags[sf];
        });

        return requiredFlags && (!scenario.exclude || !window.playerState.storyFlags[scenario.exclude]);
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }
}
