// Nachtrit, Urk (tier 8, B1): level 86 Het station. Urk has no railway, so "het station" is the bus stop by the
// harbour, the nearest train is a long bus ride away, and on Sunday nothing moves anyway. Buses, trains, the ferry
// idea, bikes, directions, the time, tickets, delays and connections, with the harbour and the kotters behind.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl, voordat
// and of; want, maar and dus keep normal word order (want against omdat is its own fork); the main clause after a
// sub-clause starts with its verb (Als het regent, neem ik de bus). Review: the perfectum with hebben and
// the single t of gewacht, the imperfectum (kwamen, gingen), telling the time (half negen), niet vs geen,
// reflexive voelen (ik voel me).
// Still inside the fence: 14 words max, no relative clauses, no te plus infinitive, no passive, no separable
// verbs inside a sub-clause.
// Sources: dutch-lessons vault, 02 - Grammar (bijzin - werkwoord naar het einde, V2 word order, perfectum,
// 't kofschip, imperfectum, niet vs geen), _site/maps/MOC Voegwoorden and MOC Tijd, dagen & maanden,
// _site/situations/directions (de uitgang, de plattegrond, links, rechts), _site/words (de bus, de trein,
// het centraal station, het openbaar vervoer, instappen / uitstappen), sentences (Balen, mijn trein is net weg;
// Balen, dan haal ik mijn aansluiting niet); content/towns.js for Urk (de vissersvloot, de kotter, de visafslag,
// de haven, de vuurtoren, de zondagsrust, Op zondag vaart hier niemand uit, the island until 1939 joke).
// New rules: none (klok is guarded below). New props: none (fiets, kerk, water).
(() => {
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart over', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 86, act: 8, name: 'Het station', town: 'urk', place: 'station', theme: 'dyke', ...P,
    intro: 'Urk has no railway station, so the station is a bus stop with big plans, and on Sunday even that one is in church.',
    introNl: 'Urk heeft geen treinstation, dus het station is een bushalte met grote plannen, en op zondag zit die ook in de kerk.',
    mission: {
      where: 'The bus stop by the harbour that everybody on Urk calls the station, with the kotters behind it and the grey IJsselmeer behind them. The nearest train is a long bus ride away, and Alblasserdam is longer. Either way the dogs need a walk. The dogs always need a walk.',
      carry: 'A bus ticket for a bus that does not run on Sunday, a bag of smoked fish split to the cent with the two tourists beside you, and the grammar book, still never opened. No helmet. The wind on the dyke does not ask.',
      want: 'Since the mist came, everyone who spoke Dutch changed, and on Urk nobody noticed, because nobody else understands the dialect anyway. The dead at the bus stop now talk in long sentences: omdat, dat, als, toen, terwijl, voordat, and the verb goes to the very end. After a sub-clause the main clause starts with its verb. Want, maar and dus stay calm. The women in their traditional dress are still taller than you. On Sunday the dead are in church anyway. On any other day they are in a hurry, and they still split the bill.' },
    items: [
      // ---- builds: the verb to the end after omdat, dat, als, toen, terwijl, voordat
      { en: 'I am late because the bus was full.', parts: ['Ik ben te laat omdat de bus', FK(['vol was', 'was vol'], 0, 'bijzin',
        'omdat sends the verb to the very end of its clause: de bus vol was.'), '.'] },
      { en: 'I think the train is a quarter of an hour late.', parts: ['Ik denk dat de trein een kwartier', FK(['te laat is', 'is te laat'], 0, 'bijzin',
        'dat sends the verb to the end: dat de trein te laat is.'), '.'] },
      { en: 'If it rains, I take the bus.', parts: ['Als het regent,', FK(['neem ik', 'ik neem'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: neem ik.'), 'de bus.'] },
      { en: 'When we got to the harbour, the cutter was already gone.', parts: ['Toen we bij de haven', FK(['kwamen', 'kwamen we'], 0, 'bijzin',
        'toen sends the verb to the end of its clause: toen we bij de haven kwamen.'), ',', FK(['was de kotter', 'de kotter was'], 0, 'bijzin',
        'After the toen-clause the main clause starts with its verb: was de kotter al weg.'), 'al weg.'] },
      { en: 'While I wait for the bus, I read my mail.', parts: ['Terwijl', FK(['ik op de bus wacht', 'wacht ik op de bus'], 0, 'bijzin',
        'terwijl sends the verb to the end: ik op de bus wacht.'), ',', FK(['lees ik', 'ik lees'], 0, 'bijzin',
        'The sub-clause came first, so the next clause starts with its verb: lees ik.'), 'mijn mail.'] },
      { en: 'Before I walk to the bus stop, I first walk the dogs.', parts: ['Voordat', FK(['ik naar de bushalte loop', 'loop ik naar de bushalte'], 0, 'bijzin',
        'voordat sends the verb to the end: ik naar de bushalte loop.'), ',', FK(['laat ik', 'ik laat'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: laat ik ... uit.'), 'eerst de honden uit.'] },
      { en: 'Because it is storming, nobody sails out.', parts: ['Omdat', FK(['het stormt', 'stormt het'], 0, 'bijzin',
        'omdat sends the verb to the end: het stormt.'), ',', FK(['vaart niemand', 'niemand vaart'], 0, 'bijzin',
        'The sub-clause came first, so vaart goes before niemand. The prefix uit stays at the end.'), 'uit.'] },
      { en: 'When Urk was still an island, they all went by boat.', parts: ['Toen', FK(['Urk nog een eiland was', 'was Urk nog een eiland'], 0, 'bijzin',
        'toen sends the verb to the end: Urk nog een eiland was.'), ',', FK(['gingen ze', 'ze gingen'], 0, 'bijzin',
        'After the toen-clause the main clause starts with its verb: gingen ze.'), 'allemaal met de boot.'] },
      { en: 'Do you know if the bus to Emmeloord is running today?', parts: ['Weet u', FK(['of de bus naar Emmeloord vandaag rijdt', 'of rijdt de bus naar Emmeloord vandaag'], 0, 'bijzin',
        'of works like dat: the verb goes to the end, of de bus vandaag rijdt.'), '?'] },
      { en: 'I feel sick because the boat rocks so much.', parts: ['Ik voel', FK(['me', 'zich'], 0, 'refl',
        'The self-word matches the subject: ik voel me. zich is for hij, zij and ze.'), 'niet lekker omdat', FK(['de boot zo schommelt', 'schommelt de boot zo'], 0, 'bijzin',
        'omdat sends the verb to the end: de boot zo schommelt.'), '.'] },

      // ---- builds: omdat against want, and want, maar, dus keep their word order
      { en: 'I am late because the bus never comes.', parts: ['Ik ben te laat', FK(['omdat', 'want'], 0, 'bijzin',
        'The verb komt stands at the end, and only omdat sends it there. want would need de bus komt nooit, with the verb second.'), 'de bus nooit komt.'] },
      { en: 'I take the bike, because the bus does not run on Sunday.', parts: ['Ik neem de fiets, want de bus', FK(['rijdt niet', 'niet rijdt'], 0, 'bijzin',
        'want keeps normal word order: the verb stays second, de bus rijdt niet.'), 'op zondag.'] },
      { en: 'No train goes to Urk, so I take the bus.', parts: ['Er rijdt geen trein naar Urk, dus', FK(['ik neem de bus', 'ik de bus neem'], 0, 'bijzin',
        'dus does not send the verb to the end: the verb stays second, ik neem de bus.'), '.'] },
      { en: 'I would love to come, but the last bus has already gone.', parts: ['Ik wil graag komen, maar de laatste bus', FK(['is al weg', 'al weg is'], 0, 'bijzin',
        'maar keeps normal word order: the verb is second, de laatste bus is al weg.'), '.'] },

      // ---- builds: directions and the time
      { en: 'If you are at the lighthouse, you turn right.', parts: ['Als', FK(['u bij de vuurtoren bent', 'bent u bij de vuurtoren'], 0, 'bijzin',
        'als sends the verb to the end: u bij de vuurtoren bent.'), ',', FK(['gaat u', 'u gaat'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: gaat u rechtsaf.'), 'rechtsaf.'] },
      { en: 'The bus to Emmeloord leaves at half past eight.', parts: ['De bus naar Emmeloord vertrekt om', FK(['half negen', 'half acht'], 0, 'klok',
        'half counts towards the next hour: half negen is 8:30. half acht is 7:30.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'I have waited an hour at the bus stop already.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux',
        'Waiting is not going anywhere, so hebben.'), 'al een uur bij de bushalte', FK(['gewacht', 'gewachtd'], 0, 'kof',
        'wacht already ends in a t, and Dutch does not add a second one: gewacht.'), '.'] },
      { en: 'On Sunday there is no bus, so I cycle.', parts: ['Op zondag is er', FK(['geen', 'niet'], 0, 'neg',
        'geen goes before a noun: geen bus. niet is for verbs and adjectives.'), 'bus, dus ik fiets.'] },

      // ---- words: stops, tickets, the timetable, the harbour, the road
      { w: 'the bus', nl: 'de bus' }, { w: 'the bus stop', nl: 'de bushalte' },
      { w: 'the station', nl: 'het station', wrong: 'de station' }, { w: 'the platform', nl: 'het perron', wrong: 'de perron' },
      { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' }, { w: 'the OV chip card', nl: 'de ov-chipkaart' },
      { w: 'the ticket counter', nl: 'het loket', wrong: 'de loket' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the timetable', nl: 'de dienstregeling' }, { w: 'the connection', nl: 'de aansluiting' },
      { w: 'the ferry', nl: 'de veerboot' }, { w: 'the harbour', nl: 'de haven' },
      { w: 'the fishing cutter', nl: 'de kotter' }, { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },
      { w: 'the bike shed', nl: 'de fietsenstalling' }, { w: 'the crossing', nl: 'de kruising' },
      { w: 'the exit', nl: 'de uitgang' }, { w: 'the map', nl: 'de plattegrond' },

      // ---- reads: three traps with their own options, three plain lines from the bus stop
      { read: true, nl: 'Als de bus te laat is, mis ik mijn aansluiting.', o: ['If the bus is late, I miss my connection.', 'Because the bus was late, I missed my connection.', 'The bus is late, so I took another connection.'], a: 0, r: 'bijzin',
        w: 'als plus is: it is not past and not certain yet. After the als-clause the main clause starts with its verb: mis ik.' },
      { read: true, nl: 'Omdat het zondag is, rijdt er geen bus.', o: ['Because it is Sunday, no bus runs.', 'It is Sunday, but a bus runs anyway.', 'No bus runs unless it is Sunday.'], a: 0, r: 'bijzin',
        w: 'omdat is because. The clause after the comma is the result: rijdt er geen bus.' },
      { read: true, nl: 'Ik wacht al lang, want mijn bus heeft vertraging.', o: ['I have been waiting a long time, because my bus is delayed.', 'I waited a long time, but my bus was delayed.', 'My bus is waiting a long time, so I am delayed.'], a: 0, r: 'bijzin',
        w: 'want is because and keeps normal word order. al lang with a present verb means a wait that is still going on.' },
      { read: true, nl: 'Ik moet nog een kaartje kopen voordat de bus komt.', en: 'I still have to buy a ticket before the bus comes.' },
      { read: true, nl: 'Op zondag vaart hier niemand uit.', en: 'On Sunday nobody sails out here.' },
      { read: true, nl: 'Let op: door een storing rijden er geen treinen.', en: 'Attention: because of a disruption no trains are running.' },

      // ---- listens: the time, a harbour word, the board
      { listen: true, nl: 'kwart over vijf', en: '5:15' }, { listen: true, nl: 'de visafslag', en: 'the fish auction' },
      { listen: true, nl: 'het vertrekbord', en: 'the departure board' },

      // ---- looks: the bike, the church, the water
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },

      // ---- de or het
      { dehet: true, nl: 'busstation', art: 'het', en: 'the bus station', w: 'het busstation. A compound takes the article of its last part, and station is a het-word.' },
      { dehet: true, nl: 'reisplanner', art: 'de', en: 'the journey planner', w: 'de reisplanner. Both reis and planner are de-words, and the compound follows the last part.' },
    ] }]);
})();
