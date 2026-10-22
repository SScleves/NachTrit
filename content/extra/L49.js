(() => {
  // Level 49, Gouda, Thuis (tier 3, A1 to A2): 36 more items for the house, the morning and the evening,
  //   the dogs, Paola, and the family that calls on Sunday.
  // Fence: at most 8 words, present tense in all persons, questions with the verb first, V2 after a time word,
  //   niet and geen, modal plus infinitive at the end (uitlaten stays glued), possessives, hoeft niet te.
  // Sources in the vault: 04 - Phrases & Scenarios/Thuis met je vrouw (Het ruikt heerlijk, Zal ik thee zetten,
  //   Je hebt gelijk, de vaatwasser, de honden uitlaten, schat); _site/words (de kat, de moeder, de zus, de schat,
  //   koken, slapen, Morgen werk ik thuis, Werk je thuis of op kantoor, Heb je huisdieren, Ik moet vandaag de afwas doen);
  //   _site/situations/visiting (het toilet); MOC Lidwoorden & voornaamwoorden (mijn, jouw, onze); MOC Ontkenning (geen ... meer).
  // New rules: none. presens and bezit come from town-gouda.js. New props: none (deur, lamp, nummer).
  // Word, listen and look forks take their wrong signs from each other, so no two Dutch answers mean the same:
  //   no de wc next to het toilet, no het licht next to de lamp, no de ijskast next to de koelkast.
  // `wrong` on a word item is the same noun with the wrong article, so that fork also tests de/het.
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(49, { deliveries: 20, items: [
    // words: furniture, the kitchen and bathroom, the bedroom, the pet, the wife
    { w: 'the table', nl: 'de tafel', wrong: 'het tafel' }, { w: 'the chair', nl: 'de stoel' }, { w: 'the cupboard', nl: 'de kast' },
    { w: 'the fridge', nl: 'de koelkast' }, { w: 'the dishwasher', nl: 'de vaatwasser' }, { w: 'the shower', nl: 'de douche' },
    { w: 'the toilet', nl: 'het toilet', wrong: 'de toilet' }, { w: 'the pillow', nl: 'het kussen', wrong: 'de kussen' },
    { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the alarm clock', nl: 'de wekker' },
    { w: 'the pet', nl: 'het huisdier' }, { w: 'the wife', nl: 'de vrouw' },

    // reads: two meaning traps, three plain lines
    { read: true, nl: 'Je hebt gelijk.', en: "You're right.",
      o: ["You're right.", 'You have the same.', "You're the same."], a: 0, r: 'woord', w: 'gelijk hebben is to be right. The vault says to learn this one first.' },
    { read: true, nl: 'De honden hebben geen eten meer.', en: 'The dogs are out of food.',
      o: ['The dogs are out of food.', "The dogs don't eat any more.", 'The dogs have already eaten.'], a: 0, r: 'neg', w: 'geen eten meer is no food left. The dogs would still eat, given the chance.' },
    { read: true, nl: 'Zal ik thee zetten?', en: 'Shall I make tea?' },
    { read: true, nl: 'Het ruikt heerlijk.', en: 'It smells delicious.' },
    { read: true, nl: 'Morgen werk ik thuis.', en: "Tomorrow I'm working from home." },

    // listen: the g and ll in gezellig, the o and l in de zolder, the sch in mijn schat
    { listen: true, nl: 'gezellig', en: 'cosy' }, { listen: true, nl: 'de zolder', en: 'the attic' }, { listen: true, nl: 'mijn schat', en: 'my darling' },

    // look: the front door, the lamp over the table, the number on the house
    { look: true, prop: 'deur', nl: 'de deur', en: 'the door' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
    { look: true, prop: 'nummer', value: 17, nl: 'zeventien', en: '17' },

    // builds: present tense, the verb first in questions, V2 after a time word, niet and geen, modals, possessives
    { en: 'Are you working from home today?', parts: [FK(['Werk', 'Werkt', 'Werken'], 0, 'presens', 'When je comes after the verb, the t drops: werk je.'), 'je vandaag thuis?'] },
    { en: 'In the morning I always take a long shower.', parts: ["'s Ochtends", FK(['douche ik', 'ik douche', 'douchet ik'], 0, 'v2', "'s Ochtends takes slot 1, so the verb comes next, then ik."), 'altijd lang.'] },
    { en: 'Paola has breakfast in the kitchen.', parts: ['Paola', FK(['ontbijt', 'ontbijten', 'ontbijtt'], 0, 'presens', 'Paola is a zij, stem plus t, but the stem ontbijt already ends in t.'), 'in de keuken.'] },
    { en: 'We have two dogs and no cat.', parts: ['We', FK(['hebben', 'heeft', 'hebt'], 0, 'presens', 'we is plural: hebben.'), 'twee honden en',
      FK(['geen', 'niet'], 0, 'neg', 'een kat becomes geen kat. A noun with een takes geen.'), 'kat.'] },
    { en: 'Is the dog sleeping in your bed?', parts: [FK(['Slaapt', 'Slaap', 'Slapen'], 0, 'presens', 'One dog, so the hij-form: slaapt, even with the verb first.'), 'de hond in',
      FK(['jouw', 'jij'], 0, 'bezit', 'Your before a noun is jouw. jij is only the subject, the one who does something.'), 'bed?'] },
    { en: 'Can you walk the dogs?', parts: [FK(['Kun', 'Kunnen'], 0, 'modal', 'One person, so kun je. kunnen is for we, jullie and zij.'), 'je de honden',
      FK(['uitlaten', 'uitlaat', 'laat uit'], 0, 'modal', 'After a modal the whole infinitive goes to the end: uitlaten.'), '?'] },
    { en: 'My mother calls every Sunday.', parts: ['Elke zondag', FK(['belt mijn moeder', 'mijn moeder belt', 'bel mijn moeder'], 0, 'v2', 'Elke zondag in slot 1: the verb comes second, then mijn moeder.'), '.'] },
    { en: 'Our bedroom is upstairs.', parts: [FK(['Onze', 'Ons'], 0, 'bezit', 'slaapkamer is a de-word, so onze slaapkamer. ons is for het-words.'), 'slaapkamer is boven.'] },
    { en: "The keys aren't on the table.", parts: ['De sleutels', FK(['liggen', 'ligt'], 0, 'presens', 'sleutels is plural: liggen.'),
      FK(['niet', 'geen'], 0, 'neg', 'No noun with een to cancel, so niet, before the place.'), 'op tafel.'] },
    { en: 'Do you want tea or coffee?', parts: [FK(['Wil', 'Willen'], 0, 'modal', 'One person, je: wil je. willen is for we, jullie and zij.'), 'je thee of koffie?'] },
    { en: "You don't have to cook tonight.", parts: ['Je', FK(['hoeft', 'moet', 'mag'], 0, 'mag', 'hoeft niet te is no need. moet niet is you shouldn\'t, mag niet is you\'re not allowed.'), 'vanavond niet te koken.'] },
    { en: "Tonight Paola's sister is coming.", parts: ['Vanavond', FK(['komt de zus', 'de zus komt'], 0, 'v2', 'Vanavond in slot 1, then the verb, then de zus.'), 'van Paola.'] },
    { en: 'Are the dogs hungry?', parts: [FK(['Hebben', 'Zijn', 'Heeft'], 0, 'woord', 'In Dutch you have hunger: honger hebben. Two dogs, so hebben.'), 'de honden honger?'] },
  ] });
})();
