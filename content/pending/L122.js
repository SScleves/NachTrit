// Nachtrit, Nijmegen (tier 12, B1 to B2): level 122 De Waalbrug, the town's own place. The long dark green arch of the
// Waalbrug over the Waal, the Valkhof on its hill with the Romans before it, the Stevenskerk and the Waag, the pale
// Oversteek downstream, students everywhere, the Vierdaagse in July with its gladioli and its blisters, and the standing
// claim that Nijmegen is older than Maastricht. 1944 is told once, plainly and without a joke.
// New at tier 12 and drilled here: modal particles (wel for probability and reassurance, even before the final participle,
// eens as an invitation, maar and hoor and nou in the reading forks), compound nouns (one word, the article of the last
// part, the glue -s- in stadsmuur against stadhuis), formal register (Geachte, Hoogachtend, u and uw, zou u, hebt u),
// a few fixed idioms (met de deur in huis vallen, zeg dat wel, op zijn tandvlees lopen, het valt tegen) and the Vierdaagse:
// its distances, its month, its first year (1909) and the Romans two thousand years back.
// Review: V2 after a fronted phrase, the passive with worden (present and past), indirect speech with dat, the comparative,
// hoewel, a question inside a question (verb to the end), the adjective -e, imperfectum of lopen and wonen, 't kofschip,
// separable participles (overgestoken), geen against niet.
// Still inside the fence: 16 words max. Nothing from tier 13 (long builds with three forks, tourist registers, prices).
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar (Ik pak wel even een biertje, Kom maar even langs hoor,
// Mooi weertje toch), V2 word order, bijzin - werkwoord naar het einde, imperfectum, perfectum, 't kofschip, scheidbare
// werkwoorden, de vs het; 03 - Verbs/wandelen, zullen; _site/words (de spierpijn, het publiek, het museum, het feest,
// de rekening, wandelen, kunt u dit even nakijken, zeg dat wel, hoewel, het stadhuis via het huis); MOC Voegwoorden;
// MOC Lidwoorden & voornaamwoorden (hun, uw); content/towns.js for Nijmegen (de Waalbrug, het Valkhof, de Oversteek, de
// Vierdaagse, de gladiool, de heuvel, de Romeinen, de student, het feest, the Maastricht rumour, the Vierdaagse joke).
// New rules: samen, formeel and idioom, defined and guarded below. soft, neg, v2, bijzin, perf, kof, sep, adj, dehet, zou,
// passief, indirect, vergelijk, hoewel, bezit and getal exist (the ones from other files are guarded below too).
// New props: none. Only brug, hond and lamp are used (not water, kerk, huis, boom or fiets: de Waal, de Stevenskerk, het
// stadhuis, het studentenhuis and de fietser are in the build texts or the word pool and could be taken for the prop).
(() => {
  const R = window.RULES;
  R.samen = R.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  R.formeel = R.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'hoe-gaat-het-met-u' };
  R.idioom = R.idioom || { name: 'Idioms: fixed phrases', note: 'de-uitdrukking' };
  R.zou = R.zou || { name: 'zou for polite requests', note: 'zullen' };
  R.passief = R.passief || { name: 'The passive: worden plus participle', note: 'wordenword · wordt · werd · is geworden' };
  R.indirect = R.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'hij zei dat hij ziek was' };
  R.vergelijk = R.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  R.hoewel = R.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  R.bezit = R.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 122, act: 12, name: 'De Waalbrug', town: 'nijmegen', place: 'eigen', theme: 'street', ...P,
    intro: 'Nijmegen has stood here for two thousand years, and has waited just as long for Maastricht to say sorry.',
    introNl: 'Nijmegen staat hier al tweeduizend jaar en wacht al net zo lang tot Maastricht sorry zegt.',
    mission: {
      where: 'The Waalbrug, long and dark green over the Waal, then up the hill to the Valkhof where the Romans looked at the river before you did, and back down through the student streets. Every July the whole town fills with walkers and gladioli, and the rest of the year it is only a very old city that likes a party.',
      carry: 'An armful of gladioli, a letter that starts with Geachte, the dogs on two leads (they always need a walk) and the grammar book, still never opened. No helmet. The bridge deck does not care.',
      want: 'Since the mist everyone who spoke Dutch changed, and in Nijmegen they changed into the very polite kind. The dead write you formal letters, drop a wel or an eens into every sentence and still split the bill for the gladioli. Paola, still taller than you, wants to know why you keep saying u to the walkers. At the Oversteek the lamps come on one by one every evening, and you ride past quietly.' },
    items: [
      // ---- builds: modal particles
      { en: 'He is probably tired after forty kilometres.', parts: ['Hij zal na veertig kilometer', FK(['wel moe zijn', 'moe wel zijn', 'moe zijn wel'], 0, 'soft',
        'wel sits right behind the first verb, before the rest of the clause: zal wel moe zijn. It makes it probably.'), '.'] },
      { en: 'I have quickly cleaned the walking shoes.', parts: ['Ik heb de wandelschoenen', FK(['even schoongemaakt', 'schoongemaakt even', 'schoon even gemaakt'], 0, 'soft',
        'even goes before the participle that closes the clause, never behind it. schoongemaakt stays one word.'), '.'] },
      { en: 'Come and look, the view from the Valkhof is beautiful.', parts: ['Kom', FK(['eens', 'een'], 0, 'soft',
        'eens turns the order into a friendly invitation: kom eens kijken. een is only the article a.'), 'kijken, het uitzicht vanaf het Valkhof is prachtig.'] },
      { en: "Don't worry, it will work out fine.", parts: ['Maak je', FK(['geen', 'niet'], 0, 'neg',
        'zorgen is a noun, so geen: geen zorgen. niet goes with verbs and adjectives.'), 'zorgen, het komt', FK(['wel goed', 'goed wel'], 0, 'soft',
        'wel comes straight after the verb and turns it into a reassurance: het komt wel goed.'), '.'] },

      // ---- builds: compound nouns
      { en: 'The town hall is in the old centre.', parts: [FK(['Het', 'De'], 0, 'samen',
        'A compound takes the article of its last part: stad + huis, and huis is het, so het stadhuis.'), 'stadhuis staat in het', FK(['oude', 'oud'], 0, 'adj',
        'After het with a definite article the adjective takes -e: het oude centrum.'), 'centrum.'] },
      { en: 'Last year we walked over the Waalbrug to the centre.', parts: ['Vorig jaar', FK(['liepen we', 'we liepen'], 0, 'v2',
        'Vorig jaar takes slot 1, so the verb comes second, then we. lopen is irregular: liepen.'), 'over de', FK(['Waalbrug', 'Waal brug'], 0, 'samen',
        'Dutch writes a compound as one word: Waal + brug = Waalbrug.'), 'naar het centrum.'] },
      { en: 'Parts of the old city wall still stand in the Kronenburgerpark.', parts: ['Delen van de oude', FK(['stadsmuur', 'stadmuur'], 0, 'samen',
        'Many compounds glue their parts with an s: stad + s + muur. Not all of them: it is stadhuis. Learn them one by one.'), 'staan nog in het Kronenburgerpark.'] },

      // ---- builds: formal register
      { en: 'Dear Sir or Madam, I am writing to you about my registration.', parts: [FK(['Geachte', 'Hoogachtend', 'Gegroet'], 0, 'formeel',
        'A formal letter opens with Geachte. Hoogachtend is the way it closes.'), 'heer of mevrouw, ik schrijf', FK(['u', 'je'], 0, 'formeel',
        'To a stranger in a letter the word is u, not je.'), 'over mijn inschrijving.'] },
      { en: 'Thank you for your answer. Yours sincerely, S. Sanchez.', parts: ['Dank u voor', FK(['uw', 'jouw', 'u'], 0, 'formeel',
        'u goes with uw. jouw belongs to jij, and u alone is never a possessive.'), 'antwoord.', FK(['Hoogachtend', 'Geachte'], 0, 'formeel',
        'Hoogachtend closes a formal letter. Geachte opens one.'), ', S. Sanchez.'] },
      { en: 'Could you tell me where the Valkhof is?', parts: [FK(['Zou u', 'Zouden u'], 0, 'zou',
        'u takes the singular verb, like jij: zou u.'), 'mij kunnen vertellen', FK(['waar het Valkhof is', 'waar is het Valkhof'], 0, 'bijzin',
        'A question inside a question becomes a sub-clause, so the verb goes to the end.'), '?'] },

      // ---- builds: idioms
      { en: 'Sorry for barging in, but the dashboard is not working.', parts: ['Sorry dat ik', FK(['met de deur in huis', 'met de deur in het huis', 'met de deur op huis'], 0, 'idioom',
        'Fixed idiom: met de deur in huis vallen means to start without any warm-up. The words do not change.'), 'val, maar het dashboard doet het niet.'] },
      { en: 'What a long day. You can say that again.', parts: ['Wat een lange dag.', FK(['Zeg dat wel', 'Zeg dat goed', 'Zeg het wel'], 0, 'idioom',
        'Fixed reply: zeg dat wel means I agree completely.'), '.'] },

      // ---- builds: the Vierdaagse, the Romans, the town, 1944
      { en: 'The Vierdaagse is walked every year in July.', parts: ['De Vierdaagse', FK(['wordt', 'worden', 'heeft'], 0, 'passief',
        'One Vierdaagse, so wordt. The passive is wordt plus the participle, never heeft.'), 'elk jaar in juli', FK(['gelopen', 'geloopt', 'gelopt'], 0, 'perf',
        'lopen is irregular: gelopen.'), '.'] },
      { en: 'The walkers walk thirty, forty or fifty kilometres a day, depending on their age.', parts: ['De wandelaars lopen elke dag', FK(['dertig', 'dertien'], 0, 'getal',
        'The tens end in -tig: dertig is 30. dertien is 13.'), ', veertig of vijftig kilometer, afhankelijk van', FK(['hun', 'hen', 'zij'], 0, 'bezit',
        'Before a noun the word for their is hun: hun leeftijd.'), 'leeftijd.'] },
      { en: 'Nijmegen says that it is older than Maastricht.', parts: ['Nijmegen zegt', FK(['dat', 'of'], 0, 'indirect',
        'zeggen reports a statement with dat. of belongs to questions.'), 'het', FK(['ouder', 'oudst', 'oud'], 0, 'vergelijk',
        'Comparing two things: ouder dan. oudst is for the top of the list.'), 'is dan Maastricht.'] },
      { en: 'The Romans lived here two thousand years ago.', parts: ['De Romeinen', FK(['woonden', 'woondden', 'woonde'], 0, 'kof',
        'woon ends in n, no ketchup letter, so -d. Plural subject, so -den: woonden.'), 'hier', FK(['tweeduizend', 'tweehonderd', 'tweeduizenden'], 0, 'getal',
        'two thousand is tweeduizend, written as one word.'), 'jaar geleden.'] },
      { en: 'In 1944 the Waal was crossed here in small boats.', parts: ['In 1944', FK(['werd', 'wordt', 'werden'], 0, 'passief',
        'One river and the past, so werd: werd plus the participle.'), 'de Waal hier in kleine bootjes', FK(['overgestoken', 'geoverstoken', 'overgestoke'], 0, 'sep',
        'The ge goes in the middle: over + gestoken, one word at the end. oversteken is irregular.'), '.'] },
      { en: 'Although it is raining, the walkers keep going.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel',
        'hoewel opens a clause with its own verb: hoewel het regent. Ondanks needs a noun.'), 'het regent,', FK(['lopen de wandelaars', 'de wandelaars lopen'], 0, 'v2',
        'After a sub-clause the main clause starts with its verb: lopen de wandelaars.'), 'door.'] },

      // ---- words: the city, the Romans, the walk, the students
      { w: 'the Roman', nl: 'de Romein' }, { w: 'the walker', nl: 'de wandelaar' }, { w: 'the gladiolus', nl: 'de gladiool' },
      { w: 'the hill', nl: 'de heuvel' }, { w: 'the Valkhof (the hilltop park by the river)', nl: 'het Valkhof', wrong: 'de Valkhof' },
      { w: 'the student', nl: 'de student' }, { w: 'the student house', nl: 'het studentenhuis', wrong: 'de studentenhuis' },
      { w: 'the party', nl: 'het feest', wrong: 'de feest' }, { w: 'the blister', nl: 'de blaar' },
      { w: 'the walking shoe', nl: 'de wandelschoen' }, { w: 'the sore muscles', nl: 'de spierpijn' },
      { w: 'the finish', nl: 'de finish' }, { w: 'the crowd, the audience', nl: 'het publiek', wrong: 'de publiek' },
      { w: 'the medal', nl: 'de medaille' }, { w: 'the gate', nl: 'de poort' },
      { w: 'the museum', nl: 'het museum', wrong: 'de museum' }, { w: 'the bill', nl: 'de rekening' },
      { w: 'the terrace', nl: 'het terras' },

      // ---- reads: four traps with their own options, two plain
      { read: true, nl: 'Paola komt wel.', o: ['Paola is coming, no doubt about it.', 'Paola is not coming.', 'Paola is coming as well.'], a: 0, r: 'soft',
        w: 'wel stresses that it will happen. as well would be ook.' },
      { read: true, nl: 'Kom maar binnen, hoor.', o: ['Come on in, no need to hold back.', 'You are not allowed in.', 'Come in later, please.'], a: 0, r: 'soft',
        w: 'maar makes the order a welcome and hoor adds reassurance. Together they mean: go right ahead.' },
      { read: true, nl: 'Nou, dat valt tegen.', o: ['Well, that is disappointing.', 'Well, that is a lovely surprise.', 'Well, that falls over.'], a: 0, r: 'idioom',
        w: 'tegenvallen means to turn out worse than hoped. nou is only the Dutch well.' },
      { read: true, nl: 'Na veertig kilometer loop ik op mijn tandvlees.', o: ['After forty kilometres I am completely exhausted.', 'After forty kilometres my gums hurt.', 'After forty kilometres I walk faster.'], a: 0, r: 'idioom',
        w: 'op zijn tandvlees lopen is a fixed idiom for running on empty. It has nothing to do with teeth.' },
      { read: true, nl: 'In 1944 staken soldaten de Waal over. Dat herdenken ze hier nog elk jaar.', en: 'In 1944 soldiers crossed the Waal. They still remember it here every year.' },
      { read: true, nl: 'De eerste Vierdaagse was in 1909, en elke juli lopen er nu tienduizenden mensen mee.', en: 'The first Vierdaagse was in 1909, and now every July tens of thousands of people walk along.' },

      // ---- listens: a march, a letter ending, the Romans and the flowers, by ear
      { listen: true, nl: 'de Vierdaagse', en: 'the Four Days Marches' }, { listen: true, nl: 'hoogachtend', en: 'yours sincerely' },
      { listen: true, nl: 'de Romeinen', en: 'the Romans' }, { listen: true, nl: 'de gladiolen', en: 'the gladioli' },

      // ---- looks: the bridge, a dog and a lamp on the Waalkade
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'tentamen', art: 'het', en: 'the exam', w: 'het tentamen. The plural is de tentamens, because every plural is de.' },
      { dehet: true, nl: 'bibliotheek', art: 'de', en: 'the library', w: 'Words ending in -theek are de: de bibliotheek.' },
    ] }]);
})();
