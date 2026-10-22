// Towns for the map screen (see MAP.md). Twelve tiers, easiest first.
// pos: [x, y] on the Netherlands box lon 3.3..7.2 (x, west to east), lat 50.75..53.55 (y, north to south).
// Facts checked against Rijksmonumenten, Wikipedia, gemeente and visitor sites, October 2026.

window.TOWNS = [
  {
    id: 'alblasserdam', name: 'Alblasserdam', tier: 1, cefr: 'A1',
    pos: [0.349, 0.601], // 51.866 N, 4.661 E
    blurb: 'Home. A dyke, a river and the shipyards. The neighbours still wave, just a bit too slowly.',
    blurbNl: 'Thuis. Een dijk, een rivier en de scheepswerven. De buren zwaaien nog, alleen iets te langzaam.',
    joke: 'The dogs know something is wrong. They still want their walk.',
    jokeNl: 'De honden weten dat er iets mis is. Ze willen toch hun rondje.',
    look: 'Narrow streets of low terraced houses in dark red brick with tiled gable roofs and small front gardens. The main road runs on top of the dyke along the river Noord, houses stepping down behind it, shipyard sheds and cranes at the waterline. Willows along the ditches, the steel arch of the old Noord bridge to the west and the Kinderdijk mills on the horizon.',
    landmarks: [
      { name: 'De Grote Kerk', look: 'Red brick neo-Gothic church from 1899, cross-shaped, square bell tower with an octagonal top and a spire, just outside the dyke on the Cortgene.' },
      { name: 'De oude toren', look: 'Plain 15th-century brick tower on the Kerkstraat, pointed-arch niches at the bell storey, all that is left of the old church.' },
      { name: 'De Brug over de Noord', look: 'Long steel arch bridge from 1939 low over the river, 178 metres between the piers, local traffic only since the motorway went into a tunnel.' },
      { name: 'De Blokker', look: 'Small wooden hollow post mill on a tapered base in the polder, the only one of its kind in Zuid-Holland, part of the Kinderdijk mills.' },
      { name: 'De Kortlandse molen', look: 'Polder mill from 1890 with a thatched cap, standing alone by a ditch at the edge of town.' }
    ],
    words: [
      { nl: 'de dijk', en: 'the dyke' },
      { nl: 'de rivier', en: 'the river' },
      { nl: 'de brug', en: 'the bridge' },
      { nl: 'de molen', en: 'the mill' },
      { nl: 'de werf', en: 'the shipyard' },
      { nl: 'de sloot', en: 'the ditch' },
      { nl: 'het rijtjeshuis', en: 'the terraced house' },
      { nl: 'de buurvrouw', en: 'the neighbour (woman)' },
      { nl: 'de hond', en: 'the dog' },
      { nl: 'de riem', en: 'the dog lead' }
    ],
    obstacles: ['puddle', 'wheelie bin', 'sheep', 'dog walker']
  },
  {
    id: 'kinderdijk', name: 'Kinderdijk en Dordrecht', tier: 2, cefr: 'A1',
    pos: [0.356, 0.620], // Dordrecht 51.813 N, 4.690 E (Kinderdijk is 51.884 N, 4.637 E)
    blurb: 'Nineteen mills that turn without wind. Then the oldest city of Holland, where three rivers meet.',
    blurbNl: 'Negentien molens die draaien zonder wind. Daarna de oudste stad van Holland, waar drie rivieren samenkomen.',
    joke: 'The dead of Dordrecht still split the bill. To the cent. Then they check it again.',
    jokeNl: 'De doden van Dordrecht delen nog steeds de rekening. Tot op de cent. Daarna rekenen ze het nog een keer na.',
    look: 'Kinderdijk: a straight dyke path between long canals edged with reeds, two rows of mills, flat polder and no trees. Dordrecht: narrow cobbled quays with old merchant houses and stepped gables, small harbours full of moored boats, little drawbridges. The square tower of the Grote Kerk stands over every roof.',
    landmarks: [
      { name: 'De molens van de Nederwaard', look: 'Eight round brick mills from 1738 in a row along the canal, sails almost touching the ground.' },
      { name: 'De molens van de Overwaard', look: 'Eight octagonal thatched mills from 1740 on the opposite canal, grey reed down to the base.' },
      { name: 'Het Wisboomgemaal', look: 'Low brick pumping station from 1868 at the start of the mill canals, once steam, now a museum.' },
      { name: 'De Grote Kerk', look: 'Heavy square church tower in Dordrecht, 65 metres, flat unfinished top with four huge clock faces from 1626, leaning more than two metres.' },
      { name: 'De Groothoofdspoort', look: 'Stone city gate with a domed top at the end of the Wijnstraat, right on the point where three rivers meet.' }
    ],
    words: [
      { nl: 'de wieken', en: 'the sails (of a mill)' },
      { nl: 'de polder', en: 'the polder' },
      { nl: 'het gemaal', en: 'the pumping station' },
      { nl: 'het riet', en: 'the reed' },
      { nl: 'de haven', en: 'the harbour' },
      { nl: 'de kade', en: 'the quay' },
      { nl: 'de stadspoort', en: 'the city gate' },
      { nl: 'de waterbus', en: 'the water bus' },
      { nl: 'Hoe laat is het?', en: 'What time is it?' },
      { nl: 'Waar is de kerk?', en: 'Where is the church?' }
    ],
    obstacles: ['puddle', 'mooring rope', 'drawbridge', 'rental bike']
  },
  {
    id: 'gouda', name: 'Gouda', tier: 3, cefr: 'A1-A2',
    pos: [0.362, 0.550], // 52.011 N, 4.711 E
    blurb: 'Cheese, candles and syrup waffles. The town hall stands alone in the middle of the square, as if it is waiting for someone.',
    blurbNl: 'Kaas, kaarsen en stroopwafels. Het stadhuis staat alleen midden op de Markt, alsof het op iemand wacht.',
    joke: 'The cheese porters still carry the wheels every Thursday. Nobody has bought one since the mist.',
    jokeNl: 'De kaasdragers sjouwen nog elke donderdag met de kazen. Sinds de mist heeft niemand er één gekocht.',
    look: 'A small canal town: narrow streets of red and brown brick houses with stepped and bell gables, narrow canals with low brick bridges and lime trees. Every street ends on the big triangular Markt with the grey town hall alone in the middle. Behind the roofs, the long roof of the Sint-Jan.',
    landmarks: [
      { name: 'Het Stadhuis', look: 'Grey sandstone Gothic town hall from 1448 to 1450, standing free in the middle of the Markt, stepped gable with a small open tower, red shutters, a clock with moving figures.' },
      { name: 'De Waag', look: 'Square stone weigh house from 1668 on the Markt, a carved relief of cheese being weighed on the front.' },
      { name: 'De Sint-Janskerk', look: 'Very long church with a short tower, 72 stained-glass windows glowing faintly from inside.' },
      { name: 'De kerstboom op de Markt', look: 'Tall fir in front of the town hall, a gift from Kongsberg in Norway, lit once a year on candle night when all other lights go out.' }
    ],
    words: [
      { nl: 'de kaasmarkt', en: 'the cheese market' },
      { nl: 'de Waag', en: 'the weigh house' },
      { nl: 'het stadhuis', en: 'the town hall' },
      { nl: 'de siroopwafel', en: "the syrup waffle (Gouda's own word)" },
      { nl: 'de kaars', en: 'the candle' },
      { nl: 'het glas-in-lood', en: 'the stained glass' },
      { nl: 'de pijp', en: 'the clay pipe' },
      { nl: 'de gracht', en: 'the canal' },
      { nl: 'Een stuk belegen, graag.', en: 'A piece of mature cheese, please.' },
      { nl: 'Mag ik even proeven?', en: 'Can I have a taste?' }
    ],
    obstacles: ['cheese wheel', 'market stall', 'fence', 'candle']
  },
  {
    id: 'zeeland', name: 'Zeeland: de Deltawerken', tier: 4, cefr: 'A2',
    pos: [0.101, 0.685], // Neeltje Jans 51.633 N, 3.695 E (Zierikzee 51.650 N, 3.918 E; Middelburg 51.499 N, 3.614 E)
    blurb: 'In 1953 the sea came in at night and 1,836 people died. Now there are doors in the sea, and they close when it storms.',
    blurbNl: 'In 1953 kwam de zee \'s nachts binnen en vielen er 1.836 doden. Nu staan er deuren in de zee, en die gaan dicht als het stormt.',
    joke: 'The barrier has 62 doors. On storm nights they all close. Someone still knocks.',
    jokeNl: 'De kering heeft 62 deuren. Bij storm gaan ze allemaal dicht. Er klopt toch iemand.',
    look: 'Flat, wide land under a huge sky, long dykes with a road on top and the wind always in your face. The barrier runs nine kilometres across the water on concrete pillars with steel gates, with the flat island of Neeltje Jans halfway. Small brick towns with harbours and stepped gables, the thick tower of Zierikzee and the tall Lange Jan of Middelburg on the horizon.',
    landmarks: [
      { name: 'De Oosterscheldekering', look: 'Nine kilometres of 65 concrete pillars with 62 steel gates between them, open in calm weather, dropped in a storm. Opened by Queen Beatrix in 1986.' },
      { name: 'Neeltje Jans', look: 'Flat man-made island halfway along the barrier, built to work from, now the Deltapark, grass, wind and machine halls.' },
      { name: 'Het Watersnoodmuseum', look: 'Four huge grey concrete caissons in a row at Ouwerkerk, sunk in 1953 to close the last breach, now a museum.' },
      { name: 'De Dikke Toren', look: 'Wide square church tower in Zierikzee, about 62 metres, never finished since the money ran out in the 1500s, blunt top.' },
      { name: 'De Lange Jan', look: 'Slim abbey tower of about 90 metres in Middelburg, its spire burned three times, the last time in May 1940.' }
    ],
    words: [
      { nl: 'de stormvloedkering', en: 'the storm surge barrier' },
      { nl: 'de pijler', en: 'the pillar' },
      { nl: 'de schuif', en: 'the gate (of a barrier)' },
      { nl: 'het eiland', en: 'the island' },
      { nl: 'de zeedijk', en: 'the sea dyke' },
      { nl: 'eb en vloed', en: 'low and high tide' },
      { nl: 'de watersnoodramp', en: 'the flood disaster (of 1953)' },
      { nl: 'de mossel', en: 'the mussel' },
      { nl: 'Het waait vandaag hard.', en: 'It is very windy today.' },
      { nl: 'Gaat de kering vannacht dicht?', en: 'Is the barrier closing tonight?' }
    ],
    obstacles: ['gust', 'seagull', 'mussel crate', 'high water']
  },
  {
    id: 'utrecht', name: 'Utrecht', tier: 5, cefr: 'A2',
    pos: [0.467, 0.521], // 52.091 N, 5.122 E
    blurb: 'Students, bikes by the thousand and a tower of 112 metres that sees you coming.',
    blurbNl: 'Studenten, duizenden fietsen en een toren van 112 meter die jou al ziet aankomen.',
    joke: 'The garage under the station holds 12,500 bikes. The dead still cannot find theirs.',
    jokeNl: 'In de stalling bij het station passen 12.500 fietsen. De doden kunnen hun fiets nog steeds niet vinden.',
    look: 'A medieval centre of tall narrow brick houses. The Oudegracht runs below street level: wharves at the waterline, cellar doors in the quay walls, café tables down by the water, stone bridges arched over it. Trees along the wharves, bikes on every railing, the lit Dom tower above everything.',
    landmarks: [
      { name: 'De Domtoren', look: 'Gothic tower of 112 metres, square storeys below and an open octagon on top, standing apart from its church across the Domplein, lit at night.' },
      { name: 'De Oudegracht', look: 'Canal dug from 1122, the street high above the water, wharves and old cellars below with arched doors.' },
      { name: 'De fietsenstalling Stationsplein', look: 'Underground bike garage by the station with 12,500 places, rows of racks in two tiers under a long low ceiling.' },
      { name: 'Het Postkantoor op de Neude', look: 'Big brick former post office on the Neude square, with a bike garage of 700 places underneath.' }
    ],
    words: [
      { nl: 'de Domtoren', en: 'the Dom tower' },
      { nl: 'de werf', en: 'the wharf' },
      { nl: 'de kelder', en: 'the cellar' },
      { nl: 'het terras', en: 'the terrace' },
      { nl: 'de fietsenstalling', en: 'the bike garage' },
      { nl: 'het fietspad', en: 'the cycle path' },
      { nl: 'de fietsbel', en: 'the bike bell' },
      { nl: 'de student', en: 'the student' },
      { nl: 'Ik kan mijn fiets niet vinden.', en: 'I cannot find my bike.' },
      { nl: 'Hoe laat gaat de stalling dicht?', en: 'What time does the bike garage close?' }
    ],
    obstacles: ['cyclist', 'bike rack', 'student', 'beer crate']
  },
  {
    id: 'denhaag', name: 'Den Haag', tier: 6, cefr: 'A2',
    pos: [0.260, 0.525], // Binnenhof 52.080 N, 4.313 E
    blurb: 'The government, the king, the judges of the world and a beach. Everyone here is important, or works for someone who is.',
    blurbNl: 'De regering, de koning, de rechters van de wereld en een strand. Iedereen hier is belangrijk, of werkt voor iemand die belangrijk is.',
    joke: 'The politicians left the Binnenhof in 2021 for a renovation. The dead moved in. In the debates nobody has noticed the difference.',
    jokeNl: 'De politici gingen in 2021 uit het Binnenhof weg voor een verbouwing. De doden trokken erin. Bij de debatten merkt niemand het verschil.',
    look: 'Wide straight streets with tram rails, tall town houses in yellow and red brick, ministries of glass behind them. In the centre the Binnenhof, old brick buildings with steep roofs around a courtyard, half hidden in scaffolding and mirrored in the Hofvijver. Past the dunes the grey sea, the dome of the Kurhaus and the pier with its Ferris wheel at Scheveningen.',
    landmarks: [
      { name: 'Het Binnenhof', look: 'Old parliament buildings around a courtyard, the Ridderzaal with its pointed gable and two slim towers in the middle, wrapped in scaffolding until about 2031.' },
      { name: 'Het Torentje', look: 'Small octagonal tower on the corner of the Hofvijver, the prime minister\'s office since 1982.' },
      { name: 'Het Vredespaleis', look: 'Brick and stone palace from 1913 with a tall corner tower behind a fence and a lawn, paid for by Andrew Carnegie, home of the International Court of Justice.' },
      { name: 'Het Kurhaus', look: 'Huge pale hotel from 1885 right on the beach at Scheveningen, a big dome in the middle.' },
      { name: 'De Pier', look: 'Long pier on legs into the sea at Scheveningen, opened in 1961, a Ferris wheel of about 40 metres on top.' }
    ],
    words: [
      { nl: 'de regering', en: 'the government' },
      { nl: 'de minister', en: 'the minister' },
      { nl: 'de Tweede Kamer', en: 'the House of Representatives' },
      { nl: 'het debat', en: 'the debate' },
      { nl: 'het strand', en: 'the beach' },
      { nl: 'de pier', en: 'the pier' },
      { nl: 'het reuzenrad', en: 'the Ferris wheel' },
      { nl: 'de marktkraam', en: 'the market stall' },
      { nl: 'Wat kost een bakje aardbeien?', en: 'How much is a punnet of strawberries?' },
      { nl: 'Dat is geen antwoord op mijn vraag.', en: 'That is not an answer to my question.' }
    ],
    obstacles: ['tram', 'government car', 'market stall', 'scaffolding']
  },
  {
    id: 'rotterdam', name: 'Rotterdam', tier: 7, cefr: 'A2-B1',
    pos: [0.302, 0.581], // 51.922 N, 4.479 E
    blurb: 'Bombed flat in 1940 and rebuilt in glass and steel. The harbour never sleeps, which is now a problem.',
    blurbNl: 'In 1940 platgebombardeerd en herbouwd in glas en staal. De haven slaapt nooit, en dat is nu een probleem.',
    joke: 'Niet lullen maar poetsen. The dead of Rotterdam do not talk much. They work.',
    jokeNl: 'Niet lullen maar poetsen. De doden van Rotterdam praten niet veel. Ze werken.',
    look: 'Wide roads and wide pavements, tram rails, glass and concrete blocks with a few old survivors in between. The Nieuwe Maas is wide and black, the light-blue Erasmusbrug crossing it to a row of towers on the south bank. Harbour cranes and lights to the west, the Euromast alone above the park.',
    landmarks: [
      { name: 'De Erasmusbrug', look: 'Light-blue cable-stayed bridge over the Nieuwe Maas, 802 metres long, one bent pylon of 139 metres with a fan of cables. They call it De Zwaan.' },
      { name: 'De Markthal', look: 'Huge horseshoe arch of flats over a market hall from 2014, glass ends, the inside of the arch painted with giant fruit and vegetables.' },
      { name: 'De kubuswoningen', look: 'Yellow cube houses tipped on one corner on hexagonal pillars, by Piet Blom, next to the Markthal near Blaak.' },
      { name: 'De Euromast', look: 'Concrete tower of 185 metres with a round platform near the top, standing on its own by the park.' },
      { name: 'Het Witte Huis', look: 'White Art Nouveau office block from 1898 by the Oude Haven, 43 metres, one of the few buildings that survived 1940.' }
    ],
    words: [
      { nl: 'de haven', en: 'the port' },
      { nl: 'de hijskraan', en: 'the crane' },
      { nl: 'de Maas', en: 'the river Maas' },
      { nl: 'de wolkenkrabber', en: 'the skyscraper' },
      { nl: 'de kubuswoning', en: 'the cube house' },
      { nl: 'de markthal', en: 'the market hall' },
      { nl: 'de watertaxi', en: 'the water taxi' },
      { nl: 'de metro', en: 'the underground' },
      { nl: 'een bakkie pleur', en: 'a cup of coffee (Rotterdam slang)' },
      { nl: 'Niet lullen maar poetsen.', en: 'Stop talking and get to work.' }
    ],
    obstacles: ['tram', 'scooter', 'container', 'crane hook']
  },
  {
    id: 'urk', name: 'Urk', tier: 8, cefr: 'B1',
    pos: [0.590, 0.317], // 52.662 N, 5.601 E
    blurb: 'An island until 1939, and it still acts like one. The biggest fishing fleet in the country, 24 churches and a dialect nobody else understands.',
    blurbNl: 'Tot 1939 een eiland, en zo voelt het nog steeds. De grootste vissersvloot van het land, 24 kerken en een dialect dat niemand anders verstaat.',
    joke: 'On Sunday nothing moves on Urk. Not even the dead. They are in church, in their Sunday clothes.',
    jokeNl: 'Op zondag beweegt er niets op Urk. Zelfs de doden niet. Die zitten in de kerk, in hun zondagse kleren.',
    look: 'A tight old village on a low hill, narrow alleys of small brick fishermen\'s houses with tiled roofs, packed close together. Below it a harbour full of big fishing cutters with their booms folded up and nets hanging. A white lighthouse and a small church on the old shore, flat polder behind, and the grey IJsselmeer to the horizon.',
    landmarks: [
      { name: 'De vuurtoren', look: 'Short white lighthouse from 1845 on the old island shore, still turning its light.' },
      { name: 'Het Kerkje aan de Zee', look: 'Small plain church from 1786 right by the water, the oldest building on Urk.' },
      { name: 'Het Vissersmonument', look: 'Stone woman looking out over the water, unveiled in 1968, with marble plates behind her full of the names of drowned Urk fishermen.' },
      { name: 'De haven', look: 'Old harbour with big steel cutters moored side by side, fish crates on the quay, the IJsselmeer fish auction at the water.' }
    ],
    words: [
      { nl: 'de vissersvloot', en: 'the fishing fleet' },
      { nl: 'de kotter', en: 'the fishing cutter' },
      { nl: 'de visafslag', en: 'the fish auction' },
      { nl: 'de klederdracht', en: 'the traditional dress' },
      { nl: 'de kraplap', en: 'the stiff embroidered breastcloth of the women\'s dress' },
      { nl: 'de zondagsrust', en: 'the Sunday rest' },
      { nl: 'het IJsselmeer', en: 'the IJsselmeer (the lake that was a sea)' },
      { nl: 'Op zondag vaart hier niemand uit.', en: 'On Sunday nobody sails out here.' },
      { nl: 'de kark', en: 'the church (Urkers dialect; in Dutch: de kerk)' },
      { nl: 'Oe got ut?', en: 'How are you? (Urkers dialect, no h; in Dutch: Hoe gaat het?)' }
    ],
    obstacles: ['fish crate', 'fishing net', 'churchgoers', 'seagull']
  },
  {
    id: 'texel', name: 'Texel', tier: 9, cefr: 'B1',
    pos: [0.384, 0.177], // Den Burg 53.054 N, 4.797 E
    blurb: 'The biggest Wadden island, twenty minutes by ferry from Den Helder. More sheep than people. The sheep have noticed.',
    blurbNl: 'Het grootste Waddeneiland, twintig minuten met de boot vanaf Den Helder. Meer schapen dan mensen. Dat hebben de schapen ook door.',
    joke: 'Miss the last ferry and you live here now. The sheep will show you around.',
    jokeNl: 'Mis je de laatste boot, dan woon je hier voortaan. De schapen leiden je wel rond.',
    look: 'Flat green polder with sheep everywhere, low turf walls along the fields and odd thatched barns with one side sloping almost to the ground. Small villages of low brick houses around a church, the island town of Den Burg in the middle. High dunes and a wide beach along the west, and in the far north a red lighthouse on a dune.',
    landmarks: [
      { name: 'De veerboot', look: 'Big ferry of TESO between Den Helder and \'t Horntje, twenty minutes across the Marsdiep with cars, bikes and day trippers.' },
      { name: 'De vuurtoren', look: 'Red round lighthouse on a high dune at the north tip near De Cocksdorp, lit since 1864, given a second wall after it was shot at in 1945.' },
      { name: 'De schapenboet', look: 'Texel barn with a steep thatched roof, its low back side turned into the southwest wind.' },
      { name: 'De Slufter', look: 'Wide dune valley open to the sea, flooded at every high tide, salt marsh and winding creeks.' },
      { name: 'Ecomare', look: 'Seal centre and museum in the dunes near De Koog, seals in outdoor pools.' }
    ],
    words: [
      { nl: 'de veerboot', en: 'the ferry' },
      { nl: 'de overtocht', en: 'the crossing' },
      { nl: 'het schaap', en: 'the sheep' },
      { nl: 'het lam', en: 'the lamb' },
      { nl: 'de schapenboet', en: 'the Texel sheep barn' },
      { nl: 'de duinen', en: 'the dunes' },
      { nl: 'de vuurtoren', en: 'the lighthouse' },
      { nl: 'de zeehond', en: 'the seal' },
      { nl: 'Hoe laat vertrekt de laatste boot terug?', en: 'What time does the last ferry back leave?' },
      { nl: 'Een Skuumkoppe, graag.', en: 'A Skuumkoppe, please (the island brewery\'s best-known beer)' }
    ],
    obstacles: ['sheep', 'lamb', 'rental bike', 'sand drift']
  },
  {
    id: 'groningen', name: 'Groningen', tier: 10, cefr: 'B1',
    pos: [0.838, 0.118], // 53.219 N, 6.567 E
    blurb: 'Far north, full of students, with a tower they call the old grey one. Er gaat niets boven Groningen, which is also true on the map.',
    blurbNl: 'Ver in het noorden, vol studenten, met een toren die ze d\'Olle Grieze noemen. Er gaat niets boven Groningen, en op de kaart klopt dat ook.',
    joke: 'For years the ground shook here because of the gas. The gas was turned off in 2023. The ground still shakes. That is not the gas.',
    jokeNl: 'Jarenlang beefde de grond hier door de gaswinning. In 2023 ging de gaskraan dicht. De grond beeft nog steeds. Dat is niet het gas.',
    look: 'Narrow streets of old brick houses with stepped gables, a ring of canals around the centre, bikes piled on every bridge and wall. The wide Grote Markt, half rebuilt after 1945, with the grey Martinitoren on its corner. Student houses with lit windows everywhere, and beyond the ring road flat farmland with big farmhouses and churches on mounds.',
    landmarks: [
      { name: 'De Martinitoren', look: 'Grey stone church tower of about 97 metres on the corner of the Grote Markt, called d\'Olle Grieze, still the tallest thing in town.' },
      { name: 'De Grote Markt', look: 'Big open square, partly burned in April 1945 and rebuilt, the white town hall with columns on one side.' },
      { name: 'Het Academiegebouw', look: 'Ornate university building from 1909 in brick and carved stone, students on the steps and bikes against every railing.' },
      { name: 'Het Groninger Museum', look: 'Bright postmodern museum from 1994 on its own island in the canal opposite the station, a golden tower in the middle.' }
    ],
    words: [
      { nl: 'de student', en: 'the student' },
      { nl: 'de studentenkamer', en: 'the student room' },
      { nl: 'de Grote Markt', en: 'the main square' },
      { nl: 'de aardbeving', en: 'the earthquake' },
      { nl: 'de gaswinning', en: 'the gas extraction' },
      { nl: 'de scheur', en: 'the crack' },
      { nl: 'Moi.', en: 'Hi (Gronings, any time of day)' },
      { nl: 'Stad', en: 'the city (what Groningers call Groningen, no article)' },
      { nl: 'Er zit een scheur in de muur sinds de beving.', en: 'There has been a crack in the wall since the quake.' },
      { nl: 'Er gaat niets boven Groningen.', en: 'Nothing beats Groningen (also: nothing lies above it).' }
    ],
    obstacles: ['student', 'bike pile', 'road crack']
  },
  {
    id: 'maastricht', name: 'Maastricht', tier: 11, cefr: 'B1-B2',
    pos: [0.612, 0.965], // Vrijthof 50.849 N, 5.688 E
    blurb: 'The far south, almost Belgium. Hills, old churches, good pastry and a dialect that sounds like German singing. The European Union was signed here in 1992.',
    blurbNl: 'Het verre zuiden, bijna België. Heuvels, oude kerken, goede vlaai en een dialect dat klinkt als zingend Duits. In 1992 werd hier de Europese Unie getekend.',
    joke: 'At carnaval everyone is in costume for days. In Maastricht you cannot tell the living from the dead. Nobody really tries.',
    jokeNl: 'Met carnaval loopt iedereen dagenlang verkleed rond. In Maastricht zie je dan geen verschil tussen de levenden en de doden. Niemand doet ook echt moeite.',
    look: 'Narrow winding streets of pale yellow marl, grey stone and whitewashed brick, French-looking houses with shutters and slate roofs. Short steep slopes, old city walls and gates, café terraces on wide squares. The Maas runs wide through the middle under an old stone bridge, green hills to the south.',
    landmarks: [
      { name: 'Het Vrijthof', look: 'Big open square full of café terraces, the Romanesque Sint-Servaasbasiliek and the red tower of the Sint-Janskerk side by side on one edge.' },
      { name: 'De Sint-Servaasbrug', look: 'Stone arch bridge over the Maas, built from 1280, called the oldest bridge in the country though largely rebuilt after the war.' },
      { name: 'De Helpoort', look: 'Stone gate with two round towers from the 13th century, the oldest city gate in the Netherlands, in a stretch of old wall.' },
      { name: 'Het Gouvernement', look: 'Large modern provincial building on the Maas, where the Maastricht Treaty was signed on 7 February 1992.' }
    ],
    words: [
      { nl: 'de vlaai', en: 'the Limburg fruit tart' },
      { nl: 'het carnaval', en: 'carnival' },
      { nl: 'de optocht', en: 'the parade' },
      { nl: 'het verdrag', en: 'the treaty' },
      { nl: 'de heuvel', en: 'the hill' },
      { nl: 'de mergel', en: 'the marl (the soft yellow local stone)' },
      { nl: 'Doe mij maar een stuk kersenvlaai.', en: 'I will have a piece of cherry tart.' },
      { nl: 'Zonder dat verdrag hadden we de euro niet gehad.', en: 'Without that treaty we would not have had the euro.' },
      { nl: 'de bomma', en: 'grandma (Maastricht dialect; in Dutch: oma)' },
      { nl: 'Noondezju.', en: 'Damn it (mild Maastricht dialect curse, also surprise)' }
    ],
    obstacles: ['parade float', 'brass band', 'café chair']
  },
  {
    id: 'amsterdam', name: 'Amsterdam', tier: 12, cefr: 'B1-B2',
    pos: [0.410, 0.420], // 52.373 N, 4.900 E
    blurb: 'Canals, trams, bells and tourists. The tourists were already a bit like this before the mist.',
    blurbNl: 'Grachten, trams, bellen en toeristen. De toeristen waren voor de mist al een beetje zo.',
    joke: 'In Mokum the dead ring their bike bell when you are in the way. Then once more, to be sure.',
    jokeNl: 'In Mokum bellen de doden met hun fietsbel als je in de weg staat. En dan nog een keer, voor de zekerheid.',
    look: 'Narrow cobbled quays along wide canals in rings. Rows of tall narrow canal houses in dark brown, red and black brick, leaning a little, with stepped, neck and bell gables and a hoist beam at the top. Low brick bridges every block, elms along the water, houseboats, bikes chained to every railing, tram wires on the big streets.',
    landmarks: [
      { name: 'De Westertoren', look: 'Church tower of 85 metres on the Prinsengracht, the tallest in the city, topped with the blue imperial crown of Maximilian.' },
      { name: 'De Magere Brug', look: 'White wooden double drawbridge over the Amstel, rebuilt in 1934 in the old style, outlined in small lights at night.' },
      { name: 'De Albert Cuypmarkt', look: 'Street market since 1905 in De Pijp, about 260 stalls under striped awnings along one long street.' },
      { name: 'De grachtengordel', look: 'Herengracht, Keizersgracht and Prinsengracht in half rings from 1612, the Keizersgracht the widest.' }
    ],
    words: [
      { nl: 'de gracht', en: 'the canal' },
      { nl: 'het grachtenpand', en: 'the canal house' },
      { nl: 'de hijsbalk', en: 'the hoist beam' },
      { nl: 'de woonboot', en: 'the houseboat' },
      { nl: 'de halte', en: 'the stop (tram)' },
      { nl: 'de fietsbel', en: 'the bike bell' },
      { nl: 'de toerist', en: 'the tourist' },
      { nl: 'Mokum', en: 'Amsterdam (the nickname)' },
      { nl: 'Mag ik er even langs?', en: 'Can I just get past?' },
      { nl: 'Ik moet er bij de volgende halte uit.', en: 'I need to get off at the next stop.' }
    ],
    obstacles: ['tram', 'tourist', 'delivery van', 'scooter']
  }
];
