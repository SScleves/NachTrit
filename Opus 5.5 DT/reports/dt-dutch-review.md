# dt/dutch-review: the Dutch review (PLAN 3g)

Branch `dt/dutch-review`, from `main` at 2692a5e, merged with `main` at fe7c967 (the content branch) before this report was written, so every file and line below points at the current text. No content file was edited. Fixes go through the content pipeline after this report.

Reviewer: Claude (Fable 5.1), reading as a native editor from the Netherlands, with a source for every doubt. Rules applied: `CONTENT-BRIEF.md` (Netherlands Dutch, one thing per fork, wrong options must be real Dutch except in Spelling forks, signs of three words or fewer) and the October rule from `reports/dt-audit-distractors.md` (if a native could say it, it is not a distractor).

## 1. Summary

Reviewed, in play order via `qa/lib/load.mjs`: 105 levels, 5,817 items (2,706 forks, 717 read items, every word, look, listen and de/het item), 105 Dutch level intros, the 13 town texts in `content/towns.js` (blurb, joke, rumour), the 12 Dutch fare lines in `fares.js` and the 14 story panels in `intro/`. About 5,990 Dutch lines, each with its English line and its why line.

The bulk of the content is correct, natural Netherlands Dutch. The grammar in the why lines is right, the clock, the numbers, the 't kofschip lines, the sub-clause order and the passive are all taught correctly, and the cultural facts I checked hold (Oosterscheldekering 62 doors, Markthal 2014, Vierdaagse 1909 and the 100th in 2016, Oude Kerk 1306, Night Watch in the Sint-Pietersberg caves, 8,687 piles under Amsterdam Centraal, Urk an island until 1939, Treaty of Maastricht 1992).

| Severity | Count | What |
|---|---|---|
| Wrong | 14 | 10 de/het items where the Woordenlijst gives both articles, so the game marks a right answer wrong (dashboard, ticket, schap, Tikkie, kraam, gordijn, medicijn, zadel, schilderij, rooster); 1 wrong why line; 3 non-words outside Spelling forks |
| Unnatural | 7 | correct but not what a native says, or a marked word order |
| Mismatch | 1 | Dutch and English both say "the European Union was signed" |
| Doubtful | 6 | sources allow both forms or the dialect spelling is unverified |
| **Total** | **28** | |

The one systematic finding is the de/het set. I ran every noun whose article the game tests (536 nouns: every de/het item, every word item with a `wrong` article, every build fork whose options are articles) against the Woordenlijst (`woordenlijst.org`, MolexServe `find_wordform`, database `gig_pro_wrdlst`). Ten nouns come back with both a de-gender and `o`: the game teaches one article and marks the other wrong. None of the single-gender nouns is wrong in the game.

Lookups made: 30 web lookups (listed in section 5) plus one batch query of 536 nouns against the Woordenlijst.

## 2. The 13 open questions from `dt-audit-distractors.md`

