(() => {
  // Level 47, Kinderdijk en Dordrecht, De sport (tier 2, A1 phrases): more golf, the gym, the dog walk on the dyke,
  //   the bike and the weather on the course.
  // Fence: at most 5 words a line, present tense, subject verb object, numbers to 100, de/het. geen and niks only in reads.
  // Sources in the vault: 04 - Phrases & Scenarios/Op de golfbaan and the Golf MOC (Ik baal, Volgende week weer?,
  //   Zin in een biertje?, Ik speel handicap twintig), 01 - Vocabulary/golfbaan (de wedstrijd, de regenkleding),
  //   01 - Vocabulary/hond (Hij doet niks, hoor), _site/dialogues/naar-de-sportschool (het abonnement, dertig euro,
  //   de proefles), de-hond-uitlaten (het poepzakje), bij-het-uitlaten-van-de-honden (de reiger, trekken aan de riem),
  //   een-praatje-over-het-weer (Het giet buiten), _site/sentences (In de kleedkamer staan kluisjes, je eigen handdoek,
  //   lopen we langs de molens, Ik speel handicap twintig), _site/words (de koe, het zadel, de fietser, de rem, het weer,
  //   nat, koud, zondag, het park, het weekend, het golfen, sporten, fietsen), 02 - Grammar/de vs het (-ment and -je
  //   words are het, so is an infinitive used as a noun) and 02 - Grammar/presens.
  // Rules used: woord, neg, getal, dehet, pres. New rules: none. New props: none (fiets, brug, nummer).
  // Word, listen and look forks take their wrong signs from each other, so no two Dutch answers here mean the same
  //   thing: no de regen next to de bui, no de baan next to de golfbaan, no de bal next to het balletje, no de sloot
  //   next to the water prop. `wrong` sits only on nouns whose other article is wrong in every variety of Dutch.
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(47, { deliveries: 20, items: [
    // words: the golf club, the gym, the dog walk on the dyke, the bike, the weather, the weekend
    { w: 'the competition', nl: 'de wedstrijd' }, { w: 'the rain gear', nl: 'de regenkleding' },
    { w: 'the gym', nl: 'de sportschool' }, { w: 'the changing room', nl: 'de kleedkamer' }, { w: 'the towel', nl: 'de handdoek' },
    { w: 'the locker', nl: 'het kluisje', wrong: 'de kluisje' },
    { w: 'the poop bag', nl: 'het poepzakje', wrong: 'de poepzakje' }, { w: 'the heron', nl: 'de reiger' }, { w: 'the cow', nl: 'de koe' },
    { w: 'the park', nl: 'het park', wrong: 'de park' },
    { w: 'the cyclist', nl: 'de fietser' }, { w: 'the saddle', nl: 'het zadel' }, { w: 'the brake', nl: 'de rem' },
    { w: 'the weather', nl: 'het weer', wrong: 'de weer' }, { w: 'wet', nl: 'nat' },
    { w: 'Sunday', nl: 'zondag' }, { w: 'the weekend', nl: 'het weekend' },

    // reads: three meaning traps, four plain lines from the course, the gym and the dyke
    { read: true, nl: 'Ik baal.', en: "I'm gutted.",
      o: ["I'm gutted.", "I'm bald.", "I've got the ball."], a: 0, r: 'woord', w: 'balen means to be gutted: ik baal. A ball is de bal, and bald is kaal.' },
    { read: true, nl: 'Volgende week weer?', en: 'Same again next week?',
      o: ['Same again next week?', 'The weather next week?', 'See you next weekend?'], a: 0, r: 'woord', w: 'Here weer means again. The weather is het weer, with its article.' },
    { read: true, nl: 'Geen honden op de baan.', en: 'No dogs on the course.',
      o: ['No dogs on the course.', 'The dogs are not on the course.', 'Dogs allowed on the course.'], a: 0, r: 'neg', w: 'geen cancels the noun: geen honden, no dogs at all.' },
    { read: true, nl: 'Zin in een biertje?', en: 'Fancy a beer?' },
    { read: true, nl: 'Hebben jullie een proefles?', en: 'Do you have a trial lesson?' },
    { read: true, nl: 'Het giet buiten.', en: "It's pouring outside." },
    { read: true, nl: 'Hij doet niks, hoor.', en: "He's harmless." },

    // listen: ui in buiten, ou in koud, the g of golfen, and par 72 with its trema
    { listen: true, nl: 'buiten', en: 'outside' }, { listen: true, nl: 'koud', en: 'cold' },
    { listen: true, nl: 'het golfen', en: 'golfing' }, { listen: true, nl: 'tweeënzeventig', en: '72' },

    // look: the bike on the dyke path, a bridge over the mill canal, the flag on hole fourteen
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
    { look: true, prop: 'nummer', value: 14, nl: 'veertien', en: '14' },

    // builds: one fork each, on the number, the article or the present tense
    { en: 'My handicap is 20.', parts: ['Ik speel handicap', FK(['twintig', 'tweetig', 'twaalf'], 0, 'getal', '20 is twintig. There is no tweetig, and twaalf is 12.'), '.'] },
    { en: 'The subscription costs € 30.', parts: [FK(['Het', 'De'], 0, 'dehet', 'Words ending in -ment are het: het abonnement, het moment.'), 'abonnement kost dertig euro.'] },
    { en: 'The dogs always pull.', parts: ['De honden', FK(['trekken', 'trekt', 'trek'], 0, 'pres', 'Two dogs, plural: the whole infinitive, trekken.'), 'altijd.'] },
    { en: 'Paola works out on Sundays.', parts: ['Paola', FK(['sport', 'sportt', 'sporten'], 0, 'pres', 'Paola is a zij, so stem plus t. The stem sport already ends in t, so it stays sport.'), 'op zondag.'] },
    { en: 'I cycle to the gym.', parts: ['Ik', FK(['fiets', 'fietst', 'fietsen'], 0, 'pres', 'ik takes the bare stem: fiets, the same word as de fiets.'), 'naar de sportschool.'] },
  ] });
})();
