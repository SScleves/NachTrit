// Nachtrit, Nijmegen (tier 12, B1 to B2): level 118 Het station. Nijmegen Centraal at the foot of the hill: platforms, the
// departures board, the bike shed and the bus station outside, trains to Arnhem, Venlo and Den Bosch, the long climb to the
// Stevenskerk and the Valkhof, the Waalkade and the Waalbrug below, the ferry on the Waal. Travel and getting around: train,
// bus, ferry, bike, directions, the time, tickets, delays.
// New at tier 12 and drilled here: modal particles (hoor, maar, eens, toch, wel, even, nou eenmaal), idioms (op het nippertje,
// tussen wal en schip, de weg kwijt zijn, zich er niet bij neerleggen is left out on purpose), compound nouns with linking s and
// the article of the last part (de kaartjesautomaat, het stationsplein, het treinstation), formal register (u and uw, Geachte,
// Hoogachtend), the Vierdaagse: since 1909, in July, gladioli on the last day, and the Nijmegen oldest-city joke.
// Review: V2 after a fronted phrase, sub-clause with verb last (dat ze ... gemist had), passive with wordt, perfectum
// (gelopen), indirect speech (zei dat), zou for polite requests, superlatives and comparatives, telling the time, adjective -e.
// Still inside the fence: 16 words max, nothing from tier 13.
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar (hoor, maar, even, wel, toch), bijzin - werkwoord naar
// het einde, V2 word order, perfectum, de vs het; _site/situations/directions (Ja hoor, het is hier vlakbij. Loop maar rechtdoor.
// rechtdoor, de plattegrond, de ingang, de uitgang, oversteken), _site/situations/polite-phrases (Kunt u mij helpen, Pardon mag ik
// er even langs, Mag ik u iets vragen), MOC Gevoel & uitdrukkingen, MOC Tijd, dagen & maanden, _site/words (de trein, de bus,
// het openbaar vervoer, het centraal station); levels 110 and 102 for the replayed words; content/towns.js for Nijmegen (de
// Waalbrug 1936, de Stevenskerk, Het Valkhof, De Oversteek 2013 and its 48 lamps, de Waag, de gladiool, de wandelaar, the oldest
// city rumour, the Vierdaagse joke).
// New rules: idioom, samen, formeel, defined and guarded below. soft, v2, bijzin, perf, adj and woord exist in data.js and
// levels.js; passief, indirect, vergelijk, zou and klok are guarded below in case this file loads first.
// New props: none. Only hond, brug and nummer are used (not fiets: the word pool has het fietspad; not water: de Waalkade and
// de veerpont are in the pool; not deur or lamp: no ingang or stoplamp word).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms and fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: article and linking s', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.passief = window.RULES.passief || { name: 'Passive: wordt plus participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 118, act: 12, name: 'Het station', town: 'nijmegen', place: 'station', theme: 'square', ...P,
    intro: 'In the oldest city in the country the trains are late the old-fashioned way. The mist changed nothing about that.',
    introNl: 'In de oudste stad van het land zijn de treinen ouderwets te laat. De mist heeft daar niets aan veranderd.',
    mission: {
      where: 'Nijmegen station, from the platforms through the bike shed to the station square, then the long climb up to the Stevenskerk with the Waal and the Waalbrug lying below. Nijmegen is the only town here with a hill, so the dead take the stairs slowly and the bike does not take them at all.',
      carry: 'Two leads, an OV-chipkaart with €1,10 on it, a gladiolus left over from last July, a ticket split to the cent with the neighbours, and the grammar book, still never opened. No helmet. On a hill that matters even less than on the flat, because you walk.',
      want: 'Since the mist the dead stand on every platform and ask which train, which stop and what time. Some still hold gladioli from the Vierdaagse and ask where the party is. The conductor writes letters about the delays and signs them Hoogachtend. Maastricht claims its station is older, and Nijmegen has not slept since. The women on the platform, still taller than you, say hoor and maar, and you have to know where those words go. The dogs always need a walk, even on a bridge.' },
    items: [
      // ---- builds: modal particles (hoor, maar, eens, toch, wel, even, nou)
      { en: "Yes, it's close by. Just walk straight on.", parts: [FK(['Ja hoor', 'Ja hoort'], 0, 'soft',
        'hoor closes a friendly answer and has no ending: Ja hoor.'), ', het is hier vlakbij.', FK(['Loop maar rechtdoor', 'Loop rechtdoor maar'], 0, 'soft',
        'maar softens a command and sits right behind the verb: Loop maar rechtdoor.'), '.'] },
      { en: 'Take a look at the departures board.', parts: ['Kijk', FK(['eens', 'een'], 0, 'soft',
        'eens makes a command friendly: kijk eens. een is only the article.'), 'op het vertrekbord.'] },
      { en: "It is platform four, isn't it?", parts: ['Het is spoor vier,', FK(['toch', 'tog'], 0, 'soft',
        'toch at the end of a statement asks for a yes, like right? It is spelled with ch.'), '?'] },
      { en: 'The train does not run, but the bus does.', parts: ['De trein rijdt niet, maar de bus rijdt', FK(['wel', 'geen'], 0, 'soft',
        'wel answers a niet and says: this one does. geen needs a noun right behind it.'), '.'] },
      { en: "That's just how it is: in the mist the trains are late.", parts: ['Het is', FK(['nou eenmaal', 'nu eenmaals', 'nou een maal'], 0, 'idioom',
        'nou eenmaal means that is just how it is. Learn it as a fixed phrase.'), 'zo: bij mist', FK(['zijn de treinen', 'de treinen zijn'], 0, 'v2',
        'Bij mist fills slot 1, so the verb comes second: zijn de treinen.'), 'te laat.'] },
      { en: 'Excuse me, may I get past for a moment?', parts: ['Pardon, mag ik', FK(['er even langs', 'even er langs', 'er langs even'], 0, 'soft',
        'The little word er comes first, then even softens the request: er even langs.'), '?'] },

      // ---- builds: idioms
      { en: 'We caught the train just in time.', parts: ['We haalden de trein', FK(['op het nippertje', 'in het nippertje', 'bij het nippertje'], 0, 'idioom',
        'Fixed phrase: op het nippertje means just in time. The preposition cannot be swapped.'), '.'] },
      { en: 'If you miss the transfer, you fall between two stools.', parts: ['Als je de overstap mist,', FK(['dan val je', 'dan je valt', 'dan valt je'], 0, 'bijzin',
        'After an als-clause the main clause starts with its verb: dan val je.'), FK(['tussen wal en schip', 'tussen wal en boot', 'tussen kade en schip'], 0, 'idioom',
        'Fixed phrase from a river town: tussen wal en schip vallen, to fall between the quay and the ship.'), '.'] },
      { en: "Excuse me, I'm lost. Could you help me?", parts: ['Pardon, ik ben de weg', FK(['kwijt', 'weg'], 0, 'idioom',
        'de weg kwijt zijn is the fixed way to say that you are lost.'), '. Zou u mij kunnen helpen?'] },

      // ---- builds: compound nouns
      { en: 'At the ticket machine on the station square the queue is long.', parts: ['Bij', FK(['de kaartjesautomaat', 'het kaartjesautomaat', 'de kaartjeautomaat'], 0, 'samen',
        'The last part decides the article: de automaat, so de kaartjesautomaat, with the linking s.'), 'op', FK(['het stationsplein', 'het stationplein', 'de stationsplein'], 0, 'samen',
        'The last part decides: het plein, so het stationsplein. The linking s stays in.'), 'is de rij lang.'] },

      // ---- builds: formal register
      { en: 'Good afternoon, may I see your ticket, please?', parts: ['Goedemiddag, mag ik', FK(['uw', 'u'], 0, 'formeel',
        'With u the possessive is uw. u alone is the person, not what belongs to them.'), 'kaartje zien, alstublieft?'] },
      { en: 'Dear Ms De Vries, I am writing to you about my delayed train.', parts: [FK(['Geachte', 'Gerespecteerd'], 0, 'formeel',
        'A formal letter opens with Geachte mevrouw or Geachte heer.'), 'mevrouw De Vries, ik schrijf u over mijn', FK(['vertraagde', 'vertraagd', 'vertraagt'], 0, 'adj',
        'After mijn the adjective always takes -e: mijn vertraagde trein.'), 'trein.'] },
      { en: 'I am waiting for your answer. Yours sincerely, Santi Sanchez.', parts: ['Ik wacht op uw antwoord.', FK(['Hoogachtend', 'Hooggeacht', 'Hoog achtend'], 0, 'formeel',
        'Hoogachtend is the formal closing of a letter, written as one word.'), ', Santi Sanchez.'] },
      { en: 'Could you tell me how I get to the Valkhof?', parts: [FK(['Zou', 'Zal'], 0, 'zou',
        'zou plus kunnen makes a request polite. zal is for promises.'), 'u mij kunnen zeggen', FK(['hoe ik bij het Valkhof kom', 'hoe kom ik bij het Valkhof'], 0, 'bijzin',
        'In an indirect question the verb goes last: hoe ik ... kom.'), '?'] },

      // ---- builds: the Vierdaagse, the oldest city, the hill
      { en: 'The Four Days Marches have been walked in Nijmegen since 1909.', parts: ['De Vierdaagse', FK(['wordt', 'worden'], 0, 'passief',
        'De Vierdaagse is one event, so wordt. The participle comes at the end.'), 'sinds 1909 in Nijmegen', FK(['gelopen', 'geloopt', 'gelopt'], 0, 'perf',
        'lopen is irregular: gelopen.'), '.'] },
      { en: 'On Friday the walkers get gladioli at the finish.', parts: ['Op vrijdag', FK(['krijgen de wandelaars', 'de wandelaars krijgen'], 0, 'v2',
        'Op vrijdag fills slot 1, so the verb comes second: krijgen de wandelaars.'), FK(['gladiolen', 'gladioolen', 'gladiolens'], 0, 'woord',
        'The plural of de gladiool is gladiolen.'), 'bij de finish.'] },
      { en: 'Nijmegen is the oldest city in the country, but Maastricht thinks not.', parts: ['Nijmegen is de', FK(['oudste', 'oudst', 'meest oud'], 0, 'vergelijk',
        'After de the superlative takes -ste: de oudste.'), 'stad van Nederland, maar Maastricht', FK(['denkt van niet', 'denkt niet van', 'denkt geen'], 0, 'idioom',
        'denkt van niet is the fixed way to say thinks otherwise.'), '.'] },
      { en: 'The road to the Stevenskerk is steeper than you think.', parts: ['De weg naar de Stevenskerk is', FK(['steiler', 'steilder', 'meer steil'], 0, 'vergelijk',
        'A short adjective takes -er: steil becomes steiler. meer steil is not Dutch.'), 'dan je denkt.'] },

      // ---- builds: review of earlier tiers
      { en: 'Paola said that she had missed the bus.', parts: ['Paola zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement. of belongs to a reported question, after vroeg.'), FK(['ze de bus gemist had', 'ze had de bus gemist', 'had ze de bus gemist'], 0, 'bijzin',
        'After dat the verbs go to the end: ze de bus gemist had.'), '.'] },
      { en: 'The last train to Arnhem leaves at 11:45.', parts: ['De laatste trein naar Arnhem vertrekt om', FK(['kwart voor twaalf', 'kwart over twaalf', 'kwart voor elf'], 0, 'klok',
        'Eleven forty-five is a quarter before twelve: kwart voor twaalf.'), '.'] },

      // ---- words: the station, the bus, the bridge, the river
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the transfer', nl: 'de overstap' }, { w: 'the public transport card', nl: 'de OV-chipkaart' },
      { w: 'the departures board', nl: 'het vertrekbord', wrong: 'de vertrekbord' }, { w: 'the waiting room', nl: 'de wachtkamer' },
      { w: 'the express train', nl: 'de sneltrein' }, { w: 'the escalator', nl: 'de roltrap' },
      { w: 'the bus station', nl: 'het busstation', wrong: 'de busstation' }, { w: 'the bus driver', nl: 'de buschauffeur' },
      { w: 'the ferry', nl: 'de veerpont' }, { w: 'the quay along the Waal', nl: 'de Waalkade' },
      { w: 'the roundabout', nl: 'de rotonde' }, { w: 'the detour', nl: 'de omleiding' },
      { w: 'the roadworks', nl: 'de werkzaamheden' }, { w: 'the single ticket', nl: 'het enkeltje', wrong: 'de enkeltje' },
      { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },

      // ---- reads: four traps with their own options, two plain
      { read: true, nl: 'Neem maar de volgende trein, hoor.', o: ['Just take the next train, really.', 'Do not take the next train.', 'Listen to the next train.'], a: 0, r: 'soft',
        w: 'maar softens the command and hoor reassures. Nothing is forbidden and nobody is told to listen.' },
      { read: true, nl: 'Het is nou eenmaal zo: de trein is te laat.', o: ['That is just how it is: the train is late.', 'The train is late again today.', 'It is only now true that the train is late.'], a: 0, r: 'idioom',
        w: 'nou eenmaal is a fixed phrase for that is just how it is. Again would be weer.' },
      { read: true, nl: 'Geachte reizigers, wij verzoeken u de trein te verlaten.', o: ['Dear travellers, we ask you to leave the train.', 'Dear travellers, we ask you to board the train.', 'Dear travellers, we thank you for travelling.'], a: 0, r: 'formeel',
        w: 'Geachte and verzoeken u are formal. verlaten means to leave. Boarding would be instappen.' },
      { read: true, nl: 'Je kunt de trein nog wel halen, als je even doorloopt.', o: ['You can still catch the train if you keep walking a bit.', 'You can no longer catch the train, even if you walk.', 'You can still walk through the train.'], a: 0, r: 'soft',
        w: 'nog wel says it is still possible, and even softens doorloopt: just keep walking.' },
      { read: true, nl: 'Tijdens de Vierdaagse zitten de treinen vol en loopt half Nijmegen op straat.', en: 'During the Four Days Marches the trains are full and half of Nijmegen is out on the street.' },
      { read: true, nl: 'Elke avond gaan de lampen van De Oversteek aan, voor de soldaten van 1944.', en: 'Every evening the lamps of De Oversteek come on, for the soldiers of 1944.' },

      // ---- listens: two Vierdaagse words, the time
      { listen: true, nl: 'de gladiool', en: 'the gladiolus' }, { listen: true, nl: 'de wandelaar', en: 'the walker' },
      { listen: true, nl: 'kwart voor negen', en: '8:45' },

      // ---- looks: the dog, the bridge over the Waal, the platform number
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'nummer', value: 7, nl: 'zeven', en: '7' },

      // ---- de of het
      { dehet: true, nl: 'treinstation', art: 'het', en: 'the train station', w: 'The last part decides: het station, so het treinstation.' },
      { dehet: true, nl: 'buskaart', art: 'de', en: 'the bus card', w: 'The last part decides: de kaart, so de buskaart.' },
    ] }]);
})();
