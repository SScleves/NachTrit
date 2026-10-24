# Opus 5.5 DT: instructions for the remote heavy-lifting agent

You are an Opus 5.5 agent with no usage limit, working on Nachtrit from a clone of
https://github.com/SScleves/NachTrit. Another Claude (on Santi's laptop) merges, checks on the
real GPU, and pushes to the live site https://sscleves.github.io/NachTrit/. You do the heavy
engineering and content work listed in BACKLOG.md. Read this file fully before the first commit.

## 1. What Nachtrit is

A browser horror-comedy lane runner that teaches Dutch. The mist came, everyone who spoke Dutch
turned into bill-splitting zombies, and the language left because the Dutch always switched to
English. One man (orange jacket, no helmet, omafiets, two dogs, an unopened grammar book) delivers
the dead; every right Dutch answer gives a word back; saved towns light up; Amsterdam is the finale.
Nobody agrees what caused it (a different rumour per town). Santi, the owner, is a Spanish and
English speaker in Alblasserdam, works in tech, plays golf, wife Paola, two dogs.

Read in this order: `STORY.md`, `ROADMAP.md` (the full plan; this folder is its execution list),
`CONTENT-BRIEF.md`, `MAP.md`, `FARES-SPEC.md`, `ART-BIBLE.md`, `reference/CONCEPT-ART.md` and
every PNG in `reference/` (Santi's concept art, the visual target), `IDEAS.md`.

## 2. The code, in one minute

- `index.html`: markup, CSS, and ONE ES module of about 2,300 lines: Three.js 0.152.2 via an
  import map (jsdelivr), scene, ribbon road, props, zombies, rider, forks, HUD, map, intro,
  post pipeline, debug hooks. No build step. Classic scripts loaded before it: `data.js`,
  `levels.js`, `content/*.js`, `fares.js`, `intro/*.js`.
- Content model: levels are data (`levels.js` defines 1 to 5 and 41 and `window.TIER_PRESET`
  4 to 13; `content/new/L51.js` onward one file per level; `content/extra/*.js` lengthen early
  levels). `content/extra.js` and `content/towns-new.js` are GENERATED bundles: run
  `node qa/build-content.mjs` after touching sources. Item kinds: word, read, listen, look,
  build (with forks `FK(options, answerIndex, ruleId, why)`), dehet. Towns live in
  `content/towns.js` (13 towns: id, tier, cefr, lon/lat, landmarks, words, rumour).
- QA: `node qa/validate-content.mjs [id]` (must end `0 errors, 0 warnings`),
  `node qa/dump-level.mjs <id> --brief`, `node qa/run.mjs <level|intro|endless|all>` (Playwright,
  headless Chromium with software GL, slow; saves frames to `qa/out/<stamp>/` and a report with
  `errors`), `node qa/fares.test.mjs`, `qa/lampbot.js` (browser-side balance bot).
- Debug URL params: `?shot=SECONDS&level=N&lane=N&gate=UNITS&look=1&map=1|townid&town=id&intro=1&post=0`.
  Window hooks the harness relies on and you must keep working: `NR` (state), `NRinfo`,
  `NRbright`, `NRsnap`, `NRstep(n)`, `NRface`, `NRbike`, `NRpost`, `NRsetDPR`, `NRfare`,
  `NRfareFns`, `NRTUNE`, `NRART`, `goLevel(id)`.
- Lamp mechanic: the player's lamp drains, faster as the level progresses (`nightDepth()`), right
  answers refuel a little, wisps are the main fuel; constants in `TUNE` (`window.NRTUNE`). The
  scene darkens with `nightDepth()`. Keep this; retune only with measurements from the bot.

## 3. Setup

```
git clone https://github.com/SScleves/NachTrit.git && cd NachTrit
npm ci && npx playwright install chromium        # harness
python3 serve.py 8765 &                           # no-cache static server
node qa/validate-content.mjs && node qa/run.mjs 1 # must be clean before you start
```
Node 18 or 20 both work. Python 3 with Pillow is useful for contact sheets of frames against
the reference PNGs (`pip install pillow`).

## 4. Hard rules (each one comes from a real failure on Santi's Intel laptop)

1. Never add or remove Three.js lights at runtime, and keep the scene at exactly its four lights
   (hemisphere, moon, lamp spot, clue spot). Shader recompiles stutter. Anything that should look
   like light is an additive mesh, sprite or decal with shared geometry and material.
2. Never sample a render target that is being rendered into (black screen on Intel). The scene
   renders to `sceneRT`, the composer reads it. Keep that structure.
3. 60 fps on an Intel iGPU: no per-frame allocations in `update()`, shared geometry via `G`/`PG`
   and shared materials via `PM`/`brickMat`, merged geometry over many meshes, canvas textures
   over detail meshes, draw calls at most about 2x today's `NRinfo().calls`.
4. The headless harness is software GL: it catches errors and shapes, not GPU bugs or fps. Say
   in your report exactly what changed in rendering so the laptop agent can confirm it on the GPU.
5. Do not touch the road ribbons (`makeRibbon`, `updateRibbon`, `ROAD_LOOK`) unless the task is
   about the road; they were invisible for a day because of a winding bug.
6. `nachtrit.progress` in localStorage holds numbers only (stars per level). Scores live in
   `nachtrit.scores`. Add new keys rather than changing these shapes.
7. Text: no exclamation marks anywhere, in any language. English UI, Dutch game text, Netherlands
   Dutch (not Flemish; "hoeft niet te", "patat" in the Randstad, "friet" below the rivers).
   Every noun carries its article. Every fork distractor must be WRONG Dutch in its slot; if a
   native could say it with the same meaning it is a bug (this class got past two audits: reflexive
   verbs that also take an object, infinitive order after modals, word-order swaps).
8. Humour: dry, no taglines, nothing that embarrasses a Dutch reader; no jokes about the Groningen
   gas earthquakes, WWII victims, the Anne Frank house; De Wallen only through neon, tourists,
   bikes and tall locals.
9. Do not run `npm i typescript vite` or any bundler install until the code split (backlog item 1)
   is merged; the laptop runs Node 18.
10. No new external assets, fonts or CDNs beyond what index.html already loads. Everything is drawn
    in code (canvas, geometry). No secrets in the repo ever; the Azure speech key lives outside
    it in `~/.config/nachtrit/azure.env`.

## 5. How to work and hand over

- One task, one branch named `dt/<short-topic>` from `main`, pushed to GitHub. Never commit to
  `main`, `world`, `map`, `look`, `vocab` or `fares`: those are the laptop agent's branches, some
  with work in flight (world: 3D art pass; map: concept-style map; vocab: Nijmegen and Amsterdam
  content). Rebase onto `main` before you push if main moved.
- `index.html` is the conflict hotspot. Until the code split is merged, only one branch at a time
  may change it; check which `dt/*` branches exist before starting an engine task. Content and
  QA tasks never touch it.
- Every task ends with: validator clean, `node qa/run.mjs` on the levels named in the task with
  `errors: 0`, frames looked at, a commit whose message says what changed and why and ends with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, and a short `REPORT.md` in this
  folder under `reports/<branch>.md`: what changed, what you measured, what you left open, and
  anything the laptop agent must verify on the GPU.
- Commit small and often; the laptop pulls your branches and may merge partway.
- Models: you are the heavy lifter. If you can spawn subagents, use cheaper ones for bulk writing
  and audits and keep the engineering for yourself; the pattern that worked for content was one
  writer per level, one native-teacher auditor per level, one independent spot-check of six random
  items per file that reports an error rate (Rotterdam, Urk, Texel, Groningen, Maastricht were done
  this way with 0 to 7 errors per 48 sampled items, then fixed).
- When a brief and the code disagree, the code on `main` wins; say so in the report.