| # | Question | Answer | Source |
|---|---|---|---|
| 1 | Historic present: L77 "Gisteravond eten we", L79 "Gisteren duurt de vergadering" | L77 no longer has the tense fork (it is now a word-order fork). L79 keeps `duurt` as a wrong option. The present for a past event exists in Dutch, but only as a narrative device with inversion and a story ("Lig ik gisteren net lekker een dutje te doen, gaat opeens de telefoon."). A flat "Gisteren duurt de vergadering twee uur" is not something a native says. Still, because the form exists, swap `duurt` for `geduurd` (a participle without its auxiliary is wrong in every reading). Doubtful, low. | Taaladvies, "Tegenwoordige tijd of verleden tijd (algemeen)": the historisch presens "komt relatief veel voor in historische beschrijvingen" and "veel ... in gesproken taal", example with gisteren. taaladvies.net/legacylink.php?id=tekst/132/tegenwoordige_tijd_of_verleden_tijd_algemeen/ |
| 2 | kraam: de or het | Both. The Woordenlijst gives `kraam` and `marktkraam` as `zelfstandig naamwoord (m/v/o)`. So L69 `dehet kraam = de` and L69 `de marktkraam, wrong: het marktkraam` are forks with two right answers and must go (finding W5). The L124 change to `kaasboer` was right. | woordenlijst.org/MolexServe/lexicon/find_wordform?database=gig_pro_wrdlst&wordform=kraam |
| 3 | Groningen earthquake words (L99 read, de aardbeving, de scheur) | The words are neutral vocabulary and can stay. The one line that puts a quake crack in the player's own house, "Er zit een scheur in de muur sinds de beving" in the Thuis level of a horror game, is the one a Groninger may read as a joke at their expense. Recommend "Er zit een scheur in de muur." (drop `sinds de beving`); keep `de aardbeving` and `de scheur` as words and the listen item. Judgement call under rule 8, no source needed. | Judgement |
| 4 | Zeeland town text: 1,836 dead, then "Er klopt toch iemand" | The joke on its own is fine. Placed right after the death toll it reads as the drowned knocking. Keep the joke, take the number out of the blurb: "In 1953 kwam de zee 's nachts binnen. Nu staan er deuren in de zee, en die gaan dicht als het stormt." The number stays in L58 (`de watersnoodramp`, `negentien drieënvijftig`), where it is history, not a punchline. | Judgement |
| 5 | bomma: Maastricht or Flemish | Real in Maastricht. Wiktionary has a Limburgish entry `bomma`, labelled (Maastrichtian), "grandmother", with forms `bommama`, `bom`, synonyms `grameer`, `ama`, antonym `bompa`. The Wikipedia article on the Maastrichtian dialect lists "bomma(ma) / bompa(pa)" for grandmother/grandfather. The Woordenlijst also lists `bomma (v)`. The gloss "Maastricht dialect for oma" can stay; it is also Flemish, which the gloss need not say. | en.wiktionary.org/wiki/bomma; en.wikipedia.org/wiki/Maastrichtian_dialect |
| 6 | "Ik pak wel even / even wel" | `even wel` is not an order a Netherlands speaker produces in this sentence; the modal particle `wel` comes before `even` in the middle field. Keep as a wrong option. No source gives the pair; this is a native judgement, and the ANS treats particle order as fixed tendencies in the middenstuk (21.4). | Judgement; e-ans.ivdnt.org 21.4 (middenstuk) |
| 7 | "Ik zal graag een starttijd willen reserveren" | Wrong as a request. `zou graag ... willen` is the only idiom; `zal graag ... willen` is not said. Keep `zal` as a wrong option. | Judgement |
| 8 | "helpen met / aan / voor deze melding" | `iemand aan iets helpen` exists and means to get someone something ("Bedankt dat je mij aan dat truitje hebt geholpen"). In "Zou je me even kunnen helpen aan deze melding" it does not fit, so `aan` is a safe wrong option. Keep. | en.wiktionary.org/wiki/helpen, Dutch sense 2 |
| 9 | "met de fiets aan de hand / in de hand" | Both are used. `aan de hand` is the usual form (road-safety material), but the ANWB writes "Laat je kind met de fiets in de hand eerst een stukje lopen". So `in de hand` cannot stay a wrong option. Replace it with `bij de hand` (a real idiom, wrong here). Finding D2. | anwb.nl/fiets/tips/kind-leren-fietsen; Antwerp and Brussels cycling-lesson brochures use `aan de hand` |
| 10 | "niemand had hem / zich laten praten" about de taal | `taal` is masculine or feminine (Taaladvies lists "de taal" among nouns that take either). In the Netherlands most speakers use `hem` for such nouns, in the south `ze`/`haar`. `hem` is right and natural here; `haar` would also be right but is not an option, and `zich` is wrong because it would point back at `niemand`. Keep the fork; soften the why line: "de taal is a de-word; in the Netherlands that is hem. zich would point back at niemand." | taaladvies.net/woordgeslacht-algemeen/ ("Naar zulke woorden kan vaak zowel met mannelijke als met vrouwelijke voornaamwoorden verwezen worden"; the north uses `hem`) |
| 11 | "De gezinnen op Urk zijn groter dan de huizen" | Gentle and factual (Urk has the youngest population in the country). Keep. Not on the rule 8 list. | Judgement |
| 12 | "het klinkt als een dronken Duitser" | A stock tourist line, aimed at the tourist, not at the Dutch. Keep. | Judgement |
| 13 | "Twee pizza's / pizzas" | `pizza's` is the only correct spelling: a noun ending in a single long vowel letter takes an apostrophe before the plural -s (foto's, alibi's, accu's). The two options differ only by an apostrophe, but this is a Spelling fork (`task: 'spell'`) and the apostrophe is exactly what it tests; the brief's "differ only by punctuation" rule is about non-spelling forks. Keep. | taaladvies.net (apostrophe rule, examples alibi's, accu's); Woordenlijst lists pizza (m/v) |

Two extra dialect checks the audit did not ask for:

- "Oe got ut?" (L83, L90) is confirmed Urkers for "Hoe gaat het?": the crowdsourced Urkers dictionary gives exactly "hoe gaat het? → oe got ut?". Source: mijnwoordenboek.nl/dialect/Urkers.
- "Noondezju" and "salu" (Maastricht) are unverified in that spelling and that place; see Doubtful findings D3 and D4.

## 3. Verdicts on the lines the content author flagged (merged from main at fe7c967)

| Line | Verdict |
|---|---|
| L86 "Als u daar bent, gaat u bij de vuurtoren rechtsaf." | Correct, natural as a direction. Keep. |
| L86 "Voordat ik vertrek, laat ik eerst de honden uit." | Correct and natural. Keep. |
| L87 "omdat ik de hele dag vergaderingen heb" | Correct and natural ("de hele dag vergaderingen hebben" is everyday Dutch). Keep. |
| L90 wrong option "voordat ik ga naar huis" | Acceptable as a wrong option. `naar huis` is a bare directional complement of `gaan`, and natives do not move it behind the verb in a sub-clause the way they do with a longer adjunct PP ("omdat iedereen zit in de kerk"). Keep. |
| L91 "De hond die altijd slaapt, mag niet op de bank liggen." | Correct. Slightly odd in meaning (a dog that always sleeps), but natural enough. Keep. |
| L93 "Het terras dat hier ligt, is al vol." | Correct but stilted; nobody says "het terras dat hier ligt", they say "het terras hier". Finding U3: "Het terras dat [zo mooi ligt \| ligt zo mooi], is al vol." |
| L94 "Is dit de bus naar De Koog die vanavond vertrekt?" | Correct and natural. Keep. |
| L94 "Het schaap dat al uren staat, wil niet van het fietspad af." | Agree with the author: `staan` wants a place or `er`. Finding U4: fixed part "Het schaap dat er", fork unchanged [al uren staat \| staat al uren]. |
| L95 "Het schaap dat al wacht, wil meedoen aan de standup." | Correct, a little bare. Optional finding U6: "Het schaap dat [al klaarstaat \| staat al klaar]". Low. |
| L97 "Het schaap dat al jaren hier woont, kent iedereen." | Agree with the author: the usual order is "dat hier al jaren woont". Finding U5: fixed part "Het schaap dat hier", fork [al jaren woont \| woont al jaren]. |
| L98 "omdat er op de weg veel zand ligt" | Correct and natural. Keep. |

The other new lines from the content branch (shortened Urk and Texel signs, 65 vocabulary swaps in levels 7, 12, 14, 50, 56, 58, 63, 122, 127, 128, the shortened why lines on read items, the rule-id merges) read correctly. One remark outside the Dutch: L56 De sport now carries office words (de muis, de koptelefoon, de afdeling, de lunch, de stagiair) as replays; the Dutch is fine, the theme is not mine to judge.

## 4. Every finding

Shape rules kept in every fix: same rule id, same fork shape, one thing per fork, signs of three words or fewer. Where a de/het test must go, the proposal is to drop the `wrong` on a word item (the item stays as a word), or to swap the noun on a de/het item or build fork for a het-word already in play.

### Wrong

| # | File:line | Level | Current | Proposed fix | Reason | Source |
|---|---|---|---|---|---|---|
| W1 | `levels.js:114`; `content/town-alblasserdam.js:73`, `:88`; `content/town-kinderdijk.js:36`; `content/new/L79.js:85`; `content/new/L111.js:105`; `content/new/L127.js:77` | 41, 44, 44, 46, 79, 111, 127 | `het dashboard` taught with `wrong: 'de dashboard'` (word items 44, 46, 79), `dehet dashboard = het` (41, 111), `[*Het \| De] dashboard` (44, 127) | Word items: drop `wrong`. L41 and L111 dehet: swap noun to `scherm` (het) if not already in the level, else `kantoor`. L44 build: "[*Het \| De] scherm is groen." L127 build: "[*Het \| De] scherm staat al sinds vanochtend op rood" (why: scherm is a het-word). | Woordenlijst: dashboard, zelfstandig naamwoord (m/o). `de dashboard` is also correct, so the fork has two right answers. | woordenlijst.org find_wordform dashboard |
| W2 | `content/new/L111.js:74`; `content/new/L119.js:100` | 111, 119 | `het ticket`, `wrong: 'de ticket'` | Drop `wrong` on both. | Woordenlijst: ticket (m/o). | woordenlijst.org find_wordform ticket |
| W3 | `content/new/L100.js:84` | 100 | `het schap`, `wrong: 'de schap'` | Drop `wrong`. | Woordenlijst: schap (m/v/o). | woordenlijst.org find_wordform schap |
| W4 | `content/new/L125.js:99` | 125 | `het Tikkie`, `wrong: 'de Tikkie'` | Drop `wrong`. The reads "het Tikkie van één cent" can stay (het is one of the two). | Woordenlijst: tikkie "betaalverzoek", zelfstandig naamwoord (m/o). | woordenlijst.org find_wordform tikkie |
| W5 | `content/new/L69.js:53`, `:86` | 69 | `de marktkraam`, `wrong: 'het marktkraam'`; `dehet kraam = de` | :53 drop `wrong`. :86 swap the dehet item to `de haringkar` (kar is de; haringkar is a word in the level) or `het bakje`. | Woordenlijst: kraam and marktkraam (m/v/o). Audit question 2. | woordenlijst.org find_wordform kraam, marktkraam |
| W6 | `content/new/L51.js:35`; `content/new/L59.js:93`; `content/new/L75.js:91`; `content/new/L107.js:81` | 51, 59, 75, 107 | `het gordijn`, `wrong: 'de gordijn'` (51, 75, 107); `dehet gordijn = het` (59) | Drop `wrong` on the three word items. L59 dehet: swap to `het dekbed` (het only). | Woordenlijst: gordijn (m/v/o). In the Netherlands `de gordijn` sounds southern, but the list accepts it. | woordenlijst.org find_wordform gordijn |
| W7 | `content/new/L52.js:60`; `content/new/L100.js:85` | 52, 100 | `het medicijn`, `wrong: 'de medicijn'` | Drop `wrong` on both. | Woordenlijst: medicijn (m/v/o). | woordenlijst.org find_wordform medicijn |
| W8 | `content/new/L66.js:46`; `content/new/L94.js:99` | 66, 94 | `het zadel`, `wrong: 'de zadel'` | Drop `wrong` on both. | Woordenlijst: zadel (m/o). | woordenlijst.org find_wordform zadel |
| W9 | `content/extra/L08.js:24`; `content/new/L67.js:102` | 8, 67 | `het schilderij`, `wrong: 'de schilderij'`; `dehet schilderij = het` | L8: drop `wrong`. L67 dehet: swap to `het dekbed` or `het balkon` (both het only, both in the level). | Woordenlijst: schilderij (v/o). | woordenlijst.org find_wordform schilderij |
| W10 | `content/new/L87.js:106`; `content/new/L95.js:112` | 87, 95 | `dehet rooster = het` with why "het rooster. The plural is de roosters ..." | Swap the dehet noun: L87 `het incident` (why: het incident, learn it with its article), L95 `het overleg` (already a word in the level). | Woordenlijst: rooster (m/o). | woordenlijst.org find_wordform rooster |
| W11 | `content/new/L105.js:119` | 105 | why: "Words ending in -ing are de: de ontmoeting, de afspraak, de uitnodiging." | "Words ending in -ing are de: de ontmoeting, de uitnodiging, de vergadering." | `afspraak` does not end in -ing; the why line states a false example. | Own reading |
| W12 | `content/new/L74.js:37` | 74 | `FK(['gerend', 'gerent'], 0, 'kof', ...)` with no task | Add the fifth argument `'spell'`. | `gerent` is not a word, so the fork is a Spelling fork and must carry `task: 'spell'` (brief, Spelling forks). | CONTENT-BRIEF |
| W13 | `content/new/L98.js:50` | 98 | `FK(['uit te laten', 'uitte laten', 'te uitlaten'], 0, 'sep', ...)` | Drop `uitte laten`: `FK(['uit te laten', 'te uitlaten'], 0, 'sep', ...)`. | `uitte` is not a word; outside a Spelling fork every wrong option must be real Dutch. `te uitlaten` is real words in the wrong order. | CONTENT-BRIEF |
| W14 | `content/new/L106.js:73` | 106 | `FK(['bruggetje', 'brugje'], 0, 'verklein', ...)` with no task | Add `'spell'` as the fifth argument. | `brugje` is not a word; the fork tests spelling (doubled g, -etje). | CONTENT-BRIEF |

### Unnatural

| # | File:line | Level | Current | Proposed fix | Reason | Source |
|---|---|---|---|---|---|---|
| U1 | `content/extra/L07.js:44` | 7 | read "De rest is voor u." = Keep the change. | "Laat maar zitten." (en unchanged; options unchanged) | Understood, but not what a Dutch customer says; the idiom is "laat maar zitten" or "hou de rest maar" (both already in `fares.js`). | Own reading; fares.js:74-76 |
| U2 | `content/new/L84.js:35` | 84 | ", was ze al dicht." (de apotheek) | ", was die al dicht." | In the Netherlands a de-word like apotheek is picked up with `hij` or `die`, not `ze`; `ze` is southern or written. | taaladvies.net/woordgeslacht-algemeen/ (north uses masculine forms) |
| U3 | `content/new/L93.js:53` | 93 | "Het terras dat [*hier ligt \| ligt hier], is al vol." | "Het terras dat [*zo mooi ligt \| ligt zo mooi], is al vol." en: "The terrace that is so well placed is already full." why: "The verb of a dat-clause stands at the end: dat zo mooi ligt." | "dat hier ligt" is stilted; "het terras hier" is what people say. `zo mooi ligt` is natural Dutch and keeps the three-word signs. | Own reading |
| U4 | `content/new/L94.js:48` | 94 | "Het schaap dat [*al uren staat \| staat al uren], wil niet van het fietspad af." | Fixed part "Het schaap dat er", fork unchanged. why: "The verb of the dat clause goes to the end: dat er al uren staat." | `staan` wants `er` or a place; agrees with the author's own doubt. | Own reading |
| U5 | `content/new/L97.js:39` | 97 | "Het schaap dat al jaren [*hier woont \| woont hier], kent iedereen." | Fixed part "Het schaap dat hier", fork [*al jaren woont \| woont al jaren]. why: "... the verb goes to the end: hier al jaren woont." | The usual order is "hier al jaren woont"; "al jaren hier woont" is marked. Agrees with the author. | Own reading |
| U6 | `content/new/L95.js:45` | 95 | "Het schaap [*dat al wacht \| dat wacht al], wil meedoen aan de standup." | Fixed part "Het schaap dat", fork [*al klaarstaat \| staat al klaar]; en "The sheep that is already in place wants to join the standup." | "dat al wacht" is bare; low priority, optional. | Own reading |
| U7 | `content/new/L59.js:30` | 59 | `FK(['belt Paola', 'Paola belt', 'opbelt Paola'], 0, 'v2', ...)` | Drop `opbelt Paola`: two options. | The third option mixes word order with the separable prefix (two things in one fork). `opbelt` is a real form, so this is shape, not a non-word. Low. | CONTENT-BRIEF, one thing per fork |

### Mismatch

| # | File:line | Level | Current | Proposed fix | Reason | Source |
|---|---|---|---|---|---|---|
| M1 | `content/towns.js:307` (blurbNl) and the `blurb` line above it | map, Maastricht | "In 1992 werd hier de Europese Unie getekend." / "The European Union was signed here in 1992." | nl: "In 1992 werd hier het Verdrag van Maastricht getekend." en: "The Treaty of Maastricht was signed here in 1992." | A union is not signed; the treaty is. Both lines carry the same loose phrase, so the Dutch and English match each other but not the fact. | Own reading |

### Doubtful

| # | File:line | Level | Current | Proposed fix | Reason | Source |
|---|---|---|---|---|---|---|
| D1 | `content/new/L79.js:36` | 79 | "Gisteren [*duurde \| duurden \| duurt] de vergadering twee uur." | Replace `duurt` with `geduurd`. why: "Gisteren asks for the past, and one meeting takes no -n: duurde. geduurd needs heeft." | The historic present exists in spoken narrative; as a flat statement it is not natural, but the form is attested. Question 1. | taaladvies.net, tegenwoordige tijd of verleden tijd (algemeen) |
| D2 | `content/new/L129.js:57` | 129 | "met de fiets [*aan de hand \| in de hand \| op de hand] lopen" | "[*aan de hand \| bij de hand \| op de hand]" | ANWB writes "met de fiets in de hand", so a native does say it. `bij de hand` is a real idiom (handy, available) and wrong here. Question 9. | anwb.nl/fiets/tips/kind-leren-fietsen |
| D3 | `content/new/L107.js:97`; `L108.js:92-93`; `L109.js:102`; `L110.js:115`; `L111.js:93`; `L112.js:94`; `L113.js:104-105`; `L114.js:103` | 107 to 114 | "Noondezju" glossed as Maastricht dialect | Spell it "Nondedju" (the ANW headword; variant "nondeju"), and gloss it "a southern curse, from French nom de Dieu, also heard in Maastricht". | The ANW lists `nondedju` as a bastaardvloek "(vooral) in België; eufemistisch; (vooral) gesproken taal", variant `nondeju` used in Belgium and the Netherlands. No source gives the spelling "Noondezju" or marks the word as Maastrichts. The 1999 Mestreechs spelling (Brounts and Dumoulin) may write it differently; I could not verify. | anw.ivdnt.org/article/nondedju; en.wikipedia.org/wiki/Maastrichtian_dialect (spelling) |
| D4 | `content/new/L111.js:98` | 111 | listen "salu = hi, or bye (Maastricht dialect, from French salut)" | Gloss "bye (informal, southern; from French salut)". Or swap the item for a verified Mestreechs word such as `bompa` (grandpa; Wiktionary, Maastrichtian). | nl.wiktionary gives `salu` as an informal farewell ("het beste.") and quotes it as Antwerp usage; no source places it in Maastricht or gives it as "hi". | nl.wiktionary.org/wiki/salu |
| D5 | `content/new/L99.js:119` | 99 | read "Er zit een scheur in de muur sinds de beving." | "Er zit een scheur in de muur." en "There is a crack in the wall." | Question 3: rule 8 judgement; a quake crack in the player's own house in a horror game is the one line a Groninger may read as a joke about the gas quakes. The vocabulary stays. | Judgement |
| D6 | `content/towns.js:99-100` | map, Zeeland | blurb with "1.836 doden" directly before the joke "Er klopt toch iemand." | "In 1953 kwam de zee 's nachts binnen. Nu staan er deuren in de zee, en die gaan dicht als het stormt." (en likewise without the number) | Question 4: next to the death toll, the knock reads as the drowned. The number stays in L58 as history. | Judgement |

## 5. Lookups

| # | Lookup | Where | What it said |
|---|---|---|---|
| 1 | kraam, marktkraam | woordenlijst.org MolexServe find_wordform, db gig_pro_wrdlst | zelfstandig naamwoord (m/v/o): both de and het |
| 2 | 536 nouns whose article the game tests (batch) | same | 10 nouns with both genders (W1 to W10); no single-gender noun mistaught |
| 3 | pizza | same | (m/v); plural not shown by the API |
| 4 | tikkie | same | tussenwerpsel; (o) "tikje; pass"; (m/o) "betaalverzoek" |
| 5 | dashboard, tool, ticket, taal, carnaval, voetveer, bomma, saté, schap, bureau, kussen, kopstootje, gezelschap, ministerie, bank, golf, eb, schuif, koek, pont | same | dashboard m/o, tool m, ticket m/o, taal m/v, carnaval o, voetveer o, bomma v, saté m/v, schap m/v/o, bureau o, kussen o, kopstootje o, gezelschap o, ministerie o, bank m/v, golf o (spel) and m/v (baar), eb m/v, schuif m/v, koek m, pont m/v |
| 6 | bomma | en.wiktionary.org/wiki/bomma | Dutch: (Belgium) grandmother; Limburgish: (Maastrichtian) grandmother, forms bommama, bom, synonyms grameer, ama |
| 7 | Maastrichtian vocabulary | en.wikipedia.org/wiki/Maastrichtian_dialect | table gives bomma(ma) / bompa(pa); official Mestreechs spelling since 1999 (Brounts and Dumoulin) |
| 8 | nondedju | anw.ivdnt.org/article/nondedju | bastaardvloek, (vooral) in België, eufemistisch, gesproken taal; variant nondeju in Belgium and the Netherlands |
| 9 | nondedju in Maastricht | web search (several) | no hit for the spelling Noondezju or for Maastricht specifically |
| 10 | salu | nl.wiktionary.org/wiki/salu | tussenwerpsel, informeel, "het beste. (groet bij een afscheid)", quoted as Antwerp usage; no Limburgs entry |
| 11 | salu in Mestreechs | web search | nothing found |
| 12 | Oe got ut | mijnwoordenboek.nl/dialect/Urkers | "hoe gaat het? → oe got ut?"; also "gaat → got", "hoe laat? → oe loat?" |
| 13 | historisch presens | taaladvies.net/legacylink.php?id=tekst/132/tegenwoordige_tijd_of_verleden_tijd_algemeen/ | present for past events is common in historical description and in speech for effect; example "Lig ik gisteren net lekker een dutje te doen, gaat opeens de telefoon." |
| 14 | historisch presens | onzetaal.nl/taalloket/tegenwoordige-tijd-verleden-tijd (via search) | "Loop ik gisteren in Utrecht, zie ik daar mijn vroegere buurvrouw fietsen." |
| 15 | woordgeslacht, de taal | taaladvies.net/woordgeslacht-algemeen/ | de taal listed among nouns that are masculine or feminine; north uses hem, south ze/haar |
| 16 | verliezen hebben/zijn | taaladvies.net/ik-ben-of-heb-het-verloren/ | "De beide mogelijkheden zijn correct" (confirms audit change 4) |
| 17 | verloren hebben/zijn | onzetaal.nl/taalloket/verloren-hebben-verloren-zijn (via search) | hebben more common in the Netherlands, both correct |
| 18 | u zal / u zult | vlaanderen.be team-taaladvies zullen-vervoegen (via search) | both correct; zal informal in the Netherlands, neutral in Belgium (confirms audit change 19) |
| 19 | fiets aan/in de hand | anwb.nl/fiets/tips/kind-leren-fietsen | "Laat je kind met de fiets in de hand eerst een stukje lopen." |
| 20 | fiets aan de hand | Antwerp 2016 brochure, Brussels fietsbadge handleiding (via search) | "met de fiets aan de hand" is the usual form |
| 21 | iemand aan iets helpen | en.wiktionary.org/wiki/helpen | sense 2: to furnish someone with something, "Bedankt dat je mij aan dat truitje hebt geholpen." |
| 22 | pizza's | taaladvies.net apostrophe pages (via search) | apostrophe before plural -s after a single long vowel letter: alibi's, accu's, foto's |
| 23 | wel even / even wel | e-ans.ivdnt.org 21.4 (via search) | ANS gives tendencies for the middenstuk; no entry for this pair, judgement kept |
| 24 | PP after the verb in a sub-clause | e-ans.ivdnt.org 9.3.3 and 21.4.8.1 (via search) | a PP can follow the verb in a sub-clause (confirms the audit's extraposition fixes); nothing on bare `naar huis` |
| 25 | Urk churches | NOS 2020, VRT 2020 (via search) | 20 (burgemeester) to 24 (VRT) churches; the town text's 24 is sourced |
| 26 | Tikkie in Van Dale | banken.nl 2026 (via search) | word is in Van Dale; gender not shown; Woordenlijst used instead (lookup 4) |
| 27 | bomma as Belgian standard | taaladvies.net (via search) | no entry for bomma; nonkel treated as informal Belgian, by analogy |
| 28 | Mestreechs dictionaries | dbnl Endepols 1955, Aarts Dictionairke (via search) | located, not searchable online for these headwords |
| 29 | praesens historicum literature | wikiwijs, dbnl (via search) | same picture as 13 and 14 |
| 30 | Van Dale gratis woordenboek | vandale.nl | offline since 10 December 2025; not usable |

## 6. What was not found

- No Flemish-only forms in right answers outside the marked dialect items. The audit's earlier swaps (vest, idee, u zal, verliezen met zijn) hold.
- No wrong clock, number, 't kofschip, participle, sub-clause order or passive in any why line, other than W11.
- No English line that contradicts its Dutch line, other than M1 (where both are loose) and the three-way sheep sentences the author already flagged.
- Every dehet or wrong-article item whose noun the Woordenlijst gives a single gender agrees with the Woordenlijst (526 of 536 nouns; the other 10 are W1 to W10).
