// Nachtrit, Texel (tier 9, B1): level 97 De mensen. Den Burg in the middle of the island, the dyke villages, the last
// ferry from 't Horntje, the Friday borrel and the sheep. More sheep than people, so the people all know each other,
// and since the mist the sheep listen in. Neighbours, small talk, the borrel, feelings, opinions, a small argument.
// New at tier 9 and drilled here: relative clauses with die and dat (het schaap dat ..., de buurvrouw die ..., plural
// always die) with the verb at the end; te plus infinitive (om te, probeer te, hoeft niet te, om af te spreken);
// conditionals with als ... dan and with zou (als ik meer tijd had, zou ik ...); er as place (ik ben er nog nooit
// geweest), er as quantity (ik heb er twee) and er in op Texel zijn er ...; pronominal adverbs (erover, ermee, ervan).
// Review from earlier tiers: the imperfectum (voelde, kregen, ontmoette), the perfectum with zijn (is vertrokken),
// a reflexive (me voelen), omdat with the verb at the end, meer ... dan.
// Still inside the fence: 14 words max, no opinion clauses with hoewel / ondanks, no passive, no plusquamperfectum.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat, bijzin - werkwoord naar het einde, modale werkwoorden,
// imperfectum, reflexieve werkwoorden, perfectum, zijn of hebben, V2 word order; 04 - Phrases & Scenarios/Borrel met
// vrienden (Het was weer gezellig), De nieuwe buren ontmoeten; _site/situations/neighbours, small-talk, friends,
// opinions; _site/maps/MOC Gevoel & uitdrukkingen (chagrijnig), MOC Voegwoorden; content/towns.js for Texel
// (de veerboot, de overtocht, het schaap, het lam, de zeehond, de vuurtoren, the last-ferry joke, De schapen weten
// ervan. De schapen zeggen niks.).
// New rules: omte, cond, pronadv (guarded below; the note is the vault note that explains each). The existing ids
// diedat, bijzin, er, vergelijk, aux, perf, imp, kof, refl are reused.
// New props: none. Used: hond, fiets, water (not kerk, deur or huis: no word item here has those answers).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive: om te', note: 'modale werkwoorden' };
  window.RULES.cond = window.RULES.cond || { name: 'Conditionals: als ... dan, zou', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erop, ermee, ervan', note: 'MOC Voorzetsels' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 97, act: 9, name: 'De mensen', town: 'texel', place: 'mensen', theme: 'square', ...P,
    intro: 'On Texel there are more sheep than people, and since the mist the sheep listen in. The dead still split the bill, and the sheep still say nothing.',
    introNl: 'Op Texel zijn meer schapen dan mensen, en sinds de mist luisteren de schapen mee. De doden splitsen de rekening nog steeds, en de schapen zeggen nog steeds niks.',
    mission: {
      where: 'Den Burg in the middle of the island, the villages along the dyke, the pub where all of Texel meets on Friday and the queue for the last ferry from \'t Horntje. Everybody here was born on the island or arrived by mistake and stayed. Everybody knows which is which.',
      carry: 'An invitation to a borrel that nobody remembers sending, two dogs who need a walk, and the grammar book, still never opened. A rented bike and no helmet. The wind does not care.',
      want: 'Since the mist the dead have become neighbours: they chat, they gossip, they argue about the fence. Every sentence has a trap: a die or a dat, an om te, an als and a zou, an er that points back. The women are still taller than you. The sheep know. The sheep are not talking.' },
    items: [
      // ---- builds: relative clauses with die and dat, the verb at the very end of the clause
      { en: 'The sheep that lives next to us knows everyone.', parts: ['Het schaap', FK(['dat', 'die'], 0, 'diedat',
        'schaap is a het-word, so the pointer is dat: het schaap dat.'), FK(['naast ons woont', 'woont naast ons'], 0, 'bijzin',
        'A relative clause is a sub-clause: the verb goes to the end, naast ons woont.'), ', kent iedereen.'] },
      { en: 'The man I met yesterday is a farmer.', parts: ['De man', FK(['die', 'dat'], 0, 'diedat',
        'man is a de-word, so die.'), 'ik gisteren', FK(['ontmoette', 'ontmoetde', 'ontmoetten'], 0, 'imp',
        'ontmoet ends in a t, a ketchup letter, so the imperfectum takes -te: ontmoette. With ik it stays singular.'), ', is boer.'] },
      { en: 'The tourists who come too late miss the boat.', parts: ['De toeristen', FK(['die', 'dat'], 0, 'diedat',
        'toeristen is a plural, and every plural takes die.'), FK(['te laat komen', 'komen te laat'], 0, 'bijzin',
        'The verb goes to the end of the relative clause: te laat komen.'), ', missen de boot.'] },

      // ---- builds: te plus infinitive
      { en: 'It is nice to meet new people.', parts: ['Het is leuk', FK(['om', 'dat'], 0, 'omte',
        'Dutch says to with om ... te: om nieuwe mensen te ontmoeten.'), 'nieuwe mensen', FK(['te ontmoeten', 'ontmoeten te', 'te ontmoet'], 0, 'omte',
        'te goes right in front of the infinitive, and the infinitive ends the sentence.'), '.'] },
      { en: 'I try to stay friendly to the neighbours.', parts: ['Ik probeer vriendelijk tegen de buren', FK(['te blijven', 'blijven te', 'blijven'], 0, 'omte',
        'probeer takes te plus the infinitive at the end: te blijven.'), '.'] },
      { en: 'You do not have to be afraid of the sheep.', parts: ['Je hoeft niet bang', FK(['te zijn', 'zijn te'], 0, 'omte',
        'hoeven is the odd modal: it takes te before the infinitive. te zijn.'), 'voor de schapen.'] },
      { en: 'I am calling the neighbours to arrange a borrel.', parts: ['Ik bel de buren om een borrel', FK(['af te spreken', 'te afspreken', 'afte spreken'], 0, 'omte',
        'A separable verb puts te in the middle: af + te + spreken.'), '.'] },

      // ---- builds: conditionals with als ... dan and with zou
      { en: 'If it rains, we stay in the pub.', parts: ['Als', FK(['het regent', 'regent het'], 0, 'bijzin',
        'als sends the verb to the end: het regent.'), ',', FK(['dan blijven we', 'dan we blijven', 'dan blijft we'], 0, 'cond',
        'After als ... comes dan, and the verb is the very next word: dan blijven we.'), 'in de kroeg.'] },
      { en: 'If I had more time, I would visit the neighbours more often.', parts: ['Als ik meer tijd', FK(['had', 'hadt', 'hadden'], 0, 'cond',
        'For something that is not true now, als takes the imperfectum: als ik meer tijd had.'), ', zou ik de buren vaker', FK(['bezoeken', 'te bezoeken', 'bezocht'], 0, 'cond',
        'zou takes the bare infinitive at the end, with no te: zou bezoeken.'), '.'] },
      { en: 'If I were a sheep, I would not be afraid of anything.', parts: ['Als ik een schaap', FK(['was', 'waren'], 0, 'cond',
        'ik takes was, singular: als ik een schaap was.'), ',', FK(['zou ik', 'ik zou'], 0, 'cond',
        'The main clause after als starts with its verb: zou ik.'), 'nergens bang voor zijn.'] },

      // ---- builds: er as place and as quantity
      { en: 'On Texel there are more sheep than people.', parts: ['Op Texel', FK(['zijn er', 'er zijn'], 0, 'er',
        'Op Texel takes slot 1, so the verb comes next, then er.'), 'meer schapen', FK(['dan', 'dat'], 0, 'vergelijk',
        'After meer comes dan: meer schapen dan mensen.'), 'mensen.'] },
      { en: 'Do you have a dog? No, I have two.', parts: ['Heb je een hond? Nee, ik heb', FK(['er twee', 'twee er', 'ze twee'], 0, 'er',
        'When the noun is left out, er stands for it and the number follows: ik heb er twee.'), '.'] },
      { en: 'My neighbours live on Vlieland. I have never been there.', parts: ['Mijn buren wonen op Vlieland. Ik ben', FK(['er nog nooit', 'nog nooit er'], 0, 'er',
        'er is the place that was just named, and it sits early: ik ben er nog nooit geweest.'), 'geweest.'] },

      // ---- builds: pronominal adverbs
      { en: "It's a secret. I don't want to talk about it.", parts: ['Het is een geheim. Ik wil', FK(['er niet over', 'het niet over', 'over niet er'], 0, 'pronadv',
        'over het becomes erover. er goes forward and over stays at the end: er niet over praten.'), 'praten.'] },
      { en: 'We got a present from the neighbours. We are very happy with it.', parts: ['We kregen een cadeau van de buren. We zijn', FK(['er erg blij mee', 'erg blij met het', 'erg het blij mee'], 0, 'pronadv',
        'met het cadeau becomes ermee. er goes forward, mee stays behind: er erg blij mee.'), '.'] },
      { en: 'The sheep know about it, but they say nothing about it.', parts: ['De schapen', FK(['weten ervan', 'ervan weten'], 0, 'pronadv',
        'van het becomes ervan, and it follows the verb: weten ervan.'), ', maar ze zeggen', FK(['er niks over', 'niks het over', 'over niks er'], 0, 'pronadv',
        'er goes forward and over stays at the end: er niks over.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'We were late because the ferry was full.', parts: ['We waren te laat, omdat de boot', FK(['vol was', 'was vol'], 0, 'bijzin',
        'omdat sends the verb to the end: vol was.'), '.'] },
      { en: 'I felt at home here straight away.', parts: ['Ik', FK(['voelde', 'voelte', 'voeld'], 0, 'kof',
        'voel ends in l, which is not a ketchup letter, so -de: voelde.'), FK(['me', 'zich'], 0, 'refl',
        'ik goes with me: ik voelde me. zich is for hij, zij, het and u.'), 'hier meteen thuis.'] },
      { en: 'The last ferry has already left.', parts: ['De laatste boot', FK(['is', 'heeft'], 0, 'aux',
        'Leaving is moving away from a place, so zijn: is vertrokken.'), 'al', FK(['vertrokken', 'gevertrokken', 'vertrekt'], 0, 'perf',
        'ver- verbs take no ge, and vertrekken is irregular: vertrokken.'), '.'] },

      // ---- words: people, feelings, the island (the last four are replay from the Urk level)
      { w: 'the islander', nl: 'de eilander' }, { w: 'the tourist', nl: 'de toerist' }, { w: 'the farmer', nl: 'de boer' },
      { w: 'the shepherd', nl: 'de schaapherder' }, { w: 'the stranger', nl: 'de vreemdeling' }, { w: 'the compliment', nl: 'het compliment' },
      { w: 'the secret', nl: 'het geheim', wrong: 'de geheim' }, { w: 'the mood', nl: 'het humeur', wrong: 'de humeur' },
      { w: 'the fun', nl: 'het plezier', wrong: 'de plezier' }, { w: 'the habit', nl: 'de gewoonte' },
      { w: 'the island', nl: 'het eiland', wrong: 'de eiland' }, { w: 'the sheep', nl: 'het schaap', wrong: 'de schaap' },
      { w: 'the lamb', nl: 'het lam' }, { w: 'the ferry', nl: 'de veerboot' }, { w: 'grumpy', nl: 'chagrijnig' },
      { w: 'the quarrel', nl: 'de ruzie' }, { w: 'the opinion', nl: 'de mening' }, { w: 'the conversation', nl: 'het gesprek' },

      // ---- reads: three traps with their own options, three straight ones
      { read: true, nl: 'De buurvrouw die ik ken, woont naast de boer.', o: ['The neighbour I know lives next to the farmer.', 'The neighbour who knows me lives next to the farmer.', 'The farmer I know lives next to the neighbour.'], a: 0, r: 'diedat',
        w: 'die points back to de buurvrouw, and ik is the one who knows her: the neighbour I know.' },
      { read: true, nl: 'Als je de laatste boot mist, dan woon je hier voortaan.', o: ['If you miss the last ferry, you live here from now on.', 'You live here because you missed the last ferry.', 'If you live here, you will miss the last ferry.'], a: 0, r: 'cond',
        w: 'als ... dan is if ... then. The ferry is the condition, living here is the result.' },
      { read: true, nl: 'Er staan drie fietsen voor de deur, maar er is niemand thuis.', o: ['There are three bikes outside the door, but nobody is home.', 'Three bikes are home, but nobody is at the door.', 'There is nobody at the door, but three people are home.'], a: 0, r: 'er',
        w: 'er staan drie fietsen: there are three bikes. er is niemand thuis: nobody is home.' },
      { read: true, nl: 'Het is moeilijk om hier iets geheim te houden.', en: 'It is hard to keep anything secret here.' },
      { read: true, nl: 'Ik heb er geen zin in.', en: 'I do not feel like it.' },
      { read: true, nl: 'Hij praat met iedereen die langskomt.', en: 'He talks to everyone who comes by.' },

      // ---- listens: the crossing, the seal and the lighthouse
      { listen: true, nl: 'de overtocht', en: 'the crossing' }, { listen: true, nl: 'de zeehond', en: 'the seal' },
      { listen: true, nl: 'de vuurtoren', en: 'the lighthouse' },

      // ---- looks: the dog, the rented bike, the water of the Marsdiep
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },

      // ---- de of het
      { dehet: true, nl: 'vriendschap', art: 'de', en: 'the friendship', w: 'Words ending in -schap are de: de vriendschap, de boodschap. A few are the exception: het landschap, het gezelschap, het gereedschap.' },
      { dehet: true, nl: 'buurmeisje', art: 'het', en: 'the girl next door', w: 'A compound takes the article of its last word: het meisje, so het buurmeisje.' },
    ] }]);
})();
