# dt/content-clear-forks: the content rewrite (PLAN 3b, 3c, 3d.3, 3e)

Branch `dt/content-clear-forks`, worktree `/home/santi/dutch-arcade-wt/content`. No change to `index.html` or engine files. No browser used. No voice files rendered.

## Result

| Measure | Before (73ac035) | After |
|---|---|---|
| Mixed forks (wrong options differ from the answer in two or more ways) | 481 | **0** |
| Non-words in wrong options outside a Spelling fork | 650 occurrences (400 invented forms, 245 spelling contrasts without the label, 5 unsure) | **0** |
| Non-words inside forks labelled Spelling | 0 | 188 (d or t, open and closed syllables, diminutive, plural and compound spelling, ei/ij) |
| Levels under three verb-second forks | 32 (52 forks short) | **0** |
| Levels under three de/het forks on known nouns | 4 real gaps (14, 56, 88, 114) | **0** |
| Build-fork why lines over 18 words | 226 | **0** |
| Forks with an option over three words | 225 | 20 (Urk 8, Texel 12) |
| Label mismatches | 154 | 5 (audit false positives, listed below) |
| Items per level, deliveries | | unchanged in every level |
| `node qa/validate-content.mjs` | 0 errors, 0 warnings | 0 errors, 0 warnings (with the new why-length warning) |

`npm run validate` now runs the three audits as hard rules (`--check` writes no report, `--fail` exits 1). It fails on any mixed fork, any non-word outside a Spelling fork, and any level from Gouda on with fewer than three V2 forks, or from Kinderdijk on with fewer than three de/het forks on known nouns. The de/het thread is due from the second town: the first town teaches the articles and has no known nouns yet.

## Decisions applied

1. A Spelling fork holds only spelling variants of one form, set with `task: 'spell'`. `FK` now takes the task as a fifth argument. Level 75: `[werkte | werkde | werkt]` became the tense fork `[werkte | werkt | werkten]`. `[kookte | kookde | kookten]` became the Spelling fork `[kookte | kookde]`. `[kocht | koopte | kochten]` became `[kocht | kochten | gekocht]`.
2. How a form is built is not spelling. Every invented participle, regularised strong verb, invented comparative and invented numeral is replaced with a real Dutch form that is wrong in the sentence. The five unsure tokens:
   - **slaapten** (L85) was invented and is replaced.
   - **gekoch** (Groningen) was invented and is replaced.
   - **moetten** (Amsterdam) was invented and is replaced by `[moesten | moest | moeten]`.
   - **theebladeren** is a real word, but "theebladeren kijken" is not a Dutch saying. It became `[koffiedik | thee] kijken`.
   - **valtrap** is not a word. It became "Ajax scoorde [op | in] de valreep".
3. The verb-second drill keeps two options, word order only: `'s Nachts [krijg ik | ik krijg]`. Where jij or je follows the verb, the old drill really tested the dropped t: `[woon jij | woont jij | jij woont]`. Those became Verb form forks with the order fixed: `Waar [woon jij | woont jij]?` (rule presens).
4. Narrow by default. All 481 mixed forks were narrowed or reshaped so the gap holds only what differs, so there were **0 splits** and no item had to be dropped. This includes the 87 where the audit suggested a split: the second dimension was fixed in the sentence, and in nearly every case another fork in the same level already asks it. Level load (items, deliveries, reading) is unchanged.
5. Why lines are one plain sentence of at most 18 words. Every why line on a touched fork was rewritten to that standard, and every build-fork why line over 18 words in the game was shortened. The validator warns above 18 words.
6. Threads:
   - Verb-second forks were added in all 32 short levels (about 60, counting sub-clause-first sentences relabelled v2), almost all by turning an existing sentence of the level into a fronted-word fork. Some sub-clause-first sentences got rule v2, because their main clause starts with its verb.
   - de/het: levels 14, 56, 88 and 114 got article-swap wrong options on word items for nouns met earlier (L14: de sleutel, de tijd, het probleem, de tas, de naam). L56 got one de/het build fork.
