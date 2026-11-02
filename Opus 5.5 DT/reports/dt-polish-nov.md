# dt/polish-nov: cache versioning, the first five minutes, a warm map, the café shot

Branch `dt/polish-nov` from `main` at 39356da. There are four commits, one for each numbered task, and each was verified before the next one started. Nothing is pushed or merged.

| Commit | Task |
|---|---|
| 4220ec3 | 1. Cache versioning |
| 35c2b51 | 2. First five minutes, points 2, 4, 5, 6 and 8 |
| 003d6fe | 3. The map's warmth |
| 808dc52 | 4. Intro shot 2 fix, and the release bump to NR_VERSION 29 |

Frames live in `qa/out/`, which git ignores, on this machine (`/home/santi/dutch-arcade/qa/out/...`). They are not committed.

## 1. Cache versioning (NEXT-STEPS section 4)

- `index.html` now holds one constant, `window.NR_VERSION = 29;`, in the first inline script. Every local script tag carries it as `?v=29`: all 59 of them (data, content, fares, map-art, intro paintings, intro3d shots, towns3d). The module imports only `three` from the CDN, so it has no local import to version.
- `qa/check-versions.mjs` fails (exit 1) when a local script tag, a local module import (`from './x.js'`, `import('./x.js')`) or a local import-map target lacks `?v=<NR_VERSION>`, or points to a file that does not exist. `--bump` raises the number by one and rewrites every tag. To release: run `node qa/check-versions.mjs --bump`, then commit.
- `qa/validate-content.mjs` and `qa/dump-level.mjs` read the script tags, so they now strip the query.
- Verified: check-versions passes, and it fails on a tag with the version removed (tested, then restored). The validator gives 0 errors and 0 warnings. `qa/run.mjs 1` on the commit gives errors 0 (`/home/santi/dutch-arcade-wt/polish-s1/qa/out/2026-11-02T15-01-27`).

## 2. The first five minutes (FIRST-FIVE-MINUTES.md)

**Point 2, the intro, checked against the code.** Captions already appear whole with a fade, the Dutch line follows 0.6 s later, and each panel moves on by itself after its reading time (at least 3.2 s). Tap, Space or Enter skips ahead. The first run plays eight panels, not five. Santi agreed this on 24 October in commit e09ae88: every rumour joke in its own frame. The code on main is newer than the note, so I kept eight.

**Point 4, the town card.** It is now one list in story order:
- Finished places collapse into a row of star chips (★★☆ plus the name), which can be clicked to replay.
- The first unplayed place is lit. It shows its mission line and its fare range ("Fares here € 1,00 to € 2,00") and takes focus. On the map, Enter opens the town and Enter again rides. Escape closes the card.
- The other places follow in a compact grid.
- The empty "soon" place ("Alleen hier") is gone.
- The bonus reads "De of het, 197 words".
- On phones the bottom sheet is at most 64vh tall, so the map shows above it.

**Point 5, the mission card.** It shows three words with the game's own drawn pictograms (`PICTO`, the same art as the graffiti), new words first under the label "New tonight". The full list moved to the end card: "Words tonight · 18 of 18 right", one tick or cross per word. The card still scrolls, and Ride stays on screen at 390x844 (checked).

**Point 6, the first three forks of a player's first ride.** These are tracked with a new key, `nachtrit.taught`, set once three forks are done:
- The slow-down starts at 30 m.
- An arrow is painted on the road into each option's lane, two per lane at 5 m and 15 m before the sign. They use one canvas texture, one geometry (`PG.arrow`) and one shared glow material.
- The lane bars carry "◀ left lane" and "right lane ▶" (or "▲ middle").
- A line says "Ride through the right word. The lit sign is the answer, this once."
- The right sign glows. The old `hint: 'glow'` only changed emissive intensity, and that did not show after post (frame before/after below). There is now a warm glow card just in front of the right board: on every `hint: 'glow'` fork (tier 1), and stronger on teaching forks.
- Tier 1 signs are 1.3 times larger and slow down from 22 m.

**Point 8.**
- The HUD is one row in 18px type (16px on phones). The lamp comes first and widest, the wallet second, delivered third. The streak shows only from three in a row, and distance only in the endless night.
- A one-time toast fires the first time the lamp drops under half: "The lamp is going. Ride through the lights to fill it." It is tracked with a new key, `nachtrit.lamphint`.
- In tier 1, the wisps of the first 200 m stand in the start lane with nothing in the way.
- The Endless night button was already a text link until a town is saved (`aslink`). I confirmed it.

