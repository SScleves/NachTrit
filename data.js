// Nachtrit content. Built from the dutch-lessons vault (02 - Grammar, 07 - Review).
// build: parts = fixed strings and forks. fork = {o: options, a: index of right one, r: rule id, w: why}
// read:  nl on the signpost, o = three English readings, a, r, w
// Distractors must be wrong Dutch, not merely less common Dutch.

window.RULES = {
  v2:     { name: 'V2 word order',                 note: 'V2 word order' },
  bijzin: { name: 'Sub-clause: verb to the end',   note: 'bijzin - werkwoord naar het einde' },
  aux:    { name: 'zijn or hebben',                note: 'zijn of hebben' },
  sep:    { name: 'Separable verbs',               note: 'scheidbare werkwoorden' },
  modal:  { name: 'Modal verbs',                   note: 'modale werkwoorden' },
  neg:    { name: 'niet vs geen',                  note: 'niet vs geen' },
  diedat: { name: 'die vs dat',                    note: 'die vs dat' },
  imp:    { name: 'Imperfectum',                   note: 'imperfectum' },
  kof:    { name: "'t kofschip",                   note: "'t kofschip" },
  perf:   { name: 'Perfectum',                     note: 'perfectum' },
  tmp:    { name: 'Time, manner, place',           note: 'tijd-manier-plaats' },
  aanhet: { name: 'aan het + infinitive',          note: 'aan het + infinitief' },
  fut:    { name: 'Future: gaan / zullen',         note: 'futurum - gaan + infinitief' },
  refl:   { name: 'Reflexive verbs',               note: 'reflexieve werkwoorden' },
  soft:   { name: 'Softeners: wel, even, maar',    note: 'zachtmakers - wel even maar' },
  dehet:  { name: 'de vs het',                     note: 'de vs het' },
  adj:    { name: 'Adjective -e',                  note: 'de vs het' },
  mag:    { name: 'moet niet vs mag niet',         note: 'mogen' },
  al:     { name: 'Still going on: present + al',  note: 'wonen' },
  cult:   { name: 'Culture words',                 note: 'gezellig' },
};

const F = (o, a, r, w) => ({ o, a, r, w });

