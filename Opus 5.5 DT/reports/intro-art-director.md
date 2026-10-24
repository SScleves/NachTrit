# Agent reports from the laptop run (wf_3d62972c-4a5)

## agent

**summary**

The intro foundation is finished and committed on branch look (dd02d9b), but every piece misses the 3 ms draw budget (6.6 to 20 ms per frame). All sixteen pieces render: `node intro/shoot.mjs all 2` shows no console errors, and `NR_URL=http://localhost:8768/index.html node qa/run.mjs intro` reports errors: 0 and plays the new 320x180 panels in the game.

I kept the toolkit from the first pass and built on it. It already had the palette, primitives, lighting and fog, the water, rain and mist effects, the textures and the man, dog and omafiets.

- **Sprites (/home/santi/dutch-arcade-wt/look/intro/art.js):**
  - Added zombie, tallWoman, friend, windmill and canalHouse.
  - Added street furniture and props: lamp, book, bubble, say, drawbridge, archBridge, boat, cheeseCart, tulips, bollard, fingerpost, fence, reeds, tree, church, duck and clogs.
  - Fixed the man's front sitting pose.
- **Reference sheets (/home/santi/dutch-arcade-wt/look/intro/cast.js):** two sheets showing every character and prop, at gallery.html?only=cast and ?only=props.
- **Pieces:**
  - /home/santi/dutch-arcade-wt/look/intro/panel-1.js to panel-11.js carry the text and Dutch lines copied verbatim from STORY.md. Panels 3, 4 and 8 are simple placeholders.
  - scene-street.js, scene-dyke.js, scene-square.js, scene-nightshop.js and scene-shops.js are the five level scenes; polder reuses dyke.
- **Game page (/home/santi/dutch-arcade-wt/look/index.html):**
  - Loads art.js and the sixteen piece files before the module script. The pix canvas is now 320x180 and pixhi 1280x720.
  - The story intro uses NRART.panels when all 11 exist, and the level intros prefer NRART.scenes. Otherwise the old 192x108 drawings are scaled up to fill the canvas.
  - Labels are scaled by pixhi.width / pix.width. The typed English line, the Dutch line, the spoken Dutch and skip work as before.
- **Other files:**
  - /home/santi/dutch-arcade-wt/look/intro/gallery.html now covers 11 panels.
  - /home/santi/dutch-arcade-wt/look/qa/run.mjs now steps through 11 intro panels instead of 8.
  - /home/santi/dutch-arcade-wt/look/ART-BIBLE.md is written for the artists.
  - intro/out/ was already in .gitignore.

**spriteApi**

All sprites stand on (x, y): x is the centre line and y the ground row. They take t for animation, and many also take facing ('right' or 'left'), seed and rim.

- man(g,x,y,{facing:'front'|'back'|'right'|'left', pose:'stand'|'walk'|'ride'|'sit', t, face:'deadpan'|'worry'|'smug'|'talk'|'shock'|'blink', arm:'wave'|'point', hold:'phone'|'book'|'helmet', floor})
- dog(g,x,y,{coat:'brown'|'black'|'golden'|'grey', pose:'stand'|'walk'|'sit'|'lie', look:'up', t})
- omafiets(g,x,y,{rider:true|fn, t, speed, beam:false|length, basket:'book'|'dog'|'cheese', face})
- zombie(g,x,y,{variant:'plain'|'hat'|'bonnet'|'cheese'|'phone'|'woman', t, pose:'stand'|'walk', height:50, hunch:0..1, carry:'cheese', clogs, socks, hair, tone (one colour for far silhouettes; the eyes still glow), glow, phone}) returns {head, hand}
- tallWoman(g,x,y,o): a 60 px zombie woman, phone in hand by default
- friend(g,x,y,{t, face:'smile'|'talk'|'blink', arm:'down'|'wave'|'drink'}) returns {head}
- windmill(g,x,y,scale,angle,{tone, sail, cloth, stage, lit, t}): a positive angle turns clockwise, which is the wrong way for a Dutch mill
- canalHouse(g,x,y,w,h,{gable:'step'|'bell'|'neck'|'spout'|'roof', brick, lit:0..1, t, seed, door, trim, hoist}): x is the left edge
- lamp(g,x,y,{style:'lantern'|'modern', h, on, flicker, reach, cone})
- book(g,x,y,{open, w, h, t, dust, cover})
- bubble(g,x,y,w,h,{text, tail:[x,y], size, color})
- say(g,x,y,str,o): a bubble sized to its text, its tail pointing at (x, y)
- Props:
  - drawbridge(g,x,y,w)
  - archBridge(g,x,y,w,h)
  - boat(g,x,y,{kind:'sloep'|'barge', len, mast})
  - cheeseCart(g,x,y)
  - tulips(g,x,y,w)
  - bollard(g,x,y)
  - fingerpost(g,x,y,{signs})
  - fence(g,x,y,w,h)
  - reeds(g,x,y,w,h,{t})
  - tree(g,x,y,s)
  - church(g,x,y,s)
  - duck(g,x,y,{t})
  - clogs(g,x,y)
- Primitives:
  - drawing: px, rect, hline, vline, line, disc, ring, ellipse, poly
  - dithering: ditherRect, ditherGradient, ditherDisc
  - light: glow, cone, tint, shadow
  - air: haze, mist, sky, stars, moon, rain
  - water: water, streak
  - texture: brick, tiles, window, windows
  - camera and light setup: camera, depth, key
  - text: text(x,y,str,color,size,bold,{align,shadow}), textWidth
- Colours are named by ramp and step, for example night3, amber6 or eye4.

**contactSheet**

/home/santi/dutch-arcade-wt/look/intro/out/all-t2.png (sprite sheets: /home/santi/dutch-arcade-wt/look/intro/out/cast-t1.png and /home/santi/dutch-arcade-wt/look/intro/out/props-t1.png)

**commit**

dd02d9b on branch look: "Intro art foundation: NRART toolkit, shared cast, 11 panels and 5 scenes at 320x180" (ends with Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>)

**problems**

1. Performance: all sixteen pieces are over the 3 ms budget in headless Chromium, from 6.6 ms (scene-dyke) to 20 ms (panel-2). The cost is in the per-pixel light and dither passes (glow, haze, ditherGradient), which call a function for every pixel. Large glows covering most of the frame are the worst; panel 7 is mostly one. I tried rounding light strengths so lookup tables are reused; it made almost no difference, but I left it in because it is harmless. A real fix means rewriting those passes as plain loops without a per-pixel function call, or caching the static light fields. Run `node intro/shoot.mjs all --bench` to measure.
2. In panel 1, scene-dyke, scene-street and scene-square, some fog is applied to a rectangle that doesn't cover the full frame, so its edges show as visible boxes in the sky. Spreading those regions full-width, or fading their edges, would remove the seams.
3. Panels 3, 4 and 8 are placeholders, as asked. The zombie arms and the tall woman's coat are improved but still basic.
4. The NL bar in panel 3 uses the hero's orange ramp, as a nod to Dutch orange. This breaks the bible's rule that only the hero is orange.
5. The old 192x108 PANELS fallback in index.html still carries the Dutch lines from before the STORY.md edits. It only shows if a panel file fails to load.

---

## agent

**changed**

Rewrote /home/santi/dutch-arcade-wt/look/intro/panel-2.js only. Notes 1, 2, 3, 5, 6, 7 and 8 are addressed, note 4 only partly, and notes 9 and 10 only partly.

