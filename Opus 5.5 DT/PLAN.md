# Nachtrit plan, November 2026: from a good-looking quiz to a game that teaches

Written 11 November 2026 on Santi's laptop, after he played the combined version and agreed with
an assessment made from four seats: game designer, game developer, language student, linguist.
This file is the execution plan for the Opus 5.5 DT agent. It replaces the ordering in
`BACKLOG.md` and `NEXT-STEPS.md`. Those files still hold useful detail for single items and are
referenced below by their ids (A1 to A5, D1 to D3).

Read this file fully, then `README.md` (rules of the house), `HANDOVER.md` (engine rules),
`NOTES.md`, `reports/dt-reading-time.md`, `reports/dt-models.md`, `reports/dt-webgpu.md`.

---

## 0. The conclusion this plan acts on

The game looks good and has its own voice. Graphics are no longer the bottleneck. What is
missing is the learning loop and the payoff of the story:

1. The player only recognises Dutch, never produces it.
2. A missed item never comes back, in this ride or a later one.
3. The player cannot see which words and rules they own.
4. It is often unclear what a fork is asking. One fork tests two things at once.
5. Some wrong options are forms that do not exist in Dutch.
6. No native speaker has read the content. 13 flagged points are open.
7. Hard structures (verb-second word order, de and het) are taught in one place, not spread.
8. Right answers do not visibly give the world its words back. Towns do not reach dawn.
   Amsterdam has no ending.
9. The player has one verb (steer). Money buys nothing. A dead lamp costs the whole level.
10. The code is one file of 4,370 lines, with no unit tests, and the long automated rides do not
    finish on a busy machine. Progress lives in one browser.

Everything below exists to fix one of these ten points. If a task does not serve one of them,
it is out of scope.

## 1. Where things stand (verified on 11 Nov)