**Also:** the intro camera in `update()` no longer allocates a Vector3 every frame.

**New check:** `qa/dt/first-five.mjs [base] [out] [w] [h]` walks the whole path for a fresh player using `NRstep`, so it finishes in minutes on software GL. It covers the map, the town card (focus, rows, no "soon", the bonus), the mission card (chips, pictograms, Ride on screen), the HUD (one row), wisp lanes, four forks (teach flag, decals, chevrons, slow, sign scale, draw calls), the taught key, the lamp toast, and the end card.

**Verified:**
- `first-five.mjs` at 1280x800 and 390x844: errors 0, every assertion as expected. Draw calls at the forks were 480 to 516 on the phone.
- `qa/run.mjs 1` on the commit: errors 0 (`/home/santi/dutch-arcade-wt/polish-s2/qa/out/2026-11-02T15-18-02`).
- Frames: `qa/out/ff-laptop/{1-map,2-town,3-mission,4-ride-start,5-fork1,5-fork2,5-fork4,6-lamp-toast,7-summary}.png` and the same set in `qa/out/ff-phone/`. The sign glow shows in `qa/out/ff-phone/5-fork1.png` ("thuis" lit). The first laptop run, made before the glow fix, is in `ff-laptop/5-fork1.png`, where both signs look the same.

## 3. The map's warmth (map-art.js)

Measured with the new `qa/dt/map-shot.mjs` (it shoots the map for a fresh player and for one with Alblasserdam saved, and prints luma, warm pixels and vignette widths). Warm pixels on the painted board went from 8 to 64 on the laptop and from 19 to 82 on the phone. Mean luma is almost unchanged (29 to 30), because the sea dominates the canvas.

- **Every town burns warm.** A locked town lights about half its windows (it was a fifth). The grey wash over it is 0.16 (it was 0.42), its lights keep three quarters of their strength (it was 0.3), and the cold veil is nearly gone. The lock on the badge says it is locked. Open and saved towns light more, and their light reaches further. Town glows are warm for every state.
- **Larger vignettes.** They can be up to 14 badge units wide (it was 10) and slide further sideways. Den Haag (church and pier with the wheel), Zeeland (barrier and harbour), Urk (harbour and lighthouse), Groningen (Martinitoren), Maastricht (churches and bridge) and Nijmegen (the lit Waalbrug) now show at full size on the laptop. The phone is roomier: Alblasserdam is 11 units, Utrecht 11, and Texel, Groningen, Maastricht and Nijmegen are 14.
  - A crowded town may hang its vignette close under its label, centred, at most 9 units. The first try allowed this freely, and the Erasmusbrug and the Waalbrug drifted away from their towns, so it is now a last resort after every "above" spot down to 7 units.
  - The smallest vignettes are drawn at no less than 6 units.
- **Route lamps.** Every road carries amber lamps. Open roads are larger and brighter. Locked roads have a lower warm glow and warm dashes; before, they had grey dots.
- **Dressing.** The land is a shade lighter, so the dark silhouettes read. There are more trees, cows, mills and tulip fields. Half the farms and four in ten mills are lit, and there are up to 30 boats.
- **Water.** A soft pale band mirrors the coast in the sea, and each light's reflection is longer and brighter.
- Everything is still painted once per resize into the cached canvas: 270 to 430 ms at 1280x800 under software GL, against 317 ms before. Only the route lamps, the glows, the lighthouse beams and the cyclist animate.

**Verified:**
- `map-shot.mjs` at both sizes: errors 0.
- `qa/run.mjs 1` on the commit: errors 0 (`/home/santi/dutch-arcade-wt/polish-s3/qa/out/2026-11-02T15-41-21`).
- Frames: before in `qa/out/map-before/{fresh,saved1}-{1280x800,390x844}.png`, after in `qa/out/map-after/` with the same names.

## 4. Intro shot 2, the café

- **Cause.** I raycast through the slab at 1456x822. It is the square's right-hand row of dike houses (`dikeRow(K, 11, 'town')` in `towns3d/alblasserdam.js`), whose front stands at x 9.4. The terrace camera (`CAM1`) stands at x 10.06, 1.2 m inside the house. From inside, the brick boxes are back-face culled, and only the backs of the closed green shutters (#264a31) remain.
- **Fix, in `intro3d/shot-2.js`.** The shot's hide pass now also hides any set piece whose bounds come within 40 cm of one of its camera positions: the terrace camera and both ends of beat 2's push. It gives them back on dispose, like the rest. The third diner, the bike rack and the street now show where the slab was. Beat 2 is unchanged. Draw calls fell from 135 to 119.
- **Before and after frames:**
  - Before: `qa/out/shot2-before/s2t{1,3,6,9}.png`, sheet `qa/out/shot2-before-grid.png`.
  - After: `qa/out/shot2-after/...`, sheet `qa/out/shot2-after-grid.png`.
