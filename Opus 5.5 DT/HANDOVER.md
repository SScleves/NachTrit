# Handover: where every piece of work stands (24 Oct 2026, updated 14:50 CET)

UPDATE 14:50: Santi merged `world` (PR 2), `map` (PR 3) and the remote agent's `dt/world-pass`
(PR 4) into main. Main is now the merged state and is live. Sections 3 and 4 below still apply,
but start from `main`, not from the old branches. The laptop's evaluation of the merged result is
in `reports/eval-24oct-laptop-gpu.md`.

The laptop agent has stopped all local work. From here the Opus 5.5 DT agent carries the heavy
lifting. This file says exactly where each piece stopped so you can pick it up. Read README.md
first, then this, then BACKLOG.md.

## 1. Branches on GitHub and their state

| Branch | State | What to do |
|---|---|---|
| `main` | Playable, live at https://sscleves.github.io/NachTrit/. Has the atmosphere pass, lamp mechanic, fares, 114 levels (towns 1 to 11), route-board map, 14-panel intro. | Base for every `dt/*` branch. |
| `world` | WIP commit `ccb82ad` on top of main: the composition and props pass, saved as the artist left it when stopped mid-task. Parses, renders on Santi's GPU with 0 errors, luma 64 on Gouda L12. | **Pick this up first among art tasks** (see section 3). |
| `map` | WIP commit `691bc5d`: `map-art.js` (467 lines, new) plus index.html hooks. Paints a diorama map; badges were mid-rewrite when stopped. Parses, no console errors. | Pick up (section 4). |
| `vocab` | Merged into main; nothing pending. | Ignore. |
| `look` | Merged into main (Santi merged PR #1). | Ignore. |
| `fares` | Merged into main. | Ignore. |

Ports on the laptop (not yours, listed so reports make sense): 8765 main, 8770 world, 8771 map.

## 2. What the game looks like right now

Two frames captured on Santi's real Intel GPU are in this folder:

- `state-main-atmosphere-only-gouda-L12-on-santis-gpu.png`: main as deployed. Haze sky, lamp
  cones, warm windows, but houses stand alone with empty fog between them, walls read salmon,
  no trees or skyline, crude zombie and passenger.
- `state-world-branch-gouda-L12-on-santis-gpu.png`: the `world` WIP. Continuous terraces, a
  second row behind, skyline silhouettes (spires, towers, gables) fading into haze, tree cards,
  lantern-style lamps with halos, a fence-peeking zombie with a bucket hat and yellow eyes, a
  canal side with reeds and a bridge, graffiti and shop signs. This is the quality jump Santi
  asked for. It is not finished: walls still flat colour (no brick texture; the materials pass
  never ran), the far skyline cards are a little too uniform, the passenger is still a blob,
  and nothing has been measured for draw calls or fps.

Judge both against `concept-art/D-foggy-village-with-zombies.png`.

## 3. Picking up `world` (backlog B, do before B1 and B2)

1. `git checkout world`, serve it, open `?shot=8&level=12&lane=1` and `?level=3` (dyke) and
   `?level=58` (Zeeland) and `?level=67` (Den Haag), and the harness `node qa/run.mjs 1` and `6`.
   Confirm errors: 0 and that every theme (street, square, shops, dyke, nightshop) still renders:
   the artist was iterating on Gouda and may have left other themes half-dressed.
2. Count draw calls per full frame (the artist's method: `renderer.info.autoReset = false`, one
   `NRstep(1)`, read `renderer.info.render.calls`; `NRinfo().calls` only shows the last composer
   pass). Before the WIP, Gouda L12 was 464 to 508. Stay under about 2x; merge geometry where it
   grew.
3. Finish the composition brief from the v3 workflow (copied below in section 7): three layers
   behind the houses on EVERY theme and town, trees, canal side, drawbridge, ground mist in bands,
   lamppost rhythm, the landmark on the horizon.
4. Run the materials pass (section 7): dark textured brick so only windows are warm, roof tiles,
   cobbles, wood, window texture with curtains and plants. Keep roofs and walls dark enough to be
   silhouettes in fog.
5. Then the cast (backlog B2) and town identity (B1).
6. Rebase or merge `main` into `world` before you open the PR. The laptop agent checks on the GPU
   and merges. In your report list every rendering change (shader, material, post) so the GPU
   check can target it; the headless harness cannot see GPU-only bugs.

## 4. Picking up `map` (concept-art/F-map-concept.png)

What exists (`map-art.js`, `window.NRMAP`): a seeded painter that draws the country as land in
dark water with coastline, IJsselmeer, Flevoland, rivers; scatters trees, poplars, windmills,
cows, tulip fields, boats; paints a glow vignette per town; the badges, number chips, names,
CEFR bands, cyclist, title, subtitle, footer and Endless button all render in the concept's
typography. Screenshot of the state as stopped: `state-map-branch-laptop.png` (and `-phone.png`)
if present in this folder.

What is wrong against the concept, in order: (1) the country outline is a rounded blob, not the
Netherlands; it needs real coastline coordinates (simplified to 150 to 300 points, with the
Wadden islands, Zeeland's estuaries, the Afsluitdijk) projected with the same projection the
town positions use (`nodePositions`, now in `src/map.js`, which warps the Randstad apart so nothing
overlaps; keep that and apply the same warp to the outline); (2) the land has no raised edge;
the concept is a diorama with a visible darker side face and water reflections under it;
(3) the route is straight dashed lines across the whole country; it should follow the roads of
the concept, town to town in tier order with gentle curves, lamp dots along it; (4) town
vignettes are small blobs; each needs a silhouette built from the town's landmarks (Gouda cheese
wheels, Kinderdijk mills, Texel lighthouse beam, Nijmegen's lit arched Waalbrug, Groningen's
Martinitoren, Utrecht's Dom, Den Haag's big church, Urk harbour with kotters, Amsterdam gabled
canal houses, Maastricht churches and bridge, Zeeland harbour, Rotterdam cranes and the
Erasmusbrug, Alblasserdam a dyke village with the home); (5) the badge rewrite was mid-way:
check locked, unlocked, current (green house ring) and saved states, and keyboard riding.
Keep everything in `map-art.js` plus the existing map functions; paint once per resize and
cache, only the glow pulse and the cyclist animate.

## 5. Content state

- Levels 1 to 114 are on main, audited and spot-checked. Validator clean.
- Nijmegen (115 to 122) and Amsterdam (123 to 130): yours (backlog C1). `content/pending/L118.js`
  and `L122.js` are unaudited drafts.
- The validator and dump tools now read `content/new/*.js` and `content/extra/*.js` directly;
  the bundles are rebuilt with `node qa/build-content.mjs` and must be committed (a CI check
  for freshness is backlog D3).
- Rule ids for comparison were unified to `vergelijk`; before inventing a rule id, grep
  `window.RULES`.
- Error class that passes two audits: distractors that are valid Dutch (reflexives with an
  object, infinitive order after modals, word-order swaps). The Urk run also showed writers
  drilling separable verbs in sub-clauses at tier 8 although the fence puts that at tier 10, and
  "Ik ben laat" where Netherlands Dutch says "te laat". Hunt for these on purpose.

## 6. Lamp and night mechanic, as measured

`TUNE = { drain: 2.8, wisp: 2.0, right: 3, cap: 0.6, fast: 1 }` in `src/lamp.js` (drain was 2.5 until 11 Nov; `qa/test/lamp.test.mjs` checks this line against the code). Drain per
second is `readK * min(lampDecay, cap) * drain * (0.6 + 1.1 * nightDepth())`, where `nightDepth()` runs 0 to 1 over the
level and `readK` is 1 on open road and `S.slow / 0.85` while a fork is armed (slowing to read costs lamp in proportion
to the speed; 0 while the first gate holds). Right answer refuels `right + min(streak,4)*0.3` (+`fast` after the go key);
a wisp gives `wisp`. The scene darkens with nightDepth (hemisphere 0.6 to 0.2, fog density up, town light decals down
45 percent; wisps keep full strength). Bot results on 11 Nov (`qa/dt/lamp-balance.mjs --gpu`, always-right autopilot,
two runs each; ignore runs vary a lot):

| Level | collects wisps | ignores wisps |
|---|---|---|
| 1 (Alblasserdam) | finishes, 97 and 97 left | finishes, 70 and 90 |
| 11 (Kinderdijk) | finishes, 92 and 61 | five runs: dies 18/20, finishes 2, 3, 22, 41 |
| 58 (Zeeland) | finishes, 60 and 58 | dies 17/20 and 18/20 |
| 75 (Rotterdam) | finishes, 73 and 51 | dies 17/20 twice |

Keep this balance when you add power-ups or hazards; re-run the bot (load `qa/lampbot.js` in the
page, then `__sim(name, collectWisps, msBudget)` in chunks under 30 s per call). `node qa/ride.mjs 1,75`
and `node qa/ride.mjs 58,75 --ignore` give the same rides step by step, seeded, on any machine.

## 7. The art briefs the stopped artists were working from

Composition: build, per theme, three layers behind the street row: a second row of houses
behind the first, lower and fainter; flat dark silhouette cards of the town's skyline far back
(spire, mill with lit windows, crane, tower, treeline, chosen from LANDMARK and the town id),
layered at two or three distances so nearer cards are darker and farther paler; the sky band
above. Tree silhouettes (the tall tree in D's left foreground, rounded trees mid-distance) as
canvas cards or merged blobs. The canal side of the reference where the theme has water: water,
reeds, mooring posts, a wooden drawbridge with counterweight beam and a tiny figure, a moored
boat. Ground mist in two or three bands at different distances, soft round gradients, never
hard-edged ellipses. Regular lamppost spacing so the eye follows them into the fog. The landmark
on the horizon like D's windmill. A slightly lower, closer chase camera that keeps the road
readable; keep the dolly-zoom and reaction-shot camera behaviours.

Props: shutters, cellar windows, chimneys and gutters, hanging shop signs, bikes chained to
stoop railings, a cat in an occasional lit window, tulip planters, picket fences and hedges,
bikes in rows against railings and lampposts, bins, crates, black Amsterdammertje bollards,
benches, blue round bike-lane signs, wooden fingerposts, boats and mooring posts, reeds, a white
duck. Two lamp styles (slim modern flat head in newer towns, classic lantern in old centres).
Zombies: the fence peeker by lit windows, tiny shamblers far down the street, the sheet's
variants. Town words feed graffiti and shop signs (make allWords and SHOP_SIGNS town-aware);
town landmarks appear as named props.

Materials: canvas textures generated once at startup and shared: brick courses with mortar in
each town's brick colour, roof tiles with slight variation, cobbles and pavement slabs, wood
grain for fences, boats and the drawbridge, grime at wall bases, damp darkening toward the
pavement, rust on lamp posts. Through `Mat({ map })` keeping the toon look and the cool shadow
tint. Windows: a two-tone frame-plus-glass texture, some curtains, a plant on the sill, glass
emissive amber where lit so the halos line up. Textures 256 or 512. Walls and roofs dark enough
to read as silhouettes in fog.

Engine rules that constrain all three: exactly four lights, nothing added or removed; additive
sprites, cones and decals for anything light-like; never read a render target being written;
no per-frame allocations in update(); ribbons untouched; draw calls under 2x.

## 8. Things Santi has said that are standing orders

- "Detail behind the houses, so it's not only house and then pitch black in the back."
- "The research in the towns must be visible in the world." (towns.js words and landmarks)
- "In Amsterdam I also want to see the red light district." Clean and funny.
- "Make it look really really close to the concept art, and use the GitHub repos as code
  examples" (PhiloLabs/fable51-worlds: kyoto-higashiyama and death-star-trench-run; a16z-infra/
  ai-town and ceresOPA/Alicization-Town for character and map ideas). See REFERENCE-REPOS.md: URLs, what to study in each, and local copies of the key files in
  reference-code/.
- "The lights need to dim as it progresses, otherwise there's no point capturing lights."
- "Each joke should have its own frame" in the intro (done: 14 panels; panels 4 to 6 unpainted).
- "The map should be clearer about difficulty, with a rideable bike between towns" (done as
  the route board; now being redrawn to the concept).
- "Writing mode so we can also write" (backlog A2).
- Netherlands Dutch; no exclamation marks; dry humour; Santi's own life in the content.
- Back up constantly; push every verified change; keep the laptop playable at 60 fps.

## 9. The safety net (phase 1, branch `dt/tests`, 11 Nov 2026)

- `npm test`: the version check, `npm run validate` (bundles, validator, fork, distractor and thread audits) and the
  unit tests in `qa/test` (`node --test`, no browser). About 10 s. CI (`.github/workflows/ci.yml`) runs it on every
  push to `main` and `dt/*`, then rides levels 1 and 75 on SwiftShader.
- `node qa/ride.mjs <levels>`: the step-driven ride. It serves its own tree, seeds `Math.random`, holds the game's
  loop and runs timers on a virtual clock, so a seed gives the same ride on a slow or busy machine. Compare numbers
  from the same browser: Chrome (`--gpu`) and Playwright's Chromium measure sign text a little differently.
- `node qa/intro-sheet.mjs`: the 14 intro shots at t=2 and t=6 on the GPU, one contact sheet, checks for errors, the
  riding dogs (8 and 14 only), his torso in shot 9 and a luma band per frame (`qa/intro-bands.json`). Run it after any
  change to the rider, the dogs or `bike` children, and look at the sheet.
- `src/`: the pure rules the game imports and the tests share (`tasks.js`, `reading.js`, `lamp.js`, `forks.js`,
  `voice.js`). Change a rule there, not in a copy. Since phase 2 the rest of the engine lives next to them (section 10).
- `npm run types`: `tsc` over `src/`, part of `npm run validate`. Files that start with `// @ts-check` are checked (the
  five pure modules and `src/types.js`, which holds the JSDoc types of a level, the six item kinds, a fork, an entry, a
  town and the ride state).

## 10. The code layout (phase 2, branch `dt/split`, 11 Nov 2026)

`index.html` is the markup, the styles and the classic scripts (content, towns, intro panels and shots), then one module:
`src/main.js`. All of the game's code is in `src/`, in modules of 38 to 439 lines. Report: `reports/dt-split.md`.

`src/main.js` is the hub. It holds no code. It imports and re-exports the modules in the order their code ran when it was
one script:

| Module | What it holds |
|---|---|
| `engine.js` | which renderer runs, three.js and its addons, the legacy light units patch, the constants and helpers (`$`, `clamp`, `rnd`, `pick`, `FARES`) |
| `render-nodes.js` | the opt-in node path (`?renderer=webgpu`): NODEFX, the node post chain |
| `render.js` | renderer, scene, camera, the four lights, the WebGL post chain, `render()` |
| `sky.js`, `materials.js` | the painted sky dome and aurora; `Mat`, `GlowMat`, `glowTex`, `M` |
| `road.js` | road textures, the ribbons, `bend`, the hills |
| `props.js`, `kit.js` | `PM`, `PG`, the street light glows; the merged kit, `MODELS`, the sign atlas |
| `furniture.js`, `houses.js`, `backdrop.js` | street furniture, the town style and look (`townId`, `T3`); houses and their props; landmarks and what stands behind the street |
| `scenery.js` | the themes and `buildScenery` |
| `models.js` | the .glb loader and the kit and clone helpers |
| `rider.js` | the bike, the rider model, the dogs, `riderTick`, his face, the passenger, the follower, and the rider API (`W.rider`) |
| `signs.js`, `cast.js`, `zombies.js` | sign labels and spawn geometry; the passengers; the dead, obstacles and wisps |
| `state.js` | `S`, the night depth, `L`, `LANE_X`, speeds, stars and scores |
| `plan.js` | the planner and fork placement |
| `hud.js`, `audio.js`, `speech.js`, `input.js` | the card and toast; the synthesised sounds; the voice files and speech fallback; steering and the go key |
| `intro.js`, `cine.js` | the painted intro, title and level cards; the 3D shots and the `W` handle |
| `map.js`, `flow.js`, `wallet.js` | the map and mission card; a ride's start, end and fork verdict; paying |
| `debug.js` | the `window.NR*` hooks (`NRW` stays in `cine.js`, `NRmapBike` in `map.js`, `NRTK` in `scenery.js`) |
| `loop.js` | `update()`, the animation loop, the warm-up and the boot (`?map`, `?cine`, `?shot`, `?level`) |

Rules for working in it:
- **The order is the run order.** Random draws, scene objects and their ids are made in this order, which is what keeps a
  seeded ride identical. A new module goes into `main.js` at the point where its code should run.
- **Imports.** A module imports what an earlier module defines directly from that module, and imports what a later module
  defines from `./main.js` (the hub). It also imports the module before it, even if it uses nothing from it: with top-level
  `await` in `engine.js`, `render.js` and `loop.js`, that import is what keeps the modules running in order.
- **Writing another module's variable.** An imported binding is read-only, so a module that owns a `let` other modules change
  exports a setter next to it (`setL`, `setLaneX`, `setSpeeds`, `setTownId`, `setTownStyle`, `setHills`, `setHillPhase`,
  `setBehind`, `setDPR`, `setMSAA`, `setToastT`, `setIntroSeen`, `setCineFrozen`, `setLampHinted`, `setFaceState`,
  `setRackGhost`). Assigning an imported name throws only when that line runs, so search before you write one.
- **Versions.** Every import between modules carries `?v=<NR_VERSION>`; `check-versions` checks and bumps them in `src/` as
  in `index.html`. A module imported with two different URLs runs twice.
- **The intro and the rider.** Shots pose him only through `W.rider` (`pose('ride' | 'seated' | 'standing' | 'hidden')`,
  `show`, `showBike`, `showLamp`, `showDogs`, `coat`, `head`, `lens`, `halo`, `restore`), documented in
  `intro3d/README.md`. A shot that wants the dogs says `dogs: true`. `restore()` runs after every shot's `dispose`. After a
  change to the rider, still shoot all 14 (`node qa/intro-sheet.mjs`).
- `qa/voice-batch.mjs` reads the fallback panels and the `speak('...')` lines from `src/` too.

## 11. The learning core, engine half (phase 3a and 3d, branch `dt/learning-core`, 11 Nov 2026)

Report: `reports/dt-learning-core.md`. What a wrong answer now does, and the rules to keep when you touch it:
- **Returns** (`src/review.js`, pure; wired in `src/flow.js` `sendBack`): when the ride of a missed item is over, a copy of
  it (`again: 1 | 2`, `origin`) goes back in `S.queue` after 3 to 5 other forks (`returnSlot`: the unanswered gates on the
  road count first, then the queued entries). A second miss of the same item comes back in the last quarter of the ride.
  At most twice per item, at most 6 a ride (`AGAIN`). A miss on the last entry comes back right away (the queue is empty).
  If the finish sign is already planned, `unplanFinish` (`src/plan.js`) takes it away and the planner goes on from its
  run-in, so the return rides before THUIS.
- **A return never counts and never kills.** It pays half fare (`FARES.halfFare`), carries the "again" tag on the card,
  and does not touch `S.good`, `S.bad`, `S.delivered`, `S.souls`, `S.wrongRow`, the words list or the stars (its verdicts
  are in `S.learn`). Answered wrong it costs no lamp. Its road is review road (`S.reviewRoad`, [from, to) spans): the
  filler there is empty (no wisps, no obstacles), the lamp does not drain (`readK` 0), a hit that drifts onto it costs no
  lamp, and the night does not deepen (`nightDepth` uses `S.dist - S.reviewM`). Keep these when you add power-ups or
  hazards: the lamp balance is only unchanged because a ride with no misses never makes review road.
- **The why card** (`whyCard`, `endWhy` in `src/hud.js`): a wrong answer (first ride or return, every task) keeps the card
  up with what he rode struck out, the right form in its sentence, the why line and the fare, for `whyBudget(w)` s
  (`src/reading.js`: 0.35 s a word, 3 s floor). While `S.whyT > 0` the bike targets `L.forkSlow`, stops 1 m short of the
  next gate's `legD`, the next gate does not arm and a passenger pickup does not show its card (the gate shows it after),
  and the lamp does not drain. The go key ends it (`goNow` in `src/input.js`). A right answer keeps the short toast.
- **The end card** (`missedHtml` in `src/flow.js`, `groupMisses` and `weakLine` in `src/review.js`): every missed fork
  once (`S.missList`), grouped by task label, the weakest rule first and named in one line (misses x share missed on
  first rides, from `S.tally`), each with a speaker button (`speak(..., force)` plays even with the voice off), the
  sentence with the right form marked, what he rode, the why line, and how its return went. When it shows, the vault log
  textarea hides; "Copy mistakes" still copies it.
- **Checks.** `node qa/ride.mjs <levels> --miss K` prints the returns (forks between, full and paid fare, verdict), metres
  of review road, lamp lost on it and under the why cards (both must be 0), and each fork's legible time against its budget
  split by "right after a why card". `--shots --gpu` saves the first why card and the first "again" card. A ride with no
  misses must stay identical to the frame: compare the report JSON field by field, not only the table.

## 12. The save and the learner model (phase 4, branch `dt/save`, 11 Nov 2026)

Report: `reports/dt-save.md`. What the game keeps about a player, and the rules to keep when you touch it:
- **One save.** `nachtrit.save` holds `{ v, ride, stars, scores, flags, settings, items, rules }` (`src/save.js`, pure). It is read
  once in `src/state.js` (`SAVE`); `progress` and `scores` are `SAVE.stars` and `SAVE.scores`, the same objects. Write with
  `persist()`; a one-time flag with `flag(name)` / `setFlag(name, v)` (`intro` 1 short / 2 full, `taught`, `go`, `lamphint`,
  `unlock`, `lost`). Nothing in `src/` touches `localStorage` except `src/save.js` through the store `state.js` passes in.
- **Old keys, one version.** `nachtrit.progress`, `.scores`, `.intro`, `.taught`, `.go`, `.lamphint`, `.unlock`, `.lost` are
  read on every load and merged in (higher number wins), and written next to the save, so an older page and the qa tools that
  seed `nachtrit.progress` still work. In the next version: stop the mirror in `writeSave` and keep only the first migration.
  Everything stays numbers.
- **Learner model** (`src/learn.js`, pure): item key = 36 bits of `voiceId('', text)` in base 36, where text is the entry's
  Dutch (`entryText` in `src/forks.js`, the same nl `itemToEntry` gives). Record `[box, seen, right, last ride]`; right on the
  first try +1 box, wrong to box 1; intervals 1, 2, 4, 8, 16 rides. `SAVE.ride` counts level rides (in `start`). `noteLearn` in
  `src/flow.js` notes every fork's rule and each item's first try once per ride, for first rides and review forks, never for
  returns. The save is written at the end card (and on `pagehide`).
- **Spaced review** (`addReview` in `src/flow.js`): only on levels below id 1000 with something in the model. Up to a quarter of
  the deliveries become due items from earlier levels in play order (`selectDue`: box, share right, overdue, order; no
  randomness), at `duePositions`. They are entries with `again: 1, due: true`: everything a return does (tag, half fare, review
  road, no count, no lamp) applies, and `S.deliveriesTotal` drops by their number. With nothing due the ride is untouched to the
  frame: keep `addReview` free of `Math.random` and hashing until it knows something is due.
- **Practice and trophy rides** (`src/book.js`): synthetic levels, id 3000 (practice: no stars, no best score, tier 1 fares) and
  2000 + tier (trophy: `fareK` 2 via `S.fareK` in `src/plan.js`, `hint: null`, 30 deliveries drawn from the whole town).
  `lv.pools` gives each item the wrong options of its own level (`levelQueue`).
- **Checks.** `qa/test/save.test.mjs` (migration from the live keys, junk, file and code round trips, size), `qa/test/learn.test.mjs`.
  `node qa/ride.mjs 1,2,3,4,5 --keep --miss 3 --miss-only 3` rides in one profile and checks that every first-try miss comes
  back as a tagged review fork within two rides. `node qa/dt/save-ui.mjs` does the migration, the word book count and the
  file and code round trips in Chrome, with screenshots.
