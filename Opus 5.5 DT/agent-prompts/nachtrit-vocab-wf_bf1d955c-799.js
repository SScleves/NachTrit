export const meta = {
  name: 'nachtrit-vocab',
  description: 'Lengthen the 25 existing levels with new vocabulary and write the eight places of Zeeland, Utrecht and Den Haag, each file audited and fixed by an adversarial Dutch teacher',
  phases: [
    { title: 'Write', detail: 'one writer per level, each in its own file' },
    { title: 'Audit', detail: 'an independent native-level Dutch teacher checks and fixes each file' },
  ],
}

const WT = args.wt
const VAULT = args.vault

const CTX = `You are writing Dutch learning content for Nachtrit, a browser game where a man cycles at night through a haunted Netherlands and steers through signposts to answer Dutch questions. Work ONLY inside ${WT} (a git worktree; do not commit, do not touch files other than the one you are given).

Read before writing:
- ${WT}/CONTENT-BRIEF.md: binding rules and item kinds. Its "districts" are now towns: district 1 = Alblasserdam (tier 1), district 2 = Kinderdijk en Dordrecht (tier 2), district 3 = Gouda (tier 3). Its curriculum fences per district still apply to those towns.
- ${WT}/MAP.md: twelve towns as difficulty tiers, the same places in every town.
- ${WT}/levels.js: the schema, the FK helper, item kinds (word, read, listen, look, build, dehet), window.defineLevels, window.extendLevel and window.TIER_PRESET.
- ${WT}/content/towns.js: each town's landmarks, local words, blurb and joke.
- For style, two existing content files: ${WT}/content/district3.js and ${WT}/content/town-gouda.js.
- The player's own Dutch vault, the main source: ${VAULT}. Use _site/words/*.md (858 words; frontmatter has nl and en, tags include hoofdstuk/N and kind), _site/situations/<name>/*.md (phrases with nl, en and pronunciation; situations: butcher compliments daily-life directions friends meeting-people neighbours office opinions polite-phrases pub restaurant small-talk supermarket sweet-words takeaway visiting), _site/maps/MOC *.md (word lists per theme: numbers, weather, time, feelings, free time, question words, prepositions, core verbs and more), "Dutch Lessons/02 - Grammar", "Dutch Lessons/03 - Verbs", "Dutch Lessons/04 - Phrases & Scenarios". Prefer the vault's own words and phrasing.

Tools you must use:
- node qa/dump-level.mjs <id> --brief   prints a level's current items (run from ${WT}).
- node qa/validate-content.mjs <id>      validates the level after every content file has loaded; it must end with 0 errors and 0 warnings for your level.

The player: Santi, Spanish and English speaker, lives in Alblasserdam, works in tech (Dynatrace, standups, dashboards, incidents), plays golf, wife Paola, two dogs, neighbours, Friday borrels.

Rules that are never negotiable:
1. Netherlands Dutch, natural and spoken, never Belgian, never stiff textbook. "Je hoeft niet te" means you don't have to, "je moet niet" means you shouldn't, "je mag niet" means you're not allowed.
2. Every noun in a word, look or listen item carries its article (de or het). Plurals are de. Diminutives are het.
3. Distractors must be WRONG Dutch in that slot. If a native speaker could say a distractor with the same meaning, it is a bug. Read options must have exactly one right meaning.
4. No exclamation marks anywhere, in any language.
5. Look props: only hond, huis, fiets, kerk, boom, molen, brug, water, winkel, lamp, deur, tuin, nummer (nummer takes value: <number>).
6. Fork rule ids must exist in window.RULES (see data.js, levels.js and the content files); if you need a new one, add window.RULES.<id> = { name, note } at the top of your file inside the wrapper, where note names the vault note that explains it.
7. Wrap the whole file in (() => { ... })(); and never declare a top-level const (FK and A1 already exist globally; define your own FK inside the wrapper).
8. Stay inside the tier's grammar fence and word limit. Nothing from a later tier.

Tier fences:
- Tier 1, Alblasserdam, A1 words: single words and two-word phrases; builds have one fork; grammar: articles, zijn and hebben in the present, greetings, numbers 0 to 20; at most 5 words per sentence.
- Tier 2, Kinderdijk en Dordrecht, A1 phrases: phrases up to 5 words; present tense, subject verb object only; numbers to 100; polite forms (u, alstublieft); days and months; de/het; niet/geen only in read items.
- Tier 3, Gouda, A1 to A2: sentences up to 8 words; present tense of all persons; questions with the verb first; V2 inversion after a time word; niet and geen; modal plus infinitive at the end; possessives.
- Tier 4, Zeeland, A2 entry: everything in tier 3, plus object pronouns (me, je, hem, haar, ons, jullie, ze), er is and er zijn, comparatives and superlatives (groter dan, het grootst), adjective -e after de, het and een; at most 8 words.
- Tier 5, Utrecht, A2: tier 4 plus separable verbs in the present with the prefix at the end (Ik bel je morgen op), zijn + aan het + infinitive, gaan + infinitive for the future, telling the time (Het is half negen), the imperative (Kom binnen, Fiets maar door); at most 10 words.
- Tier 6, Den Haag, A2+: tier 5 plus the perfectum with hebben and zijn, regular participles with 't kofschip (gewerkt, gewoond), common irregular participles (gegaan, geweest, gedaan, gezien, gegeten, gedronken), separable participles (opgebeld, aangekomen); at most 10 words.
- No tier may use: sub-clauses with the verb at the end (omdat, dat, als), the imperfectum, relative clauses, the passive.`

