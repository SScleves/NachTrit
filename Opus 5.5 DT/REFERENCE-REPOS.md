# Reference repos Santi pointed at: study these, port the techniques

Santi's words: "those guys had the graphics super polished" and "use the githubs as code
examples to improve details and quality". These are the four. Read them before any art or
engine task; port ideas, not files (ours is one index.html with a Three.js 0.152 import map and
no build step; theirs use bundlers and modules).

## 1. PhiloLabs/fable51-worlds (MIT) https://github.com/PhiloLabs/fable51-worlds
Two Three.js worlds built by Claude with the same constraints we have (code-drawn everything,
headless QA, published write-ups of what worked). The most useful one.

### kyoto-higashiyama (the look we want to reach)
https://github.com/PhiloLabs/fable51-worlds/tree/main/kyoto-higashiyama
Study, in order:
- `src/core/toon.js`: MeshToonMaterial with hand-authored ramps, the toon BRDF patched so shadow
  bands tint toward a cool violet (already ported into our Mat(); extend it), high-key ramps for
  things that must stay light, `celTex` for textured toon materials.
- `src/core/post.js` and `src/core/sky.js`: the grade, bloom and the sky dome gradient.
- `src/core/palette.js`: the whole palette as one data table; we should do the same per theme
  and town instead of hex literals scattered through index.html.
- `src/core/textures.js`: canvas-drawn textures (wood, tile, paper, lattice) generated once and
  shared: the model for our brick, roof tile, cobble and window textures.
- `src/core/outline.js`: their ink outline pass.
- `src/world/props.js`, `src/world/streets.js`, `src/world/vegetation.js`,
  `src/world/terrain.js`: how a dense street is dressed from a few cheap parts, batching,
  tree silhouettes, lantern rows, signage.
- `src/kit/*.js` (machiya, roof, shopfront, streetfurniture): the building kit idea: one
  parametric builder per building type with variants, merged into few draw calls. Our house()
  should become a kit like this: gable types, shutters, shop fronts, cellar windows.
- `docs/KIT.md`, `README.md`, `FINAL_QA_REPORT.md`: their process, QA and what they measured.
- `tools/capture.mjs`, `tools/perf.mjs`, `tools/walkthrough.mjs`: harness ideas for backlog D1.

### death-star-trench-run-gpt-astra (the runner feel and the post pipeline)
https://github.com/PhiloLabs/fable51-worlds/tree/main/death-star-trench-run-gpt-astra
- `app/experience/effects.ts`: HDR bloom, grade, grain, vignette, ACES tone mapping, glow tricks.
- `app/experience/environment.ts`: endless-corridor construction, fog layering, light streaks.
- `app/experience/engine.ts`: the loop, speed ramp, camera lag and shake for a runner.
- `qa/continuous-run.mjs`: a continuous headless QA loop.

Local copies of the most useful files are in `reference-code/` in this folder (MIT, licence
included): `kyoto/core_toon.js`, `core_post.js`, `core_sky.js`, `core_palette.js`,
`core_outline.js`, `core_textures.js`, `world_props.js`, `world_streets.js`, `world_terrain.js`,
`world_vegetation.js`, `KIT.md`, `README.md`; `trench/effects.ts`, `environment.ts`. Fetch the
rest from GitHub when you need it.

## 2. a16z-infra/ai-town (MIT) https://github.com/a16z-infra/ai-town
A pixel-art town with characters walking around. Study for: the map and character sprite
approach (`data/` tilemaps, `convex/` world logic is not relevant), the character sheets and
how a small set of frames gives readable walking characters, and the town-as-a-map idea for our
world map and for zombies and passengers (sheet C's five-pose zombie walk cycle). Not a graphics
model for the 3D game.

## 3. ceresOPA/Alicization-Town https://github.com/ceresOPA/Alicization-Town
An ai-town derivative with its own town map and characters. Same use as ai-town: map
composition and character variety ideas. Check its licence before copying anything.

## What to take, in one line each
- Kyoto: palette as data, cel ramps with tinted shadows, canvas textures, a building kit,
  dense dressing from cheap parts, measured QA.
- Trench Run: bloom and grade that make light feel like light, runner camera feel, fog layers.
- ai-town and Alicization: character readability from few frames, a map that reads as a place.

## Santi's own concept images outrank all of these
When a technique from a repo pulls the look away from `concept-art/` (for example Kyoto's warm
daylight), the concept images win: cold blue-grey haze, warm windows, yellow eyes, orange hero.
