# dt/reading-time: reading time is a rule (backlog A0b)

Branch `dt/reading-time` from `main` (efa3476), worktree `/home/santi/dutch-arcade-wt/rt`. Not pushed or merged. Status: WIP. The work was paused on Santi's request before the last verification round (see "Not finished").

## What changed

- **Reading budget per fork** (`readBudget` in index.html): 0.35 s per word over every option on screen, plus 1.2 s, clamped to 3 to 7 s. Listen and read items get 1.5x that, so up to 10.5 s; I applied the 1.5x after the cap. De/het and single-word items get 3 s.
- **Legible**: the smallest sign's letters (the em of the drawn font) are at least **1.25% of the viewport height** (10 px on an 800 px window), the sign centre is on screen, and the sign is still **3 m or more ahead**. Closer than about 3 m the boards leave the top of the frame. The engine measures this every frame through the camera (`signFrac`, one shared Vector3, no allocation). `qa/readbot.js` measures it on its own.
- **Approach control**: `planFork` predicts how far away the signs become legible (`legDist`) and works out a slow-down distance (`slowD`) and a card distance (`armD`). As the bike approaches, its speed is set so the remaining legible distance lasts the remaining budget. `forkSlow` is now only the upper limit. If the letters are small, the bike creeps until the sign reads, then waits. Speed between forks, obstacles, wisps and the lamp still rise with the tier, as before.
- **Fork signs read further away**: the letters are as large as the board allows (up to 100 px instead of a fixed 60). Long options are set 0.8 narrow, and very long words down to 0.72. Long options also get a taller board (`G.boardTall`, 2.1 x 1.63 m, shared geometry).
- **Card and voice come first**: they appear at `armD`, which can be before the passenger pickup, so the English is up before the signs read. Read items now say the Dutch sign aloud in the passenger voice at that moment. Listen items already did. For build, word, look and de/het forks the voice still waits until after the fork, because saying the line earlier would give the answer away.
- **Filler after a sentence** gets 0.1 s per word over four longer, at the level's speed.
- **Reading costs no lamp**: while a fork is armed, the lamp drains in proportion to `S.slow / forkSlow`, so slowing below the tier's normal fork speed is free.
- **First gate of a first ride holds**: the bike eases to a stop 7 m before the signs and waits until the player steers. The lamp is paused meanwhile. The toast reads "Ride through the lit sign. The bike waits. Steer with ← → or a swipe." `S.lane` is now a getter/setter, and every write (key, swipe, or the harness setting `NR.lane`) releases the hold.
- **Soft dog bark** at the three teaching forks: two falling sawtooth notes through a band-pass filter, synthesised in Web Audio, panned to the side of the right sign, played when the sign first becomes legible.
- **Debug hooks**: `NRstep(n, each)` now takes an optional per-frame callback, and `NRcam()` is new.
- **Content side**: `itemToEntry` marks word items `word: true`. levels.js has a new comment on `forkSlow`.
- **Docs**: CONTENT-BRIEF.md gained "Word limits are reading limits", and LEVELS.md now has the reading-time rule. Check the distances quoted in the brief against the tables below: since the brief was written, long options are condensed, so they read from further away.
- **New qa tools**: `qa/readbot.js`, `qa/dt/reading-time.mjs` (per-fork table) and `qa/dt/lamp-balance.mjs` (the HANDOVER 6 table).
- **Not changed**: no new lights, assets, or per-frame allocations. Draw calls at forks were 469 to 550 under SwiftShader.

## Legibility per tier (1280x800, autopilot always right, lamp held at 30 or more)

How to read the tables:
- "legible from m (planned)" is the measured distance at which the sign became legible, with the engine's prediction in brackets.
- These tables come from code before the last two commits' spacing changes. Those changes moved the passenger and the gaps (see "Not finished"). The legibility control itself is the same, except that the level 123 run already had the final margin.
- Every fork met its budget.