- **All 14 shots** at 1280x800 and 390x844, at t 2 and 6.5: 56 frames, 0 errors, at most 436 draw calls.
  - Frames: `qa/out/shots-laptop/s01a..s14b.png` and `qa/out/shots-phone/`. Sheets: `qa/out/shots-laptop-grid.png` (shots 1 to 13a) and `qa/out/shots-phone-grid.png` (all 28).
  - No other slab of this kind. Shot 6 beat 2 frames the window with the dark bedroom wall, which its notes describe. Shot 9 beat 2 crops his face at the left edge on the laptop, which is a composition choice, not a slip.

## Final check on the branch head

- `node qa/validate-content.mjs`: 0 errors, 0 warnings. `node qa/check-versions.mjs`: NR_VERSION 29, all 59 local scripts tagged.
- `node qa/run.mjs 1`: errors 0 (`qa/out/2026-11-02T16-18-18`). Under SwiftShader it runs at 1 to 2 fps, so it reaches its 10-minute cap with 2 of 20 delivered. That is the same on main (baseline errors 0, `qa/out/2026-11-02T14-34-52`). `first-five.mjs` rides a level to the end through `NRstep`.
- `node qa/run.mjs intro`: errors 0 twice (`qa/out/2026-11-02T16-37-06`, `qa/out/2026-11-02T16-39-31`). The eight-panel first run plays in 3D with whole captions, then reaches the map. One earlier run hit a 30 s screenshot timeout after panel 8 and did not repeat. The step-1 and step-2 harness runs hit the same first-screenshot timeout whenever a second software-GL browser was running at the same time; run alone, every one passed.
- `qa/dt/start3d.mjs` cannot run on this Linux machine: it launches Chrome with the d3d11 flags and times out loading the page. It fails the same way on unchanged main (`39356da`), so it needs the laptop's GPU. Please run it there, together with `qa/dt/intro-all.mjs`.

## For the laptop agent to confirm on the GPU (software GL cannot show these)

1. **The sign glow.** It is a `GlowMat` sprite (additive, fog-aware, the same program as the wisp halo) at 4.6 x 2.6, 0.3 m in front of the right board. Check that on the Iris Xe it reads as lit without washing out the word.
2. **The road arrows.** These are additive `GlowMat` meshes at y 0.03 with renderOrder 2. Check for z-fighting with the wet road on the GPU.
3. **No new lights, programs or per-frame allocations.** Both new materials are compiled in `warmUp()`.
4. **Draw calls** at a tier-1 teaching fork were 480 to 516 under SwiftShader at phone size. That is four arrows and one sprite more than a normal fork.
5. **Map paint time** on the laptop after a resize. It was 270 to 430 ms under software GL and should be well under that on the GPU.
6. **Shot 2 beat 1** on the GPU at 1456x822: the slab should be gone.

## What is left

- **Gouda and Kinderdijk vignettes stay compact on the laptop** (4.4 units of room, drawn at 6). The Randstad lens leaves no free space above or under their labels. Making them as large as in the concept would need the badges to sit on top of their own vignettes, as in F-map-concept.png. That is a layout change in `NRMAP.layout` (vignette behind its own badge, labels moved), not a paint change.
- **Parts of point 6 not built:** holding the first gate until the player moves at all, and a dog barking on the right side. The harness autopilot sets `NR.lane` directly, so holding the gate needs a harness change too.
- **Point 4's place lines as a passenger sentence** ("Thuis: the dogs need a walk"). The lit row uses the level's mission line instead, which exists for every level.
- **The end card's word list** includes word-sized builds ("Paola is thuis."). That is intended: they are one-gap sentences met on the road.
- **The vocabulary book** (backlog A4) is still where the full word list should also live.
- The first-five path is now covered by `qa/dt/first-five.mjs`, but `qa/run.mjs` itself does not set `nachtrit.taught`, so its level runs now include the three teaching forks. This is harmless; it shows them in its frames.
- **Housekeeping on this machine.** The 8765 server was not running at the start; I started `python3 serve.py 8765` and left it running. The worktrees `/home/santi/dutch-arcade-wt/polish-s1..s3` and `polish-base` (ports 8771 to 8774) that I used to verify each commit were removed at the end, so the harness folders named above under them are gone; their results are recorded here.
