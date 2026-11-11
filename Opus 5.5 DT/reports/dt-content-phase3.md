# dt/content-clear-forks, phase 3 content half: rule ids, long signs, vocabulary pass

Branch `dt/content-clear-forks`, worktree `/home/santi/dutch-arcade-wt/content`, from main at 6e36ed4. Three jobs, one commit each, then the version bump and the review sheets. No engine file was edited except the `TASK_OF_RULE` map in `src/tasks.js`; `index.html` and `src/*.js` only changed through `node qa/check-versions.mjs --bump` (NR_VERSION 39 to 40, the `?v=` on every import).

Commits:
- `386568f` Merge the seven groups of duplicate rule ids
- `a0d7459` Signs over three words, and 84 read-item why lines cut to 18 words
- `8757d43` Vocabulary pass on the ten worst levels
- the last commit: version 40, review sheets, this report

## Job 1: one id per rule

| Concept | Kept | Merged into it | Forks moved |
|---|---|---|---|
| Present tense | `presens` | `pres` | 36 |
| Comparing | `vergelijk` | `vgl` | 1 (a read item) |
| Object pronouns | `obj` | `objpron` | 15 |
| er is, er zijn | `er` | `eris` | 14 |
| Imperative | `gebod` | `imper` | 0 (only declared, never used) |
| als ... dan | `cond` | `conditie` 6, `alsdan` 4, `voorwaarde` 2 | 12 |
| Pronominal adverbs | `pronadv` | `vnwadv` 7, `erop` 6 | 13 |

Done in:
- content sources `content/new`, `content/extra`, `district2.js`, `district3.js`, `town-kinderdijk.js` (fork rule ids and the `window.RULES.x` declarations; the alias declarations are gone, the kept id is declared with one name and one note);
- `TASK_OF_RULE` in `src/tasks.js` (`pres`, `alsdan`, `conditie`, `voorwaarde` removed; the kept ids map as before);
- `qa/lib/forks.mjs`, `qa/audit-distractors.mjs`, `qa/audit-threads.mjs`, `qa/audit-vocab.mjs` (rank and dependency tables; the "ids that name the same rule" section now reports a group again only if two of its ids are in use);
- `CONTENT-BRIEF.md` label table;
- a unit test (`qa/test/tasks.test.mjs`) fails if any retired id is used by a fork, declared in `RULES`, or present in `TASK_OF_RULE`.

**Proof the task labels did not move.** `node qa/dump-tasks.mjs out.json` (new, committed) runs the game's own `itemToEntry` and `taskOf` (`src/tasks.js`) and the qa wrapper over every fork of every level with a seeded `Math.random`, and writes `L<level>.<item>.<fork>` to `game-label|qa-label`. 6,733 forks. Dumped before the merge and after it: `cmp` says identical. Dumped again after job 2 and after job 3: `diff` is empty both times. (Only `vgl` and `imper` had no entry in `TASK_OF_RULE` while their kept ids do; `vgl` was on a read item, which is Meaning either way, and `imper` was unused, so no `task:` override was needed.)

## Job 2: signs over three words, and the long why lines

`npm run audit:content` now reports 0 options over three words (was 20: Urk 8, Texel 12). Method: the common words moved out of the gap into the fixed text, and where a prepositional phrase or time phrase made the gap long, it moved to the main clause or was dropped from the sentence. The contrast is still one thing: the verb at the end of the sub-clause against the verb earlier, with an adverb or an object as the word the wrong option jumps over (a bare PP after the verb is not used as the wrong option when a safer word was available).

Before to after (all in the gap; `en` line changed to match):

