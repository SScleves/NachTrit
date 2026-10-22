# The map: towns are tiers, places are themes

Replaces the linear 40-level list. The menu becomes a map of the Netherlands. You pick a town,
then a place in it. Every town has the same places. The town decides how hard the Dutch, the
traffic and the dead are. The place decides the words.

## Towns (tiers), twelve of them

| Tier | Town | CEFR | The culture to play with |
|---|---|---|---|
| 1 | Alblasserdam | A1 | home, the dogs, the dyke, the shipyards |
| 2 | Kinderdijk and Dordrecht | A1 | the mills, the leaning church, the bill split to the cent |
| 3 | Gouda | A1-A2 | cheese, the town hall alone on the square, candle night |
| 4 | Zeeland, the Deltawerken | A2 | the barriers against the sea, 1953, Zierikzee, Middelburg |
| 5 | Utrecht | A2 | the Dom, the wharves, bikes by the thousand, students |
| 6 | Den Haag | A2 | the Binnenhof and its politicians, Scheveningen, the market |
| 7 | Rotterdam | A2-B1 | the harbour, the bridges, niet lullen maar poetsen |
| 8 | Urk | B1 | the former island, the fleet, the dress, the dialect, Sunday |
| 9 | Texel | B1 | the ferry, the sheep, the lighthouse, the dunes, the beer |
| 10 | Groningen | B1 | the Martinitoren, students, er gaat niets boven Groningen |
| 11 | Maastricht | B1-B2 | the Vrijthof, carnaval, vlaai, the dialect, the treaty |
| 12 | Amsterdam | B1-B2 | canals, trams, bells, tourists, the hardest night |

The first six were the original plan and keep their content. Each town also gets an eighth place,
"Eigen" (its own thing): the clothes in Urk, the politicians in Den Haag, the dams in Zeeland.
And every town has a generated de/het bonus built from every noun learned so far.

## Beyond the Netherlands

The engine knows nothing about Dutch. A country is a map outline, a list of towns with tiers and
culture, and content files against the same schema. Portugal, Japan, anywhere: same bike, same mist.

## Towns (tiers), the original six

| Tier | Town | CEFR | Why this town | Look |
|---|---|---|---|---|
| 1 | Alblasserdam | A1 words | Home. The street, the dogs, the neighbours. | Brick terraces, the dyke, the river Noord, the mills of Kinderdijk on the horizon |
| 2 | Kinderdijk and Dordrecht | A1 phrases | Next door. Mills and the oldest city. | Nineteen mills, water everywhere, Dordrecht's harbours and the Grote Kerk |
| 3 | Gouda | A1 to A2 | Cheese, stroopwafels, a town hall in the middle of the square. | Gothic town hall, the Waag, the stained glass of the Sint-Jan, canals |
| 4 | Utrecht | A2 | Student city, the Dom, bikes in the thousands. | Dom tower, wharf cellars on the Oudegracht, the biggest bike garage in the world |
| 5 | Rotterdam | A2 to B1 | Big, loud, rebuilt. Harbour and towers. | Erasmusbrug, Markthal, cube houses, cranes, the Maas |
| 6 | Amsterdam | B1 to B2 | The hardest. Canals, trams, tourists, bells. | Canal houses, bridges, trams, a million bikes, the Albert Cuyp |

Unlocks: all places in a town are open. The next town opens with stars from the current one.

## Places (themes), the same seven in every town

| Place | What it teaches, at the town's tier |
|---|---|
| Thuis (home street) | house words, family, daily routine, later tenses about your day |
| De winkels | shop phrases, prices and numbers, articles, later complaints and returns |
| Eten en drinken | café, takeaway, restaurant, the market, later opinions about food |
| Het station | directions, time, tickets, the train, later travel stories in the past |
| Het werk | the standup, the office, tech talk, later meetings and opinions |
| De sport | golf, the gym, the dog walk, later the match report in the past |
| De mensen | greetings, introductions, neighbours, borrels, later arguments and idioms |

Plus one boss ride per town that mixes every place at that tier, with the follower on the road.

## Difficulty by tier

| Tier | Words per sentence | Lanes | Obstacles | Fork crawl | Hint | Dead |
|---|---|---|---|---|---|---|
| 1 | 5 | 2 | puddles, a zombie now and then | slow | glow | polite |
| 2 | 5 | 3 | puddles, zombies | slow | first letter | split the bill |
| 3 | 8 | 3 | fences, zombies | medium | none | ask questions back |
| 4 | 8 | 3 | fences, carts, zombies on bikes | medium | none | tourists, students |
| 5 | 12 | 3 | all, dense, trams | fast | none | harbour crowd |
| 6 | 16 | 3 | all, dense, trams, bells | fast | none | the follower is visible |

## Where the written content goes

- District 1 (levels 1 to 5) is Alblasserdam: Thuis, De mensen, Thuis (numbers), De mensen (ik ben), De winkels.
- District 2 (levels 6 to 10) is Kinderdijk and Dordrecht: De winkels, Eten, Thuis (de of het), Eten (afhalen), Het station (the calendar).
- District 3 (levels 11 to 15) is Gouda: Het werk (verbs), Het station (directions), De mensen, De winkels (niet of geen), De sport (mag ik, the ladder, the gate).
- Missing places per town get written against `CONTENT-BRIEF.md` with the town's tier as the fence.

## The map screen

- An ink drawing of the Netherlands on dark paper, same look as the game: outline, water, the
  six towns as dots with their names, a small rider at the current town, a dotted route between towns.
- Tap a town: a card slides up with the town's look, its line, and the seven places as a row
  with stars. Locked towns are drawn in fog.
- No scrolling lists.

## Town flavour (filled by research, see `content/towns.js`)

Each town carries: a one-line blurb in English and Dutch, three to five landmarks with a one-line
description for the scenery builder, ten local words, a running joke line, and what its streets
look like, so the scenery themes can be drawn from it.
