import { utils } from "../utils.js";

export const BattleAnimations = {
  async spin(event, onComplete) {
    const element = event.caster.animalElement;
    const animationClass = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
    element.classList.add(animationClass);

    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClass);
      },
      { once: true }
    );

    await utils.wait(100);
    onComplete();
  },
  async glob(event, onComplete) {
    const { caster, color } = event;
    let div = document.createElement("div");
    div.classList.add("glob-orb");
    div.classList.add(caster.team === "player" ? "battle-glob-right" : "battle-glob-left");
    div.innerHTML = `
    <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${color}" />
    </svg>`;

    div.addEventListener(
      "animationend",
      () => {
        div.remove();
      },
      { once: true }
    );

    document.querySelector(".Battle").appendChild(div);

    await utils.wait(820);
    onComplete();
  },
};