7. The vocabulary pass was not done.

## Per town

All counts compare 73ac035 with the branch head. A changed fork is one whose options, answer, rule or task changed. New sentences are full Dutch build sentences that did not exist before.

| Town | Levels | Forks changed | Items changed | Spelling forks | task overrides | New sentences | Why > 18 words before → after | Signs > 3 words before → after |
|---|---|---|---|---|---|---|---|---|
| Alblasserdam | 10 | 1 | 1 | 0 | 0 | 0 | 0 → 0 | 0 → 0 |
| Kinderdijk en Dordrecht | 8 | 14 | 14 | 6 | 0 | 0 | 2 → 0 | 0 → 0 |
| Gouda | 7 | 65 | 63 | 5 | 0 | 0 | 8 → 0 | 1 → 0 |
| Zeeland | 8 | 52 | 51 | 0 | 16 | 12 | 4 → 0 | 0 → 0 |
| Utrecht | 8 | 80 | 70 | 0 | 1 | 4 | 5 → 0 | 8 → 0 |
| Den Haag | 8 | 139 | 118 | 40 | 0 | 10 | 5 → 0 | 0 → 0 |
| Rotterdam | 8 | 114 | 100 | 22 | 1 | 2 | 25 → 0 | 3 → 0 |
| Urk | 8 | 114 | 105 | 6 | 19 | 2 | 19 → 0 | 64 → 8 |
| Texel | 8 | 89 | 79 | 3 | 19 | 0 | 35 → 0 | 37 → 12 |
| Groningen | 8 | 72 | 68 | 20 | 12 | 3 | 25 → 0 | 16 → 0 |
| Maastricht | 8 | 142 | 121 | 25 | 19 | 6 | 36 → 0 | 15 → 0 |
| Nijmegen | 8 | 111 | 96 | 21 | 22 | 8 | 44 → 0 | 32 → 0 |
| Amsterdam | 8 | 140 | 104 | 16 | 22 | 12 | 18 → 0 | 49 → 0 |
| **Total** | **105** | **1,133** | **994** | **164** | **131** | **59** | **226 → 0** | **225 → 20** |

Many forks also changed their rule id instead of getting a `task:` override; for example, imper became gebod, vgl became vergelijk, and euro / euro's became meervoud. The "task overrides" column counts only explicit `task:` values.

What each town needed:

