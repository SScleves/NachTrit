// Nachtrit, Groningen (tier 10, B1): level 101 Eten en drinken. The Grote Markt at night under the grey Martinitoren,
// the student cafés in the narrow streets around it, a snack bar by the canal, a market stall packing up its potatoes,
// a restaurant where the mustard soup is nearly ready. Ordering, the bill, splitting it, the mustard soup and the metworst,
// and students who make one small beer last three hours.
// New at tier 10 and drilled here: opinions with ik vind dat and volgens mij (dat sends the verb to the end, volgens mij
// fills slot 1), the concession with hoewel (a whole clause, then the main clause starts with its verb) against ondanks
// (a noun), zullen for probability (zal wel, zullen wel, plus the infinitive at the end), separable verbs inside
// sub-clauses (omdat de pinautomaat steeds uitvalt, dat de ober de wijn te laat inschenkt), diminutives and their
// het-article and spelling (het tafeltje, kommetje with the doubled m), and the adjective -e in all its cells (een warm
// broodje, het koude bier, ons nieuwe restaurant, geen verse vis, iets kouds, mijn favoriete gerecht, de Groningse soep).
// Review of earlier tiers: comparatives (lekkerder dan), zou plus infinitive (Zou u ons de rekening kunnen brengen),
// the perfectum with zijn and 't kofschip (zijn we uit eten gegaan, gesplitst, gemaakt), V2 after a fronted phrase,
// the bill words of levels 77, 85 and 93 (de rekening, de fooi, het bonnetje, het hoofdgerecht).
// Still inside the fence: 16 words max; no passive, no plusquamperfectum, no indirect speech.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, scheidbare werkwoorden,
// de vs het (diminutives are het), futurum - gaan + infinitief; _site/grammar/zullen-belofte-waarschijnlijkheid,
// het-adjectief-de-e-regel-adjectives; _site/situations/opinions (Wat vind je van, Hoe vind je, Ik vind, Volgens mij),
// restaurant (Mag ik de rekening, Kunnen we apart betalen, Is alles naar wens), pub (Doe mij maar een biertje van de tap,
// Nog een rondje, Mogen we afrekenen), takeaway (Bestelling voor Santi); _site/sentences/ik-vind-dat-we-vaker-op-vakantie-
// moeten-gaan; _site/words (hoewel, de mening, Hij zal wel ziek zijn, Dat zal wel kloppen, op je gezondheid, afrekenen,
// inschenken, het hondje, het restaurant); content/towns.js for Groningen (de Martinitoren, de Grote Markt,
// Moi., Stad, Er gaat niets boven Groningen; the gas, quake and rumour jokes are left out on purpose).
// New rules: mening, hoewel, verkl (defined below with the vault notes that explain them).
// New props: none. Only fiets, brug and deur are used (no word item is de fiets, de brug or de deur).
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 101, act: 10, name: 'Eten en drinken', town: 'groningen', place: 'eten', theme: 'square', ...P,
    intro: 'In Groningen everyone eats mustard soup and nobody finds that strange. The dead have an opinion about it, then split the bill.',
    introNl: 'In Groningen eet iedereen mosterdsoep en niemand vindt dat vreemd. De doden hebben er een mening over en splitsen dan de rekening.',
    mission: {
      where: 'The Grote Markt at night, under the grey Martinitoren, then the student cafés in the narrow streets around it, a snack bar on the canal, a market stall packing up its potatoes and a restaurant where the mustard soup is nearly ready. It has been nearly ready since nine.',
      carry: 'Two leads, a wallet with exact change, a paper bag of Groninger koek going soft, and the grammar book, never opened. No helmet. The bikes are piled three deep on every bridge and nobody has ever found theirs.',
      want: 'Since the mist the dead have opinions about the food, and in Groningen an opinion needs an argument. Ik vind dat and hoewel send the verb all the way to the end, ondanks only wants a noun. The women are still taller than you, the students at the next table still have not paid for the first round, and the dogs always need a walk afterwards.' },
    items: [
      // ---- builds: opinions, with dat and with volgens mij
      { en: 'I think the soup is too salty.', parts: ['Ik vind', FK(['dat de soep te zout is', 'dat de soep is te zout'], 0, 'mening',
        'vind dat opens a sub-clause, so is goes to the very end: dat de soep te zout is.'), '.'] },
      { en: 'In my opinion the metworst is tastier than the Groninger koek.', parts: ['Volgens mij is de metworst', FK(['lekkerder', 'lekker', 'lekkerste'], 0, 'vergelijk',
        'dan asks for the -er form: lekkerder dan.'), 'dan de Groninger koek.'] },
      { en: 'I think they made the metworst themselves.', parts: ['Volgens mij', FK(['hebben ze', 'ze hebben'], 0, 'v2',
        'Volgens mij fills slot 1, so the verb comes second: hebben ze.'), 'de metworst zelf', FK(['gemaakt', 'gemaakd', 'gemaken'], 0, 'kof',
        'maak ends in k, a ketchup letter: gemaakt with a t.'), '.'] },
      { en: 'What do you think of the dessert?', parts: ['Wat vind je', FK(['van', 'over'], 0, 'mening',
        'Opinions use van: wat vind je van het nagerecht.'), 'het nagerecht?'] },

      // ---- builds: hoewel against ondanks
      { en: 'Although the kitchen is closed, we still get soup.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel',
        'hoewel opens a whole clause with its own verb. ondanks would need a noun.'), 'de keuken dicht is,', FK(['krijgen we', 'we krijgen'], 0, 'bijzin',
        'After a sub-clause the main clause starts with its verb: krijgen we.'), 'nog soep.'] },
      { en: 'Despite the rain we sit outside on the terrace.', parts: [FK(['Ondanks', 'Hoewel'], 0, 'hoewel',
        'ondanks goes with a noun: ondanks de regen. hoewel needs a clause with a verb.'), 'de regen', FK(['zitten we', 'we zitten'], 0, 'v2',
        'The opening phrase fills slot 1, so the verb comes second: zitten we.'), 'buiten op het terras.'] },

      // ---- builds: separable verbs inside sub-clauses
      { en: 'I think the waiter pours the wine too late.', parts: ['Ik vind dat de ober de wijn te laat', FK(['inschenkt', 'schenkt in', 'inschenk'], 0, 'sep',
        'Inside a dat-clause the separable verb stays in one piece at the end: inschenkt.'), '.'] },
      { en: 'We order a dessert while the waiter clears the table.', parts: ['We bestellen een toetje terwijl de ober de tafel', FK(['afruimt', 'ruimt af'], 0, 'sep',
        'After terwijl the verb goes to the end, and a separable verb stays whole: afruimt.'), '.'] },
      { en: 'I pay cash because the card machine keeps failing.', parts: ['Ik betaal contant omdat de pinautomaat steeds', FK(['uitvalt', 'valt uit', 'uit valt'], 0, 'sep',
        'omdat sends the verb to the end, and uitvallen stays in one piece there: uitvalt.'), '.'] },

      // ---- builds: zullen for probability
      { en: 'The kitchen is probably closed already.', parts: ['De keuken', FK(['zal wel', 'zullen wel', 'wel zal'], 0, 'fut',
        'One kitchen, so zal. wel turns it into a guess: it is probably closed.'), 'al dicht zijn.'] },
      { en: 'It will probably be busy on the Grote Markt on Friday night.', parts: ['Het', FK(['zal', 'zullen'], 0, 'fut',
        'Het is singular, so zal.'), 'vrijdagavond wel druk', FK(['zijn', 'is'], 0, 'fut',
        'zal sends the second verb to the end as an infinitive: zijn.'), 'op de Grote Markt.'] },

      // ---- builds: diminutives, het and the spelling
      { en: 'Is that little glass still clean?', parts: ['Is', FK(['dat', 'die'], 0, 'dehet',
        'glaasje ends in -je, so it is a het-word: dat glaasje.'), 'glaasje nog schoon?'] },
      { en: 'May I have a small bowl of soup, please?', parts: ['Mag ik een', FK(['kommetje', 'komje', 'komtje'], 0, 'verklein',
        'A short vowel before m doubles the m and takes -etje: kommetje.'), 'soep, alstublieft?'] },

      // ---- builds: the adjective -e in all its cells
      { en: 'I will take a warm roll and the cold beer.', parts: ['Ik neem een', FK(['warm', 'warme'], 0, 'adj',
        'broodje is a het-word and een comes before it, so no -e: een warm broodje.'), 'broodje en het', FK(['koude', 'koud'], 0, 'adj',
        'After het the -e comes back: het koude bier.'), 'bier.'] },
      { en: 'The soup is hot, but I want something cold.', parts: ['De soep is', FK(['heet', 'hete'], 0, 'adj',
        'After the noun, with is, the adjective stays bare: de soep is heet.'), ', maar ik wil iets', FK(['kouds', 'koude'], 0, 'adj',
        'After iets the adjective takes -s: iets kouds.'), '.'] },
      { en: 'Our new restaurant has no fresh fish today.', parts: ['Ons', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'After ons the -e comes back, even for a het-word: ons nieuwe restaurant.'), 'restaurant heeft vandaag geen', FK(['verse', 'vers'], 0, 'adj',
        'vis is a de-word, so the adjective takes -e: geen verse vis.'), 'vis.'] },
      { en: 'My favourite dish is the Groningen mustard soup.', parts: ['Mijn', FK(['favoriete', 'favoriet'], 0, 'adj',
        'After mijn the -e comes back, even for a het-word: mijn favoriete gerecht.'), 'gerecht is de', FK(['Groningse', 'Gronings'], 0, 'adj',
        'After de the adjective always takes -e: de Groningse mosterdsoep.'), 'mosterdsoep.'] },

      // ---- builds: review of earlier tiers
      { en: 'Could you bring us the bill?', parts: ['Zou u ons de rekening', FK(['kunnen brengen', 'kunt brengen', 'te kunnen brengen'], 0, 'zou',
        'zou makes the request polite and is followed by an infinitive, not a second finite verb: kunnen brengen.'), '?'] },
      { en: 'Last night we went out for dinner and split the bill.', parts: ['Gisteravond', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Gisteravond fills slot 1, so the verb comes second: zijn we.'), 'uit eten gegaan en hebben we de rekening', FK(['gesplitst', 'gesplitsd'], 0, 'kof',
        'splits ends in s, a ketchup letter: gesplitst with a t.'), '.'] },

      // ---- words: the menu, the bar, the market, the bill
      { w: 'the mustard soup (Groningen speciality)', nl: 'de mosterdsoep' }, { w: 'the spiced sausage', nl: 'de metworst' },
      { w: 'the Groningen spiced cake', nl: 'de Groninger koek' }, { w: 'the small lager', nl: 'het pilsje', wrong: 'de pilsje' },
      { w: 'the pub', nl: 'de kroeg' }, { w: 'the beer tap', nl: 'de tap' },
      { w: 'the small table', nl: 'het tafeltje', wrong: 'de tafeltje' }, { w: 'the snack platter', nl: 'de borrelplank' },
      { w: 'the main course', nl: 'het hoofdgerecht', wrong: 'de hoofdgerecht' }, { w: 'the dessert', nl: 'het nagerecht', wrong: 'de nagerecht' },
      { w: 'the bill', nl: 'de rekening' }, { w: 'the tip', nl: 'de fooi' },
      { w: 'the receipt', nl: 'het bonnetje', wrong: 'de bonnetje' }, { w: 'the delivery driver', nl: 'de bezorger' },
      { w: 'the order', nl: 'de bestelling' }, { w: 'the greengrocer', nl: 'de groenteboer' },
      { w: 'the potato', nl: 'de aardappel' }, { w: 'the cook', nl: 'de kok' }, { w: 'the kitchen', nl: 'de keuken' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'Ondanks de drukte kregen we meteen een tafel.', o: ['Despite the crowd we got a table at once.', 'Because of the crowd we got a table at once.', 'After the crowd left we got a table.'], a: 0, r: 'hoewel',
        w: 'ondanks means despite and takes a noun. Because of would be door de drukte.' },
      { read: true, nl: 'De bezorger zal wel in de file staan.', o: ['The delivery driver is probably stuck in traffic.', 'The delivery driver will wait in line later.', 'The delivery driver has to stand in the queue.'], a: 0, r: 'fut',
        w: 'zal wel is a guess about now: he is probably stuck in traffic. It is not a promise or a plan.' },
      { read: true, nl: 'Volgens mij heeft de kok de soep al opgewarmd.', o: ['I think the cook has already warmed up the soup.', 'The cook says he will warm up the soup soon.', 'I asked the cook to warm up the soup.'], a: 0, r: 'perf',
        w: 'heeft ... opgewarmd is the finished past, and al means already. Volgens mij only gives the opinion.' },
      { read: true, nl: 'Hoewel de bediening traag was, gaf Paola toch fooi.', en: 'Although the service was slow, Paola tipped anyway.' },
      { read: true, nl: 'De studenten bestellen één biertje en blijven drie uur zitten.', en: 'The students order one small beer and stay seated for three hours.' },
      { read: true, nl: 'Kunnen we apart betalen, of splitsen we de rekening gewoon?', en: 'Can we pay separately, or do we simply split the bill?' },

      // ---- listens: a snack, a price, a toast
      { listen: true, nl: 'de bitterballen', en: 'the bitterballen' }, { listen: true, nl: 'zevenendertig euro tachtig', en: '€ 37,80' },
      { listen: true, nl: 'op je gezondheid', en: 'to your health' },

      // ---- looks: the bikes on the bridge, the door of the café
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'broodje', art: 'het', en: 'the roll', w: 'het broodje. A diminutive ending in -je is always het.' },
      { dehet: true, nl: 'café', art: 'het', en: 'the café', w: 'het café. Borrowed words in -é are mostly het.' },
    ] }]);
})();
