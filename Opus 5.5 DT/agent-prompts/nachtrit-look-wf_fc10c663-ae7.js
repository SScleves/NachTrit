export const meta = {
  name: 'nachtrit-look',
  description: 'Elevate the pixel intro and level scenes into elaborate art, then make the road readable at night',
  phases: [
    { title: 'Direct', detail: 'art director builds the toolkit, bible, gallery and integration' },
    { title: 'Paint', detail: 'one pixel artist per panel or scene' },
    { title: 'Critique', detail: 'a fresh art director critiques each piece' },
    { title: 'Repaint', detail: 'the artist applies the notes' },
    { title: 'Unify', detail: 'one pass for consistency across all nineteen, then commit' },
      ],
}

const WT = args.wt
const URL = 'http://localhost:8768'

const GAME = `Nachtrit is a horror-comedy browser game that teaches Dutch: after a mist, everyone in the Netherlands who spoke Dutch changed into bill-splitting zombies, and one man who never practised his Dutch (orange jacket, no helmet, deadpan face, two dogs, a grammar book he never opened, an omafiets with a basket) cycles through the night delivering the dead. The 3D game looks like INSIDE (cold blue night, restraint, light shafts) with warm amber windows and orange accents from Santi's concept art. The intro is pixel art with typed story text in English and Dutch underneath; Santi loves the text and the jokes and wants the ART to step up into something far more elaborate.
Santi's concept art is the visual target: read ${WT}/reference/CONCEPT-ART.md before anything else, and if any PNG images exist in ${WT}/reference/ look at every one of them with the Read tool. Take from it: fog and atmospheric perspective doing most of the work, amber light as the only warmth, orange for the hero, glowing yellow eyes for the threat, wet ground with reflections and light streaks, tall thin hunched zombies wearing Dutch cliches (bucket hat, bonnet, clogs, striped socks, cheese), drawbridges, arched bridges, windmills, gabled canal houses, boats, cheese carts, tulips, bollards, fingerposts, bikes everywhere.
Work only inside the git worktree ${WT} (branch look). Its game server runs at ${URL}/ . Never touch content/*, levels.js or data.js.`

const PANEL_NOTES = [
  'Panel 1, the night the mist came: a polder at night, a moon, windmills turning the wrong way, mist creeping over the fields, a ditch reflecting the sky. The first image of the game; it must take the breath away.',
  'Panel 2, everyone changed: a Dutch street at night, bill-splitting zombies holding phones that glow cyan with Tikkie and €4,50, one very tall woman next to our short man in his orange jacket. The gag (the bill, the height difference) must read instantly.',
  'Panel 3 (new text), the cheese theory: ONE joke, big and clear: a cheese shop at night, a wheel of Gouda on the counter with something clearly wrong with it (a green glow, a crack, flies), a zombie in a cheese hat staring at it, a sign KAAS. Dry, funny, one second to read.',
  'Panel 4 (new), the Flemish poll: ONE joke: a poll result on a screen, a newspaper front page or a billboard in the mist, a bar chart where VLAAMS towers over NEDERLANDS, Dutch zombies staring at it in disbelief, one holding a Belgian flag it found somewhere. Keep the cast consistent.',
  'Panel 5 (new), the drunk German: ONE joke: a tourist with a camera and a beer laughing in front of a canal, a speech bubble that only shows a hiccup or a laugh (the line itself is in the caption), the locals around him turning grey and slow as the words land, a windmill behind. Funny, not mean.',
  'Panel 6 (new), the Tikkie of one cent: ONE joke: a phone screen filling most of the frame with a Tikkie request for € 0,01 marked OPEN, a trembling thumb hovering over it, a dark room, the glow of the phone the only light, a dog watching. The last theory before the real cause.',
  'Panel 7, the language left: the Dutch words themselves (golden letters like de, het, gezellig, lekker) drifting away down an empty street into the mist, while people in the background talk into phones in English. Melancholy and funny.',
  'Panel 8, he never practised: a cosy café, our man says Hoi and his friendly friend answers English is fine in a speech bubble; warm light, everyone so nice about it.',
  'Panel 9, the dogs and the book: his home at night, two dogs (one brown, one darker) who clearly understand him, the grammar book on the table, never opened, maybe glowing faintly.',
  'Panel 10, page one, de or het: the open grammar book filling the frame, two columns DE and HET with words, a red question mark, paper texture, a coffee ring. Labels via NRART.text.',
  'Panel 11, every word said right brings a piece back: one golden word returning out of the mist and a single window lighting up warm in a dark street. Hopeful, the turn of the story.',
  'Panel 12, "...": darkness; only eyes blink in the dark (the dogs, and something else), a sliver of orange from his jacket. Minimal but masterful: the scare beat.',
  'Panel 13, no helmet: the helmet lies on the ground next to the omafiets, he stands beside it, deadpan, a small "nee." The joke is that a helmet would make him come across as enthusiastic.',
  'Panel 14, the ride: one man on the omafiets with the dynamo beam cutting into the mist, a long road ahead into the dark, the town behind; the title moment before the game starts.',
]
const SCENE_NOTES = {
  street: 'Level intro scene "street": his own street at night, terraced brick houses with gables, the dogs and the omafiets.',
  dyke: 'Level intro scene "dyke": the dyke road, mills on the horizon, water on one side, the moon; also used for the polder theme.',
  square: 'Level intro scene "square": a church on a village square, trees, a bell ringing (a small musical note).',
  nightshop: 'Level intro scene "nightshop": a night shop with a flickering NACHTWINKEL sign, cyan-lit shelves inside, a zombie with a phone outside.',
  shops: 'Level intro scene "shops": a shopping street with BAKKER, SLAGER and KAAS fronts, amber windows, a zombie asking "Tikkie?".',
}

