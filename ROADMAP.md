# Nachtrit roadmap: from a good prototype to a complete game

Written 23 October 2026. Read with `CONCEPT.md` (the loop), `MAP.md` (towns and places),
`STORY.md` (the story and the jokes), `CONTENT-BRIEF.md` (how content is written),
`FARES-SPEC.md` (money), `IDEAS.md` (the backlog this plan absorbs). Every job here is written
so that a Sonnet agent can do it from this file plus the files it names. Section 9 says which
few calls need Opus or Fable instead.

## 0. Where the game stands

Done: the ride, forks of six kinds, the look pipeline, the map with thirteen towns, three
complete towns and three more written (49 levels, audited), the fourteen-panel intro with
paintings, the visible road, the story, the rumours, the harness and the content validator.
In progress: fares (branch `fares`), the intro polish round (branch `look`), the 3D world pass
(branch `world`).
Missing, in order of what the player feels first: anything to do between forks (power-ups,
jump and slide, hazards), writing instead of only steering, seven towns without content, a
voice that sounds like a person, audio, an ending, a save that survives a new laptop, a phone
build, a real GitHub home.

## 1. Rules for every job in this plan

- One job, one branch, one worktree, one server port. Never two jobs in `index.html` at once
  unless they touch disjoint regions named in the brief.
- Every job ends with: `node qa/validate-content.mjs` clean (content jobs), `node qa/run.mjs <level>`
  with `errors: 0` and a look at the frames (engine jobs), a commit on the branch with a message
  ending in the Co-Authored-By line, and a report of decisions left open.
- Nothing merges to `main` without a review pass (section 9) and a check on Santi's GPU with
  `NRbright()` and `NRsnap()` in his Chrome.
- Backup after every merge: `git bundle create /home/santi/dutch-arcade-wt/nachtrit-backup.bundle --all`
  and a copy to `/opt/media/`. Push to GitHub once the remote exists.
- Hard engine rules (each from a real failure): no adding or removing lights at runtime; never
  sample a render target being rendered into; `nachtrit.progress` holds numbers only; no
  exclamation marks anywhere; English UI, Dutch game text; 60 fps on an Intel laptop; no
  per-frame allocations in `update()`.
- Laptop load: at most two agents that run headless browsers at the same time.

## 2. Engine: the code split (do this first, one job)

Goal: `index.html` is 2,100 lines in one module. Split it so agents can work in parallel
without conflicts and so TypeScript becomes possible later.

- Keep it a no-build game: ES modules loaded by the browser, no bundler yet.
- `src/engine.js` (renderer, post pipeline, loop, update), `src/world.js` (props, themes,
  landmarks, scenery), `src/rider.js` (bike, face, passenger), `src/forks.js` (planning,
  placeFork, resolveFork, itemToEntry, levelQueue), `src/hud.js` (card, toast, lanes, wallet),
  `src/map.js` (route board, towns, cards), `src/intro.js` (showIntro, level intros),
  `src/audio.js`, `src/save.js` (progress, scores, vocabulary book), `src/debug.js` (every
  `window.NR*` hook). `index.html` keeps the markup and imports `src/main.js`.
- The shared state object `S` and `L` live in `src/state.js`. Every module imports them.
- Acceptance: the game plays identically (harness levels 1, 6, 11, 41 clean), `?post=0` still
  works, every debug hook works, the gallery works.
- After the split: `npm i -D typescript` and a `tsconfig.json` with `checkJs: true` and
  `allowJs: true` so types come from JSDoc without a build step. Add JSDoc types to `S`, the
  level item kinds and the fork object. Run `npx tsc --noEmit` in the harness.
- Node: Vite 8 needs Node 20; upgrade with `sudo apt install -y nodejs npm` from NodeSource
  only when a bundler is actually wanted (phone build, section 8).

## 3. Writing Dutch: the input mode (the big new feature)

Santi wants to write, not only steer. Design, then build.

### 3.1 How it plays

- A new fork kind, `type`: the card shows the English (or the Dutch sentence with a gap), a
  text field appears under the card, the bike crawls (forkSlow) and the lamp keeps burning.
  The player types the Dutch and presses Enter or taps a Rijd button. The bike then rides
  through whichever signpost matches what was typed: right answer, lane of the right sign;
  wrong, a wrong lane. So the road still decides, and steering is not needed on type forks.
