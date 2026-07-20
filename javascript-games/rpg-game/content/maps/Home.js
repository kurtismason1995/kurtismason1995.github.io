import { utils } from "./../../utils.js";

export const Home = {
  id: "Home",
  lowerSrc: "./assets/maps/newmaps/start-area-home.png",
  upperSrc: "",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(7),
      y: utils.withGrid(3),
    },
    mum: {
      type: "Person",
      x: utils.withGrid(2),
      y: utils.withGrid(5),
      src: "./assets/characters/people/barmaid.png",
      behaviorLoop: [
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
        { type: "stand", direction: "up", time: 100 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "right", time: 800 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 600 },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 1000 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "up", time: 200 },
        { type: "stand", direction: "left", time: 200 },
        { type: "stand", direction: "up", time: 200 },
        { type: "stand", direction: "right", time: 300 },
        { type: "stand", direction: "down", time: 300 },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "down", time: 300 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 200 },
      ],
      talking: [
        {
          required: ["DEFEATED_BOSS"],
          events: [
            {
              type: "textMessage",
              text: "Mum: You did it, Sam. Your dad is home and this town finally has hope again.",
            },
            {
              type: "textMessage",
              text: "Mum: Keep training your animals, there are still people who need your help.",
            },
          ],
        },
        {
          required: ["ARENA_INVITATION"],
          events: [
            {
              type: "textMessage",
              text: "Mum: An invitation to the Hay Tournament? That sounds like a trap, so be careful.",
            },
            {
              type: "textMessage",
              text: "Mum: Your dad always said courage and kindness make the strongest team.",
            },
          ],
        },
        {
          required: ["SEEN_OLDMAN_CUTSCENE"],
          events: [
            {
              type: "textMessage",
              text: "Mum: Did the old man help you choose another partner? Good, you will need a balanced lineup.",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "The animals are on your side son, talk to them to restore our farm animals.",
            },
          ],
        },
      ],
    },
    chicken1: {
      type: "Chicken",
      x: utils.withGrid(7),
      y: utils.withGrid(4),
      color: "white",
      behaviorLoop: [{ type: "stand", direction: "right", time: 4000 }],
      talking: [
        {
          events: [
            {
              type: "textMessage",
              text: "Cluck cluck!",
            },
            { type: "healAnimals" },
            {
              type: "textMessage",
              text: "Wow talking with the animals has re-invigorated your own.",
            },
          ],
        },
      ],
    },
    cow1: {
      type: "Cow",
      x: utils.withGrid(2),
      y: utils.withGrid(2),
      behaviorLoop: [{ type: "stand", direction: "right", time: 3000 }],
      talking: [
        {
          events: [
            {
              type: "textMessage",
              text: "Moooo!",
            },
            { type: "healAnimals" },
            {
              type: "textMessage",
              text: "Wow talking with the animals has re-invigorated your own.",
            },
          ],
        },
      ],
    },
  },
  walls: {
    [utils.asGridCoord(1, 1)]: true,
    [utils.asGridCoord(2, 1)]: true,
    [utils.asGridCoord(3, 1)]: true,
    [utils.asGridCoord(4, 1)]: true,
    [utils.asGridCoord(5, 1)]: true,
    [utils.asGridCoord(6, 1)]: true,
    [utils.asGridCoord(7, 1)]: true,
    [utils.asGridCoord(0, 2)]: true,
    [utils.asGridCoord(8, 2)]: true,
    [utils.asGridCoord(8, 3)]: true,
    [utils.asGridCoord(0, 3)]: true,
    [utils.asGridCoord(8, 4)]: true,
    [utils.asGridCoord(0, 4)]: true,
    [utils.asGridCoord(8, 5)]: true,
    [utils.asGridCoord(0, 5)]: true,
    [utils.asGridCoord(8, 6)]: true,
    [utils.asGridCoord(0, 6)]: true,
    [utils.asGridCoord(8, 7)]: true,
    [utils.asGridCoord(1, 7)]: true,
    [utils.asGridCoord(2, 7)]: true,
    [utils.asGridCoord(3, 7)]: true,
    [utils.asGridCoord(5, 7)]: true,
    [utils.asGridCoord(6, 7)]: true,
    [utils.asGridCoord(7, 7)]: true,
    [utils.asGridCoord(7, 4)]: true,
  },
  cutsceneSpaces: {
    /* Home - NPC interactions */
    [utils.asGridCoord(6, 3)]: [
      {
        exclude: "SEEN_INTRO",
        events: [
          { type: "addStoryFlag", flag: "SEEN_INTRO" },
          { type: "stand", who: "mum", direction: "right", time: 200 },
          { type: "stand", who: "hero", direction: "left", time: 200 },
          { type: "textMessage", text: "Me: Good morning, Mum. What's going on?", faceHero: "mum" },
          {
            type: "textMessage",
            text: "Mum: Son!!! Your dad is missing. He never came back from his trip to the city.",
          },
          { type: "textMessage", text: "Me: What? When did this happen?" },
          {
            type: "textMessage",
            text: "Mum: Three days ago. I've tried everything to find him, but I'm afraid I've hit a dead end.",
          },
          { type: "textMessage", text: "Me: Don't worry, Mum. I'll find him. I won't rest until I do." },
          { type: "walk", who: "hero", direction: "left" },
          { type: "walk", who: "hero", direction: "down" },
          { type: "walk", who: "hero", direction: "down" },
          { type: "walk", who: "hero", direction: "down" },
          { type: "walk", who: "hero", direction: "left" },
          { type: "stand", who: "hero", direction: "up", time: 200 },
          {
            type: "textMessage",
            text: "Mum: (Crying...) You're all I have left in this world.",
            faceHero: "mum",
          },
          { type: "stand", who: "hero", direction: "down", time: 1000 },
          { type: "stand", who: "hero", direction: "up", time: 10 },
          {
            type: "textMessage",
            text: "Mum: Oh and son, take Rocky with you! The animals around town will help him.",
          },
          { type: "addAnimal", animalId: "Rocky", hp: 100 },
          { type: "stand", who: "hero", direction: "down", time: 500 },
        ],
      },
    ],
    /* Home - NPC interactions end */

    /* Home - Map changing */
    [utils.asGridCoord(4, 7)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideLeft",
            x: utils.withGrid(16),
            y: utils.withGrid(18),
            direction: "down",
          },
        ],
      },
    ],
    /* Home - Map changing end */
  },
};
