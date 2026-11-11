# dt/content-clear-forks: measuring the content before the rewrite (PLAN 3b.1, 3c, 3e.2, 3f, 3g)

Branch `dt/content-clear-forks`, from `dt/all`, worktree `/home/santi/dutch-arcade-wt/content`.
No content file, `index.html` or engine file was changed. `node qa/validate-content.mjs` still gives 0 errors, 0 warnings.
No browser was used. Everything below runs with plain `node` in a few seconds:

```
npm run audit:content     # the four audits, reports in Opus 5.5 DT/reports/
npm run review            # the two review sheets in review/
```

This report is the measurement Santi asked to see before any level is rewritten.

## Headline numbers

| What | Number |
|---|---|
| Playable levels | 105 (5,817 items, 2,709 build forks, 366 read forks with English options) |
| Build forks with a multi-word option that is not a pure reordering | 614 (the plan says 625; that count was taken on `dt/all` with a slightly different rule. Same content, same order of size) |
| **Mixed forks: wrong options differ from the answer in two or more ways** | **481** (283 multi-word, 198 single-word) |
| ... where a single wrong option is itself wrong in two ways | 106 |
| Suggested repair | narrow 394, split 87 |
| Forks whose label does not match what the options test (no rewrite, a `task:` override or rule id) | 154 |
| Forks with an option longer than three words (plan 3b.3: signs carry at most three words) | 225 |
| **Non-words in wrong options that must be replaced** | **400 occurrences in 314 forks** |
| Non-words that are legitimate Spelling contrasts | 245 (177 already under a spelling rule id, 68 need the Spelling label) |
| Levels under three verb-second forks (from Gouda, level 11, on) | 32 of 87 |
| Levels under three de/het forks on nouns already met | 7 (levels 1, 2 and 5 cannot have known nouns yet; 14, 56, 88, 114 are real gaps) |
| Distinct lemmas taught | about 1,976 |
| New lemmas per level, median | 16 (target at most 10; 82 of 105 levels are over) |
| New lemmas met at least four more times in the next ten levels | 9% (target 100%); 1,032 never come back in the next ten levels |
| Top 1,000 / 2,000 frequent Dutch words covered | 61% / 42% |
| Grammar rules introduced before what they depend on | 0. The core path (present, V2, questions, modals, separable verbs, perfect, imperfect, sub-clause) is in order |
| Rule ids that name the same rule | 7 groups (pres = presens, vergelijk = vgl, obj = objpron, er = eris, gebod = imper, four ids for als ... dan, three for erop / ermee) |

## What each audit found

### Forks that ask two things (3b.1)

`qa/audit-forks.mjs` compares every wrong option with the right one and names how it differs: word order, form of the same word, word choice, or spelling (not a Dutch word). The task label is derived with the engine's own rule, copied into `qa/lib/tasks.mjs` (from `taskOf` in `index.html`) so phase 2 can make it one shared module.

The common patterns, by count:

- **form + order, 169.** The verb-second drill: `'s Nachts [krijg ik | ik krijg | krijgt ik]`. One wrong option tests the order, the other the verb ending. Gouda alone has 67 mixed forks, almost all of this kind. Repair: narrow to word order by dropping the conjugation option (two options are allowed), or split when the sentence is long enough to carry a second gap.
- **form + spelling, 118.** The level 75 prototype itself: `Ik [werkte | werkde | werkt]`. werkde is a spelling contrast, werkt is a tense contrast. Under the plan's policy (3c) this is a mixed fork. Repair: a Spelling fork `[werkte | werkde]`, and if the tense matters, a separate Past tense fork `[werkte | werkt | gewerkt]`.
- **form + word, 88.** `Ik [heb | ben | heeft] honger`: one option is another verb, one another form of the right verb.
- **order + word, 50**, mostly sub-clauses where one wrong option also drops or swaps a small word.

Single-dimension forks with a label that promises something else: 154. Examples: `[Ken je | Kent je]` is labelled Word order but tests the verb ending; sub-clause forks `[of | dat]` are labelled Word order but test word choice; `er is / er zijn` forks are labelled Which word but test a verb form. These need a `task:` override, not a rewrite.

Full list, every mixed fork with its suggested repair, per level: `Opus 5.5 DT/reports/dt-audit-forks.md`.

### Wrong options that are not Dutch (3c)

