window.AnimalTypes = {
  stone: "stone", // Strong against fly, weak against water
  fly: "fly", // strong against shadow, weak against stone
  fire: "fire", // Strong against nature, weak against water
  water: "water", // strong against fire, weak against shadow
  shadow: "shadow", // strong against stone, weak against nature
  nature: "nature", // strong against water, weak against fire
};

window.Animals = {
  // Stone
  Rocky: {
    name: "Rocky",
    description: "Rocky the Stone Cow: Heavy and durable cow made of rock.",
    type: AnimalTypes.stone,
    src: "./assets/characters/animals/static/cow2.png",
    icon: "./assets/icons/stone.png",
    actions: ["boulderRoll", "stoneWall", "regeneration"],
    attack: 18,
    defense: 24,
  },

  RockClaw: {
    name: "RockClaw",
    description: "RockClaw is a bear made of stone. Its sharp claws are as hard as rock and used in attacks.",
    type: AnimalTypes.stone,
    src: "./assets/characters/animals/static/bear.png",
    icon: "./assets/icons/stone.png",
    actions: ["boulderRoll", "seismicCrash", "stoneWall", "regeneration"],
    attack: 19,
    defense: 23,
  },
  PebbleRam: {
    name: "PebbleRam",
    description: "A stubborn ram with a stony hide and a head like a battering ram.",
    type: AnimalTypes.stone,
    src: "./assets/characters/animals/static/goat.png",
    icon: "./assets/icons/stone.png",
    actions: ["seismicCrash", "concussiveSlam", "stoneWall", "harden"],
    attack: 20,
    defense: 22,
  },

  // Fly
  Wingcluck: {
    name: "Wingcluck",
    description: "Wingcluck the Fly Chicken: Chicken with feathered wings for flight.",
    type: AnimalTypes.fly,
    src: "./assets/characters/animals/static/white_chicken.png",
    icon: "./assets/icons/fly.png",
    actions: ["wingSlap", "skyDive"],
    attack: 22,
    defense: 14,
  },
  Aeroonyx: {
    name: "Aeroonyx",
    description: "Aeroonyx is a fly-type pigeon with dark, iridescent feathers.",
    type: AnimalTypes.fly,
    src: "./assets/characters/animals/static/pigeon.png",
    icon: "./assets/icons/fly.png",
    actions: ["wingSlap", "skyDive"],
    attack: 22,
    defense: 14,
  },
  Zephyrtail: {
    name: "Zephyrtail",
    description: "A swift squirrel that rides gusts and strikes before you can blink.",
    type: AnimalTypes.fly,
    src: "./assets/characters/animals/static/squirrel.png",
    icon: "./assets/icons/fly.png",
    actions: ["wingSlap", "skyDive"],
    attack: 23,
    defense: 13,
  },

  // Fire
  Pyrogoat: {
    name: "Pyrogoat",
    description: "Pyrogoat the Fire Goat: Goat with the ability to produce and control flames.",
    type: AnimalTypes.fire,
    src: "./assets/characters/animals/static/goat2.png",
    icon: "./assets/icons/fire.png",
    actions: ["flameBurst", "emberTrail", "cinderCyclone"],
    attack: 23,
    defense: 15,
  },
  Sparksqueak: {
    name: "Sparksqueak",
    description: "Sparksqueak is a fire-type mouse with a bright, fiery coat.",
    type: AnimalTypes.fire,
    src: "./assets/characters/animals/static/mouse.png",
    icon: "./assets/icons/fire.png",
    actions: ["flameBurst", "emberTrail", "cinderCyclone", "scratch"],
    attack: 24,
    defense: 13,
  },
  Cinderhog: {
    name: "Cinderhog",
    description: "A fire-breathing boar that leaves scorched hoofprints.",
    type: AnimalTypes.fire,
    src: "./assets/characters/animals/static/pig.png",
    icon: "./assets/icons/fire.png",
    actions: ["flameBurst", "cinderCyclone", "emberTrail"],
    attack: 25,
    defense: 13,
  },

  // Water
  Waterhog: {
    name: "Waterhog",
    description: "Waterhog the Water Pig: Pig with the ability to hold its breath and swim.",
    type: AnimalTypes.water,
    src: "./assets/characters/animals/static/pig.png",
    icon: "./assets/icons/water.png",
    actions: ["bubbleBeam", "tidalCrash", "riptideRing"],
    attack: 15,
    defense: 25,
  },
  Aquaminotaur: {
    name: "Aquaminotaur",
    description:
      "Aquaminotaur is a water-type minotaur. It has sleek, shimmering scales and is adapted to life in water.",
    type: AnimalTypes.water,
    src: "./assets/characters/animals/static/minotaur.png",
    icon: "./assets/icons/water.png",
    actions: ["bubbleBeam", "tidalCrash", "riptideRing"],
    attack: 16,
    defense: 24,
  },
  Brookantler: {
    name: "Brookantler",
    description: "A calm waterfowl whose wings can whip up spinning currents.",
    type: AnimalTypes.water,
    src: "./assets/characters/animals/static/pigeon.png",
    icon: "./assets/icons/water.png",
    actions: ["bubbleBeam", "drench", "riptideRing", "tidalCrash"],
    attack: 17,
    defense: 23,
  },

  // Shadow
  Darksteed: {
    name: "Darksteed",
    description: "Darksteed the Shadow Horse: Horse with the ability to create and control shadows.",
    type: AnimalTypes.shadow,
    src: "./assets/characters/animals/static/white_chicken.png",
    icon: "./assets/icons/shadow.png",
    actions: ["shadowBolt", "umbraPounce"],
    attack: 21,
    defense: 17,
  },
  Shadowfang: {
    name: "Shadowfang",
    description: "Its eyes burn red and its fangs are razor-sharp, capable of tearing through anything.",
    type: AnimalTypes.shadow,
    src: "./assets/characters/animals/static/wolf.png",
    icon: "./assets/icons/shadow.png",
    actions: ["shadowBolt", "umbraPounce", "scratch"],
    attack: 22,
    defense: 17,
  },
  Shadeferret: {
    name: "Shadeferret",
    description: "A slippery nocturnal hunter that strikes from hidden angles.",
    type: AnimalTypes.shadow,
    src: "./assets/characters/animals/static/squirrel.png",
    icon: "./assets/icons/shadow.png",
    actions: ["shadowBolt", "umbraPounce"],
    attack: 23,
    defense: 16,
  },

  // Nature
  Grassmoo: {
    name: "Grassmoo",
    description: "A salty warrior who fears nothing",
    type: AnimalTypes.nature,
    src: "./assets/characters/animals/static/cow.png",
    icon: "./assets/icons/nature.png",
    actions: ["vineWhip", "thornVolley", "thornGuard", "revitalize", "regeneration", "scratch"],
    attack: 17,
    defense: 23,
  },
  Grasserpent: {
    name: "Grasserpent",
    description:
      "Grasserpent is a grass-type snake with a sleek and sinuous body. Its skin is a vibrant shade of green and is covered in grassy textures.",
    type: AnimalTypes.nature,
    src: "./assets/characters/animals/static/snake.png",
    icon: "./assets/icons/nature.png",
    actions: ["vineWhip", "thornVolley", "thornGuard", "revitalize", "regeneration", "shadowBolt"],
    attack: 17,
    defense: 23,
  },
  Fernhorn: {
    name: "Fernhorn",
    description: "A patient forest goat that launches thorny seed bursts.",
    type: AnimalTypes.nature,
    src: "./assets/characters/animals/static/goat.png",
    icon: "./assets/icons/nature.png",
    actions: ["vineWhip", "thornVolley", "regeneration"],
    attack: 19,
    defense: 22,
  },
};
