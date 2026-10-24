// Nachtrit, Urk (tier 8, B1): level 87 Het werk. An office above the fish auction on the harbour, a window on the
// cutters, the white lighthouse and the grey IJsselmeer. Office and home office, the standup, meetings, incidents,
// colleagues, the laptop, with the Sunday rest as the one rule nobody breaks, not even the outages.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and
// voordat (also with a perfect with heb, a modal and aan het; separable verbs in a sub-clause wait for tier 10), want and maar keeping V2 against
// omdat, and the main clause after a sub-clause starting with its verb (Als het hard waait, blijven de kotters ...).
// Review of earlier tiers: imperfectum (was, wilde, kwam), perfectum with a separable participle (ingesteld) and
// with zijn (gegaan), reflexive voelen, zou plus infinitive, comparative liever, geen against niet, V2 after a
// time word, present tense endings.
// Still inside the fence: 14 words max, no relative clauses, no te plus infinitive, no passive, no plusquamperfectum.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, scheidbare
// werkwoorden, reflexieve werkwoorden, imperfectum, niet vs geen; 04 - Phrases & Scenarios/De standup - tech talk,
// Koffiepraatje op kantoor, Uitleggen wat je doet - Dynatrace; _site/situations/office; MOC Voegwoorden;
// content/towns.js for Urk (de vissersvloot, de kotter, de visafslag, de klederdracht, de kraplap, de zondagsrust,
// het IJsselmeer, de vuurtoren, Op zondag vaart hier niemand uit., the Sunday joke).
// New rules: none (vergelijk, zou and presens are guarded below). New props: none (kerk, deur, fiets).
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou + infinitive: polite requests', note: 'modale werkwoorden' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 87, act: 8, name: 'Het werk', town: 'urk', place: 'werk', theme: 'dyke', ...P,
    intro: 'On Urk even the outages keep the Sunday rest. The standup starts on Monday at nine, and the dead are already in their seats.',
    introNl: 'Op Urk houden zelfs de storingen zondagsrust. De standup begint maandag om negen uur, en de doden zitten al op hun plek.',
    mission: {
      where: 'An office above the fish auction on the harbour, with a window on the cutters, the white lighthouse and the grey IJsselmeer. The wifi comes from a boat. So does the smell. The dogs always need a walk, so the walk goes along the quay.',
      carry: 'A laptop at three percent, a lanyard, two leads, and a lunch receipt split to the cent between six colleagues. The grammar book was never opened. No helmet, and the wind off the IJsselmeer has an opinion about that.',
      want: 'The mist came and everyone who spoke Dutch changed. On Urk they now hold the standup in sub-clauses: omdat, dat, als, and the verb sails to the very end of the sentence like a cutter and does not come back before Monday. The women in their Sunday dress are still taller than you, and the dead keep the front row, in their Sunday clothes.' },
    items: [
      // ---- builds: omdat, want, dat (the verb goes to the end, or it stays second)
      { en: "I'm late because the cutter is blocking the harbour.", parts: ['Ik ben te laat', FK(['omdat de kotter de haven blokkeert', 'omdat de kotter blokkeert de haven', 'omdat blokkeert de kotter de haven'], 0, 'bijzin',
        'omdat sends the verb to the very end: omdat de kotter de haven blokkeert.'), '.'] },
      { en: "I work at home because the wifi at the office doesn't work.", parts: ['Ik werk thuis', FK(['omdat', 'want'], 0, 'bijzin',
        'omdat sends doet to the end, as here. want would keep it second: want de wifi doet het niet.'), 'de wifi op kantoor het niet doet.'] },
      { en: 'Mark says the server works again.', parts: ['Mark zegt', FK(['dat de server weer werkt', 'dat de server werkt weer', 'dat werkt de server weer'], 0, 'bijzin',
        'dat opens a sub-clause, so werkt is not second but goes to the end: dat de server weer werkt.'), '.'] },
      { en: "I'm tired because I solved an outage last night.", parts: ['Ik ben moe', FK(['omdat ik vannacht een storing heb opgelost', 'omdat ik heb vannacht een storing opgelost', 'omdat ik vannacht een storing opgelost'], 0, 'bijzin',
        'In a sub-clause the helper heb goes to the end with the participle, and it may not be missing: heb opgelost.'), '.'] },
      { en: 'My boss says I may work from home today.', parts: ['Mijn baas zegt', FK(['dat ik vandaag thuis mag werken', 'dat ik mag vandaag thuis werken', 'dat ik vandaag thuis te werken mag'], 0, 'bijzin',
        'After dat the verbs go to the end: mag werken. No te after a modal.'), '.'] },

      // ---- builds: als, toen, terwijl, voordat, and the main clause that follows
      { en: 'If there is an outage on Sunday, I wait until Monday.', parts: ['Als er op zondag een storing', FK(['is', 'zijn', 'ben'], 0, 'zijn',
        'een storing is one thing, so is. zijn is for several, ben for ik.'), ',', FK(['wacht ik', 'ik wacht'], 0, 'bijzin',
        'When the sub-clause comes first, the main clause starts with its verb: wacht ik.'), 'tot maandag.'] },
      { en: 'When I got to the fish auction, the colleagues were already at the table.', parts: ['Toen ik bij de visafslag', FK(['kwam', 'kwamen', 'komde'], 0, 'bijzin',
        'toen sends the verb to the end, and komen is irregular in the past: ik kwam.'), ',', FK(["zaten de collega's", "de collega's zaten"], 0, 'bijzin',
        'The sub-clause came first, so the next clause starts with its verb: zaten de collega\'s.'), 'al aan tafel.'] },
      { en: 'While I am building a dashboard, the dogs sleep under my desk.', parts: ['Terwijl ik een dashboard', FK(['aan het bouwen ben', 'ben aan het bouwen'], 0, 'bijzin',
        'terwijl sends the verb to the end, even behind aan het bouwen: aan het bouwen ben.'), ',', FK(['slapen de honden', 'de honden slapen'], 0, 'bijzin',
        'The sub-clause is first, so the main clause begins with its verb: slapen de honden.'), 'onder mijn bureau.'] },
      { en: 'I first get a coffee before I start.', parts: ['Ik haal eerst koffie', FK(['voordat ik begin', 'voordat begin ik', 'voordat ik beginnen'], 0, 'bijzin',
        'voordat sends the verb to the end, and ik takes begin: voordat ik begin.'), '.'] },
      { en: 'When it blows hard, the cutters stay in the harbour.', parts: [FK(['Als', 'Toen'], 0, 'bijzin',
        'toen is for one moment in the past. waait is the present, so als.'), 'het hard waait,', FK(['blijven de kotters', 'de kotters blijven'], 0, 'bijzin',
        'The sub-clause comes first, so the main clause starts with its verb: blijven de kotters.'), 'in de haven.'] },
      { en: 'If it stays dry on Saturday, I will go golfing with Paola.', parts: ['Als het zaterdag droog', FK(['blijft', 'blijf', 'blijven'], 0, 'presens',
        'het takes the hij-form: blijft, with the t.'), ',', FK(['ga ik', 'ik ga'], 0, 'bijzin',
        'After a sub-clause the main clause starts with its verb: ga ik.'), 'met Paola golfen.'] },

      // ---- builds: want and maar keep V2
      { en: 'I wanted to start early, but the mist was too thick.', parts: ['Ik', FK(['wilde', 'wildde'], 0, 'imp',
        'wil ends in l, not a ketchup letter, so the past is wilde.'), 'vroeg beginnen,', FK(['maar de mist was te dik', 'maar de mist te dik was', 'maar was de mist te dik'], 0, 'bijzin',
        'maar is not a sub-clause word. Normal order stays, the verb is second: de mist was.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday there was an outage at the fish auction.', parts: ['Gisteren', FK(['was er', 'er was', 'waren er'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second, then er. One outage, so was.'), 'een storing bij de visafslag.'] },
      { en: 'This morning I reconfigured the alerts.', parts: ['Vanmorgen', FK(['heb ik', 'ik heb'], 0, 'v2',
        'Vanmorgen takes slot 1, so heb comes second, then ik.'), 'de alerts opnieuw', FK(['ingesteld', 'ingestelt'], 0, 'sep',
        'The ge goes in the middle: in + gesteld, one word. stel ends in l, so -d.'), '.'] },
      { en: "I'm staying home today because I don't feel well.", parts: ['Ik blijf vandaag thuis omdat ik', FK(['me', 'zich'], 0, 'refl',
        'voelen is reflexive and the self word matches ik: ik voel me. zich is for hij, zij, het.'), 'niet lekker', FK(['voel', 'voelt'], 0, 'presens',
        'ik takes the bare stem: voel, no t.'), '.'] },
      { en: 'Could you help me before the standup starts?', parts: ['Zou je me', FK(['kunnen', 'kan', 'kon'], 0, 'zou',
        'zou is the polite opener and the next verb stays an infinitive: zou je kunnen.'), 'helpen', FK(['voordat de standup begint', 'voordat begint de standup'], 0, 'bijzin',
        'voordat sends the verb to the end: voordat de standup begint.'), '?'] },
      { en: 'I would rather work on the cutter because the wifi is faster there.', parts: ['Ik werk', FK(['liever', 'graager', 'meer graag'], 0, 'vergelijk',
        'graag, liever, liefst: the comparative of graag is liever.'), 'op de kotter', FK(['omdat de wifi daar sneller is', 'omdat de wifi daar is sneller'], 0, 'bijzin',
        'omdat sends the verb to the very end: sneller is.'), '.'] },
      { en: "I have no time today because I'm in meetings all day.", parts: ['Ik heb vandaag', FK(['geen', 'niet'], 0, 'neg',
        'geen goes with a noun: geen tijd. niet is for verbs and adjectives.'), 'tijd omdat ik de hele dag', FK(['in vergaderingen zit', 'zit in vergaderingen'], 0, 'bijzin',
        'omdat sends the verb to the end: in vergaderingen zit.'), '.'] },
      { en: 'On Sunday all the colleagues went to church, so there was nobody at the office.', parts: ['Zondag', FK(['zijn', 'hebben'], 0, 'aux',
        'Going somewhere takes zijn: zijn gegaan.'), "alle collega's naar de kerk", FK(['gegaan', 'gegaat'], 0, 'perf',
        'gaan has its own participle: gegaan.'), ', dus er was niemand op kantoor.'] },

      // ---- words: the incident, the laptop, the harbour office
      { w: 'the incident', nl: 'het incident', wrong: 'de incident' }, { w: 'the standup', nl: 'de standup' },
      { w: 'the laptop', nl: 'de laptop' }, { w: 'the server', nl: 'de server' },
      { w: 'the network', nl: 'het netwerk', wrong: 'de netwerk' }, { w: 'the problem', nl: 'het probleem', wrong: 'de probleem' },
      { w: 'the solution', nl: 'de oplossing' }, { w: 'the connection', nl: 'de verbinding' },
      { w: 'the project', nl: 'het project', wrong: 'de project' }, { w: 'the password', nl: 'het wachtwoord' },
      { w: 'the dashboard', nl: 'het dashboard' }, { w: 'the boss', nl: 'de baas' },
      { w: 'the fish auction', nl: 'de visafslag' }, { w: 'the fishing fleet', nl: 'de vissersvloot' },
      { w: 'the fishing cutter', nl: 'de kotter' }, { w: 'the lighthouse', nl: 'de vuurtoren' },
      { w: 'the Sunday rest', nl: 'de zondagsrust' }, { w: 'the IJsselmeer', nl: 'het IJsselmeer', wrong: 'de IJsselmeer' },

      // ---- reads: three traps with their own options, three plain lines from the office and the island
      { read: true, nl: 'Omdat de wifi uitviel, ben ik naar huis gegaan.', o: ['Because the wifi went down, I went home.', 'I went home and then the wifi went down.', 'The wifi went down because I went home.'], a: 0, r: 'bijzin',
        w: 'Omdat opens the first part, so the cause comes first and the main clause starts with its verb: ben ik.' },
      { read: true, nl: 'Voordat de standup begon, was iedereen al online.', o: ['Before the standup began, everyone was already online.', 'After the standup began, everyone went online.', 'The standup began because everyone was online.'], a: 0, r: 'bijzin',
        w: 'voordat means before, and was iedereen al online is the main clause after it.' },
      { read: true, nl: 'Terwijl Mark praatte, viel de verbinding uit.', o: ['While Mark was talking, the connection dropped.', 'Mark was talking after the connection dropped.', 'Mark dropped the connection while he was talking to me.'], a: 0, r: 'bijzin',
        w: 'terwijl means while, and viel uit is the main clause. Nobody dropped anything on purpose.' },
      { read: true, nl: 'Op zondag vaart hier niemand uit.', en: 'On Sunday nobody sails out here.' },
      { read: true, nl: 'Als de server platligt, krijg ik een melding.', en: 'When the server goes down, I get an alert.' },
      { read: true, nl: 'Heb je even? Ik heb een korte vraag.', en: 'Got a minute? I have a quick question.' },

      // ---- listens: two Urk words, one conjunction by ear, one office word
      { listen: true, nl: 'de klederdracht', en: 'the traditional dress' }, { listen: true, nl: 'de haven', en: 'the harbour' },
      { listen: true, nl: 'voordat', en: 'before (the conjunction)' }, { listen: true, nl: 'de storing', en: 'the outage' },

      // ---- looks: the church (one of 24), the office door, the bike (no helmet)
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },

      // ---- de of het
      { dehet: true, nl: 'rooster', art: 'het', en: 'the schedule', w: 'het rooster. The plural is de roosters, because every plural is de.' },
      { dehet: true, nl: 'reorganisatie', art: 'de', en: 'the reorganisation', w: 'Words ending in -atie are de.' },
    ] }]);
})();