Level 99 (tier 10), 20/20 delivered, 26 forks, errors 0
| # | kind | words | budget s | legible s | legible from m (planned) | speed then m/s | lowest m/s | ok |
|---|---|---|---|---|---|---|---|---|
| 1 | word | 6 | 3 | 3.9 | 7.9 (6.5) | 1.2 | 1.1 | yes |
| 2 | read | 28 | 10.5 | 11.9 | 9.7 (9) | 1.2 | 0.3 | yes |
| 3 | build | 2 | 3 | 3.8 | 10.1 (13) | 2.2 | 1.7 | yes |
| 4 | build | 2 | 3 | 3.7 | 10.1 (13) | 2.2 | 1.7 | yes |
| 5 | dehet | 2 | 3 | 3.8 | 10 (13) | 2 | 1.7 | yes |
| 6 | build | 2 | 3 | 3.8 | 10 (13) | 2 | 1.7 | yes |
| 7 | build | 14 | 6.1 | 7.2 | 5.6 (5.5) | 0.2 | 0 | yes |
| 8 | build | 2 | 3 | 3.7 | 11.8 (13) | 2.8 | 2.2 | yes |
| 9 | build | 4 | 3 | 3.8 | 12.4 (13) | 3.1 | 2.3 | yes |
| 10 | look | 6 | 3.3 | 4.2 | 7.7 (7.5) | 1 | 0.3 | yes |
| 11 | word | 6 | 3 | 3.7 | 10.1 (12.5) | 2 | 1.7 | yes |
| 12 | build | 2 | 3 | 3.7 | 13.1 (13) | 3.8 | 2.5 | yes |
| 13 | build | 2 | 3 | 3.8 | 10 (13) | 2 | 1.7 | yes |
| 14 | word | 6 | 3 | 3.7 | 11.6 (13) | 2.7 | 2.1 | yes |
| 15 | read | 24 | 10.5 | 11.7 | 5.6 (5.5) | 0.1 | 0 | yes |
| 16 | word | 5 | 3 | 3.8 | 7.2 (10) | 1 | 0.9 | yes |
| 17 | build | 16 | 6.8 | 8 | 5.6 (6.5) | 0.2 | 0 | yes |
| 18 | build | 9 | 4.4 | 5.3 | 6.1 (8.5) | 0.5 | 0.4 | yes |
| 19 | build | 8 | 4 | 4.9 | 9.4 (12.5) | 1.3 | 1.2 | yes |
| 20 | build | 4 | 3 | 3.7 | 12.4 (12.5) | 3.5 | 2.3 | yes |
| 21 | build | 2 | 3 | 3.7 | 12.3 (13) | 3.2 | 2.3 | yes |
| 22 | look | 5 | 3 | 3.8 | 6.8 (7.5) | 0.9 | 0.8 | yes |
| 23 | word | 6 | 3 | 3.8 | 9.5 (12.5) | 1.8 | 1.6 | yes |
| 24 | build | 7 | 3.6 | 4.4 | 12 (12.5) | 2.4 | 1.9 | yes |
| 25 | read | 27 | 10.5 | 12 | 6.1 (5.5) | 0.1 | 0 | yes |
| 26 | read | 27 | 10.5 | 11.7 | 5.4 (5.5) | 0.1 | 0 | yes |
min margin 0.70 s, forks under budget 0
Level 75 (tier 7), 20/20 delivered, 24 forks, errors 0
| # | kind | words | budget s | legible s | legible from m (planned) | speed then m/s | lowest m/s | ok |
|---|---|---|---|---|---|---|---|---|
| 1 | build | 3 | 3 | 3.7 | 15.2 (13) | 7.6 | 2.7 | yes |
| 2 | build | 3 | 3 | 3.7 | 11.9 (13) | 3.4 | 2.1 | yes |
| 3 | build | 3 | 3 | 3.8 | 10.7 (13) | 2.5 | 1.9 | yes |
| 4 | word | 6 | 3 | 3.8 | 8.3 (11) | 1.4 | 1.2 | yes |
| 5 | build | 3 | 3 | 3.7 | 10 (13) | 1.9 | 1.7 | yes |
| 6 | build | 3 | 3 | 3.7 | 10.7 (13) | 2.2 | 1.9 | yes |
| 7 | build | 3 | 3 | 3.7 | 13.1 (13) | 3.7 | 2.5 | yes |
| 8 | build | 2 | 3 | 3.7 | 10 (13) | 2 | 1.7 | yes |
| 9 | word | 6 | 3 | 3.8 | 9.4 (12.5) | 1.7 | 1.5 | yes |
| 10 | build | 6 | 3.3 | 4.1 | 9.4 (12.5) | 1.6 | 1.4 | yes |
| 11 | build | 2 | 3 | 3.8 | 12.2 (13) | 3 | 2.3 | yes |
| 12 | read | 16 | 10.2 | 14.4 | 6 (5.5) | 0.1 | 0 | yes |
| 13 | word | 6 | 3 | 3.7 | 10.8 (11) | 2.6 | 1.9 | yes |
| 14 | build | 2 | 3 | 3.7 | 10.1 (13) | 2 | 1.7 | yes |
| 15 | build | 3 | 3 | 3.7 | 10 (13) | 2 | 1.7 | yes |
| 16 | listen | 6 | 4.9 | 5.8 | 10 (12.5) | 1.1 | 1.1 | yes |
| 17 | listen | 6 | 4.9 | 5.9 | 8.3 (11) | 0.8 | 0.8 | yes |
| 18 | build | 5 | 3 | 3.7 | 12 (12.5) | 2.9 | 2.2 | yes |
| 19 | read | 16 | 10.2 | 11.6 | 5.4 (6.5) | 0.1 | 0 | yes |
| 20 | word | 6 | 3 | 3.8 | 9.4 (12.5) | 1.8 | 1.5 | yes |
| 21 | word | 6 | 3 | 4 | 12.4 (13) | 3 | 1.8 | yes |
| 22 | word | 6 | 3 | 3.8 | 11.4 (12.5) | 2.5 | 2.1 | yes |
| 23 | word | 6 | 3 | 3.8 | 8.3 (11) | 1.4 | 1.2 | yes |
| 24 | look | 6 | 3.3 | 4 | 11.7 (12.5) | 2.6 | 2 | yes |
min margin 0.70 s, forks under budget 0
Level 1 (tier 1), 20/20 delivered, 20 forks, errors 0
| # | kind | words | budget s | legible s | legible from m (planned) | speed then m/s | lowest m/s | ok |
|---|---|---|---|---|---|---|---|---|
| 1 | word | 4 | 3 | 4.7 | 17.8 (19) | 3.9 | 3.1 | yes |
| 2 | word | 4 | 3 | 4.4 | 17.7 (19) | 4.1 | 3.3 | yes |
| 3 | word | 4 | 3 | 3.8 | 15.5 (19) | 3.4 | 3.3 | yes |
| 4 | word | 4 | 3 | 4.4 | 17.8 (19) | 3.8 | 3.3 | yes |
| 5 | word | 4 | 3 | 4 | 16.3 (20) | 3.3 | 3.3 | yes |
| 6 | word | 4 | 3 | 4.7 | 18.5 (20) | 3.8 | 3.3 | yes |
| 7 | listen | 4 | 4.5 | 5.4 | 15.4 (19) | 2.4 | 2.2 | yes |
| 8 | word | 4 | 3 | 3.9 | 15.6 (19) | 3.3 | 3.3 | yes |
| 9 | word | 4 | 3 | 3.8 | 15.5 (19) | 3.3 | 3.3 | yes |
| 10 | look | 4 | 3 | 4.1 | 16.3 (20) | 3.3 | 3.3 | yes |
| 11 | look | 4 | 3 | 4.1 | 16.3 (20) | 3.3 | 3.3 | yes |
| 12 | word | 4 | 3 | 4.4 | 17.8 (19) | 3.9 | 3.3 | yes |
| 13 | word | 4 | 3 | 4.1 | 16.4 (20) | 3.3 | 3.3 | yes |
| 14 | word | 3 | 3 | 4.1 | 16.4 (20) | 3.3 | 3.3 | yes |
| 15 | word | 4 | 3 | 4 | 16.3 (20) | 3.3 | 3.3 | yes |
| 16 | read | 5 | 4.5 | 5.4 | 15.4 (19) | 2.4 | 2.2 | yes |
| 17 | read | 4 | 4.5 | 5.4 | 18.6 (20) | 3.3 | 2.8 | yes |
| 18 | word | 3 | 3 | 4.1 | 16.3 (20) | 3.3 | 3.3 | yes |
| 19 | look | 4 | 3 | 4.1 | 16.4 (20) | 3.3 | 3.3 | yes |
| 20 | build | 2 | 3 | 4.7 | 18.5 (20) | 3.8 | 3.3 | yes |
min margin 0.80 s, forks under budget 0

