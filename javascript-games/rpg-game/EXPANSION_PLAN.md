# RPG Game Expansion and Improvement Plan

This plan is designed for sequential execution by an AI coding agent. Each task is intentionally scoped to be achievable in one focused implementation pass.

## How to Execute

1. Complete tasks in order.
2. After each task, run a quick smoke test (load game, move, interact, battle if relevant).
3. Commit each task independently.
4. Do not start the next task until the current Definition of Done is satisfied.

## Phase 0: Stability and Baseline (Foundation First)

### Task 01 - Add project health baseline
- Goal: Create a repeatable baseline for quality checks.
- Scope:
  - Add a short developer checklist section in README or a new DEV_NOTES file.
- Work:
  - Document manual smoke test flow: title screen, load/new game, map transition, NPC dialog, battle, save/load.
  - Document where core systems live (maps, events, battle, UI).
- Definition of Done:
  - Baseline checklist exists and can be followed by another developer.

### Task 02 - Fix obvious data integrity issues in enemies
- Goal: Remove key collisions and naming errors in enemy definitions.
- Scope:
  - content/enemies.js
- Work:
  - Resolve duplicate object keys (for example duplicate Mick2 key).
  - Normalize enemy id names and display names.
- Definition of Done:
  - No duplicate keys in enemy data object.
  - All referenced enemy ids resolve correctly in battles.

### Task 03 - Add runtime guards for missing content references
- Goal: Fail gracefully if content id is missing.
- Scope:
  - Battle/Battle.js
  - Battle/Combatant.js
  - GameEvent.js
- Work:
  - Add defensive checks for missing animal/action/enemy ids.
  - Show readable text message instead of crashing.
- Definition of Done:
  - Invalid content references no longer crash the game loop.

### Task 04 - Standardize event type naming and typo safety
- Goal: Prevent future event wiring bugs.
- Scope:
  - GameMap.js
  - GameEvent.js
- Work:
  - Preserve backward compatibility for existing typo method name (startCustscene).
  - Add correctly named alias and migrate internal calls.
- Definition of Done:
  - Both old and new method names work, with new name used internally.

### Task 05 - Introduce lightweight debug logging toggle
- Goal: Improve troubleshooting without noisy production logs.
- Scope:
  - utils.js
  - Battle/BattleEvent.js
  - game.js
- Work:
  - Create a central debug flag.
  - Route console logging through it.
- Definition of Done:
  - Debug output can be enabled/disabled from one place.

## Phase 1: Dialogue and Narrative System Upgrades

### Task 06 - Add speaker metadata to text events
- Goal: Make dialogue presentation richer.
- Scope:
  - GameEvent.js
  - TextMessage.js
  - styles/TextMessage.css
- Work:
  - Support optional speaker name and portrait in textMessage events.
  - Render speaker label in message UI.
- Definition of Done:
  - Existing dialogue still works.
  - New dialogues can show speaker name.

### Task 07 - Add multiline and pacing controls for dialogue
- Goal: Improve readability and narrative rhythm.
- Scope:
  - TextMessage.js
  - RevealingText.js
- Work:
  - Support line breaks and per-message reveal speed.
  - Add optional auto-advance delay for short system messages.
- Definition of Done:
  - Dialogue supports multiline formatting and custom speed.

### Task 08 - Add branching choice dialogue event
- Goal: Introduce player choice in conversations.
- Scope:
  - GameEvent.js
  - KeyboardMenu.js
- Work:
  - Implement choiceMenu event with options and callbacks.
  - Options can add flags, give items, start battle, open shop, or continue text.
- Definition of Done:
  - One NPC can present at least two meaningful branches.

### Task 09 - Add conditional templating tokens in dialogue
- Goal: Personalize and vary NPC text.
- Scope:
  - GameEvent.js
- Work:
  - Add token replacement for player stats, coins, badges, lineup lead animal name.
- Definition of Done:
  - Text can reference dynamic player state via tokens.

### Task 10 - Create dialogue writing guide and style rules
- Goal: Maintain consistency as content scales.
- Scope:
  - New doc under rpg-game folder.
- Work:
  - Define NPC voice style, sentence length, tutorial tone, and escalation rules.
- Definition of Done:
  - Content authoring guide exists and is used for new map dialogue.

## Phase 2: Quest Framework and Story Progression

### Task 11 - Add quest data model in player state
- Goal: Enable tracked multi-step objectives.
- Scope:
  - state/PlayerState.js
  - Progress.js
