export const meta = {
  name: 'nachtrit-towns-sequential',
  description: 'For each town in turn: Sonnet writers write eight levels, Sonnet Dutch teachers audit them, an Opus spot-check measures the error rate',
  phases: [
    { title: 'Write', detail: 'one Sonnet writer per level' },
    { title: 'Audit', detail: 'a Sonnet Dutch teacher checks and fixes each file' },
    { title: 'Spot-check', detail: 'one Opus teacher samples the town and reports the error rate' },
  ],
}
const WT = args.wt
const VAULT = args.vault
const PLACES = [
  ['thuis', 'Thuis', 'home, family, rooms and furniture, the daily routine, the dogs, the wife'],
  ['winkels', 'De winkels', 'shops and shopping: supermarket, bakery, pharmacy, market stalls, paying, prices, sizes, returns, complaints'],
  ['eten', 'Eten en drinken', 'food and drink: café, restaurant, takeaway, the market, ordering, the bill, splitting it'],
  ['station', 'Het station', 'travel and getting around: train, tram, bus, ferry, bike, directions, the time, tickets, delays'],
  ['werk', 'Het werk', 'work in tech: the office and home office, the standup, meetings, incidents, colleagues, the laptop'],
  ['sport', 'De sport', 'sport and outdoors: golf, the gym, the dog walk, cycling, weather, matches'],
  ['mensen', 'De mensen', 'people: meeting people, neighbours, small talk, the borrel, feelings, opinions, arguments'],
]
async function runTown(t) {
const jobs = PLACES.map(([place, name, theme], k) => ({ id: t.start + k, place, name, theme })).concat([{ id: t.start + 7, place: 'eigen', name: t.eigenName, theme: t.eigenTheme }])
  
  const CTX = `You are writing Dutch learning content for Nachtrit, a browser game where a man cycles at night through a haunted Netherlands and steers through signposts to answer Dutch questions. Work ONLY inside ${WT} (a git worktree); do not commit; edit only the one file you are given.
  Read first: ${WT}/CONTENT-BRIEF.md (binding rules, item kinds, output format; its fences for towns 7 to 13 are at the end), ${WT}/levels.js (schema, FK helper, window.defineLevels, window.TIER_PRESET), ${WT}/content/new/L67.js (a finished level of the previous tier, the model for voice and mix), and the town's entry in ${WT}/content/towns.js (landmarks, local words, blurb, joke, look, rumour). The player's own Dutch vault is the main source: ${VAULT} (_site/words, _site/situations/*, _site/maps/MOC *.md, "Dutch Lessons/02 - Grammar", "03 - Verbs", "04 - Phrases & Scenarios"); prefer its words and phrases.
  The player: Santi, Spanish and English speaker living in Alblasserdam, works in tech (Dynatrace, standups, dashboards, incidents), plays golf, wife Paola, two dogs, neighbours, Friday borrels.
  Non-negotiable: Netherlands Dutch, natural and spoken; every noun in a word, look or listen item carries its article; every distractor is WRONG Dutch in its slot (if a native could say it with the same meaning it is a bug); no exclamation marks anywhere; look props only from hond huis fiets kerk boom molen brug water winkel lamp deur tuin nummer; rule ids must exist in window.RULES (reuse existing ids: grep "window.RULES" in levels.js and content/*.js before inventing one; comparatives and superlatives always use 'vergelijk', never vergr or vergl) (add window.RULES.<id> = { name, note } inside your wrapper if you need one, note = the vault note that explains it); wrap the file in (() => { ... })(); define FK inside; no top-level const. Stay inside the fence of tier ${t.tier} (${t.name}) and its word limit.
  Tools (run from ${WT}): node qa/dump-level.mjs <id> --brief, node qa/validate-content.mjs <id> (must end 0 errors and 0 warnings for your level).`
  
  function writePrompt(j) {
    return `${CTX}
  
  Your job: write the NEW level ${j.id} "${j.name}" for ${t.name} (tier ${t.tier}), place "${j.place}". Theme: ${j.theme}. Ground it in ${t.name} (landmarks, local words, jokes from towns.js) while the place's everyday vocabulary stays the core. Santi wants long levels and lots of vocabulary.
  Write ${WT}/content/new/L${j.id}.js containing exactly one level:
  (() => {
    const P = window.TIER_PRESET[${t.tier}];
    const FK = (o, a, r, w) => ({ o, a, r, w });
    window.defineLevels([{ id: ${j.id}, act: ${t.tier}, name: '${j.name}', town: '${t.town}', place: '${j.place}', theme: '<one of street, square, shops, dyke, nightshop>', ...P,
      intro: '<one dry funny English line>', introNl: '<the same line in natural Dutch>',
      mission: { where: '...', carry: '...', want: '...' },
      items: [ /* 44 to 52 items */ ] }]);
  })();
  Item mix: 16 to 22 word items with articles (a quarter with wrong: '<wrong article + noun>'), 5 or 6 read items (at least two with hand-written trap options o/a/r/w), 3 or 4 listen items, 2 to 4 look items, 14 to 20 build items with one or two forks each that drill what is new at tier ${t.tier}, plus a few reviewing earlier tiers; optionally 2 or 3 dehet items. Every build sentence stays within the word limit. Intro and mission carry the game's running jokes in a dry voice (the mist came and everyone who spoke Dutch changed; they still split the bill; the women are still taller than him; the dogs always need a walk; the grammar book was never opened; no helmet) plus ${t.name}'s own humour. Run the validator until your level is clean, then report the item counts.`
  }
  const WRITE = { type: 'object', properties: { file: { type: 'string' }, items: { type: 'number' }, kinds: { type: 'string' }, validator: { type: 'string' } }, required: ['file', 'items', 'kinds', 'validator'] }
  const AUDIT = { type: 'object', properties: { file: { type: 'string' }, checked: { type: 'number' }, fixes: { type: 'array', items: { type: 'object', properties: { before: { type: 'string' }, after: { type: 'string' }, why: { type: 'string' } }, required: ['before', 'after', 'why'] } }, unresolved: { type: 'array', items: { type: 'string' } }, validator: { type: 'string' } }, required: ['file', 'checked', 'fixes', 'unresolved', 'validator'] }
  
  phase('Write')
  const results = await pipeline(jobs,
    j => agent(writePrompt(j), { label: `write:L${j.id}`, phase: 'Write', model: 'sonnet', effort: 'high', schema: WRITE }),
    (w, j) => agent(`${CTX}
  
  You are a native Netherlands-Dutch teacher auditing ${WT}/content/new/L${j.id}.js (level ${j.id} "${j.name}", ${t.name}, tier ${t.tier}, place ${j.place}). Your default stance: every item is wrong until you have checked it yourself. Check every item: spelling and article against a standard dictionary (Van Dale level), natural Netherlands usage, the English gloss, the tier ${t.tier} fence and word limit, that every fork's right answer is the ONLY correct Dutch among its options in that slot, that read options have exactly one right meaning, that every why line is true, that look props fit the noun, that items fit the place and town, no exclamation marks, no duplicate items, and the intro, introNl and mission lines (natural spoken Dutch, genuinely dry and funny, nothing that embarrasses a Dutch reader). Fix every problem in place in that file only; then run node qa/validate-content.mjs ${j.id} until 0 errors and 0 warnings. Two error classes got past earlier audits, hunt for them deliberately: (1) a distractor that is valid Dutch with the same or a slightly different meaning: reflexive verbs that can also take an object (vervelen, voorstellen, herinneren, haasten), word-order swaps a native could say, two infinitives in reverse order after a modal (kunnen letten versus letten kunnen is said in Flanders and in old texts), te versus no te; for each distractor ask 'could a native say this in this slot' and replace it if yes; (2) a why line that names the wrong slot or rule, or an item that uses a structure above the tier fence. Also check the sensitive-topic rule: no jokes about the Groningen gas earthquakes, WWII victims, the Anne Frank house, or anything explicit about the red light district (De Wallen is funny through neon, tourists, bikes and tall locals only). Report every fix as before, after, why.`,
      { label: `audit:L${j.id}`, phase: 'Audit', model: 'sonnet', effort: 'high', schema: AUDIT }))
  const done = results.filter(Boolean)
  log(`${done.length} of ${jobs.length} levels written and audited, ${done.reduce((n, r) => n + r.fixes.length, 0)} audit fixes`)
  
  phase('Spot-check')
  const spot = await agent(`${CTX}
  
  You are the final, independent native Netherlands-Dutch checker for ${t.name}. Eight level files exist in ${WT}/content/new/ (L${t.start}.js to L${t.start + 7}.js), each already written by one agent and audited by another. Pick 6 items per file at random with a seed you choose (mix word, read, listen, build) and check each one from scratch against the standard of a Dutch teacher: article, spelling, naturalness, tier ${t.tier} fence and word limit, that every distractor is wrong Dutch, that every why line is true. Also read all eight intro, introNl and mission lines. Fix every error you find directly in the file. Then report: how many items you checked, how many were wrong before your fix, the most common kind of error, and your honest judgement of whether the files are good enough to ship or need a full second audit.`,
    { label: 'spot-check', phase: 'Spot-check', model: 'opus', effort: 'high', schema: { type: 'object', properties: { checked: { type: 'number' }, wrong: { type: 'number' }, commonError: { type: 'string' }, fixed: { type: 'string' }, verdict: { type: 'string' } }, required: ['checked', 'wrong', 'commonError', 'fixed', 'verdict'] } })
  return { town: t.name, levels: done.map(r => `${r.file}: ${r.validator}`), auditFixes: done.reduce((n, r) => n + r.fixes.length, 0), unresolved: done.flatMap(r => r.unresolved), spot }
}

const out = []
for (const t of args.towns) {
  log('starting ' + t.name)
  out.push(await runTown(t))
  log('finished ' + t.name)
}
return out
