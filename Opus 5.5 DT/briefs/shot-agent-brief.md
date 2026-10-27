# Brief for a NachTrit intro shot agent

NachTrit is a browser game (Three.js, one inline module in index.html) owned by Santi. The intro is 14 captioned
panels. A panel can play as a cinematic shot staged in the game's own 3D world, in a letterbox with the captions in the
lower bar; panels 1, 2, 3, 4, 5, 8 and 14 already do. Santi noticed that jumping from a 3D panel to a pixel painting
feels wrong, so the remaining panels become 3D too. Your shots must match the existing ones in look and quality.

## Read first, in this order
1. intro3d/README.md: world coordinates, the W API (stage, speed, ride, cam, drift, face, add, hide, band, say,
   title, flash, seed), framing, rules, testing.
2. intro3d/shot-14.js (the reference), then one or two finished shots close to yours: shot-8.js (a warm café set
   built with the kit, people without auras), shot-2.js (a terrace and a tall dead woman), shot-1.js (a set built away
   from the road, the road world hidden).
3. The pixel painting of your panel, intro/panel-N.js: its header comment and its beat timing tell the joke. Keep its
   good jokes; the text and timing of the caption stay as they are.
4. Opus 5.5 DT/concept-art/README.md, then view at most these two images, once each: concept-art/D-foggy-village-with-zombies.png
   and C-concept-sheet.png. Never view more than two images in one step, and view contact sheets rather than single
   frames: large image requests make the model call fail.
5. index.html only for builders you use (grep `function ghostFigure(` and read only that function).

## Quality bar
- It must look like concept D: blue-grey haze, dark shapes, amber light; saturated colour only in lights, eyes, his
  orange coat and screens.
- Readable in its first two seconds: one clear subject per beat, framed at the look point. At most two beats. Slow,
  motivated camera moves; W.drift for life. The shot lasts as long as its caption needs (set `hold`), then keeps a
  slow drift if the panel stays up longer: never a frozen frame.
- Interiors are new for the intro: build rooms with the kit (walls, floor, a window onto the misty street with a lamp
  outside, furniture as simple merged shapes, a warm practical light faked with glow sprites and emissive materials).
  W.hide the road world if it is in the way (shot-1.js does this), or build the room where it looks out on the street.
- Check three sizes: 1280x800, 390x844 (upright phone: only the middle shows) and 844x390. Bubbles stay on screen.
- Under about 600 draw calls, 0 errors. Frame rate near 60 when the laptop is quiet (many agents share it now:
  report what you see, do not chase numbers under load).
- Critique your own frames honestly against concept D and the painting, fix the three weakest things, repeat twice.

## Rules
- No exclamation marks anywhere: captions, bubbles, signs, screens. Netherlands Dutch, never Flemish.
- No new external assets: no image files, fonts or libraries. The game's builders, the kit and canvas textures.
- Four lights only, the game's own; glow from emissive or additive materials. three.js r152: lights fade as
  (1 - d / distance) ^ decay, intensities from newer examples come out far too bright.
- Never dispose shared materials or geometries; your own canvas textures: mesh.userData.ownTex = true.
- W.stage({ seed }) for a set that is the same on every play.

## Test (tools in qa/dt; see qa/dt/README.md)
From the repo root, PowerShell 5.1 (no && or
||; chain with ;), $env:NODE_NO_WARNINGS='1':
- Stills: node qa/dt/shoot.mjs --gl gpu --browser chrome --base http://127.0.0.1:<port>/index.html --out qa\out\shots\shot<N>-v1 a05="cine=<N>&t=0.5" a25="cine=<N>&t=2.5" a50="cine=<N>&t=5" a80="cine=<N>&t=8"
  (cine=N&t=S stages shot N, steps it to S seconds and holds that frame; add --w 390 --h 844 or --w 844 --h 390 with
  a separate --out for the phones)
- Contact sheet: node qa/dt/grid.mjs qa\out\shots\shot<N>-v1 qa\out\shots\shot<N>-v1-grid.png 2 480 (view only the grid)
- Frame rate: node qa/dt/shoot.mjs --gl gpu --browser chrome --base http://127.0.0.1:<port>/index.html --out qa\out\shots\shot<N>-fps --fps 3000 live="cine=<N>"
- The whole intro around your panel, with errors and clean up checked: node qa/dt/intro-all.mjs http://127.0.0.1:<port>/index.html qa\out\shots\intro-all-<N> 1280 800 2.4

## Finish
- The repo is LF; convert before committing if your editor wrote CRLF:
  $p='<full path>'; $t=[IO.File]::ReadAllText($p) -replace "`r`n","`n"; [IO.File]::WriteAllText($p,$t,(New-Object System.Text.UTF8Encoding($false)))
- One commit per shot on your branch, touching only that shot's file. Do not push. Never change git config. Subject
  "Intro shot <N> in 3D: <what it shows>", a body of plain sentences, and these two trailer lines at the end:
  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Write the message to a file without a BOM and use git commit -F.
- Aim to be done in about two hours.
- Report: each shot beat by beat; absolute paths of the final grids (laptop and phones); draw calls, frame rate and
  errors; what you would still improve; framework changes you need. Plain writing, no dashes as punctuation.