# Laptop evaluation of main after PRs 2, 3 and 4 (24 Oct 2026, 14:50 CET, Santi's Intel GPU)

Santi merged the two WIP branches (world, map) and the remote agent's dt/world-pass (materials)
into main himself. Checked on the real GPU in his Chrome, main at 235d865.

## Game: pass, and a real jump
- Gouda L12 (street): dark textured brick, curtained and lit windows only warm, lanterns with
  halos, continuous terraces, a second row, skyline and trees in haze, the fence-peeking zombie
  with yellow eyes, reeds and canal. Luma 67 (concept D is 52, A is 64). Zero page errors.
- Kinderdijk L3 (dyke): moon with halo, mist bands at several depths, tree and mill silhouettes,
  spire, reeds along the water, a houseboat. Luma 58. Zero page errors.
- CPU cost per simulated frame (NRstep, same page, same level): old main 0.5 to 2.0 ms, new main
  0.5 to 1.2 ms. Textures 46 to 59, geometries 427 to 416, programs 31 both. The remote agent's
  own count: draw calls on Gouda L12 fell from 631 to 554. GPU frame rate could not be measured
  from the laptop agent's side (Chrome window was behind the editor, which throttles animation);
  Santi judges smoothness by playing.
- Validator: 0 errors, 0 warnings. Module parses. Headless harness level 1 run pending at the
  time of writing.

## Game: what is still off (for the next world task)
1. Dyke lamp posts share the tree-card look: one pale, blobby tree sits right behind the
   lamp on L3 and reads as a lit bush. Trees near lamps should be darker, not lit by them.
2. In the L3 frame the rider is seen in profile with the passenger's yellow hexagon (cheese hat)
   covering the rider's back: the reaction-shot camera and the cheese-hat passenger collide.
   Keep the passenger behind the rider in that shot or skip the hat for it.
3. The far skyline cards are still a uniform grey with similar rounded shapes; the concept's
   skyline has distinct spires, a stellingmolen, a drawbridge frame and varied gables, and two
   depths of haze. Per-town silhouettes (backlog B1) will fix that.
4. The passenger is still a flat shape (backlog B2).
5. Luma at level start is a little above the concept (67 vs 52 to 64); fine for now, re-check
   after the per-town pass. Deep-night darkening still needs a check that lanes stay readable.
6. No per-town differences yet beyond brick colour and signs.

## Map: merged as WIP, not finished (backlog HANDOVER section 4 stands)
- Right: title, subtitle, north arrow, badges, number chips, names and CEFR bands, the cyclist,
  the green home ring, footer and Endless button, dense dressing (trees, mills, tulip fields,
  cows, boats, town glow, a lighthouse beam at Texel, the lit Waalbrug at Nijmegen).
- Wrong: the country is a rounded blob, not the Netherlands (no Wadden islands, no Zeeland
  estuaries, no IJsselmeer); no raised diorama edge or water reflections under the land; the
  route is a set of straight dashed lines crossing the whole country instead of roads town to
  town; town vignettes are small glows instead of landmark silhouettes; phone layout unchecked.
- It works: riding, entering a town and levels still function on main.

## For the remote agent
Take the map first (it is on main now and Santi sees it on the live site), then the game items
above, then backlog B1 and B2.
