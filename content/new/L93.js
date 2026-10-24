// Nachtrit, Texel (tier 9, B1): level 93 Eten en drinken. Den Burg on a Saturday night: a café with a terrace on the
// square, the snack bar at the ferry in 't Horntje, the harbour restaurant at Oudeschild with the lamb on a chalkboard,
// a market stall closing up. Ordering, the island lamb and cheese, the Skuumkoppe, the bill, splitting it, and the last
// ferry that decides whether you live here now.
// New at tier 9 and drilled here: relative clauses with die (de-words and plurals) and dat (het-words) with the verb at the
// end, te plus infinitive and om ... te (te in the middle of a separable verb: mee te nemen), conditionals with
// als ... dan and with zou / past tense (Als ik meer geld had, zou ik ...), er as quantity (ik heb er al vijf gegeten) and
// as the opener of a new thing (Er staat een schaap op het terras), pronominal adverbs (ik ben er blij mee, ik verheug me
// er op, zitten er noten in).
// Review of earlier tiers: perfectum (gedronken, gegeten), imperfectum (bestelde, had), zou plus infinitive (Zou u ... kunnen
// brengen), comparatives and superlatives (het lekkerste), adjective -e (een warme, een dik stuk), modal verbs, sub-clauses
// after als (verb at the end, then the main clause starts with its verb), V2 after a fronted phrase and after maar.
// Still inside the fence: 14 words max; no opinions with ik vind dat, no passive, no diminutive rule drill beyond dehet.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat (de-word die, het-word dat, verb to the end), bijzin, V2 word order,
// modale werkwoorden, zachtmakers; _site/grammar/er-het-kleine-woord-met-veel-banen-the-little-word;
// _site/situations/restaurant (Mag ik de kaart zien, Wat kunt u aanraden, Ik heb een allergie voor noten, Zitten daar noten in,
// Kunnen we apart betalen, Mag ik de rekening), pub (Doe mij maar een biertje van de tap, Nog een rondje, Mogen we afrekenen),
// takeaway (Doet u er saus bij, Mag het zonder ui); _site/sentences/ik-verheug-me-erop, sterkte-ermee, heb-je-zin-om-zaterdag-te-golfen;
// content/towns.js for Texel (de veerboot, het schaap, het lam, Skuumkoppe, the last ferry joke, Den Burg, 't Horntje);
// replay from levels 85 and 77 (de rekening, de fooi, de haring, het servet).
// New rules: omte, cond, pronadv (defined below with the vault notes that explain them).
// New props: none. Only hond, deur and fiets are used (no word item is de hond, de deur or de fiets).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive, om ... te', note: 'MOC Vrije tijd' };
  window.RULES.cond = window.RULES.cond || { name: 'If ... then: als ... dan, zou', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'ermee, erop, erin: er plus preposition', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.eris = window.RULES.eris || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 93, act: 9, name: 'Eten en drinken', town: 'texel', place: 'eten', theme: 'square', ...P,
    intro: 'Texel has more sheep than people and only a handful of restaurants. The dead booked early, and they still split the bill.',
    introNl: 'Texel heeft meer schapen dan mensen en maar een handvol restaurants. De doden hebben vroeg gereserveerd en splitsen de rekening nog steeds.',
    mission: {
      where: 'Den Burg on a Saturday night: a café with a terrace on the square, a snack bar by the ferry at \'t Horntje, a harbour restaurant at Oudeschild with the lamb chalked on a board, a market stall packing up its cheese. The last ferry leaves in forty minutes, and the sheep know exactly how many.',
      carry: 'A wallet with exact change, a paper cone of chips going cold, two dogs who have found the sheep while the sheep have found the dogs, and the grammar book, never opened. No helmet. The wind off the Waddenzee takes the napkins first and the menu second.',
      want: 'Since the mist the dead of Texel only order in sentences that explain themselves: the beer that they brew here, the sheep that stands on the terrace, if the storm comes then we eat inside. They want the te in the right place, a small er for what is already on the table, and the verb at the end of every clause. The women, still taller than you, check each line. Miss the last ferry and you live here now, so settle the bill first, split to the cent.' },
    items: [
      // ---- builds: relative clauses with die and dat, the verb at the end
      { en: 'The waiter who brings the soup is the cook\'s brother.', parts: ['De ober', FK(['die', 'dat'], 0, 'diedat',
        'ober is a de-word, so the relative pronoun is die.'), FK(['de soep brengt', 'brengt de soep'], 0, 'bijzin',
        'A die-clause sends its verb to the end: die de soep brengt.'), ', is de broer van de kok.'] },
      { en: 'The beer they brew on Texel is called Skuumkoppe.', parts: ['Het bier', FK(['dat', 'die'], 0, 'diedat',
        'bier is a het-word, so the relative pronoun is dat.'), FK(['ze op Texel brouwen', 'brouwen ze op Texel'], 0, 'bijzin',
        'After dat the subject comes first and the verb stands at the end: dat ze op Texel brouwen.'), ', heet Skuumkoppe.'] },
      { en: 'The bitterballen that Paola ordered are already gone.', parts: ['De bitterballen', FK(['die', 'dat'], 0, 'diedat',
        'bitterballen is a plural, and a plural always takes die, whatever the singular is.'), 'Paola', FK(['bestelde', 'bestelden'], 0, 'imp',
        'Paola is one person: bestelde. bestel ends in l, which is no ketchup letter, so -de.'), ', zijn al op.'] },
      { en: 'The terrace that lies by the harbour is already full.', parts: ['Het terras', FK(['dat', 'die'], 0, 'diedat',
        'terras is a het-word, so dat.'), FK(['aan de haven ligt', 'ligt aan de haven'], 0, 'bijzin',
        'The verb of a dat-clause stands at the end: dat aan de haven ligt.'), ', is al vol.'] },

      // ---- builds: te plus infinitive and om te
      { en: 'I go to the market in Den Burg to buy fresh fish.', parts: ['Ik ga naar de markt in Den Burg', FK(['om verse vis te kopen', 'om verse vis kopen', 'om te verse vis kopen'], 0, 'omte',
        'om opens the purpose, and te goes right in front of the infinitive at the very end: om verse vis te kopen.'), '.'] },
      { en: 'I forgot to bring cash.', parts: ['Ik ben vergeten contant geld', FK(['mee te nemen', 'te meenemen', 'mee nemen'], 0, 'omte',
        'With a separable verb the te goes in the middle: mee + te + nemen.'), '.'] },
      { en: 'I try to order in Dutch, but the waiter answers in English.', parts: ['Ik probeer in het Nederlands', FK(['te bestellen', 'bestellen te', 'bestellen'], 0, 'omte',
        'probeer asks for te plus the infinitive: te bestellen.'), ',', FK(['maar de ober antwoordt in het Engels', 'maar de ober in het Engels antwoordt'], 0, 'v2',
        'maar does not take a slot and starts no sub-clause, so the verb stays second: de ober antwoordt, then in het Engels.'), '.'] },
      { en: 'The dead decided to split the bill again.', parts: ['De doden besloten om de rekening weer', FK(['te delen', 'delen te', 'delen'], 0, 'omte',
        'om ... te: te sits in front of the infinitive, and the infinitive closes the clause.'), '.'] },

      // ---- builds: if ... then, zou and the past tense
      { en: 'If it storms, then we eat inside.', parts: ['Als het', FK(['stormt', 'storm'], 0, 'presens',
        'het takes the -t form: het stormt.'), ',', FK(['dan eten we', 'dan we eten'], 0, 'cond',
        'After als ... dan, the verb comes straight after dan: dan eten we.'), 'binnen.'] },
      { en: 'If I had more money, I would order the lamb.', parts: ['Als ik meer geld', FK(['had', 'hadden'], 0, 'imp',
        'ik takes the singular past of hebben: had.'), ',', FK(['zou ik', 'ik zou'], 0, 'cond',
        'The als-clause fills the first slot, so zou comes before ik.'), 'het lamsvlees bestellen.'] },
      { en: 'If we miss the last ferry, we order another dessert.', parts: ['Als we', FK(['de laatste boot missen', 'missen de laatste boot'], 0, 'bijzin',
        'als sends the verb to the end: de laatste boot missen.'), ',', FK(['bestellen we', 'we bestellen'], 0, 'cond',
        'The als-clause comes first, so the main clause starts with its verb: bestellen we.'), 'nog een toetje.'] },

      // ---- builds: er as quantity, er as the opener, and the pronominal adverbs
      { en: 'Another bitterbal? No thanks, I have already eaten five.', parts: ['Nog een bitterbal? Nee, dank je, ik heb', FK(['er', 'het'], 0, 'er',
        'When you only say how many, er stands for the thing: ik heb er al vijf.'), 'al vijf', FK(['gegeten', 'geëten', 'gegeet'], 0, 'perf',
        'eten is irregular: gegeten.'), '.'] },
      { en: 'There is a sheep on the terrace.', parts: [FK(['Er', 'Het', 'Dat'], 0, 'eris',
        'er opens a sentence about something new: Er staat een schaap.'), FK(['staat', 'staan'], 0, 'eris',
        'The verb agrees with the one new thing, one sheep: staat.'), 'een schaap op het terras.'] },
      { en: 'What a big portion. I am very happy with it.', parts: ['Wat een grote portie. Ik ben', FK(['er', 'het'], 0, 'pronadv',
        'A thing after a preposition becomes er: blij met de portie turns into er ... blij mee.'), 'heel blij', FK(['mee', 'met'], 0, 'pronadv',
        'With er the preposition moves behind it as mee: ermee, not er met.'), '.'] },
      { en: 'The dessert? I have been looking forward to it all day.', parts: ['Het toetje? Ik verheug me', FK(['er', 'het'], 0, 'pronadv',
        'The thing you look forward to becomes er: ik verheug me erop.'), 'al de hele dag', FK(['op', 'aan', 'in'], 0, 'pronadv',
        'verheugen takes op, and op moves behind er: er ... op.'), '.'] },
      { en: 'I am allergic to nuts. Are there nuts in it?', parts: ['Ik heb een allergie voor noten.', FK(['Zitten er noten in', 'Zitten noten er in'], 0, 'er',
        'er comes straight after the verb, the preposition in goes to the end: Zitten er noten in?'), '?'] },

      // ---- builds: review of earlier tiers
      { en: 'On the ferry we drank coffee and ate a roll.', parts: ['Op de boot', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Op de boot takes slot 1, so the verb comes second: hebben we.'), 'koffie', FK(['gedronken', 'gedrinkt', 'gedronkt'], 0, 'perf',
        'drinken is irregular: gedronken.'), 'en een broodje gegeten.'] },
      { en: 'This is the tastiest lamb of the whole island.', parts: ['Dit is', FK(['het lekkerste', 'de lekkerste', 'het lekkerder'], 0, 'vergelijk',
        'lamsvlees is a het-word, and the best of all takes -ste: het lekkerste.'), 'lamsvlees van het', FK(['hele', 'heel'], 0, 'adj',
        'After het the adjective still takes -e: het hele eiland.'), 'eiland.'] },
      { en: 'I take a hot chocolate and a thick piece of cake.', parts: ['Ik neem een', FK(['warme', 'warm'], 0, 'adj',
        'chocolademelk is a de-word, so after een the adjective takes -e: een warme.'), 'chocolademelk en een', FK(['dik', 'dikke'], 0, 'adj',
        'stuk is a het-word, and after een a het-word takes no -e: een dik stuk.'), 'stuk taart.'] },
      { en: 'Could you bring the bill? We have to catch the boat.', parts: ['Zou u de rekening', FK(['kunnen brengen', 'kan brengen', 'te brengen'], 0, 'zou',
        'zou is followed by a plain infinitive: kunnen brengen, without te.'), '? We', FK(['moeten', 'moet'], 0, 'modal',
        'we is plural: moeten.'), 'de boot halen.'] },

      // ---- words: the menu, the island, the table, the bill
      { w: 'the lamb (meat)', nl: 'het lamsvlees', wrong: 'de lamsvlees' }, { w: 'the sheep cheese', nl: 'de schapenkaas' },
      { w: 'the menu', nl: 'de menukaart' }, { w: 'the starter', nl: 'het voorgerecht' },
      { w: 'the dessert', nl: 'het toetje', wrong: 'de toetje' }, { w: 'the pancake', nl: 'de pannenkoek' },
      { w: 'the chips', nl: 'de patat' }, { w: 'the roll', nl: 'het broodje' },
      { w: 'the soup', nl: 'de soep' }, { w: 'the tap water', nl: 'het kraanwater', wrong: 'de kraanwater' },
      { w: 'the terrace', nl: 'het terras', wrong: 'de terras' }, { w: 'the reservation', nl: 'de reservering' },
      { w: 'the salt', nl: 'het zout', wrong: 'de zout' }, { w: 'the sauce', nl: 'de saus' },
      { w: 'the onion', nl: 'de ui' }, { w: 'the service', nl: 'de bediening' },
      { w: 'the bill', nl: 'de rekening' }, { w: 'the tip', nl: 'de fooi' }, { w: 'the napkin', nl: 'het servet' },

      // ---- reads: three traps with their own options, two plain lines
      { read: true, nl: 'De serveerster die de koffie bracht, is de dochter van de eigenaar.', o: ['The waitress who brought the coffee is the owner\'s daughter.', 'The waitress brought the coffee to the owner\'s daughter.', 'The owner\'s daughter brought the waitress her coffee.'], a: 0, r: 'diedat',
        w: 'die points back to the waitress, and bracht closes that clause. The main verb is is: she is the daughter.' },
      { read: true, nl: 'Het is niet nodig om te reserveren.', o: ['You do not need to reserve.', 'You are not allowed to reserve.', 'It is not possible to reserve.'], a: 0, r: 'omte',
        w: 'niet nodig om te: there is no need. Not allowed would be mag niet, and not possible niet mogelijk.' },
      { read: true, nl: 'Als ik jou was, zou ik het lamsvlees nemen.', o: ['If I were you, I would take the lamb.', 'When I was you, I took the lamb.', 'I was you, so I took the lamb.'], a: 0, r: 'cond',
        w: 'Als ik jou was is the stock phrase for advice: was is the unreal past, not a story about the past. zou ik says what you would do.' },
      { read: true, nl: 'De pannenkoeken die ze hier maken, zijn zo groot als een fietswiel.', en: 'The pancakes they make here are as big as a bicycle wheel.' },
      { read: true, nl: 'Mag ik er wat mosterd bij?', en: 'May I have some mustard with it?' },

      // ---- listens: a round, a price, the island beer
      { listen: true, nl: 'nog een rondje', en: 'another round' }, { listen: true, nl: 'eenendertig euro vijftig', en: '€ 31,50' },
      { listen: true, nl: 'een Skuumkoppe, graag', en: 'a Skuumkoppe, please' },

      // ---- looks: the dog under the table, the door of the café, the rental bike
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },

      // ---- de of het
      { dehet: true, nl: 'koffiekopje', art: 'het', en: 'the coffee cup', w: 'het koffiekopje. A diminutive ending in -je is always het.' },
      { dehet: true, nl: 'bestek', art: 'het', en: 'the cutlery', w: 'het bestek. It is one word for the knife, fork and spoon together.' },
    ] }]);
})();
