// Nachtrit, Utrecht (tier 5, A2): level 64 De sport. Golf in the rain, the gym, the dog walk along the Oudegracht, the bike garage.
// Fence: tier 4 plus separable verbs split in the present (Ik bel je morgen op), zijn + aan het + infinitive,
// gaan + infinitive for the future, telling the time (half negen, kwart over zeven), the imperative (Kom binnen, Fiets maar door).
// 10 words max. No perfectum, no imperfectum, no sub-clauses.
// Sources: dutch-lessons vault: 04 - Phrases & Scenarios/Op de golfbaan (mooie slag, de starttijd, het balletje, het clubhuis,
// Het waait weer eens, Een buitje deert ons niet), 02 - Grammar/scheidbare werkwoorden (Ik bel je morgen op, Ga je mee?),
// aan het + infinitief, futurum - gaan + infinitief (Ik ga zaterdag golfen), 03 - Verbs/uitlaten (Ik laat de honden uit),
// _site/grammar/de-imperatief-commands, _site/maps/H14 — In de sportschool, MOC Vrije tijd, MOC Het weer, MOC Tijd, dagen & maanden,
// _site/words (de sportschool, de spierpijn, sporten, het park, het weer, de bui, een rondje fietsen),
// _site/situations/small-talk (Het gaat de hele week regenen), and content/towns.js for Utrecht (de Domtoren, 112 metres,
// de Oudegracht, de fietsenstalling, het fietspad, Hoe laat gaat de stalling dicht?, the dead cannot find their bikes).
// New rules: imper (imperative; the existing imp is the imperfectum) and klok (telling the time). Both guarded.
// New props: none. Only fiets, hond, brug and water are used.
(() => {
  window.RULES.imper = window.RULES.imper || { name: 'Imperative: the bare stem', note: 'De imperatief · commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart over', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 64, act: 5, name: 'De sport', town: 'utrecht', place: 'sport', theme: 'street', ...P,
    intro: 'In Utrecht everyone cycles to the gym to sit on a bike that goes nowhere. The dogs still need a walk. You still have no helmet.',
    introNl: 'In Utrecht fietst iedereen naar de sportschool om daar op een fiets te zitten die nergens heen gaat. De honden moeten nog steeds uit. Jij hebt nog steeds geen helm.',
    mission: {
      where: 'Down on the wharves of the Oudegracht, round the Dom tower, out to a golf course in the rain and a gym with a bike that goes nowhere. Under the station the dead are still looking for their bikes.',
      carry: 'A golf bag, two dog leads and a gym card nobody has touched since January. No helmet.',
      want: 'The dead jog past at half past eight and ask what you are doing, what you are going to do and when. Split the verb, keep aan het, count to the next hour. It is all in the grammar book you never opened. The women at the gym are still taller than you, and at the clubhouse they still split the bill.' },
    items: [
      // ---- words
      { w: 'the golf course', nl: 'de golfbaan' },
      { w: 'the clubhouse', nl: 'het clubhuis', wrong: 'de clubhuis' },
      { w: 'the gym', nl: 'de sportschool' },
      { w: 'the little ball (golfers always say it this way)', nl: 'het balletje', wrong: 'de balletje' },
      { w: 'the shot (in golf)', nl: 'de slag' },
      { w: 'the bunker', nl: 'de bunker' },
      { w: 'the tee time', nl: 'de starttijd' },
      { w: 'the muscle ache', nl: 'de spierpijn' },
      { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },
      { w: 'the bike garage', nl: 'de fietsenstalling' },
      { w: 'the lead (for the dog)', nl: 'de riem' },
      { w: 'the park', nl: 'het park', wrong: 'de park' },
      { w: 'the weather', nl: 'het weer', wrong: 'de weer' },
      { w: 'the rain', nl: 'de regen' },
      { w: 'the shower (of rain)', nl: 'de bui' },
      { w: 'the wind', nl: 'de wind' },
      { w: 'the helmet', nl: 'de helm' },
      { w: 'the match', nl: 'de wedstrijd' },
      { w: 'the swimming pool', nl: 'het zwembad', wrong: 'de zwembad' },
      { w: 'the Dom tower', nl: 'de Domtoren' },

      // ---- builds: separable verbs split in the present
      { en: 'Every morning I walk the dogs.', parts: ['Elke ochtend', FK(['laat ik', 'ik laat', 'uitlaat ik'], 0, 'sep', 'Elke ochtend takes slot 1, so laat comes next and ik after it. uit waits at the end.'), 'de honden uit.'] },
      { en: "I'll call you tomorrow about the tee time.", parts: ['Ik', FK(['bel', 'opbel', 'bellen'], 0, 'sep', 'opbellen splits in the present: bel stays in slot 2, op goes behind je morgen.'), 'je morgen op over de starttijd.'] },
      { en: 'Are you coming along to the gym?', parts: [FK(['Ga je mee', 'Meega je', 'Ga mee je'], 0, 'sep', 'meegaan splits: ga up front, then je, then mee.'), 'naar de sportschool?'] },
      { en: 'At half past eight we arrive at the golf course.', parts: ['Om half negen', FK(['komen we', 'we komen'], 0, 'v2', 'A time in slot 1: the verb comes next, then we.'), 'bij de golfbaan',
        FK(['aan', 'aankomen'], 0, 'sep', 'aankomen splits: komen in slot 2, aan alone at the end.'), '.'] },

      // ---- builds: zijn + aan het + infinitive
      { en: "Sorry, I'm playing golf right now.", parts: ['Sorry, ik ben nu', FK(['aan het', 'aan de', 'in het'], 0, 'aanhet', 'Busy right now: zijn, then aan het, then the whole verb.'), 'golfen.'] },
      { en: 'The dogs are swimming in the canal.', parts: ['De honden', FK(['zijn', 'is'], 0, 'presens', 'Two dogs, plural: zijn.'), 'in de gracht aan het',
        FK(['zwemmen', 'zwemt', 'zwem'], 0, 'aanhet', 'After aan het the verb stays whole: zwemmen.'), '.'] },

      // ---- builds: gaan + infinitive
      { en: "I'm going to play golf with the neighbour on Saturday.", parts: ['Ik', FK(['ga', 'gaat'], 0, 'presens', 'ik takes the bare stem: ga.'), 'zaterdag met de buurman',
        FK(['golfen', 'golft', 'golf'], 0, 'fut', 'gaan sends the second verb to the end, whole: golfen.'), '.'] },
      { en: "It's going to rain all week.", parts: ['Het', FK(['gaat', 'gaan'], 0, 'fut', 'het is singular, so gaat.'), 'de hele week',
        FK(['regenen', 'regent'], 0, 'fut', 'The second verb waits at the end, whole: regenen.'), '.'] },
      { en: "Tomorrow we're going to cycle to the Dom tower.", parts: ['Morgen', FK(['gaan we', 'we gaan'], 0, 'v2', 'Morgen takes slot 1: the verb comes next, then we.'), 'naar de Domtoren',
        FK(['fietsen', 'fietst', 'te fietsen'], 0, 'fut', 'After gaan the verb goes to the end with no te.'), '.'] },

      // ---- builds: telling the time
      { en: 'My tee time is 8:30.', parts: ['Mijn starttijd is', FK(['half negen', 'half acht'], 0, 'klok', 'Dutch counts toward the next hour: half negen is 8:30.'), '.'] },
      { en: 'The gym opens at 7:15.', parts: ['De sportschool', FK(['gaat', 'opengaat'], 0, 'sep', 'opengaan splits: gaat in slot 2, open at the end.'), 'om',
        FK(['kwart over zeven', 'kwart voor zeven', 'zeven kwart over'], 0, 'klok', 'Fifteen minutes after seven is kwart over zeven.'), 'open.'] },
      { en: "It's 9:45. We're late.", parts: ['Het is', FK(['kwart voor tien', 'kwart over tien', 'tien kwart voor'], 0, 'klok', 'Fifteen minutes before ten is kwart voor tien.'), '. We zijn te laat.'] },

      // ---- builds: the imperative
      { en: 'Just walk the dogs, honey.', parts: [FK(['Laat', 'Laten', 'Uitlaat'], 0, 'imper', 'A command is the bare stem, and uitlaten still splits: laat first, uit at the end.'), 'de honden even uit, schat.'] },
      { en: "Keep cycling, don't look back.", parts: [FK(['Fiets', 'Fietst', 'Te fietsen'], 0, 'imper', 'A command is the bare stem: fiets. No t, nobody to agree with.'), 'maar door,',
        FK(['kijk niet om', 'omkijk niet', 'kijk om niet'], 0, 'sep', 'omkijken splits in a command too: kijk first, niet, then om at the end.'), '.'] },
      { en: "Put your helmet on. You don't have a helmet.", parts: [FK(['Zet', 'Zetten', 'Opzet'], 0, 'imper', 'Command: the bare stem, zet. opzetten splits, so op goes to the end.'), 'je helm op. Je hebt geen helm.'] },
      { en: "Come in, it's raining.", parts: [FK(['Kom binnen', 'Binnenkom', 'Komen binnen'], 0, 'imper', 'binnenkomen splits in a command too: kom first, binnen after it.'), ', het regent.'] },

      // ---- reading
      { read: true, nl: 'Mooie slag.', en: 'Nice shot.' },
      { read: true, nl: 'Het waait weer eens.', o: ['It is windy again.', 'The weather is nice again.', 'It is raining again.'], a: 0, r: 'woord', w: 'waaien is what the wind does. weer eens means yet again. Rain is regenen.' },
      { read: true, nl: 'Ik ben mijn fiets kwijt.', o: ['I have lost my bike.', 'I am selling my bike.', 'I am fixing my bike.'], a: 0, r: 'woord', w: 'kwijt zijn means you have lost it and cannot find it. Selling is verkopen and fixing is repareren.' },
      { read: true, nl: 'Ik heb spierpijn.', o: ['My muscles ache.', 'I have a headache.', 'I am hungry.'], a: 0, r: 'woord', w: 'de spierpijn is the ache the day after the gym. A headache is hoofdpijn.' },
      { read: true, nl: 'Hoe laat gaat de stalling dicht?', en: 'What time does the bike garage close?' },
      { read: true, nl: 'Een buitje deert ons niet.', en: "A little shower won't stop us." },

      // ---- listening
      { listen: true, nl: 'half negen', en: '8:30' },
      { listen: true, nl: 'kwart over zeven', en: '7:15' },
      { listen: true, nl: 'honderdtwaalf meter', en: '112 metres' },
      { listen: true, nl: 'kwart voor acht', en: '7:45' },

      // ---- looking
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
    ] }]);
})();
