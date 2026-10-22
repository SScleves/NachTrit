# Fares and euros: a brief for the implementer

Nachtrit is a browser runner that teaches Dutch. Read `CONCEPT.md`, `MAP.md` and the top half of
`index.html` (one file: scene, planner, forks, HUD, levels) before touching anything. The game is
played by Santi on an Intel laptop in Chrome; it must stay at 60 fps and must never add per-object
lights (shader recompiles stutter) or read a render target it is writing to (black screen).

## What to build

The dead are fares. Every passenger pays, but only for Dutch said right.

1. **A fare per delivery.** When a passenger is picked up (`mountPassenger`), the card shows the fare
   next to the sentence: € 2 to € 12 depending on the tier of the town (A1 cheap, B2 expensive) and
   the number of forks in the sentence. Reading signposts and de/het forks pay a flat small fare.
2. **Pay on delivery, not on pickup.** A delivery with zero wrong forks pays the full fare. Each wrong
   fork halves it. Three wrong and the passenger gets off without paying and says so (a short Dutch
   line from a small pool, dry and funny, e.g. "Dat betaal ik niet.", "Ik had het zelf beter gezegd.").
3. **A wallet in the HUD** (euros with a comma, Dutch style: € 4,50). It counts up with a short tick
   animation when paid. It persists per run only.
4. **Money into the score.** The end-of-run summary shows the wallet and adds it to a new high score
   per level: `score = delivered * 100 + euros * 10 + lampMin`. Store the best score per level in
   `nachtrit.progress` next to stars, show it on the mission card and in the town card badges.
5. **Tips.** A streak of three clean deliveries in a row gives a tip: +€ 1 and the passenger says
   "Hou de rest maar." Show it as the lamp flash already does for right answers.
6. **The bill-splitting zombies** already cost €4,50 when hit. Wire that to the wallet (it can go
   negative, floor at zero, and the toast stays "€4,50 · Tikkie").
7. **Speech.** When a fare is paid, the Dutch voice says the amount ("vier euro vijftig"). Write a
   small `euroToWords(n)` for 0 to 99 euros with cents in whole tens; reuse the number words that
   exist in the levels (nul, een, twee ... negentig, honderd).

## Constraints

- Keep every change inside `index.html` plus, if you want, a new `fares.js` loaded before the module.
  Do not change `levels.js`, `data.js`, `content/*` or `qa/*`.
- No new dependencies. No external assets.
- The look must not change: HUD pills, card, toast and summary already exist; add to them in the same
  style (see the CSS at the top of the file).
- Every string the player sees is English UI with Dutch game text, as now. No exclamation marks.
- Keep `window.NR`, `window.goLevel`, `window.NRinfo`, `window.NRbright`, `window.NRsnap`,
  `window.NRstep` working; the test harness and the reviewer use them.

## Verify before you report

- `node qa/run.mjs 1` and `node qa/run.mjs 6` pass with `errors: 0` and the summary frame shows the
  wallet and the score (look at the PNGs in `qa/out/<stamp>/`). The game server must be running on
  port 8765 (`python3 -m http.server 8765` in the repo).
- Open `http://localhost:8765/index.html?shot=20&level=1&lane=1` in headless Chromium through the
  harness or in Playwright and confirm no error text at the bottom of the page.
- Report what you changed, what the wallet looked like in the frames, and anything you decided that
  the brief left open. Commit on the branch you are on with a clear message. Do not merge.
