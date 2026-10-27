# Next steps: what is left, as instructions

Written on 27 October 2026 by the Opus 5.5 DT agent, for Santi and for the next AI. How everything was built and how
to test it is in `HOW-IT-WAS-BUILT.md` in this folder. The working rules are in `README.md` in this folder.

## Where things stand

Live on https://sscleves.github.io/NachTrit/ : all 14 intro panels in 3D, the 3D card before every level, 13 towns
each with its own look, the diorama map, levels 1 to 130, the unlock link.

Waiting for Santi's merge: branch `dt/cast-final`, pull request link
https://github.com/SScleves/NachTrit/compare/main...dt/cast-final . It holds:

- the new cast: smooth bony dead in rags with near and far versions, passengers with coats, faces and hair;
- the title screen in 3D: the mills of Kinderdijk from intro shot 1 behind the title, the painting only as a fallback;
- a fix: starting with the Space key no longer skips intro panel 1;
- the GPU test tools in `qa/dt/`, the agent briefs in `briefs/`, `HOW-IT-WAS-BUILT.md` and this file.

Tested on top of the current `main`, laptop and phone sizes: 0 errors in `qa/dt/start3d.mjs`, `qa/dt/intro-all.mjs`,
`qa/dt/card-check.mjs` and `qa/run.mjs 1`.

## 1. Santi: merge and check (5 minutes)

1. Open https://github.com/SScleves/NachTrit/compare/main...dt/cast-final , create the pull request, merge it.
2. Wait 2 minutes for GitHub Pages, then open https://sscleves.github.io/NachTrit/ with Ctrl+F5 on the laptop, or in a
   private tab on the phone. Browsers keep old files for up to 10 minutes otherwise.
3. Expected: the title over a live 3D night scene with turning mills; Start plays the intro in 3D from the first
   panel; a level opens on a 3D card and rides.
4. Close pull requests #9 and #10 without merging. Their content is already in `main`.

## 2. Santi: tidy the branches (optional)

`dt/voice` holds a voice experiment that Santi found worse. Recommendation: drop it. The `dt/town-*`,
`dt/cine-shot-*`, `dt/level-cards`, `dt/towns-polish`, `dt/cine-more` and `dt/cast` branches are merged into `main`
through the combined branches and can go. Delete them on https://github.com/SScleves/NachTrit/branches , or:

```
cd NachTrit
git push origin --delete dt/voice
```

## 3. Next AI: first hour

1. Read `README.md` in this folder (rules), then `HOW-IT-WAS-BUILT.md`, then `BACKLOG.md`.
2. Set up and run the checks from `HOW-IT-WAS-BUILT.md` section 7. All must pass before you change anything.
3. Work on a new branch `dt/<topic>` from `main`. Never commit to `main`. Push the branch and give Santi the compare
   link `https://github.com/SScleves/NachTrit/compare/main...dt/<topic>` ; he merges.
4. Before handing over: the checks pass with 0 errors, you looked at the frames at laptop and phone sizes, and draw
   calls stay under about 600 on the Intel Iris Xe.

## 4. Recommended next task: stop old cached files mixing with new ones (small)

Right after a merge, a reload can get the new `index.html` with old cached shot or town files, and a panel then shows
its painting instead of its 3D shot. GitHub Pages cannot change its cache headers, so fix it in `index.html`: add a
version to every local script tag, for example `<script src="intro3d/shot-1.js?v=27"></script>`, and raise the number
in one place on every release. A simple way: one constant at the top of `index.html` and a small script that writes
the tags with `document.write` in the same order, or a check in `qa/` that fails when the numbers differ. Test with
`qa/dt/intro-all.mjs` and `qa/dt/start3d.mjs`.

## 5. Open items from `BACKLOG.md`

Done in this session: B1 (town identity), B2 (the cast, in `dt/cast-final`), B3 (intro paintings, then the 3D shots on
top), C1 (Nijmegen and Amsterdam, levels 115 to 130). A6 (neural voice) was tried on `dt/voice` and not kept.

Still open, in the order `BACKLOG.md` gives:

| Item | Branch | Note |
|---|---|---|
| A0 The first five minutes | `dt/first-five-minutes` | Points 1 (start screen), 3 (map) and 7 (passenger) are covered by this session's work. Check 2 against the live game. Points 4 (dense town card), 5 (mission card wall of words), 6 (nothing teaches the core move in the ride) and 8 (smaller things) are open. `FIRST-FIVE-MINUTES.md` has the fixes. |
| A1 The code split, with JSDoc types | `dt/split` | Do this before any other big engine task; `index.html` is the conflict hotspot. |
| A2 Writing mode | `dt/typing` | After A1. |
| A3 Gameplay between the forks | `dt/moves` | After A1. |
| A4 Save, vocabulary book, practice and trophy rides | `dt/save` | After A1. |
| A5 Town saved, ending, phone, release polish | `dt/ending` | After A3. |
| C2 A fourth audit for wrong distractors | `dt/audit-distractors` | Content only. |
| C3 More item kinds | `dt/content-kinds` | Content only. |
| C4 LEVELS.md and in-game help | `dt/docs` | |
| D1 Harness speed and GPU parity | `dt/harness` | The `qa/dt` scripts are a start: they already render on the GPU. |
| D2 Unit tests for the data layer | `dt/tests` | |
| D3 CI | `dt/ci` | |

## 6. Engine gaps the shot and town agents reported

Small additions to the cine framework and the town kit that would have made their work easier. Add them when a task
needs them, each with a line in `intro3d/README.md` or `towns3d/README.md`:

- `W.lamp(v)`: set his lamp during a shot.
- `W.ride(z, x, yaw)`: place and turn him, not only move him along the road.
- A moon on or off option in `paintSky`.
- A white lit layer for skyline bands (lit windows read better than tinted ones).
- Tram rails as a road kind.
- The distance from the eye in the town kit `K`, so far pieces can be simpler.

## 7. Rules that must not break

No exclamation marks anywhere. Netherlands Dutch. No new external assets, fonts or CDNs. Four lights only, never
added or removed at runtime. No per-frame allocations in `update()`. Draw calls under about 600. Never sample a render
target while rendering into it. Details and the reasons are in `README.md` in this folder, section 4.
