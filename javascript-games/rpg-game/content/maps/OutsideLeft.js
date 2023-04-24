import { utils } from "../../utils.js";

/**  */
const changeMapToOutsideRightUpperTile = [
  {
    events: [
      {
        type: "changeMap",
        map: "OutsideRight",
        x: utils.withGrid(1),
        y: utils.withGrid(9),
        direction: "right",
      },
    ],
  },
];

const changeMapToOutsideRightLowerTile = [
  {
    events: [
      {
        type: "changeMap",
        map: "OutsideRight",
        x: utils.withGrid(1),
        y: utils.withGrid(10),
        direction: "right",
      },
    ],
  },
];

const changeMapToOutsideBottomLeftTile = [
  {
    events: [
      {
        type: "changeMap",
        map: "OutsideBottom",
        x: utils.withGrid(7),
        y: utils.withGrid(1),
        direction: "down",
      },
    ],
  },
];
const changeMapToOutsideBottomRightTile = [
  {
    events: [
      {
        type: "changeMap",
        map: "OutsideBottom",
        x: utils.withGrid(8),
        y: utils.withGrid(1),
        direction: "down",
      },
    ],
  },
];

export const OutsideLeft = {
  id: "OutsideLeft",
  hugMapCorners: true,
  lowerSrc: "./assets/maps/newmaps/start-area-outside-lowerImage.png",
  upperSrc: "./assets/maps/newmaps/start-area-outside-upperImage.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(17),
      y: utils.withGrid(20),
    },
    chest1: {
      type: "Chest",
      x: utils.withGrid(21),
      y: utils.withGrid(16),
      storyFlag: "CHEST1_OUTSIDELEFT",
      item: "item_hayBale",
    },
    chest2: {
      type: "Chest",
      x: utils.withGrid(13),
      y: utils.withGrid(3),
      storyFlag: "CHEST2_OUTSIDELEFT",
      direction: "right",
      item: "item_flySpray",
    },
    fire1: {
      type: "Fire",
      x: utils.withGrid(19) - 2,
      y: utils.withGrid(13) - 8,
    },
    cow1: {
      type: "Cow",
      x: utils.withGrid(21),
      y: utils.withGrid(14),
      behaviorLoop: [
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "right", time: 4000 },
        { type: "stand", direction: "left", time: 3000 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 3000 },
        { type: "stand", direction: "right", time: 4000 },
      ],
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
    chicken1: {
      type: "Chicken",
      x: utils.withGrid(40),
      y: utils.withGrid(14),
      color: "black",
      behaviorLoop: [
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "right", time: 4000 },
        { type: "stand", direction: "left", time: 3000 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 3000 },
        { type: "stand", direction: "right", time: 4000 },
      ],
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
    npc1: {
      type: "Person",
      x: utils.withGrid(20),
      y: utils.withGrid(19),
      src: "./assets/characters/people/alchemist.png",
      behaviorLoop: [
        { type: "stand", direction: "down", time: 3000 },
        { type: "stand", direction: "right", time: 3000 },
      ],
      talking: [
        {
          required: ["TALKED_TO_npc1_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "Sandra: If you need any help, just let us know. We're all behind you.",
              faceHero: "npc1",
            },
            {
              type: "textMessage",
              text: "Sandra: Be careful, that secret society is strong. You will want to train your farm animals up.",
            },
          ],
        },
        {
          events: [
            { type: "addStoryFlag", flag: "TALKED_TO_npc1_OUTSIDELEFT" },
            {
              type: "textMessage",
              text: "Sandra: Hey Sam, I heard about your father.",
              faceHero: "npc1",
            },
            {
              type: "textMessage",
              text: "Sandra: Some folks say those people who took your father are part of a secret society.",
            },
            {
              type: "textMessage",
              text: "Sandra: They say they have some kind of grand plan. Ask around, someone must know his whereabouts",
            },
          ],
        },
      ],
    },
    npc2: {
      type: "Person",
      x: utils.withGrid(20),
      y: utils.withGrid(9),
      src: "./assets/characters/people/kid.png",
      behaviorLoop: [
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "down", time: 200 },
        { type: "stand", direction: "right", time: 300 },
        { type: "stand", direction: "down", time: 700 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "down", time: 500 },
        { type: "stand", direction: "right", time: 200 },
        { type: "stand", direction: "down", time: 700 },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 600 },
        { type: "stand", direction: "down", time: 200 },
        { type: "stand", direction: "right", time: 200 },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "down", time: 700 },
        { type: "walk", direction: "up" },
        { type: "stand", direction: "up", time: 900 },
        { type: "stand", direction: "left", time: 200 },
        { type: "stand", direction: "right", time: 400 },
      ],
      talking: [
        {
          required: ["DEFEATED_npc2_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "Out the way, I need to train up!",
              faceHero: "npc2",
            },
            {
              type: "textMessage",
              text: "I will be as strong as you one day!",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "Hey! My favourite farm animals are definitely cows! They're so cute and cuddly.",
              faceHero: "npc2",
            },
            { type: "battle", enemyId: "Fred" },
            { type: "addStoryFlag", flag: "DEFEATED_npc2_OUTSIDELEFT" },
            {
              type: "textMessage",
              text: "Wow, you are so strong!.",
            },
          ],
        },
      ],
    },
    npc3: {
      type: "Person",
      x: utils.withGrid(20),
      y: utils.withGrid(12),
      src: "./assets/characters/people/blacksmith.png",
      behaviorLoop: [{ type: "stand", direction: "left", time: 1000 }],
      talking: [
        {
          required: ["TALKED_TO_npc3_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "Go speak with John. He lives in the mansion by the water. He should be able to give you what you need.",
              faceHero: "npc3",
            },
          ],
        },
        {
          events: [
            { type: "addStoryFlag", flag: "TALKED_TO_npc3_OUTSIDELEFT" },
            {
              type: "textMessage",
              text: "I heard what happened to your father. It's a shame that such a talented man was taken like that.",
              faceHero: "npc3",
            },
            {
              type: "textMessage",
              text: "Me: Do you know anyone who's familiar with this group that took my father?",
            },
            {
              type: "textMessage",
              text: "Me: I need to find out more about them.",
            },
            {
              type: "textMessage",
              text: "John will be able to help you, he lives in the mansion by the water.",
            },
            {
              type: "textMessage",
              text: "Goodluck",
            },
          ],
        },
      ],
    },
    npc4: {
      type: "Person",
      x: utils.withGrid(21),
      y: utils.withGrid(3),
      src: "./assets/characters/people/kid2.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      talking: [
        {
          required: ["TALKED_TO_npc4_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "Your father is a talented man. We all want to see him safe and sound",
              faceHero: "npc4",
            },
          ],
        },
        {
          events: [
            { type: "addStoryFlag", flag: "TALKED_TO_npc4_OUTSIDELEFT" },
            {
              type: "textMessage",
              text: "Bring it on!",
              faceHero: "npc4",
            },
            { type: "battle", enemyId: "Bob" },
            { type: "addStoryFlag", flag: "DEFEATED_npc4_OUTSIDELEFT" },
            {
              type: "textMessage",
              text: "Wow, you are so strong!",
            },
          ],
        },
      ],
    },
    npc5: {
      type: "Person",
      x: utils.withGrid(38),
      y: utils.withGrid(4),
      src: "./assets/characters/people/merchant1.png",
      behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      talking: [
        {
          required: ["CUTSCENE_npc5_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "Unknown: Come back with the password. Only members may come past this point.",
              faceHero: "npc75",
            },
          ],
        },
        {
          events: [
            { type: "addStoryFlag", flag: "TALKED_TO_npc5_OUTSIDELEFT" },
            {
              type: "textMessage",
              text: "Unknown: Only members may come past this point.",
              faceHero: "npc5",
            },
          ],
        },
      ],
    },
    npc6: {
      type: "Person",
      x: utils.withGrid(41),
      y: utils.withGrid(18),
      src: "./assets/characters/people/kid2.png",
      behaviorLoop: [
        { type: "stand", direction: "right", time: 1000 },
        { type: "stand", direction: "down", time: 2000 },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "down", time: 2000 },
        { type: "stand", direction: "up", time: 1000 },
        { type: "walk", direction: "right" },
      ],
      talking: [
        {
          required: ["DEFEATED_npc6_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "Wow you are strong!",
              faceHero: "npc6",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "My brother is really strong, he has been training me!",
              faceHero: "npc6",
            },
            { type: "battle", enemyId: "Elly" },
            { type: "addStoryFlag", flag: "DEFEATED_npc6_OUTSIDELEFT" },
          ],
        },
      ],
    },
    npc7: {
      type: "Person",
      x: utils.withGrid(42),
      y: utils.withGrid(18),
      src: "./assets/characters/people/kid.png",
      behaviorLoop: [{ type: "stand", direction: "left", time: 1000 }],
      talking: [
        {
          required: ["DEFEATED_npc7_OUTSIDELEFT"],
          events: [
            {
              type: "textMessage",
              text: "I have a lot to learn.",
              faceHero: "npc7",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "I'm the greatest! Bring it on.",
              faceHero: "npc7",
            },
            { type: "battle", enemyId: "Billy" },
            { type: "addStoryFlag", flag: "DEFEATED_npc7_OUTSIDELEFT" },
          ],
        },
      ],
    },
  },
  walls: {
    [utils.asGridCoord(19, 1)]: true,
    [utils.asGridCoord(21, 1)]: true,
    [utils.asGridCoord(36, 1)]: true,
    [utils.asGridCoord(39, 1)]: true,
    [utils.asGridCoord(13, 2)]: true,
    [utils.asGridCoord(14, 2)]: true,
    [utils.asGridCoord(19, 2)]: true,
    [utils.asGridCoord(21, 2)]: true,
    [utils.asGridCoord(26, 2)]: true,
    [utils.asGridCoord(45, 6)]: true,
    [utils.asGridCoord(27, 2)]: true,
    [utils.asGridCoord(28, 2)]: true,
    [utils.asGridCoord(29, 2)]: true,
    [utils.asGridCoord(36, 2)]: true,
    [utils.asGridCoord(39, 2)]: true,
    [utils.asGridCoord(12, 3)]: true,
    [utils.asGridCoord(15, 3)]: true,
    [utils.asGridCoord(19, 3)]: true,
    [utils.asGridCoord(22, 3)]: true,
    [utils.asGridCoord(23, 3)]: true,
    [utils.asGridCoord(24, 3)]: true,
    [utils.asGridCoord(25, 3)]: true,
    [utils.asGridCoord(30, 3)]: true,
    [utils.asGridCoord(36, 3)]: true,
    [utils.asGridCoord(39, 3)]: true,
    [utils.asGridCoord(12, 4)]: true,
    [utils.asGridCoord(15, 4)]: true,
    [utils.asGridCoord(18, 4)]: true,
    [utils.asGridCoord(30, 4)]: true,
    [utils.asGridCoord(36, 4)]: true,
    [utils.asGridCoord(39, 4)]: true,
    [utils.asGridCoord(13, 5)]: true,
    [utils.asGridCoord(15, 5)]: true,
    [utils.asGridCoord(18, 5)]: true,
    [utils.asGridCoord(30, 5)]: true,
    [utils.asGridCoord(31, 5)]: true,
    [utils.asGridCoord(32, 5)]: true,
    [utils.asGridCoord(33, 5)]: true,
    [utils.asGridCoord(34, 5)]: true,
    [utils.asGridCoord(35, 5)]: true,
    [utils.asGridCoord(36, 5)]: true,
    [utils.asGridCoord(39, 5)]: true,
    [utils.asGridCoord(40, 5)]: true,
    [utils.asGridCoord(13, 6)]: true,
    [utils.asGridCoord(15, 6)]: true,
    [utils.asGridCoord(18, 6)]: true,
    [utils.asGridCoord(41, 6)]: true,
    [utils.asGridCoord(13, 7)]: true,
    [utils.asGridCoord(15, 7)]: true,
    [utils.asGridCoord(17, 7)]: true,
    [utils.asGridCoord(41, 7)]: true,
    [utils.asGridCoord(43, 7)]: true,
    [utils.asGridCoord(44, 7)]: true,
    [utils.asGridCoord(46, 7)]: true,
    [utils.asGridCoord(13, 8)]: true,
    [utils.asGridCoord(15, 8)]: true,
    [utils.asGridCoord(16, 8)]: true,
    [utils.asGridCoord(17, 8)]: true,
    [utils.asGridCoord(18, 8)]: true,
    [utils.asGridCoord(19, 8)]: true,
    [utils.asGridCoord(22, 8)]: true,
    [utils.asGridCoord(23, 8)]: true,
    [utils.asGridCoord(24, 8)]: true,
    [utils.asGridCoord(25, 8)]: true,
    [utils.asGridCoord(26, 8)]: true,
    [utils.asGridCoord(27, 8)]: true,
    [utils.asGridCoord(28, 8)]: true,
    [utils.asGridCoord(29, 8)]: true,
    [utils.asGridCoord(30, 8)]: true,
    [utils.asGridCoord(31, 8)]: true,
    [utils.asGridCoord(32, 8)]: true,
    [utils.asGridCoord(33, 8)]: true,
    [utils.asGridCoord(34, 8)]: true,
    [utils.asGridCoord(35, 8)]: true,
    [utils.asGridCoord(36, 8)]: true,
    [utils.asGridCoord(37, 8)]: true,
    [utils.asGridCoord(38, 8)]: true,
    [utils.asGridCoord(39, 8)]: true,
    [utils.asGridCoord(40, 8)]: true,
    [utils.asGridCoord(41, 8)]: true,
    [utils.asGridCoord(42, 8)]: true,
    [utils.asGridCoord(13, 9)]: true,
    [utils.asGridCoord(13, 10)]: true,
    [utils.asGridCoord(12, 11)]: true,
    [utils.asGridCoord(15, 11)]: true,
    [utils.asGridCoord(16, 11)]: true,
    [utils.asGridCoord(17, 11)]: true,
    [utils.asGridCoord(18, 11)]: true,
    [utils.asGridCoord(19, 11)]: true,
    [utils.asGridCoord(20, 11)]: true,
    [utils.asGridCoord(36, 11)]: true,
    [utils.asGridCoord(37, 11)]: true,
    [utils.asGridCoord(38, 11)]: true,
    [utils.asGridCoord(12, 12)]: true,
    [utils.asGridCoord(15, 12)]: true,
    [utils.asGridCoord(17, 12)]: true,
    [utils.asGridCoord(27, 12)]: true,
    [utils.asGridCoord(28, 12)]: true,
    [utils.asGridCoord(29, 12)]: true,
    [utils.asGridCoord(36, 12)]: true,
    [utils.asGridCoord(37, 12)]: true,
    [utils.asGridCoord(38, 12)]: true,
    [utils.asGridCoord(12, 13)]: true,
    [utils.asGridCoord(15, 13)]: true,
    [utils.asGridCoord(17, 13)]: true,
    [utils.asGridCoord(27, 13)]: true,
    [utils.asGridCoord(29, 13)]: true,
    [utils.asGridCoord(31, 13)]: true,
    [utils.asGridCoord(32, 13)]: true,
    [utils.asGridCoord(33, 13)]: true,
    [utils.asGridCoord(34, 13)]: true,
    [utils.asGridCoord(35, 13)]: true,
    [utils.asGridCoord(36, 13)]: true,
    [utils.asGridCoord(38, 13)]: true,
    [utils.asGridCoord(12, 14)]: true,
    [utils.asGridCoord(15, 14)]: true,
    [utils.asGridCoord(16, 14)]: true,
    [utils.asGridCoord(17, 14)]: true,
    [utils.asGridCoord(27, 14)]: true,
    [utils.asGridCoord(29, 14)]: true,
    [utils.asGridCoord(31, 14)]: true,
    [utils.asGridCoord(35, 14)]: true,
    [utils.asGridCoord(44, 14)]: true,
    [utils.asGridCoord(45, 14)]: true,
    [utils.asGridCoord(46, 15)]: true,
    [utils.asGridCoord(12, 15)]: true,
    [utils.asGridCoord(20, 15)]: true,
    [utils.asGridCoord(21, 15)]: true,
    [utils.asGridCoord(22, 15)]: true,
    [utils.asGridCoord(23, 15)]: true,
    [utils.asGridCoord(27, 15)]: true,
    [utils.asGridCoord(29, 15)]: true,
    [utils.asGridCoord(31, 15)]: true,
    [utils.asGridCoord(32, 15)]: true,
    [utils.asGridCoord(34, 15)]: true,
    [utils.asGridCoord(35, 15)]: true,
    [utils.asGridCoord(44, 15)]: true,
    [utils.asGridCoord(12, 16)]: true,
    [utils.asGridCoord(20, 16)]: true,
    [utils.asGridCoord(23, 16)]: true,
    [utils.asGridCoord(44, 16)]: true,
    [utils.asGridCoord(12, 17)]: true,
    [utils.asGridCoord(13, 17)]: true,
    [utils.asGridCoord(14, 17)]: true,
    [utils.asGridCoord(15, 17)]: true,
    [utils.asGridCoord(16, 17)]: true,
    [utils.asGridCoord(17, 17)]: true,
    [utils.asGridCoord(18, 17)]: true,
    [utils.asGridCoord(19, 17)]: true,
    [utils.asGridCoord(20, 17)]: true,
    [utils.asGridCoord(23, 17)]: true,
    [utils.asGridCoord(39, 17)]: true,
    [utils.asGridCoord(43, 17)]: true,
    [utils.asGridCoord(16, 18)]: true,
    [utils.asGridCoord(18, 18)]: true,
    [utils.asGridCoord(19, 18)]: true,
    [utils.asGridCoord(27, 18)]: true,
    [utils.asGridCoord(28, 18)]: true,
    [utils.asGridCoord(29, 18)]: true,
    [utils.asGridCoord(39, 18)]: true,
    [utils.asGridCoord(43, 18)]: true,
    [utils.asGridCoord(15, 19)]: true,
    [utils.asGridCoord(16, 19)]: true,
    [utils.asGridCoord(18, 19)]: true,
    [utils.asGridCoord(19, 19)]: true,
    [utils.asGridCoord(26, 19)]: true,
    [utils.asGridCoord(30, 19)]: true,
    [utils.asGridCoord(31, 19)]: true,
    [utils.asGridCoord(32, 19)]: true,
    [utils.asGridCoord(33, 19)]: true,
    [utils.asGridCoord(34, 19)]: true,
    [utils.asGridCoord(35, 19)]: true,
    [utils.asGridCoord(36, 19)]: true,
    [utils.asGridCoord(37, 19)]: true,
    [utils.asGridCoord(38, 19)]: true,
    [utils.asGridCoord(40, 19)]: true,
    [utils.asGridCoord(41, 19)]: true,
    [utils.asGridCoord(42, 19)]: true,
    [utils.asGridCoord(14, 20)]: true,
    [utils.asGridCoord(27, 20)]: true,
    [utils.asGridCoord(14, 21)]: true,
    [utils.asGridCoord(27, 21)]: true,
    [utils.asGridCoord(14, 22)]: true,
    [utils.asGridCoord(15, 22)]: true,
    [utils.asGridCoord(16, 22)]: true,
    [utils.asGridCoord(17, 22)]: true,
    [utils.asGridCoord(18, 22)]: true,
    [utils.asGridCoord(26, 22)]: true,
    [utils.asGridCoord(18, 23)]: true,
    [utils.asGridCoord(21, 23)]: true,
    [utils.asGridCoord(22, 23)]: true,
    [utils.asGridCoord(23, 23)]: true,
    [utils.asGridCoord(24, 23)]: true,
    [utils.asGridCoord(25, 23)]: true,
    [utils.asGridCoord(26, 23)]: true,
    [utils.asGridCoord(18, 24)]: true,
    [utils.asGridCoord(21, 24)]: true,
    [utils.asGridCoord(17, 25)]: true,
    [utils.asGridCoord(18, 25)]: true,
    [utils.asGridCoord(21, 25)]: true,
    [utils.asGridCoord(22, 25)]: true,
    [utils.asGridCoord(16, 26)]: true,
    [utils.asGridCoord(23, 26)]: true,
    [utils.asGridCoord(16, 27)]: true,
    [utils.asGridCoord(17, 27)]: true,
    [utils.asGridCoord(18, 27)]: true,
    [utils.asGridCoord(23, 27)]: true,
  },
  cutsceneSpaces: {
    /* Outside - NPC interactions */
    [utils.asGridCoord(37, 3)]: [
      {
        events: [
          { who: "npc5", type: "walk", direction: "up" },
          { who: "npc5", type: "walk", direction: "up" },
          { who: "npc5", type: "walk", direction: "left" },
          { who: "npc5", type: "stand", direction: "down", time: 500 },
          { type: "textMessage", text: "Unknown: What is the password?" },
          { type: "textMessage", text: "Me: huh, what password?" },
          { type: "textMessage", text: "Unknown: I'm sorry you cannot enter here, this is a private area." },
          { who: "hero", type: "walk", direction: "down" },
          { who: "hero", type: "walk", direction: "down" },
          { who: "npc5", type: "walk", direction: "down" },
          { who: "npc5", type: "walk", direction: "down" },
          { type: "textMessage", text: "Unknown: Come back with the password and you can enter." },
          { who: "npc5", type: "walk", direction: "right" },
          { who: "npc5", type: "stand", direction: "down", time: 50 },
          { who: "hero", type: "walk", direction: "down" },
          { type: "addStoryFlag", flag: "CUTSCENE_npc5_OUTSIDELEFT" },
        ],
      },
    ],
    /* Outside - NPC interactions end */

    /* Outside - Room map changes */
    [utils.asGridCoord(20, 2)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "LocalShop",
            x: utils.withGrid(4),
            y: utils.withGrid(10),
            direction: "up",
          },
        ],
      },
    ],
    [utils.asGridCoord(33, 14)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Mansion",
            x: utils.withGrid(10),
            y: utils.withGrid(16),
            direction: "up",
          },
          { type: "textMessage", text: "Who is it?" },
        ],
      },
    ],
    [utils.asGridCoord(17, 18)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Home",
            x: utils.withGrid(4),
            y: utils.withGrid(6),
            direction: "up",
          },
        ],
      },
    ],
    /* Outside - Room map changes end */

    /* Outside - Map changing */
    [utils.asGridCoord(19, 27)]: changeMapToOutsideBottomLeftTile,
    [utils.asGridCoord(20, 27)]: changeMapToOutsideBottomRightTile,
    [utils.asGridCoord(21, 27)]: changeMapToOutsideBottomRightTile,
    [utils.asGridCoord(22, 27)]: changeMapToOutsideBottomRightTile,
    [utils.asGridCoord(46, 8)]: changeMapToOutsideRightUpperTile,
    [utils.asGridCoord(46, 9)]: changeMapToOutsideRightUpperTile,
    [utils.asGridCoord(46, 10)]: changeMapToOutsideRightLowerTile,
    [utils.asGridCoord(46, 11)]: changeMapToOutsideRightLowerTile,
    [utils.asGridCoord(46, 12)]: changeMapToOutsideRightLowerTile,
    [utils.asGridCoord(46, 13)]: changeMapToOutsideRightLowerTile,
    /* Outside - Map changing end */
  },
};
