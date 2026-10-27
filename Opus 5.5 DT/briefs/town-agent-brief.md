# Brief for a NachTrit town agent

NachTrit is a browser game (Three.js, one inline module in index.html) owned by Santi. A man cycles home at night
through a misty Netherlands where the dead have forgotten Dutch; each town is a chapter of levels. Santi's verdict on
the current game: "the cities look almost identical, that is not the plan". Today every town rides the same seven
streets and differs only in brick colour, shop names and one landmark far off in the fog. Your job: make your towns
unmistakable, at a glance, in every one of their levels, from the land, the route, the sky, the light, the buildings,
the skyline and the people, following the research.

## Read first, in this order
1. towns3d/README.md: the town file API (themes, sky, light, road, dead, lamp, landmark, skyline, extra), the world
   coordinates, the kit, the rules and the test URLs.
2. Opus 5.5 DT/TOWNS-IDENTITY.md: your towns' sections and the build summary table at the end.
3. The research file for your towns in Opus 5.5 DT/research/ (long: grep it, read your sections).
4. Opus 5.5 DT/concept-art/README.md, then view at most these two images, once each: concept-art/A-foggy-village.png
   (the colour key) and D-foggy-village-with-zombies.png (the frame the 3D world is judged against).
5. index.html only for the builders you use (grep `function house(` and read only that function), THEMES (grep
   `const THEMES = {`), and the shared theme your levels use.
Never view more than two images in one step, and view contact sheets rather than single frames: large image requests
make the model call fail.

## What you own
Only the town files named below, in your worktree. Do not edit index.html or any other file. If the engine needs a
change, work around it if you can and describe the change in your report.

## What to build, per town
- Every theme your town's levels use (listed below) gets the town's own version through `themes`. A level must look
  like that town from its first seconds: the route and the land (a dike, a dam, a quay, a canal on two levels, a hill),
  what lines the road, the far skyline, the sky and the light.
- The town's one unmistakable thing (TOWNS-IDENTITY.md, last table) must be visible early and often in its levels,
  near the road, not only as a speck in the fog.
- The dead in local dress: a `dead.pool` with your own variants (`dress` builders on the shared body), names unique to
  the town. Keep the shared silhouette (tall, thin, hunched, long arms, glowing yellow eyes).
- The street light colour, the lamp model, the road surface and the shop signs where the research gives them.
- The skyline bands: the town's own silhouette on the horizon (painted, so free in draw calls).

## Tricks the engine already supports
- Something that turns (a lighthouse beam, rotor blades, mill sails): put the turning part in a child Group and set
  `mesh.userData.blades = thatGroup` and `mesh.userData.spin = radians per second` on the scenery object you return;
  the game turns `blades.rotation.z` every frame. For a turn about the vertical, nest the part in a parent rotated
  `rotation.x = -Math.PI / 2` so its local z is the world's up.
- Open water on both sides of a dam or a dike: the ground plane is 400 by 400 at `groundY`; a dark `ground` colour at
  a low `groundY` (about -1.2) reads as black water on both sides, with the canal ribbon for reflections on one.
- Glow without lights: `K.GlowMat(K.glowTex, color, opacity, true)` on a Sprite is a soft halo; many small glows
  merged through the kit with `KG.plane` and an additive glow material are one draw call.
- Hills: `hills: { amp, len }` in a theme (README). Never on a theme with a canal.

## Rules
- No exclamation marks anywhere. Netherlands Dutch on signs, never Flemish.
- No new external assets: no image files, fonts or libraries.
- Four lights only, the game's own; glow from emissive or additive materials.
- Keep the road playable: nothing on the road surface (x between -4.4 and 4.4) except what the game spawns; nothing
  over the road lower than 5.5 m; the lanes and the fork signs must stay readable.
- Draw calls: no level of your town may go more than 5 percent over its own count before your change; aim to stay at
  or under it. Merge with the kit. Frame step under 16 ms when the laptop is quiet (other agents share it now, so
  report what you see and do not chase numbers under load).
- Never dispose shared materials or geometries; see the README for canvas textures.

## How to test (tools in qa/dt; see qa/dt/README.md)
From the repo root, in PowerShell 5.1
(no && or ||; chain with ;), with $env:NODE_NO_WARNINGS='1':
- Before you change anything, shoot every level of your towns as the before set:
  node qa/dt/shoot.mjs --gl gpu --browser chrome --base http://127.0.0.1:<port>/index.html --out qa\out\shots\<town>-before L<id>="level=<id>&shot=7&lane=1" ...
  (one job per level id; the tool prints draw calls, triangles, luma and errors per frame).
- After: the same jobs into qa\out\shots\<town>-after, then
  node qa/dt/grid.mjs qa\out\shots\<town>-after qa\out\shots\<town>-after-grid.png 3 420
  and the same for the before folder; compare the two grids.
- Any theme as your town: level=1&town=<id>&theme=<key>&shot=7&lane=1. Hills: add &hillphase=<metres>.
- Phones: one representative level with --w 390 --h 844 and --w 844 --h 390 into separate folders.
- Frame rate while riding: node qa/dt/shoot.mjs ... --fps 3000 live="level=<id>&shot=4&lane=1"
- The game's own harness: in your worktree, $env:NR_URL='http://127.0.0.1:<port>/index.html'; $env:NR_CHANNEL='chrome';
  node qa/run.mjs <one level id of yours>   (software rendering, slow; it must report errors: 0).
- Critique your after grids honestly against concept D and against the research: can someone name the town from one
  frame? Fix the three weakest things and repeat, at least twice.

## Finish
- The repo is LF; if your editor wrote CRLF, convert before committing:
  $p='<full path>'; $t=[IO.File]::ReadAllText($p) -replace "`r`n","`n"; [IO.File]::WriteAllText($p,$t,(New-Object System.Text.UTF8Encoding($false)))
- One commit per town on your branch, touching only that town's file. Do not push. Never change git config (the
  repo-local identity is set). Subject "Town <Name>: <what makes it itself now>", a body of plain sentences, and these
  two trailer lines at the end:
  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Write the message to a file without a BOM and use git commit -F.
- Aim to be done in about two and a half hours.
- Report, per town: what each theme now shows; the one unmistakable thing and where it appears; the absolute paths of
  the before and after grids and the phone frames; draw calls before and after per level; frame rate; errors; what you
  would still improve; engine changes you need. Write plainly, no dashes as punctuation.