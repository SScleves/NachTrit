# Phase 0 on `dt/all`: the long checks, what they found, what changed (11 Nov 2026)

Branch `dt/all` (https://github.com/SScleves/NachTrit/tree/dt/all), worktree `/home/santi/dutch-arcade-wt/all`, NR_VERSION
35. Measured on the server (Intel UHD Graphics CML GT2 through headless Chrome, `--renderer webgl --power low`), with
`localhost:8775` serving the worktree. `main` was not touched.

## Summary

The long checks found one real game bug. On reading boards (read items: a whole sentence over the road, three long
English options), the bike crawled for 3 to 5 minutes unless the player pressed go. That came from two causes. Fixing
them also fixed the level 75 lamp. The fork signs now stay above the rider's head, the ground mist costs 17 fewer draw
calls, and the content brief has measured reading distances. I judge `dt/all` ready to go live once the laptop Claude
has checked it on Santi's Chrome (see "Ready to go live" at the end).

## 1. Reading time and the lamp

### What the checks showed first

`qa/dt/reading-time.mjs` on the committed branch passed: 0 forks under budget on 1, 75, 99 and 123. Under SwiftShader it
took 1 h 50 min. `qa/dt/lamp-balance.mjs` showed the open point was real: on level 75 the rider who collects wisps
**died in 3 of 4 runs** (13/20, 17/20, 18/20) and finished once with 50 left. On level 58 the result swung from 12 to
79 left.

A trace of every lamp gain and loss on level 75 (scratch scripts, numbers below) found the cause. One reading board
stayed armed for 273 to 283 s per ride, so a ride took 530 to 660 s against 150 s on `main`.

- **Cause 1, the approach.** Before the letters become legible, the fork controller set the speed from
  `room = min(-z, legD) - 4`. That is the legible stretch, but it was applied from `slowD` on, far outside it. With a
  reading board (legD 5.5 m, need 16 s) the bike crawled at 0.09 m/s from 24 m out.
- **Cause 2, the camera.** `speedNorm` comes from cruise speed, not from how fast the bike actually moves. At a fork
  the bike crawls, but the camera stayed pulled back as if at full speed: 6.6 m behind, fov 92. `legDist` plans with
  a camera about 5.3 m back at fov 87. At the stop point, the letters on a reading board only passed the threshold
  while the rider looked back (the reaction shot dollies the camera in). The measure flickered, and the old code
  waited minutes to collect enough legible frames.

### What I changed (index.html)

- Outside reading range, the bike closes half the remaining gap per second (`far * 0.5`), then reads at the planned
  pace.
- Inside reading range, the wait ends after `budget x 1.6 + 2` s whatever the measure does (`gate.inT`).
- The chase camera's pull-back for speed fades with the fork zoom (`sf = sn * (1 - fz)` for distance and fov). The
  height keeps its speed term. `legDist` models the same camera at full speed. Cruise framing does not change.
- Lamp: while a fork is armed, the drain scales with speed against cruise (`readK = S.slow / 0.85`, was
  `S.slow / forkSlow`). Slowing to read is cheap. `TUNE.drain` goes from 2.5 to 2.8. HANDOVER section 6 is updated.
- I did not shorten the filler after long sentences. The road on level 75 is no longer than on `main` (about 2,000
  m for both); the time was the problem.

### Measured after

Reading time (`node qa/dt/reading-time.mjs http://localhost:8775/index.html 1,75,99,123 --gpu`): **0 forks under budget,
0 errors**, minimum margin 0.7 s. Reading boards now read from 7.5 m instead of 5.5 m. Planned against measured
legible distance over 102 forks: measured minus planned, mean +0.5 m, worst -0.3 m (before: mean -1.7 m, worst -3.8 m).
Every fork now finishes within its bounded wait.

Lamp balance (`node qa/dt/lamp-balance.mjs <url> 1,11,58,75 collect,ignore --gpu`), lamp left at the end:

| Level | collect, before | collect, after | ignore, before | ignore, after |
|---|---|---|---|---|
| 1 | 53, 57, 66, 72, 73 | 97, 97 | 25 | 70, 90 |
| 11 | 42, 56, 63, 78 | 92, 61 | dies 15/20 | dies 18/20; finishes 2, 3, 3, 22, 41 |
| 58 | 12, 20, 40, 79 | 60, 58 | dies 14/20 | dies 17/20, 18/20 |
| 75 | 50; dies 13, 17, 18/20 | 73, 51 | dies 12/20 | dies 17/20 twice |

On `main` for reference (same trace, level 75 collect, 3 runs): 19, 31 and 63 left, rides of 150 s.

A rider who collects wisps now finishes everywhere with a clear margin. A rider who ignores them dies on 58 and 75.
**On 11 the ignore runs mostly barely finish**: 1 death, then 2, 3, 3, 22 and 41 left. The spread is wide. Level 1
stays forgiving.

## 2. CONTENT-BRIEF reading distances

`CONTENT-BRIEF.md` ("Word limits are reading limits") now has a table measured over every fork option in the content
with the new `qa/dt/sign-reach.mjs`. It uses the game's own sign fitting through a new debug hook `window.NRread`.

- Tiers 2 to 13: 1 to 4 words read from 13.5 to 14 m, 5 words from 11.5 m, 6 from 8.5 m, 7 to 9 from 7.5 m.
- Tier 1: 17 to 20.5 m.
- Reading boards: about 7.5 m.

The old text said 10 to 15 m and 4 to 8 m. The ridden check agrees with these predictions to within a metre. Fonts
differ per system (Segoe UI on Windows, a fallback here), so the numbers can shift a little on the laptop.

## 3. Signs hidden by the rider

I shot a fork 9 m ahead in each lane on levels 1, 75 and 123 (`gpu-shot --shot 8 --extra 'gate=9&lane=N'`).

- `/home/santi/dutch-arcade-wt/all/qa/out/phase0/signs-before.png`: before.
- `/home/santi/dutch-arcade-wt/all/qa/out/phase0/signs-after.png`: after.
- `/home/santi/dutch-arcade-wt/all/qa/out/phase0/signs-mid-crop.png`: middle-lane crops, before on the left.

Before, in the middle lane his head sat on the sign row (L75 "de keuken"). On L123 the look-back reaction shot put him
and his passenger over the middle sign ("het" hidden). Changes:

- Fork boards are 0.3 m higher (2.0 m, tall boards 2.3 m). The post still meets the board, and the teach halo follows
  the board.
- The camera drops less at a fork (`fz * 0.6` instead of `fz * 0.9`).
- No reaction-shot dolly while a fork is armed.

After, the whole sign row is above his head in every lane on all three levels. Props did not block any sign in these
frames. Level 1 has two lanes, so its `lane=2` frame is a harness artifact: the camera points at an undefined lane.
Players cannot get there.

## 4. Gouda (level 12) draw calls

I sampled the frame every 0.5 s over two whole rides, as a returning player with taught set:

| | median | peak | frames over 600 |
|---|---|---|---|
| before | 568, 577 | 627, 637 | 35, 40 |
| after | 555, 562 | 598, 602 | 0, 2 |

`qa/dt/calls-probe.mjs` lists where a frame's calls go. The most repeated item was sprites: about 21 wisp glows, 20
lamp halos and 21 ground-mist banks, one call each. I merged the mist into one mesh per band (3 calls instead of 20).
The 20 sprites stay as the banks' handles, so the intro shots that hide single banks by position keep working. They sit
on a layer the camera does not draw, and `mistSync()` writes camera-facing quads from their position, scale and
visibility before every render. It allocates nothing, and the material is a plain `MeshBasicMaterial`, so the WebGPU
path is unaffected. A side-by-side frame shows no visible change
(`/home/santi/dutch-arcade-wt/all/qa/out/phase0/gouda-mist-compare.png`).

The single held frame of `gpu-shot` still varies a lot between loads (575, 583, 597 before; 569, 582, 608, 617 after).
It is always a first-ride frame, because gpu-shot does not set `nachtrit.taught`, so it carries the teaching forks'
road arrows and halos. Which forks and fences are on screen is random too. Ride samples are the better measure.

## 5. End-of-phase checklist

- `node qa/validate-content.mjs`: 0 errors, 0 warnings.
- `gpu-shot` on 1, 12, 58, 75, 123 (`/home/santi/dutch-arcade-wt/all/qa/out/phase0/final-levels.png`): **0 errors** on
  all five.

  | Level | draw calls | fps over 10 s |
  |---|---|---|
  | 1 | 501 | 59.5 |
  | 12 | 582 | 59.7 |
  | 58 | 328 | 60.0 |
  | 75 | 483 | 60.1 |
  | 123 | 499 | 60.2 |

  After the version bump: L1 528 calls and L12 561, 0 errors.
- All 14 intro shots at t=2 and t=6 on the GPU, 28 frames, **0 errors**. Contact sheet:
  `/home/santi/dutch-arcade-wt/all/qa/out/phase0/intro-sheet.png`, with halves `intro-sheet-1-7.png` and
  `intro-sheet-8-14.png` next to it. I looked at every frame:
  - The riding dogs appear only in 8 and 14. Shots 9 and 10 have their own sofa and table dogs, which are part of
    those shots.
  - Shot 9 shows his torso on the sofa.
  - The 03:00 clock is readable in shot 6 at t=2. At t=6 the camera has moved to the street.
  - Nothing is clipped or merged.
- `node qa/check-versions.mjs --bump`: NR_VERSION 34 to 35, 60 local scripts.
- New tools: `qa/dt/sign-reach.mjs`, `qa/dt/calls-probe.mjs`, and `--gpu` on `lamp-balance.mjs` and
  `reading-time.mjs`. With `--gpu` these take about 1 minute instead of 2 hours, and give the same results within run
  noise.

## Open

- Level 11, ignoring wisps: mostly finishes with very little left, once with 41. If Santi wants it to bite, lower
  lampDecay for Kinderdijk a little (it is below the cap, so the 2.8 drain does not reach it fully).
- The single held `gpu-shot` frame of Gouda can still show 600 to 617 calls on a first-ride load (teaching arrows).
  Next cheap trims if needed: the 6 teaching arrows per fork as one mesh, the two halo sprites per lamp post.
- The WebGPU path was not run (parked by the plan). The mist merge uses only standard materials.
- Phase 0 step 1 (Santi's word) and step 6 (merge, tag `v0.2-combined`) are for the laptop Claude.

## What Santi should try (http://localhost:8775/index.html, or the live site after the merge)

1. Level 75: ride without the up key. At the reading boards (a whole sentence over the road) the bike now slows, holds
   about 10 to 20 s while the letters are big, then rides on. It no longer creeps for minutes. Then ride it again
   collecting wisps: it should end with about half a lamp.
2. Any fork in the middle lane, levels 75 and 123: the three signs sit above his head; a passenger looking back no
   longer covers the middle one.
3. Level 12, Gouda: the ground mist should look as before.
