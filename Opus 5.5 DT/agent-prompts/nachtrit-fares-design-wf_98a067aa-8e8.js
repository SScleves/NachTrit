export const meta = {
  name: 'nachtrit-fares-design',
  description: 'Three independent designs for fares and euros in Nachtrit, judged by three lenses and merged into one implementation spec',
  phases: [
    { title: 'Design', detail: 'feel, learning and systems designers work independently' },
    { title: 'Judge', detail: 'game designer, Dutch teacher and senior engineer score every design' },
    { title: 'Synthesize', detail: 'merge the winner with the best of the rest into FARES-SPEC.md' },
  ],
}

const WT = args.wt
const REPO = args.repo

const CONTEXT = `You are working on Nachtrit, a Three.js browser runner that teaches Dutch. It is one big file, index.html (about 1840 lines), plus data files.
Repository to read (do not modify anything in this phase): ${WT}
Read these first: FARES-BRIEF.md (the brief, binding), CONCEPT.md, MAP.md, IDEAS.md, levels.js (level schema and district 1).
Then read index.html by searching before reading, because it is large. Search for: "function mountPassenger", "function dropPassenger", "function resolveFork", "function planSentence", "function placeFork", "function showSummary", "function levelDone", "function openMission", "function openTown", "function dehetBonus", "function drawWorld", "progress", "function saveProgress", "function say(", "function speak(", "function showCard", "#hud", ".pill", "const S = {", "function reset()", "function update(", "o.zombie", "window.NR", "townStars", "function unlocked", "levelQueue", "itemToEntry".

What the player, Santi, asked for, in his words: "the fare and euros, if you don't say it right you don't get the money... and then money can also add to the high score".

Hard constraints learned the hard way in this project:
- No per-object lights of any kind (adding or removing lights recompiles every shader and stutters on his Intel GPU).
- Never sample a render target that is being rendered into (that produced a pure black screen on his GPU).
- Keep these debug hooks working exactly: window.NR, window.goLevel, window.NRinfo, window.NRbright, window.NRsnap, window.NRstep, window.NRface, window.NRbike, window.NRpost, window.NRsetDPR.
- The QA harness (qa/run.mjs) reads #sumtitle, #stars, #s_souls, #again, and NR.delivered, NR.deliveriesTotal, NR.good, NR.bad, NR.lampMin, NR.mode, NR.activeFork, NR.objs, NR.lane, NR.dist.
- localStorage 'nachtrit.progress' is an object {levelId: stars} where stars is a NUMBER. Many places read progress[id] || 0 as a number (townStars, unlocked, the map badges, the place badges, showSummary) and the harness writes numbers into it before the page loads.
- speak() calls speechSynthesis.cancel(), so a second speak() cuts off the first. say() is a single toast element.
- English UI, Dutch game text, no exclamation marks anywhere. Must hold 60 fps on an Intel laptop. Phone width must work.

Facts about the current game you must design around:
- Passengers exist only for build, word, listen and dehet entries (planSentence). Read signposts and look forks have no passenger.
- S.delivered counts deliveries that had zero wrong forks; stars come from delivered / deliveriesTotal.
- S.wrongRow >= 3 sets the lamp to zero, which is game over. That rule exists already.
- Most deliveries in the first two towns have exactly one fork; build sentences in town 3 have one or two.
- S.streak counts right forks, not deliveries.
- Endless mode has L === null. De/het bonus levels are generated with ids 1001 and up.
- Town tiers run 1 (Alblasserdam, A1) to 12 (Amsterdam, B1-B2); a level's town is lv.town or TOWN_OF(lv.id).`