phase('Direct')
const director = await agent(`${GAME}

You are the art director and the engineer for the intro. The foundation is DONE and committed on branch look: intro/art.js, intro/cast.js, intro/gallery.html, intro/shoot.mjs, ART-BIBLE.md, fourteen panel files and five scene files all render (node intro/shoot.mjs all 2 shows no errors). Do not rebuild any of it. Your only job in this phase: read ART-BIBLE.md, run the contact sheet, confirm every piece renders and the harness intro passes (NR_URL=http://localhost:8768/index.html node qa/run.mjs intro, errors: 0), fix anything broken, and return the sprite API summary and the contact sheet path. Keep it short. Today the intro lives inside index.html: search for "const PANELS = [", "function px_", "const SCENES = {", "function showLevelIntro", "function showIntro", "pxLabels", "function px_text", '<canvas id="pix"', '<canvas id="pixhi"'. It draws 8 story panels and 5 level-intro scenes at 192x108 with simple helpers.

Build the foundation the artists will use, then port the current art so nothing breaks:
1. intro/art.js, a classic script loaded before the module script: window.NRART = { W: 320, H: 180, panels: [], scenes: {}, labels: [] , ... }. A pixel toolkit that never anti-aliases: px, rect, hline, vline, line (Bresenham), disc and ring (midpoint, filled with rects), ellipse, poly (scanline fill), a 4x4 Bayer dither for gradients and light falloff (ditherRect, ditherDisc, ditherGradient between two palette colours), sky bands, a light cone with dithered falloff, glow, rain, drifting mist bands, stars, a moon, water with a mirrored and rippled reflection of what is above it, brick and roof-tile textures, window grids with occasional flicker, and NRART.text(x, y, str, color, size, bold) which records crisp labels drawn later on the hi-res overlay. A named palette in ramps (night blues, mist, brick, amber light, orange jacket, skin, zombie greys with yellow eyes, phone cyan, blood red, grass and reed greens, paper). Shared character and prop sprites as drawing functions with parameters, so every artist draws the same cast: man(g, x, y, {facing, pose: stand|ride|sit, t, face}) with the orange jacket and no helmet, dog(g, x, y, {coat, t, pose}), zombie(g, x, y, {variant: plain|hat|bonnet|cheese|phone, t}), tallWoman, friend, omafiets(g, x, y, {rider, t, beam}), windmill(g, x, y, scale, angle), canalHouse(g, x, y, w, h, {gable: step|bell|neck|spout|roof, brick, lit, t}), book, bubble(g, x, y, w, h) (text inside via NRART.text). Make the sprites genuinely good: readable silhouettes at this resolution, two or three shades each, rim light from the key light.
2. One file per piece, each registering itself: intro/panel-1.js .. intro/panel-14.js with NRART.panels[i] = { text, nl, draw(g, t) } where text and nl are copied VERBATIM from the fourteen panels in /home/santi/dutch-arcade/STORY.md (the edited Dutch lines there are final), in that order; intro/scene-street.js, scene-dyke.js, scene-square.js, scene-nightshop.js, scene-shops.js with NRART.scenes[name] = (g, t) => {...} (polder reuses dyke). Port the current drawings to 320x180 (panels 3 to 6 and 11 are the new story beats) so all nineteen work before the artists start.
3. index.html: script tags for intro/art.js and the thirteen files, placed with the other classic scripts before the module; the pix canvas becomes 320x180 and pixhi 1280x720; showIntro uses NRART.panels when all 14 exist and falls back to PANELS otherwise; the label scale is pixhi.width / pix.width instead of the hard-coded 6; showLevelIntro prefers NRART.scenes[theme]; NRART.labels is cleared before each draw and rendered on pixhi after. Keep the typed English line, the Dutch line, the spoken Dutch and the skip control exactly as they work now.
4. intro/gallery.html renders one piece (?only=panel-3&t=2.5) or a contact sheet of all nineteen (?all=1&t=2) at 3x with nearest-neighbour scaling and the crisp label overlay, with the story text under each panel; ?bench=1 runs each draw 200 times and prints milliseconds per frame on the page.
5. intro/shoot.mjs: node intro/shoot.mjs <panel-N|scene-NAME|all> [t ...] opens ${URL}/intro/gallery.html in Playwright Chromium (import { chromium } from 'playwright'; the package is available through the node_modules symlink in the worktree root), writes PNGs to intro/out/<name>-t<t>.png, prints their paths and any console errors, and with --bench prints the timing. Add intro/out/ to .gitignore.
6. ART-BIBLE.md for the artists: 320x180, every pixel deliberate, toolkit primitives only (no ctx.arc, no gradients, no shadowBlur, no image smoothing); one key light per piece plus rim light, dithered falloff; three to five depth layers, farther is bluer, lighter and lower in contrast; wet surfaces reflect light sources; two to four subtle animation loops per piece, time-based and seamless (mist, rain, mill sails, flickering windows, blinking eyes, phone glow, dog tails, wheels); an optional slow camera drift of at most 12 px over 8 s; the cast is drawn only with the shared sprites, extended locally if needed; the palette ramps by name; crisp text only through NRART.text, never baked pixel text; each piece's joke must read in one second; a draw budget of 3 ms per frame.
7. Verify: node intro/shoot.mjs all 2 shows all nineteen with no console errors; NR_URL=${URL}/index.html node qa/run.mjs intro reports errors: 0; then commit on branch look with a clear message ending with the line Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>.
Return what you built, the sprite API, and the path of the contact sheet PNG.`,
  { label: 'direct:foundation', phase: 'Direct', schema: { type: 'object', properties: { summary: { type: 'string' }, spriteApi: { type: 'string' }, contactSheet: { type: 'string' }, commit: { type: 'string' }, problems: { type: 'string' } }, required: ['summary', 'spriteApi', 'contactSheet', 'commit', 'problems'] } })
