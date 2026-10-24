// Nachtrit, Rotterdam (tier 7, A2 to B1): level 81 De mensen. Meeting people, neighbours, small talk, the borrel,
// feelings and arguments, told in the past and asked politely. Grounded in Rotterdam: the Markthal and the
// kubuswoningen at Blaak, De Zwaan (the Erasmusbrug), the Witte Huis by the Oude Haven, the Euromast, the harbour,
// the water taxi, a bakkie pleur and Niet lullen maar poetsen.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip on the infinitive stem (kletste,
// zwaaide, voelde, verveelde, herinnerde, luisterde against maakte, werkte; -te and -de, singular against plural -den),
// the common irregulars (was/waren, had/hadden, ging/gingen, kwam/kwamen, zag, bleef/bleven, won), reflexive verbs with
// the self-word right after the verb (voelde me, voelden zich, herinnerde me, verveelden zich, Mag ik me even voorstellen,
// Voel je je al beter), zou plus an infinitive for polite requests (Zou je ... kunnen zetten, Ik zou graag ... willen),
// comparatives and superlatives (langer dan, hoger, beter, de gezelligste, the oo that loses an o in hoger).
// Review of earlier tiers: perfectum (heeft opgegeten, heb me vergist), V2 after a time word or volgens mij, geen against
// niet, separable verbs, modals, de against het.
// Still inside the fence: 12 words max, no omdat/dat/als/toen clauses with the verb at the end (toen appears only as an
// adverb in slot 1 and dus only as a plain linking word), no relative clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum, reflexieve werkwoorden, 't kofschip, elkaar, V2 word order,
// open vs gesloten lettergreep, zachtmakers, and _site/grammar/trappen-van-vergelijking-comparison;
// 03 - Verbs/zich voelen and zullen (Zou je me kunnen helpen, Ik zou graag een kopje koffie willen);
// 04 - Phrases & Scenarios/Borrel met vrienden (Hoe is het, Het was weer gezellig, Ik moet zo naar huis),
// De nieuwe buren ontmoeten (Mag ik me even voorstellen, Kan ik even iets lenen, een ladder), Koffiepraatje op kantoor;
// _site/situations/neighbours, friends (Ik moet ervandoor);
// _site/words (de ruzie, de mening, de buurvrouw, de collega, de grap, het plezier, zwaaien, zich vergissen,
// zich herinneren, het verdriet);
// content/towns.js for Rotterdam (de haven, de wolkenkrabber, de watertaxi, een bakkie pleur, Niet lullen maar poetsen,
// De Erasmusbrug als De Zwaan, De Markthal, De kubuswoningen, De Euromast, Het Witte Huis, the harbour joke).
// New rules: zou (note zullen) and vergelijk (note trappen-van-vergelijking-comparison), both guarded below.
// New props: none. Only hond, brug and deur are used (the word pool has no voordeur, no hondje and no
// Erasmusbrug, so no right-looking wrong sign appears beside those props).
(() => {
  window.RULES.zou = window.RULES.zou || { name: 'zou + infinitive: polite requests', note: 'zullen' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 81, act: 7, name: 'De mensen', town: 'rotterdam', place: 'mensen', theme: 'square', ...P,
    intro: 'The mist came and everyone who spoke Dutch changed, but nobody in Rotterdam noticed because they were working. They still split the bill.',
    introNl: 'De mist kwam en iedereen die Nederlands sprak veranderde, maar in Rotterdam merkte niemand het, want ze waren aan het werk. De rekening delen ze nog steeds.',
    mission: {
      where: 'Under the Markthal and past the cube houses at Blaak, tipped on one corner like a man who skipped the last round, to a borrel on the quay at the Oude Haven, under the Witte Huis. De Zwaan, as the Erasmusbrug is called here, stands a short ride away on the river and says nothing.',
      carry: 'Two dogs on a lead, a bottle for the host, a bakkie pleur gone cold, and the grammar book, still unopened. No helmet. The tram has right of way and knows it.',
      want: 'The dead want to talk about the past: what you did, who you met, how you felt. Tell it in the imperfectum, use me, je or zich for the feelings, and say zou for every request. The women are still taller than you and the dogs still need a walk. In Rotterdam they say niet lullen maar poetsen, so keep it short.' },
    items: [
      // ---- builds: the story in the imperfectum, regular by 't kofschip and the irregulars
      { en: 'Then the mist came and everyone changed.', parts: ['Toen', FK(['kwam', 'kwamen', 'komde'], 0, 'imp',
        'komen is irregular: kwam for one thing, kwamen for more. De mist is one thing: kwam.'), 'de mist en iedereen', FK(['veranderde', 'veranderte', 'veranderden'], 0, 'kof',
        'verander ends in r, which is not a soft ketchup letter, so -de. Iedereen is one person: veranderde.'), '.'] },
      { en: 'In the port we did not chat, we worked.', parts: ['In de haven', FK(['kletsten', 'kletsde', 'kletste'], 0, 'kof',
        'klets ends in s, a soft ketchup letter, so -te. We is plural, so -ten: kletsten.'), 'we niet, we', FK(['werkten', 'werkde', 'werkte'], 0, 'kof',
        'werk ends in k, a soft ketchup letter, so -te, and we is plural: werkten.'), '.'] },
      { en: 'The neighbours came to our borrel and stayed until midnight.', parts: ['De buren', FK(['kwamen', 'kwam', 'komden'], 0, 'imp',
        'komen is irregular: kwamen for more than one. De buren is plural.'), 'op onze borrel en', FK(['bleven', 'bleef', 'blijfden'], 0, 'imp',
        'blijven is irregular: bleef for one, bleven for more. De buren is plural: bleven.'), 'tot middernacht.'] },
      { en: 'I saw her in the Markthal and I waved.', parts: ['Ik', FK(['zag', 'zagde', 'zien'], 0, 'imp',
        'zien is irregular: zag. Nothing is added, no -de and no -te.'), 'haar in de Markthal en ik', FK(['zwaaide', 'zwaaite', 'zwaaiden'], 0, 'kof',
        'zwaai ends in i, which is not a soft ketchup letter, so -de. Ik is one person: zwaaide.'), '.'] },
      { en: 'The women were taller than me, and they still are.', parts: ['De vrouwen', FK(['waren', 'was'], 0, 'imp',
        'De vrouwen is plural: waren. was is for one person.'), FK(['langer', 'meer lang', 'langere'], 0, 'vergelijk',
        'lang is a short adjective, so -er and then dan: langer dan ik. Dutch does not say meer lang.'), 'dan ik, en dat zijn ze nog steeds.'] },
      { en: 'Yesterday I did not feel like an argument, but the neighbour did.', parts: ['Gisteren', FK(['had', 'hadden', 'hadt'], 0, 'imp',
        'hebben is irregular: had for ik. hadden is for more than one.'), 'ik', FK(['geen', 'niet'], 0, 'neg',
        'zin is a noun with no article here, so geen: geen zin.'), 'zin in ruzie, maar de buurman wel.'] },
      { en: 'We argued about the dishes, and Paola won.', parts: ['Wij', FK(['maakten', 'maakte', 'maakde'], 0, 'kof',
        'maak ends in k, a soft ketchup letter, so -te. Wij is plural: maakten.'), 'ruzie over de afwas, en Paola', FK(['won', 'wonde', 'winde'], 0, 'imp',
        'winnen is irregular: won. Learn it as a word of its own.'), '.'] },

      // ---- builds: reflexive verbs, the self-word right after the verb
      { en: 'In Rotterdam I felt at home right away.', parts: ['In Rotterdam', FK(['voelde', 'voelden', 'voelte'], 0, 'kof',
        'voel ends in l, which is not a soft ketchup letter, so -de. Ik is one person: voelde.'), 'ik', FK(['me', 'zich', 'ons'], 0, 'refl',
        'ik takes me, right after the verb and ik. zich is for hij, zij and het.'), 'meteen thuis.'] },
      { en: 'Paola did not feel well, so we went home early.', parts: ['Paola voelde', FK(['zich', 'me', 'ons'], 0, 'refl',
        'Paola is zij, so the self-word is zich.'), 'niet lekker, dus we', FK(['gingen', 'ging', 'gegaan'], 0, 'imp',
        'gaan is irregular: ging for one, gingen for more. We is plural: gingen.'), 'vroeg naar huis.'] },
      { en: 'The dogs were bored, so I took them out.', parts: ['De honden', FK(['verveelden', 'verveelde', 'verveeld'], 0, 'kof',
        'verveel ends in l, so -de, and two dogs take -den: verveelden.'), FK(['zich', 'zij'], 0, 'refl',
        'De honden is zij, plural, so the self-word is zich. zij is a subject word and cannot stand after the verb.'), ', dus ik liet ze uit.'] },
      { en: 'At the borrel I no longer remembered her name.', parts: ['Op de borrel', FK(['herinnerde', 'herinnerte', 'herinnerden'], 0, 'kof',
        'herinner ends in r, so -de. Ik is one person: herinnerde.'), 'ik', FK(['me', 'zich', 'ons'], 0, 'refl',
        'ik takes me. The self-word follows the verb and ik.'), 'haar naam niet meer.'] },
      { en: 'May I introduce myself? I live next door.', parts: ['Mag ik', FK(['me', 'zich'], 0, 'refl',
        'ik takes me, and the self-word sits right after ik.'), 'even', FK(['voorstellen', 'stellen voor', 'voorstelen'], 0, 'sep',
        'After a modal the separable verb stays in one word at the end: voorstellen.'), '? Ik woon hiernaast.'] },
      { en: 'Are you feeling better yet?', parts: ['Voel je', FK(['je', 'jou', 'zich'], 0, 'refl',
        'je is both the subject and the self-word: voel je je. It looks like a typo and it is not.'), 'al', FK(['beter', 'gooder', 'meer goed'], 0, 'vergelijk',
        'goed is irregular: goed, beter, best.'), '?'] },

      // ---- builds: zou plus the infinitive, the polite request
      { en: 'Could you turn the music down a bit?', parts: [FK(['Zou', 'Zouden'], 0, 'zou',
        'je takes zou. Zouden is for wij, jullie and zij.'), 'je de muziek wat zachter', FK(['kunnen zetten', 'kan zetten', 'gekund zetten'], 0, 'zou',
        'zou asks for an infinitive at the end: kunnen zetten.'), '?'] },
      { en: 'Could you two help us for a moment with the ladder?', parts: ['Zouden jullie ons even', FK(['kunnen helpen', 'kan helpen', 'kunnen geholpen'], 0, 'zou',
        'zouden asks for an infinitive at the end: kunnen helpen.'), 'met de ladder?'] },
      { en: 'I would like a coffee, the Rotterdam way.', parts: ['Ik', FK(['zou', 'zouden'], 0, 'zou',
        'ik is one person: zou. Zouden is for more than one.'), 'graag een bakkie pleur', FK(['willen', 'wil', 'gewild'], 0, 'zou',
        'zou graag asks for an infinitive at the end: willen.'), '.'] },

      // ---- builds: comparatives and superlatives, then V2 and a perfectum review
      { en: 'The Euromast is much higher than the Witte Huis.', parts: ['De Euromast is veel', FK(['hoger', 'hooger', 'meer hoog'], 0, 'vergelijk',
        'hoog is short, so -er. The long oo loses one o before the ending: ho-ger.'), 'dan', FK(['het', 'de'], 0, 'dehet',
        'huis is a het-word: het Witte Huis.'), 'Witte Huis.'] },
      { en: 'This is the nicest borrel of the year.', parts: ['Dit is', FK(['de gezelligste', 'het gezelligst', 'de meest gezellig'], 0, 'vergelijk',
        'Before a noun the superlative is de plus -ste: de gezelligste borrel.'), 'borrel van het jaar.'] },
      { en: 'Actually, you are right.', parts: ['Eigenlijk', FK(['heb jij', 'jij hebt', 'hebt jij'], 0, 'v2',
        'Eigenlijk takes slot 1, so the verb comes second, and jij after it loses the -t: heb jij.'), 'gelijk.'] },
      { en: 'Who ate all the bitterballen?', parts: ['Wie', FK(['heeft', 'is'], 0, 'aux',
        'Eating is something you do, nothing moves: hebben.'), 'alle bitterballen', FK(['opgegeten', 'geopeten', 'opgeeten'], 0, 'sep',
        'opeten is separable: op goes in front of the participle of eten, and eten is irregular, gegeten: opgegeten.'), '?'] },

      // ---- words: people, the borrel, feelings, Rotterdam
      { w: 'the argument', nl: 'de ruzie' }, { w: 'the mood', nl: 'het humeur', wrong: 'de humeur' },
      { w: 'the opinion', nl: 'de mening' }, { w: 'the guest', nl: 'de gast' },
      { w: 'the stranger', nl: 'de vreemdeling' }, { w: 'the round of drinks', nl: 'het rondje', wrong: 'de rondje' },
      { w: 'the bitterballen', nl: 'de bitterballen', wrong: 'het bitterballen' }, { w: 'the smile', nl: 'de glimlach' },
      { w: 'the hug', nl: 'de knuffel' }, { w: 'the fun', nl: 'het plezier', wrong: 'de plezier' },
      { w: 'the silence', nl: 'de stilte' }, { w: 'the person from Rotterdam', nl: 'de Rotterdammer' },
      { w: 'the dock worker', nl: 'de havenarbeider' }, { w: 'the neighbourhood', nl: 'de buurt' },
      { w: 'the colleague', nl: 'de collega' }, { w: 'the joke', nl: 'de grap' },
      { w: 'the neighbour (a woman)', nl: 'de buurvrouw' },

      // ---- reads: three traps with their own options, three plain lines from the city and the borrel
      { read: true, nl: 'Sorry, ik heb me vergist.', o: ['Sorry, I made a mistake.', 'Sorry, I forgot.', 'Sorry, I was late.'], a: 0, r: 'refl',
        w: 'zich vergissen means to be mistaken. To forget is vergeten.' },
      { read: true, nl: 'Zou u dit kunnen herhalen?', o: ['Could you repeat this?', 'Did you repeat this?', 'Have you repeated this?'], a: 0, r: 'zou',
        w: 'zou plus an infinitive at the end is a polite request, not the past.' },
      { read: true, nl: 'De buren verhuisden vorig jaar.', o: ['The neighbours moved last year.', 'The neighbours are moving next year.', 'The neighbours have to move this year.'], a: 0, r: 'imp',
        w: 'verhuisden is the past, and vorig jaar means last year.' },
      { read: true, nl: 'Niet lullen maar poetsen.', en: 'Stop talking and get to work.' },
      { read: true, nl: 'Ze is een kop groter dan ik.', en: 'She is a head taller than me.' },
      { read: true, nl: 'Het was gezellig, maar ik moet er zo vandoor.', en: 'It was lovely, but I have to run in a minute.' },

      // ---- listens: two Rotterdam and people words, two verb forms by ear
      { listen: true, nl: 'de wolkenkrabber', en: 'the skyscraper' }, { listen: true, nl: 'het misverstand', en: 'the misunderstanding' },
      { listen: true, nl: 'ze kwamen', en: 'they came' }, { listen: true, nl: 'ik voelde me', en: 'I felt' },

      // ---- looks: the dog, the bridge, the neighbour's door
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'vriendschap', art: 'de', en: 'the friendship', w: 'Words ending in -schap are de: de vriendschap.' },
      { dehet: true, nl: 'gezelschap', art: 'het', en: 'the company', w: 'The exception to -schap: het gezelschap.' },
    ] }]);
})();
