import { utils } from "./../../utils.js";

const oldManCutscene = [
  {
    exclude: "SEEN_OLDMAN_CUTSCENE",
    events: [
      { type: "addStoryFlag", flag: "SEEN_OLDMAN_CUTSCENE" },
      { type: "textMessage", text: "Ahh good you are here.", faceHero: "oldMan" },
      { who: "hero", type: "walk", direction: "up" },
      { who: "oldMan", type: "walk", direction: "down" },
      { who: "oldMan", type: "walk", direction: "down" },
      { who: "oldMan", type: "walk", direction: "down" },
      { who: "oldMan", type: "walk", direction: "right" },
      { who: "oldMan", type: "walk", direction: "right" },
      { who: "oldMan", type: "walk", direction: "right" },
      { type: "textMessage", text: "Your dad told me this might happen.", faceHero: "oldMan" },
      {
        type: "textMessage",
        text: "He said if things ever went wrong, you would be brave enough to face them.",
        faceHero: "oldMan",
      },
      { type: "textMessage", text: "Take one of my animals for your journey, I'm getting too old to use them." },
      {
        type: "textMessage",
        text: "Each one has a different style. Pick the one that matches your strategy.",
        faceHero: "oldMan",
      },
      {
        type: "craftingMenu",
        animals: ["Waterhog", "Grassmoo", "Wingcluck", "Grasserpent", "PebbleRam", "Zephyrtail", "Fernhorn"],
      },
      { type: "textMessage", text: "You received a farm animal!" },
      {
        type: "textMessage",
        text: "Remember, swap your lineup often. Different enemies demand different counters.",
        faceHero: "oldMan",
      },
      { who: "oldMan", type: "walk", direction: "left" },
      { who: "oldMan", type: "walk", direction: "left" },
      { who: "oldMan", type: "walk", direction: "left" },
      { who: "oldMan", type: "walk", direction: "up" },
      { who: "oldMan", type: "walk", direction: "up" },
      { who: "oldMan", type: "walk", direction: "up" },
      {
        type: "textMessage",
        text: "Best of luck, the secret society hangs out in the main town hall, follow the road east.",
      },
    ],
  },
];

export const OldManHouse = {
  id: "OldManHouse",
  lowerSrc: "./assets/maps/newmaps/room2_lower.png",
  upperSrc: "./assets/maps/newmaps/room2_upper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(4),
      y: utils.withGrid(8),
    },
    oldMan: {
      type: "Person",
      src: "./assets/characters/people/farmer2.png",
      x: utils.withGrid(1),
      y: utils.withGrid(3),
      behaviorLoop: [
        { type: "stand", direction: "up", time: 2000 },
        { type: "stand", direction: "down", time: 300 },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "down", time: 300 },
        { type: "stand", direction: "right", time: 300 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "right", time: 400 },
        { type: "stand", direction: "up", time: 400 },
        { type: "walk", direction: "up" },
        { type: "stand", direction: "up", time: 2500 },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "down", time: 2000 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
      ],
      talking: [
        {
          required: ["ARENA_INVITATION"],
          events: [
            {
              type: "textMessage",
              text: "So they invited you to the tournament? Keep your strongest animal healthy before every match.",
              faceHero: "oldMan",
            },
          ],
        },
        {
          required: ["SEEN_INTRO"],
          events: [
            {
              type: "textMessage",
              text: "Head East to the main town and figure out where your Dad is.",
              faceHero: "oldMan",
            },
          ],
        },
      ],
    },
  },
  walls: {
    [utils.asGridCoord(1, 2)]: true,
    [utils.asGridCoord(0, 3)]: true,
    [utils.asGridCoord(2, 3)]: true,
    [utils.asGridCoord(5, 3)]: true,
    [utils.asGridCoord(0, 4)]: true,
    [utils.asGridCoord(2, 4)]: true,
    [utils.asGridCoord(3, 4)]: true,
    [utils.asGridCoord(4, 4)]: true,
    [utils.asGridCoord(6, 4)]: true,
    [utils.asGridCoord(0, 5)]: true,
    [utils.asGridCoord(7, 5)]: true,
    [utils.asGridCoord(0, 6)]: true,
    [utils.asGridCoord(8, 6)]: true,
    [utils.asGridCoord(1, 7)]: true,
    [utils.asGridCoord(9, 7)]: true,
    [utils.asGridCoord(9, 8)]: true,
    [utils.asGridCoord(0, 8)]: true,
    [utils.asGridCoord(9, 9)]: true,
    [utils.asGridCoord(1, 9)]: true,
    [utils.asGridCoord(2, 9)]: true,
    [utils.asGridCoord(3, 9)]: true,
    [utils.asGridCoord(6, 9)]: true,
    [utils.asGridCoord(7, 9)]: true,
    [utils.asGridCoord(8, 9)]: true,
  },
  cutsceneSpaces: {
    /* OldManHouse - NPC interactions */
    [utils.asGridCoord(4, 8)]: oldManCutscene,
    /* OldManHouse - NPC interactions end */

    /* OldManHouse - Room map changing */
    [utils.asGridCoord(4, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideBottom",
            x: utils.withGrid(2),
            y: utils.withGrid(20),
            direction: "down",
          },
        ],
      },
    ],
    [utils.asGridCoord(5, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideBottom",
            x: utils.withGrid(2),
            y: utils.withGrid(20),
            direction: "down",
          },
        ],
      },
    ],
    /* OldManHouse - Room map changing end */
  },
};
