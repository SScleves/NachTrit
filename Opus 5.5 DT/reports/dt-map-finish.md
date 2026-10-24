# dt/map-finish: the map after concept F (24 Oct 2026)

Branch `dt/map-finish`, four commits on top of main e0cfc80. Files: `map-art.js` (rewritten) and
the map code, CSS and markup in `index.html` (drawWorld, markCurrent, placeBike, segLen, rideTo,
openTown, plus the new bikeRest and mapFxStart; nothing in the start screen, intro or 3D engine).

## What changed

- The real outline: 342 hand-typed lon/lat points (coast and borders 275, the IJsselmeer,
  Markermeer and randmeren as one lake 41, Flevoland 20, Houtribdijk and storm barrier 6), with
  the five Wadden islands, Zeeland's islands and estuaries, the Afsluitdijk between lake and sea,
  rivers, dunes. One projection for land and towns (equirectangular, an outward lens on the
  Randstad, a per-screen vertical scale); towns are pushed apart by their measured label blocks
  and the land follows them through a radial basis field, so every town stays on its ground.
- The diorama: sea with dithered wave hatch and shallows, the slab's shadow, a side face under
  every coast, the lit rim toward the moon, polder texture, lakes and rivers cut in, mist bands,
  amber reflections of the lights in the water, dressing by region.
- Roads in tier order (centripetal Catmull-Rom through real-road waypoints), lamps lit only where
  both towns are open; the cyclist rides the curve, pedals, and passes behind towns in front of him.
- A hand-built vignette per town from its landmarks; locked towns fogged and drained, saved towns
  fully lit. Badges: locked, open, saved (lantern), current (green ring).
- The Endless night button is a text link until the first town is saved (first-five-minutes 8).
- Phones: tap legend, two-line subtitle, the town card is an opaque bottom sheet that scrolls.
- Painted once into cached canvases (land per layout, roads and towns per progress); one fx canvas
  animates the glow pulse, road lamps, the Texel beam, about 70 water glints and the cyclist.

## Measured (laptop, Intel Iris Xe, Chrome, ANGLE D3D11)

- Page errors 0 in every frame. The map is 2D canvas: the 3D scene behind it keeps 216 to 235
  draw calls, as before. Map animating: 60 fps, worst frame 33 ms at 1280x800.
- Screenshot luma at 1280x800: concept 29, before 36, after 33.
- Paint: about 100 to 250 ms per resize or progress change at 1280x800 (up to 500 ms when the
  machine was busy), 50 to 70 ms at phone sizes. A progress change reuses the land layer.
- Label sweep: 0 overlapping label texts, 0 labels outside the map area at 1280x800, 390x844, 320x640.
- Keyboard: ArrowRight rides to the next open town and opens its card, ArrowLeft rides back,
  Enter opens the current town, a place opens its mission. Tapping Zeeland rides three towns.
- `node qa/validate-content.mjs`: 0 errors, 0 warnings. `node qa/run.mjs 1` (software GL): errors 0.

## Still off against the concept

1. On a laptop the country fills the middle half of the screen; the concept is portrait and the
   land fills it. Vignettes are small at that size (cheese wheels and the dogs read only zoomed in).
2. The concept's towns are bigger glowing clusters with long canal reflections; ours are smaller
   and the reflections shorter.
3. The slab edge is thin (5 to 15 px); the concept's edge reads as a cliff.
4. The sea hatch is fainter than the concept's water texture.
5. The lens and label push still move towns off their true spots (Den Haag north of its latitude,
   Maastricht pulled north on phones); the land moves with them, so they stay on land.

## For the GPU check

- No WebGL changes. Canvas 2D only: `ctx.filter = blur()` once per paint for the slab shadow
  (Safari before 18 ignores it and draws a hard shadow), `shadowBlur` for the shallows.
- The coast is typed from memory, not traced from data: recognisable, but single points can be a
  few kilometres off (Den Helder, the Lauwersmeer, the Dollard, the Westerschelde).
- Beyond the brief's glow, lamps and cyclist, the beam and the water glints also animate.