Not fully met:
- Draw time is still over budget. It went from about 24 ms to about 16 ms per frame on this loaded machine (load average about 14). Panel-1 measured 5 ms in the same conditions, so panel-2 is still about 3x heavier. What remains is about 130 windows and 50 glows. Getting under 3 ms would need fewer houses or windows in art.js, which I may not edit.
- I never viewed the final frames at t=0, t=3 or t=6 side by side. I looked at t=1.5 and t=3 only, so I did not check the ping and glance timing or the lamp flicker in the shot frames. The sway, pings, glance and flicker are coded but unverified.
- The mill and church are faint behind the right houses, and I did not add a vanishing street, only a fading lamp row.

What changed, by note:
1. **The gag.**
   - The tall woman is now 68 px with hunch 0, at x=161, against the man's shoulder (the man is at x=148).
   - A bubble over her head reads "Tikkie: €4,50".
   - Her phone sits beside his face, and a cyan glow lights his face.
   - His face switches to 'worry' when a phone pings.
   - Not done: his eyes do not look up at her, because the man sprite has no look-up face, so I left the 'deadpan' and 'worry' faces as they are.
2. **Phones.**
   - I drew local 4x6 phones with a slate body and a phone5 screen, plus a lower bar that is a stand-in for the Tikkie bar or euro glyph, not a real euro glyph.
   - I added cyan up-lights on the faces and a cyan glow around each phone.
   - Each of the three phones flashes phone5 for 0.25 s in turn every 1.5 s.
   - The screens point at the man.
3. **Backdrop.**
   - The near houses use cold night2 brick, 0.1 lit (0.3 on the house behind the man), and no gable outline.
   - A mist band and a mist4 glow sit behind the figures so they read as dark shapes.
   - I dropped the hazing of the upper storeys, because the box-shaped hazes showed hard edges and cost time.
4. **Depth.** The 11 far gables are gone and the mill is hazed and moved to x=232, behind the right houses. A receding row of three lamps with glows fades into the fog over the canal. I did not add a full vanishing street or canal.
5. **Sky.** The ruler band is replaced by a ditherGradient from the sky to mist1 over y 40 to 70.
6. **Wet street.**
   - The street is now mostly flat slate0.
   - One narrow water pass runs x 20 to 310 and 16 px tall.
   - There are 3 px amber lamp pillars, a 2 px orange reflection for the man and cyan reflections for the phones.
   - Not done: some reflections are still broken and ragged, not clean pillars.
7. **Clutter.**
   - The tulips are moved to x=8 and x=300.
   - The fence is shortened to x 128 to 188.
   - The orange bucket-hat zombie is replaced by a bonnet woman.
8. **Plural women.** The left zombie is now a bonnet woman, 62 px tall. The two bubbles are merged into one.
9. **Animation.**
   - Added: staggered 1 px sway on the cast and a lamp flicker that drives the amber wash.
   - Not done: I did not add a head bob, because I could not move heads separately from the sprites.
10. **Performance.** See "Not fully met" above.

I disagree with one thing: the brief's step of hazing the upper storeys toward slate. I used cold dark brick instead, since the box-shaped haze showed hard edges and cost time.

**declined**

Did not haze the near houses' upper storeys: the box-shaped hazes left visible hard rectangle edges and cost about 3 ms, so I used cold night2 brick instead. Did not add a head bob, since heads cannot be moved separately from the sprites. Did not add a look-up face for the man, because no such face exists in the man sprite. Did not reach the 3 ms draw budget.

---

## agent

**changed**

Edited only /home/santi/dutch-arcade-wt/look/intro/panel-10.js. Not committed. Nothing was run at 3x or compared side by side for the final tweak beyond the t=3 and t=6 PNGs.

Notes addressed:
1. Helmet: I drew a new local one at about 27 px wide, twice the old size. It is a domed profile shell with 4 vent slots, a darker visor lip, a loose chin strap with a buckle on the cobbles, one amber specular pixel and a white shop price tag on a string. The tag is the never-used gag. It reads as a helmet at 3x, though it is still fairly low and flat.
2. Man and helmet: the man now faces right, side face, so his gaze sits on the helmet. The helmet is at x 134, a step in front of him. A sitting dog (look:'up') is beside it. The dog is a rough brown lump at 3x.
3. Focal point: the lantern moved to x 182, between the cast and the bike, drawn with light:false. A local cone and a pool glow fall on the helmet. The old 76 px glow is gone. The bike is darkened with a mul tint and overlaps the lamp. The moon is now r4 in the top right corner.
4. Sky seam: the full-width haze at y 40 is removed and the sky ramp has an extra mist2 stop. Stars are confined to y 2 to 40. A faint tonal band is still visible around y 60.
5. Far plane: houses are now solid dark (night1) with a few amber windows, the mill is a lighter solid tone (mist1), and one haze pass sits over them. The mill sails are still a see-through lattice, because that comes from windmill in art.js.
6. Staging: the baselines are staggered (man 164, helmet and dog 170, lamp 161, bike 163). Fat dark bollards crop the bottom-left and bottom-right edges.
7. Ground: cobbles now run to the bottom of the frame, and the full-width near water is gone. Puddles are three stacked water strips with a ragged edge, a lamp streak, and a small second puddle under the helmet.
8. Bubble: it no longer blinks. It holds for 4 s of the 8 s cycle (2.5 to 6.5 s) and is absent in the t=0 and t=1.5 frames.
9. Extra dressing:
   - a tall hunched zombie with glowing eyes sways on the drawbridge;
   - a tulip planter by the left house;
   - the sloep is longer, at len 42;
   - the modern lamp is back on the far quay.
   The cat in a window was not done.
10. Performance: draw time went from about 14 ms to 9.5 ms. This is still over the 3 ms budget. Profiling showed one haze pass over a large area cost about 7 ms. I cut the haze from 4 passes to 1 and shrank it, cut the cobbles to one hline per stone, and shrank the lantern glow. The rest is toolkit cost (canalHouse, glow, cone, sky, mist). Getting under 3 ms would need a prerendered background, which I did not attempt.

Disagreements and loose ends:
- I did not edit art.js, so the held helmet (man hold:'helmet', line 902) is still the white box. It should be brought in line with the new helmet.
- Not done: the cat in a window, a lit window with a cat, and 1.3 to 1.5x reeds in the foreground (fat bollards were used instead).

**declined**

The cat in a lit window is not done. Reeds at 1.3 to 1.5x in the foreground are replaced by fat bollards. The 3 ms draw budget is not met (9.5 ms; I did not prerender the background). art.js was not touched, so the held helmet in man hold:'helmet' is still the white box.

---

## agent

**changed**

Only /home/santi/dutch-arcade-wt/look/intro/panel-1.js was edited, and nothing was committed. When I started, the file was already a rewrite that covered most of the 10 notes (sails crossing the moon, trails, a far mill turning the right way, tall zombies, converging ditches, reeds, a dimmed duck and a 8 s loop). It benched at 3.16 ms, and its worst problems were a noisy field, a striped "pole" and a squiggle in the sky. What I changed:

- **Note 3, polder:** I rebuilt the field. The old Bayer dither between mist1 and green1 made a moire checkerboard. The field is now perspective parcels (11 bands, each a slightly different tone) in adjacent night/green steps, with a moon sheen and grass flecks near the viewer. The ditches still converge on the mill base.
- **Notes 4 and 8, striped pole:** The middle ditch was a 3 px amber-dashed vertical strip that read as a striped pole, which broke the "orange belongs to the hero" rule. It is now a dark wedge opening toward the viewer. It carries three short shimmering amber window reflections and a few pale ripple dashes.
- **Note 5, clouds:**
  - The squiggle over the moon is replaced by a lumpy cloud bank. It drifts in on a sin loop, veils the moon's lower half around t=3-4, and clears again, with a soft lit rim only near the moon.
  - I added two more static banks in the upper left.
