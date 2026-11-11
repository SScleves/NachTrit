# Nachtrit: the ending, two drafts for Santi

Plan: `Opus 5.5 DT/PLAN.md`, Phase 5, item 3. Writing only; nothing here is built.

What both drafts take as given

- The ending plays after level 130, De grachten (`content/new/L130.js`), at dawn on the canal ring. That level already
  ends with the bells, the language coming home, and the dead turning back into people who still split the bill. The
  last word of the game is `de hond`, which was also the first word of level 1.
- Nobody learns the cause. Every rumour stays a rumour, including the one-cent Tikkie.
- The intro's panel 9 says the book was never opened; panel 10 then shows page one (de or het, there is no rule). So the
  book has been opened once, to page one, and shut. "Opening the book" in draft A means getting to page two.
- The dogs are the brown one and the dark one with the white bib, as in shots 9 and 10.
- Voice: the intro's. Flat statements, no exclamation marks, no taglines, no speeches. Bubbles carry only the words
  said in the scene. Netherlands Dutch at B1, which is where the player is after Amsterdam.
- Each panel: English caption, Dutch caption, and a stage line in the terms of `intro3d/README.md` (W.stage themes,
  W.rider.pose ride / seated / standing / hidden, showBike, showDogs, coat, head, W.say, W.title). New sets, models or
  dependencies are flagged with NEW or DEPENDS.

Sets reused

- The Amsterdam gracht: `W.stage({ town: 'amsterdam', theme: 'gracht' })`, canal on his right.
- The bridge with the bulbs from shot 5 (`intro3d/shot-5.js`), rebuilt in the gracht.
- The café terrace from shot 8 (`intro3d/shot-8.js`), which stands in Alblasserdam; the ending stages the same terrace
  in the Amsterdam gracht (same builders, other town).
- The front room with the sofa, the standing lamp and the shelf with the book from shot 9 (`intro3d/shot-9.js`).
- The coffee table with the book under the low lamp from shot 10 (`intro3d/shot-10.js`).
- The bedroom with the phone from shot 6 (`intro3d/shot-6.js`).
- The dyke with the mills from shot 1 (`intro3d/shot-1.js`), and the title in the sky from shot 14.

DEPENDS, both drafts: dawn. Phase 5 item 2 (town dawn) gives the pale haze, the lit windows and the dead standing as
people. The ending leans on that: `fog` low, the sky of concept image A, zombies with their eyes out and standing
straight. If item 2 is not built first, the ending needs its own dawn pass (sky colour, fog multiplier, a people variant
of `zombie`). The bells are the ones level 130 already rings.

---

## Draft A: he opens the book

1. The last word was de hond. It was also the first.
   Het laatste woord was de hond. Het was ook het eerste.
   Stage: Amsterdam gracht at first light, fog 0.4, Westertoren (`LANDMARK.amsterdam`) ahead on the far quay.
   Rider pose ride, speed 6, dogs on. Low camera from the front left as in shot 14, beat 1. The last golden word
   (the glyph from Phase 5 item 1) lands in the lamp over his head and the lamp catches. The bells from level 130
   carry over.

2. By sunrise everyone was a person again. With the tourists you could not tell the difference.
   Bij zonsopgang was iedereen weer mens. Bij de toeristen zag je het verschil niet.
   Stage: the bridge of shot 5, the bulbs still on, confetti gone. Zombies `scarf`, `hat`, `phone` on the bridge
   straighten up, eyes out (DEPENDS: people variant from town dawn). One group of `phone` variants on the crown of
   the bridge stays exactly as it was: heads down, screens lit. The camera backs away over the water as in shot 5,
   beat 2, but with the water pale instead of black. Rider hidden.

3. He stopped at a terrace and ordered a coffee. In Dutch. Everyone waited to see.
   Hij stopte bij een terras en bestelde een koffie. In het Nederlands. Iedereen wachtte af.
   Stage: the café terrace of shot 8 rebuilt on the Amsterdam quay (`terrace`, string of bulbs, CAFÉ sign). Rider pose
   ride, bike stopped (`W.speed(0, 0)`), dogs sitting by the back wheel. A waiter (`zombie('plain')`, standing as a
   person) at the table edge. `W.say('Een koffie, graag. En een bakje water voor de honden.', W.rider.obj)`. Faces in
   the café window turn to him as in shot 8, beat 2.

