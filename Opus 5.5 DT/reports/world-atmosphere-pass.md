# Agent reports from the laptop run (wf_17b29a98-d60)

## agent

**changed**

Committed on branch world as 613cedb. Only /home/santi/dutch-arcade-wt/world/index.html changed (+161/-40). There are still exactly four lights, and the ribbons, ROAD_LOOK, buildPost/render structure, NR* hooks, TUNE and gameplay values are untouched.

1. Palette and fog. Each theme in THEMES now has a horizon haze colour (fog), a start density (fogD), a night factor (night), a water colour, and stars on polder only. Example haze colours: street 0x4b555f, nightshop 0x3c4552 (darker, the night theme). The fog colour is the same Color object as scene.background and equals the sky dome's horizon, so far things dissolve into the sky. Density is fogD*(1.28-0.4*Lf) + forkZoom*0.002 + 0.004*nightDepth. At the start that is about 0.016, which puts roughly 70% fog at 70 m and about 5% at 15 m. nightDepth() now lowers: the haze and sky (towards theme.night, about 0.17 linear), hemiLight from 0.6 to 0.2, and the town's light decals by 45%. The wisps keep full strength, so they matter more late in a level. On death the haze fades to dark. Lights: hemisphere 0x6c7888 above / 0x221e2c below; moon 0xa4b4cc at 0.32, moved to sit at the painted moon (ahead-left), so facades facing the road read as backlit silhouettes and the wet road catches a specular sheen; player lamp warmed to 0xf2ead6.

2. Sky. A back-side sphere (radius 300, top 104 degrees) with fog false and depthWrite false. onBeforeRender keeps it centred on the camera, so update() allocates nothing for it. It uses a 2048x1024 canvas texture repainted per theme by paintSky(): the haze colour at the horizon, slightly bluer at 10-20 degrees, darker slate overhead, a small veiled moon in a soft halo, 16 soft cloud bands, and faint stars on polder only.

3. Lamp light. Light-like things use GlowMat: additive, depthWrite false, with a patched fog chunk so fog dims them toward black instead of washing them into the haze (keeps 15%). All of these share geometry and materials. lamppost() gets a warm flattened head (PM.lampHead, fog false), a shared halo sprite, and a soft cone sprite hanging from the head (painted soft-edged texture; a cone mesh had hard edges). The existing pool and streak decals moved to warm GlowMat. Lit windows in house() get a merged additive halo on the brick, plus a long reflection streak on the pavement below for the lower two rows. Shops get a large one. All of this uses one atlas material (WIN_GLOW_MAT), so it adds one draw call per house. Window panes are a warmer amber, and the white frames are dimmed to 0x5e5c58 because, unlit, they bloomed.

4. Wisps. A golden core (G.wisp radius 0.09 to 0.13, colour 0xffe08a), a shared pulsing additive halo sprite (scale about 1.85), and a golden reflection streak kept on the road surface in update(). Five wisps now read as a trail of light. Gameplay values are unchanged. Shared materials carry userData.shared, and the object cleanup and warmUp dispose now skip them (otherwise shared textures and programs would be disposed and recompiled mid-ride).

5. Grade and toon shadows. Post pipeline changes are limited to the gradePass fragment maths and the bloom numbers. Bloom (strength, radius, threshold) went from 0.32/0.6/0.82 to 0.55/0.5/0.8. Grade: blacks lift to navy (+0.028, 0.036, 0.056 in the darks), split tone with cool shadows (0.93, 0.98, 1.07) and warm highlights (1.08, 1.0, 0.88), contrast 1.05 around 0.3, vignette floor 0.45 to 0.7, grain 0.05 to 0.035. The danger red is unchanged. No render targets, pass order or sampling changed. Mat() now patches lights_toon_pars_fragment the Kyoto way: the toon bands from the moon and lamp lean toward a cool violet (0x5d5f8e). brickMat, brickMat2 and M.wood use a warmer tint (0x7a5a64).

6. Wet road. ROAD_LOOK has no colour or roughness to change, so the ribbon is left alone. The wet look comes from the lamp, window and wisp streaks, the moon specular sheen and the grade. The wieven mist became faint, wide, low banks in the haze colour.

**perf**

Draw calls are counted per full frame (scene plus post passes, renderer.info.autoReset off for one NRstep), because NRinfo().calls only shows the last composer pass (always 1).

| Level | Before (start / late) | After (start / late) |
|---|---|---|
| L1 | 431 / 434 | 503 / 494 |
| L3 | 337 / 331 | 357 / 362 |
| L12 | 469 / 495 | 464 / 508 |
| L58 | 358 / 394 | 403 / 390 |
| L59 | 459 / 482 | 526 / 505 |
| L67 | 461 / 449 | 495 / 496 |

