(() => {
  // Level 1 De honden, Alblasserdam (tier 1, A1 words), place thuis: the rooms, the furniture, the family,
  // the dogs, the wife and the day. Single words and two-word phrases, at most 5 words a line, one fork per build.
  // Sources: vault 04 - Phrases & Scenarios/Thuis met je vrouw (Schat, ik ben thuis. de vaatwasser, koken),
  // 01 - Vocabulary/hond (Ik heb twee honden en ze zijn de baas in huis), huis (huis vs thuis), vrouw (schat),
  // 03 - Verbs/hebben and zijn (Ik ben moe), uitlaten (de riem), _site/maps/H17 Thuis, 02 - Grammar/de vs het,
  // _site/sentences (Het bed staat onder het raam in de slaapkamer. Er liggen twee honden op de bank.), towns.js (de sloot).
  // New rule: hebben, linked to the vault note 03 - Verbs/hebben, the twin of the zijn rule in levels.js.
  // Left out on purpose, because the level's distractor pool would make them ambiguous: het hondje (the hond look
  // could then show a right-looking wrong sign), a deur look (the deur prop is a narrow house and het huis is in
  // this level), het dak (the look marker floats right above the roof of the huis prop), de avond (next to de nacht),
  // a boom look (the tuin prop is five trees behind a fence, so de boom would be a right-looking wrong sign on it).
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(1, { deliveries: 20, items: [
    // the house, room by room
    { w: 'the kitchen', nl: 'de keuken', wrong: 'het keuken' }, { w: 'the living room', nl: 'de woonkamer' },
    { w: 'the bedroom', nl: 'de slaapkamer' }, { w: 'the bathroom', nl: 'de badkamer' }, { w: 'the stairs', nl: 'de trap' },
    { w: 'the window', nl: 'het raam' }, { w: 'the couch', nl: 'de bank' }, { w: 'the bed', nl: 'het bed', wrong: 'de bed' },
    { w: 'the table', nl: 'de tafel' }, { w: 'the dishwasher', nl: 'de vaatwasser' },
    // the family
    { w: 'the husband', nl: 'de man' }, { w: 'the child', nl: 'het kind', wrong: 'de kind' }, { w: 'the parents', nl: 'de ouders' },
    { w: 'the family (household)', nl: 'het gezin' },
    // the dogs
    { w: 'the dogs', nl: 'de honden', wrong: 'het honden' }, { w: 'the leash', nl: 'de riem' }, { w: 'the dog basket', nl: 'de mand' },
    { w: 'the poo bag', nl: 'het poepzakje', wrong: 'de poepzakje' },
    // the day
    { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the dinner', nl: 'het avondeten' },
    { w: 'the alarm clock', nl: 'de wekker' }, { w: 'at home', nl: 'thuis' }, { w: 'to cook', nl: 'koken' },
    // reading
    { read: true, nl: 'Schat, ik ben thuis.', en: "Honey, I'm home." },
    { read: true, nl: 'Ik ben moe.', en: "I'm tired." },
    { read: true, nl: 'De honden zijn de baas.', en: 'The dogs are in charge.' },
    { read: true, nl: 'Ik heb het koud.', en: "I'm cold.", o: ["I'm cold.", 'I have a cold.', "I'm hot."], a: 0, r: 'hebben',
      w: 'Like tengo frío, you have it cold: ik heb het koud. Having a cold is verkouden zijn.' },
    // listening
    { listen: true, nl: 'de schat', en: 'the treasure, also: honey' }, { listen: true, nl: 'welterusten', en: 'good night' },
    { listen: true, nl: 'de sleutel', en: 'the key' },
    // looking
    { look: true, prop: 'water', nl: 'de sloot', en: 'the ditch' },
    // building
    { en: 'I have two dogs.', parts: ['Ik', FK(['heb', 'hebt', 'heeft'], 0, 'hebben', 'ik heb. hebben is irregular: ik heb, jij hebt, hij heeft.'), 'twee honden.'] },
    { en: 'The dogs are hungry.', parts: ['De honden', FK(['hebben', 'zijn'], 0, 'hebben', 'Hunger is something you have, like tener hambre: honger hebben.'), 'honger.'] },
    { en: 'The window is open.', parts: [FK(['Het', 'De'], 0, 'dehet', 'raam is a het-word: het raam.'), 'raam is open.'] },
    { en: 'Paola is home.', parts: ['Paola', FK(['is', 'zijn', 'ben'], 0, 'zijn', 'Paola is one person, a zij: zij is.'), 'thuis.'] },
  ] });
})();