- **Live site** (https://sscleves.github.io/NachTrit/, branch `main`, commit dd97c69): voice
  files, first-five-minutes fixes, lamp tuning, warm map. Frozen while Santi tests.
- **Best version**: branch `dt/all` (on GitHub, NR_VERSION 34). It combines three branches:
  - `dt/models`: code-generated .glb models (rider on the omafiets, two dogs, gables, windmill,
    props) from `tools/models/`, loaded with fallbacks to the old primitives.
  - `dt/reading-time`: a reading budget per fork at every tier, the go key (up arrow, W, swipe
    up) that ends the wait, a coloured task label per fork, the gap marked in gold on the card,
    teaching treatment the first time a task type appears, and level 75 split into one thing
    per fork as a prototype.
  - `dt/webgpu`: three.js 0.187. The WebGPU node path is **opt-in** (`?renderer=webgpu`),
    because on the Intel laptop GPU it ran at about 31 fps with stutters against 55 to 60 on the
    WebGL path. Leave it parked. Do not spend time on it in this plan.
- **Content, measured on `dt/all`**: 130 level slots, 105 playable, 25 marked `soon`. 5,817
  items. 2,709 forks inside build items, every one with a why line (`w`). 625 of those forks
  have multi-word options that are not a pure reordering of the same words. Those are the
  candidates for "tests two things at once".
- **Why line**: it exists. A wrong answer shows `fork.w` in a toast for 3.6 seconds while the
  bike keeps moving. It is easy to miss.
- **Review of mistakes**: none. No item is ever queued again.
- **Storage**: `nachtrit.progress` (stars, numbers only), `nachtrit.scores`, `nachtrit.taught`,
  `nachtrit.go`, `nachtrit.intro`, `nachtrit.lamphint`, `nachtrit.lost`, `nachtrit.unlock`.
  All per browser. No export.
- **Tests**: `qa/validate-content.mjs`, `qa/check-versions.mjs`, `qa/fares.test.mjs`,
  `qa/run.mjs` (plays in real time under SwiftShader, timed out repeatedly on 11 Nov),
  `qa/dt/gpu-shot.mjs` (real GPU through headless Chrome, works on the laptop),
  `qa/dt/first-five.mjs`, `qa/dt/reading-time.mjs`, `qa/dt/lamp-balance.mjs`.

## 2. Rules that hold through every phase

Engine rules from real failures (full text in `HANDOVER.md`):
- Exactly four lights. Never add or remove a light at runtime.
- Never sample a render target that is being rendered into.
- No allocations per frame in `update()`.
- Shared geometry and materials. Draw calls under about 600 on the Intel laptop GPU.
- Do not touch the road ribbons.
- No build step for the game. Plain ES modules, an import map, classic scripts.
- `nachtrit.progress` stays numbers only. New data goes in new keys or the save object (phase 4).
- English interface, Netherlands Dutch game text, dry voice, no exclamation marks.
- Bump `window.NR_VERSION` with `node qa/check-versions.mjs --bump` before every merge.

Rules added on 11 Nov:
- **Language difficulty stays doable at every tier.** Only speed and obstacles scale. Every fork
  keeps its reading budget. The go key lets a confident player skip the wait.
- **The wheels tumble.** The bike wheels face the camera and tumble end over end. Santi likes
  that it makes no sense. Do not correct it.
- **The intro depends on the rider.** After any change to the rider, the dogs, or `bike`
  children, shoot all 14 intro shots on the GPU (`qa/dt/gpu-shot.mjs --pages 'sN=cine=N&t=S'`)
  and look at them. Three bugs on 11 Nov came from skipping this.
- **One job at a time in `index.html`** until the split (phase 2) is merged.
- **At most one headless browser at a time.** Three at once made every long test time out.
- **Do not push `main`.** Push your branch and write the report. The laptop Claude checks on
  Santi's Chrome, merges and pushes. Santi merges nothing by hand unless he says so.

Every phase ends with the same checklist:
1. `node qa/validate-content.mjs` gives 0 errors, 0 warnings.
2. Unit tests pass (from phase 1 on).
3. `qa/dt/gpu-shot.mjs` on levels 1, 12, 58, 75, 123: 0 errors, draw calls and fps reported.
4. The step-driven harness (phase 1) finishes levels 1 and 75.
5. All 14 intro shots look right, if the phase touched the rider or the world.
6. `check-versions --bump`, commits in steps, branch pushed.
7. A report in `reports/dt-<branch>.md`: what changed, what was measured, what is open, and
   exactly what Santi should try, with level numbers and keys.
8. `STATUS.md` updated.

## 3. The order, and why

| Phase | Branch | Fixes point | Depends on |
|---|---|---|---|
| 0. Land what exists | `dt/all` into `main` | 10 | Santi's OK |
| 1. Safety net | `dt/tests` | 10 | 0 |
| 2. Code split | `dt/split` | 10 | 1 |
| 3. Learning core | `dt/learning-core` and `dt/content-clear-forks` | 2, 4, 5, 7 | 2 |
| 4. Save, learner model, word book, spaced review | `dt/save` | 2, 3, 7, 10 | 3 |
| 5. Story payoff and stakes | `dt/payoff` | 8, 9 | 4 |
| 6. Writing mode | `dt/typing` | 1 | 4 |
| 7. Moves and hazards | `dt/moves` | 9 | 2 |
| 8. Phone, native review, release | `dt/release` | 6, 10 | all |

Tests come before the split, because the split is only safe if something can prove the game
still plays the same. The learning core comes before save, because the save format has to
store what the learning core produces. Writing mode comes after save, because its progress
lives in the save object. Moves come late, because they are fun and not learning, and they touch
the same loop the learning core changes.

Content work (phase 3b) and the native review packet (phase 3f) do not touch engine files.
They can run beside phases 4 to 7 on their own branches.

---

## Phase 0. Land what exists

Goal: one version on `main` that Santi and everyone else plays.

1. Wait for Santi's word that `dt/all` feels right (he is playing `localhost:8775`).
2. On a quiet machine, run the long checks that did not finish on 11 Nov:
   `qa/dt/reading-time.mjs` on 1, 75, 99, 123 and `qa/dt/lamp-balance.mjs` on 1, 11, 58, 75.
   Known open point: level 75 with wisps collected ended with 25 lamp against 58 on main,
   because longer sentences added road. If it is still far below 58, shorten the extra filler or
   lower drain for that tier until a rider who collects wisps finishes with a clear margin.
3. Fix the reading distances in `CONTENT-BRIEF.md`, which predate the condensed signs.
4. Check signs hidden by the rider or by scenery. The legibility measure ignores what blocks a
   sign. If the rider's head covers the middle sign, raise the boards or lower the camera aim.
5. Known small defects to fix or list: Gouda (level 12) touches 600 draw calls on some loads;
   two "uv not found" warnings in Amsterdam on the WebGPU path only (parked).
6. Merge to `main`, push, update `STATUS.md`, tag `v0.2-combined`.

Acceptance: the live site shows the new rider, the go key and task labels. No errors on the
GPU run of levels 1, 12, 58, 75, 123.

## Phase 1. Safety net (`dt/tests`). Backlog D1, D2, D3.

Goal: a change can be proven safe in minutes, on a busy machine, without a human.

1. **Step-driven harness.** `qa/run.mjs` plays in real time, so a slow machine never reaches
   the end. Write `qa/ride.mjs`: it drives `window.NRstep(n)` in chunks (keep each evaluate
   under 30 seconds), steers with the existing autopilot, and stops at the summary card. It
   must not depend on wall-clock time. Report: deliveries, right, wrong, lamp left, errors.
   Keep `qa/run.mjs` for screenshots only, or retire it.
2. **Intro regression.** `qa/intro-sheet.mjs`: all 14 shots at two times each on the real GPU,
   one contact sheet, plus cheap automatic checks: no page errors, the dogs group is visible
   only in shots 8 and 14, the rider has a visible torso in shot 9, luma within a band per shot.
3. **Unit tests for the data layer**, with `node --test`, no new dependencies:
   level queue building, `itemToEntry`, task label derivation (pure-reorder rule, rule id map,
   `task:` override), reading budget per fork, lamp drain and refuel maths, fares (exists),
   voice hash lookup, validator rules. These functions must be importable without a browser.
   Where they are trapped inside `index.html`, test them through a small extraction that phase 2
   will make permanent.
4. **CI.** A GitHub Actions workflow on every push to `dt/*` and `main`: validator, unit tests,
   version check. No browser in CI at first. Add the step-driven ride on SwiftShader for
   levels 1 and 75 only if it runs under 10 minutes.

Acceptance: `npm test` runs everything headless-free in under 30 seconds. `node qa/ride.mjs 75`
finishes while another heavy job runs.

## Phase 2. The code split (`dt/split`). Backlog A1.

Goal: stop one file from being the place where every job collides, and give the intro a stable
way to pose the rider.

Follow A1 in `BACKLOG.md` for the module list and the JSDoc typing step. Additions:

1. `index.html` has grown from 2,300 to 4,370 lines since A1 was written. Add modules for what
   arrived since: `src/models.js` (GLTF loading, `modelClone`, fallbacks), `src/reading.js`
   (budget, legibility control, go key, first-ride hold), `src/tasks.js` (task labels and
   colours), `src/voice.js` (rendered lines, speech fallback), `src/render-webgl.js` and
   `src/render-nodes.js` (the two render paths; the node path stays opt-in).
2. **A rider API for the intro.** Today the shots reach into `bike.children` and
   `bike.userData`. Give `src/rider.js` an explicit surface and move every shot to it:
   `rider.pose('ride' | 'seated' | 'standing')`, `rider.showBike(bool)`, `rider.showDogs(bool)`,
   `rider.coat(material)`, `rider.head` (the look target), `rider.restore()`. The dogs rule
   (only shots 8 and 14) becomes a property of the shot (`dogs: true`), not an index check.
3. Keep every `window.NR*` debug hook working. The QA tools depend on them.
4. Move in small commits: one module per commit, with the unit tests and the step-driven ride
   green after each one. Do not reformat lines you move. A diff that only moves code is easy to
   check.

Acceptance: as in A1, plus all 14 intro shots identical by eye to the phase 0 sheet, and draw
calls and frame time unchanged on the GPU run.

## Phase 3. The learning core

This is the centre of the plan. Two branches, because one is engine and one is content.

### 3a. Missed items come back in the same ride (`dt/learning-core`)

1. When a fork is answered wrong, the item goes into a return queue. It comes back after 3 to
   5 other forks, and once more in the last quarter of the ride if it was missed twice.
2. A returned item is marked on the card with a small "again" tag, so the player knows this is
   a second chance, and it pays half fare.
3. A returned item does not count against the level's delivery total. It extends the ride
   by its own length, and the lamp does not drain during the extra road it adds, so review
   never kills the player. Cap the returns at 6 per ride.
4. Stars are decided on the first attempt only, as today.
5. The lamp balance bot must still show: collect wisps and finish, ignore them and die or
   barely finish, on levels 1, 11, 58, 75.

### 3b. One thing per fork, everywhere (`dt/content-clear-forks`)

The prototype is level 75. Roll it out to every playable level.

1. Write `qa/audit-forks.mjs`. For every fork it reports: the task type the engine derives,
   whether the options differ in more than one dimension, and the word count. Dimensions:
   word order (same words, different order), verb form (same lemma, different ending or
   tense), word choice (different lemmas), spelling (one option is not a Dutch word).
   Start from the 625 multi-word forks that are not a pure reordering.
2. For each mixed fork choose one of two repairs:
   - **Narrow it**: keep the fork and make the options differ in one dimension only.
   - **Split it**: two forks, as level 75 does. "Ik ___ gisteren de hele dag thuis" asks the
     past form. "Gisteren ___ de hele dag thuis" asks the word order.
   Splitting makes levels longer. Keep each level's `deliveries` and reading load steady by
   dropping the weakest item of the same rule when a split adds one.
3. Signs carry at most three words. A whole sentence never goes on a sign. The sentence lives
   on the card with the gap marked.
4. Add `task:` to a fork only where the derived label is wrong. Keep the label set at eight:
   Word order, Past tense, Verb form, Which word, de or het, Comparison, Listen, Meaning.
   Add a ninth, **Spelling**, for the forks described in 3c.
5. Work town by town, in play order, one commit per town. Run the three-pass pipeline from
   `CONTENT-BRIEF.md` on every changed file: writer, native-teacher audit, spot check of six
   random items per file. Rebuild bundles with `node qa/build-content.mjs`. Voice lines for new
   sentences: `npm run voice` renders only what is missing.
6. Add the audit to `npm run validate` as a hard rule once the count of mixed forks is zero.

### 3c. Wrong options must be real Dutch (`dt/content-clear-forks`)

Policy:
- A wrong option is a real Dutch word or form that is wrong in this sentence. "werkt" and
  "gewerkt" are good wrong options for "werkte". They teach the contrast.
- A form that does not exist ("werkde") is allowed in one place only: a fork whose rule is a
  spelling rule ('t kofschip d or t, the adjective -e, plural and diminutive spelling). That
  fork carries the label **Spelling**, so the player knows the task is to spot the right
  written form. These forks are also the first candidates for writing mode (phase 6), where the
  player produces the form and never sees a wrong one.
- A wrong option must not be acceptable Dutch in the sentence. The October audit fixed 29 of
  these. Keep that check.

Tooling:
1. Add a Dutch word list as a dev dependency only, for example the OpenTaal list through the
   `dictionary-nl` package with `nspell`. Check its licence before adding it, and never ship it
   with the game.
2. `qa/audit-distractors.mjs`: every option of every fork, token by token, against the list.
   Report tokens that are not Dutch words. Each one must either sit in a Spelling fork or be
   replaced. Keep an allow list for names, town words and dialect (bakkie pleur, bomma).
3. Add it to `npm run validate` once clean.

### 3d. The why line must be seen (`dt/learning-core`)

1. On a wrong answer, show the right form and the why line on the card itself, where the
   player is already looking, for as long as the reading budget of that line (0.35 s per word,
   minimum 3 s). The bike eases to the fork crawl speed and the lamp does not drain during it.
   The go key dismisses it.
2. On a right answer keep it short, as now.
3. The why line is one sentence in plain English, at most 18 words, naming the rule in the
   learner's terms. Audit all 2,709 with a length check in the validator and rewrite the long
   ones during 3b.
4. The summary card at the end of a ride lists the missed items: the sentence, the right form,
   the rule, and a speaker button. Group them by rule and name the weakest rule in one line.

### 3e. Hard structures return across levels (`dt/content-clear-forks`)

1. Two threads run through every level from the level where each is introduced: **verb-second
   word order after a fronted word**, and **de or het for nouns already met**. Every level
   carries at least three forks of each thread, built from words of earlier levels.
2. `qa/audit-threads.mjs` counts both threads per level and fails the validator under three.
3. The engine does not need to change for this. It is content, and phase 4 adds the personal
   version of the same idea.

### 3f. Measure the vocabulary and the sequence (`dt/content-clear-forks`)

Nobody has measured this. Measure before changing anything.

1. `qa/audit-vocab.mjs`: lemmas per level (a simple stem table is enough, exact lemmatising is
   not needed), new words per level, how often each word returns in the next ten levels, and the
   total. Compare against a Dutch frequency list (for example SUBTLEX-NL) to see how many of the
   most frequent 1,000 and 2,000 words the game covers.
2. Targets to judge against: at most 10 new words per level; every new word met at least four
   more times within the next ten levels; grammar tier and vocabulary size in step (A1 about
   500 words, A2 about 1,000, B1 about 2,000 as rough bands).
3. Write the findings to `reports/dt-vocab.md` with a list of the worst levels. Fix by content
   passes only where a level breaks a target badly. Do not start a rewrite of everything.
4. Check the grammar sequence against a standard order for Dutch as a second language: present
   tense and V2 in main clauses, questions, modals, separable verbs, perfect, imperfect, sub-clause
   order last. Report any rule that appears before what it depends on.

### 3g. The packet for a native speaker (`dt/content-clear-forks`)

No model replaces this. Make the human's job short.

1. Generate `review/native-review.html` (and a printable PDF): every Dutch sentence in play
   order, with its English line, grouped by town, with three tick boxes per line: natural,
   odd but correct, wrong. Put the 13 flagged points from `reports/dt-audit-distractors.md`
   first, each with its question (kraam de or het, the historic present, the Groningen earthquake
   words, the Zeeland flood joke, bomma).
2. Add a second, short sheet: 60 sentences sampled across tiers, for a reviewer with one hour.
3. Santi finds the reviewer (a Dutch teacher or colleague). Corrections come back as the marked
   file. Apply them in phase 8, through the normal content pipeline.

Acceptance for phase 3: zero mixed forks and zero non-words outside Spelling forks in the
validator; a missed item returns in the same ride; the why line holds on the card; the summary
lists misses by rule; both threads present in every level; the vocabulary report and the review
packet exist. Santi plays levels 1, 41 and 75 and says the forks are clear.

## Phase 4. Save, learner model, word book, spaced review (`dt/save`). Backlog A4, extended.

Goal: the game remembers what this player knows, shows it, and brings back what is due.

1. **One save object**, versioned, in `src/save.js`, under `nachtrit.save`. It holds: progress
   and scores (migrated from the old keys, which stay readable for one version), settings, and
   the learner model. Export and import as a JSON file and as a short code to paste on another
   device. A round trip must restore everything.
2. **Learner model.** For every item the player has met, keyed by a stable hash of its Dutch
   text (the voice hash already exists): times seen, times right on first try, last seen
   (as a ride counter, not a date, so a long break does not flood the player), and a box from
   1 to 5. Right on first try moves it up a box, wrong moves it to box 1. Intervals in rides:
   1, 2, 4, 8, 16. Per rule id: seen and right, for the weak-rule view. Keep the stored size
   small: numbers only, one short array per item.
3. **Spaced review across rides.** When a level's queue is built, up to a quarter of its forks
   are replaced by due items from earlier levels of the same or a lower tier, weakest box first.
   They are marked "again" like the returns in 3a and follow the same lamp rule. A first-time
   player sees no difference. Unit-test the selection.
4. **Word book**, opened from the map: every word met, with article, meaning, pictogram, town,
   a speaker button, and a five-step strength mark from the box. Filter by town and by strength.
   A second tab lists the rules with a bar each and the three weakest on top.
5. **Practice ride**: a level built from the player's 20 weakest items, no stars, small fares.
   **Trophy ride** per town: all its items, no hints, double fares (as in A4).
6. The summary card from 3d links to the practice ride when there are misses.

Acceptance: export, clear storage, import restores stars, scores, words and boxes. A wrong
answer on level 3 shows up as a marked review fork within the next two rides. The word book
shows the right count. Old saves from the live site load without loss.

## Phase 5. Story payoff and stakes (`dt/payoff`). Backlog A5, first half, plus two new items.

Goal: the player sees the world answer. Right Dutch gives words back, towns reach dawn, the
story ends.

1. **Words come back during the ride.** The intro already shows this (shot 11: a glowing word
   flies up the street and a dead lamp catches). Use the same picture in play: on a right
   answer the word leaves the sign as a small golden glyph and lands on the nearest street lamp
   or shop sign, which stays lit for the rest of the ride. Blank shop signs in the level get
   their Dutch word back one by one. No new lights: emissive materials and the existing glow
   sprites only. Budget: under 20 extra draw calls.
2. **Town dawn.** As in A5: when every place in a town has three stars, the next visit plays
   at dawn. The fog lifts to the pale haze of concept image A, every window is lit, the dead
   stand as people again and still split the bill, and a card resolves the town's rumour as
   "still unconfirmed". The map shows the town glowing. Drive it from the night depth and fog
   values that exist; do not add lights.
3. **Amsterdam ending.** Write it in `STORY.md` first, Dutch and English, dry, and show Santi
   before building. Then build it as intro-style shots through the rider API from phase 2.
   Nobody learns the cause. The grammar book finally gets opened, or does not. Santi decides.
4. **Money buys something.** Today the wallet is a score. Add a small shop on the map, in the
   game's humour, with things that change play a little: a stroopwafel (one refill of half the
   lamp, carried into a ride), a louder bell (the dead step aside once), dog treats (wisps drift
   toward the dogs for a while), paying off the one-cent Tikkie (a joke item, very expensive).
   Prices from the fare table so a clean town ride buys about one item. Santi approves the list
   before it is built.
5. **A checkpoint.** At half the deliveries a lit bus stop marks the halfway point. A dead lamp
   after it restarts from there with half a lamp, once per ride, and the ride can then earn at
   most two stars. The step-driven harness and the lamp bot must cover it.

Acceptance: on level 1 a right answer visibly lights something. A town with all stars plays
at dawn and glows on the map. The ending plays from the last Amsterdam level. The shop, the
checkpoint and the save object work together. Draw calls stay under 600.

## Phase 6. Writing mode (`dt/typing`). Backlog A2.

Goal: the player produces Dutch.

Follow A2 in `BACKLOG.md`. Changes that follow from this plan:

1. Progress for writing lives in the save object from phase 4, not in a new storage key.
2. Start with the forks where production matters most and recognition teaches least: the
   **Spelling** forks from 3c, then de or het with the noun, then one-word gaps. Whole
   sentences come last.
3. The gap from the card is the input field. The player types only the missing piece, so the
   reading budget and the go key keep working: Enter is go.
4. A miss in writing mode feeds the same return queue (3a) and the same learner model (phase 4).
   Writing an item right counts as two box steps, because production is stronger evidence.
5. The why line on a miss shows the expected form with the differing letters marked.
6. Speaking is out of scope. Browser speech recognition is not reliable enough for learners of
   Dutch to be judged by it. Note it in `IDEAS.md` and leave it.

Acceptance: as in A2, including the 60-case matcher test, plus: a level can be played fully in
writing mode on a laptop and on a phone at 390 by 844 with the soft keyboard open.

## Phase 7. Moves and hazards (`dt/moves`). Backlog A3.

Goal: the stretch between forks is a game.

Follow A3. One conflict to resolve first: A3 gives jump to the up arrow, W and swipe up. Those
are now the go key.

- **Default, unless Santi says otherwise: one "up" input, two meanings by context.** Inside a
  fork's reading window, up means go. Between forks, up means jump. The level planner already
  knows where the reading windows are, so it must never place a jump obstacle inside one or in
  the two seconds before one. Down, S and swipe down slide, everywhere.
- The reading budget is sacred: no hazard, power-up or pickup may sit inside a reading window.
  Add that as a planner rule with a unit test.
- Power-ups from A3 and the shop items from phase 5 share one inventory and one HUD pill.
- Spawn rates scale with tier. Language load does not.

Acceptance: as in A3, plus `qa/dt/reading-time.mjs` unchanged on levels 1, 75, 99, 123.

## Phase 8. Phone, native review, release (`dt/release`). Backlog A5, second half.

1. **Phone pass**, on real widths 320 to 430 and in the step-driven harness with touch events:
   swipe lanes, swipe up for go and jump, swipe down for slide, the first-ride hold message not
   covering the signs, the card and the task label readable, the word book and the shop usable
   with a thumb, the soft keyboard in writing mode. Frame rate on a mid-range phone: lower the
   pixel ratio before dropping effects. A home-screen manifest and an icon drawn in code.
2. **Loading.** A real loading state on first open: the models wait up to 8 seconds today with
   nothing on screen to say so. Voice files stay fetched per line, as now.
3. **Apply the native review** from 3g. Every correction goes through the validator and a voice
   re-render for changed lines.
4. **Ambience** from A5: wind, water, a church bell per town, bike ticks, all synthesised, with
   a mute setting stored in the save object.
5. **In-game help**: one screen from the map that explains the keys, the task labels and their
   colours, the lamp, the word book. Update `LEVELS.md` and the repo `README.md`.
6. Final checks on Santi's Chrome and phone, then merge and tag `v1.0`.

---

## 4. Decisions that are Santi's

Work proceeds on the defaults. Each is cheap to change if he says so before its phase starts.

| Decision | Default | Needed before |
|---|---|---|
| Does `dt/all` go live as it is | Yes, after the quiet test run | Phase 0 |
| Near-stop at long forks, up to 10 s without the go key | Keep, the go key is the answer | Phase 0 |
| Up means go at a fork and jump between forks | Yes | Phase 7 |
| Shop items and prices | The four listed in phase 5 | Phase 5 |
| The ending: does he open the grammar book | Show him two drafts | Phase 5 |
| Checkpoint caps the ride at two stars | Yes | Phase 5 |
| Who does the native review | Santi finds a teacher or colleague | Phase 8 |
| Concept image B, lost | Ask Santi if he still has it | Any time |

## 5. What this plan leaves out on purpose

- The WebGPU renderer. Parked, opt-in, slower on the target laptop.
- New towns or new art passes. The world is good enough until the loop teaches.
- Speech recognition.
- Accounts, servers, analytics. The game stays a static site. Everything personal stays in the
  player's browser and their export file.
- Replacing the zombies with model files. The code-built ones are better than a quick model.

## 6. How to report

One report per branch in `reports/`, in plain sentences, with: what changed, numbers measured
before and after, paths of frames, what is still open, and the exact test for Santi (address,
level, keys). Absolute paths and GitHub links for every file named. Then update `STATUS.md`
and, if a rule of the house changed, `HANDOVER.md`.
