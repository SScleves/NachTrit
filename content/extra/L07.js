// Nachtrit, level 7 De slager (Kinderdijk en Dordrecht, tier 2, place eten): 36 more items.
// The butcher's counter, cooking what you bought there, the market, and the bill: cash, the change, the tip, splitting it.
// Tier 2 fence: phrases of 5 words max, present tense SVO, numbers to 100, polite u and alstublieft, de/het.
// No niet/geen, no imperfectum. One fork per build.
// Sources: dutch-lessons vault. _site/situations/butcher (Wat is er vandaag in de aanbieding?, Kan dit in de oven, of in
// de airfryer?, Snijdt u het in plakjes), _site/situations/pub (Or: De rekening, alstublieft.), _site/sentences (Doe maar
// een pond gehakt., Hoeveel kost het per kilo?, De kip is duur, maar de groenten zijn goedkoop., De verse tomaten zijn
// lekker en goedkoop., Op de markt koop ik twee uien en drie tomaten., Pinnen. En de rest is voor jou., Zit de fooi er al
// bij?, Goedemorgen, wie is er aan de beurt?, De ober brengt het eten naar de tafel., complimenten aan de kok),
// _site/dialogues (in-het-restaurant: de biefstuk, op-het-terras: Pinnen jullie of contant?), 02 - Grammar/presens,
// de vs het, open vs gesloten lettergreep, 00 - Sounds/eindklank verhardt (snijd sounds like snijt).
// New rules: none (pres, dehet and woord exist). New props: none (nummer and water).
// `wrong` on five word items is the same noun with the wrong article, so those forks also test de/het.
// Replay from levels 5 and 6: de kaas, de aanbieding.
// Left out on purpose, because the level's distractor pool would make them ambiguous: de kip (de kipfilet is here),
// de vis (de haring is here), de slagerij (de slager also means the shop), een ons (honderd is here, 100 grams could
// pass for it), heerlijk (too close to lekker). The two trap reads carry their own options, and w starts with the meaning.

(() => {
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(7, { deliveries: 20, items: [
    // ---- words: behind the counter
    { w: 'the steak', nl: 'de biefstuk' }, { w: 'the meatball', nl: 'de gehaktbal', wrong: 'het gehaktbal' },
    { w: 'the bacon', nl: 'het spek', wrong: 'de spek' }, { w: 'the ham', nl: 'de ham' },
    { w: '300 grams', nl: 'drie ons' }, { w: '250 grams', nl: 'een half pond' },
    { w: 'the special offer', nl: 'de aanbieding' },
    // ---- words: cooking it at home
    { w: 'the oven', nl: 'de oven' }, { w: 'the air fryer', nl: 'de airfryer' }, { w: 'the cook', nl: 'de kok' },
    // ---- words: the market
    { w: 'the fruit', nl: 'het fruit', wrong: 'de fruit' }, { w: 'the tomatoes', nl: 'de tomaten' },
    { w: 'the herring', nl: 'de haring' }, { w: 'the cheese', nl: 'de kaas' }, { w: 'fresh', nl: 'vers' },
    // ---- words: the bill
    { w: 'the bill', nl: 'de rekening', wrong: 'het rekening' }, { w: 'the change (money back)', nl: 'het wisselgeld', wrong: 'de wisselgeld' },
    { w: 'the half', nl: 'de helft' }, { w: 'in cash', nl: 'contant' },

    // ---- reads: the counter, the market stall, the bill
    { read: true, nl: 'U bent aan de beurt.', en: "It's your turn." },
    { read: true, nl: 'De rekening, alstublieft.', en: 'The bill, please.' },
    { read: true, nl: 'Alleen contant.', en: 'Cash only.', o: ['Cash only.', 'Card only.', 'Exact change only.'], a: 0, r: 'woord',
      w: 'Cash only. contant is cash. Paying by card is pinnen.' },
    { read: true, nl: 'Twee euro per stuk.', en: 'Two euros each.', o: ['Two euros each.', 'Two euros a kilo.', 'Two for one euro.'], a: 0, r: 'woord',
      w: 'Two euros each. per stuk is per piece. By weight the sign says per kilo.' },
    { read: true, nl: 'De rest is voor u.', en: 'Keep the change.', o: ['Keep the change.', 'You pay the rest.', 'The rest is for later.'], a: 0, r: 'woord',
      w: 'Keep the change. You say it when you pay cash, and the rest becomes the tip.' },

    // ---- listens: a price by ear, and the oe, ei and uu sounds
    { listen: true, nl: 'vierentachtig', en: '84' }, { listen: true, nl: 'de aardbeien', en: 'the strawberries' },
    { listen: true, nl: 'de groente', en: 'the vegetables' }, { listen: true, nl: 'duur', en: 'expensive' },

    // ---- looks: two prices in the window, the harbour behind the market
    { look: true, prop: 'nummer', value: 45, nl: 'vijfenveertig', en: '45' }, { look: true, prop: 'nummer', value: 75, nl: 'vijfenzeventig', en: '75' },
    { look: true, prop: 'water', nl: 'het water', en: 'the water' },

    // ---- builds: one fork each
    { en: "I'll have the steak.", parts: ['Ik', FK(['neem', 'neemt', 'nemen'], 0, 'pres', 'ik takes the bare stem: neem, with ee to keep the sound long.'), 'de biefstuk.'] },
    { en: 'The butcher cuts the meat.', parts: ['De slager', FK(['snijdt', 'snijd', 'snijt'], 0, 'pres', 'hij takes stem plus t, and the stem is snijd: snijdt. You hear one t, you write dt.'), 'het vlees.'] },
    { en: 'The waiter brings the food.', parts: ['De ober brengt', FK(['het', 'de'], 0, 'dehet', 'A verb used as a noun is a het-word: eten, het eten.'), 'eten.'] },
    { en: 'Everyone pays €12,50.', parts: ['Iedereen', FK(['betaalt', 'betalen', 'betaal'], 0, 'pres', 'iedereen counts as one person, like hij: stem plus t, betaalt.'), 'twaalf euro vijftig.'] },
    { en: "I'll leave a tip.", parts: ['Ik', FK(['geef', 'geeft', 'geev'], 0, 'pres', 'ik takes the bare stem, and a v at the end turns into f: geven, ik geef.'), 'een fooi.'] },
  ] });
})();