const EXISTING = [
  { id: 1, name: 'De honden', town: 'alblasserdam', tier: 1, place: 'thuis' },
  { id: 2, name: 'De buren', town: 'alblasserdam', tier: 1, place: 'mensen' },
  { id: 3, name: 'De brievenbus', town: 'alblasserdam', tier: 1, place: 'thuis' },
  { id: 4, name: 'Ik ben', town: 'alblasserdam', tier: 1, place: 'mensen' },
  { id: 5, name: 'Nachtwinkel', town: 'alblasserdam', tier: 1, place: 'winkels' },
  { id: 41, name: 'De of het', town: 'alblasserdam', tier: 1, place: 'thuis', dehet: true },
  { id: 42, name: 'Eten en drinken', town: 'alblasserdam', tier: 1, place: 'eten' },
  { id: 43, name: 'Het station', town: 'alblasserdam', tier: 1, place: 'station' },
  { id: 44, name: 'Het werk', town: 'alblasserdam', tier: 1, place: 'werk' },
  { id: 45, name: 'De sport', town: 'alblasserdam', tier: 1, place: 'sport' },
  { id: 6, name: 'De supermarkt', town: 'kinderdijk', tier: 2, place: 'winkels' },
  { id: 7, name: 'De slager', town: 'kinderdijk', tier: 2, place: 'eten' },
  { id: 8, name: 'De of het', town: 'kinderdijk', tier: 2, place: 'thuis' },
  { id: 9, name: 'Afhalen', town: 'kinderdijk', tier: 2, place: 'eten' },
  { id: 10, name: 'De kalender', town: 'kinderdijk', tier: 2, place: 'station' },
  { id: 46, name: 'Het werk', town: 'kinderdijk', tier: 2, place: 'werk' },
  { id: 47, name: 'De sport', town: 'kinderdijk', tier: 2, place: 'sport' },
  { id: 48, name: 'De mensen', town: 'kinderdijk', tier: 2, place: 'mensen' },
  { id: 11, name: 'Werkwoorden', town: 'gouda', tier: 3, place: 'werk' },
  { id: 12, name: 'De weg kwijt', town: 'gouda', tier: 3, place: 'station' },
  { id: 13, name: 'Nieuwe mensen', town: 'gouda', tier: 3, place: 'mensen' },
  { id: 14, name: 'Niet of geen', town: 'gouda', tier: 3, place: 'winkels' },
  { id: 15, name: 'Mag ik?', town: 'gouda', tier: 3, place: 'sport' },
  { id: 49, name: 'Thuis', town: 'gouda', tier: 3, place: 'thuis' },
  { id: 50, name: 'Eten en drinken', town: 'gouda', tier: 3, place: 'eten' },
]
const PLACE_THEMES = {
  thuis: 'home, family, rooms and furniture, the daily routine, the dogs, the wife',
  winkels: 'shops and shopping: supermarket, bakery, butcher, pharmacy, paying, prices, sizes, returns',
  eten: 'food and drink: café, restaurant, takeaway, the market, ordering, the bill, splitting it',
  station: 'travel and getting around: the train, the bus, the ferry, the bike, directions, the time, tickets',
  werk: 'work in tech: the office and home office, the standup, meetings, incidents, colleagues, the laptop',
  sport: 'sport and outdoors: golf, the gym, the dog walk, cycling, the weather on the course',
  mensen: 'people: meeting people, neighbours, small talk, the borrel, feelings, opinions',
}
const EIGEN = {
  zeeland: 'De Deltawerken: the storm surge barriers, the sea, the 1953 flood (de watersnood), Neeltje Jans, Zierikzee and Middelburg, mussels and the Zeeuwse bolus',
  utrecht: 'De Dom: the Domtoren, the Oudegracht and its wharves, students, the giant bike garage at the station',
  denhaag: 'Het Binnenhof: politicians, de Tweede Kamer, the prime minister, Scheveningen beach and pier, the Haagse Markt',
}
const NEW_TOWNS = [{ town: 'zeeland', name: 'Zeeland', tier: 4, start: 51 }, { town: 'utrecht', name: 'Utrecht', tier: 5, start: 59 }, { town: 'denhaag', name: 'Den Haag', tier: 6, start: 67 }]
const PLACE_ORDER = [['thuis', 'Thuis'], ['winkels', 'De winkels'], ['eten', 'Eten en drinken'], ['station', 'Het station'], ['werk', 'Het werk'], ['sport', 'De sport'], ['mensen', 'De mensen'], ['eigen', null]]
const EIGEN_NAME = { zeeland: 'De Deltawerken', utrecht: 'De Dom', denhaag: 'Het Binnenhof' }

