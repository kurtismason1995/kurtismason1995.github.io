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
              text: "The animals are on your side, son. {LEAD_ANIMAL_NAME} is counting on you.",
              speaker: { name: "Mum", id: "mum" },
            },
            {
              type: "choiceMenu",
              title: "Mum's Help",
              options: [
                {
                  label: "I need advice",
                  description: "Get a reminder about your current progress.",
                  events: [
                    { type: "addStoryFlag", flag: "ASKED_MUM_ADVICE" },
                    {
                      type: "textMessage",
                      speaker: { name: "Mum", id: "mum" },
                      text: "You have {PLAYER_COINS} coins, {PLAYER_BADGES_COUNT} badges, and {PLAYER_BATTLES_WON} wins. Keep {LEAD_ANIMAL_NAME} healthy and in front when the road gets rough.",
                    },
                  ],
                },
                {
                  label: "Any spare supplies?",
                  description: "Receive one free Hay Bale.",
                  events: [
                    { type: "addItem", itemId: "item_hayBale" },
                    {
                      type: "textMessage",
                      speaker: { name: "Mum", id: "mum" },
                      text: "Take this hay bale for the road.",
                      speed: 30,
                      autoAdvanceDelay: 800,
                    },
                  ],
                },
                {
                  label: "Open home supplies",
                  description: "Browse a few basics without leaving the house.",
                  events: [
                    {
                      type: "shop",
                      inventory: [
                        { itemId: "item_hayBale", price: 15 },
                        { itemId: "item_flySpray", price: 18 },
                      ],
                    },
                  ],
                },
                {
                  label: "Quick training match",
                  description: "Practice against Sprout and track your wins.",
                  events: [
                    {
                      type: "textMessage",
                      speaker: { name: "Mum", id: "mum" },
                      text: "Good idea. A short battle keeps your instincts sharp.",
                    },
                    { type: "battle", enemyId: "Sprout" },
                    {
                      type: "textMessage",
                      speaker: { name: "Mum", id: "mum" },
                      text: "You now have {PLAYER_BATTLES_WON} total wins.",
                    },
                  ],
                },
              ],
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
          { type: "addStoryFlag", flag: "CHAPTER_1_INTRO_STARTED" },
          {
            type: "startQuest",
            questId: "quest_rescue_dad_ch1",
            title: "Find Dad",
            description: "Track down your missing father and uncover who took him.",
            step: 1,
            nextStep: "Speak with the old man in the house to the south for your first lead.",
          },
          { type: "stand", who: "mum", direction: "right", time: 200 },
          { type: "stand", who: "hero", direction: "left", time: 200 },
          {
            type: "textMessage",
            text: "Good morning, Mum. What's going on?",
            speaker: { name: "Sam", id: "hero" },
            faceHero: "mum",
          },
          {
            type: "textMessage",
            text: "Son!!! Your dad is missing. He never came back from his trip to the city.",
            speaker: { name: "Mum", id: "mum" },
          },
          { type: "textMessage", text: "What? When did this happen?", speaker: { name: "Sam", id: "hero" } },
          {
            type: "textMessage",
            text: "Three days ago. I've tried everything to find him,\nbut I'm afraid I've hit a dead end.",
            speaker: { name: "Mum", id: "mum" },
            speed: 40,
          },
          {
            type: "textMessage",
            text: "Don't worry, Mum. I'll find him. I won't rest until I do.",
            speaker: { name: "Sam", id: "hero" },
          },
          { type: "walk", who: "hero", direction: "left" },
          { type: "walk", who: "hero", direction: "down" },
          { type: "walk", who: "hero", direction: "down" },
          { type: "walk", who: "hero", direction: "down" },
          { type: "walk", who: "hero", direction: "left" },
          { type: "stand", who: "hero", direction: "up", time: 200 },
          {
            type: "textMessage",
            text: "(Crying...) You're all I have left in this world.",
            speaker: { name: "Mum", id: "mum" },
            faceHero: "mum",
          },
          { type: "stand", who: "hero", direction: "down", time: 1000 },
          { type: "stand", who: "hero", direction: "up", time: 10 },
          {
            type: "textMessage",
            text: "Oh and son, take Rocky with you! The animals around town will help him.",
            speaker: { name: "Mum", id: "mum" },
          },
          {
            type: "textMessage",
            text: "Rocky joined your team.",
            speaker: { name: "System" },
            speed: 25,
            autoAdvanceDelay: 700,
          },
          { type: "addAnimal", animalId: "Rocky", hp: 100 },
          { type: "stand", who: "hero", direction: "down", time: 500 },
        ],
      },
    ],
    [utils.asGridCoord(4, 6)]: [
      {
        required: ["DEFEATED_BOSS"],
        exclude: "CHAPTER_1_RETURN_SCENE_DONE",
        events: [
          { type: "addStoryFlag", flag: "CHAPTER_1_RETURN_SCENE_DONE" },
          { type: "stand", who: "hero", direction: "down", time: 200 },
          { type: "stand", who: "mum", direction: "up", time: 200 },
          {
            type: "textMessage",
            text: "Mum: Sam... you're back. I heard what happened at the tournament.",
            speaker: { name: "Mum", id: "mum" },
            faceHero: "mum",
          },
          {
            type: "textMessage",
            text: "Sam: Dad is safe. We broke their hold over the arena.",
            speaker: { name: "Sam", id: "hero" },
          },
          {
            type: "textMessage",
            text: "Mum: I'm proud of you. Take these supplies and rest your team.",
            speaker: { name: "Mum", id: "mum" },
          },
          { type: "addCoins", amount: 75 },
          { type: "addItem", itemId: "item_hayBale" },
          { type: "addItem", itemId: "item_flySpray" },
          {
            type: "completeQuest",
            questId: "quest_rescue_dad_ch1",
            step: 7,
            nextStep: "Chapter 1 complete. Continue training and prepare for new threats.",
          },
          {
            type: "textMessage",
            text: "Chapter 1 complete: Homecoming.",
            speaker: { name: "System" },
            speed: 28,
            autoAdvanceDelay: 900,
          },
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
