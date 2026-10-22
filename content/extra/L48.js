(() => {
  // Level 48, Kinderdijk en Dordrecht, De mensen (tier 2, A1 phrases): 36 more items for the neighbours, the borrel,
  //   a birthday in the family, feelings and opinions, and the bill split to the cent.
  // Fence: at most 5 words, present tense SVO, one fork per build, numbers to 100, u for the old neighbour,
  //   days, de/het, niet only in a read. No object pronoun except het, no modals, no questions with the verb first.
  // Sources in the vault: 04 - Phrases & Scenarios/De nieuwe buren ontmoeten (het pakketje, een ladder lenen,
  //   Welkom in de buurt, Zaterdag om vier uur) and Borrel met vrienden (Proost, het rondje, Zullen we het even splitten);
  //   Buren & Vrienden MOC (Gefeliciteerd met je vrouw: at a birthday you congratulate the whole family);
  //   01 - Vocabulary/borrel, buur, gezellig, leuk & lekker (Ik vind golfen echt leuk); 03 - Verbs/vinden;
  //   _site/situations friends, neighbours, meeting-people (aangenaam), polite-phrases (Sorry, ik begrijp het niet),
  //   pub (Proost, op ons); _site/words (de mensen, de vriend, de vriendin, het kind, de verjaardag, het cadeautje,
  //   de mening, gelukkig, verdrietig, moe, chagrijnig, jarig, gefeliciteerd, de groeten); MOC Getallen.
  // het tikkie is not in the vault: the payment request every Dutch borrel ends with, a het-word like every -ie word.
  // New rules: none. pres comes from district2.js and is set again only if missing. New props: none (hond, fiets, nummer).
  // Word, listen and look forks take their wrong signs from each other, so no two Dutch answers mean the same:
  //   no blij next to gelukkig, no de wijk next to de buurt, no feest or vrijmibo next to de borrel.
  // Read meanings are all different, so a plain read never gets a second right English sign.
  // `wrong` on a word item is the same noun with the wrong article, so that fork also tests de/het.
  window.RULES.pres = window.RULES.pres || { name: 'Present tense', note: 'presens' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(48, { deliveries: 20, items: [
    // words: people, a birthday, the borrel, the neighbours, feelings, the day and the bill
    { w: 'the people', nl: 'de mensen' }, { w: 'the friend (man)', nl: 'de vriend' }, { w: 'the friend (woman)', nl: 'de vriendin' },
    { w: 'the child', nl: 'het kind', wrong: 'de kind' }, { w: 'the birthday', nl: 'de verjaardag', wrong: 'het verjaardag' },
    { w: 'the (little) present', nl: 'het cadeautje' }, { w: 'the round (of drinks)', nl: 'het rondje', wrong: 'de rondje' },
    { w: 'the parcel', nl: 'het pakketje' }, { w: 'the ladder', nl: 'de ladder' }, { w: 'the opinion', nl: 'de mening' },
    { w: 'happy', nl: 'gelukkig' }, { w: 'sad', nl: 'verdrietig' }, { w: 'tired', nl: 'moe' }, { w: 'busy', nl: 'druk' },
    { w: 'Friday', nl: 'vrijdag' }, { w: '€ 37,80', nl: 'zevenendertig euro tachtig' },
    { w: 'the payment request (Tikkie)', nl: 'het tikkie', wrong: 'de tikkie' },

    // reads: three meaning traps, three plain lines
    { read: true, nl: 'Ik vind het leuk.', en: 'I like it.',
      o: ['I like it.', 'I found it.', "I'm looking for it."], a: 0, r: 'woord', w: 'vinden with an adjective gives your opinion: ik vind het leuk, I like it. Nothing was lost.' },
    { read: true, nl: 'Dat klopt.', en: "That's right.",
      o: ["That's right.", 'Someone is knocking.', "That's enough."], a: 0, r: 'woord', w: 'kloppen is to knock on a door, but dat klopt means that is right. A bill klopt when it adds up.' },
    { read: true, nl: 'Gefeliciteerd met Paola.', en: "Congratulations on Paola's birthday.",
      o: ["Congratulations on Paola's birthday.", 'Paola and I congratulate you.', 'Paola says congratulations.'], a: 0, r: 'cult', w: 'At a Dutch birthday you congratulate the whole family, so the guests say gefeliciteerd met Paola to her husband.' },
    { read: true, nl: 'Proost, op de buren.', en: 'Cheers, to the neighbours.' },
    { read: true, nl: 'Fijn weekend.', en: 'Have a nice weekend.' },
    { read: true, nl: 'Sorry, ik begrijp het niet.', en: "Sorry, I don't understand." },

    // listen: aa and g in aangenaam, ch and ij in chagrijnig, ee in gefeliciteerd, oe in de groeten
    { listen: true, nl: 'aangenaam', en: 'pleased to meet you' }, { listen: true, nl: 'gefeliciteerd', en: 'congratulations' },
    { listen: true, nl: 'chagrijnig', en: 'grumpy' }, { listen: true, nl: 'de groeten', en: 'the regards' },

    // look: the neighbours' dog, a bike against the wall, the number on the door of the borrel
    { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
    { look: true, prop: 'nummer', value: 43, nl: 'drieënveertig', en: '43' },

    // builds: one fork each, present tense, zijn, de/het or a number
    { en: 'I speak a little Dutch.', parts: ['Ik', FK(['spreek', 'spreekt', 'spreken'], 0, 'pres', 'ik takes the bare stem: spreek, with ee to keep the sound long.'), 'een beetje Nederlands.'] },
    { en: 'You live next door.', parts: ['U', FK(['woont', 'woon', 'wonen'], 0, 'pres', 'u is the polite you and works like jij: stem plus t, u woont.'), 'hiernaast.'] },
    { en: 'Everyone finds it cosy.', parts: ['Iedereen', FK(['vindt', 'vinden', 'vind'], 0, 'pres', 'iedereen counts as one person: stem plus t, vindt. The d stays and the t comes on top.'), 'het gezellig.'] },
    { en: "It's Paola's birthday.", parts: ['Paola', FK(['is', 'heeft'], 0, 'zijn', 'jarig goes with zijn: Paola is jarig, today is her birthday.'), 'jarig.'] },
    { en: 'The little present is for Paola.', parts: [FK(['Het', 'De'], 0, 'dehet', 'Every -je word is het: het cadeautje, het biertje.'), 'cadeautje is voor Paola.'] },
    { en: 'That is €75 altogether.', parts: ['Dat is samen', FK(['vijfenzeventig', 'zevenenvijftig'], 0, 'getal', 'Dutch says the units first: vijfenzeventig is five and seventy.'), 'euro.'] },
  ] });
})();