| Level | Before | After |
|---|---|---|
| 85 | De honden verveelden zich [terwijl wij op de rekening wachtten \| terwijl wachtten wij op de rekening] | ... zich terwijl [wij wachtten \| wachtten wij] |
| 86 | Terwijl [ik op de bus wacht \| wacht ik op de bus], ... | Terwijl [ik wacht \| wacht ik], ... |
| 86 | Voordat [ik naar de bushalte loop \| ...] | Voordat [ik vertrek \| vertrek ik] |
| 86 | Als [u bij de vuurtoren bent \| bent u bij de vuurtoren], gaat u rechtsaf | Als [u daar bent \| bent u daar], gaat u bij de vuurtoren rechtsaf |
| 87 | ...omdat ik de hele dag in vergaderingen zit (3 options) | ...omdat ik de hele dag [vergaderingen heb \| heb vergaderingen] |
| 88 | [Terwijl ik op de loopband loop, \| Terwijl loop ik op de loopband,] | Terwijl [ik loop \| loop ik], |
| 89 | [het hele dorp zat \| zat het hele dorp] | [iedereen zat \| zat iedereen] |
| 90 | voordat [ik naar huis ga \| ga ik naar huis] | voordat ik [naar huis ga \| ga naar huis] |
| 91 | De hond die [altijd op de bank slaapt \| ...], mag daar niet liggen | De hond die [altijd slaapt \| slaapt altijd], mag niet op de bank liggen |
| 91 | [Als je de laatste boot mist, \| Als je mist de laatste boot,] | Als je [de boot mist \| mist de boot], |
| 93 | Het bier dat [ze op Texel brouwen \| brouwen ze op Texel] | Het bier dat [ze hier brouwen \| brouwen ze hier] |
| 94 | De boot die [vandaag om negen uur vertrekt \| ...] | De boot die [vandaag vertrekt \| vertrekt vandaag] |
| 94 | Is dit de bus die [vanavond naar De Koog gaat \| ...] | Is dit de bus naar De Koog die [vanavond vertrekt \| vertrekt vanavond] |
| 94 | Het schaap dat [al uren op het fietspad staat \| ...], wil niet weg | Het schaap dat [al uren staat \| staat al uren], wil niet van het fietspad af |
| 95 | [dat al bij de deur staat \| dat staat al bij de deur] | [dat al wacht \| dat wacht al] |
| 97 | Het schaap dat [al jaren naast ons woont \| ...] | Het schaap dat al jaren [hier woont \| woont hier] |
| 98 | omdat [er veel zand op de weg ligt \| 2 more] | omdat er op de weg [veel zand ligt \| ligt veel zand] |

The other three of the 20: L86 #4 and #5 are in the table, L91 #1 became `dat [daar staat \| staat daar]` ("The sheep that is standing over there is not ours"), L93 #3 became `dat [hier ligt \| ligt hier]`, L93 #10 `Als we [de boot missen \| missen de boot]`.

**84 long English lines.** These are the why lines on read items (the Meaning forks) over 18 words, which the October pass left because the validator only checked build forks. All 84 are now 18 words or fewer, each keeps the point of the old line and drops the second example or the aside, for example L111 #39: "zei dat reports what was said, and zou bellen is would call, the future seen from the past." (30 words before, 18 after). `qa/lib/validate.mjs` now warns on a read-item why over 18 words too (with a unit test). The English options on the signs of read items were not shortened: they are English sentences on a reading board (legible from about 7.5 m, `CONTENT-BRIEF.md`), 147 of the 366 have more than 7 words, and cutting them changes what the item tests. Left for Santi to decide.

**Voice.** 25 new Dutch lines (the changed sentences and their whispered answers), rendered with `npm run voice` in one batch. `npm run voice:check`: 0 lines without a file, 0 browser hash mismatches; the 167 files without a line are the known orphans (100 on the October count, plus the lines job 2 and 3 retired).

## Job 3: vocabulary pass

Method and honesty first. The audit counts a place name as a new word to learn (Utrecht, Valkhof, Zuidas, Amstel), which overstated the late levels, so 110 proper names were added to `qa/allow-words.txt` (group "places"; it is a measurement fix and the middle column below shows its effect on its own). Then, for each of the ten levels, every word, look, listen or de/het item whose new words were all rare (outside the top 2,500 of the subtitle list) became a copy of an item from the previous ten levels, choosing the item whose words had not yet come back four times, so the swap also lifts the home level's return rate. Theme words, numbers that carry the level (tachtig, negentig, honderd), grammar items, builds and reads were kept. Items, deliveries, kinds and rule ids per level are unchanged; 65 items swapped; no new Dutch text, so no new voice lines.

Numbers per level, new lemmas / of which met 4+ times in the next ten levels / never met again in the next ten:

