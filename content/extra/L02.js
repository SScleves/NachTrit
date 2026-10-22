(() => {
  // Level 2 De buren, Alblasserdam (tier 1, A1 words), place mensen: the neighbours, friends, the borrel and the
  // birthday, greetings and goodbyes, small talk, a few feelings. Single words and two-word phrases, at most 5 words
  // a line, one fork per build, grammar limited to de/het and zijn/hebben in the present.
  // Sources: vault _site/situations meeting-people (Hoe gaat het?, En met jou?, Goedemiddag, Tot morgen, Welterusten),
  // neighbours and small-talk (Lekker weertje, hè?, Fijn weekend), polite-phrases (Graag gedaan), 04 - Phrases &
  // Scenarios/De nieuwe buren ontmoeten (Ik ben Santi, ik woon hiernaast. Welkom in de buurt.) and Borrel met vrienden,
  // 01 - Vocabulary/buur, borrel, gezellig, leuk & lekker, 03 - Verbs/hebben (Ik heb het druk), 02 - Grammar/de vs het
  // (people are de, -je words are het, plurals are de), _site/words (de vriend, de vriendin, het kind, de verjaardag,
  // het cadeautje, het weer, jarig, chagrijnig, gefeliciteerd), _site/sentences (De buren zijn altijd chagrijnig als het
  // regent. Wat jammer. Je kijkt zo blij.), MOC Het bezoek (bezoek).
  // New rule: hebben, the twin of the zijn rule, linked to 03 - Verbs/hebben (same line as the other extra files).
  // Left out on purpose, because word signs draw their wrong options from every other word in the level: hoi (next to
  // hallo), tot ziens and dag (next to doei), bedankt and dank u wel (next to dank je wel), pardon (next to sorry),
  // gezellig as a word (next to leuk), het feestje (next to de borrel). hoi and gezellig live in read items instead,
  // which draw from the read pool. The four read items with their own options keep their traps in their own lanes.
  // Builds also carry nl: the game shows and speaks entry.nl when the last fork is passed.
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(2, { deliveries: 20, items: [
    // the people three doors down
    { w: 'the neighbour (man)', nl: 'de buurman', wrong: 'het buurman' }, { w: 'the neighbour (woman)', nl: 'de buurvrouw' },
    { w: 'the neighbours', nl: 'de buren', wrong: 'het buren' }, { w: 'the friend (man)', nl: 'de vriend' },
    { w: 'the friend (woman)', nl: 'de vriendin' }, { w: 'the child', nl: 'het kind', wrong: 'de kind' },
    // the borrel, the birthday, the weather
    { w: 'the drinks get-together', nl: 'de borrel' }, { w: 'the birthday', nl: 'de verjaardag' },
    { w: 'the little present', nl: 'het cadeautje', wrong: 'de cadeautje' }, { w: 'the weather', nl: 'het weer', wrong: 'de weer' },
    // hello and goodbye
    { w: 'good afternoon', nl: 'goedemiddag' }, { w: 'see you tomorrow', nl: 'tot morgen' },
    { w: 'have a nice weekend', nl: 'fijn weekend' }, { w: "you're welcome", nl: 'graag gedaan' },
    // how everyone feels
    { w: 'tired', nl: 'moe' }, { w: 'happy', nl: 'blij' }, { w: 'grumpy', nl: 'chagrijnig' },
    { w: 'nice, fun', nl: 'leuk' }, { w: 'a pity', nl: 'jammer' },

    { listen: true, nl: 'gefeliciteerd', en: 'congratulations' }, { listen: true, nl: 'welterusten', en: 'good night, sleep well' },

    { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },

    { read: true, nl: 'Hoi buurvrouw', en: 'Hi, neighbour.',
      o: ['Hi, neighbour.', 'Bye, neighbour.', 'Hi, friend.'], a: 0, r: 'groet', w: 'hoi is hi and doei is bye. A buurvrouw is a neighbour who is a woman.' },
    { read: true, nl: 'Hoe gaat het?', en: 'How are you?' },
    { read: true, nl: 'Goed, en met jou?', en: 'Good, and you?',
      o: ['Good, and you?', 'Good, I met you.', 'Good evening.'], a: 0, r: 'groet', w: 'met means with, not the English met. en met jou? hands the question back.' },
    { read: true, nl: 'Welkom in de buurt.', en: 'Welcome to the neighbourhood.' },
    { read: true, nl: 'Ik ben Santi, van hiernaast.', en: "I'm Santi, from next door." },
    { read: true, nl: 'Lekker weertje, hè?', en: 'Nice weather, eh?' },
    { read: true, nl: 'Gezellig, hè?', en: "Nice and cosy, isn't it?" },
    { read: true, nl: 'Ik heb het druk.', en: "I'm busy.",
      o: ["I'm busy.", "It's crowded.", "I'm cold."], a: 0, r: 'hebben', w: 'Ik heb het druk is I am busy. Het is druk is it is crowded.' },
    { read: true, nl: 'Paola is jarig.', en: "It's Paola's birthday.",
      o: ["It's Paola's birthday.", 'Paola is one year old.', 'Paola is at a party.'], a: 0, r: 'woord', w: 'jarig means it is her birthday. It says nothing about her age.' },

    { en: 'The neighbours are grumpy.', nl: 'De buren zijn chagrijnig.', parts: ['De buren', FK(['zijn', 'is'], 0, 'zijn', 'More than one neighbour, so zijn.'), 'chagrijnig.'] },
    { en: 'The neighbour has a cat.', nl: 'De buurvrouw heeft een kat.', parts: ['De buurvrouw', FK(['heeft', 'hebt', 'heb'], 0, 'hebben', 'One buurvrouw is a zij, and zij heeft.'), 'een kat.'] },
    { en: 'The girl is happy.', nl: 'Het meisje is blij.', parts: [FK(['Het', 'De'], 0, 'dehet', 'Every -je word is het, even a girl: het meisje.'), 'meisje is blij.'] },
    { en: 'We have visitors.', nl: 'Wij hebben bezoek.', parts: ['Wij', FK(['hebben', 'heeft', 'hebt'], 0, 'hebben', 'wij hebben, just like jullie hebben and zij hebben. heeft is only for one person.'), 'bezoek.'] },
  ] });
})();
