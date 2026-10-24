// Nachtrit, Groningen (tier 10, B1): level 102 Het station. Groningen station and the square in front of it: the stationshal
// and the departure board, the track numbers, the ticket machine and the OV chip card, the bike shed with its thousand
// locked bikes, the city buses and the night bus, the level crossing with its barrier, the headwind on the flat road to
// Zuidhorn, the golden Groninger Museum across the canal and the grey Martinitoren behind it. Everything about getting
// around: trains, buses, bikes, directions, the time, tickets and delays.
// New at tier 10 and drilled here: opinions (ik vind dat with the verb last, volgens mij with V2); hoewel with a verb-final
// clause against ondanks with a noun, and the main clause after a sub-clause starting with its verb; zullen for probability
// (zal wel, zullen wel, plus the infinitive at the end); separable verbs inside sub-clauses (omdat ik vroeg opsta, hoewel de
// bus aankomt, waar we moeten overstappen); diminutives, which are always het (het kaartje, het bankje, het treintje);
// the adjective -e in every case (een mooi oud station, het oude station, op oude fietsen).
// Review from earlier tiers: comparatives with dan, the perfectum with hebben and 't kofschip (gemist), the imperfectum
// of regular verbs (stopte, stapten), the imperative with a separable verb, om ... te, telling the time (tien voor half elf),
// the plural verb after veel studenten.
// Still inside the fence: 16 words max, no passive, no plusquamperfectum, no indirect speech, no idioms with wel/eens/hoor.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, scheidbare werkwoorden (aankomen,
// vertrekken, inchecken, opstaan), de vs het (every diminutive is het), V2 word order, 't kofschip, perfectum, imperfectum,
// 03 - Verbs/zullen (the three superpowers: zal, zullen we); _site/situations/opinions (Ik vind, Volgens mij);
// _site/situations/directions (de plattegrond, de ingang, de uitgang, links, rechtdoor); _site/words (het openbaar vervoer,
// het vervoer, het verkeer, de trein, de bus, de bushalte, het centraal station); MOC Tijd, dagen & maanden;
// content/towns.js for Groningen (Moi, Stad, het Groninger Museum opposite the station, de Martinitoren, d'Olle Grieze,
// de studenten, de fietsen on every bridge, the "kon minder" rumour).
// New rules: mening, hoewel, zal and dim, defined and guarded below. gebod, klok, omte and vergelijk are guarded too.
// New props: none. Only hond, brug and kerk are used (not fiets, water, lamp or deur: de fietsenstalling, het fietsslot,
// de slagboom and the station words could be taken for the prop).
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 102, act: 10, name: 'Het station', town: 'groningen', place: 'station', theme: 'square', ...P,
    intro: 'The departure board in Groningen says everything is delayed. Since the mist, it is the first time the board has been honest.',
    introNl: 'Het vertrekbord in Groningen meldt dat alles vertraging heeft. Sinds de mist is het bord voor het eerst eerlijk.',
    mission: {
      where: 'Groningen station and the square in front of it: the hall with the dead departure board, the bike shed with a thousand locked bikes and nobody to unlock them, the bus bays, the level crossing with its barrier stuck halfway. Across the canal the golden tower of the Groninger Museum, behind it the grey Martinitoren, still the tallest thing in town. The platform still trembles when a train comes in. That is only the train.',
      carry: 'A phone at three per cent with the journey planner open, an OV chip card with a balance split to the cent with the neighbours, a bike lock without a key, two leads because the dogs always need a walk, and the grammar book, still never opened. No helmet. The students on the bridge have none either, and they ask for no sympathy.',
      want: 'The dead on the platform have opinions and say them loudly: ik vind dat, volgens mij, hoewel, ondanks. They park the verb at the end of the clause and glue the prefix back on (omdat de trein te laat aankomt). The board says zal wel to everything. Anything with a little -je is het, even a bench. The women on the platform are still taller than you, and they are not in a hurry either. Say Moi, take your seat, and get the grammar right before the 17:07 leaves. Could be worse.' },
    items: [
      // ---- builds: opinions, ik vind dat and volgens mij
      { en: 'I think the train is too expensive.', parts: ['Ik vind', FK(['dat de trein te duur is', 'dat de trein is te duur', 'dat is de trein te duur'], 0, 'mening',
        'ik vind dat opens a sub-clause, so the verb goes to the end: dat de trein te duur is.'), '.'] },
      { en: 'In my opinion the bike is faster than the bus in the city.', parts: ['Volgens mij', FK(['is de fiets', 'de fiets is'], 0, 'v2',
        'Volgens mij takes slot 1, so the verb comes second, then the subject: is de fiets.'), 'in de stad', FK(['sneller', 'meer snel'], 0, 'vergelijk',
        'Short adjectives add -er and use dan: sneller dan de bus.'), 'dan de bus.'] },

      // ---- builds: hoewel and ondanks
      { en: 'Although the train is late, I am in no hurry.', parts: ['Hoewel de trein', FK(['te laat is', 'is te laat'], 0, 'hoewel',
        'hoewel opens a sub-clause, so the verb goes last: te laat is.'), ',', FK(['heb ik', 'ik heb'], 0, 'v2',
        'After a sub-clause the main clause starts with its verb: heb ik geen haast.'), 'geen haast.'] },
      { en: 'Despite the rain we cycle to the station.', parts: ['Ondanks', FK(['de regen', 'het regent'], 0, 'hoewel',
        'ondanks takes a noun: ondanks de regen. With a whole clause you use hoewel het regent.'), 'fietsen we naar het station.'] },
      { en: 'Although the bus always arrives early, we still wait inside.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel',
        'A clause with its own verb needs hoewel. ondanks only goes with a noun.'), 'de bus altijd vroeg', FK(['aankomt', 'komt aan'], 0, 'sep',
        'In a sub-clause the verb sits at the end and the prefix glues back on: aankomt.'), ', wachten we toch binnen.'] },

      // ---- builds: separable verbs in sub-clauses
      { en: 'Because I get up early tomorrow, I am going to bed early tonight.', parts: ['Omdat ik morgen vroeg', FK(['opsta', 'sta op'], 0, 'sep',
        'After omdat the verb goes last and the prefix glues back on: opsta.'), ',', FK(['ga ik', 'ik ga'], 0, 'v2',
        'The main clause after a sub-clause starts with its verb: ga ik.'), 'vanavond vroeg naar bed.'] },
      { en: 'Do you know where we have to change?', parts: ['Weet je waar we', FK(['moeten overstappen', 'moeten stappen over'], 0, 'sep',
        'After a modal the separable verb is glued together again: moeten overstappen.'), '?'] },

      // ---- builds: zullen for probability
      { en: 'The train will probably be late again.', parts: ['De trein', FK(['zal', 'zullen'], 0, 'zullen',
        'One train, so zal. With wel it says what you expect: zal wel means will probably.'), 'wel weer', FK(['te laat zijn', 'zijn te laat'], 0, 'modal',
        'After zullen the other verb goes to the end as an infinitive: te laat zijn.'), '.'] },
      { en: 'The buses are probably stuck in traffic.', parts: ['De bussen', FK(['zullen', 'zal'], 0, 'zullen',
        'Plural buses, so zullen. zullen wel is the Dutch for probably.'), 'wel in de file', FK(['staan', 'te staan'], 0, 'modal',
        'After zullen there is no te: the bare infinitive staan closes the sentence.'), '.'] },

      // ---- builds: diminutives and the adjective -e
      { en: 'Where is the ticket that I bought yesterday?', parts: ['Waar is', FK(['het', 'de'], 0, 'verklein',
        'Every -je word is het, even though de kaart is a de-word: het kaartje.'), 'kaartje', FK(['dat', 'die'], 0, 'diedat',
        'kaartje is a het-word, so dat. The verb heb closes the clause.'), 'ik gisteren gekocht heb?'] },
      { en: 'Groningen has a beautiful old station.', parts: ['Groningen heeft een', FK(['mooi oud', 'mooie oude', 'mooi oude'], 0, 'adj',
        'station is a het-word and een is indefinite, so no -e: een mooi oud station.'), 'station.'] },
      { en: 'I think the old station is more beautiful than the new one.', parts: ['Ik vind het', FK(['oude', 'oud'], 0, 'adj',
        'After het (or de) the adjective always takes -e: het oude station.'), 'station', FK(['mooier', 'mooi', 'meer mooi'], 0, 'vergelijk',
        'Comparing takes -er and dan: mooier dan het nieuwe.'), 'dan het nieuwe.'] },
      { en: 'In Groningen many students ride old bikes without a light.', parts: ['In Groningen', FK(['rijden', 'rijdt'], 0, 'presens',
        'veel studenten is plural, so the verb is rijden.'), 'veel studenten op', FK(['oude', 'oud'], 0, 'adj',
        'Plural without an article still takes -e: oude fietsen.'), 'fietsen zonder licht.'] },

      // ---- builds: review of earlier tiers
      { en: 'I just missed the last train.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux',
        'Missing a train is not movement, so hebben: ik heb gemist.'), 'de laatste trein net', FK(['gemist', 'gemisd', 'gemissen'], 0, 'kof',
        'mis ends in s, a ketchup letter, so the participle takes -t: gemist.'), '.'] },
      { en: 'The bus stopped at the stop and we got on.', parts: ['De bus', FK(['stopte', 'stopde'], 0, 'imp',
        'stop ends in p, a ketchup letter, so the past takes -te: stopte.'), 'bij de halte en wij', FK(['stapten', 'stapden'], 0, 'imp',
        'stap ends in p too: stapten. The prefix in stays at the end.'), 'in.'] },
      { en: 'Walk straight on and turn left at the bridge.', parts: [FK(['Loop', 'Te lopen'], 0, 'gebod',
        'The imperative is the bare stem: loop.'), 'rechtdoor en sla bij de brug links', FK(['af', 'afslaan'], 0, 'sep',
        'afslaan splits in the imperative and the prefix goes to the end: sla ... af.'), '.'] },
      { en: 'It is difficult to find a spot for your bike in the city.', parts: ['Het is lastig om in de stad een plek voor je fiets', FK(['te vinden', 'vinden te', 'vindt te'], 0, 'omte',
        'om opens the clause and te stands right before the infinitive at the end: te vinden.'), '.'] },
      { en: 'The train to Zwolle leaves at 10:20.', parts: ['De trein naar Zwolle vertrekt om', FK(['tien voor half elf', 'tien over half elf', 'tien voor elf'], 0, 'klok',
        'Half elf is 10:30. Ten minutes before that is tien voor half elf, 10:20.'), '.'] },

      // ---- words: the station, the tracks, the bike shed, the roads
      { w: 'the track', nl: 'het spoor', wrong: 'de spoor' }, { w: 'the station hall', nl: 'de stationshal' },
      { w: 'the station square', nl: 'het stationsplein' }, { w: 'the bike shed', nl: 'de fietsenstalling' },
      { w: 'the ticket machine', nl: 'de kaartjesautomaat' }, { w: 'the subscription', nl: 'het abonnement', wrong: 'de abonnement' },
      { w: 'the transfer', nl: 'de overstap' }, { w: 'the rush hour', nl: 'de spits' },
      { w: 'the disruption', nl: 'de storing' }, { w: 'public transport', nl: 'het openbaar vervoer' },
      { w: 'the city bus', nl: 'de stadsbus' }, { w: 'the night bus', nl: 'de nachtbus' },
      { w: 'the map', nl: 'de plattegrond' }, { w: 'the bike lock', nl: 'het fietsslot', wrong: 'de fietsslot' },
      { w: 'the headwind', nl: 'de tegenwind' }, { w: 'the barrier', nl: 'de slagboom' },
      { w: 'the level crossing', nl: 'de overweg' }, { w: 'the zebra crossing', nl: 'het zebrapad', wrong: 'de zebrapad' },
      { w: 'the quarter of an hour', nl: 'het kwartier', wrong: 'de kwartier' },

      // ---- reads: four traps with their own options, two plain lines from the station
      { read: true, nl: 'Door een storing rijden er vandaag minder treinen.', o: ['Because of a disruption fewer trains run today.', 'Because of a disruption more trains run today.', 'Because of the rush hour no trains run today.'], a: 0, r: 'woord',
        w: 'Door een storing is because of a disruption, and minder means fewer.' },
      { read: true, nl: 'De trein naar Zwolle heeft tien minuten vertraging.', o: ['The train to Zwolle is ten minutes late.', 'The train to Zwolle leaves in ten minutes.', 'The train to Zwolle was ten minutes early.'], a: 0, r: 'woord',
        w: 'vertraging is a delay. heeft tien minuten vertraging means it is ten minutes late.' },
      { read: true, nl: 'Hoewel het regent, gaat Paola toch met de fiets.', o: ['Although it is raining, Paola still goes by bike.', 'Because it is raining, Paola goes by bike.', 'When it rains, Paola takes the train.'], a: 0, r: 'hoewel',
        w: 'hoewel means although, and toch repeats the contrast: she goes by bike anyway.' },
      { read: true, nl: 'De bus zal wel te laat zijn.', o: ['The bus will probably be late.', 'The bus is never late.', 'The bus was late yesterday.'], a: 0, r: 'zullen',
        w: 'zal wel is a guess about what is probably true: the bus will probably be late.' },
      { read: true, nl: 'Ondanks de wind zijn we op tijd aangekomen.', en: 'Despite the wind we arrived on time.' },
      { read: true, nl: 'Moi, een retourtje Zuidhorn graag.', en: 'Hi, a return to Zuidhorn please.' },

      // ---- listens: a tool, two times, the luggage
      { listen: true, nl: 'de reisplanner', en: 'the journey planner' }, { listen: true, nl: 'kwart over negen', en: '9:15' },
      { listen: true, nl: 'tien voor half twaalf', en: '11:20' }, { listen: true, nl: 'de bagage', en: 'the luggage' },

      // ---- looks: the dog, the bridge, the church behind the station
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- de of het
      { dehet: true, nl: 'bankje', art: 'het', en: 'the little bench', w: 'Every -je word is het: het bankje, het kaartje, het treintje.' },
      { dehet: true, nl: 'treinreis', art: 'de', en: 'the train journey', w: 'A compound takes the article of its last part: de reis, so de treinreis.' },
    ] }]);
})();
