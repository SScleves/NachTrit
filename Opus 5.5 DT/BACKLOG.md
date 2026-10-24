# Backlog for the Opus 5.5 DT agent

Ordered by weight and by what unblocks the rest. Each item names its branch, what done means,
and how it is verified. Items marked LAPTOP need Santi's GPU or his accounts and are not yours;
they are listed so you know the whole picture. Check `reports/` and the open `dt/*` branches on
GitHub before starting anything, so two agents do not do the same job.

Status at the time of writing (24 Oct 2026): on main are the ride with six fork kinds, the look
pipeline with the atmosphere pass (haze sky dome, fog keyed to the horizon, lamp cones and
pools, window glow, golden wisps, violet toon shadows), the lamp and night mechanic, fares and
euros, the 14-panel intro (panels 4 to 6 are placeholder paintings), the route-board map, and
levels for 11 of 13 towns (1 to 114, audited). In flight on the laptop: `world` (composition,
props, materials passes), `map` (concept-style map), Nijmegen and Amsterdam content.

---

## A. Engine (heaviest, one branch at a time in index.html)

### A1. The code split, with JSDoc types. Branch `dt/split`. DO THIS FIRST.
Everything else that touches the engine waits on it, because today index.html is one 2,300-line
module and two jobs in it collide.
- Keep it a no-build game: native ES modules, `index.html` keeps the markup and imports
  `src/main.js`. Modules: `src/state.js` (S, L, constants), `src/engine.js` (renderer, sceneRT,
  composer, post passes, loop), `src/world.js` (themes, props, houses, landmarks, buildScenery,
  sky, fog), `src/rider.js` (bike, face canvas, passenger variants), `src/zombies.js`,
  `src/forks.js` (plan, placeFork, resolveFork, itemToEntry, levelQueue, dehetBonus),
  `src/hud.js` (card, toast, lanes, wallet, lamp bar), `src/map.js` (route board; coordinate with
  whatever `map` branch has merged by then), `src/intro.js`, `src/audio.js` (speech, chimes),
  `src/save.js` (progress, scores), `src/debug.js` (every window.NR* hook), `src/lamp.js`
  (TUNE, nightDepth, refuel, drain).
- Acceptance: the game plays identically; `node qa/run.mjs` on 1, 6, 11, 41, 58, 75 with
  `errors: 0`; `?post=0`, `?map=1`, `?intro=1`, every debug hook, the intro gallery
  (`intro/gallery.html`) and `fares.test.mjs` all still work; draw calls and frame time unchanged.
- Then: `npm i -D typescript`, a `tsconfig.json` with `allowJs`, `checkJs`, `noEmit`, JSDoc
  typedefs for `S`, the level object, the six item kinds, the fork object, the town object;
  `npx tsc --noEmit` clean and added to `npm run validate`.
- Report the module map and any behaviour you had to change to untangle a cycle.

### A2. Writing mode (the big new feature). Branch `dt/typing`. After A1.
Santi wants to write Dutch, not only steer. ROADMAP.md section 3 has the design; implement it.
- New fork kind `type`: the card shows the English line and a text field; the rider slows to a
  walking pace (forkSlow) while typing; Enter submits; Escape or riding through the fence skips
  and counts as wrong.
- Tolerant matcher: case-insensitive, trims, ignores final punctuation, accepts ij/y and
  accent-less vowels (e, ee for é, etc.), accepts either of two listed spellings, rejects a missing
  article. Show the exact expected line in the why line on a miss, with the differing characters
  marked.
- Dictation variant: the Dutch voice says the line (speakSeq), the player types it. Listen items
  can opt in.
- Pays +50 percent fare. A per-level toggle in the mission card: Steer or Write. Progress saves
  the mode so stars for Write are separate (`nachtrit.progress` stays numbers: use a new key
  `nachtrit.progressType`).
- Keyboard focus rules: the arrow keys must not move the bike while the field has focus; on
  phones the field opens the soft keyboard and the HUD must not be covered (test at 390x844).
- Content: the matcher consumes existing build items (the full sentence) and word items (the
  article plus noun), so no content rewrite is needed; add an `accept: [...]` field to the item
  schema for alternate spellings and update CONTENT-BRIEF.md and the validator.
- Tests: `qa/typing.test.mjs` for the matcher (at least 60 cases, including every tolerance and
  every rejection) and a harness run that types answers through `page.keyboard`.

