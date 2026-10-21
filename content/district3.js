// Nachtrit, district 3: Het dorp (levels 11 to 15). A1 to A2, sentences of 8 words max.
// Sources: dutch-lessons vault, 03 - Verbs (hebben, zijn, gaan, komen, doen, wonen, werken, moeten, mogen,
// kunnen, willen), 02 - Grammar (presens, V2 word order, niet vs geen, modale werkwoorden),
// _site/situations (directions, meeting-people, small-talk), MOC Vraagwoorden, MOC Ontkenning.
//
// New rules: presens (present tense endings), vraag (question words). Added to window.RULES below.
// New props: none. Only kerk, boom, huis, deur, lamp, hond, winkel, fiets, molen, brug, water are used.
//
// Note for the engine: the four reading forks in level 15 carry their own o / a / r / w (the moet niet /
// mag niet trap). itemToEntry in index.html ignores o on read items today and picks distractors from the
// other read items of the level. The four were written so that either way the wrong lanes are the trap.

window.RULES.presens = { name: 'Present tense endings', note: 'presens' };
window.RULES.vraag = { name: 'Question words', note: 'MOC Vraagwoorden' };

(function () {
  const D3 = { lanes: 3, speed: 13, maxSpeed: 16, ramp: false, lampDecay: 0.55, forkSlow: 0.35, hint: null, obstacles: 'light', filler: [28, 40], deliveries: 10, cefr: 'A2', maxWords: 8 };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    // ---------------------------------------------------------------- 11
    { id: 11, act: 3, name: 'Werkwoorden', theme: 'square', ...D3,
      intro: 'The grammar book was never opened. Tonight it opens itself, at the verb tables.',
      introNl: 'Het grammaticaboek is nooit opengeslagen. Vannacht slaat het zichzelf open, bij de werkwoorden.',
      mission: { where: 'The village square, laps around the church.', carry: 'One page torn out of the grammar book: ik werk, jij werkt, wij werken.', want: 'Every ghost says who it is. You give it the verb that fits, or the lamp goes.' },
      items: [
        { en: 'I work from home today.', parts: ['Ik', FK(['werk', 'werkt', 'werken'], 0, 'presens', 'ik takes the bare stem: werk.'), 'vandaag thuis.'] },
        { en: 'My wife works from home tomorrow.', parts: ['Mijn vrouw', FK(['werkt', 'werk', 'werken'], 0, 'presens', 'mijn vrouw is a zij, so stem plus t: werkt.'), 'morgen thuis.'] },
        { en: 'I have two dogs.', parts: ['Ik', FK(['heb', 'hebt', 'heeft'], 0, 'presens', 'ik heb. hebben is irregular, learn the forms as a set.'), 'twee honden.'] },
        { en: 'You have a meeting.', parts: ['Jij', FK(['hebt', 'heeft', 'heb'], 0, 'presens', 'jij hebt. heeft is only for hij, zij and het.'), 'een vergadering.'] },
        { en: 'He has a bike.', parts: ['Hij', FK(['heeft', 'hebt', 'heb'], 0, 'presens', 'hij heeft. The odd one out of hebben.'), 'een fiets.'] },
        { en: 'We live next door.', parts: ['Wij', FK(['wonen', 'woont', 'woon'], 0, 'presens', 'Every plural takes the infinitive: wij wonen.'), 'hiernaast.'] },
        { en: 'I live in Alblasserdam and work from home.', parts: ['Ik', FK(['woon', 'wonen', 'woont'], 0, 'presens', 'ik takes the stem: woon, with a double o to keep it long.'), 'in Alblasserdam en',
          FK(['werk', 'werkt', 'werken'], 0, 'presens', 'Still ik, so still the bare stem: werk.'), 'thuis.'] },
        { en: 'Are you working tomorrow?', parts: [FK(['Werk jij', 'Werkt jij', 'Jij werk'], 0, 'presens', 'jij drops the t when it comes after the verb: werk jij?'), 'morgen?'] },
        { en: 'My wife does the shopping.', parts: ['Mijn vrouw', FK(['doet', 'doe', 'doen'], 0, 'presens', 'One person, not ik: stem doe plus t.'), 'de boodschappen.'] },
        { en: 'He is coming today, we are coming tomorrow.', parts: ['Hij', FK(['komt', 'kom', 'komen'], 0, 'presens', 'hij komt: stem plus t.'), 'vandaag, wij',
          FK(['komen', 'komt', 'kom'], 0, 'presens', 'wij is plural: komen.'), 'morgen.'] },
        { en: 'You all are going to the church.', parts: ['Jullie', FK(['gaan', 'gaat', 'ga'], 0, 'presens', 'jullie is plural, so the infinitive: gaan.'), 'naar de kerk.'] },
        { en: 'The dashboard is working again.', parts: ['Het dashboard', FK(['werkt', 'werken', 'werk'], 0, 'presens', 'het dashboard is one thing, a het: stem plus t.'), 'weer.'] },
        { w: 'to work', nl: 'werken' }, { w: 'to live (in a place)', nl: 'wonen' }, { w: 'to come', nl: 'komen' },
        { w: 'to do', nl: 'doen' }, { w: 'to go', nl: 'gaan' }, { w: 'to have', nl: 'hebben' },
        { w: 'the meeting', nl: 'de vergadering' }, { w: 'today', nl: 'vandaag' }, { w: 'tomorrow', nl: 'morgen' },
        { read: true, nl: 'Ik heb het druk.', en: "I'm busy." },
        { read: true, nl: 'Ik kom eraan.', en: "I'm coming." },
        { read: true, nl: 'Doe maar.', en: 'Go ahead.' },
        { read: true, nl: 'Hoe gaat het?', en: 'How are you?' },
        { listen: true, nl: 'jij werkt', en: 'you work' }, { listen: true, nl: 'wij wonen', en: 'we live' }, { listen: true, nl: 'hij heeft', en: 'he has' },
        { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
      ] },

    // ---------------------------------------------------------------- 12
    { id: 12, act: 3, name: 'De weg kwijt', theme: 'street', ...D3,
      intro: 'Every signpost in the village points at the church now. The dead know the way. You have to ask them properly.',
      introNl: 'Alle wegwijzers in het dorp wijzen nu naar de kerk. De doden weten de weg. Je moet het ze wel netjes vragen.',
      mission: { where: 'The back streets behind the church. Every one of them leads back to it.', carry: 'A map of the village with your house circled. The streets have moved since.', want: 'They give directions, but only to a real question. Question word, verb, then you.' },
      items: [
        { en: 'Where do you live?', parts: ['Waar', FK(['woon jij', 'woont jij', 'jij woont'], 0, 'v2', 'In a question the verb comes before the subject, and jij drops the t: woon jij.'), '?'] },
        { en: 'How do I get to the church?', parts: ['Hoe', FK(['kom ik', 'ik kom', 'komt ik'], 0, 'v2', 'Question word in slot 1, verb in slot 2, then ik.'), 'bij de kerk?'] },
        { en: 'Take the second street on the right.', parts: ['Neem de', FK(['tweede', 'twee'], 0, 'getal', 'The second one is tweede. twee is just two.'), 'straat rechts.'] },
        { en: 'What are you doing?', parts: ['Wat', FK(['doe jij', 'doet jij', 'jij doet'], 0, 'v2', 'Verb before jij, and the t goes: wat doe jij.'), '?'] },
        { en: 'When are you coming?', parts: [FK(['Wanneer', 'Waarom', 'Wie'], 0, 'vraag', 'wanneer asks when. waarom asks why.'), FK(['kom jij', 'komt jij'], 0, 'presens', 'jij after the verb: no t.'), '?'] },
        { en: 'Why are you going home?', parts: [FK(['Waarom', 'Wanneer', 'Waar'], 0, 'vraag', 'waarom asks why.'), FK(['ga jij', 'gaat jij', 'jij gaat'], 0, 'v2', 'Question word, verb, subject. No t after the verb.'), 'naar huis?'] },
        { en: 'How are the dogs?', parts: ['Hoe', FK(['gaat het', 'het gaat', 'gaan het'], 0, 'v2', 'Hoe takes slot 1, so the verb comes next: gaat het.'), 'met de honden?'] },
        { en: "Excuse me, I'm lost.", parts: ['Pardon, ik', FK(['ben', 'heb'], 0, 'zijn', 'The phrase is built on zijn: ik ben de weg kwijt.'), 'de weg kwijt.'] },
        { en: 'Who lives here?', parts: [FK(['Wie', 'Wat', 'Waar'], 0, 'vraag', 'wie asks for a person.'), FK(['woont', 'woon', 'wonen'], 0, 'presens', 'wie counts as one person: stem plus t.'), 'hier?'] },
        { en: 'Where is the toilet?', parts: ['Waar is', FK(['het', 'de'], 0, 'dehet', 'toilet is a het-word.'), 'toilet?'] },
        { w: 'left', nl: 'links' }, { w: 'right', nl: 'rechts' }, { w: 'straight on', nl: 'rechtdoor' },
        { w: 'the traffic light', nl: 'het stoplicht' }, { w: 'the map', nl: 'de plattegrond' },
        { w: 'where', nl: 'waar' }, { w: 'who', nl: 'wie' }, { w: 'why', nl: 'waarom' }, { w: 'how', nl: 'hoe' },
        { w: 'to come', nl: 'komen' }, { w: 'tonight', nl: 'vanavond' },
        { read: true, nl: 'Het is hier vlakbij.', en: "It's close by." },
        { read: true, nl: 'Ga hier rechtdoor.', en: 'Go straight on here.' },
        { read: true, nl: 'Bij de kerk ga je rechtsaf.', en: 'Turn right at the church.' },
        { read: true, nl: 'Hoe kom ik bij de Albert Heijn?', en: 'How do I get to the Albert Heijn?' },
        { listen: true, nl: 'wanneer', en: 'when' }, { listen: true, nl: 'linksaf', en: 'turn left' },
        { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
      ] },

    // ---------------------------------------------------------------- 13
    { id: 13, act: 3, name: 'Nieuwe mensen', theme: 'square', ...D3,
      intro: 'Three survivors in the church. They want to know who you are. Then they want to split the bill.',
      introNl: 'Drie overlevenden in de kerk. Ze willen weten wie je bent. Daarna willen ze de rekening delen.',
      mission: { where: 'The church. Three survivors in the front pew, one dog under it.', carry: 'Your name, your age and where you come from. That is all you have left.', want: 'A proper introduction. Say it in the right order or they stop trusting you.' },
      items: [
        { en: "I'm from Spain.", parts: ['Ik kom', FK(['uit', 'van'], 0, 'woord', 'Where you are from is komen uit.'), 'Spanje.'] },
        { en: 'We have lived here for two years.', parts: ['We', FK(['wonen', 'woont', 'woon'], 0, 'al', 'Still living here, so Dutch uses the present with al. Plural: wonen.'), 'hier al twee jaar.'] },
        { en: 'I am thirty years old.', parts: ['Ik', FK(['ben', 'heb'], 0, 'zijn', 'Age takes zijn: ik ben dertig. Spanish says tengo, Dutch does not.'), 'dertig jaar oud.'] },
        { en: 'How old are you?', parts: ['Hoe oud', FK(['ben jij', 'bent jij', 'jij bent'], 0, 'v2', 'Verb before jij, and the t drops: ben jij.'), '?'] },
        { en: "Tomorrow I'm going to the church.", parts: ['Morgen', FK(['ga ik', 'ik ga'], 0, 'v2', 'Morgen takes slot 1, so the verb comes second: ga ik.'), 'naar de kerk.'] },
        { en: "Today I'm working from home.", parts: ['Vandaag', FK(['werk ik', 'ik werk', 'werkt ik'], 0, 'v2', 'Vandaag first, then the verb, then ik.'), 'thuis.'] },
        { en: "Tonight we're going to a borrel.", parts: ['Vanavond', FK(['gaan we', 'we gaan', 'gaat we'], 0, 'v2', 'A time word in slot 1 pushes we behind the verb.'), 'naar een borrel.'] },
        { en: 'Where are you from?', parts: ['Waar', FK(['kom jij', 'komt jij', 'jij komt'], 0, 'v2', 'Question word, verb, then jij without its t.'), 'vandaan?'] },
        { en: 'I work at Dynatrace.', parts: ['Ik werk', FK(['bij', 'op'], 0, 'woord', 'You work at a company: werken bij.'), 'Dynatrace.'] },
        { en: 'Now I live in Alblasserdam.', parts: ['Nu', FK(['woon ik', 'ik woon'], 0, 'v2', 'Nu takes slot 1: the verb next, then ik.'), 'in Alblasserdam.'] },
        { en: 'Do you have pets?', parts: [FK(['Heb jij', 'Hebt jij', 'Jij heb'], 0, 'v2', 'A yes or no question starts with the verb, and jij drops the t.'), 'huisdieren?'] },
        { en: 'On Saturday I play golf.', parts: ['Zaterdag', FK(['speel ik', 'ik speel'], 0, 'v2', 'Zaterdag in slot 1, so the verb jumps ahead of ik.'), 'golf.'] },
        { w: 'the name', nl: 'de naam' }, { w: 'the age', nl: 'de leeftijd' }, { w: 'the neighbour (man)', nl: 'de buurman' },
        { w: 'the neighbour (woman)', nl: 'de buurvrouw' }, { w: 'the survivor', nl: 'de overlevende' }, { w: 'the year', nl: 'het jaar' },
        { w: 'where', nl: 'waar' }, { w: 'to live (in a place)', nl: 'wonen' },
        { read: true, nl: 'Hoe heet je?', en: "What's your name?" },
        { read: true, nl: 'Met wie woon je samen?', en: 'Who do you live with?' },
        { read: true, nl: 'Wat voor werk doe je?', en: 'What work do you do?' },
        { read: true, nl: 'Heb je kinderen?', en: 'Do you have children?' },
        { listen: true, nl: 'dertig', en: '30' }, { listen: true, nl: 'vijfenveertig', en: '45' }, { listen: true, nl: 'aangenaam', en: 'pleased to meet you' },
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
      ] },

    // ---------------------------------------------------------------- 14
    { id: 14, act: 3, name: 'Niet of geen', theme: 'shops', ...D3,
      intro: "The survivors want things you don't have. No time, no milk, no helmet.",
      introNl: 'De overlevenden willen dingen die jij niet hebt. Geen tijd, geen melk, geen helm.',
      mission: { where: 'The shopping street. Every shop is open and nothing is for sale.', carry: 'An empty bag and a long list of excuses.', want: 'They ask, you say no. geen for a thing, niet for the rest. Pick the wrong no and they keep asking.' },
      items: [
        { en: 'I have no time.', parts: ['Ik heb', FK(['geen', 'niet'], 0, 'neg', 'geen kills a noun with een or no article: geen tijd.'), 'tijd.'] },
        { en: "It's not expensive.", parts: ['Het is', FK(['niet', 'geen'], 0, 'neg', 'duur is an adjective, so niet.'), 'duur.'] },
        { en: "I'm not going to the office.", parts: ['Ik ga', FK(['niet naar kantoor', 'naar kantoor niet', 'geen naar kantoor'], 0, 'neg', 'niet goes before the place.'), '.'] },
        { en: 'I have no blockers.', parts: ['Ik heb', FK(['geen', 'niet'], 0, 'neg', 'A plural without an article takes geen.'), 'blockers.'] },
        { en: "The dashboard doesn't work yet.", parts: ['Het dashboard werkt', FK(['nog niet', 'niet nog', 'nog geen'], 0, 'neg', 'Not yet is nog niet, in that order.'), '.'] },
        { en: "I don't play golf on Monday.", parts: ['Maandag', FK(['golf ik', 'ik golf'], 0, 'v2', 'Maandag in slot 1, so the verb comes before ik.'),
          FK(['niet', 'geen'], 0, 'neg', 'golf is the verb here, so niet, at the end.'), '.'] },
        { en: 'There is no milk.', parts: ['Er is', FK(['geen', 'niet'], 0, 'neg', 'melk with no article: geen.'), 'melk.'] },
        { en: "I don't have a bike.", parts: ['Ik heb', FK(['geen', 'niet'], 0, 'neg', 'een fiets becomes geen fiets.'), 'fiets.'] },
        { en: "I don't have the key.", parts: ['Ik heb', FK(['de sleutel niet', 'geen de sleutel', 'de sleutel geen'], 0, 'neg', 'With de or het the noun stays, and niet comes after it.'), '.'] },
        { en: 'Nobody is home.', parts: ['Er is', FK(['niemand', 'geen niemand', 'niet niemand'], 0, 'neg', 'One negative is enough: niemand.'), 'thuis.'] },
        { en: 'I have nothing.', parts: ['Ik heb', FK(['niets', 'niet niets', 'geen niets'], 0, 'neg', 'Dutch uses one negative. No tengo nada becomes ik heb niets.'), '.'] },
        { en: 'The dogs are not tired.', parts: ['De honden zijn', FK(['niet', 'geen'], 0, 'neg', 'moe is an adjective: niet.'), 'moe.'] },
        { w: 'nothing', nl: 'niets' }, { w: 'the key', nl: 'de sleutel' }, { w: 'the time', nl: 'de tijd' },
        { w: 'the problem', nl: 'het probleem' }, { w: 'the bag', nl: 'de tas' },
        { w: 'the name', nl: 'de naam' }, { w: 'the neighbour (man)', nl: 'de buurman' }, { w: 'why', nl: 'waarom' },
        { read: true, nl: 'Ik heb niets gezien.', en: "I didn't see anything." },
        { read: true, nl: 'Geen probleem.', en: 'No problem.' },
        { read: true, nl: 'Nee, nog niet.', en: 'No, not yet.' },
        { read: true, nl: 'Daar ben ik nog nooit geweest.', en: "I've never been there." },
        { listen: true, nl: 'niemand', en: 'nobody' }, { listen: true, nl: 'nooit', en: 'never' },
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      ] },

    // ---------------------------------------------------------------- 15
    { id: 15, act: 3, name: 'Mag ik?', theme: 'dyke', ...D3,
      intro: 'A keeper stands at the gate out of the village. He only opens for a polite question. Mag ik, never ik wil.',
      introNl: 'Bij het hek uit het dorp staat een wachter. Hij doet alleen open voor een nette vraag. Mag ik, nooit ik wil.',
      mission: { where: 'The dyke road out of the village, all the way to the gate.', carry: "The neighbours' ladder. Borrowed in spring, never returned.", want: 'Permission. Modal first, the verb at the end, and never mix up mag niet and moet niet.' },
      items: [
        { en: 'Can I borrow your ladder?', parts: [FK(['Mag', 'Mogen'], 0, 'modal', 'ik mag. Only plurals take mogen.'), 'ik jullie ladder even',
          FK(['lenen', 'te lenen', 'leen'], 0, 'modal', 'The infinitive goes to the end, with no te.'), '?'] },
        { en: 'Can I pay by card?', parts: [FK(['Kan', 'Kunnen'], 0, 'modal', 'ik kan. Only plurals take kunnen.'), 'ik',
          FK(['pinnen', 'te pinnen', 'pin'], 0, 'modal', 'After kan comes the bare infinitive: pinnen.'), '?'] },
        { en: 'I still have to walk the dogs.', parts: ['Ik', FK(['moet', 'moeten'], 0, 'modal', 'ik moet. The modal agrees with ik.'), 'de honden nog',
          FK(['uitlaten', 'laat uit', 'te uitlaten'], 0, 'modal', 'After a modal the verb stays whole at the end: uitlaten.'), '.'] },
        { en: 'Could you repeat that?', parts: ['Zou je dat', FK(['kunnen herhalen', 'herhalen kunnen', 'kunnen te herhalen'], 0, 'modal', 'Two verbs at the end: kunnen first, then herhalen. Never te.'), '?'] },
        { en: 'Can you share your screen?', parts: ['Kun je je scherm even', FK(['delen', 'te delen', 'deelt'], 0, 'modal', 'After a modal: infinitive at the end, no te.'), '?'] },
        { en: 'May I ask you something?', parts: [FK(['Mag', 'Mogen'], 0, 'modal', 'ik mag, never ik mogen.'), 'ik u iets',
          FK(['vragen', 'vraag', 'te vragen'], 0, 'modal', 'vragen goes to the end as an infinitive.'), '?'] },
        { en: "I'd like to order a beer.", parts: ['Ik', FK(['wil', 'wilt', 'willen'], 0, 'modal', 'ik wil. No t for ik.'), 'graag een biertje',
          FK(['bestellen', 'bestel', 'te bestellen'], 0, 'modal', 'The infinitive closes the sentence: bestellen.'), '.'] },
        { en: 'We have to cross the bridge.', parts: ['We', FK(['moeten', 'moet'], 0, 'modal', 'we takes the plural: moeten.'), 'de brug',
          FK(['oversteken', 'steken over', 'over te steken'], 0, 'modal', 'After a modal the verb stays in one piece at the end: oversteken.'), '.'] },
        { en: "The dogs aren't allowed on the couch.", parts: ['De honden', FK(['mogen', 'mag'], 0, 'modal', 'Two dogs, so the plural: mogen.'), 'niet op de bank.'] },
        { en: "I can't do Friday.", parts: ['Vrijdag', FK(['kan ik', 'ik kan', 'kunnen ik'], 0, 'v2', 'Vrijdag in slot 1: the modal comes next, then ik.'), 'niet.'] },
        { en: 'Can you open the gate?', parts: ['Kun je het hek', FK(['opendoen', 'doet open', 'open te doen'], 0, 'modal', 'After a modal the verb goes whole to the end: opendoen.'), '?'] },
        { w: 'the gate', nl: 'het hek' }, { w: 'the ladder', nl: 'de ladder' }, { w: 'the couch', nl: 'de bank' },
        { w: 'may, to be allowed to', nl: 'mogen' }, { w: 'must, to have to', nl: 'moeten' }, { w: 'can, to be able to', nl: 'kunnen' }, { w: 'to want', nl: 'willen' },
        { w: 'the key', nl: 'de sleutel' }, { w: 'nothing', nl: 'niets' }, { w: 'the age', nl: 'de leeftijd' },
        // the moet niet / mag niet trap: English "must not" is mag niet; "don't have to" is hoeft niet te
        { read: true, nl: 'Je mag hier niet fietsen.', en: "You're not allowed to cycle here.",
          o: ["You're not allowed to cycle here.", "You don't have to cycle here.", 'You have to cycle here.'], a: 0, r: 'mag', w: 'mag niet means forbidden. English must not is mag niet in Dutch.' },
        { read: true, nl: 'Je hoeft hier niet te fietsen.', en: "You don't have to cycle here.",
          o: ["You don't have to cycle here.", "You're not allowed to cycle here.", 'You have to cycle here.'], a: 0, r: 'mag', w: "Don't have to is hoeft niet te. It is not mag niet." },
        { read: true, nl: 'Je moet hier fietsen.', en: 'You have to cycle here.',
          o: ['You have to cycle here.', "You're not allowed to cycle here.", "You don't have to cycle here."], a: 0, r: 'mag', w: 'moet without niet is plain must: you have to.' },
        { read: true, nl: 'Je moet niet zo hard fietsen.', en: "You shouldn't cycle so fast.",
          o: ["You shouldn't cycle so fast.", "You don't have to cycle so fast.", 'You have to cycle so fast.'], a: 0, r: 'mag', w: "moet niet is advice: you shouldn't. Don't have to is hoeft niet." },
        { listen: true, nl: 'de dijk', en: 'the dyke' }, { listen: true, nl: 'oversteken', en: 'to cross' },
        { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      ] },
  ]);
})();
