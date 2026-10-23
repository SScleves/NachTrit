# Fares and euros: implementation spec

Synthesised from three designs (feel, learning, systems) and three judges. Base: the systems
design. Grafts: the struck meter on the card and the summary line from feel; the amount in Dutch
words, the alsjeblieft line, the rotating tips and the refusal pool from learning. Everything the
judges flagged as must-fix is resolved below. Read FARES-BRIEF.md first; this spec wins where
they differ.

## 1. What the player experiences

A dead passenger climbs onto the rack and the card shows what the ride is worth: "€ 3,00 · drie
euro". Say the sentence right and at the door the voice says the sentence, then the amount in a
lower voice, the Wallet pill ticks up, and after three clean rides in a row the passenger adds
"Hou de rest maar." Say a gap wrong and the fare on the card is struck through with the lower
amount next to it; a one-gap ride that goes wrong pays nothing and the passenger gets off with a
dry line. A zombie's Tikkie takes € 4,50 out of the wallet. The summary shows the wallet, the
score, what the mistakes cost, and the best score for the level.

## 2. Money rules (all amounts integer cents, always a multiple of 10)

- Tier: `fareTier()` = the town's tier for a level (`towns().find(t => t.id === (L.town || TOWN_OF(L.id)))`, fall back to `L.act || 1`); endless (`L === null`) is tier 6. Compute once in `reset()` into `S.fareTier`.
- Passenger fare (word, listen, build entries): `clamp(150 + 50 * tier + 150 * (forks - 1), 200, 1200)`. Tier 1 one fork € 2,00; tier 3 two forks € 4,50; tier 12 three forks € 10,50; cap € 12,00.
- Flat fares: de/het (level 41 and bonus 1001+) € 0,50; look forks € 1,00; reading signposts € 1,50.
- Pay rule, one pure function `payCents(fare, wrong, forks)`: `wrong >= Math.min(3, forks)` pays 0; otherwise `fare / 2^wrong` floored to 10 cents. So a one-fork ride said wrong pays € 0 (Santi's rule), a two-fork ride with one wrong pays half (the brief's halving), three wrong never pays.
- Paid on delivery only: the last fork of the sentence resolves the money. Reads and looks pay on their single fork.
- Refusal: when a ride pays 0, the passenger says a refusal line (section 6) and pays nothing. Suppress refusal, payment and their speech when `S.wrongRow >= 3` (the existing death on the next frame owns that moment).
- Tip: every third clean ride in a row (`S.cleanRow`, reset to 0 by any wrong fork or a Tikkie) pays +€ 1,00 and says a tip line. De/het forks count toward cleanRow but their tip is also € 1,00; that is accepted.
- Zombie Tikkie: in the existing `o.zombie` collision, `taken = min(S.cents, 450)`; `S.cents -= taken; S.tikkie += taken`. The existing toast '€4,50' / 'Tikkie.' stays exactly as it is. The Wallet pill flashes red and shakes once.
- Endless mode pays as tier 6 and saves its best on death. Bonus levels pay flat € 0,50 and their fares are not spoken (the queue would cut the next card).
- Nothing here touches stars, `S.delivered`, `S.good`, `S.bad`, `S.wrongRow` or the lamp.

## 3. State

Add to `const S = {}` and to the `Object.assign` in `reset()`: `cents: 0, walletShown: 0, missed: 0, tips: 0, tikkie: 0, cleanRow: 0, tipN: 0, lastRefuse: '', riding: null, fareTier: 1, score: 0, fxT: 0`. `reset()` also writes `$('wallet').textContent = '€ 0,00'` and clears `#walletfx`. Per sentence state on `st`: `fare`, `lostAt` (-1), and on read forks `fork.fare`. `die()` and `levelDone()` are not changed; `showSummary` reads `S.riding` to add the "Niet afgeleverd" line if a ghost is still aboard.

## 4. Hooks, in build order (index.html unless stated)

