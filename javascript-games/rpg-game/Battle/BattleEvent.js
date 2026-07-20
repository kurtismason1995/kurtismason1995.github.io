import { utils } from "../utils.js";
import { TextMessage } from "./../TextMessage.js";
import { SubmissionMenu } from "./SubmissionMenu.js";
import { BattleAnimations } from "./BattleAnimations.js";
import { ReplacementMenu } from "./ReplacementMenu.js";

function determineMultiplier(damageType, targetType) {
  switch (damageType) {
    case "stone":
      switch (targetType) {
        case "fly":
          return 1.5; // stone is strong against fly
        case "water":
          return 0.7; // stone is weak against water
        default:
          return 1; // stone does neutral damage against all other types
      }
    case "fly":
      switch (targetType) {
        case "shadow":
          return 1.5; // fly is strong against shadow
        case "stone":
          return 0.7; // fly is weak against stone
        default:
          return 1; // fly does neutral damage against all other types
      }
    case "fire":
      switch (targetType) {
        case "nature":
          return 1.5; // fire is strong against nature
        case "water":
          return 0.7; // fire is weak against water
        default:
          return 1; // fire does neutral damage against all other types
      }
    case "water":
      switch (targetType) {
        case "fire":
          return 1.5; // water is strong against fire
        case "shadow":
          return 0.7; // water is weak against shadow
        default:
          return 1; // water does neutral damage against all other types
      }
    case "shadow":
      switch (targetType) {
        case "stone":
          return 1.5; // shadow is strong against stone
        case "nature":
          return 0.7; // shadow is weak against nature
        default:
          return 1; // shadow does neutral damage against all other types
      }
    case "nature":
      switch (targetType) {
        case "water":
          return 1.5; // nature is strong against water
        case "fire":
          return 0.7; // nature is weak against fire
        default:
          return 1; // nature does neutral damage against all other types
      }
    default:
      return 1; // if the damage type is not recognized, assume it does neutral damage
  }
}

export class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {
    let text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name);

    if (text.includes("{EFFECTIVENESS}")) {
      const attackType = this.event.action.type;
      const targetType = this.event.target.type;

      const multiplier = determineMultiplier(attackType, targetType);
      if (multiplier === 1.5) {
        text = text.replace("{EFFECTIVENESS}", "SUPER");
      } else if (multiplier === 0.7) {
        text = text.replace("{EFFECTIVENESS}", "not very");
      } else {
        resolve();
        return;
      }
    }
    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      },
    });

    message.init(this.battle.element);
  }

  async stateChange(resolve) {
    const { caster, target, damage, recover, status, action, damageType } = this.event;
    let who = this.event.onCaster ? caster : target;

    if (action.targetType === "friendly") {
      who = caster;
    }

    if (damage) {
      const damageTarget = this.event.onCaster ? caster : target;
      const damageTypeMultiplier = determineMultiplier(damageType, damageTarget.type);
      const levelDiff = caster.level - damageTarget.level;
      const levelMultiplier = 1 + 0.2 * levelDiff;
      const guardMultiplier = damageTarget.status?.type === "harden" ? 0.7 : 1;
      const actualDamage =
        damage *
        (caster.attack / damageTarget.defense) *
        damageTypeMultiplier *
        Math.max(0.3, levelMultiplier) *
        guardMultiplier;

      console.log(
        "damage",
        actualDamage,
        `${damage} * (${caster.attack} / ${target.defense}) * ${damageTypeMultiplier} * ${Math.max(
          0.3,
          levelMultiplier
        )}`
      );
      target.update({
        hp: Math.max(0, damageTarget.hp - actualDamage),
      });
      damageTarget.animalElement.classList.add("battle-damage-blink");
    }

    if (recover) {
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp;
      }
      who.update({ hp: newHp });
    }

    if (status) {
      who.update({ status: { ...status } });
    }

    if (status === null) {
      who.update({ status: null });
    }

    // wait a bit
    await utils.wait(600);

    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();

    const affectedAnimal = damage && this.event.onCaster ? caster : target;
    affectedAnimal.animalElement.classList.remove("battle-damage-blink");
    resolve();
  }

  submissionMenu(resolve) {
    const { caster } = this.event;
    const menu = new SubmissionMenu({
      caster: caster,
      enemy: this.event.enemy,
      items: this.battle.items,
      replacements: Object.values(this.battle.combatants).filter(
        (c) => c.id !== caster.id && c.team === caster.team && c.hp > 0
      ),
      onComplete: (submission) => {
        resolve(submission);
      },
    });

    menu.init(this.battle.element);
  }

  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: Object.values(this.battle.combatants).filter((c) => {
        return c.team === this.event.team && c.hp > 0;
      }),
      onComplete: (replacement) => {
        resolve(replacement);
      },
    });
    menu.init(this.battle.element);
  }

  giveXp(resolve) {
    let amount = this.event.xp;
    const { combatant } = this.event;
    const step = () => {
      if (amount > 0) {
        amount--;
        combatant.xp++;

        if (combatant.xp >= combatant.maxXp) {
          combatant.xp -= combatant.maxXp;
          combatant.level++;
          combatant.maxXp = 100 + (combatant.level - 1) * 35;
          combatant.maxHp += 8;
          combatant.hp = Math.min(combatant.maxHp, combatant.hp + 8);
        }

        combatant.update();
        requestAnimationFrame(step);
        return;
      }
      resolve();
    };

    requestAnimationFrame(step);
  }

  async replace(resolve) {
    const { replacement } = this.event;
    const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];

    this.battle.activeCombatants[replacement.team] = null;
    prevCombatant.update();

    await utils.wait(400);

    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();
    await utils.wait(400);

    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();
    resolve();
  }

  animation(resolve) {
    const fn = BattleAnimations[this.event.animation];
    if (!fn) {
      resolve();
      return;
    }
    fn(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}
