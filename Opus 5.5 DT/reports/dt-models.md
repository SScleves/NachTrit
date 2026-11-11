# dt/models: code-generated 3D models (11 Nov 2026)

Branch `dt/models` (from main `dd97c69`), worktree `/home/santi/dutch-arcade-wt/models`. Not merged, main untouched.
GitHub: https://github.com/SScleves/NachTrit/tree/dt/models

## What changed, in one paragraph

The rider is now a real model: a seated man in an orange jacket with the hood down, no helmet, short messy hair,
on a black omafiets with spoked wheels, swept-back bars, a closed chain case, mudguards, a sprung saddle and a rear rack.
The wheels turn the right way, the cranks turn, and his legs follow the pedals (two-bone IK). Two dogs now run beside
him, one brown and one black with tan points, galloping as fast as he rides and drifting forward and back. Canal-house
gables are 3D pieces with sandstone copings, cornices, claw pieces and hoist beams, with window slots that take the
game's own window atlas and glow. The windmill is a stellingmolen with a brick base, thatched body, stage, braces, cap,
tail and winch wheel, lattice sails and lit windows. The modern lamp post, the bench, every parked bike (bike rows,
lamppost bikes, stoop bikes) and the drawbridge are models too, and the scenery dog prop is the same dog. Every
model falls back to the old primitive when its file does not load.

## The pipeline

- `npm run models` runs `tools/models/build.mjs`, which runs one script per model and writes `assets/models/*.glb`,
  then fails if any file is over 150 KB or the total is over 2 MB.
- `tools/models/lib.mjs`: the palette (one table, sRGB), shape helpers on top of three's geometry (rod, tube, lathe,
  slab, ring, limb), and a `Model` that collects parts per node and per material slot and writes a glb through
  glTF-Transform: `dedup`, `weld`, `quantize` (KHR_mesh_quantization, 14-bit positions, 8-bit normals), `prune`.
  Deterministic: a rebuild writes the same bytes.
- Scripts: `rider.mjs`, `dog.mjs`, `windmill.mjs`, `gables.mjs` (step, neck, bell, spout in one file),
  `props.mjs` (bench, lamp, bike, drawbridge).
- `tools/models/preview.html` + `preview.mjs`: four views of any model (`node tools/models/preview.mjs rider out.png`).
  `tools/models/closeup.mjs`: the rider and dogs, the nearest model gable, or a windmill, seen from four sides in the
  running game.
- Dev dependencies added: `three@0.152.2` (geometry in Node), `@gltf-transform/core|functions|extensions@3`
  (version 4 pulls in sharp, which needs Node 20; version 3 runs on Node 18).
- glTF 2.0 with only KHR_mesh_quantization, no textures, no Draco or meshopt: loads in three 0.152 and in current releases.

Conventions the game relies on (also at the top of `lib.mjs`): metres, y up, vehicles and animals face -z, facades
face +z; every glTF material is named after its slot (`jacket`, `brick`, `stone` ...) and the game maps the slot to
its own toon material, so the look, the cool shadow tint and the fog stay the game's; a node the game moves is a bare
pivot with its mesh on a child; window slots are empty nodes `slot_window_<n>` with extras `{ slot, w, h }`.

## Models and sizes

| File | Triangles | Size |
|---|---|---|
| rider.glb | 6,042 | 96.7 KB |
| gables.glb (4 types) | 1,624 | 51.6 KB |
| windmill.glb | 1,414 | 47.7 KB |
| drawbridge.glb | 736 | 27.3 KB |
| dog.glb | 1,708 | 24.0 KB |
| bike.glb | 858 | 17.7 KB |
| bench.glb | 632 | 14.0 KB |
| lamp.glb | 324 | 7.2 KB |
| total | | about 288 KB |

All eight load in parallel at start; on SwiftShader they are in place 2.3 to 3.2 s after page load.

## How the game uses them (index.html)

- One `GLTFLoader` import (no change to the import map), one loader, `MODELS` filled once. Files are fetched with
  `?v=NR_VERSION`. `window.NRmodels()` says what arrived.
- Static models go through the existing kit (`kModel` pushes their geometry with `kadd`), so a whole terrace with
  model gables is still one mesh per material, and the parked bikes, benches, lamps and drawbridge merge into the kit
  of whatever they stand in. Geometry is dequantized to float once at load.
- The rider, the dogs and the mill's sails are scene-graph clones sharing the loaded geometry and the slot materials.
  The game's headlamp lens, tail light, halos, beam and face canvas are untouched; the model's head goes into the
  existing head group, so the expressions still work.
- Hooks are one-line checks at the top of each builder (`house` gable branch, `windmill`, `lamppost` modern branch,
  `bench`, `kBike`, `drawbridge`, `dogProp`); `riderTick()` replaces the wheel-spin line in `update()`.
- With `?shot`, `?cine` or `?level` the boot waits for the models (at most 8 s), so held frames show them.
- `clearScenery` no longer disposes geometry that belongs to a loaded model.
- Not touched: renderer, import map, the four lights, post effects, ribbons, localStorage. No per-frame allocation
  in `riderTick` (index loops, no new objects). `NR_VERSION` 29 to 30.

