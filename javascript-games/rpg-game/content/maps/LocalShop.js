import { utils } from "./../../utils.js";

export const LocalShop = {
  id: "LocalShop",
  lowerSrc: "./assets/maps/newmaps/shop2_lower.png",
  upperSrc: "./assets/maps/newmaps/shop2_upper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(3),
      y: utils.withGrid(9),
    },
    npc1: {
      type: "Person",
      x: utils.withGrid(11),
      y: utils.withGrid(5),
      src: "./assets/characters/people/merchant1.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      talking: [
        {
          required: ["DEFEATED_BOSS"],
          events: [
            {
              type: "textMessage",
              text: "Champion Sam! Today all supplies are top quality. Your animals earned it.",
            },
            {
              type: "shop",
              inventory: [
                { itemId: "item_hayBale", price: 20 },
                { itemId: "item_flySpray", price: 30 },
                { itemId: "item_dustBath", price: 35 },
              ],
            },
          ],
        },
        {
          required: ["ARENA_INVITATION"],
          events: [
            {
              type: "textMessage",
              text: "Heading into the tournament? Stock up now, those rounds get brutal.",
            },
            {
              type: "shop",
              inventory: [
                { itemId: "item_hayBale", price: 20 },
                { itemId: "item_flySpray", price: 30 },
                { itemId: "item_dustBath", price: 35 },
              ],
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "Welcome to the farm supply shop. Spend your battle coins wisely.",
            },
            {
              type: "shop",
              inventory: [
                { itemId: "item_hayBale", price: 20 },
                { itemId: "item_flySpray", price: 30 },
                { itemId: "item_dustBath", price: 35 },
              ],
            },
          ],
        },
      ],
    },
  },
  walls: {
    [utils.asGridCoord(2, 5)]: true,
    [utils.asGridCoord(3, 5)]: true,
    [utils.asGridCoord(4, 5)]: true,
    [utils.asGridCoord(5, 5)]: true,
    [utils.asGridCoord(6, 5)]: true,
    [utils.asGridCoord(7, 5)]: true,
    [utils.asGridCoord(8, 5)]: true,
    [utils.asGridCoord(9, 5)]: true,
    [utils.asGridCoord(10, 5)]: true,
    [utils.asGridCoord(11, 5)]: true,
    [utils.asGridCoord(12, 5)]: true,
    [utils.asGridCoord(13, 5)]: true,
    [utils.asGridCoord(14, 6)]: true,
    [utils.asGridCoord(14, 7)]: true,
    [utils.asGridCoord(13, 8)]: true,
    [utils.asGridCoord(13, 10)]: true,
    [utils.asGridCoord(1, 6)]: true,
    [utils.asGridCoord(1, 7)]: true,
    [utils.asGridCoord(1, 8)]: true,
    [utils.asGridCoord(1, 9)]: true,
    [utils.asGridCoord(1, 10)]: true,
    [utils.asGridCoord(13, 9)]: true,
    [utils.asGridCoord(2, 11)]: true,
    [utils.asGridCoord(3, 11)]: true,
    [utils.asGridCoord(6, 11)]: true,
    [utils.asGridCoord(7, 11)]: true,
    [utils.asGridCoord(8, 11)]: true,
    [utils.asGridCoord(9, 11)]: true,
    [utils.asGridCoord(10, 11)]: true,
    [utils.asGridCoord(11, 11)]: true,
    [utils.asGridCoord(12, 11)]: true,
  },
  cutsceneSpaces: {
    [utils.asGridCoord(4, 11)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideLeft",
            x: utils.withGrid(19),
            y: utils.withGrid(2),
            direction: "down",
          },
        ],
      },
    ],
    [utils.asGridCoord(5, 11)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideLeft",
            x: utils.withGrid(19),
            y: utils.withGrid(2),
            direction: "down",
          },
        ],
      },
    ],
  },
};
