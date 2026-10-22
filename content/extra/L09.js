(() => {
  // Level 9 Afhalen, Kinderdijk en Dordrecht (tier 2, A1 phrases), place eten: 36 more items. The snack bar and the
  // pizzeria at night: ordering, waiting, paying, the tip, and the bill split to the cent.
  // Fence: phrases of at most 5 words, present tense, subject-verb-object, numbers to 100, polite u and alstublieft,
  // de/het, niet and geen in reading forks only. Every build has one fork.
  // Sources in the vault: _site/dialogues/eten-afhalen (Twee pizza's margherita, alstublieft. extra kaas, afhalen, bezorgd),
  //   een-koffie-bestellen (Wilt u het hier opeten of meenemen?), uit-eten-met-vrienden (Zullen we de rekening gewoon delen?),
  //   op-het-terras (We doen het samen, hoor.), _site/situations/restaurant (Kunnen we apart betalen?) and pub (de menukaart),
  //   _site/sentences (Klopt het bedrag wel?, Zit de fooi er al bij?, Halen we ook popcorn? Ik trakteer., Eet smakelijk,
  //   Nog tien minuten, Het eten is echt lekker, schat., De statiegeldmachine doet het niet., Kom op, nog een kwartiertje,
  //   complimenten aan de kok), 01 - Vocabulary/leuk & lekker, 02 - Grammar/de vs het (be- words and verbs used as nouns
  //   are het), open vs gesloten lettergreep, presens, 03 - Verbs/hebben, MOC Getallen (vierendertig), and content/towns.js
  //   (Kinderdijk en Dordrecht: the dead split the bill to the cent).
  // Replays: de kaas and het biertje (level 8), het tasje (levels 6 to 8).
  // New rule: hebben, linked to the vault note 03 - Verbs/hebben. Other extra files set it too, so only if missing.
  //   pres and spel come from district2.js, which defines this level and loads first; zijn, dehet and woord are core.
  // New props: none. Only fiets, lamp and nummer.
  // `wrong` on five word items is the same noun with the wrong article, so those forks test de/het as well.
  // Left out on purpose, because the level's distractor pool would make them right answers: de patat (de friet is here),
  //   any sauce such as mayonaise or ketchup (de saus is here), graag (please), bedankt (dank u wel), het pilsje (het biertje),
  //   het telefoonnummer (het nummer), het huis and het café (the deur prop is drawn as a narrow house), and a read about the
  //   order being ready (Bestelling voor Santi. is here). No verb-first questions and no uw or mijn: those are tier 3.
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(9, { deliveries: 20, items: [
    // words: the snack bar counter
    { w: 'the snack bar', nl: 'de snackbar' }, { w: 'the croquette', nl: 'de kroket' }, { w: 'the frikandel (snack sausage)', nl: 'de frikandel' },
    { w: 'the menu', nl: 'de menukaart', wrong: 'het menukaart' }, { w: 'the delivery rider', nl: 'de bezorger' },
    { w: 'the quarter of an hour', nl: 'het kwartier', wrong: 'de kwartier' },
    // words: replays from levels 6 to 8
    { w: 'the cheese', nl: 'de kaas' }, { w: 'the small beer', nl: 'het biertje', wrong: 'de biertje' }, { w: 'the plastic bag', nl: 'het tasje' },
    // words: paying and splitting
    { w: 'the bill', nl: 'de rekening', wrong: 'het rekening' }, { w: 'the amount', nl: 'het bedrag', wrong: 'de bedrag' }, { w: 'the tip', nl: 'de fooi' },
    { w: '€ 34,50', nl: 'vierendertig euro vijftig' },
    // words: four verbs and one adjective
    { w: 'to order', nl: 'bestellen' }, { w: 'to pick up (an order)', nl: 'afhalen' }, { w: 'to pay', nl: 'betalen' },
    { w: 'to split (the bill)', nl: 'delen' }, { w: 'tasty', nl: 'lekker' },

    // reads: three plain lines from the counter, three meaning traps
    { read: true, nl: 'Hier opeten of meenemen?', en: 'Eat in or take away?' },
    { read: true, nl: 'Samen of apart?', en: 'Together or separately?' },
    { read: true, nl: 'Tot op de cent precies.', en: 'Down to the exact cent.' },
    { read: true, nl: 'Nog tien minuten.', en: 'Ten more minutes.',
      o: ['Ten more minutes.', 'Ten minutes ago.', 'Ten minutes late.'], a: 0, r: 'woord', w: 'Ten more minutes. nog is still or more. Ago is geleden, late is te laat.' },
    { read: true, nl: 'De pin doet het niet.', en: "The card machine isn't working.",
      o: ["The card machine isn't working.", 'We only take cards.', 'Enter your PIN.'], a: 0, r: 'woord', w: "The card machine isn't working. doet het niet means does not work, and de pin is the card machine." },
    { read: true, nl: 'Ik trakteer.', en: "It's my treat.",
      o: ["It's my treat.", "Let's split it.", 'You pay this time.'], a: 0, r: 'woord', w: "It's my treat. trakteren means you pay for everyone, so nobody splits anything." },

    // listen: a number to 100, the eu sound, a short o, and the line before every meal
    { listen: true, nl: 'vierenvijftig', en: '54' }, { listen: true, nl: 'de keuken', en: 'the kitchen' },
    { listen: true, nl: 'de kok', en: 'the cook' }, { listen: true, nl: 'eet smakelijk', en: 'enjoy your meal' },

    // look: the delivery bike, the lamp over the counter, the house number on the order
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
    { look: true, prop: 'nummer', value: 45, nl: 'vijfenveertig', en: '45' },

    // builds: one fork each
    { en: "I'm hungry.", parts: ['Ik', FK(['heb', 'ben', 'heeft'], 0, 'hebben', 'Hunger is something you have in Dutch, like tengo hambre: ik heb honger.'), 'honger.'] },
    { en: 'The fries are cold.', parts: ['De friet', FK(['is', 'zijn'], 0, 'zijn', 'De friet is one portion, so it takes is. Only de frieten would take zijn.'), 'koud.'] },
    { en: 'Two pizzas, please.', parts: ['Twee', FK(["pizza's", 'pizzas'], 0, 'spel', "pizza ends in a long a, and the 's keeps it long in the plural: pizza's."), ', alstublieft.'] },
    { en: 'The food is tasty.', parts: [FK(['Het', 'De'], 0, 'dehet', 'eten here is a verb used as a noun, and those are always het: het eten.'), 'eten is lekker.'] },
    { en: 'We split the bill.', parts: ['We', FK(['delen', 'deelt', 'deel'], 0, 'pres', 'we is plural, so the verb is the whole infinitive: delen.'), 'de rekening.'] },
  ] });
})();
