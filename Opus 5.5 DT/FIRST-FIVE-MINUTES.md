# The first five minutes: a first-time player's notes, with fixes

Written after walking the real path on main (24 Oct 2026) with cleared storage: start screen,
intro, map, town card, mission card, first ride, first fork. Each point has the problem as a new
player feels it, then suggestions from three angles: narrative (the story and voice), technical
(how to build it inside our constraints), and player (what makes it feel good to play). Treat the
whole file as one backlog task, `dt/first-five-minutes`, and do the points in order; the first
three are what a player sees before deciding to keep going.

Overall verdict as a player: the look is an eight, the first five minutes a five. The mood and
the humour land. The friction is teaching and clutter, which is cheaper to fix than art.

---

## 1. The start screen is a title on black

Problem: the first thing anyone sees is "NACHTRIT" and two buttons on a near-black page with a
faint HUD showing through. It reads as a prototype, right before the best art in the game (the
pixel intro) appears.

Narrative: the start screen is the cover of the book. It should already be night in the polder:
the mist, one mill turning the wrong way, two yellow eyes somewhere. The slogan "Cycle home.
Understand the dead before dawn." is good; keep it and add the one-line premise under it: "The
mist took the language. Every word said right brings a piece back."

Technical: reuse the first intro painting (`intro/panel-1.js`, the mills at night) as a live
canvas behind the title, drawn at `pix` resolution and scaled, with its existing slow animation.
No new assets. Hide the HUD pills until the ride starts (they are already in the DOM; toggle a
class). Put the controls line below the fold on phones.

Player: the mood sells the game in the first second. A moving background says "this is alive".
Keep both buttons but make Start the clear default (Enter), with Intro as a text link; a first
run should play the intro automatically after Start and show the Intro button only afterwards.

## 2. The intro text types out letter by letter and invites a skip

Problem: "The nigh", "Alblass": the caption types at reading speed, so the player waits, then
presses skip, and never learns why they deliver the dead. The premise is the hook; it must land.

Narrative: fourteen panels is a lot for a first run. Keep all fourteen for the Intro button, but
on the first run show a short cut of five: the mist came (1), everyone changed, still split the
bill (2), nobody agrees why (3, with the cheese line only), he never practised (8), one man, one
omafiets, 360 words (14). Jokes 4 to 6 and the grammar-book panels play when the player comes
back to the intro, or one per town as the loading line (STORY.md already gives each town its
rumour; the panels can be the town intro the second time).

Technical: show the full caption at once with a 200 ms fade instead of typing; keep the typing
sound if there is one as a short tick. Advance on tap, Space or Enter; auto-advance after the
caption's reading time (about 60 ms per character, minimum 2.5 s) so a player who does nothing
still sees the story. `showIntro` already takes `NRART.panels`; add a `short` list of panel
indices. Remember in `nachtrit.intro` which cut was seen.

Player: a first run should be under 40 seconds from Start to riding. Five panels at five seconds
is 25. The skip link stays for the second time around.

## 3. The map does not look like the Netherlands, and the route is straight lines

Problem: a Dutch player sees in one second that the country is a rounded blob with no Wadden
islands, no Zeeland estuaries, no IJsselmeer. The route crosses the whole country as straight
dashed lines. The badges, names, lamps and dressing are right; the ground under them is wrong.

Narrative: the map is the saved-towns board, the thing the player returns to after every ride.
It should show progress as light: a saved town's windows lit, its route lamps on, the mist
pulled back from it. The home ring at Alblasserdam and the cyclist already say "you are here".

Technical: HANDOVER.md section 4 has the full list. In short: trace the real outline (150 to 300
simplified lon/lat points: coast, Wadden islands, Zeeland, IJsselmeer with the Afsluitdijk,
Flevoland), project it with the same projection and Randstad warp as `nodePositions`, extrude a
dark side face for the diorama edge, reflections under the coast in the water, and draw the
route as a curved road town to town in tier order (a Catmull-Rom through the nodes, lamp dots on
it). Town vignettes from the town's landmarks. Paint once per resize into a cached canvas; only
the route glow and the cyclist animate.

Player: a map you recognise is a map you want to fill in. Riding the bike along the road from
town to town (arrow keys) should feel like travel: the cyclist follows the curve, the road ahead
lights up as it goes, locked towns stay dim.

## 4. The town card is dense

Problem: eleven small place buttons in seven columns, a column that says "Alleen hier soon"
(a placeholder), and a bonus badge "De of het · 197", a number nobody can read. For a first town
this is a menu, not an invitation.

Narrative: the town card is where the town speaks: its blurb, its rumour, its places. The places
are the story's chapters (home, the shops, eating, the station, work, sport, people, the town's
own thing). Name them as a sentence a passenger could say: "Thuis: the dogs need a walk."