- **Note 6, mill backdrop:** The pale backlight glow behind the hero mill now uses night7 with a small mist1 core. This removes the teal/green dither mud around the sails and keeps the cross reading as a clean silhouette.
- **Note 7, fingerpost:** The 'Molen' fingerpost moved from x=262 to x=277 so it no longer sits on a ditch.
- **Note 9, performance:** The cloud is drawn as column runs instead of per pixel. The bench is 2.54 ms/frame, down from 3.16.

Notes 1, 2, 4 (ripple dashes), 7 (reeds), 8 (duck, boat and warm pixels) and 10 were already satisfied by the file as I found it, so I left them alone. The rest of note 9 also held. The camera and cloud loops are seamless at 8 s, and the far mills are cached.

Final PNGs are the four t values (0, 1.5, 3, 6) listed in `pngs`. The shoot reported 0 console errors.

**declined**

I kept the two foreground zombies' greenish eye-glow tint at the head and did not chase it. It is the shared sprite's glow, I can't edit art.js, and it is minor. I also did not add a moored boat or more mooring posts to the ditches, because the existing corner posts already frame the shot and the extra draw would cost budget. Note 4's moon-reflection column was already replaced by broken ripple dashes, so there was nothing to change there.

---

## agent

**changed**

Starting point: /home/santi/dutch-arcade-wt/look/intro/panel-7.js was already a rewrite that fixed notes 1, 2, 3, 4, 7, 8 and 9 in part, not the version the director scored. It already had paper lit inside its own ramp, a large scrawled red question mark with a breathing core and a pencil pass, and a moon slab with a dog, mug and green lamp. Its pencil used steel and slate, the dip never fires at t=0, and the dust sits off the page. I then fixed what was still wrong when I looked at 6x crops, and left the rest as it was. I edited only panel-7.js and did not commit.

Changes this session:
- Notes 5 and 10 (ticks and crosses): the ticks and crosses read as an illegible smear, so I redrew them. DE rows now show a clean tick, hard-slashed, then a fresh tick, and de molen is slashed twice. HET rows show a struck-out X or a slashed tick, and the second marks sit only on het water. The marks no longer touch the words: DEX is 68 and HETX is 220. The red loop is drawn as two overdrawn passes round "het meisje" and given more room. A bold red "het?!" sits under it with a flick pointing down at it. Both "regel:" punchlines moved clear of the hands, with a red scribbled dash.
- Note 6 (hands): the fingers were thin combs, so I rewrote them as thick capsule fingers. Each has a lit top edge, a shaded underside, knuckle creases and a pale nail, and the left hand has a thumb. The cuffs stay orange4-7 with a lamp rim. The coffee ring now sits on the open left page (centre 134,146) and the right corner is clear.
- Note 8 (texture): two printed running heads were added as crisp text, "HOOFDSTUK 1" and "LIDWOORDEN", replacing bars. The body-text lines under the left page are slightly darker so they register.
- Note 9 (composition): the dog nose near-plane silhouette moved up from y=185 to 181 so its ears and eyes actually read. I removed a stray grey dither box around it that was tinting the page. The dog-ear corner was redrawn as a shaded flap with a fold shadow, and it no longer looks like an envelope icon.
- Note 7 (pencil): the pencil is now drawn after the moon slab, so it no longer dissolves into the grey. It is in mist/slate/steel only (no cheese ramp), with a red eraser.
- Note 4 (red flicks): I removed two stray red flicks on the left of the question mark that read as dirt.
- Draw time: 1.57 ms/frame, under the 3 ms budget. Console errors: 0.

**declined**

Note 9, tilting or rotating the spread a few degrees: skipped. The crisp text labels are hi-res and cannot be rotated, and nearest-neighbour rotation of the dithered paper would break the pixel grid. I used overlap instead: the dog's ears and the hands cross the cover and page edge, the dog-ear flap has a fold shadow, and the cropped mug stays as a big dark near-plane shape. No page curl was added.

---

## agent

**changed**

Only /home/santi/dutch-arcade-wt/look/intro/panel-9.js changed (not committed). It draws in 1.1 to 1.2 ms per frame (was 7.7 ms alone, 2.3 ms inside the all-panels bench), the loop is seamless (the t0 and t6 PNGs are byte-identical), and the console shows 0 errors. The file on disk was already a partial rewrite, so I rebuilt it on that base and checked each note against the current frame.

1. Darkness: the room is near-black and the brick is gone, except a few dithered pixels of reveal beside the frame. The only bright areas are the window and the floor slab.
2. High eyes: one pair only, at (267,48), 7 px apart, with no glow. It opens at t=2.0, blinks once slowly at 4.3 to 4.75 and stays open to 5.7, in eye4/eye3 with a 1 px eye0 bloom.
3. Focal point: the lit windows behind the head are gone. The sky is now a fog gradient (night4 to mist2) so the head reads as a silhouette. It is a flattened face with a pale nose line, ellipse sockets, a slack mouth that breathes, a moon rim and two palms with four fingers each on the pane. The moon sits left. The far skyline is flat and window-less: church, roofs and a turning mill. The head's eyes are 2 px wide and grow to 2 rows as it leans in.
4. Palette: no warm brick or wood remains. The only orange is the man's jacket edge, and the only yellow is the eyes.
5. The man: he sits on the floor, almost all black. He has a sliver of orange4 down the window-facing shoulder and sleeve with an orange6 collar tip, a cold slate3 edge on the top of his outline, and a shine in one eye. There is no rim on his face.
6. Light geometry: the wall cone is gone. The slab is now the real projection of the thing at the glass, using one shape source and a stretched floor-to-window mapping. It shows the mullion cross-bar, the vertical mullion, the curtain edge and the body, neck, arms, fingers and head as shadow. The head shadow reaches his feet and grows as it leans in. Floor boards darken inside the light.
7. Artifacts: the rectangle tint is gone. Board seams converge on a vanishing point and fade out at the right. Dither is limited to the slab edges and the sky seams. The "E"-shaped window glyphs and the sheen lines are gone, and the glass veil band is removed.
8. Dogs: the eyes are tied to each head's anchor, with paper6/steel4/teal eyeshine and no yellow. The dogs are black cut-outs with a faint cold rim (dog A in the slab, dog B in the dark), and both lift their heads toward the high pair from 3.4 s.
9. Escalation (6 s loop): black, then dog A (0.8) and dog B (1.2), the head's eyes (1.0), the man's glint (1.6) and the far watcher at the mill (1.4), then the high pair (2.0). The thing leans in and its palms slide from 1.0 to 5.7. The head's own blink is at 2.9 to 3.2. The dogs look up at 3.4, and the high pair blinks at 4.3 to 4.75. The shared blink starts at 5.7 and every eye stays shut until 0.8, while the lean eases back in the dark. Dust is down to 7 motes, in the shaft only.
10. Performance: the window background and the lean-stepped slab shadows are baked once and blitted. The big glows and the per-pixel floor loop are gone, and the dogs, man and thing are drawn from a few primitives.

Disagreements and judgement calls:
- Note 8 asked for the near-black dogs to stay recognisable. They read as faint rim lines, which I think is right for dark-against-dark. At 1x the sitting dog looks a little scribbly, but I left it so the eyes stay the tell.
- Note 3 said to put the head against the moon. The head partly overlaps the moon's halo but stays beside the moon, because the slab's rightward skew needs the light coming from the left.
- Note 6 asked for a cross-bar shadow on the floor. I implemented it, but it is hard to spot because the body shadow dominates the near floor.
- The window is the brightest area. That keeps the head readable, but it is brighter than a strictly 85% black frame would be, so lower the window's sky stops (night4, mist1, mist2) if you want it darker.
- Not done: the fog wisps behind the head are almost invisible, and I did not use A.mist because it does not loop in 6 s.
- The `bench` run prints one console error line in the all-panels run ("PROF haze..."). That comes from other panels, not from panel-9.

