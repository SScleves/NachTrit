# Phase 5 on `dt/payoff`: words come back, the halfway bus stop, town dawn (12 Nov 2026)

Branch `dt/payoff` (https://github.com/SScleves/NachTrit/tree/dt/payoff), worktree `/home/santi/dutch-arcade-wt/payoff`, cut
from `main` at `dca55df` (NR_VERSION 43), now NR_VERSION 44. Served at `http://localhost:8780/index.html`. `main` was not touched.

This branch builds items 1, 2 and 5 of PLAN.md phase 5. Item 3 (the Amsterdam ending) and item 4 (the shop) are not built.
Both wait for Santi.

## Summary

A ride now starts with two street lamps in three dead and the shop boards blank. When the player answers right, the Dutch
word leaves the sign as a small golden glyph. It flies up the street to the nearest dark lamp or blank board, and that lamp
or board catches. A lamp burns again, and a board gets its trade back. It stays that way for the rest of the ride.

After half the deliveries, a lit bus stop stands on the right verge. If the lamp dies after he has passed it, the ride
starts again just before the stop with half a lamp. This happens once a ride, and that ride can earn two stars at most.

When every place in a town has three stars, its rides play at dawn. The haze lifts to a pale grey, every window is lit,
the dead have faces again (they still send the Tikkie), and every lamp burns. A card gives the town's rumour as still
unconfirmed, and the town glows on the map.

## 1. Acceptance, point by point

1. **On level 1 a right answer visibly lights something.** On level 1 (Alblasserdam, the dike street) 4 of the 10 lamps
   are lit at the start. The first right answer, at 19.8 game seconds, sends "het huis" to a dark lamp 31 m ahead, and
   that lamp lights. In the seeded ride of level 1, all 20 right answers reach something: 6 light a dark lamp and 14 make
   a lit lamp flare. After the 6th answer every lamp in the street is lit. Frames:
   - `qa/out/payoff/words4/L1-word-flying.png`: the word in the air, the target lamp still dark.
   - `qa/out/payoff/words4/L1-lamp-catches.png`: the lamp after the word landed.
2. **Blank shop signs get their word back one by one.** On level 60 (Utrecht, the shops street) the 27 boards start
   blank. After ten right answers, 8 have their word back. Frames:
   - `qa/out/payoff/signs60/L60-signs-blank.png`: the start, boards blank.
   - `qa/out/payoff/signs60/L60-word-to-sign.png`: "half acht" on its way to a board.
   - `qa/out/payoff/signs60/L60-signs-later.png`: CAFÉ HET TERRAS worded again.
3. **No new lights, at most 20 extra draw calls, no per-frame allocations.** The light count is still exactly 4.
   - A dead lamp is its halo swapped for one shared dim material, with its cone, pool and reflection hidden. Lighting it
     puts the shared materials back.
   - A blank board shows one shared blank texture. Giving its word back puts its own texture back.
   - The glyphs are a pool of 4. Each has a word sprite and a halo sprite, so at most 8 draw calls, and in practice 1 or
     2 are in the air.
   - Nothing is allocated in `wordsTick`. It uses preallocated vectors only.
4. **Town dawn.** The rule is `townDawn`: every place with an id under 1000 that is not marked soon has three stars.
   `?dawn=<town id>` forces dawn for one town. Frames:
   - `qa/out/payoff/dawnstop/dawn-gouda-card.png`: level 12 at dawn with the card ("Bad cheese. Gouda denies everything.
     Still unconfirmed. / Slechte kaas. Gouda ontkent alles. Nog steeds niet bevestigd.").
   - `qa/out/payoff/dawnstop/dawn-gouda-street.png`: the dead standing as people, windows lit, all 11 lamps lit.
   - `qa/out/payoff/dawnstop/dawn-gouda-fork.png`: a fork at dawn.
   - `qa/out/payoff/dawnstop/dawn-gouda-map.png`: Gouda glowing on the map, labelled "dawn".

   It is all driven from values that already existed: the fog colour and density, the sky dome scalar, the hemisphere
   light's intensity, the window glow opacity and the night depth that the loop draws with. No light is added. The lamp's
   drain still follows the real night depth, so a dawn ride plays the same as a night ride.
5. **The checkpoint.** In `node qa/ride.mjs 75,58 --ignore`, level 75 is identical to main up to the dead lamp at 2025 m
   (main: dies there with 18 of 20 delivered). It then restarts from the stop at 1027 m with lamp 50 and rides the second
   half again. It dies a second time at 1630 m with 14 of 20 delivered and the summary card. Level 58 does not die and is
   identical to main.

   `node qa/ride.mjs 1 --die-after-stop` puts the lamp out 40 m after the stop. The ride restarts and gets home 20 of 20,
   ★★☆. The star cap is also unit-tested. In practice the lowest-lamp rule already rules out three stars after any death,
   because the lowest lamp is then 0.

   Frames:
   - `qa/out/payoff/dawnstop/L75-bus-stop.png`: the stop ahead on the right, with the lit poster box and the yellow H, as
     he answers.
   - `qa/out/payoff/stop/L75-restart.png` and `qa/out/payoff/dawnstop/L75-restart.png`: "Terug bij de halte. Half a lamp.
     Ride on from here: this ride can earn 2 stars at most." with the stop ahead.
6. **With the phase 3 returns and the phase 4 review forks.**
   - Passing the stop saves the queue in road order, so returns and review forks already planned beyond it ride again.
   - It also saves review road, the return counters and `missN`.
   - Review forks and returns do not count toward "half the deliveries".
   - The learner model keeps what happened (`S.noted` is not rolled back), so a replayed item does not move its box twice.
7. **Harness and lamp bot.**
   - `qa/ride.mjs` reports `checkpoint` and `words` for each level, and prints a line for each.
   - `--die-after-stop` forces the restart.
   - In always-right collecting mode a restart counts as a death and fails the run.
   - The lamp bot (`qa/lampbot.js` `__sim`) now rides on through the dying and intro modes.
   - `qa/dt/lamp-balance.mjs` has a "bus stop restart" column and a stars column. On the GPU against port 8780:

| Level | mode | result | delivered | lamp left | lowest lamp | bus stop restart | stars |
|---|---|---|---|---|---|---|---|
| 1 | collect | finishes | 20/20 | 90 | 81 | no | ★★★ |
| 1 | ignore | finishes | 20/20 | 66 | 66 | no | ★★★ |
| 75 | collect | finishes | 20/20 | 60 | 60 | no | ★★★ |
| 75 | ignore | dies | 14/20 | 0 | 0 | yes (stop at 1231 m) | - |

## 2. The ride comparison (play unchanged)

On main (`dca55df`, a clean export) `node qa/ride.mjs 1,75` gives:
- L1: home 20/20, 20 right, lamp 97.2, 267.6 game s.
- L75: home 20/20, 25 right, lamp 63.9, 279 game s.

On this branch the numbers are the same. Compared field by field over the whole report JSON, apart from the timing fields
(wall s, chunks, evaluate ms), nothing differs. The only additions are the new `words` and `checkpoint` fields.
`node qa/ride.mjs 75,58 --ignore` is also identical to main field by field until the death on 75, as described above.

**Random draws: one thing to know.** three.js draws four `Math.random` numbers for the uuid of every object, material,
texture and geometry it makes. My first version made the glyphs and materials normally, and level 1 moved by 23 m (1929 to
1904 m, 267.6 to 265.3 s). The fix is `ownDraws` in `src/payoff.js`: everything new in this phase (the glyphs, the dead
lamp, blank sign and glyph materials, the bus stop) is built on a generator of its own. The game's draws are then exactly
what they were. The bus stop is placed without moving the planner's cursor and adds nothing that draws. This is now a rule
in HANDOVER section 13.

## 3. Tests, intro, voice

- `npm test`: green (version check, validate with 0 errors and 0 warnings, types, 107 unit tests).
  `qa/test/payoff.test.mjs` covers:
  - the dead-lamp pattern;
  - the glyph target choice (nearest dark one in range, busy targets skipped, a lit lamp flares, a lit sign does not);
  - halfway, the restart rule and the star cap;
  - the dawn condition (soon, bonus and trophy places do not count; a town with no places never dawns);
  - that `ownDraws` leaves the game's sequence alone and is restored after a throw.
- `node qa/intro-sheet.mjs`: 28 frames, 0 failed. Sheet:
  `/home/santi/dutch-arcade-wt/payoff/qa/out/intro-sheet/2026-11-12T00-04-07/sheet.png`.
  - Main's sheet was shot back to back from the clean export.
  - **Shot 11 has the same luma as main** (46 and 47).
  - Other shots differ from main by 1 to 3. Two runs of this branch differ from each other by the same amount (s14 t=2
    gave 64 and 63), so this is run-to-run noise.
  - Dawn and dead lamps never reach the intro, because every `buildScenery` puts the night back.
- Voice:
  - `node qa/voice-batch.mjs`, `npm run voice` and `npm run voice:check` gave 4902 lines and 0 lines without a file. The
    180 orphan files are known.
  - New files are `voice/ab605af74d0d.mp3` ("Nog steeds niet bevestigd.") and `voice/bb54f0b4bd05.mp3` ("Terug bij de
    halte."). The rumours already had their files.
  - A Dutch literal spoken through a variable or `speakSeq` is now marked `/* voice */ '...'`, and `qa/voice-batch.mjs`
    picks it up.

## 4. GPU run against main (back to back, Intel iGPU, WebGL)

`node qa/dt/gpu-shot.mjs --base <url> --renderer webgl --levels 1,12,58,75,123`, main on 8765 and then this branch on 8780.
Both runs used this branch's copy of the tool.

| Level | main calls | payoff calls | main fps | payoff fps | errors |
|---|---|---|---|---|---|
| 1 | 517 | 515 | 59.6 | 59.5 | 0 / 0 |
| 12 | 560 | 516 | 59.9 | 60.0 | 0 / 0 |
| 58 | 347 | 287 | 60.1 | 59.9 | 0 / 0 |
| 75 | 466 | 417 | 60.1 | 60.2 | 0 / 0 |
| 123 | 502 | 514 | 60.2 | 60.0 | 0 / 0 |

All are under 600. Dead lamps draw three pieces fewer each, which is why most levels drop. Level 123 is 12 higher. The
gpu-shot ride is not seeded, so the street at its 8 s frame differs between runs (a glyph in the air is 2 calls).

The gpu-shot now adds `dawn=0`. It seeds three stars for every level, which would otherwise put every town at dawn.
Main ignores the parameter. Frames are in:
- `/home/santi/dutch-arcade-wt/payoff/qa/out/gpu-shot/main-cmp/`
- `/home/santi/dutch-arcade-wt/payoff/qa/out/gpu-shot/payoff-cmp/`

## 5. What changed, by file

- **New:**
  - `src/payoff.js` (pure rules)
  - `src/words.js` (dead lamps, blank boards, glyphs)
  - `src/dawn.js` (window atlas, the dead as people, the night put back on every `buildScenery`)
  - `qa/test/payoff.test.mjs`
  - `qa/dt/payoff-shots.mjs` (the GPU frames above; `--probe` lists lamps and boards per level)
- **Changed:**
  - `src/plan.js`: the bus stop, `placeStop`.
  - `src/flow.js`: `passStop`, `restartFromStop`, the star cap, dawn and words at `start()`.
  - `src/loop.js`: passing the stop, the restart after dying, the dawn look and its card, `wordsTick`.
  - `src/map.js`: `townAtDawn`, the glow, `?dawn=`.
  - `src/houses.js`: boards tagged `shopWord`.
  - `src/scenery.js`: `sceneryHooks`, and disposing the board's own texture.
  - `src/zombies.js`: exports `ZEYE_MAT`.
  - `src/debug.js`: `NRwords`.
  - `src/main.js`, `index.html` (the map glow's CSS), `qa/ride.mjs`, `qa/lampbot.js`, `qa/dt/lamp-balance.mjs`,
    `qa/dt/gpu-shot.mjs`, `qa/voice-batch.mjs`.

## 6. Open

- **Streets with few lamps.**
  - Level 1 is fully lit after 6 right answers. After that, a right answer makes the nearest lamp flare.
  - On level 58 the street has 3 lamps, and 17 of 21 right answers found nothing in range. Nothing visible happens
    there.
  - A town's own lamps built without `lampLights`, and its own shop boards (Den Haag, Rotterdam, Amsterdam, Groningen's
    own rows, Gouda, whose boards are hard to see), take no part. Only the game's `house()` boards blank and come back.
  - If Santi wants every answer to show, the next target could be a window or the far town glow.
- **Dead lamp heads.** A dead lamp's head stays as built when the town's head is merged into its kit (for example
  Alblasserdam's LED panel). Only the halo, cone, pool and reflection go out.
- **The dawn sky.** It is the painted night sky brightened, not a painted morning. It reads as pale haze, but Santi should
  judge it against concept A.
- **Item 4, the shop.** It needs a "stroopwafel: half a lamp" item. That would join this checkpoint's restart and the save;
  nothing has been done.
- **The bus stop text.** "Terug bij de halte." is mine. Santi may want different wording.

## 7. What Santi should try

- Level 1, from the map (http://localhost:8780/index.html?map=alblasserdam): the street starts with most lamps dark.
  Answer right (steer with ← → into the right option) and watch the gold word fly up the street to a dark lamp.
- Level 60 (Utrecht, De winkels, `?map=utrecht&unlock=1`): the shop boards are blank and fill in one by one.
- `?map=gouda&unlock=1&dawn=gouda`: Gouda glows on the map and its town card opens. Ride any Gouda place (level 12 in
  the frames): dawn, the rumour card, the dead as people. Without `dawn=` it comes by itself once all of Gouda has three
  stars.
- Level 75, ignoring the wisps: the lamp dies past the bus stop, the ride restarts there with half a lamp, and the end
  card caps the stars at two.
