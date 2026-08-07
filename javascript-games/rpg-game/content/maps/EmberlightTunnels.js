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

const tunnelGate = (requiredFlag, message) => [
  {
    required: [requiredFlag],
    events: [],
  },
  {
    events: [
      { type: "textMessage", text: message },
      { who: "hero", type: "walk", direction: "left" },
    ],
  },
];

export const EmberlightTunnels = {
  id: "EmberlightTunnels",
  hugMapCorners: true,
  lowerSrc: "./assets/maps/newmaps/room6_lower.png",
  upperSrc: "./assets/maps/newmaps/room6_upper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(1),
      y: utils.withGrid(8),
    },
    fire1: {
      type: "Fire",
      x: utils.withGrid(6),
      y: utils.withGrid(6) - 8,
    },
    fire2: {
      type: "Fire",
      x: utils.withGrid(14),
      y: utils.withGrid(10) - 8,
    },
    npcScout1: {
      type: "Person",
      x: utils.withGrid(5),
      y: utils.withGrid(6),
      src: "./assets/characters/people/kid.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 800 }],
      talking: [
        {
          required: ["DEFEATED_TUNNEL_SCOUT_1"],
          events: [{ type: "textMessage", text: "You can pass the first barricade." }],
        },
        {
          events: [
            { type: "textMessage", text: "Nobody enters deeper tunnels without proving their skill." },
            { type: "battle", enemyId: "Bret" },
            { type: "addStoryFlag", flag: "DEFEATED_TUNNEL_SCOUT_1" },
          ],
        },
      ],
    },
    npcScout2: {
      type: "Person",
      x: utils.withGrid(10),
      y: utils.withGrid(10),
      src: "./assets/characters/people/kid2.png",
      behaviorLoop: [{ type: "stand", direction: "up", time: 800 }],
      talking: [
        {
          required: ["DEFEATED_TUNNEL_SCOUT_2"],
          events: [{ type: "textMessage", text: "Second gate is open. Keep moving." }],
        },
        {
          events: [
            { type: "textMessage", text: "The heat breaks weak teams. Let's see yours." },
            { type: "battle", enemyId: "John" },
            { type: "addStoryFlag", flag: "DEFEATED_TUNNEL_SCOUT_2" },
          ],
        },
      ],
    },
    npcScout3: {
      type: "Person",
      x: utils.withGrid(15),
      y: utils.withGrid(6),
      src: "./assets/characters/people/kid3.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 800 }],
      talking: [
        {
          required: ["DEFEATED_TUNNEL_SCOUT_3"],
          events: [{ type: "textMessage", text: "Only the miniboss remains ahead." }],
        },
        {
          events: [
            { type: "textMessage", text: "Last checkpoint. Survive this and face our captain." },
            { type: "battle", enemyId: "Max" },
            { type: "addStoryFlag", flag: "DEFEATED_TUNNEL_SCOUT_3" },
            { type: "addCoins", amount: 25 },
          ],
        },
      ],
    },
    miniBoss: {
      type: "Person",
      x: utils.withGrid(20),
      y: utils.withGrid(8),
      src: "./assets/characters/people/blacksmith2.png",
      behaviorLoop: [{ type: "stand", direction: "left", time: 900 }],
      talking: [
        {
          required: ["CH2_TUNNELS_CLEARED"],
          events: [
            {
              type: "textMessage",
              text: "You beat me fair. The tunnels are yours to pass.",
            },
          ],
        },
        {
          required: ["DEFEATED_TUNNEL_SCOUT_1", "DEFEATED_TUNNEL_SCOUT_2", "DEFEATED_TUNNEL_SCOUT_3"],
          events: [
            {
              type: "textMessage",
              text: "I am the Emberlight captain. If you win, this route opens for your allies.",
            },
            { type: "battle", enemyId: "enemy2", arena: "room3_battle" },
            { type: "addStoryFlag", flag: "CH2_TUNNELS_CLEARED" },
            { type: "addStoryFlag", flag: "CH2_DUNGEON_MINIBOSS_DEFEATED" },
            { type: "addCoins", amount: 80 },
            { type: "addItem", itemId: "item_dustBath" },
            {
              type: "textMessage",
              text: "Dungeon cleared. You earned a dust bath and secured the tunnel route.",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "Clear the three scouts first. We do not hand this route to strangers.",
            },
          ],
        },
      ],
    },
    chest1: {
      type: "Chest",
      x: utils.withGrid(22),
      y: utils.withGrid(10),
      storyFlag: "CHEST_EMBERLIGHT_1",
      item: "item_hayBale",
    },
  },
  walls: {
    ...createBoundaryWalls(24, 16, [
      [0, 8],
      [0, 9],
    ]),
    [utils.asGridCoord(3, 5)]: true,
    [utils.asGridCoord(4, 5)]: true,
    [utils.asGridCoord(5, 5)]: true,
    [utils.asGridCoord(6, 5)]: true,
    [utils.asGridCoord(7, 5)]: true,
    [utils.asGridCoord(8, 5)]: true,
    [utils.asGridCoord(9, 5)]: true,
    [utils.asGridCoord(11, 5)]: true,
    [utils.asGridCoord(12, 5)]: true,
    [utils.asGridCoord(13, 5)]: true,
    [utils.asGridCoord(17, 5)]: true,
    [utils.asGridCoord(18, 5)]: true,
    [utils.asGridCoord(3, 11)]: true,
    [utils.asGridCoord(4, 11)]: true,
    [utils.asGridCoord(8, 11)]: true,
    [utils.asGridCoord(9, 11)]: true,
    [utils.asGridCoord(12, 11)]: true,
    [utils.asGridCoord(13, 11)]: true,
    [utils.asGridCoord(14, 11)]: true,
    [utils.asGridCoord(18, 11)]: true,
    [utils.asGridCoord(19, 11)]: true,
  },
  cutsceneSpaces: {
    [utils.asGridCoord(0, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "MillbrookCrossing",
            x: utils.withGrid(28),
            y: utils.withGrid(8),
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
            map: "MillbrookCrossing",
            x: utils.withGrid(28),
            y: utils.withGrid(9),
            direction: "left",
          },
        ],
      },
    ],
    [utils.asGridCoord(7, 8)]: tunnelGate(
      "DEFEATED_TUNNEL_SCOUT_1",
      "A reinforced gate blocks the route. Defeat the first scout to proceed."
    ),
    [utils.asGridCoord(7, 9)]: tunnelGate(
      "DEFEATED_TUNNEL_SCOUT_1",
      "A reinforced gate blocks the route. Defeat the first scout to proceed."
    ),
    [utils.asGridCoord(13, 8)]: tunnelGate(
      "DEFEATED_TUNNEL_SCOUT_2",
      "The second barricade remains locked. Beat the ranger guarding this zone."
    ),
    [utils.asGridCoord(13, 9)]: tunnelGate(
      "DEFEATED_TUNNEL_SCOUT_2",
      "The second barricade remains locked. Beat the ranger guarding this zone."
    ),
    [utils.asGridCoord(18, 8)]: tunnelGate(
      "DEFEATED_TUNNEL_SCOUT_3",
      "Final gate sealed. Defeat the last checkpoint trainer first."
    ),
    [utils.asGridCoord(18, 9)]: tunnelGate(
      "DEFEATED_TUNNEL_SCOUT_3",
      "Final gate sealed. Defeat the last checkpoint trainer first."
    ),
  },
};