if (!director) return { error: 'director failed' }
log(`foundation: ${director.commit}`)

const pieces = [
  ...PANEL_NOTES.map((note, i) => ({ name: `panel-${i + 1}`, file: `intro/panel-${i + 1}.js`, note })),
  ...Object.entries(SCENE_NOTES).map(([k, note]) => ({ name: `scene-${k}`, file: `intro/scene-${k}.js`, note })),
]
const SHARED = `${GAME}

Read ${WT}/ART-BIBLE.md and ${WT}/intro/art.js first. The sprite API the art director built:
${director.spriteApi}
Look at the current contact sheet to see the whole set: ${director.contactSheet}
You may edit ONLY your own file. Do not edit art.js or any other piece (if you need a new shared sprite, write it locally in your file). Do not commit. Shoot with: node intro/shoot.mjs <name> 0 1.5 3 6   and look at every PNG with the Read tool before and after each change; check the draw time with --bench.`

const paintOne = p => pipeline([p],
  p => agent(`${SHARED}

You are a master pixel artist. Your piece: ${p.name} in ${WT}/${p.file}. ${p.note}
Repaint it into something far more elaborate and beautiful than the current version: a full composition with a clear focal point, depth layers, a key light and rim light, dithered light falloff, reflections where there is water or wet ground, texture (brick, tiles, wood grain, paper), and two to four subtle animation loops. Keep text and nl exactly as they are. Iterate at least four times: shoot, look, improve. Return what is in the scene, the loops, the draw time, and the final PNG paths.`,
    { model: 'sonnet', label: `paint:${p.name}`, phase: 'Paint', schema: { type: 'object', properties: { scene: { type: 'string' }, loops: { type: 'string' }, ms: { type: 'number' }, pngs: { type: 'array', items: { type: 'string' } } }, required: ['scene', 'loops', 'ms', 'pngs'] } }),
  (painted, p) => painted && agent(`${SHARED}

You are a demanding art director seeing ${p.name} (${WT}/${p.file}) for the first time. Brief for the piece: ${p.note}
Shoot it (node intro/shoot.mjs ${p.name} 0 2 4 6) and study every frame. Judge it against ART-BIBLE.md and the brief: does the joke or the beat read in one second, composition and focal point, lighting and depth, palette discipline, consistency of the cast with the shared sprites, animation quality, crispness (any soft or anti-aliased pixels), and above all ambition: is this clearly far more elaborate than a flat placeholder scene. Do not edit anything. Return 6 to 10 concrete notes ranked by impact, with pixel coordinates where useful, and a score from 0 to 10.`,
    { effort: 'high', label: `critique:${p.name}`, phase: 'Critique', schema: { type: 'object', properties: { score: { type: 'number' }, notes: { type: 'array', items: { type: 'string' } } }, required: ['score', 'notes'] } }),
  (critique, p) => critique && agent(`${SHARED}

You are the pixel artist for ${p.name} (${WT}/${p.file}). Brief: ${p.note}
An art director scored the current version ${critique.score}/10 and wrote these notes, ranked by impact:
${critique.notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}
Address every note (if you disagree with one, say why in your return), iterating with shoot until the piece is clearly better. Keep the draw under 3 ms. Return what changed and the final PNG paths.`,
    { model: 'sonnet', label: `repaint:${p.name}`, phase: 'Repaint', schema: { type: 'object', properties: { changed: { type: 'string' }, declined: { type: 'string' }, ms: { type: 'number' }, pngs: { type: 'array', items: { type: 'string' } } }, required: ['changed', 'declined', 'ms', 'pngs'] } }))