1. New `fares.js`, a classic script loaded right after `content/towns-new.js`, one IIFE assigning only `window.FARES = { euroToWords, fmtEuro, fareFor, payCents, FLAT, REFUSE, TIPS }`. No DOM, no Three.js, loadable in node `vm` with a fake window. In the module add a stub `const FARES = window.FARES || { fareFor: () => 0, payCents: () => 0, euroToWords: () => '', fmtEuro: c => '€ 0,00', FLAT: {}, REFUSE: [], TIPS: [] }` so a missing file means no money, never a black page.
2. `#hud`: insert `<div class="pill" id="walletpill"><small>Wallet</small><span id="wallet">€ 0,00</span><span id="walletfx"></span></div>` after Delivered; give the Distance pill `id="distpill"`. CSS: `#walletfx` small, right of the amount, `.lost` red struck, `.tip` gold; `@media (max-width: 520px) { #distpill { display:none } }` (the existing squeeze at 320px remains; say so in the report).
3. `#card`: add `<div class="fare"></div>` after `.nl`. `showCard(who, en, nlHtml, fareHtml)` fills it; `hideCard()` clears it. Helper `fareRow(fare, wrong, forks)`: `'€ 3,00 <i>drie euro</i>'` (words only when `S.fareTier <= 3`), or `'<s>€ 4,50</s> € 2,20'` when `wrong > 0`, computed with `payCents`.
4. `planSentence`: read branch `fork.fare = FARES.FLAT.read`; passengers `st.fare = FARES.fareFor(entry, S.fareTier)`, `st.lostAt = -1`; look entries `st.fare = FARES.FLAT.look`; dehet entries `st.fare = FARES.FLAT.dehet`.
5. The pickup branch in `update()`: after `mountPassenger`, `S.riding = o.st`; pass `fareRow(...)` to each of the three `showCard` calls there and to the five at fork approach.
6. `resolveFork`, right branch: read → `payFare(fork.fare)` then `speakSeq([fork.entry.nl, words])`. Passenger done → `const pay = FARES.payCents(st.fare, st.wrong, st.forks.length)`; if `pay > 0` `payFare(pay)` and `speakSeq([entry.nl, FARES.euroToWords(pay / 100), tipLine])` else `refuse(st)`; then `S.riding = null`. Not done → unchanged except the struck fare shows on the next card.
7. `resolveFork`, wrong branch: `S.cleanRow = 0`; passenger: if `st.lostAt < 0` then `st.lostAt = fork.idx; S.missed += st.fare - FARES.payCents(st.fare, st.wrong, forks)` (recomputed at delivery for accuracy: simpler is to add the final shortfall at delivery, do that); if done → `pay` as above, `refuse` or partial `payFare`, `speakSeq([entry.nl, refusal or words])`, `S.riding = null`. Read wrong → `S.missed += fork.fare`, toast gains 'Geen cent.'. `S.mistakes.push` stays exactly as it is.
8. New functions beside `resolveFork`: `payFare(cents)` (adds to `S.cents`, `S.cleanRow++`, every third adds the tip and sets `#walletfx` to `+ € 1,00` gold), `refuse(st)` (picks from `FARES.REFUSE` filtered by `minTier <= S.fareTier`, never the same as `S.lastRefuse`, shows it on the card's `.fare` row in red, adds `S.missed += st.fare`), `speakSeq(list)` (one `speechSynthesis.cancel()`, then `speak` each item in order; amount and refusal at pitch 0.75; returns early if `!S.voice`). `speak()` itself is unchanged.
9. Zombie collision: the Tikkie rule from section 2, plus `#walletfx` = '− € 4,50' red and a `.shake` class for 400 ms.
10. HUD block in `update()`: tick `S.walletShown` toward `S.cents` at `max(100, |diff| / 0.5)` cents per second, snapped to 10; write `#wallet` only when `FARES.fmtEuro(shown)` changes (the existing hudLast pattern); `tick()` sound once per whole euro crossed, rate-limited to 70 ms. Count `S.fxT` down and clear `#walletfx` at 0.
11. Audio: `tick()` = one sine at 2200 Hz, 25 ms, gain 0.03, shaped like `thump()`.
12. `showSummary(won)`: `S.score = S.delivered * 100 + S.cents / 10 + Math.round(clamp(S.lampMin, 0, 100))`. Add a second `.stats` row with Wallet, Score and Best pills; a line under it: `Fares € x · tips € y · Tikkie − € z · missed € m`. Save: levels only when `won` and `S.score > (scores[L.id] || 0)`; endless always on death against `scores.endless`; then `saveScores()`. On a lost level run show 'Score counts when you get home.'
13. Persistence: new key `nachtrit.scores` = `{ "1": 1337, "41": 1102, "1003": 760, "endless": 2210 }`, read once next to `progress` keeping only finite numbers, written only by `saveScores()` in try/catch. `nachtrit.progress` is NOT touched: every reader and the harness treat its values as numbers.
14. `openMission`: add `#m_fare` under the name: 'Fares here € 2,00 to € 2,90 · best 1284' (range from `fareFor` over the min and max fork counts in `lv.items`; bonus levels '€ 0,50 each').
15. `openTown`: after the star text in each `.lv`, add `<em>${scores[l.id]}</em>` when a score exists; same on the Bonus tile.
16. Debug: `window.NRfare = () => ({ cents: S.cents, missed: S.missed, tips: S.tips, tikkie: S.tikkie, cleanRow: S.cleanRow, score: S.score })`. Every existing `window.NR*` hook unchanged.

## 5. Dutch lines (no exclamation marks anywhere)

| nl | en | when |
|---|---|---|
| Dat betaal ik niet. | I'm not paying for that. | refusal, every tier |
| Geen cent. | Not a cent. | refusal tiers 1-3; also the wrong-read toast |
| Volgende keer beter. | Better luck next time. | refusal tiers 1-3 |
| Ik ben dood, niet doof. | I'm dead, not deaf. | refusal tiers 1-6 |
| Zo zeg je dat niet. | That's not how you say it. | refusal tiers 2+ |
| Dit klopt niet. | This isn't right. | refusal tiers 2+ (pair with Klopt zo.) |
| Ik had het zelf beter gezegd. | I'd have said it better myself. | refusal tiers 4+ |
| Daar geef ik geen cent voor. | I won't give a cent for that. | refusal tiers 4+ |
| Mijn oma sprak beter Nederlands, en die ligt al honderd jaar onder de grond. | My grandmother spoke better Dutch, and she's been in the ground a hundred years. | refusal tiers 9+ |
| Hou de rest maar. | Keep the change. | first tip of a run |
| Klopt zo. | That's fine as it is. | later tips |
| Laat maar zitten. | Keep it. | later tips, tiers 4+ |
| Alsjeblieft. Twee euro dertig. | Here you are. Two euros thirty. | paid toast line (amount varies) |
| Niet afgeleverd | Not delivered | summary, ghost still aboard at death |

Dropped from the designs: 'Nee, hoor.' (too soft), 'Ik loop wel verder.' (wrong moment), 'Half goed, half geld.' (not Dutch), 'Dan krijg je de helft.' (false on a quarter pay).

## 6. euroToWords(n)

Snap to 10 cents. `e = floor(c/100)`, `ct = c % 100`. Units: nul een twee drie vier vijf zes zeven acht negen tien elf twaalf dertien veertien vijftien zestien zeventien achttien negentien. Tens: twintig dertig veertig vijftig zestig zeventig tachtig negentig. Compound: unit + 'en' + ten, with a trema when the unit ends in a vowel followed by 'en': tweeëntwintig, drieëndertig; eenentwintig without. Hundred: 'honderd' (100), 'honderdvijf' (105), 'tweehonderd'. Standalone 1 euro is 'één euro'. Cents: 'vijftig cent' alone; 'twee euro dertig' with euros. 'euro' and 'cent' never take a plural.

| n | words |
|---|---|
| 0 | nul euro |
| 0.5 | vijftig cent |
| 0.1 | tien cent |
| 1 | één euro |
| 1.5 | één euro vijftig |
| 2 | twee euro |
| 2.3 | twee euro dertig |
| 4.5 | vier euro vijftig |
| 7 | zeven euro |
| 11.1 | elf euro tien |
| 12.3 | twaalf euro dertig |
| 21 | eenentwintig euro |
| 22 | tweeëntwintig euro |
| 23.2 | drieëntwintig euro twintig |
| 33 | drieëndertig euro |
| 44.4 | vierenveertig euro veertig |
| 48.8 | achtenveertig euro tachtig |
| 99.9 | negenennegentig euro negentig |
| 100 | honderd euro |
| 101 | honderdeen euro |
| 150.5 | honderdvijftig euro vijftig |
| 200 | tweehonderd euro |

## 7. Speech

`speakSeq(list)`: one cancel, then queue each utterance; the browser plays them back to back so the sentence is never cut by its own amount. Amount and refusal use pitch 0.75 (the dead speak lower). Flat de/het fares are not spoken. `speak()` is untouched for every existing caller.

## 8. Out of scope now

Coin flight animation, the kassabon receipt tab, 'Duurste fout', price jitter, the back-turned ghost, a lifetime bank. All listed in IDEAS.md.

## 9. Verification

- `node qa/fares.test.mjs` (new): loads fares.js in a vm; checks the 22 euroToWords rows above exactly; `payCents(450,0,1)=450`, `(450,1,1)=0`, `(450,1,2)=220`, `(450,2,2)=0`, `(1050,2,3)=260`, `(1050,3,3)=0`; `fareFor` within 200..1200 and `% 10 === 0` for tiers 1..12 and forks 1..4; no '!' in any REFUSE or TIPS string.
- `NR_URL=http://localhost:8767/index.html node qa/run.mjs 1` and `... 6`: `errors: 0`; the end frames show the Wallet pill, Score and Best; the report's progress string is numbers only.
- Forced wrong answer in Playwright on level 1: steer into a wrong post at the first passenger fork; then `NRfare().cents` unchanged, `missed` equals that fare, `#card .fare` showed the refusal, `NR.delivered` did not grow.
- Tip: three clean deliveries raise cents by the three fares + 100 and the toast carries 'Hou de rest maar.'.
- Zombie: set `NR.cents = 200`, force a collision; cents become 0, tikkie 200.
- Invariant at summary: `cents === paid + tips - tikkie`, `cents % 10 === 0`, `cents >= 0`.
- `NRinfo().programs` identical before and after ten paid deliveries (no shader compiles).
- Then a check on Santi's GPU in Chrome with `NRbright()` and `NRsnap()` before merging.
