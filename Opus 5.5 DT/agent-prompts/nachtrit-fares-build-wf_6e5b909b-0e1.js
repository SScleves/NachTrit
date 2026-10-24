export const meta = {
  name: 'nachtrit-fares-build',
  description: 'Build the fares feature from FARES-SPEC.md, then three reviewers try to break it and the builder fixes what survives',
  phases: [
    { title: 'Build', detail: 'one Opus engineer implements the spec' },
    { title: 'Review', detail: 'Dutch teacher, harness tester and code reviewer' },
    { title: 'Fix', detail: 'the builder applies confirmed findings' },
  ],
}
const WT = args.wt
const URL = 'http://localhost:8767/index.html'
const CTX = `Nachtrit is a Three.js browser runner that teaches Dutch; one big file index.html plus data files. Work ONLY in the git worktree ${WT} (branch fares). Its server runs at ${URL} (no-cache). Hard rules learned the hard way: never add or remove lights (shader recompiles stutter on Santi's Intel GPU); never sample a render target being rendered into; do not touch buildPost, render, inkPass, gradePass, bloomPass, mountPassenger's visuals, levelDone, die, say, speak; keep every window.NR* debug hook; localStorage nachtrit.progress keeps NUMBER values only; no exclamation marks in any text; English UI, Dutch game text; no per-frame allocations in update().`

phase('Build')
const build = await agent(`${CTX}
Implement FARES-SPEC.md in ${WT} exactly as written (read it fully first, then FARES-BRIEF.md). Read the regions you change before editing: search index.html for "const S = {", "function reset()", "function planSentence", "function showCard", "function hideCard", "function resolveFork", "o.zombie", "const hud = ", "function showSummary", "function openMission", "function openTown", "let progress", "function speak(", "function thump(", '<div id="hud">', '<div id="card">', 'id="stars"'. Create fares.js (IIFE, window.FARES only) and qa/fares.test.mjs. Run node qa/fares.test.mjs until it passes, then NR_URL=${URL} node qa/run.mjs 1 and NR_URL=${URL} node qa/run.mjs 6 until both report errors: 0, and look at the L1-end and L6-end PNGs in qa/out/<newest>/ with the Read tool to confirm the Wallet pill, Score and Best show. Also write qa/fares-play.mjs: a Playwright script against NR_URL that plays level 1 with the autopilot but deliberately answers the first passenger fork wrong, then checks the refusal, missed, delivered and the invariant cents === paid + tips - tikkie, and forces a zombie hit with NR.cents = 200; make it pass. Commit on branch fares with a clear message ending with the line "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>". Report: commit hash, files changed, every decision the spec left open, and the exact output of the three test commands.`,
  { label: 'build:fares', phase: 'Build', model: 'opus', effort: 'high', schema: { type: 'object', properties: { commit: { type: 'string' }, files: { type: 'string' }, decisions: { type: 'string' }, tests: { type: 'string' } }, required: ['commit', 'files', 'decisions', 'tests'] } })
if (!build) return { error: 'build failed' }
log(`built: ${build.commit}`)

const FINDINGS = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: { where: { type: 'string' }, what: { type: 'string' }, how: { type: 'string', description: 'exact steps or input that shows it' }, fix: { type: 'string' }, severity: { type: 'string', enum: ['must', 'should', 'nice'] } }, required: ['where', 'what', 'how', 'fix', 'severity'] } } }, required: ['findings'] }
phase('Review')
const reviews = (await parallel([
  () => agent(`${CTX}
You are a native Netherlands-Dutch teacher. Read-only review of the fares feature on branch fares in ${WT} (commit ${build.commit}): fares.js (REFUSE, TIPS, euroToWords) and every Dutch string added to index.html. Check: every number word for 0 to 200 euros with cents (run node -e with a vm to call window.FARES.euroToWords on at least 40 amounts including 1, 1.5, 21, 22, 23.2, 33, 44.4, 100, 101, 150.5, 199.9), trema rules, één versus een, singular euro and cent, natural spoken refusal and tip lines with the right register for each tier, the alsjeblieft line, no exclamation marks. Report only real problems with the exact wrong output and the right one.`,
    { label: 'review:dutch', phase: 'Review', model: 'opus', effort: 'high', schema: FINDINGS }),
  () => agent(`${CTX}
You are a tester. On branch fares in ${WT} (commit ${build.commit}), try to break the fares feature with Playwright against ${URL} (chromium from the node_modules symlink in the worktree; see qa/run.mjs and qa/fares-play.mjs for how the autopilot and NR hooks work, and reuse them). Scenarios to run and check, each with assertions: a clean level 1 run (wallet, score, best saved only when won, nachtrit.progress still numbers only); a run that dies on level 1 (no best saved, 'Score counts when you get home.'); a level 11 run with a wrong first fork on a two-fork sentence then a right second fork (the card shows the struck fare, pays half); three wrong in a row (death path, no refusal, no payment); a zombie hit at 0 cents and at 200 cents; the de/het bonus for Alblasserdam (id 1001: pays 50 per ride, nothing spoken for the amount); endless mode to death (scores.endless saved); the game with fares.js renamed away (no error, no money); NRinfo().programs identical before and after ten paid deliveries; phone viewport 360x740 during a ride and on the summary (no horizontal scroll, #again reachable). Report only failures, each with the exact command and output.`,
    { label: 'review:play', phase: 'Review', model: 'sonnet', effort: 'high', schema: FINDINGS }),
  () => agent(`${CTX}
You are a senior engineer reviewing the diff of branch fares against main in ${WT}: run git diff main..fares and read every hunk, then read the surrounding code. Look for: state that does not reset in reset() or leaks across runs; the endless (L === null) and bonus (ids 1001+) paths; the three-wrong death path racing payment or speech; speakSeq cutting the next card's listen prompt; per-frame allocations or DOM writes in update(); anything that changes stars, delivered, good, bad or the lamp; the hudLast change-only pattern; any new light, material or render-target use; the FARES stub when fares.js is missing; nachtrit.progress written with non-numbers; try/catch around every localStorage access; text with exclamation marks. Report only real defects with a concrete scenario.`,
    { label: 'review:code', phase: 'Review', model: 'opus', effort: 'high', schema: FINDINGS }),
])).filter(Boolean)
const all = reviews.flatMap(r => r.findings)
log(`${all.length} findings, ${all.filter(f => f.severity === 'must').length} must`)

phase('Fix')
const fix = all.length ? await agent(`${CTX}
You built the fares feature on branch fares in ${WT} (commit ${build.commit}). Three reviewers reported these findings:
${JSON.stringify(all, null, 1)}
Verify each against the code (reviewers can be wrong; say so when they are), fix every confirmed 'must' and 'should', and the 'nice' ones that are cheap. Re-run node qa/fares.test.mjs, node qa/fares-play.mjs with NR_URL=${URL}, and NR_URL=${URL} node qa/run.mjs 1 until all pass with errors: 0. Commit on branch fares, message ending with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>". Report: commit hash, each finding with fixed / rejected and why, and the final test output.`,
  { label: 'fix:fares', phase: 'Fix', model: 'opus', effort: 'high', schema: { type: 'object', properties: { commit: { type: 'string' }, outcomes: { type: 'string' }, tests: { type: 'string' } }, required: ['commit', 'outcomes', 'tests'] } }) : null

return { build: { commit: build.commit, decisions: build.decisions }, findings: all.map(f => `${f.severity}: ${f.where}: ${f.what}`), fix }