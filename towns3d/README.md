# towns3d: each town's own look

Every town in NachTrit rides on the same seven kinds of street (the themes `street`, `gracht`, `shops`, `square`,
`nightshop`, `dyke`, `polder`). A town file decides what those streets look like in that town: the land and the route,
the sky and the light, the road surface, the lamps, the buildings, the skyline, the landmarks and the dead.
`Opus 5.5 DT/TOWNS-IDENTITY.md` says what each town must look like; the research behind it, with sources, is in
`Opus 5.5 DT/research/`.

`towns3d/<id>.js` registers `window.NRTOWNS3D[id]`. Every key is optional; what a town leaves out stays as the shared
game has it. The ids: `alblasserdam`, `kinderdijk`, `gouda`, `zeeland`, `utrecht`, `denhaag`, `rotterdam`, `urk`,
`texel`, `groningen`, `maastricht`, `nijmegen`, `amsterdam`.

```js
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  T.texel = {
    style: { brick: [0x3a4a3c, 0x5a5a4a], gables: 0.15, height: [4.5, 6.5], width: [4.5, 6], lamp: 'modern' },
    themes: { dyke: (base, K) => Object.assign({}, base, { fogD: 0.009, spawn: [/* ... */] }) },
    sky: { stars: 1600, milkyWay: 1, aurora: 0.9, auroraAz: 20, clouds: 0.15 },
    light: { lamp: 0xdfe8ff },
    road: { tone: '#4a2c2a' },
    dead: { pool: ['texelaar', 'texelaar', 'plain'], dress: { texelaar(k, body, K) { /* ... */ } } },
    lamp: K => { /* a Group */ },
    skyline: { mid(P, K, theme) { /* ... */ } },
    landmark: K => { /* a Group */ },
    extra: [/* spawn specs */],
    shops: ['SCHAPENKAAS', 'FIETSVERHUUR'],
    signs: ['Vuurtoren', 'Den Burg', 'De Koog'],
  };
})();
```

The file runs before the game; its functions are called later with `K`, the town kit (below). Do not touch anything at
load time beyond registering the object.

## The world

- The rider is at the origin facing minus z; ahead is negative z. The street rolls toward plus z.
- The road is 8 wide (x from -4 to 4), then a 0.5 kerb, then the verge: pavement tiles 3.2 wide in town, grass 0.8
  on the dyke and in the polder. Front houses stand at about x 7.9, the back row at about 19.
- Town ground is y 0 (`groundY` -0.05). Dyke and polder land lies at -0.9; the road stays at 0.
- A theme's canal is on one side: `canal: 1` is the right (plus x), `-1` the left; its water at `waterY`.
- Scenery is built about 100 to 290 ahead and recycled behind the rider; the fog closes between 70 and 100.
- A house or a terrace has its street front on its own minus x. Builders that set `userData.faceRoad` are turned for
  the left side automatically.

## themes

`themes: { <key>: object | (base, K) => object }`. The level's theme key picks the town's version, made once and kept.
Start from `base` (the shared theme) and change what you need. In canal towns (`alblasserdam`, `kinderdijk`, `gouda`,
`utrecht`, `amsterdam`) a `street` level becomes `gracht` unless the town defines `street` itself.

Theme fields:

| Field | Meaning |
|---|---|
| `fog`, `fogD` | Haze colour (also the sky at the horizon) and its density at the start of a level. |
| `night` | How far the haze and sky dim by the end of a level (lower is darker). |
| `stars` | Stars in this theme's sky (see `sky` for more). |
| `open` | A wide sky: the far bands paint open land, water holds more sky. |
| `ground`, `groundY` | Ground colour and height. |
| `canal`, `water`, `waterY`, `waterK` | The canal side, its colour, height, and how much sky it holds. |
| `curv` | How much the road bends. |
| `verge` | `'grass'` or `'tiles'` (default: grass on `dyke` and `polder`). |
| `road`, `sky` | As the town keys below, for this theme only. |
| `hills` | `{ amp, len }`: the ground rises and falls along the road in two slow waves, `amp` metres high, `len` metres long. Climbs, crests and dips follow each other; houses, lamps, the dead and the wisps follow the ground; he slows uphill. Water stays level, so do not combine hills with a canal. Maastricht and Nijmegen: try `amp` 5 to 8, `len` 350 to 450 (about 8 percent at the steepest). |
| `spawn` | What lines the road: a list of spawn specs (below). |
| `extra`, `landmark` | This theme's own extra specs; `landmark: false` leaves the town landmark out. |
| `lmX`, `lmSide` | Where the landmark stands. |