- On phones the keyboard covers the road; the card moves to the top and the road is still
  visible above the keyboard. Autocorrect off, autocapitalize off, spellcheck off on the field.
- Scoring a typed answer, in order: exact match after normalising (trim, collapse spaces, case,
  final punctuation); then accent-insensitive match (één = een, ë = e) counts as right with a
  gentle note showing the accents; then one typo (Damerau-Levenshtein distance 1 on words of
  five letters or more) counts as right with the correction shown in the why line; anything
  else is wrong and the right answer is shown. Articles count: `hond` for `de hond` is wrong,
  with the why line "the article is part of the word".
- Alternatives: an item can list `alt: ['...']` for accepted variants (je/jij, ik ben/'k ben).
- Dictation: a `type` item with `listen: true` plays the Dutch and the player writes what they
  hear. This is the strongest exercise in the game and costs nothing extra to build.
- Levels mix type forks in slowly: none in tier 1, one in five deliveries in tier 2, one in
  three from tier 3, half in tier 7 and up. A setting on the title screen: Steer only, Mixed,
  Write everything.
- Fares: a typed answer pays the fare plus 50 percent, because it is harder. A typo pays the
  plain fare.

### 3.2 Build jobs

- **Engine job (Opus, the one hard one):** the `type` fork kind in `src/forks.js` and
  `src/hud.js`: the field, focus handling, the match function, the lane resolution, the phone
  layout, the setting. Hooks to keep: `resolveFork` must receive a normal gate so stars, fares
  and the harness need no changes. Add `NR.typeAnswer(text)` for the harness.
- **Match function tests (Sonnet):** `qa/type.test.mjs` with 60 cases: exact, case, accents,
  one typo accepted, two typos refused, articles, alternatives, punctuation, trailing spaces.
- **Content job (Sonnet, one per existing level):** add 8 to 12 `type` items per level that
  reuse the level's own words and sentences (`{ type: true, en: 'the dog', nl: 'de hond' }`,
  `{ type: true, listen: true, nl: 'Ik heb geen tijd.' }`, `{ type: true, en: 'We have lived
  here for two years.', nl: 'We wonen hier al twee jaar.', alt: ['Wij wonen hier al twee jaar.'] }`).
  Extend `qa/validate-content.mjs` first (Sonnet) to validate the kind.
- **Harness (Sonnet):** the autopilot answers type forks through `NR.typeAnswer` with the right
  answer, and a second mode answers with a typo to exercise the tolerant path.

## 4. Gameplay between the forks (from Santi's DORP sheet)

All in `src/forks.js` and `src/world.js` after the split. Each a separate Sonnet job with an
Opus review, in this order.

1. **Jump and slide.** Up arrow or swipe up jumps (fences, fallen bikes, low barriers), down
   arrow or swipe down slides (under a bar, a shop awning, a lowered boom). Obstacles get a
   `clear: 'jump' | 'slide'` field; hitting without the move costs lamp as today. The rider
   animation: a hop of the whole bike group, a crouch of the torso. Phone gestures already
   exist for left and right; add vertical.
2. **Word-learned moment.** After a right fork, the word large in gold with its pictogram
   (`PICTO` exists) and the English, half a second, then it flies into the Wallet pill. Adds
   the word to the vocabulary book (section 6).
3. **Power-ups**, each a pickup in a lane, drawn with existing props: tulip (slow motion for
   the next fork), clogs (one free zombie hit, no Tikkie), coffee (wisps pulled toward you for
   ten seconds), the flag (double euros for thirty seconds). One pickup every two or three
   deliveries; never inside a fork cluster.
4. **Hazards per tier**: trams (tiers 7 and up, two headlights, a bell, cross the road at a
   stop line, must be waited for or dodged), cars (tier 5 and up), canal edges on the dyke
   (drift too far and you get a splash and lose lamp), a lowered drawbridge boom (slide).
5. **Upgrades shop** on the town card, paid from a lifetime bank (`nachtrit.bank`, the sum of
   wallets from won runs): a brighter lamp, a bell that pushes the follower back three times
   per run, a faster omafiets, a dog in the basket that barks at the nearest zombie once per
   delivery. Each is a flag in `S` read by existing code.
