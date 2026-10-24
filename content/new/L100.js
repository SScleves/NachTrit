// Nachtrit, Groningen (tier 10, B1): level 100 De winkels. The Grote Markt under the grey Martinitoren, the market stalls,
// the supermarket and the bookshop for the students, the second-hand shop, the chemist and the bike mender by the canal,
// with a student behind every counter. Prices, sizes, discounts, returns, complaints and the deposit on the bottle.
// New at tier 10 and drilled here: opinions and arguments (ik vind dat, wat vind je van, volgens mij, hoewel with the verb
// at the end, ondanks with a noun), zullen for probability (het pinapparaat zal wel kapot zijn), separable verbs in
// sub-clauses (omdat de buren langskomen, dat de winkel dichtgaat, hoewel de bakker opengaat), diminutives and their
// het-article (het tasje, bonnetje, ringetje) and the adjective -e in all cases (een warm jasje, een dikke trui, verse
// appels, vers brood, dit goedkope merk).
// Review: comparatives (goedkoper), zou for a polite request, the perfectum (gekocht), the sub-clause and V2 after it.
// Still inside the fence: 16 words max, no passive with worden, no plusquamperfectum, no indirect speech.
// Sources: dutch-lessons vault, 03 - Verbs/vinden, zullen; 02 - Grammar/bijzin - werkwoord naar het einde, scheidbare
// werkwoorden, de vs het, V2 word order; _site/situations/opinions (Ik vind, Volgens mij, Wat vind je van),
// _site/situations/supermarket (Kan ik pinnen, Is dit in de aanbieding); MOC Voegwoorden;
// content/towns.js for Groningen (de Martinitoren, d'Olle Grieze, de Grote Markt, de student). The gas earthquakes are left out on purpose.
// New rules: mening, tegenstelling, vermoeden, verkleinwoord (defined below; the others exist already).
// New props: none. Only winkel, fiets and hond are used (not boom, deur or lamp; those words are not in the word pool).
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 100, act: 10, name: 'De winkels', town: 'groningen', place: 'winkels', theme: 'shops', ...P,
    intro: 'In Groningen the shops open at nine and the students get up at eleven. The mist changed the language. It left the student discount alone.',
    introNl: 'In Groningen gaan de winkels om negen uur open en de studenten staan om elf uur op. De mist heeft de taal veranderd. De studentenkorting liet hij met rust.',
    mission: {
      where: 'The Grote Markt and the streets around it, from the market stalls under the grey Martinitoren past the supermarket, the bookshop, the second-hand shop and the chemist, to the bike mender by the canal. Bikes are piled on every bridge. Behind every counter stands a student, and every student has a discount.',
      carry: "A shopping list from Paola, a student card that is not yours, two dogs tied to a bike rack, and the grammar book, still never opened. No helmet. d'Olle Grieze looks down and says nothing.",
      want: 'Since the mist the dead stand behind every counter and give their opinion in sentences with a hoewel, an ondanks and a volgens mij. They guess with zal wel, they close the shop with the verb at the very end, and every little word with -je is het. They still split the bill. The women are still taller than you. Groningen only says: could be worse.' },
    items: [
      // ---- builds: opinions, hoewel and ondanks
      { en: 'I think the price is too high.', parts: ['Ik vind dat de prijs', FK(['te hoog is', 'is te hoog', 'is hoog te'], 0, 'bijzin',
        'dat sends the verb to the end of its clause: dat de prijs te hoog is.'), '.'] },
      { en: 'What do you think of the new jacket?', parts: ['Wat vind je', FK(['van', 'over'], 0, 'mening',
        'vinden goes with van when you ask for an opinion: wat vind je van ...?'), 'de', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'jas is a de-word, so after de the adjective takes -e: de nieuwe jas.'), 'jas', '?'] },
      { en: 'In my opinion the baker is closed on Mondays.', parts: ['Volgens mij', FK(['is de bakker', 'de bakker is'], 0, 'v2',
        'Volgens mij fills the first slot, so the verb comes next: volgens mij is de bakker.'), 'op maandag dicht.'] },
      { en: 'Although the jumper is expensive, I buy it anyway.', parts: ['Hoewel de trui', FK(['duur is', 'is duur'], 0, 'bijzin',
        'hoewel sends the verb to the end: hoewel de trui duur is.'), ',', FK(['koop ik', 'ik koop'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: koop ik.'), 'hem toch.'] },
      { en: 'Despite the rain there is a long queue at the market.', parts: [FK(['Ondanks de regen', 'Ondanks het regent', 'Ondanks regent het'], 0, 'hoewel',
        'ondanks takes a noun, not a clause: ondanks de regen.'), 'staat er een', FK(['lange', 'lang'], 0, 'adj',
        'rij is a de-word, so after een it takes -e: een lange rij.'), 'rij op de markt.'] },

      // ---- builds: separable verbs inside sub-clauses
      { en: 'Although the baker only opens at seven, there is already a queue.', parts: ['Hoewel de bakker pas om zeven uur', FK(['opengaat', 'gaat open'], 0, 'sep',
        'In a sub-clause the separable verb joins up again at the end: opengaat.'), ',', FK(['staat er', 'er staat'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: staat er.'), 'al een rij.'] },
      { en: 'I buy two loaves because the neighbours are coming by tomorrow.', parts: ['Ik koop twee broden, omdat de buren morgen', FK(['langskomen', 'komen langs', 'komen lang'], 0, 'sep',
        'omdat sends the verb to the end, and the separable verb joins up: langskomen.'), '.'] },
      { en: 'I think the shop closes too early.', parts: ['Ik vind dat de winkel te vroeg', FK(['dichtgaat', 'gaat dicht'], 0, 'sep',
        'dat sends the verb to the end, and dicht joins it again: dichtgaat.'), '.'] },

      // ---- builds: zullen for a guess
      { en: 'The card machine is probably broken.', parts: ['Het pinapparaat', FK(['zal', 'zullen', 'zult'], 0, 'zullen',
        'zullen plus wel is a guess: it will be broken, so probably. One machine, so zal.'), 'wel kapot zijn.'] },
      { en: 'The students are probably in the second-hand shop.', parts: ['De studenten', FK(['zullen', 'zal'], 0, 'zullen',
        'A guess with wel takes zullen, and the plural students need zullen: zullen wel.'), 'wel in de kringloopwinkel zijn.'] },

      // ---- builds: diminutives and their article
      { en: 'May I have a receipt, please?', parts: ['Mag ik een', FK(['bonnetje', 'bonetje', 'bonnentje'], 0, 'verklein',
        'After a short vowel the consonant doubles and the ending is -etje: bon, bonnetje.'), ', alstublieft?'] },
      { en: 'The little bag costs ten cents.', parts: [FK(['Het', 'De'], 0, 'dehet',
        'Every word ending in -je is het, even for a de-word like tas: het tasje.'), 'tasje kost tien cent.'] },
      { en: 'I bought a little ring for Paola.', parts: ['Ik heb een', FK(['ringetje', 'ringje', 'ringtje'], 0, 'verklein',
        'After -ng the diminutive ends in -etje: ring, ringetje.'), 'voor Paola', FK(['gekocht', 'gekoopt'], 0, 'perf',
        'kopen is irregular: gekocht.'), '.'] },

      // ---- builds: the adjective -e in all cases
      { en: 'I am looking for a warm little jacket and a thick jumper.', parts: ['Ik zoek een', FK(['warm', 'warme'], 0, 'adj',
        'jasje is a het-word, and after een it takes no -e: een warm jasje.'), 'jasje en een', FK(['dikke', 'dik'], 0, 'adj',
        'trui is a de-word, so after een it takes -e: een dikke trui.'), 'trui.'] },
      { en: 'Do you have fresh apples and fresh bread?', parts: ['Heeft u', FK(['verse', 'vers'], 0, 'adj',
        'A plural without an article takes -e: verse appels.'), 'appels en', FK(['vers', 'verse'], 0, 'adj',
        'brood is a het-word, and with no article it takes no -e: vers brood.'), 'brood?'] },
      { en: 'Unfortunately this cheap brand is sold out.', parts: ['Dit', FK(['goedkope', 'goedkoop'], 0, 'adj',
        'After dit, dat, het and de the adjective takes -e, even for a het-word like merk: dit goedkope merk.'), 'merk is helaas uitverkocht.'] },

      // ---- builds: review of earlier tiers
      { en: 'On the Grote Markt the cheese is cheaper than in the supermarket.', parts: ['Op de Grote Markt is de kaas', FK(['goedkoper', 'goedkoop', 'meer goedkoop'], 0, 'vergelijk',
        'Add -er to the adjective for a comparative: goedkoop, goedkoper, then dan.'), 'dan in de supermarkt.'] },
      { en: 'Could I get my money back?', parts: ['Zou ik mijn geld terug', FK(['kunnen krijgen', 'kan krijgen', 'te kunnen krijgen'], 0, 'zou',
        'zou makes the request polite and the other verbs stay in the infinitive at the end: kunnen krijgen.'), '?'] },

      // ---- words: students, the market, paying, returns and the bag, plus a few replayed
      { w: 'the student discount', nl: 'de studentenkorting' }, { w: 'the second-hand shop', nl: 'de kringloopwinkel' },
      { w: 'the bookshop', nl: 'de boekhandel' }, { w: 'the bike mender', nl: 'de fietsenmaker' },
      { w: 'the shelf in a shop', nl: 'het schap', wrong: 'de schap' }, { w: 'the spiced breakfast cake', nl: 'de ontbijtkoek' },
      { w: 'the Groningen minced-pork sausage', nl: 'de metworst' }, { w: 'the medicine', nl: 'het medicijn', wrong: 'de medicijn' },
      { w: 'the painkiller', nl: 'de pijnstiller' }, { w: 'the deposit on a bottle', nl: 'het statiegeld', wrong: 'de statiegeld' },
      { w: 'the proof of purchase', nl: 'het aankoopbewijs', wrong: 'de aankoopbewijs' }, { w: 'the little shopping list', nl: 'het boodschappenlijstje', wrong: 'de boodschappenlijstje' },
      { w: 'the clearance sale', nl: 'de uitverkoop' }, { w: 'the zip', nl: 'de rits' }, { w: 'the customer service', nl: 'de klantenservice' },
      { w: 'the cash machine', nl: 'de geldautomaat' }, { w: 'the till', nl: 'de kassa' },
      { w: 'the discount', nl: 'de korting' }, { w: 'the complaint', nl: 'de klacht' },
      { w: 'the change you get back', nl: 'het wisselgeld', wrong: 'de wisselgeld' },

      // ---- reads: three traps with their own options, two plain lines
      { read: true, nl: 'De bakker zal wel dicht zijn.', o: ['The baker is probably closed.', 'The baker is going to close soon.', 'The baker has to close.'], a: 0, r: 'zullen',
        w: 'zal wel is a guess: probably. Going to close soon would be gaat zo dicht.' },
      { read: true, nl: 'Ondanks de korting kost de jas nog honderd euro.', o: ['Even with the discount the jacket still costs a hundred euros.', 'Because of the discount the jacket costs a hundred euros.', 'The discount on the jacket is a hundred euros.'], a: 0, r: 'hoewel',
        w: 'ondanks = despite, and nog = still. Because of would be door or vanwege.' },
      { read: true, nl: 'Ik vind het jammer dat de winkel zo vroeg dichtgaat.', o: ['I think it is a shame that the shop closes so early.', 'I think it is a shame that the shop opens so early.', 'I think the shop is closing for good.'], a: 0, r: 'mening',
        w: 'ik vind het jammer dat = I think it is a shame that, and dichtgaat = closes. Opens would be opengaat.' },
      { read: true, nl: 'Hoewel het regent, is de markt vol.', en: 'Although it is raining, the market is full.' },
      { read: true, nl: 'Dit jasje is mij te klein, maar de rits is nog goed.', en: 'This little jacket is too small for me, but the zip is still fine.' },

      // ---- listens: the square, a price and a sale by ear
      { listen: true, nl: 'de Grote Markt', en: 'the main square' }, { listen: true, nl: 'negen euro negenennegentig', en: '€ 9,99' },
      { listen: true, nl: 'de boodschappen', en: 'the groceries' },

      // ---- looks: the shop, the bike on the bridge, the dog tied to the rack
      { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

      // ---- de of het
      { dehet: true, nl: 'koekje', art: 'het', en: 'the little biscuit', w: 'het koekje. Every -je word is het, even if the plain word is de.' },
      { dehet: true, nl: 'afrekening', art: 'de', en: 'the final bill', w: 'de afrekening. Nouns made with the ending -ing, like afrekening, are de.' },
    ] }]);
})();