Spawn spec: `{ make, n, gap, side, xr, y, r, reg, water }`.
- `make`: a function `K => Object3D`, or `'shop'` (a house with one of the town's shop signs), `'graffiti'` (a wall
  with one of the town's words), `'zombieWalk'` (one of the dead walking along the pavement).
- `n` copies, `gap` metres apart along the road; `reg: true` spaces them evenly (lamps, terraces).
- `side`: `'left'`, `'right'`, `'both'` (random) or `'alt'` (alternating); `xr`: [min, max] distance from the middle of
  the road; `y`: height; `r`: footprint radius, used to keep things out of each other.
- `water`: a height above the canal water; the spec then goes to the canal side (town `extra` only).

## sky

`sky: { stars, milkyWay, milkyWayAz, aurora, auroraAz, glows, clouds, moon }`
- `stars`: `true` for a few, or a count (Texel 1500 and more).
- `milkyWay`: 0 to 1, a band rising from the horizon at `milkyWayAz` degrees (positive is left).
- `aurora`: 0 to 1, green curtains with a violet top, low over the horizon at `auroraAz`; they drift and breathe.
- `glows`: `[{ az, el, w, h, color, a }]`, light from beyond the horizon: the Westland greenhouses (orange, south of
  Den Haag), the port of Rotterdam, a city under the clouds. Azimuth in degrees (0 is straight ahead, positive left).
- `clouds`: 0 to 1 (default 1). The camera mostly sees the first 25 degrees above the horizon: put what matters low.

## light, road

- `light: { lamp, windows }`: the street light colour (orange sodium `0xffa850`, cold LED `0xdfe8ff`) and the window
  glow colour; each keeps its brightness and takes the hue.
- `road: { kind, tone, lines }`: `kind` `'asphalt'` (default), `'klinkers'` (brick pavers), `'cobbles'`, `'slabs'`
  (concrete plates); `tone` the base colour (`'#5a2f2b'` for a red bike path); `lines: false` drops the lane paint.

## dead

`dead: { pool, dress }`
- `pool`: the variants a spawn picks from; repeat a name to make it more common. The shared variants are `plain`,
  `hat`, `bonnet`, `cheese`, `phone`, `clogs`, `scarf`, `boxes`, `socks`, `crawler`.
- `dress.<name>(k, body, K)`: adds the clothes of a new variant to the kit `k` on the shared body (tall, thin,
  hunched, long arms, small head pushed forward, glowing yellow eyes). `body` has `hip`, `sh` (shoulders) and `hd`
  (head) as `[x, y, z]`, and `skin`. Use `K.kb`, `K.kadd`, `K.ktube` with materials made once (`K.Mat({ color })`)
  and kept in the file. Each variant is merged once and shared by every copy, so detail is cheap; keep it readable as
  a silhouette at 20 m. Give each variant a name unique to the town (`urkerman`, not `man`).

## lamp, landmark, skyline

- `lamp`: `'classic'` (lantern) or `'modern'` (slim with a flat head), or `K => Group` for the town's own street lamp.
  Light it with `K.lampLights(g, hx, hy, lantern, scale)`: the halo, the cone in the haze, the pool and the wet
  reflection, the same as every lamp in the game.
- `landmark: K => Group`: the town's landmark, placed once along the road, far to the side (`lmX`).
- `skyline`: the painted far town on three bands round the horizon (near 92 m away, middle 130, far 172; heights in
  metres up to about 50, 70 and 95). A function `(P, K, theme)` paints the town's mark on the middle band; an object
  `{ near, mid, far }` paints whole bands in place of the shared rooftops. `P.X(f)` is a position across the band:
  0.5 is straight ahead, 0 and 1 are the far left and right. Painting helpers: `P.box(x, width, h0, h1)`,
  `P.poly([[x, h], ...])`, `P.line(x0, h0, x1, h1, width)`, `P.win(x, h, alpha, w, h)` (a lit window),
  `P.house(x, width, h, kind, litShare)`, `P.roofs(f0, f1, h0, h1, litShare, kinds)`, `P.tree(x, h, width)`,
  `P.trees(f0, f1, h0, h1, gap)`, `P.church(x, h)`, `P.mill(x, h, angle, lit)`, `P.tower(x, [[w, h], ...], top, lit)`
  with tops `'spire'`, `'lantern'`, `'crown'`, `'onion'`, `'flat'`. `P.m` is pixels per metre, `P.r()` and
  `P.rr(a, b)` are seeded random numbers. Silhouettes are filled on `P.g`, lit windows on `P.w`.
- `extra`: spawn specs only this town has (all its themes).
- `shops`: shop sign names; `signs`: names for the fingerposts.

## K, the town kit

`THREE`, `scene`, the kit (`kit`, `kb`, `kadd`, `ktube`, `kbuild`, `kmerge`, `KG` shared geometries, `PG`), materials
(`M`, `PM`, `PK`, `Mat`, `GlowMat`, `glowTex`, `brickMat`), `labelTexture(text, { bg, fg, plain })`, the builders
(`house`, `terrace`, `backRow`, `lamppost`, `lampLights`, `treeCard`, `reeds`, `boat`, `moorings`, `ducks`,
`canalBridge`, `drawbridge`, `bridge`, `windmill`, `church`, `tower`, `lighthouse`, `sheep`, `crane`, `flagNL`, `bench`,
`bollard`, `bikeRow`, `bikeProp`, `bakfiets`, `bins`, `crates`, `tulipBox`, `cheeseCart`, `fence`, `fencePost`,
`fingerpost`, `graffitiWall`, `zombie`, `ghostFigure`, `wisp`), the tables (`THEMES`, `TOWN_STYLE`, `LANDMARK`,
`SKY_MARKS`), `ROAD_W`, `KERB_W`, `rnd`, `pick`, `lerp`, `smooth`, `clamp`, `seeded`, and `K.style` and `K.town`.
Grep `index.html` for a builder (`function house(`) and read only that function.

The kit merges parts into one mesh per material: `const k = K.kit(); K.kb(k, mat, x, y, z, sx, sy, sz, rx, ry, rz);
K.kadd(k, K.KG.cyl, mat, x, y, z, rx, ry, rz, sx, sy, sz); K.ktube(k, mat, ax, ay, az, bx, by, bz, r); const g = K.kbuild(k);`
A whole prop is then a few draw calls. Shared geometries in `K.KG` include `box`, `cyl`, `cyl6`, `ball`, `dome`,
`plane`, `disc`.

## Rules

- No exclamation marks anywhere: signs, screens, text.
- Netherlands Dutch on signs; never Flemish.
- No new external assets: no image files, fonts or libraries. Canvas textures and the kit only.
- Four lights only, the game's own. Glow comes from emissive or additive materials (`K.GlowMat`, `K.lampLights`).
- The palette of the concept art: blue-grey haze, dark shapes, amber windows; saturated colour only in lights, eyes
  and the hero's coat, and in a town's own signal colours (Rotterdam's white swan, Texel's red lighthouse).
- Never dispose a shared material or geometry. A material with your own canvas map: set `userData.shared = true` if
  it is made once and reused, or `mesh.userData.ownTex = true` if it belongs to one mesh.
- Draw calls: the riding game must stay at or under the town's draw calls today (about 450 to 650) on the Intel Iris
  Xe, frame time under 16 ms when the laptop is quiet. Merge with the kit; spend calls on what makes the town itself.

## Testing

- A level of the town: `index.html?level=<id>&shot=7&lane=1` steps the ride 7 seconds and holds the frame.
- Any theme dressed as any town: `index.html?level=1&town=<id>&theme=<key>&shot=7&lane=1`.
- Hills: add `&hillphase=<metres>` to move the waves under the bike (look for a crest and a dip).
- The town on the map: `index.html?unlock=1&map=<id>`.
- `files/tools/shoot.mjs` captures frames on the real GPU with draw calls, luma and errors; `grid.mjs` makes a contact
  sheet. Compare before and after for every level of the town.
