// Nachtrit, Rotterdam (tier 7, A2 to B1): level 78, Het station. Rotterdam Centraal under its pointed steel roof,
// the metro, the Waterbus home to Alblasserdam, the water taxi at the Erasmusbrug, the Markthal, Blaak and the
// cube houses, Hoek van Holland at the end of the line. Getting around, tickets, delays, directions and the time,
// told back in the past.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (wachtte, woonden, voelde) and of
// the common irregulars (was, had, ging, kwam, deed, zag, kocht, sprak, liep, begon, zat, verstond), reflexive
// verbs (zich voelen, zich vergissen), zou plus infinitive for polite requests, comparatives and superlatives
// (dichter, langer, de snelste, liever dan). Review: the perfectum with hebben, V2 after a time word and after maar,
// niet/geen, hoeven, separable verbs (aankomen, afslaan, overstappen), telling the time, the imperative.
// Still inside the fence: 12 words max, no sub-clauses with the verb at the end, no relative clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar (imperfectum, reflexieve werkwoorden, modale werkwoorden, 't kofschip,
// V2 word order, scheidbare werkwoorden, zijn of hebben), _site/grammar/trappen-van-vergelijking-comparison (liever,
// dan, -er and -st), _site/situations/directions (rechtdoor, links, rechts, de weg wijzen, oversteken),
// _site/words (de bus, de trein, het centraal station, de bushalte, overstappen, de uitgang),
// MOC Tijd, dagen & maanden; content/towns.js for Rotterdam (de metro, de watertaxi, de hijskraan, de Markthal,
// de Erasmusbrug, Niet lullen maar poetsen, een bakkie pleur).
// New rules: none (klok, vergr and gebod are guarded below). New props: none (brug, fiets, deur).
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart over', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 78, act: 7, name: 'Het station', town: 'rotterdam', place: 'station', theme: 'square', ...P,
    intro: 'At Rotterdam Centraal the mist took the departure board and nobody noticed, because the trains were late anyway.',
    introNl: 'Op Rotterdam Centraal nam de mist het vertrekbord mee en niemand merkte het, want de treinen hadden toch al vertraging.',
    mission: {
      where: 'Rotterdam Centraal under its pointed steel roof, the metro down to the Maas, the water taxi under the Erasmusbrug, and the Waterbus home to Alblasserdam, because the dogs need a walk. The dogs always need a walk.',
      carry: 'An OV chip card with one euro on it, a coffee from the Markthal, and the grammar book, still never opened. No helmet. A metro does not ask.',
      want: 'Since the mist the dead on every platform speak in the past tense: where were you, what did you see, why did nobody say anything. They want was, had, ging and kwam right, and a polite zou when you ask them to move. In Rotterdam the dead do not talk much, they work. The ticket woman is still taller than you, and the two tourists beside you still split a fare to the cent.' },
    items: [
      // ---- builds: the imperfectum, regular by 't kofschip
      { en: 'Yesterday I waited an hour on the platform.', parts: ['Gisteren', FK(['wachtte', 'wachtde'], 0, 'kof',
        'The stem wacht already ends in t, a soft ketchup letter, so the past takes -te: wachtte.'), 'ik een uur op het perron.'] },
      { en: 'We used to live closer to the station.', parts: ['Vroeger', FK(['woonden we', 'we woonden'], 0, 'v2',
        'Vroeger takes slot 1, so the verb comes second, then we.'), FK(['dichter', 'meer dicht'], 0, 'vergelijk',
        'Short adjectives take -er: dichter. Dutch does not say meer dicht.'), 'bij het station.'] },
      { en: 'I felt unwell in the full metro.', parts: ['Ik', FK(['voelde', 'voelte'], 0, 'kof',
        'The stem voel ends in l, which is not soft ketchup, so the past takes -de: voelde.'), FK(['me', 'zich'], 0, 'refl',
        'The self-word matches the subject: ik voel me. zich is for hij, zij and ze.'), 'niet lekker in de volle metro.'] },

      // ---- builds: the irregular imperfectum
      { en: 'At eight the train finally arrived.', parts: ['Om acht uur', FK(['kwam de trein', 'de trein kwam'], 0, 'v2',
        'Om acht uur takes slot 1, so the verb comes second: kwam, then de trein.'), 'eindelijk', FK(['aan', 'aangekomen'], 0, 'sep',
        'In the simple past the prefix stays behind as a loose word at the end: kwam ... aan.'), '.'] },
      { en: 'I did not see the sign, so I went to the ticket counter.', parts: ['Ik', FK(['zag', 'zagen'], 0, 'imp',
        'zien is irregular: zag for ik, and zagen only for we, jullie and zij.'), 'het bord niet, dus ik', FK(['ging', 'gaat'], 0, 'imp',
        'gaan is irregular: ging. gaat is the present, and never goes with ik.'), 'naar het loket.'] },
      { en: 'What were you doing so long at the station?', parts: ['Wat', FK(['deed', 'doet'], 0, 'imp',
        'doen is irregular: deed. doet is the present and goes with hij, not with je.'), 'je zo', FK(['lang', 'langer'], 0, 'vergelijk',
        'After zo the plain form stays plain: zo lang. -er is only for comparing with dan.'), 'op het station?'] },
      { en: 'The conductor spoke fast and I understood nothing.', parts: ['De conducteur', FK(['sprak', 'spreekte'], 0, 'imp',
        'spreken is irregular: the past is sprak, with an a.'), 'heel snel en ik verstond', FK(['niets', 'geen'], 0, 'neg',
        'geen needs a noun after it. Nothing on its own is niets.'), '.'] },
      { en: 'Paola bought a ticket and we walked to the platform.', parts: ['Paola', FK(['kocht', 'kopte'], 0, 'imp',
        'kopen is irregular: kocht, the same pattern as gekocht.'), 'een kaartje en we', FK(['liepen', 'lopten'], 0, 'imp',
        'lopen is irregular: liep for one, liepen for more than one.'), 'naar het perron.'] },
      { en: 'The stand-up began at nine, but I was still on the metro.', parts: ['De standup', FK(['begon', 'begonde'], 0, 'imp',
        'beginnen is irregular: the past is begon.'), 'om negen, maar', FK(['ik zat', 'zat ik'], 0, 'v2',
        'maar does not count as a slot, so the subject stays first: maar ik zat.'), 'nog in de metro.'] },

      // ---- builds: comparatives, superlatives, liever
      { en: 'The metro is the fastest route to the Markthal.', parts: ['De metro is de', FK(['snelste', 'snelst', 'sneller'], 0, 'vergelijk',
        'Before a noun the superlative takes -e: de snelste route. Alone you would say het snelst.'), 'route naar de Markthal.'] },
      { en: 'I prefer to take the train rather than the bus.', parts: ['Ik ga', FK(['liever', 'graag', 'meer graag'], 0, 'vergelijk',
        'graag, liever, liefst is one ladder. Comparing two things with dan takes liever, and Dutch has no meer graag.'), 'met de trein dan met de bus.'] },

      // ---- builds: zou plus infinitive
      { en: 'Could you watch my suitcase for a moment?', parts: ['Zou je even op mijn koffer', FK(['kunnen letten', 'kan letten'], 0, 'modal',
        'After zou both verbs stand at the end as infinitives: kunnen letten. kan is the present tense.'), '?'] },
      { en: 'Could you show me the way to the Markthal?', parts: ['Zou je me de weg naar de Markthal kunnen', FK(['wijzen', 'te wijzen', 'gewezen'], 0, 'modal',
        'After kunnen the other verb stays a bare infinitive, no te and no ge.'), '?'] },

      // ---- builds: review, perfectum, reflexive, time, hoeven, imperative
      { en: 'I lost my OV chip card at the station.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux',
        'Losing something is not going anywhere, so hebben: ik heb.'), 'mijn ov-chipkaart op het station', FK(['verloren', 'geverloren'], 0, 'perf',
        'Verbs that start with ver- never take ge: verloren.'), '.'] },
      { en: 'Sorry, I got the time wrong.', parts: ['Sorry, ik heb', FK(['me', 'zich'], 0, 'refl',
        'The self-word matches the subject: ik heb me vergist.'), 'in de tijd', FK(['vergist', 'gevergist'], 0, 'perf',
        'zich vergissen starts with ver-, so no ge: vergist.'), '.'] },
      { en: 'My metro leaves at 11:40.', parts: ['Mijn metro vertrekt om', FK(['tien over half twaalf', 'tien voor half twaalf'], 0, 'klok',
        'Past the half hour you count from half: ten past half twelve is 11:40. Ten before half twelve is 11:20.'), '.'] },
      { en: 'This is a direct train, you do not have to change.', parts: ['Dit is een directe trein, u', FK(['hoeft', 'moet'], 0, 'mag',
        'hoeft niet te means there is no need. moet takes a bare infinitive, with no te.'), 'niet', FK(['over te stappen', 'te overstappen', 'overstappen te'], 0, 'sep',
        'With te the little word goes between the parts: over te stappen.'), '.'] },
      { en: 'Turn right at the traffic light.', parts: ['Sla bij het stoplicht rechts', FK(['af', 'afslaan', 'af te'], 0, 'gebod',
        'A command is the bare stem in slot 1 and the prefix goes to the end: sla ... af.'), '.'] },

      // ---- words: the station, the transport, the roads
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the ticket counter', nl: 'het loket' }, { w: 'the conductor', nl: 'de conducteur' },
      { w: 'the underground', nl: 'de metro' }, { w: 'the Waterbus', nl: 'de Waterbus' },
      { w: 'the water taxi', nl: 'de watertaxi' }, { w: 'the bus stop', nl: 'de bushalte' },
      { w: 'the timetable', nl: 'de dienstregeling' }, { w: 'the traveller', nl: 'de reiziger' },
      { w: 'the departure', nl: 'het vertrek', wrong: 'de vertrek' }, { w: 'the arrival', nl: 'de aankomst' },
      { w: 'the season pass', nl: 'het abonnement', wrong: 'de abonnement' }, { w: 'the rush hour', nl: 'de spits' },
      { w: 'the disruption', nl: 'de storing' }, { w: 'the diversion', nl: 'de omleiding' },
      { w: 'the traffic light', nl: 'het stoplicht', wrong: 'de stoplicht' }, { w: 'the roundabout', nl: 'de rotonde' },
      { w: 'the escalator', nl: 'de roltrap' }, { w: 'the quarter of an hour', nl: 'het kwartier', wrong: 'de kwartier' },

      // ---- reads: three traps with their own options, three plain lines from the station and from the city
      { read: true, nl: 'Mijn trein had een uur vertraging.', o: ['My train was an hour late.', 'My train will be an hour late.', 'My train leaves in an hour.'], a: 0, r: 'imp',
        w: 'had is the past of hebben, so it already happened. A train that is late right now says heeft, and one that will be late says krijgt.' },
      { read: true, nl: 'Zou je even kunnen opschuiven?', o: ['Could you move over a bit?', 'Did you move over?', 'You have to move over.'], a: 0, r: 'modal',
        w: 'zou plus kunnen is the polite way to ask. It is a question, not a past and not an order.' },
      { read: true, nl: 'De metro is sneller dan de tram, maar de bus is goedkoper.', o: ['The metro is faster than the tram, but the bus is cheaper.', 'The metro is faster than the bus, but the tram is cheaper.', 'The metro is cheaper than the tram, but the bus is faster.'], a: 0, r: 'vergelijk',
        w: 'sneller dan is faster than, and goedkoper is cheaper. Read which vehicle sits on each side of dan.' },
      { read: true, nl: 'Niet lullen maar poetsen.', en: 'Stop talking and get to work.' },
      { read: true, nl: 'Zullen we een bakkie pleur doen?', en: 'Shall we have a coffee?' },
      { read: true, nl: 'Loop rechtdoor en dan links.', en: 'Walk straight on and then turn left.' },

      // ---- listens: the time, a platform, a harbour word
      { listen: true, nl: 'kwart voor elf', en: '10:45' }, { listen: true, nl: 'spoor veertien', en: 'track 14' },
      { listen: true, nl: 'de hijskraan', en: 'the crane' },

      // ---- looks: the bridge, the bike, the tram door
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de or het
      { dehet: true, nl: 'metrostation', art: 'het', en: 'the metro station', w: 'het metrostation. A compound takes the article of its last part, and station is a het-word.' },
      { dehet: true, nl: 'treinreis', art: 'de', en: 'the train journey', w: 'de treinreis. reis is a de-word, and the compound follows it.' },
    ] }]);
})();
