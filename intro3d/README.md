# intro3d: the intro as shots in the game's own 3D world

Each intro panel can have a 3D shot: a few seconds staged in the game's world with the game's own builders, played
under the panel's captions in a letterbox. A panel without a shot plays its pixel painting from `intro/panel-N.js`.
The first run plays panels 1, 2, 3, 4, 5, 6, 8 and 14; the intro link on the start screen plays all fourteen.

`shot-14.js` is the reference. Read it first.

## Files

`intro3d/shot-N.js` registers `window.NRCINE[N - 1]`. Every shot file is loaded by `index.html` after the intro
scripts. A file with only a comment means the pixel panel plays.

```js
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  C[N - 1] = {
    hold: 8,                    // the panel stays at least this long; reading time and the spoken Dutch can keep it longer
    build(W) { },               // stage the set, place the actors, set the first camera
    update(W, t, dt) { },       // every frame; t is seconds since the shot began
    dispose(W) { },             // optional: drop your own references; props added with W.add are removed for you
  };
})();
```

The shot is built while the picture is dipped to black, so building may take a moment. If `build` throws, the panel
falls back to its painting and the error goes to the console.

## The world

- The rider sits at the origin and faces minus z: ahead is negative z, behind him is positive z.
- The road is 8 wide (x from -4 to 4). Kerbs run to about 4.5, then the pavement or the grass verge. In the town
  themes the front houses stand at about 7.9 from the middle, the back row at about 19.
- The ground is y = 0 in town. On the dyke and in the polder the land beside the road is at y = -0.9; the road is
  still at 0.
- The street rolls toward plus z at the speed you set, and the world's scenery rolls with it. During a shot the
  scenery is kept up to 40 behind him and is built about 100 ahead. The fog closes between 70 and 100.
- In a canal town (Alblasserdam, Kinderdijk, Gouda, Utrecht, Amsterdam) the `street` theme becomes `gracht`: the
  canal is on his right (plus x).
- The game's riding speed is 14 to 40. For a calm shot, 6 to 9 reads better.

## W, the world handle

The shot gets `W` (also `window.NRW` in the console).

