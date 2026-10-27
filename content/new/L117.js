// Nachtrit, Nijmegen (tier 12, B1 to B2): level 117 Eten en drinken. The Waalkade at night, a row of terraces along the river
// under the lit arch of the Waalbrug, then up to the Grote Markt, a brown café in the Benedenstad and a chip stall on the corner.
// Ordering, the bill, the soup, the bitterballen, the Vierdaagse week when the whole quay is one long party.
// New at tier 12 and drilled here: modal particles at the table (Doe mij maar, Neem er nog maar een, Probeer ... eens, ik haal hem
// wel even, hoor at the end of a warning); food idioms (geen kaas van gegeten, mosterd na de maaltijd, water bij de wijn doen,
// andere koek, een fluitje van een cent in a read); compound nouns (de erwtensoep with the -en- of 1995, het bierviltje, het
// wijnglas); the formal register of the waiter (Wat mag het zijn, Bent u klaar om te bestellen, Zou u ons de rekening willen
// brengen); the Vierdaagse and its week of parties.
// Review: V2 after a fronted phrase, the passive with worden, the plusquamperfectum, indirect speech with of, om ... te, zou plus
// infinitive, the superlative, the adjective -e (het bruine café, Gelderse rookworst), 't kofschip, quantitative er.
// Still inside the fence: 16 words max, nothing from tier 13 (no builds with three forks, no prices to calculate).
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar, V2 word order, 't kofschip, de vs het; _site/situations/
// pub (Doe mij maar een biertje van de tap, Proost), restaurant (Is alles naar wens, Wat kunt u aanraden, Zitten daar noten in,
// Kunnen we apart betalen); level 109 for the replayed words (de ober, de fooi, het terras, de menukaart, de reservering);
// content/towns.js for Nijmegen (de Waal, de Waalbrug, de Vierdaagse, de wandelaar, het feest, the joke that the walkers ask
// where the party is). Friet, not patat: Nijmegen lies just south of the Waal.
// New rules: idioom, samen, formeel (guarded, same text in every Nijmegen and Amsterdam file). omte, er, zou, plusq, indirect and
// vergelijk are guarded copies of the existing definitions; the rest are in data.js and levels.js.
// New props: none. Only hond, brug and lamp are used (no word, read or listen item here is a bridge or a lamp).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was + participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 117, act: 12, name: 'Eten en drinken', town: 'nijmegen', place: 'eten', theme: 'square', ...P,
    intro: 'During the Vierdaagse the dead walk fifty kilometres a day. Then they ask where the party is, and they still split the bill.',
    introNl: 'Tijdens de Vierdaagse lopen de doden vijftig kilometer per dag. Daarna vragen ze waar het feest is, en de rekening delen ze nog steeds.',
    mission: {
      where: 'The Waalkade at night, a row of terraces along the river with the Waalbrug lit up above them, then up to the Grote Markt, a brown café in the Benedenstad and a chip stall on the corner. In July the whole quay is one long party, and the walkers arrive with blisters and an appetite.',
      carry: 'Two leads, a stack of beer mats, a bill split to the cent with the neighbours, a cone of friet with mayonnaise, because south of the Waal it is friet, and the grammar book, still never opened. No helmet. The waiter does not ask.',
      want: 'Since the mist the dead fill every terrace, and they order the old way: Doe mij maar een biertje van de tap. The waiter still says u, the menu is one long compound noun, erwtensoep, kaasplank, bierviltje, and the old sayings come free with the bill: daar heb ik geen kaas van gegeten. Paola, still taller than you, says the bitterballen on the Waalkade are the best in the country. Maastricht says otherwise, about everything.' },
    items: [
      // ---- builds: ordering with particles
      { en: "I'll have a draught beer.", parts: [FK(['Doe mij maar', 'Doe maar mij'], 0, 'soft',
        'The fixed way to order: doe mij maar. The pronoun comes first, then maar.'), 'een biertje van de tap.'] },
      { en: 'Have another one, my treat.', parts: [FK(['Neem er nog maar een', 'Neem nog maar een er'], 0, 'er',
        'er stands for the beer you mean and comes early, right after the verb: neem er nog maar een. It does not go at the end.'), ', ik trakteer.'] },
      { en: 'Try the smoked sausage, it is really good here.', parts: ['Probeer de rookworst', FK(['eens', 'een'], 0, 'soft',
        'eens makes it a friendly suggestion: probeer eens. een is only the article a.'), ', die is hier echt goed.'] },
      { en: "The bill? Stay seated, I'll get it.", parts: ['De rekening? Blijf zitten, ik', FK(['haal hem wel even', 'haal wel even hem'], 0, 'soft',
        'A small pronoun like hem comes before the particles: ik haal hem wel even.'), '.'] },
      { en: 'Careful, the soup is hot.', parts: ['Pas op, de soep is heet,', FK(['hoor', 'maar'], 0, 'soft',
        'hoor at the end of a statement makes a warning friendly. maar cannot end a sentence.'), '.'] },

      // ---- builds: the waiter's formal register
      { en: 'Good evening, what will it be?', parts: ['Goedenavond, wat', FK(['mag', 'mogen'], 0, 'formeel',
        'The waiter asks wat mag het zijn? het is singular, so mag.'), 'het zijn?'] },
      { en: 'Are you ready to order?', parts: [FK(['Bent u', 'Is u'], 0, 'formeel',
        'u takes bent, just like jij: bent u. is belongs to hij and zij.'), 'klaar', FK(['om te bestellen', 'te bestellen om'], 0, 'omte',
        'om comes first and te goes right before the verb: om te bestellen.'), '?'] },
      { en: 'Could you bring us the bill?', parts: [FK(['Zou u', 'Zouden u'], 0, 'zou',
        'u takes the singular verb: zou u. zouden is for wij, jullie and zij.'), 'ons de rekening', FK(['willen brengen', 'wil brengen', 'te brengen'], 0, 'zou',
        'zou takes infinitives at the end, without te: zou u ... willen brengen.'), '?'] },

      // ---- builds: food idioms
      { en: 'I know nothing about wine.', parts: ['Van wijn', FK(['heb ik', 'ik heb'], 0, 'v2',
        'Van wijn fills slot 1, so the verb comes second: heb ik.'), FK(['geen kaas', 'geen brood', 'geen vlees'], 0, 'idioom',
        'ergens geen kaas van gegeten hebben means to know nothing about it. Only kaas works in this saying.'), 'gegeten.'] },
      { en: 'Saying sorry only now is too little, too late.', parts: ['Nu pas sorry zeggen is', FK(['mosterd', 'mayonaise', 'ketchup'], 0, 'idioom',
        'mosterd na de maaltijd is help that comes when it is no longer needed. The saying only knows mustard.'), 'na de maaltijd.'] },
      { en: 'We both gave a little: we split the bill.', parts: ['We hebben allebei', FK(['water bij de wijn', 'wijn bij het water', 'water bij het bier'], 0, 'idioom',
        'water bij de wijn doen means to meet each other halfway. The words of the saying are fixed.'), 'gedaan: we delen de rekening.'] },
      { en: 'Ordinary sausage is nice, but smoked sausage from Gelderland is another story.', parts: ['Gewone worst is lekker, maar', FK(['Gelderse', 'Gelders'], 0, 'adj',
        'rookworst is a de-word, so the adjective takes -e: Gelderse rookworst.'), 'rookworst is', FK(['andere koek', 'ander brood', 'andere taart'], 0, 'idioom',
        'Dat is andere koek: that is something else entirely. Only koek works in this saying.'), '.'] },

      // ---- builds: compound nouns
      { en: 'The pea soup in the brown café is the best in town.', parts: ['De', FK(['erwtensoep', 'erwtesoep', 'erwtsoep'], 0, 'samen',
        'Since the spelling of 1995 the glue is -en- here: erwtensoep, like pannenkoek.'), 'in het', FK(['bruine', 'bruin'], 0, 'adj',
        'After het the adjective takes -e: het bruine café.'), 'café is de beste van de stad.'] },
      { en: 'The beer mat is under the wine glass.', parts: [FK(['Het', 'De'], 0, 'samen',
        'A compound takes the article of its last part, and het viltje is het: het bierviltje.'), 'bierviltje ligt onder', FK(['het', 'de'], 0, 'samen',
        'wijn + glas: glas is het, so het wijnglas.'), 'wijnglas.'] },

      // ---- builds: the Vierdaagse
      { en: 'After fifty kilometres the walkers still want to go to the party.', parts: ['Na', FK(['vijftig', 'vijftien'], 0, 'getal',
        'Fifty is vijftig, with -tig for the tens. vijftien is 15.'), 'kilometer', FK(['willen de wandelaars', 'de wandelaars willen'], 0, 'v2',
        'Na vijftig kilometer fills slot 1, so the verb comes second: willen de wandelaars.'), 'nog steeds naar het feest.'] },
      { en: 'In the week of the Vierdaagse there is a party in town every evening.', parts: ['In de week van de Vierdaagse', FK(['is er', 'er is'], 0, 'v2',
        'The time phrase fills slot 1, so the verb comes second and er follows it: is er.'), 'elke avond feest in de stad.'] },

      // ---- builds: review of earlier tiers
      { en: 'On the Waalkade the bitterballen are fried fresh.', parts: ['Op de Waalkade', FK(['worden de bitterballen', 'de bitterballen worden'], 0, 'v2',
        'Op de Waalkade fills slot 1, so the verb comes second: worden de bitterballen.'), 'vers', FK(['gefrituurd', 'gefrituurt', 'gefrituren'], 0, 'kof',
        'frituur ends in r, not a ketchup letter, so -d: gefrituurd. With worden it is the passive.'), '.'] },
      { en: 'We had booked a table, but nobody had written it down.', parts: ['We', FK(['hadden', 'waren'], 0, 'plusq',
        'reserveren takes hebben, so the plusquamperfectum is hadden plus the participle.'), 'een tafel', FK(['gereserveerd', 'gereserveert'], 0, 'kof',
        'reserveer ends in r, so -d: gereserveerd.'), ', maar niemand had het opgeschreven.'] },
      { en: 'Paola asked whether there were nuts in the sauce.', parts: ['Paola vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'er noten', FK(['in de saus zaten', 'zaten in de saus'], 0, 'bijzin',
        'of sends the verb to the very end: in de saus zaten.'), '.'] },
      { en: 'According to Nijmegen the bitterballen on the Waalkade are the tastiest in the country.', parts: ['Volgens Nijmegen', FK(['zijn de bitterballen', 'de bitterballen zijn'], 0, 'v2',
        'Volgens Nijmegen fills slot 1, so the verb comes second.'), 'aan de Waalkade', FK(['de lekkerste', 'de lekkerst', 'de lekkerder'], 0, 'vergelijk',
        'After de the superlative takes -e: de lekkerste. lekkerder is the comparative.'), 'van het land.'] },

      // ---- words: the menu, the café, the quay, five replayed from Maastricht
      { w: 'the bitterbal (a fried ragout ball)', nl: 'de bitterbal' }, { w: 'the beer mat', nl: 'het bierviltje', wrong: 'de bierviltje' },
      { w: 'the smoked sausage', nl: 'de rookworst' }, { w: 'the pea soup', nl: 'de erwtensoep' },
      { w: 'the cheese board', nl: 'de kaasplank' }, { w: 'the wine glass', nl: 'het wijnglas', wrong: 'de wijnglas' },
      { w: 'the dish of the day', nl: 'de dagschotel' }, { w: 'the regular customer', nl: 'de stamgast' },
      { w: 'the brown café (an old pub with dark wood)', nl: 'het bruine café', wrong: 'de bruine café' }, { w: 'the chip stall', nl: 'de frietkraam' },
      { w: 'the sunset', nl: 'de zonsondergang' }, { w: 'the quay along the Waal', nl: 'de Waalkade' },
      { w: 'the mustard', nl: 'de mosterd' }, { w: 'the waiter', nl: 'de ober' },
      { w: 'the tip', nl: 'de fooi' }, { w: 'the terrace', nl: 'het terras', wrong: 'de terras' },
      { w: 'the menu card', nl: 'de menukaart' }, { w: 'the reservation', nl: 'de reservering' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Vijftig kilometer lopen? Een fluitje van een cent.', o: ['Walking fifty kilometres? Easy.', 'Walking fifty kilometres? It costs one cent.', 'Walking fifty kilometres? Bring a whistle.'], a: 0, r: 'idioom',
        w: 'een fluitje van een cent is a fixed phrase for something very easy. Nobody pays anything.' },
      { read: true, nl: 'Lekker, hè? Neem er gerust nog een.', o: ['Tasty, right? Feel free to have another.', 'Tasty, right? You have had enough now.', 'Is it tasty? Have one later.'], a: 0, r: 'soft',
        w: 'hè asks you to agree, and gerust means feel free. Nobody says enough.' },
      { read: true, nl: 'Wij verzoeken u vriendelijk niet op het terras te roken.', o: ['We kindly ask you not to smoke on the terrace.', 'We kindly ask you to smoke only on the terrace.', 'Smoking on the terrace is allowed after ten.'], a: 0, r: 'formeel',
        w: 'niet goes with te roken: do not smoke. verzoeken is the formal word for asking.' },
      { read: true, nl: 'De ober zei dat de keuken om negen uur al dicht was gegaan.', o: ['The waiter said the kitchen had already closed at nine.', 'The waiter said the kitchen would close at nine.', 'The waiter asked whether the kitchen closed at nine.'], a: 0, r: 'plusq',
        w: 'was gegaan is the plusquamperfectum: it had already happened. zei dat reports a statement, it does not ask.' },
      { read: true, nl: 'Onder de rivieren zeggen ze friet, en Nijmegen ligt op de zuidoever van de Waal.', en: 'Below the rivers they say friet, and Nijmegen lies on the south bank of the Waal.' },
      { read: true, nl: 'Tijdens de Vierdaagsefeesten komen er meer dan een miljoen bezoekers naar de stad.', en: 'During the Vierdaagse festival more than a million visitors come to the city.' },

      // ---- listens: the festival, a price, two things you say at the table
      { listen: true, nl: 'de Vierdaagsefeesten', en: 'the festival week of the Vierdaagse' }, { listen: true, nl: 'acht euro vijftig', en: '€ 8,50' },
      { listen: true, nl: 'eet smakelijk', en: 'enjoy your meal' }, { listen: true, nl: 'proost', en: 'cheers' },

      // ---- looks: the dog, the lit bridge over the Waal, a lamp on the quay
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'pilsje', art: 'het', en: 'the small lager', w: 'Every -je word is het: het pilsje, het biertje.' },
      { dehet: true, nl: 'koffiekopje', art: 'het', en: 'the coffee cup', w: 'The last part decides, and a -je word is always het: het koffiekopje.' },
    ] }]);
})();
