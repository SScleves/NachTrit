// Nachtrit, Amsterdam (tier 13, B1 to B2): level 129 De Wallen, place mensen. The oldest part of the city: the Oudezijds
// Voorburgwal and Achterburgwal, little bridges, red neon over the doorways, alleys so narrow that two tall locals cannot pass,
// the Trompettersteeg at about one metre, the Oude Kerk (consecrated in 1306, the oldest building in Amsterdam), bollards on
// every corner and bikes on every bridge. The people: tourists in groups, a guide with an umbrella, locals on bikes who ring
// twice. Kept clean on purpose, as the brief asks: neon, alleys, tourists, bollards, the church, tall locals, nothing else.
// CONTENT-BRIEF.md names De Wallen as Amsterdam's own place, but BACKLOG.md C1 makes De grachten the eigen and the finale, so
// De Wallen is the mensen place: the people of the city, tourists and locals, and their two registers.
// New at tier 13 and drilled here: the tourist register next to the local one (Zou u mij kunnen vertellen, Kunt u iets
// langzamer praten; Tweede brug links, pas op voor de fietsen, effe), long builds with three forks, directions through the
// alleys, subtle pairs (lang against hoog for people, heten against noemen, verhuren against huren, niet meer against nog
// niet, niet ... maar wel), people idioms (iemand een rad voor ogen draaien, voor gek staan, met de fiets aan de hand), and the
// premise: the bartender used to answer in English.
// Review of every tier: the passive with door, inwijden as a separable participle, V2 after a fronted phrase and after a
// sub-clause, a sub-clause after zodra and als, elkaar before niet, the plural agreement in het moeten er ... zijn, die for a
// de-word, the object pronoun haar, the comparative, ordinals, indirect speech with the plusquamperfectum of zoeken.
// Sources: dutch-lessons vault, _site/situations/polite-phrases (Sorry, ik versta u niet goed; Kunt u iets langzamer praten?
// Ik leer nog Nederlands; Mag ik u iets vragen), directions (de weg vragen, de weg wijzen, rechtdoor, links, rechts),
// meeting-people; 02 - Grammar/V2 word order, bijzin, die vs dat; levels 121 and 123 for the replayed words (de buurtbewoner,
// de roddel, het gezelschap, de toerist, de fietsbel); content/towns.js for Amsterdam (Mokum, de toerist, de fietsbel, the joke
// that the dead ring their bell when you are in the way and then once more to be sure, the rumour about the drunk German).
// Facts: the Oude Kerk was consecrated in 1306; the Trompettersteeg is about a metre wide; the bollards are Amsterdammertjes.
// New rules: weg (guarded, the same text in every Amsterdam file); idioom and formeel keep the Nijmegen text. zou, obj,
// passief, vergelijk, omte, indirect and er are guarded copies of the existing definitions.
// New props: none. Only hond, brug and boom are used (not kerk: de Oude Kerk is a listen item; not lamp or fiets: de fietsbel
// and the neon are in the word pool).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, jullie, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 129, act: 13, name: 'De Wallen', town: 'amsterdam', place: 'mensen', theme: 'street', ...P,
    intro: 'On the Wallen the neon still glows red at night. The tourists still stand on the cycle path. The Oude Kerk, the oldest building in town, has watched it all since 1306 and says nothing.',
    introNl: "Op de Wallen gloeit 's nachts nog steeds het rode neon. De toeristen staan nog steeds op het fietspad. De Oude Kerk, het oudste gebouw van de stad, ziet het al sinds 1306 aan en zegt niks.",
    mission: {
      where: 'De Wallen, the oldest part of the city: two narrow canals, the Oudezijds Voorburgwal and the Achterburgwal, little bridges, red neon over the doorways, and alleys so narrow that two tall locals cannot pass each other, the Trompettersteeg at about one metre the narrowest of all. In the middle stands the Oude Kerk, with bollards on every corner and bikes on every bridge.',
      carry: 'Two dogs on short leads, a map that the tourists keep borrowing, a round of drinks split to the cent with a group of strangers, and the grammar book, still never opened. No helmet. You are pushing the bike anyway: on the Wallen there is no room to ride.',
      want: 'Since the mist the dead of the Wallen are the same mix as before: tourists in groups, a guide with an umbrella, locals on bikes. The tourists ask the way politely, the locals answer fast and ring their bell twice to be sure. The dead want both registers, the polite one and the local one, the way to the Oude Kerk in one long sentence, and the difference between lang and hoog, because the locals are still taller than you, every one of them. The rumour here is that the millionth tourist said Dutch sounds like a drunk German. The dead heard it.' },
    items: [
      // ---- builds: the tourist asks, the local answers
      { en: 'Excuse me, could you tell me how to get to the Oude Kerk?', parts: ['Pardon,', FK(['zou u', 'zouden u'], 0, 'zou',
        'u takes the singular verb: zou u.'), FK(['mij', 'mijn'], 0, 'obj',
        'The person you tell is the object, mij. mijn needs a noun after it.'), 'kunnen vertellen', FK(['hoe ik bij de Oude Kerk kom', 'hoe kom ik bij de Oude Kerk'], 0, 'bijzin',
        'A question inside a question becomes a sub-clause, so the verb goes to the end.'), '?'] },
      { en: 'Second bridge on the left, then you will see the tower. Mind the bikes.', parts: ['Tweede brug links,', FK(['dan zie je', 'dan je ziet'], 0, 'v2',
        'dan takes slot 1, so the verb comes right after it: dan zie je.'), 'de toren al.', FK(['Pas op voor', 'Pas op van'], 0, 'woord',
        'oppassen goes with voor: pas op voor de fietsen.'), 'de fietsen.'] },
      { en: "Sorry, I didn't catch that. Could you speak a bit more slowly?", parts: ['Sorry, ik versta', FK(['u', 'uw'], 0, 'formeel',
        'The person you do not understand is the object: u. uw needs a noun.'), 'niet goed. Kunt u', FK(['iets langzamer', 'iets meer langzaam'], 0, 'vergelijk',
        'More slowly is the comparative: langzamer. meer langzaam is not Dutch.'), 'praten?'] },
      { en: 'In Mokum the dead ring their bell when you are in the way, and once more to be sure.', parts: ['In Mokum', FK(['bellen de doden', 'de doden bellen'], 0, 'v2',
        'In Mokum fills slot 1, so the verb comes second: bellen de doden.'), FK(['als je in de weg staat', 'als je staat in de weg'], 0, 'bijzin',
        'als opens a sub-clause, so the verb goes to the end: in de weg staat.'), ', en nog een keer', FK(['voor de zekerheid', 'voor het zekerheid', 'naar de zekerheid'], 0, 'idioom',
        'voor de zekerheid means to be sure. zekerheid is a de-word, like every word ending in -heid.'), '.'] },
      { en: "Cycling is not allowed here; you have to walk with your bike.", parts: ['Hier', FK(['mag je niet', 'hoef je niet'], 0, 'mag',
        'Not allowed is mag niet. hoeven niet would need te and means not necessary.'), 'fietsen, je moet met de fiets', FK(['aan de hand', 'in de hand', 'op de hand'], 0, 'idioom',
        'met de fiets aan de hand lopen is how Dutch says walking your bike.'), 'lopen.'] },

      // ---- builds: the place itself
      { en: 'The Trompettersteeg is so narrow that two people cannot pass each other.', parts: ['De Trompettersteeg is', FK(['zo smal dat', 'zo smal als', 'zoveel smal dat'], 0, 'bijzin',
        'zo ... dat gives a result: so narrow that. zo smal als compares two things.'), 'twee mensen', FK(['elkaar niet kunnen passeren', 'niet elkaar kunnen passeren'], 0, 'neg',
        'elkaar is like a small pronoun and comes before niet.'), '.'] },
      { en: 'The Oude Kerk was consecrated in 1306 and is the oldest building in the city.', parts: ['De Oude Kerk', FK(['werd', 'wordt'], 0, 'passief',
        '1306 is the past, so werd.'), 'in 1306', FK(['ingewijd', 'geïnwijd', 'ingewijdt'], 0, 'sep',
        'inwijden is separable: in + gewijd, and wijd ends in d, so nothing is added.'), 'en is', FK(['het oudste', 'de oudste'], 0, 'dehet',
        'gebouw is a het-word, so het oudste gebouw.'), 'gebouw van de stad.'] },
      { en: 'The reddish brown posts on the pavement are called Amsterdammertjes.', parts: ['De', FK(['roodbruine', 'roodbruin'], 0, 'adj',
        'Before a plural the adjective takes -e: de roodbruine paaltjes.'), 'paaltjes op de stoep', FK(['heten', 'noemen'], 0, 'woord',
        'Things heten a name. noemen needs someone who does the naming: wij noemen ze Amsterdammertjes.'), 'Amsterdammertjes.'] },
      { en: 'At night the alleys are lit by red neon.', parts: ["'s Nachts", FK(['worden de steegjes', 'de steegjes worden'], 0, 'v2',
        "'s Nachts fills slot 1, so the verb comes second."), 'verlicht', FK(['door', 'van'], 0, 'passief',
        'In a passive sentence the cause comes with door.'), FK(['rood', 'rode'], 0, 'adj',
        'neon is a het-word, and without an article a het-word takes no -e: rood neon.'), 'neon.'] },
      { en: 'Walk along the canal, turn right after the third bridge, and the church is straight ahead.', parts: ['Loop', FK(['langs', 'lang'], 0, 'weg',
        'langs is along. lang is long, or tall.'), 'de gracht, ga na de', FK(['derde', 'drie'], 0, 'getal',
        'An order needs the ordinal: de derde brug.'), 'brug', FK(['rechtsaf', 'rechtop'], 0, 'weg',
        'rechtsaf is turning right. rechtop means upright.'), ', en de kerk ligt recht voor je.'] },
      { en: 'How many bikes are on that bridge? There must be at least a hundred.', parts: [FK(['Hoeveel fietsen staan er', 'Hoeveel fietsen er staan'], 0, 'v2',
        'In a direct question the verb comes right after the question phrase: hoeveel fietsen staan er.'), 'op die brug?', FK(['Het moeten er', 'Het moet er'], 0, 'er',
        'With het ... zijn and a plural the verb is plural too: het moeten er honderd zijn.'), 'minstens honderd zijn.'] },

      // ---- builds: the people
      { en: 'The Dutch are the tallest people in the world, and on the Wallen you notice it.', parts: ['Nederlanders zijn de', FK(['langste', 'hoogste'], 0, 'woord',
        'People are lang, tall. hoog is for towers and mountains.'), 'mensen ter wereld, en op de Wallen', FK(['merk je dat', 'je merkt dat'], 0, 'v2',
        'op de Wallen fills slot 1 of the second clause, so the verb comes next: merk je.'), '.'] },
      { en: 'The guide with the umbrella walks in front, and forty tourists follow her across the bridge.', parts: ['De gids met de paraplu loopt voorop, en veertig toeristen', FK(['volgen haar', 'volgen zij', 'volgt haar'], 0, 'obj',
        'The guide is the object, so haar. Forty tourists are plural, so volgen.'), 'over de brug.'] },
      { en: 'The woman who rents out the bikes speaks four languages.', parts: ['De vrouw', FK(['die', 'dat'], 0, 'diedat',
        'vrouw is a de-word, so die.'), 'de fietsen', FK(['verhuurt', 'huurt'], 0, 'woord',
        'She lets them out to others: verhuurt. huurt would mean she rents them herself.'), ', spreekt vier talen.'] },
      { en: 'An Amsterdammer walks faster than a tourist, and cycles even faster.', parts: ['Een Amsterdammer loopt', FK(['sneller', 'snelder'], 0, 'vergelijk',
        'snel becomes sneller.'), 'dan een toerist, en fietst', FK(['nog sneller', 'nog meer snel'], 0, 'vergelijk',
        'Even faster is nog sneller: nog makes the comparative stronger.'), '.'] },
      { en: 'The man with the cheap tickets tried to pull the wool over our eyes.', parts: ['De man met de goedkope kaartjes probeerde ons', FK(['een rad voor ogen', 'een wiel voor ogen', 'een rad voor de ogen'], 0, 'idioom',
        'iemand een rad voor ogen draaien means to fool someone. The saying has no article before ogen.'), FK(['te draaien', 'draaien'], 0, 'omte',
        'proberen takes te: probeerde ... te draaien.'), '.'] },
      { en: 'With his map upside down the tourist looked a fool.', parts: ['Met zijn kaart ondersteboven', FK(['stond de toerist', 'de toerist stond'], 0, 'v2',
        'The opening phrase fills slot 1, so the verb comes second.'), FK(['voor gek', 'als gek'], 0, 'idioom',
        'voor gek staan means to look a fool. Only voor.'), '.'] },

      // ---- builds: the end of English, and review
      { en: 'As soon as I said something in Dutch, the bartender answered in English. Not any more.', parts: [FK(['Zodra ik iets in het Nederlands zei', 'Zodra ik zei iets in het Nederlands'], 0, 'bijzin',
        'zodra opens a sub-clause, so the verb goes to the end: zei.'), ',', FK(['antwoordde de barman', 'de barman antwoordde'], 0, 'v2',
        'The zodra-clause fills slot 1, so the main clause starts with its verb.'), 'in het Engels.', FK(['Niet meer', 'Nog niet'], 0, 'woord',
        'niet meer means no longer. nog niet means not yet.'), '.'] },
      { en: 'The tourist said he had been looking for the station for an hour.', parts: ['De toerist zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement.'), 'hij al een uur naar het station', FK(['had gezocht', 'had gezoekt', 'was gezocht'], 0, 'perf',
        'zoeken is irregular: gezocht, with hebben.'), '.'] },
      { en: "Just walk on a bit, I'll wait here.", parts: [FK(['Loop maar even door', 'Loop door maar even'], 0, 'soft',
        'maar even sits in the middle, and the prefix door closes the command.'), ', ik wacht hier wel.'] },

      // ---- words: the alleys, the people, five replayed
      { w: 'the alley', nl: 'de steeg' }, { w: 'the little alley', nl: 'het steegje', wrong: 'de steegje' },
      { w: 'the guide', nl: 'de gids' }, { w: 'the guided tour', nl: 'de rondleiding' },
      { w: 'the neon', nl: 'het neon', wrong: 'de neon' }, { w: 'the Amsterdam bollard', nl: 'het Amsterdammertje', wrong: 'de Amsterdammertje' },
      { w: 'the pavement', nl: 'de stoep' }, { w: 'the canal cruise boat', nl: 'de rondvaartboot' },
      { w: 'the group', nl: 'de groep' }, { w: 'the person from Amsterdam', nl: 'de Amsterdammer' },
      { w: 'the umbrella', nl: 'de paraplu' }, { w: 'the height (of a person)', nl: 'de lengte' },
      { w: 'the giant', nl: 'de reus' }, { w: 'the bike bell', nl: 'de fietsbel' },
      { w: 'the tourist', nl: 'de toerist' }, { w: 'the local resident', nl: 'de buurtbewoner' },
      { w: 'the piece of gossip', nl: 'de roddel' }, { w: 'the company (people around you)', nl: 'het gezelschap', wrong: 'de gezelschap' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'Mijn buurman is twee meter lang.', o: ['My neighbour is two metres tall.', 'My neighbour lives two metres away.', 'My neighbour has been here for two metres.'], a: 0, r: 'woord',
        w: 'For people lang means tall. hoog is only for things like towers.' },
      { read: true, nl: 'Ik heb het niet gezien, maar ik heb het wel gehoord.', o: ['I did not see it, but I did hear it.', 'I saw it, but I did not hear it.', 'I neither saw it nor heard it.'], a: 0, r: 'soft',
        w: 'niet goes with gezien and wel with gehoord: the hearing did happen.' },
      { read: true, nl: 'De gids zei dat we bij elkaar moesten blijven.', o: ['The guide said we had to stay together.', 'The guide said we could split up.', 'The guide asked whether we wanted to stay together.'], a: 0, r: 'indirect',
        w: 'bij elkaar blijven is staying together, and moesten makes it an instruction. Asking would be vroeg of.' },
      { read: true, nl: 'Doe effe normaal, man.', o: ['Just behave, man.', 'Do it normally, a little.', 'Normally I do it, man.'], a: 0, r: 'cult',
        w: 'effe is the spoken form of even, and doe normaal means behave yourself. It is blunt, not rude.' },
      { read: true, nl: 'De Trompettersteeg is ongeveer een meter breed.', en: 'The Trompettersteeg is about one metre wide.' },
      { read: true, nl: "Op de Wallen is het altijd druk, ook om drie uur 's nachts.", en: 'On the Wallen it is always busy, even at three in the morning.' },

      // ---- listens: the church, the alley, a canal, a height
      { listen: true, nl: 'de Oude Kerk', en: 'the oldest building in Amsterdam' }, { listen: true, nl: 'de Trompettersteeg', en: 'the narrowest alley' },
      { listen: true, nl: 'de Oudezijds Achterburgwal', en: 'one of the two canals of the Wallen' }, { listen: true, nl: 'twee meter', en: '2 metres' },

      // ---- looks: the dog, a bridge over the canal, a tree by the water
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },

      // ---- de of het
      { dehet: true, nl: 'neonbord', art: 'het', en: 'the neon sign', w: 'The last part decides: het bord, so het neonbord.' },
      { dehet: true, nl: 'kerktoren', art: 'de', en: 'the church tower', w: 'The last part decides: de toren, so de kerktoren.' },
    ] }]);
})();