4. The waiter answered in Dutch. Nobody switched. Nobody was nice about it. He did not know what to do with his face.
   De ober antwoordde in het Nederlands. Niemand schakelde over. Niemand deed er aardig over. Hij wist niet wat hij
   met zijn gezicht moest doen.
   Stage: same set, the camera pushes in on him at eye level. `W.say('Komt eraan. Melk erbij?', waiter)`. Face
   deadpan, a flicker of `smug` at the end of the hold, then deadpan again. Head turns to us for half a second
   (`W.rider.head`, YXZ), then back to the waiter.

5. The woman at the next table was still taller than him. No language fixes that.
   De vrouw aan het tafeltje naast hem was nog steeds langer dan hij. Dat lost geen taal op.
   Stage: same set. A `bonnet` or `scarf` figure seated at the next table, built a head taller as in shot 2, beat 2;
   she looks over at him, he looks up at her, glances at us, looks up at her again. Dogs lie down.

6. Nobody ever found out what caused it. The mills turned the right way again, and nobody knew why that was either.
   Niemand is er ooit achter gekomen wat de oorzaak was. De molens draaiden weer de goede kant op, en waarom dat was,
   wist ook niemand.
   Stage: the dyke of shot 1 by day, `theme: 'dyke'`, town Alblasserdam, fog 0.5. The mills along the horizon turn the
   right way. Rider pose ride, speed 8, dogs running ahead. A tracking shot from the side; the camera slides along the
   row of mills as the title screen does, once, and settles.

7. At home his phone lit up. The Tikkie of one cent was still open. He paid it. Nothing happened.
   Thuis lichtte zijn telefoon op. Het Tikkie van één cent stond nog open. Hij betaalde. Er gebeurde niets.
   Stage: the bedroom of shot 6 in daylight, the phone on the nightstand. Rider hidden; only a hand enters frame. The
   phone screen is a `labelTexture` in two states: the Tikkie card of shot 6 (Sanne vraagt, € 0,01, open sinds 2019),
   then `Betaald`. Hold on the room for two seconds after. The cheese, the poll and the beer stein still lie round the
   phone. Nothing else moves.

