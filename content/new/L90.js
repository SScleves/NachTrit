// Nachtrit, Urk (tier 8, B1): level 90 De haven van Urk, the town's own place. The old fishing port: the big steel cutters
// (kotters) moored side by side, the fish auction, smoked eel and kibbeling, the white lighthouse of 1845, the church by the
// water, the Fishermen's Monument with the names of the drowned, the Sunday rest, the Urker dialect (de kark, Oe got ut),
// weather and the IJsselmeer. Urk was an island until 1939 and still acts like one.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and voordat;
// the main clause after a sub-clause that starts with its verb (Als het stormt, blijven de kotters ...); want and maar
// keeping normal V2. Review: the imperfectum (werkte, waren, was), the perfectum with hebben and zijn (gegeten, uitgevaren),
// V2 after a time word, a reflexive verb, the adjective without -e after een + het-word, geen against niet, comparatives.
// Still inside the fence: 14 words max, no relative clauses, no te + infinitive, no separable verbs inside sub-clauses,
// no passive, no zullen for probability.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde (the trigger words, want/maar/dus keep V2,
// the bijzin-first inversion), V2 word order, imperfectum, perfectum, 't kofschip, zijn of hebben, scheidbare werkwoorden,
// reflexieve werkwoorden, niet vs geen; _site/words (de vis, het eiland, het schip, de schepen, Ik blijf thuis, omdat het
// vandaag regent, Het regent vandaag), MOC Voegwoorden (omdat, als, dat, toen, terwijl), MOC Het weer;
// sentences (Ik golf terwijl mijn vrouw werkt, Maak een boodschappenlijstje voordat je naar de winkel gaat);
// content/towns.js for Urk (de kotter, de vissersvloot, de visafslag, de zondagsrust, het IJsselmeer, de vuurtoren,
// Het Vissersmonument, de kark, Oe got ut, Op zondag vaart hier niemand uit, the Sunday joke).
// New rules: none (bijzin, v2, imp, perf, kof, aux, sep, refl, adj, neg, cult are in data.js; vergelijk is guarded below
// and defined the same way in the other levels).
// New props: none. Only hond, fiets and kerk are used (not water, lamp, huis or brug: de zee, het IJsselmeer and de
// vuurtoren are in the word pool and could be taken for a lamp or for water).
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 90, act: 8, name: 'De haven van Urk', town: 'urk', place: 'eigen', theme: 'dyke', ...P,
    intro: 'The mist came and everyone who spoke Dutch changed, except on Urk, where nobody noticed because everyone was in church.',
    introNl: 'De mist kwam en iedereen die Nederlands sprak veranderde, behalve op Urk, waar niemand het merkte omdat iedereen in de kerk zat.',
    mission: {
      where: 'The old harbour of Urk, from the fish auction along the big steel cutters to the white lighthouse and the stone woman of the Fishermen\'s Monument, with the grey IJsselmeer to the horizon. Narrow alleys, small brick houses, nothing to stop the wind. Urk was an island until 1939 and still acts like one.',
      carry: 'Two dogs who smell the smoked eel before you do, a paper bag of kibbeling split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The seagulls have opinions about that.',
      want: 'The dead of Urk speak in long sentences and park the verb at the very end. Omdat, dat, als, toen, terwijl, voordat: the verb sails to the back of the clause, and the clause that follows starts with its verb. Want and maar stay calm. It is Sunday somewhere, so nobody sails out, the women are still taller than you, and the dogs still need a walk.' },
    items: [
      // ---- builds: sub-clauses with the verb at the end (omdat, dat, als, toen, terwijl, voordat)
      { en: 'Nobody sails out because it is Sunday.', parts: ['Niemand vaart uit omdat', FK(['het zondag is', 'is het zondag'], 0, 'bijzin',
        'omdat sends the verb to the end of its clause: omdat het zondag is.'), '.'] },
      { en: 'I cycle slowly because the quay is slippery.', parts: ['Ik fiets langzaam omdat de kade', FK(['glad is', 'is glad'], 0, 'bijzin',
        'After omdat the verb goes last: omdat de kade glad is.'), '.'] },
      { en: 'Paola says the dogs are still outside.', parts: ['Paola zegt dat', FK(['de honden nog buiten zijn', 'zijn de honden nog buiten'], 0, 'bijzin',
        'dat opens a sub-clause, so zijn goes to the end: dat de honden nog buiten zijn.'), '.'] },
      { en: 'Paola says I need a helmet.', parts: ['Paola zegt dat ik een helm', FK(['nodig heb', 'heb nodig'], 0, 'bijzin',
        'After dat the verb goes to the end: dat ik een helm nodig heb.'), '.'] },
      { en: 'I think the cutters here are bigger than the boats in Alblasserdam.', parts: ['Ik denk dat de kotters hier', FK(['groter', 'grotter', 'grooter'], 0, 'vergelijk',
        'groot loses one o when -er is added, because the long o now sits in an open syllable: gro-ter, with a single t. The comparative of groot is groter, the superlative het grootst.'), 'zijn dan de boten in Alblasserdam.'] },
      { en: 'If it storms, the cutters stay in the harbour.', parts: ['Als het stormt,', FK(['blijven de kotters', 'de kotters blijven'], 0, 'bijzin',
        'A sub-clause in slot 1 counts as one block, so the main clause starts with its verb: blijven de kotters.'), 'in de haven.'] },
      { en: 'When we were at the lighthouse, the door was closed.', parts: ['Toen we bij de vuurtoren', FK(['waren', 'was', 'zijn'], 0, 'imp',
        'toen is for one moment in the past, so the imperfectum: waren, plural for we.'), ',', FK(['was de deur', 'de deur was'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: was de deur dicht.'), 'dicht.'] },
      { en: 'The dogs wait at the stall while I buy kibbeling.', parts: ['De honden wachten bij de kraam terwijl ik', FK(['kibbeling koop', 'koop kibbeling'], 0, 'bijzin',
        'terwijl sends the verb to the end: terwijl ik kibbeling koop.'), '.'] },
      { en: 'I eat kibbeling before I go home.', parts: ['Ik eet kibbeling voordat', FK(['ik naar huis ga', 'ga ik naar huis'], 0, 'bijzin',
        'voordat is a sub-clause word: the verb goes last, voordat ik naar huis ga.'), '.'] },
      { en: 'Before the cutter leaves, the fisherman checks the net.', parts: ['Voordat de kotter vertrekt,', FK(['controleert de visser', 'de visser controleert'], 0, 'bijzin',
        'The sub-clause fills slot 1, so the verb of the main clause comes right after the comma.'), 'het net.'] },

      // ---- builds: want and maar keep V2
      { en: 'The church is full, because it is Sunday.', parts: ['De kerk is vol,', FK(['want het is zondag', 'want het zondag is'], 0, 'v2',
        'want is not a sub-clause word. It keeps normal order: want het is zondag.'), '.'] },
      { en: 'I want kibbeling, but the stall is closed.', parts: ['Ik wil kibbeling, maar de kraam', FK(['is dicht', 'dicht is'], 0, 'v2',
        'maar keeps normal V2 order: the verb stays in second place.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday we ate kibbeling by the harbour.', parts: ['Gisteren', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second, then we.'), 'bij de haven kibbeling', FK(['gegeten', 'geeten', 'gegeet'], 0, 'perf',
        'eten is irregular: gegeten.'), '.'] },
      { en: 'My grandfather worked on a cutter for forty years.', parts: ['Mijn opa', FK(['werkte', 'werkde', 'werkten'], 0, 'kof',
        'werk ends in k, a soft ketchup letter, so the past is werkte. One person, so no -n.'), 'veertig jaar op een kotter.'] },
      { en: 'The cutter sailed out last night.', parts: ['De kotter', FK(['is', 'heeft'], 0, 'aux',
        'Sailing out is going somewhere, so zijn: is uitgevaren.'), 'gisteravond', FK(['uitgevaren', 'geuitvaren', 'uitgevaard'], 0, 'sep',
        'The ge goes inside a separable verb. varen is irregular: uit + gevaren, written as one word.'), '.'] },
      { en: 'On the cutter I did not feel well.', parts: ['Op de kotter voelde ik', FK(['me', 'zich'], 0, 'refl',
        'zich voelen: ik takes me, and it sits right after the subject.'), 'niet lekker.'] },
      { en: 'It is a small church by the sea.', parts: ['Het is een', FK(['klein', 'kleine'], 0, 'adj',
        'kerkje is a het-word, and after een a het-word takes no -e: een klein kerkje.'), 'kerkje aan de zee.'] },
      { en: 'There is no fish auction on Sunday, because nobody sails out.', parts: ['Er is op zondag', FK(['geen', 'niet'], 0, 'neg',
        'geen replaces een: een visafslag becomes geen visafslag. niet cannot stand there.'), 'visafslag, want niemand vaart uit.'] },

      // ---- words: the port, the fish, the sea and the weather
      { w: 'the fishing cutter', nl: 'de kotter' }, { w: 'the fishing fleet', nl: 'de vissersvloot' }, { w: 'the fish auction', nl: 'de visafslag' },
      { w: 'the lighthouse', nl: 'de vuurtoren' }, { w: 'the fisherman', nl: 'de visser' }, { w: 'the net', nl: 'het net', wrong: 'de net' },
      { w: 'the smoked eel', nl: 'de gerookte paling' }, { w: 'the kibbeling', nl: 'de kibbeling' }, { w: 'the seagull', nl: 'de meeuw' },
      { w: 'the sea', nl: 'de zee' }, { w: 'the IJsselmeer', nl: 'het IJsselmeer', wrong: 'de IJsselmeer' }, { w: 'the storm', nl: 'de storm' },
      { w: 'the wave (not the sport)', nl: 'de golf' }, { w: 'the Sunday rest', nl: 'de zondagsrust' },
      { w: 'the fishermen\'s monument', nl: 'het Vissersmonument', wrong: 'de Vissersmonument' }, { w: 'the island', nl: 'het eiland', wrong: 'de eiland' },
      { w: 'the weather', nl: 'het weer', wrong: 'de weer' }, { w: 'the mist', nl: 'de mist' }, { w: 'the rain', nl: 'de regen' },

      // ---- reads: the Sunday rule, a trap on omdat, a trap on als, the dialect, two plain lines
      { read: true, nl: 'Op zondag vaart hier niemand uit.', o: ['On Sunday nobody sails out here.', 'On Sunday everybody sails out here.', 'Nobody sails out here on Saturday.'], a: 0, r: 'cult',
        w: 'niemand is nobody, zondag is Sunday. The Urker Sunday rest in one line.' },
      { read: true, nl: 'Ik blijf thuis omdat het stormt.', o: ['I am staying home because it is storming.', 'I am staying home, so it is storming.', 'It is storming because I stay home.'], a: 0, r: 'bijzin',
        w: 'omdat gives the reason, and the verb stormt sits at the end. The storm is the cause, not the result.' },
      { read: true, nl: 'Als de vuurtoren draait, zijn de kotters veilig.', o: ['If the lighthouse turns, the cutters are safe.', 'When the cutters are safe, the lighthouse turns.', 'The lighthouse turns although the cutters are not safe.'], a: 0, r: 'bijzin',
        w: 'als begins the sub-clause, draait goes last, and zijn starts the main clause. The light comes first, the safety follows.' },
      { read: true, nl: 'Oe got ut?', o: ['How are you? (Urker dialect)', 'Where are you going? (Urker dialect)', 'What is that? (Urker dialect)'], a: 0, r: 'cult',
        w: 'Oe got ut is Urker for Hoe gaat het: the h drops, gaat becomes got and het becomes ut. Urkers say it on the quay all day.' },
      { read: true, nl: 'Terwijl het regent, eten we kibbeling.', o: ['While it rains, we eat kibbeling.', 'Because it rains, we eat kibbeling.', 'After we eat kibbeling, it rains.'], a: 0, r: 'bijzin',
        w: 'terwijl means while, two things at the same time. Its clause comes first, so the main clause starts with its verb: eten we.' },
      { read: true, nl: 'Toen de mist kwam, gingen alle vissers naar de kerk.', o: ['When the mist came, all the fishermen went to church.', 'When the fishermen went to church, the mist came.', 'When the mist comes, all the fishermen go to church.'], a: 0, r: 'bijzin',
        w: 'toen with kwam and gingen is one moment in the past, and the mist comes first. The sub-clause leads, so gingen starts the main clause.' },

      // ---- listens: a skipper, a conjunction, the smokehouse, the gulls
      { listen: true, nl: 'de schipper', en: 'the skipper' }, { listen: true, nl: 'terwijl', en: 'while' },
      { listen: true, nl: 'de rookoven', en: 'the smoking oven' }, { listen: true, nl: 'de meeuwen', en: 'the seagulls' },

      // ---- looks: the dog, the bike, the church
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- de of het
      { dehet: true, nl: 'zout', art: 'het', en: 'the salt', w: 'het zout. Many materials are het: het zout, het ijzer, het hout.' },
      { dehet: true, nl: 'kreeft', art: 'de', en: 'the lobster' },
    ] }]);
})();
