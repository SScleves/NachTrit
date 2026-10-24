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
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 111, act: 11, name: 'Het werk', town: 'maastricht', place: 'werk', theme: 'street', ...P,
    intro: 'In Maastricht twelve countries signed one treaty in 1992. Your standup still cannot decide who goes first.',
    introNl: 'In Maastricht werd in 1992 door twaalf landen één verdrag getekend. Jouw standup komt er nog steeds niet uit wie er begint.',
    mission: {
      where: 'A home office above a narrow street of marl-yellow houses, the Helpoort at the end of the road. Later a desk in an office on the Maas, a few minutes from the Gouvernement where the treaty was signed, and lunch on the Vrijthof between the basilica and the red tower. The dogs always need a walk, so the leads hang on the monitor.',
      carry: 'A laptop at eleven percent, two leads, a slice of cherry vlaai split to the cent with the intern, and the grammar book, still never opened. No helmet. The cobbles do not care.',
      want: 'The mist came and everyone who spoke Dutch changed. In Maastricht the dead wear their carnaval costume all year, so you cannot tell a colleague from a corpse, and they all want the same thing: what is being done, what had been done before you logged in, and what somebody said somebody had done. Worden, had gewerkt, hij zei dat. The women are still taller than you, and they still split the bill.' },
    items: [
      // ---- builds: the passive (new at tier 11)
      { en: 'The outage is being solved right now.', parts: ['De storing', FK(['wordt', 'worden', 'word'], 0, 'passief',
        'The passive is worden plus a participle at the end. One outage, so wordt, with the t that goes with de storing.'), 'nu', FK(['opgelost', 'geopgelost', 'oplost'], 0, 'sep',
        'The ge goes in the middle: op + gelost, written as one word. los ends in s, so a t.'), '.'] },
      { en: 'The release was postponed yesterday.', parts: ['De release', FK(['werd', 'werden', 'wordt'], 0, 'passief',
        'werd is the past of worden. gisteren puts it in the past, so not wordt, and one release, so not werden.'), 'gisteren', FK(['uitgesteld', 'uitgestelt', 'geuitgesteld'], 0, 'kof',
        'uit + gesteld. stel ends in l, which is not a ketchup letter, so a d. The ge is already in the middle.'), '.'] },
      { en: 'The treaty was signed here in 1992.', parts: ['Het verdrag', FK(['werd', 'werden', 'wordt'], 0, 'passief',
        'A passive in the past: werd plus the participle at the end. One treaty, so werd, not werden.'), 'hier in 1992', FK(['getekend', 'getekent', 'getekenen'], 0, 'kof',
        'teken ends in n, which is not a ketchup letter, so a d: getekend.'), '.'] },
      { en: 'The bug has already been fixed.', parts: ['De bug', FK(['is', 'heeft'], 0, 'passief',
        'A finished passive takes zijn plus the participle: de bug is gefixt. A bug does not fix anything itself, it gets fixed by someone, so heeft is out.'), 'al', FK(['gefixt', 'gefixd', 'gefixen'], 0, 'kof',
        'fix ends in x, a ketchup letter, so a t: gefixt.'), '.'] },
      { en: 'The complaints are answered by the intern.', parts: ['De klachten', FK(['worden', 'wordt'], 0, 'passief',
        'Two or more complaints, so worden. wordt is for one thing.'), 'door de stagiair', FK(['beantwoord', 'gebeantwoord', 'beantwoordt'], 0, 'perf',
        'be- verbs take no ge: beantwoord. The stem antwoord already ends in d, so nothing is added, and beantwoordt is the present tense hij beantwoordt, not a participle.'), '.'] },
      { en: 'The server has to be restarted today.', parts: ['De server moet vandaag herstart', FK(['worden', 'wordt', 'geworden'], 0, 'passief',
        'After moet the last verb is an infinitive: herstart worden. wordt is a finite verb and geworden is a participle.'), '.'] },

      // ---- builds: the plusquamperfectum (new at tier 11)
      { en: 'When I logged in, the standup was already over.', parts: ['Toen ik inlogde,', FK(['was', 'had'], 0, 'plusq',
        'aflopen is a change of state, something that ends, so zijn: was afgelopen, the past of is afgelopen.'), 'de standup al', FK(['afgelopen', 'geafgelopen', 'afgelopt'], 0, 'sep',
        'The ge goes in the middle: af + gelopen, written as one word. lopen is irregular, so gelopen and not a kofschip t.'), '.'] },
      { en: 'We had worked until midnight, so I was tired.', parts: ['We', FK(['hadden', 'waren'], 0, 'plusq',
        'werken takes hebben, and the plusquamperfectum is the imperfectum of hebben plus the participle: hadden gewerkt.'), 'tot middernacht', FK(['gewerkt', 'gewerkd', 'gewerken'], 0, 'kof',
        'werk ends in k, a ketchup letter: gewerkt with a t.'), ', dus ik was moe.'] },
      { en: 'We had seen the problem before the customer called.', parts: ['Wij', FK(['hadden', 'waren'], 0, 'plusq',
        'zien takes hebben, so hadden gezien. waren belongs to verbs of going and change, not to zien.'), 'het probleem al', FK(['gezien', 'geziet', 'gezeen'], 0, 'perf',
        'zien is irregular: gezien, nothing added.'), 'voordat de klant belde.'] },
      { en: 'He had fallen asleep during the meeting.', parts: ['Hij', FK(['was', 'had'], 0, 'plusq',
        'in slaap vallen is a change of state, so zijn: was in slaap gevallen. Ingeslapen would mean he died.'), 'tijdens de vergadering in slaap', FK(['gevallen', 'gevalt', 'geviel'], 0, 'perf',
        'vallen is irregular: viel, gevallen. Nothing from the kofschip here.'), '.'] },

      // ---- builds: indirect speech (new at tier 11)
      { en: 'Mark said that he was ill.', parts: ['Mark zei', FK(['dat hij ziek was', 'dat hij was ziek', 'dat was hij ziek'], 0, 'indirect',
        'zei dat opens a sub-clause, so the verb goes to the end. What was said also moves one tense back: is ziek becomes was ziek.'), '.'] },
      { en: 'She asked whether I could help her for a moment.', parts: ['Ze vroeg', FK(['of', 'om'], 0, 'indirect',
        'A yes-or-no question that is reported takes of. om belongs to vragen om iets, as in ze vroeg om hulp.'), 'ik haar even kon helpen.'] },
      { en: 'He asked what had happened last night.', parts: ['Hij vroeg', FK(['wat er vannacht was gebeurd', 'wat er was vannacht gebeurd', 'wat er vannacht had gebeurd'], 0, 'indirect',
        'A reported question is a sub-clause: the question word opens it and the verbs go to the end, side by side: was gebeurd, with vannacht in front of them. gebeuren takes zijn, so not had.'), '.'] },
      { en: 'Paola said that I had to walk the dogs.', parts: ['Paola zei', FK(['dat ik de honden moest uitlaten', 'dat moest ik de honden uitlaten', 'dat ik moest de honden uitlaten'], 0, 'indirect',
        'After zei dat every verb goes to the end: moest uitlaten. moet became moest, one tense back.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'Could you share your screen for a second?', parts: ['Zou je je scherm even', FK(['kunnen', 'kan'], 0, 'zou',
        'zou asks politely and goes with an infinitive at the end: zou je kunnen delen.'), 'delen?'] },
      { en: 'While I was presenting, the sound cut out.', parts: ['Terwijl ik presenteerde,', FK(['viel het geluid', 'het geluid viel'], 0, 'v2',
        'The sub-clause came first, so the main clause starts with its verb: viel het geluid, with uit at the end.'), 'uit.'] },
      { en: 'This is the fastest solution of the whole team.', parts: ['Dit is', FK(['de snelste', 'de snelst', 'de sneller'], 0, 'vergelijk',
        'Before a noun the superlative takes -ste: de snelste oplossing. snelst has no e and sneller is the comparative.'), 'oplossing van het hele team.'] },

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
        w: 'werd is the past of worden, so it was done. Happening right now would be wordt verplaatst, and a later move would need a future form.' },
      { read: true, nl: 'Toen ik belde, had Mark het probleem al opgelost.', o: ['When I called, Mark had already solved the problem.', 'When I called, Mark solved the problem.', 'Mark will solve the problem when I call.'], a: 0, r: 'plusq',
        w: 'had plus opgelost is the plusquamperfectum: it was already done before I called. Plain solved would be loste op.' },
      { read: true, nl: 'Ze zei dat ze later zou bellen.', o: ['She said she would call later.', 'She said she called later.', 'She asked me to call later.'], a: 0, r: 'indirect',
        w: 'zei dat reports what was said, and zou bellen is would call, the future seen from the past. Asking someone to call would be vroeg of ik later wilde bellen.' },
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
