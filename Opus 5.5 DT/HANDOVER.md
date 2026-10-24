# Handover: where every piece of work stands (24 Oct 2026, 13:40 CET)

The laptop agent has stopped all local work. From here the Opus 5.5 DT agent carries the heavy
lifting. This file says exactly where each piece stopped so you can pick it up. Read README.md
first, then this, then BACKLOG.md.

## 1. Branches on GitHub and their state

| Branch | State | What to do |
|---|---|---|
| `main` | Playable, live at https://sscleves.github.io/NachTrit/. Has the atmosphere pass, lamp mechanic, fares, 114 levels (towns 1 to 11), route-board map, 14-panel intro. | Base for every `dt/*` branch. |
| `world` | WIP commit `ccb82ad` on top of main: the composition and props pass, saved as the artist left it when stopped mid-task. Parses, renders on Santi's GPU with 0 errors, luma 64 on Gouda L12. | **Pick this up first among art tasks** (see section 3). |
| `map` | WIP commit `691bc5d`: `map-art.js` (467 lines, new) plus index.html hooks. Paints a diorama map; badges were mid-rewrite when stopped. Parses, no console errors. | Pick up (section 4). |
| `vocab` | Merged into main; nothing pending. | Ignore. |
| `look` | Merged into main (Santi merged PR #1). | Ignore. |
| `fares` | Merged into main. | Ignore. |

Ports on the laptop (not yours, listed so reports make sense): 8765 main, 8770 world, 8771 map.

## 2. What the game looks like right now

Two frames captured on Santi's real Intel GPU are in this folder:

- `state-main-atmosphere-only-gouda-L12-on-santis-gpu.png`: main as deployed. Haze sky, lamp
  cones, warm windows, but houses stand alone with empty fog between them, walls read salmon,
  no trees or skyline, crude zombie and passenger.
- `state-world-branch-gouda-L12-on-santis-gpu.png`: the `world` WIP. Continuous terraces, a
  second row behind, skyline silhouettes (spires, towers, gables) fading into haze, tree cards,
  lantern-style lamps with halos, a fence-peeking zombie with a bucket hat and yellow eyes, a
  canal side with reeds and a bridge, graffiti and shop signs. This is the quality jump Santi
  asked for. It is not finished: walls still flat colour (no brick texture; the materials pass
  never ran), the far skyline cards are a little too uniform, the passenger is still a blob,
  and nothing has been measured for draw calls or fps.

Judge both against `concept-art/D-foggy-village-with-zombies.png`.

## 3. Picking up `world` (backlog B, do before B1 and B2)

1. `git checkout world`, serve it, open `?shot=8&level=12&lane=1` and `?level=3` (dyke) and
   `?level=58` (Zeeland) and `?level=67` (Den Haag), and the harness `node qa/run.mjs 1` and `6`.
   Confirm errors: 0 and that every theme (street, square, shops, dyke, nightshop) still renders:
   the artist was iterating on Gouda and may have left other themes half-dressed.
2. Count draw calls per full frame (the artist's method: `renderer.info.autoReset = false`, one
   `NRstep(1)`, read `renderer.info.render.calls`; `NRinfo().calls` only shows the last composer
   pass). Before the WIP, Gouda L12 was 464 to 508. Stay under about 2x; merge geometry where it
   grew.
3. Finish the composition brief from the v3 workflow (copied below in section 7): three layers
   behind the houses on EVERY theme and town, trees, canal side, drawbridge, ground mist in bands,
   lamppost rhythm, the landmark on the horizon.
4. Run the materials pass (section 7): dark textured brick so only windows are warm, roof tiles,
   cobbles, wood, window texture with curtains and plants. Keep roofs and walls dark enough to be
   silhouettes in fog.
5. Then the cast (backlog B2) and town identity (B1).
6. Rebase or merge `main` into `world` before you open the PR. The laptop agent checks on the GPU
   and merges. In your report list every rendering change (shader, material, post) so the GPU
   check can target it; the headless harness cannot see GPU-only bugs.

## 4. Picking up `map` (concept-art/F-map-concept.png)

What exists (`map-art.js`, `window.NRMAP`): a seeded painter that draws the country as land in
dark water with coastline, IJsselmeer, Flevoland, rivers; scatters trees, poplars, windmills,
cows, tulip fields, boats; paints a glow vignette per town; the badges, number chips, names,
CEFR bands, cyclist, title, subtitle, footer and Endless button all render in the concept's
typography. Screenshot of the state as stopped: `state-map-branch-laptop.png` (and `-phone.png`)
if present in this folder.

What is wrong against the concept, in order: (1) the country outline is a rounded blob, not the
Netherlands; it needs real coastline coordinates (simplified to 150 to 300 points, with the
Wadden islands, Zeeland's estuaries, the Afsluitdijk) projected with the same projection the
town positions use (`nodePositions` in index.html, which warps the Randstad apart so nothing
overlaps; keep that and apply the same warp to the outline); (2) the land has no raised edge;
the concept is a diorama with a visible darker side face and water reflections under it;
(3) the route is straight dashed lines across the whole country; it should follow the roads of
the concept, town to town in tier order with gentle curves, lamp dots along it; (4) town
vignettes are small blobs; each needs a silhouette built from the town's landmarks (Gouda cheese
wheels, Kinderdijk mills, Texel lighthouse beam, Nijmegen's lit arched Waalbrug, Groningen's
Martinitoren, Utrecht's Dom, Den Haag's big church, Urk harbour with kotters, Amsterdam gabled
canal houses, Maastricht churches and bridge, Zeeland harbour, Rotterdam cranes and the
Erasmusbrug, Alblasserdam a dyke village with the home); (5) the badge rewrite was mid-way:
check locked, unlocked, current (green house ring) and saved states, and keyboard riding.
Keep everything in `map-art.js` plus the existing map functions; paint once per resize and
cache, only the glow pulse and the cyclist animate.

## 5. Content state

- Levels 1 to 114 are on main, audited and spot-checked. Validator clean.
- Nijmegen (115 to 122) and Amsterdam (123 to 130): yours (backlog C1). `content/pending/L118.js`
  and `L122.js` are unaudited drafts.
- The validator and dump tools now read `content/new/*.js` and `content/extra/*.js` directly;
  the bundles are rebuilt with `node qa/build-content.mjs` and must be committed (a CI check
  for freshness is backlog D3).
- Rule ids for comparison were unified to `vergelijk`; before inventing a rule id, grep
  `window.RULES`.
- Error class that passes two audits: distractors that are valid Dutch (reflexives with an
  object, infinitive order after modals, word-order swaps). The Urk run also showed writers
  drilling separable verbs in sub-clauses at tier 8 although the fence puts that at tier 10, and
  "Ik ben laat" where Netherlands Dutch says "te laat". Hunt for these on purpose.

## 6. Lamp and night mechanic, as measured

`TUNE = { drain: 2.5, wisp: 2.0, right: 3, cap: 0.6 }` in index.html. Drain per second is
`min(lampDecay, cap) * drain * (0.6 + 1.1 * nightDepth())`, where `nightDepth()` runs 0 to 1
over the level. Right answer refuels `right + min(streak,4)*0.3`; a wisp gives `wisp`. The
scene darkens with nightDepth (hemisphere 0.6 to 0.2, fog density up, town light decals down
45 percent; wisps keep full strength). Bot results (`qa/lampbot.js`, always-right autopilot):

| Level | collects wisps | ignores wisps |
|---|---|---|
| 1 (Alblasserdam) | not run | finishes, 40 left |
| 11 (Kinderdijk) | finishes, 43 left | dies at 17 of 20 |
| 58 (Zeeland) | finishes, 59 left | dies at 18 of 20 |
| 75 (Rotterdam) | finishes, 60 left | dies at 15 of 20 |

Keep this balance when you add power-ups or hazards; re-run the bot (load `qa/lampbot.js` in the
page, then `__sim(name, collectWisps, msBudget)` in chunks under 30 s per call).

## 7. The art briefs the stopped artists were working from

Composition: build, per theme, three layers behind the street row: a second row of houses
behind the first, lower and fainter; flat dark silhouette cards of the town's skyline far back
(spire, mill with lit windows, crane, tower, treeline, chosen from LANDMARK and the town id),
layered at two or three distances so nearer cards are darker and farther paler; the sky band
above. Tree silhouettes (the tall tree in D's left foreground, rounded trees mid-distance) as
canvas cards or merged blobs. The canal side of the reference where the theme has water: water,
reeds, mooring posts, a wooden drawbridge with counterweight beam and a tiny figure, a moored
boat. Ground mist in two or three bands at different distances, soft round gradients, never
hard-edged ellipses. Regular lamppost spacing so the eye follows them into the fog. The landmark
on the horizon like D's windmill. A slightly lower, closer chase camera that keeps the road
readable; keep the dolly-zoom and reaction-shot camera behaviours.

Props: shutters, cellar windows, chimneys and gutters, hanging shop signs, bikes chained to
stoop railings, a cat in an occasional lit window, tulip planters, picket fences and hedges,
bikes in rows against railings and lampposts, bins, crates, black Amsterdammertje bollards,
benches, blue round bike-lane signs, wooden fingerposts, boats and mooring posts, reeds, a white
duck. Two lamp styles (slim modern flat head in newer towns, classic lantern in old centres).
Zombies: the fence peeker by lit windows, tiny shamblers far down the street, the sheet's
variants. Town words feed graffiti and shop signs (make allWords and SHOP_SIGNS town-aware);
town landmarks appear as named props.

Materials: canvas textures generated once at startup and shared: brick courses with mortar in
each town's brick colour, roof tiles with slight variation, cobbles and pavement slabs, wood
grain for fences, boats and the drawbridge, grime at wall bases, damp darkening toward the
pavement, rust on lamp posts. Through `Mat({ map })` keeping the toon look and the cool shadow
tint. Windows: a two-tone frame-plus-glass texture, some curtains, a plant on the sill, glass
emissive amber where lit so the halos line up. Textures 256 or 512. Walls and roofs dark enough
to read as silhouettes in fog.

Engine rules that constrain all three: exactly four lights, nothing added or removed; additive
sprites, cones and decals for anything light-like; never read a render target being written;
no per-frame allocations in update(); ribbons untouched; draw calls under 2x.

## 8. Things Santi has said that are standing orders

- "Detail behind the houses, so it's not only house and then pitch black in the back."
- "The research in the towns must be visible in the world." (towns.js words and landmarks)
- "In Amsterdam I also want to see the red light district." Clean and funny.
- "Make it look really really close to the concept art, and use the GitHub repos as code
  examples" (PhiloLabs/fable51-worlds: kyoto-higashiyama and death-star-trench-run; a16z-infra/
  ai-town and ceresOPA/Alicization-Town for character and map ideas). Local copies of the useful
  Kyoto and Trench Run files were under refcode/ on the laptop; fetch them from GitHub yourself.
- "The lights need to dim as it progresses, otherwise there's no point capturing lights."
- "Each joke should have its own frame" in the intro (done: 14 panels; panels 4 to 6 unpainted).
- "The map should be clearer about difficulty, with a rideable bike between towns" (done as
  the route board; now being redrawn to the concept).
- "Writing mode so we can also write" (backlog A2).
- Netherlands Dutch; no exclamation marks; dry humour; Santi's own life in the content.
- Back up constantly; push every verified change; keep the laptop playable at 60 fps.
