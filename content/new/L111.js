// Nachtrit, Maastricht (tier 11, B1 to B2): level 111 Het werk. A home office above a narrow street of marl-yellow houses
// with the Helpoort at the end of the road, then a desk in an office on the Maas a few minutes from the Gouvernement where
// the treaty was signed, and lunch on the Vrijthof. The standup, meetings, incidents, colleagues, the laptop, the vlaai on a
// birthday.
// New at tier 11 and drilled here: the passive with worden (wordt opgelost, werd uitgesteld, worden beantwoord, moet
// herstart worden), the finished passive with zijn (is gefixt), the plusquamperfectum with hadden and was (had gewerkt,
// was afgelopen, was in slaap gevallen), indirect speech (Mark zei dat hij ziek was, ze vroeg of ..., hij vroeg wat er mis was
// gegaan) and words with dialect colour, always marked as dialect (de bomma, Noondezju, salu).
// Review of earlier tiers: zou plus infinitive for a polite request, terwijl with the main clause starting on its verb,
// the superlative de snelste, kof participles (gewerkt, getekend, uitgesteld, gefixt) and separable participles (opgelost).
// Still inside the fence: 16 words max, no idioms with modal particles, no formal register.
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, zijn of hebben, 't kofschip, scheidbare werkwoorden, V2 word order,
// bijzin - werkwoord naar het einde; _site/grammar/trappen-van-vergelijking-comparison; _site/situations/office (Heb je even,
// Druk vandaag, Ik zit zo in een meeting); _site/sentences (komt u het afhalen of moet het bezorgd worden);
// 04 - Phrases & Scenarios/De standup - tech talk (Er is vannacht een storing geweest, Na de fix was alles weer groen),
// Koffiepraatje op kantoor (Het apparaat doet het weer niet, de vrijmibo); content/towns.js for Maastricht (het verdrag,
// de vlaai, de bomma, Noondezju, het Gouvernement, de Helpoort, the carnaval joke, the patat and friet rumour).
// New rules: passief, plusq, indirect (guarded below; perf, kof, sep, v2, vergelijk, zou are reused).
// New props: none. Used: hond, kerk, brug (not water or deur: neither the Maas nor a door is in the word pool as an answer).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'Passive: worden or zijn plus participle', note: 'zijn of hebben' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had gewerkt, was gegaan', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 111, act: 11, name: 'Het werk', town: 'maastricht', place: 'werk', theme: 'street', ...P,
    intro: 'In Maastricht twelve countries signed one treaty in 1992. Your standup still cannot decide who goes first.',
    introNl: 'In Maastricht werd in 1992 door twaalf landen één verdrag getekend. Jouw standup komt er nog steeds niet uit wie er begint.',
    mission: {
      where: 'A home office above a narrow street of marl-yellow houses, the Helpoort at the end of the road. Later a desk in an office on the Maas, a few minutes from the Gouvernement where the treaty was signed, and lunch on the Vrijthof between the basilica and the red tower. The dogs always need a walk, so the leads hang on the monitor.',
      carry: 'A laptop at eleven percent, two leads, a slice of cherry vlaai split to the cent with the intern, and the grammar book, still never opened. No helmet. The cobbles do not care.',
      want: 'The mist came and everyone who spoke Dutch changed. In Maastricht the dead wear their carnaval costume all year, so you cannot tell a colleague from a corpse, and they all want the same thing: what is being done, what had been done before you logged in, and what somebody said somebody had done. Worden, had gewerkt, hij zei dat. The women are still taller than you, and they still split the bill.' },
    items: [
      // ---- builds: the passive (new at tier 11)
      { en: 'The outage is being solved right now.', parts: ['De storing', FK(['wordt', 'worden', 'word'], 0, 'passief', 'The passive is worden plus participle, and one storing takes wordt.'), 'nu', FK(['opgelost', 'oplossen', 'oplost'], 0, 'sep', 'After wordt comes the participle, with ge in the middle: op-ge-lost.'), '.'] },
      { en: 'The release was postponed yesterday.', parts: ['De release', FK(['werd', 'werden', 'wordt'], 0, 'passief', 'gisteren is past, so werd, and one release takes werd, not werden.'), 'gisteren', FK(['uitgesteld', 'uitgestelt'], 0, 'kof', 'stel ends in l, not a ketchup letter, so the participle ends in d: uitgesteld.', 'spell'), '.'] },
      { en: 'In 1992 the treaty was signed here.', parts: ['In 1992', FK(['werd het verdrag', 'het verdrag werd'], 0, 'v2',
        'In 1992 fills slot 1, so the verb comes second: werd het verdrag.'), 'hier', FK(['getekend', 'getekent'], 0, 'kof',
        'teken ends in n, not a ketchup letter, so the participle ends in d: getekend.', 'spell'), '.'] },
      { en: 'The bug has already been fixed.', parts: ['De bug', FK(['is', 'heeft'], 0, 'passief', 'A finished passive takes zijn plus participle: de bug is gefixt.'), 'al', FK(['gefixt', 'gefixd'], 0, 'kof', 'fix ends in x, which sounds like ks, a ketchup letter: gefixt with a t.', 'spell'), '.'] },
      { en: 'The complaints are answered by the intern.', parts: ['De klachten', FK(['worden', 'wordt'], 0, 'passief',
        'Two or more complaints, so worden. wordt is for one thing.'), 'door de stagiair', FK(['beantwoord', 'beantwoorden', 'beantwoordde'], 0, 'perf', 'After worden comes the participle, and be- verbs take no ge: beantwoord.'), '.'] },
      { en: 'The server has to be restarted today.', parts: ['De server moet vandaag herstart', FK(['worden', 'wordt', 'geworden'], 0, 'passief', 'After moet the last verb is an infinitive: herstart worden.'), '.'] },

      // ---- builds: the plusquamperfectum (new at tier 11)
      { en: 'When I logged in, the standup was already over.', parts: ['Toen ik inlogde,', FK(['was de standup', 'de standup was'], 0, 'v2',
        'The toen-clause fills slot 1, so the main clause starts with its verb: was de standup.'), 'al', FK(['afgelopen', 'aflopen', 'afliep'], 0, 'sep',
        'was plus participle makes the pluperfect, with ge in the middle: af-ge-lopen.'), '.'] },
      { en: 'We had worked until midnight, so I was tired.', parts: ['We', FK(['hadden', 'waren'], 0, 'plusq',
        'werken takes hebben, and the plusquamperfectum is the imperfectum of hebben plus the participle: hadden gewerkt.'), 'tot middernacht', FK(['gewerkt', 'gewerkd'], 0, 'kof', 'werk ends in k, a ketchup letter: gewerkt with a t.', 'spell'), ', dus ik was moe.'] },
      { en: 'We had seen the problem before the customer called.', parts: ['Wij', FK(['hadden', 'waren'], 0, 'plusq',
        'zien takes hebben, so hadden gezien. waren belongs to verbs of going and change, not to zien.'), 'het probleem al', FK(['gezien', 'zien', 'zagen'], 0, 'perf', 'had plus participle makes the pluperfect, and zien is irregular: gezien.'), 'voordat de klant belde.'] },
      { en: 'He had fallen asleep during the meeting.', parts: ['Hij', FK(['was', 'had'], 0, 'plusq', 'in slaap vallen is a change of state, so zijn: was in slaap gevallen.'), 'tijdens de vergadering in slaap', FK(['gevallen', 'vallen', 'viel'], 0, 'perf', 'was plus participle makes the pluperfect, and vallen is irregular: gevallen.'), '.'] },

      // ---- builds: indirect speech (new at tier 11)
      { en: 'Mark said that he was ill.', parts: ['Mark zei dat hij', FK(['ziek was', 'was ziek'], 0, 'indirect',
        'zei dat opens a sub-clause, so the verb goes to the end: ziek was.'), '.'] },
      { en: 'She asked whether I could help her for a moment.', parts: ['Ze vroeg', FK(['of', 'om'], 0, 'indirect', 'A reported yes-or-no question takes of; om belongs to vragen om iets.', 'word'), 'ik haar even kon helpen.'] },
      { en: 'He asked what had happened last night.', parts: ['Hij vroeg wat er vannacht', FK(['was gebeurd', 'had gebeurd'], 0, 'plusq',
        'gebeuren takes zijn, so the pluperfect is was gebeurd.'), '.'] },
      { en: 'Paola said that I had to walk the dogs.', parts: ['Paola zei dat ik de honden moest', FK(['uitlaten', 'uitgelaten', 'uit te laten'], 0, 'modal',
        'After moest the second verb is a bare infinitive at the end: uitlaten.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'Could you share your screen for a second?', parts: ['Zou je je scherm even', FK(['kunnen', 'kan'], 0, 'zou',
        'zou asks politely and goes with an infinitive at the end: zou je kunnen delen.'), 'delen?'] },
      { en: 'While I was presenting, the sound cut out.', parts: ['Terwijl ik presenteerde,', FK(['viel het geluid', 'het geluid viel'], 0, 'v2', 'The terwijl-clause fills slot 1, so the main clause starts with its verb: viel het geluid.'), 'uit.'] },
      { en: 'This is the fastest solution of the whole team.', parts: ['Dit is', FK(['de snelste', 'de snelst', 'de sneller'], 0, 'vergelijk', 'Before a noun the superlative takes -e: de snelste oplossing.'), 'oplossing van het hele team.'] },

      // ---- words: the desk, the sprint, the review, the treaty, the tart
      { w: 'the release', nl: 'de release' }, { w: 'the bug', nl: 'de bug' }, { w: 'the ticket', nl: 'het ticket', wrong: 'de ticket' },
      { w: 'the sprint', nl: 'de sprint' }, { w: 'the backup', nl: 'de back-up' }, { w: 'the office chair', nl: 'de bureaustoel' },
      { w: 'the home office', nl: 'het thuiskantoor', wrong: 'de thuiskantoor' }, { w: 'the video call', nl: 'het videogesprek' },
      { w: 'the projector', nl: 'de beamer' }, { w: 'the annual review', nl: 'het jaargesprek', wrong: 'de jaargesprek' },
      { w: 'the payslip', nl: 'de loonstrook' }, { w: 'the signature', nl: 'de handtekening' },
      { w: 'the treaty', nl: 'het verdrag', wrong: 'de verdrag' }, { w: 'the Limburg fruit tart', nl: 'de vlaai' },
      { w: 'grandma (Maastricht dialect, in Dutch oma)', nl: 'de bomma' }, { w: 'the Friday drinks', nl: 'de vrijmibo' },
      { w: 'the on-call shift', nl: 'de piketdienst' }, { w: 'the coffee machine', nl: 'het koffieapparaat', wrong: 'de koffieapparaat' },
      { w: 'the workload', nl: 'de werkdruk' }, { w: 'the alert', nl: 'de melding' },

      // ---- reads: four traps with their own options, two lines from the office and the city
      { read: true, nl: 'De vergadering werd naar vrijdag verplaatst.', o: ['The meeting was moved to Friday.', 'The meeting is being moved to Friday.', 'The meeting will be moved to Friday.'], a: 0, r: 'passief',
        w: 'werd is the past of worden, so it was done. Right now would be wordt verplaatst.' },
      { read: true, nl: 'Toen ik belde, had Mark het probleem al opgelost.', o: ['When I called, Mark had already solved the problem.', 'When I called, Mark solved the problem.', 'Mark will solve the problem when I call.'], a: 0, r: 'plusq',
        w: 'had plus opgelost is the plusquamperfectum: done before I called. Plain solved would be loste op.' },
      { read: true, nl: 'Ze zei dat ze later zou bellen.', o: ['She said she would call later.', 'She said she called later.', 'She asked me to call later.'], a: 0, r: 'indirect',
        w: 'zei dat reports what was said, and zou bellen is would call, the future seen from the past.' },
      { read: true, nl: 'Hij vroeg of ik de melding had gezien.', o: ['He asked whether I had seen the alert.', 'He said that I had seen the alert.', 'He asked me to look at the alert.'], a: 0, r: 'indirect',
        w: 'vroeg of reports a yes-or-no question. Reporting a statement would be zei dat.' },
      { read: true, nl: 'Noondezju, mijn laptop is alweer leeg.', en: 'Damn it, my laptop is empty again. (Noondezju is Maastricht dialect.)' },
      { read: true, nl: 'Er staat vlaai in de keuken, want Sanne is jarig.', en: 'There is tart in the kitchen, because it is Sanne\'s birthday.' },

      // ---- listens: a participle by ear, two landmarks, one word of dialect
      { listen: true, nl: 'afgehandeld', en: 'dealt with' }, { listen: true, nl: 'het Gouvernement', en: 'the Gouvernement' },
      { listen: true, nl: 'de Helpoort', en: 'the Hell Gate' }, { listen: true, nl: 'salu', en: 'hi, or bye (Maastricht dialect, from French salut)' },

      // ---- looks: the dog on the lead, the basilica church on the Vrijthof, the old bridge over the Maas
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'dashboard', art: 'het', en: 'the dashboard', w: 'het dashboard. The plural is de dashboards, because every plural is de.' },
      { dehet: true, nl: 'werkgever', art: 'de', en: 'the employer', w: 'de werkgever. Words for a person who does something end in -er and are de: de werkgever, de bakker.' },
    ] }]);
})();