`dictionary-nl` (OpenTaal list, licence BSD-3-Clause OR CC-BY-3.0) and `nspell` (MIT) are now devDependencies, read only by `qa/`. The game never loads them. Right answers may be compounds of listed words (kaas + boer), and numerals are checked against every real Dutch numeral, so `zesentien` fails. A wrong option must be in the list itself, because a split like gesp + eelt would let `gespeelt` pass. Names, places and dialect live in `qa/allow-words.txt` (Santi, Dynatrace, Tikkie, Goffertpark, Oe got ut, moi, Noondezju, salu, bomma, bakkie, pleur, effe, standup...). After it, no right answer in the game is unknown to the list.

The 400 that must be replaced, by kind:

| Kind | Count | Examples |
|---|---|---|
| Irregular verb made regular | 126 | koopte, doede, brengde, gegaand, gedrinkt |
| ge- where it does not go | 112 | geverbouwd, geontmoet, geuitgenodigd, geopbeld |
| Participle formed wrongly | 54 | gewerken, gekoken, geëten |
| Comparative formed wrongly | 32 | graager, gooder, goedste, duurer |
| Separable participle formed wrongly | 31 | aangekomt, uitgegeefd, afgesluit |
| Invented numerals | 18 | tweetig, vierentig, zesentien |
| Other | 27 | mai, geev, zoud, gezijn |