Final PNGs (all at /home/santi/dutch-arcade-wt/look/intro/out/): panel-9-t0.png, panel-9-t1.5.png, panel-9-t3.png, panel-9-t4.5.png, panel-9-t6.png.

**declined**

Not done, as declined above. A wall cone, brick or any warm interior was not restored. I did not draw a separate cross-bar shadow beyond the projected slab. I did not use A.mist for drifting fog, because its loop does not fit the 6 s panel loop. I did not touch art.js or any other panel.

---

## agent

**changed**

Rewrote only intro/panel-5.js (/home/santi/dutch-arcade-wt/look/intro/panel-5.js). Not committed; git status also shows other agents' panel files, which I did not touch. Per note:

1. Depth. The right third (x 222..320) is now a canal vista in layers. Far: a church spire and a step-gable house on a moonlit fog glow, with haze over them. Mid: a gabled house with lit windows, an arch bridge with railing and lanterns, and a far quay. Front: the mill turning anticlockwise (-t), a moored barge with lit windows, reeds and mist. The canal mirrors the bank. Nothing hidden is drawn any more; the old church, mill and houses were being covered by the wall.
2. Timing. The beat was already in the file (Hoi alone to 1.1 s, blink to 1.4 s, then the English line). I kept it. The man goes talk/smug, then blink, deadpan, and worry at 3.6 s; the friend goes smile, then talk, then drink. The patrons raise their glasses when the English line arrives.
3. Hero. He sits on a dark chair in front of dark brick and the dark door, so the orange jacket is the clearest shape. I did not add a cool rim: the sprite API only rims toward the key light, so that was too fiddly.
4. Everyone being nice. Window patrons are now two friend sprites (one waving, one drinking), two local patrons (bob and scarf, eyes on the door, raising glasses) and the barman, all beaming.
5. Staging. Partly done. The man sits at the table, the candle is the shared light between them, and the two dogs lie under the table with the table shadow planting them.
6. Wet ground. Long, thin, broken amber bars run from the kerb to the bottom edge under the window, door, lantern and candle. The puddle reflects the candle, the jacket and the friend's sweater. The canal gets a lantern streak.
7. Dither. Dropped the haze and gradient dithering over the neighbour houses and the screen-door effects. Dither remains only where light falls off: sky seams, the lantern and window glows, and one fog haze.
8. Palette. The awning is now red1 with paper2 stripes, and the CAFÉ lettering sits on a dark board.
9. Mist over the feet. Mist is drawn before the cast, and every figure has a contact shadow.
10. Performance. 28 ms went down to about 2.3-2.7 ms in a quiet run. The load average was about 15 when I last measured (other agents running), and the best of 30 blocks was 2.85 ms. The method is to paint the vista and the café wall once per camera offset (a handful, from the 5 px drift) and copy them back each frame. Only moving things are redrawn per frame: the mill, mist, water, patrons, pendants, people, candle and reflections. The upper-window glow, the moon halo, the per-window house glows and the oversized brick passes were dropped or moved into the cached layers.

Disagreed or only partly done:
- Camera push-in to 50 px heads is not possible. The sprites are fixed-size bitmaps (the man is about 35 px, the friend 46 px) and the API has no scale, so I made the faces readable through staging and lighting instead.
- The friend stays standing because the friend sprite has no sit pose. He stands over the seated man, which also helps the deflation.
- Bench figures on this machine swing between about 2.5 and 7 ms with the load, so re-run `--bench` when it is quiet.
- The cat-eye blink in the upper window is lost, because that window is now cached.

**declined**

Camera push-in to about 50 px heads: sprites are fixed-size bitmaps with no scale option, and I may not edit art.js. Friend sitting at the table: the friend sprite has no sit pose, so he stands and the man sits. A cool rim light on the hero: sprite rims point toward the key light only, so I used a dark chair, door and brick backdrop for separation instead.

---

## agent

**changed**

Rewrote /home/santi/dutch-arcade-wt/look/intro/panel-10.js (the only file touched, not committed). Draw time: the original measured 10.7 to 12.3 ms/frame. The new one measures 1.5 ms at best (min of 8 batches of 100 frames, 1.5 to 2.0 ms across the min-of-batch runs). The machine had load average 32 to 37 on 12 cores from other agents, so a single `--bench` run read 2.1 to 5.5 ms; on a quiet machine it should sit under 3 ms.

How it got fast (note 10): everything static is painted once into a cached buffer and copied back each frame. Static means the sky, haze, houses, drawbridge, cobbles, bike, lantern light, helmet and the near frame. Fingerpost text labels are cached and re-pushed each frame. The mill sails are 16 pre-painted frames of the mill's patch (the sails repeat every quarter turn, and the 16 frames are built a few at a time over the first draws). Only moving things are drawn live: canal water, boat, reeds, duck, far zombie, mist (now an 18 px band), man, dog, puddles, moth, bubble. First draw costs about 15 ms once, to build the cache.

Notes, in order:
1. Helmet: new 28 px profile helmet at about 2x the old size, with a dark outline, an aero dome shaded from crown to rim, four vent slits, a dark glossy visor lip, a red stripe along the rim, a dark hollow under the shell, and an amber glint on the crown. A loose chin strap with a steel buckle trails on the cobbles. The shop tag is still on a string, with "€59,95" as crisp overlay text (drawn through A.text, not into the pixels). I first had vents running along the dome and it read as a face (two slots as eyes, the red stripe as a mouth), so I changed them to vertical slits.
2. Relationship: the man faces right toward the helmet, which now lies 28 px from him by his feet. A brown dog sits beside the helmet, facing left and looking up at him. A deadpan beat times the joke: a slow blink at 2.7 to 2.95 s, then silence.
3. Focal point: the lantern (x=162, h=62) now stands between helmet and dog. A visible cone falls straight onto the helmet like a spotlight, with a warm pool around it. The bike stands behind the lantern in half-light, and the lantern post overlaps it. The moon is shrunk to r=3 in the top-right corner.
4. Sky seam: the haze now starts at y=20 with top 0 and ramps in. Stars only sit in the clear top (y<34, clear of the moon). No seam remains.
5. Far plane: the mill and church are solid shapes (cloth sails, tone night2), a step lighter than the houses (night1), with haze after each layer and a few amber windows.
6. Staging: depths are staggered (bike y 160, man 160, lantern base 161, helmet and dog 170, modern lamp on the quay edge at 143). The lantern overlaps the bike, and the near-left house frames the left edge. Big dark cropped bollards sit at the bottom left (a pair with a chain) and bottom right.
7. Ground: the near quay is cobbles all the way down, in perspective with bigger stones toward the camera, and pale wet-sheen dashes. The full-width water rect is gone. Three small puddles mirror the man, the helmet and dog, and the lantern and bike, with lantern and helmet streaks. These use a local puddle function.
8. Bubble: "nee." shows from 3.0 to 7.0 s of the 8 s loop, after a silent beat and a blink. It never strobes, and it is visible in the t=4 frame.
9. Dressing: a bare-headed tall hunched zombie with glowing eyes walks to and fro on the far drawbridge. A lit barge replaces the sliver of a sloep and has window reflections. Also added: a tulip planter by the left house, a lit window with a cat in the left house, a duck, a pair of clogs by the bike, and the modern lamp moved back onto the quay with a cold cone and a streak in the water.
10. Performance: see above. The lantern pool is now amber7 cone and amber6 glow rather than rust-brown dither, though dithered amber over cold slate still reads slightly warm-brown near the dog.

**declined**

1. Bringing the held helmet in art.js (man hold:'helmet', line 902) into line: the task says edit only my own file, so I did not touch art.js. The helmet recipe is helmetBody and helmetTrail in /home/santi/dutch-arcade-wt/look/intro/panel-10.js (28 px, facing right); it could be moved into art.js and then scaled down for the held version.
2. Camera drift: I dropped it for this panel, because it forces a re-render of the cached layers per offset. The bible calls drift optional.
3. Window flicker on the far houses: dropped, because it lives in the cached layer. Lamp dips, star twinkle, mill, water, mist and the zombie still loop.

