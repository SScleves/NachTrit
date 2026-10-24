// Nachtrit, Groningen (tier 10, B1): level 105 De mensen. The student streets round the Grote Markt, the canal bridges
// stacked with bikes, the brown cafe where the Friday borrel never really stops and the Martinitoren keeping watch.
// Neighbours, small talk, the borrel, feelings, opinions and the argument about whose bike is on the bridge.
// New at tier 10 and drilled here: opinions with ik vind dat (verb at the end) and volgens mij (verb straight after);
// hoewel with the verb at the end and the main clause that follows it starting with its verb; ondanks plus a noun,
// never a clause; separable verbs inside sub-clauses (omdat hij de muziek aanzet, hoewel hij vroeg opstaat, dat ze
// langskomen); zullen with wel for probability (hij zal wel thuis zijn); diminutives and their het-article (het
// hondje, twee biertjes, het borreltje); the adjective -e in all cases (een gezellig feestje, het gezellige cafe, de
// aardige buurvrouw is chagrijnig).
// Review from earlier tiers: the imperfectum with 't kofschip (praatten), the perfectum with a separable verb
// (opgebeld), a reflexive (zich vervelen, hij verveelt zich), a comparative (groter dan).
// Still inside the fence: 16 words max, no passive, no plusquamperfectum, no indirect speech, no idioms with
// modal particles beyond wel.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, scheidbare werkwoorden, V2 word order,
// futurum - gaan + infinitief, zullen (03 - Verbs), de vs het, reflexieve werkwoorden, imperfectum, perfectum,
// 't kofschip; 04 - Phrases & Scenarios/Borrel met vrienden, De nieuwe buren ontmoeten, De standup - tech talk;
// _site/situations/opinions (ik vind, volgens mij, wat vind je van), small-talk, neighbours, friends, meeting-people;
// _site/words (hoewel, de mening, chagrijnig, het verdriet, hij zal wel ziek zijn,
// hij verveelt zich, het hondje, de afspraak, de vriendin); _site/maps MOC Gevoel & uitdrukkingen, MOC Voegwoorden;
// content/towns.js for Groningen (de student, de studentenkamer, de Grote Markt, de Martinitoren, d'Olle Grieze, Moi,
// Er gaat niets boven Groningen). The gas and earthquake material of the town entry is left out on purpose.
// New rules: mening, dim (guarded below; the note is the vault note that explains each). The existing ids bijzin,
// sep, v2, fut, adj, vergelijk, refl, imp, perf, dehet are reused.
// New props: none. Used: hond, fiets, brug (no word item here has those answers).
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 105, act: 10, name: 'De mensen', town: 'groningen', place: 'mensen', theme: 'square', ...P,
    intro: 'In Groningen the dead have opinions too, but they keep them short. Not bad counts as a speech of praise.',
    introNl: 'In Groningen hebben de doden ook meningen, maar ze houden het kort. Niet slecht is hier al een lofrede.',
    mission: {
      where: 'The student streets round the Grote Markt, the canal bridges stacked with bikes, and a brown cafe where the Friday borrel started before the mist and has not noticed that it ended. The Martinitoren watches from its corner. Everyone calls the city Stad, as if there were only one.',
      carry: 'An invitation to a borrel that nobody remembers sending, two dogs who need a walk (the dogs always need a walk), and the grammar book, still never opened. A bike with a crooked lamp and no helmet. The bridge does not care.',
      want: 'Since the mist the dead have opinions, and nobody asked. They argue about whose bike is blocking the bridge, they guess who is home, and they say not bad, which here is high praise. Every sentence has a trap: dat and hoewel send the verb to the end, ondanks only takes a noun, and a word ending in -je is always het. The women are still taller than you.' },
    items: [
      // ---- builds: opinions (ik vind dat, volgens mij, hoewel, ondanks)
      { en: 'I think the standup lasts too long.', parts: ['Ik vind dat de standup', FK(['te lang duurt', 'duurt te lang'], 0, 'mening',
        'dat opens a sub-clause, so the verb goes to the very end: te lang duurt.'), '.'] },
      { en: 'In my opinion the students are happy that it is the weekend.', parts: ['Volgens mij', FK(['zijn de studenten', 'de studenten zijn'], 0, 'mening',
        'Volgens mij fills slot 1, so the verb comes right after it, then the subject.'), 'blij dat het weekend is.'] },
      { en: 'Although the bridge is closed, the students just keep cycling.', parts: ['Hoewel de brug', FK(['dicht is', 'is dicht'], 0, 'mening',
        'hoewel opens a sub-clause: the verb goes to the end, dicht is.'), ',', FK(['fietsen de studenten', 'de studenten fietsen'], 0, 'v2',
        'After the sub-clause the main clause starts with its verb: fietsen de studenten.'), 'gewoon door.'] },
      { en: 'Although the neighbour gets up early, he is always grumpy.', parts: ['Hoewel de buurman vroeg', FK(['opstaat', 'staat op'], 0, 'sep',
        'In a sub-clause a separable verb stays in one piece at the end: opstaat.'), ',', FK(['is hij', 'hij is'], 0, 'v2',
        'The sub-clause fills slot 1, so the verb jumps in right after the comma: is hij.'), 'altijd chagrijnig.'] },
      { en: 'Despite the argument they are still friends.', parts: [FK(['Ondanks', 'Hoewel'], 0, 'hoewel',
        'ondanks is a preposition and takes a noun, de ruzie. hoewel needs a whole clause with its own verb.'), 'de ruzie', FK(['zijn ze', 'ze zijn'], 0, 'v2',
        'Ondanks de ruzie fills slot 1, so the verb comes next: zijn ze.'), 'nog vrienden.'] },
      { en: 'Paola is grumpy because the neighbour turns on the music in the middle of the night.', parts: ['Paola is chagrijnig omdat de buurman midden in de nacht de muziek', FK(['aanzet', 'zet aan'], 0, 'sep',
        'omdat sends the verb to the end, and a separable verb stays in one piece there: aanzet.'), '.'] },
      { en: 'I think the neighbours are coming by tonight.', parts: ['Ik denk dat de buren vanavond', FK(['langskomen', 'komen langs'], 0, 'sep',
        'After dat the verb goes to the end, and langs + komen is written as one word: langskomen.'), '.'] },

      // ---- builds: zullen for probability
      { en: 'The neighbour is probably at home.', parts: ['De buurman', FK(['zal', 'zullen'], 0, 'fut',
        'One neighbour, singular: hij zal. zullen is for wij, jullie and zij plural.'), 'wel thuis', FK(['zijn', 'is'], 0, 'fut',
        'zal sends the next verb to the end as an infinitive: zal wel thuis zijn.'), '.'] },
      { en: 'He probably wants a small beer.', parts: ['Hij zal wel een biertje', FK(['willen', 'wil'], 0, 'fut',
        'After zal the second verb is an infinitive at the end: willen. wil would be a second finite verb.'), '.'] },

      // ---- builds: diminutives and their het
      { en: 'Will you walk the neighbours\' little dog?', parts: ['Wil jij', FK(['het', 'de'], 0, 'verklein',
        'Every word ending in -je is het, even if the animal itself is a de-word.'), 'hondje van de buren uitlaten?'] },
      { en: 'We will take two small beers.', parts: ['We nemen twee', FK(['biertjes', 'bierties', 'biertjen'], 0, 'verklein',
        'The plural of a diminutive is -jes: biertje, biertjes.'), '.'] },
      { en: 'After work we have a little drink on the Grote Markt.', parts: ['Na het werk drinken we een', FK(['borreltje', 'borrelje'], 0, 'verklein',
        'After an unstressed -el the diminutive is -tje, as in tafeltje: borreltje.'), 'op de Grote Markt.'] },

      // ---- builds: the adjective -e
      { en: 'We had a cosy little party in a student room.', parts: ['We hadden een', FK(['gezellig', 'gezellige'], 0, 'adj',
        'feestje is a het-word, and after een a het-word takes no -e: een gezellig feestje.'), 'feestje op een studentenkamer.'] },
      { en: 'The cosy cafe on the Grote Markt is full.', parts: ['Het', FK(['gezellige', 'gezellig'], 0, 'adj',
        'After het, de, dit or mijn the adjective always takes -e: het gezellige café.'), 'café op de Grote Markt is vol.'] },
      { en: 'The kind neighbour is grumpy today.', parts: ['De', FK(['aardige', 'aardig'], 0, 'adj',
        'Before the noun, after de, the adjective takes -e: de aardige buurvrouw.'), 'buurvrouw is vandaag', FK(['chagrijnig', 'chagrijnige'], 0, 'adj',
        'After is the adjective stands alone with no -e: is chagrijnig.'), '.'] },
      { en: 'They live in an old house with a big garden.', parts: ['Zij wonen in een', FK(['oud', 'oude'], 0, 'adj',
        'huis is a het-word, and after een a het-word takes no -e: een oud huis.'), 'huis met een grote tuin.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday the neighbour came by and we talked for hours.', parts: ['Gisteren kwam de buurvrouw langs en we', FK(['praatten', 'praatden', 'praaten'], 0, 'imp',
        'praat ends in a t, a ketchup letter, so the imperfectum takes -te: praatte, praatten for we.'), 'urenlang.'] },
      { en: 'My neighbour called me yesterday about the hedge.', parts: ['Mijn buurman heeft me gisteren', FK(['opgebeld', 'geopbeld', 'opgebelt'], 0, 'perf',
        'The ge goes in the middle: op + gebeld. bel ends in l, no ketchup letter, so -d.'), 'over de heg.'] },
      { en: 'He is bored at the neighbours\' borrel.', parts: ['Hij', FK(['verveelt zich', 'vervelen zich', 'verveeld zich'], 0, 'refl',
        'zich vervelen is reflexive, and with hij the verb takes -t: verveelt zich.'), 'op de borrel van de buren.'] },
      { en: 'Paola is still taller than me.', parts: ['Paola is nog steeds', FK(['groter', 'meer groot', 'grotter'], 0, 'vergelijk',
        'Add -er to groot and the double o shrinks to a single o: groter, followed by dan. grotter has the wrong spelling.'), 'dan ik.'] },

      // ---- words: people, feelings, the borrel, the cracks
      { w: 'the student', nl: 'de student' }, { w: 'the neighbour (woman)', nl: 'de buurvrouw' },
      { w: 'the conversation', nl: 'het gesprek', wrong: 'de gesprek' }, { w: 'the opinion', nl: 'de mening' },
      { w: 'the quarrel between neighbours', nl: 'de burenruzie' }, { w: 'the mood', nl: 'het humeur', wrong: 'de humeur' },
      { w: 'the little party', nl: 'het feestje', wrong: 'de feestje' }, { w: 'the invitation', nl: 'de uitnodiging' },
      { w: 'the girlfriend (or female friend)', nl: 'de vriendin' }, { w: 'the cup of coffee', nl: 'het kopje koffie' },
      { w: 'the drinks', nl: 'de borrel' }, { w: 'the misunderstanding', nl: 'het misverstand', wrong: 'de misverstand' },
      { w: 'the feeling', nl: 'het gevoel' }, { w: 'the appointment', nl: 'de afspraak' },
      { w: 'the sadness', nl: 'het verdriet' }, { w: 'the guest', nl: 'de gast' },
      { w: 'grumpy', nl: 'chagrijnig' },

      // ---- reads: four traps with their own options, two plain
      { read: true, nl: 'Volgens mij heeft hij een slecht humeur.', o: ['In my opinion he is in a bad mood.', 'He told me he is in a bad mood.', 'I am in a bad mood, he thinks.'], a: 0, r: 'mening',
        w: 'Volgens mij is the speaker\'s opinion, and the verb comes right after it. The one in the bad mood is hij.' },
      { read: true, nl: 'Hoewel het regent, gaan we naar de borrel.', o: ['Although it is raining, we are going to the borrel.', 'Because it is raining, we are going to the borrel.', 'It is raining, so we are not going to the borrel.'], a: 0, r: 'mening',
        w: 'hoewel means although. The rain is a reason to stay, and they go anyway.' },
      { read: true, nl: 'Hij zal wel moe zijn.', o: ['He is probably tired.', 'He will certainly be tired tomorrow.', 'He is not tired at all.'], a: 0, r: 'fut',
        w: 'zal wel is a guess, not a certainty: he is probably tired.' },
      { read: true, nl: 'Ondanks de kou zitten de studenten buiten.', o: ['Despite the cold the students sit outside.', 'Because of the cold the students sit outside.', 'After the cold the students go inside.'], a: 0, r: 'mening',
        w: 'ondanks means despite. The cold is there, and the students sit outside anyway.' },
      { read: true, nl: 'Moi. Hoe gaat het met de buren?', en: 'Hi. How are the neighbours doing?' },
      { read: true, nl: 'Er gaat niets boven Groningen.', en: 'Nothing beats Groningen.' },

      // ---- listens: three by ear, from the town
      { listen: true, nl: 'de buurman', en: 'the neighbour' }, { listen: true, nl: 'het biertje', en: 'the small beer' },
      { listen: true, nl: 'de studentenkamer', en: 'the student room' },

      // ---- looks: the dog, the bike, the bridge
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'ontmoeting', art: 'de', en: 'the meeting', w: 'Words ending in -ing are de: de ontmoeting, de afspraak, de uitnodiging.' },
      { dehet: true, nl: 'gezeur', art: 'het', en: 'the nagging', w: 'Most nouns starting with ge- are het: het gezeur, het gesprek, het gevoel.' },
    ] }]);
})();
