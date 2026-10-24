// Nachtrit, Urk (tier 8, B1): level 84 De winkels. The old village on its hill: the fish stall at the harbour, the bakery
// and the chemist in the alleys, the market, the card machine that is in church on Sunday, the kraplap on the rack and
// the shops that are shut on Sunday. Prices, sizes, change, returns, complaints and the Saturday queue.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and voordat
// (including modal and participle clusters; separable verbs in a sub-clause wait for tier 10), want
// keeping V2 against omdat, and the main clause after a sub-clause starting with its verb (neem ik, wacht ik, ging mijn opa).
// Review: comparatives and superlatives (verser, de beste), zou for polite requests, reflexive voelen, the adjective -e,
// the perfectum with zijn and hebben (gegaan, gekocht), the imperfectum after toen.
// Still inside the fence: 14 words max, no relative clauses, no te plus infinitive, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, scheidbare werkwoorden,
// zachtmakers - wel even maar, reflexieve werkwoorden, perfectum, imperfectum; _site/situations/supermarket (Kan ik pinnen,
// Is dit in de aanbieding, Mag ik er nog een bij, Wilt u een tasje erbij), MOC Voegwoorden;
// content/towns.js for Urk (de visafslag, de kraplap, de klederdracht, de zondagsrust, de kotter, de vissersvloot,
// Op zondag vaart hier niemand uit, the Sunday joke).
// New rules: none (bijzin, v2, sep, zou, vergelijk, refl, adj, perf, aux, kof, neg, cult, woord, getal are all defined).
// New props: none. Only hond, kerk and winkel are used (not boom, deur or lamp; de kerk and de winkel are not in the word pool).
(() => {
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 84, act: 8, name: 'De winkels', town: 'urk', place: 'winkels', theme: 'shops', ...P,
    intro: 'The shops on Urk are shut on Sunday. The mist did not change that. It only made the queue on Saturday longer.',
    introNl: 'De winkels op Urk zijn op zondag dicht. De mist heeft daar niets aan veranderd. Alleen de rij op zaterdag is langer geworden.',
    mission: {
      where: 'The narrow alleys of old Urk, from the fish stall at the harbour past the bakery, the chemist and the market, up to the white lighthouse where nothing is open anyway. The grey IJsselmeer is the shop window behind you.',
      carry: 'A shopping list for the neighbours with fish on it, cash because the card machine is in church, two dogs, and the grammar book, still never opened. No helmet. The seagulls have opinions about that.',
      want: 'Since the mist the dead stand behind every counter in their Sunday clothes and speak in sentences with a because, an if and a while. In those the verb runs to the end, and the main clause after them starts with its verb. They still split the bill to the cent, the women at the till are still taller than you, and the dogs still need a walk.' },
    items: [
      // ---- builds: sub-clauses, the verb at the end
      { en: 'The shops are closed because it is Sunday.', parts: ['De winkels zijn dicht', FK(['omdat het zondag is', 'omdat het is zondag', 'omdat is het zondag'], 0, 'bijzin',
        'omdat sends every verb to the end of its clause: omdat het zondag is.'), '.'] },
      { en: 'The baker is not open, because he is in church.', parts: ['De bakker is niet open,', FK(['want hij is in de kerk', 'want hij in de kerk is', 'want is hij in de kerk'], 0, 'v2',
        'want is not a sub-clause word. It keeps the normal order, with the verb second: want hij is.'), '.'] },
      { en: 'I see that the checkout is closed.', parts: ['Ik zie dat de kassa', FK(['dicht is', 'is dicht', 'dicht zijn'], 0, 'bijzin',
        'dat sends the verb to the end: dat de kassa dicht is. One checkout, so is.'), '.'] },
      { en: 'If it is on offer, I take two.', parts: ['Als het in de aanbieding', FK(['is', 'is het', 'zijn'], 0, 'bijzin',
        'als sends the verb to the end of its clause: in de aanbieding is.'), ',', FK(['neem ik', 'ik neem', 'ik nemen'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: neem ik.'), 'twee.'] },
      { en: 'When I got to the chemist, it was already closed.', parts: ['Toen ik bij de apotheek', FK(['kwam', 'komde', 'kwamen'], 0, 'bijzin',
        'toen sends the verb to the end, and komen is irregular in the past: ik kwam.'), ', was ze al dicht.'] },
      { en: 'While Paola pays, I wait outside with the dogs.', parts: [FK(['Terwijl Paola betaalt', 'Terwijl betaalt Paola'], 0, 'bijzin',
        'terwijl sends the verb to the end: terwijl Paola betaalt.'), ',', FK(['wacht ik', 'ik wacht'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: wacht ik.'), 'buiten met de honden.'] },
      { en: 'Before we go to the shop, we have to walk the dogs.', parts: ['Voordat we naar de winkel', FK(['gaan', 'gaan we', 'gaat'], 0, 'bijzin',
        'voordat sends the verb to the end: voordat we gaan. Plural we, so gaan.'), ',', FK(['moeten we', 'we moeten'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: moeten we.'), 'de honden uitlaten.'] },
      { en: 'I hope I can still find the receipt.', parts: ['Ik hoop dat ik de kassabon nog', FK(['kan vinden', 'kan gevonden', 'vindt kan'], 0, 'bijzin',
        'dat sends all the verbs to the end, the modal first: kan vinden.'), '.'] },
      { en: 'The herring is sold out, because the tourists bought everything.', parts: ['De haring is op, omdat de toeristen alles', FK(['hebben gekocht', 'hebben gekoopt', 'hebben gekopen'], 0, 'perf',
        'kopen is irregular: gekocht. In the sub-clause hebben stands before the participle at the very end.'), '.'] },
      { en: 'I see that the fish is fresher here than in the supermarket.', parts: ['Ik zie dat de vis op Urk', FK(['verser', 'versder', 'versere'], 0, 'vergelijk',
        'vers gets -er for the comparative: verser. After is the adjective takes no -e, so not versere.'), 'is dan in de supermarkt.'] },
      { en: 'This is the best herring on Urk because the cutters are moored close by.', parts: ['Dit is de', FK(['beste', 'best', 'goedste'], 0, 'vergelijk',
        'goed is irregular: goed, beter, best. After de the superlative takes -e: de beste.'), 'haring van Urk, omdat de kotters vlakbij', FK(['liggen', 'ligt'], 0, 'bijzin',
        'omdat sends the verb to the end, and the plural kotters takes liggen.'), '.'] },
      { en: 'I want to return this jumper because it is too small.', parts: ['Ik wil deze trui', FK(['terugbrengen', 'brengen terug', 'teruggebracht'], 0, 'sep',
        'After wil the infinitive stays in one piece at the end: wil terugbrengen.'), ', omdat hij', FK(['te klein is', 'is te klein'], 0, 'bijzin',
        'omdat sends the verb to the end: omdat hij te klein is.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'Could you wrap this up for me?', parts: ['Zou u dit voor me', FK(['kunnen inpakken', 'kan inpakken', 'kunnen ingepakt'], 0, 'zou',
        'zou makes the request polite and the other verbs stay as infinitives at the end: kunnen inpakken.'), '?'] },
      { en: 'I did not feel well, so I went to the chemist.', parts: ['Ik voelde', FK(['me', 'zich', 'ik'], 0, 'refl',
        'With ik the reflexive pronoun is me: ik voelde me.'), 'niet lekker, dus ik ging naar de apotheek.'] },
      { en: 'When I was small, my grandfather went to the fish auction every day.', parts: ['Toen ik klein', FK(['was', 'ben', 'waren'], 0, 'bijzin',
        'toen sends the verb to the end, and a past story needs the past: was.'), ',', FK(['ging mijn opa', 'mijn opa ging'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: ging mijn opa.'), 'elke dag naar de visafslag.'] },
      { en: 'At the bakery I buy a big loaf and two tasty biscuits.', parts: ['Bij de bakker koop ik een', FK(['groot', 'grote'], 0, 'adj',
        'After een a het-word has no -e: een groot brood.'), 'brood en twee', FK(['lekkere', 'lekker'], 0, 'adj',
        'A plural noun takes -e: twee lekkere koekjes.'), 'koekjes.'] },
      { en: 'Paola went to the shop with the dogs.', parts: ['Paola', FK(['is', 'heeft'], 0, 'aux',
        'Going to a place takes zijn: Paola is gegaan.'), 'met de honden naar de winkel', FK(['gegaan', 'gegaand', 'gegaat'], 0, 'perf',
        'gaan is irregular and has its own participle: gegaan.'), '.'] },

      // ---- words: shops, paying and things in the bag, plus a few from Urk and a few replayed
      { w: 'the fish stall', nl: 'de viskraam' }, { w: 'the breastcloth of the dress', nl: 'de kraplap' }, { w: 'the wallet', nl: 'de portemonnee' },
      { w: 'the loose coins', nl: 'het kleingeld', wrong: 'de kleingeld' }, { w: 'the debit card', nl: 'de pinpas' },
      { w: 'the shopping trolley', nl: 'de winkelwagen' }, { w: 'the gift voucher', nl: 'de cadeaubon' },
      { w: 'the brand', nl: 'het merk', wrong: 'de merk' }, { w: 'the price tag', nl: 'het prijskaartje' },
      { w: 'the packaging', nl: 'de verpakking' }, { w: 'the sell-by date', nl: 'de houdbaarheidsdatum' },
      { w: 'the prescription', nl: 'het recept', wrong: 'de recept' }, { w: 'the plaster', nl: 'de pleister' },
      { w: 'the pound (500 grams)', nl: 'het pond', wrong: 'de pond' }, { w: 'the warranty', nl: 'de garantie' },
      { w: 'late-night shopping', nl: 'de koopavond' }, { w: 'to haggle', nl: 'afdingen' },
      { w: 'the change you get back', nl: 'het wisselgeld', wrong: 'de wisselgeld' }, { w: 'the discount', nl: 'de korting' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'Als de winkel dicht is, kom ik morgen terug.', o: ['If the shop is closed, I will come back tomorrow.', 'Because the shop is closed, I came back yesterday.', 'When the shop opens, I will come back tomorrow.'], a: 0, r: 'bijzin',
        w: 'als = if, dicht is = is closed at the end, and kom ik terug = I come back. Because would be omdat.' },
      { read: true, nl: 'Ik heb geen pinpas, maar ik heb wel contant geld.', o: ['I have no card, but I do have cash.', 'I have no card, because I have no cash.', 'I have a card, but I have no cash.'], a: 0, r: 'neg',
        w: 'geen pinpas = no card, maar = but, wel = I do have. Because would be omdat or want.' },
      { read: true, nl: 'Voordat de winkel opengaat, staat er al een rij.', o: ['Before the shop opens, there is already a queue.', 'After the shop opens, there is a queue again.', 'The shop has opened and the queue has gone.'], a: 0, r: 'bijzin',
        w: 'voordat = before, and opengaat joins up at the end. After would be nadat.' },
      { read: true, nl: 'Heeft u dit ook in een andere maat?', en: 'Do you have this in another size too?' },
      { read: true, nl: 'Op Urk is op zondag niets open.', en: 'On Sunday nothing is open on Urk.' },
      { read: true, nl: 'Ik wil mijn geld terug, want het werkt niet.', en: 'I want my money back, because it does not work.' },

      // ---- listens: a fish auction, a price, the chemist and the Sunday rest
      { listen: true, nl: 'de visafslag', en: 'the fish auction' }, { listen: true, nl: 'twaalf euro vijftig', en: 'twelve euros fifty' },
      { listen: true, nl: 'de apotheek', en: 'the pharmacy' }, { listen: true, nl: 'de zondagsrust', en: 'the Sunday rest' },

      // ---- looks: the dog at the door, the church where the card machine is, the shop that is shut
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' },

      // ---- de of het
      { dehet: true, nl: 'visserij', art: 'de', en: 'the fishing industry', w: 'de visserij. Words ending in -erij are always de.' },
      { dehet: true, nl: 'assortiment', art: 'het', en: 'the range of goods' },
    ] }]);
})();