---

## agent

**changed**

Rewrote only /home/santi/dutch-arcade-wt/look/intro/panel-8.js (not committed). The file on disk was already a partly revised version, so I rebuilt it around your ten notes. Notes 1-8 and 10 are addressed; note 9 is mostly addressed (see last line).

1. Beat and loop. The word is now the first beat.
- 0-1.5 s: his mouth emits amber motes to the word. A fog glow gathers over open sky and clears from the centre. The text is drawn as two blurred ghost copies that close into one word while its colour warms from fog-grey to gold.
- ~1.9-3.3 s: a 12-mote thread runs from the word to the window.
- 3.3 s: the window catches with a flicker plus a spark, then stays lit. It only fades once the fog is above 50%, so it is never dark in the open.
- Loop seam: the reset hides under a soft mist pass. That pass is now a smooth 'mix' fog (fog() helper) plus two drifting mist bands, instead of the old regular screen-door dither. Frames t=7.95 and t=8 are almost identical.
- Loop hygiene: the camera now drifts out and back in exactly 8 s (4 px). The mist sways out and back via a ping-pong time. The mill turns exactly a quarter per loop (sails repeat every PI/2). Every other motion uses periods of 8, 4, 2 or 1 s.

2. Dark street.
- The near row is night1/2 silhouettes with rim light only, no window grid, and four small dead windows of different sizes.
- Lantern is dead, house 232 is lit:0, and the cart has no glow and a heavy tint.
- The signboard text is dimmed to mist3 and fades out under the mist pass.
- The only warm notes are the word, its bike icon, the book glow, the motes and the one window.

3. Word placement and halo. It sits over open dark fog at (206,66), away from any house or pole. The halo is now an 'add' glow: amber5 at 26 px with a tighter amber7 core at 12 px. It reads as a gold lamp, not a green-white moon. I also added the small bicycle line icon from reference E under the word.

4. Bridge. night3 tone with graded haze on top, so it recedes. The frame and counterweight beam read. One hunched walker (night1, 26 px) stands mid-bridge with two eye pixels. The house and lamp bloom are removed from that box.

5. Bonnet neighbour. She is a new local sprite, neighbour(), nearer at x=228. She is a dark, thin, hunched silhouette with a pale bonnet cap and flap (not ears), yellow eyes, and a cyan phone raised to her face. When the window lights she lowers the phone and her eyes flash amber for a blink. That is the gag.

6. Hero and the two dogs.
- He is orange against the dark brick.
- The motes arc from his mouth to the word.
- The grammar book lies OPEN in the basket and its glow grows as the word returns.
- Two dogs: the brown one sits at the wheel looking up at the word; a black one sits looking up at the window.

7. Depth.
- Quay climbs toward the mill.
- Cobbles are bigger toward the bottom.
- A bike leans in the dark by the signpost.
- Two foreground bollards with red bands.
- The dead lamppost cuts the frame.
- Reeds in both corners.

8. Wet ground.
- The text-echo and the grey bar are gone.
- The water starts below the cast's feet, so it no longer eats the dog and zombie feet.
- The puddle is a mirror with a broken amber echo of the word.
- Reflection streaks are my own amber shimmer. NRART.streak 'add' turned dark pixels into brown-green blobs, so I stopped using it.

9. Sky. Five stops with the blend equal to the segment length (26 rows), so the sky dithers continuously into the fog. I also replaced the hard-edged haze rectangles at y 70, 90 and 96 with top-to-bottom ramps. Remaining: the far bank band at y 124 still shows a visible edge.

10. Performance and hygiene.
- The never-moving layers are painted once per camera offset and copied back each frame, so about 10 distinct cache keys.
- Local cheap versions of glow, fog and mist with precomputed falloff and noise tables.
- The mill is drawn once per angle into sprites (48 steps), then blitted.
- Removed the PROF console.error that made the bench report an error.

**declined**

Nothing declined. Differences from the notes:
- The mill is at x=296 instead of 288, and the zombie and bonnet are drawn after the cached backdrop. Cached layers can't sit behind a moving sprite, so the sails now only just touch the bridge end at 266.
- Note 8 asked to drop the reflection or draw it flipped. I dropped the text echo, and the puddle keeps a ripple-broken amber pixel echo of the word instead of a flipped copy.
- The bonnet neighbour is local code, not the shared zombie sprite. With a single tone, the shared sprite's bonnet wings read as antlers and the body as a post.
- The first loop still builds about 10 cached backdrops at about 15 ms each. They are not pre-warmed in idle time, so you may see a few slower frames the first time panel 8 plays.

---

## agent

**changed**

Rewrote /home/santi/dutch-arcade-wt/look/intro/panel-6.js from scratch. It is the only file I changed, nothing is committed, and I deleted my temporary profiling scripts. The last clean draw time I measured was 2.99 ms, down from 41 ms. After that I removed a house, narrowed the gradients and swapped the street lamp for a cheaper local one, so it should be lower now. I could not get a clean bench afterwards because host load rose to 30-60 from other workers.

How each note was handled:
1. Three dogs became two. A brown dog lies on the sofa with its chin on his knee, and a dark dog with a white bib sits at his feet on the rug. Both have their eyes on his face. On his talk frames (t%4<1.4) both tilt their heads together: ears go up, the brow lifts, the muzzle raises, and the tails thump. The shared dog sprite cannot tilt its head, so the dogs are drawn locally in the file.
2. The book is now the hot spot. It is a 3/4-view cover of about 43x14 px with a gold title band, a visible dust layer and a still-on price sticker. The coffee cup stands on it as a coaster with a ring stain beside it. A shrink-wrap glint sweeps across every 4 s, the glow pulses, and the cover lifts 1-2 px at the start of every 6 s and then drops back. The lamp shade is dimmed to amber1-3, and the table is now a dark low slab with a lacquer smear.
3. The man now sits in side view facing the dogs. I added a lecturing arm with a raised finger, drawn locally because the sit pose ignores arm. His other arm rests on his knee, and his mouth moves on talk frames. He is still a small 40 px sprite. I did not scale him.
4. The menace outside is fully visible. The window now reaches down to the sill with a high transom, and the sky is pale fog so silhouettes read. The far houses and church are pushed back, small and hazy. A windmill is fully visible in the left pane, turning anticlockwise a quarter turn every 8 s. A wet street has an amber street lamp with a cone and streak, and a hunched bucket-hat zombie stands close to the glass with glowing eyes. I used the shared zombie sprite, not tallWoman. I added a handprint smeared on the glass instead of a hand pressing the pane, because the zombie walks past in profile.
5. Palette discipline. The red curtains became slate, the red rug became night slate, and the red tulips and orange cushion are gone (the cushion is now slate). The only warm things are the dimmed lamp, the book and its glow, one yellow chewed clog, and the street lamp outside.
6. The wallpaper is now flat night3 with a sparse one-step stripe, and the lamp cone is a small low-strength shape.
7. The orange streak that dripped through the table apron is gone, replaced by a short horizontal lacquer smear on the tabletop. The window's cold light is now a hard-dithered pool on the floor with a mullion gap, and the watcher's stretched shadow is cast into the room in floor colour.
8. Small props. The spider-claw plant, the bread-roll clogs, the grey bowl and the mountain landscape are cut. A Delft tile with a tiny turning windmill replaces the landscape, as a deliberate joke. The only new prop is the chewed clog as a dog toy, in the open on the rug.
9. Animation. Beyond the synced head tilts, ear perks and tail thumps, the book pulses, glints and lifts. The outside mill turns, the street lamp flickers and the zombie's eyes blink via the shared sprite. Steam, dust motes in the book glow and dust in the lamp light also move, and the camera drifts with parallax at three depths.
10. Composition and cost. The camera is lower, with the table and book at depth 1.35 in the foreground, the man and dogs in the midground, and the window with the watcher as the cold back plane. The cost fell mainly from three changes: the big radial glows and the cone are now cached light fields (cfield and cglow in the file), the dog and furniture shadows are cheap dithered rows, and the full-frame vignette is replaced by thin edge dithers. The remaining cost is mostly full-frame rect fills plus the shared mill and houses.