- Work:
  - Add quests dictionary with states: locked, active, completed, failed.
  - Persist quest progress in save/load.
- Definition of Done:
  - Quest state survives reload.

### Task 12 - Add quest event types
- Goal: Manage quests through map events.
- Scope:
  - GameEvent.js
- Work:
  - Add events: startQuest, advanceQuestStep, completeQuest, failQuest.
- Definition of Done:
  - Quest state can be manipulated by cutscenes and NPC interactions.

### Task 13 - Add minimal quest log UI
- Goal: Give players objective visibility.
- Scope:
  - PauseMenu.js
  - styles/Menus.css
- Work:
  - Add a quest section listing active quests and next steps.
- Definition of Done:
  - Player can view active objectives from pause menu.

### Task 14 - Build main story chapter structure
- Goal: Turn storyline draft into implementable chapter flow.
- Scope:
  - storyline.txt
  - content/maps/*.js
- Work:
  - Break story into chapters with gating flags and chapter-end battles.
- Definition of Done:
  - Main arc has clear intro, mid, climax, and finale progression flags.

### Task 15 - Implement Chapter 1 end-to-end
- Goal: Deliver one polished narrative loop.
- Scope:
  - 2 to 4 map files in content/maps
  - content/enemies.js
- Work:
  - Add introduction, first objective, one boss battle, reward and return scene.
- Definition of Done:
  - Fresh save can complete Chapter 1 without dead ends.

## Phase 3: World and Content Expansion

### Task 16 - Build map content backlog with progression levels
- Goal: Organize content production.
- Scope:
  - New map backlog doc.
- Work:
  - Define target biome/town per map, enemy level band, rewards, and story beat.
- Definition of Done:
  - At least 8 planned maps with purpose and difficulty target.

### Task 17 - Add two new outdoor maps
- Goal: Expand exploration space.
- Scope:
  - content/maps.js
  - content/maps/new map modules
- Work:
  - Add new maps with transitions, walls, and environmental NPCs.
- Definition of Done:
  - Player can traverse from existing world into both maps and back.

### Task 18 - Add one dungeon style map
- Goal: Add challenge pacing and encounter density.
- Scope:
  - content/maps/new module
- Work:
  - Build linear challenge route with at least 3 trainers and one miniboss.
- Definition of Done:
  - Dungeon is completable and rewards progression flag.

### Task 19 - Add environmental interactions
- Goal: Make exploration more reactive.
- Scope:
  - GameObjects/Chest.js
  - content/maps/*.js
- Work:
  - Add inspectable objects (signs, crates, campfire, statues).
  - Add chest variants with one-time rewards.
- Definition of Done:
  - At least 10 world interactions added across maps.

### Task 20 - Add map-specific ambient dialogue pools
- Goal: Reduce repeated NPC lines.
- Scope:
  - content/maps/*.js
- Work:
  - Add multiple scenario lines based on story flags and player progress.
- Definition of Done:
  - Key NPCs have at least 3 progression-aware dialogue states.

### Task 21 - Add daily rematch trainer system
- Goal: Create repeatable gameplay loop.
- Scope:
  - GameEvent.js
  - content/enemies.js
  - content/maps/*.js
- Work:
  - Add cooldown/rematch flags and stronger rematch teams.
- Definition of Done:
  - Trainers become rematchable after condition is met.

## Phase 4: Battle Depth and Balance

### Task 22 - Move type chart to centralized data
- Goal: Simplify balancing and future type expansion.
- Scope:
  - content/typeChart.js (new)
  - Battle/BattleEvent.js
- Work:
  - Replace switch logic with lookup table.
- Definition of Done:
  - Damage multiplier logic reads from centralized chart.

### Task 23 - Add accuracy and evasion mechanics
- Goal: Increase tactical variance.
- Scope:
  - Battle/Combatant.js
  - Battle/BattleEvent.js
  - content/actions.js
- Work:
  - Add base accuracy for actions and evasion modifiers.
- Definition of Done:
  - Miss events occur correctly and are messaged to player.

### Task 24 - Add critical hits and variance range
- Goal: Improve battle feel.
- Scope:
  - Battle/BattleEvent.js
- Work:
  - Add critical chance and small random damage range.
- Definition of Done:
  - Critical and normal hits are both possible and visibly communicated.

### Task 25 - Add at least three new status effects
- Goal: Expand build variety.
- Scope:
  - Battle/Combatant.js
  - content/actions.js
- Work:
  - Add statuses such as stunned, soaked, thorn-guard.
- Definition of Done:
  - New statuses apply, tick, and expire correctly.

### Task 26 - Add action cooldown or energy cost system
- Goal: Prevent strongest move spamming.
- Scope:
  - Battle/Combatant.js
  - Battle/SubmissionMenu.js
  - content/actions.js
- Work:
  - Add reusable cost model and disabled action UI state.
- Definition of Done:
  - Player must rotate actions instead of repeating strongest move every turn.

### Task 27 - Improve enemy AI move selection
- Goal: Make AI less random and more strategic.
- Scope:
  - Battle/TurnCycle.js or AI helper module
- Work:
  - Prefer effective attacks, defensive actions at low HP, and finishing moves.
- Definition of Done:
  - AI behavior changes based on board state.

### Task 28 - Add team synergy passives
- Goal: Reward roster building.
- Scope:
  - state/PlayerState.js
  - Battle/Battle.js
- Work:
  - Add passive bonuses for lineup composition patterns.
- Definition of Done:
  - At least 3 passive synergies affect battle outcomes.

### Task 29 - Rebalance all animals and enemy teams
- Goal: Improve progression curve.
- Scope:
  - content/animals.js
  - content/enemies.js
  - content/actions.js
- Work:
  - Set target time-to-defeat and expected level per map region.
- Definition of Done:
  - No severe power spikes or unwinnable mandatory battles.

## Phase 5: Progression, Economy, and Rewards

### Task 30 - Expand item catalog
- Goal: Add meaningful pre-battle and in-battle choices.
- Scope:
  - content/actions.js
  - ShopMenu.js
- Work:
  - Add consumables for buffs, debuff cures, revive-lite, and utility.
- Definition of Done:
  - Shop inventory supports at least 8 item types.

### Task 31 - Add equipment or charm system
- Goal: Add long-term build expression.
- Scope:
  - state/PlayerState.js
  - Battle/Combatant.js
  - PauseMenu.js
- Work:
  - Add equipable charms granting passive modifiers.
- Definition of Done:
  - Player can equip and unequip charms with visible effects.

### Task 32 - Add recruit and release flow
- Goal: Improve roster management.
- Scope:
  - CraftingMenu.js or new roster menu
  - state/PlayerState.js
- Work:
  - Add confirmations, lineup safety checks, and roster cap.
- Definition of Done:
  - Player can manage a larger stable without losing key progression animals accidentally.

### Task 33 - Add badge gated world progression
- Goal: Strengthen sense of advancement.
- Scope:
  - content/maps/*.js
  - GameEvent.js
- Work:
  - Require badges for specific zone entrances or NPC challenge tiers.
- Definition of Done:
  - Story and world unlock flow tied to accomplishments.

### Task 34 - Add reward bundles for major milestones
- Goal: Make quest and boss completion memorable.
- Scope:
  - GameEvent.js
  - content/maps/*.js
- Work:
  - Bundle coins, items, badges, and recruit options for chapter completions.
- Definition of Done:
  - Major wins grant multi-part rewards and acknowledgment dialogue.

## Phase 6: UI, UX, and Accessibility Improvements

### Task 35 - Improve HUD readability and hierarchy
- Goal: Make battle and field state easier to parse.
- Scope:
  - Hud.js
  - styles/Hud.css
- Work:
  - Add icon labels, stronger spacing, and clear stat grouping.
- Definition of Done:
  - HUD remains readable on desktop and mobile widths.

### Task 36 - Add compact battle log panel
- Goal: Preserve important combat events.
- Scope:
  - Battle/Battle.js
  - styles/Battle.css
- Work:
  - Keep last N events (hit, crit, status, KO, XP).
- Definition of Done:
  - Player can review recent combat outcomes without missing messages.

### Task 37 - Improve keyboard and touch navigation parity
- Goal: Make menus equally usable across input types.
- Scope:
  - KeyboardMenu.js
  - TouchControls.js
  - styles/TouchControls.css
- Work:
  - Ensure focus states, tap targets, and scroll behavior are robust.
- Definition of Done:
  - All core menus are fully usable via touch and keyboard.

### Task 38 - Add settings menu (text speed, volume placeholder, contrast)
- Goal: Give players control over comfort and pace.
- Scope:
  - PauseMenu.js
  - Progress.js
  - styles/Menus.css
- Work:
  - Persist settings to save.
- Definition of Done:
  - Settings modify behavior in real time and persist across sessions.

### Task 39 - Improve type and status visual language
- Goal: Reduce confusion during battle.
- Scope:
  - styles/Combatant.css
  - styles/Battle.css
- Work:
  - Add consistent color coding and status badges.
- Definition of Done:
  - Type advantage and status state are obvious at a glance.

## Phase 7: Save, Reliability, and Content Tooling

### Task 40 - Add save versioning and migration logic
- Goal: Prevent old saves from breaking after updates.
- Scope:
  - Progress.js
- Work:
  - Add version number and migration functions.
- Definition of Done:
  - Old save files can be loaded or safely reset with user notice.

### Task 41 - Add soft reset and backup save slot
- Goal: Improve player safety and testing workflows.
- Scope:
  - Progress.js
  - TitleScreen.js
  - PauseMenu.js
- Work:
  - Add second save slot or backup snapshot restore.
- Definition of Done:
  - Player can recover from accidental progress loss.

### Task 42 - Add content validation script
- Goal: Catch broken ids before runtime.
- Scope:
  - New script file under rpg-game (for example tools/validate-content.js)
- Work:
  - Validate maps, actions, animals, enemies, and event types for missing references.
- Definition of Done:
  - Validation reports errors and exits non-zero on invalid content.

### Task 43 - Add lightweight automated smoke tests
- Goal: Reduce regressions in core loops.
- Scope:
  - New test files under rpg-game/tests
- Work:
  - Test battle resolution, status ticks, save/load defaults, and story flag gating logic.
- Definition of Done:
  - Tests run locally and cover critical gameplay systems.

### Task 44 - Add spawn and transition safety checks
- Goal: Prevent softlocks on map entry.
- Scope:
  - GameMap.js
  - content/maps/*.js
- Work:
  - Verify transition destinations are walkable and not blocked.
- Definition of Done:
  - No map transition places hero inside walls or NPCs.

### Task 45 - Add performance pass for large maps
- Goal: Keep frame pacing stable as content grows.
- Scope:
  - game.js
  - GameMap.js
- Work:
  - Optimize update loops and object checks where needed.
- Definition of Done:
  - Stable frame pacing during heavy map scenes and larger NPC counts.

## Phase 8: New Feature Tracks (High-Impact Optional Expansions)

### Task 46 - Add faction reputation system
- Goal: Enable long-tail dialogue and world reactivity.
- Scope:
  - state/PlayerState.js
  - GameEvent.js
  - content/maps/*.js
- Work:
  - Add reputation changes based on battle outcomes, quest decisions, and NPC branches.
- Definition of Done:
  - At least 2 factions affect dialogue and shop prices.

### Task 47 - Add weather and time-of-day map modifiers
- Goal: Increase atmosphere and combat variety.
- Scope:
  - GameMap.js
  - Battle/BattleEvent.js
  - content/maps/*.js
- Work:
  - Apply map-level modifiers that influence encounter style or battle effects.
- Definition of Done:
  - Weather/time context changes at least one battle behavior and one dialogue branch.

### Task 48 - Add procedural encounter tables per region
- Goal: Make exploration less predictable.
- Scope:
  - content/maps/*.js
  - GameEvent.js
- Work:
  - Add weighted random encounter event spaces and level scaling.
- Definition of Done:
  - Region encounters vary while respecting progression level range.

### Task 49 - Add postgame challenge tower
- Goal: Extend retention after main story completion.
- Scope:
  - New map and enemy tiers
  - content/enemies.js
- Work:
  - Add sequential battles with escalating modifiers and unique rewards.
- Definition of Done:
  - Tower can be replayed and tracks best floor reached.

### Task 50 - Add New Game Plus mode
- Goal: Add replay value.
- Scope:
  - Progress.js
  - TitleScreen.js
  - content/maps/*.js
- Work:
  - Restart story while carrying selected progression elements.
- Definition of Done:
  - New Game Plus starts correctly and scales enemy challenge.

## Suggested Milestone Grouping for AI Execution

- Milestone A (Tasks 01 to 10): Foundation + dialogue framework.
- Milestone B (Tasks 11 to 21): Quest system + chapter content + map expansion.
- Milestone C (Tasks 22 to 34): Deep combat + economy + progression.
- Milestone D (Tasks 35 to 45): UX + reliability + tooling.
- Milestone E (Tasks 46 to 50): Advanced optional systems.

## Fast Start Recommendation

If you want immediate momentum, begin with this mini-sequence first:
1. Task 02
2. Task 03
3. Task 06
4. Task 08
5. Task 11
6. Task 15

This unlocks stable content expansion quickly while improving dialogue quality and progression structure early.