Level 123 (tier 13), 24/24 delivered, 30 forks, errors 0
| # | kind | words | budget s | legible s | legible from m (planned) | speed then m/s | lowest m/s | ok |
|---|---|---|---|---|---|---|---|---|
| 1 | build | 6 | 3.3 | 4.1 | 16.6 (13) | 9.9 | 2.6 | yes |
| 2 | build | 6 | 3.3 | 4 | 12.8 (12.5) | 4.8 | 2.1 | yes |
| 3 | build | 3 | 3 | 3.7 | 10.7 (13) | 2.9 | 1.8 | yes |
| 4 | build | 4 | 3 | 3.7 | 9.5 (12.5) | 1.9 | 1.5 | yes |
| 5 | build | 2 | 3 | 3.7 | 10.1 (13) | 2.3 | 1.7 | yes |
| 6 | word | 5 | 3 | 3.8 | 7.8 (10.5) | 1.2 | 1.1 | yes |
| 7 | word | 6 | 3 | 3.7 | 11.1 (12.5) | 2.4 | 2 | yes |
| 8 | word | 4 | 3 | 3.7 | 10 (13) | 2 | 1.7 | yes |
| 9 | read | 18 | 10.5 | 11.8 | 6.6 (6.5) | 0.2 | 0 | yes |
| 10 | word | 6 | 3 | 3.7 | 12.4 (13) | 3.2 | 2.3 | yes |
| 11 | listen | 6 | 4.9 | 5.8 | 12.2 (12.5) | 1.7 | 1.2 | yes |
| 12 | dehet | 2 | 3 | 3.7 | 10.1 (13) | 2 | 1.7 | yes |
| 13 | listen | 6 | 4.9 | 7.5 | 6.2 (4.5) | 0.1 | 0.1 | yes |
| 14 | dehet | 2 | 3 | 3.7 | 14.1 (13) | 3.9 | 2.8 | yes |
| 15 | build | 4 | 3 | 3.7 | 10.3 (13) | 2.1 | 1.8 | yes |
| 16 | build | 2 | 3 | 3.7 | 12.6 (13) | 3.3 | 2.4 | yes |
| 17 | word | 5 | 3 | 3.8 | 12 (13) | 3.2 | 2.2 | yes |
| 18 | read | 26 | 10.5 | 13.7 | 4.9 (4.5) | 0 | 0 | yes |
| 19 | word | 5 | 3 | 3.7 | 9.4 (12.5) | 1.8 | 1.5 | yes |
| 20 | word | 6 | 3 | 3.7 | 10.7 (12.5) | 2.3 | 1.9 | yes |
| 21 | word | 6 | 3 | 3.8 | 7.7 (10.5) | 1.2 | 1.1 | yes |
| 22 | word | 4 | 3 | 3.7 | 10 (13) | 2 | 1.7 | yes |
| 23 | build | 8 | 4 | 6.1 | 4.6 (5.5) | 0.1 | 0 | yes |
| 24 | build | 6 | 3.3 | 4.1 | 10 (13) | 1.8 | 1.6 | yes |
| 25 | build | 3 | 3 | 3.7 | 10 (13) | 1.9 | 1.7 | yes |
| 26 | read | 26 | 10.5 | 14 | 4.8 (4.5) | 0 | 0 | yes |
| 27 | build | 2 | 3 | 3.7 | 13.3 (13) | 4 | 2.5 | yes |
| 28 | build | 10 | 4.7 | 5.6 | 11.1 (11.5) | 1.5 | 1.3 | yes |
| 29 | listen | 6 | 4.9 | 5.9 | 9.5 (12.5) | 1 | 1 | yes |
| 30 | word | 5 | 3 | 3.8 | 9.4 (12.5) | 1.8 | 1.5 | yes |
min margin 0.70 s, forks under budget 0

