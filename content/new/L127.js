// Nachtrit, Amsterdam (tier 13, B1 to B2): level 127 Het werk. An office in a canal house on the Herengracht, the canal of the
// old merchants and now of the banks and the lawyers, five floors up a staircase nobody takes, and after lunch a meeting in a
// glass tower at the Zuidas. Reports, figures, a formal letter to a client, the coffee machine, and the end of English as the
// office language, which is the whole point of the game.
// New at tier 13 and drilled here: long builds with three forks, the formal letter in full (naar aanleiding van uw e-mail van
// 3 maart, Tot onze spijt moeten wij u laten weten, Wij vertrouwen erop u hiermee voldoende te hebben geïnformeerd, ik verbind
// u door), figures in words (drie komma vijf procent, een miljoen tweehonderdduizend euro, half drie), subtle pairs in builds and
// reads (uitgesteld against afgelast, eindelijk against eigenlijk, ontslagen against ontslag nemen, verzet), and the premise:
// before the mist everyone switched to English, now the colleagues answer in Dutch.
// Review of every tier: V2 everywhere, a separable verb joined in a dat-clause, erop vertrouwen, 't kofschip (geïnformeerd,
// getest), the present with al, the imperfectum steeg, a reflexive verb with its preposition, indirect speech, the passive with
// a modal and door, the conditional pluperfect with zijn, the superlative beste with dat, hoewel, the plural collega's.
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios/De standup - tech talk, Koffiepraatje op kantoor, Uitleggen wat je doet
// - Dynatrace; _site/situations/office (Heb je even, Ik zit zo in een meeting); MOC Gevoel & uitdrukkingen (contact opnemen met);
// 02 - Grammar/bijzin, V2 word order, scheidbare werkwoorden, reflexieve werkwoorden, 't kofschip; MOC Getallen, MOC Tijd, dagen &
// maanden; level 119 for the replayed words (de offerte, de klant, het wachtwoord, de werkplek, de thuiswerkdag); STORY.md for the
// premise (the Dutch always switched to English); content/towns.js for Amsterdam (the grachtengordel, the bells, the bikes).
// New rules: weg (guarded, the same text in every Amsterdam file); idioom, formeel and datum keep the Nijmegen text. bezit, sepbz,
// pronadv, indirect, passief, klok, vergelijk and hoewel are guarded copies of the existing definitions.
// New props: none. Only hond, lamp and fiets are used (no word, listen or look answer here is a lamp or a bike).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.sepbz = window.RULES.sepbz || { name: 'Separable verbs in sub-clauses', note: 'scheidbare werkwoorden' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erbij, ermee, waar ... op', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 127, act: 13, name: 'Het werk', town: 'amsterdam', place: 'werk', theme: 'street', ...P,
    intro: 'In Amsterdam the standup was in English for ten years. Since the mist it is in Dutch. Nobody understands it, so nothing has changed.',
    introNl: 'In Amsterdam was de standup tien jaar lang in het Engels. Sinds de mist is hij in het Nederlands. Niemand begrijpt hem, dus er is niets veranderd.',
    mission: {
      where: 'An office in a canal house on the Herengracht, the canal of the old merchants and now of the banks and the lawyers, five floors up a staircase nobody takes. After lunch a meeting in a glass tower at the Zuidas, where everyone is in a hurry and nobody knows why. The dogs come too. They need a walk at three.',
      carry: 'A laptop at four percent, two leads, a formal letter to a client that has to go out today, a team lunch split to the cent, and the grammar book, still never opened, under the monitor to raise it. No helmet. At the Zuidas they only wear lanyards.',
      want: 'Since the mist the dead in the office speak Dutch for the first time in years, and they do it properly: the formal register for the client, the informal one at the coffee machine, long sentences with the verb at the end and figures you can put in a report. Your manager wants the numbers in words, your colleague wants to know whether you have a minute, and the client wants to be called u. Nobody switches to English any more. The women in the meeting are still taller than you.' },
    items: [
      // ---- builds: the formal letter, long and complete
      { en: 'Dear Ms Bakker, further to your email of 3 March I am sending you the report.', parts: ['Geachte mevrouw Bakker,', FK(['naar aanleiding van', 'door aanleiding van'], 0, 'formeel',
        'naar aanleiding van is the fixed formal way to say further to.'), 'uw e-mail', FK(['van 3 maart', 'van maart 3'], 0, 'datum',
        'Dutch dates put the day before the month: 3 maart.'), FK(['stuur ik u', 'ik stuur u'], 0, 'v2',
        'The whole opening phrase fills slot 1, so the verb comes second: stuur ik.'), 'het rapport.'] },
      { en: 'We regret to inform you that the project is two weeks behind schedule.', parts: [FK(['Tot onze spijt', 'Tot ons spijt'], 0, 'bezit',
        'spijt is a de-word, so onze: tot onze spijt.'), FK(['moeten wij u', 'wij moeten u'], 0, 'v2',
        'Tot onze spijt fills slot 1, so the verb comes second: moeten wij.'), 'laten weten dat het project twee weken vertraging', FK(['oploopt', 'loopt op'], 0, 'sepbz',
        'In a dat-clause the separable verb joins up at the end: oploopt.'), '.'] },
      { en: 'We trust that this gives you sufficient information.', parts: ['Wij vertrouwen', FK(['erop', 'ervan'], 0, 'pronadv',
        'vertrouwen goes with op, so erop.'), 'u hiermee voldoende', FK(['te hebben geïnformeerd', 'te hebben geïnformeerdt', 'hebben te geïnformeerd'], 0, 'kof',
        'informeer ends in r, not a ketchup letter, so -d: geïnformeerd. te comes right before hebben.'), '.'] },
      { en: 'One moment, please, I will put you through to my colleague.', parts: ['Een ogenblik, alstublieft, ik', FK(['verbind u door', 'doorverbind u'], 0, 'sep',
        'doorverbinden splits in a main clause: verbind ... door.'), 'met', FK(['mijn', 'mij'], 0, 'bezit',
        'Before a noun the possessive is mijn. mij is the object, me.'), 'collega.'] },

      // ---- builds: the figures in words
      { en: 'Turnover rose by three point five percent, to one million two hundred thousand euros.', parts: ['De omzet', FK(['steeg', 'stijgde', 'stoog'], 0, 'imp',
        'stijgen is irregular: steeg, gestegen.'), FK(['met', 'op'], 0, 'woord',
        'Rising by an amount is stijgen met. stijgen tot is rising to a level.'), FK(['drie komma vijf', 'drie punt vijf'], 0, 'getal',
        'Dutch writes and says a decimal comma: drie komma vijf, 3,5.'), 'procent, tot een miljoen tweehonderdduizend euro.'] },
      { en: 'The meeting is on Thursday 12 March at half past two.', parts: ['De vergadering is', FK(['op donderdag', 'in donderdag'], 0, 'datum',
        'Days take op: op donderdag.'), '12 maart om', FK(['half drie', 'half twee'], 0, 'klok',
        'Dutch counts the half towards the next hour: half past two is half drie.'), '.'] },
      { en: 'This is the best quarter we have ever had.', parts: ['Dit is het', FK(['beste', 'goedste', 'betere'], 0, 'vergelijk',
        'goed is irregular: beter, best. After het before a noun: het beste kwartaal.'), 'kwartaal', FK(['dat', 'die'], 0, 'diedat',
        'kwartaal is a het-word, so dat.'), 'we ooit', FK(['hebben gehad', 'hebben gehebt'], 0, 'perf',
        'hebben is irregular: gehad.'), '.'] },

      // ---- builds: subtle pairs at work
      { en: 'The meeting has been postponed, not cancelled.', parts: ['De vergadering is', FK(['uitgesteld', 'afgesteld'], 0, 'woord',
        'uitstellen is to postpone. afstellen is to adjust a machine.'), ', niet', FK(['afgelast', 'afgelost'], 0, 'woord',
        'afgelasten is to cancel. aflossen is to pay off a debt, or to take over a shift.'), '.'] },
      { en: 'After two years I have finally mastered the new system.', parts: ['Na twee jaar', FK(['heb ik', 'ik heb'], 0, 'v2',
        'Na twee jaar fills slot 1, so the verb comes second: heb ik.'), 'het nieuwe systeem', FK(['eindelijk', 'eigenlijk'], 0, 'woord',
        'eindelijk means at last. eigenlijk means actually.'), FK(['onder de knie', 'onder de voet', 'op de knie'], 0, 'idioom',
        'iets onder de knie hebben means to have mastered it. Only onder de knie.'), '.'] },
      { en: 'The dashboard has been red since this morning, and nobody knows why.', parts: [FK(['Het', 'De'], 0, 'dehet',
        'dashboard is a het-word: het dashboard.'), 'dashboard', FK(['staat', 'stond'], 0, 'al',
        'It is still red, so the present with al: staat al sinds vanochtend op rood. stond would mean it is over.'), 'al sinds vanochtend op rood, en niemand weet waarom.'] },
      { en: "I'll just forward the email to you.", parts: ['Ik stuur de mail', FK(['even naar je door', 'naar je door even'], 0, 'soft',
        'even stands in the middle, and the prefix door of doorsturen closes the sentence. Nothing comes after it.'), '.'] },
      { en: 'Since the mist my manager has been working his socks off.', parts: ['Sinds de mist', FK(['werkt mijn manager zich', 'mijn manager werkt zich'], 0, 'v2',
        'Sinds de mist fills slot 1, so the verb comes second.'), FK(['uit de naad', 'uit de zoom'], 0, 'idioom',
        'zich uit de naad werken means to work extremely hard. Only de naad, the seam.'), '.'] },
      { en: 'I am really looking forward to the Friday drinks.', parts: ['Ik', FK(['verheug me', 'verheug'], 0, 'refl',
        'zich verheugen op is reflexive: ik verheug me. Without me it is not Dutch.'), 'echt', FK(['op', 'aan'], 0, 'woord',
        'zich verheugen goes with op: op de vrijmibo.'), 'de vrijmibo.'] },

      // ---- builds: the end of English at the office
      { en: 'Before the mist everyone at the office switched to English as soon as I said something.', parts: ['Voor de mist', FK(['schakelde iedereen', 'iedereen schakelde'], 0, 'v2',
        'Voor de mist fills slot 1, so the verb comes second: schakelde iedereen.'), 'op kantoor', FK(['over op', 'op over'], 0, 'sep',
        'overschakelen splits: schakelde ... over, and the language comes after op: over op Engels.'), 'Engels', FK(['zodra ik iets zei', 'zodra zei ik iets'], 0, 'bijzin',
        'zodra opens a sub-clause, so the verb goes to the end: zodra ik iets zei.'), '.'] },
      { en: 'Since the mist my colleagues answer me in Dutch, even when I make mistakes.', parts: ['Sinds de mist', FK(["antwoorden mijn collega's", "mijn collega's antwoorden"], 0, 'v2',
        'Sinds de mist fills slot 1, so the verb comes second.'), 'me in het Nederlands, zelfs als ik', FK(['fouten maak', 'maak fouten'], 0, 'bijzin',
        'als opens a sub-clause, so the verb goes to the end: fouten maak.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'My manager asked whether I had read the report before the meeting.', parts: ['Mijn manager vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'ik het rapport voor de vergadering', FK(['had gelezen', 'was gelezen'], 0, 'aux',
        'lezen takes hebben: had gelezen. was gelezen would make the report the one who read.'), '.'] },
      { en: 'The new release has to be tested by the whole team before Friday.', parts: ['De', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'release is a de-word, so nieuwe.'), 'release moet voor vrijdag', FK(['door', 'van'], 0, 'passief',
        'In a passive sentence the doer comes with door.'), 'het hele team', FK(['worden getest', 'worden getesd', 'wordt getest'], 0, 'passief',
        'After moet the passive ends in worden plus the participle. test ends in t, so getest gets nothing extra.'), '.'] },
      { en: 'If I had known that, I would have stayed at home.', parts: ['Als ik dat', FK(['had geweten', 'had gewist', 'was geweten'], 0, 'perf',
        'weten has its own participle: geweten, with hebben. gewist means wiped.'), ',', FK(['was ik', 'had ik'], 0, 'aux',
        'thuisblijven takes zijn: was ik thuisgebleven.'), FK(['thuisgebleven', 'thuisgeblijfd'], 0, 'perf',
        'blijven is irregular: gebleven, with thuis in front.'), '.'] },
      { en: 'Although the client was not satisfied, I think we did good work.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel',
        'hoewel opens a clause with its own verb. ondanks needs a noun.'), 'de klant niet', FK(['tevreden was', 'was tevreden'], 0, 'bijzin',
        'hoewel sends the verb to the end: tevreden was.'), ',', FK(['vind ik', 'ik vind'], 0, 'v2',
        'The hoewel-clause fills slot 1, so the main clause starts with its verb: vind ik.'), 'dat we goed werk hebben geleverd.'] },
      { en: "The office is at the Zuidas, five minutes' walk from station Zuid.", parts: [FK(['Het', 'De'], 0, 'dehet',
        'kantoor is a het-word: het kantoor.'), 'kantoor', FK(['ligt', 'legt'], 0, 'weg',
        'liggen is where something is. leggen is putting something down.'), 'aan de Zuidas, vijf minuten lopen van station Zuid.'] },

      // ---- words: the office, the figures, five replayed from Nijmegen
      { w: 'the business district of Amsterdam', nl: 'de Zuidas' }, { w: 'the report', nl: 'het rapport', wrong: 'de rapport' },
      { w: 'the turnover', nl: 'de omzet' }, { w: 'the quarter (three months)', nl: 'het kwartaal', wrong: 'de kwartaal' },
      { w: 'the annual report', nl: 'het jaarverslag', wrong: 'de jaarverslag' }, { w: 'the attachment', nl: 'de bijlage' },
      { w: 'the open-plan office', nl: 'de kantoortuin' }, { w: 'the head office', nl: 'het hoofdkantoor', wrong: 'de hoofdkantoor' },
      { w: 'the lunch break', nl: 'de lunchpauze' }, { w: 'the colleague', nl: 'de collega' },
      { w: 'the figure, the number', nl: 'het cijfer', wrong: 'de cijfer' }, { w: 'the meeting', nl: 'de vergadering' },
      { w: 'the signature', nl: 'de handtekening' }, { w: 'the quote (for a client)', nl: 'de offerte' },
      { w: 'the client', nl: 'de klant' }, { w: 'the password', nl: 'het wachtwoord', wrong: 'de wachtwoord' },
      { w: 'the workplace, the desk', nl: 'de werkplek' }, { w: 'the working-from-home day', nl: 'de thuiswerkdag' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'Hij is ontslagen.', o: ['He has been fired.', 'He has resigned.', 'He has been promoted.'], a: 0, r: 'woord',
        w: 'ontslagen worden is being fired. Resigning is ontslag nemen.' },
      { read: true, nl: 'De vergadering is verzet naar vrijdag.', o: ['The meeting has been moved to Friday.', 'The meeting on Friday has been cancelled.', 'Nobody wants a meeting on Friday.'], a: 0, r: 'woord',
        w: 'verzetten is moving an appointment. Cancelling would be afzeggen or afgelasten.' },
      { read: true, nl: 'Ik ben eindelijk klaar.', o: ['I am finally done.', 'I am actually done.', 'I am almost done.'], a: 0, r: 'woord',
        w: 'eindelijk means at last. eigenlijk means actually, and almost would be bijna.' },
      { read: true, nl: 'Wij nemen zo spoedig mogelijk contact met u op.', o: ['We will contact you as soon as possible.', 'Please contact us as soon as possible.', 'We contacted you as quickly as we could.'], a: 0, r: 'formeel',
        w: 'wij nemen contact op: we are the ones who will get in touch. zo spoedig mogelijk is formal for as soon as possible.' },
      { read: true, nl: 'Aan de Herengracht woonden vroeger de rijke kooplieden; nu zitten er banken en advocaten.', en: 'The rich merchants used to live on the Herengracht; now it is banks and lawyers.' },
      { read: true, nl: 'In Amsterdam was de voertaal op kantoor jarenlang Engels.', en: 'In Amsterdam the working language in the office was English for years.' },

      // ---- listens: a figure, the canal of the merchants, a sum, a letter ending
      { listen: true, nl: 'drie komma vijf procent', en: '3,5 %' }, { listen: true, nl: 'de Herengracht', en: 'the canal of the merchants' },
      { listen: true, nl: 'een miljoen euro', en: '€ 1.000.000' }, { listen: true, nl: 'met vriendelijke groet', en: 'kind regards' },

      // ---- looks: the dog, the desk lamp, the bike outside
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },

      // ---- de of het
      { dehet: true, nl: 'budget', art: 'het', en: 'the budget', w: 'het budget. Learn it with its article: there is no rule.' },
      { dehet: true, nl: 'functie', art: 'de', en: 'the job title', w: 'Nouns ending in -tie are de: de functie, de informatie.' },
    ] }]);
})();
