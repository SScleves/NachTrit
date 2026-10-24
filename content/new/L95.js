// Nachtrit, Texel (tier 9, B1): level 95 Het werk. A coworking space in a converted schapenboet in Den Burg, a home
// office with a sheep at the window, the standup that waits for the ferry, meetings, incidents, colleagues, the laptop,
// and the wifi that comes, or does not come, from the lighthouse at De Cocksdorp.
// New at tier 9 and drilled here: relative clauses with die and dat (de collega die ..., het scherm dat ...; the verb
// goes to the end of the clause), te plus infinitive and om ... te (also behind a separable verb: aan te zetten,
// op te lossen; hoeven takes te, moeten does not), conditionals with als ... dan and zou (the imperfectum for an
// imagined situation), er for quantity (ik heb er zeven) and the pronominal adverbs (ermee, erop, eraan).
// Review of earlier tiers: sub-clauses with omdat and the main clause that follows, the imperfectum (moest),
// zou plus infinitive for a polite request, the comparative beter, moet niet against hoeft niet, V2 after a time word.
// Still inside the fence: 14 words max, no opinions with hoewel or ondanks, no passive, no plusquamperfectum.
// Sources: dutch-lessons vault, 02 - Grammar/die vs dat, bijzin - werkwoord naar het einde, modale werkwoorden,
// zachtmakers - wel even maar, V2 word order, imperfectum; _site/grammar/er-het-kleine-woord-met-veel-banen;
// 04 - Phrases & Scenarios/De standup - tech talk (Kun je je scherm delen, Ik pak het op, Dynatrace laat zien waar het
// probleem zit), Uitleggen wat je doet - Dynatrace (een tool die Dynatrace heet), Koffiepraatje op kantoor (Het apparaat
// doet het weer niet, de vrijmibo), Borrel met vrienden; _site/situations/office; _site/sentences (sterkte-ermee,
// kun-je-me-daarmee-helpen-na-de-standup, ik-verheug-me-erop); content/towns.js for Texel (de veerboot, de overtocht,
// het schaap, het lam, de schapenboet, de zeehond, de vuurtoren, Ecomare, Een Skuumkoppe graag, Hoe laat vertrekt de
// laatste boot terug, the missed-ferry joke).
// New rules: omte, conditie, erop (guarded below; zou, er, presens and vergelijk are guarded too).
// New props: none. Used: fiets, deur, water.
(() => {
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'modale werkwoorden' };
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive: om te', note: 'modale werkwoorden' };
  window.RULES.conditie = window.RULES.conditie || { name: 'Conditionals: als ... dan, zou', note: 'modale werkwoorden' };
  window.RULES.erop = window.RULES.erop || { name: 'Pronominal adverbs: erop, ermee, eraan', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  const P = window.TIER_PRESET[9];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 95, act: 9, name: 'Het werk', town: 'texel', place: 'werk', theme: 'dyke', ...P,
    intro: 'On Texel every meeting is about the ferry, and the ferry is about the wind. The sheep chair the retrospective, and they have no action points.',
    introNl: 'Op Texel gaat elke vergadering over de boot, en de boot gaat over de wind. De schapen zitten de retrospective voor, en ze hebben geen actiepunten.',
    mission: {
      where: 'A coworking space in a converted sheep barn in Den Burg: steep thatched roof, low back turned to the southwest wind, a window on the polder and one sheep that reads your screen over your shoulder. The wifi comes from the lighthouse at De Cocksdorp, or so the sign says. The dunes at De Koog are twenty minutes away by bike, because the dogs always need a walk.',
      carry: 'A laptop at four percent, two leads, a Skuumkoppe receipt split to the cent between seven colleagues, and the grammar book, still never opened. No helmet. The wind on the island does not ask permission.',
      want: 'The mist came and everyone who spoke Dutch changed. On Texel the dead hold the standup in relative clauses and conditionals: the colleague who sits next to you, the laptop that is broken, if the wifi were better then we would. The verb waits at the end like a car on the ferry, and te sits in front of it. Miss the last boat and you live here now. The women are still taller than you, and the sheep take notes.' },
    items: [
      // ---- builds: relative clauses with die and dat (new at tier 9)
      { en: 'The colleague who sits next to me is working on the pipeline.', parts: ['De collega', FK(['die', 'dat'], 0, 'diedat',
        'collega is a de-word, so die. dat belongs to het-words.'), 'naast me zit, werkt aan de pipeline.'] },
      { en: 'The screen that stands on my desk is broken.', parts: ['Het scherm', FK(['dat', 'die'], 0, 'diedat',
        'scherm is a het-word, so dat. die belongs to de-words.'), 'op mijn bureau staat, is kapot.'] },
      { en: 'I work with a tool called Dynatrace.', parts: ['Ik werk met een tool', FK(['die', 'dat'], 0, 'diedat',
        'tool is a de-word, so die: een tool die Dynatrace heet.'), 'Dynatrace heet.'] },
      { en: 'The sheep that stands by the door wants to join the standup.', parts: ['Het schaap', FK(['dat bij de deur staat', 'dat staat bij de deur', 'dat bij de deur'], 0, 'bijzin',
        'A dat-clause is a sub-clause: the verb goes to the very end, bij de deur staat.'), ', wil meedoen aan de standup.'] },

      // ---- builds: te plus infinitive and om ... te
      { en: 'I use the laptop to keep an eye on the dashboards.', parts: ['Ik gebruik de laptop', FK(['om', 'te', 'dat'], 0, 'omte',
        'om ... te means in order to: om opens the clause and te stands in front of the last verb.'), 'de dashboards in de gaten', FK(['te houden', 'houden te', 'te houd'], 0, 'omte',
        'te sits right in front of the infinitive: te houden.'), '.'] },
      { en: 'I forgot to switch on the alerts.', parts: ['Ik ben vergeten de alerts', FK(['aan te zetten', 'te aanzetten', 'aanzetten te'], 0, 'omte',
        'A separable verb takes te in the middle: aan + te + zetten.'), '.'] },
      { en: 'I do not feel like cycling to the office in this wind.', parts: ['Ik heb geen zin', FK(['om', 'van', 'te'], 0, 'omte',
        'geen zin om ... te: om opens the clause and te goes in front of the last verb.'), 'met deze wind naar kantoor', FK(['te fietsen', 'fietsen te', 'te fiets'], 0, 'omte',
        'te goes in front of the infinitive: te fietsen.'), '.'] },
      { en: 'I need two hours to solve the problem.', parts: ['Ik heb twee uur nodig', FK(['om', 'te'], 0, 'omte',
        'nodig hebben takes om ... te: om opens the clause and te goes inside the verb at the end.'), 'het probleem', FK(['op te lossen', 'te oplossen', 'op lossen te'], 0, 'omte',
        'oplossen is separable, so te goes between the parts: op te lossen.'), '.'] },
      { en: 'You do not have to come to the office today.', parts: ['Je', FK(['hoeft', 'moet', 'mag'], 0, 'mag',
        'hoeven is the verb for not needed and it takes te: je hoeft niet te komen. moeten and mogen never take te.'), 'vandaag niet naar kantoor te komen.'] },

      // ---- builds: conditionals with als ... dan and zou
      { en: 'If the wifi were better, I would work at home.', parts: ['Als de wifi beter', FK(['was', 'waren', 'zou'], 0, 'conditie',
        'For something that is not the case now, the clause with als takes the imperfectum: de wifi was. waren is for several.'), ', dan', FK(['zou ik', 'ik zou'], 0, 'v2',
        'dan takes slot 1, so the verb comes next: dan zou ik.'), 'thuis werken.'] },
      { en: 'If I missed the last ferry, I would stay on Texel.', parts: ['Als ik de laatste boot', FK(['miste', 'missen', 'gemist'], 0, 'conditie',
        'An imagined situation uses the imperfectum: ik miste. The answer part then has zou: dan zou ik blijven.'), ', dan zou ik op Texel blijven.'] },

      // ---- builds: er for quantity and the pronominal adverbs
      { en: 'How many colleagues do you have? I have seven.', parts: ["Hoeveel collega's heb je? Ik heb", FK(['er', 'het', 'hen'], 0, 'er',
        'er stands for the thing you counted: ik heb er zeven. het and hen cannot replace it here.'), 'zeven.'] },
      { en: 'My laptop is not working. Can you help me with it?', parts: ['Mijn laptop doet het niet. Kun je me', FK(['ermee', 'met het', 'met dat'], 0, 'erop',
        'After a preposition a thing becomes er, and er + met is written ermee. Not met het.'), 'helpen?'] },
      { en: 'There is a borrel on Friday. I am looking forward to it.', parts: ['Vrijdag is er een borrel. Ik verheug me', FK(['erop', 'op het', 'op hem'], 0, 'erop',
        'verheugen takes op, and a thing after op becomes er: erop.'), '.'] },
      { en: 'The new dashboard? I have been working on it for a week.', parts: ['Het nieuwe dashboard? Ik werk', FK(['er', 'het', 'hem'], 0, 'erop',
        'A thing after a preposition becomes er, and er moves forward: ik werk er al een week aan.'), 'al een week aan.'] },

      // ---- builds: review (sub-clause, imperfectum, zou)
      { en: 'Because the ferry was late, the standup started without me.', parts: ['Omdat de boot', FK(['te laat was', 'was te laat'], 0, 'bijzin',
        'omdat sends the verb to the end: te laat was.'), ',', FK(['begon de standup', 'de standup begon'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: begon de standup.'), 'zonder mij.'] },
      { en: 'Yesterday I had to take the first ferry for the meeting.', parts: ['Gisteren', FK(['moest ik', 'ik moest'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes next: moest ik.'), 'de eerste boot', FK(['nemen', 'te nemen'], 0, 'modal',
        'moeten takes no te: moest nemen. te is for hoeven and nodig hebben.'), 'voor de vergadering.'] },
      { en: 'Could you send me the link?', parts: ['Zou je me de link even', FK(['kunnen sturen', 'kan sturen', 'kon sturen'], 0, 'zou',
        'zou is the polite opener and the next verb stays an infinitive: zou je kunnen sturen.'), '?'] },

      // ---- words: the office, the colleagues, the incident, the island
      { w: 'the office', nl: 'het kantoor', wrong: 'de kantoor' }, { w: 'the colleague', nl: 'de collega' },
      { w: 'the laptop', nl: 'de laptop' }, { w: 'the screen', nl: 'het scherm', wrong: 'de scherm' },
      { w: 'the meeting', nl: 'de vergadering' }, { w: 'the consultation', nl: 'het overleg', wrong: 'de overleg' },
      { w: 'the outage', nl: 'de storing' }, { w: 'the alert', nl: 'de melding' },
      { w: 'the appointment', nl: 'de afspraak' }, { w: 'the wifi', nl: 'de wifi' },
      { w: 'the ferry', nl: 'de veerboot' }, { w: 'the crossing', nl: 'de overtocht' },
      { w: 'the sheep', nl: 'het schaap', wrong: 'de schaap' }, { w: 'the lamb', nl: 'het lam', wrong: 'de lam' },
      { w: 'the sheep barn', nl: 'de schapenboet' }, { w: 'the seal', nl: 'de zeehond' },
      { w: 'the wind', nl: 'de wind' },

      // ---- reads: three traps with their own options, two plain lines from the office
      { read: true, nl: 'Het schaap dat mijn scherm leest, wil een baan.', o: ['The sheep that reads my screen wants a job.', 'The sheep reads my screen because it wants a job.', 'My screen reads the sheep that wants a job.'], a: 0, r: 'diedat',
        w: 'dat belongs to het schaap, and the clause dat mijn scherm leest only says which sheep. The verb leest sits at the end of it.' },
      { read: true, nl: 'Als dit schaap kon praten, zou het over de wifi klagen.', o: ['If this sheep could talk, it would complain about the wifi.', 'When this sheep talks, it complains about the wifi.', 'This sheep can talk because it complains about the wifi.'], a: 0, r: 'conditie',
        w: 'kon after als plus zou in the answer part is an imagined case. A real habit would be als dit schaap praat, klaagt het.' },
      { read: true, nl: 'Ik heb geen zin om te vergaderen.', o: ['I do not feel like having a meeting.', 'I am not allowed to have a meeting.', 'I have no time for the meeting.'], a: 0, r: 'omte',
        w: 'geen zin om ... te means no desire to do it. Not allowed would be mag niet, and no time would be geen tijd.' },
      { read: true, nl: 'Dynatrace laat zien waar het probleem zit.', en: 'Dynatrace shows where the problem is.' },
      { read: true, nl: 'Sterkte ermee.', en: 'Good luck with it.' },

      // ---- listens: a landmark, an office word, a pronominal adverb
      { listen: true, nl: 'de vuurtoren', en: 'the lighthouse' }, { listen: true, nl: 'het wachtwoord', en: 'the password' },
      { listen: true, nl: 'ermee', en: 'with it' },

      // ---- looks: the bike (no helmet), the office door, the water of the Wadden Sea
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },

      // ---- de of het
      { dehet: true, nl: 'rooster', art: 'het', en: 'the schedule', w: 'het rooster. The plural is de roosters, because every plural is de.' },
      { dehet: true, nl: 'wol', art: 'de', en: 'the wool' },
    ] }]);
})();
