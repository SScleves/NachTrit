// Nachtrit, Den Haag (tier 6, A2+): level 67 Thuis. A tall town house in yellow brick near the Haagse Markt,
// tram rails outside, Scheveningen and the sea past the dunes. Rooms, furniture, the family, the dogs, the wife,
// the daily routine, all told back as what you did today.
// New at tier 6 and drilled here: the perfectum with hebben and zijn (zijn for going somewhere, arriving, moving
// house and for zijn itself), regular participles by 't kofschip (gewerkt, gekookt, gefietst against gewoond),
// the single t of gepraat, common irregular participles (gegaan, geweest, gedaan, gezien, gegeten, gedronken,
// geslapen), separable participles (uitgelaten, opgebeld, aangekomen, uitgeruimd) and ver- with no ge (verhuisd).
// Still inside the fence: 10 words max, no omdat/dat/als clauses, no imperfectum, no relative clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, zijn of hebben, 't kofschip, V2 word order,
// scheidbare werkwoorden; 03 - Verbs/uitlaten; 04 - Phrases & Scenarios/Thuis met je vrouw (Schat ik ben thuis,
// Ik heb een lange dag gehad, Het ruikt heerlijk, Ik ruim de vaatwasser wel in / uitruimen);
// _site/words (de verwarming, de rommel, de zus, de moeder, het schilderij, de wc, de schat);
// MOC Lidwoorden & voornaamwoorden (mijn, ons/onze);
// content/towns.js for Den Haag (de minister, het debat, het strand, het reuzenrad, Het Torentje,
// Dat is geen antwoord op mijn vraag., the Binnenhof joke).
// New rules: none (perf, aux, kof, sep, v2, mag are in data.js; presens and bezit guarded below).
// New props: none. Only hond, huis and tuin are used (not deur or lamp: de voordeur and het licht are in the
// word pool and would be right answers for those props).
(() => {
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 67, act: 6, name: 'Thuis', town: 'denhaag', place: 'thuis', theme: 'street', ...P,
    intro: 'In Den Haag everyone is important, or works for someone who is. At home that someone is Paola.',
    introNl: 'In Den Haag is iedereen belangrijk, of werkt voor iemand die belangrijk is. Thuis is dat Paola.',
    mission: {
      where: 'A tall house in yellow brick near the Haagse Markt, tram rails outside the door. From the attic down to the hall, and out to the beach at Scheveningen because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the house keys, a punnet of strawberries split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The tram does not care.',
      want: 'Since the mist the dead hold a debate in every room about what you did today. Heb or ben, then the participle at the very end. Paola, still taller than you, chairs the inquiry. In this city nobody else remembers anything, so you have to.' },
    items: [
      // ---- builds: hebben or zijn, and the participle at the end
      { en: "Honey, I'm home. I worked long hours today.", parts: ['Schat, ik ben thuis. Ik', FK(['heb', 'ben'], 0, 'aux',
        'Working is not going anywhere, so hebben: ik heb gewerkt.'), 'vandaag lang', FK(['gewerkt', 'gewerkd', 'gewerken'], 0, 'kof',
        'werk ends in k, a soft ketchup letter: gewerkt with a t.'), '.'] },
      { en: 'We used to live in Alblasserdam.', parts: ['We', FK(['hebben', 'zijn'], 0, 'aux',
        'Living somewhere is staying put, not moving: hebben.'), 'vroeger in Alblasserdam', FK(['gewoond', 'gewoont'], 0, 'kof',
        'woon ends in n, no ketchup letter: gewoond with a d.'), '.'] },
      { en: 'In May we moved to Den Haag.', parts: ['In mei', FK(['zijn we', 'we zijn'], 0, 'v2',
        'In mei takes slot 1, so the verb comes second, then we.'), 'naar Den Haag', FK(['verhuisd', 'geverhuisd', 'verhuist'], 0, 'perf',
        'ver- verbs never take ge. The stem verhuiz ends in z, which still takes -d (spelled s): verhuisd.'), '.'] },
      { en: 'Paola went to the Haagse Markt.', parts: ['Paola', FK(['is', 'heeft'], 0, 'aux',
        'Going somewhere takes zijn: Paola is gegaan.'), 'naar de Haagse Markt', FK(['gegaan', 'gegaat'], 0, 'perf',
        'gaan has its own participle: gegaan.'), '.'] },
      { en: "Paola's sister arrived this afternoon.", parts: ['De zus van Paola', FK(['is', 'heeft'], 0, 'aux',
        'Arriving is movement to a place: zijn.'), 'vanmiddag', FK(['aangekomen', 'geaankomen', 'aangekomt'], 0, 'sep',
        'The ge goes in the middle: aan + gekomen, written as one word at the end.'), '.'] },
      { en: "I've been home all day.", parts: ['Ik', FK(['ben', 'heb'], 0, 'aux',
        'zijn forms its own perfect with zijn: ik ben geweest.'), 'de hele dag thuis', FK(['geweest', 'gezijn', 'gebent'], 0, 'perf',
        'The participle of zijn is geweest. Learn it as a word of its own.'), '.'] },

      // ---- builds: 't kofschip and the single t
      { en: 'Paola cooked. It smells lovely.', parts: ['Paola heeft', FK(['gekookt', 'gekookd', 'gekoken'], 0, 'kof',
        'kook ends in k, a ketchup letter: gekookt with a t.'), '. Het ruikt heerlijk.'] },
      { en: 'On Sunday we cycled to Scheveningen.', parts: ['Zondag', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Zondag takes slot 1, so the verb comes before we.'), 'naar Scheveningen', FK(['gefietst', 'gefietsd', 'gefiets'], 0, 'kof',
        'fiets ends in s, a ketchup letter: ge + fiets + t, gefietst.'), '.'] },
      { en: 'On TV the minister talked for three hours.', parts: ['Op tv', FK(['heeft de minister', 'de minister heeft'], 0, 'v2',
        'Op tv takes slot 1, so heeft comes before de minister.'), 'drie uur', FK(['gepraat', 'gepraatt', 'gepraatd'], 0, 'kof',
        'praat already ends in a t, and Dutch does not add a second one: gepraat.'), '.'] },

      // ---- builds: irregular participles
      { en: 'The dogs have already eaten.', parts: ['De honden', FK(['hebben', 'heeft'], 0, 'presens',
        'Two dogs, plural: hebben.'), 'al', FK(['gegeten', 'geëten'], 0, 'perf',
        'eten is irregular: gegeten, not geëten.'), '.'] },
      { en: 'Yesterday we saw a film together.', parts: ['Gisteren', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Gisteren takes slot 1, the verb comes second, then we.'), 'samen een film', FK(['gezien', 'geziet', 'gezient'], 0, 'perf',
        'zien is irregular: gezien, nothing added.'), '.'] },
      { en: 'Who drank my coffee?', parts: ['Wie heeft', FK(['mijn', 'mij'], 0, 'bezit',
        'Before a noun, my is mijn. mij means me, as in geef het aan mij.'), 'koffie', FK(['gedronken', 'gedrinkt', 'gedronkt'], 0, 'perf',
        'drinken is irregular: gedronken, the i turns into an o.'), '?'] },
      { en: 'The dogs slept on our bed again.', parts: ['De honden hebben weer op', FK(['ons', 'onze'], 0, 'bezit',
        'bed is a het-word: ons bed. onze is for de-words.'), 'bed', FK(['geslapen', 'geslaapt'], 0, 'perf',
        'slapen is irregular: geslapen, not the kofschip -t.'), '.'] },

      // ---- builds: separable participles
      { en: 'I walked the dogs on the beach.', parts: ['Ik heb de honden op het strand', FK(['uitgelaten', 'geuitlaten', 'uitgelaat'], 0, 'sep',
        'The ge goes in the middle: uit + gelaten, written as one word at the end.'), '.'] },
      { en: 'Have you called your mother yet?', parts: [FK(['Heb', 'Hebt'], 0, 'presens',
        'In a question the verb comes first and drops its t before je: heb je.'), 'je je moeder al', FK(['opgebeld', 'geopbeld', 'opgebelt'], 0, 'sep',
        'ge goes between op and beld. bel has no ketchup letter, so -d: opgebeld.'), '?'] },
      { en: 'Have you emptied the dishwasher yet?', parts: ['Heb jij de vaatwasser al', FK(['uitgeruimd', 'geuitruimd', 'uitgeruimt'], 0, 'sep',
        'The ge goes in the middle: uit + geruimd. ruim ends in m, so -d.'), '?'] },

      // ---- words: rooms, furniture, the house, the family, the dogs
      { w: 'the hallway', nl: 'de gang' }, { w: 'the front door', nl: 'de voordeur' }, { w: 'the attic', nl: 'de zolder' },
      { w: 'the living room', nl: 'de woonkamer' }, { w: 'the toilet', nl: 'de wc' }, { w: 'the shower', nl: 'de douche' },
      { w: 'the table', nl: 'de tafel' }, { w: 'the chair', nl: 'de stoel' }, { w: 'the floor', nl: 'de vloer' },
      { w: 'the light', nl: 'het licht', wrong: 'de licht' }, { w: 'the duvet', nl: 'het dekbed', wrong: 'de dekbed' },
      { w: 'the balcony', nl: 'het balkon', wrong: 'de balkon' }, { w: 'the washing machine', nl: 'de wasmachine' },
      { w: 'the vacuum cleaner', nl: 'de stofzuiger' }, { w: 'the heating', nl: 'de verwarming' },
      { w: 'the housework', nl: 'het huishouden', wrong: 'de huishouden' }, { w: 'the mother-in-law', nl: 'de schoonmoeder' },
      { w: 'the parents', nl: 'de ouders', wrong: 'het ouders' }, { w: 'the dog food', nl: 'het hondenvoer', wrong: 'de hondenvoer' },
      { w: 'the dog basket', nl: 'de hondenmand' },

      // ---- reads: three traps with their own options, three lines from the house and from the city
      { read: true, nl: 'Ik heb de honden al uitgelaten.', o: ['I have already walked the dogs.', 'I still have to walk the dogs.', 'I am walking the dogs.'], a: 0, r: 'perf',
        w: 'heb + uitgelaten at the end: it is done. al means already.' },
      { read: true, nl: 'Paola is naar haar moeder gegaan.', o: ["Paola went to her mother's.", "Paola is going to her mother's.", "Paola's mother has come over."], a: 0, r: 'aux',
        w: 'is + gegaan is the past: she went. Going later would be gaat.' },
      { read: true, nl: 'Je hoeft niet te koken.', o: ["You don't have to cook.", "You're not allowed to cook.", "You can't cook."], a: 0, r: 'mag',
        w: 'hoeft niet te: there is no need. Not allowed would be mag niet.' },
      { read: true, nl: 'Ik heb een lange dag gehad.', en: "I've had a long day." },
      { read: true, nl: 'Wat heb je vandaag gedaan?', en: 'What did you do today?' },
      { read: true, nl: 'Dat is geen antwoord op mijn vraag.', en: 'That is not an answer to my question.' },

      // ---- listens: two participles by ear, one Den Haag landmark
      { listen: true, nl: 'gegeten', en: 'eaten' }, { listen: true, nl: 'opgeruimd', en: 'tidied up' },
      { listen: true, nl: 'het reuzenrad', en: 'the Ferris wheel' },

      // ---- looks: the dog, the house, the garden behind it
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },

      // ---- de of het
      { dehet: true, nl: 'meubel', art: 'het', en: 'the piece of furniture', w: 'het meubel. The plural is de meubels, because every plural is de.' },
      { dehet: true, nl: 'schilderij', art: 'het', en: 'the painting' },
    ] }]);
})();
