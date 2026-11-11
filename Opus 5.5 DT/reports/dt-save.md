# Phase 4 on `dt/save`: one save, the learner model, spaced review, the word book, practice and trophy rides (11 to 12 Nov 2026)

Branch `dt/save` (https://github.com/SScleves/NachTrit/tree/dt/save), worktree `/home/santi/dutch-arcade-wt/save`, cut from
`main` at `6925159` (NR_VERSION 42), now NR_VERSION 43. Served at `http://localhost:8779/index.html`. `main` was not touched.

## Summary

The game now remembers what this player knows. Everything it keeps is in one versioned object, `nachtrit.save`: stars,
best scores, the one-time flags, the voice setting, a ride counter, one short array of numbers per Dutch item met and a
seen/right pair per rule. The old keys from the live site are read on every load and merged in, and are still written for
one version, so nothing is lost and an older page still works.

From the third ride on, up to a quarter of a level's deliveries are items due from earlier levels, the weakest first. They
look and behave like the in-ride returns from phase 3: an AGAIN tag, half fare, quiet review road, and they never count
against the player. A first-time player's ride is unchanged to the frame.

The map has a Word book button with three tabs: Words (every word met, with article, meaning, pictogram, town, speaker and
a five-dot strength mark, filtered by town and strength), Rules (a bar per rule, the three weakest on top) and Save (file
or paste code, to move the progress to another device). The end card offers a practice ride when there were misses. A
saved town offers a trophy ride.

## 1. Acceptance, point by point

1. **Export, clear storage, import restores stars, scores, words and boxes.** `node qa/dt/save-ui.mjs` (Chrome on the GPU)
   builds a save with 21 stars in 10 places, 11 scores, 507 items in boxes 1 to 5 (322 of them words) and 7 rules. It saves
   the file through the button (10,861 bytes) and makes a code (1,991 characters). Then it clears storage and reloads, and
   the save is empty. It loads the file through "Load a file", confirms, and compares the save object field by field with
   the exported one: equal. After another reload it is still equal. The same again with the code pasted into the box:
   equal, and equal after a reload. A code cut short is refused with "This code is incomplete or damaged. Copy all of it
   and try again.". In Node, `qa/test/save.test.mjs` does both round trips on a simulated 105-level player. It also covers
   odd numbers (a fractional score), keys that are no longer in the content, the form without deflate, and a code from
   other content (refused in plain words).
2. **A wrong answer on level 3 shows up as a marked review fork within the next two rides.**
   `node qa/ride.mjs 1,2,3,4,5 --keep --miss 3 --miss-only 3 --gpu --shots` rides five levels in one browser profile, seeded,
   and misses only on level 3. Level 3 had 7 first-try misses. Each one came back as a review fork whose card showed the
   AGAIN tag: vijf, een, elf, twaalf and de lamp on level 4 (the next ride), and de sleutel and de slaapkamer on level 5
   (two rides later; level 4 had only five review slots). The script checks this itself and prints FAIL if a miss does not
   come back. It also showed the rest of the loop. Ride 3 carried 5 items from level 1 that were due (box 2, two rides
   old). One of them, de nacht, was missed, fell to box 1, and came back on ride 5. The pure version is a unit test in
   `qa/test/learn.test.mjs`.
3. **The word book shows the right count.** In the same browser check the book says "322 words met", has 322 rows, and
   `bookWords` over the save gives 322. The strength filter 1 shows "65 of the 322 words met" and Kinderdijk shows 46. A unit
   test lists every word of the content and checks each one against the content: Dutch with its article (de/het nouns),
   meaning, town. It also checks that readings and sentences are kept in the model but not listed as words.
4. **Old saves from the live site load without loss.** The unit test seeds the exact strings the live code writes
   (`nachtrit.progress`, `.scores`, `.intro` short or full, `.taught`, `.go`, `.lamphint`, `.unlock`, `.lost`). It checks
   that every star, score and flag arrives. After the first write the old keys still hold the same values. A second load
   changes nothing. Stars earned later on an older page are merged in, higher value wins. Broken JSON and non-numbers are
   dropped. `?unlock=0` still locks. The browser check seeds the same keys in Chrome before the page loads and finds them
   all in `NRsave()`.

**A first-time player sees no difference.** I rode `node qa/ride.mjs 1,75` (SwiftShader, seed 1) on `main` (`git archive
6925159`) and on this branch, then compared the report JSON field by field, leaving out wall times and the new `save`
block. 72 fields, 0 differ. That includes frames (16057 and 16737), metres, cents, lamp, lowest lamp and every learning
number. I repeated it on the final tree after the last change: 0 differ. Both rides pick no review forks, because nothing
is due yet. `addReview` returns before it hashes anything or draws a random number when the model is empty.

## 2. Save size

A unit test simulates a player who has finished all 105 levels. It rides every level twice in play order, 15 % of first
tries wrong, with the spaced review pick each ride. It gives 3 stars and a best score everywhere, plus the 13 de/het
bonuses:

| | items | nachtrit.save | file | paste code |
|---|---|---|---|---|
| all 105 levels, twice | 2,431 | 55,777 bytes (22.9 per item) | 55,824 bytes | 10,100 characters |
| every one of the 3,656 texts met, large counters | 3,656 | 89,828 bytes | about the same | 1,119 characters (equal records compress) |

Numbers only, one array of four per item (`"k1x9a2b":[3,4,3,17]`). Rules add 51 short pairs. localStorage allows about 5 MB.
In real rides the save grows by about 300 to 400 bytes a level (584, 1007, 1229, 1538, 1833 bytes after rides 1 to 5).

## 3. How it works

**The save** (`src/save.js`, pure, `// @ts-check`): `{ v: 1, ride, stars, scores, flags, settings, items, rules }`.
`loadSave(store)` reads `nachtrit.save`, normalizes it (junk dropped, a newer version's unknown fields kept) and merges the
old keys in. `writeSave` writes it and mirrors stars, scores and flags to the old keys. The flags are intro 1/2, taught, go,
lamphint, unlock and lost. `src/state.js` holds the live `SAVE`. `progress` and `scores` are the same objects, so every
reader is unchanged. No module in `src/` touches localStorage any more except through `persist()`, `flag()` and `setFlag()`.
The save is written at the end card, on a one-time flag, on the voice button, and on `pagehide`.

**The paste code**: the save packed into bytes (varints, floats kept exact), deflated, base64url, starting with `NR1z.`.
Items whose key is in the content go in as one bit each in a bitmap over the content's sorted keys, then their numbers in
columns. That is what keeps a 105-level save at about 10,000 characters instead of 30,000. The bitmap only means something
with the same content, so the code carries the content's fingerprint. A device with other content refuses it and points to
the file. A checksum catches a code cut short.

**The learner model** (`src/learn.js`, pure): an item's key is 36 bits of the voice hash `voiceId('', text)` in base 36.
The text is the entry's Dutch, the same nl the game rides: `entryText` in `src/forks.js`, now shared with `itemToEntry`.
An edit to another item never moves a key. A unit test checks that no two of the 3,656 texts share one. Each record is
`[box, seen, right first try, last ride]`. Right on the first try moves the item up a box (a new item right goes to box 2).
Wrong puts it in box 1. The intervals are 1, 2, 4, 8 and 16 rides. `SAVE.ride` counts level rides. `noteLearn` in
`src/flow.js` notes each fork's rule and each item's first try once per ride. It does this for first rides and review
forks, never for in-ride returns.

**Spaced review** (`addReview` in `src/flow.js`): only on regular levels, and only once the model has items. The candidates
are keys whose first level comes earlier in play order (so the same or a lower tier), not already in this ride's queue.
`selectDue` takes the due ones, ordered by box, then share right, then most overdue, then play order. There is no
randomness. Up to `floor(deliveries / 4)` replace entries at evenly spread positions (`duePositions`, never the first). A
review entry is `{ ...itemToEntry(item, its own level's items), again: 1, due: true }`. Everything a return does applies
unchanged: tag, half fare, review road, never counted, never a lamp lost. A missed review fork also comes back in the same
ride. `S.deliveriesTotal` drops by the number of review forks, so stars count the level's own deliveries. The three-star
rule for long levels still reads `L.deliveries`. The end card adds "From earlier rides: 5 back for review, 4 right on the
first try.".

**Word book, practice, trophy** (`src/book.js`, new; markup and styles in `index.html`):
- Practice (id 3000) is the 20 weakest items: box, then share, then most recent. It has the knobs and town of the furthest
  level they come from, no hint, normal obstacles made light, and each item's wrong options from its own level
  (`lv.pools`, read by `levelQueue`). It gives no stars and no best score, and pays tier 1 fares. The end card title is
  "PRACTISED.".
- The trophy ride (id 2000 + tier) appears in a town's card once the town is saved. It has the knobs of the town's last
  level, `hint: null`, `fareK: 2` (`S.fareK` in `src/plan.js`) and 30 deliveries drawn from all of the town's items.
- `?level=practice` and `?level=trophy-<town>` boot them, and `qa/ride.mjs` takes them as level names.

## 4. What changed, by file

| File | Change |
|---|---|
| `src/save.js` (new, pure) | the save, migration and mirror, file and paste code |
| `src/learn.js` (new, pure) | item keys, box moves, due pick, positions, weakest, content index, word list, rules list |
| `src/book.js` (new) | the word book, practice and trophy levels, export and import, `levelOf` |
| `src/state.js` | `SAVE`, `persist`, `flag`, `setFlag`, `keyOf`, `contentIndex`; progress and scores live in the save |
| `src/flow.js` | ride counter, `addReview`, `noteLearn`, practice end card, review line, Practice ride button |
| `src/plan.js` | `S.fareK` on every fare (1 everywhere but a trophy ride) |
| `src/forks.js` | `entryText`, `sentenceOf`; `levelQueue` reads `lv.pools` when there is one |
| `src/map.js` | Word book button guard, trophy row, practice/trophy mission card fares and words, `pictogram` exported |
| `src/input.js`, `src/intro.js`, `src/loop.js`, `src/render.js`, `src/speech.js` | flags and the voice setting through the save |
| `src/debug.js`, `src/main.js`, `src/types.js` | `NRsave`; `book.js` after `wallet.js`; types for the new fields |
| `index.html` | the book overlay and its styles, the map's Word book button, the end card's Practice ride button |
| `qa/test/save.test.mjs`, `qa/test/learn.test.mjs` (new) | 11 + 17 tests: npm test now runs 99 |
| `qa/ride.mjs` | `--keep`, `--miss-only`, the save block, the review check, the `due` shot, practice and trophy names |
| `qa/dt/save-ui.mjs` (new) | migration, word book count and filters, file and code round trips, 360 px, screenshots |

No light, material, mesh or per-frame work was added. The word book is HTML over the map. The content index is built once,
when first needed (about 6,000 hashes).

## 5. Other numbers

**Practice and trophy**: `node qa/ride.mjs 1,2,3,practice,trophy-alblasserdam --keep --miss 3 --miss-only 3` (SwiftShader).
Practice: home 20/20, "PRACTISED.", no stars, € 44,50 at tier 1 fares. Trophy, Alblasserdam: home 30/30, 3 stars,
€ 128,00 (double fares), 0 errors.

**GPU** (`qa/dt/gpu-shot.mjs --renderer webgl --levels 1,12,58,75,123`), branch on 8779 then main on 8765, back to back:

| Level | calls branch | calls main | fps branch | fps main | errors |
|---|---|---|---|---|---|
| 1 | 497 | 498 | 59.5 | 59.3 | 0 / 0 |
| 12 | 563 | 570 | 60 | 59.4 | 0 / 0 |
| 58 | 295 | 315 | 60 | 59.8 | 0 / 0 |
| 75 | 465 | 429 | 60.2 | 60.2 | 0 / 0 |
| 123 | 522 | 481 | 60 | 60.1 | 0 / 0 |

Draw calls swing by tens from load to load, as before. gpu-shot seeds `nachtrit.progress` for 140 levels, so it also
exercised the migration on every load.

**Intro** (`node qa/intro-sheet.mjs`): 28 frames, 0 failed, the dogs in 8 and 14 only, the torso in 9. I looked at the sheet
and it matches: `/home/santi/dutch-arcade-wt/save/qa/out/intro-sheet/2026-11-11T23-08-08/sheet.png`.

`npm test`: version check, validator 0 errors 0 warnings, audits, tsc, 99 unit tests plus the fare checks, all passing.

## 6. Frames (real GPU, Intel UHD, headless Chrome; I looked at each)

- Spaced-review fork with its tag (L4: WHICH WORD and AGAIN, "1", € 1,00 half fare, signs drie / een ahead):
  `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/rides/L4-due.png`; also `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/rides/L3-due.png`, `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/rides/L5-due.png`
- End card with the Practice ride button and the review line: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/rides/L3-summary.png`
- Practice ride end card (SwiftShader, before the star row and best score were removed for practice):
  `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/rides/practice-trophy/Lpractice-summary.png`
- Word book, words tab: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-words-desktop.png`,
  filtered by town: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-words-filtered-desktop.png`,
  360 px: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-words-360.png`
- Rules tab: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-rules-desktop.png`, `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-rules-360.png`
- Export and import: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-save-export-desktop.png`, the confirm step
  `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-save-import-confirm-desktop.png`, 360 px `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/book-save-360.png`
- The map with the Word book button: `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/map-desktop.png`, `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/ui/map-360.png`

At 360 px the sheet fills the screen, the page does not scroll sideways (scrollWidth 360), the speaker buttons are 44 px
and the tabs 46 px tall. After the first look I made the strength dots larger (11 to 15 px).

## Open

- **Trophy ride length is a guess.** "All its items" would be 400 to 550 deliveries, about an hour. It rides 30, drawn from
  all of them. `TROPHY_N` in `src/book.js`. Santi's call.
- **Review share.** For a player who keeps riding, nearly every ride from the third on gives a quarter of its deliveries to
  review, because right answers land in box 2 (due in two rides). That is the spec. If it feels like too much, lower
  `REVIEW_SHARE` in `src/learn.js`, or start new right items in box 3.
- **Review forks shorten the level's own count.** Level 4 with five review forks is 15 deliveries for stars, not 20. They
  do not count either way.
- **The paste code works only between devices with the same content.** A code made before a content release is refused
  after it, with a sentence that points to the file. The file always works.
- **The old-key mirror** (`writeSave` in `src/save.js`) should go in the next version. Keep reading the old keys once, for
  players who skip a version.
- **Clearing storage from devtools while a game tab is open** brings the save back: the page writes it on `pagehide`. The
  browser's "clear site data" with the tab closed does not, and that is what `save-ui.mjs` does.
- Endless rides note nothing and do not count as rides.
- Many words have no pictogram yet (PICTO covers the common ones). Those rows show a dim dot, as the mission card does.
- The word book lists words (word, look, listen, de/het items). Readings and sentences are in the model and come back in
  review and practice, but are not listed. A sentence tab could come later.
- CI was not polled (GitHub's queue). `npm test` is the gate and passes.

## What Santi should try

1. Open http://localhost:8779/index.html?map=1. Your live stars should all be there (Word book, Save tab: "This browser has N
   stars ...").
2. Ride Alblasserdam level 1 and 2 without mistakes, then level 3 with two or three wrong signs on purpose.
3. On level 3's end card: "Practice ride" next to Map, and, if the earlier rides are due, "From earlier rides: ... back for
   review".
4. Ride level 4. Some forks carry the AGAIN tag and pay half: those are your level 3 misses and older words. They never
   cost lamp.
5. On the map press "Word book". Words: filter by town and by strength, tap 🔊. Rules: the weakest three on top.
6. Save tab: "Save to a file", then on your phone open the same address, Word book, Save, "Load a file" (or "Make a code"
   on the laptop and paste it on the phone, then "Load this code"). Check the stars and the word count match.
7. With Alblasserdam saved (5 stars), its town card shows a Trophy row: 30 deliveries, no hints, double fares.
8. In the worktree: `npm test`, then `node qa/ride.mjs 1,2,3,4,5 --keep --miss 3 --miss-only 3` and read the "spaced review
   across rides" lines.

## Files

- `/home/santi/dutch-arcade-wt/save/src/save.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/save.js)
- `/home/santi/dutch-arcade-wt/save/src/learn.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/learn.js)
- `/home/santi/dutch-arcade-wt/save/src/book.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/book.js)
- `/home/santi/dutch-arcade-wt/save/src/state.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/state.js)
- `/home/santi/dutch-arcade-wt/save/src/flow.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/flow.js)
- `/home/santi/dutch-arcade-wt/save/src/plan.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/plan.js)
- `/home/santi/dutch-arcade-wt/save/src/forks.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/forks.js)
- `/home/santi/dutch-arcade-wt/save/src/map.js` (https://github.com/SScleves/NachTrit/blob/dt/save/src/map.js)
- `/home/santi/dutch-arcade-wt/save/index.html` (https://github.com/SScleves/NachTrit/blob/dt/save/index.html)
- `/home/santi/dutch-arcade-wt/save/qa/test/save.test.mjs` (https://github.com/SScleves/NachTrit/blob/dt/save/qa/test/save.test.mjs)
- `/home/santi/dutch-arcade-wt/save/qa/test/learn.test.mjs` (https://github.com/SScleves/NachTrit/blob/dt/save/qa/test/learn.test.mjs)
- `/home/santi/dutch-arcade-wt/save/qa/ride.mjs` (https://github.com/SScleves/NachTrit/blob/dt/save/qa/ride.mjs)
- `/home/santi/dutch-arcade-wt/save/qa/dt/save-ui.mjs` (https://github.com/SScleves/NachTrit/blob/dt/save/qa/dt/save-ui.mjs)
- `/home/santi/dutch-arcade-wt/save/Opus 5.5 DT/HANDOVER.md`, section 12 (https://github.com/SScleves/NachTrit/blob/dt/save/Opus%205.5%20DT/HANDOVER.md)
- Outputs (not in git): `/home/santi/dutch-arcade-wt/save/qa/out/dt-save/` (`ui/`, `rides/` with `r-keep.log` and
  `report.json`, `first-time/` with the main and branch reports and `cmp.mjs`)