const jobs = []
for (const lv of EXISTING) jobs.push({ kind: 'extend', ...lv, file: `content/extra/L${String(lv.id).padStart(2, '0')}.js` })
for (const t of NEW_TOWNS) PLACE_ORDER.forEach(([place, label], k) => jobs.push({ kind: 'new', id: t.start + k, town: t.town, townName: t.name, tier: t.tier, place, name: label || EIGEN_NAME[t.town], file: `content/new/L${t.start + k}.js` }))

function writePrompt(j) {
  if (j.kind === 'extend' && j.dehet) return `${CTX}

Your job: lengthen level ${j.id} "${j.name}" (${j.town}, tier ${j.tier}), the fixed-lane de/het level (de always left, het always right). First run: node qa/dump-level.mjs ${j.id} --brief
Write ${WT}/${j.file} containing exactly:
(() => {
  window.extendLevel(${j.id}, { deliveries: 24, items: [ /* new items */ ] });
})();
Add 40 to 50 NEW dehet items { dehet: true, nl: '<noun without article>', art: 'de' | 'het', en: 'the ...', w: '<optional one-line rule of thumb when one applies>' } that are not already in the level. Draw them from every tier-1 theme in the vault (home, street, food and drink, shops, station, work, sport, people) so the level covers the whole first town. Balance roughly 60 percent de and 40 percent het. Include several diminutives (het), plurals (de), -ing words (de), languages (het), ge-/be-/ver- words that are het, and plain words where only memory helps. The article must be checked against the vault note or a standard dictionary; when unsure, leave the word out.
Then run node qa/validate-content.mjs ${j.id} and fix until 0 errors and 0 warnings for level ${j.id}.`

  if (j.kind === 'extend') return `${CTX}

Your job: lengthen level ${j.id} "${j.name}" in ${j.town} (tier ${j.tier}), place "${j.place}" (${PLACE_THEMES[j.place]}). Santi wants long levels and lots of vocabulary.
First run: node qa/dump-level.mjs ${j.id} --brief   and read the level's source file to see its voice and its mix of item kinds.
Write ${WT}/${j.file} containing exactly:
(() => {
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(${j.id}, { deliveries: 20, items: [ /* new items */ ] });
})();
Add 28 to 36 NEW items that are not already in the level, on the same theme and place, inside the tier ${j.tier} fence. Keep roughly the level's existing proportions of word, read, listen, look and build items (if the level has no builds, add at most 4 one-fork builds; tier 3 levels should get at least 10 new builds). Word items: { w: 'the ...', nl: 'de ...' } with the article, and add wrong: '<same noun with the wrong article>' to about a quarter of them so those forks also test de/het. Read items: { read: true, nl, en } or with hand-written options { read: true, nl, o: [right, trap, trap], a: 0, r, w } when a meaning trap teaches something. Listen items: { listen: true, nl, en }. Look items: { look: true, prop, nl, en } with a listed prop only. Builds: { en, parts: ['fixed', FK([right, wrong, wrong], 0, ruleId, 'one plain why line'), 'fixed'] }.
Then run node qa/validate-content.mjs ${j.id} and fix until 0 errors and 0 warnings for level ${j.id}.`

  return `${CTX}

Your job: write the NEW level ${j.id} "${j.name}" for the town ${j.townName} (tier ${j.tier}), place "${j.place}". Theme: ${j.place === 'eigen' ? EIGEN[j.town] : PLACE_THEMES[j.place]}. Ground it in ${j.townName}: read its entry in content/towns.js (landmarks, local words, joke, look) and use those where they fit, while the place's everyday vocabulary stays the core. Santi wants long levels and lots of vocabulary.
Write ${WT}/${j.file} containing exactly one level:
(() => {
  const P = window.TIER_PRESET[${j.tier}];
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.defineLevels([{ id: ${j.id}, act: ${j.tier}, name: '${j.name}', town: '${j.town}', place: '${j.place}', theme: '<one of street, square, shops, dyke, nightshop>', ...P,
    intro: '<one dry, funny English line>', introNl: '<the same line in natural Dutch>',
    mission: { where: '...', carry: '...', want: '...' },
    items: [ /* 42 to 50 items */ ] }]);
})();
Item mix: 18 to 24 word items with articles (about a quarter with wrong: '<wrong article + noun>'), 5 or 6 read items (at least two with hand-written trap options), 3 or 4 listen items, 2 to 4 look items, 12 to 16 build items with one or two forks each that drill the grammar new at tier ${j.tier}, optionally 2 or 3 dehet items. Every build sentence stays within the tier's word limit.
The intro and mission lines carry the game's running jokes in a dry voice (the mist came and everyone who spoke Dutch changed; they still split the bill; the women are still taller than him; the dogs always need a walk; the grammar book was never opened; no helmet) and ${j.townName}'s own humour from towns.js.
Then run node qa/validate-content.mjs ${j.id} and fix until 0 errors and 0 warnings for level ${j.id}.`
}

