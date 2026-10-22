(() => {
  // Level 8 De of het, Kinderdijk en Dordrecht (tier 2, A1 phrases), place thuis: the ruined house at the end of the
  // street, room by room, the furniture, the kitchen, the family, the wife and the dogs. Lines of 5 words at most,
  // present tense SVO, niet and geen only in the reads, one fork per build, no possessives or modals.
  // Sources: vault 02 - Grammar/de vs het and _site/grammar/de-of-het-articles (plurals are de, -je is het, ont- is het,
  // when in doubt de), 01 - Vocabulary/huis (naar huis vs thuis), vrouw, hond, tuin (het terras), 04 - Phrases &
  // Scenarios/Thuis met je vrouw (de vaatwasser, het eten, het ontbijt), _site/sentences (De bank staat in de woonkamer,
  // De kast staat tegen de muur, Wij hebben geen tafel en geen stoelen in de keuken, De statiegeldmachine doet het niet,
  // Mijn gezin is niet groot, een kopje koffie, Trekken ze altijd zo aan de riem), _site/words (het schilderij, het boek,
  // het huiswerk, de dierenarts, de schoonmoeder, de ouders, de douche, de verwarming).
  // `wrong` sits on every word item and on the three looks, like the level's own 18 words: this is the de/het level,
  // so every noun fork is also an article gate. itemToEntry puts `wrong` first for looks too.
  // Left out on purpose: het toilet and het aanrecht (de toilet and de aanrecht are heard too, so the wrong sign would
  // not be wrong to everyone), het dak and het raam (as distractors under the huis look they would point at the roof
  // and windows of the house), de familie (next to het gezin), het licht as a noun (next to de lamp; it stays in a read).
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(8, { deliveries: 20, items: [
    // the house, room by room
    { w: 'the living room', nl: 'de woonkamer', wrong: 'het woonkamer' }, { w: 'the attic', nl: 'de zolder', wrong: 'het zolder' },
    { w: 'the patio', nl: 'het terras', wrong: 'de terras' },
    // the furniture
    { w: 'the couch', nl: 'de bank', wrong: 'het bank' }, { w: 'the chair', nl: 'de stoel', wrong: 'het stoel' },
    { w: 'the cupboard', nl: 'de kast', wrong: 'het kast' }, { w: 'the pillow', nl: 'het kussen', wrong: 'de kussen' },
    { w: 'the painting', nl: 'het schilderij', wrong: 'de schilderij' }, { w: 'the desk', nl: 'het bureau', wrong: 'de bureau' },
    // the kitchen
    { w: 'the dishwasher', nl: 'de vaatwasser', wrong: 'het vaatwasser' }, { w: 'the cup', nl: 'het kopje', wrong: 'de kopje' },
    { w: 'the plate', nl: 'het bord', wrong: 'de bord' },
    // the wife and the family
    { w: 'the wife', nl: 'de vrouw', wrong: 'het vrouw' }, { w: 'the parents', nl: 'de ouders', wrong: 'het ouders' },
    { w: 'the family', nl: 'het gezin', wrong: 'de gezin' }, { w: 'the girl', nl: 'het meisje', wrong: 'de meisje' },
    // the dogs
    { w: 'the leash', nl: 'de riem', wrong: 'het riem' }, { w: 'the bone', nl: 'het bot', wrong: 'de bot' },
    { w: 'the vet', nl: 'de dierenarts', wrong: 'het dierenarts' },
    // the day
    { w: 'the shower', nl: 'de douche', wrong: 'het douche' }, { w: 'the book', nl: 'het boek', wrong: 'de boek' },
    { w: 'the homework', nl: 'het huiswerk', wrong: 'de huiswerk' },
    // reading
    { read: true, nl: 'Ik ga naar huis.', en: "I'm going home.",
      o: ["I'm going home.", "I'm at home.", "I'm going out."], a: 0, r: 'woord', w: 'naar huis is on your way home. Once you are there, you are thuis.' },
    { read: true, nl: 'Het eten is klaar.', en: 'Dinner is ready.',
      o: ['Dinner is ready.', "We're done eating.", "I'm ready to eat."], a: 0, r: 'woord', w: 'klaar means ready, and here the food is. Done eating would be klaar met eten.' },
    { read: true, nl: 'Wij hebben geen tafel.', en: "We don't have a table." },
    { read: true, nl: 'Het licht doet het niet.', en: "The light isn't working.",
      o: ["The light isn't working.", "It isn't light yet.", "Don't turn on the light."], a: 0, r: 'woord', w: 'doen also means to work, for anything with a switch: het doet het niet.' },
    // listening
    { listen: true, nl: 'de keuken', en: 'the kitchen' }, { listen: true, nl: 'de schoonmoeder', en: 'the mother-in-law' },
    { listen: true, nl: 'het fornuis', en: 'the stove' },
    // looking
    { look: true, prop: 'water', nl: 'het water', en: 'the water', wrong: 'de water' },
    { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp', wrong: 'het lamp' },
    { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill', wrong: 'het molen' },
    // building
    { en: 'The dog food is all gone.', parts: [FK(['Het', 'De'], 0, 'dehet', 'The last part decides: de hond, but het voer, so het hondenvoer.'), 'hondenvoer is op.'] },
    { en: 'The bathroom is upstairs.', parts: [FK(['De', 'Het'], 0, 'dehet', 'The last part decides: het bad, but de kamer, so de badkamer.'), 'badkamer is boven.'] },
    { en: 'Paola makes breakfast.', parts: ['Paola maakt', FK(['het', 'de'], 0, 'dehet', 'ont- in front and two syllables is usually het: het ontbijt.'), 'ontbijt.'] },
    { en: 'The heating is broken.', parts: [FK(['De', 'Het'], 0, 'dehet', 'Words ending in -ing are always de: de verwarming.'), 'verwarming is kapot.'] },
  ] });
})();
