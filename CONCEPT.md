# Nachtrit

A horror arcade runner that teaches Dutch grammar. You cycle home across the polder at night.
The dead want to be understood before dawn. Every sentence you get right keeps the lamp lit.

Built from the Dutch vault at https://github.com/SScleves/dutch-lessons. The grammar rules,
the example sentences and the trap list in "Mistakes & Drills" are the content.

## Fused mechanics

- Three-lane runner (Subway Surfers): steer left and right, dodge things, keep speed.
- Fares (Crazy Taxi): pick up a passenger, ride their sentence to the end, deliver.
- Choke-point choice (El Taxico): the road forks into signposts, you ride through the right one.

Everything else, menus, routes, upgrades, waits until riding one sentence feels good.

## The world

- A dyke road across the polder. Mist, canal on the right, windmills turning with no wind,
  dead trees, fence posts. Moonlight, low and blue.
- The bike has a dynamo lamp. The lamp is the health bar and the view distance in one thing.
  It fades on its own, faster when you ride slowly. Correct answers brighten it.
- Something keeps pace behind you. You never see it while you ride. You feel it as a red
  vignette and a heartbeat that quickens when the lamp dims. When the lamp dies the camera
  turns around and you see it. That is the only game over.
- Passengers are the dead: a pale figure on the roadside. A reading fork is a wooden
  signpost in Dutch standing in the mist.

## The loop

1. Ride. Dodge fences, puddles, carts. Never a wall across all three lanes.
2. A passenger appears. You slow down. The card shows their English sentence.
3. The sentence is the road. Each gap is a fork: two or three signposts across the lanes,
   one per lane. Ride through the one you think is right.
4. Correct: lamp up, speed up, the Dutch so far is whispered aloud.
   Wrong: lamp down, mist thicker, the right answer shows in red, the mistake is logged.
5. Last fork done: the full sentence is spoken, a soul light rises, souls +1.
6. Between passengers, reading signposts: a Dutch sentence on the board, three English
   readings on the lanes. Catches moet niet / mag niet, al twee jaar, wel, and friends.
7. Lamp at zero, or three wrong in a row: the turn-around. Then the run summary with the
   mistakes in the vault's log format, ready to paste into Mistakes & Drills.

## Game over is always earned

- Obstacles spawn one per row, never adjacent rows in a pattern you cannot pass.
- A fork never spawns inside an obstacle cluster.
- Hitting an obstacle costs lamp and speed, never the run by itself.

## Rewards

- Short: lamp brightening, speed, the whisper on a correct fork.
- Mid: delivering a passenger, the spoken sentence, the soul light.
- Long: distance and souls per run, later routes per chapter and bike upgrades.

## Camera (three moments)

- Load: wide overhead shot tilted down at the road, then a slow dolly into the chase position.
- Speed: on a streak the camera pulls back and the field of view widens.
- Fork: a slow dolly zoom (Vertigo) as the signposts approach. Time slows a little.
- Death: the camera turns around to look back.

## Content model

See `data.js`. Two kinds:

- build: `parts` is a list of fixed strings and forks. A fork has `o` (options), `a` (index
  of the right one), `r` (rule id) and `w` (one line why, in the vault's voice).
- read: `nl` on the signpost, `o` three English readings, `a`, `r`, `w`.

Rules map to vault notes in `RULES` so a logged mistake links to the note that explains it.

Distractors must be wrong, not merely less common. If a native speaker could say it, it is
not a distractor.

## Difficulty

- Speed ramps with distance (Flappy Bird). Chapters ramp the grammar (Mario).
- Route 1 is the player's own world: Werk, Golf, Thuis, Buren. Later routes follow the
  course chapters H01 to H18 from the vault.

## Tech

- One `index.html`, Three.js from cdnjs, no build step, no imported assets.
- `data.js` holds the sentences. Later a `build-data.py` can generate more from the vault.
- Web Speech API for the Dutch voice (nl-NL system voice). Speech recognition is out for now.
- Works on phone (swipe, tap halves) and laptop (arrows, A/D).

## Later, in order

1. Play it. Fix what is boring before adding anything.
2. More sentences per rule, generated from the vault notes against the schema above.
3. Routes and the level map. Chapter unlocks show which rules they test.
4. Bike upgrades bought with distance: brighter lamp, bell that pushes the follower back.
5. Install as a phone app (manifest, service worker).
