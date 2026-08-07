# RPG Dialogue Writing Guide

This guide defines how dialogue should be written for map events as content expands.

## Goals

- Keep lines short and readable in the message box.
- Make speaker intent obvious in 1 to 2 lines.
- Teach without over-explaining.
- Escalate tone as story stakes rise.

## Event Authoring Pattern

Use `textMessage` events with optional speaker metadata:

```js
{
  type: "textMessage",
  text: "Your line here.",
  speaker: { name: "Mum", id: "mum" },
  speed: 40,
  autoAdvanceDelay: 700
}
```

Use `choiceMenu` when player intent should branch:

```js
{
  type: "choiceMenu",
  title: "Pick a response",
  options: [
    {
      label: "Ask for advice",
      description: "Get progress guidance.",
      events: [
        { type: "textMessage", text: "Try the arena when you are ready." }
      ]
    }
  ]
}
```

## Voice Rules

- Hero (Sam): direct, determined, practical.
- Mum: warm, protective, emotionally honest.
- Rivals: confident, playful pressure, short taunts.
- Mentors and shopkeepers: clear, useful, low drama.
- System messages: neutral and concise.

## Sentence and Line Length

- Target 45 to 95 characters per line.
- Prefer one idea per line.
- For long thoughts, split with `\n` into two lines.
- Avoid more than two consecutive message boxes for one speaker unless it is a key scene.

## Tutorial Tone

- Explain a mechanic once, then trust the player.
- Replace commands with intentions:
  - Good: "Talk to the animals to recover your team."
  - Avoid: "Press Enter to initiate contextual NPC interaction."
- Pair guidance with a reason:
  - "Heal before the arena. Their lead animal hits hard."

## Escalation Rules

- Early game: personal stakes, simple language, hope.
- Mid game: uncertainty, stronger warnings, tactical hints.
- Late game: urgency, consequences, payoff language.

## Choice Writing Rules

- Option labels should start with an action verb.
- Keep labels under 28 characters when possible.
- Descriptions should clarify outcome before selection.
- At least one branch should provide utility (item, shop, info, or battle).

## Dynamic Token Rules

The dialogue system supports runtime token replacement in text and choice labels.

Available tokens:

- `{PLAYER_COINS}`
- `{PLAYER_BADGES_COUNT}`
- `{PLAYER_BADGES_LIST}`
- `{PLAYER_BATTLES_WON}`
- `{PLAYER_ANIMALS_RESCUED}`
- `{LEAD_ANIMAL_NAME}`

Example:

```js
{
  type: "textMessage",
  text: "You have {PLAYER_COINS} coins and {PLAYER_BADGES_COUNT} badges.",
  speaker: { name: "Mum", id: "mum" }
}
```

## Pacing Defaults

- Normal narrative: `speed: 40` to `55`.
- Urgent or emotional lines: `speed: 30` to `40`.
- System confirmations: `speed: 20` to `35`, with `autoAdvanceDelay: 600` to `1000`.

## Quality Checklist Before Merge

- Speaker metadata set for key story lines.
- No repeated filler lines across nearby NPCs.
- New choice branches have clear outcomes.
- Dialogue fits message box without awkward overflow.
- At least one line in new content uses tokens where relevant.
