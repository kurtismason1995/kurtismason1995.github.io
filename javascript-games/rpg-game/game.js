import { GameMap } from "./GameMap.js";
import { DirectionInput } from "./DirectionInput.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { Hud } from "./Hud.js";
import { Progress } from "./Progress.js";
import { TitleScreen } from "./TitleScreen.js";
import { SceneTransition } from "./SceneTransition.js";

export class Game {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.fps = 60;
    this.frameInterval = 1000 / this.fps;
    this.time = 0;
  }

  startGameLoop() {
    let lastTime = 0;
    const step = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      // TODO: Maybe stop game loop during battle

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish camera person
      const cameraPerson = this.map.gameObjects.hero;

      // Update objects
      Object.values(this.map.gameObjects).forEach((obj) => {
        obj.update({
          arrow: this.directionInput.direction,
          map: this.map,
          deltaTime,
        });
      });

      // Draw lower map
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw game objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((obj) => {
          obj.sprite.draw(
            this.ctx,
            cameraPerson,
            deltaTime,
            obj.isPlayerControlled,
            this.map.hugMapCorners,
            this.map.lowerImage.naturalWidth,
            this.map.lowerImage.naturalHeight
          );
        });

      // Draw upper map
      this.map.drawUpperImage(this.ctx, cameraPerson);

      if (!this.map.isPaused) {
        requestAnimationFrame((timestamp) => {
          step(timestamp);
        });
      }
    };

    step(0);
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutscene();
    });

    new KeyPressListener("Escape", () => {
      if (!this.map.isCutScenePlaying && !this.map.isPaused) {
        this.map.startCustscene([{ type: "pause" }]);
      }
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        // Hero position change
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig, heroInitialState = null, sceneTransition) {
    this.map = new GameMap(mapConfig, sceneTransition);
    this.map.game = this;
    this.map.mountObjects();

    if (heroInitialState) {
      const { hero } = this.map.gameObjects;
      hero.x = heroInitialState.x;
      hero.y = heroInitialState.y;
      hero.direction = heroInitialState.direction;
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;

    if (heroInitialState) {
      this.map.checkForFootstepCutscene();
    }
  }

  async init() {
    const container = document.querySelector(".game-container");

    // Create progress tracker for load and save
    this.progress = new Progress();

    // Show the title screen
    this.titleScreen = new TitleScreen({
      progress: this.progress,
    });
    const useSaveFile = await this.titleScreen.init(container);

    // Potentially load saved data
    let initialHeroState = null;
    if (useSaveFile) {
      this.progress.load();
      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection,
      };
    }

    // Load the HUD
    this.hud = new Hud();
    this.hud.init(container);

    const sceneTransition = new SceneTransition();
    // Start the first map
    this.startMap(window.GameMaps[this.progress.mapId], initialHeroState, sceneTransition);

    // Create controls
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // Start game loop
    this.startGameLoop();
  }
}

function detectFps() {
  var delta;
}