8. The dogs had understood him all along. Now he could say it in Dutch. For them it made no difference.
   De honden hadden hem altijd al begrepen. Nu kon hij het in het Nederlands zeggen. Voor hen maakte het geen verschil.
   Stage: the front room of shot 9, daylight through the window (the game's street outside, lit). Rider pose seated on
   the sofa, floor at the sofa's seat height, hands in his lap; bike hidden; dogs on. The brown dog beside him, the
   dark one on the rug. Low camera at dog height as in shot 9, beat 1. `W.say('Braaf.', W.rider.obj, { dy: 1.2 })`.
   Both dogs tilt their heads in turn.

9. He took the grammar book off the shelf. The plastic came off. The price sticker did not.
   Hij pakte het grammaticaboek van de plank. Het plastic ging eraf. De prijssticker niet.
   Stage: same room. The camera follows the dogs' look up to the shelf as in shot 9, beat 2, but the book is lifted out
   of frame by a hand. Cut to the book on the coffee table of shot 10, shut, the plastic peeled back, the €59,95
   sticker on the board. NEW: a plastic sleeve as a second thin box with a glossy material, lifted off and dropped
   beside the book. Rider hidden except hands, as in shot 10.

10. Page two: the plural. There is a rule. There are eleven exceptions.
    Pagina twee: het meervoud. Er is een regel. Er zijn elf uitzonderingen.
    Stage: the coffee table of shot 10. The cover opens as in beat 1, then one page turns (NEW: a single page as a thin
    plane that swings over on the spine, same hinge as the cover). The page is a canvas texture: HOOFDSTUK 2,
    MEERVOUD, a short rule in print, then a list of eleven exceptions in the same slate ink (kind / kinderen, stad /
    steden, ei / eieren, museum / musea, ...), the margin note in red pencil: elf? The brown dog's head over the far
    edge, as in shot 10. Push in slowly until the page fills the picture.

11. He read on. The dogs fell asleep. Outside the street spoke Dutch again. Mostly about the weather.
    Hij las verder. De honden vielen in slaap. Buiten sprak de straat weer Nederlands. Vooral over het weer.
    Stage: the front room from the window side, looking in: him seated at the table with the book, the dogs down. Then
    the camera backs out through the window to the street of shot 7 and 11 by day: all signs in Dutch, two people
    (`zombie('plain')` and `zombie('hat')` as people) at the kerb, bubbles `Fris, hè.` and `Valt mee.` for two seconds.
    Rider pose seated. Bike hidden, dogs on.

12. One man, one omafiets, three hundred and sixty words. Page two. Nachtrit.
    Eén man, één omafiets, driehonderdzestig woorden. Pagina twee. Nachtrit.
    Stage: his omafiets alone against the dike house in daylight, nobody on it (rider hidden, `showBike(true)`), the
    two dogs on the step. The camera cranes up as in shot 14, beat 2, and `W.title('Nachtrit')` comes up in the pale
    sky. The mills turn the right way at the edge of the frame.

Note on draft A. It says the game was about the two years, not about the night: the wound was that he never
practised because nobody let him, and the cure is that he now does the work, at home, with the dogs asleep. The book
is the one door he never went through, and the ending walks him through it and stops at page two, where the Dutch is
still ridiculous (the plural has as many exceptions as the article). It pays off panels 9 and 10 directly. The risk is
sweetness: a redemption arc with a moral (study, young man) that the rest of the game never has. Panels 4, 5, 7 and 10
are there to keep it flat; if any of them softens in the build, the whole thing tips.

---

## Draft B: he does not open the book

1. The last word was de hond. It was also the first. In between were three hundred and fifty-eight.
   Het laatste woord was de hond. Het was ook het eerste. Daartussen zaten er driehonderdachtenvijftig.
   Stage: as A1. Amsterdam gracht at first light, fog 0.4, Westertoren ahead. Rider pose ride, speed 6, dogs on. The
   last glyph lands in his lamp. The bells of level 130 carry over.

2. The people on the bridge were people again. They were already talking about the bill.
   De mensen op de brug waren weer mensen. Ze hadden het alweer over de rekening.
   Stage: the bridge of shot 5 at dawn, the bulbs still on. Three figures lean in round a phone on the crown of the
   bridge, as the terrace table in shot 2, beat 1; the bubble over the phone says `Tikkie: €4,50`. Eyes out (DEPENDS:
   people variant from town dawn). Rider rides up onto the bridge from behind the camera and stops at the crown.

3. A tourist asked him if he spoke English. He said: a little.
   Een toerist vroeg of hij Engels sprak. Hij zei: een beetje.
   Stage: same bridge. A `phone` variant in a bright coat (`coat` on a zombie is not in the API; use the `hat` variant
   with a map, NEW small prop: a folded paper plane in his hands) steps up to him. `W.say('Sorry, do you speak
   English?', tourist)` in English, the only English bubble in the game. Then `W.say('Een beetje.', W.rider.obj)`.
   Face deadpan. Rider pose ride, stopped, one foot down (the standing pose would hide the bike; ride is fine).

4. He said something to a woman on the bridge. She answered in Dutch and did not switch. He had waited two years.
   It took four seconds.
   Hij zei iets tegen een vrouw op de brug. Ze antwoordde in het Nederlands en schakelde niet over. Hij had er twee
   jaar op gewacht. Het duurde vier seconden.
   Stage: same bridge, the camera at his eye level, which is her shoulder. A `scarf` figure with a `bikeProp` beside
   her at the railing, built a head taller as in shot 2. `W.say('Het is voorbij, denk ik.', W.rider.obj)` at 0.5 s;
   `W.say('Lijkt erop. Koud, hè.', woman)` at 2.5 s. Then both look at the water. Nothing else happens for the rest of
   the hold; the drift keeps it alive.

5. On the bridge they already disagreed about the cause. Some still said the cheese. Gouda denied everything.
   Op de brug waren ze het alweer oneens over de oorzaak. Sommigen zeiden nog steeds: de kaas. Gouda ontkende alles.
   Stage: the three round the phone from B2 now face each other. Bubbles in turn, one second each: `De kaas.`,
   `Het Tikkie.`, `Die peiling.` A `cheese` variant at the end of the bridge shakes his head. He rides on between
   them; the camera stays with the group.

6. He rode home along the dyke. The mills turned the right way. The dogs ran ahead, as always.
   Hij fietste over de dijk naar huis. De molens draaiden de goede kant op. De honden renden vooruit, net als anders.
   Stage: the dyke of shot 1 by day, `theme: 'dyke'`, town Alblasserdam, fog 0.5, mills turning the right way. Rider
   pose ride, speed 8, dogs on and a length ahead of him. Tracking shot from the river side, the mills behind.

7. At home the Tikkie of one cent was still open. He left it open. Some things you do not touch.
   Thuis stond het Tikkie van één cent nog open. Hij liet het openstaan. Aan sommige dingen kom je niet.
   Stage: the bedroom of shot 6 in daylight. The phone on the nightstand with the Tikkie card of shot 6 (Sanne vraagt,
   € 0,01, open sinds 2019). A hand comes in, hovers, goes away. The screen dims. Rider hidden.

8. The dogs had understood him all along. He told them so, in Dutch. The brown one yawned.
   De honden hadden hem altijd al begrepen. Hij zei het tegen ze, in het Nederlands. De bruine gaapte.
   Stage: the front room of shot 9, daylight. Rider pose seated on the sofa, bike hidden, dogs on, the brown dog beside
   him, the dark one on the rug. Low camera at dog height. `W.say('Jullie wisten het al.', W.rider.obj, { dy: 1.2 })`.
   The brown dog's jaw opens and shuts (NEW: a yawn on the dog, or hold on the dark one tilting its head instead).

9. The grammar book was still on the shelf, in its plastic. He left it there. He had done it the other way round.
   Het grammaticaboek stond nog op de plank, in het plastic. Hij liet het staan. Hij had het andersom gedaan.
   Stage: the shelf of shot 9, beat 2: the camera rises past him to the book under its dust, the €59,95 sticker on. It
   stays there. A beam of daylight across it, otherwise the same still. Nothing moves except the dust in the light.

10. The dogs had to go out. That is also a sentence. It was the first one he learned.
    De honden moesten uit. Dat is ook een zin. Het was de eerste die hij leerde.
    Stage: the front door of the dike house from the street (the house of shot 6 and 12, `window.NRHOME`). Rider pose
    standing on the step, the two dogs pulling at him. Bike leaning on the wall (`showBike` on, placed with `W.add`
    is not possible for the rider's own bike; flag: either the bike stands under him in ride pose or the shot uses a
    `bikeProp` against the wall and hides his). Morning street, windows lit.

11. The neighbour said good morning. He said it back. Nobody was nice about it.
    De buurvrouw zei goedemorgen. Hij zei het terug. Niemand deed er aardig over.
    Stage: same street. A `bonnet` figure on the next step with a broom (NEW small prop: a stick) or a bin from
    `bins()`. `W.say('Morgen.', neighbour)` at 0.5 s, `W.say('Morgen.', W.rider.obj)` at 1.5 s. She goes back to her
    bin. He walks the dogs out of frame to the left. Rider pose standing; the walk is a slide of `W.rider.obj`.

12. One man, one omafiets, three hundred and sixty words. The book stays shut. Nachtrit.
    Eén man, één omafiets, driehonderdzestig woorden. Het boek blijft dicht. Nachtrit.
    Stage: the street from the other end, him and the dogs small at the far end walking away, the omafiets against the
    house. The camera cranes up as in shot 14, beat 2, and `W.title('Nachtrit')` comes up in the pale sky.

Note on draft B. It says what panel 11 of the intro says: words come back by being said, not by being read. He got
the language the way the game gave it to him, on the road, one fork at a time, and the book stays on the shelf as a
monument to the other way, which was never going to happen. The tourist beat turns him into the one who gets asked
if he speaks English, which is the whole two years reversed in one line. The risk is cleverness: "he had done it the
other way round" and "some things you do not touch" are a shade knowing, and a player who liked the book as a running
gag may feel cheated when it stays shut. There is also a smaller risk that it reads as the game saying you do not need
grammar, which is not what the game believes; panel 1's arithmetic and panel 10's "that is also a sentence" are there
to keep grammar in the room.

---

## Comparison and recommendation

Both drafts share the spine: dawn on the gracht, the dead as people, one exchange in Dutch that lands, the ride home,
the Tikkie unresolved, the dogs on the sofa, and the title. They differ in what the book does and, under that, in
what the game thinks it was about: A says the two years are over and the work starts now; B says the work was the
ride and the book was never the point. A pays off panels 9 and 10 of the intro directly (page one had no rule; page
two has a rule and eleven exceptions), which is the driest line in either draft, and "He paid it. Nothing happened."
is the best unconfirmed-rumour beat. B's tourist beat ("Een beetje.") is the single best joke of the two drafts.

Recommendation: draft A, with B3 (the tourist asking if he speaks English) moved in after A2 and B10 ("De honden
moesten uit") replacing A11 if twelve panels is the ceiling. The book was set up twice in the intro and once more in
level 130's word list; leaving it shut would be the cleverer ending but the less honest one for a game whose whole
mechanism is the player doing the grammar. Page two keeps it dry: he opens it and the Dutch is still unreasonable.
