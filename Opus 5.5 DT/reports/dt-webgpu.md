# dt/webgpu: three 0.187.0, WebGPURenderer, node materials, TSL post chain

Branch `dt/webgpu` (from main dd97c69), not merged. Worktree `/home/santi/dutch-arcade-wt/webgpu`.
GitHub: https://github.com/SScleves/NachTrit/tree/dt/webgpu

## Short version

- three goes from 0.152.2 to **0.187.0** (newest on npm, released 30 Oct 2026; core, `three/webgpu`, `three/tsl` and addons all pinned in the import map, jsdelivr).
- Where the browser has a real WebGPU adapter, the game now runs **WebGPURenderer** with node materials and a TSL post chain. Without one (or with only a software adapter) it falls back to WebGL2 through the **old WebGLRenderer path**, which is the live look, now on 0.187.
- URL switches: `?renderer=webgl` forces the old path, `?renderer=webgpu` the node path, `?renderer=webgl2` the node path on WebGPURenderer's own WebGL2 backend. `?msaa=0`, `?hdr=1`, `?fx=-ink,-mist,-bloom,-wet`, `?gpu=low`, `?night=0..1` are for measuring.
- The look on the node path is close to main, a little cooler and greyer, with anti-aliasing, a ground mist and wet streaks under what glows. It is not yet the jump to concept D; see "honest comparison".
- On this machine's Intel UHD (CML GT2, weaker than Santi's Iris Xe) the node path costs about 15 to 20 percent more GPU time than the old path. Check this on the laptop before merging.

## Version choice

`npm view three` on 11 Nov 2026: latest 0.187.0 (30 Oct). Checked that `build/three.module.js`, `build/three.webgpu.js`, `build/three.tsl.js`, `examples/jsm/postprocessing/*` and `examples/jsm/tsl/display/BloomNode.js` all answer 200 on jsdelivr at that version.

## What changed

### Step 1: the upgrade, old renderer (commit c6ee803)
- **Light units.** r155 made lights physical and r165 removed the legacy mode. Every intensity in the game, the towns and the 14 intro shots was tuned in legacy units: a factor PI on direct, hemisphere and ambient light, and spot lights that fade linearly to zero at their distance. The WebGL path patches those two things back into `ShaderChunk.lights_pars_begin` once at start, so every number keeps its meaning. No intensity was retuned.
- **Ink lines were gone.** `ShaderPass` clones its uniforms, and r187 will not clone a render target's texture (it leaves null), so the ink pass had no depth. The depth texture is now set after construction.
- **Bloom too strong.** UnrealBloomPass's blur kernels doubled since r152: strength 0.55 to 0.42, radius 0.5 to 0.3.
- `THREE.Clock` is deprecated: replaced with a three-line delta clock.
- Colour management needed no change: 0.152 already used `colorSpace` and the sRGB output.

### Step 2: the node path (commits cffd2a7, 8c0f650)
- `three/webgpu` loaded by dynamic import, `await renderer.init()`. The four lights, the road ribbons and `update()` are unchanged. Draw calls are the same as before (about 440 to 560).
- **Legacy light units on the node path too**: subclasses of SpotLightNode, DirectionalLightNode and HemisphereLightNode registered with `Light.registerNode` (PI factor, linear spot fall-off).
- **Mat()** is a `CelMaterial`: MeshToonNodeMaterial with its own lighting model, the same four-band ramp and the cool/warm shadow tint (the Kyoto trick), as before.
- **Every GLSL patch has a node twin** (`NODEFX`, given to the towns as `W.NODE`): glowFog (glows dim toward black in the haze), dampen (walls darker at their foot), Amsterdam's dimFog and thinFog, the Nijmegen and Maastricht hill steps (houses lifted slot by slot in the vertex stage), the Oversteek lamp march.
- **Points**: WebGPU draws point primitives one pixel wide, so Amsterdam's bridge bulbs and the dust in intro shot 10 become one instanced sprite draw each, same size, map, colours and fog.
- **Post chain in TSL** (one RenderPipeline; every step reads finished pass textures, nothing samples a target being drawn):
  1. scene pass, 4x MSAA (the old post path had no anti-aliasing at all), 8-bit target like the old sceneRT;
  2. ink lines from depth (the same edge rule as the old ink pass);
  3. ground mist: world height rebuilt from depth, haze colour thickest low and far, not on the sky;
  4. bloom (TSL BloomNode, quarter resolution, threshold 0.78) on the lamp, windows and wisps;
  5. wet road: what glows runs down the ground below it as soft streaks (eight taps of the bloom texture, ground pixels only);
  6. the old grade (gamma, navy-lifted blacks, split tone, vignette, danger red, grain) plus a palette step toward the concept art: colours lean toward the haze grey except warm lit ones (windows, lamps, the orange jacket, the eyes), which keep their saturation.
