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

export const MillbrookCrossing = {
  id: "MillbrookCrossing",
  hugMapCorners: true,
  lowerSrc: "./assets/maps/newmaps/right-area_lower.png",
  upperSrc: "./assets/maps/newmaps/right-area_upper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(1),
      y: utils.withGrid(8),
    },
    chicken1: {
      type: "Chicken",
      x: utils.withGrid(7),
      y: utils.withGrid(5),
      color: "white",
      behaviorLoop: [{ type: "stand", direction: "right", time: 1200 }],
      talking: [
        {
          events: [
            { type: "textMessage", text: "Cluck cluck!" },
            { type: "healAnimals" },
            { type: "textMessage", text: "Your team catches a quick rest by the crossing." },
          ],
        },
      ],
    },
    npcBridgekeeper: {
      type: "Person",
      x: utils.withGrid(15),
      y: utils.withGrid(7),
      src: "./assets/characters/people/merchant1.png",
      behaviorLoop: [{ type: "stand", direction: "left", time: 1000 }],
      talking: [
        {
          required: ["CH2_MILL_RESTORED"],
          events: [
            {
              type: "textMessage",
              text: "Bridge flow is stable now. You can move goods between districts again.",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "I repaired this crossing after the storms. Keep the road safe for us.",
            },
            { type: "addStoryFlag", flag: "CH2_MILL_RESTORED" },
            { type: "addCoins", amount: 35 },
            { type: "textMessage", text: "Here, take coin from the trade fund for your effort." },
          ],
        },
      ],
    },
    npcRanger: {
      type: "Person",
      x: utils.withGrid(21),
      y: utils.withGrid(10),
      src: "./assets/characters/people/kid4.png",
      behaviorLoop: [{ type: "stand", direction: "up", time: 900 }],
      talking: [
        {
          required: ["DEFEATED_RANGER_MILLBROOK"],
          events: [{ type: "textMessage", text: "Great pace. You handle this terrain well." }],
        },
        {
          events: [
            { type: "textMessage", text: "No one passes this crossing without proving their skill." },
            { type: "battle", enemyId: "Penny" },
            { type: "addStoryFlag", flag: "DEFEATED_RANGER_MILLBROOK" },
          ],
        },
      ],
    },
    chest1: {
      type: "Chest",
      x: utils.withGrid(24),
      y: utils.withGrid(4),
      storyFlag: "CHEST_MILLBROOK_1",
      item: "item_hayBale",
    },
  },
  walls: {
    ...createBoundaryWalls(30, 16, [
      [0, 8],
      [0, 9],
      [29, 8],
      [29, 9],
    ]),
    [utils.asGridCoord(5, 3)]: true,
    [utils.asGridCoord(6, 3)]: true,
    [utils.asGridCoord(7, 3)]: true,
    [utils.asGridCoord(8, 3)]: true,
    [utils.asGridCoord(13, 11)]: true,
    [utils.asGridCoord(14, 11)]: true,
    [utils.asGridCoord(15, 11)]: true,
    [utils.asGridCoord(16, 11)]: true,
    [utils.asGridCoord(20, 6)]: true,
    [utils.asGridCoord(21, 6)]: true,
    [utils.asGridCoord(22, 6)]: true,
  },
  cutsceneSpaces: {
    [utils.asGridCoord(0, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "BramblePath",
            x: utils.withGrid(28),
            y: utils.withGrid(7),
            direction: "left",
          },
        ],
      },
    ],
    [utils.asGridCoord(0, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "BramblePath",
            x: utils.withGrid(28),
            y: utils.withGrid(8),
            direction: "left",
          },
        ],
      },
    ],
    [utils.asGridCoord(29, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "EmberlightTunnels",
            x: utils.withGrid(1),
            y: utils.withGrid(8),
            direction: "right",
          },
        ],
      },
    ],
    [utils.asGridCoord(28, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "EmberlightTunnels",
            x: utils.withGrid(1),
            y: utils.withGrid(8),
            direction: "right",
          },
        ],
      },
    ],
    [utils.asGridCoord(29, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "EmberlightTunnels",
            x: utils.withGrid(1),
            y: utils.withGrid(9),
            direction: "right",
          },
        ],
      },
    ],
    [utils.asGridCoord(28, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "EmberlightTunnels",
            x: utils.withGrid(1),
            y: utils.withGrid(9),
            direction: "right",
          },
        ],
      },
    ],
  },
};