## Draw calls and triangles (SwiftShader, full frame, `qa/dt/shoot.mjs`)

Scenery is random per load, so the same level varies by about 60 calls between loads. Before is main `dd97c69`.

| Frame | Before calls | After calls | Before tris | After tris |
|---|---|---|---|---|
| L1 Alblasserdam | 510 | 509, 542, 530 | 41,682 | 53,000 to 57,000 |
| L12 Gouda | 575 | 549, 580, 608 | 63,767 | 93,000 to 102,000 |
| L75 Rotterdam | 463 | 471, 515 | 39,348 | 56,000 to 60,000 |
| L11 Kinderdijk | 468 | 485 | 50,749 | 76,672 |
| intro panel 14 | 171 | 195 | 17,602 | 25,872 |

The rider model costs fewer calls than the primitive rider did (26 against about 45: the old bike had a mesh per
spoke); the two dogs add 16; gables add one (the sandstone) per house kit; the mill adds two per mill. Net change is
within the scene's own noise, and L12 still touches 600 on some loads, as it did before. Triangles rise by 40 to 55
percent; that is cheap next to draw calls on Iris Xe, but it is the number to watch on Santi's GPU.

## Frames

- `Opus 5.5 DT/reports/dt-models/before-after.jpg`: L1, L12, L75, L11, intro panels 14 and 1, main against this branch.
- `Opus 5.5 DT/reports/dt-models/rider-closeup-L12.jpg`: the rider and dogs from four sides in the running game.
- `Opus 5.5 DT/reports/dt-models/gables-in-game-L12.jpg`: step and bell gables on a Gouda terrace, windows lit in the slots.
- `Opus 5.5 DT/reports/dt-models/models-preview.jpg`: every model on its own from four sides.
- Raw PNGs (not committed): `qa/out/models-before/`, `qa/out/models-after/`, `qa/out/models-after2/`.
- Level 40 cannot be shot on main or here: it is a `soon` placeholder with no content and throws
  `Cannot read properties of undefined (reading 'map')` before the frame; the same on both.

## Honest judgement against the concept art

- The rider is the clear win. Before, he was a capsule with two discs for wheels (the old tyres were tori lying in the
  wrong plane, which is why they read as rings from the chase camera). Now he reads as a man on an omafiets from
  behind and in the intro close-up, and the dogs give the opening of every level the two-dogs line of the story.
  Still short of concept G: no retro-future glow on the frame beyond the existing strips, and the jacket is smooth.
- Gables: the step, neck and bell outlines with pale copings are much closer to the concept sheet's ARCHITECTURE
  panel than the flat cut-outs were, but only towns with gables show them (Gouda, Amsterdam and the like) and the
  near houses' gables sit above the frame top in the chase camera; they mostly show in the middle distance.
- The windmill matters in the dyke and Kinderdijk themes, at 12 to 26 m from the road and in haze, so the change
  reads as a better silhouette (stage, lattice sails, cap) rather than detail. The intro's own mills (intro3d) are
  separate and unchanged.
- Bench, lamp, bikes, drawbridge: small at chase distance; the parked bikes and the drawbridge read better, the lamp
  and bench are about the same.

## Not done, and why

- Zombies: not replaced. The existing dead (`deadBody`, `zombieParts`) are already code-sculpted bodies with a near and
  a far LOD, eleven costume variants and per-town dresses hung on the same joints (`deadJoints`). A glb set built in
  this pass would have been plainer than what is there and would have cut the town dress hooks. If the owner wants
  them as files, the right move is to export the existing sculpt through this pipeline, keeping the joints.
- Classic lantern lamp: kept (it was already a detailed kit build).

## What the owner should look at

1. Santi's GPU: ride L1, L12 (Gouda) and L58 or L3 (a dyke level with mills). Check fps and that nothing is missing.
   The headless harness is software GL.
2. The dogs: size, colours, where they run (x 0.85 either side of the bike). They pass through fork signs; they are
   cosmetic. If they crowd the lane on a phone, `riderModel()` holds their offsets.
3. The pedalling: the cadence is capped (crank at most 11 rad/s) so it does not spin silly at top speed.
4. Gouda and Amsterdam terraces from a little further back, to judge the gables.

## Harness

- `node qa/validate-content.mjs`: 0 errors, 0 warnings.
- `node qa/run.mjs 1` (three tries) and `node qa/run.mjs 75`: all stop at the very first step, the screenshot of the
  map screen, with `page.screenshot: Timeout 30000ms exceeded`. The same harness against a copy of main
  (`dd97c69`, same port) fails at the same step the same way. The machine was at load average 14 to 27 the whole time
  (the dt/webgpu agent was running its own `run.mjs 75` alongside), and on SwiftShader the map then draws at 0.5 to
  0.65 s a frame on both branches, so a screenshot takes 35 to 39 s. Not caused by this branch, but it means the
  harness did not run through a level here. Please rerun both on a quiet machine before merging.
- What ran instead: `shoot.mjs` held frames of L1, L11, L12, L75 and intro panels 1, 13, 14 (0 errors on every one),
  and two 120-second simulated rides (`?level=1&shot=120`, `?level=75&shot=120`) through forks, deliveries, wrong
  answers, the death and the summary screen: 0 page errors, 0 console errors.
