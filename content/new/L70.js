// Nachtrit, Den Haag (tier 6, A2+): level 70, Het station. Den Haag Centraal, the ticket gates, tram 1 to
// Scheveningen, the last train home via Rotterdam. Getting around, tickets, delays, and what you did today.
// Fence: tier 5 plus the perfectum with hebben and zijn, regular participles with 't kofschip, common irregular
// participles, separable participles. 10 words max, no imperfectum, no sub-clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar (perfectum, zijn of hebben, 't kofschip, scheidbare werkwoorden:
// aankomen, vertrekken, inchecken, opbellen), _site/words (de trein, de bus, het openbaar vervoer, het verkeer,
// het centraal station, aankomen, missen, fietsen, de fietser), _site/situations/directions (de uitgang, oversteken),
// _site/maps MOC Tijd, dagen & maanden, and content/towns.js for Den Haag (het Binnenhof, de Pier, het reuzenrad,
// het strand, the politicians, Dat is geen antwoord op mijn vraag).
//
// New rules: none. aux, perf, kof, sep and mag come from data.js. New props: none (fiets, water, deur).
(() => {
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 70, act: 6, name: 'Het station', town: 'denhaag', place: 'station', theme: 'street', ...P,
    intro: 'Since the mist, nobody at Den Haag Centraal asks when the train leaves. The dead only ask when it left, and why nobody said anything.',
    introNl: 'Sinds de mist vraagt niemand op Den Haag Centraal nog wanneer de trein vertrekt. De doden willen alleen nog weten wanneer hij vertrokken is, en waarom niemand iets heeft gezegd.',
    mission: { where: 'Den Haag Centraal, the tram out to the Pier at Scheveningen, and back for the last train to Rotterdam.',
      carry: 'An ov-chipkaart with four euros on it, no helmet, and two dogs who, as always, need a walk.',
      want: 'The dead at the gates ask what you did today, and they want the past: the right helper, the right ending. The grammar book is still in your bag, unopened. The conductor is taller than you, and she and her colleague split the coffee to the cent. Ask a politician on the tram what he has done and you get no answer to your question.' },
    items: [
      // ---- builds: the perfectum, zijn or hebben, 't kofschip, irregular and separable participles
      { en: 'I missed the train.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux', 'missen is not movement to a place, so hebben: ik heb.'), 'de trein',
        FK(['gemist', 'gemisd'], 0, 'kof', 'mis ends in s, a ketchup letter, so the participle ends in t: gemist.', 'spell'), '.'] },
      { en: 'Has the train to Rotterdam already left?', parts: [FK(['Is', 'Heeft'], 0, 'aux', 'vertrekken is movement, so it runs on zijn: is de trein vertrokken.'), 'de trein naar Rotterdam al',
        FK(['vertrokken', 'vertrok', 'vertrekt'], 0, 'perf', 'vertrekken is irregular and takes no ge: vertrokken.'), '?'] },
      { en: 'At half past nine we arrived at Den Haag Centraal.', parts: ['Om half tien', FK(['zijn', 'hebben'], 0, 'aux', 'aankomen is arriving somewhere, so zijn.'), 'we op Den Haag Centraal',
        FK(['aangekomen', 'aankwamen', 'aankomen'], 0, 'sep', 'A separable verb puts ge between aan and the verb: aangekomen.'), '.'] },
      { en: 'Paola checked in at the gate.', parts: ['Paola heeft bij het poortje', FK(['ingecheckt', 'ingecheckd'], 0, 'sep', 'check ends in k, a ketchup letter, so the participle ends in t: ingecheckt.', 'spell'), '.'] },
      { en: 'The dogs have never been on the tram.', parts: ['De honden', FK(['zijn', 'hebben'], 0, 'aux', 'zijn itself takes zijn in the perfectum: ze zijn geweest.'), 'nog nooit in de tram',
        FK(['geweest', 'waren', 'zijn'], 0, 'perf', 'zijn is irregular: the participle is geweest.'), '.'] },
      { en: 'I took tram 1 to Scheveningen.', parts: ['Ik', FK(['ben', 'heb'], 0, 'aux', 'gaan is movement to a place, so zijn: ik ben gegaan.'), 'met tram 1 naar Scheveningen',
        FK(['gegaan', 'gaan'], 0, 'perf', 'gaan is irregular: the participle is gegaan, and it sits at the very end.'), '.'] },
      { en: 'Have you seen the conductor?', parts: [FK(['Heb', 'Ben'], 0, 'aux', 'zien is not movement, so hebben: heb je gezien.'), 'je de conducteur',
        FK(['gezien', 'zag', 'ziet'], 0, 'perf', 'zien is irregular: the participle is gezien.'), '?'] },
      { en: 'The train was twenty minutes late.', parts: ['De trein heeft twintig minuten vertraging', FK(['gehad', 'had', 'heeft'], 0, 'perf', 'hebben is irregular: the participle is gehad.'), '.'] },
      { en: 'I waited an hour on track five.', parts: ['Op spoor vijf', FK(['heb ik', 'ik heb'], 0, 'v2', 'Op spoor vijf takes slot 1, so the verb comes next, then ik.'), 'een uur', FK(['gewacht', 'gewachtd'], 0, 'kof', 'The stem wacht already ends in t, so nothing is added: gewacht.', 'spell'), '.'] },
      { en: 'Paola just called me.', parts: ['Paola heeft me net', FK(['opgebeld', 'opbelde', 'opbelt'], 0, 'sep', 'A separable verb puts ge between op and the verb: opgebeld.'), '.'] },
      { en: 'I bought a return ticket to Rotterdam.', parts: ['Ik heb een retourtje Rotterdam', FK(['gekocht', 'kocht', 'koop'], 0, 'perf', 'kopen is irregular: the participle is gekocht.'), '.'] },
      { en: 'What did you do in Den Haag?', parts: ['Wat', FK(['heb', 'ben'], 0, 'aux', 'doen is not movement, so hebben.'), 'je in Den Haag',
        FK(['gedaan', 'deed', 'doet'], 0, 'perf', 'doen is irregular: the participle is gedaan.'), '?'] },
      { en: 'We ate fish on the Pier.', parts: ['Op de Pier', FK(['hebben we', 'we hebben'], 0, 'v2', 'Op de Pier takes slot 1, so the verb comes next, then we.'), 'vis', FK(['gegeten', 'aten', 'eten'], 0, 'perf', 'eten is irregular: the participle is gegeten.'), '.'] },
      { en: 'The politicians got off at the Binnenhof.', parts: ['De politici', FK(['zijn', 'hebben'], 0, 'aux', 'uitstappen is moving out of the tram, so zijn.'), 'bij het Binnenhof',
        FK(['uitgestapt', 'uitstapten', 'uitstappen'], 0, 'sep', 'A separable verb puts ge between uit and the verb: uitgestapt.'), '.'] },
      { en: 'I changed trains in Rotterdam.', parts: ['Ik ben in Rotterdam', FK(['overgestapt', 'overstapte', 'overstap'], 0, 'sep', 'A separable verb puts ge between over and the verb: overgestapt.'), '.'] },
      { en: 'We travelled by train all day.', parts: ['De hele dag', FK(['hebben we', 'we hebben'], 0, 'v2', 'De hele dag takes slot 1, so the verb comes next, then we.'), 'met de trein', FK(['gereisd', 'gereist'], 0, 'kof', 'reizen has a z underneath, not a ketchup letter, so the participle ends in d.', 'spell'), '.'] },

      // ---- words
      { w: 'the station', nl: 'het station', wrong: 'de station' }, { w: 'the train', nl: 'de trein' },
      { w: 'the tram', nl: 'de tram' }, { w: 'the tram stop', nl: 'de tramhalte' },
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the exit', nl: 'de uitgang' },
      { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' }, { w: 'the OV chip card', nl: 'de ov-chipkaart' },
      { w: 'the ticket gate', nl: 'het poortje', wrong: 'de poortje' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the conductor', nl: 'de conducteur' }, { w: 'the bike parking', nl: 'de fietsenstalling' },
      { w: 'the ticket counter', nl: 'het loket', wrong: 'de loket' }, { w: 'the traffic jam', nl: 'de file' },
      { w: 'the crossroads', nl: 'het kruispunt', wrong: 'de kruispunt' }, { w: 'the helmet', nl: 'de helm' },
      { w: 'the beach', nl: 'het strand' }, { w: 'the Ferris wheel', nl: 'het reuzenrad' },
      { w: 'the bike path', nl: 'het fietspad' }, { w: 'to change trains', nl: 'overstappen' },

      // ---- read
      { read: true, nl: 'De trein is al vertrokken.', o: ['The train has already left.', 'The train is leaving now.', 'The train leaves later.'], a: 0, r: 'perf',
        w: 'is plus a participle is the past: vertrokken means it has gone.' },
      { read: true, nl: 'Ik ben mijn kaartje vergeten.', o: ['I forgot my ticket.', 'I bought my ticket.', 'I am looking for my ticket.'], a: 0, r: 'perf',
        w: 'vergeten is to forget. Here ben only helps form the perfectum, it does not mean I am.' },
      { read: true, nl: 'We zijn naar het strand gefietst.', o: ['We cycled to the beach.', 'We are cycling to the beach.', 'We are going to cycle to the beach.'], a: 0, r: 'aux',
        w: 'zijn plus a participle is the past. Cycling to a place takes zijn.' },
      { read: true, nl: 'Heb je al uitgecheckt?', o: ['Have you checked out yet?', 'Are you checking in now?', 'Are you going to check out?'], a: 0, r: 'sep',
        w: 'uit-ge-checkt is the participle of uitchecken, so it already happened.' },
      { read: true, nl: 'Je mag hier niet fietsen.', o: ["You're not allowed to cycle here.", "You don't have to cycle here."], a: 0, r: 'mag',
        w: 'mag niet is not allowed. Not having to would be hoeft niet.' },
      { read: true, nl: 'Hoe laat vertrekt de laatste trein naar Rotterdam?', o: ['What time does the last train to Rotterdam leave?', 'What time does the last train from Rotterdam arrive?', 'Where does the last train to Rotterdam leave from?'], a: 0, r: 'woord',
        w: 'Hoe laat is what time, vertrekt is leaves, and naar Rotterdam is where it is headed.' },

      // ---- listen
      { listen: true, nl: 'spoor elf', en: 'track 11' }, { listen: true, nl: 'kwart over negen', en: '9:15' },
      { listen: true, nl: 'tien over half acht', en: '7:40' },

      // ---- look
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de or het
      { dehet: true, nl: 'kaartjesautomaat', art: 'de', en: 'the ticket machine', w: 'automaat is a de-word, and a compound takes the article of its last part.' },
      { dehet: true, nl: 'openbaar vervoer', art: 'het', en: 'public transport', w: 'vervoer is a het-word, and openbaar only describes it: het openbaar vervoer.' },
    ] }]);
})();
