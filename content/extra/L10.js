(() => {
  // Level 10 De kalender, Kinderdijk en Dordrecht (tier 2, A1 phrases), place station: 36 more items.
  // The calendar meets the timetable: the train from Dordrecht, the bus, the ferry and the water bus, the bike,
  // tickets and prices, the platform and the exit, early, on time, late and delayed, the days around the weekend.
  // Fence: 5 words a line at most, present tense SVO only, one fork per build, numbers to 100, alstublieft,
  // niet only inside a read. No questions, no V2 after a time word, no clock times, no separable verbs.
  // Sources: vault _site/dialogues/een-treinkaartje-kopen (Een retour, alstublieft. het perron, spoor vijf, vertrekt),
  // _site/sentences (De trein heeft weer vertraging. Balen, mijn trein is net weg. Ik neem elke ochtend de bus.
  // bij de bushalte), Webiste dutch travel scenes (Het ligt tegenover de kerk. Dat is dan tien euro vijftig.
  // Het is hier vlakbij, twee minuten lopen.), _site/situations/directions (rechtdoor, de uitgang, links),
  // _site/maps/MOC Tijd, dagen & maanden (overmorgen, zondag), _site/words (de trein, de bus, het station, vroeg),
  // 02 - Grammar (presens, de vs het: het weekend, niet vs geen), 03 - Verbs/hebben, content/towns.js (de waterbus).
  // Replays from level 9: zondag and alstublieft.
  // Left out on purpose, because the level's distractor pool would make them right answers too:
  //   het spoor as a word (natives say spoor vijf for platform 5, so it would also answer the platform; it lives
  //   in the listen 'spoor vijf' only), de halte next to de bushalte, het enkeltje and het retourtje next to
  //   het kaartje, de waterbus as a word next to de pont (it is a ferry as well, so it lives in a build),
  //   vannacht next to vanavond (both are tonight), laat next to te laat, a nummer look (a number plate on a pole
  //   reads as a bus stop sign next to de bushalte), a brug look (its wooden deck could pass for het perron),
  //   de kade and de haven next to the water look. volgende, vorige and enkele reis carry adjective -e (tier 4).
  // Trap reads carry their own o / a / r / w, and w starts with the meaning because the mission card shows it.
  // New props: none. Only fiets, water and molen. New rules: none. pres comes from district2.js and hebben from
  // the other extra files; both are set again below only if they are missing.
  window.RULES.pres = window.RULES.pres || { name: 'Present tense', note: 'presens' };
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(10, { deliveries: 20, items: [
    // ---- words: the station and getting around
    { w: 'the station', nl: 'het station', wrong: 'de station' }, { w: 'the train', nl: 'de trein' },
    { w: 'the bus', nl: 'de bus' }, { w: 'the bus stop', nl: 'de bushalte' }, { w: 'the ferry', nl: 'de pont' },
    { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' },
    { w: 'the bike parking', nl: 'de fietsenstalling' },
    // ---- words: the board and the clock
    { w: 'the departure', nl: 'het vertrek', wrong: 'de vertrek' }, { w: 'the delay', nl: 'de vertraging' },
    { w: 'the minute', nl: 'de minuut' }, { w: 'early', nl: 'vroeg' }, { w: 'on time', nl: 'op tijd' },
    { w: 'late (not on time)', nl: 'te laat' },
    // ---- words: the calendar, the counter, the price
    { w: 'day after tomorrow', nl: 'overmorgen' }, { w: 'the weekend', nl: 'het weekend', wrong: 'de weekend' },
    { w: 'Sunday', nl: 'zondag' }, { w: 'please (to a stranger)', nl: 'alstublieft' },
    { w: '€ 10,50', nl: 'tien euro vijftig' },

    // ---- reads: four traps with their own options, one line from the ticket counter
    { read: true, nl: 'De trein heeft weer vertraging.', en: 'The train is delayed again.',
      o: ['The train is delayed again.', 'The train has bad weather.', 'The train is on time again.'], a: 0, r: 'woord',
      w: 'The train is delayed again. weer here is again, not the weather.' },
    { read: true, nl: 'De trein is net weg.', en: 'The train has just left.',
      o: ['The train has just left.', 'The train is nearly here.', 'The train is far away.'], a: 0, r: 'woord',
      w: 'The train has just left. net is just, weg is gone.' },
    { read: true, nl: 'Het ligt tegenover de kerk.', en: "It's opposite the church.",
      o: ["It's opposite the church.", "It's next to the church.", "It's behind the church."], a: 0, r: 'woord',
      w: "It's opposite the church. tegenover is opposite, next to is naast." },
    { read: true, nl: 'De pont vaart vandaag niet.', en: "The ferry isn't running today.",
      o: ["The ferry isn't running today.", 'The ferry is running today.', 'The ferry is late today.'], a: 0, r: 'neg',
      w: "The ferry isn't running today. The niet at the end turns the whole sentence into a no." },
    { read: true, nl: 'Een retour, alstublieft.', en: 'A return ticket, please.' },

    // ---- listens: the station speaker, and the ui, ch and uu sounds
    { listen: true, nl: 'spoor vijf', en: 'platform 5' }, { listen: true, nl: 'de uitgang', en: 'the exit' },
    { listen: true, nl: 'rechtdoor', en: 'straight on' }, { listen: true, nl: 'het uur', en: 'the hour' },

    // ---- looks: the bike you came on, the water the ferry crosses, the mills the water bus goes to
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
    { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill' },

    // ---- builds: one fork each
    { en: 'I take the train.', nl: 'Ik neem de trein.',
      parts: ['Ik', FK(['neem', 'neemt', 'nemen'], 0, 'pres', 'ik takes the bare stem: neem, with ee to keep the sound long.'), 'de trein.'] },
    { en: 'The station is on the left.', nl: 'Het station is links.',
      parts: [FK(['Het', 'De'], 0, 'dehet', 'station is a het-word: het station. Learn it with the het.'), 'station is links.'] },
    { en: 'We are going by bike.', nl: 'We gaan met de fiets.',
      parts: ['We', FK(['gaan', 'gaat', 'ga'], 0, 'pres', 'we is plural, so the whole infinitive: gaan.'), 'met de fiets.'] },
    { en: 'The water bus sails to Dordrecht.', nl: 'De waterbus vaart naar Dordrecht.',
      parts: ['De waterbus', FK(['vaart', 'vaar', 'varen'], 0, 'pres', 'One boat is a hij: stem plus t. varen, vaar, vaart.'), 'naar Dordrecht.'] },
    { en: 'The trains are delayed.', nl: 'De treinen hebben vertraging.',
      parts: ['De treinen', FK(['hebben', 'heeft', 'hebt'], 0, 'hebben', 'treinen is plural, so hebben. Dutch says the trains have delay.'), 'vertraging.'] },
  ] });
})();