window.SENTENCES = [
  // ---- Werk ----
  { en: "I'll call you back after the standup.", nl: "Na de standup bel ik je terug.", theme: 'werk',
    parts: ["Na de standup", F(["bel ik je terug", "ik bel je terug", "bel ik terug je"], 0, 'v2',
      "A fronted time phrase pushes the subject behind the verb: bel ik. The separable prefix terug sits at the end.")] },

  { en: "I'm late because the meeting ran over.", nl: "Ik ben laat omdat de vergadering uitliep.", theme: 'werk',
    parts: ["Ik ben laat", F(["omdat de vergadering uitliep", "omdat uitliep de vergadering", "omdat de vergadering liep uit"], 0, 'bijzin',
      "omdat opens a sub-clause: every verb goes to the end, and the separable verb glues back together: uitliep.")] },

  { en: "I'm late, because the meeting ran over.", nl: "Ik ben laat, want de vergadering liep uit.", theme: 'werk',
    parts: ["Ik ben laat,", F(["want de vergadering liep uit", "want de vergadering uitliep", "want liep de vergadering uit"], 0, 'bijzin',
      "want is not a sub-clause word. Normal V2 stays, and the prefix splits off to the end: liep ... uit.")] },

  { en: "I have to build a dashboard today.", nl: "Ik moet vandaag een dashboard bouwen.", theme: 'werk',
    parts: ["Ik moet vandaag een dashboard", F(["bouwen", "te bouwen", "bouw"], 0, 'modal',
      "After a modal the main verb is a bare infinitive at the end. No te.")] },

  { en: "I don't have time, I have a meeting.", nl: "Ik heb geen tijd, ik heb een vergadering.", theme: 'werk',
    parts: ["Ik heb", F(["geen", "niet"], 0, 'neg',
      "geen negates a noun that would take een or no article. If Spanish says it with a bare noun, you need geen."), "tijd, ik heb een vergadering."] },

  { en: "I'm not going to the office.", nl: "Ik ga niet naar kantoor.", theme: 'werk',
    parts: ["Ik ga", F(["niet naar kantoor", "geen naar kantoor", "naar kantoor niet"], 0, 'neg',
      "niet negates the verb and sits before the place phrase.")] },

  { en: "The colleague who sits next to me works on the pipeline.", nl: "De collega die naast me zit, werkt aan de pipeline.", theme: 'werk',
    parts: ["De collega", F(["die naast me zit", "dat naast me zit", "die zit naast me"], 0, 'diedat',
      "collega is a de-word, so die. Inside the relative clause the verb goes to the end."), ", werkt aan de pipeline."] },

  { en: "The meeting lasted two hours.", nl: "De vergadering duurde twee uur.", theme: 'werk',
    parts: ["De vergadering", F(["duurde", "duurte", "heeft geduurd"], 0, 'imp',
      "How long something lasted is background: imperfectum. Stem duur ends in r, so -de."), "twee uur."] },

  { en: "I worked from home yesterday.", nl: "Ik werkte gisteren thuis.", theme: 'werk',
    parts: ["Ik", F(["werkte", "werkde", "werkten"], 0, 'kof',
      "Stem werk ends in k, which is in 't kofschip (soft ketchup), so -te. Singular, so no -n."), "gisteren thuis."] },

  { en: "I get an alert when something breaks.", nl: "Ik krijg een melding als er iets stuk gaat.", theme: 'werk',
    parts: ["Ik krijg een melding", F(["als er iets stuk gaat", "als er gaat iets stuk", "als er iets gaat stuk"], 0, 'bijzin',
      "als opens a sub-clause: the verb goes to the very end, after stuk.")] },

  { en: "I'm working.", nl: "Ik ben aan het werken.", theme: 'werk',
    parts: ["Ik", F(["ben aan het werken", "ben werkend", "werk aan het"], 0, 'aanhet',
      "An action in progress right now: zijn + aan het + infinitive.")] },

  { en: "I'll WhatsApp you tomorrow.", nl: "Ik zal je morgen appen.", theme: 'werk',
    parts: ["Ik", F(["zal je morgen appen", "zal morgen appen je", "zal je appen morgen"], 0, 'fut',
      "A promise takes zullen. The pronoun je hugs the verb, and the infinitive goes to the very end.")] },

  { en: "Could you repeat that?", nl: "Zou je dat kunnen herhalen?", theme: 'werk',
    parts: ["Zou je dat", F(["kunnen herhalen", "herhalen kunnen", "kunnen te herhalen"], 0, 'modal',
      "Two verbs pile up at the end in this order: modal, then main verb. Never te after a modal.")] },

  // ---- Golf ----
  { en: "I went to the golf course.", nl: "Ik ben naar de golfbaan gegaan.", theme: 'golf',
    parts: ["Ik", F(["ben", "heb"], 0, 'aux',
      "Movement to a destination takes zijn, even though English says 'have gone'."), "naar de golfbaan",
      F(["gegaan", "gaan", "gegaand"], 0, 'perf', "Irregular participle: gegaan.")] },

  { en: "I played golf this weekend.", nl: "Ik heb dit weekend golf gespeeld.", theme: 'golf',
    parts: ["Ik", F(["heb", "ben"], 0, 'aux',
      "An activity, not movement: hebben."), "dit weekend golf",
      F(["gespeeld", "gespeelt", "speelde"], 0, 'kof', "Stem speel ends in l, not in 't kofschip, so -d: gespeeld. It still sounds like a t.")] },

  { en: "If it rains, we don't play.", nl: "Als het regent, spelen we niet.", theme: 'golf',
    parts: ["Als het regent,", F(["spelen we niet", "we spelen niet", "we niet spelen"], 0, 'v2',
      "When the sub-clause comes first, the main clause starts with its verb. Inversion.")] },

  { en: "I think he plays better golf than me.", nl: "Ik denk dat hij beter golft dan ik.", theme: 'golf',
    parts: ["Ik denk", F(["dat hij beter golft dan ik", "dat hij golft beter dan ik", "dat golft hij beter dan ik"], 0, 'bijzin',
      "dat opens a sub-clause: the verb moves to the end of its clause.")] },

  { en: "I'm going to the golf course with Mark on Saturday.", nl: "Ik ga zaterdag met Mark naar de golfbaan.", theme: 'golf',
    parts: ["Ik ga", F(["zaterdag met Mark naar de golfbaan", "naar de golfbaan met Mark zaterdag", "met Mark zaterdag naar de golfbaan"], 0, 'tmp',
      "Dutch orders details time, manner, place. English does the reverse.")] },

  { en: "Shall we meet up on Saturday?", nl: "Zullen we zaterdag afspreken?", theme: 'golf',
    parts: ["Zullen we", F(["zaterdag afspreken", "afspreken zaterdag", "zaterdag spreken af"], 0, 'sep',
      "With zullen the separable verb stays glued as an infinitive at the end: afspreken.")] },

  { en: "It rained and the course was wet.", nl: "Het regende en de baan was nat.", theme: 'golf',
    parts: ["Het", F(["regende", "regente", "heeft geregend"], 0, 'imp',
      "Story background: imperfectum. Stem regen ends in n, so -de."), "en de baan was nat."] },

  { en: "I'm going to play golf on Saturday.", nl: "Ik ga zaterdag golfen.", theme: 'golf',
    parts: ["Ik", F(["ga zaterdag golfen", "ga golfen zaterdag", "zaterdag ga golfen"], 0, 'fut',
      "gaan in slot 2, the infinitive at the very end, after the time word.")] },

  // ---- Thuis ----
  { en: "Tomorrow I'm going home.", nl: "Morgen ga ik naar huis.", theme: 'thuis',
    parts: ["Morgen", F(["ga ik", "ik ga"], 0, 'v2',
      "After a fronted time word the verb stays in slot 2, so the subject slides behind it: Morgen GA IK."), "naar huis."] },

  { en: "I walked the dogs yesterday.", nl: "Gisteren heb ik de honden uitgelaten.", theme: 'thuis',
    parts: ["Gisteren", F(["heb ik", "ik heb", "ben ik"], 0, 'v2',
      "Inversion after Gisteren, and walking the dogs is an activity, so hebben."),
      F(["de", "het"], 0, 'dehet', "hond is a de-word, and every plural is de."), "honden",
      F(["uitgelaten", "geuitlaten", "uitlaten"], 0, 'sep', "Separable verb in the perfectum: ge squeezes into the middle. uit-GE-laten.")] },

  { en: "I haven't unloaded the dishwasher yet.", nl: "Ik heb de vaatwasser nog niet uitgeruimd.", theme: 'thuis',
    parts: ["Ik heb de vaatwasser", F(["nog niet uitgeruimd", "niet nog uitgeruimd", "nog geen uitgeruimd"], 0, 'neg',
      "nog niet means not yet. niet goes before the participle at the end.")] },

  { en: "Honey, I'm cooking!", nl: "Schat, ik ben aan het koken!", theme: 'thuis',
    parts: ["Schat, ik", F(["ben aan het koken", "ben kokend", "kook aan het"], 0, 'aanhet',
      "Right-now action: zijn + aan het + infinitive.")] },

  { en: "What are we going to eat tonight?", nl: "Wat gaan we vanavond eten?", theme: 'thuis',
    parts: ["Wat", F(["gaan we vanavond eten", "gaan we eten vanavond", "we gaan vanavond eten"], 0, 'fut',
      "Question: gaan in slot 2, subject after it, infinitive at the very end, after the time word.")] },

  { en: "Sorry, I was wrong.", nl: "Sorry, ik heb me vergist.", theme: 'thuis',
    parts: ["Sorry, ik heb", F(["me vergist", "me gevergist", "mij vergisd"], 0, 'refl',
      "Verbs starting with ver- get no ge- in the participle: vergist. The self-word for ik is me.")] },

  { en: "The dogs are bored.", nl: "De honden vervelen zich.", theme: 'thuis',
    parts: ["De honden vervelen", F(["zich", "hun", "ze"], 0, 'refl',
      "Plural zij takes zich. Time for a walk.")] },

  { en: "I stayed home.", nl: "Ik ben thuis gebleven.", theme: 'thuis',
    parts: ["Ik", F(["ben", "heb"], 0, 'aux',
      "blijven takes zijn even though nothing moves."), "thuis gebleven."] },

  { en: "We've lived here for two years.", nl: "We wonen hier al twee jaar.", theme: 'thuis',
    parts: ["We", F(["wonen hier al twee jaar", "hebben hier twee jaar gewoond", "wonen hier voor twee jaar"], 0, 'al',
      "Started in the past and still going on: present tense with al. The perfectum would mean you moved away.")] },

  { en: "I used to live in Spain.", nl: "Vroeger woonde ik in Spanje.", theme: 'thuis',
    parts: ["Vroeger", F(["woonde ik", "woonte ik", "ik woonde"], 0, 'imp',
      "Stem woon ends in n, not in 't kofschip, so -de. And inversion after Vroeger."), "in Spanje."] },

  // ---- Buren ----
  { en: "Could I borrow your ladder?", nl: "Mag ik jullie ladder even lenen?", theme: 'buren',
    parts: ["Mag ik jullie ladder", F(["even lenen", "lenen even", "even te lenen"], 0, 'soft',
      "even softens the request and sits before the infinitive at the end.")] },

  { en: "The house that's for sale belongs to the neighbours.", nl: "Het huis dat te koop staat, is van de buren.", theme: 'buren',
    parts: ["Het huis", F(["dat te koop staat", "die te koop staat", "dat staat te koop"], 0, 'diedat',
      "huis is a het-word, so dat, and the verb goes to the end of the relative clause."), ", is van de buren."] },

  { en: "Let me introduce myself. I'm Santi.", nl: "Mag ik me even voorstellen? Ik ben Santi.", theme: 'buren',
    parts: ["Mag ik", F(["me even voorstellen", "zich even voorstellen", "me voorstellen even"], 0, 'refl',
      "The self-word matches ik, so me, right after the verb and before the softener even."), "? Ik ben Santi."] },

  { en: "Do drop by sometime!", nl: "Kom maar even langs, hoor!", theme: 'buren',
    parts: ["Kom", F(["maar even langs, hoor!", "langs maar even, hoor!", "maar even langskomen, hoor!"], 0, 'soft',
      "maar and even soften the command, the prefix langs goes to the end, hoor is the friendly tail.")] },

  { en: "The neighbours have a nice house.", nl: "De buren hebben een mooi huis.", theme: 'buren',
    parts: ["De buren hebben een", F(["mooi", "mooie"], 0, 'adj',
      "A het-word after een loses the -e: een mooi huis. But: een mooie avond, because avond is a de-word."), "huis."] },

  { en: "Are you coming along?", nl: "Ga je mee?", theme: 'buren',
    parts: ["Ga je", F(["mee?", "meegaan?", "mee gaan?"], 0, 'sep',
      "Present tense of a separable verb: the prefix breaks off and goes to the end. Ga ... mee.")] },

  // ---- Reading signposts ----
  { read: true, nl: "Je moet niet gaan.", theme: 'buren',
    o: ["You don't have to go.", "You mustn't go.", "You shouldn't go."], a: 0, r: 'mag',
    w: "moet niet means don't have to. Forbidden is mag niet. The classic Spanish-instinct trap." },

  { read: true, nl: "Je mag niet gaan.", theme: 'buren',
    o: ["You're not allowed to go.", "You don't have to go.", "You don't want to go."], a: 0, r: 'mag',
    w: "mag niet is the prohibition. moet niet would be the one that lets you off." },

  { read: true, nl: "Ik heb geen blockers.", theme: 'werk',
    o: ["I have no blockers.", "I'm not blocked yet.", "I'm blocking nobody."], a: 0, r: 'neg',
    w: "geen before a noun: no blockers. The standup magic word." },

  { read: true, nl: "Het gaat wel.", theme: 'golf',
    o: ["I'm managing.", "It's going great.", "It's not working."], a: 0, r: 'soft',
    w: "wel here means fine, so-so. Not enthusiasm, not failure." },

  { read: true, nl: "Ik doe het wel.", theme: 'thuis',
    o: ["I'll handle it.", "I'm doing it right now.", "I'm not doing it."], a: 0, r: 'soft',
    w: "wel as reassurance: don't worry, I'll do it." },

  { read: true, nl: "Gaat het?", theme: 'golf',
    o: ["Are you OK?", "Is it leaving?", "Does it fit?"], a: 0, r: 'soft',
    w: "gaan is how Dutch asks how you are. Someone trips on the course: Gaat het?" },

  { read: true, nl: "Zeg maar Santi.", theme: 'buren',
    o: ["Just call me Santi.", "Say it to Santi.", "Tell Santi anyway."], a: 0, r: 'soft',
    w: "maar softens the command: just call me Santi." },

  { read: true, nl: "Ik ben naar de bioscoop geweest.", theme: 'thuis',
    o: ["I went to the cinema.", "I'm going to the cinema.", "I was at the cinema when..."], a: 0, r: 'perf',
    w: "ben + geweest: a finished trip. Movement takes zijn." },

  { read: true, nl: "Morgen werk ik thuis.", theme: 'werk',
    o: ["Tomorrow I'm working from home.", "I worked from home yesterday.", "I work at home every day."], a: 0, r: 'fut',
    w: "Present tense plus a time word is a valid future in Dutch. Very common." },

  { read: true, nl: "De storing kwam om drie uur binnen.", theme: 'werk',
    o: ["The incident came in at three.", "The outage lasted until three.", "The outage is coming at three."], a: 0, r: 'sep',
    w: "binnenkomen split apart: kwam ... binnen. Past tense, 3 AM, your life." },

  { read: true, nl: "Het was gezellig!", theme: 'buren',
    o: ["That was lovely, all of us together!", "It was crowded!", "It was expensive!"], a: 0, r: 'cult',
    w: "gezellig: cozy togetherness. Mandatory when leaving any social event." },

  { read: true, nl: "Ik heb niets gezien.", theme: 'thuis',
    o: ["I saw nothing.", "I didn't see him.", "I saw something."], a: 0, r: 'neg',
    w: "One negative only: niets. No double negation like no vi nada." },

  { read: true, nl: "Kennen jullie elkaar?", theme: 'buren',
    o: ["Do you know each other?", "Do you know yourselves?", "Do you know him?"], a: 0, r: 'refl',
    w: "elkaar means each other, when it is mutual." },

  { read: true, nl: "Ik herinner me die vergadering niet.", theme: 'werk',
    o: ["I don't remember that meeting.", "I won't remind him of that meeting.", "That meeting doesn't concern me."], a: 0, r: 'refl',
    w: "zich herinneren: the self-word me right after the verb. Suspiciously useful." },

  { read: true, nl: "We wonen hier al twee jaar.", theme: 'thuis',
    o: ["We've been living here for two years.", "We lived here two years ago.", "We're moving here in two years."], a: 0, r: 'al',
    w: "Present plus al: still going on. English uses the perfect, Dutch does not." },
];
