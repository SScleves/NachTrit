// Nachtrit, Maastricht (tier 11, B1 to B2): level 114 Het Vrijthof, the town's own place. The big square in front of the
// Sint-Servaasbasiliek and the red tower of the Sint-Janskerk, terraces, the bookshop in the old Dominican church, vlaai and
// worstenbroodjes, carnaval and the optocht, the Limburg dialect (bomma, Noondezju), friet against patat, the marl caves in
// the Sint-Pietersberg where the Nachtwacht was hidden in the war, the treaty of 1992, Belgium five minutes away and Germany
// half an hour.
// New at tier 11 and drilled here: the passive with worden plus participle (wordt verbouwd, werd getekend, worden gebakken,
// moet uitgeruimd worden, the verb agreeing with its subject), is plus participle as a finished state (read item), the
// plusquamperfectum with hebben and zijn (had gewerkt, was gegaan, gegeten hadden), indirect speech (zei dat, vroeg of, the
// verb last, the tense moving back: hij zei dat hij het niet kon vinden) and two words in Maastricht dialect, marked as such.
// Review: V2 after a fronted phrase, 't kofschip, ver- participles without ge, separable participles, voordat and nadat clauses,
// the adjective -e, comparatives and superlatives, volgens mij and ik vind dat, om ... te, het-diminutives.
// Still inside the fence: 16 words max. No idioms with modal particles, no formal letter register (tiers 12 and 13).
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, imperfectum, bijzin - werkwoord naar het einde, V2 word order,
// 't kofschip, scheidbare werkwoorden; _site/words (worden, wordenword wordt werd is geworden, de vaatwasser moet nog
// uitgeruimd worden, komt u het afhalen of moet het bezorgd worden, hij zei dat hij ziek was, het was gisteravond heel koud
// in huis, de berg, de rekening, het dialect); content/towns.js for Maastricht (het Vrijthof, de Sint-Servaasbrug, de vlaai,
// het carnaval, de optocht, het verdrag, de heuvel, de mergel, de bomma, Noondezju, the friet rumour, the carnaval joke).
// New rules: passief, plusq and indirect, defined and guarded below. v2, bijzin, perf, kof, sep, adj, vergelijk, mening and
// omte exist.
// New props: none. Only hond, fiets and lamp are used (not kerk, brug, water, huis or boom: de basiliek, de Sint-Servaasbrug,
// de Maas, de boekhandel, de heuvel and de grot are in the word pool and could be taken for the prop).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'The passive: worden plus participle', note: 'wordenword · wordt · werd · is geworden' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had or was plus participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'hij zei dat hij ziek was' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 114, act: 11, name: 'Het Vrijthof', town: 'maastricht', place: 'eigen', theme: 'square', ...P,
    intro: 'Carnaval in Maastricht never really stopped, it only got quieter, and nobody can tell the dead from the costumes anymore.',
    introNl: 'Carnaval in Maastricht is eigenlijk nooit gestopt, het is alleen stiller geworden, en niemand ziet nog verschil tussen de doden en de verklede mensen.',
    mission: {
      where: 'The Vrijthof, the big square in front of the Sint-Servaasbasiliek, then through the old church that is now a bookshop and up the hill to the marl caves. Belgium is five minutes away and Germany half an hour, and the mist took the border too.',
      carry: 'A cherry vlaai for the neighbours, split to the cent, two dogs that need a walk (they always need a walk) and the grammar book, still never opened. No helmet. The cobbles do not care.',
      want: 'Since the mist everyone who spoke Dutch changed, and in Maastricht they changed into the dialect. On every terrace the dead say what is being done, what had been done before and what somebody said, with the verb at the very end. Paola, still taller than you, asks whether you understood. Here it is friet, never patat.' },
    items: [
      // ---- builds: the passive with worden
      { en: 'The basilica has been under renovation for years.', parts: ['De basiliek', FK(['wordt', 'worden', 'heeft'], 0, 'passief',
        'The basilica is one thing, so wordt. A passive is worden plus the participle, never heeft.'), 'al jaren', FK(['verbouwd', 'geverbouwd', 'verbouwen'], 0, 'perf',
        'ver- verbs never take ge: verbouwd. The participle sits at the very end.'), '.'] },
      { en: 'The treaty was signed in Maastricht in 1992.', parts: ['Het verdrag', FK(['werd', 'werden'], 0, 'passief',
        'One treaty, so werd. The past passive is werd plus the participle.'), 'in 1992 in Maastricht', FK(['getekend', 'getekent', 'tekenen'], 0, 'kof',
        'teken ends in n, no ketchup letter: getekend with a d.'), '.'] },
      { en: 'After the war the Sint-Servaasbrug was built again.', parts: ['Na de oorlog', FK(['werd', 'werden'], 0, 'passief',
        'Singular bridge, so werd. The subject comes right after it because Na de oorlog took slot 1.'), 'de Sint-Servaasbrug opnieuw', FK(['gebouwd', 'gebouwt', 'gebouwen'], 0, 'kof',
        'bouw ends in w, no ketchup letter: gebouwd with a d.'), '.'] },
      { en: 'The vlaai is baked fresh every morning at the baker.', parts: ['Bij de bakker', FK(['worden', 'wordt'], 1, 'passief',
        'Singular vlaai, so wordt. Worden is for more than one.'), 'de vlaai elke ochtend vers', FK(['gebakken', 'gebakt', 'bakken'], 0, 'perf',
        'bakken is irregular: gebakken, not gebakt.'), '.'] },
      { en: 'The big concert is given on the Vrijthof every summer.', parts: ['Het', FK(['grote', 'groot'], 0, 'adj',
        'After het with a definite article the adjective takes -e: het grote concert.'), 'concert', FK(['wordt', 'worden'], 0, 'passief',
        'One concert, so wordt.'), 'elke zomer op het Vrijthof gegeven.'] },
      { en: 'The dishwasher still has to be emptied before the borrel.', parts: ['De vaatwasser moet voor de borrel nog', FK(['uitgeruimd', 'geuitruimd', 'uitruimen'], 0, 'sep',
        'The ge goes in the middle: uit + geruimd, one word at the end.'), FK(['worden', 'wordt', 'werd'], 0, 'passief',
        'After moet the verb stays in the infinitive: moet worden. No -t.'), '.'] },
      { en: 'Are you coming to collect the vlaai or does it have to be delivered?', parts: ['Komt u de vlaai afhalen of moet hij', FK(['bezorgd', 'gebezorgd', 'bezorgen'], 0, 'passief',
        'moet hij bezorgd worden: the participle first, worden at the very end. be- verbs never take ge.'), 'worden?'] },

      // ---- builds: the plusquamperfectum
      { en: 'We had already eaten before the parade started.', parts: ['We', FK(['hadden', 'waren'], 0, 'plusq',
        'Eating takes hebben, so the plusquamperfectum is hadden gegeten.'), 'al gegeten', FK(['voordat de optocht begon', 'voordat begon de optocht'], 0, 'bijzin',
        'voordat sends the verb to the end of its clause: voordat de optocht begon.'), '.'] },
      { en: 'I had gone to the caves with the dogs, but it was too cold.', parts: ['Ik', FK(['was', 'had'], 0, 'plusq',
        'Going somewhere takes zijn, so the plusquamperfectum is was gegaan.'), 'met de honden naar de grotten', FK(['gegaan', 'gegaat'], 0, 'perf',
        'gaan is irregular: gegaan.'), ', maar het was te koud.'] },
      { en: 'The baker had already sold the last vlaai when we came.', parts: ['De bakker', FK(['had', 'was'], 0, 'plusq',
        'The baker did the selling, so hebben: had verkocht.'), 'de laatste vlaai al', FK(['verkocht', 'geverkocht', 'verkoopt'], 0, 'perf',
        'ver- verbs take no ge. verkopen is irregular: verkocht.'), 'toen wij kwamen.'] },
      { en: 'Before the mist he had always worked in Rotterdam.', parts: ['Voor de mist', FK(['had hij', 'was hij', 'hij had'], 0, 'plusq',
        'Working takes hebben, and Voor de mist takes slot 1, so the verb comes before hij: had hij.'), 'altijd in Rotterdam', FK(['gewerkt', 'gewerkd', 'gewerken'], 0, 'kof',
        'werk ends in k, a soft ketchup letter: gewerkt with a t.'), '.'] },
      { en: 'After we had eaten in Belgium, we cycled back.', parts: ['Nadat we in België gegeten', FK(['hadden', 'waren'], 0, 'plusq',
        'Eating takes hebben: gegeten hadden, with the verb at the end after nadat.'), ',', FK(['fietsten we', 'we fietsten'], 0, 'v2',
        'The main clause after a sub-clause starts with its verb: fietsten we.'), 'terug.'] },

      // ---- builds: indirect speech
      { en: 'My colleague asked whether the dashboards were ready yet.', parts: ['Mijn collega vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A yes-or-no question reported with vragen takes of. dat is for statements.'), 'de dashboards al', FK(['klaar waren', 'waren klaar'], 0, 'bijzin',
        'of sends the verb to the end: klaar waren.'), '.'] },
      { en: 'A tourist said he could not find the border anywhere.', parts: ['Een toerist zei', FK(['dat', 'of'], 0, 'indirect',
        'zeggen reports a statement with dat. of belongs to questions.'), 'hij de grens', FK(['nergens kon vinden', 'kon nergens vinden'], 0, 'bijzin',
        'dat sends the verbs to the end, the one that agrees with hij first: nergens kon vinden.'), '.'] },
      { en: 'The guide said that the marl used to be used for houses.', parts: ['De gids zei dat de mergel vroeger voor huizen', FK(['gebruikt', 'gebruikd', 'gegebruikt'], 0, 'kof',
        'gebruik ends in k, a ketchup letter: gebruikt with a t. gebruiken already starts with ge, so no second ge.'), FK(['werd', 'werden'], 0, 'passief',
        'The marl is one thing, so werd. In a dat-clause it stands at the very end.'), '.'] },
      { en: 'The neighbour said he had never missed carnaval.', parts: ['De buurman zei dat hij carnaval nog nooit gemist', FK(['had', 'was'], 0, 'plusq',
        'missen takes hebben, never zijn: gemist had. In a dat-clause the auxiliary stands at the end.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'I think the vlaai is tastier here than at home.', parts: ['Volgens mij', FK(['is de vlaai', 'de vlaai is'], 0, 'mening',
        'Volgens mij takes slot 1, so the verb comes second: is de vlaai.'), 'hier', FK(['lekkerder', 'meer lekker', 'lekkerer'], 0, 'vergelijk',
        'An adjective ending in r takes -der: lekkerder, then dan thuis.'), 'dan thuis.'] },
      { en: 'We came to Maastricht to eat vlaai.', parts: ['We kwamen naar Maastricht', FK(['om', 'omdat'], 0, 'omte',
        'A purpose with a verb is om ... te. omdat gives a reason and needs a subject and a verb.'), 'vlaai', FK(['te eten', 'eten'], 0, 'omte',
        'om needs te before the infinitive at the end: te eten.'), '.'] },
      { en: 'I think chips taste better than patat.', parts: ['Ik vind', FK(['dat', 'of'], 0, 'mening',
        'ik vind dat opens the opinion. of would turn it into a question.'), 'friet', FK(['beter smaakt', 'smaakt beter'], 0, 'bijzin',
        'dat sends the verb to the end: beter smaakt dan patat.'), 'dan patat.'] },
      { en: 'Yesterday we walked the dogs along the Maas.', parts: ['Gisteren', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second, then we.'), 'de honden langs de Maas', FK(['uitgelaten', 'geuitlaten', 'uitgelaat'], 0, 'sep',
        'The ge goes in the middle: uit + gelaten, one word at the end.'), '.'] },

      // ---- words: the square, the town, the food, the dialect
      { w: 'the basilica', nl: 'de basiliek' }, { w: 'the square', nl: 'het plein', wrong: 'de plein' }, { w: 'the terrace', nl: 'het terras' },
      { w: 'the bookshop', nl: 'de boekhandel' }, { w: 'the Limburg fruit tart', nl: 'de vlaai' }, { w: 'the chip stand', nl: 'de friettent' },
      { w: 'carnival', nl: 'het carnaval' }, { w: 'the mask', nl: 'het masker', wrong: 'de masker' }, { w: 'the treaty', nl: 'het verdrag', wrong: 'de verdrag' },
      { w: 'the cave', nl: 'de grot' }, { w: 'the marl (the soft yellow local stone)', nl: 'de mergel' }, { w: 'the hill', nl: 'de heuvel' },
      { w: 'the border', nl: 'de grens' }, { w: 'the dialect', nl: 'het dialect', wrong: 'de dialect' },
      { w: 'grandma (Maastricht dialect)', nl: 'de bomma' }, { w: 'the bill', nl: 'de rekening' },

      // ---- reads: four traps with their own options, two plain
      { read: true, nl: 'De basiliek is verbouwd.', o: ['The basilica has been renovated.', 'The basilica is being renovated.', 'The basilica will be renovated.'], a: 0, r: 'passief',
        w: 'is plus participle says the work is finished. Still going on would be wordt verbouwd.' },
      { read: true, nl: 'Toen wij aankwamen, was de optocht al begonnen.', o: ['When we arrived, the parade had already started.', 'When we arrived, the parade was about to start.', 'When we arrive, the parade will have started.'], a: 0, r: 'plusq',
        w: 'was begonnen goes one step further back than aankwamen: it had started before we got there.' },
      { read: true, nl: 'De Nachtwacht werd in de oorlog in de grotten verstopt.', o: ['The Night Watch was hidden in the caves during the war.', 'The Night Watch is being hidden in the caves right now.', 'The Night Watch hid in the caves during the war.'], a: 0, r: 'passief',
        w: 'werd plus verstopt is the past passive: somebody hid it. A painting does not hide itself.' },
      { read: true, nl: 'Het is hier vijf minuten naar België en een half uur naar Duitsland.', o: ['Belgium is five minutes away and Germany half an hour.', 'Belgium is half an hour away and Germany five minutes.', 'Belgium and Germany are both five minutes away.'], a: 0, r: 'woord',
        w: 'The first place named takes the first time named: five minutes to Belgium, half an hour to Germany.' },
      { read: true, nl: 'Noondezju, de vlaai is op.', en: 'Damn it (a mild Maastricht dialect curse), the tart is all gone.' },
      { read: true, nl: 'Paola vroeg of ik de rekening al had betaald.', en: 'Paola asked whether I had already paid the bill.' },

      // ---- listens: a parade, a roll, a participle and a tart, by ear
      { listen: true, nl: 'de optocht', en: 'the parade' }, { listen: true, nl: 'het worstenbroodje', en: 'the sausage roll' },
      { listen: true, nl: 'verbouwd', en: 'renovated' }, { listen: true, nl: 'de kersenvlaai', en: 'the cherry tart' },

      // ---- looks: the dog, the bike and the lamp on the cobbles
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'bisschop', art: 'de', en: 'the bishop', w: 'Words for people are usually de: de bisschop, de buurman.' },
      { dehet: true, nl: 'orkest', art: 'het', en: 'the orchestra', w: 'het orkest. The plural is de orkesten, because every plural is de.' },
    ] }]);
})();