| Call | What it does |
|---|---|
| `W.stage({ town, theme, fog, lamp, rider, preroll, seed })` | Builds the set: a town id and one of the themes `street`, `gracht`, `shops`, `square`, `nightshop`, `dyke`, `polder`. `fog` multiplies the haze (1 is the theme's). `lamp` is his lamp from 0 to 100 (default 92). `rider: false` hides him and puts his lamp light out. `preroll` rolls the street on first (default 50) so the road behind him is built too. `seed` makes the set the same on every play. |
| `W.hide(test)` | Hides what the set does not need: `test(object)` gets every scenery piece and every object in the scene, and hides it when it returns true. Hidden scenery stays hidden when it comes round again; everything comes back when the shot ends. |
| `W.band()` | The picture between the top bar and the captions, measured now, in CSS pixels: `{ top, bottom, height, width, portrait }`. |
| `W.speed(v, world)` | His wheels turn at `v`; the street rolls past at `world` (default `v`). `W.speed(7, 0)` stops the street while he rides on. |
| `W.ride(z)` | Puts him, his lamp and its light at `z` along the road. With the street stopped, a growing negative `z` is him riding away. |
| `W.cam(px, py, pz, lx, ly, lz, fov)` | Camera position, the point it looks at, and optionally the field of view. |
| `W.drift(t, a)` | After `cam`: a hand-held drift. `a = 1` is a calm operator. |
| `W.fog(mul)` | Thicker (above 1) or thinner haze than the theme's, any time. |
| `W.face(name, secs)` | His face: `deadpan`, `worry`, `smug`, `ouch`, `scream`. |
| `W.add(obj, x, y, z, ry, { ride })` | Puts a prop in the street. It rolls past with the street, unless `ride: true` keeps it beside him. Returns the object. Removed when the shot ends. |
| `W.say(text, actor, { from, to, dy })` | A speech bubble over an actor (an Object3D it follows, or a fixed `[x, y, z]`), `dy` above its origin, shown from `from` to `to` seconds. |
| `W.title(main, sub, at)` | The big title in the sky from `at` seconds. |
| `W.flash()` | A white flash, as from a camera. |

Builders and materials from the game, all on `W`:

- People: `zombie(variant)` with the variants `plain`, `hat`, `bonnet`, `cheese`, `phone`, `clogs`, `scarf`,
  `boxes`, `socks`, `crawler`. A zombie faces minus z when `rotation.y` is 0. The game turns them with
  `rotation.y = Math.PI` to face him. `ghostFigure(own, variant, seated, coat)` is a passenger soul.
- Buildings: `house({ w, h, brick, sign, lit, gable, plain, tall })` (gables `step`, `bell`, `neck`, `spout`,
  `roof`; `sign` is a shop name), `terrace(n, opts)`, `backRow()`, `church()`, `windmill()`, `tower(w, h, mat, spireH)`,
  `canalBridge()`, `drawbridge()`, `bridge()`, `LANDMARK[town]()`. A house or terrace has its street front on its own
  minus x: use `ry = Math.PI` on the left of the road (x below 0) and `ry = 0` on the right.
- Street: `lamppost()`, `bench()`, `bollard()`, `bikeRow()`, `bikeProp()`, `bins()`, `crates()`, `tulipBox()`,
  `cheeseCart()`, `fence()`, `flagNL()`, `treeCard(kinds)`, `reeds()`, `boat()`, `moorings()`, `ducks()`, `wisp()`.
- Signs and text: `labelTexture(text, { bg, fg, plain })` returns a canvas texture for a board or a screen.
- Your own props: the kit merges parts into one mesh per material. `const k = W.kit(); W.kb(k, mat, x, y, z, sx, sy, sz);
  W.kadd(k, geo, mat, x, y, z, rx, ry, rz, sx, sy, sz); W.ktube(k, mat, ax, ay, az, bx, by, bz, r); const g = W.kbuild(k);`
  with the shared geometries in `W.KG` (`box`, `cyl`, `ball`, `dome`, `plane`, ...) and the materials in `W.M`, `W.PM`,
  `W.PK`. `W.Mat(opts)` makes a lit material in the game's look; `W.GlowMat(W.glowTex, color, opacity, sprite)` a glow.
- Also `W.THREE`, `W.scene`, `W.camera`, `W.bike`, `W.beam`, `W.lampLight`, `W.rnd`, `W.pick`, `W.lerp`, `W.smooth`,
  `W.clamp`.

## Framing

The picture is the band between the top bar (9 percent of the height) and the caption bar. The projection is centred
on that band, so the point you give `W.cam` to look at is the middle of the picture. Check three sizes: a laptop
(1280 x 800), a phone upright (390 x 844) and a phone on its side (844 x 390). On an upright phone only the middle of a
wide shot shows, so keep the subject near the look point.

## Captions, voice and time

The English caption shows at once, the Dutch follows at 0.6 seconds and is spoken. The panel holds for the longest of
its reading time, the shot's `hold` and the end of the speech, then dips to black and moves on. A tap moves on sooner,
so the first two seconds must already read. Bubbles carry only the words said in the scene, short.

## Rules

- No exclamation marks anywhere: captions, bubbles, signs, screens.
- Netherlands Dutch, never Flemish.
- No new external assets. Build with the game's builders, the kit and canvas textures.
- Four lights only, the game's own. Glow comes from emissive or additive materials. The game runs three.js r152 without
  physically correct lights: a light fades as `(1 - d / distance) ^ decay`, so intensities copied from newer three.js
  examples come out far too bright.
- If `update` throws, the shot is ended and cleaned up and the panel falls back to its painting. `dispose` still runs.
- Never dispose a game material or geometry. If you make your own texture, set `mesh.userData.ownTex = true` and it is
  disposed when the shot ends.
- Keep the draw calls under about 600 on the Intel Iris Xe and check the frame time.

## Testing

- `index.html?cine=N` plays the intro from panel N, with its shot if it has one.
- `index.html?cine=N&t=S` stages shot N, steps it to S seconds at 60 frames a second and holds that frame. Use it for
  stills; any headless Chrome with `--use-angle=d3d11 --ignore-gpu-blocklist` renders it on the real GPU.