const results = []
for (let i = 0; i < pieces.length; i += 2) {   // two pieces at a time: each shoot runs a headless browser and the laptop must stay usable
  const batch = await parallel(pieces.slice(i, i + 2).map(p => () => paintOne(p).then(r => r[0])))
  results.push(...batch); log(`${Math.min(i + 2, pieces.length)} of ${pieces.length} pieces through paint, critique and repaint`)
}
log(`${results.filter(Boolean).length} of ${pieces.length} pieces repainted`)

phase('Unify')
const unify = await agent(`${GAME}

You are the art director. Nineteen artists repainted the intro pieces in ${WT}/intro/ in parallel. Shoot the contact sheet (node intro/shoot.mjs all 1 3) and every piece at t=2, and study them together. Fix inconsistencies across the set: the man, the dogs, the zombies and the bike must look like the same characters everywhere; the palette and light direction must feel like one artist; line weight and dither density must match; text labels must be legible. You may edit any intro file now, and art.js if a shared sprite needs a fix (then re-shoot everything). Check every piece's draw time with --bench. Then play the intro in the real game: NR_URL=${URL}/index.html node qa/run.mjs intro must report errors: 0; open the resulting frames in qa/out/<newest>/ and confirm the panels show with the English and Dutch lines. Commit everything on branch look with a clear message ending with Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>. Return what you unified, the commit, and the contact sheet path.`,
  { label: 'unify:set', phase: 'Unify', schema: { type: 'object', properties: { unified: { type: 'string' }, commit: { type: 'string' }, contactSheet: { type: 'string' } }, required: ['unified', 'commit', 'contactSheet'] } })

const road = 'done separately'
return { director: director.summary, pieces: results.filter(Boolean).map(r => ({ changed: r.changed, ms: r.ms, png: r.pngs && r.pngs[0] })), unify, road }