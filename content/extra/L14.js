(() => {
  // Level 14 Niet of geen, longer: the winkels place in Gouda (tier 3, 8 words max). The supermarket, the butcher,
  // the cheese seller on the Markt, the drugstore, the clothes shop: paying, cash and cards, sizes, receipts and bags,
  // all said with one no. geen for a noun with een or no article, niet for the rest (adjectives, places, verbs,
  // nouns with de, het or mijn). Plus V2 after a time word, modal plus infinitive at the end, and mijn.
  // Sources: 02 - Grammar/niet vs geen (geen kills a noun with een or no article, niet before the place and the
  // adjective, one negative only), modale werkwoorden, V2 word order, presens; _site/situations/supermarket (Wilt u een
  // tasje erbij?, Kan ik pinnen?), _site/situations/butcher (gehakt, Anders nog iets?); _site/words (de apotheek,
  // de broek, ruilen, kopen, afrekenen); content/towns.js for Gouda (de kaasmarkt, belegen, de siroopwafel).
  // Rules used: neg, v2, modal, presens, bezit. No new rules. Props: nummer, lamp.
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(14, { deliveries: 20, items: [
    // at the supermarket and the bakery
    { en: 'We have no bread left.', parts: ['We hebben', FK(['geen', 'niet'], 0, 'neg', 'brood has no article here, so geen. geen brood meer means no bread anymore.'), 'brood meer.'] },
    { en: "No, I don't need a bag.", parts: ['Nee, ik heb', FK(['geen', 'niet'], 0, 'neg', 'een tasje becomes geen tasje.'), 'tasje nodig.'] },
    { en: "No, I don't need the receipt.", parts: ['Nee, ik hoef', FK(['het bonnetje niet', 'geen het bonnetje', 'het bonnetje geen'], 0, 'neg', 'het pins the noun down, so it stays and niet goes after it.'), '.'] },
    { en: "On Sunday the shop isn't open.", parts: ['Op zondag', FK(['is de winkel', 'de winkel is'], 0, 'v2', 'Op zondag takes slot 1, so the verb comes second and de winkel follows.'),
      FK(['niet', 'geen'], 0, 'neg', 'open is an adjective, so niet.'), 'open.'] },
    { en: 'On Saturday we have to do the shopping.', parts: ['Zaterdag', FK(['moeten we', 'we moeten'], 0, 'v2', 'Zaterdag takes slot 1, so the modal comes before we.'), 'boodschappen',
      FK(['doen', 'te doen', 'doet'], 0, 'modal', 'After moeten the verb goes to the end as a bare infinitive: doen.'), '.'] },

    // paying
    { en: "I don't have any cash.", parts: ['Ik heb', FK(['geen', 'niet'], 0, 'neg', 'contant geld has no article, so geen.'), 'contant geld.'] },
    { en: "You can't pay by card here. (polite)", parts: ['U kunt hier', FK(['niet pinnen', 'pinnen niet', 'geen pinnen'], 0, 'neg', 'niet goes right before the infinitive at the end.'), '.'] },
    { en: "My debit card doesn't work.", parts: ['Mijn pinpas', FK(['doet het niet', 'doet niet het', 'doet het geen'], 0, 'neg', 'doet het is the fixed phrase for works, and niet comes after het: doet het niet.'), '.'] },
    { en: "My wallet isn't in my bag.", parts: ['Mijn portemonnee zit', FK(['niet', 'geen'], 0, 'neg', 'niet goes before the place: niet in mijn tas.'), 'in',
      FK(['mijn', 'mij', 'ik'], 0, 'bezit', 'Before a noun, my is mijn. mij and ik never stand in front of a noun.'), 'tas.'] },

    // the butcher, the cheese seller and the Markt
    { en: "This afternoon the butcher has no mince.", parts: ['Vanmiddag', FK(['heeft de slager', 'de slager heeft'], 0, 'v2', 'Vanmiddag takes slot 1, so heeft comes second.'),
      FK(['geen', 'niet'], 0, 'neg', 'gehakt has no article here, so geen.'), 'gehakt.'] },
    { en: "The cheese isn't mature, it's young.", parts: ['De kaas is', FK(['niet', 'geen'], 0, 'neg', 'belegen is an adjective here with no noun after it, so niet. geen needs a noun behind it.'), 'belegen, maar jong.'] },
    { en: "We don't sell cheese anymore.", parts: ['Wij', FK(['verkopen', 'verkoopt', 'verkoop'], 0, 'presens', 'wij takes the plural: verkopen.'),
      FK(['geen', 'niet'], 0, 'neg', 'kaas has no article here, so geen.'), 'kaas meer.'] },
    { en: 'Do you have any syrup waffles left? (polite)', parts: [FK(['Heeft u', 'Heb u', 'Hebben u'], 0, 'presens', 'A question starts with the verb, and u takes heeft: heeft u.'), 'nog stroopwafels?'] },
    { en: "On Thursday I'm not going to the cheese market.", parts: ['Donderdag', FK(['ga ik', 'ik ga'], 0, 'v2', 'Donderdag takes slot 1, so the verb comes before ik.'),
      FK(['niet naar de kaasmarkt', 'naar de kaasmarkt niet', 'geen naar de kaasmarkt'], 0, 'neg', 'niet goes before the place.'), '.'] },

    // shop words, three with the wrong article as the second sign
    { w: 'the cheese farmer', nl: 'de kaasboer' }, { w: 'the piece of cheese', nl: 'het stuk kaas', wrong: 'de stuk kaas' },
    { w: 'the wallet', nl: 'de portemonnee' }, { w: 'the banknote', nl: 'het biljet', wrong: 'de biljet' }, { w: 'the coin', nl: 'de munt' },
    { w: 'the drugstore (Kruidvat, Etos)', nl: 'de drogist' }, { w: 'the plaster', nl: 'de pleister' }, { w: 'the shoes', nl: 'de schoenen' },
    { w: 'the brand', nl: 'het merk', wrong: 'de merk' }, { w: 'to sell', nl: 'verkopen' },

    // reading: two meaning traps (hoeven, geen), then shop signs and answers
    { read: true, nl: 'Ik hoef geen tasje.', en: "I don't need a bag.",
      o: ["I don't need a bag.", "I'm not allowed a bag.", "I shouldn't take a bag."], a: 0, r: 'modal', w: 'hoeven with geen or niet means you do not need to. Not allowed is mag niet.' },
    { read: true, nl: 'Ik heb geen kaas.', en: 'I have no cheese.',
      o: ['I have no cheese.', "I don't have the cheese.", "I don't like cheese."], a: 0, r: 'neg', w: 'geen means no cheese at all. Not having the cheese would be ik heb de kaas niet.' },
    { read: true, nl: 'Nee, die zijn op.', en: "No, they're all gone." },
    { read: true, nl: 'Op is op.', en: "When it's gone, it's gone." },
    { read: true, nl: 'Niet goed, geld terug.', en: 'Not happy? Money back.' },

    { listen: true, nl: 'de stroopwafel', en: 'the syrup waffle' }, { listen: true, nl: 'de uitverkoop', en: 'the sale' },

    { look: true, prop: 'nummer', value: 42, nl: 'tweeënveertig', en: '42' }, { look: true, prop: 'nummer', value: 38, nl: 'achtendertig', en: '38' },
    { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
  ] });
})();