const DESIGN = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    pitch: { type: 'string', description: 'Three sentences: what the player sees, hears and feels.' },
    rules: { type: 'array', items: { type: 'string' }, description: 'Exact money rules: fare amounts per tier and per kind of delivery, when it is shown, when it is paid, what a wrong fork does, refusal, tips, zombies, rounding to 10 cents, endless mode, de/het bonus levels, read and look forks.' },
    hooks: { type: 'array', items: { type: 'object', properties: { where: { type: 'string' }, change: { type: 'string' } }, required: ['where', 'change'] } },
    state: { type: 'array', items: { type: 'string' }, description: 'Every new field, its initial value, and where it resets.' },
    ui: { type: 'array', items: { type: 'string' }, description: 'Every new or changed element with its look, position and behaviour, including phone width.' },
    dutch: { type: 'array', items: { type: 'object', properties: { nl: { type: 'string' }, en: { type: 'string' }, when: { type: 'string' } }, required: ['nl', 'en', 'when'] } },
    euroToWords: { type: 'string', description: 'The algorithm, plus example outputs for at least: 0.5, 1, 2, 4.5, 12.3, 21, 22, 33, 48.8, 99.9.' },
    speech: { type: 'string', description: 'How the sentence and the amount are spoken without cutting each other off.' },
    scoring: { type: 'string' },
    persistence: { type: 'string', description: 'Keys, shapes, and why existing readers of nachtrit.progress cannot break.' },
    extras: { type: 'array', items: { type: 'string' }, description: 'Ideas beyond the brief that stay inside its scope and constraints.' },
    risks: { type: 'array', items: { type: 'string' } },
    tests: { type: 'array', items: { type: 'string' } },
  },
  required: ['title', 'pitch', 'rules', 'hooks', 'state', 'ui', 'dutch', 'euroToWords', 'speech', 'scoring', 'persistence', 'extras', 'risks', 'tests'],
}

const ANGLES = [
  { key: 'feel', label: 'design:feel', brief: 'Your angle is GAME FEEL. Design what makes earning and losing money feel physical and immediate in this dark, INSIDE-like world: the moment a passenger pays, the moment money slips away on a wrong fork, a taxi-meter style fare that visibly drops, coins, a procedural WebAudio sound, restraint so it never turns into a slot machine. Keep the systems simple so the feel can be strong.' },
  { key: 'learning', label: 'design:learning', brief: 'Your angle is LEARNING. Money is the clearest feedback a learner gets. Design the fare so the cost of a specific mistake is visible and memorable, so prices and amounts are Dutch number practice (the amount spoken and written out in Dutch words is itself a lesson), and so the end-of-run summary teaches: consider a Dutch kassabon (shop receipt) that itemises every delivery with its Dutch sentence and what each mistake cost, while keeping the existing mistakes export in the vault format.' },
  { key: 'systems', label: 'design:systems', brief: 'Your angle is SAFETY AND CORRECTNESS. Design the smallest set of hooks that delivers every item of the brief, with exact state fields and where each resets, persistence that cannot break any existing reader of nachtrit.progress or the harness, rounding to 10 cents, how the fare interacts with the existing three-wrong game-over rule, endless mode, de/het bonus levels, read and look forks, levelDone versus death, and the speech queue. Name every function you touch and what changes in it.' },
]

phase('Design')
const designs = await parallel(ANGLES.map(a => () => agent(
  `${CONTEXT}\n\nYour task: write a complete design for the fares-and-euros feature described in FARES-BRIEF.md. ${a.brief}\n\nThe design must cover every numbered item in the brief and honour Santi's rule that Dutch said wrong earns no money. Where the brief and his words pull in different directions (for example the brief says a wrong fork halves the fare, while most deliveries have only one fork), resolve it explicitly and say why. Be concrete: real function names from index.html, real element ids, real Dutch lines. Dutch must be natural spoken Netherlands Dutch.`,
  { label: a.label, phase: 'Design', schema: DESIGN })))
const named = designs.map((d, i) => d ? { key: ANGLES[i].key, design: d } : null).filter(Boolean)
log(`${named.length} of ${ANGLES.length} designs came back`)
if (!named.length) return { error: 'no designs' }