6. **The follower** as a real mechanic in tiers 9 and up: visible on the road behind you,
   closing in on wrong answers, pushed back by right ones and the bell.

## 5. Content: the seven towns without levels, and more kinds of level

- **Towns to write** (Sonnet, one agent per level, then a Sonnet Dutch audit per file, then one
  Opus spot-check of ten random items per town): Rotterdam (tier 7), Urk (8), Texel (9),
  Groningen (10), Maastricht (11), Nijmegen (12), Amsterdam (13). Eight places each including
  `eigen`, 42 to 50 items, with `type` items once section 3 lands. Tier fences for 7 and up
  go into `CONTENT-BRIEF.md` first (Sonnet writes them from `LEVELS.md` and the Duolingo
  notes: perfectum and imperfectum from 7, sub-clauses with the verb at the end from 8,
  relative clauses from 9, passive from 11, idioms and particles from 12; word limits 12, 14,
  16).
- **The `eigen` places** need a research line each (`content/towns.js` has landmarks and
  words already): Urk's dress and fleet, Texel's ferry and sheep, Groningen's slogan, the
  Vierdaagse, Rotterdam's harbour, Amsterdam's bells.
- **Practice ride per town** (engine, Sonnet): a generated level like the de/het bonus, built
  from the player's logged mistakes (`S.mistakes` across runs, saved in `nachtrit.mistakes`).
  Shows on the town card as Oefenen with the count.
- **Trophy ride per town** (engine, Sonnet): a generated 30-delivery level mixing every place
  of the town; opens when all places have a star; required for the next town instead of the
  five-star rule.
- **Endless mode** reworked to draw from every level the player has opened, tier rising with
  distance.
- **Vault sync** (Sonnet): a script that reads Santi's `dutch-lessons` vault and reports words
  in the vault that no level teaches yet, so new content starts from what he is actually
  studying.

## 6. Progress, saving, and the vocabulary book

- `src/save.js`: one versioned object in localStorage (`nachtrit.save.v2`) holding progress,
  scores, bank, mistakes, the vocabulary book, settings. Migrates from the current keys.
  Export and import as a file from the title screen, so a new laptop or phone can continue.
- **Vocabulary book**: every word delivered right, with the date and how often, viewable from
  the map (a book icon), searchable, with the pictogram and the Dutch voice. Words seen but
  never delivered right are listed in grey. This is the long-term reward.
- Stats page: euros earned, words known, towns saved, best scores, the most expensive mistake.

## 7. Voice and audio

- **Neural voice** (Sonnet, once Santi provides the Azure key in `/home/santi/.config/nachtrit/azure.env`):
  `qa/voice.mjs` reads every `nl` string from every level and every spoken line (fares,
  rumours, intro), requests nl-NL Fenna (fallback Maarten) at 24 kHz, writes `voice/<hash>.mp3`,
  and a manifest. The game plays the file when it exists and falls back to the browser voice.
  Listen items, dictation, the amounts, the intro lines all use it.
- **Ambience** (Sonnet, `src/audio.js`, Web Audio only): wind on the polder, water lapping on
  the dyke, a church bell per town on entering, the dynamo hum tied to the lamp, bike chain
  ticks, zombie phone buzz panned by lane, the tram bell. All generated, no files.
- **Music**: a generative drone that tightens as the lamp dims; off by default on phones.

## 7b. The world and the map, to the standard of the reference repos (Santi's standing brief)

Santi's words: enrich the world as much as possible so it looks as good as the Kyoto and
Trench Run repos; the map and the level screens should look super clean in the style of the
concept art; Amsterdam must have the red light district; the town research (landmarks, local
words) must be visible in the towns, not only in a data file; and there must be detail behind
the houses, never a house and then black.

- **Behind the houses, three layers** (`src/world.js`, Opus): a second row of houses behind the
  street row, lower and fainter; a flat silhouette card of the town's skyline (spires, mills,
  cranes, towers per town, drawn from the landmark list) far back; and a gradient sky band with
  a moon and cloud sprites, so the horizon is never flat black. Fog layers between them.