That is about +5 to 15%, well under the 2x budget. The extra calls are one per house (window glow) and one per lamppost (cone sprite); lamp halos and window decals are merged or shared, and there are no new lights.

New shader programs: one cool and one warm toon variant, and one glowFog variant each for MeshBasic and Sprite. warmUp compiles them with the scene.

There are no per-frame allocations in update(); it only does Color.copy, multiplyScalar, setScalar and opacity writes.

Harness:
- NR_URL=http://localhost:8770/index.html node qa/run.mjs 1 reported errors: 0 (frames in /home/santi/dutch-arcade-wt/world/qa/out/2026-10-23T19-26-49).
- But it never rode. Level 1 now opens with two typed intro panels (a town rumour plus the intro), and the harness only presses Space twice, so it sat on the panel for its 10-minute cap. Level 6 does the same (/home/santi/dutch-arcade-wt/world/qa/out/2026-10-23T19-37-26/L6-ride-start.png shows the panel). That run was still going when I stopped, so I have no level 6 result yet. The two previous level-1 runs on this branch, before my change, crashed the browser instead.
- I wrote a copy that keeps pressing Space until the intro closes (/tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/run-skipintro.mjs) but have not run it yet.
- The real 3D checks so far are my one-shot frames through ?shot=7&level=N (levels 1, 3, 12, 58, 59, 67). They reported 0 page errors on every pass.

Software-rendered fps is meaningless here (4 fps on the intro screen). The real 60 fps check has to happen on Santi's Intel GPU.

**before**

Frame luma before (PNG mean luma; NRbright in brackets): L1 38.2 (37), L3 24.7 (27), L12 42.7 (50), L58 26.0 (35), L59 39.8 (54), L67 42.9 (75). These are start frames. For late frames I only have NRbright: L1 39, L3 27, L12 41, L58 26, L59 37, L67 44. The before 'late' PNGs show depth 0, not the late state, because of a bug in my capture script, later fixed.

What it looked like: a black sky, far houses fading into near-black, flat orange windows, grey blob mist sprites, tiny grey wisps, and no lamp cones or atmospheric perspective. The reference D has mean luma 51.6.

Frames: /tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/before/ (L{1,3,12,58,59,67}-start.png).

**after**

Frame luma after (headless, from the last full measured pass; PNG mean luma, NRbright in brackets):

| Level | Start | Late (nightDepth 1, lamp 50) |
|---|---|---|
| L1 | 51.5 (55) | 47.6 (49) |
| L3 | 59.3 (63) | 41.8 (51) |
| L12 | 58.5 (68) | 50.9 (48) |
| L58 | 58.8 (62) | 36.0 (47) |
| L59 | 57.9 (63) | 39.1 (41) |
| L67 | 56.8 (67) | 44.4 (45) |

- Starts land in the 50 to 60 target.
- Late frames are clearly darker (36 to 51) and lanes, signs, obstacles and wisps stay readable. The brighter late frames sit next to a lamppost, or a reading board with the player's lamp on it.
- These numbers are from just before one last small push: the end-of-level ambient went from 0.24 to 0.2 and the town lights from 1-0.4·nightDepth to 1-0.45·nightDepth. That change is committed but not re-measured, so the committed late frames will be slightly darker than this table.
- The late target was 30 to 38 on Santi's GPU, and the brief says headless frames come out darker than his GPU. So on his laptop the late frames are probably still a little brighter than intended. If so, lower theme.night (about 0.17) or the 0.4 in hemiLight.intensity = 0.6 - 0.4*nd.

Colour match with D (horizon haze):
- Ours at the start is about (78, 86, 96) against D's (73, 81, 88). Upper sky is about (69, 82, 97) against (76, 88, 99).
- At night depth 1 the sky drops to about (30-44, 35-52, 49-64): a dark navy, never black.
- The near road is still bluer and brighter than D's (24, 26, 31). The road material is off-limits, so only lighting can carry it.

Contact sheets (each row: reference D | before | after):
- /tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/compare_start.png
- /tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/compare_late.png (the before column is not true late frames, see above)

Iteration sheets (D | ours): /tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/v6_sheet.png and v5_sheet.png in the same folder.

After frames: /tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/v7/

Notes for the next artists:
- The ink pass still draws dark outlines on fogged far objects. I was not allowed to touch it.
- Near brick colours come from TOWN_STYLE (props region) and some read a little mauve.

**commit**

613cedb on branch world (/home/santi/dutch-arcade-wt/world). Message ends with Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>