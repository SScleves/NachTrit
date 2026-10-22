// Nachtrit, Utrecht (tier 5, A2): level 62, Het station. The train, the bus, the ferry, the bike, directions, the time, tickets.
// Fence: tier 4 plus separable verbs split in the present (komt ... aan), zijn + aan het + infinitive, gaan + infinitive,
// telling the time (half negen, tien voor half vijf), the imperative (Stap maar in, Fiets maar door). 10 words max.
// No perfectum, no imperfectum, no sub-clauses.
// Sources: dutch-lessons vault, _site/dialogues/een-treinkaartje-kopen (enkele reis, overstappen, rechtstreeks, spoor vijf,
// tien over twee, U hoeft niet over te stappen, inchecken), _site/dialogues/de-weg-vragen (Is het ver lopen?, vlakbij),
// _site/situations/directions (Neemt u deze plattegrond mee, U steekt deze straat over), _site/words (de trein, de bus,
// het openbaar vervoer, aankomen, instappen / uitstappen, Mijn trein is net weg, De trein heeft weer vertraging),
// 02 - Grammar (scheidbare werkwoorden, aan het + infinitief, futurum - gaan + infinitief), _site/grammar/de-imperatief-commands,
// and content/towns.js for Utrecht (de Domtoren, de fietsenstalling, het fietspad, Hoe laat gaat de stalling dicht?, 12,500 bikes).
//
// New rules: gebod (the imperative) -> 'de-imperatief-commands'; klok (telling the time) -> 'MOC Tijd, dagen & maanden'.
// obj and presens are reused and declared only if missing.
// New props: none. Only fiets, kerk and nummer are used.
(() => {
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: Stap maar in', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart over', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 62, act: 5, name: 'Het station', town: 'utrecht', place: 'station', theme: 'square', ...P,
    intro: 'The mist came and the trains kept running, with a delay. Under the station 12,500 bikes wait in the dark, and the dead still cannot find theirs.',
    introNl: 'De mist kwam en de treinen bleven rijden, met vertraging. Onder het station staan 12.500 fietsen in het donker, en de doden kunnen hun eigen fiets nog steeds niet vinden.',
    mission: { where: 'Utrecht Centraal at night: the platforms, the bus stops on the Stationsplein, the bike garage underneath, and the cycle path into town towards the Dom.',
      carry: 'A single ticket to Alblasserdam, which has no station. Two dogs who need a walk the moment you get off. No helmet.',
      want: 'They ask what time it is, and half negen is not half past nine. They ask where you change and when the ferry goes. The conductor is a woman, and still taller than you. Send the prefix to the end, or the train leaves without you.' },
    items: [
      // ---- builds: separable verbs, aan het, gaan + infinitive, the clock, the imperative
      { en: 'The train leaves at ten past two.', parts: ['De trein', FK(['vertrekt', 'trekt'], 0, 'sep', 'ver- never breaks off. vertrekt stays in one piece.'), 'om',
        FK(['tien over twee', 'twee over tien'], 0, 'klok', 'Minutes first, then over, then the hour: tien over twee is 2:10.'), '.'] },
      { en: 'At half past eight I take the train.', parts: ['Om', FK(['half negen', 'half acht'], 0, 'klok', 'Dutch counts the half towards the next hour: half negen is 8:30.'),
        FK(['neem ik', 'ik neem'], 0, 'v2', 'A time in slot 1, then the verb, then ik.'), 'de trein.'] },
      { en: "It's twenty past four.", parts: ['Het is', FK(['tien voor half vijf', 'tien voor half vier', 'twintig voor vijf'], 0, 'klok', 'From twenty past, Dutch counts from the half: tien voor half vijf is 4:20.'), '.'] },
      { en: 'The train arrives at a quarter past nine.', parts: ['De trein', FK(['komt', 'aankomt'], 0, 'sep', 'aankomen splits in the present: komt in slot 2, aan at the very end.'), 'om',
        FK(['kwart over negen', 'kwart voor negen'], 0, 'klok', 'A quarter past is kwart over. kwart voor is a quarter to.'), 'aan.'] },
      { en: 'Do I change here, or is it direct?', parts: [FK(['Stap ik', 'Overstap ik', 'Stapt ik'], 0, 'sep', 'Question: the verb first without its prefix, ik takes no t, and over waits at the end.'), 'hier over of is het rechtstreeks?'] },
      { en: 'Paola picks me up at the station.', parts: ['Paola', FK(['haalt', 'ophaalt'], 0, 'sep', 'ophalen splits: haalt in slot 2, op behind me.'),
        FK(['me', 'ik', 'mijn'], 0, 'obj', 'I am the one being picked up, so the object form: me.'), 'op bij het station.'] },
      { en: "Paola is on the phone.", parts: ['Paola', FK(['is', 'heeft'], 0, 'aanhet', 'aan het always runs on zijn: Paola is aan het ...'), 'aan het',
        FK(['bellen', 'belt'], 0, 'aanhet', 'After aan het the verb stays whole: bellen.'), '.'] },
      { en: 'The dead are looking for their bikes.', parts: ['De doden', FK(['zijn', 'is'], 0, 'presens', 'De doden is plural: zijn.'), 'hun fietsen',
        FK(['aan het zoeken', 'zoeken aan het'], 0, 'aanhet', 'What you look for comes first, then aan het, then the infinitive: aan het zoeken.'), '.'] },
      { en: "Tomorrow I'm going to take the bus.", parts: ['Morgen', FK(['ga ik', 'ik ga'], 0, 'v2', 'Morgen in slot 1 pushes ik behind the verb: ga ik.'), 'de bus',
        FK(['nemen', 'neem'], 0, 'fut', 'gaan holds slot 2, the infinitive waits at the end: nemen.'), '.'] },
      { en: "We're going to cycle to the Dom tower.", parts: ['We', FK(['gaan', 'gaat'], 0, 'fut', 'we is plural: gaan.'), 'naar de Domtoren',
        FK(['fietsen', 'fietst'], 0, 'fut', 'The second verb goes whole to the end: fietsen.'), '.'] },
      { en: 'Are you going to walk the dogs tonight?', parts: [FK(['Ga jij', 'Gaat jij'], 0, 'v2', 'When jij comes after the verb, the t drops: ga jij.'), 'vanavond de honden',
        FK(['uitlaten', 'laat uit', 'uit laten'], 0, 'sep', 'After gaan the separable verb glues back together at the end: uitlaten.'), '?'] },
      { en: 'Get in, the train is leaving.', parts: [FK(['Stap', 'Stapt', 'Stappen'], 0, 'gebod', 'A command is the bare stem: stap. No t, no -en.'), 'maar in, de trein vertrekt.'] },
      { en: 'Cross the Stationsplein.', parts: [FK(['Steek', 'Oversteek', 'Steekt'], 0, 'gebod', 'A command is the bare stem, and the prefix still jumps to the end: steek ... over.'), 'het Stationsplein over.'] },
      { en: "Just keep cycling, it's close by.", parts: [FK(['Fiets', 'Fietst', 'Fietsen'], 0, 'gebod', 'A command is the bare stem: fiets. The t only comes with jij, hij or u.'), 'maar door, het is vlakbij.'] },
      { en: 'Please check in at the gates.', parts: [FK(['Checkt u', 'Check u'], 0, 'gebod', 'The polite command puts u after the verb, and the verb keeps its t: checkt u.'), 'even',
        FK(['in', 'inchecken'], 0, 'sep', 'In a command the prefix breaks off too: checkt u even in.'), 'bij de poortjes.'] },

      // ---- words
      { w: 'the train', nl: 'de trein' }, { w: 'the station', nl: 'het station', wrong: 'de station' },
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the track', nl: 'het spoor' },
      { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' }, { w: 'the single ticket', nl: 'de enkele reis' },
      { w: 'the delay', nl: 'de vertraging' }, { w: 'the bus stop', nl: 'de bushalte' },
      { w: 'the ferry', nl: 'de pont' }, { w: 'the bike garage', nl: 'de fietsenstalling' },
      { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' }, { w: 'the departure', nl: 'het vertrek', wrong: 'de vertrek' },
      { w: 'the ticket gate', nl: 'het poortje' }, { w: 'the quarter of an hour', nl: 'het kwartier', wrong: 'de kwartier' },
      { w: 'the Dom tower', nl: 'de Domtoren' }, { w: 'public transport', nl: 'het openbaar vervoer' },
      { w: 'the helmet', nl: 'de helm' },
      { w: 'to change trains', nl: 'overstappen' }, { w: 'to check in', nl: 'inchecken' }, { w: 'to get off', nl: 'uitstappen' },

      // ---- de of het
      { dehet: true, nl: 'uur', art: 'het', en: 'the hour', w: 'het uur, just like het kwartier.' },
      { dehet: true, nl: 'minuut', art: 'de', en: 'the minute', w: 'de minuut, even though het uur and het kwartier are het.' },

      // ---- read
      { read: true, nl: 'U hoeft niet over te stappen.', o: ["You don't have to change trains.", "You mustn't change trains.", "You can't get off here."], a: 0, r: 'mag',
        w: 'hoeft niet means there is no need. You mustn\'t would be u mag niet.' },
      { read: true, nl: 'De trein heeft vertraging.', o: ['The train is delayed.', 'The train is cancelled.', 'The train is early.'], a: 0, r: 'woord',
        w: 'vertraging is delay. Cancelled would be De trein rijdt niet.' },
      { read: true, nl: 'Mijn trein is net weg.', o: ['My train has just left.', 'My train is almost here.', 'My train is not running.'], a: 0, r: 'woord',
        w: 'net is just, a moment ago, and weg is gone.' },
      { read: true, nl: 'Het is half negen.', o: ["It's half past eight.", "It's half past nine.", "It's eight o'clock."], a: 0, r: 'klok',
        w: 'half negen is halfway to nine: 8:30.' },
      { read: true, nl: 'Is het ver lopen?', en: 'Is it far to walk?' },
      { read: true, nl: 'Hoe laat gaat de stalling dicht?', en: 'What time does the bike garage close?' },

      // ---- listen
      { listen: true, nl: 'kwart over acht', en: '8:15' }, { listen: true, nl: 'half zeven', en: '6:30' },
      { listen: true, nl: 'kwart voor zes', en: '5:45' }, { listen: true, nl: 'de conducteur', en: 'the conductor' },

      // ---- look
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'nummer', value: 5, nl: 'vijf', en: '5' },
    ] }]);
})();
