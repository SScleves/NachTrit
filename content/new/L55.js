// Nachtrit, Zeeland (tier 4, A2 entry): level 55 Het werk. The office on Neeltje Jans and the home office on the sea dyke.
// Fence: tier 3 (present tense, verb-first questions, V2 after a time word, niet/geen, modal + infinitive at the end,
// possessives) plus the tier 4 additions drilled here: object pronouns (me, je, hem, haar, ons, ze), er is / er zijn,
// comparatives and superlatives (groter dan, de drukste, de beste), adjective -e after de, het and een. 8 words max.
// No split separable verbs, no gaan + infinitive, no imperative, no perfectum, no sub-clauses.
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios (De standup - tech talk, Koffiepraatje op kantoor,
// Uitleggen wat je doet - Dynatrace), 💼 Werk — MOC, _site/situations/office (Heb je even? Ik heb een korte vraag.),
// _site/grammar (trappen-van-vergelijking-comparison, er-het-kleine-woord-met-veel-banen, het-adjectief-de-e-regel),
// _site/words/hem-haar, MOC Lidwoorden & voornaamwoorden, and content/towns.js for Zeeland (Neeltje Jans, Zierikzee,
// de zeedijk, de stormvloedkering, het eiland, 62 gates, Het waait vandaag hard.).
// New rules: objpron, eris, vergelijk (declared below only if missing). New props: none.
(() => {
  window.RULES.objpron = window.RULES.objpron || { name: 'Object pronouns: me, je, hem, haar, ons, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.eris = window.RULES.eris || { name: 'er is, er zijn', note: 'ER — het kleine woord met veel banen · the little word' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 55, act: 4, name: 'Het werk', town: 'zeeland', place: 'werk', theme: 'dyke', ...P,
    intro: 'A home office on the sea dyke near Zierikzee. The wind is stronger than the wifi, and the standup still runs over.',
    introNl: 'Een thuiskantoor op de zeedijk bij Zierikzee. De wind is sterker dan de wifi, en de standup loopt nog steeds uit.',
    mission: {
      where: 'The office on Neeltje Jans, halfway along the barrier, then home along the sea dyke to the laptop on the kitchen table.',
      carry: 'A laptop at four percent, a headset, and the grammar book, still in its plastic. No helmet.',
      want: 'The dead hold an incident call on every pillar. They want to know who you called, whose screen is bigger and whether there is still coffee. Hem, haar, ons, er is, groter dan. Sixty-two gates. At the last one someone still knocks.' },
    items: [
      // ---- build: object pronouns
      { en: "I'll call him after the standup.", parts: ['Na de standup',
        FK(['bel ik', 'ik bel', 'belt ik'], 0, 'v2', 'Na de standup takes slot 1, so the verb comes next, then ik: bel ik.'),
        FK(['hem', 'hij', 'zijn'], 0, 'objpron', 'He is on the receiving end of the call, so hem. hij only does things.'), '.'] },
      { en: 'Can you help me?', parts: ['Kun je',
        FK(['me', 'ik', 'mijn'], 0, 'objpron', 'The help goes to me, so me. ik only does things, mijn needs a noun after it.'),
        FK(['helpen', 'helpt', 'te helpen'], 0, 'modal', 'After kun the verb goes whole to the end, no te: helpen.'), '?'] },
      { en: 'Every morning the customers call us.', parts: ['Elke ochtend',
        FK(['bellen de klanten', 'de klanten bellen', 'belt de klanten'], 0, 'v2', 'Elke ochtend in slot 1: the verb second, then de klanten. Plural, so bellen.'),
        FK(['ons', 'wij', 'onze'], 0, 'objpron', 'We get called, so ons. wij is us doing the calling.'), '.'] },
      { en: 'Sorry, the dogs need me.', parts: ['Sorry, de honden',
        FK(['hebben', 'heeft'], 0, 'presens', 'Two dogs, plural: hebben.'),
        FK(['me', 'ik', 'mijn'], 0, 'objpron', 'The dogs need someone, and that someone is me. Object, so me.'), 'nodig.'] },
      { en: "Later I'll send her the link.", parts: ['Straks',
        FK(['stuur ik', 'ik stuur'], 0, 'v2', 'Straks takes slot 1, so the verb jumps ahead of ik.'),
        FK(['haar', 'zij'], 0, 'objpron', 'She gets the link, so haar. zij is she doing the sending.'), 'de link.'] },
      { en: 'You have to call him tonight.', parts: ['Je moet',
        FK(['hem', 'hij'], 0, 'objpron', 'Him, the one you call: hem.'), 'vannacht',
        FK(['bellen', 'belt', 'te bellen'], 0, 'modal', 'moet sends the infinitive to the end: bellen.'), '.'] },
      // ---- build: er is, er zijn
      { en: "Tonight there's an outage on the server.", parts: ['Vannacht',
        FK(['is er', 'er is', 'zijn er'], 0, 'eris', 'Vannacht in slot 1, then the verb, then er. One outage, so is.'), 'een storing op de server.'] },
      { en: 'There are two new alerts.', parts: ['Er',
        FK(['zijn', 'is'], 0, 'eris', 'Two alerts, plural: er zijn.'), 'twee',
        FK(['nieuwe', 'nieuw'], 0, 'adj', 'Before a plural noun the adjective takes -e: nieuwe meldingen.'), 'meldingen.'] },
      { en: 'There are no blockers.', parts: ['Er',
        FK(['zijn', 'is'], 0, 'eris', 'blockers is plural, so er zijn.'),
        FK(['geen', 'niet'], 0, 'neg', 'geen cancels a noun that has no article: geen blockers, never niet blockers.'), 'blockers.'] },
      // ---- build: comparing
      { en: 'My laptop is older than the intern.', parts: ['Mijn laptop is',
        FK(['ouder', 'meer oud', 'oudst'], 0, 'vergelijk', 'Comparing two things: adjective plus -er, ouder. Dutch never says meer oud.'),
        FK(['dan', 'van'], 0, 'vergelijk', 'After a comparative comes dan: ouder dan.'), 'de stagiair.'] },
      { en: 'The new dashboard is bigger than the old one.', parts: ['Het',
        FK(['nieuwe', 'nieuw'], 0, 'adj', 'After het the adjective takes -e: het nieuwe dashboard. Only een plus a het-word drops it.'), 'dashboard is',
        FK(['groter', 'groot', 'grootst'], 0, 'vergelijk', 'dan wants the -er form: groter dan.'), 'dan het oude.'] },
      { en: 'All my colleagues are taller than me.', parts: ["Al mijn collega's",
        FK(['zijn', 'is'], 0, 'presens', "collega's is plural, so zijn."),
        FK(['langer', 'lang', 'langst'], 0, 'vergelijk', 'Tall is lang in Dutch, so taller than is langer dan.'), 'dan ik.'] },
      { en: 'Paola has the best spot by the router.', parts: ['Paola heeft de',
        FK(['beste', 'best', 'goedste'], 0, 'vergelijk', 'goed, beter, best: irregular, and before plek it takes -e. De beste plek.'), 'plek bij de router.'] },
      { en: 'Monday is the busiest day.', parts: ['Maandag is',
        FK(['de', 'het'], 0, 'dehet', 'dag is a de-word: de dag.'),
        FK(['drukste', 'drukst', 'drukker'], 0, 'vergelijk', 'The most is -st, and before a noun it takes -e: de drukste dag.'), 'dag.'] },
      // ---- build: adjective -e
      { en: 'Do you know the new colleague?', parts: [
        FK(['Ken je', 'Kent je', 'Je ken'], 0, 'presens', 'Verb first for a question, and with je right after it the t drops: ken je.'), 'de',
        FK(['nieuwe', 'nieuw'], 0, 'adj', 'After de the adjective always takes -e: de nieuwe collega.'), 'collega?'] },
      { en: 'At home I have a big screen.', parts: ['Thuis',
        FK(['heb ik', 'ik heb'], 0, 'v2', 'Thuis in slot 1 pushes ik behind the verb: heb ik.'), 'een',
        FK(['groot', 'grote'], 0, 'adj', 'een plus a het-word is the one cell with no -e: een groot scherm.'), 'scherm.'] },

      // ---- words: the office and the laptop
      { w: 'the meeting', nl: 'de vergadering' }, { w: 'the colleague', nl: 'de collega' }, { w: 'the outage', nl: 'de storing' },
      { w: 'the screen', nl: 'het scherm', wrong: 'de scherm' }, { w: 'the keyboard', nl: 'het toetsenbord', wrong: 'de toetsenbord' },
      { w: 'the mouse', nl: 'de muis' }, { w: 'the charger', nl: 'de oplader' }, { w: 'the headphones', nl: 'de koptelefoon' },
      { w: 'the team', nl: 'het team', wrong: 'de team' }, { w: 'the department', nl: 'de afdeling' }, { w: 'the appointment', nl: 'de afspraak' },
      { w: 'the quick email', nl: 'het mailtje', wrong: 'de mailtje' }, { w: 'the coffee machine', nl: 'het koffieapparaat', wrong: 'de koffieapparaat' },
      { w: 'the lunch', nl: 'de lunch' }, { w: 'the intern', nl: 'de stagiair' }, { w: 'the incident', nl: 'het incident', wrong: 'de incident' },
      { w: 'the colleagues', nl: "de collega's" },
      // ---- words: Zeeland
      { w: 'the island', nl: 'het eiland', wrong: 'de eiland' }, { w: 'the storm surge barrier', nl: 'de stormvloedkering' },

      // ---- read
      { read: true, nl: 'Er is een storing.', en: "There's an outage." },
      { read: true, nl: 'Heb je even? Ik heb een korte vraag.', en: 'Got a minute? Quick question.' },
      { read: true, nl: 'Het ligt aan de wifi.', en: "It's the wifi's fault." },
      { read: true, nl: 'Het draait weer.', en: "It's running again.", o: ["It's running again.", "It's broken again.", "It's the weather again."], a: 0, r: 'woord',
        w: 'draaien is what a server does when it works. weer here means again, not the weather.' },
      { read: true, nl: 'Je hoeft niet te komen.', en: "You don't have to come.", o: ["You don't have to come.", "You mustn't come.", "You can't come."], a: 0, r: 'mag',
        w: 'niet hoeven te is no need. You mustn\'t come would be je mag niet komen.' },
      { read: true, nl: 'De nieuwe laptop is sneller dan de oude.', en: 'The new laptop is faster than the old one.',
        o: ['The new laptop is faster than the old one.', 'The new laptop is as fast as the old one.', 'The new laptop is slower than the old one.'], a: 0, r: 'vergelijk',
        w: 'sneller dan is faster than. As fast as would be net zo snel als.' },

      // ---- listen
      { listen: true, nl: 'het grootste scherm', en: 'the biggest screen' },
      { listen: true, nl: 'het hele team', en: 'the whole team' },
      { listen: true, nl: 'ik bel hem', en: 'I call him' },
      { listen: true, nl: 'Het waait vandaag hard.', en: "It's blowing hard today." },

      // ---- look
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'nummer', value: 4, nl: 'vier', en: '4' },

      // ---- de of het
      { dehet: true, nl: 'wachtwoord', art: 'het', en: 'the password', w: 'A compound takes the article of its last part: het woord, so het wachtwoord.' },
      { dehet: true, nl: 'probleem', art: 'het', en: 'the problem', w: 'No rule helps here: it is het probleem, learn it with the article.' },
    ] }]);
})();
