(() => {
  // Level 53, Zeeland, Eten en drinken (tier 4, A2 entry): the harbour of Zierikzee, the fish stall on the quay,
  //   the café under the Dikke Toren, mussels from Yerseke, oysters, the Zeeuwse bolus, ordering and the bill split by Tikkie.
  // Fence: at most 8 words, present tense, verb-first questions, V2 after a time word, niet/geen, modal + infinitive,
  //   plus the tier 4 grammar this level drills: object pronouns (ze, hem, ons, je), er is / er zijn,
  //   comparatives and superlatives (goedkoper dan, duurder, liever, het lekkerst), adjective -e after de, het and een.
  //   No sub-clauses, no perfectum, no split separable verbs.
  // Sources in the vault: _site/situations restaurant (De vis is vandaag heel vers, Mag ik de rekening),
  //   pub (Proost, op ons; Mogen wij de menukaart zien), takeaway (Hoe lang duurt het?, Mag het zonder ui?);
  //   _site/words (de vis, het café, lekker, meer, hem / haar); _site/grammar (trappen van vergelijking: duur, duurder,
  //   graag, liever, liefst; het adjectief, de -e regel; ER, het kleine woord); 02 - Grammar (de vs het, niet vs geen,
  //   modale werkwoorden, mogen); content/towns.js for Zeeland (de mossel, de Dikke Toren, the 62 doors).
  // New rules: obj (object pronouns), er (er is / er zijn), vergl (comparison). Set only if missing.
  // New props: none (water, kerk, nummer).
  // Word forks take their wrong signs from each other, so no two nouns here mean the same thing.
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, ze', note: 'hem-haar' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.vergl = window.RULES.vergl || { name: 'Comparison: -er dan, het -st', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 53, act: 4, name: 'Eten en drinken', town: 'zeeland', place: 'eten', theme: 'square', ...P,
    intro: 'The mussels come from Yerseke, the wind comes off the sea, and they still split the bill to the cent.',
    introNl: 'De mosselen komen uit Yerseke, de wind komt van zee en ze splitsen de rekening nog steeds tot op de cent.',
    mission: { where: 'The harbour of Zierikzee: the fish stall on the quay, the café under the Dikke Toren, a terrace in the wind.',
      carry: 'An empty mussel pan and a phone full of Tikkies nobody paid. No helmet. The wind would have taken it anyway.',
      want: 'They want everything compared: cheaper, fresher, the best in Zeeland. Then they split the bill. Every waitress is taller than you, even the one sitting down.' },
    items: [
      // words: the fish stall, the table, the bill
      { w: 'the mussel', nl: 'de mossel', wrong: 'het mossel' }, { w: 'the oyster', nl: 'de oester' }, { w: 'the herring', nl: 'de haring' },
      { w: 'the battered fish bites', nl: 'de kibbeling' }, { w: 'the Zeeland sticky bun', nl: 'de bolus' },
      { w: 'the bill', nl: 'de rekening', wrong: 'het rekening' }, { w: 'the tip', nl: 'de fooi' }, { w: 'the menu', nl: 'de menukaart' },
      { w: 'the waiter', nl: 'de ober' }, { w: 'the waitress', nl: 'de serveerster' }, { w: 'the order', nl: 'de bestelling', wrong: 'het bestelling' },
      { w: 'the glass', nl: 'het glas', wrong: 'de glas' }, { w: 'the plate', nl: 'het bord' }, { w: 'the knife', nl: 'het mes', wrong: 'de mes' },
      { w: 'the fork', nl: 'de vork' }, { w: 'the soup', nl: 'de soep' }, { w: 'the bread roll', nl: 'het broodje', wrong: 'de broodje' },
      { w: 'the salt', nl: 'het zout' }, { w: 'the harbour', nl: 'de haven' }, { w: 'the cook', nl: 'de kok' }, { w: 'the bottle', nl: 'de fles' },

      // reads: three traps, three plain lines
      { read: true, nl: 'De mosselen zijn op.', en: 'The mussels are sold out.',
        o: ['The mussels are sold out.', 'The mussels are on the table.', 'The mussels are fresh.'], a: 0, r: 'woord', w: 'op after zijn means all gone. Op de tafel needs the table.' },
      { read: true, nl: 'Je hoeft niet te betalen.', en: "You don't have to pay.",
        o: ["You don't have to pay.", "You're not allowed to pay.", "You shouldn't pay."], a: 0, r: 'mag', w: 'hoeft niet te is not necessary. mag niet is not allowed, moet niet is should not.' },
      { read: true, nl: 'Er zit geen ui in.', en: "There's no onion in it.",
        o: ["There's no onion in it.", 'Can it be without onion?', "There's onion in it."], a: 0, r: 'er', w: 'Er zit ... in: something is inside the food. geen makes it none.' },
      { read: true, nl: 'De vis is vandaag heel vers.', en: 'The fish is very fresh today.' },
      { read: true, nl: 'Hoe lang duurt het?', en: 'How long will it take?' },
      { read: true, nl: 'Proost, op ons.', en: 'Cheers, to us.' },

      // listen: the plural, the comparative, the price on the bill
      { listen: true, nl: 'de mosselen', en: 'the mussels' }, { listen: true, nl: 'lekkerder', en: 'tastier' },
      { listen: true, nl: 'zevenendertig euro vijftig', en: '€ 37,50' }, { listen: true, nl: 'de viskraam', en: 'the fish stall' },

      // look: the Oosterschelde, the Dikke Toren, the 62 doors
      { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'nummer', value: 62, nl: 'tweeënzestig', en: '62' },

      // builds: object pronouns
      { en: "The mussels? I'll take them.", parts: ['De mosselen? Ik neem', FK(['ze', 'zij', 'hun'], 0, 'obj', 'The mussels are what you take, so ze. zij is the one doing it, and hun is not used for things.'), '.'] },
      { en: 'The waiter brings us the bill.', parts: ['De ober', FK(['brengt', 'breng', 'brengen'], 0, 'presens', 'One waiter, a hij: stem plus t, brengt.'),
        FK(['ons', 'we', 'onze'], 0, 'obj', 'After the verb, us is ons. we only does things, onze goes before a noun.'), 'de rekening.'] },
      { en: "Where is the waiter? I don't see him.", parts: ['Waar is de ober? Ik zie', FK(['hem', 'hij', 'zijn'], 0, 'obj', 'The waiter is the one you see, so hem. hij does the seeing.'), 'niet.'] },
      { en: "I'll send you a Tikkie.", parts: ['Ik stuur', FK(['je', 'jij', 'jouw'], 0, 'obj', 'The one it goes to sits after the verb: je. jij does things, jouw goes before a noun.'), 'een Tikkie.'] },

      // builds: er is, er zijn
      { en: 'There are no mussels today.', parts: ['Er', FK(['zijn', 'is'], 0, 'er', 'mosselen is plural, so er zijn.'), 'vandaag',
        FK(['geen', 'niet'], 0, 'neg', 'mosselen has no article in front, so geen.'), 'mosselen.'] },
      { en: 'Is there still a table free?', parts: [FK(['Is er', 'Zijn er', 'Heeft er'], 0, 'er', 'One table, so is. The question puts the verb first: is er.'), 'nog een tafel vrij?'] },
      { en: "There's a cosy café by the harbour.", parts: [FK(['Er is', 'Er zijn'], 0, 'er', 'One café, so er is.'), 'een',
        FK(['gezellig', 'gezellige'], 0, 'adj', 'café is a het-word after een: the one place with no -e.'), 'café bij de haven.'] },

      // builds: comparison
      { en: 'Mussels are cheaper than oysters.', parts: ['Mosselen zijn', FK(['goedkoper', 'goedkoop', 'goedkoopst'], 0, 'vergl', 'Comparing two things: the adjective plus -er, then dan.'), 'dan oesters.'] },
      { en: 'A beer is more expensive than a coffee.', parts: ['Een biertje is', FK(['duurder', 'duurer', 'duurst'], 0, 'vergl', 'duur ends in -r, so a d slips in: duurder.'), 'dan een koffie.'] },
      { en: "I'd rather drink tea than coffee.", parts: ['Ik drink', FK(['liever', 'graagder', 'meer graag'], 0, 'vergl', 'graag has its own ladder: graag, liever, liefst.'), 'thee dan koffie.'] },
      { en: 'The waitress is taller than me.', parts: ['De serveerster is', FK(['langer', 'lang', 'langst'], 0, 'vergl', 'Tall for people is lang. Taller than: langer dan.'), 'dan ik.'] },
      { en: 'The mussels from Yerseke are the tastiest.', parts: ['De mosselen uit Yerseke zijn', FK(['het lekkerst', 'het lekkerder'], 0, 'vergl', 'The best of all: het plus -st. -er is only for two things.'), '.'] },

      // builds: adjective -e, with a time word up front
      { en: "I'd like a cold beer.", parts: ['Ik', FK(['wil', 'wilt', 'willen'], 0, 'modal', 'ik wil. No t for ik.'), 'graag een',
        FK(['koud', 'koude'], 0, 'adj', 'biertje is a het-word after een: no -e.'), 'biertje.'] },
      { en: 'The fresh fish costs twenty euros.', parts: ['De', FK(['verse', 'vers'], 0, 'adj', 'After de the adjective takes -e: de verse vis.'), 'vis',
        FK(['kost', 'kosten'], 0, 'presens', 'One fish, so the hij-form: kost.'), 'twintig euro.'] },
      { en: 'Tonight there are fresh oysters.', parts: ['Vanavond', FK(['zijn er', 'er zijn'], 0, 'v2', 'Vanavond takes slot 1, so the verb comes second, then er: zijn er.'),
        FK(['verse', 'vers'], 0, 'adj', 'A plural with no article still takes the -e: verse oesters.'), 'oesters.'] },
    ] }]);
})();