const JUDGE = {
  type: 'object',
  properties: {
    scores: { type: 'array', items: { type: 'object', properties: {
      key: { type: 'string' },
      brief: { type: 'number', description: '0-10 covers every brief item' },
      santi: { type: 'number', description: '0-10 wrong Dutch earns no money, money feeds the score' },
      feel: { type: 'number' }, learning: { type: 'number' }, safety: { type: 'number' }, dutch: { type: 'number' }, buildable: { type: 'number', description: '0-10 one careful engineer can build it in one pass in this codebase' },
      mustFix: { type: 'array', items: { type: 'string' } },
      graft: { type: 'array', items: { type: 'string' }, description: 'ideas from this design worth keeping even if it does not win' },
    }, required: ['key', 'brief', 'santi', 'feel', 'learning', 'safety', 'dutch', 'buildable', 'mustFix', 'graft'] } },
    verdict: { type: 'string' },
  },
  required: ['scores', 'verdict'],
}
const LENSES = [
  { key: 'game', label: 'judge:game-designer', lens: 'You judge as a game designer who has shipped arcade runners: is it fun on the tenth run, is the feedback instant and readable, does it respect the dark, restrained look, does money create good tension without punishing beginners into quitting.' },
  { key: 'teacher', label: 'judge:dutch-teacher', lens: 'You judge as a Dutch teacher for adult beginners from Spanish and English: is every Dutch line natural Netherlands Dutch (not Belgian, not textbook), are the number words and euro amounts correct including trema rules (tweeëntwintig, drieëndertig) and een/één, does the money feedback teach the specific mistake, is anything misleading.' },
  { key: 'engineer', label: 'judge:senior-engineer', lens: 'You judge as a senior engineer who will review the pull request: does it break nachtrit.progress readers or the harness, are state resets complete across reset(), start(), die(), levelDone(), endless mode and bonus levels, is anything done per frame that should not be, are there rendering hazards, is the scope buildable in one file without a rewrite.' },
]
phase('Judge')
const designText = JSON.stringify(named.map(n => ({ key: n.key, ...n.design })), null, 1)
const judgments = (await parallel(LENSES.map(l => () => agent(
  `${CONTEXT}\n\n${l.lens}\n\nScore every design below 0 to 10 on each criterion, list what must be fixed in each, and list ideas in each worth grafting into the winner. Verify claims against the code in ${WT} where it matters (for example whether a hook really exists where a design says).\n\nDESIGNS:\n${designText}`,
  { label: l.label, phase: 'Judge', schema: JUDGE, effort: 'high' })))).filter(Boolean)
log(`${judgments.length} of ${LENSES.length} judges reported`)

const totals = {}
for (const j of judgments) for (const s of j.scores) {
  const t = s.brief + s.santi * 1.5 + s.feel + s.learning + s.safety * 1.5 + s.dutch + s.buildable
  totals[s.key] = (totals[s.key] || 0) + t
}
const ranking = Object.entries(totals).sort((a, b) => b[1] - a[1])
log(`ranking: ${ranking.map(([k, v]) => `${k} ${v.toFixed(1)}`).join(', ')}`)

phase('Synthesize')
const spec = await agent(
  `${CONTEXT}\n\nYou are the lead. Three designers wrote designs for the fares feature; three judges scored them. Ranking by weighted total: ${ranking.map(([k, v]) => `${k} ${v.toFixed(1)}`).join(', ')}.\n\nWrite the final implementation spec to ${WT}/FARES-SPEC.md (create the file; do not modify any other file, do not commit). Start from the top-ranked design, graft the best ideas from the others that the judges flagged, fix every must-fix item, and resolve every conflict with a one-line reason. The spec is for one careful engineer who will implement it in one pass inside index.html (and optionally a new fares.js loaded before the module). It must contain, in this order:\n1. What the player experiences (short).\n2. Money rules, exact and complete, including amounts per tier, rounding to 10 cents, each kind of delivery, read and look forks, refusal, tips, zombies, endless mode, de/het bonus levels, and how it interacts with the three-wrong game-over rule. Honour Santi's rule: Dutch said wrong earns no money.\n3. State: every new field, initial value, and every place it resets.\n4. Hooks: every function in index.html that changes, with the exact change, in the order to make them.\n5. UI: every element with CSS that matches the existing pills, card and toast, including phone width.\n6. Dutch lines: a table of nl, en, when. Natural Netherlands Dutch, no exclamation marks.\n7. euroToWords: the algorithm and a test table of at least 20 amounts with their exact expected output, including trema cases and cents.\n8. Speech: how sentence and amount are queued without cutting each other off.\n9. Scoring and persistence: keys and shapes; nachtrit.progress must keep numbers as values so no existing reader or the harness breaks.\n10. Out of scope: what not to build now.\n11. Verification: the exact commands and what each must show (the harness is node qa/run.mjs <level> with NR_URL=http://localhost:8767/index.html; the server for this worktree already runs on 8767).\nReturn a 10-line summary of the spec's decisions.\n\nDESIGNS:\n${designText}\n\nJUDGMENTS:\n${JSON.stringify(judgments, null, 1)}`,
  { label: 'synthesize:spec', phase: 'Synthesize', effort: 'max' })

return { ranking, judgments: judgments.map(j => j.verdict), summary: spec }