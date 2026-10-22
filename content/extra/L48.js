(() => {
  // Level 48, Kinderdijk en Dordrecht, De mensen (tier 2, A1 phrases): 72 more items for the neighbours, the borrel,
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
    { w: 'the mother', nl: 'de moeder' },

    // reads: three meaning traps, three plain lines
    { read: true, nl: 'Ik vind het leuk.', en: 'I like it.',
      o: ['I like it.', 'I found it.', "I'm looking for it."], a: 0, r: 'woord', w: 'vinden with an adjective gives your opinion: ik vind het leuk, I like it. Nothing was lost.' },
    { read: true, nl: 'Dat klopt.', en: "That's right.",
      o: ["That's right.", 'Someone is knocking.', "That's enough."], a: 0, r: 'woord', w: 'kloppen is to knock on a door, but dat klopt means that is right. A bill klopt when it adds up.' },
    { read: true, nl: 'Gefeliciteerd met je vrouw.', en: "Congratulations on your wife's birthday.",
      o: ["Congratulations on your wife's birthday.", 'Your wife congratulates you.', 'Say congratulations to your wife.'], a: 0, r: 'cult', w: 'At a Dutch birthday you congratulate the whole room, so the guests say gefeliciteerd met je vrouw to her husband.' },
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
    { en: 'Everyone finds it cosy.', parts: ['Iedereen', FK(['vindt', 'vinden', 'vind'], 0, 'pres', 'iedereen counts as one person: stem vind plus t gives vindt.'), 'het gezellig.'] },
    { en: "It's Paola's birthday.", parts: ['Paola', FK(['is', 'heeft'], 0, 'zijn', 'jarig goes with zijn: Paola is jarig, today is her birthday.'), 'jarig.'] },
    { en: 'The little present is for Paola.', parts: [FK(['Het', 'De'], 0, 'dehet', 'Every -je word is het: het cadeautje, het biertje.'), 'cadeautje is voor Paola.'] },
    { en: 'That is €75 altogether.', parts: ['Dat is samen', FK(['vijfenzeventig', 'zevenenvijftig'], 0, 'getal', 'Dutch says the units first: vijfenzeventig is five and seventy.'), 'euro.'] },
    // second pass, 36 more: family and introductions, where you come from (Ik kom uit), the borrel glass, feelings, Sunday
    // Sources: _site/situations/meeting-people (Hoe heet je, Ik kom uit, Heb je kinderen, Heb je huisdieren,
    //   Dag / Doei), friends (Tot straks), _site/words (de naam, de zus, de dochter,
    //   de familie, het land, de afspraak, de hobby, ontmoeten), MOC Gevoel & gezondheid (gezond), MOC Getallen.
    // No synonyms enter the shared word pool: no blij (gelukkig is there), no feest as a word (de borrel is there),
    //   no aardig next to vriendelijk, no boos next to chagrijnig.
    { w: 'the name', nl: 'de naam', wrong: 'het naam' }, { w: 'the sister', nl: 'de zus' }, { w: 'the brother', nl: 'de broer' },
    { w: 'the wife', nl: 'de vrouw' }, { w: 'the daughter', nl: 'de dochter' }, { w: 'the family', nl: 'de familie', wrong: 'het familie' },
    { w: 'the pet', nl: 'het huisdier', wrong: 'de huisdier' }, { w: 'the country', nl: 'het land', wrong: 'de land' },
    { w: 'the language', nl: 'de taal' }, { w: 'the (little) glass of wine', nl: 'het wijntje', wrong: 'de wijntje' },
    { w: 'the appointment', nl: 'de afspraak' },
    { w: 'scared', nl: 'bang' }, { w: 'ill', nl: 'ziek' }, { w: 'having your birthday', nl: 'jarig' },
    { w: 'Sunday', nl: 'zondag' }, { w: '€ 54,60', nl: 'vierenvijftig euro zestig' },

    // reads: one meaning trap, seven plain lines; geen and niet only here
    { read: true, nl: 'Hoe heet je?', en: "What's your name?",
      o: ["What's your name?", 'How hot is it?', 'How old are you?'], a: 0, r: 'woord', w: 'heten is to be called: hoe heet je asks your name. heet is also hot, but not in this line.' },
    { read: true, nl: 'Tot straks.', en: 'See you in a bit.' },
    { read: true, nl: 'Ik heb geen kinderen.', en: "I don't have children." },
    { read: true, nl: 'Het is niet erg.', en: "It doesn't matter." },
    { read: true, nl: 'Tot zaterdag.', en: 'See you on Saturday.' },
    { read: true, nl: 'Ik kom uit Spanje.', en: "I'm from Spain." },
    { read: true, nl: 'Ik heb een zus.', en: 'I have a sister.' },

    // listen: oei in doei, ie and ij in vriendelijk, ou in getrouwd, ui and g in de uitnodiging
    { listen: true, nl: 'doei', en: 'bye' }, { listen: true, nl: 'vriendelijk', en: 'friendly' },
    { listen: true, nl: 'getrouwd', en: 'married' }, { listen: true, nl: 'de uitnodiging', en: 'the invitation' },

    // look: the lamp by the neighbours' door, the tree in their garden, the house number of the next borrel
    { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
    { look: true, prop: 'nummer', value: 68, nl: 'achtenzestig', en: '68' },

    // builds: one fork each, zijn and hebben in the present, heten, de/het and a number
    { en: 'We are neighbours.', parts: ['Wij', FK(['zijn', 'is', 'bent'], 0, 'zijn', 'wij takes zijn: wij zijn, jullie zijn, zij zijn.'), 'buren.'] },
    { en: 'You are warmly welcome.', parts: ['U', FK(['bent', 'zijn', 'ben'], 0, 'zijn', 'u is the polite you and takes bent, like jij: u bent welkom.'), 'van harte welkom.'] },
    { en: 'Paola has two dogs.', parts: ['Paola', FK(['heeft', 'hebt', 'hebben'], 0, 'pres', 'hebben is irregular: ik heb, jij hebt, zij heeft.'), 'twee honden.'] },
    { en: 'My name is Santi.', parts: ['Ik', FK(['heet', 'heten', 'heeft'], 0, 'pres', 'ik takes the bare stem of heten: ik heet Santi.'), 'Santi.'] },
    { en: 'The party is on Saturday.', parts: [FK(['Het', 'De'], 0, 'dehet', 'feest is a het-word, like het huis. Learn the word with its article.'), 'feest is zaterdag.'] },
    { en: 'The bill is €48.', parts: ['De rekening is', FK(['achtenveertig', 'vierentachtig'], 0, 'getal', 'Dutch says the units first: achtenveertig is eight and forty.'), 'euro.'] },
  ] });
})();
