import { utils } from "../utils.js";

function spawnEffect(caster, className, innerHTML = "", color = null) {
  const div = document.createElement("div");
  div.classList.add("battle-effect", className);
  div.classList.add(caster.team === "player" ? "battle-effect-right" : "battle-effect-left");

  if (color) {
    div.style.setProperty("--effect-color", color);
  }

  div.innerHTML = innerHTML;
  div.addEventListener(
    "animationend",
    () => {
      div.remove();
    },
    { once: true }
  );

  document.querySelector(".Battle").appendChild(div);
}

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
  async quake(event, onComplete) {
    const target = event.target.animalElement;
    target.classList.add("battle-shake-hit");
    spawnEffect(event.caster, "battle-quake");

    await utils.wait(700);
    target.classList.remove("battle-shake-hit");
    onComplete();
  },
  async gust(event, onComplete) {
    spawnEffect(
      event.caster,
      "battle-gust",
      '<svg viewBox="0 0 48 16" width="48" height="16"><path d="M2 8h30" stroke="#d9f4ff" stroke-width="3" /><path d="M16 3h20" stroke="#9fe6ff" stroke-width="2" /><path d="M16 13h20" stroke="#9fe6ff" stroke-width="2" /></svg>'
    );

    await utils.wait(650);
    onComplete();
  },
  async flare(event, onComplete) {
    spawnEffect(event.caster, "battle-flare", "", event.color || "#ff8a24");

    await utils.wait(760);
    onComplete();
  },
  async surge(event, onComplete) {
    spawnEffect(event.caster, "battle-surge", "", event.color || "#34b3ff");

    await utils.wait(760);
    onComplete();
  },
  async eclipse(event, onComplete) {
    spawnEffect(event.caster, "battle-eclipse");

    await utils.wait(760);
    onComplete();
  },
  async bloom(event, onComplete) {
    spawnEffect(event.caster, "battle-bloom", "", event.color || "#63b84d");

    await utils.wait(760);
    onComplete();
  },
};
