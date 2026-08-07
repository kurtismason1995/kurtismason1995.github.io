import { KeyboardMenu } from "./../KeyboardMenu.js";

export class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
    this.replacements = replacements;

    let quantityMap = {};
    items.forEach((item) => {
      if (item.team == caster.team) {
        let existing = quantityMap[item.actionId];

        if (existing) {
          existing.quantity++;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          };
        }
      }
    });
    this.items = Object.values(quantityMap);
  }

  getPages() {
    const backOption = {
      label: "Go Back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root);
      },
    };

    return {
      root: [
        {
          label: "Attack",
          description: `Choose an attack (Energy: ${this.caster.energy}/${this.caster.maxEnergy})`,
          handler: () => {
            // Do something when chosen...
            this.keyboardMenu.setOptions(this.getPages().attacks);
          },
        },
        {
          label: "Items",
          description: "Choose an item",
          handler: () => {
            // Go to items page...
            this.keyboardMenu.setOptions(this.getPages().items);
          },
        },
        {
          label: "Swap",
          description: "Change to another Farm Animal",
          handler: () => {
            // See animal options
            this.keyboardMenu.setOptions(this.getPages().replacements);
          },
        },
        {
          label: "Flee",
          description: "Flee the battle",
          handler: () => {
            this.menuSubmit({ flee: true });
          },
        },
      ],
      attacks: [
        ...this.caster.actions.map((key) => {
          const action = Actions[key];
          const disabled = !this.caster.canUseAction(key);
          const blockReason = this.caster.getActionBlockReason(key);
          const cost = this.caster.getActionEnergyCost(action);
          const cooldownRemaining = this.caster.getActionCooldownRemaining(key);

          return {
            label: action.name,
            description: disabled
              ? `${action.description} (${blockReason})`
              : `${action.description} (Cost: ${cost} energy)`,
            disabled,
            right: () => {
              const tags = [];
              if (cost > 0) {
                tags.push(`E${cost}`);
              }
              if (cooldownRemaining > 0) {
                tags.push(`CD${cooldownRemaining}`);
              }
              return tags.join(" ");
            },
            handler: () => {
              this.menuSubmit(action, null, key);
            },
          };
        }),
        backOption,
      ],
      items: [
        ...this.items.map((item) => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return `x${item.quantity}`;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId, item.actionId);
            },
          };
        }),
        backOption,
      ],
      replacements: [
        ...this.replacements.map((replacement) => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              this.menuSubmitReplacement(replacement);
            },
          };
        }),
        backOption,
      ],
    };
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement,
    });
  }

  menuSubmit(action, instanceId = null, actionId = null) {
    this.keyboardMenu?.end();

    this.onComplete({
      action,
      actionId,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId,
    });
  }

  decide() {
    const availableActions = this.caster.getUsableActionIds();
    const usable = availableActions.length ? availableActions : this.caster.actions;
    const index = Math.floor(Math.random() * usable.length);
    const actionId = usable[index];
    this.menuSubmit(Actions[actionId], null, actionId);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  init(container) {
    if (this.caster.isPlayerControlled) {
      //Show some UI
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
