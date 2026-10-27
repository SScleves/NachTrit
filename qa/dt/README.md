# qa/dt: frame and flow checks on the real GPU

Small Playwright scripts used while building the 3D intro and the towns. Run them from the repo root after
`npm ci` (Playwright is a dev dependency). They drive an installed Chrome (`--browser chrome`) with
`--use-angle=d3d11 --ignore-gpu-blocklist`, so frames render on the laptop's own GPU (Intel Iris Xe here), not on
software GL. Output goes to `qa/out/` (git ignores it).

Serve a working tree first (binds 127.0.0.1, no caching, a large request queue so parallel runs do not get refused):

    py qa/dt/serve-local.py C:\path\to\worktree 8765

| Script | What it does | Example |
|---|---|---|
| `shoot.mjs` | One PNG per job with draw calls, triangles, programs, frame step time, luma and errors. `--fps 3000` also measures the frame rate. `--w`/`--h` for phone sizes. | `node qa/dt/shoot.mjs --gl gpu --browser chrome --base http://127.0.0.1:8765/index.html --out qa/out/towns L1="level=1&shot=7&lane=1" L91="level=91&shot=7&lane=1"` |
| `grid.mjs` | A labelled contact sheet of every PNG in a folder. | `node qa/dt/grid.mjs qa/out/towns qa/out/towns-grid.png 3 420` |
| `sheet.mjs` | Before and after side by side, with luma. | `node qa/dt/sheet.mjs qa/out/before qa/out/after qa/out/before-after.png` |
| `intro-all.mjs` | Plays the whole intro panel by panel (3D or painting), then a level; checks errors and that the game is clean after the shots. | `node qa/dt/intro-all.mjs http://127.0.0.1:8765/index.html qa/out/intro-all 1280 800 2.4` |
| `cine-flow.mjs` | Panel 13, shot 14, the map and level 1 at three screen sizes. | `node qa/dt/cine-flow.mjs http://127.0.0.1:8765/index.html qa/out/cine-flow` |
| `unlock-check.mjs` | `?unlock=1` and `?unlock=0`, then rides a level in the given towns. | `node qa/dt/unlock-check.mjs http://127.0.0.1:8765/index.html nijmegen,amsterdam` |
| `mission-fit.mjs` | Whether the mission card's Ride button is on screen for the given levels. | `node qa/dt/mission-fit.mjs http://127.0.0.1:8765/index.html 390 844 1,115,130 qa/out/mission` |
| `card-check.mjs` | Opens levels from the map, checks their cards play in 3D, then that the ride starts clean. | `node qa/dt/card-check.mjs http://127.0.0.1:8765/index.html qa/out/cards 1,75,129` |
| `start3d.mjs` | The title screen in 3D, Start into intro panel 1, the map, a ride and the replay link, with errors. | `node qa/dt/start3d.mjs http://127.0.0.1:8765/index.html qa/out/start3d 390 844` |

Useful page parameters: `?level=<id>&shot=<seconds>&lane=1` (ride and hold a frame), `?town=<id>&theme=<key>`
(dress any level as a town and theme), `&hillphase=<metres>` (hills), `?cine=<panel>` (play the intro from a panel),
`?cine=<panel>&t=<seconds>` (hold a 3D shot), `?map=<town>`, `?unlock=1`.

In PowerShell 5.1 there is no `&&`; chain with `;` and set `$env:NODE_NO_WARNINGS='1'` to keep the output short.