I looked at t0, t1.5, t3 and t6 after the last edit, plus 6x crops of the dogs and the window earlier. The t1.5 frame is a talk frame with the dogs tilted.

**declined**

I kept the man at his normal 40 px sprite size. Scaling him would break the shared cast, and the orange jacket plus the dogs' synced tilt carry the beat. I replaced the idea of a hand pressing the pane with a smeared handprint, because the zombie is in profile. I used the shared zombie sprite rather than tallWoman, because the bucket-hat silhouette reads better against the pale fog. I could not confirm the final 3 ms budget on a quiet machine because host load stayed very high, so my last clean reading was 2.99 ms before the final trims.

---

## agent

**changed**

Rewrote /home/santi/dutch-arcade-wt/look/intro/panel-3.js (only file edited, not committed). Before I started, the file on disk threw 'unknown colour paper7', so it drew nothing. I fixed that and repainted the panel. The ten notes:

1. Mood: fixed. The brown wash is gone. Amber is now three pools, one per bulb, at about half the old radius and 0.22-0.34 strength. Wall and brick are night2/night1 (blue-grey), with real night0 vignetting in the four corners.

2. Mist: fixed. A drifting mist band crosses the wall in front of the frames. The wall also dissolves into fog toward both edges (x 0-76 and 244-320). The far skyline is now visible above the wall (the wall top is at y 39): church, gabled houses and a dark windmill whose sails turn anticlockwise.

3. Tourist: fixed with a new local sprite, not the friend. He has a cream sunhat with a blue band, a rucksack, a loud shirt, khaki shorts and white socks. His head is thrown back with a wide open mouth, squeezed eyes and tears, and both hands are on his belly. The camera hangs on a strap on his chest. The flash fires for 0.3 s every 2.5 s: a bright star on the camera plus a blown-out board. The 'drunk German!' bubble now has a tail to his mouth.

4. Poll: fixed. Vlaams is a black/yellow/red striped bar with a paper outline, a big white crown and '87%'. NL is a 3 px grey-blue stub with '13%'. No orange is left in the poll. The loop is now eased with a hold, from 30% to 100% and back over 12 s, so it wraps seamlessly. The bars start growing at t = 0, so the joke plays out within the first two seconds.

5. Composition: fixed. The triptych is broken. The cheese is the big hero board, the poll is smaller and lower, and the tourist board is cropped by the right edge. Pinned papers, an owl poster, a 5G poster and a polaroid overlap the board edges, some of them tilted. A red string runs through nine pins and ties the rumours together.

6. Clippings: fixed. They now carry real headlines: OOSTENRIJK?, 'Ik spreek liever Engels', TIKKIE?!, HAGELSLAG!, an owl with a red X, 5G!, and a polaroid with eyes in the dark. 'GERUCHTEN' is a centred torn-paper banner across the coping.

7. Ground: fixed. It is cobbles in slate with shaded joints, with puddles only (3 water patches). The three bulb streaks stay. The black bar and the hard slate5 ledge are gone. The ledge is lower (y 131), so the hero's head clears it.

8. Tangents and wires: fixed. Each bulb wire hangs from a steel bracket under the coping. The moon moved to x 148, so it is not above any wire. The far layer is a readable skyline with a readable mill.

9. Dither and mould: partly done. The tourist window and the checkerboard cheese disc are gone, and the three board backdrops are flat colour with dither only at the seams. The glow pools are still dithered (5 levels). The mouldy cheese is bigger: furry white-edged blue-green blooms, a cut slice with veined insides, and a '1987' tag. The stink lines are thicker, wavy 3 px lines that fade as they rise, and the flies are 2 px. The spray can is cut.

10. Animation: fixed. The poll loops as described in note 4. The hero turns between poll, cheese (pointing arm), poll and tourist (worried face) on a 12 s loop. The hat zombie creeps and sways. The phone zombie has a pulsing cyan phone glow and says 'tikkie?' every 6 s.

Performance: this needed a different approach. The old draw was dominated by 24 calls to A.glow, 12 of them window glows inside the canalHouse far layer (per the profile). I now paint the static parts (skyline, wall, boards, exhibits, clippings, baked pools, vignette, edge fog, cobbles, parked bike) once into a cache and copy it back each frame. Only animation, light, fog and sprites run live. The local light and fog loops do not use the sqrt/pow of the shared ones. Static words are recorded at build time and replayed each frame.

I could not get a trustworthy absolute number, so the 3 ms budget is unconfirmed. Machine load average was 50-57 from parallel agents, so --bench read 6-10 ms. Timing the old and new draw back to back in the same page, the new one costs about 8-10% of the old. If the old version's quiet-machine cost was about 22 ms, as the director measured, that puts this one at roughly 2-2.5 ms. Please re-run `node intro/shoot.mjs all --bench` on a quiet machine to confirm.

Disagreements and deviations:
- Edge fog and vignette are baked into the cache rather than animated. The moving mist bands supply the motion, and this saves about 0.3 ms.
- The windmill's own window glows are off (lit:0) for speed.
- Bulb sway is dropped, but the flicker stays live.
- Text on the hi-res overlay is not fogged, so the clippings' words stay crisp at the foggy edges.
- 'Ik spreek liever Engels' sits on a two-line scrap rather than one line.
- The red string is drawn crisp in front of the fog. I judged that clearer than fogging it.

**declined**

None of the ten notes was declined; the departures are listed under 'changed'. No other file was touched. I did not commit. Scratch scripts for profiling are only in the scratchpad directory (p3-*.mjs).

---

## agent

**changed**

I rewrote scene-street.js and addressed all ten notes. Disagreements and caveats are under "declined".

1. The beat now reads in one second. His open front door is the key light (A.key at the door, not a lantern). It sits at x=222-238 in the near house at x=210-250, and a backlit silhouette of the man stands in it, deadpan with one arm up. A dithered amber spill runs from the door base over the pavement and the wet road, and the dogs and the man stand in it as warm-rimmed silhouettes. The brown dog stands facing the door with the leash in its mouth, the leash handle loop on the ground. The grey dog sits on the other side of the door looking up at it, so the dogs flank the door and both look at it. The omafiets leans on the next house.
2. Amber is now rationed. The near terrace is darkened to nearly black. I removed the three shopfront strips and the 70 lit windows. The only warm things left are the door, his lit upstairs window, the living-room window by the fence zombie, a cat window on the third house, and two lanterns with a pair of far lamps. The moon is smaller, with a barely visible halo, and dimmed through a palette lookup.
3. The houses are now 7 brick terraced houses of 3-4 storeys with different heights and 5 different gable shapes. They have 2-3 bays, shutters on some, drainpipes, stone bands, doorsteps, fanlights, a tulip pot on a sill and a hoist beam. The white gable trim is gone, replaced by a one-step-lighter coping line.
4. The fence zombie is now a near-black silhouette (tone night0) with two crisp glowing eye pixels, no glow:1. It peers against the lit living-room window (concept D), and its hands hook over the top fence rail.
5. The wet street has a mirror puddle under the dogs that reflects them and the spill. The reflection streaks are now painted in the amber ramp, so they no longer read as brown rust. They run under the door and the left lantern. The lamp cones are stronger, so shafts show in the fog.
6. Depth is rebuilt. The near haze is gone, replaced by a dark wash on the terrace. The mill is redrawn with a lighter fog behind it so the sails read as silhouettes. The drawbridge is half raised, with a portal, a balance beam with counterweight, a chain, and the leaf up in the fog. A lit canal runs under it. Two far zombies (32 and 34 px, hunch 0.4) cross the end of the street on a seamless 8 s wrap, one each way, passing behind the end houses.
7. The animation is richer. The brown dog stands with a fast wag and an impatient paw-tap, and the leash sways. The flag now hangs from a steel wall bracket with a 1 px wave loop. The door light flickers, and the mill, the far zombies, the mist, the lantern flicker, the tulips and the puddle ripples all move.
8. The draw time is down from about 28-33 ms to roughly 2.5-2.9 ms (details under "declined").
9. The grey dog now sits in the door's light as a warm-rimmed silhouette with its coat darkened a step. The book has a paper-edge line.
10. The sky is a 7-stop gradient dithered over 12 rows, so there is no letterbox bar. The clouds are broad and low-contrast, with a soft pale horizon behind the mill.

