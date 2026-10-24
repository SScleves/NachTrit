// Nachtrit, Maastricht (tier 11, B1 to B2): level 113 De mensen. The Vrijthof with its terraces, the Servaasbrug over the
// Maas, the Helpoort, a Friday borrel with a piece of vlaai, and a carnival where nobody can tell the living from the dead.
// Meeting people, neighbours, small talk, the borrel, feelings, opinions and the quarrel about who invited whom.
// New at tier 11 and drilled here: the passive with worden (de buren worden uitgenodigd, het verdrag werd getekend,
// er wordt gefeest, de vaatwasser moet uitgeruimd worden, door for the doer) and the perfect passive with zijn
// (de borrel is afgezegd); the plusquamperfectum with had or was plus participle (had gewerkt, was gegaan, was
// vertrokken, had ontmoet); indirect speech (zei dat ze moe was, vroeg of ik hem kende), with dat and of sending the
// verb to the end; dialect colour marked as such (de bomma, Noondezju).
// Review from earlier tiers: a comparative (lekkerder dan), a reflexive in the perfectum (ik heb me vergist), the
// imperfectum (kende), terwijl with the verb at the end and the main clause that follows starting with its verb, the
// separable participle (uitgenodigd, afgezegd), 't kofschip (gefeest, getekend, ontmoet).
// Still inside the fence: 16 words max, no idioms with modal particles beyond what earlier tiers used, no formal register.
// Sources: dutch-lessons vault, 02 - Grammar/zijn of hebben, perfectum, 't kofschip, bijzin - werkwoord naar het einde,
// V2 word order, scheidbare werkwoorden, reflexieve werkwoorden, de vs het; 03 - Verbs/worden; 04 - Phrases & Scenarios/
// Borrel met vrienden, De nieuwe buren ontmoeten; _site/sentences (De vaatwasser moet nog uitgeruimd worden, Komt u
// het afhalen of moet het bezorgd worden); _site/situations/neighbours, friends, small-talk, meeting-people;
// _site/words (worden, ontmoeten, kennismaken, gezellig, verdrietig); MOC Gevoel & uitdrukkingen;
// content/towns.js for Maastricht (het Vrijthof, de Sint-Servaasbrug, de Helpoort, het Gouvernement, de vlaai, het carnaval,
// de optocht, het verdrag, de bomma, Noondezju, the carnaval joke). The Dutch of the Sint-Servaas basilica stays at the
// level of a landmark; nothing about the town's history beyond the treaty is claimed.
// New rules: passief, plusq, indirect (guarded below; the note is the vault note that explains each). The existing ids
// v2, bijzin, sep, kof, perf, aux, refl, vergelijk, imp, dehet and cult are reused.
// New props: none. Used: hond, kerk, brug (no word item here has those answers).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'Passive: worden / zijn + participle', note: 'worden' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was + participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 113, act: 11, name: 'De mensen', town: 'maastricht', place: 'mensen', theme: 'square', ...P,
    intro: 'In Maastricht nobody asks who is alive and who is in costume. Everyone is polite to everyone, just in case, and they still split the bill.',
    introNl: 'In Maastricht vraagt niemand wie er leeft en wie er verkleed is. Iedereen is beleefd tegen iedereen, voor de zekerheid, en ze splitsen nog steeds de rekening.',
    mission: {
      where: 'The Vrijthof, where the café terraces face the basilica and the red tower of the Sint-Jan side by side, then past the Helpoort and down to the Servaasbrug and back. A Friday borrel is running on a terrace that never noticed the mist, with a piece of vlaai on every table. The hills are close, Belgium is closer, and the women are still taller than you.',
      carry: 'An invitation, a stack of beer mats, a piece of cherry vlaai split to the cent, two dogs, because the dogs always need a walk, and the grammar book, still never opened. No helmet. The cobbles do not care.',
      want: 'Since the mist everyone who spoke Dutch has changed, and in Maastricht they also put on a costume. The dead keep track of who was invited, who had already gone home and who said what to whom. Worden and a participle for what happens to people, had or was for what had already happened, and dat or of with the verb at the very end for what somebody said. Noondezju, as the locals say.' },
    items: [
      // ---- builds: the passive with worden and zijn
      { en: 'The neighbours are invited to the borrel today.', parts: ['De buren', FK(['worden', 'wordt'], 0, 'passief',
        'Plural subject, so worden: de buren worden uitgenodigd.'), 'vandaag', FK(['uitgenodigd', 'geuitnodigd', 'uitnodigd'], 0, 'sep',
        'The ge sits in the middle of a separable verb: uit + genodigd, one word at the end.'), 'voor de borrel.'] },
      { en: 'Everyone is warmly welcomed with a piece of vlaai.', parts: ['Iedereen', FK(['wordt', 'worden'], 0, 'passief',
        'iedereen is singular, even though it means many people: wordt.'), 'hartelijk', FK(['ontvangen', 'geontvangen', 'ontvangt'], 0, 'perf',
        'ont- verbs never take ge, and the passive needs the participle: wordt ontvangen.'), 'met een stuk vlaai.'] },
      { en: 'The treaty was signed here in 1992.', parts: ['Het verdrag', FK(['werd', 'werden'], 0, 'passief',
        'One treaty, in the past: werd getekend. werden is for several things.'), 'hier in 1992', FK(['getekend', 'getekent', 'geteken'], 0, 'kof',
        'teken ends in n, no ketchup letter, so -d: getekend.'), '.'] },
      { en: 'At carnaval people party for three days.', parts: ['Met carnaval', FK(['wordt er', 'er wordt'], 0, 'v2',
        'Met carnaval fills slot 1, so the verb comes next: wordt er.'), 'drie dagen', FK(['gefeest', 'gefeesd', 'gefeestt'], 0, 'kof',
        'feest already ends in a t, and Dutch does not add a second one: gefeest.'), '.'] },
      { en: 'Before the borrel the dishwasher still has to be emptied.', parts: ['Voor de borrel', FK(['moet de vaatwasser', 'de vaatwasser moet'], 0, 'v2',
        'Voor de borrel fills slot 1, so the verb comes next: moet de vaatwasser.'), 'nog', FK(['uitgeruimd worden', 'uitgeruimd wordt', 'geuitruimd worden'], 0, 'passief',
        'After moet the second verb is an infinitive at the end: uitgeruimd worden. The ge goes in the middle of uit + geruimd.'), '.'] },
      { en: 'I am happy that I am invited every Friday.', parts: ['Ik ben blij dat ik elke vrijdag', FK(['uitgenodigd word', 'uitgenodigd wordt', 'uitgenodigd worden'], 0, 'passief',
        'dat sends the verbs to the end. ik takes the bare stem: ik word. The -t belongs to hij, zij and het.'), '.'] },
      { en: 'Unfortunately the borrel has been cancelled.', parts: ['De borrel', FK(['is', 'heeft'], 0, 'passief',
        'A passive in the perfect takes zijn, never hebben: de borrel is afgezegd.'), 'helaas', FK(['afgezegd', 'geafzegd', 'afzegd'], 0, 'sep',
        'The ge goes in the middle: af + gezegd. zeg ends in g, no ketchup letter, so -d.'), '.'] },
      { en: 'The party is always organised by the neighbours.', parts: ['Het feestje wordt altijd georganiseerd', FK(['door', 'van'], 0, 'passief',
        'The one who does it in a passive sentence comes with door: door de buren.'), 'de buren.'] },

      // ---- builds: the plusquamperfectum
      { en: 'When we arrived at the Helpoort, everyone had already left.', parts: ['Toen we bij de Helpoort aankwamen,', FK(['was iedereen', 'iedereen was'], 0, 'v2',
        'After a toen-clause the main clause starts with its verb: was iedereen.'), 'al', FK(['vertrokken', 'gevertrokken', 'vertrokt'], 0, 'plusq',
        'was + participle is the plusquamperfectum. vertrekken is irregular and has no ge: vertrokken.'), '.'] },
      { en: 'Before that evening I had never met the neighbours.', parts: ['Voor die avond', FK(['had ik', 'ik had'], 0, 'v2',
        'Voor die avond fills slot 1, so the verb comes next: had ik.'), 'de buren nog nooit', FK(['ontmoet', 'ontmoetd', 'geontmoet'], 0, 'kof',
        'ont- verbs take no ge, and ontmoet already ends in a t, so no second one: ontmoet.'), '.'] },
      { en: 'Paola had already gone to bed.', parts: ['Paola', FK(['was', 'had'], 0, 'plusq',
        'Going somewhere takes zijn, so the plusquamperfectum is was gegaan.'), 'al naar bed', FK(['gegaan', 'gegaat', 'gaan'], 0, 'perf',
        'gaan has its own participle: gegaan.'), '.'] },
      { en: 'Santi had worked until late, so he was tired at the borrel.', parts: ['Santi', FK(['had', 'was'], 0, 'plusq',
        'Working goes nowhere, so hebben: had gewerkt.'), 'tot laat gewerkt, daarom', FK(['was hij', 'hij was'], 0, 'v2',
        'daarom is not a conjunction: it fills slot 1, so the verb comes right after it.'), 'moe op de borrel.'] },
      { en: 'Paola was angry because I had come home too late.', parts: ['Paola was boos omdat ik te laat thuis', FK(['was gekomen', 'had gekomen'], 0, 'plusq',
        'komen is movement towards a place, so zijn: was gekomen. omdat sends both verbs to the end.'), '.'] },

      // ---- builds: indirect speech
      { en: 'Paola said that she was tired.', parts: ['Paola zei dat ze', FK(['moe was', 'was moe'], 0, 'indirect',
        'dat opens a sub-clause, so the verb goes to the very end: moe was.'), '.'] },
      { en: 'He asked whether I knew the neighbour.', parts: ['Hij vroeg', FK(['of', 'om'], 0, 'indirect',
        'A reported yes-or-no question takes of: vroeg of ik ... kende. om does not open a clause here.'), 'ik de buurman', FK(['kende', 'kenden'], 0, 'imp',
        'One person, ik: kende. kenden belongs to wij and zij.'), '.'] },
      { en: 'My neighbours said that they are moving next month.', parts: ['Mijn buren', FK(['zeiden', 'zei'], 0, 'imp',
        'Several neighbours, so the plural zeiden.'), 'dat ze volgende maand', FK(['verhuizen', 'verhuist', 'verhuisd'], 0, 'indirect',
        'After dat the verb goes to the end. ze is plural here, so verhuizen.'), '.'] },
      { en: 'He said that he had already invited the neighbours.', parts: ['Hij zei dat hij de buren al', FK(['had uitgenodigd', 'had uitnodigd', 'had geuitnodigd'], 0, 'sep',
        'dat sends the verbs to the end. The participle of uitnodigen has its ge in the middle: uitgenodigd.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'The vlaai in Maastricht is tastier than in Rotterdam.', parts: ['De vlaai in Maastricht is', FK(['lekkerder', 'lekkerer', 'meer lekker'], 0, 'vergelijk',
        'After an r the comparative takes -der: lekkerder, followed by dan.'), 'dan in Rotterdam.'] },
      { en: 'Sorry, I made a mistake, that is not my coat.', parts: ['Sorry, ik', FK(['heb', 'ben'], 0, 'aux',
        'A reflexive verb takes hebben in the perfectum: ik heb me vergist.'), 'me', FK(['vergist', 'gevergist', 'vergissen'], 0, 'refl',
        'ver- verbs take no ge, and zich vergissen is reflexive: vergist.'), ', dat is niet mijn jas.'] },
      { en: 'While the neighbours argue, we drink coffee.', parts: ['Terwijl de buren ruzie', FK(['maken', 'maakt'], 0, 'bijzin',
        'terwijl sends the verb to the end. De buren is plural, so maken.'), ',', FK(['drinken we', 'we drinken'], 0, 'v2',
        'The sub-clause fills slot 1, so the main clause starts with its verb: drinken we.'), 'koffie.'] },

      // ---- words: people, feelings, the borrel, the carnaval
      { w: 'the introduction (first meeting)', nl: 'de kennismaking' }, { w: 'the wedding', nl: 'de bruiloft' },
      { w: 'the company (people around you)', nl: 'het gezelschap', wrong: 'de gezelschap' }, { w: 'the gossip', nl: 'het geroddel', wrong: 'de geroddel' },
      { w: 'the joke', nl: 'de grap' }, { w: 'the host', nl: 'de gastheer' }, { w: 'the birthday', nl: 'de verjaardag' },
      { w: 'the present', nl: 'het cadeau' }, { w: 'the family (parents and children living together)', nl: 'het gezin', wrong: 'de gezin' },
      { w: 'grandma (Maastricht dialect, in Dutch: oma)', nl: 'de bomma' }, { w: 'the carnival parade', nl: 'de optocht' },
      { w: 'the treaty', nl: 'het verdrag', wrong: 'de verdrag' }, { w: 'the invitation', nl: 'de uitnodiging' },
      { w: 'the neighbour (woman)', nl: 'de buurvrouw' }, { w: 'the conversation', nl: 'het gesprek' },
      { w: 'jealous', nl: 'jaloers' }, { w: 'shy', nl: 'verlegen' },

      // ---- reads: five traps with their own options, one plain
      { read: true, nl: 'Mijn bomma werd uitgenodigd door de buurvrouw.', o: ['My grandma was invited by the neighbour.', 'My grandma invited the neighbour.', 'The neighbour was invited by my grandma.'], a: 0, r: 'passief',
        w: 'werd uitgenodigd is the passive: the subject is the one who is invited. door introduces the one who does the inviting.' },
      { read: true, nl: 'Paola zei dat ze me had gebeld.', o: ['Paola said she had called me.', 'Paola said I had called her.', 'Paola said she would call me.'], a: 0, r: 'indirect',
        w: 'zei dat ze ... had gebeld is a report of something already done. Ze is most naturally Paola herself, and me is Santi.' },
      { read: true, nl: 'Toen we aankwamen, was het feest al afgelopen.', o: ['When we arrived, the party had already ended.', 'When we arrived, the party was just starting.', 'When we arrive, the party will be over.'], a: 0, r: 'plusq',
        w: 'was ... afgelopen with al: it was over before they got there.' },
      { read: true, nl: 'Ze vroeg of de borrel was afgezegd.', o: ['She asked whether the borrel had been cancelled.', 'She said that the borrel had been cancelled.', 'She asked who had cancelled the borrel.'], a: 0, r: 'indirect',
        w: 'vroeg of turns a yes-or-no question into a report. was afgezegd is the passive in the past: it had been cancelled.' },
      { read: true, nl: 'Noondezju. Het is weer carnaval.', o: ['Damn it. It is carnival again.', 'Welcome. Carnival is starting.', 'Sorry. Carnival is over.'], a: 0, r: 'cult',
        w: 'Noondezju is Maastricht dialect, a mild curse or a sigh of surprise. weer means again.' },
      { read: true, nl: 'Doe mij maar een stuk kersenvlaai.', en: 'I will have a piece of cherry tart.' },

      // ---- listens: four by ear, from the people and the town
      { listen: true, nl: 'de ruzie', en: 'the quarrel' }, { listen: true, nl: 'het compliment', en: 'the compliment' },
      { listen: true, nl: 'uitgenodigd', en: 'invited' }, { listen: true, nl: 'de vlaai', en: 'the Limburg fruit tart' },

      // ---- looks: the dog, the church, the bridge
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'vriendschap', art: 'de', en: 'the friendship', w: 'Words ending in -schap are de: de vriendschap. A few are het, like het gezelschap and het landschap.' },
      { dehet: true, nl: 'geheim', art: 'het', en: 'the secret', w: 'Many nouns starting with ge- are het: het geheim, het gesprek, het gevoel.' },
    ] }]);
})();