The legitimate Spelling contrasts (245) are d or t ('t kofschip, wordt, snijdt), open and closed syllables (grooter, kraamen, haden), plural and diminutive spelling (pizzas, ringtje), and compound linking letters (stadcentrum, erwtesoep).

Den Haag (the perfect tense levels 67 to 74) and Maastricht carry most of the replacements, because their perfect and passive forks use invented participles as wrong options.

Five tokens need a human eye: slaapten, gekoch, theebladeren (real, so the idiom fork may be fine), valtrap, moetten.

Full list per level: `Opus 5.5 DT/reports/dt-nonwords.md`. The October report `dt-audit-distractors.md` is untouched.

### Threads (3e.2)

`qa/audit-threads.mjs` counts per level the forks that test verb-second after a fronted element (rule `v2`, or a main-clause fork with text in front whose wrong option puts the subject first), and de/het forks on a noun met in an earlier level (de/het items, word items whose wrong option only swaps the article, and article forks inside sentences).

Verb-second starts in Gouda (level 11). 32 levels after that have fewer than three V2 forks, 52 forks short in total. Zeeland (6 of 8 levels short), Texel and Maastricht (5 each) are the thinnest. de/het is well covered: Alblasserdam's word items carry wrong articles everywhere, and only 14, 56, 88 and 114 are short after the first town. `--fail` makes it exit 1, for `npm run validate` once the gaps are closed.

Report: `Opus 5.5 DT/reports/dt-threads.md`.

### Vocabulary and sequence (3f)

`qa/audit-vocab.mjs` reduces every right Dutch word to a rough lemma (an irregular verb table and a light stemmer) and measures each level. Frequency list: the top 5,000 forms of hermitdave/FrequencyWords, Dutch, 2018, built from OpenSubtitles, licence CC BY-SA 4.0, stored with its source in `qa/data/nl-freq-top5000.txt`. SUBTLEX-NL is the academic standard but its licence is not stated as open; this list is built the same way from subtitles.

- The game teaches about 1,976 lemmas, which fits B1 by the end. The size is fine.
- **The pace and the reuse are not.** Median 16 new lemmas per level, 82 of 105 levels over 10. Only 9% of new words come back four or more times in the next ten levels, and 1,032 do not come back at all. Each level brings its own setting words (oester, kibbeling, viskraam in Zeeland; log, release, monitoring at work in Utrecht) and drops them.
- Worst for new words: 5, 2, 1, 6, 42, 7, 41, 43, 128, 47, 127, 115, 123, 122. The first few are word-list levels, where many new words is the point. The worrying ones are the late levels with 30 or more new words that never return: 7 (the butcher, 0% return), 12, 14, 50, 56, 58, 63, 122, 127, 128.
- Frequency gaps in the top 1,000 that suit the game: zeker, zoals, bedoel, dingen, idee, auto, luister, paar, eigen, alsof, geloof, manier, prima, hulp, juist, soort, dokter, foto, zoveel, snap, verhaal, waarschijnlijk, bezig, voorbij, duidelijk, eerlijk, zoiets, belangrijk. Many others are subtitle words (vermoord, verdomme, sir).
- Grammar order: no rule comes before what it depends on, and the core path is in the standard order. Five basics arrive late: softeners (first at level 76), diminutives as a rule (level 100), formal u (115), dates (115), directions (123, although level 12 is "De weg kwijt"). Modals appear in 11 sentences before Gouda tests them (Kan ik pinnen? in the supermarket), which is fine for reading.

Report with the worst levels and every level: `Opus 5.5 DT/reports/dt-vocab.md`.

### The packet for a native speaker (3g)

`qa/make-review.mjs` writes two self-contained pages:

- `review/native-review.html`: the 13 open questions from the October audit first, each with its question and the live lines from the content, then all 2,558 Dutch sentences in play order, grouped by town and level, each with its English, the right choices underlined, the wrong options in grey, three tick boxes (natural, odd but correct, wrong) and a notes box. The 1,236 single words and short phrases follow each level as a compact list with one "wrong" box. Town map texts (blurb, joke, rumour) are included.
- `review/native-review-short.html`: the 13 questions and 60 sentences, four or five per town across all tiers, for a reviewer with one hour.

Both print cleanly from a browser (one town per page). Ticks and notes made on screen stay in the browser, and a button saves them as a JSON file keyed by line id (`L77-3`), so the marks map straight back to the content. No PDF: that needs a headless browser, which this job could not use. Print to PDF from Chrome gives the same thing.

## Proposed repair approach

1. **Decide the open policy points first** (below), because they change the counts.
2. **Work town by town in play order, one commit per town**, as plan 3b.5 says. Per item: fix the non-word, then narrow or split the fork, then cut options to three words where the sentence allows. One pass per item covers all three.
3. **Narrow by default.** 394 of 481 mixed forks can lose or swap one wrong option and stay a good fork. Split only the 87 where the sentence is long enough for two gaps, and drop the weakest item of the same rule when a split adds one, so `deliveries` and reading load stay steady.
4. **Replace invented participles and regularised verbs with real wrong forms**: koopte becomes kocht/koopt/gekocht, geverbouwd becomes verbouwde/verbouwen. These real contrasts teach more than an invented form.
5. **Add the Spelling label** (ninth label) for the 177 forks already under kof/spel/adj/meervoud/verklein/samen and the 68 others whose non-word is a real spelling contrast. This needs one line in `TASKS` in the engine, on `dt/all` or after the split; content can set `task: 'spelling'` now.
6. **Top up the V2 thread** by turning an existing sentence of the level into a fronted-element fork where possible (52 forks over 32 levels). This adds no new words.
7. **Labels**: add `task:` to the 154 mismatched forks in the same pass.
8. **Vocabulary**: no global rewrite, as the plan says. Two cheap moves: when a fork is rewritten, prefer words from the previous ten levels; and give the worst late levels (7, 12, 14, 50, 56, 58, 63, 122, 127, 128) a pass that swaps one-off words for returning ones. Phase 4's spaced review does the rest.
9. **Merge the seven groups of duplicate rule ids** before phase 4, so the weakest-rule view counts one rule as one.
10. Once each count is zero, add the audits to `npm run validate` as hard rules.

### How many items per town

Build items that need a rewrite (a mixed fork or a non-word to replace, counted once per item), next to the other work per town:

| Town | Build items | Rewrite | of which mixed | of which non-word | Option > 3 words | Label only | V2 forks to add | de/het to add |
|---|---|---|---|---|---|---|---|---|
| Alblasserdam | 76 | 0 | 0 | 0 | 0 | 1 | 0 | 8 (intro levels) |
| Kinderdijk en Dordrecht | 85 | 12 | 10 | 6 | 0 | 1 | 0 | 0 |
| Gouda | 191 | 67 | 67 | 1 | 1 | 2 | 0 | 3 |
| Zeeland | 125 | 26 | 26 | 4 | 0 | 22 | 10 | 1 |
| Utrecht | 122 | 53 | 53 | 0 | 8 | 15 | 4 | 0 |
| Den Haag | 121 | 100 | 27 | 91 | 0 | 0 | 8 | 0 |
| Rotterdam | 151 | 90 | 70 | 46 | 3 | 1 | 3 | 0 |
| Urk | 146 | 33 | 25 | 18 | 63 | 11 | 5 | 2 |
| Texel | 151 | 55 | 47 | 10 | 37 | 14 | 8 | 0 |
| Groningen | 153 | 27 | 19 | 10 | 15 | 12 | 3 | 0 |
| Maastricht | 148 | 88 | 47 | 74 | 15 | 17 | 8 | 1 |
| Nijmegen | 166 | 40 | 26 | 20 | 32 | 24 | 3 | 0 |
| Amsterdam | 159 | 51 | 37 | 28 | 45 | 29 | 0 | 0 |
| **Total** | **1,794** | **642** | | | **219** | **154** | **52** | **15** |

About a third of the build items need a rewrite. Most fixes are one wrong option. Den Haag, Rotterdam and Maastricht are the heavy towns, about 90 to 100 items each. Gouda's 67 are nearly all the same V2 drill pattern and go quickly. From Urk on, the three-word sign rule touches another 219 items, many of them the same items.

## What Santi should look at and decide

1. **Level 75, the prototype, is itself mixed** under the plan's own policy: `[werkte | werkde | werkt]` and `[kocht | koopte | kochten]` put a spelling or invented form next to a real tense form. Decide: does a Spelling fork allow only spelling contrasts (default, and what the counts above assume), or may it keep one real wrong tense?
2. **Should Spelling grow to cover how a participle is built?** About 320 of the 400 replacements are invented participles and regularised strong verbs (geverbouwd, koopte, gegaand). These are real learner errors, but the plan allows non-words only for 't kofschip, the adjective -e and plural or diminutive spelling. Default: replace them with real forms.
3. **The V2 drill in Gouda and after**: `[krijg ik | ik krijg | krijgt ik]`. Default: drop the conjugation option and keep a two-option word order fork. The alternative is a split, which makes the Gouda levels longer.
4. **Vocabulary pace**: 16 new words a level and little reuse. The plan says fix only the worst levels. Agree with the ten named above, or go further?
5. **The review sheet**: open `/home/santi/dutch-arcade-wt/content/review/native-review-short.html` in Chrome, check it reads well, and send it (or the printed copy) to the reviewer. The full sheet is there if someone has more time.
6. The audits are heuristics. The stemmer and the dimension check are rough, so single counts can be off by a few. The patterns and the lists of examples are what to trust; read ten lines of `dt-audit-forks.md` and `dt-nonwords.md` to see the quality.

## Files

All paths absolute, GitHub links on branch `dt/content-clear-forks`.

- `/home/santi/dutch-arcade-wt/content/qa/audit-forks.mjs`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/audit-forks.mjs
- `/home/santi/dutch-arcade-wt/content/qa/audit-distractors.mjs`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/audit-distractors.mjs
- `/home/santi/dutch-arcade-wt/content/qa/audit-threads.mjs`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/audit-threads.mjs
- `/home/santi/dutch-arcade-wt/content/qa/audit-vocab.mjs`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/audit-vocab.mjs
- `/home/santi/dutch-arcade-wt/content/qa/make-review.mjs`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/make-review.mjs
- `/home/santi/dutch-arcade-wt/content/qa/lib/tasks.mjs` (task labels, copy of `taskOf` in `index.html`): https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/lib/tasks.mjs
- `/home/santi/dutch-arcade-wt/content/qa/lib/load.mjs`, `/home/santi/dutch-arcade-wt/content/qa/lib/nl.mjs`, `/home/santi/dutch-arcade-wt/content/qa/lib/forks.mjs`: https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks/qa/lib
- `/home/santi/dutch-arcade-wt/content/qa/allow-words.txt`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/allow-words.txt
- `/home/santi/dutch-arcade-wt/content/qa/data/nl-freq-top5000.txt`: https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/qa/data/nl-freq-top5000.txt
- Reports (`.md` with a `.json` beside each): `/home/santi/dutch-arcade-wt/content/Opus 5.5 DT/reports/dt-audit-forks.md`, `dt-nonwords.md`, `dt-threads.md`, `dt-vocab.md`: https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks/Opus%205.5%20DT/reports
- Review sheets: `/home/santi/dutch-arcade-wt/content/review/native-review.html`, `/home/santi/dutch-arcade-wt/content/review/native-review-short.html`: https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks/review

Note: the `.json` reports carry a timestamp, so they change on every run.