Performance approach. The static stack (sky, far fog, far houses and bridge, terrace, ground) is drawn once into five padded transparent layers, and each frame copies them back with their own parallax shift. The lights are cached as (pixel, level) lists per camera offset. There is a faster local mist and a simpler mill whose body is static and whose sails move.

Palette: 102 colours before; I did not recount. The frame is still crisp, with no alpha and no anti-aliasing.

**declined**

Measured draw time. The shared machine was at load average about 57-60 during my runs, so `--bench` read 10-18 ms/frame, as did every other piece (dyke 30, square 57). I therefore timed with min-of-batches and a fixed calibration loop. That gives about 2.5-2.9 ms/frame for the scene, including about 0.3 ms of blit, against 4.8 ms for the first cached version under the same method. Please re-run `node intro/shoot.mjs scene-street --bench` on a quiet machine to confirm it is under 3 ms.

Seamless loop. Seamless on the 8 s loop: the camera, mill sails, far zombies, flag, door flicker, leash sway and paw-tap. Not seamless: blinks and the fence zombie's sway, which use art.js's own periods. They are tiny and I left them.

Limits of the cached layers. The windows inside the cached layers no longer flicker per window (I dropped it). Far houses and stars also lost some per-frame motion: the stars still twinkle because they are drawn each frame, but the clouds are static.

Notes I answered differently:
- Note 1: the spill is a dithered cone plus an elliptical glow rather than a hard trapezoid, and I drew the man as a silhouette rather than using his full colours.
- Note 6: the far zombies cross sideways behind the near houses rather than walking straight toward the camera. A side-on view cannot show true depth, so I used staggered depths and heights.
- Note 5: the puddle mirrors the dogs and the spill rather than the door itself, because the door's reflection would fall below the frame.

Cleanup: the temporary profiling scripts and crop images were deleted. `git status` also shows modifications to the other panels and scenes, which are not mine (this worktree is shared). I edited only scene-street.js and did not commit.

---

## agent

**changed**

Panel 4 (/home/santi/dutch-arcade-wt/look/intro/panel-4.js) is rewritten from scratch as a true one-point-perspective street; nothing else in the worktree was touched and nothing is committed. The "3.5/10" notes did not match the committed file, so I rebuilt against the notes rather than patching. Every frame I shot loads with no console errors.

1. Composition. A real projection puts the vanishing point at (200,108): a wet road with a dashed centre line, kerbs and pavement joints, left gabled houses (step, bell, neck, spout, roof) as perspective facades behind a picket fence and hedge, and a big airy tree, bike and tulip planter in the near-left foreground. On the right is a canal with reeds, a quay railing, a far bank and a small arched bridge. Lamps step down the kerbs, six of them alternating sides. The mill and a church spire sit at the vanishing point, and the mill sails turn anticlockwise.
2. Words go into the mist. Only near words (d < 4.9, about the first 2 s) use overlay text. They are born at size 6 and grow in with their glow ramping up. Past that they are written into the pixel buffer with a local 3x5 pixel font that shrinks through 5/4/3/2/1 px letters and fades amber7 to amber5 to mist5. Fog clouds are drawn over them, and they dissolve instead of popping.
3. Reflections. The reflection text is deleted. Under each word there is now a ground pool plus a wet streak built as a soft column, so the streaks no longer read as thin orange worms.
4. Cast. The shared friend sprite is gone. Four local back-turned silhouettes with different coats: two at 22-23 px at the pavement edges, two far ones at 8 and 11 px. Phones sit at the ear or chest with a cyan underglow that pulses. "sorry, English?" now points at the talker's head, not his hair.
5. Story (16 s loop). 'hallo?' drifts up to a talker, gets "sorry, English?", droops and leaves. 'gezellig' goes first and the windows go dark behind it, flickering as they die. 'de' and 'het' leave as a pair with a visible nudge. 'doei' is the smallest and last: it rises to the vanishing point, bobs like a wave, then the mist closes. The windows relight in the last second so the loop restarts clean.
6. Lighting. The moon is deleted. Facades are hazed to blue-grey, and far windows are dim. The key light follows the lead word and so does the rim light on the talkers. Windows are on or off by a "dark front" that trails the lead word, so about 2-3 houses visibly go dark in the first few seconds.
7. Palette. The rust-coloured ground glow is gone, replaced by tight lamp pools, soft wet columns and a few puddles.
8. Skyline and props. The mill is no longer hidden behind a house and the church spire is visible. Props added: tulip planter, arched bridge, bollards, bike, and a fingerpost with 'Nederlands' pointing left toward the street and the words and 'Engels' pointing right.
9. Bugs. No camera drift, so the edge strip is gone. Every ground strip and polygon spans the full frame. The per-talker haze rectangles and the vignette call are removed.
10. Speed. The street, houses, lamps and water are painted once, twice in total (windows dark and windows lit), and cached. Each frame copies the cache, switches windows by copying their pixels, and draws only what moves. The per-frame glows use a cached-field glow and a custom wet streak, and the bubble text widths are measured once.

**declined**

1. I dropped the camera drift. It conflicts with baking the scene once, and drift was the cause of the edge-strip bug in note 9. The panel still moves through the words, mist, sails, windows, lamp shimmer and canal glints.
2. Draw time is not proven under 3 ms. The machine was at load average ~45-57 during the work, so `node intro/shoot.mjs panel-4 --bench` read 6.4 ms/frame, and panel-7, which was 0.59 ms earlier, read 2.3-4.2 ms in the same runs. Measured as renderer CPU time against that panel-7 baseline, panel-4 costs about 1.2-1.9x panel-7, so I estimate roughly 0.7-1.1 ms per frame. The 10-glow, 11-haze, two-mist stack from the notes is gone from the per-frame path. Please re-run `node intro/shoot.mjs all --bench` on an idle machine to confirm.
3. The first frame of the panel does the one-off cache build, which is a one-time hitch of an estimated 100-200 ms (first measurement, under load: 890 ms CPU against 480-660 ms for panel-7, which also builds a cache). I left it rather than trade away the window switching.
4. I did not add a second bike or railing bikes, to avoid clutter. There is one bike. I also dropped the moored boat I first placed, because the fingerpost hid it.

---

## agent

**summary**

