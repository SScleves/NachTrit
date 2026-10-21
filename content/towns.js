// Towns for the map screen (see MAP.md). Six tiers, easiest first.
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
    id: 'utrecht', name: 'Utrecht', tier: 4, cefr: 'A2',
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
    id: 'rotterdam', name: 'Rotterdam', tier: 5, cefr: 'A2-B1',
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
    id: 'amsterdam', name: 'Amsterdam', tier: 6, cefr: 'B1-B2',
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
