import { utils } from "../../utils.js";

export const SmallShop = {
  id: "SmallShop",
  lowerSrc: "./assets/maps/newmaps/shop1_lower.png",
  upperSrc: "./assets/maps/newmaps/shop1_upper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(5),
      y: utils.withGrid(7),
    },
    npc1: {
      type: "Person",
      x: utils.withGrid(5),
      y: utils.withGrid(4),
      src: "./assets/characters/people/kid.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      talking: [
        {
          events: [
            {
              type: "textMessage",
              text: "Welcome, what are you after?",
            },
            {
              type: "textMessage",
              text: "I can give every animal in your pack a full health check while you are here.",
              faceHero: "npc1",
            },
            { type: "healAnimals" },
            {
              type: "textMessage",
              text: "All done. Your whole pack is fully healed and ready for another adventure.",
              faceHero: "npc1",
            },
          ],
        },
      ],
    },
    npc2: {
      type: "Person",
      x: utils.withGrid(3),
      y: utils.withGrid(2),
      src: "./assets/characters/people/merchant1.png",
      behaviorLoop: [
        { type: "stand", direction: "up", time: 1000 },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "left", time: 1000 },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 1000 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "up", time: 1000 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "up" },
        { type: "stand", direction: "up", time: 1000 },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "up" },
        { type: "stand", direction: "up", time: 1000 },
        { type: "stand", direction: "left", time: 1000 },
        { type: "stand", direction: "right", time: 1000 },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "up" },
      ],
    },
  },
  walls: {
    [utils.asGridCoord(2, 4)]: true,
    [utils.asGridCoord(3, 4)]: true,
    [utils.asGridCoord(4, 4)]: true,
    [utils.asGridCoord(5, 4)]: true,
    [utils.asGridCoord(6, 4)]: true,
    [utils.asGridCoord(7, 4)]: true,
    [utils.asGridCoord(8, 4)]: true,
    [utils.asGridCoord(1, 5)]: true,
    [utils.asGridCoord(9, 5)]: true,
    [utils.asGridCoord(9, 6)]: true,
    [utils.asGridCoord(1, 6)]: true,
    [utils.asGridCoord(9, 7)]: true,
    [utils.asGridCoord(1, 7)]: true,
    [utils.asGridCoord(9, 8)]: true,
    [utils.asGridCoord(2, 8)]: true,
    [utils.asGridCoord(3, 8)]: true,
    [utils.asGridCoord(4, 8)]: true,
    [utils.asGridCoord(6, 8)]: true,
    [utils.asGridCoord(7, 8)]: true,
    [utils.asGridCoord(8, 8)]: true,
  },
  cutsceneSpaces: {
    /* SmallShop - NPC interactions */
    /* SmallShop - NPC interactions end */
    /* SmallShop - Room map changing */
    [utils.asGridCoord(5, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideRight",
            x: utils.withGrid(7),
            y: utils.withGrid(23),
            direction: "down",
          },
        ],
      },
    ],
    /* SmallShop - Room map changing end */
  },
};
