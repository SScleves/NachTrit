// Nachtrit, Utrecht (tier 5, A2): level 66 De Dom, place 'eigen'. The Domtoren, the wharves of the Oudegracht,
// the students, and the bike garage under the station with 12,500 places.
// Fence: 10 words max, present tense. New at tier 5 and drilled here: separable verbs split in the present
// (Bij de Dom stap ik af, Ik bel je morgen op), zijn + aan het + infinitive, gaan + infinitive, the imperative
// (Fiets maar door, Let op), telling the time (half negen, kwart over tien). One comparative from tier 4 for the old joke.
// No perfectum, no imperfectum, no sub-clauses.
// Sources: dutch-lessons vault, 02 - Grammar (scheidbare werkwoorden, aan het + infinitief, futurum - gaan + infinitief,
// V2 word order), _site/grammar/de-imperatief-commands, trappen-van-vergelijking-comparison,
// _site/words (de fiets, het slot, het zadel, het stuur, de band, de rem, de fietsenmaker, het centrum, het centraal station,
// opbellen: Ik bel je morgen op), _site/situations/pub (de rekening), MOC Tijd, dagen & maanden,
// and content/towns.js for Utrecht (de Domtoren, de werf, de kelder, het terras, de fietsenstalling, het fietspad,
// de fietsbel, de student, Ik kan mijn fiets niet vinden, Hoe laat gaat de stalling dicht, the 12,500 bikes joke).
// New rules: none of its own. gebod, klok, presens and vergelijk are declared guarded, the same as their sibling files.
// New props: none. Only fiets, brug, water and kerk are used.
(() => {
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };

  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 66, act: 5, name: 'De Dom', town: 'utrecht', place: 'eigen', theme: 'square', ...P,
    intro: 'The Dom tower is 112 metres tall. That makes it taller than the women of Utrecht, but only just.',
    introNl: 'De Domtoren is 112 meter hoog. Daarmee is hij hoger dan de vrouwen in Utrecht, net aan.',
    mission: {
      where: 'From the bike garage under the station, along the wharves of the Oudegracht, up to the Domplein, where the tower stands apart from its church.',
      carry: 'A bike key that fits none of the 12,500 bikes, a crate of beer for the students, and no helmet. Nobody in Utrecht has ever owned one. The dogs are at home in Alblasserdam, waiting for their walk.',
      want: 'The dead on the wharves ask what you are doing, what you are going to do and what time the Dom just struck. The students split the crate to the cent. Every answer has a prefix that wants to go to the end. The grammar book explains why, somewhere, unopened.' },
    items: [
      // ---- words: the tower, the canal, the bike and its parts
      { w: 'the Dom tower', nl: 'de Domtoren' },
      { w: 'the canal', nl: 'de gracht' },
      { w: 'the wharf', nl: 'de werf' },
      { w: 'the cellar', nl: 'de kelder' },
      { w: 'the terrace', nl: 'het terras', wrong: 'de terras' },
      { w: 'the bike garage', nl: 'de fietsenstalling' },
      { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },
      { w: 'the bike bell', nl: 'de fietsbel' },
      { w: 'the student', nl: 'de student' },
      { w: 'the station', nl: 'het station' },
      { w: 'the square', nl: 'het plein' },
      { w: 'the church bell', nl: 'de kerkklok' },
      { w: 'the lock', nl: 'het slot', wrong: 'de slot' },
      { w: 'the saddle', nl: 'het zadel', wrong: 'de zadel' },
      { w: 'the handlebars', nl: 'het stuur' },
      { w: 'the tyre', nl: 'de band' },
      { w: 'the brake', nl: 'de rem' },
      { w: 'the bike repairman', nl: 'de fietsenmaker' },
      { w: 'the city centre', nl: 'het centrum', wrong: 'de centrum' },
      { w: 'the quarter of an hour', nl: 'het kwartier', wrong: 'de kwartier' },

      // ---- builds: separable verbs split in the present, the prefix at the end
      { en: 'At the Dom I get off.', parts: ['Bij de Dom', FK(['stap ik af', 'stap af ik', 'afstap ik'], 0, 'sep',
        'Bij de Dom takes slot 1, stap comes second, then ik, and af waits at the very end.'), '.'] },
      { en: 'The train arrives at half past eight.', parts: ['De trein', FK(['komt', 'aankomt', 'komen'], 0, 'sep',
        'aankomen splits in the present: komt in slot 2, aan at the end.'), 'om', FK(['half negen', 'half acht'], 0, 'klok',
        'Dutch counts towards the next hour: half negen is half way to nine, so 8:30.'), 'aan.'] },
      { en: "I'll call you tomorrow, honey.", parts: ['Ik', FK(['bel', 'opbel', 'belt'], 0, 'sep',
        'opbellen splits in the present: ik bel in slot 2, no t for ik.'), 'je morgen', FK(['op', 'opbellen'], 0, 'sep',
        'Only the prefix op goes to the end, not the whole verb.'), ', schat.'] },
      { en: 'Are you coming along to the terrace?', parts: [FK(['Ga je mee', 'Mee ga je', 'Gaat je mee'], 0, 'sep',
        'A yes/no question starts with the verb. With je behind it the t drops, and mee breaks off after je.'), 'naar het terras?'] },

      // ---- builds: zijn + aan het + infinitive
      { en: "I'm looking for my bike.", parts: ['Ik', FK(['ben', 'heb'], 0, 'aanhet',
        'aan het always runs on zijn: ik ben.'), 'mijn fiets', FK(['aan het zoeken', 'zoeken aan het', 'aan het zoek'], 0, 'aanhet',
        'aan het first, then the whole infinitive closes the sentence: aan het zoeken.'), '.'] },
      { en: 'The dead are drinking beer on the terrace.', parts: ['De doden', FK(['zijn', 'is', 'hebben'], 0, 'aanhet',
        'The dead, plural, and aan het runs on zijn: zijn.'), 'op het terras bier aan het', FK(['drinken', 'drinkt', 'drink'], 0, 'aanhet',
        'After aan het comes the infinitive, whole: drinken.'), '.'] },

      // ---- builds: gaan + infinitive for the future
      { en: 'Tomorrow we are going to climb the Dom tower.', parts: ['Morgen', FK(['gaan we', 'we gaan', 'gaat we'], 0, 'v2',
        'Morgen takes slot 1, so gaan comes second, then we.'), 'de Domtoren', FK(['beklimmen', 'beklimt', 'te beklimmen'], 0, 'fut',
        'gaan sends the real verb to the end, whole, no te.'), '.'] },
      { en: 'The students are going to split the bill to the cent.', parts: ['De studenten', FK(['gaan', 'gaat'], 0, 'fut',
        'Students, plural: gaan.'), 'de rekening tot op de cent', FK(['delen', 'deelt', 'te delen'], 0, 'fut',
        'After gaan the second verb closes the sentence as an infinitive: delen.'), '.'] },
      { en: 'Tonight I am going to pick up my bike.', parts: ['Vanavond', FK(['ga ik', 'ik ga'], 0, 'v2',
        'Vanavond in slot 1 pushes ik behind the verb: ga ik.'), 'mijn fiets', FK(['ophalen', 'haal op', 'ophaal'], 0, 'fut',
        'After gaan the separable verb comes back together at the end: ophalen.'), '.'] },

      // ---- builds: the imperative
      { en: 'Watch out, there are students on the cycle path.', parts: [FK(['Let', 'Lett', 'Letten'], 0, 'gebod',
        'A command is the bare stem: let. No t added, no -en. The prefix op stays behind: let op.'), 'op, er', FK(['zijn', 'zit'], 0, 'presens',
        'studenten is plural, so er zijn.'), 'studenten op het fietspad.'] },
      { en: "Keep cycling and don't look back.", parts: [FK(['Fiets maar door', 'Fiets door maar', 'Doorfiets maar'], 0, 'gebod',
        'The command is the bare stem, and the prefix door goes to the end: fiets maar door.'), 'en', FK(['kijk niet om', 'kijk om niet', 'omkijk niet'], 0, 'sep',
        'omkijken splits: kijk first, niet before the prefix, om closes the sentence.'), '.'] },
      { en: "Don't go to the cellar.", parts: [FK(['Ga', 'Gaat', 'Gaan'], 0, 'gebod',
        'A command is the bare stem: ga. niet comes straight after it.'), 'niet naar de kelder.'] },

      // ---- builds: telling the time
      { en: 'At quarter past ten the Dom strikes.', parts: ['Om', FK(['kwart over tien', 'kwart voor tien'], 0, 'klok',
        'kwart over is quarter past, after the hour. kwart voor is quarter to.'), FK(['slaat de Dom', 'de Dom slaat'], 0, 'v2',
        'The time fills slot 1, so the verb comes before de Dom.'), '.'] },
      { en: "It's half past eleven, the terrace is closing.", parts: ['Het is', FK(['half twaalf', 'half elf'], 0, 'klok',
        'Dutch counts towards the next hour: half twaalf is half way to twelve, so 11:30.'), ', het terras gaat dicht.'] },

      // ---- build: the old joke, comparing from tier 4
      { en: 'The Dom is even taller than the women here.', parts: ['De Dom is nog', FK(['hoger', 'hoog', 'hoogst'], 0, 'vergelijk',
        'Two things with dan between them: hoog plus -er, hoger.'), 'dan de vrouwen hier.'] },

      // ---- reads: four with trap options, two plain
      { read: true, nl: 'Ik kan mijn fiets niet vinden.', en: "I can't find my bike." },
      { read: true, nl: 'De studenten zijn op de werf aan het zingen.', en: 'The students are singing on the wharf.' },
      { read: true, nl: 'Hoe laat gaat de stalling dicht?', o: ['What time does the bike garage close?', 'What time does the bike garage open?', 'Is the bike garage far?'], a: 0, r: 'woord',
        w: 'dicht gaan is to close. Opening is open gaan, far is ver.' },
      { read: true, nl: 'De Dom slaat half negen.', o: ['The Dom strikes half past eight.', 'The Dom strikes half past nine.', 'The Dom strikes nine.'], a: 0, r: 'klok',
        w: 'half negen is half way to nine, so 8:30. Dutch counts towards the next hour.' },
      { read: true, nl: 'Ik ga een nieuwe fiets kopen.', o: ['I am going to buy a new bike.', 'I have bought a new bike.', 'I have to buy a new bike.'], a: 0, r: 'fut',
        w: 'gaan plus an infinitive is a plan. Have to would be moet.' },
      { read: true, nl: 'De Domtoren is 112 meter hoog.', o: ['The Dom tower is 112 metres high.', 'The Dom tower is 112 metres away.', 'The Dom tower is 112 years old.'], a: 0, r: 'woord',
        w: 'hoog is high. Away would be ver, old would be oud.' },

      // ---- listens
      { listen: true, nl: 'honderdtwaalf meter', en: '112 metres' },
      { listen: true, nl: 'kwart over tien', en: '10:15' },
      { listen: true, nl: 'de fietsenstalling', en: 'the bike garage' },

      // ---- looks: a bike on the railing, the bridge over the canal, the water below, the church behind the tower
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- de of het
      { dehet: true, nl: 'universiteit', art: 'de', en: 'the university', w: 'Words ending in -teit or -heid are always de.' },
      { dehet: true, nl: 'fietsenrek', art: 'het', en: 'the bike rack', w: 'het rek, so het fietsenrek. In a compound the last part decides.' },
    ] }]);
})();
