// Nachtrit, Maastricht (tier 11, B1 to B2): level 108 De winkels. The Markt with its stalls, the bakery with the vlaai,
// the Albert Heijn, the chemist and the bookshop in the old church, the Sint-Servaasbrug and the Helpoort. Paying,
// prices, sizes, returns, parcels, prescriptions, complaints, and a little Maastricht dialect on the side.
// New at tier 11 and drilled here: the passive with worden and zijn plus participle (het brood wordt gebakken, de winkel
// wordt verbouwd, de vlaai is al betaald, het pakket werd bezorgd), the plusquamperfectum with had and was (had verkocht,
// was gegaan, was aangekomen, had klaargezet), indirect speech (zei dat, vroeg of, with the verb at the end) and
// words with dialect colour, marked as such (de bomma, Noondezju) next to the southern friet.
// Review: the superlative (de beste), die for a de-word, om ... te, separable and ver-/be- participles, V2 after a sub-clause.
// Still inside the fence: 16 words max, no idioms and modal particles beyond what the earlier tiers had, no formal letters.
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, zijn of hebben, scheidbare werkwoorden, 't kofschip,
// bijzin - werkwoord naar het einde, V2 word order; _site/situations/supermarket (Kan ik pinnen, Is dit in de aanbieding,
// Wilt u een tasje erbij, Spaart u zegels, gangpad); _site/words (de apotheek, de bakker);
// content/towns.js for Maastricht (de vlaai, de bomma, Noondezju, het Vrijthof, de Helpoort, de Sint-Servaasbrug, the patat joke).
// New rules: passief, plusq, indirect (defined below; sepbz, omte and vergelijk are guarded copies of the existing ones).
// New props: none. Only brug, fiets and hond are used (not winkel, kerk or deur; shop and church words are in the word pool
// and would be right answers for those props).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'The passive: worden or zijn plus participle', note: 'worden' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had or was plus participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.sepbz = window.RULES.sepbz || { name: 'Separable verbs in sub-clauses', note: 'scheidbare werkwoorden' };
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive: om ... te', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 108, act: 11, name: 'De winkels', town: 'maastricht', place: 'winkels', theme: 'shops', ...P,
    intro: 'In Maastricht the shopkeepers wear costumes all year now, so you cannot tell who is selling and who is already dead. The vlaai is excellent either way.',
    introNl: 'In Maastricht lopen de winkeliers het hele jaar verkleed rond, dus je ziet niet wie er verkoopt en wie al dood is. De vlaai is hoe dan ook uitstekend.',
    mission: {
      where: 'The Markt and the lanes around the Vrijthof, from the market stalls past the bakery with the vlaai, the Albert Heijn, the chemist and the bookshop in the old church, down to the Sint-Servaasbrug and back up the hill. Pale yellow marl, grey stone, green shutters. Every shop is open at exactly the wrong hour.',
      carry: "Paola's shopping list, two dogs on leads, a receipt nobody can read any more, and the grammar book, still never opened. No helmet. The Helpoort has stood there since the thirteenth century and has seen worse.",
      want: 'Since the mist the dead stand behind every counter and speak in the passive: the bread is baked, the parcel was delivered, the shop is being renovated. They remember what had already happened before you arrived, with had or was and the participle at the end, and they pass on what other people said, with zei dat and the verb last. A few of them speak Maastricht dialect and call it normal. They still split the bill. The women are still taller than you. Here it is friet, not patat, and nobody has got over it.' },
    items: [
      // ---- builds: the passive with worden and zijn
      { en: 'The bread is baked fresh every morning.', parts: ['Het brood', FK(['wordt', 'word', 'worden'], 0, 'passief',
        'The passive is worden plus the participle. Het brood is one thing, so wordt.'), 'elke ochtend vers', FK(['gebakken', 'bakken', 'bakte'], 0, 'perf', 'After wordt comes the participle, and bakken is irregular: gebakken.'), '.'] },
      { en: 'At the market the apples are weighed by the kilo.', parts: ['Op de markt', FK(['worden de appels', 'de appels worden'], 0, 'v2',
        'Op de markt fills slot 1, so the verb comes second: worden de appels.'), 'per kilo', FK(['gewogen', 'wegen', 'woog'], 0, 'perf',
        'After worden comes the participle, and wegen is irregular: gewogen.'), '.'] },
      { en: 'The shop is being renovated at the moment, so it is closed.', parts: ['De winkel', FK(['wordt', 'is'], 0, 'passief',
        'Something that is going on right now takes worden: wordt verbouwd. is verbouwd would mean it is finished.'), 'op dit moment', FK(['verbouwd', 'verbouwen', 'verbouwde'], 0, 'perf', 'After wordt comes the participle, and ver- verbs take no ge: verbouwd.'), ', dus hij is dicht.'] },
      { en: 'Yesterday my parcel was not delivered.', parts: ['Gisteren', FK(['werd mijn pakket', 'mijn pakket werd'], 0, 'v2',
        'Gisteren fills slot 1, so the verb comes second: werd mijn pakket.'), 'niet', FK(['bezorgd', 'bezorgen', 'bezorgde'], 0, 'kof',
        'After werd comes the participle, and be- verbs take no ge: bezorgd.'), '.'] },
      { en: 'The vlaai has already been paid for, so you can take it with you.', parts: ['De vlaai', FK(['is', 'wordt'], 0, 'passief',
        'al says it is already done, a result, so zijn plus participle: is betaald.'), 'al', FK(['betaald', 'betalen', 'betaalde'], 0, 'perf', 'is plus participle describes the result, and be- verbs take no ge: betaald.'), ', dus u kunt hem meenemen.'] },

      // ---- builds: the plusquamperfectum with had and was
      { en: 'When I got to the baker, he had already sold all the vlaai.', parts: ['Toen ik bij de bakker kwam,', FK(['had hij', 'hij had'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: had hij.'), 'alle vlaai al', FK(['verkocht', 'verkopen', 'verkoopt'], 0, 'perf', 'had plus participle makes the pluperfect, and verkopen is irregular: verkocht.'), '.'] },
      { en: 'When I woke up, Paola had already gone to the market.', parts: ['Toen ik wakker werd,', FK(['was', 'had'], 0, 'plusq',
        'gaan is movement, so it takes zijn. In the plusquamperfectum zijn becomes was: was gegaan.'), 'Paola al naar de markt', FK(['gegaan', 'gaan', 'ging'], 0, 'perf', 'was plus participle makes the pluperfect, and gaan is irregular: gegaan.'), '.'] },
      { en: 'The pharmacist had already put the medicines ready.', parts: ['De apotheker', FK(['had', 'was'], 0, 'plusq', 'The apotheker does the putting himself, so hebben: had klaargezet.'), 'de medicijnen al', FK(['klaargezet', 'klaarzetten', 'klaarzette'], 0, 'sep', 'had plus participle makes the pluperfect, with ge in the middle: klaar-ge-zet.'), '.'] },
      { en: 'We had just arrived at the Albert Heijn when it started to rain.', parts: ['We', FK(['waren', 'hadden'], 0, 'plusq',
        'aankomen is arriving somewhere, so zijn. In the plusquamperfectum: waren aangekomen.'), 'net bij de Albert Heijn', FK(['aangekomen', 'aankomen', 'aankwamen'], 0, 'sep', 'waren plus participle makes the pluperfect, with ge in the middle: aan-ge-komen.'), ', toen het begon te regenen.'] },

      // ---- builds: indirect speech
      { en: 'The shop assistant said the jacket comes in tomorrow.', parts: ['De verkoopster zei dat de jas morgen', FK(['binnenkomt', 'komt binnen'], 0, 'sepbz', 'dat sends the verb to the end, and the separable verb joins up again: binnenkomt.'), '.'] },
      { en: 'The baker said he had no vlaai left.', parts: ['De bakker zei dat hij', FK(['geen', 'niet'], 0, 'neg',
        'geen goes with a noun that has no article: geen vlaai.'), 'vlaai', FK(['meer had', 'had meer'], 0, 'bijzin',
        'After dat the verb goes to the end of the clause: meer had.'), '.'] },
      { en: 'The cashier asked whether I wanted a bag with it.', parts: ['De kassière vroeg', FK(['of', 'dat', 'om'], 0, 'indirect', 'A reported yes-or-no question starts with of: vroeg of.', 'word'), 'ik een tasje', FK(['erbij wilde', 'wilde erbij'], 0, 'bijzin',
        'After of the verb goes to the end of the clause: erbij wilde.'), '.'] },
      { en: 'Paola said she had already thrown the receipt away.', parts: ['Paola zei', FK(['dat', 'om'], 0, 'indirect', 'zeggen reports a statement with dat.', 'word'), 'ze de bon al had', FK(['weggegooid', 'weggegooit'], 0, 'sep', 'gooi ends in i, not a ketchup letter, so the participle ends in d: weggegooid.', 'spell'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'This is the best vlaai in the whole of Maastricht.', parts: ['Dit is de', FK(['beste', 'best'], 0, 'vergelijk', 'goed is irregular, goed, beter, best, and after de it takes -e: de beste.'), 'vlaai van heel Maastricht.'] },
      { en: 'The jacket I saw yesterday is on sale now.', parts: ['De jas', FK(['die', 'dat'], 0, 'diedat',
        'jas is a de-word, so the relative pronoun is die.'), 'ik gisteren zag is nu', FK(['afgeprijsd', 'afgeprijst'], 0, 'kof', 'The stem afprijs comes from prijzen, with a z, so the participle ends in d.', 'spell'), '.'] },
      { en: 'I went to the pharmacy to pick up a prescription.', parts: ['Ik ben naar de apotheek gegaan', FK(['om', 'dat'], 0, 'omte', 'To say why you do something, use om ... te: om een recept op te halen.', 'word'), 'een recept', FK(['op te halen', 'te ophalen', 'ophalen te'], 0, 'omte',
        'With a separable verb te goes in the middle: op te halen.'), '.'] },

      // ---- words: shops, pharmacy, paying, sizes, Maastricht
      { w: 'the Limburg fruit tart', nl: 'de vlaai' }, { w: 'the bakery', nl: 'de bakkerij' }, { w: 'the pharmacy', nl: 'de apotheek' },
      { w: 'the market stall', nl: 'de marktkraam' }, { w: 'the receipt', nl: 'de kassabon' }, { w: 'the warranty', nl: 'de garantie' },
      { w: 'the size', nl: 'de maat' }, { w: 'the brand', nl: 'het merk', wrong: 'de merk' },
      { w: 'the fitting room', nl: 'het pashokje', wrong: 'de pashokje' }, { w: 'the prescription', nl: 'het recept', wrong: 'de recept' },
      { w: 'the leaflet in the medicine box', nl: 'de bijsluiter' }, { w: 'the expiry date', nl: 'de houdbaarheidsdatum' },
      { w: 'the aisle', nl: 'het gangpad', wrong: 'de gangpad' }, { w: 'the loyalty card', nl: 'de bonuskaart' },
      { w: 'the shopping trolley', nl: 'het winkelwagentje' }, { w: 'grandma (Maastricht dialect for oma)', nl: 'de bomma' },
      { w: 'the till', nl: 'de kassa' }, { w: 'the complaint', nl: 'de klacht' },
      { w: 'the change you get back', nl: 'het wisselgeld', wrong: 'de wisselgeld' }, { w: 'the discount', nl: 'de korting' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Mijn pakket wordt morgen bezorgd.', o: ['My parcel will be delivered tomorrow.', 'My parcel was delivered yesterday.', 'I am delivering my parcel tomorrow.'], a: 0, r: 'passief',
        w: 'wordt plus bezorgd is the passive: someone else delivers it. Delivered yesterday would be werd gisteren bezorgd.' },
      { read: true, nl: 'Ze vroeg of ik kon pinnen.', o: ['She asked whether I could pay by card.', 'She said I could pay by card.', 'She asked me to pay by card.'], a: 0, r: 'indirect',
        w: 'vroeg of is a reported question: asked whether. She said would be zei dat.' },
      { read: true, nl: 'We hadden de jas al gepast.', o: ['We had already tried on the jacket.', 'We were trying on the jacket.', 'We will try on the jacket soon.'], a: 0, r: 'plusq',
        w: 'hadden plus gepast is the plusquamperfectum: it was already done before something else happened.' },
      { read: true, nl: 'Noondezju, de vlaai is op.', o: ['Damn, the vlaai is all gone.', 'Hello, the vlaai is on offer.', 'Sorry, the vlaai is still in the oven.'], a: 0, r: 'cult',
        w: 'Noondezju is mild Maastricht dialect, like damn it. is op means it is all gone.' },
      { read: true, nl: 'De apotheek was al dicht toen ik aankwam.', o: ['The pharmacy was already closed when I arrived.', 'The pharmacy was still closed when I left.', 'The pharmacy closed as soon as I arrived.'], a: 0, r: 'imp',
        w: 'was al dicht is the state before I got there, and toen ik aankwam is when I arrived.' },
      { read: true, nl: 'Doe mij maar een zakje friet.', o: ['I will have a bag of fries.', 'I will have a bag of crisps.', 'I will have a bag of sweets.'], a: 0, r: 'cult',
        w: 'In Maastricht friet is the word, where many people in the Randstad say patat. Crisps would be chips.' },

      // ---- listens: a gate, a price and a sale by ear
      { listen: true, nl: 'de Helpoort', en: 'the old city gate' }, { listen: true, nl: 'negentien euro vijfennegentig', en: '€ 19,95' },
      { listen: true, nl: 'de uitverkoop', en: 'the clearance sale' }, { listen: true, nl: 'het Vrijthof', en: 'the big square' },

      // ---- looks: the bridge over the Maas, the bike, the dog
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

      // ---- de of het
      { dehet: true, nl: 'pakket', art: 'het', en: 'the parcel', w: 'het pakket. Learn it with its article, there is no rule.' },
      { dehet: true, nl: 'bestelling', art: 'de', en: 'the order', w: 'de bestelling. Nouns made with the ending -ing are de.' },
    ] }]);
})();