| Level | Name | Report on main | Names allow-listed only | After the swaps |
|---|---|---|---|---|
| 7 | De slager | 40 / 0 / 27 | 40 / 0 / 27 | 30 / 0 / 19 |
| 12 | De weg kwijt | 26 / 0 / 21 | 25 / 0 / 20 | 22 / 0 / 13 |
| 14 | Niet of geen | 19 / 0 / 14 | 19 / 0 / 14 | 12 / 0 / 7 |
| 50 | Eten en drinken | 14 / 0 / 13 | 14 / 0 / 13 | 10 / 0 / 10 |
| 56 | De sport (Zeeland) | 19 / 0 / 15 | 18 / 0 / 15 | 10 / 0 / 6 |
| 58 | De Deltawerken | 13 / 0 / 13 | 11 / 0 / 11 | 6 / 0 / 6 |
| 63 | Het werk (Utrecht) | 22 / 0 / 18 | 22 / 0 / 18 | 16 / 0 / 13 |
| 122 | De Vierdaagse | 32 / 0 / 31 | 25 / 0 / 24 | 21 / 0 / 20 |
| 127 | Het werk (Amsterdam) | 36 / 0 / 29 | 34 / 0 / 28 | 31 / 0 / 23 |
| 128 | De sport (Amsterdam) | 37 / 0 / 35 | 27 / 0 / 26 | 23 / 0 / 22 |

Whole game: lemmas taught 1,957 (names counted) to 1,856 (names not counted) to 1,829; words never met again in the next ten levels 1,016 to 980 to 928; levels over 10 new words 81 to 76 to 77 (a word swapped out of one of the ten levels was the first sighting of a word a later level uses, so about 20 later levels gained one to three new words, 77 against 76; the total still fell by 27 lemmas); median new per level 15 throughout.

**What did not reach the target, and why.**
- Four of ten levels are at 10 or under (50, 56, 58) or 12 (14). The rest are not, and cannot be without rewriting: 7 (the numbers 60 to 100, ons, kilo and the butcher's fixed phrases: Anders nog iets, ietsje meer, plakjes), 12 (directions and the ticket counter grammar: rechtsaf, linksaf, oversteken, overstappen, inchecken, welk, ergens), 63 (the IT words in builds: release, monitoring, uitrollen, call, deploy), 122, 127 and 128 (B1 to B2 builds and reads in the formal register and the town's culture: inschrijving, afhankelijk, omzet, stijgen, ontslag, valreep, strafslag). Those are the grammar points of the level, so by the rule "keep each item's grammar point, rule id, fork shape and task" they stay. The remaining new words per level are listed by `node qa/vocab-items.mjs <level>`.
- The "met 4+ times again" column is 0 for all ten and 9 percent for the whole game before and after. No swap in these levels can make a word the level keeps come back four times in the next ten levels; that needs the later levels to reuse it, which touches 100 other levels, or the spaced review of phase 4.

The 65 swaps (item number in the level, replaced by):
- L7: #3 dank je wel, #5 vijfentachtig cent, #20 de rijst, #30 goede reis, #32 tot morgen, #33 fijn weekend, #37 graag gedaan, #38 het mandje, #41 de boter, #42 de banaan, #55 contactloos, #58 vierenzestig
- L12: #45 vijfentachtig cent, #46 weten, #47 wachten, #53 de werkdag, #55 lezen
- L14: #43 de leeftijd, #46 de overlevende, #47 de plattegrond, #48 het kruispunt, #49 de rotonde, #51 de hoek, #59 wanneer
- L50: #16 de koelkast, #37 niets, #48 het regent, #51 drieënveertig
- L56: #21 de Zeeuwse bolus, #22 de muis, #23 de koptelefoon, #30 de afdeling, #31 de lunch, #32 de stagiair, #41 eb en vloed, #48 het stokbrood, #49 het wachtwoord
- L58: #2 de toerist, #3 het gevoel, #17 het zwembad, #19 de trainer, #42 eb en vloed
- L63: #24 het openbaar vervoer, #25 het poortje, #27 uitstappen, #28 het witbiertje, #30 het voorgerecht, #33 het nagerecht
- L122: #23 de Nijmegenaar, #27 de buurtbewoner, #45 de bovenburen, #51 de eindsprint, #52 het inlogscherm
- L127: #23 de veerpont, #24 de incheckpaal, #26 de paal, #27 het proeflokaal, #44 samsam, #52 het tramkaartje
- L128: #20 de omzet, #21 de bijlage, #26 de veerpont, #27 de incheckpaal, #51 het tramkaartje, #52 de stationsklok