### A3. Gameplay between the forks (from Santi's DORP sheet, image E). Branch `dt/moves`. After A1.
- Jump (up or W, or swipe up) over fences and low obstacles; slide (down or S, swipe down) under
  bars and the arm of a raised drawbridge. Readable anticipation poses on the rider; a stumble
  on a mistimed move.
- Power-ups as glowing pickups with the sheet's icons: slow motion (tulip), shield from one
  zombie hit (clogs), magnet that pulls wisps for 8 s (coffee cup), double fare for 20 s (flag).
  HUD pill with a timer. Spawn rate per tier.
- The word-learned moment: the first time a word item is answered right in a run, a short card
  in the style of sheet E (word in gold, its pictogram from PICTO, the English meaning, a speaker
  icon that says it). Does not block the ride more than a second.
- Hazards for tier 5 and up: trams and cars with two headlights that take a lane for a stretch
  (sheet E), canal edges on canal themes (riding into the water costs a lamp chunk and a splash).
- Acceptance: harness clean on 1, 11, 58, 75; the lamp bot (`qa/lampbot.js`) still finishes
  levels when it collects wisps; frame time unchanged.

### A4. Save, vocabulary book, practice and trophy rides. Branch `dt/save`. After A1.
- `src/save.js`: one versioned save object (schema version, progress, scores, typing progress,
  words learned with counts and last-seen, settings) with import and export as a JSON file and as
  a short code the player can paste on another device (the live site runs on GitHub Pages, so
  progress is per browser today; this is the fix).
- Vocabulary book screen from the map: every word met, with article, meaning, pictogram, the
  town, a speaker button, and a practice ride that builds a level from the player's weakest 20
  words. Trophy ride per town: all its items, no hints, double fares.
- Acceptance: a round trip export, clear storage, import restores everything; harness clean.

### A5. Town saved, ending, phone, release polish. Branch `dt/ending`. After A3.
- When every place in a town has three stars: the town's dawn (fog lifts to the A reference's
  pale haze, windows all lit, zombies turn back into people who still split the bill, a card with
  the town's rumour resolved as "still unconfirmed"). On the map the town glows (the map branch
  will have a hook for saved towns; use it).
- Amsterdam finale: the language comes home; a last panel set in the intro style (write it to
  STORY.md first, Dutch and English, dry).
- Phone: 320 to 430 px widths, portrait, swipe lanes, tap to go in, the HUD not squeezed (today the
  wallet and lamp pills collide at 320), the soft keyboard with typing mode, `touch-action`,
  no 300 ms tap delay, a home-screen manifest and icon drawn in code (no external assets).
- Ambience: wind, water near canals, a distant church bell per town, zombie groans, bike ticks,
  all synthesised in `src/audio.js` with the Web Audio API (no files), with a mute setting.

### A6. Neural voice. LAPTOP for the key, yours for the code. Branch `dt/voice`.
- Azure Speech, voice nl-NL (pick one warm male, one female for passengers), reading every Dutch
  line in the content into small MP3 or OGG files under `voice/<hash>.ogg` through a batch script
  `qa/voice-batch.mjs` that reads the key from `~/.config/nachtrit/azure.env` and never prints it.
  The game plays the file when it exists and falls back to the browser voice otherwise.
- Santi has to recover his Azure account first; write the script and the fallback now, and run
  the batch when the key appears.

## B. World and map art (the quality jump Santi keeps asking for)

Everything here is judged against `concept-art/D-foggy-village-with-zombies.png` placed next to
a frame from the game. The question is "is this the same picture". The laptop is doing a pass
now on `world`; wait for `reports/` to say it merged, then take the following.

### B1. Town identity, every town distinguishable at a glance. Branch `dt/towns-look`.
- Per town (content/towns.js has the landmarks and words): skyline silhouette cards, landmark
  props, shop signs and graffiti from that town's words, brick palette, lamp style (slim modern
  flat-head lamp in newer towns, classic lantern in old centres), and one unmistakable thing:
  Kinderdijk a row of mills, Gouda the cheese market and the Waag, Zeeland the Deltawerks and
  dunes, Utrecht the Dom and wharf cellars, Den Haag the Binnenhof and the Pier, Rotterdam cranes,
  cube houses and the Erasmusbrug, Urk the lighthouse and kotters, Texel sheep, dunes and the
  ferry, Groningen the Martinitoren and student bikes, Maastricht the Vrijthof and the Sint
  Servaasbrug, Nijmegen the Waalbrug and the Valkhof, Amsterdam canal houses, trams, and De
  Wallen (neon reflections, tourists, bikes, tall locals; clean and funny).
