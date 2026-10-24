// Nachtrit, Texel (tier 9, B1): level 91 Thuis. A low brick house with a thatched sheep barn behind it, somewhere
// between Den Burg and the dunes, the red lighthouse blinking in the north. Rooms, furniture, the family, the daily
// routine, the dogs, the wife, the sheep, all told in clauses that explain which one, why and what if.
// New at tier 9 and drilled here: relative clauses with die (de-words, plurals) and dat (het-words) with the verb at
// the end (De hond die op de bank slaapt, Het schaap dat achter de schapenboet staat), te plus infinitive and om ... te
// (om de zeehonden te zien, om de honden uit te laten, zin om ... te gaan), conditionals with als ... dan and zou
// (Als ik tijd had, zou ik ... lopen; Als je de boot mist, dan woon je hier), er as a place and as a quantity
// (ik ben er twee keer geweest, ik zie er wel honderd, Er zijn meer schapen dan mensen) and pronominal adverbs
// (erop, er ... over). Review: sub-clauses after voordat and omdat, V2 after a sub-clause, zou plus kunnen for polite
// requests, superlatives, perfectum with zijn and an irregular participle, the replay of three words from L83.
// Still inside the fence: 14 words max, no opinions with hoewel or ondanks, no separable verb finite inside a
// sub-clause (that is tier 10), no passive, no diminutive drill, no indirect speech.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat, bijzin - werkwoord naar het einde, V2 word order,
// modale werkwoorden, 03 - Verbs/zullen (zou), uitlaten; _site/grammar/er-het-kleine-woord-met-veel-banen-the-little-word
// (er as place, er as quantity); _site/sentences (heb je zin om ... te, ik verheug me erop, sterkte ermee, het huis dat
// te koop staat); 04 - Phrases & Scenarios/Thuis met je vrouw (Heb je zin om een film te kijken, Ik laat de honden
// wel even uit); content/towns.js for Texel (de veerboot, de overtocht, het schaap, het lam, de schapenboet, de
// duinen, de vuurtoren, de zeehond, Een Skuumkoppe graag, Hoe laat vertrekt de laatste boot terug, the missed-ferry
// joke, the sheep rumour).
// Replay: de kapstok, het dak and de handdoek from L83 (Urk, the tier before).
// New rules: omte, voorwaarde, erop (guarded below). er, vergelijk and zou are guarded too; die/dat, bijzin, v2, aux,
// perf, dehet are in data.js.
// New props: none. Only hond, huis and fiets are used (not tuin, deur or lamp: they are not in the word pool, and
// hond, huis and fiets are not word items here either).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive: om ... te', note: 'Thuis met je vrouw' };
  window.RULES.voorwaarde = window.RULES.voorwaarde || { name: 'If ... then: als ... dan, zou', note: 'zullen' };
  window.RULES.erop = window.RULES.erop || { name: 'Pronominal adverbs: erop, er ... over', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.er = window.RULES.er || { name: 'er: place, quantity, there is', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou + infinitive: polite requests', note: 'zullen' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 91, act: 9, name: 'Thuis', town: 'texel', place: 'thuis', theme: 'dyke', ...P,
    intro: 'You missed the last ferry, so you live on Texel now. The house came with a sheep, and the sheep has opinions.',
    introNl: 'Je hebt de laatste boot gemist, dus je woont nu op Texel. Bij het huis hoort een schaap, en dat schaap heeft overal een mening over.',
    mission: {
      where: 'A low brick house with a thatched sheep barn behind it, somewhere between Den Burg and the dunes, the red lighthouse blinking in the north. From the hallway to the guest room to the shed, and out again because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the house keys, a wedge of sheep cheese split to the cent with the neighbours, and the grammar book, still never opened. No helmet. On Texel the wind has noticed that too.',
      want: 'Since the mist everyone who spoke Dutch has changed, and on Texel they changed into sheep, or into someone who talks to sheep. They fill every room and explain which one, why and what if: die and dat, om te, als dan, and the little words er, erop and ermee. Paola, still taller than you, checks where you put the verb. The sheep know. The sheep are not talking.' },
    items: [
      // ---- builds: relative clauses, die for de-words, dat for het-words, the verb at the very end
      { en: 'The dog that sleeps on the couch is not allowed to lie there.', parts: ['De hond', FK(['die', 'dat'], 0, 'diedat',
        'hond is a de-word, so die. dat is for het-words.'), FK(['op de bank slaapt', 'slaapt op de bank'], 0, 'bijzin',
        'A die-clause is a sub-clause, so the verb goes to the very end: op de bank slaapt.'), ', mag daar niet liggen.'] },
      { en: 'The sheep that stands behind the barn is not ours.', parts: ['Het schaap', FK(['dat', 'die'], 0, 'diedat',
        'schaap is a het-word, so dat.'), FK(['achter de schapenboet staat', 'staat achter de schapenboet'], 0, 'bijzin',
        'The verb of the dat-clause goes last: achter de schapenboet staat.'), ', is niet van ons.'] },
      { en: 'The chair that Paola bought is now in the guest room.', parts: ['De stoel', FK(['die Paola kocht', 'dat Paola kocht', 'die kocht Paola'], 0, 'diedat',
        'stoel is a de-word, so die, and inside the clause the verb goes last: Paola kocht.'), ', staat nu in de logeerkamer.'] },

      // ---- builds: te plus infinitive and om ... te
      { en: 'We take the ferry to see the seals.', parts: ['We nemen de veerboot', FK(['om de zeehonden te zien', 'om de zeehonden zien te', 'om te zien de zeehonden'], 0, 'omte',
        'om opens the purpose and te sits right before the infinitive, which closes the clause: om de zeehonden te zien.'), '.'] },
      { en: 'I get up early to walk the dogs.', parts: ['Ik sta vroeg op', FK(['om de honden uit te laten', 'om de honden te uitlaten', 'om de honden te laten uit'], 0, 'omte',
        'A separable verb takes te in the middle: uit te laten, written as three little words at the end.'), '.'] },
      { en: 'Do you feel like going to the beach with the dogs?', parts: ['Heb je zin om met de honden', FK(['naar het strand te gaan', 'te naar het strand gaan', 'naar het strand gaan te'], 0, 'omte',
        'zin om ... te: te goes right before the infinitive at the end, gaan.'), '?'] },

      // ---- builds: als ... dan and zou
      { en: 'If I had time, I would walk to the lighthouse with the dogs.', parts: ['Als ik tijd had,', FK(['zou ik', 'ik zou'], 0, 'v2',
        'The als-clause fills slot 1, so the verb comes next: zou ik.'), 'met de honden naar de vuurtoren', FK(['lopen', 'liep', 'gelopen'], 0, 'voorwaarde',
        'zou is followed by the bare infinitive at the end: zou lopen. liep would be the plain past, not a wish.'), '.'] },
      { en: 'If you miss the last ferry, you live here from now on.', parts: [FK(['Als je de laatste boot mist,', 'Als je mist de laatste boot,'], 0, 'bijzin',
        'als opens the condition and sends mist to the end of its clause. dan opens the result.'), 'dan', FK(['woon je', 'je woont'], 0, 'v2',
        'dan is slot 1 of the main clause, so the verb comes next: woon je.'), 'hier voortaan.'] },
      { en: 'Could you walk the dogs for a moment?', parts: ['Zou je de honden even', FK(['kunnen uitlaten', 'te kunnen uitlaten', 'kan uitlaten'], 0, 'zou',
        'zou asks politely, kunnen follows as an infinitive and uitlaten closes: kunnen uitlaten.'), '?'] },

      // ---- builds: er as place and as quantity
      { en: 'Have you been to Texel? Yes, I have been there twice.', parts: ['Ben je op Texel geweest? Ja, ik ben', FK(['er', 'het', 'ze'], 0, 'er',
        'Dutch does not repeat a place it already named. It swaps it for er, right after the verb.'), 'twee keer geweest.'] },
      { en: 'How many sheep do you see? I see a hundred.', parts: ['Hoeveel schapen zie je? Ik zie', FK(['er', 'ervan', 'het'], 0, 'er',
        'When you count something already named, Dutch needs er: ik zie er honderd.'), 'wel honderd.'] },
      { en: 'There are more sheep than people here.', parts: [FK(['Er zijn', 'Ze zijn'], 0, 'er',
        'er announces something new in the scene, and schapen is a plural, so zijn. ze would point at sheep we already named.'), 'hier meer schapen', FK(['dan', 'dat', 'van'], 0, 'vergelijk',
        'After meer or any comparative, Dutch says dan.'), 'mensen.'] },

      // ---- builds: pronominal adverbs
      { en: 'On Saturday we go to Texel. I am looking forward to it.', parts: ['Zaterdag gaan we naar Texel. Ik verheug me', FK(['erop', 'ermee', 'eraan'], 0, 'erop',
        'verheugen takes op, and op plus it becomes erop. ermee would be with it and eraan would be to it.'), '.'] },
      { en: 'The neighbour has a new shed and talks about it all day.', parts: ['De buurman heeft een nieuwe schuur en praat', FK(['er de hele dag over', 'het de hele dag over', 'zich de hele dag over'], 0, 'erop',
        'praten over a thing becomes er ... over. er comes early and over waits at the end.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'I stay home because the ferry is not sailing.', parts: ['Ik blijf thuis', FK(['omdat de veerboot niet vaart', 'omdat de veerboot vaart niet', 'omdat vaart de veerboot niet'], 0, 'bijzin',
        'omdat sends vaart to the end: niet vaart.'), '.'] },
      { en: 'Before we go to bed, I give the dogs one more biscuit.', parts: [FK(['Voordat we naar bed gaan,', 'Voordat we gaan naar bed,'], 0, 'bijzin',
        'voordat sends gaan to the end of its clause.'), FK(['geef ik', 'ik geef'], 0, 'v2',
        'The sub-clause is slot 1, so the verb comes first in the main clause: geef ik.'), 'de honden nog een koekje.'] },
      { en: 'My father-in-law has the biggest sheep on the island.', parts: ['Mijn schoonvader heeft', FK(['het grootste', 'de grootste', 'het groter'], 0, 'vergelijk',
        'The superlative is -ste: grootste. schaap is a het-word, so het.'), 'schaap van het eiland.'] },
      { en: 'Yesterday we took the ferry to Texel.', parts: ['Gisteren', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Gisteren is slot 1, so the verb comes second.'), 'met de veerboot naar Texel', FK(['gevaren', 'gevaard'], 0, 'perf',
        'varen is irregular, gevaren, and sailing to a place takes zijn.'), '.'] },

      // ---- words: rooms, furniture, the family, the dogs, the island
      { w: 'the guest room', nl: 'de logeerkamer' }, { w: 'the extractor hood', nl: 'de afzuigkap' },
      { w: 'the kitchen sink', nl: 'de gootsteen' }, { w: 'the pyjamas', nl: 'de pyjama' },
      { w: 'the wall socket', nl: 'het stopcontact', wrong: 'de stopcontact' }, { w: 'the letterbox', nl: 'de brievenbus' },
      { w: 'the laundry basket', nl: 'de wasmand' }, { w: 'the iron', nl: 'het strijkijzer', wrong: 'de strijkijzer' },
      { w: 'the shed', nl: 'de schuur' }, { w: 'the father-in-law', nl: 'de schoonvader' }, { w: 'the cousin (male)', nl: 'de neef' },
      { w: 'the dog collar', nl: 'de halsband' }, { w: 'the tail', nl: 'de staart' },
      { w: 'the sheep', nl: 'het schaap', wrong: 'de schaap' }, { w: 'the lamb', nl: 'het lam' },
      { w: 'the Texel sheep barn', nl: 'de schapenboet' },
      { w: 'the coat rack', nl: 'de kapstok' }, { w: 'the roof', nl: 'het dak', wrong: 'de dak' }, { w: 'the towel', nl: 'de handdoek' },

      // ---- reads: three traps with their own options, three lines from the island
      { read: true, nl: 'De schapen die op de dijk staan, kijken naar de veerboot.', o: ['The sheep that stand on the dyke look at the ferry.', 'The sheep stand on the dyke when they look at the ferry.', 'The ferry looks at the sheep on the dyke.'], a: 0, r: 'diedat',
        w: 'die points back to de schapen and the clause says which sheep. It is not a when.' },
      { read: true, nl: 'Als het niet zo hard waaide, zouden de schapen buiten blijven.', o: ['If it did not blow so hard, the sheep would stay outside.', 'When it does not blow so hard, the sheep stay outside.', 'The sheep stayed outside because it blew so hard.'], a: 0, r: 'voorwaarde',
        w: 'als plus the past waaide, then zouden plus the infinitive: a what-if, not something that happens. The plain past would be bleven.' },
      { read: true, nl: 'Het dak is lek. Kun je er even naar kijken?', o: ['The roof leaks. Can you take a look at it?', 'The roof leaks. Can you look over there for a moment?', 'The roof leaks. Can you look it up later?'], a: 0, r: 'erop',
        w: 'er ... naar kijken is look at it: er stands for het dak and naar waits at the end. Over there would be daar.' },
      { read: true, nl: 'Een Skuumkoppe, graag.', en: "A Skuumkoppe, please (the island brewery's best-known beer)." },
      { read: true, nl: 'Hoe laat vertrekt de laatste boot terug?', en: 'What time does the last ferry back leave?' },
      { read: true, nl: 'De schapen weten ervan. De schapen zeggen niks.', en: 'The sheep know about it. The sheep are not saying anything.' },

      // ---- listens: four words from the island
      { listen: true, nl: 'de overtocht', en: 'the crossing' }, { listen: true, nl: 'de zeehond', en: 'the seal' },
      { listen: true, nl: 'de vuurtoren', en: 'the lighthouse' }, { listen: true, nl: 'de duinen', en: 'the dunes' },

      // ---- looks: the dog, the house, the rental bike against the wall
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },

      // ---- de of het
      { dehet: true, nl: 'schapenkaas', art: 'de', en: 'the sheep cheese', w: 'de schapenkaas. A compound takes the article of its last part, and kaas is a de-word.' },
      { dehet: true, nl: 'strand', art: 'het', en: 'the beach', w: 'het strand. The plural is de stranden, because every plural is de.' },
    ] }]);
})();