- **Kinderdijk:**
  - Invented numerals (vierentig, tweetig, negennegentig) became real wrong numbers. The 42 fork now offers vierentwintig, the reversal a learner actually makes.
  - The d/t and plural forks became Spelling forks (kost / kostt, broodjes / broodjen, pizza's / pizzas, mei / mai).
  - `[heb | ben | heeft] honger` became `[heb | ben]`.
- **Gouda:**
  - 26 V2 drills became two-option order forks.
  - 11 jij/je drills became Verb form forks.
  - 13 forks with a modal plus a separable verb now offer only real forms (`oplossen | oplost | op te lossen`).
  - The niet/geen forks were narrowed: "Ik heb de sleutel [niet | geen]".
  - Five stem-spelling forks became Spelling forks (wacht / wachtt, zeg / zegg, bel / bell).
- **Zeeland:**
  - Comparison forks were narrowed to real degrees. meer duur, graagder, goedste and the like are gone.
  - The er is / er zijn forks were relabelled Verb form.
  - 12 V2 forks were made from existing sentences.
- **Utrecht:**
  - 19 separable present-tense forks ask word order only: `[breng | terugbreng]`.
  - The aan het forks ask one thing: "We zijn aan het [afwassen | afwast | af te wassen]".
  - 12 commands ask the bare stem.
  - The clock forks shrank to `[voor | over]`.
- **Den Haag** (the perfect tense):
  - 116 forks had invented participles. Each now offers real forms of the same verb: gegaan / ging / gaat, aangekomen / aankwam / aankomt, verhuisd / verhuist / verhuisde.
  - The d/t participles became 40 Spelling forks (gewerkt / gewerkd).
- **Rotterdam:**
  - Level 75 was fixed per decision 1.
  - koopte, komde, doede, loopten and brengde became real forms.
  - hooger / hoger and similar became Spelling forks.
- **Urk:**
  - 56 sub-clause forks now ask only the verb cluster at the end: "omdat de honden vannacht [niet sliepen | sliepen niet]".
  - toen/als and omdat/want forks were relabelled Which word.
- **Texel:**
  - om ... te forks ask only te plus the infinitive.
  - die/dat and er ... mee forks ask one word.
  - Seven inversions after an als clause now carry v2.
- **Groningen:**
  - The opinion forks ask only the verb cluster: "Ik vind dat de soep [te zout is | is te zout]".
  - The diminutives and d/t forms became Spelling forks.
- **Maastricht:**
  - Every invented passive or pluperfect participle (geverbouwd, gebetaald, geuitgenodigd, gegaat) was replaced: `[verbouwd | verbouwen | verbouwde]`.
  - The d/t participles became Spelling forks.
- **Nijmegen and Amsterdam:**
  - Formal u forks were relabelled Verb form; of/dat and hoewel/ondanks forks Which word.
  - Invented numerals were replaced (vijfveertig became vierenvijftig and vijfenvijftig as wrong options).
  - Separable commands ask `[Steek | Oversteek] het plein over` and carry the Word order label.
  - Four forks in Amsterdam could not be narrowed honestly and were dropped from their items, so those items keep their other forks: niet meer / nog niet in 126 and 129, the als-clause order fork in 129, and die/dat in 130.

## Before and after

| Level | Before | After |
|---|---|---|
| 75 | Ik [werkte \| werkde \| werkt] gisteren de hele dag thuis. | Ik [werkte \| werkt \| werkten] gisteren de hele dag thuis. (Past tense) |
| 75 | Paola [kookte \| kookde \| kookten] en ik ... | Paola [kookte \| kookde] en ik ... (Spelling) |
| 11 | 's Nachts [krijg ik \| ik krijg \| krijgt ik] een melding. | 's Nachts [krijg ik \| ik krijg] een melding. |
| 13 | Waar [woon jij \| woont jij \| jij woont]? | Waar [woon jij \| woont jij]? (Verb form, the t drops after inversion) |
| 7 | Dat is [tweeënveertig \| veertigtwee \| tweeveertig] euro. | Dat is [tweeënveertig \| vierentwintig \| tweeëntwintig] euro. |
| 67 | ... is vanmiddag [aangekomen \| geaankomen \| aangekomt]. | ... is vanmiddag [aangekomen \| aankwam \| aankomt]. |
| 108 | De winkel wordt op dit moment [verbouwd \| geverbouwd \| verbouwt]. | ... [verbouwd \| verbouwen \| verbouwde]. |
| 14 | Ik heb [de sleutel niet \| geen de sleutel \| de sleutel geen]. | Ik heb de sleutel [niet \| geen]. |
| 83 | Ik ben moe [omdat de honden vannacht niet sliepen \| ... \| ...] | Ik ben moe omdat de honden vannacht [niet sliepen \| sliepen niet]. |
| 53 | Ik drink [liever \| graagder \| meer graag] thee. | Ik drink [liever \| graag \| liefst] thee. |
| 128 | ... in minder dan [vijfenveertig \| vijfveertig \| vijfenvertig] minuten | ... [vijfenveertig \| vierenvijftig \| vijfenvijftig] ... |

## For the native reviewer

Wrong options that are real Dutch but might be half-acceptable, or new sentences that should be heard once:

- **Kinderdijk L47:** "Ik speel handicap twintig". This is older text, kept as it was; "Ik heb handicap twintig" may be more usual.
- **Zeeland:**
  - "In Ouwerkerk is er een museum" and "Bij de visboer zijn er mosselen": both are fine, but natives may drop the er.
  - "Hier is de dijk hoog" (L56) may read better as "De dijk is hier hoog".
- **Utrecht:**
  - Several wrong options are real only as sub-clause forms (opsta, ophaal, terugbel, meegaat, oplost). They are real words, but less obvious as distractors.
  - "Ruimt je rommel op" is treated as wrong.
- **Rotterdam:**
  - L82: "Het schip kwam om acht uur [binnen | binnengekomen]". The old wrong option "in" was dropped because "kwam ... in" might be accepted.
  - L78 `[dichter | dichtere]`: plain dicht was dropped because "dicht bij" is fine.
  - L79 `[liever | liefer]`: graag was dropped.
- **Urk:**
  - "omdat iedereen in de kerk [zit | zitten]" is now an agreement fork.
  - "want [hij is | is hij]".
  - "dat ik eerst [de honden moet | moet de honden] uitlaten".
  - "Terwijl ik een dashboard aan het [bouwen ben | ben bouwen]".
  - L86 "of de bus naar Emmeloord [vandaag rijdt | rijdt vandaag]": is the adverb after the verb clearly wrong here?
- **Texel L97:** "Nee, ik heb [er twee | twee]": is bare "twee" wrong enough?
- **Maastricht:**
  - "De winkel [wordt | is] op dit moment verbouwd" and "De vlaai [is | wordt] al betaald" are older text: check that the wrong one is really wrong.
  - L110: "Zou u mij kunnen zeggen van welk spoor hij vertrekt?" (hij for de trein, to keep the sign short).
- **Nijmegen:**
  - L121: is "u bent van harte welkome" clearly wrong?
  - L118: is "Het is nou ooit zo" clearly wrong as the distractor for nou eenmaal?
  - L122: is "op van de nerven" clearly wrong?
  - "In opwachting van uw antwoord" replaces "In verwachting van", which some writers do use.
- **Amsterdam L123:** "Paola is pas om tien uur thuis, dus ik laat hem uit". hem means the dog, but there is no antecedent in the sentence.

## The engine change for the Spelling label (for the laptop Claude, on dt/all or after the split)

In `index.html`, in `const TASKS = { ... }` (around line 3041, just above `const TASK_OF_RULE`), add one entry after `meaning`:

```js
  spell: { label: 'Spelling', color: '#ff8a7a' },
```

Nothing else is needed:
- `taskOf()` already returns `fork.task || entry.task` when `TASKS` has it.
- Build forks already carry `task` from `parts` (the `st.forks.map(...)` line copies `f.task`).
- `#card .task` takes the colour from `TASKS`.

Until the entry is added, the 164 Spelling forks show "Which word". Keep `qa/lib/tasks.mjs` and the engine copy in step: both now list nine labels. If LEVELS.md lists the task labels, add Spelling there as well.

## Voice

**105 Dutch lines need voice**: 63 full build sentences and 42 whispered right answers of non-final forks. About 100 old lines are no longer used, and `npm run voice` drops them from `voice/lines.json`.

`qa/voice-batch.mjs` could not load the content because of the `?v=34` cache-bust on the script tags (`npm run voice` would have crashed). It now strips the query. The ids depend only on voice and text, so nothing already rendered changes. `voice/lines.json` is left as it was; `npm run voice` regenerates it.

## Tool changes

All of these are under `qa/`. None touches the game.

- **`qa/lib/tasks.mjs`:** `spell` is the ninth task.
- **`qa/lib/forks.mjs`:**
  - A Spelling fork may differ only in spelling.
  - A separable verb in its te-form (uit te laten) is one form of uitlaten, not a reordering.
  - Two function words (dat / omdat) are a word choice, not a glued particle.
- **`qa/lib/nl.mjs`:** the stemmer had false positives, and each fix is its own commit:
  - woon / wonen, groot / groter and duurder / duurst are each one word.
  - Separable and prefixed verbs with an irregular core count as one verb (aankwam / aangekomen, uitgelaten / uitliet, verkocht / verkopen).
  - dicht and open are particles.
  - zul, stelen, schenken, vangen, hijsen and graven were added to the irregular table.
- **`qa/audit-forks.mjs`, `qa/audit-distractors.mjs` and `qa/audit-threads.mjs`:** `--check` (no report write) and `--fail`. The distractor audit counts non-words outside Spelling forks. The thread audit starts the de/het thread at the second town.
- **`qa/validate-content.mjs`:** warns when a why line has more than 18 words.
- **`package.json`:** `validate` runs the audits as hard rules.
- **`CONTENT-BRIEF.md`:** a new section on Spelling forks, real wrong options, short why lines and the threads, plus the label table and the `FK` fifth argument.

## Left open

- **20 signs over three words**, in Urk (8) and Texel (12). Most are relative clauses or sub-clauses that end in a prepositional phrase, where a shorter gap would allow a second acceptable order. Not a hard rule.
- **5 label mismatches that are audit false positives:** tegenover / tegen, uiteindelijk / eindelijk, uit / uitlaten, net / netjes, afgelast / afgelost. These are honest Which word forks; the heuristic reads look-alike words as a reordering or a form.
- **Why lines with two sentences:** many untouched ones still have two short sentences of 18 words or fewer in total. 84 English explanations on read items (the Meaning forks) are over 18 words. The validator only checks build forks, as PLAN 3d.3 asks.
- **The vocabulary pass** (decision 7) was not done.
- **Splits:** 0. Decision 4 allowed splits, but none was needed.

## Commits

On `dt/content-clear-forks`, after 73ac035:

- 18b42ea: tooling, Spelling task, Kinderdijk
- a450426: Gouda
- 7d32286, 9288785, dc7d20c, 7b4d1dd, a852a1e, ab1451b, ae26f0c: qa/lib heuristics
- e875f6c: Zeeland
- 0135096: Utrecht
- 9f11926: Den Haag
- 396a618: Rotterdam
- 767ca8f: Urk
- a0b7fc7: Texel
- b8fb65d: Groningen
- 24f6f02: Maastricht
- 09ed577: Nijmegen
- 86f7d3a: Amsterdam
- e853cee: hard rules in validate, fixes after integration (half elf restored in L102, sneler, voice-batch)

## Files

All paths absolute. GitHub links on branch `dt/content-clear-forks`.

- This report: `/home/santi/dutch-arcade-wt/content/Opus 5.5 DT/reports/dt-content-rewrite.md`, https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/Opus%205.5%20DT/reports/dt-content-rewrite.md
- Audit reports after the rewrite: `/home/santi/dutch-arcade-wt/content/Opus 5.5 DT/reports/dt-audit-forks.md`, `dt-nonwords.md`, `dt-threads.md`, https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks/Opus%205.5%20DT/reports
- Content: `/home/santi/dutch-arcade-wt/content/content/new/L51.js` to `L130.js`, `/home/santi/dutch-arcade-wt/content/content/extra/L05.js` to `L50.js`, `/home/santi/dutch-arcade-wt/content/content/district2.js`, `district3.js`, `town-gouda.js`, and the bundles `content/towns-new.js` and `content/extra.js`: https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks/content
- Brief: `/home/santi/dutch-arcade-wt/content/CONTENT-BRIEF.md`, https://github.com/SScleves/NachTrit/blob/dt/content-clear-forks/CONTENT-BRIEF.md
- Tools: `/home/santi/dutch-arcade-wt/content/qa/lib/tasks.mjs`, `qa/lib/forks.mjs`, `qa/lib/nl.mjs`, `qa/audit-forks.mjs`, `qa/audit-distractors.mjs`, `qa/audit-threads.mjs`, `qa/validate-content.mjs`, `qa/voice-batch.mjs`, `package.json`: https://github.com/SScleves/NachTrit/tree/dt/content-clear-forks/qa
