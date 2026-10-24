// Nachtrit, Groningen (tier 10, B1): level 103 Het werk. A home office in a student house off the Grote Markt, an office
// opposite the golden tower of the Groninger Museum, bikes piled on every bridge on the way, the Martinitoren (d'Olle
// Grieze) watching the standup from the corner of the square. The standup, meetings, incidents, colleagues, the laptop.
// New at tier 10 and drilled here: opinions (ik vind dat with the verb at the end, volgens mij with V2 behind it),
// contrast with hoewel (sub-clause) against ondanks (a noun only), zullen for probability (zal wel), separable verbs in
// sub-clauses (omdat ik opsta, hoewel de server uitvalt), diminutives and their het (mailtje, koffietje, foutje, appje),
// the adjective -e in all cases (de nieuwe collega, een nieuw scherm, het oude dashboard, geen goed idee, lange vergaderingen).
// Review of earlier tiers: perfectum with a separable participle (opgepakt) after a time word, the comparative sneller,
// toen plus imperfectum in a sub-clause, the reflexive ik heb me vergist (in de cijfers).
// Still inside the fence: 16 words max, no passive, no plusquamperfectum, no indirect speech.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, scheidbare werkwoorden, V2 word order,
// perfectum, imperfectum, reflexieve werkwoorden; _site/grammar/zullen-belofte-waarschijnlijkheid,
// het-adjectief-de-e-regel-adjectives, conjuncties-voegwoorden, de-of-het-articles, trappen-van-vergelijking-comparison;
// _site/situations/opinions (Ik vind, Volgens mij, Wat vind je van); _site/situations/office (Heb je even, Druk vandaag);
// 04 - Phrases & Scenarios/De standup - tech talk (Dynatrace, storing, blockers), Koffiepraatje op kantoor (Alweer een
// reorganisatie, Het apparaat doet het weer niet); content/towns.js for Groningen (de student, de aardbeving, de scheur,
// the Martinitoren, the Groninger Museum, kon minder). No jokes about the quakes.
// New rules: mening, tegen, zullen, verklein (guarded below; sep, bijzin, v2, adj, vergelijk, refl are reused).
// New props: none. Used: fiets, deur, brug.
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 103, act: 10, name: 'Het werk', town: 'groningen', place: 'werk', theme: 'square', ...P,
    intro: 'In Groningen nobody says the standup went well. They say it could be worse, which here counts as a standing ovation.',
    introNl: 'In Groningen zegt niemand dat de standup goed ging. Ze zeggen: kon minder, en dat is hier een staande ovatie.',
    mission: {
      where: 'A home office in a student house off the Grote Markt, where the Martinitoren, d\'Olle Grieze, watches the standup from the corner of the square. Later a desk at the office opposite the golden tower of the Groninger Museum, with bikes piled on every bridge on the way. At lunch the dogs need a walk, because the dogs always need a walk.',
      carry: 'A laptop at nine percent, two leads, a coffee split to the cent with the intern, and the grammar book, still never opened. No helmet. The bike pile does not care.',
      want: 'The mist came and everyone who spoke Dutch changed. In Groningen the dead have opinions: ik vind dat, volgens mij, hoewel, ondanks, and the verb waits at the very end like a student for the first bus. Whatever breaks gets a zal wel. The women are still taller than you, and they still split the bill.' },
    items: [
      // ---- builds: opinions and contrast (new at tier 10)
      { en: 'I think the standup takes too long.', parts: ['Ik vind', FK(['dat de standup te lang duurt', 'dat de standup duurt te lang', 'dat duurt de standup te lang'], 0, 'mening',
        'ik vind dat opens a sub-clause, so the verb goes to the very end: te lang duurt.'), '.'] },
      { en: 'In my opinion the problem is in the network.', parts: ['Volgens mij', FK(['zit het probleem', 'het probleem zit'], 0, 'mening',
        'Volgens mij fills slot 1, so the verb comes next: zit het probleem. It is not a sub-clause like ik vind dat.'), 'in het netwerk.'] },
      { en: 'Although it is busy, I am still going to lunch.', parts: ['Hoewel het', FK(['druk is', 'is druk'], 0, 'hoewel',
        'hoewel opens a sub-clause, so the verb goes to the end: druk is.'), ',', FK(['ga ik', 'ik ga'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: ga ik.'), 'toch lunchen.'] },
      { en: 'Despite the outage the release still went live.', parts: [FK(['Ondanks', 'Hoewel'], 0, 'hoewel',
        'ondanks goes in front of a noun: ondanks de storing. hoewel needs a whole clause with its own verb at the end.'), 'de storing', FK(['ging de release', 'de release ging'], 0, 'v2',
        'The opening phrase fills slot 1, so the verb comes next: ging de release.'), 'toch live.'] },

      // ---- builds: zullen for probability
      { en: 'The connection will probably go down again.', parts: ['De verbinding', FK(['zal', 'zul', 'zullen'], 0, 'zullen',
        'zal wel means probably. One verbinding, so zal. zul belongs to je or jij, zullen is for we, zij and other plurals.'), 'wel weer uitvallen.'] },
      { en: 'Mark is not here. He is probably stuck in traffic.', parts: ['Mark is er niet. Hij zal wel in de file', FK(['staan', 'staat', 'gestaan'], 0, 'zullen',
        'zal is the finite verb, so the second verb stays an infinitive at the end: zal wel staan. staat and gestaan are not infinitives.'), '.'] },

      // ---- builds: separable verbs in sub-clauses
      { en: 'I am tired because I get up early every day.', parts: ['Ik ben moe omdat ik elke dag vroeg', FK(['opsta', 'sta op'], 0, 'sep',
        'In a sub-clause the verb goes to the end and the prefix glues back on: omdat ik opsta.'), '.'] },
      { en: 'Although the server goes down every night, the customer notices nothing.', parts: ['Hoewel de server elke nacht', FK(['uitvalt', 'valt uit'], 0, 'sep',
        'hoewel sends the verb to the end, and uit glues back to it: uitvalt.'), ',', FK(['merkt de klant', 'de klant merkt'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: merkt de klant.'), 'er niets van.'] },

      // ---- builds: diminutives and het
      { en: 'Can you send me a quick email?', parts: ['Kun je me even een', FK(['mailtje', 'mailje'], 0, 'verklein',
        'After an l the diminutive is -tje: mailtje, like tafeltje. The word is then het mailtje.'), 'sturen?'] },
      { en: 'Shall we get a little coffee before the standup?', parts: ['Zullen we nog een', FK(['koffietje', 'koffieje'], 0, 'verklein',
        'koffie ends in a vowel, so the diminutive takes -tje: koffietje.'), 'halen voor de standup?'] },
      { en: 'The little mistake is not so bad.', parts: [FK(['Het', 'De'], 0, 'verklein',
        'Every -je word is het, even though de fout is de: het foutje.'), 'foutje is niet zo erg.'] },

      // ---- builds: the adjective -e
      { en: 'The new colleague has a new screen.', parts: ['De', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'After de the adjective takes -e: de nieuwe collega.'), 'collega heeft een', FK(['nieuw', 'nieuwe'], 0, 'adj',
        'scherm is a het-word, and after een it stays bare: een nieuw scherm. A de-word would be een nieuwe laptop.'), 'scherm.'] },
      { en: 'I work on the customer\'s old dashboard.', parts: ['Ik werk aan het', FK(['oude', 'oud'], 0, 'adj',
        'After het the adjective still takes -e: het oude dashboard. Only after een does a het-word lose it.'), 'dashboard van de klant.'] },
      { en: 'This is not a good idea.', parts: ['Dit is geen', FK(['goed', 'goede'], 0, 'adj',
        'idee is a het-word, so after geen it stays bare: geen goed idee. For a de-word it would be geen goede oplader.'), 'idee.'] },
      { en: 'My new boss likes long meetings.', parts: ['Mijn', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'baas is a de-word, so after mijn it takes -e: mijn nieuwe baas.'), 'baas houdt van', FK(['lange', 'lang'], 0, 'adj',
        'A plural always takes -e: lange vergaderingen.'), 'vergaderingen.'] },

      // ---- builds: review of earlier tiers
      { en: 'This morning I picked up the alert.', parts: ['Vanochtend', FK(['heb ik', 'ik heb'], 0, 'v2',
        'Vanochtend fills slot 1, so the verb comes second: heb ik.'), 'de melding', FK(['opgepakt', 'geoppakt', 'oppgepakt'], 0, 'sep',
        'The ge goes in the middle: op + gepakt, written as one word at the end.'), '.'] },
      { en: 'The new laptop is faster than the old one.', parts: ['De nieuwe laptop is', FK(['sneller', 'snelder', 'meer snel'], 0, 'vergelijk',
        'snel takes -er for the comparative: sneller dan.'), 'dan de oude.'] },
      { en: 'When the server went down, I called the boss.', parts: ['Toen de server', FK(['uitviel', 'viel uit'], 0, 'sep',
        'toen opens a sub-clause: the verb goes to the end and the prefix glues back on, uitviel.'), ',', FK(['belde ik', 'ik belde'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: belde ik.'), 'de baas.'] },
      { en: 'Sorry, I got the figures wrong.', parts: ['Sorry, ik heb', FK(['me', 'zich'], 0, 'refl',
        'zich vergissen: after ik it is me. zich belongs to hij, zij and het.'), 'in de cijfers vergist.'] },

      // ---- words: the desk, the team, the pressure, the city
      { w: 'the colleague', nl: 'de collega' }, { w: 'the screen', nl: 'het scherm', wrong: 'de scherm' },
      { w: 'the outage', nl: 'de storing' }, { w: 'the alert', nl: 'de melding' },
      { w: 'the desk', nl: 'het bureau', wrong: 'de bureau' }, { w: 'the keyboard', nl: 'het toetsenbord', wrong: 'de toetsenbord' },
      { w: 'the mouse', nl: 'de muis' }, { w: 'the charger', nl: 'de oplader' }, { w: 'the headphones', nl: 'de koptelefoon' },
      { w: 'the coffee machine', nl: 'het koffieapparaat', wrong: 'de koffieapparaat' }, { w: 'the customer', nl: 'de klant' },
      { w: 'the deadline', nl: 'de deadline' }, { w: 'the boss', nl: 'de baas' }, { w: 'the workload', nl: 'de werkdruk' },
      { w: 'the intern', nl: 'de stagiair' }, { w: 'the student', nl: 'de student' },
      { w: 'the earthquake', nl: 'de aardbeving' }, { w: 'the crack', nl: 'de scheur' },

      // ---- reads: four traps with their own options, two lines from the office and the city
      { read: true, nl: 'Hoewel ik moe ben, ga ik toch naar kantoor.', o: ['Although I am tired, I am still going to the office.', 'Because I am tired, I am going to the office.', 'I am tired, so I am staying home.'], a: 0, r: 'hoewel',
        w: 'hoewel means although: being tired does not stop the trip. Because would be omdat.' },
      { read: true, nl: 'Dat zal wel een storing zijn.', o: ['That is probably an outage.', 'That is going to be an outage tomorrow.', 'That is certainly not an outage.'], a: 0, r: 'zullen',
        w: 'zal wel is a guess about now. Something expected tomorrow would need a time word like morgen.' },
      { read: true, nl: 'Ondanks de werkdruk neemt Mark toch een pauze.', o: ['Despite the workload Mark still takes a break.', 'Because of the workload Mark takes a break.', 'Mark has no workload, so he takes a break.'], a: 0, r: 'hoewel',
        w: 'ondanks means despite: the workload does not stop the break. Because of would be door or vanwege.' },
      { read: true, nl: 'Volgens mij heeft Mark gelijk.', o: ['I think Mark is right.', 'Mark thinks I am right.', 'I know for sure that Mark is wrong.'], a: 0, r: 'mening',
        w: 'volgens mij is a soft opinion: the speaker is the one who thinks it. Mark giving his opinion would be volgens hem.' },
      { read: true, nl: 'Heb je even? Ik heb een korte vraag.', en: 'Got a minute? Quick question.' },
      { read: true, nl: 'Het apparaat doet het weer niet.', en: 'The machine is not working again.' },

      // ---- listens: an office word, a landmark, two words of this tier
      { listen: true, nl: 'het wachtwoord', en: 'the password' }, { listen: true, nl: 'de Martinitoren', en: 'the Martini Tower' },
      { listen: true, nl: 'ondanks', en: 'despite' }, { listen: true, nl: 'volgens mij', en: 'in my opinion' },

      // ---- looks: the bike (no helmet), the office door, a bridge with bikes on it
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'appje', art: 'het', en: 'the little app', w: 'het appje. Every -je word is het, even though de app is de.' },
      { dehet: true, nl: 'systeem', art: 'het', en: 'the system', w: 'het systeem. The plural is de systemen, because every plural is de.' },
    ] }]);
})();