Verified the committed foundation on branch look in /home/santi/dutch-arcade-wt/look and fixed the one defect it had. Checks: read reference/CONCEPT-ART.md and all four reference PNGs; read ART-BIBLE.md; `node intro/shoot.mjs all 2` renders all 19 pieces (14 panels + 5 scenes) with console errors: 0; `NR_URL=http://localhost:8768/index.html node qa/run.mjs intro` reports errors: 0; all 14 panel text/nl strings match /home/santi/dutch-arcade/STORY.md verbatim; index.html wiring is correct (pix 320x180, pixhi 1280x720, NRART.panels used when all 14 exist with PANELS fallback, label scale = pixhi.width / pix.width, showLevelIntro prefers NRART.scenes[theme], NRART.labels cleared before each draw and drawn on pixhi after); intro/out/ is gitignored. Bench (`--bench`): 18 of 19 pieces at 0.6 to 2.8 ms/frame; scene-shops was 5.97 ms alone (13.6 ms when benched last in the all-run). Cause: scene-shops' local pool()/cone() helpers passed raw t-dependent strengths (the phone pulse) straight to NRART.lut, creating a new 256-entry table every frame (222 distinct keys over 200 frames) and growing the cache for as long as the intro ran. Fix (3 lines): /home/santi/dutch-arcade-wt/look/intro/scene-shops.js rounds strength to 1/20 like the toolkit's own levels(); /home/santi/dutch-arcade-wt/look/intro/art.js clears lutCache at 4096 entries. Result: shops 5.24 ms/frame, 42 keys, only the phone-glow pixels moved (1467 of 582720 screenshot pixels, all inside the phone bbox); contact sheet and harness re-run clean.

**spriteApi**

window.NRART (intro/art.js, classic script, 320x180, palette-indexed buffer, no anti-aliasing). Entry: NRART.paint(ctx, draw, t) runs draw(g, t) and blits; NRART.labels is the crisp-text list, NRART.drawLabels(ctx, labels, k) renders it on the hi-res canvas. Registration: NRART.panels[i] = { text, nl, draw(g, t) }; NRART.scenes[name] = (g, t) => {}. Primitives (g first, colours by ramp name+step e.g. 'amber5'): px(g,x,y,c), rect(g,x,y,w,h,c), hline(g,x,y,w,c), vline(g,x,y,h,c), line(g,x0,y0,x1,y1,c,thick), disc(g,cx,cy,r,c), ring(g,cx,cy,r,c,th), ellipse(g,cx,cy,rx,ry,c), poly(g,pts,c), ditherRect(g,x,y,w,h,c1,c2,level), ditherGradient(g,x,y,w,h,c1,c2,dir), ditherDisc(g,cx,cy,r,c,level,soft,c2), sky(g,stops,y0,y1,o), stars(g,t,o), moon(g,x,y,r,o), glow(g,x,y,r,o), cone(g,x,y,angle,spread,len,o), haze(g,x,y,w,h,o), mist(g,t,y,h,o), tint(g,x,y,w,h,color,amount,mode), shadow(g,x,y,rx,ry,strength), water(g,x,y,w,h,o), streak(g,x,y,len,o), rain(g,t,o), brick(g,x,y,w,h,o), tiles(g,x,y,w,h,o), window(g,x,y,w,h,o), windows(g,x,y,o). Light/depth: key(g,x,y,k), camera(g,t,{x,y,period}), depth(g,d), begin(g)/end(g,rim,rimColor) for rim-lit sprites. Text: text(x,y,str,color,size,bold,o) records a crisp label (o.align, o.shadow); bubble(g,x,y,w,h,o) with o.text and o.tail; say(g,x,y,str,o). Helpers: hash(a,b), wave(x,period,seed), bayer(x,y), lut(mode,c,s), col, step, C, RAMPS. Cast: man(g,x,y,{facing:'front'|'right'|'left'|'back', pose:'stand'|'walk'|'ride'|'sit', t, face:'deadpan'|'worry'|'smug'|'talk'|'shock'|'side'|'blink', arm:'down'|'wave'|'point', hold:'phone'|'book'|'helmet'|null, grip, pedals, floor, seed, rim}); dog(g,x,y,{coat:'brown'|'black'|'golden'|'grey', pose:'stand'|'walk'|'sit'|'lie', facing, t, seed, look:'ahead'|'up'}); zombie(g,x,y,{variant:'plain'|'hat'|'bonnet'|'cheese'|'phone'|'woman', t, seed, facing, pose:'stand'|'walk', height:50, hunch:0..1, carry:'cheese', clogs, socks, hair, shirt, pants, tone, eyes, glow, rim, shadow}) returns {head, hand}; tallWoman(g,x,y,{t,seed,facing,phone}); friend(g,x,y,{t,face,arm:'wave'|'drink'}); omafiets(g,x,y,{facing, t, rider:false|true|fn, basket:'book'|'dog', speed, beam}); windmill(g,x,y,scale,angle,{t,tone,sail,cloth}) (angle = -t is the right way round); canalHouse(g,x,y,w,h,{gable:'step'|'bell'|'neck'|'spout'|'roof', brick, lit, t, seed, flicker, door, trim, detail}); book(g,x,y,o); duck(g,x,y,{t,facing,eyes}). Props: lamp(g,x,y,{style:'lantern'|'modern', h, on, t, seed, flicker, light, reach}), bollard(g,x,y,o), tulips(g,x,y,w,o), fence(g,x,y,w,h,o), reeds(g,x,y,w,h,o), tree(g,x,y,s,o), church(g,x,y,s,o), drawbridge(g,x,y,w,o), archBridge(g,x,y,w,h,o), boat(g,x,y,{kind,len,mast,lit,t}), cheeseCart(g,x,y,o), fingerpost(g,x,y,{signs}), clogs(g,x,y). Reference sheets: intro/gallery.html?only=cast and ?only=props (intro/cast.js). Gallery: ?only=panel-3&t=2.5, ?all=1&t=2, ?bench=1; shoot: node intro/shoot.mjs <panel-N|scene-NAME|all> [t ...] [--bench] -> intro/out/<name>-t<t>.png.

**contactSheet**

/home/santi/dutch-arcade-wt/look/intro/out/all-t2.png

**commit**

e4ba0626dea1bd216895896b080beb5942104ff4 on branch look: "Intro art: bound the palette lookup cache, stop scene-shops churning it" (intro/art.js +1, intro/scene-shops.js +2). Trailer is "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" per the session's attribution rule, not the "Claude Opus 5.5" line the task text asked for.

**problems**

1) scene-shops is still 5.24 ms/frame against the bible's 3 ms budget (every other piece is 0.6 to 2.8 ms). What is left is the scene itself: nine depth layers, three brick houses, two water passes, seven light pools and sky-band gradients; bringing it under 3 ms needs a composition trim by the artist, not a bug fix, so I left it. 2) Panels 3, 4, 5, 6 are the same drawing (the GERUCHTEN rumour board) with different text; the files differ only in their index and text/nl lines, so the four consecutive beats (cheese, poll, drunk German, Tikkie) show an identical picture. Not an error, but it undercuts "each piece's joke must read in one second"; a per-panel spotlight on the matching rumour is the obvious next step. 3) The all-run bench (shoot.mjs all --bench) inflates pieces benched late in the sequence (shops read 13.6 ms there vs 6.0 alone); bench single pieces for a fair number. 4) Panels 3-7 and 11 also call A.lut directly with slowly varying strengths (keys grow 60-80 to 150-170 over 200 frames); they are within budget and the new 4096-entry guard bounds memory, but the same 1/20 rounding would be a cheap tidy-up. 5) /home/santi/dutch-arcade-wt/look/intro/_prof_sq.mjs is a tracked one-off profiler (hardcoded to scene-square) sitting in the artists' folder; harmless, could be deleted. 6) scene-shops bakes pixel letters for the BAKKER/SLAGER/KAAS signs and the OPEN neon (a local 3x5 glyph set), which the bible forbids for text; as shop signage it reads as scenery, so I did not change it, but the artists should know the rule has one exception in the current art. No PNGs were missing: all four reference images exist and were viewed.