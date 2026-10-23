# Nachtrit intro: the art bible

Read reference/CONCEPT-ART.md and look at reference/*.png first. Toolkit: intro/art.js (window.NRART).
Cast and props sheets: intro/gallery.html?only=cast and ?only=props.

## The canvas
- 320x180, every pixel deliberate. Each piece draws into a palette-indexed buffer; nothing anti-aliases.
- Toolkit primitives only: px, rect, hline, vline, line, disc, ring, ellipse, poly, ditherRect,
  ditherGradient, ditherDisc, sky, glow, cone, haze, mist, tint, shadow, water, streak, rain, stars,
  moon, brick, tiles, window, windows. Never ctx.arc, gradients, shadowBlur, alpha or image smoothing.
- Colours by ramp name and step, dark to light: night0-7, mist0-7, slate, brick, wood, amber0-8,
  orange (the hero only), skin, zombie, eye (the threat only), phone (Tikkie cyan), red, green,
  paper, steel, teal, cheese, fur, blue.

## Light
- One key light per piece, set with NRART.key(g, x, y, k). Sprites get a rim light toward it.
- Falloff is dithered (glow, cone, haze use 4x4 Bayer). Amber is the only warmth.
- Wet surfaces reflect: NRART.water under the ground line, NRART.streak under each light.

## Depth
- Three to five layers, NRART.depth(g, d) before each. Farther is bluer, lighter, lower in
  contrast: NRART.haze after each far layer, mist bands between them.
- Optional camera drift: NRART.camera(g, t, {x}), at most 12 px over 8 s, seamless.

## Motion
- Two to four subtle, time-based, seamless loops per piece: mist, rain, mill sails, flickering
  windows, blinking eyes, phone glow, dog tails, wheels. Everything is a function of t.

## The cast
- Drawn only with the shared sprites: man, dog, omafiets, zombie (plain, hat, bonnet, cheese,
  phone, woman), tallWoman, friend, windmill, canalHouse, lamp, book, bubble, say, and the props
  (drawbridge, archBridge, boat, cheeseCart, tulips, bollard, fingerpost, fence, reeds, tree,
  church, duck, clogs). Extend locally if needed; if the change is good, move it into art.js.
- Mills turn anticlockwise in real life (angle = -t); clockwise is the wrong way (panel 1).

## Text
- Crisp text only through NRART.text / bubble / say (drawn on the hi-res overlay). Never bake text
  into pixels.

## Rules of thumb
- Each piece's joke must read in one second.
- Budget: 3 ms per frame. Check with: node intro/shoot.mjs all --bench
- Look at your work: node intro/shoot.mjs panel-3 0 2.5 5, then open intro/out/.