- **Speed guard**: a slow machine drops MSAA first, then the resolution, as before. The first 150 ride frames (pipeline compiles) no longer count toward lowering the resolution.
- WebGPU device loss reloads in the lighter mode, like a lost WebGL context.
- `NRbackend()` reports `webgpu`, `webgl2 (WebGPURenderer fallback)` or `webgl2 (WebGLRenderer)` and the adapter. `NRinfo()` works on both paths and also reports `msaa`.

**Why the fallback is the old renderer**: on the Intel UHD, WebGPURenderer's own WebGL2 backend ran at 26 to 31 fps where the old path ran at 49 under the same load. It is still reachable with `?renderer=webgl2`.

### Step 3: real GPU from Node (`qa/dt/gpu-shot.mjs`)
`/usr/bin/google-chrome` (156.0.8078.73) through Playwright. On this Linux machine (Intel UHD CML GT2 + NVIDIA Quadro T2000):
- `--headless=new --use-angle=vulkan --enable-features=Vulkan`: **no WebGL and no WebGPU adapter**.
- `--headless=new --use-angle=vulkan` with DefaultANGLEVulkan: WebGL on the NVIDIA through Vulkan, no WebGPU adapter.
- `--headless=new --use-gl=angle --use-angle=gl --enable-unsafe-webgpu --enable-features=Vulkan`: **both work**. WebGL on the Intel (ANGLE over OpenGL 4.6) and WebGPU on the Intel (gen-9) with `powerPreference: low-power`, or on the NVIDIA (turing) with high-performance. The script uses this and `?gpu=low` by default, so both paths run on the Intel iGPU, the closest thing here to Santi's Iris Xe.
- Headed mode (`--mode headed`, window off screen) is there but was not needed.

It reports backend, adapter, draw calls, triangles, luma, fps over a 10 s ride (`--secs`), and saves `L<n>.png` and `L<n>-after-ride.png`. `--pages` shoots other screens (intro shots, map, title) with their errors. `--uncap 1` lifts the 60 fps cap, `--lockdpr 1` stops the game lowering its resolution, `--swift` runs SwiftShader.

```
node qa/dt/gpu-shot.mjs --levels 1,41,75                      # node path (WebGPU)
node qa/dt/gpu-shot.mjs --renderer webgl --levels 1,41,75     # old path
node qa/dt/gpu-shot.mjs --levels "" --pages "title=;map=map=1;cine10=cine=10&t=2.5"
```

## Measurements (Intel UHD CML GT2, 1280x800, DPR 1)

The machine was under heavy load the whole time from another agent's SwiftShader job (load average 9 to 18). Treat absolute fps as a floor. Only compare numbers taken one after another.

| | draw calls | ride fps (10 s, capped at 60) | uncapped fps, L41, DPR locked |
|---|---|---|---|
| main 0.152.2 WebGLRenderer, low load | L1 521, L41 511, L75 456 | 60 / 60 / 60 | - |
| 0.187 `?renderer=webgl`, final, under load | 565 / 512 / 465 | 52 / 52 / 57 | 64.6 |
| 0.187 node path WebGPU, final, under load | 529 / 532 / 463 (L125 465) | 47 / 45 / 46 (L125 48) | 53 without MSAA, 39 to 45 with 4x MSAA |
| node path on WebGL2 backend (`?renderer=webgl2`) | 530 | 23 (4 s) | - |

At low load (09:4x), DPR locked, the node path rode L41 at 58 to 60 fps with every stage on or off. CPU time per frame (`step`) is much lower on WebGPU: 0.5 to 1 ms against 12 to 25 ms on the WebGL path.

**Luma** (`NRbright`, start of level, target 50 to 60, concept D 52, A 64):

| | L1 | L41 | L75 |
|---|---|---|---|
| main | 74 | 63 | 61 |
| `?renderer=webgl` | 73 | 69 | 64 |
| node path | 62 | 59 | 71 |

Scenery is random per run, so a few points either way is noise. The node path's start town sits in the target band where main did not. Deep night (`?night=0.95`): node path L1 55, L75 58; old path L1 58, L75 56. **Both are well above the 30 to 38 target.** That is not new (the two paths agree), but someone should check how nightDepth dims a held shot against a real ride.

## Frames

