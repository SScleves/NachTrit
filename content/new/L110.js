// Nachtrit, Maastricht (tier 11, B1 to B2): level 110 Het station. Maastricht is the end of the line: the terminus on the
// Maas, platforms, bike shed, ticket machines, trains to Heerlen, Sittard, Eindhoven and over the border to Luik, the bridge
// into the old centre, the Limburg vlaai you buy before you board. Travel and getting around: train, bus, ferry, bike,
// directions, the time, tickets, delays.
// New at tier 11 and drilled here: the passive with worden and a participle (de trein wordt vertraagd, alle treinen worden
// geschrapt, werd gestolen, the subjectless op het perron wordt niet gerookt), the plusquamperfectum with had and was
// (had gemist, was vertrokken, was weggereden), indirect speech with zei dat, vroeg of and zou for the reported future.
// Review: V2 after a fronted phrase and after a sub-clause, 't kofschip (geschrapt, gerookt, gemist), irregular participles
// (gestolen, gekocht), separable verbs (weggereden, thuiskwam, steek ... over), om ... te, zou for polite requests,
// die and dat, superlatives, telling the time.
// Still inside the fence: 16 words max, nothing from tier 12 (no modal particle drills, no formal letter register).
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, zijn of hebben, 't kofschip, bijzin - werkwoord naar het einde,
// V2 word order, scheidbare werkwoorden, die vs dat, de vs het; _site/situations/directions (oversteken, de plattegrond,
// rechtdoor, links, rechts, de ingang, de uitgang), _site/situations/polite-phrases (Kunt u mij helpen? Ik zoek het
// station), the Een treinkaartje kopen dialogue (retour, overstappen, perron, spoor), _site/words (de trein, de bus,
// het centraal station, de bushalte, het openbaar vervoer); MOC Tijd, dagen & maanden; level 102 for the replayed words;
// content/towns.js for Maastricht (de vlaai, de Maas, Noondezju, the carnaval joke, the patat rumour).
// New rules: passief, plusq and indirect, defined and guarded below. v2, bijzin, kof, perf, aux, sep, omte, zou, diedat,
// vergelijk, getal, presens and woord exist.
// New props: none. Only fiets, hond and nummer are used (not brug, deur or lamp: the pool has no brug, ingang or stoplamp
// word that could be taken for them, and the Sint-Servaasbrug stays out of the word list on purpose).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'Passive: wordt / werd plus participle', note: 'perfectum' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Pluperfect: had / was plus participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 110, act: 11, name: 'Het station', town: 'maastricht', place: 'station', theme: 'square', ...P,
    intro: 'Maastricht is the end of the line. Everyone the mist put on a train ended up here, and they still split the bill.',
    introNl: 'Maastricht is het eindstation. De mist zette iedereen in de trein en iedereen is hier beland. Ze splitsen de rekening nog steeds.',
    mission: {
      where: 'Maastricht station on the Maas, from the platforms through the bike shed and the ticket hall to the square outside, then over the bridge towards the old centre. Belgium is so close that the dead cross the border for a coffee and come back for the delay.',
      carry: 'Two leads, an OV-chipkaart with eleven cents on it, a piece of vlaai split to the cent with the neighbours, and the grammar book, still never opened. No helmet. At the station nobody asks about that, they only ask which platform.',
      want: 'At carnaval you cannot tell the living from the dead. At the station you cannot tell the dead from the commuters, and nobody in the queue admits to anything: the train is being delayed, the bike was stolen, the last bus had already left. The conductor said that it would be ten minutes. The women on the platform, still taller than you, tell you which platform. The dogs always need a walk, even here.' },
    items: [
      // ---- builds: the passive with worden
      { en: 'The train to Heerlen is being delayed by a disruption.', parts: ['De trein naar Heerlen', FK(['wordt', 'worden'], 0, 'passief',
        'De trein is singular, so wordt. The passive is wordt plus a participle at the end.'), 'door een storing', FK(['vertraagd', 'gevertraagd', 'vertraagt'], 0, 'passief',
        'ver- verbs take no ge: vertraagd.'), '.'] },
      { en: 'Because of the mist all trains are cancelled tonight.', parts: ['Door de mist', FK(['worden', 'wordt'], 0, 'passief',
        'Alle treinen is plural, so worden.'), 'vanavond alle treinen', FK(['geschrapt', 'geschrapd', 'geschrappen'], 0, 'kof',
        'schrap ends in p, a ketchup letter: geschrapt with a t.'), '.'] },
      { en: 'Yesterday my bike was stolen at the station.', parts: ['Gisteren', FK(['werd', 'wordt'], 0, 'passief',
        'Gisteren is the past, so werd. wordt is for now.'), 'mijn fiets op het station', FK(['gestolen', 'gestelen', 'gestoolen'], 0, 'perf',
        'stelen is irregular: gestolen.'), '.'] },
      { en: 'During carnaval the whole station is decorated.', parts: ['Met carnaval', FK(['wordt het hele station', 'het hele station wordt'], 0, 'v2',
        'Met carnaval fills slot 1, so the verb comes second: wordt het hele station.'), FK(['versierd', 'geversierd', 'versiert'], 0, 'passief',
        'ver- takes no ge. versier ends in r, so -d: versierd.'), '.'] },
      { en: 'Smoking is not allowed on the platform.', parts: ['Op het perron', FK(['wordt', 'worden'], 0, 'passief',
        'This passive has no subject at all, so it is always wordt: er wordt gerookt.'), 'niet', FK(['gerookt', 'gerookd', 'gerokt'], 0, 'kof',
        'rook ends in k, a ketchup letter: gerookt with a t.'), '.'] },

      // ---- builds: the plusquamperfectum
      { en: 'When I got to the platform, the train had already left.', parts: ['Toen ik op het perron kwam,', FK(['was de trein', 'de trein was'], 0, 'bijzin',
        'After a toen-clause the main clause starts with its verb: was de trein.'), 'al', FK(['vertrokken', 'gevertrokken', 'vertrekt'], 0, 'plusq',
        'was plus the participle is the pluperfect: it was already over before I came. vertrekken takes no ge.'), '.'] },
      { en: 'I had missed the last train, so I had to walk.', parts: ['Ik', FK(['had', 'was'], 0, 'plusq',
        'missen takes hebben, so the pluperfect is had gemist.'), 'de laatste trein', FK(['gemist', 'gemisd', 'gemissen'], 0, 'kof',
        'mis ends in s, a ketchup letter: gemist with a t.'), ', dus ik moest lopen.'] },
      { en: 'Paola had already bought the tickets before I got home.', parts: ['Paola', FK(['had', 'was'], 0, 'plusq',
        'kopen takes hebben: had gekocht.'), 'de kaartjes al', FK(['gekocht', 'gekoopt', 'gekoopd'], 0, 'perf',
        'kopen is irregular: gekocht.'), FK(['voordat ik thuiskwam', 'voordat ik kwam thuis'], 0, 'bijzin',
        'voordat sends the verb to the end, and thuiskomen glues back together: thuiskwam.'), '.'] },
      { en: 'We arrived late, because the bus had already left.', parts: ['We kwamen te laat aan, want de bus', FK(['was', 'had'], 0, 'plusq',
        'wegrijden is movement away from a place, so zijn: was weggereden.'), 'al', FK(['weggereden', 'geweggereden', 'weggereed'], 0, 'sep',
        'The ge goes in the middle of a separable verb: weg plus gereden, one word at the end.'), '.'] },

      // ---- builds: indirect speech
      { en: 'The conductor said that the train would leave ten minutes later.', parts: ['De conducteur zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement. of belongs to a reported question, after vroeg.'), 'de trein tien minuten later', FK(['zou vertrekken', 'zou vertrekt'], 0, 'indirect',
        'A reported future after zei is zou plus an infinitive.'), '.'] },
      { en: 'Paola asked whether I had already bought the tickets.', parts: ['Paola vroeg', FK(['of', 'om'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), FK(['ik de kaartjes al had gekocht', 'had ik de kaartjes al gekocht', 'ik had de kaartjes al gekocht'], 0, 'bijzin',
        'of sends the verb to the end of its clause: ik de kaartjes al had gekocht.'), '.'] },
      { en: 'The traveller said that his train was already an hour late.', parts: ['De reiziger zei', FK(['dat zijn trein al een uur te laat was', 'dat zijn trein al een uur was te laat', 'dat was zijn trein al een uur te laat'], 0, 'indirect',
        'dat sends the verb to the end of the clause: te laat was.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'The bus is the cheapest, but the train is the fastest.', parts: ['De bus is', FK(['de goedkoopste', 'de goedkoopst'], 0, 'vergelijk',
        'After de the superlative takes -ste: de goedkoopste.'), ', maar de trein is', FK(['de snelste', 'de snelst'], 0, 'vergelijk',
        'Same rule: de snelste.'), '.'] },
      { en: 'I got up early to catch the first train.', parts: ['Ik', FK(['ben', 'heb'], 0, 'aux',
        'opstaan is a change of position, so zijn: ik ben opgestaan.'), 'vroeg opgestaan', FK(['om de eerste trein te halen', 'om de eerste trein halen te'], 0, 'omte',
        'om ... te closes with the verb: om de eerste trein te halen.'), '.'] },
      { en: 'Could you tell me from which platform the train to Sittard leaves?', parts: [FK(['Zou', 'Zal'], 0, 'zou',
        'zou plus an infinitive makes a request polite: Zou u mij kunnen zeggen.'), 'u mij kunnen zeggen van welk spoor', FK(['de trein naar Sittard vertrekt', 'vertrekt de trein naar Sittard'], 0, 'bijzin',
        'In an indirect question the verb goes last: de trein naar Sittard vertrekt.'), '?'] },
      { en: 'The train that goes to Liège is on platform four.', parts: ['De trein', FK(['die', 'dat'], 0, 'diedat',
        'trein is a de-word, so die. dat is for het-words.'), FK(['naar Luik gaat', 'gaat naar Luik'], 0, 'bijzin',
        'In a relative clause the verb goes last: die naar Luik gaat.'), ', staat op spoor vier.'] },
      { en: 'Before I get on the train, I buy another piece of vlaai.', parts: ['Voordat ik in de trein', FK(['stap,', 'stapt,'], 0, 'presens',
        'ik takes the bare stem: ik stap.'), FK(['koop ik', 'ik koop'], 0, 'bijzin',
        'The main clause after a voordat-clause starts with its verb: koop ik.'), 'nog een stuk vlaai.'] },
      { en: 'Cross the bridge and take the first street on the right.', parts: ['Steek de brug', FK(['over', 'op', 'in'], 0, 'sep',
        'oversteken splits in a command: steek ... over, the prefix goes to the end.'), 'en neem de eerste straat rechts.'] },
      { en: 'The last train to Eindhoven leaves at 11:40.', parts: ['De laatste trein naar Eindhoven vertrekt om', FK(['tien over half twaalf', 'tien voor half twaalf', 'tien over twaalf'], 0, 'getal',
        'Half twaalf is 11:30. Ten past that is 11:40: tien over half twaalf.'), '.'] },

      // ---- words: the station, tickets, buses, the border, replay from level 102
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the timetable', nl: 'de dienstregeling' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the return ticket', nl: 'het retourtje', wrong: 'de retourtje' }, { w: 'the public transport card', nl: 'de OV-chipkaart' },
      { w: 'the conductor', nl: 'de conducteur' }, { w: 'the traveller', nl: 'de reiziger' }, { w: 'the bus stop', nl: 'de bushalte' },
      { w: 'the crossroads', nl: 'het kruispunt', wrong: 'de kruispunt' }, { w: 'the traffic light', nl: 'het stoplicht' },
      { w: 'the suitcase', nl: 'de koffer' }, { w: 'the border', nl: 'de grens' }, { w: 'the airport', nl: 'het vliegveld', wrong: 'de vliegveld' },
      { w: 'the ferry', nl: 'de veerboot' }, { w: 'the track', nl: 'het spoor' }, { w: 'the transfer', nl: 'de overstap' },
      { w: 'the disruption', nl: 'de storing' },

      // ---- reads: four traps with their own options, two plain
      { read: true, nl: 'De conducteur had de deuren al gesloten toen we aankwamen.', o: ['The conductor had already closed the doors when we arrived.', 'The conductor closed the doors as soon as we arrived.', 'We had already arrived when the conductor closed the doors.'], a: 0, r: 'plusq',
        w: 'had gesloten is the pluperfect: the conductor closed the doors before we aankwamen. The conductor is the one who closed them.' },
      { read: true, nl: 'Door de mist worden alle treinen vertraagd.', o: ['All trains are being delayed by the mist.', 'The trains are delaying the mist.', 'All trains were delayed by the mist yesterday.'], a: 0, r: 'passief',
        w: 'worden plus vertraagd is the passive: the trains are the ones delayed, door de mist says by what. Yesterday would be werden.' },
      { read: true, nl: 'De conducteur zei dat de trein vertraagd was.', o: ['The conductor said that the train was delayed.', 'The conductor asked whether the train was delayed.', 'The conductor said that the train would be delayed.'], a: 0, r: 'indirect',
        w: 'zei dat reports a statement, and was keeps it in the past. Asking would be vroeg of.' },
      { read: true, nl: 'Deze trein rijdt niet verder dan Maastricht.', o: ['This train does not go any further than Maastricht.', 'This train does not go to Maastricht.', 'This train goes further than Maastricht.'], a: 0, r: 'woord',
        w: 'niet verder dan means up to there and no further. Maastricht is the end of the line.' },
      { read: true, nl: 'Wegens werkzaamheden rijden er geen treinen naar Luik.', en: 'Because of engineering works no trains run to Liège.' },
      { read: true, nl: 'Dit is het eindstation. Iedereen moet eruit.', en: 'This is the last stop. Everybody out.' },

      // ---- listens: two station words, the time, one Maastricht word
      { listen: true, nl: 'het loket', en: 'the ticket window' }, { listen: true, nl: 'de bagage', en: 'the luggage' },
      { listen: true, nl: 'tien over half drie', en: '2:40' }, { listen: true, nl: 'Noondezju', en: 'Damn it (Maastricht dialect)' },

      // ---- looks: the dog, the bike by the shed, the platform number
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'nummer', value: 5, nl: 'vijf', en: '5' },

      // ---- de of het
      { dehet: true, nl: 'treinkaartje', art: 'het', en: 'the train ticket', w: 'Every -je word is het: het kaartje, het treinkaartje.' },
      { dehet: true, nl: 'stationsplein', art: 'het', en: 'the station square', w: 'The last part decides: het plein, so het stationsplein.' },
    ] }]);
})();
