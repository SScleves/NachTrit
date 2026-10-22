// Nachtrit, Zeeland (tier 4, A2 entry): level 54, Het station. Trains, buses, the foot ferry, the bike, the wind.
// Grammar new at tier 4 drilled in the builds: er is / er zijn, object pronouns (me, ons, haar, hem),
// comparatives and superlatives (duurder dan, langer dan, het snelst, de hoogste) and adjective -e.
// No split separable verbs, no gaan + infinitive, no clock times, no imperatives.
// Sources: dutch-lessons vault _site/words (de bus, de bushalte, de trein, het centraal station, dan, er, meer,
// hem / haar), _site/situations/directions (de uitgang, de plattegrond), MOC Lidwoorden & voornaamwoorden,
// MOC Veelgebruikte bijwoorden (er, dan), 02 - Grammar/de vs het (adjective -e), and content/towns.js for Zeeland
// (de stormvloedkering, het eiland, de zeedijk, Neeltje Jans, de Lange Jan, Het waait vandaag hard).
// New rules: eris, obj, vgl. New props: none (fiets, water, brug).
(() => {
  window.RULES.eris = window.RULES.eris || { name: 'er is, er zijn', note: 'er' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, jullie, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.vgl = window.RULES.vgl || { name: 'Comparing: groter dan, het grootst', note: 'dan' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 54, act: 4, name: 'Het station', town: 'zeeland', place: 'station', theme: 'dyke', ...P,
    intro: 'Zierikzee has no train station. Since the mist, the dead wait on the platform anyway.',
    introNl: 'Zierikzee heeft geen treinstation. Sinds de mist wachten de doden toch op het perron.',
    mission: { where: 'Middelburg station, the bus stop on the sea dyke, and the foot ferry at Vlissingen. The wind is in your face the whole way.',
      carry: 'Your bike, no helmet, and one ticket the dead want split to the cent. The dogs came too. The dogs always need a walk.',
      want: 'They ask what is faster, what costs more and who is taller. The women are still taller than you. The grammar book you never opened has a page on this.' },
    items: [
      // ---- builds: er is / er zijn
      { en: 'There is no train tonight.', parts: ['Er', FK(['is', 'zijn'], 0, 'eris', 'One train, so er is.'), 'vannacht',
        FK(['geen', 'niet'], 0, 'neg', 'een trein turns into geen trein.'), 'trein.'] },
      { en: 'There are three dead people at the bus stop.', parts: ['Er', FK(['zijn', 'is'], 0, 'eris', 'Three of them, plural: er zijn.'), 'drie doden bij de bushalte.'] },
      { en: 'Is there a toilet at the station?', parts: [FK(['Is er', 'Zijn er'], 0, 'eris', 'One toilet, so is er. In a question the verb comes first.'), 'een toilet op',
        FK(['het', 'de'], 0, 'dehet', 'station is a het-word: het station. Learn it with its article.'), 'station?'] },
      { en: 'Is there still a bus to Zierikzee?', parts: [FK(['Is er', 'Zijn er'], 0, 'eris', 'One bus, so is er. In a question the verb comes first.'), 'nog een bus naar Zierikzee?'] },
      // ---- builds: object pronouns
      { en: 'No ticket. The conductor is looking at me.', parts: ['Geen kaartje. De conducteur kijkt naar', FK(['me', 'ik', 'mijn'], 0, 'obj', 'After naar you need the object form: me. ik only does things.'), '.'] },
      { en: 'Excuse me, can you help us?', parts: ['Pardon, kunt u', FK(['ons', 'wij', 'onze'], 0, 'obj', 'We get the help, so the object form: ons. onze goes before a noun.'), 'helpen?'] },
      { en: "The train is delayed. I'll call her.", parts: ['De trein heeft vertraging. Ik bel', FK(['haar', 'zij'], 0, 'obj', 'She gets the call, so haar. zij is the one who calls.'), '.'] },
      { en: "I can't see the conductor. Can you see him?", parts: ['Ik zie de conducteur niet.', FK(['Zie jij', 'Ziet jij'], 0, 'v2', 'Verb first in a question, and jij behind the verb loses its t: zie jij.'),
        FK(['hem', 'hij'], 0, 'obj', 'He is the one being seen, so hem.'), '?'] },
      // ---- builds: comparatives and superlatives
      { en: 'The train is more expensive than the bus.', parts: ['De trein is', FK(['duurder', 'duur', 'meer duur'], 0, 'vgl', 'Compare with -er and dan. duur ends in r, so it takes -der: duurder.'), 'dan de bus.'] },
      { en: 'The women are still taller than me.', parts: ['De vrouwen', FK(['zijn', 'is'], 0, 'zijn', 'Plural, so zijn.'), 'nog steeds',
        FK(['langer', 'lang', 'meer lang'], 0, 'vgl', 'People are lang in Dutch, and taller is langer. Never meer lang.'), 'dan ik.'] },
      { en: 'The Lange Jan is the tallest tower here.', parts: ['De Lange Jan is de', FK(['hoogste', 'hoogst', 'hoger'], 0, 'vgl', 'A superlative before a noun ends in -ste: de hoogste toren.'), 'toren hier.'] },
      { en: 'In Middelburg the bike is the fastest.', parts: ['In Middelburg', FK(['is de fiets', 'de fiets is'], 0, 'v2', 'A place in slot 1 pushes the verb to slot 2: is de fiets.'),
        FK(['het snelst', 'het sneller', 'meer snel'], 0, 'vgl', 'The fastest without a noun after it: het snelst.'), '.'] },
      // ---- builds: adjective -e
      { en: "I'm taking the last bus home.", parts: ['Ik neem de', FK(['laatste', 'laatst'], 0, 'adj', 'After de the adjective takes -e: de laatste bus.'), 'bus naar huis.'] },
      { en: 'Neeltje Jans is a small island.', parts: ['Neeltje Jans is een', FK(['klein', 'kleine'], 0, 'adj', 'het eiland, and after een a het-word drops the -e: een klein eiland.'), 'eiland.'] },
      { en: "We're waiting on the cold platform.", parts: ['We wachten op het', FK(['koude', 'koud'], 0, 'adj', 'After het the adjective still takes -e: het koude perron.'), 'perron.'] },
      { en: 'A single to Middelburg, please.', parts: ['Een', FK(['enkele', 'enkel'], 0, 'adj', 'de reis, so after een it keeps the -e: een enkele reis.'), 'reis naar Middelburg, alstublieft.'] },
      // ---- words
      { w: 'the bus', nl: 'de bus' }, { w: 'the bus stop', nl: 'de bushalte' }, { w: 'the ferry', nl: 'de veerboot' },
      { w: 'the foot ferry', nl: 'het voetveer', wrong: 'de voetveer' }, { w: 'the track (at the station)', nl: 'het spoor', wrong: 'de spoor' },
      { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' }, { w: 'the return ticket', nl: 'het retourtje' },
      { w: 'the timetable', nl: 'de dienstregeling' }, { w: 'the conductor', nl: 'de conducteur' }, { w: 'the waiting room', nl: 'de wachtkamer' },
      { w: 'the suitcase', nl: 'de koffer' }, { w: 'the backpack', nl: 'de rugzak' }, { w: 'the departure', nl: 'het vertrek', wrong: 'de vertrek' },
      { w: 'the arrival', nl: 'de aankomst' }, { w: 'the delay', nl: 'de vertraging' }, { w: 'the platform', nl: 'het perron', wrong: 'de perron' },
      { w: 'the traveller', nl: 'de reiziger' }, { w: 'the island', nl: 'het eiland', wrong: 'de eiland' }, { w: 'the storm surge barrier', nl: 'de stormvloedkering' },
      { w: 'the sea dyke', nl: 'de zeedijk' }, { w: 'the stopping train', nl: 'de stoptrein' }, { w: 'the exit', nl: 'de uitgang' },
      // ---- reads
      { read: true, nl: 'De trein naar Vlissingen rijdt vandaag niet.', o: ['The train to Vlissingen is not running today.', 'The train to Vlissingen is late today.', 'The train to Vlissingen is full today.'], a: 0, r: 'neg' },
      { read: true, nl: 'Er zijn geen bussen meer.', o: ['There are no more buses.', 'There are more buses.', 'The buses are not here yet.'], a: 0, r: 'eris' },
      { read: true, nl: 'De fiets is hier sneller dan de bus.', o: ['The bike is faster than the bus here.', 'The bike is slower than the bus here.', 'The bike is as fast as the bus here.'], a: 0, r: 'vgl' },
      { read: true, nl: 'Is deze plek nog vrij?', en: 'Is this seat free?' },
      { read: true, nl: 'De kering is vannacht dicht.', en: 'The barrier is closed tonight.' },
      { read: true, nl: 'De bus komt over tien minuten.', en: 'The bus comes in ten minutes.' },
      // ---- listens
      { listen: true, nl: 'de trein naar Middelburg', en: 'the train to Middelburg' }, { listen: true, nl: 'de Lange Jan', en: 'the Lange Jan' }, { listen: true, nl: 'de zee', en: 'the sea' },
      // ---- looks
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
    ] }]);
})();