const WRITE = { type: 'object', properties: { file: { type: 'string' }, added: { type: 'number' }, kinds: { type: 'string', description: 'counts per item kind added' }, validator: { type: 'string', description: 'last line of the validator output for this level' }, sources: { type: 'string', description: 'which vault files you drew from' }, notes: { type: 'string' } }, required: ['file', 'added', 'kinds', 'validator', 'sources', 'notes'] }
const AUDIT = { type: 'object', properties: { file: { type: 'string' }, checked: { type: 'number' }, fixes: { type: 'array', items: { type: 'object', properties: { before: { type: 'string' }, after: { type: 'string' }, why: { type: 'string' } }, required: ['before', 'after', 'why'] } }, unresolved: { type: 'array', items: { type: 'string' } }, validator: { type: 'string' } }, required: ['file', 'checked', 'fixes', 'unresolved', 'validator'] }

const results = await pipeline(jobs,
  j => agent(writePrompt(j), Object.assign({ label: `write:L${j.id}`, phase: 'Write', schema: WRITE }, [72, 73, 74].includes(j.id) ? { model: 'sonnet' } : {})),
  (w, j) => agent(`${CTX}

You are a native Netherlands-Dutch teacher auditing a content file another writer just produced: ${WT}/${j.file} (level ${j.id}, ${j.kind === 'new' ? `new level "${j.name}" in ${j.townName}` : `extension of "${j.name}" in ${j.town}`}, tier ${j.tier}). Your default stance is that every item in that file is wrong until you have checked it yourself.
Check every item in the file: spelling and article against a standard dictionary (Van Dale level), natural Netherlands usage, the English gloss, the tier ${j.tier} grammar fence and word limit, that every fork's right answer is the ONLY correct Dutch among its options in that slot (a distractor a native could say with the same meaning is a bug, so change it), that read options have exactly one right meaning, that every why line is true, that look props fit the noun, that items fit the place and town, no exclamation marks, and no duplicates of items the level already had (node qa/dump-level.mjs ${j.id} --brief). For new levels also check the intro, introNl and mission lines: is the Dutch natural, is the line actually dry and funny, is it free of anything that would embarrass a Dutch reader.
Fix every problem in place by editing ${j.file} (no other file). Then run node qa/validate-content.mjs ${j.id} until it reports 0 errors and 0 warnings for level ${j.id}. Report every fix as before, after, why.`,
    Object.assign({ label: `audit:L${j.id}`, phase: 'Audit', schema: AUDIT }, [1, 2, 3, 4, 41].includes(j.id) ? {} : { model: 'sonnet' })))

const done = results.filter(Boolean)
const fixes = done.reduce((n, r) => n + r.fixes.length, 0)
log(`${done.length} of ${jobs.length} levels audited, ${fixes} fixes applied`)
return { audited: done.length, total: jobs.length, fixes, unresolved: done.flatMap(r => r.unresolved.map(u => `${r.file}: ${u}`)), validators: done.map(r => `${r.file}: ${r.validator}`), sampleFixes: done.flatMap(r => r.fixes.slice(0, 2).map(f => `${r.file}: ${f.before} -> ${f.after} (${f.why})`)).slice(0, 40) }