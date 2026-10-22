// Nachtrit, Utrecht (tier 5, A2): level 65 De mensen. A borrel on the wharf below the Oudegracht, the terraces on the Neude,
// students, neighbours and the walk home past the Dom.
// New at tier 5 and drilled here: separable verbs split in the present (Na de borrel bel ik je terug, Wanneer spreken we weer af),
// zijn + aan het + infinitive, gaan + infinitive, the imperative (Ga lekker zitten, Kom een keer langs, Fiets maar door),
// and telling the time (kwart over acht, half zes).
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios/Borrel met vrienden and De nieuwe buren ontmoeten,
// _site/situations (meeting-people, neighbours, small-talk, friends, visiting, pub), MOC Gevoel & uitdrukkingen,
// H13 - Bij vrienden, 02 - Grammar (scheidbare werkwoorden, aan het + infinitief, futurum - gaan + infinitief, V2 word order),
// _site/grammar/de-imperatief-commands, MOC Tijd, dagen & maanden, and content/towns.js for Utrecht
// (de Domtoren, de werf, het terras, de student, de fietsbel, the 12,500-bike garage joke).
// Replay from levels 13 and 57: de buurt, de borrel, het gesprek, het gevoel, de afspraak.
// New rules: none beyond gebod and klok (declared in L59, guarded here so this file stands alone).
// New props: none. Only brug, fiets and hond are used.
(() => {
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    { id: 65, act: 5, name: 'De mensen', town: 'utrecht', place: 'mensen', theme: 'square', ...P,
      intro: 'In Utrecht everyone is a student, the dead included. They still split the bill to the cent. They still cannot find their bikes.',
      introNl: 'In Utrecht is iedereen student, de doden ook. Ze splitsen de rekening nog steeds tot op de cent. Ze kunnen hun fiets nog steeds niet vinden.',
      mission: {
        where: 'A borrel on the wharf below the Oudegracht, the terraces on the Neude, and the long way home past the Dom.',
        carry: 'A crate of beer for the students upstairs, a phone full of unanswered messages, and no helmet. The dogs are waiting at home. The dogs always need a walk.',
        want: 'The dead want to make plans: when you meet, who calls back, what you are doing right now. Their women are still taller than you. The grammar book is in your bag, still unopened.' },
      items: [
        // ---- builds: separable verbs split in the present, the prefix at the end
        { en: "After the borrel I'll call you back.", parts: ['Na de borrel', FK(['bel ik je terug', 'ik bel je terug', 'terugbel ik je'], 0, 'sep',
          'Na de borrel takes slot 1, bel comes second, and terug waits at the very end.'), '.'] },
        { en: 'When shall we meet up again?', parts: ['Wanneer', FK(['spreken we', 'we spreken', 'spreekt we'], 0, 'v2',
          'Question word in slot 1, the verb next, then we.'), 'weer', FK(['af', 'afspreken'], 0, 'sep',
          'afspreken splits in the present. Only af goes to the end.'), '?'] },
        { en: 'May I introduce myself?', parts: ['Mag ik me even', FK(['voorstellen', 'stel voor', 'voor te stellen'], 0, 'sep',
          'After a modal the separable verb stays in one piece at the end: voorstellen.'), '?'] },
        { en: 'The dead still pay separately.', parts: ['De doden', FK(['rekenen', 'afrekenen', 'rekent'], 0, 'sep',
          'afrekenen splits: rekenen in slot 2, af at the end. The dead are plural, so rekenen.'), 'nog steeds apart af.'] },

        // ---- builds: zijn + aan het + infinitive
        { en: 'Paola is chatting with the neighbour.', parts: ['Paola', FK(['is', 'heeft', 'zijn'], 0, 'aanhet',
          'aan het always runs on zijn. One Paola, so is.'), 'met de buurvrouw aan het', FK(['kletsen', 'kletst', 'klets'], 0, 'aanhet',
          'After aan het comes the whole infinitive: kletsen.'), '.'] },
        { en: 'The students on the wharf are singing.', parts: ['De studenten op de werf', FK(['zijn', 'is', 'hebben'], 0, 'aanhet',
          'Students, plural: zijn. aan het never takes hebben.'), 'aan het', FK(['zingen', 'zingt', 'zing'], 0, 'aanhet',
          'aan het, then the infinitive last: zingen.'), '.'] },
        { en: 'What are you doing?', parts: ['Wat', FK(['ben je', 'heb je', 'bent je'], 0, 'aanhet',
          'aan het needs zijn, and with je after the verb it is ben je, not bent je.'), 'aan het doen?'] },

        // ---- builds: gaan + infinitive for the future
        { en: "On Friday we're going to have a drink on the wharf.", parts: ['Vrijdag', FK(['gaan we', 'we gaan', 'gaat we'], 0, 'v2',
          'Vrijdag in slot 1, gaan second, then we.'), 'wat', FK(['drinken', 'drinkt', 'te drinken'], 0, 'fut',
          'gaan sends the real verb to the end, whole, no te.'), 'op de werf.'] },
        { en: "I'm going to invite the new neighbours.", parts: ['Ik', FK(['ga', 'gaat', 'gaan'], 0, 'fut',
          'ik ga. The t is for jij and hij.'), 'de nieuwe buren', FK(['uitnodigen', 'nodig uit', 'uit te nodigen'], 0, 'fut',
          'After gaan the separable verb comes back together at the end: uitnodigen.'), '.'] },
        { en: 'Are you going to call her?', parts: [FK(['Ga je', 'Gaat je'], 0, 'v2',
          'A yes or no question starts with the verb, and je after the verb drops the t: ga je.'), FK(['haar', 'zij'], 0, 'objpron',
          'She is the one being called, so haar. zij is only for the one doing it.'), 'bellen?'] },

        // ---- builds: the imperative
        { en: 'Have a seat, take a beer.', parts: [FK(['Ga', 'Gaat'], 0, 'gebod',
          'A command is the bare stem: ga. No t.'), 'lekker zitten,', FK(['neem', 'neemt'], 0, 'gebod',
          'Still a command, so still the stem: neem.'), 'een biertje.'] },
        { en: 'Drop by sometime for a borrel.', parts: [FK(['Kom', 'Komt', 'Langskom'], 0, 'gebod',
          'The command is the stem, kom, and langs still goes to the end.'), 'een keer', FK(['langs', 'langs te komen'], 0, 'sep',
          'Only langs goes to the end. kom is already in the command, so nothing else follows it.'), 'voor een borrel.'] },
        { en: 'Just keep riding, the dead want to chat.', parts: [FK(['Fiets', 'Fietst'], 0, 'gebod',
          'A command is the bare stem: fiets.'), 'maar', FK(['door', 'doorfietsen'], 0, 'sep',
          'doorfietsen splits in a command too: the stem first, door at the end.'), ', de doden willen kletsen.'] },

        // ---- builds: telling the time
        { en: "At quarter past eight I'll see you at the Dom tower.", parts: ['Om', FK(['kwart over acht', 'kwart voor acht'], 0, 'klok',
          'kwart over is quarter past. kwart voor is quarter to.'), FK(['zie ik je', 'ik zie je', 'zie je ik'], 0, 'v2',
          'The time fills slot 1, so the verb comes next, then ik, then je.'), 'bij de Domtoren.'] },
        { en: "It's half past ten, I'm going home.", parts: ['Het is', FK(['half elf', 'half tien'], 0, 'klok',
          'Dutch counts towards the next hour: half elf is half way to eleven, so 10:30.'), ', ik ga naar huis.'] },

        // ---- words: people, the borrel, Utrecht
        { w: 'the neighbourhood', nl: 'de buurt' }, { w: 'the drinks get-together', nl: 'de borrel' },
        { w: 'the conversation', nl: 'het gesprek', wrong: 'de gesprek' }, { w: 'the feeling', nl: 'het gevoel' },
        { w: 'the appointment', nl: 'de afspraak' }, { w: 'the student', nl: 'de student' },
        { w: 'the housemate', nl: 'de huisgenoot' }, { w: 'the student house', nl: 'het studentenhuis', wrong: 'de studentenhuis' },
        { w: 'the acquaintance', nl: 'de kennis' }, { w: 'the guest', nl: 'de gast' },
        { w: 'the invitation', nl: 'de uitnodiging' }, { w: 'the little party', nl: 'het feestje' },
        { w: 'the round (of drinks)', nl: 'het rondje', wrong: 'de rondje' }, { w: 'the pub', nl: 'de kroeg' },
        { w: 'the terrace', nl: 'het terras', wrong: 'de terras' }, { w: 'the wharf', nl: 'de werf' },
        { w: 'the joke', nl: 'de grap' }, { w: 'the mood', nl: 'het humeur', wrong: 'de humeur' },
        { w: 'the bike bell', nl: 'de fietsbel' }, { w: 'the birthday person', nl: 'de jarige' },

        // ---- reads: four traps with their own options, two lines from the borrel
        { read: true, nl: 'Ik bel je morgen op.', o: ['I will call you tomorrow.', 'I will pick you up tomorrow.', 'I called you this morning.'], a: 0, r: 'sep',
          w: 'opbellen is to call. morgen on its own is tomorrow, and the present tense covers it.' },
        { read: true, nl: 'Je hoeft niet te betalen.', o: ["You don't have to pay.", "You mustn't pay.", "You can't pay."], a: 0, r: 'mag',
          w: 'niet hoeven te means there is no need. Not allowed would be mag niet.' },
        { read: true, nl: 'We zijn aan het kletsen.', o: ['We are chatting.', 'We are going to chat.', 'We chatted.'], a: 0, r: 'aanhet',
          w: 'zijn + aan het is busy right now. Not later, not done.' },
        { read: true, nl: 'De borrel begint om half zes.', o: ['The drinks start at half past five.', 'The drinks start at half past six.', 'The drinks start at five.'], a: 0, r: 'klok',
          w: 'half zes is half way to six, so 5:30.' },
        { read: true, nl: 'Doe de groeten aan Paola.', en: 'Say hello to Paola for me.' },
        { read: true, nl: 'Ik moet zo naar huis, de honden wachten.', en: 'I have to head home soon, the dogs are waiting.' },

        // ---- listens
        { listen: true, nl: 'kwart over zes', en: '6:15' }, { listen: true, nl: 'de buurman', en: 'the neighbour (man)' },
        { listen: true, nl: 'tot straks', en: 'see you later' },

        // ---- looks: the bridges over the Oudegracht, the bikes on every railing, the dog at home
        { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

        // ---- de of het
        { dehet: true, nl: 'gezelschap', art: 'het', en: 'the company (people)', w: 'het gezelschap. Careful: most -schap words are de (de vriendschap), but this one is het, like many ge- words: het gesprek, het gevoel.' },
        { dehet: true, nl: 'praatje', art: 'het', en: 'the little chat', w: 'Every -je word is het: het praatje, het biertje.' },
      ] },
  ]);
})();
