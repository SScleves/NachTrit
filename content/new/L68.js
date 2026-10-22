// Nachtrit, Den Haag (tier 6, A2+): level 68 De winkels. The Haagse Markt, the shops behind the Binnenhof,
// the baker, the chemist, the pharmacy, a clothes shop with a fitting room and the herring cart at Scheveningen.
// New at tier 6 and drilled here: the perfectum with hebben and zijn (Ik heb gekocht, Ik ben naar de apotheek geweest),
// regular participles with 't kofschip (gepind, gepast, gekost, geruild, gedeeld, gewinkeld), common irregular
// participles (gekocht, gegaan, gegeten, gezien, geweest, gebakken), be- without ge- (betaald) and separable
// participles (teruggebracht, afgerekend, uitgegeven). 10 words max, no sub-clauses, no imperfectum.
// Sources: dutch-lessons vault, 02 - Grammar/perfectum (ge + stem + t/d, no ge- for be-, ge in the middle for separable verbs),
// 02 - Grammar/'t kofschip (pinnen, passen, kosten), 02 - Grammar/zijn of hebben (movement takes zijn, geweest takes zijn),
// _site/words ("Ik ben vanmorgen naar de markt geweest.", "We zijn vanmiddag naar de supermarkt gegaan.", ruilen, kopen,
// inpakken, de apotheek, de broek, de trui), _site/situations/supermarket (Kan ik pinnen?, Is dit in de aanbieding?,
// Wilt u een tasje erbij?), _site/situations/butcher (plakjes, aanbieding), and content/towns.js for Den Haag
// (de marktkraam, Wat kost een bakje aardbeien?, de minister, the Binnenhof, Scheveningen, de pier).
// New rules: none. aux, perf, kof, sep, v2, mag come from data.js; woord from levels.js.
// New props: none. Only winkel, nummer and water are used.
(() => {
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    { id: 68, act: 6, name: 'De winkels', town: 'denhaag', place: 'winkels', theme: 'shops', ...P,
      intro: 'Since the mist the shops in Den Haag only ask about the past. What did you buy? What did you pay? Who split the bill? It is a city of inquiries.',
      introNl: 'Sinds de mist vragen de winkels in Den Haag alleen nog naar het verleden. Wat heb je gekocht? Wat heb je betaald? Wie heeft de rekening gedeeld? Het blijft een stad van enquêtes.',
      mission: {
        where: 'The Haagse Markt, the shops behind the Binnenhof and its scaffolding, and the herring cart at Scheveningen.',
        carry: 'Paola\'s shopping list, a bag full of receipts and two dogs who want a walk on the beach. No helmet. The grammar book is in the bag, still unopened.',
        want: 'At every stall a dead man in a suit asks what you have done today, like a debate that never ends. Answer with heb or ben and the participle at the end. The women behind the counters are still taller than you, and they still split the bill to the cent.' },
      items: [
        // ---- builds: hebben or zijn, the participle at the end
        { en: 'I bought strawberries at the market.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux',
          'Buying is not moving anywhere, so hebben.'), 'aardbeien op de markt', FK(['gekocht', 'gekoopt', 'gekopen'], 0, 'perf',
          'kopen is irregular: gekocht. Learn it as one word.'), '.'] },
        { en: 'This morning we went to the Haagse Markt.', parts: ['Vanmorgen', FK(['zijn we', 'hebben we', 'we zijn'], 0, 'aux',
          'gaan is movement to a place, so zijn. Vanmorgen takes slot 1, so the verb comes before we.'), 'naar de Haagse Markt', FK(['gegaan', 'gegaat', 'gaan'], 0, 'perf',
          'gaan becomes gegaan. The participle closes the sentence.'), '.'] },
        { en: 'I have been to the pharmacy this morning.', parts: ['Ik', FK(['ben', 'heb'], 0, 'aux',
          'geweest always runs on zijn: ik ben geweest.'), 'vanmorgen naar de apotheek', FK(['geweest', 'gezijnd', 'geweesd'], 0, 'perf',
          'The participle of zijn is geweest.'), '.'] },
        { en: 'In Scheveningen we ate herring.', parts: ['In Scheveningen', FK(['hebben we', 'zijn we', 'we hebben'], 0, 'aux',
          'Eating takes hebben. The place in slot 1 pushes we behind the verb.'), 'haring', FK(['gegeten', 'gegeet', 'geëten'], 0, 'perf',
          'eten becomes gegeten, with a second g.'), '.'] },
        { en: 'Have you seen the offer yet?', parts: [FK(['Heb je', 'Ben je'], 0, 'aux',
          'Seeing takes hebben. In a question the verb comes first.'), 'de aanbieding al', FK(['gezien', 'gezient', 'gezeen'], 0, 'perf',
          'zien becomes gezien. No t at the end.'), '?'] },
        { en: 'The baker has baked fresh bread.', parts: ['De bakker heeft vers brood', FK(['gebakken', 'gebakt', 'bakken'], 0, 'perf',
          'bakken keeps its -en in the participle: gebakken.'), '.'] },
        { en: 'Paola has exchanged the jumper.', parts: ['Paola', FK(['heeft', 'is', 'hebt'], 0, 'aux',
          'Exchanging is not movement, so hebben, and Paola takes heeft.'), 'de trui', FK(['geruild', 'geruilt'], 0, 'kof',
          'ruil ends in l, not in soft ketchup, so -d: geruild.'), '.'] },
        { en: 'What did that coat cost?', parts: ['Wat', FK(['heeft', 'is'], 0, 'aux',
          'kosten takes hebben: wat heeft het gekost.'), 'die jas', FK(['gekost', 'gekosd', 'gekostet'], 0, 'kof',
          'The stem kost already ends in t, so the participle is gekost. No extra t.'), '?'] },
        // ---- builds: 't kofschip, t or d
        { en: 'I paid by card at the herring cart.', parts: ['Ik heb bij de haringkar', FK(['gepind', 'gepint', 'gepinnd'], 0, 'kof',
          'pin ends in n, not in soft ketchup, so -d: gepind. One n, the stem has one.'), '.'] },
        { en: 'I tried on the shoes, they are too small.', parts: ['Ik heb de schoenen', FK(['gepast', 'gepasd'], 0, 'kof',
          'pas ends in s, a soft ketchup letter, so -t: gepast.'), ', ze zijn te klein.'] },
        { en: 'We shopped in Den Haag all afternoon.', parts: ['We hebben de hele middag in Den Haag', FK(['gewinkeld', 'gewinkelt', 'gewinkelen'], 0, 'kof',
          'winkel ends in l, not in soft ketchup, so -d: gewinkeld.'), '.'] },
        { en: 'The minister split the bill too.', parts: ['De minister heeft de rekening ook', FK(['gedeeld', 'gedeelt', 'gedelen'], 0, 'kof',
          'deel ends in l, so -d: gedeeld. Even in Den Haag.'), '.'] },
        { en: 'Have you already paid? (polite)', parts: ['Heeft u al', FK(['betaald', 'gebetaald', 'betaalt'], 0, 'perf',
          'Verbs that start with be- get no ge-. The stem betaal ends in l, so -d: betaald.'), '?'] },
        // ---- builds: separable verbs, ge in the middle
        { en: 'I have taken the shirt back.', parts: ['Ik heb het overhemd', FK(['teruggebracht', 'geterugbracht', 'terugebracht'], 0, 'sep',
          'Separable verbs put ge in the middle: terug-ge-bracht.'), '.'] },
        { en: 'We paid at the checkout.', parts: ['We hebben bij de kassa', FK(['afgerekend', 'geafrekend', 'afgerekent'], 0, 'sep',
          'af-ge-rekend: ge goes after the prefix. reken ends in n, so -d.'), '.'] },
        { en: 'We have spent too much money.', parts: ['We hebben te veel geld', FK(['uitgegeven', 'geuitgeven', 'uitgegeefd'], 0, 'sep',
          'uitgeven: ge in the middle, and geven keeps its -en: uit-ge-geven.'), '.'] },

        // ---- words: the market, the till, the shops
        { w: 'the market stall', nl: 'de marktkraam' }, { w: 'the punnet', nl: 'het bakje', wrong: 'de bakje' },
        { w: 'the strawberries', nl: 'de aardbeien' }, { w: 'the herring cart', nl: 'de haringkar' }, { w: 'the herring', nl: 'de haring' },
        { w: 'the checkout', nl: 'de kassa' }, { w: 'the basket', nl: 'het mandje', wrong: 'de mandje' },
        { w: 'the groceries', nl: 'de boodschappen' }, { w: 'the shopping list', nl: 'het boodschappenlijstje', wrong: 'de boodschappenlijstje' },
        { w: 'the card reader', nl: 'het pinapparaat', wrong: 'de pinapparaat' }, { w: 'the change (money)', nl: 'het wisselgeld' },
        { w: 'the discount', nl: 'de korting' }, { w: 'the receipt', nl: 'de kassabon' }, { w: 'the fitting room', nl: 'de paskamer' },
        { w: 'the shirt', nl: 'het overhemd', wrong: 'de overhemd' }, { w: 'the chemist', nl: 'de drogist' },
        { w: 'the painkiller', nl: 'de pijnstiller' }, { w: 'the slice', nl: 'het plakje', wrong: 'de plakje' },
        { w: 'to pay (at the till)', nl: 'afrekenen' }, { w: 'to take back', nl: 'terugbrengen' },

        // ---- reads: three traps with their own options, three lines from the shops
        { read: true, nl: 'Je hoeft niet te betalen.', o: ["You don't have to pay.", "You're not allowed to pay.", "You shouldn't pay."], a: 0, r: 'mag',
          w: 'hoeft niet te is no need. mag niet is not allowed, moet niet is should not.' },
        { read: true, nl: 'De haring is op.', o: ['The herring is all gone.', 'The herring is on the counter.', 'The herring is open.'], a: 0, r: 'woord',
          w: 'op after zijn means used up, sold out. Het brood is op, de koffie is op.' },
        { read: true, nl: 'Ik ben naar de bakker geweest.', o: ["I've been to the baker's.", "I'm going to the baker's.", 'I was a baker.'], a: 0, r: 'aux',
          w: 'ben + geweest is the perfectum: it already happened. geweest always takes zijn.' },
        { read: true, nl: 'Ruilen kan binnen dertig dagen.', en: 'You can exchange within thirty days.' },
        { read: true, nl: 'Wat kost een bakje aardbeien?', en: 'How much is a punnet of strawberries?' },
        { read: true, nl: 'Ik heb al betaald.', en: 'I have already paid.' },

        // ---- listens: prices by ear and the herring cart
        { listen: true, nl: 'twee euro vijftig', en: '€ 2,50' }, { listen: true, nl: 'achtendertig euro negenennegentig', en: '€ 38,99' },
        { listen: true, nl: 'de haringkar', en: 'the herring cart' },

        // ---- looks: the shop, a price on the window, the sea at Scheveningen
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'nummer', value: 99, nl: 'negenennegentig', en: '99' },
        { look: true, prop: 'water', nl: 'het water', en: 'the water' },

        // ---- de of het
        { dehet: true, nl: 'bonnetje', art: 'het', en: 'the receipt', w: 'Every -je word is het: het bonnetje, het tasje, het plakje.' },
        { dehet: true, nl: 'aanbieding', art: 'de', en: 'the offer', w: 'Words ending in -ing are de.' },
      ] },
  ]);
})();
