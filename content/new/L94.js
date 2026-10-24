// Nachtrit, Texel (tier 9, B1): level 94 Het station. Texel has no railway, so "het station" is the ferry dock at
// 't Horntje with the bus stop beside it and the rental bikes in the queue. The TESO ferry from Den Helder, the
// crossing over the Marsdiep, buses, bikes, directions, the time, tickets, delays and connections, with the dunes,
// the lighthouse in the north and the sheep behind it all.
// New at tier 9 and drilled here: relative clauses with die and dat (de boot die ..., het schaap dat ..., verb at the
// end), te plus infinitive and om ... te (zin om te wachten, vergeet niet om in te checken, with the separable verb
// splitting around te), conditionals with als ... dan and zou (Als ik meer tijd had, zou ik ...), er for a place and
// for a quantity (ik heb er twee, ik fiets er naartoe) and the pronominal adverbs (waar wacht je op, ermee).
// Review: the sub-clause with the verb at the end after als and toen, V2 after a sub-clause, the imperfectum (stonden,
// zagen), zou for a polite request, comparatives (sneller dan), telling the time (half elf), the present tense endings
// (je mist, de boot vertrekt) and zijn against hebben with komen.
// Still inside the fence: 14 words max, no opinions with hoewel or ondanks, no passive, no diminutive drills, no
// separable verbs inside a sub-clause (in te checken stands in a main clause with om).
// Sources: dutch-lessons vault, 02 - Grammar (die vs dat, bijzin - werkwoord naar het einde, V2 word order,
// modale werkwoorden, zachtmakers, imperfectum, zullen); _site/grammar/er-het-kleine-woord-met-veel-banen;
// _site/sentences (Heb je zin om zaterdag te golfen, Top dan drinken we eerst wat ik verheug me erop, Balen mijn trein
// is net weg, Balen dan haal ik mijn aansluiting niet, De trein heeft weer vertraging, Deze trein is rechtstreeks
// U hoeft niet over te stappen); _site/dialogues (Een treinkaartje kopen: een enkele reis of een retour, spoor vijf,
// vergeet niet om in te checken; De weg vragen: rechtdoor, stoplichten); _site/words (de bus, de fiets, het perron,
// de vertraging); content/towns.js for Texel (de veerboot, de overtocht, het schaap, het lam, de duinen, de vuurtoren,
// de zeehond, De Slufter, Ecomare, Hoe laat vertrekt de laatste boot terug, the miss-the-last-ferry joke).
// New rules: omte, conditie, vnwadv (all guarded below). New props: none (water, kerk, hond).
(() => {
  window.RULES.omte = window.RULES.omte || { name: 'te and om ... te + infinitive', note: 'heb-je-zin-om-zaterdag-te-golfen' };
  window.RULES.conditie = window.RULES.conditie || { name: 'als ... dan: if clauses', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vnwadv = window.RULES.vnwadv || { name: 'erop, ermee, waar ... op', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart over', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 94, act: 9, name: 'Het station', town: 'texel', place: 'station', theme: 'dyke', ...P,
    intro: 'Texel has no railway, only a ferry, and if you miss the last boat you live here now. The sheep are already looking at houses for you.',
    introNl: 'Texel heeft geen trein, alleen een veerboot, en als je de laatste boot mist, woon je hier voortaan. De schapen zijn al een huis voor je aan het zoeken.',
    mission: {
      where: "The ferry dock at 't Horntje, twenty minutes over the Marsdiep from Den Helder, with the bus stop beside it, a queue of cars and rental bikes, and the dunes and the red lighthouse somewhere behind the mist. Also because the dogs need a walk. The dogs always need a walk.",
      carry: 'A return ticket for a crossing that is late again, a rental bike with a flat tyre, a bag of sweets split to the cent with the two day trippers beside you, and the grammar book, still never opened. No helmet. The wind over the Marsdiep does not ask.',
      want: 'Since the mist came, everyone who spoke Dutch changed, and on Texel nobody noticed, because the sheep never spoke Dutch anyway. The dead in the queue now talk in long sentences: die for the de-words, dat for the het-words, the verb at the very end of the clause. They use om te, they say als ... dan, and they say erop and ermee instead of repeating themselves. The women are still taller than you. The sheep are not, but they act like it.' },
    items: [
      // ---- builds: relative clauses with die and dat, the verb at the end
      { en: 'The ferry that leaves at nine is full.', parts: ['De boot', FK(['die', 'dat'], 0, 'diedat',
        'boot is a de-word, so die: de boot die.'), FK(['om negen uur vertrekt', 'vertrekt om negen uur'], 0, 'bijzin',
        'Inside a die or dat clause the verb goes to the very end: die om negen uur vertrekt.'), ', is vol.'] },
      { en: 'The ticket that I bought is in my bag.', parts: ['Het kaartje', FK(['dat', 'die'], 0, 'diedat',
        'kaartje is a het-word, so dat: het kaartje dat.'), FK(['ik gekocht heb', 'heb ik gekocht'], 0, 'bijzin',
        'A relative clause is a sub-clause: the subject comes first and the verb goes to the end.'), ', ligt in mijn tas.'] },
      { en: 'The sheep that stands on the cycle path does not want to leave.', parts: ['Het schaap', FK(['dat', 'die'], 0, 'diedat',
        'schaap is a het-word, so dat: het schaap dat.'), FK(['op het fietspad staat', 'staat op het fietspad'], 0, 'bijzin',
        'The verb of the dat clause goes to the end: dat op het fietspad staat.'), ', wil niet weg.'] },
      { en: 'Is this the bus that goes to De Koog?', parts: ['Is dit de bus', FK(['die', 'dat'], 0, 'diedat',
        'bus is a de-word, so die: de bus die.'), FK(['naar De Koog gaat', 'gaat naar De Koog'], 0, 'bijzin',
        'die sends the verb to the end of its clause: die naar De Koog gaat.'), '?'] },

      // ---- builds: te and om ... te
      { en: 'I do not feel like waiting all day.', parts: ['Ik heb geen zin', FK(['om', 'dat'], 0, 'omte',
        'zin hebben takes om: geen zin om, then te and the infinitive at the end.'), 'de hele dag', FK(['te wachten', 'wachten te', 'wachten'], 0, 'omte',
        'te stands right in front of the infinitive: om te wachten.'), '.'] },
      { en: 'It is silly to cycle without a helmet.', parts: ['Het is dom', FK(['om', 'dat'], 0, 'omte',
        'To say what is silly, easy or nice to do, Dutch uses om ... te.'), 'zonder helm', FK(['te fietsen', 'fietsen te', 'fietsen'], 0, 'omte',
        'om ... te fietsen: te comes in front of the infinitive, which closes the clause.'), '.'] },
      { en: "Don't forget to check in on the bus.", parts: ['Vergeet niet om in de bus', FK(['in te checken', 'te inchecken'], 0, 'omte',
        'A separable verb is split by te: in te checken, never te inchecken.'), '.'] },
      { en: 'I came early so as not to miss the ferry.', parts: ['Ik', FK(['ben', 'heb'], 0, 'aux',
        'komen is moving towards a place, so zijn: ik ben gekomen.'), 'vroeg gekomen om de veerboot', FK(['niet te missen', 'te niet missen'], 0, 'omte',
        'niet stands before te: om de veerboot niet te missen.'), '.'] },

      // ---- builds: conditionals with als ... dan and zou
      { en: 'If the ferry does not sail because of the fog, we stay here.', parts: ['Als de boot door de mist', FK(['niet vaart', 'vaart niet'], 0, 'conditie',
        'als sends the verb to the end of its clause: als de boot niet vaart.'), ',', FK(['dan blijven we', 'dan we blijven'], 0, 'v2',
        'dan takes slot 1 of the main clause, so the verb comes next: dan blijven we.'), 'hier.'] },
      { en: 'If I had more time, I would take the bike.', parts: ['Als ik meer tijd', FK(['had', 'hebben', 'hadden'], 0, 'conditie',
        'An if that is not real uses the imperfectum: als ik meer tijd had. ik takes the singular.'), ',', FK(['zou ik', 'ik zou'], 0, 'zou',
        'After the als clause the main clause starts with its verb: zou ik.'), 'de fiets nemen.'] },
      { en: 'If the bus is late, we take the bikes.', parts: ['Als de bus te laat', FK(['is', 'zijn'], 0, 'presens',
        'One bus, so the verb takes the singular: de bus is.'), ',', FK(['nemen we', 'we nemen'], 0, 'conditie',
        'After the als clause the main clause starts with its verb: nemen we de fietsen.'), 'de fietsen.'] },
      { en: 'Could you tell me where the ferry leaves from?', parts: [FK(['Zou', 'Zouden'], 0, 'zou',
        'u takes the singular: zou u. zou plus kunnen makes the request polite.'), 'u mij kunnen zeggen', FK(['waar de veerboot vertrekt', 'waar vertrekt de veerboot'], 0, 'bijzin',
        'An indirect question sends the verb to the end: waar de veerboot vertrekt.'), '?'] },

      // ---- builds: er for a quantity and a place, pronominal adverbs
      { en: 'How many tickets do you have? I have two.', parts: ['Hoeveel kaartjes', FK(['heb je', 'je hebt'], 0, 'v2',
        'The question word is slot 1, so the verb is second: heb je.'), '? Ik heb', FK(['er', 'ze', 'hen'], 0, 'er',
        'Counting what was just named needs er: ik heb er twee.'), 'twee.'] },
      { en: 'My sister lives on Texel. I cycle there every year.', parts: ['Mijn zus woont op Texel. Ik fiets', FK(['er', 'het'], 0, 'er',
        'A place that was just named becomes er: ik fiets er.'), 'elk jaar', FK(['naartoe', 'toe'], 0, 'er',
        'To a place that was just named, er is followed by naartoe in one word: ik fiets er naartoe. toe alone is not enough.'), '.'] },
      { en: 'What are you waiting for? I am waiting for the bus.', parts: [FK(['Waar', 'Wat'], 0, 'vnwadv',
        'A question about a thing with a preposition starts with waar and ends on the preposition: waar wacht je op.'), 'wacht je op? Ik wacht', FK(['op', 'aan'], 0, 'woord',
        'wachten goes with op: wachten op de bus.'), 'de bus.'] },
      { en: 'What do you do with that old bike? I cycle to the beach on it.', parts: ['Wat doe je met die oude fiets? Ik fiets', FK(['ermee', 'met het'], 0, 'vnwadv',
        'A preposition plus a thing becomes er plus the preposition, one word: ermee, erop, erin.'), 'naar het strand.'] },

      // ---- builds: review of earlier tiers
      { en: 'On Texel the bike is faster than the bus.', parts: ['Op Texel is de fiets', FK(['sneller', 'snelder'], 0, 'vergelijk',
        'snel plus er gives sneller, with a double l to keep the vowel short. There is no d in it.'), FK(['dan', 'van'], 0, 'vergelijk',
        'After a comparative Dutch uses dan: sneller dan de bus.'), 'de bus.'] },
      { en: 'When we stood on the deck, we saw the seals.', parts: ['Toen we op het dek', FK(['stonden', 'stonden we'], 0, 'bijzin',
        'toen sends the verb to the end of its clause: toen we op het dek stonden.'), ',', FK(['zagen we', 'we zagen', 'zien we'], 0, 'imp',
        'zien is irregular in the past: zagen. The main clause after a toen clause starts with its verb.'), 'de zeehonden.'] },
      { en: 'The last ferry leaves at half past ten.', parts: ['De laatste boot', FK(['vertrekt', 'vertrekken'], 0, 'presens',
        'One ferry, so the verb takes the t: de boot vertrekt.'), 'om', FK(['half elf', 'half tien'], 0, 'klok',
        'half elf is half an hour before eleven, so 10:30.'), '.'] },

      // ---- words: the crossing, the dock, the bike, the road
      { w: 'the crossing', nl: 'de overtocht' }, { w: 'the deck', nl: 'het dek', wrong: 'de dek' }, { w: 'the queue', nl: 'de wachtrij' },
      { w: 'the return ticket', nl: 'het retourtje', wrong: 'de retourtje' }, { w: 'the single ticket', nl: 'de enkele reis' },
      { w: 'the fare', nl: 'het tarief' }, { w: 'the driver', nl: 'de chauffeur' }, { w: 'the suitcase', nl: 'de koffer' },
      { w: 'the rental bike', nl: 'de huurfiets' }, { w: 'the flat tyre', nl: 'de lekke band' }, { w: 'the saddle', nl: 'het zadel', wrong: 'de zadel' },
      { w: 'the helmet', nl: 'de helm' }, { w: 'the roundabout', nl: 'de rotonde' }, { w: 'the crossroads', nl: 'het kruispunt', wrong: 'de kruispunt' },
      { w: 'the detour', nl: 'de omleiding' }, { w: 'the destination', nl: 'de bestemming' },
      // replay from level 86 (Urk)
      { w: 'the delay', nl: 'de vertraging' }, { w: 'the timetable', nl: 'de dienstregeling' }, { w: 'the platform', nl: 'het perron', wrong: 'de perron' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'De laatste boot vertrekt over tien minuten.', o: ['The last ferry leaves in ten minutes.', 'The last ferry left ten minutes ago.', 'The last ferry leaves at ten past ten.'], a: 0, r: 'klok',
        w: 'over tien minuten means in ten minutes. At ten past ten would be om tien over tien.' },
      { read: true, nl: 'De bus die je moet nemen, staat bij de veerboot.', o: ['The bus you have to take is standing by the ferry.', 'The bus you took is waiting by the ferry.', 'The bus has to take the ferry.'], a: 0, r: 'diedat',
        w: 'die je moet nemen is the relative clause: it says which bus. The main verb is staat.' },
      { read: true, nl: 'U hoeft niet te rennen, de boot wacht nog.', o: ['You do not need to run, the ferry is still waiting.', 'You must not run, the ferry is still waiting.', 'You cannot run, the ferry is still waiting.'], a: 0, r: 'mag',
        w: 'hoeft niet te: there is no need. Not allowed would be mag niet.' },
      { read: true, nl: 'Hoe laat vertrekt de laatste boot terug?', en: 'What time does the last ferry back leave?' },
      { read: true, nl: 'Waar zijn de fietsen die we hebben gehuurd?', en: 'Where are the bikes that we rented?' },
      { read: true, nl: 'Door de mist vaart de boot vandaag niet.', en: 'Because of the fog the ferry does not sail today.' },

      // ---- listens: two Texel words and a time by ear
      { listen: true, nl: 'de veerboot', en: 'the ferry' }, { listen: true, nl: 'kwart voor negen', en: '8:45' },
      { listen: true, nl: 'de zeehond', en: 'the seal' },

      // ---- looks: the water, the village church, the dog that needs a walk
      { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

      // ---- de of het
      { dehet: true, nl: 'buskaartje', art: 'het', en: 'the bus ticket', w: 'A compound takes the article of its last word: het kaartje, so het buskaartje.' },
      { dehet: true, nl: 'bushalte', art: 'de', en: 'the bus stop', w: 'de halte, so de bushalte.' },
    ] }]);
})();