- **Town identity that is visible** (`src/world.js`, one Sonnet job per town, Opus review):
  each town's landmark list and look line in `content/towns.js` become scenery: Alblasserdam's
  shipyard cranes and the Grote Kerk, Kinderdijk's two rows of mills and the leaning church,
  Gouda's lonely town hall and the Waag, Zeeland's barrier piers and the sea, Utrecht's Dom and
  the wharf cellars, Den Haag's Binnenhof and the pier, Rotterdam's Erasmusbrug, cube houses and
  Euromast, Urk's lighthouse, fleet and dress, Texel's ferry, sheep and lighthouse, Groningen's
  Martinitoren, Maastricht's Servaasbrug and the Vrijthof, Nijmegen's Waalbrug and the
  Stevenskerk, Amsterdam's Westertoren, canal ring, trams, bikes and the red light district
  (De Wallen: narrow alleys, red neon over doorways, red-lit windows with silhouettes behind the
  glass, the Oude Kerk, bollards, crowds of tourist zombies; dry and funny, never explicit).
  Local words on the walls: each town's `words` list feeds that town's graffiti and shop signs.
- **Density and materials** (branch `world`, in flight): a second row of props, brick and tile
  textures, cobbles, chained bikes, bins, crates, hedges, boats, ducks, cats in windows.
- **The map in the concept style** (`src/map.js`, Opus for the design, Sonnet for the drawing):
  dark paper and ink, the coastline drawn with a hand-drawn line, water hatched, each town a
  small painted vignette in the pixel toolkit (a mill, the Dom, the bridge, the lighthouse)
  rather than a circle with a glyph, the route as a dotted bike trail with tyre marks, fog over
  locked towns, the saved towns lit with amber windows. Town cards with the town's painting
  behind the text.
- **Level screens**: the mission card and the summary redrawn in the same style, with the
  town's scene behind, the fares and the score as a kassabon.

## 8. Ending, phone, release

- **Saving a town**: when every place has a star, the town card shows dawn, its windows light
  on the map, and its rumour is replaced by one line of thanks in Dutch. **Saving Amsterdam**:
  a last ride to the sea at dawn with no forks, the language coming home, the credits as a
  fifteenth painted panel.
- **Phone**: a manifest and a service worker for install and offline play; a portrait layout
  for the HUD and the card; swipe up and down for jump and slide; test on Santi's phone over
  the LAN at `http://192.168.1.8:8765` (the laptop's address may change).
- **GitHub**: push `main` and every branch once the empty repository exists; GitHub Pages from
  `main` so the game has a public address; a release checklist in the README.
- **Beyond the Netherlands**: a `country` folder convention (outline, towns, content, voice)
  so a second language is a data job, not an engine job.

## 9. Who does what

- **Sonnet, high effort**, the bulk: every content level, every audit of a content file, the
  match-function tests, the harness changes, the vault sync, the voice batch script, the
  ambience, the save module, the vocabulary book, power-ups, hazards, upgrades, the practice
  and trophy rides, the manifest and service worker, the GitHub Pages setup.
- **Opus, high effort**, where a wrong call is expensive: the code split, the `type` fork
  engine job, the jump and slide physics, the follower, the 3D world art, the pixel paintings'
  critique, reviews of every Sonnet engine job before merge.
- **Fable**, rarely and read-only: the Dutch of the story and the spoken lines, the final
  review before a release, anything Santi wants a second opinion on.
- Effort: never `max` except a single judge or synthesis call. Never more than two headless-
  browser jobs at once.

## 10. Order of work

1. Finish and merge fares; the intro polish round; the 3D world pass (all in flight), then the three-layer background of section 7b.
2. The code split with JSDoc types (one Opus job, then the harness on four levels).
3. Writing mode: engine (Opus), tests (Sonnet), content for the 49 levels (Sonnet), harness.
4. Jump and slide, the word-learned moment, power-ups (Sonnet jobs, Opus reviews).
5. The seven towns (Sonnet writers and auditors, Opus spot-checks), and the visible town identity pass of section 7b with them.
6. Save module, vocabulary book, practice and trophy rides.
7. Voice batch (when the key exists), ambience.
8. Hazards, upgrades, the follower.
9. Town saved and the ending, phone build, GitHub Pages, release.
