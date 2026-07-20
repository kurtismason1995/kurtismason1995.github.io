import { utils } from "../../utils.js";

export const SmallHouse = {
  id: "SmallHouse",
  lowerSrc: "./assets/maps/newmaps/room4_lower.png",
  upperSrc: "./assets/maps/newmaps/room4_upper.png",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      src: "./assets/characters/people/hero.png",
      x: utils.withGrid(5),
      y: utils.withGrid(8),
    },
    npc1: {
      type: "Person",
      x: utils.withGrid(8),
      y: utils.withGrid(6),
      src: "./assets/characters/people/kid4.png",
      behaviorLoop: [{ type: "stand", direction: "up", time: 1000 }],
      talking: [
        {
          required: ["DEFEATED_BOSS"],
          events: [
            {
              type: "textMessage",
              text: "We are still celebrating your victory. Mum says you are the town's bravest animal trainer!",
              faceHero: "npc1",
            },
          ],
        },
        {
          required: ["ARENA_INVITATION"],
          events: [
            {
              type: "textMessage",
              text: "You are going to the Hay Tournament? I hope your animals do their coolest moves!",
              faceHero: "npc1",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "Blahh, these are disgusting!",
              faceHero: "npc1",
            },
          ],
        },
      ],
    },
    npc2: {
      type: "Person",
      x: utils.withGrid(7),
      y: utils.withGrid(6),
      src: "./assets/characters/people/barmaid2.png",
      behaviorLoop: [{ type: "stand", direction: "up", time: 1000 }],
      talking: [
        {
          required: ["DEFEATED_BOSS"],
          events: [
            {
              type: "textMessage",
              text: "Your pack looks wonderful, Sam. Let me make sure they stay that way.",
              faceHero: "npc2",
            },
            { type: "healAnimals" },
            {
              type: "textMessage",
              text: "All of your animals are fully rested. Come back whenever they need care.",
              faceHero: "npc2",
            },
          ],
        },
        {
          required: ["ARENA_INVITATION"],
          events: [
            {
              type: "textMessage",
              text: "A tournament can wear any animal out. Hand them over and I will patch up the whole pack.",
              faceHero: "npc2",
            },
            { type: "healAnimals" },
            {
              type: "textMessage",
              text: "Your animals are fully healed. Watch their strengths and weaknesses in the arena.",
              faceHero: "npc2",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "I am the village animal carer. Would you like me to heal every animal in your pack?",
              faceHero: "npc2",
            },
            { type: "healAnimals" },
            {
              type: "textMessage",
              text: "There we go. Your whole pack is fully healed, so take care of them out there.",
              faceHero: "npc2",
            },
          ],
        },
      ],
    },
    npc3: {
      type: "Person",
      x: utils.withGrid(8),
      y: utils.withGrid(3),
      src: "./assets/characters/people/kid3.png",
      behaviorLoop: [{ type: "stand", direction: "right", time: 1000 }],
      talking: [
        {
          required: ["DEFEATED_BOSS"],
          events: [
            {
              type: "textMessage",
              text: "I was not hiding. I was listening for the celebration outside!",
              faceHero: "npc3",
            },
          ],
        },
        {
          events: [
            {
              type: "textMessage",
              text: "Shhhhh! I am hiding, but the animal carer can make your pack feel better.",
              faceHero: "npc3",
            },
          ],
        },
      ],
    },
  },
  walls: {
    [utils.asGridCoord(3, 1)]: true,
    [utils.asGridCoord(9, 2)]: true,
    [utils.asGridCoord(4, 1)]: true,
    [utils.asGridCoord(5, 1)]: true,
    [utils.asGridCoord(7, 1)]: true,
    [utils.asGridCoord(8, 1)]: true,
    [utils.asGridCoord(1, 2)]: true,
    [utils.asGridCoord(2, 2)]: true,
    [utils.asGridCoord(6, 2)]: true,
    [utils.asGridCoord(9, 3)]: true,
    [utils.asGridCoord(1, 3)]: true,
    [utils.asGridCoord(9, 4)]: true,
    [utils.asGridCoord(1, 4)]: true,
    [utils.asGridCoord(7, 4)]: true,
    [utils.asGridCoord(8, 4)]: true,
    [utils.asGridCoord(1, 5)]: true,
    [utils.asGridCoord(2, 5)]: true,
    [utils.asGridCoord(7, 5)]: true,
    [utils.asGridCoord(8, 5)]: true,
    [utils.asGridCoord(1, 6)]: true,
    [utils.asGridCoord(2, 6)]: true,
    [utils.asGridCoord(9, 7)]: true,
    [utils.asGridCoord(0, 7)]: true,
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
    /* SmallHouse - NPC interactions */
    /* SmallHouse - NPC interactions end */
    /* SmallHouse - Room map changing */
    [utils.asGridCoord(5, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideRight",
            x: utils.withGrid(18),
            y: utils.withGrid(17),
            direction: "down",
          },
        ],
      },
    ],
    [utils.asGridCoord(4, 9)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "OutsideRight",
            x: utils.withGrid(18),
            y: utils.withGrid(17),
            direction: "down",
          },
        ],
      },
    ],
    /* SmallHouse - Room map changing end */
  },
};
