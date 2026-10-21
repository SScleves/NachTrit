# Content brief for Nachtrit districts

You are writing the words, phrases and sentences for one district of Nachtrit, a horror arcade
runner that teaches Dutch. The player cycles through a haunted Dutch town at night. At forks the
road splits into signposts and the player steers through the right one. Every item you write
becomes a fork. Read this whole file before writing anything.

## Where things live

- `levels.js`: the level schema and district 1 (levels 1 to 5), the model for everything.
- `content/district<N>.js`: your output. It calls `window.defineLevels([...])` with five level objects.
- `LEVELS.md`: the full 40-level path and what each level covers. Your district's row is binding.
- The vault at https://github.com/SScleves/dutch-lessons is the player's own notes. Prefer its
  phrasing and its examples. Folders: `_site/situations/*` (phrases per situation with English and
  pronunciation), `_site/words` (858 words with chapter tags), `_site/maps/MOC *` (word lists:
  numbers, weather, time, feelings, free time, question words, prepositions), `Dutch Lessons/02 - Grammar`
  (the rule notes, each with a one-line rule and examples), `04 - Phrases & Scenarios`.
- The player: Santi, Spanish and English speaker, lives in Alblasserdam, works in tech (Dynatrace,
  standups, dashboards), plays golf, has a wife and two dogs, neighbours, borrels. Use that world.

## The level object

```js
{ id: 6, act: 2, name: 'De supermarkt', theme: 'shops', ...A1,   // spread the district preset, then override
  intro: 'One English line, dry and funny.', introNl: 'The same line in natural Dutch.',
  mission: { where: 'Where you ride.', carry: 'What you carry.', want: 'What the dead want from you there.' },
  obstacles: 'puddles' | 'light' | 'normal', filler: [26, 36], deliveries: 10,
  items: [ ... ] }
```

Presets (copy from `levels.js`): `A1` for districts 1 to 3. For later districts define the preset
in your file: lanes 3 from district 2 on, speed 12 to 16, forkSlow 0.3 to 0.5, hint 'letter' in
district 2 then none, lampDecay 0.45 to 0.8.

## Item kinds

Every item is one fork. Mix the kinds. Per level: 22 to 30 items, of which 3 to 5 `read`,
2 to 3 `listen`, 2 to 4 `look`, and from district 3 on at least 8 `build`.

```js
{ w: 'the bread', nl: 'het brood' }                      // word: English prompt, Dutch signs, article included
{ read: true, nl: 'Kan ik pinnen?', en: 'Can I pay by card?' }   // Dutch on a board, English signs
{ listen: true, nl: 'twintig', en: '20' }                 // the Dutch is spoken, Dutch signs (spelling)
{ look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }        // a thing beside the road, Dutch signs
{ en: 'Can I pay by card?', parts: ['Kan ik', FK(['pinnen', 'pinnen?', 'te pinnen'], 0, 'modal', 'why line'), '?'] }  // build: gaps in a sentence
```

Build items: `parts` alternates fixed strings and forks. A fork is `FK(options, answerIndex, ruleId, why)`.
Options are 2 or 3. The why is one plain line in the voice of the vault's grammar notes, for example
"omdat sends every verb to the end". Rule ids come from `RULES` in `data.js` and `levels.js`
(v2, bijzin, aux, sep, modal, neg, diedat, imp, kof, perf, tmp, aanhet, fut, refl, soft, dehet, adj,
mag, al, cult, woord, getal, groet, zijn). Add a rule to `window.RULES` at the top of your file if
you need one, with `name` and `note` (the vault note it links to).

Look props available: hond, huis, fiets, kerk, boom, molen, brug, water, winkel, lamp, deur, tuin,
nummer (with `value: 7`). Ask for a new prop in a comment at the top of your file if the level
needs one, with a one-line description of what it looks like.

## Rules that are not negotiable

1. **Distractors are wrong Dutch.** If a native speaker could say it, it is not a distractor.
   "geen tijd" vs "niet tijd": fine. "ik ga morgen" vs "morgen ga ik": both correct, not allowed.
2. **Articles always.** Every noun is `de X` or `het X`. Never a bare noun as a word item.
3. **Stay inside the district's CEFR band.** Max words per sentence: district 1 and 2 five, district 3
   eight, 4 and 5 eight, 6 twelve, 7 and 8 sixteen. No grammar from a later district. The Duolingo
   progression in `LEVELS.md` and below is the fence.
4. **Every item is checkable in one glance.** No two options that differ only by punctuation.
5. **Replay.** About a fifth of each level's word items come from the two levels before it.
6. **Voice.** Intro and mission lines are dry, short, funny, in the register of the opening story:
   the mist came, everyone who spoke Dutch changed, they still split the bill, the women are still
   taller than him, the dogs always need a walk, the grammar book was never opened, no helmet.
   Dutch lines must be natural spoken Dutch, not textbook Dutch. No exclamation marks.
7. **No fiction about Dutch.** Prices in euros with a comma. Real shop names (Albert Heijn is fine).
   Spelling per the Groene Boekje.

## The curriculum fence per district

- District 2 De wijk (A1, 5 words max): shop phrases (supermarket, butcher, takeaway), numbers to
  100, de/het, polite phrases (alsjeblieft, alstublieft, dank u wel), days and months. Grammar: SVO
  present tense only, niet/geen allowed in reading forks only. Levels: 6 De supermarkt, 7 De slager,
  8 De of het, 9 Afhalen, 10 De kalender.
- District 3 Het dorp (A1 to A2, 8 words max): present tense conjugation of hebben, zijn, gaan,
  komen, doen, wonen, werken; question words (wie, wat, waar, wanneer, hoe, waarom) and directions;
  introductions with the first V2 inversions after a time word; niet vs geen; modal verbs with the
  infinitive at the end, including the moet niet / mag niet trap. Levels: 11 Werkwoorden,
  12 De weg kwijt, 13 Nieuwe mensen, 14 Niet of geen, 15 Mag ik?.
- District 4 Thuis en familie (A1 to A2, 8 words): family, colours, rooms and furniture,
  ordering in a restaurant and the pub, weather. Grammar as district 3 plus adjective -e.
- District 5 Het station (A2, 8 words): train, telling time and tickets, body and health, hobbies
  and free time, events. Plus possessives and object pronouns.
- District 6 Kantoor en baan (A2, 12 words): perfectum with hebben/zijn, 't kofschip, separable
  verbs in all positions, gaan/zullen future, time-manner-place, aan het.
- District 7 De lange nacht (B1, 16 words): omdat/als/dat sub-clauses, die/dat, imperfectum,
  reflexives, softeners.
- District 8 De stad (B1 to B2, 16 words): opinions, passive with worden, plusquamperfectum,
  idioms and particles (wel, eens, hoor, toch), er and pronominal adverbs.

## Output

One file, `content/district<N>.js`, starting with a comment listing any new props or rules you
need, then `window.defineLevels([...])` with the five levels in id order. No other output. Run
`node -e "require('./content/district<N>.js')"` is not possible (browser globals), so check the
syntax with `node --check content/district<N>.js` before you finish.
