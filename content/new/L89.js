// Nachtrit, Urk (tier 8, B1): level 89 De mensen. The alleys of the old island, the harbour, the Vissersmonument,
// the Kerkje aan de Zee and the lighthouse, with a whole village that knows your business and, since the mist,
// so do the dead. Neighbours, small talk, the borrel, feelings, gossip, opinions, a small argument.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and
// voordat (also with a modal and an infinitive: moest uitlaten), the main clause that follows
// a sub-clause and starts with its verb (Als het regent, blijven we thuis), and want / dus / maar, which keep V2.
// Review from earlier tiers: the imperfectum (zag, wist, kwam), the perfectum with hebben and zijn (ontmoet,
// gekomen), a reflexive (zich voelen), the superlative (de aardigste), zou plus infinitive for a polite request,
// the present tense endings behind je.
// Still inside the fence: 14 words max, no relative clauses, no te + infinitive drills, no passive, no hoewel.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, imperfectum,
// reflexieve werkwoorden, perfectum; 04 - Phrases & Scenarios/Borrel met vrienden (Het was weer gezellig, Ik moet
// zo naar huis, de honden wachten, Zullen we het even splitten), De nieuwe buren ontmoeten (Mag ik me even
// voorstellen, Welkom in de buurt, Als je hulp nodig hebt, klop maar aan); _site/situations/opinions,
// small-talk, neighbours; _site/maps/MOC Gevoel & uitdrukkingen (chagrijnig, verdrietig, jarig), MOC Voegwoorden
// (omdat, als, dat, toen, terwijl, want, dus, maar); content/towns.js for Urk (de vissersvloot, de klederdracht,
// de kraplap, de zondagsrust, de kark, Op zondag vaart hier niemand uit, the Sunday joke).
// New rules: none (bijzin, v2, imp, perf, aux, refl, presens, vergelijk and zou are guarded below).
// New props: none. Used: kerk, deur, water.
(() => {
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 89, act: 8, name: 'De mensen', town: 'urk', place: 'mensen', theme: 'street', ...P,
    intro: 'On Urk everybody knows your business, and since the mist the dead do too. They are still waiting for you to split the bill.',
    introNl: 'Op Urk weet iedereen alles van je, en sinds de mist de doden ook. Ze wachten nog steeds tot jij de rekening splitst.',
    mission: {
      where: 'The alleys of Urk, from the harbour with its fishing cutters up past the lighthouse to the Kerkje aan de Zee, and on to the stone woman of the Vissersmonument, who has been looking at the water since 1968. Nobody is in a hurry. Everybody has an opinion.',
      carry: 'A tray of bitterballen for the borrel, two leads, because the dogs always need a walk, and a bill already split to the cent. The grammar book, never opened. No helmet. The women in their kraplap are still taller than you.',
      want: 'On Urk the dead make small talk in Sunday clothes: the neighbours, the feelings, the gossip, who is angry with whom, and why. Every because, every when and every while sends the verb to the very end. Get it wrong and the whole alley falls silent, which nobody on Urk has ever heard.' },
    items: [
      // ---- builds: sub-clauses with the verb at the end (new at tier 8)
      { en: "I'm happy because the neighbours are giving a borrel.", parts: ['Ik ben blij', FK(['omdat geven de buren een borrel', 'omdat de buren een borrel geven', 'omdat de buren geven een borrel'], 1, 'bijzin',
        'omdat opens a sub-clause: the verb goes to the very end, geven.'), '.'] },
      { en: 'When we got to Urk, the whole village was in church.', parts: ['Toen we op Urk', FK(['kwam', 'kwamen', 'komen'], 1, 'bijzin',
        'Past and plural: we kwamen. toen sends it to the end of the clause.'), ',', FK(['het hele dorp zat', 'zat het hele dorp'], 1, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: zat het hele dorp.'), 'in de kerk.'] },
      { en: 'If it rains on Sunday, we stay at home.', parts: ['Als', FK(['regent het zondag', 'het zondag regent'], 1, 'bijzin',
        'als opens a sub-clause: the verb goes to the end, so het zondag regent.'), ',', FK(['blijven we', 'we blijven'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: blijven we.'), 'thuis.'] },
      { en: 'While the men are fishing, the women talk in the harbour.', parts: ['Terwijl', FK(['vissen de mannen', 'de mannen vissen'], 1, 'bijzin',
        'terwijl opens a sub-clause: the verb goes to the end, de mannen vissen.'), ',', FK(['de vrouwen praten', 'praten de vrouwen'], 1, 'bijzin',
        'Sub-clause first, so the main clause starts with its verb: praten de vrouwen.'), 'in de haven.'] },
      { en: 'Before you leave, I want to say something.', parts: ['Voordat je', FK(['gaan', 'ga', 'gaat'], 2, 'presens',
        'Behind je the verb takes -t, even at the end of a sub-clause: je gaat.'), ',', FK(['ik wil', 'wil ik'], 1, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: wil ik.'), 'nog iets zeggen.'] },
      { en: 'I think the neighbour is shy.', parts: ['Ik denk dat de buurvrouw', FK(['is verlegen', 'verlegen is'], 1, 'bijzin',
        'dat opens a sub-clause: the verb goes to the end, verlegen is.'), '.'] },
      { en: "I'm going home, because the dogs are waiting for me.", parts: ['Ik ga naar huis,', FK(['want de honden op me wachten', 'want de honden wachten op me'], 1, 'v2',
        'want is not a sub-clause word. It keeps the normal order, with the verb in second place.'), '.'] },
      { en: "It's Sunday, so the shops are closed.", parts: ['Het is zondag, dus', FK(['de winkels dicht zijn', 'de winkels zijn dicht'], 1, 'v2',
        'dus does not send the verb to the end. The order stays normal: de winkels zijn dicht.'), '.'] },
      { en: "I think it's going to be cosy tonight.", parts: ['Ik denk dat het vanavond', FK(['wordt gezellig', 'gezellig wordt'], 1, 'bijzin',
        'dat opens a sub-clause: wordt goes to the end.'), '.'] },
      { en: "I was late because I still had to walk the dogs.", parts: ['Ik was te laat', FK(['omdat ik moest de honden nog uitlaten', 'omdat ik de honden nog moest uitlaten', 'omdat moest ik de honden nog uitlaten'], 1, 'bijzin',
        'omdat sends both verbs to the end: nog moest uitlaten.'), '.'] },
      { en: 'If you have a question, you can always call me.', parts: ['Als je een vraag', FK(['heb', 'hebt', 'heeft'], 1, 'presens',
        'Behind je the verb takes -t: je hebt.'), ',', FK(['kun je', 'je kunt'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: kun je.'), 'me altijd bellen.'] },

      // ---- builds: review of earlier tiers, inside the same kind of sentence
      { en: 'When I first saw Paola, I knew it immediately.', parts: ['Toen ik Paola voor het eerst', FK(['zag', 'zie', 'zien'], 0, 'imp',
        'toen talks about one moment in the past, so the imperfectum: zag.'), ',', FK(['wist ik', 'ik wist'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: wist ik.'), 'het meteen.'] },
      { en: 'When the mist came, all the Urkers went inside.', parts: ['Toen de mist', FK(['komt', 'kwam', 'komen'], 1, 'imp',
        'komen is irregular in the imperfectum: kwam. toen needs a past tense.'), ',', FK(['alle Urkers gingen', 'gingen alle Urkers'], 1, 'bijzin',
        'Sub-clause first, so the main clause starts with its verb: gingen alle Urkers.'), 'naar binnen.'] },
      { en: 'I felt at home because everybody was so friendly.', parts: ['Ik voelde', FK(['zich', 'je', 'me'], 2, 'refl',
        'voelen is reflexive here, and it follows the subject: ik voel me, so ik voelde me.'), 'thuis', FK(['omdat iedereen was zo aardig', 'omdat iedereen zo aardig was'], 1, 'bijzin',
        'omdat sends the verb to the end: zo aardig was.'), '.'] },
      { en: 'I think the pastor is the nicest man on Urk.', parts: ['Ik denk dat de dominee de', FK(['aardigste', 'aardiger', 'aardigst'], 0, 'vergelijk',
        'The superlative before a noun gets -ste: de aardigste man.'), 'man van Urk is.'] },
      { en: 'Could you call the neighbour for a second?', parts: ['Zou je de buurvrouw even kunnen', FK(['te bellen', 'gebeld', 'bellen'], 2, 'zou',
        'zou plus kunnen sends the main verb to the end as a bare infinitive.'), '?'] },
      { en: 'Have you met the new neighbour yet?', parts: [FK(['Ben', 'Heb'], 1, 'aux',
        'ontmoeten takes hebben, not zijn: heb je ontmoet.'), 'je de nieuwe buurman al', FK(['geontmoet', 'ontmoet', 'ontmoeten'], 1, 'perf',
        'ont- verbs never take ge: ontmoet.'), '?'] },
      { en: 'The pastor came to visit yesterday.', parts: ['De dominee', FK(['heeft', 'is'], 1, 'aux',
        'Coming is movement to a place, so zijn: is gekomen.'), 'gisteren op bezoek', FK(['gekomd', 'gekomen', 'gekomt'], 1, 'perf',
        'komen is irregular: gekomen.'), '.'] },

      // ---- words: people, feelings, gossip (nouns carry their article, adjectives stand alone)
      { w: 'the neighbours', nl: 'de buren', wrong: 'het buren' }, { w: 'the neighbour (woman)', nl: 'de buurvrouw' },
      { w: 'the conversation', nl: 'het gesprek', wrong: 'de gesprek' }, { w: 'the opinion', nl: 'de mening' },
      { w: 'the argument', nl: 'de ruzie' }, { w: 'the feeling', nl: 'het gevoel' },
      { w: 'the invitation', nl: 'de uitnodiging' }, { w: 'the present', nl: 'het cadeau', wrong: 'de cadeau' },
      { w: 'the family', nl: 'het gezin', wrong: 'de gezin' }, { w: 'the fisherman', nl: 'de visser' },
      { w: 'the pastor', nl: 'de dominee' }, { w: 'the community', nl: 'de gemeenschap' },
      { w: 'the rumour', nl: 'het gerucht', wrong: 'de gerucht' }, { w: 'the joke', nl: 'de grap' },
      { w: 'the surprise', nl: 'de verrassing' }, { w: 'the colleague', nl: 'de collega' }, { w: 'the guest', nl: 'de gast' },
      { w: 'the boss', nl: 'de baas' }, { w: 'the problem', nl: 'het probleem', wrong: 'de probleem' },
      { w: 'the fishing cutter', nl: 'de kotter' }, { w: 'the Sunday rest', nl: 'de zondagsrust' },
      { w: 'angry', nl: 'boos' }, { w: 'happy', nl: 'blij' }, { w: 'shy', nl: 'verlegen' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'Ik ben boos omdat je mijn fiets hebt meegenomen.', o: ['I am angry because you took my bike.', 'You are angry because I took your bike.', 'I took your bike because I was angry.'], a: 0, r: 'bijzin',
        w: 'omdat gives the reason: you took the bike, so I am angry. The one who is angry is ik, the one who took the bike is je.' },
      { read: true, nl: 'Terwijl de honden slapen, drinken de buren koffie.', o: ['While the dogs sleep, the neighbours drink coffee.', 'After the dogs sleep, the neighbours drink coffee.', 'While the neighbours sleep, the dogs drink coffee.'], a: 0, r: 'bijzin',
        w: 'terwijl means while, both things happen at once. The dogs sleep, the neighbours drink. After would be nadat.' },
      { read: true, nl: 'Voordat je gaat, moet je even bij de buurvrouw langs.', o: ["Before you go, you have to stop by the neighbour's.", "After you go, you have to stop by the neighbour's.", 'When you go, the neighbour has to stop by.'], a: 0, r: 'bijzin',
        w: 'voordat means before. Moet je langs means you are the one who has to stop by, not the neighbour.' },
      { read: true, nl: 'Het was gezellig, maar ik moet nu echt naar huis.', en: 'It was lovely, but I really have to go home now.' },
      { read: true, nl: 'Omdat het zondag is, vaart hier niemand uit.', en: 'Because it is Sunday, nobody sails out here.' },
      { read: true, nl: 'Op Urk kent iedereen elkaar, dus de buren weten het al.', en: 'On Urk everyone knows each other, so the neighbours already know.' },

      // ---- listens: two Urk words and one Dutch favourite
      { listen: true, nl: 'de vissersvrouw', en: "the fisherman's wife" }, { listen: true, nl: 'gezellig', en: 'cosy, convivial' },
      { listen: true, nl: 'de klederdracht', en: 'the traditional dress' },

      // ---- looks: the church, the neighbour's door, the water of the IJsselmeer
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },

      // ---- de of het
      { dehet: true, nl: 'gezelligheid', art: 'de', en: 'the cosiness', w: 'Words ending in -heid are always de.' },
      { dehet: true, nl: 'monument', art: 'het', en: 'the monument', w: 'Words ending in -ment are het: het monument, het moment.' },
    ] }]);
})();
