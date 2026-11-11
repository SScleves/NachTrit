// Nachtrit, Texel (tier 9, B1): level 92 De winkels. From the ferry quay at 't Horntje to Den Burg and the dune village of
// De Koog: the bakery, the supermarket, the chemist, the wool shop, the market stalls with lamb and sheep cheese, the rental
// bikes outside every door and the last ferry back. Prices, sizes, bags, returns, complaints and the bill.
// New at tier 9 and drilled here: relative clauses with die and dat (de kaas die, het lam dat, alles wat, de tas waar ... in zit),
// te plus infinitive and om ... te (om verse vis te kopen, rond te kijken, zonder te betalen, no te after kunnen),
// conditionals with als ... dan and zou (had, zou ik; Mis je de laatste boot, dan woon je hier), er as quantity and as place
// (ik heb er nog vijf, er staat een schaap) and pronominal adverbs (erbij, ermee, er ... op).
// Review: comparatives and superlatives (het lekkerste), the adjective -e, zijn with komen in the perfectum, sub-clause word order.
// Still inside the fence: 14 words max, no opinions with hoewel or ondanks, no zullen for probability, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat, de vs het, modale werkwoorden, perfectum, zijn of hebben;
// 03 - Verbs/zullen (zou); _site/grammar/er-het-kleine-woord-met-veel-banen; _site/situations/supermarket (Is dit in de
// aanbieding, Wilt u een tasje erbij, Mag ik er nog een bij, Kan ik pinnen, Dat was het, dank u wel);
// _site/dialogues/bij-de-bakker; MOC Lidwoorden & voornaamwoorden; content/towns.js for Texel (het schaap, het lam, de veerboot,
// de overtocht, de vuurtoren, de zeehond, Ecomare, Miss the last ferry and you live here now, the sheep know).
// New rules: omte, cond, pronadv (added below); diedat, er, vergelijk, adj, aux, perf are existing ids.
// New props: none. Only hond, fiets and winkel are used (de fiets and de winkel are not in the word pool; no de hond either).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.cond = window.RULES.cond || { name: 'Conditionals: als ... dan, zou', note: 'zullen' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erbij, ermee, waar ... op', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 92, act: 9, name: 'De winkels', town: 'texel', place: 'winkels', theme: 'shops', ...P,
    intro: 'On Texel the shops close early, the ferry waits for nobody and the sheep have stood in the queue since the mist.',
    introNl: 'Op Texel gaan de winkels vroeg dicht, wacht de boot op niemand en staan de schapen sinds de mist al in de rij.',
    mission: {
      where: 'From the ferry quay at \'t Horntje to the shops of Den Burg and the dune village of De Koog: the baker, the supermarket, the chemist, the wool shop and the market stalls with lamb and sheep cheese. A rental bike leans on every wall. The seals at Ecomare watch from their pool, the red lighthouse watches from the north, and the sheep watch everything.',
      carry: 'A shopping list in a dead man\'s handwriting, a pannier full of coins because the card machine at the quay is still on the mainland, two dogs, and the grammar book, still never opened. No helmet. With this wind nobody can tell.',
      want: 'Since the mist the dead stand behind every counter in their island woollens and talk in sentences with a die, a dat, an om te and an if. They still split the bill to the cent, the women at the till are still taller than you, and the last ferry back leaves in an hour. Miss it and you live here now. The sheep will show you around.' },
    items: [
      // ---- builds: relative clauses with die, dat, wat and waar
      { en: 'The sheep cheese that I bought yesterday tastes like grass.', parts: ['De schapenkaas', FK(['die', 'dat'], 0, 'diedat',
        'kaas is a de-word, so the relative word is die: de kaas die. dat is for het-words.'), 'ik gisteren heb gekocht, smaakt naar gras.'] },
      { en: 'The lamb that is standing in front of the shop does not want to go inside.', parts: ['Het lam', FK(['dat', 'die'], 0, 'diedat',
        'lam is a het-word, so the relative word is dat; die is for de-words.'), 'voor de winkel staat, wil niet naar binnen.'] },
      { en: 'The bag with my wallet in it is gone.', parts: ['De tas', FK(['waar', 'die'], 0, 'pronadv',
        'For a thing with a preposition, the relative word becomes waar: waar mijn portemonnee in zit.'), 'mijn portemonnee in zit, is weg.'] },
      { en: 'I buy everything that is on offer.', parts: ['Ik koop alles', FK(['wat', 'die'], 0, 'diedat',
        'After alles, niets and iets the relative word is wat: alles wat in de aanbieding is.'), 'in de aanbieding is.'] },

      // ---- builds: te plus infinitive and om ... te
      { en: 'I am going to the market to buy fresh fish.', parts: ['Ik ga naar de markt om verse vis', FK(['te kopen', 'kopen'], 0, 'omte', 'A purpose takes om ... te, with te right before the infinitive: te kopen.'), '.'] },
      { en: 'It is fun to look around in the shop.', parts: ['Het is leuk om in de winkel', FK(['rond te kijken', 'te rondkijken', 'rond kijken te'], 0, 'omte',
        'A separable verb takes its te in the middle, between the particle and the verb: rond te kijken.'), '.'] },
      { en: 'Do not forget to take your debit card with you.', parts: ['Vergeet niet je pinpas', FK(['mee te nemen', 'te meenemen'], 0, 'omte', 'With a separable verb te goes in the middle: mee te nemen.'), '.'] },
      { en: 'He walked out of the shop without paying.', parts: ['Hij liep de winkel uit zonder', FK(['te betalen', 'om te betalen'], 0, 'omte', 'zonder takes te plus the infinitive, with no om: zonder te betalen.', 'word'), '.'] },

      // ---- builds: conditionals
      { en: 'If I had more money, I would buy the whole shop.', parts: ['Als ik meer geld had,', FK(['zou ik', 'ik zou'], 0, 'v2', 'The als-clause came first, so the main clause starts with its verb: zou ik.'), 'de hele winkel kopen.'] },
      { en: 'If the jumper does not fit, you can exchange it.', parts: ['Als de trui niet', FK(['past', 'passen', 'pas'], 0, 'cond', 'de trui is one thing, so stem plus t: past.', 'verb'), ', dan', FK(['kunt u', 'u kunt'], 0, 'v2', 'After dan the verb comes straight away, then the subject: dan kunt u.'), 'hem ruilen.'] },
      { en: 'Miss the last ferry and you live here from now on.', parts: ['Mis je de laatste boot, dan', FK(['woon je', 'woont je'], 0, 'presens', 'When je comes right after the verb, the t drops: woon je.'), 'hier voortaan.'] },

      // ---- builds: er as quantity and as place
      { en: 'Yes, I still have five of them.', parts: ['Ja, ik heb', FK(['er', 'het', 'hem'], 0, 'er',
        'er stands for the things you count: ik heb er nog vijf.'), 'nog vijf.'] },
      { en: 'There is a sheep standing in front of the shop.', parts: ['Er', FK(['staat een schaap', 'een schaap staat'], 0, 'v2', 'Er opens a main clause, so the verb comes straight after it: er staat.'), 'voor de winkel.'] },

      // ---- builds: pronominal adverbs
      { en: 'I have been waiting for it for an hour.', parts: ['Ik wacht', FK(['er', 'het', 'erop'], 0, 'pronadv',
        'wachten op a thing becomes er ... op, with er early and op at the end.'), 'al een uur op.'] },
      { en: 'The wool is soft. I am very happy with it.', parts: ['De wol is zacht. Ik ben', FK(['er', 'het'], 0, 'pronadv', 'met plus a thing becomes er ... mee: er heel blij mee.'), 'heel blij mee.'] },
      { en: 'Would you like a bag with it?', parts: ['Wilt u een tasje', FK(['erbij', 'bij het'], 0, 'pronadv', 'bij plus the thing you just bought becomes erbij.'), '?'] },

      // ---- builds: review of earlier tiers
      { en: 'This is the tastiest lamb on the island.', parts: ['Dit is het', FK(['lekkerste', 'lekkerst', 'lekkerder'], 0, 'vergelijk',
        'Before a noun the superlative takes -e: het lekkerste; lekkerder only compares two.'), 'lamsvlees van het eiland.'] },
      { en: 'I am looking for a warm duvet of Texel wool.', parts: ['Ik zoek een', FK(['warm', 'warme'], 0, 'adj',
        'dekbed is a het-word and the article is een: no -e. Een warm dekbed.'), 'dekbed van', FK(['Texelse', 'Texels'], 0, 'adj',
        'wol is a de-word with no article before it, and the adjective still takes -e: Texelse wol.'), 'wol.'] },
      { en: 'We came over on the ferry this morning.', parts: ['We', FK(['zijn', 'hebben'], 0, 'aux',
        'Coming is movement to a place, so zijn: we zijn gekomen.'), 'vanochtend met de veerboot', FK(['gekomen', 'komen', 'kwamen'], 0, 'perf', 'komen is irregular, and after zijn comes the participle: gekomen.'), '.'] },

      // ---- words: shops, paying and things in the bag, plus a few from Texel and two replayed
      { w: 'the sheep cheese', nl: 'de schapenkaas' }, { w: 'the lamb meat', nl: 'het lamsvlees', wrong: 'de lamsvlees' },
      { w: 'the wool', nl: 'de wol' }, { w: 'the pannier', nl: 'de fietstas' },
      { w: 'the little bag', nl: 'het tasje', wrong: 'de tasje' }, { w: 'the bakery', nl: 'de bakkerij' },
      { w: 'the chemist\'s shop', nl: 'de drogisterij' }, { w: 'the market stall', nl: 'de marktkraam' },
      { w: 'the shopping trolley', nl: 'de winkelwagen' }, { w: 'the size', nl: 'de maat' },
      { w: 'the carton', nl: 'het pak', wrong: 'de pak' }, { w: 'the bill', nl: 'de rekening' },
      { w: 'the checkout', nl: 'de kassa' }, { w: 'the complaint', nl: 'de klacht' },
      { w: 'the sheepskin', nl: 'het schapenvel', wrong: 'de schapenvel' },
      { w: 'the opening hours', nl: 'de openingstijden', wrong: 'het openingstijden' },
      { w: 'the discount', nl: 'de korting' }, { w: 'the change you get back', nl: 'het wisselgeld' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'Als u twee kazen koopt, krijgt u er een tasje bij.', o: ['If you buy two cheeses, you get a bag with them.', 'If you buy two bags, you get a cheese with them.', 'Because you bought two cheeses, you got a bag.'], a: 0, r: 'cond',
        w: 'als = if, koopt at the end of the clause, and krijgt u comes first in the answer. er ... bij means with it.' },
      { read: true, nl: 'Het schaap dat in de rij staat, heeft geen pinpas.', o: ['The sheep that is standing in the queue has no debit card.', 'The sheep has no debit card, so it is not standing in the queue.', 'The queue that the sheep is in has no debit card.'], a: 0, r: 'diedat',
        w: 'dat points back to het schaap, and staat waits at the end of the relative clause. The sheep is the one without a card.' },
      { read: true, nl: 'Dit pak melk is over de datum, ik ga ermee terug naar de winkel.', o: ['This carton of milk is past its date, I am taking it back to the shop.', 'This carton of milk is past its date, I am going back to the shop with her.', 'This milk is still good, so I am going to the shop for it.'], a: 0, r: 'pronadv',
        w: 'ermee is met plus the thing: with it. With a person it would be met haar.' },
      { read: true, nl: 'Wij splitsen de rekening altijd tot op de cent.', en: 'We always split the bill to the cent.' },
      { read: true, nl: 'Ik wil graag een klacht indienen.', en: 'I would like to file a complaint.' },
      { read: true, nl: 'De laatste boot gaat om half elf, daarna woont u hier.', en: 'The last ferry leaves at half past ten, after that you live here.' },

      // ---- listens: the ferry, a price, the offer of the day
      { listen: true, nl: 'de veerboot', en: 'the ferry' }, { listen: true, nl: 'drie euro vijfenzeventig', en: 'three euros seventy-five' },
      { listen: true, nl: 'de dagaanbieding', en: 'the offer of the day' },

      // ---- looks: the dog at the door, the rental bike on the wall, the shop that is shut
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' },

      // ---- de of het
      { dehet: true, nl: 'bonnetje', art: 'het', en: 'the little receipt', w: 'het bonnetje. Every -je word is het.' },
      { dehet: true, nl: 'winkelraam', art: 'het', en: 'the shop window', w: 'het winkelraam. A compound takes the article of its last part, and raam is a het-word.' },
    ] }]);
})();