Technical: show the places as one list, in order, with the first unplayed one highlighted and
auto-focused so Enter rides at once. Collapse finished places to a row of stars. Hide the
"soon" column until it exists. The bonus level reads "De of het, 197 words" or drop the number.
On phones, the card is a bottom sheet that scrolls; the map stays visible above it.

Player: one obvious next thing. Stars for what is done, a lock for what is not, and the fare
range of the next ride as the carrot. The rumour line stays: it is the joke the player is here for.

## 5. The mission card is a wall of 24 words

Problem: before the first ride, the card lists every word on the road, in bold, in a paragraph.
A new player does not read it; a learner cannot absorb 24 words at once anyway.

Narrative: the passenger is the one who introduces words, one at a time, at the door. The card
should set the scene (three lines, already good: your street, two dogs, the dead at each door)
and promise the fare. The words arrive in the ride, as light.

Technical: move the word list off the mission card into the vocabulary book (backlog A4) and the
end-of-ride summary (words met, words right). On the card show at most the three new words
with their pictograms as a teaser ("Tonight: de hond, het huis, de fiets"). Everything else stays.

Player: curiosity beats a syllabus. Seeing three words and a fare makes you ride; seeing 24 makes
you feel tested. The end-of-ride card is where the list belongs, with the mistakes to practise.

## 6. Nothing teaches the core move in the ride

Problem: the card says "The passenger says: the dogs", two bars at the bottom say "het honden"
and "de honden", two tiny signposts stand far down the road, and the player has to work out that
the left bar is the left lane and that riding through the sign is the answer. It is learnable in
two forks, but the first fork should not be a puzzle about the interface.

Narrative: the first level is "Thuis": the dogs know the way, he does not. Let the dogs teach:
the first time, the right signpost glows a little brighter and a dog barks on that side (we have
`hint: 'glow'` for tier 1 already; make it visible). The passenger's line can carry the tutorial
in voice: "Ride through the right word. The dogs will tell you if you are wrong."

Technical: for the first three forks of a player's first ride (a flag in `nachtrit.progress`
or a separate key), slow to walking pace earlier, draw an arrow decal on the road into the lane
of each option, label the bottom bars with "left" and "right" chevrons, and hold the first gate
until the player moves at all. Make the signposts larger and nearer in tier 1 (`gate` units) so
the words are readable before the choice is forced. Speak the English line, then the Dutch of the
chosen answer, as now.

Player: a first fork that cannot be failed by confusion. After three forks the training wheels go,
and the wisps start to matter. The speed at tier 1 is right; keep it.

## 7. The passenger is a blob

Problem: the fare on the back of the bike is a red cloak, a white ball head and a yellow box.
The rider looks right from behind; the passenger, who is the whole story, does not.

Narrative: every passenger is one of the dead, a neighbour, still splitting the bill. They should
be readable types: the tall woman, the student with a backpack, the fisherman in a sweater, the
civil servant with a briefcase, the man with a cheese, the woman in the bonnet, the kid with the
balloon, the dog walker. Each has a line at the door; the look should match the line.

Technical: a small kit in `rider.js`: head (round, long, hat, bonnet, bucket hat), body (coat
colour per type, scarf, backpack, briefcase, cheese), legs dangling from the carrier, arms round
the rider's waist. Toon materials, shared geometry, eight variants, picked per place and tier
(`PASS_COATS` already exists as a start). Glowing eyes dim, so the passenger reads as one of the
dead but not as a threat.

Player: recognisable passengers make fares feel like people, and the "Dat betaal ik niet"
refusals land harder when it is the fisherman saying it.

## 8. Smaller things, all worth doing

- A pale, glowing tree card sits right behind a lamp on the dyke and the first street; trees near
  lamps should be darker, not lit (technical: tree cards get the toon material with the cool
  shadow tint, and never the additive glow; or offset trees away from lamp positions).
- The HUD pills are tiny on a laptop and crowd each other on a phone; one row, bigger type,
  lamp bar first, wallet second, the rest on demand.
- The lamp bar has no label that says what it means; the first time it drops below half, a toast:
  "The lamp is going. Ride through the lights."
- The first wisps should be unmissable: in tier 1 place them in the player's lane for the first
  200 m.
- Signpost text is unreadable until close; that is the game, but in tier 1 the gate distance
  should give two seconds of readable text at walking pace.
- The right-side lamp pool on the street is brighter than the left; even them.
- The map's "Endless night" button is the biggest thing on the screen; demote it to a text link
  until the first town is saved.

---

## Acceptance for `dt/first-five-minutes`

- A fresh player (cleared storage) goes from the page to the first fork in under 60 seconds,
  seeing a moving start screen, a five-panel intro, a map they recognise, one highlighted place,
  a three-word mission card, and a first fork with arrows and a glowing right sign.
- Harness: `node qa/run.mjs 1` and `intro` with errors: 0; frames of each screen in the report.
- Phone: the same path at 390x844 with the town card as a bottom sheet.
- No exclamation marks, no new assets, no new lights, draw calls unchanged.
