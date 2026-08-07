import { utils } from "./../../utils.js";

function createBoundaryWalls(width, height, openingCoords = []) {
  const walls = {};
  const openings = new Set(openingCoords.map(([x, y]) => `${x},${y}`));

  for (let x = 0; x < width; x++) {
    if (!openings.has(`${x},0`)) {
      walls[utils.asGridCoord(x, 0)] = true;
    }
    if (!openings.has(`${x},${height - 1}`)) {
      walls[utils.asGridCoord(x, height - 1)] = true;
    }
  }

  for (let y = 0; y < height; y++) {
    if (!openings.has(`0,${y}`)) {
      walls[utils.asGridCoord(0, y)] = true;
    }
    if (!openings.has(`${width - 1},${y}`)) {
      walls[utils.asGridCoord(width - 1, y)] = true;
    }
  }

  return walls;
}

export const BramblePath = {
  id: "BramblePath",
  hugMapCorners: true,
  lowerSrc: "./assets/maps/newmaps/start-area-outside-lowerImage.png",
  upperSrc: "./assets/maps/newmaps/start-area-outside-upperImage.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(1),
      y: utils.withGrid(7),
    },
    cow1: {
      type: "Cow",
      x: utils.withGrid(11),
      y: utils.withGrid(6),
      talking: [
        {
          events: [
            { type: "textMessage", text: "Moooo!" },
            { type: "healAnimals" },
            { type: "textMessage", text: "Your animals feel refreshed after resting here." },
          ],
        },
      ],
    },
    npcScout: {
      type: "Person",
      x: utils.withGrid(17),
      y: utils.withGrid(8),
      src: "./assets/characters/people/kid2.png",
      behaviorLoop: [{ type: "stand", direction: "left", time: 900 }],
      talking: [
        {
          required: ["DEFEATED_SCOUT_BRAMBLE"],
          events: [{ type: "textMessage", text: "Path is clear. You can push east to the crossing now." }],
        },
        {
          events: [
            { type: "textMessage", text: "The brambles are thick ahead. Prove you can handle it." },
            { type: "battle", enemyId: "Bob" },
            { type: "addStoryFlag", flag: "DEFEATED_SCOUT_BRAMBLE" },
            { type: "addCoins", amount: 20 },
            { type: "textMessage", text: "Nice work. Follow the hedge road east." },
          ],
        },
      ],
    },
    npcForager: {
      type: "Person",
      x: utils.withGrid(23),
      y: utils.withGrid(5),
      src: "./assets/characters/people/barmaid2.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 1200 }],
      talking: [
        {
          required: ["SPOKE_FORAGER_BRAMBLE"],
          events: [{ type: "textMessage", text: "The crossing has good forage spots near the water." }],
        },
        {
          events: [
            { type: "addStoryFlag", flag: "SPOKE_FORAGER_BRAMBLE" },
            { type: "textMessage", text: "You look prepared. Take this hay bale before the next stretch." },
            { type: "addItem", itemId: "item_hayBale" },
          ],
        },
      ],
    },
    chest1: {
      type: "Chest",
      x: utils.withGrid(25),
      y: utils.withGrid(10),
      storyFlag: "CHEST_BRAMBLE_PATH_1",
      item: "item_flySpray",
    },
  },
  walls: {
    ...createBoundaryWalls(30, 16, [
      [0, 7],
      [0, 8],
      [29, 7],
      [29, 8],
    ]),
    [utils.asGridCoord(8, 4)]: true,
    [utils.asGridCoord(9, 4)]: true,
    [utils.asGridCoord(10, 4)]: true,
    [utils.asGridCoord(11, 4)]: true,
    [utils.asGridCoord(14, 9)]: true,
    [utils.asGridCoord(15, 9)]: true,
    [utils.asGridCoord(16, 9)]: true,
    [utils.asGridCoord(20, 11)]: true,
    [utils.asGridCoord(21, 11)]: true,
    [utils.asGridCoord(22, 11)]: true,
  },
  cutsceneSpaces: {
    [utils.asGridCoord(0, 7)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideBottom",
            x: utils.withGrid(27),
            y: utils.withGrid(7),
            direction: "left",
          },
        ],
      },
    ],
    [utils.asGridCoord(0, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideBottom",
            x: utils.withGrid(27),
            y: utils.withGrid(8),
            direction: "left",
          },
        ],
      },
    ],
    [utils.asGridCoord(29, 7)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "MillbrookCrossing",
            x: utils.withGrid(1),
            y: utils.withGrid(8),
            direction: "right",
          },
        ],
      },
    ],
    [utils.asGridCoord(29, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "MillbrookCrossing",
            x: utils.withGrid(1),
            y: utils.withGrid(9),
            direction: "right",
          },
        ],
      },
    ],
  },
};
