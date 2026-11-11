# Phase 1 on `dt/tests`: the safety net (11 Nov 2026)

Branch `dt/tests` (https://github.com/SScleves/NachTrit/tree/dt/tests), worktree `/home/santi/dutch-arcade-wt/tests`,
cut from `main` at `edcf8d1` (NR_VERSION 36), now NR_VERSION 37. Served on `http://localhost:8776/index.html`. Measured
on the server (Intel UHD Graphics CML GT2 through headless Chrome; SwiftShader through Playwright's Chromium 1.47).
`main` was not touched.

## Summary

A change can now be checked in minutes with no human and no wall clock. `npm test` runs the version check, the content
validator with its audits and 49 unit tests in about 10 s, with no browser. `qa/ride.mjs` rides any level step by step
with a seed, so it gives the same numbers on a busy laptop as on a quiet one; level 75 finished under a load average of
17. `qa/intro-sheet.mjs` shoots the 14 intro shots on the GPU into one sheet and checks the dogs, the torso, errors and
brightness. CI runs `npm test` and a SwiftShader ride of levels 1 and 75 on every push to `main` and `dt/*`; the first
run passed in 2 min 13 s. Nothing a player sees changed. The pure rules moved out of `index.html` into `src/*.js`,
which the game imports and the tests share, and seeded rides give identical numbers before and after the move.

## 1. The step-driven ride: `qa/ride.mjs`

`/home/santi/dutch-arcade-wt/tests/qa/ride.mjs` (https://github.com/SScleves/NachTrit/blob/dt/tests/qa/ride.mjs)

How it avoids the wall clock:
- The game's own animation loop is held: `requestAnimationFrame` is parked before the page's scripts run, so only
  `window.NRstep` moves the world, 1/60 s a frame.
- `setTimeout` runs on a virtual clock that each step advances. The passenger pick-up and the card use timers, so
  they fire at the same game time on any machine.
- `Math.random` is seeded (`--seed`, default 1).
- It steers with the existing autopilot (`__bot` from `qa/lampbot.js`, every 12 frames, as `lamp-balance.mjs` does).
- Each `page.evaluate` runs a fixed chunk of 300 frames. Boot is polled from Node, because the page's own
  `requestAnimationFrame` and `setTimeout` belong to the harness.
- Nothing is drawn during the ride. The game's rules never read a drawn frame. On SwiftShader one new shader program
  took 10 to 12 s to compile in the draw at the end of a chunk, and 29 s with twelve busy cores. `--draw` keeps the
  old drawing. Drawn and undrawn rides give the same numbers.
- With no `--base` it serves its own working tree on a free port, so `node qa/ride.mjs 75` needs no server.

It reports the result (home or dies), deliveries, right, wrong, lamp left and lowest, distance, game seconds, wall
seconds, every evaluate's time and errors (page errors, console errors, failed requests, the `#err` box). It writes a
PNG of each summary card and `report.json`. Options: `--gpu`, `--ignore` (skip wisps), `--miss K` (ride through a
wrong sign at every K-th fork), `--teach` (first-ride teaching forks), `--seed`, `--chunk`, `--draw`. It exits 1 on an
error, a ride with no summary card, or a death in the default always-right mode.

Measured (`node qa/ride.mjs 1,75`, SwiftShader, seed 1):

| Level | result | delivered | right | wrong | lamp left | lowest lamp | game s | wall s | longest evaluate ms | errors |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | home | 20/20 | 20 | 0 | 97.2 | 82.3 | 267.6 | 16 | 139 | 0 |
| 75 | home | 20/20 | 25 | 0 | 64 | 59.9 | 278.5 | 15 | 108 | 0 |

- Before the no-draw change, the same two rides took 97 s and the longest evaluate was 10.6 s.
- `--gpu` on level 1 gave home, 20/20 and lamp 97.2 in 272.1 game s and 6 s wall.
- `--ignore` on 75 dies at 18/20. That agrees with the phase 0 table (dies 17/20 twice).
- Summary cards: `/home/santi/dutch-arcade-wt/tests/qa/out/dt-tests/ride/L1-summary.png` and `L75-summary.png`.

Same seed, same numbers:
- Level 1 ridden twice gave identical numbers on every field, including frames, distance, score and cents.
- Chrome (`--gpu`) and Playwright's Chromium differ by a few game seconds on the same level, likely because the two
  browsers measure the sign text a little differently. Compare numbers from the same browser.

**Acceptance: `node qa/ride.mjs 75` while another heavy job runs.** I started twelve `node -e "for(;;){}"` busy loops,
one per core, and rode 75. The load average was 17.4 at the end. The ride finished in 57 s wall with the same numbers
as the quiet run (home, 20/20, 25 right, 0 wrong, lamp 64, lowest 59.9, 278.5 game s). The longest evaluate was 219 ms.
I killed the busy loops afterwards. The first try, which still drew each chunk, also finished under the same load with
the same numbers, but its longest evaluate was 29.5 s. That is why the ride no longer draws.

`qa/run.mjs` stays for screenshots of a ride. Its header now points to `ride.mjs` for numbers.

## 2. The intro regression: `qa/intro-sheet.mjs`

`/home/santi/dutch-arcade-wt/tests/qa/intro-sheet.mjs` (https://github.com/SScleves/NachTrit/blob/dt/tests/qa/intro-sheet.mjs)

It shoots the 14 shots at t=2 and t=6 (`?cine=N&t=S`) in one Chrome on the real GPU and puts them on one labelled
contact sheet. Each frame is checked:
- no page errors, console errors, failed requests, or text in the `#err` box;
- the riding dogs (`NRbike().dogs`) are shown in shots 8 and 14 and hidden everywhere else (shots 9 and 10 have their
  own sofa and table dogs, which are props of those shots);
- in shot 9 his torso is drawn and its middle is inside the picture;
- luma (`NRbright`) is inside the band for that shot and time in
  `/home/santi/dutch-arcade-wt/tests/qa/intro-bands.json` (https://github.com/SScleves/NachTrit/blob/dt/tests/qa/intro-bands.json).
  The band is the measured value plus or minus 6 and a quarter, recorded with `--record` after I had looked at the
  frames.

Run: 28 frames, 0 failed, 2 min 6 s. Sheet: `/home/santi/dutch-arcade-wt/tests/qa/out/dt-tests/intro-sheet.png`.
I looked at every frame:
- The riding dogs are in 8 and 14 only. Shot 9 shows him on the sofa with his torso, between the sofa dogs, and
  shot 10 shows the grammar book.
- The 03:00 clock reads in 6 at t=2.
- Nothing is clipped or merged. The sheet matches the phase 0 sheet.

To prove the checks catch the bugs they are for, I broke the game on purpose: dogs forced on everywhere, and the
torso hidden in shot 9. The run flagged shot 9 for both. Shot 3 stayed clean, because the rider is hidden there, so
his dogs are too. I restored both files afterwards.

## 3. Unit tests: `qa/test`, with `node --test`, no new dependencies

Folder `/home/santi/dutch-arcade-wt/tests/qa/test` (https://github.com/SScleves/NachTrit/tree/dt/tests/qa/test). There
are 48 tests here, and `qa/fares.test.mjs` runs as the 49th.

| File | What it checks |
|---|---|
| `forks.test.mjs` | `itemToEntry` for all six item kinds: options as many as lanes, the answer first, `wrong` first among distractors, `getal` for numbers, no reading text in a word fork. `levelQueue`: as many entries as deliveries, each item once a round. Every level in the content builds a queue whose forks have 2 or more distinct options and an answer in range (two seeds, both lane counts). |
| `tasks.test.mjs` | The nine labels and their colours. Every label can be reached. The `task:` override on a fork or an entry. Pure reorder beats the rule id. The rule id map. Every rule id in the content exists in `data.js`. The qa tools label every content fork exactly as the game does. |
| `reading.test.mjs` | `readBudget`: the 3 s floor, the 7 s cap, 1.5x for read and listen, 1.5 s for the first fork of a task type. `legDist`: monotonic and bounded, and exactly the furthest half metre where the letters reach `READ_THR`. Every fork in the content is inside the budget rule. |
| `lamp.test.mjs` | `TUNE` equals the `TUNE = { ... }` line in HANDOVER.md section 6. Night depth, the read share, the drain with its cap, endless drain by speed, the right-answer refuel with the streak, and a whole level's drain against its closed form. |
| `voice.test.mjs` | `voice/hash.js`, loaded as the browser loads it, equals Node's sha1 for Dutch letters, the euro sign and every SHA-1 block boundary. It trims. Every line in `voice/lines.json` has the id the browser computes. `voiceFileOf` tries only the asked voice before `ids.json` arrives, then the asked voice first and the others in order, and gives null when nothing is rendered. |
| `validate.test.mjs` | A clean made-up level passes. Each of the validator's 40-odd rules fires on its own fault. |

To check that the tests catch real faults, I made seven one-line changes to `src/`: drain 2.5, a streak cap of 5,
no listen label, read x1.4, one option too many, and a coarser `legDist` step. Each change failed at least one test.
The `legDist` step change failed only after I added the boundary test.

**Acceptance: `npm test` runs everything headless-free in under 30 seconds.** `npm test` runs `qa/check-versions.mjs`,
`npm run validate` (bundle freshness, validator, fork, distractor and thread audits) and `npm run unit`. It took
**9.7 s** on the server, and `npm test` took 4 s inside the CI job.

## 4. CI: `.github/workflows/ci.yml`

`/home/santi/dutch-arcade-wt/tests/.github/workflows/ci.yml` (https://github.com/SScleves/NachTrit/blob/dt/tests/.github/workflows/ci.yml)

It runs on every push to `main` and `dt/**`, and by hand.
- `checks`: Node 20, `npm ci`, `npm test`.
- `ride`: depends on `checks`. Installs Playwright's Chromium, runs `node qa/ride.mjs 1,75`, keeps the summary cards and
  `report.json` as an artifact, and stops at 10 minutes.

The first run (commit `273e1cf`, run 43064872116) passed. `checks` took 17 s. `ride` took 116 s, of which the browser
install was 25 s and the ride 75 s. That run still drew each chunk; the ride now takes about a third of that locally.
The SwiftShader ride is well under the 10 minute limit, so it stays in CI.

## 5. What changed in `index.html`, and why the game is identical

The pure rules moved, as they were, into plain ES modules that `index.html` imports
(https://github.com/SScleves/NachTrit/tree/dt/tests/src):

| Module | What it holds | Before, in `index.html` |
|---|---|---|
| `src/tasks.js` | `TASKS`, `TASK_OF_RULE`, `wordBag`, `isPureReorder`, `taskOf` | the task labels block |
| `src/reading.js` | `READ_THR`, `READ_AHEAD`, `HOLD_AT`, `wordsIn`, `readBudget`, `legDist` | the reading-time block |
| `src/lamp.js` | `TUNE`, `nightAt`, `lampReadK`, `lampLoss`, `refuelRight` | `TUNE`, `refuelRight`, the drain line in `update()`, `nightDepth` |
| `src/forks.js` | `itemToEntry`, `levelQueue` | the same two functions |
| `src/voice.js` | `VOICES`, `VOICE_ALL`, `voiceFileOf` | the voice constants and the body of `voiceFile` |

`src/package.json` only tells Node to read `src/` as modules. The browser ignores it.

The edits in `index.html`:
- five `import` lines at the top of the module;
- the moved definitions are gone;
- `levelQueue(L)` became `levelQueue(L, LANE_X.length)`, and `refuelRight()` became `refuelRight(S.streak)`;
- the drain line calls `lampReadK` and `lampLoss`;
- `nightDepth` calls `nightAt`, and `voiceFile` calls `voiceFileOf`;
- `window.NRTUNE` is still the same `TUNE` object, so the bots can still change it;
- `window.NRbike()` also returns `dogs`, for the intro check;
- NR_VERSION is 37 (`check-versions --bump`, 65 local scripts and imports).

Why it plays the same:
- The moved lines are character for character the same, except for the `lanes` argument.
- `Math.random` is called in the same order.
- The drain keeps its multiplication order, so the floating point result is the same.
- The one dropped line was dead code: an unused `pool` map in `levelQueue` with no random draws.
- `taskOf` calls `isPureReorder(fork.o)`, which is the same expression.

I compared seeded rides of the old `HEAD` (a `git archive` copy) and the new tree on every reported field, including
frames, distance, score and cents. They were identical on:
- levels 1 and 75, always right;
- levels 12 and 75, missing every third fork as a first-time player (wrong path, mistakes list, teaching forks).

The validator's output is byte for byte the same, and the three audits still match their committed reports.
`qa/lib/tasks.mjs` was a copy of `taskOf` and is now a thin wrapper over `src/tasks.js`. The validator's rules moved to
`qa/lib/validate.mjs`, and `qa/validate-content.mjs` calls them.

## 6. End-of-phase checklist

1. `node qa/validate-content.mjs`: 0 errors, 0 warnings.
2. Unit tests: 49 of 49 pass.
3. `qa/dt/gpu-shot.mjs --renderer webgl` on 1, 12, 58, 75, 123 after the bump (`/home/santi/dutch-arcade-wt/tests/qa/out/dt-tests/gpu-levels`): 0 errors on all five.

   | Level | draw calls | fps over 10 s |
   |---|---|---|
   | 1 | 491 | 59.5 |
   | 12 | 568 | 60.0 |
   | 58 | 307 | 60.1 |
   | 75 | 428 | 60.2 |
   | 123 | 533 | 59.9 |

4. The step ride finishes levels 1 and 75 (table in section 1).
5. All 14 intro shots look right (section 2).
6. `check-versions --bump` to 37; commits in steps; branch pushed.
7. This report. `STATUS.md` and `HANDOVER.md` (new section 9, and the `TUNE` line now names `src/lamp.js`) are updated.

## Open

- **Two readings ride as a single sign** (content, found by the new test): L98 "Mis je de laatste boot, dan woon je hier
  voortaan." and L113 "Doe mij maar een stuk kersenvlaai.". A reading without its own `o` takes its distractors from
  the other en-only readings in its level. In these two levels there are none, so the sign shows only the answer.
  The fix is an `o` list on each item, for the content branch. `forks.test.mjs` lists the two as known, and any new
  case fails.
- `npm run voice:check` exits 1: 100 mp3 files in `voice/` have no line in `lines.json`. They are orphans, not
  missing audio. I left it out of `npm test` for that reason.
- The ride does not draw, so it cannot see shader or render errors. `gpu-shot` and `intro-sheet` cover those, and
  both need Chrome on a GPU, so they are not in CI.
- `qa/readbot.js` keeps its own fallback copy of the budget (`ownBudget`), used only when a fork has no `budget`, and
  `qa/run.mjs` keeps its own autopilot string. Phase 2 can point both at `src/` and `qa/lampbot.js`.
- I checked for a `npm ci` lockfile sync with `npm ci --dry-run`, and it emptied this worktree's `node_modules`. I
  reinstalled from the lockfile (same versions, playwright 1.47.2). Only this worktree was affected.

## What Santi should try

Nothing a player sees changed, so the check is that the game plays as before.
1. Open http://localhost:8776/index.html. Ride level 1 and level 75 from the map with the arrow keys, pressing up
   at a fork once you have chosen. The ride, the lamp, the task labels and the voice should be as on the live site.
2. Watch the intro from the title (Start, then Space through the panels). The dogs ride beside him only in the street
   shots, and he sits on the sofa in shot 9.
3. In the worktree, run `npm test`, which takes about 10 s and should end with 49 passing, then `node qa/ride.mjs 75`,
   which takes about 15 s and should report home, 20/20, lamp 64.