One guard I had to add: the thread audit (`de/het on known nouns`) failed at L71 after the first run because het netwerk and het salaris, which L71's de/het forks lean on, had been swapped out of L63. They are kept in L63 now. `npm run validate` is green with 0 mixed forks, 0 non-words outside Spelling forks, no level under three V2 or de/het forks.

New tools (all under `qa/`, none touches the game):
- `qa/dump-tasks.mjs`: fork to task label for every fork, for before and after proofs.
- `qa/vocab-items.mjs <level ...>`: the items of a level that carry its new lemmas, each lemma with its frequency rank and how often it comes back.

## Tests

- `node qa/build-content.mjs`, then `npm test` (version check, validator with all audits and the TypeScript check, 50 unit tests): green after every job and at the end. 0 errors, 0 warnings.
- `node qa/ride.mjs`, seeded, one run at a time: job 1, 22 touched levels (6 7 9 10 46 47 48 52 54 55 57 58 60 64 65 73 91 93 94 95 96 98); job 2, 54 touched levels (8 9 13 44 46 48 57 58 59 70 to 75 78 80 83 to 101 103 105 107 109 to 113 115 116 118 to 121 124 to 127); job 3, levels 7 12 14 50 56 58 63 122 127 128. Every ride finished home with 0 errors and no wrong answers (always-right autopilot).
- Voice: `npm run voice:check` 0 lines without a file.
- Not run: CI after the push (the push is the last step).

## For the native reviewer

New Dutch from job 2, all new sentences or sub-clauses (voice rendered, not yet heard by a native):
- L86: "Als u daar bent, gaat u bij de vuurtoren rechtsaf." and "Voordat ik vertrek, laat ik eerst de honden uit."
- L87: "Ik heb vandaag geen tijd omdat ik de hele dag vergaderingen heb." (is "vergaderingen hebben" natural for a day of meetings?)
- L90: wrong option "voordat ik ga naar huis": clearly wrong, or acceptable in speech?
- L91: "De hond die altijd slaapt, mag niet op de bank liggen." and "Als je de boot mist, dan woon je hier voortaan."
- L93: "Het terras dat hier ligt, is al vol." and "Het bier dat ze hier brouwen, heet Skuumkoppe."
- L94: "Is dit de bus naar De Koog die vanavond vertrekt?" and "Het schaap dat al uren staat, wil niet van het fietspad af."
- L95: "Het schaap dat al wacht, wil meedoen aan de standup."
- L97: "Het schaap dat al jaren hier woont, kent iedereen." (is the order "al jaren hier woont" the usual one?)
- L98: "Ik fiets langzaam omdat er op de weg veel zand ligt."

Still open from the October and 11 November lists in `reports/dt-content-rewrite.md`; nothing was changed there.

Not touched, on purpose: where I could not be sure of a form I left the item as it was. No item was left unchanged for that reason in this phase; the list above is only things that are new.

## Files

- Branch: https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks
- `/home/santi/dutch-arcade-wt/content/Opus 5.5 DT/reports/dt-content-phase3.md` (this report)
- `/home/santi/dutch-arcade-wt/content/Opus 5.5 DT/reports/dt-vocab.md` and `dt-vocab.json` (regenerated, after the pass)
- `/home/santi/dutch-arcade-wt/content/qa/dump-tasks.mjs`, `/home/santi/dutch-arcade-wt/content/qa/vocab-items.mjs`, `/home/santi/dutch-arcade-wt/content/qa/allow-words.txt`, `/home/santi/dutch-arcade-wt/content/src/tasks.js`
- `/home/santi/dutch-arcade-wt/content/review/native-review.html`, `/home/santi/dutch-arcade-wt/content/review/native-review-short.html` (regenerated)
