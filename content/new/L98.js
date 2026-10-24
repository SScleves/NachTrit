// Nachtrit, Texel (tier 9, B1): level 98 Het eiland, the town's own place. The island itself: the TESO ferry from Den Helder
// to 't Horntje, sheep and lambs on every dyke, rental bikes in the dunes, the Wadden Sea and the North Sea, the red lighthouse
// at De Cocksdorp, seals, gulls and sandbars, a Skuumkoppe in the pub, oysters, sheep cheese, and weather from every direction.
// Miss the last ferry and you live here now.
// New at tier 9 and drilled here: relative clauses with die and dat (het schaap dat op de dijk staat, de veerboot die om negen
// uur vertrekt, with the verb last inside the clause); te plus infinitive and om ... te (geen tijd om ... te kijken, om zeehonden
// te zien, uit te laten with te between prefix and verb); conditionals with als ... dan and with was/zouden (Als het regent, dan
// blijven we ...; Als ik hier woonde, zou ik ...; Zou je ... willen vasthouden); er as place and quantity (zijn er, ik heb er
// drie, omdat er veel zand ligt); pronominal adverbs (ernaar, er ... aan, er ... mee). Review: the perfectum with zijn and
// irregular participle (gevaren), V2 after a time word, the adjective without -e after is, the imperfectum was.
// Still inside the fence: 14 words max, no opinions with hoewel or ondanks, no zullen for probability, no passive, no diminutive
// drills beyond the dehet item.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat (de-word die, het-word dat, verb to the end of the clause), bijzin -
// werkwoord naar het einde, modale werkwoorden (bare infinitive after a modal, te elsewhere), scheidbare werkwoorden,
// zachtmakers - wel even maar (zou), V2 word order, perfectum, de vs het; _site/words (het eiland, het schip, het weer, slecht
// weer, koud, nat, het regent vandaag, Er ligt een bootje bij de rots, zonder hen op te bellen, de hond, de vis);
// MOC Het weer, MOC Voegwoorden; content/towns.js for Texel (de veerboot, de overtocht, het schaap, het lam, de schapenboet,
// de duinen, de vuurtoren, de zeehond, Hoe laat vertrekt de laatste boot terug, Een Skuumkoppe graag, the last-ferry joke,
// the sheep know rumour).
// New rules: omte, alsdan and pronadv, defined and guarded below. diedat, bijzin, adj, aux, perf, sep, v2, zou and er exist.
// New props: none. Only hond, kerk and boom are used (not water, fiets or huis: de Waddenzee, de huurfiets and de schapenboet
// are in the word pool and could be taken for the prop).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.alsdan = window.RULES.alsdan || { name: 'Conditions: als ... dan, was, zouden', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erop, ermee, ernaar', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.zou = window.RULES.zou || { name: 'zou + infinitive: polite requests', note: 'zachtmakers - wel even maar' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 98, act: 9, name: 'Het eiland', town: 'texel', place: 'eigen', theme: 'dyke', ...P,
    intro: 'The mist came and everyone who spoke Dutch changed. On Texel nobody could tell, because the sheep were already staring at you.',
    introNl: 'De mist kwam en iedereen die Nederlands sprak veranderde. Op Texel merkte niemand het, want de schapen staarden je toch al aan.',
    mission: {
      where: 'The island of Texel, from the ferry quay at \'t Horntje along the dyke roads and through the dunes to the red lighthouse at De Cocksdorp, the Wadden Sea on one side and the North Sea on the other. Wind from every direction, sheep in every field, a rental bike for every tourist who is no longer there. Miss the last ferry and you live here now.',
      carry: 'Two dogs who have never met a sheep up close and are about to, a dozen oysters split to the cent with the neighbours, a rental bike with a brand new bell, and the grammar book, still never opened. No helmet. The wind has opinions about that.',
      want: 'The dead of Texel talk in long clauses and park the verb at the very end: het schaap dat op de dijk staat. They use om ... te, als ... dan, and little words like ernaar and ermee so they do not have to repeat the thing. The women are still taller than you. The sheep are not, but they look at you as if they were. The sheep know. They are not talking.' },
    items: [
      // ---- builds: relative clauses with die and dat, verb last inside the clause
      { en: 'The sheep that stands on the dyke is looking at me.', parts: ['Het schaap', FK(['dat op de dijk staat', 'die op de dijk staat', 'dat op staat de dijk'], 0, 'diedat',
        'schaap is a het-word, so dat. Inside the clause the verb goes last: dat op de dijk staat.'), ', kijkt naar mij.'] },
      { en: 'The ferry that leaves at nine is already full.', parts: ['De veerboot', FK(['die om negen uur vertrekt', 'dat om negen uur vertrekt', 'die om vertrekt negen uur'], 0, 'diedat',
        'veerboot is a de-word, so die, and vertrekt goes to the end of its clause.'), ', is al vol.'] },
      { en: 'The lamb that stands by the gate is still small.', parts: ['Het lam', FK(['dat bij het hek staat', 'die bij het hek staat'], 0, 'diedat',
        'lam is a het-word: dat. The verb staat closes the clause.'), ', is nog', FK(['klein', 'kleine'], 0, 'adj',
        'After is the adjective stays bare: is klein. The -e only comes before a noun.'), '.'] },
      { en: 'The seal that I saw yesterday was very big.', parts: ['De zeehond', FK(['die ik gisteren zag', 'dat ik gisteren zag', 'die gisteren zag ik'], 0, 'diedat',
        'zeehond is a de-word: die. The verb zag goes last in the clause: die ik gisteren zag.'), ', was heel groot.'] },

      // ---- builds: te plus infinitive, om ... te
      { en: 'I have no time to look at seals.', parts: ['Ik heb geen tijd', FK(['om naar zeehonden te kijken', 'om te naar zeehonden kijken', 'naar zeehonden te om kijken'], 0, 'omte',
        'om opens the clause and te sits right before the infinitive at the very end: om naar zeehonden te kijken.'), '.'] },
      { en: 'We cycle to the beach to see seals.', parts: ['We fietsen naar het strand', FK(['om zeehonden te zien', 'om te zeehonden zien', 'om zeehonden zien'], 0, 'omte',
        'Purpose takes om ... te, and te stands directly in front of zien: om zeehonden te zien.'), '.'] },
      { en: 'I forgot to walk the dogs.', parts: ['Ik ben vergeten de honden', FK(['uit te laten', 'uitte laten', 'te uitlaten'], 0, 'sep',
        'With a separable verb the te goes between the prefix and the verb: uit te laten. The dogs always need a walk.'), '.'] },

      // ---- builds: conditions with als ... dan, was and zouden, polite zou
      { en: 'If it rains, we stay in the pub.', parts: ['Als het regent,', FK(['dan blijven we', 'dan we blijven', 'blijven dan we'], 0, 'alsdan',
        'After an als-clause the main verb comes first: dan blijven we, never dan we blijven.'), 'in de kroeg.'] },
      { en: 'If the ferry were not full, we would be home by now.', parts: ['Als de veerboot niet vol', FK(['was, zouden we', 'waren, zouden we', 'was, we zouden'], 0, 'alsdan',
        'An imagined situation uses was in the als-clause, and zouden comes first in the main clause: was, zouden we.'), 'nu thuis zijn.'] },
      { en: 'If I lived here, I would buy a sheep.', parts: ['Als ik hier', FK(['woonde, zou ik', 'woonden, zou ik', 'woonde, ik zou'], 0, 'alsdan',
        'ik woonde with -de, and after the als-clause zou comes before ik: woonde, zou ik.'), 'een schaap kopen.'] },
      { en: 'Would you hold my bike for a moment?', parts: ['Zou je', FK(['mijn fiets even willen vasthouden', 'mijn fiets even te willen vasthouden', 'even willen mijn fiets vasthouden'], 0, 'zou',
        'zou is the polite opener, and willen vasthouden stands at the end with no te.'), '?'] },

      // ---- builds: er as place and quantity
      { en: 'On Texel there are more sheep than people.', parts: ['Op Texel', FK(['zijn er', 'er zijn', 'is er'], 0, 'er',
        'Op Texel takes slot 1, so the verb comes second: zijn er. Plural schapen, so zijn.'), 'meer schapen dan mensen.'] },
      { en: 'How many lambs? I have seen three.', parts: ['Hoeveel lammetjes? Ik heb', FK(['er drie', 'drie er'], 0, 'er',
        'er stands for the lambs you counted: ik heb er drie gezien.'), 'gezien.'] },
      { en: 'I cycle slowly because there is a lot of sand on the road.', parts: ['Ik fiets langzaam omdat', FK(['er veel zand op de weg ligt', 'er ligt veel zand op de weg', 'ligt er veel zand op de weg'], 0, 'bijzin',
        'omdat sends the verb to the end, and er stays in front: omdat er veel zand op de weg ligt.'), '.'] },

      // ---- builds: pronominal adverbs
      { en: 'The ferry is waiting and the dog is looking at it.', parts: ['De veerboot ligt klaar en de hond kijkt', FK(['ernaar', 'naar het', 'naar er'], 0, 'pronadv',
        'For a thing, er and the preposition become one word: ernaar, not naar het.'), '.'] },
      { en: 'Do you have a helmet on? No, I do not think about it.', parts: ['Heb je een helm op? Nee, ik denk', FK(['er niet aan', 'niet aan er', 'aan het niet'], 0, 'pronadv',
        'denken aan, and it turns into er in front of aan: ik denk er niet aan.'), '.'] },
      { en: 'I have a new bell. I am very happy with it.', parts: ['Ik heb een nieuwe bel. Ik ben', FK(['er erg blij mee', 'erg blij met het', 'met er erg blij'], 0, 'pronadv',
        'blij zijn met, and it turns into er with mee at the end: er erg blij mee.'), '.'] },

      // ---- build: review of the perfectum and V2
      { en: 'Yesterday we took the ferry to Texel.', parts: ['Gisteren', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second, then we.'), 'met de veerboot naar Texel', FK(['gevaren', 'gevaard', 'gevaarn'], 0, 'perf',
        'varen is irregular and takes zijn when it goes to a place: we zijn gevaren.'), '.'] },

      // ---- words: the island, the animals, the weather, the food
      { w: 'the ferry', nl: 'de veerboot' }, { w: 'the crossing', nl: 'de overtocht' }, { w: 'the sheep', nl: 'het schaap', wrong: 'de schaap' },
      { w: 'the lamb', nl: 'het lam', wrong: 'de lam' }, { w: 'the seal', nl: 'de zeehond' }, { w: 'the seagull', nl: 'de meeuw' },
      { w: 'the beach', nl: 'het strand', wrong: 'de strand' }, { w: 'the island', nl: 'het eiland', wrong: 'de eiland' },
      { w: 'the Wadden Sea', nl: 'de Waddenzee' }, { w: 'the oyster', nl: 'de oester' }, { w: 'the sheep cheese', nl: 'de schapenkaas' },
      { w: 'the brewery', nl: 'de brouwerij' }, { w: 'the wind', nl: 'de wind' }, { w: 'the sand', nl: 'het zand', wrong: 'de zand' },
      { w: 'the storm', nl: 'de storm' }, { w: 'the rental bike', nl: 'de huurfiets' }, { w: 'the Texel sheep barn', nl: 'de schapenboet' },
      { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' }, { w: 'the lighthouse', nl: 'de vuurtoren' }, { w: 'the bird', nl: 'de vogel' },

      // ---- reads: five traps with their own options, one plain
      { read: true, nl: 'Als het waait, blijven we thuis.', o: ['If it blows, we stay at home.', 'Because it blows, we stay at home.', 'When it blew, we stayed at home.'], a: 0, r: 'alsdan',
        w: 'Als het waait is a condition, and the main clause starts with its verb: blijven we.' },
      { read: true, nl: 'De boot die om vijf uur vertrekt, is de laatste.', o: ['The boat that leaves at five is the last one.', 'The last boat left at five.', 'The boat leaves at five, so it is the last.'], a: 0, r: 'diedat',
        w: 'die om vijf uur vertrekt describes the boat. vertrekt is at the end of that clause.' },
      { read: true, nl: 'Ik heb geen zin om te fietsen.', o: ['I do not feel like cycling.', 'I am not allowed to cycle.', 'I have no bike to cycle on.'], a: 0, r: 'omte',
        w: 'geen zin om te: no desire. Not allowed would be mag niet.' },
      { read: true, nl: 'Hij zou graag blijven, maar de laatste boot vertrekt.', o: ['He would like to stay, but the last ferry is leaving.', 'He stayed gladly, but the last ferry left.', 'He wants to stay, so the last ferry leaves.'], a: 0, r: 'zou',
        w: 'zou graag is a wish, not a fact. maar keeps normal word order.' },
      { read: true, nl: 'Ik heb er niets mee te maken.', o: ['I have nothing to do with it.', 'I have nothing to do it with.', 'I have nothing left to make.'], a: 0, r: 'pronadv',
        w: 'iets te maken hebben met: with the thing becomes er ... mee. A fixed phrase, not a literal one.' },
      { read: true, nl: 'Mis je de laatste boot, dan woon je hier voortaan.', en: 'Miss the last ferry and you live here from now on.' },

      // ---- listens: a sunset, the last ferry, the island beer
      { listen: true, nl: 'de zonsondergang', en: 'the sunset' }, { listen: true, nl: 'de laatste boot', en: 'the last ferry' },
      { listen: true, nl: 'Een Skuumkoppe, graag.', en: 'A Skuumkoppe, please.' },

      // ---- looks: the dog, the church, a tree
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },

      // ---- de of het
      { dehet: true, nl: 'wad', art: 'het', en: 'the mudflats', w: 'het wad, the mudflats of the Waddenzee. The plural is de wadden, because every plural is de.' },
      { dehet: true, nl: 'lammetje', art: 'het', en: 'the little lamb', w: 'Every -je word is het: het lammetje, het hondje.' },
    ] }]);
})();
