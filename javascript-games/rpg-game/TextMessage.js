import { KeyPressListener } from "./KeyPressListener.js";
import { RevealingText } from "./RevealingText.js";

export class TextMessage {
  constructor({ text, speaker, speed, autoAdvanceDelay, onComplete }) {
    this.text = text;
    this.speaker = speaker || null;
    this.speed = typeof speed === "number" ? speed : 50;
    this.autoAdvanceDelay = typeof autoAdvanceDelay === "number" ? autoAdvanceDelay : null;
    this.onComplete = onComplete;

    this.element = null;
    this.autoAdvanceTimeout = null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");
    const hasSpeaker = !!(this.speaker?.name || this.speaker?.portrait);
    if (hasSpeaker) {
      this.element.classList.add("TextMessage--withSpeaker");
    }

    const portraitMarkup = this.speaker?.portrait
      ? `<img class="TextMessage_portrait" src="${this.speaker.portrait}" alt="${this.speaker?.name || "Speaker"}" />`
      : "";
    const speakerMarkup = this.speaker?.name
      ? `<p class="TextMessage_speaker">${this.speaker.name}</p>`
      : "";

    this.element.innerHTML = `
        <div class="TextMessage_content">
          ${portraitMarkup}
          <div class="TextMessage_text">
            ${speakerMarkup}
            <p class="TextMessage_p"></p>
          </div>
        </div>
        <button class="TextMessage_button">Next</button>`;

    // Initialise the typewriter effect on the message
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text,
      speed: this.speed,
      onComplete: () => this.scheduleAutoAdvance(),
    });

    this.element.querySelector("button").addEventListener("click", () => {
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      clearTimeout(this.autoAdvanceTimeout);
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
      this.scheduleAutoAdvance();
    }
  }

  scheduleAutoAdvance() {
    if (this.autoAdvanceDelay === null || this.autoAdvanceTimeout) {
      return;
    }

    this.autoAdvanceTimeout = setTimeout(() => {
      this.done();
    }, this.autoAdvanceDelay);
  }
}
