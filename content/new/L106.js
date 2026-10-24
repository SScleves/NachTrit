// Nachtrit, Groningen (tier 10, B1): level 106 De Martinitoren, the town's own place. The grey tower d'Olle Grieze on the
// corner of the Grote Markt, the white town hall, bikes piled on every bridge, students everywhere, mosterdsoep and Groninger
// koek, the flat Ommelanden with their farms on mounds, the hunebedden and the Wadden coast. Dry northern humour: kon minder.
// New at tier 10 and drilled here: opinions and arguments (ik vind dat with the verb last, volgens mij with the verb second,
// hoewel with the verb last and the main clause starting with its verb, ondanks plus a noun phrase); zullen for probability
// (het zal vanavond druk zijn, zullen with wel, zal against zul); separable verbs inside sub-clauses (omdat hij vroeg opstaat,
// dat mijn collega de standup afzegt, hoewel hij vroeg opstaat); diminutives and their het-article (het kopje, het bruggetje,
// het kamertje); the adjective -e in all cases (de witte, een groot plein, een koude fietstocht, een warme kom).
// Review: V2 after a fronted word, the imperfectum of a regular verb (fietste, 't kofschip), om ... te with a separable verb
// (op te zetten), comparatives and superlatives (kouder dan, het hoogste), de en het.
// Still inside the fence: 16 words max, no passive, no plusquamperfectum, no indirect speech, no modal particles drills.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, scheidbare werkwoorden, de vs het
// (diminutives, adjective -e), futurum - gaan + infinitief (zullen), imperfectum, 't kofschip, modale werkwoorden;
// _site/words (de gracht, de dijk, de wind, het stadhuis, de student, het college, kopje, koud, de fiets);
// content/towns.js for Groningen (de Martinitoren, d'Olle Grieze, de Grote Markt, de student, de studentenkamer, Moi., Stad,
// Er gaat niets boven Groningen, the kon minder rumour). The gas earthquakes are left out on purpose.
// New rules: mening, hoewel, zullen, sepbz and verkl, defined and guarded below. v2, bijzin, adj, imp, vergelijk, omte and
// dehet exist.
// New props: none. Only fiets, brug and hond are used (not water, kerk or huis: de gracht, het kanaal, de Waddenzee, de toren
// and het stadhuis are in the word pool and could be taken for the prop).
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  window.RULES.sepbz = window.RULES.sepbz || { name: 'Separable verbs in sub-clauses', note: 'scheidbare werkwoorden' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 106, act: 10, name: 'De Martinitoren', town: 'groningen', place: 'eigen', theme: 'square', ...P,
    intro: 'The mist came and everyone who spoke Dutch changed. In Groningen nobody noticed, because up here they say could be worse about the end of the world too.',
    introNl: 'De mist kwam en iedereen die Nederlands sprak, veranderde. In Groningen merkte niemand het, want hier zeggen ze ook over het einde van de wereld: kon minder.',
    mission: {
      where: 'The Grote Markt in Groningen, the grey Martinitoren on the corner and the white town hall opposite. Then along the canals, over bridges buried in bikes, past student houses with every window lit, and out beyond the ring road to the flat Ommelanden, where the farms sit on their mounds and the hunebedden lie in the grass. The Wadden coast is a long cold ride further. Everything here is flat except the tower, and the tower has not forgotten that.',
      carry: 'Two dogs, a pot of mustard, a Groninger koek split to the cent with the neighbours, a flask of mosterdsoep gone cold, and the grammar book, still never opened. No helmet. In Groningen the wind has an opinion about that.',
      want: 'The dead of Groningen have opinions and they state them: ik vind dat, volgens mij, hoewel, ondanks. They say zal wel when they do not know and will not admit it. Verbs that come apart in the middle of a sentence snap back together at the end of a sub-clause. Everything small is a het-word with a -je, and every adjective in front of a noun wants its -e unless the noun is a het-word after een. The women are still taller than you. The students on their bikes are not, but they ride as if they were. Could be worse.' },
    items: [
      // ---- builds: opinions and arguments
      { en: 'I think the Martinitoren is the most beautiful tower in the Netherlands.', parts: ['Ik vind', FK(['dat', 'omdat'], 0, 'mening',
        'ik vind dat opens the opinion. omdat would give a reason, not a view.'), 'de Martinitoren', FK(['de mooiste toren van Nederland is', 'is de mooiste toren van Nederland'], 0, 'mening',
        'dat sends the verb to the end of its clause: dat de Martinitoren de mooiste toren van Nederland is.'), '.'] },
      { en: 'In my opinion the Grote Markt is too busy on Saturday.', parts: ['Volgens mij', FK(['is de Grote Markt', 'de Grote Markt is'], 0, 'v2',
        'Volgens mij fills slot 1, so the verb comes second: is de Grote Markt. There is no dat here, so no verb at the end.'), 'op zaterdag te druk.'] },
      { en: 'In my opinion the Martinitoren is the tallest building in the city.', parts: ['Volgens mij', FK(['is de Martinitoren', 'de Martinitoren is'], 0, 'v2',
        'Volgens mij is slot 1, so the verb comes next: is de Martinitoren.'), 'het', FK(['hoogste', 'hoogst'], 0, 'vergelijk',
        'Before a noun the superlative takes -e: het hoogste gebouw. The bare hoogst does not stand in front of a noun.'), 'gebouw van de stad.'] },
      { en: 'Although it is cold, we cycle to the Grote Markt.', parts: ['Hoewel het', FK(['koud is, fietsen we', 'koud is, we fietsen', 'is koud, fietsen we'], 0, 'hoewel',
        'hoewel sends the verb to the end: koud is. The main clause after it starts with its verb: fietsen we.'), 'naar de Grote Markt.'] },
      { en: 'Despite the rain, the students just keep cycling.', parts: [FK(['Ondanks', 'Hoewel'], 0, 'hoewel',
        'ondanks goes with a noun phrase (de regen). hoewel needs a whole clause with its own verb.'), 'de regen', FK(['fietsen de studenten', 'de studenten fietsen'], 0, 'v2',
        'The first slot is taken by Ondanks de regen, so the verb comes second: fietsen de studenten.'), 'gewoon door.'] },
      { en: 'Although he gets up early, he still arrives too late.', parts: ['Hoewel hij vroeg', FK(['opstaat, komt hij', 'opstaat, hij komt', 'staat op, komt hij'], 0, 'sepbz',
        'In a hoewel-clause the verb goes last and opstaat glues back together. Then the main clause starts with its verb: komt hij.'), 'toch te laat aan.'] },

      // ---- builds: zullen for probability
      { en: 'It will probably be busy on the Grote Markt tonight.', parts: ['Het', FK(['zal', 'zul'], 0, 'zullen',
        'het takes zal. zul belongs to je or jij after the verb, as in zul je.'), 'vanavond wel druk', FK(['zijn', 'is'], 0, 'zullen',
        'After zal the main verb is a bare infinitive at the end: zal ... zijn.'), 'op de Grote Markt.'] },
      { en: 'The students will be asleep by now.', parts: ['De studenten', FK(['zullen', 'zal'], 0, 'zullen',
        'Plural subject, so zullen: de studenten zullen.'), 'nu wel', FK(['slapen', 'te slapen'], 0, 'zullen',
        'zullen is a modal verb, so the infinitive follows bare, with no te.'), '.'] },
      { en: 'Tomorrow it will probably rain.', parts: ['Morgen', FK(['zal het', 'het zal'], 0, 'v2',
        'Morgen takes slot 1, so the verb comes second: zal het.'), 'wel regenen.'] },
      { en: 'It will probably turn out fine, they say in Groningen.', parts: ['Het zal wel', FK(['meevallen', 'te meevallen', 'mee vallen'], 0, 'zullen',
        'After zal the infinitive stands bare and in one piece at the end: meevallen. Probably, but nobody here will promise it.'), ', zeggen ze in Groningen.'] },

      // ---- builds: separable verbs in sub-clauses
      { en: 'The student is tired because he gets up early every day.', parts: ['De student is moe omdat hij elke dag vroeg', FK(['opstaat', 'staat op', 'op staat'], 0, 'sepbz',
        'omdat sends the verb to the end, and the separable verb glues back together: omdat hij opstaat.'), '.'] },
      { en: 'I know that my colleague is cancelling the standup tomorrow.', parts: ['Ik weet dat mijn collega de standup morgen', FK(['afzegt', 'zegt af'], 0, 'sepbz',
        'In a dat-clause the verb goes last and afzeggen stays in one piece: dat mijn collega afzegt, not zegt af.'), '.'] },

      // ---- builds: diminutives and their article
      { en: 'The cup of coffee is empty.', parts: [FK(['Het', 'De'], 0, 'verklein',
        'Every word ending in -je is a het-word: het kopje.'), FK(['kopje', 'koppje'], 0, 'verklein',
        'kop plus -je is kopje. The p does not double in front of -je.'), 'koffie is leeg.'] },
      { en: 'Many students cycle over the little bridge to the city.', parts: ['Over het', FK(['bruggetje', 'brugje'], 0, 'verklein',
        'brug has a short vowel, so the g doubles and the ending is -etje: bruggetje.'), 'fietsen veel studenten naar de stad.'] },

      // ---- builds: the adjective -e
      { en: 'The white town hall stands on a big square.', parts: ['Het', FK(['witte', 'wit'], 0, 'adj',
        'After het or de the adjective takes -e: het witte stadhuis.'), 'stadhuis staat aan een', FK(['groot', 'grote'], 0, 'adj',
        'plein is a het-word, and with een there is no -e: een groot plein.'), 'plein.'] },
      { en: 'After a cold bike ride I eat a warm bowl of mustard soup.', parts: ['Na een', FK(['koude', 'koud'], 0, 'adj',
        'fietstocht is a de-word, so the adjective takes -e: een koude fietstocht.'), 'fietstocht eet ik een', FK(['warme', 'warm'], 0, 'adj',
        'kom is a de-word: een warme kom. With a het-word and een the -e would drop.'), 'kom mosterdsoep.'] },

      // ---- builds: review of earlier tiers
      { en: 'I used to cycle to work every day.', parts: ['Vroeger', FK(['fietste ik', 'fietsde ik', 'ik fietste'], 0, 'imp',
        'fiets ends in s, a ketchup letter, so the past is fietste with a t. Vroeger takes slot 1, so the verb comes before ik.'), 'elke dag naar mijn werk.'] },
      { en: 'I forgot to put on a helmet.', parts: ['Ik ben vergeten een helm', FK(['op te zetten', 'opte zetten', 'te opzetten'], 0, 'omte',
        'With a separable verb the te sits between prefix and verb: op te zetten. No helmet, and now you know why.'), '.'] },
      { en: 'In Groningen it is colder than in Alblasserdam.', parts: ['In Groningen is het', FK(['kouder', 'koudere', 'meer koud'], 0, 'vergelijk',
        'After is the comparative takes no -e: kouder dan. koudere only comes before a noun.'), 'dan in Alblasserdam.'] },

      // ---- words: the city, the students, the food, the countryside
      { w: 'the tower', nl: 'de toren' }, { w: 'the town hall', nl: 'het stadhuis', wrong: 'de stadhuis' },
      { w: 'the town canal', nl: 'de gracht' }, { w: 'the student', nl: 'de student' },
      { w: 'the student room', nl: 'de studentenkamer' }, { w: 'the bike storage', nl: 'de fietsenstalling' },
      { w: 'the mustard', nl: 'de mosterd' }, { w: 'the Groninger spice cake', nl: 'de Groninger koek' },
      { w: 'the dolmen', nl: 'het hunebed', wrong: 'de hunebed' }, { w: 'the meadow', nl: 'het weiland', wrong: 'de weiland' },
      { w: 'the farm mound', nl: 'de wierde' }, { w: 'the farm', nl: 'de boerderij' },
      { w: 'the shipping canal', nl: 'het kanaal', wrong: 'de kanaal' }, { w: 'the lecture', nl: 'het college' },
      { w: 'the square', nl: 'het plein' }, { w: 'the dyke', nl: 'de dijk' },
      { w: 'the wind', nl: 'de wind' }, { w: 'the Wadden Sea', nl: 'de Waddenzee' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'Hoewel het regent, gaan we toch fietsen.', o: ['Although it rains, we are going cycling anyway.', 'Because it rains, we are going cycling.', 'If it rains, we are not going cycling.'], a: 0, r: 'hoewel',
        w: 'hoewel means although, so what follows goes against it. toch is the anyway.' },
      { read: true, nl: 'Hij zal wel moe zijn.', o: ['He is probably tired.', 'He is certainly tired.', 'He will be tired tomorrow.'], a: 0, r: 'zullen',
        w: 'zal wel is a guess about now. Certainly would be zeker, and tomorrow would need morgen.' },
      { read: true, nl: 'Volgens mij is hij al weg.', o: ['I think he has already left.', 'He told me he is leaving.', 'According to him I am gone.'], a: 0, r: 'mening',
        w: 'volgens mij is in my view. It marks an opinion, not a quote of him.' },
      { read: true, nl: 'Ondanks de wind fietst hij zonder helm.', en: 'Despite the wind he cycles without a helmet.' },
      { read: true, nl: 'Het is hier geen Amsterdam, maar het is wel gezellig.', en: 'This is not Amsterdam, but it is cosy.' },
      { read: true, nl: 'Hij woont in een kamertje van vijftien vierkante meter.', en: 'He lives in a little room of fifteen square metres.' },

      // ---- listens: the square, the greeting, the Groningen shrug
      { listen: true, nl: 'de Grote Markt', en: 'the main square' }, { listen: true, nl: 'Moi.', en: 'Hi (Gronings)' },
      { listen: true, nl: 'Kon minder.', en: 'Could be worse.' },

      // ---- looks: the student bike, the bridge, the dog
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

      // ---- de of het
      { dehet: true, nl: 'café', art: 'het', en: 'the pub', w: 'het café. The plural is de cafés, because every plural is de.' },
      { dehet: true, nl: 'meisje', art: 'het', en: 'the girl', w: 'Every -je word is het: het meisje, het kopje, het bruggetje.' },
    ] }]);
})();
