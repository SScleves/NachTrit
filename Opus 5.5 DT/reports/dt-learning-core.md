# Phase 3a and 3d on `dt/learning-core`: missed items come back, the why line is seen (11 Nov 2026)

Branch `dt/learning-core` (https://github.com/SScleves/NachTrit/tree/dt/learning-core), worktree
`/home/santi/dutch-arcade-wt/learning`, cut from `main` at `6e36ed4` (NR_VERSION 39), now NR_VERSION 40. Served at
`http://localhost:8778/index.html`. This is the engine half of phase 3. The content half (3b, 3c, 3e to 3g) is on another
branch. `main` was not touched.

## Summary

A wrong answer now teaches. The card stays up where the player is already looking: what he rode, struck out; the right
form in its sentence, in green; the why line, in plain English. It stays for the why line's reading time. The bike crawls,
and the lamp holds. The go key ends it. Three forks later the same item comes back with an "again" tag, at half fare, on
a quiet stretch of road where the lamp does not drain. Missed twice, it comes back once more near the end of the ride. The
end card lists every miss under its rule and names the weakest rule in one line, with a speaker button per item.

A ride with no misses is unchanged to the frame: seeded rides of 1, 11, 58 and 75, collecting wisps and ignoring them,
give identical numbers on 16 fields, frame counts and cents included.

## 1. What the player sees, point by point

**3a. Missed items come back in the same ride**

1. *Back after 3 to 5 other forks, and once more in the last quarter if missed twice.* When the ride of a missed item is
   over, the item goes back in the queue. The unanswered forks already on the road count first, then the queued items. On
   every `--miss` ride below, a first return came after 3 or 4 other forks. A second miss came back in the last quarter of
   the ride: 10 to 18 forks later, or 3 later when the second miss already fell in the last quarter. An item comes back
   at most twice. A miss on the very last item comes back straight
   away (0 forks between), because nothing is left to put between them. If the finish sign was already on the road, it
   moves behind the return.
2. *An "again" tag and half fare.* The card shows a small light AGAIN pill beside the task label. The fare row shows half
   the fare, floored to 10 cents (`FARES.halfFare`: € 2,00 to € 1,00, € 1,50 to € 0,70, € 6,50 to € 3,20). The ride log
   shows the fare actually paid on every return.
3. *Does not count against the delivery total; extends the ride; no lamp drain on the added road; cap 6.* A return does
   not touch delivered, the HUD's delivered count, right and wrong, the words list or the stars. A return answered wrong
   costs no lamp and does not count toward three wrong in a row. Its road is *review road*: an empty stretch with no wisps
   and no obstacles. On it the lamp does not drain, a hit from a zombie bike drifting in costs no lamp, and the night does
   not deepen. Measured lamp lost on review road: 0 on every ride. Each ride got at most 6 returns.
4. *Stars on the first attempt only.* Stars use `S.delivered`, which only first rides raise. Right and Wrong on the end
   card are first rides too.
5. *Lamp balance.* A ride with no misses never makes review road, so the balance table is the same as before (section 3).

**3d. The why line must be seen**

1. *On a wrong answer, the right form and the why line on the card, for the line's reading time; crawl; no drain; the go
   key dismisses it.* The card keeps the task label (and the AGAIN tag on a return). It shows "You rode ~~gehad~~", then
   the sentence up to this gap with the right form in green and later gaps still open. Then the why line, the fare (struck
   and what was paid, or the refusal, or "Geen cent."), and "↑ or W to ride on." (on a phone, "Swipe up to ride on.").
   It stays for `whyBudget` (0.35 s a word of the why line, at least 3 s). Measured: 3.2 to 3.8 s a card on average, per ride.
   Meanwhile the bike eases to the level's fork speed and stops 1 m short of the next fork's reading range. The next fork
   arms when the card goes. The lamp does not drain (measured lamp lost under the card: 0). Up, W or a swipe up ends it.
   The bottom toast no longer shows on a wrong answer, so the fix is not said twice.
2. *On a right answer keep it short.* Unchanged: the green toast.
3. *Why lines of at most 18 words.* Skipped as asked: the validator enforces it for build forks. It does not check the why
   lines of read items. 84 of those are longer (see Open).
4. *The end card lists the missed items, grouped by rule, weakest rule in one line.* The block is headed "Missed tonight ·
   N". It names the weakest rule, for example "Weakest rule tonight: Verb form, 5 of 8 missed on the first try.". Then
   come the groups under the task labels (Word order, Past tense, Which word, ...), in their colours, the weakest group
   first. Each item has a speaker button (it plays even with the voice off), the sentence with the right form in green
   (for a reading: the sign, "=", the right meaning), what he rode struck out, the why line, and "Right when it came back."
   or "Missed again when it came back.". The weakest rule is the most misses times the share missed on first rides, so 3
   of 3 beats 4 of 15 and 3 of 5 beats 1 of 1. While the list shows, the vault log box is hidden ("Copy mistakes" still
   copies it), the words list is shorter, and the end card scrolls when it is taller than the screen.

## 2. What changed, by file

| File | Change |
|---|---|
| `src/review.js` (new, pure) | `AGAIN`, `shouldReturn`, `returnSlot`, `onReviewRoad`, `markRight`, `groupMisses`, `weakLine` |
| `src/reading.js` | `whyBudget` |
| `fares.js` | `halfFare` (and the stub in `src/engine.js`) |
| `src/flow.js` | `resolveFork`: first ride or return, the why card on every wrong answer; `sendBack`, `noteFork`, `missedHtml` |
| `src/plan.js` | a return's filler is empty and its span is review road; half fares; `unplanFinish` |
| `src/loop.js` | no drain on review road or under the why card; the why card's crawl and stop; no lamp lost to a hit on review road |
| `src/hud.js` | `whyCard`, `endWhy`, the AGAIN tag |
| `src/state.js` | the night ignores review road; the new fields |
| `src/input.js`, `src/speech.js`, `src/wallet.js` | go ends the why card; `speak(..., force)`; `settleRide` returns the refusal |
| `index.html` | the card's `.again` and `.whyline`, the end card's `#s_missed`, their styles |
| `qa/ride.mjs` | the learning numbers per ride, reading time after a why card, `--shots` |
| `qa/test/review.test.mjs` (new), `qa/test/reading.test.mjs`, `qa/fares.test.mjs` | 14 + 1 tests, 8 fare rows |

No light, material, mesh or per-frame allocation was added. Review road plans fewer objects, not more. `nachtrit.progress`
is unchanged and nothing new is saved.

## 3. Numbers

All rides: `node qa/ride.mjs`, SwiftShader, seed 1, unless marked GPU. Before = `6e36ed4` (the base, also run from a
`git archive` of it for `--miss 4`). After = this branch.

**No misses, collecting wisps** (identical on 16 fields, frames included):

| Level | before | after |
|---|---|---|
| 1 | home 20/20, 20 right, lamp 97.2, lowest 82.3, 16057 frames, 1929 m, 4350 cents | identical |
| 11 | home 20/20, 22 right, lamp 45.9, lowest 40.7, 15417 frames, 2106 m, 6750 cents | identical |
| 58 | home 20/20, 21 right, lamp 64.8, lowest 59.6, 15436 frames, 1982 m, 6050 cents | identical |
| 75 | home 20/20, 25 right, lamp 64, lowest 59.9, 16707 frames, 2180 m, 9800 cents | identical |

**Lamp balance (3a point 5)**, always right, the same bot, seeded (identical before and after, 16 fields):

| Level | collects wisps | ignores wisps |
|---|---|---|
| 1 (Alblasserdam) | home, lamp 97.2 (lowest 82.3) | home, lamp 67.2 (lowest 59.9) |
| 11 (Kinderdijk) | home, lamp 45.9 (lowest 40.7) | dies 15/20 |
| 58 (Zeeland) | home, lamp 64.8 (lowest 59.6) | dies at 20/20, before THUIS |
| 75 (Rotterdam) | home, lamp 64 (lowest 59.9) | dies 18/20 |

Level 1 ignoring wisps still finishes comfortably. That is the tier 1 tuning from before this branch (HANDOVER section 6
measured 70 and 90 there), not a change.

**`--miss 3`** (a wrong sign at every third fork, returns included):

| Level | before | after | returns (right/wrong) | forks between | fares full → paid | review road | lamp lost on it / under why cards |
|---|---|---|---|---|---|---|---|
| 1 | home 14/20, 14 right, 6 wrong, lamp 26.8 | home 12/20, 12 right, 8 wrong, lamp 37.1 | 6 (6/0), cap reached | 3, 3, 3, 3, 3, 3 | 200→100, 150→70 | 550 m | 0 / 0 |
| 11 | dies 9/20 | dies 8/20 | 6 (6/0), cap reached | 3 each | 300→150 | 571 m | 0 / 0 |
| 58 | dies 11/20 | dies 9/20 | 6 (6/0), cap reached | 3 each | 50→20, 350→170 | 575 m | 0 / 0 |
| 75 | dies 7/20 | dies 6/20 | 4 (3/0), died before the 4th | 3, 3, 3 | 500→250, 150→70 | 272 m | 0 / 0 |

The harness misses by fork number and the returns take fork numbers too, so before and after miss different items.
With `--miss 3` a return lands 4 forks after its miss and is never itself missed.

**`--miss 4`** (this one misses returns, so it shows second returns):

| Level | before | after | returns | second returns |
|---|---|---|---|---|
| 1 | home 15/20, lamp 48.2 | home 17/20, lamp 83.9, ★★ | 5 (2 right, 3 wrong) | de keuken back 10 forks later (right); de fiets back 3 later, in the last quarter (missed again, no third) |
| 11 | dies 13/20 | home 16/20, lamp 15.7, ★ | 6, cap reached | Werk jij morgen? 10 later (right); hebben in the last quarter (missed again) |
| 58 | dies 13/20 | dies 16/20 | 5 | de vloed 12 later (right); de meeuw (missed again) |
| 75 | dies 9/20 | dies 11/20 | 6, cap reached | Hoe was jouw dag? 18 later (right) |

**Reading time after a why card.** For every fork, the harness compares the legible seconds it had with its budget,
split by whether a why card came just before. On all 8 `--miss` rides: 0 forks short. The lowest legible/budget right
after a why card was 1.14 to 1.25, and 1.14 to 1.18 elsewhere. The crawl and the stop before the next fork's reading
range keep that fork's budget whole.

**Other rides.** `--teach --miss 3` on 1 and 75 (the first-ride teaching forks plus misses): 0 errors, 0 lamp lost on
review road or under the why cards. Endless with a wrong sign at every fork: why cards show, the go key ends one, no
returns, the end list fills, 0 errors.

`npm test`: the version check, the validator (0 errors, 0 warnings), the audits, `tsc`, and 64 unit tests plus 182 fare
checks, all passing.

**GPU** (`qa/dt/gpu-shot.mjs --renderer webgl --levels 1,12,58,75,123`, a 10 s ride each). Another agent's SwiftShader
Chromium was using about 4 cores (load average 9 to 14), so I ran the base tree (`git archive 6e36ed4`, served on port
8791) and this branch one after the other:

| Level | calls before | calls after | fps before | fps after | errors |
|---|---|---|---|---|---|
| 1 | 509 | 507 | 45.7 | 51.6 | 0 / 0 |
| 12 | 544 | 562 | 41.9 | 47.7 | 0 / 0 |
| 58 | 307 | 323 | 54.1 | 59.6 | 0 / 0 |
| 75 | 469 | 452 | 52.1 | 60.1 | 0 / 0 |
| 123 | 512 | 502 | 46.4 | 59.9 | 0 / 0 |

Draw calls move by tens from load to load, as dt-split.md measured. A first run of the branch alone, at higher load,
gave 521, 605, 334, 442 and 527 calls and 46 to 58 fps, with 0 errors. Level 12 passing 600 on some loads is the known
Gouda swing. gpu-shot rides with no misses, so frame rate is not where this branch would show. On the GPU `--miss 3`
rides (75 and 12) the longest step was 123 and 147 ms per 300-frame chunk, with 0 errors.

**Intro** (`node qa/intro-sheet.mjs`, GPU): 28 frames, 0 failed. The dogs show in 8 and 14 only, the torso in 9, every
luma inside its band. I looked at the sheet and it matches the phase 2 sheet:
`/home/santi/dutch-arcade-wt/learning/qa/out/intro-sheet/2026-11-11T20-11-37/sheet.png`.

## 4. Frames

Real GPU (Intel UHD CML through headless Chrome, `node qa/ride.mjs 75,12 --gpu --miss 3 --shots`):

- The why card after a wrong answer, a sentence with two gaps (L75: "You rode ~~gehad~~", "We **hadden** geen tijd, daarom
  ___ pizza.", the why line, € 6,50 struck to € 3,20, "↑ or W to ride on."; the bike crawls, the next signs far ahead):
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/gpu-shots-final/L75-why.png`
- The why card on a word fork (L12, Gouda: "You rode ~~Wie~~", "**Wanneer** ___?", "wanneer asks when. waarom asks why."):
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/gpu-shots-final/L12-why.png`
- The "again" tag (L12: WHICH WORD and AGAIN side by side, € 2,20 twee euro twintig, half of € 4,50, the signs ahead):
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/gpu-shots-final/L12-again.png`, and on L75
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/gpu-shots-final/L75-again.png`
- The end card with misses (GPU): `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/gpu-shots-final/L12-summary.png`,
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/gpu-shots-final/L75-summary.png`. On SwiftShader, each `--miss`
  ride also wrote one per level, for example
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/final-miss3/L58-summary.png`. The same card before this branch:
  `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/base-miss3/L58-summary.png`.

I looked at every frame. One fix came from them: the why card's later gaps were not drawn (the gap styles only covered
the card's lower line). They are now.

## Open

- **Content request: 84 read-item why lines are over 18 words.** The validator's 18-word rule (`qa/lib/validate.mjs`
  line 51) covers build forks only. A wrong reading shows the why line on the card, so these now matter. The full list,
  with level, word count, sign and line: `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/long-read-why.txt`.
  The worst are 27 to 30 words (L78, L89, L90, L93, L96, L111). Once they are shortened, the same rule can be added to
  `validate.mjs` for read items.
- **Content or engine question: word-fork distractors of another kind.** A word fork takes its wrong options from other
  word items of the level, so a noun can get a verb ("de melding" against "hebben" on L11). Changing `itemToEntry` would
  change every seeded ride, so I left it.
- A miss on the last item of a ride comes back at once, with no forks between (nothing is left to put there).
- Endless has the why card and the end list, but no returns: it has no end and no last quarter.
- A return answered right refuels the lamp as a first ride does (+3 to +4.2) and adds to the streak. A return answered
  wrong still slows the bike by 3, as a first ride does. Both are easy to change in `resolveFork` if Santi wants review to
  be lamp-neutral.
- Review road is empty road. If it feels bare, it could carry scenery-only events (no wisps, no obstacles).
- Nothing is saved across rides: the misses and the weakest rule are this ride only. Phase 4 (save, word book, spaced
  review) should store `S.missList` and `S.tally`.
- In the harness's end-card PNGs a toast or the lane strip can show faintly behind the overlay. Game time runs faster than
  real time there, so the 0.25 s CSS fade has not finished when the picture is taken. It is not seen in play. The lanes
  now also hide on death.
- The vault log ("Copy mistakes") now has one line per missed fork, the same ones the end card lists, including a gap
  missed for the first time on a return. Before, an item that rode twice and was missed twice got two lines.

## What Santi should try

1. Open http://localhost:8778/index.html?unlock=1. Press Start, then pick Alblasserdam on the map and ride level 1. Use
   ← and → to steer, and ↑ or W to go.
2. At a fork, take a wrong sign on purpose. The card should stay up, red-edged: "You rode" with your answer struck out,
   the right word in green, the why line, and "↑ or W to ride on.". The bike crawls. Wait the 3 seconds, or press ↑ to
   ride on at once.
3. Three forks later the same item comes back with a light AGAIN tag beside the task label, at half fare.
4. Miss it a second time: it comes back once more near the end of the ride.
5. At the end, the card shows "Missed tonight", the weakest rule in yellow, the groups by rule and a 🔊 per item. Click a
   speaker.
6. Ride level 75 (Rotterdam) the same way, to see the why card on a sentence with two gaps: the second gap stays open.
7. Ride any level with no mistakes: nothing should have changed.
8. In the worktree: `npm test`, then `node qa/ride.mjs 1,75 --miss 3`. The returns, their fares and "lamp lost on it 0"
   are printed per level.

## Files

- `/home/santi/dutch-arcade-wt/learning/src/review.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/review.js)
- `/home/santi/dutch-arcade-wt/learning/src/flow.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/flow.js)
- `/home/santi/dutch-arcade-wt/learning/src/plan.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/plan.js)
- `/home/santi/dutch-arcade-wt/learning/src/loop.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/loop.js)
- `/home/santi/dutch-arcade-wt/learning/src/hud.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/hud.js)
- `/home/santi/dutch-arcade-wt/learning/src/reading.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/reading.js)
- `/home/santi/dutch-arcade-wt/learning/src/state.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/state.js)
- `/home/santi/dutch-arcade-wt/learning/src/input.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/input.js)
- `/home/santi/dutch-arcade-wt/learning/src/speech.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/speech.js)
- `/home/santi/dutch-arcade-wt/learning/src/wallet.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/wallet.js)
- `/home/santi/dutch-arcade-wt/learning/src/types.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/src/types.js)
- `/home/santi/dutch-arcade-wt/learning/fares.js` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/fares.js)
- `/home/santi/dutch-arcade-wt/learning/index.html` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/index.html)
- `/home/santi/dutch-arcade-wt/learning/qa/ride.mjs` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/qa/ride.mjs)
- `/home/santi/dutch-arcade-wt/learning/qa/test/review.test.mjs` (https://github.com/SScleves/NachTrit/blob/dt/learning-core/qa/test/review.test.mjs)
- `/home/santi/dutch-arcade-wt/learning/Opus 5.5 DT/HANDOVER.md`, section 11 (https://github.com/SScleves/NachTrit/blob/dt/learning-core/Opus%205.5%20DT/HANDOVER.md)
- Ride outputs (not in git): `/home/santi/dutch-arcade-wt/learning/qa/out/dt-learning/` (`base-*` before, `final-*`
  after, `new-*` intermediate, each with `report.json` and a summary PNG per level)
