// Nachtrit, Texel (tier 9, B1): level 96 De sport, place sport. Texel as a sports ground: the ferry from Den Helder, rental
// bikes on the cycle paths between the sheep fences, a golf course between the dunes, the wide beach with its tides, the red
// lighthouse in the north, the seal pools at Ecomare and a pint of Skuumkoppe after the match.
// New at tier 9 and drilled here: relative clauses with die and dat (het schaap dat ..., de vuurtoren die ..., plural always die,
// the verb at the end of the clause), te plus infinitive (om te, vergat ... mee te nemen, het begint te regenen), conditionals
// with als ... dan and with zou, er as place and quantity (Er zijn ..., Ik heb er twee) and pronominal adverbs (ermee, erover,
// ervan, er zin in). Review: the perfectum with a separable verb, V2 after a time word, the imperfectum by 't kofschip,
// the superlative.
// Still inside the fence: 14 words max, no opinion verbs of tier 10 (volgens mij, hoewel), no separable verbs inside sub-clauses,
// no passive, no plusquamperfectum, no indirect speech.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat (de-word die, het-word dat, verb to the end of the clause), bijzin,
// modale werkwoorden, imperfectum, perfectum, scheidbare werkwoorden, 't kofschip, V2 word order; 04 - Phrases & Scenarios/
// Op de golfbaan (het clubhuis, balletje, Het waait weer eens, Een buitje deert ons niet, Zin in een biertje), 03 - Verbs/
// wandelen (een ommetje maken), spelen, uitlaten; _site/words (de sport, de sportschool, het park, golf, fietsen, sporten,
// wandelen, de fietser, de fietsenmaker); MOC Vrije tijd, MOC Het weer, MOC Voorzetsels;
// content/towns.js for Texel (de veerboot, de overtocht, het schaap, de duinen, de vuurtoren, de zeehond, de Slufter, Ecomare,
// Hoe laat vertrekt de laatste boot terug, Een Skuumkoppe, graag, the missed-ferry joke, the sheep rumour).
// New rules: omte, alsdan, vnwadv (guarded, the other Texel levels define them the same way).
// New props: none. Only hond, water and molen are used (not fiets: de huurfiets and het fietspad are in the word pool).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om te', note: 'modale werkwoorden' };
  window.RULES.alsdan = window.RULES.alsdan || { name: 'als ... dan, zou', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vnwadv = window.RULES.vnwadv || { name: 'ermee, erover, ervan: er + preposition', note: 'MOC Voorzetsels' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 96, act: 9, name: 'De sport', town: 'texel', place: 'sport', theme: 'dyke', ...P,
    intro: 'On Texel the wind hits the ball, the sheep keep score, and the dogs still need a walk.',
    introNl: 'Op Texel slaat de wind het balletje, houden de schapen de score bij en moeten de honden nog steeds uit.',
    mission: {
      where: "Texel, from the ferry at 't Horntje along the rental bikes and the cycle paths between the sheep fences, to a golf course in the dunes, the wide beach with its tides, the red lighthouse in the north and the seal pools at Ecomare. Wind from every side, sand in everything, nothing between you and the North Sea.",
      carry: "Two dogs on leads, a golf bag, a rental bike with one soft tyre, a paper bag of chips split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The sheep have not said anything about that, which is the worrying part.",
      want: "Since the mist the dead hold a match on every dune, and they speak in long sentences. Die for a de-word, dat for a het-word, om ... te for what you do it for, als ... dan for what would happen, and ermee, erover, er zin in for the small words that stand in for whole nouns. Miss the last ferry and you live here now. The women are still taller than you, and the sheep want to see the score." },
    items: [
      // ---- builds: relative clauses with die and dat
      { en: 'The sheep that is standing on the golf course is called Birdie.', parts: ['Het schaap', FK(['dat', 'die'], 0, 'diedat',
        'schaap is a het-word, so dat. die is for de-words and for every plural.'), 'op de golfbaan staat, heet Birdie.'] },
      { en: 'The lighthouse that you can see over there is red.', parts: ['De vuurtoren', FK(['die', 'dat'], 0, 'diedat',
        'vuurtoren is a de-word, so die. dat would need a het-word.'), 'je daar ziet, is rood.'] },
      { en: 'The seals that live in Ecomare are very lazy.', parts: ['De zeehonden', FK(['die', 'dat'], 0, 'diedat',
        'A plural is always de, so die: de zeehonden die ... wonen.'), 'in Ecomare wonen, zijn erg lui.'] },
      { en: 'That is the sheep that steals my lunch.', parts: ['Dat is het schaap dat', FK(['mijn lunch steelt', 'steelt mijn lunch'], 0, 'bijzin',
        'A clause with die or dat sends its verb to the end: dat mijn lunch steelt.'), '.'] },

      // ---- builds: te plus infinitive, om te
      { en: 'I am going to the beach to walk the dogs.', parts: ['Ik ga naar het strand', FK(['om de honden uit te laten', 'om de honden te uitlaten'], 0, 'omte',
        'om ... te closes with the infinitive. With a separable verb the te sits in the middle: uit te laten.'), '.'] },
      { en: 'It is lovely to cycle on Texel.', parts: ['Het is heerlijk om op Texel', FK(['te fietsen', 'fietsen'], 0, 'omte',
        'After om the infinitive comes with te: om op Texel te fietsen.'), '.'] },
      { en: 'Paola forgot to take the lead.', parts: ['Paola vergat de riem', FK(['mee te nemen', 'te meenemen'], 0, 'omte',
        'The te goes between the prefix and the verb: mee te nemen, not te meenemen.'), '.'] },
      { en: 'It starts to rain, but the match goes on.', parts: ['Het begint', FK(['te regenen', 'regenen'], 0, 'omte',
        'beginnen takes te plus the infinitive: het begint te regenen.'), ', maar de wedstrijd gaat door.'] },

      // ---- builds: als ... dan and zou
      { en: 'If you miss the last ferry, you live here from now on.', parts: ['Als je de laatste boot mist,', FK(['dan woon je', 'dan je woont'], 0, 'alsdan',
        'After an als-clause the main clause opens with dan, and the verb comes straight after it: dan woon je.'), 'hier voortaan.'] },
      { en: 'If the wind did not blow so hard, I would play golf.', parts: ['Als het niet zo hard', FK(['waaide', 'waaite'], 0, 'kof',
        'waai does not end in a letter of \'t kofschip, so the past is waaide with a d.'), ',', FK(['zou ik', 'ik zou'], 0, 'alsdan',
        'The als-clause fills slot 1, so zou comes before ik.'), 'golfen.'] },
      { en: 'If I had more time, I would go to the gym more often.', parts: ['Als ik meer tijd', FK(['had', 'hadden'], 0, 'imp',
        'ik takes had. hadden is for wij, jullie and zij.'), ',', FK(['zou ik', 'ik zou'], 0, 'zou',
        'The als-clause comes first, so zou starts the main clause: zou ik vaker naar de sportschool gaan.'), 'vaker naar de sportschool gaan.'] },

      // ---- builds: er as place and quantity
      { en: 'On Texel there are more sheep than people.', parts: ['Op Texel', FK(['zijn er', 'er zijn'], 0, 'v2',
        'Op Texel takes slot 1, so the verb comes second: zijn er. schapen is plural, so zijn.'), 'meer schapen', FK(['dan', 'dat'], 0, 'vergelijk',
        'After meer, a comparison uses dan: meer schapen dan mensen.'), 'mensen.'] },
      { en: 'How many dogs do you have? I have two, they always have to go out.', parts: ['Hoeveel honden heb je? Ik heb', FK(['er twee', 'twee er'], 0, 'er',
        'When the noun was already named, er stands for it: ik heb er twee, right after the verb.'), ', ze moeten altijd uit.'] },

      // ---- builds: pronominal adverbs
      { en: 'My dog has found a golf ball and is playing with it.', parts: ['Mijn hond heeft een golfbal gevonden en speelt', FK(['ermee', 'met het'], 0, 'vnwadv',
        'met plus a thing becomes ermee: er + met, glued together. met het cannot stand alone.'), '.'] },
      { en: "I've been talking about it with Paola all week.", parts: ['Ik praat', FK(['er', 'het'], 0, 'vnwadv',
        'over plus a thing becomes er ... over: er comes early, over waits at the end. het cannot go with over.'), 'al de hele week met Paola over.'] },
      { en: 'Fancy a match? I feel like it.', parts: ['Zin in een wedstrijd? Ik heb', FK(['er zin in', 'het zin in'], 0, 'vnwadv',
        'zin hebben in plus a thing: er stands before zin and in stays behind: ik heb er zin in.'), '.'] },
      { en: 'I love it when it blows.', parts: ['Ik hou', FK(['ervan', 'van er'], 0, 'vnwadv',
        'houden van plus a thing becomes ervan: er + van, glued together as one word.'), 'als het waait.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday I walked the dogs along the beach.', parts: ['Gisteren', FK(['heb ik', 'ik heb'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second, then ik.'), 'de honden langs het strand', FK(['uitgelaten', 'geuitlaten'], 0, 'sep',
        'The ge goes inside a separable verb: uit + gelaten, one word at the end.'), '.'] },
      { en: 'I used to play golf every Saturday.', parts: ['Vroeger', FK(['speelde ik', 'ik speelde'], 0, 'v2',
        'Vroeger takes slot 1, so the verb comes second: speelde ik.'), 'elke zaterdag golf.'] },
      { en: 'This is the most beautiful beach in the Netherlands, say the sheep.', parts: ['Dit is het', FK(['mooiste', 'mooist'], 0, 'vergelijk',
        'Before a noun the superlative takes -e: het mooiste strand. mooist stands alone, with no noun after it.'), 'strand van Nederland, zeggen de schapen.'] },

      // ---- words: the beach, the weather, the bike, the match, the gym
      { w: 'the golf ball', nl: 'de golfbal' }, { w: 'the clubhouse', nl: 'het clubhuis', wrong: 'de clubhuis' },
      { w: 'the rain jacket', nl: 'de regenjas' }, { w: 'the dog lead', nl: 'de hondenriem' },
      { w: 'the match', nl: 'de wedstrijd' }, { w: 'the team', nl: 'het team', wrong: 'de team' },
      { w: 'the goal (scored)', nl: 'het doelpunt' }, { w: 'the swimming pool', nl: 'het zwembad', wrong: 'de zwembad' },
      { w: 'the subscription (gym)', nl: 'het abonnement', wrong: 'de abonnement' }, { w: 'the beach', nl: 'het strand', wrong: 'de strand' },
      { w: 'the ebb tide', nl: 'de eb' }, { w: 'the rain shower', nl: 'de bui' },
      { w: 'the cycle path', nl: 'het fietspad' }, { w: 'the rental bike', nl: 'de huurfiets' },
      { w: 'the helmet', nl: 'de helm' }, { w: 'the short stroll', nl: 'het ommetje', wrong: 'de ommetje' },
      { w: 'the football supporter', nl: 'de supporter' },

      // ---- reads: a trap on dat, a trap on te, a trap on er zin in, then the island's own lines
      { read: true, nl: 'Het schaap dat op het fietspad staat, wil niet weg.', o: ['The sheep standing on the cycle path does not want to move.', 'The cyclist on the path does not want the sheep to move.', 'The sheep next to the path wants to leave.'], a: 0, r: 'diedat',
        w: 'dat points back to het schaap and staat sits at the end of its clause: the sheep is the one standing there. wil niet weg is the main clause.' },
      { read: true, nl: 'Ik probeer elke dag een uur te sporten.', o: ['I try to exercise for an hour every day.', 'I tried to exercise for an hour yesterday.', 'I am not allowed to exercise for an hour every day.'], a: 0, r: 'omte',
        w: 'probeer is present, and te sporten is what is being tried. Past would be probeerde, not allowed would be mag niet.' },
      { read: true, nl: 'Ik heb er geen zin in.', o: ['I do not feel like it.', 'I have no time for it.', 'I have no sentence in it.'], a: 0, r: 'vnwadv',
        w: 'zin hebben in means to feel like it, and er stands for the thing. zin is also sentence, but not here.' },
      { read: true, nl: 'Hoe laat vertrekt de laatste boot terug?', en: 'What time does the last ferry back leave?' },
      { read: true, nl: 'Een buitje deert ons niet.', en: 'A little shower does not bother us.' },
      { read: true, nl: 'Een Skuumkoppe, graag.', en: "A Skuumkoppe, please (the island brewery's best-known beer)." },

      // ---- listens: the seal, the sheep, the crossing, the dune valley
      { listen: true, nl: 'de zeehond', en: 'the seal' }, { listen: true, nl: 'het schaap', en: 'the sheep' },
      { listen: true, nl: 'de overtocht', en: 'the crossing' }, { listen: true, nl: 'de Slufter', en: 'the Slufter (the dune valley)' },

      // ---- looks: the dog, the water, the windmill
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill' },

      // ---- de of het
      { dehet: true, nl: 'zand', art: 'het', en: 'the sand', w: 'het zand. Materials are often het: het zand, het zout, het hout.' },
      { dehet: true, nl: 'toernooi', art: 'het', en: 'the tournament', w: 'het toernooi. The plural is de toernooien, because every plural is de.' },
    ] }]);
})();
