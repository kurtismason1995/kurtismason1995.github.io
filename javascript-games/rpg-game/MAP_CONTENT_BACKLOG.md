# RPG Map Content Backlog

This backlog organizes upcoming world expansion maps by progression, purpose, and production priority.

## Design Rules

- Every map must have a clear story purpose, not just extra space.
- Enemy level bands should overlap slightly to avoid sudden difficulty spikes.
- Each map should include one key reward anchor (item, badge progress, recruit, or unlock flag).
- Add at least one return-path shortcut per large outdoor map.

## Planned Map Queue

| ID | Map Name | Biome or Town Theme | Progression Band | Core Purpose | Enemy Level Band | Key Rewards | Story Beat and Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | Bramble Path | Overgrown hedgerow road connecting Home district to eastern fields | Early (post Chapter 1) | Introduce wild encounter pacing and simple route forks | 3 to 4 | 40 to 70 coins, 1 healing chest, recruit hint for Mossboar | Rumors of surviving society scouts. Sets CH2_SCOUT_RUMORS.
| M02 | Millbrook Crossing | River crossing with old water mill and broken bridge | Early to Mid | Teach map interactions (switches or bridge repair) and alternate traversal | 4 to 5 | Bridge Repair Kit item, 1 optional trainer badge token | Rebuild route to farming quarter. Sets CH2_MILL_RESTORED.
| M03 | Copperfield Market | Busy town square with stalls, gossip NPCs, and black market contact | Mid | Social hub for quests, shops, and chapter clues | 5 to 6 | New shop inventory tier, charm crafting materials, side quest unlocks | Learn rival faction plans. Sets CH2_MARKET_CONTACT.
| M04 | Thornwood Edge | Dense woodland perimeter with poison-status trainers | Mid | Add status-pressure encounters and environmental storytelling | 6 to 7 | Antidote-style consumable recipe, 100 to 150 coins | Track stolen breeding notes trail. Sets CH2_TRACKS_FOUND.
| M05 | Quarry Ridge | Stone pit and mineworks with vertical lanes and ambush trainers | Mid to Late | Introduce high defense enemy teams and path risk-reward | 7 to 8 | Durable tank recruit opportunity, ore bundle for upgrades | Rival commander secures resource line. Sets CH2_QUARRY_SECURED.
| M06 | Emberlight Tunnels | Underground lava-lit corridor dungeon | Late | Linear challenge map with miniboss gate and healer scarcity | 8 to 9 | Miniboss badge fragment, rare action scroll, 200 coins | Reveal location of faction outpost. Sets CH2_TUNNELS_CLEARED.
| M07 | Skygrain Plateau | Windy highland farms and cliffside paths | Late | Offer open exploration before chapter boss preparation | 9 to 10 | Speed-focused recruit encounter, advanced satchel loot | Rally allied trainers for final push. Sets CH2_ALLIES_GATHERED.
| M08 | Ironroot Bastion | Fortified faction outpost (chapter boss zone) | Chapter End | Chapter 2 climax with multi-trainer gauntlet and boss battle | 10 to 12 | Chapter badge, 300 coins, milestone reward bundle | Defeat regional commander and reclaim research archive. Sets CH2_COMPLETE.
| M09 | Sunken Granary | Flooded storage ruins with water-typed encounter bias | Optional Mid | Optional challenge for resource farming and lore pickups | 6 to 8 | Water utility items, hidden chest chain, lore codex page | Explains mutation experiments. Sets LORE_GRANARY_ARCHIVE.
| M10 | Verdant Sanctuary | Secret grove refuge for rare animals and pacifist NPC faction | Optional Late | Recruitment and long-term progression hub | 9 to 11 | Rare recruit trials, passive charm components | Unlocks neutral faction alliance path. Sets FACTION_SANCTUARY_ALLIED.

## Suggested Production Order

1. M01 Bramble Path
2. M02 Millbrook Crossing
3. M03 Copperfield Market
4. M04 Thornwood Edge
5. M06 Emberlight Tunnels
6. M08 Ironroot Bastion
7. M05 Quarry Ridge
8. M07 Skygrain Plateau
9. M09 Sunken Granary
10. M10 Verdant Sanctuary

## Content Checkpoints Per Map

- Layout pass: transitions, walls, and return path added.
- Systems pass: NPC scenarios, trainer battles, and interaction objects wired.
- Rewards pass: reward bundle and one-time pickups validated.
- Story pass: chapter or side-story flag hooks verified.
- QA pass: spawn and transition safety tested from at least two entry points.

## Minimum Implementation Contract for Each New Map Module

- Add map export under content/maps/{MapName}.js.
- Register map in content/maps.js.
- Include at least:
  - 2 trainer battles
  - 3 non-battle dialogue interactions
  - 1 one-time reward interaction
  - 1 transition in and 1 transition out
  - 1 progression flag set during first clear
