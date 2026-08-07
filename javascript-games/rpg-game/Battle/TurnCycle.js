import { getTypeMultiplier } from "../content/typeChart.js";

export class TurnCycle {
  constructor({ battle, onNewEvent, onWinner, onFlee }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.onFlee = onFlee;
    this.currentTeam = "player"; // or enemy
  }

  async turn() {
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
    const enemy = this.battle.combatants[enemyId];

    caster.beginTurn();

    const submission = caster.isPlayerControlled
      ? await this.onNewEvent({
          type: "submissionMenu",
          caster,
          enemy,
        })
      : this.getEnemySubmission(caster, enemy);

    if (submission.action?.flee) {
      this.onFlee();
      return;
    }

    // Stop here if we are wanting to swap
    if (submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement,
      });
      await this.onNewEvent({
        type: "textMessage",
        text: `Go get 'em, ${submission.replacement.name}!`,
      });
      this.nextTurn();
      return;
    }

    if (submission.instanceId) {
      this.battle.usedInstanceIds[submission.instanceId] = true;
      // Removing item from battle state
      this.battle.items = this.battle.items.filter((item) => item.instanceId !== submission.instanceId);
    }

    if (submission.actionId && !caster.canUseAction(submission.actionId)) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${caster.name} cannot use ${submission.action.name} right now!`,
      });
      this.nextTurn();
      return;
    }

    if (caster.status?.type !== "stunned") {
      caster.commitAction(submission.actionId);
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    // Check if target died
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${submission.target.name} is ruined!`,
      });

      if (submission.target.team === "enemy") {
        const playerActiveAnimalId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;
        await this.onNewEvent({
          type: "textMessage",
          text: `Gained ${xp} XP!`,
        });
        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.battle.combatants[playerActiveAnimalId],
        });
      }
    }

    const winner = this.getWinningTeam();

    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${winner === "player" ? "Winner!" : "You have been defeated!"}`,
      });
      this.onWinner(winner);
      return;
    }

    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team,
      });
      await this.onNewEvent({
        type: "replace",
        replacement: replacement,
      });
      await this.onNewEvent({
        type: "textMessage",
        text: `${replacement.name} appears!`,
      });
    }

    // Do we have a winning team

    // Check for after attack effects
    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }

  getEnemySubmission(caster, enemy) {
    const candidateActionIds = caster.getUsableActionIds();
    const actionIds = candidateActionIds.length ? candidateActionIds : caster.actions;

    let bestScore = Number.NEGATIVE_INFINITY;
    let bestActionId = actionIds[0];

    actionIds.forEach((actionId) => {
      const action = window.Actions?.[actionId];
      if (!action) {
        return;
      }

      const score = this.scoreEnemyAction({
        action,
        actionId,
        caster,
        enemy,
      });

      if (score > bestScore) {
        bestScore = score;
        bestActionId = actionId;
      }
    });

    const bestAction = window.Actions?.[bestActionId] || window.Actions?.[caster.actions[0]];

    return {
      action: bestAction,
      actionId: bestActionId,
      target: bestAction?.targetType === "friendly" ? caster : enemy,
      instanceId: null,
    };
  }

  scoreEnemyAction({ action, actionId, caster, enemy }) {
    const stateChanges = (action.success || []).filter((event) => event.type === "stateChange");
    const enemyHpRatio = enemy.hp / enemy.maxHp;
    const casterHpRatio = caster.hp / caster.maxHp;
    const lowHp = casterHpRatio <= 0.35;
    let score = Math.random() * 0.25;

    const totalRecover = stateChanges.reduce((sum, event) => sum + (event.recover || 0), 0);
    const addsStatus = stateChanges.find((event) => event.status && event.status !== null);
    const givesDefenseStatus = stateChanges.find(
      (event) => event.status?.type === "harden" || event.status?.type === "thorn-guard" || event.status?.type === "regen"
    );

    if (action.targetType === "friendly") {
      if (totalRecover > 0) {
        score += lowHp ? 90 + totalRecover : 25 + totalRecover * 0.5;
      }
      if (givesDefenseStatus && !caster.status) {
        score += lowHp ? 85 : 35;
      }
      if (addsStatus && !caster.status) {
        score += 20;
      }

      // Avoid overusing support moves when enemy is almost defeated.
      if (enemyHpRatio <= 0.2) {
        score -= 30;
      }
    } else {
      const damagingEvents = stateChanges.filter((event) => event.damage && !event.onCaster);
      const expectedDamage = damagingEvents.reduce((sum, event) => {
        const damageType = event.damageType || action.type;
        const typeMultiplier = getTypeMultiplier(damageType, enemy.type);
        const baseDamage = event.damage * (caster.attack / Math.max(1, enemy.defense)) * typeMultiplier;
        return sum + baseDamage;
      }, 0);

      score += expectedDamage;

      if (damagingEvents.length) {
        const primaryDamageType = damagingEvents[0].damageType || action.type;
        const effectiveness = getTypeMultiplier(primaryDamageType, enemy.type);
        score += effectiveness * 18;
      }

      if (expectedDamage >= enemy.hp) {
        score += 120;
      }

      if (addsStatus && !enemy.status) {
        score += 22;
      }

      if (lowHp && totalRecover > 0) {
        score -= 40;
      }
    }

    // Nudge AI to rotate moves when multiple options are viable.
    if (caster.lastActionId && caster.lastActionId === actionId && actionIdsHaveAlternatives(caster, actionId)) {
      score -= 8;
    }

    return score;
  }

  getWinningTeam() {
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach((combatant) => {
      if (combatant.hp > 0) {
        aliveTeams[combatant.team] = true;
      }
    });

    if (!aliveTeams.player) {
      return "enemy";
    }
    if (!aliveTeams.enemy) {
      return "player";
    }
    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `${this.battle.enemy.name} wants to throw down!`,
    });

    this.turn();
  }
}

function actionIdsHaveAlternatives(caster, actionId) {
  const usable = caster.getUsableActionIds();
  const pool = usable.length ? usable : caster.actions;
  return pool.some((id) => id !== actionId);
}
