export class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 50;
    this.onComplete = config.onComplete || (() => {});

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");

    if (list.length) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
      this.onComplete();
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span").forEach((s) => {
      s.classList.add("revealed");
    });
  }

  init() {
    let characters = [];

    this.text.split("").forEach((char) => {
      // Creating each span of individual characters
      let span = document.createElement("span");
      span.textContent = char;
      this.element.appendChild(span);

      characters.push({
        span: span,
        delayAfter: char === " " || char === "\n" ? 0 : this.speed,
      });
    });

    if (!characters.length) {
      this.isDone = true;
      this.onComplete();
      return;
    }

    this.revealOneCharacter(characters);
  }
}