All under `/home/santi/dutch-arcade-wt/webgpu/qa/out/gpu-shot/` (git-ignored, so on the laptop's worktree only):
- `final-sheet.png`: main 0.152.2 | 0.187 `?renderer=webgl` | 0.187 node path, for L1, L41, L75, with concepts D and A underneath.
- `main-0152/` (main served from a `git archive` export), `final-webgl/`, `final-webgpu/` (with L125 Amsterdam), `night-webgpu/`, `night-webgl/`, `final-pages/cine10.png`, `s2-pages/` (title, map, intro shots 2, 4, 6, 9, 11, 13, Amsterdam card), `s2-fallback/` (WebGL2 backend).
- Level 40 is a "soon" placeholder with no items, which is why it never makes a shot (main does the same). Level 41 stands in for it.

## Honest comparison with main and the concept art

Better:
- **Anti-aliasing.** Roof lines, poles and wheels are smooth. The old post path had none.
- The palette is cooler and greyer, closer to D and A. Windows, lamps and the jacket stay warm against it.
- A ground mist lies in the street and over the far ground, so far ground fades to haze as in A.
- Start-of-level luma is in the target band.
- CPU time per frame dropped about twenty-fold. On a laptop that is CPU-bound in Chrome, that matters.

Same:
- Draw calls, lights, geometry, the ink style, the bloom amount.

Worse or not there yet:
- **GPU cost.** On this UHD the node path is about 15 to 20 percent heavier than the old path without MSAA, and about 35 percent heavier with MSAA. The speed guard drops MSAA first. Santi's Iris Xe should have headroom, but it is unmeasured.
- The wet-road streaks are subtle. D's long lamp reflections on wet tarmac are not there, because the street lamps are mostly out of reach of eight screen-space taps.
- No visible light cones under the street lamps (D has them). That is geometry or additive-mesh work, not post.
- The concept's dark near foreground and silhouetted far skyline need scene work. The grade cannot make them.
- Deep night is far too bright on both paths (above).

## Open issues

1. Amsterdam: the mirrored bridge bulbs' depth trick (so the quay hides them like a real reflection) is WebGL only. On the node path the mirrored bulbs are dimmed but not occluded.
2. Amsterdam logs `THREE.AttributeNode: Vertex attribute "uv" not found on geometry` twice: a mapped material on a geometry without uv. It renders, but the warning should be tracked down.
3. `qa/run.mjs 75` needs a rerun on a quiet machine (see Harness and checks). `qa/run.mjs` (Playwright Chromium, SwiftShader) has no WebGPU adapter, so it now exercises the WebGL fallback path, not the node path. The node path is checked with `gpu-shot.mjs` on the real GPU. On SwiftShader the node path runs at about 1 fps.
4. Deep-night luma is above target (above).
5. The fps numbers here were taken under another agent's CPU load. They need repeating on an idle machine and on the Iris Xe.

## Harness and checks
- `node qa/validate-content.mjs`: 0 errors, 0 warnings.
- `node qa/check-versions.mjs --bump`: NR_VERSION 29 to 30.
- `NR_URL=http://localhost:8773/index.html node qa/run.mjs 1`: errors 0 (WebGL fallback path, SwiftShader at about 1 fps under load).
- `node qa/run.mjs 75`: **not clean**. It failed three times on its first screenshot (the map, a 30 s Playwright timeout) while another agent's SwiftShader job kept the load average at 16 to 25. No page errors were logged. Control runs under the same load:
  - main passed `run.mjs 75` once (errors 0);
  - title and map screenshots timed directly (`go.mjs`): main 12 s / 35 s, this branch 26 s / 40 s.

  At that load main's map screenshot also goes past the 30 s limit. Even so, the WebGL path on 0.187 is **slower than main under SwiftShader**, by roughly 1.2x on the map and 2x on the title screen. It ran within a few percent of main on the real Intel GPU. Rerun `NR_URL=http://localhost:8773/index.html node qa/run.mjs 75` on a quiet machine before merging.

## What Santi should look at in his own Chrome
1. Open the branch build and run `await NRbackend()` in the console: it should say `webgpu` and his Intel adapter. If it says WebGL, his Chrome has no WebGPU on Linux, and he is seeing the old path (`chrome://gpu` shows the WebGPU status).
2. Ride Rotterdam and a busy town (Amsterdam 125) for a minute and watch for stutter. Run `NRinfo()`: if `msaa` is 0 or `dpr` is below 1, the speed guard stepped down. That means the node path is too heavy for the laptop and it needs `?msaa=0` as the default.
3. Compare the same level with `?renderer=webgl` (the old look on the new three) side by side.
4. The first seconds of the first ride may hitch while WebGPU compiles pipelines. Say whether it is noticeable.
5. Intro shots 10 (book and dust) and the Nijmegen and Maastricht hills (houses must sit on the hill, not float).