Before the change (main's signs, the same 1.25%-style measure at 1.75%): at level 75, 26 of 26 forks were under budget, and the signs were legible for 0 to 0.2 s at 4.5 to 6 m/s.

## Lamp balance (qa/lampbot.js through qa/dt/lamp-balance.mjs)

| Level | main collect | main ignore | branch collect | branch ignore |
|---|---|---|---|---|
| 1 | finishes, 69 left | finishes, 55 and 20 in two runs | finishes, 83 | finishes, 22 in one run; dies 19/20 in another |
| 11 | finishes, 77 | dies 17/20 | finishes, 86 | dies 14/20 |
| 58 | finishes, 58 | finishes, 1 left | finishes, 53 | dies 15/20 |
| 75 | finishes, 58 | dies 19/20 | finishes, 25 (before the spacing fix) | not rerun |

The shape from HANDOVER section 6 still holds: a rider who collects wisps finishes, and one who ignores them dies or barely finishes. Ignore runs vary a lot between runs, even on main. The exception was level 75 when collecting: it dropped to 25 left because long sentences added about 420 m of road. I then cut that extra road. The passenger now stands at slowD + 10 and the card reaches back into the filler. Gaps within a sentence are slowD + 8, and the filler adds 0.1 s per word instead of 0.2. The rerun of level 75 was stopped before it finished. TUNE is unchanged.

## Checks

- `node qa/validate-content.mjs`: 0 errors, 0 warnings.
- `qa/dt/first-five.mjs` at 1280x800 (on commit 47c0285, plus the uncommitted spacing change made while it ran): errors 0. Every step behaved as expected: the teach forks with decals and chevrons, the first gate holding and then releasing on the harness lane write, the taught key, the lamp toast, and the end card with 17 of 17 right. Frames are in `qa/out/rt-ff/`.
- Frames in `qa/out/rt/`: L123, L75, L1hold (the bike waiting, the toast showing), L1phone. Letters are clearly larger than on main.

## Not finished (pick up here)

1. Rerun `node qa/dt/reading-time.mjs <url> 1,75,99,123` and `node qa/dt/lamp-balance.mjs <url> 1,11,58,75` on the WIP commit. If level 75 collect is still well below main's 58, retune.
2. `node qa/check-versions.mjs --bump`, then `NR_URL=... node qa/run.mjs 1` and `75`, one at a time. None of these has been run yet.
3. Look for signs hidden by the rider (the middle lane) or by look props. The legibility measure does not check occlusion.

## For the laptop agent to confirm on the GPU

- Whether the larger and condensed letters and the taller board read well on the Iris Xe.
- Whether the slow crawl and the waits at long-text forks feel acceptable. At tier 13 with long options the bike almost stops for 5 to 10 s.
- The bark's volume and panning.
- That the hold toast does not cover the signs on phones.
- That draw calls stay under 600 at forks, and that frame time does not change from the per-frame `signFrac` projections (2 or 3 per frame).
