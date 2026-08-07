import { utils } from "../utils.js";
import { TextMessage } from "./../TextMessage.js";
import { SubmissionMenu } from "./SubmissionMenu.js";
import { BattleAnimations } from "./BattleAnimations.js";
import { ReplacementMenu } from "./ReplacementMenu.js";
import { getTypeMultiplier } from "../content/typeChart.js";

export class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {
    if (this.event.submission?.lastMoveMissed && this.event.text?.includes("{EFFECTIVENESS}")) {
      resolve();
      return;
    }

    let text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name);

    if (text.includes("{EFFECTIVENESS}")) {
      const attackType = this.event.action.type;
      const targetType = this.event.target.type;

      const multiplier = getTypeMultiplier(attackType, targetType);
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

    const isOffensiveTarget = action.targetType !== "friendly";
    const shouldRollAccuracy = damage && isOffensiveTarget && !this.event.onCaster;

    if (shouldRollAccuracy) {
      const baseAccuracy = caster.getActionAccuracy(action);
      const accuracyMultiplier = caster.getAccuracyMultiplier();
      const evasionMultiplier = target.getEvasionMultiplier();
      const hitChance = Math.max(0.05, Math.min(0.99, (baseAccuracy * accuracyMultiplier) / evasionMultiplier));
      const hitRoll = Math.random();

      if (hitRoll > hitChance) {
        this.event.submission.lastMoveMissed = true;
        const missMessage = new TextMessage({
          text: `${caster.name}'s ${action.name} missed!`,
          onComplete: () => {
            resolve();
          },
        });

        missMessage.init(this.battle.element);
        return;
      }
    }

    this.event.submission.lastMoveMissed = false;

    if (damage) {
      const damageTarget = this.event.onCaster ? caster : target;
      let damageTypeMultiplier = getTypeMultiplier(damageType, damageTarget.type);
      if (damageType === "water" && damageTarget.status?.type === "soaked") {
        damageTypeMultiplier *= 1.2;
      }

      const levelDiff = caster.level - damageTarget.level;
      const levelMultiplier = 1 + 0.2 * levelDiff;
      const guardMultiplier = damageTarget.status?.type === "harden" ? 0.7 : 1;
      const varianceMultiplier = 0.9 + Math.random() * 0.2;
      const isCritical = Math.random() < 0.12;
      const criticalMultiplier = isCritical ? 1.6 : 1;
      const actualDamage =
        damage *
        (caster.attack / damageTarget.defense) *
        damageTypeMultiplier *
        Math.max(0.3, levelMultiplier) *
        guardMultiplier *
        varianceMultiplier *
        criticalMultiplier;

      utils.debug(
        "damage",
        actualDamage,
        `${damage} * (${caster.attack} / ${damageTarget.defense}) * ${damageTypeMultiplier} * ${Math.max(
          0.3,
          levelMultiplier
        )} * ${guardMultiplier} * ${varianceMultiplier} * ${criticalMultiplier}`
      );
      damageTarget.update({
        hp: Math.max(0, damageTarget.hp - actualDamage),
      });
      damageTarget.animalElement.classList.add("battle-damage-blink");

      if (damageTarget.status?.type === "thorn-guard" && damageTarget !== caster && caster.hp > 0) {
        const reflectedDamage = Math.max(1, Math.round(actualDamage * 0.15));
        caster.update({
          hp: Math.max(0, caster.hp - reflectedDamage),
        });
        await new Promise((next) => {
          new TextMessage({
            text: `${caster.name} is pricked by thorn guard for ${reflectedDamage} damage!`,
            onComplete: next,
          }).init(this.battle.element);
        });
      }

      if (isCritical) {
        await new Promise((next) => {
          new TextMessage({
            text: "Critical hit!",
            onComplete: next,
          }).init(this.battle.element);
        });
      }
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
