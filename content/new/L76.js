// Nachtrit, Rotterdam (tier 7, A2 to B1): level 76 De winkels. The Markthal under its painted fruit, the cube houses
// beside it, the Koopgoot and the Lijnbaan, the Erasmusbrug glowing over the Maas. Supermarket, baker, pharmacy,
// market stalls, prices, sizes, paying, returns and complaints.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (bakte, betaalde, legde,
// verveelden), the common irregulars (kocht, was, had, ging, kwam, zag, bracht, moest), a separable verb in the
// imperfectum (bracht ... terug, legde ... terug), reflexive verbs (me vergist, voelde me, verveelden zich),
// zou plus infinitive for polite requests (Zou u dit kunnen inpakken, Ik zou graag ... willen) and comparatives
// and superlatives (goedkoper dan, beter, de duurste), with the irregular goed, beter.
// Review of earlier tiers: perfectum with hebben (gepast), modal plus infinitive, V2 after a place or a time,
// geen against niet, want keeping V2, softeners (wel even), the adjective -e (volle tassen, te klein).
// Still inside the fence: 12 words max, no sub-clauses with the verb at the end.
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum, reflexieve werkwoorden, 't kofschip, zachtmakers,
// modale werkwoorden, perfectum; _site/situations/supermarket (Kan ik pinnen?, Is dit in de aanbieding?,
// Wilt u een tasje erbij?, Spaart u zegels?), 04 - Phrases & Scenarios/Thuis met je vrouw; _site/words (de apotheek,
// ruilen: Ik wil deze graag ruilen, hij is toch te klein; Ik zou graag een kopje koffie willen; hebt / heeft;
// Hij voelt zich niet zo lekker; goed, beter, best; de boodschappen doen); content/towns.js for Rotterdam
// (de Markthal, de kubuswoningen, de Erasmusbrug, de Maas, Niet lullen maar poetsen).
// New rules: zou and vergr, both guarded below (imp, refl, kof, aux, perf, sep, modal, soft, neg, adj, v2 and woord
// are in data.js).
// New props: none. Only deur, brug and water are used (not winkel: de bakkerij, de apotheek, de supermarkt and
// de marktkraam are in the word pool and would be right answers for a shop front).
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 76, act: 7, name: 'De winkels', town: 'rotterdam', place: 'winkels', theme: 'shops', ...P,
    intro: 'In Rotterdam the shops open on time, the dead queue without a word, and at the checkout they still split the bill.',
    introNl: 'In Rotterdam gaan de winkels op tijd open, staan de doden zwijgend in de rij en splitten ze aan de kassa nog steeds de rekening.',
    mission: {
      where: 'From the Markthal under its painted fruit, past the cube houses, down the Koopgoot and along the Lijnbaan, to a chemist that shut at six. The Erasmusbrug glows over the Maas behind you and nobody looks at it. They are shopping.',
      carry: 'Two leads, a bag you refused at the till, a receipt you will never find again, and the grammar book, still unopened. No helmet. The trams do not queue for anyone.',
      want: 'Since the mist the dead run every shop in the city: they price, they sell, they complain, and they want their money back. Niet lullen maar poetsen, so you answer fast. The women behind the counters are still taller than you, and the dogs outside the door still need a walk.' },
    items: [
      // ---- builds: the imperfectum, regular by 't kofschip
      { en: 'The baker baked bread all night.', parts: ['De bakker', FK(['bakte', 'bakde', 'bakkede'], 0, 'imp',
        'bak ends in k, a ketchup letter, so the past takes -te: bakte.'), 'de hele nacht brood.'] },
      { en: 'The customer paid by card.', parts: ['De klant', FK(['betaalde', 'betaalte', 'betaald'], 0, 'imp',
        'betaal ends in l, no ketchup letter, so the past takes -de: betaalde.'), 'met de pinpas.'] },
      { en: 'I saw the price and put the cheese back.', parts: ['Ik', FK(['zag', 'zagt', 'gezien'], 0, 'imp',
        'zien is irregular: zag. Learn it whole.'), 'de prijs en', FK(['legde', 'legte', 'gelegd'], 0, 'kof',
        'leg ends in g, which is not a ketchup letter, so -de: legde. The terug goes to the end.'), 'de kaas terug.'] },
      { en: 'The dogs were bored in front of the shop.', parts: ['De honden', FK(['verveelden zich', 'verveelde zich', 'zich verveelden'], 0, 'refl',
        'Two dogs, plural: verveelden, then zich right after the verb. verveelde is for one dog.'), 'voor de winkel.'] },

      // ---- builds: the irregular imperfectum
      { en: 'Yesterday I bought two loaves at the baker.', parts: ['Gisteren', FK(['kocht ik', 'kopte ik', 'ik kocht'], 0, 'imp',
        'kopen is irregular: kocht, not kopte. After Gisteren the verb stays in slot 2.'), 'twee broden bij de bakker.'] },
      { en: 'The pharmacy was closed because it was Sunday.', parts: ['De apotheek', FK(['was', 'waren'], 0, 'imp',
        'One pharmacy, singular: was. waren is for more than one.'), 'dicht,', FK(['want het was zondag', 'want was het zondag', 'want het zondag was'], 0, 'v2',
        'want only joins the two halves. The verb stays second: het was zondag.'), '.'] },
      { en: 'The baker had no change yesterday.', parts: ['De bakker', FK(['had', 'hadden'], 0, 'imp',
        'One baker, singular: had. hadden is for more than one.'), 'gisteren', FK(['geen', 'niet'], 0, 'neg',
        'wisselgeld is a thing, so geen: geen wisselgeld.'), 'wisselgeld.'] },
      { en: 'I went to the Markthal and came home with full bags.', parts: ['Ik', FK(['ging', 'gaan', 'gegaan'], 0, 'imp',
        'gaan is irregular: ging. gegaan only works with ben, as in ik ben gegaan.'), 'naar de Markthal en', FK(['kwam', 'kwamen', 'komde'], 0, 'imp',
        'komen is irregular: kwam for ik. kwamen is for we.'), 'met volle tassen thuis.'] },
      { en: 'I took the coat back yesterday.', parts: ['Ik', FK(['bracht', 'brengde', 'brachtte'], 0, 'imp',
        'brengen is irregular: bracht, with no -te after it.'), 'de jas gisteren', FK(['terug', 'teruggebracht', 'terugbrengen'], 0, 'sep',
        'In the imperfectum the particle jumps to the end: bracht de jas terug.'), '.'] },
      { en: 'At the pharmacy I had to wait a long time for my medicine.', parts: ['In de apotheek', FK(['moest ik', 'ik moest', 'moeste ik'], 0, 'v2',
        'In de apotheek takes slot 1, so moest comes before ik. moest is the past of moeten.'), 'lang', FK(['wachten', 'te wachten', 'gewacht'], 0, 'modal',
        'A modal sends the other verb to the end as a plain infinitive, with no te.'), 'op mijn medicijnen.'] },

      // ---- builds: comparatives and superlatives
      { en: 'The bread is cheaper at the supermarket than at the baker.', parts: ['Het brood is', FK(['goedkoper', 'goedkoop', 'meer goedkoop'], 0, 'vergelijk',
        'Add -er for the comparative: goedkoop becomes goedkoper.'), 'in de supermarkt', FK(['dan', 'dat', 'van'], 0, 'vergelijk',
        'After a comparative the other thing follows dan: goedkoper dan.'), 'bij de bakker.'] },
      { en: 'This cheese is much better than the one from the supermarket.', parts: ['Deze kaas is veel', FK(['beter', 'gooder', 'goeder'], 0, 'vergelijk',
        'goed is irregular: goed, beter, best.'), 'dan die uit de supermarkt.'] },
      { en: 'This is the most expensive coat in the whole shop.', parts: ['Dit is de', FK(['duurste', 'duurst', 'duurder'], 0, 'vergelijk',
        'Before a noun the superlative is -st plus -e: de duurste jas.'), 'jas van de hele winkel.'] },

      // ---- builds: zou plus infinitive, polite requests
      { en: 'At the market I would like a kilo of apples.', parts: ['Op de markt', FK(['zou ik', 'ik zou'], 0, 'v2',
        'Op de markt takes slot 1, so zou comes before ik.'), 'graag een kilo appels', FK(['willen', 'wil', 'te willen'], 0, 'zou',
        'zou sends the other verb to the end as a plain infinitive: zou ... willen.'), '.'] },
      { en: 'Could you wrap this for me?', parts: [FK(['Zou u', 'Zouden u'], 0, 'zou',
        'One person, u, takes zou. zouden is for more than one.'), 'dit voor mij', FK(['kunnen inpakken', 'kan inpakken', 'kunnen ingepakt'], 0, 'modal',
        'After zou both verbs are plain infinitives, kunnen first and inpakken last. kan is for ik or hij.'), '?'] },
      { en: 'I would like to exchange this one, it is too small after all.', parts: ['Ik zou deze graag', FK(['willen ruilen', 'wil ruilen', 'te willen ruilen'], 0, 'zou',
        'zou plus the infinitive at the end: zou ... willen ruilen.'), ', hij is toch', FK(['te klein', 'te kleine', 'te kleiner'], 0, 'adj',
        'te means too and takes the plain adjective: te klein.'), '.'] },

      // ---- builds: reflexive verbs
      { en: 'Sorry, I made a mistake with the price.', parts: ['Sorry, ik heb', FK(['me', 'zich', 'je'], 0, 'refl',
        'ik goes with me, right after the verb: ik heb me vergist.'), 'in de prijs vergist.'] },
      { en: 'I did not feel well, so I went to the pharmacy.', parts: ['Ik', FK(['voelde me', 'me voelde', 'voelde zich'], 0, 'refl',
        'The self-word comes right after the verb, and ik takes me: voelde me.'), 'niet lekker, dus ik', FK(['ging', 'gingen', 'gegaan'], 0, 'imp',
        'gaan is irregular: ging for ik. gingen is for we.'), 'naar de apotheek.'] },

      // ---- builds: review of the perfectum and the softeners
      { en: 'Paola tried on three dresses in the fitting room.', parts: ['Paola', FK(['heeft', 'is'], 0, 'aux',
        'Trying on is an action, not a trip: hebben.'), 'in de paskamer drie jurken', FK(['gepast', 'gepasd', 'gepassen'], 0, 'kof',
        'pas ends in s, a ketchup letter, so gepast with a t.'), '.'] },
      { en: "I'll grab a basket for you.", parts: ['Ik pak', FK(['wel even', 'even wel'], 0, 'soft',
        'wel even is the soft pair, like Ik pak wel even een biertje voor je.'), 'een mandje voor je.'] },

      // ---- words: the shop, the stall, the till, the price (a few wrongs)
      { w: 'the bakery', nl: 'de bakkerij' }, { w: 'the bread roll', nl: 'het broodje', wrong: 'de broodje' },
      { w: 'the receipt', nl: 'de kassabon' }, { w: 'the basket', nl: 'het mandje', wrong: 'de mandje' },
      { w: 'the shopping trolley', nl: 'het winkelwagentje' }, { w: 'the price', nl: 'de prijs' },
      { w: 'the discount', nl: 'de korting' }, { w: 'the special offer', nl: 'de aanbieding' },
      { w: 'the pharmacy', nl: 'de apotheek' }, { w: 'the market stall', nl: 'de marktkraam' },
      { w: 'the size', nl: 'de maat' }, { w: 'the fitting room', nl: 'de paskamer' },
      { w: 'the complaint', nl: 'de klacht' }, { w: 'the change', nl: 'het wisselgeld', wrong: 'de wisselgeld' },
      { w: 'the fruit', nl: 'het fruit', wrong: 'de fruit' },
      // replay from the earlier shop levels
      { w: 'the supermarket', nl: 'de supermarkt' }, { w: 'the butcher', nl: 'de slager' },
      { w: 'the small bag', nl: 'het tasje', wrong: 'de tasje' },

      // ---- reads: three traps with their own options, three straight from the counter
      { read: true, nl: 'Hebt u deze ook in een grotere maat?', o: ['Do you have this in a bigger size too?', 'Do you have this in a smaller size too?', 'Do you have this in another colour too?'], a: 0, r: 'vergelijk',
        w: 'grotere is groot plus -er plus -e: bigger. Smaller would be kleinere.' },
      { read: true, nl: 'Dit is de goedkoopste, maar ook de slechtste.', o: ['This is the cheapest, but also the worst.', 'This is cheaper, but also worse.', 'This is the cheapest, but also the best.'], a: 0, r: 'vergelijk',
        w: 'de goedkoopste is the superlative: the cheapest. The plain comparative would be goedkoper.' },
      { read: true, nl: 'Ik herinner me de prijs niet meer.', o: ['I no longer remember the price.', 'I am not paying the price.', 'I did not see the price.'], a: 0, r: 'refl',
        w: 'zich herinneren is to remember: ik herinner me. niet meer means no longer.' },
      { read: true, nl: 'Ik kocht dit vorige week, maar het werkt niet.', en: 'I bought this last week, but it does not work.' },
      { read: true, nl: 'Betaalt u contant of met de pinpas?', en: 'Are you paying cash or by card?' },
      { read: true, nl: 'Hebt u de bon nog?', en: 'Do you still have the receipt?' },

      // ---- listens: a landmark, a comparative, a price
      { listen: true, nl: 'de markthal', en: 'the market hall' }, { listen: true, nl: 'goedkoper', en: 'cheaper' },
      { listen: true, nl: 'zeventien euro vijftig', en: '€ 17,50' },

      // ---- looks: the shop door, the bridge, the water
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },

      // ---- de of het
      { dehet: true, nl: 'recept', art: 'het', en: 'the prescription', w: 'het recept. The plural is de recepten, because every plural is de.' },
      { dehet: true, nl: 'verpakking', art: 'de', en: 'the packaging', w: 'Words ending in -ing are de: de verpakking.' },
    ] }]);
})();
