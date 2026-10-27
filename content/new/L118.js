// Nachtrit, Nijmegen (tier 12, B1 to B2): level 118 Het station. Nijmegen station at the foot of the hill: the platforms, the
// departures board, the bike shed, the ticket machines and the bus station on the square, trains to Arnhem, Venlo and Den Bosch,
// the Snelbinder cycle bridge hanging from the railway bridge over the Waal, and the long climb to the Stevenskerk and the
// Valkhof. Travel and getting around: the train, the bus, the bike, directions, the time, tickets, delays, a complaint by letter.
// Rewritten from the unaudited draft in content/pending/L118.js: kept its setting and most of its forks, removed the distractors
// that differed only by a space or by spelling (Ja hoort, tog, een maal, Hoog achtend), replaced zal u (a possible form) with
// zouden u, de weg weg with de weg verdwaald, the kaartjesautomaat with the kaartautomaat, and the Oversteek line moved to 122.
// New at tier 12 and drilled here: modal particles (Loop maar rechtdoor, Kijk eens, toch? as a tag, de bus rijdt wel, nou eenmaal,
// mag ik er even langs), idioms (op het nippertje, tussen wal en schip vallen, de weg kwijt zijn, denkt van niet, lang en breed in a
// read), compound nouns (de kaartautomaat, het stationsplein with its linking s, het vervoersbewijs), the formal register (uw
// vervoersbewijs, Geachte mevrouw, Bij voorbaat dank, Zou u mij kunnen zeggen), the Vierdaagse: since 1909, the hundredth in 2016,
// the gladioli on the Friday.
// Review: V2 after a fronted phrase and after an als-clause, the passive with worden, the perfectum of lopen, the plural gladiolen,
// the superlative and the comparative, indirect speech with dat and the verbs at the end, an indirect question, the time.
// Still inside the fence: 16 words max, nothing from tier 13.
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar, bijzin - werkwoord naar het einde, V2 word order,
// perfectum, de vs het; _site/situations/directions (rechtdoor, de weg vragen, oversteken), polite-phrases (Pardon, mag ik er even
// langs, Kunt u mij helpen, ik zoek het station); _site/maps/H15 In de trein, MOC Tijd, dagen & maanden; level 110 for the replayed
// words (het perron, de vertraging, de overstap, de OV-chipkaart); content/towns.js for Nijmegen (de Waal, de Stevenskerk, het
// Valkhof, de gladiool, de wandelaar, de oudste stad, the rumour about Maastricht).
// New rules: idioom, samen, formeel, datum (guarded, same text in every Nijmegen and Amsterdam file). zou, passief, meervoud,
// vergelijk, indirect and klok are guarded copies of the existing definitions; the rest are in data.js and levels.js.
// New props: none. Only hond, brug and nummer are used (de Snelbinder is only in a read, so no word in the pool is a bridge).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.meervoud = window.RULES.meervoud || { name: 'Plurals: -en, -s', note: 'meervoud-plurals' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 118, act: 12, name: 'Het station', town: 'nijmegen', place: 'station', theme: 'square', ...P,
    intro: 'In the oldest city in the country the trains are late the old-fashioned way. The mist changed nothing about that.',
    introNl: 'In de oudste stad van het land zijn de treinen ouderwets te laat. De mist heeft daar niets aan veranderd.',
    mission: {
      where: 'Nijmegen station, from the platforms through the bike shed to the station square, then the long climb up to the Stevenskerk with the Waal and the Waalbrug lying below. Nijmegen is one of the few towns in the country with a hill, so the dead take the stairs slowly and the bikes go round by the road.',
      carry: 'Two leads, an OV-chipkaart with one euro ten on it, a gladiolus left over from last July, a ticket split to the cent with the neighbours, and the grammar book, still never opened. No helmet. On the climb to the Stevenskerk you walk anyway.',
      want: 'Since the mist the dead stand on every platform and ask which train, which stop and what time. Some still hold gladioli from the Vierdaagse and ask where the party is. The conductor writes letters about the delays and signs them Hoogachtend. Maastricht claims its station is older, and Nijmegen has not slept since. The women on the platform, still taller than you, say hoor and maar, and you have to know where those words go. The dogs always need a walk, even on a platform.' },
    items: [
      // ---- builds: modal particles
      { en: "Sure, it's close by. Just walk straight on.", parts: ['Ja hoor, het is hier vlakbij.', FK(['Loop maar rechtdoor', 'Loop rechtdoor maar'], 0, 'soft',
        'maar softens a command and comes right after the verb: loop maar rechtdoor.'), '.'] },
      { en: 'Take a look at the departures board.', parts: ['Kijk', FK(['eens', 'een'], 0, 'soft',
        'eens makes a command friendly: kijk eens. een is only the article a.'), 'op het vertrekbord.'] },
      { en: "It's platform four, isn't it?", parts: ['Het is spoor vier,', FK(['toch', 'maar'], 0, 'soft',
        'toch at the end of a statement asks for a yes, like right? maar cannot end a question.'), '?'] },
      { en: 'The train is not running, but the bus is.', parts: ['De trein rijdt niet, maar de bus rijdt', FK(['wel', 'geen'], 0, 'soft',
        'wel answers a niet and says: this one does. geen needs a noun right after it.'), '.'] },
      { en: "That's just how it is: in mist the trains are late.", parts: ['Het is', FK(['nou eenmaal', 'nou eenmalig'], 0, 'soft',
        'nou eenmaal means that is how it is, and nothing can be done. eenmalig means one-off.'), 'zo: bij mist', FK(['zijn de treinen', 'de treinen zijn'], 0, 'v2',
        'Bij mist fills slot 1, so the verb comes second: zijn de treinen.'), 'te laat.'] },
      { en: 'Excuse me, may I get past for a moment?', parts: ['Pardon, mag ik', FK(['er even langs', 'er langs even'], 0, 'soft',
        'The little word er comes first, then even softens the request, and langs closes it: er even langs. Nothing comes after langs.'), '?'] },

      // ---- builds: idioms
      { en: 'We caught the train just in time.', parts: ['We haalden de trein', FK(['op het nippertje', 'bij het nippertje'], 0, 'idioom',
        'Fixed phrase: op het nippertje means just in time. The preposition cannot be swapped.'), '.'] },
      { en: 'If you miss the connection, nobody helps you: you fall between two stools.', parts: ['Als je de overstap mist,', FK(['dan val je', 'dan je valt', 'dan valt je'], 0, 'bijzin',
        'After an als-clause the main clause may start with dan, and then the verb comes right after it: dan val je. With je after it, the verb loses its -t.'), FK(['tussen wal en schip', 'tussen wal en boot', 'tussen kade en schip'], 0, 'idioom',
        'Fixed phrase from a river country: tussen wal en schip vallen, to fall between the quay and the ship.'), '.'] },
      { en: "Excuse me, I'm lost. Could you help me?", parts: ['Pardon, ik ben de weg', FK(['kwijt', 'verdwaald'], 0, 'idioom',
        'de weg kwijt zijn is the fixed way to say you are lost. verdwaald takes no object: ik ben verdwaald.'), '. Zou u mij kunnen helpen?'] },
      { en: 'Nijmegen is the oldest city in the Netherlands, but Maastricht thinks otherwise.', parts: ['Nijmegen is de', FK(['oudste', 'oudst', 'meest oud'], 0, 'vergelijk',
        'After de the superlative takes -ste: de oudste stad.'), 'stad van Nederland, maar Maastricht', FK(['denkt van niet', 'denkt niet van', 'denkt geen'], 0, 'idioom',
        'denkt van niet is the fixed way to say thinks otherwise, with van before niet.'), '.'] },

      // ---- builds: compound nouns
      { en: 'At the ticket machine on the station square the queue is long.', parts: ['Bij', FK(['de', 'het'], 0, 'samen',
        'kaart + automaat: automaat is de, so de kaartautomaat.'), 'kaartautomaat op', FK(['het stationsplein', 'het stationplein', 'de stationsplein'], 0, 'samen',
        'station + s + plein: the linking s stays in, and plein is het, so het stationsplein.'), 'is de rij lang.'] },

      // ---- builds: the formal register
      { en: 'Good afternoon, may I see your ticket?', parts: ['Goedemiddag, mag ik', FK(['uw', 'u'], 0, 'formeel',
        'With u the possessive is uw: uw vervoersbewijs. u alone is the person, not what belongs to them.'), 'vervoersbewijs zien?'] },
      { en: 'Dear Ms De Vries, I am writing to you about my delayed train.', parts: [FK(['Geachte', 'Geacht'], 0, 'formeel',
        'mevrouw is a person and a de-word, so the adjective takes -e: Geachte mevrouw.'), 'mevrouw De Vries, ik schrijf u over mijn', FK(['vertraagde', 'vertraagd', 'vertraagt'], 0, 'adj',
        'After mijn the adjective always takes -e: mijn vertraagde trein.'), 'trein.'] },
      { en: 'Thank you in advance for your reply. Kind regards, Santi Sanchez.', parts: [FK(['Bij voorbaat', 'Bij vooruit', 'Op voorbaat'], 0, 'formeel',
        'Bij voorbaat dank is the fixed formal line for thanks in advance.'), 'dank voor uw antwoord. Met vriendelijke groet, Santi Sanchez.'] },
      { en: 'Could you tell me how I get to the Valkhof?', parts: [FK(['Zou u', 'Zouden u'], 0, 'zou',
        'u takes the singular verb, like jij: zou u. zouden is plural.'), 'mij kunnen zeggen', FK(['hoe ik bij het Valkhof kom', 'hoe kom ik bij het Valkhof'], 0, 'bijzin',
        'A question inside a question becomes a sub-clause, so the verb goes to the end: hoe ik ... kom.'), '?'] },

      // ---- builds: the Vierdaagse
      { en: 'The Vierdaagse has been walked since 1909.', parts: ['De Vierdaagse', FK(['wordt', 'worden'], 0, 'passief',
        'De Vierdaagse is one event, so wordt. The participle comes at the end.'), 'al sinds 1909', FK(['gelopen', 'geloopt', 'gelopt'], 0, 'perf',
        'lopen is irregular: gelopen.'), '.'] },
      { en: 'The first Vierdaagse was in 1909, the hundredth in 2016.', parts: ['De', FK(['eerste', 'één'], 0, 'datum',
        'The first is eerste. één counts, it does not put things in order.'), 'Vierdaagse was in 1909, de', FK(['honderdste', 'honderd', 'honderdtste'], 0, 'datum',
        'Most ordinals end in -ste after a round number: de honderdste, de twintigste.'), 'in 2016.'] },
      { en: 'On Friday the walkers get gladioli along the Via Gladiola.', parts: ['Op vrijdag', FK(['krijgen de wandelaars', 'de wandelaars krijgen'], 0, 'v2',
        'Op vrijdag fills slot 1, so the verb comes second: krijgen de wandelaars.'), FK(['gladiolen', 'gladioolen', 'gladiolens'], 0, 'meervoud',
        'de gladiool becomes gladiolen: the syllable is open, so one o is enough.'), 'langs de Via Gladiola.'] },

      // ---- builds: review of earlier tiers
      { en: 'The road to the Stevenskerk is steeper than you think.', parts: ['De weg naar de Stevenskerk is', FK(['steiler', 'steilder', 'meer steil'], 0, 'vergelijk',
        'A short adjective takes -er: steil becomes steiler. -der only comes after an r.'), 'dan je denkt.'] },
      { en: 'Paola said that she had missed the bus.', parts: ['Paola zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement. of belongs to a reported question.'), FK(['ze de bus gemist had', 'ze had de bus gemist', 'had ze de bus gemist'], 0, 'bijzin',
        'After dat the verbs go to the end: ze de bus gemist had.'), '.'] },
      { en: 'The last train to Arnhem leaves at 11:45.', parts: ['De laatste trein naar Arnhem vertrekt om', FK(['kwart voor twaalf', 'kwart over twaalf', 'kwart voor elf'], 0, 'klok',
        'Eleven forty-five is a quarter before twelve: kwart voor twaalf.'), '.'] },

      // ---- words: the station, the bus, the bike, four replayed from Maastricht
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the connection, the change of trains', nl: 'de overstap' }, { w: 'the public transport card', nl: 'de OV-chipkaart' },
      { w: 'the departures board', nl: 'het vertrekbord', wrong: 'de vertrekbord' }, { w: 'the waiting room', nl: 'de wachtkamer' },
      { w: 'the stopping train', nl: 'de sprinter' }, { w: 'the escalator', nl: 'de roltrap' },
      { w: 'the bus station', nl: 'het busstation', wrong: 'de busstation' }, { w: 'the bus driver', nl: 'de buschauffeur' },
      { w: 'the diversion', nl: 'de omleiding' }, { w: 'the engineering works', nl: 'de werkzaamheden' },
      { w: 'the single ticket', nl: 'het enkeltje', wrong: 'de enkeltje' }, { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },
      { w: 'the ticket machine', nl: 'de kaartautomaat' }, { w: 'the ticket (formal)', nl: 'het vervoersbewijs', wrong: 'de vervoersbewijs' },
      { w: 'the bike shed', nl: 'de fietsenstalling' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Neem maar gewoon de volgende trein, hoor.', o: ['Just take the next train, it is fine.', 'Do not take the next train.', 'Listen to the next train.'], a: 0, r: 'soft',
        w: 'maar and gewoon soften the advice, and hoor reassures. Nothing is forbidden, and nobody has to listen.' },
      { read: true, nl: 'Die trein is al lang en breed vertrokken.', o: ['That train left ages ago.', 'That train is long and wide.', 'That train leaves in a long while.'], a: 0, r: 'idioom',
        w: 'lang en breed is a fixed phrase: well and truly, long ago. It says nothing about the size of the train.' },
      { read: true, nl: 'Geachte reizigers, wij verzoeken u de trein te verlaten.', o: ['Dear passengers, we ask you to leave the train.', 'Dear passengers, we ask you to board the train.', 'Dear passengers, we thank you for travelling with us.'], a: 0, r: 'formeel',
        w: 'verlaten means to leave. Boarding would be instappen, and verzoeken is the formal word for asking.' },
      { read: true, nl: 'Je kunt de trein nog wel halen, als je even doorloopt.', o: ['You can still catch the train if you hurry a bit.', 'You cannot catch the train any more, even if you run.', 'You can still walk through the train.'], a: 0, r: 'soft',
        w: 'nog wel says it is still possible, and even doorlopen means walk on a bit faster.' },
      { read: true, nl: 'Tijdens de Vierdaagse zitten de treinen vol en loopt half Nijmegen op straat.', en: 'During the Vierdaagse the trains are full and half of Nijmegen is out in the street.' },
      { read: true, nl: 'De Snelbinder is een fietsbrug die aan de spoorbrug over de Waal hangt.', en: 'The Snelbinder is a cycle bridge that hangs from the railway bridge over the Waal.' },

      // ---- listens: two Vierdaagse words, the time, the square
      { listen: true, nl: 'de gladiool', en: 'the gladiolus' }, { listen: true, nl: 'de wandelaar', en: 'the walker' },
      { listen: true, nl: 'kwart voor negen', en: '8:45' }, { listen: true, nl: 'het stationsplein', en: 'the station square' },

      // ---- looks: the dog, the bridge over the Waal, the platform number
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'nummer', value: 7, nl: 'zeven', en: '7' },

      // ---- de of het
      { dehet: true, nl: 'treinstation', art: 'het', en: 'the railway station', w: 'The last part decides: het station, so het treinstation.' },
      { dehet: true, nl: 'vertrektijd', art: 'de', en: 'the departure time', w: 'The last part decides: de tijd, so de vertrektijd.' },
    ] }]);
})();