- Acceptance: a contact sheet with one frame per town, Read it and confirm each is identifiable.

### B2. The cast to the concept sheet. Branch `dt/cast`.
- Zombies: tall, thin, hunched, long dangling arms, small head pushed forward, glowing yellow
  eyes with a halo, a five-pose walk cycle (image C), variants with bucket hat, bonnet and long
  skirt, cheese stack, on a bike, over-the-fence peeker by lit windows. Shared geometry.
- Passengers: readable silhouettes and colours (today a white blob), eight variants that match
  the level's place (a student, a fisherman, a Hague civil servant, a Rotterdam docker ...).
- The rider: the orange jacket, no helmet, the face canvas with the existing expressions, the
  two dogs riding along in a crate on the front (bakfiets variant) as a reward for a saved town.

### B3. Intro paintings. Branch `dt/intro-art`.
- `intro/panel-4.js`, `panel-5.js`, `panel-6.js` are clones of panel 3 and must be painted:
  the Flemish poll (a worldwide vote board, Flanders winning), the drunk German tourist (a
  tourist by a canal saying it), the one-cent Tikkie still open (a phone screen glowing in a dark
  room). Use `intro/art.js` (the toolkit), follow ART-BIBLE.md, keep each piece under 3 ms a
  frame (`node intro/shoot.mjs all 2 --bench`). Then a unify pass over all 19 pieces: same
  palette, same grain, same lamp warmth; and a per-town intro scene for the towns that have none.

## C. Content

### C1. Nijmegen (115 to 122) and Amsterdam (123 to 130). Branch `dt/content-nijmegen-amsterdam`.
LAPTOP may already be writing these; check `content/new/` and `content/pending/` on main first.
If not done: follow CONTENT-BRIEF.md and the tier fences, the pattern writer, auditor, spot-check.
Amsterdam is the finale: its eighth level (eigen, "De grachten") ends the game.

### C2. A fourth audit for the error class that gets through. Branch `dt/audit-distractors`.
Scan every build fork in content/ for distractors that are valid Dutch (reflexive verbs with an
object, modal plus infinitive order, word-order swaps a native could say, te or no te). Fix in
place, rebuild bundles, validator clean. Report counts per level.

### C3. More item kinds. Branch `dt/content-kinds`.
Picture read (a pictogram, pick the Dutch word), number listen (hear a price, pick it), the
"split the bill" item (a bill, say the share in Dutch numbers), rumour items that teach the
town's local word. Validator and CONTENT-BRIEF.md updated with each.

### C4. Levels.md and in-game help. Branch `dt/docs`.
A one-screen "how to play" in the game, the rules of the lamp, fares, tips and stars; README.md
rewritten for the public repo (the current one predates everything).

## D. QA and tooling

### D1. Harness speed and GPU parity. Branch `dt/harness`.
`qa/run.mjs` runs at 2 to 12 fps under SwiftShader. Add a fast mode that steps the simulation
with `NRstep` instead of waiting real time, one-shot frame capture for a list of levels, a
contact-sheet generator against the reference PNGs with a luma readout, and a `--profile` that
reports draw calls, triangles, programs and the slowest update() calls.

### D2. Unit tests for the data layer. Branch `dt/tests`.
`levelQueue`, `itemToEntry`, the fare maths (exists), the matcher (A2), save round trips (A4),
`nodePositions` (no overlaps at 320, 768, 1280 widths), the validator against a corpus of known
bad levels.

### D3. CI. Branch `dt/ci`.
A GitHub Actions workflow: validator, unit tests, bundle freshness (`build-content.mjs --check`),
tsc when A1 lands, a headless smoke run of level 1 with the frame uploaded as an artifact, and
Pages deploy from main. Keep the run under five minutes.

## E. Later, do not start without a note from the laptop

- TypeScript proper and a bundler (Vite needs Node 20 on the laptop).
- Upgrades shop for fares (ROADMAP section 4), the follower dog, hazards beyond trams.
- Multiplayer or leaderboards: not wanted.

---

Done means: branch pushed, `reports/<branch>.md` written, validator and harness clean, and the
report says what the laptop must confirm on Santi's GPU. The laptop agent merges in the order
above unless the report argues for another.
