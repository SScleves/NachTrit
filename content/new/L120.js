// Nachtrit, Nijmegen (tier 12, B1 to B2): level 120 De sport. The dyke along the Waal into the Ooijpolder, cows on one side and
// barges on the other, then south to the Zevenheuvelenweg towards Groesbeek, the Goffert stadium of NEC, and the training for
// the Vierdaagse that never really stops. Walking, cycling, running, a match, a race in November, being tired in several idioms.
// New at tier 12 and drilled here: modal particles of the coach on the dyke (zet nog even door, doe maar rustig aan, je kunt het
// wel, je gaat toch wel mee), idioms of effort and fatigue (op je tandvlees lopen, de handdoek in de ring gooien, een tandje
// bijzetten, zo fris als een hoentje, de benen uit het lijf lopen and meevallen in the reads), compound nouns (het doelpunt, het
// Goffertstadion and het Goffertpark, de hardloopschoen), the formal register of a race letter (Geachte deelnemer, Neemt u gerust),
// the Vierdaagse (the third day over the seven hills, the start at four in the morning) and the Zevenheuvelenloop in November.
// Review: V2 after a fronted phrase and after a toen-clause, anders with the verb first, the passive with werd, 't kofschip
// (afgelast, gewacht), indirect speech with of and an infinitive after wilde, the comparative zwaarder, om ... te, a modal with
// a separable infinitive.
// Still inside the fence: 16 words max, nothing from tier 13.
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar, scheidbare werkwoorden, V2 word order, 't kofschip;
// _site/words (de spierpijn, wandelen, fietsen); MOC Vrije tijd, H14 In de sportschool; 04 - Phrases & Scenarios/Op de golfbaan;
// _site/situations/office (Valt mee); level 112 for the replayed words (de heuvel, de afdaling, de klim, de blessure, het
// parcours); content/towns.js for Nijmegen (de heuvel, de Vierdaagse, de wandelaar, de gladiool, de Waal).
// New rules: idioom, samen, formeel, datum (guarded, same text in every Nijmegen and Amsterdam file). omte, passief, indirect
// and vergelijk are guarded copies of the existing definitions; the rest are in data.js and levels.js.
// New props: none. Only hond, fiets and boom are used (no word here is a bike or a tree; the polder has no mill in the word pool).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 120, act: 12, name: 'De sport', town: 'nijmegen', place: 'sport', theme: 'dyke', ...P,
    intro: 'Nijmegen trains all year for four days in July. The dead train too. They have more time.',
    introNl: 'Nijmegen traint het hele jaar voor vier dagen in juli. De doden trainen ook. Die hebben meer tijd.',
    mission: {
      where: 'The dyke along the Waal into the Ooijpolder, cows on one side and barges on the other, then south to the Zevenheuvelenweg, seven hills in a row, which is six more than most of the country has. A golf course in the hills towards Groesbeek and the Goffert stadium on the way back.',
      carry: 'Walking shoes, a water bottle, a box of blister plasters, the green fee split to the cent with the neighbours, two dogs on leads and the grammar book, still never opened, as training weight. No helmet. On the way down the seventh hill you will wish you had one.',
      want: 'Since the mist the dead train every day for the Vierdaagse. They have the time. They cheer you on with small words, zet nog even door, doe maar rustig aan, je kunt het wel, and they know every saying about being tired: op je tandvlees lopen, de handdoek in de ring gooien. The forms for the start come in the formal register. Paola, still taller than you, walks the forty kilometres. You walk the thirty and say it was fifty.' },
    items: [
      // ---- builds: particles from the side of the road
      { en: 'Come on, just keep going a bit longer.', parts: ['Kom op,', FK(['zet nog even door', 'zet door nog even'], 0, 'soft',
        'nog even sits in the middle, and the prefix of doorzetten goes to the very end: zet nog even door.'), '.'] },
      { en: 'Just take it easy, it is still a long way.', parts: ['Doe', FK(['maar rustig aan', 'rustig aan maar'], 0, 'soft',
        'maar comes straight after the verb, and aan closes the phrase: doe maar rustig aan.'), ', het is nog ver.'] },
      { en: 'Ten more kilometres. You can do it, really.', parts: ['Nog tien kilometer. Je', FK(['kunt het wel', 'kunt wel het'], 0, 'soft',
        'The small pronoun het comes before wel: je kunt het wel.'), '.'] },
      { en: "You are coming along, aren't you?", parts: ['Je gaat', FK(['toch wel', 'wel toch'], 0, 'soft',
        'toch comes before wel. Together they expect a yes: you are coming, surely.'), 'mee?'] },

      // ---- builds: idioms of effort and fatigue
      { en: 'After forty kilometres I am running on empty.', parts: ['Na veertig kilometer', FK(['loop ik', 'ik loop'], 0, 'v2',
        'Na veertig kilometer fills slot 1, so the verb comes second: loop ik.'), 'op mijn', FK(['tandvlees', 'tanden'], 0, 'idioom',
        'op je tandvlees lopen means to go on with nothing left. The saying is about your gums, not your teeth.'), '.'] },
      { en: 'On the third hill he threw in the towel.', parts: ['Op de derde heuvel gooide hij', FK(['de handdoek in de ring', 'de handdoek op de grond', 'de handdoek in het water'], 0, 'idioom',
        'de handdoek in de ring gooien means to give up, from boxing. Only in de ring.'), '.'] },
      { en: 'We have to step it up, or we will not make the finish.', parts: ['We moeten', FK(['een tandje bijzetten', 'een tandje bijleggen'], 0, 'idioom',
        'een tandje bijzetten means to go a gear faster. bijleggen means to settle a quarrel.'), ', anders', FK(['halen we', 'we halen'], 0, 'v2',
        'anders takes slot 1, so the verb comes right after it: anders halen we.'), 'de finish niet.'] },
      { en: "After a night's sleep I am as fresh as a daisy again.", parts: ['Na een nacht slapen ben ik weer zo fris als', FK(['een hoentje', 'een kippetje'], 0, 'idioom',
        'The saying is zo fris als een hoentje. A hoentje is an old word for a young hen, and only that word works.'), '.'] },

      // ---- builds: compound nouns
      { en: 'The goal came in the last minute.', parts: [FK(['Het', 'De'], 0, 'samen',
        'doel + punt: punt is het, so het doelpunt.'), 'doelpunt viel in de laatste minuut.'] },
      { en: 'NEC plays in the Goffert stadium, on the edge of the Goffert park.', parts: ['NEC speelt in', FK(['het', 'de'], 0, 'samen',
        'The last part decides: het stadion, so het Goffertstadion.'), 'Goffertstadion, aan de rand van', FK(['het', 'de'], 0, 'samen',
        'The last part decides again: het park, so het Goffertpark.'), 'Goffertpark.'] },
      { en: 'For the Zevenheuvelenloop I am buying new running shoes.', parts: ['Voor de Zevenheuvelenloop koop ik nieuwe', FK(['hardloopschoenen', 'hardloopsschoenen', 'hardlopenschoenen'], 0, 'samen',
        'The stem hardloop + schoenen, with nothing in between: hardloopschoenen.'), '.'] },

      // ---- builds: the formal register of the race
      { en: 'Dear participant, would you bring your start card to the start?', parts: ['Geachte deelnemer, wilt u uw startbewijs', FK(['meenemen', 'mee te nemen'], 0, 'modal',
        'After wilt the infinitive goes to the end without te: wilt u ... meenemen.'), 'naar de start?'] },
      { en: 'Do bring a bottle of water.', parts: [FK(['Neemt u', 'Neem u'], 0, 'formeel',
        'With u the verb takes -t, also in a polite command: neemt u.'), 'gerust een flesje water mee.'] },

      // ---- builds: the Vierdaagse and the race in November
      { en: 'The Zevenheuvelenloop is held every year in November.', parts: ['De Zevenheuvelenloop is elk jaar', FK(['in november', 'op november', 'in de november'], 0, 'datum',
        'Months take in and no article: in november.'), '.'] },
      { en: 'On the third day the walkers go over the seven hills to Groesbeek.', parts: ['Op de derde dag', FK(['lopen de wandelaars', 'de wandelaars lopen'], 0, 'v2',
        'Op de derde dag fills slot 1, so the verb comes second: lopen de wandelaars.'), 'over de zeven heuvels naar Groesbeek.'] },
      { en: 'I get up at four to walk the fifty kilometres.', parts: ['Ik sta om vier uur op', FK(['om de vijftig kilometer te lopen', 'om te lopen de vijftig kilometer'], 0, 'omte',
        'om goes first, then everything else, and te plus the verb close it: om de vijftig kilometer te lopen.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday the match was called off because of the rain.', parts: ['De wedstrijd', FK(['werd', 'wordt'], 0, 'passief',
        'gisteren is the past, so werd: werd afgelast.'), 'gisteren door de regen', FK(['afgelast', 'afgelasd', 'geafgelast'], 0, 'kof',
        'las ends in s, a ketchup letter: af + gelast with a t.'), '.'] },
      { en: 'When I got to the finish, Paola had already been waiting for an hour.', parts: ['Toen ik bij de finish kwam,', FK(['had Paola', 'Paola had'], 0, 'v2',
        'After a toen-clause the main clause starts with its verb: had Paola.'), 'al een uur', FK(['gewacht', 'gewachtd', 'gewachten'], 0, 'kof',
        'wacht already ends in t, so nothing is added: gewacht.'), '.'] },
      { en: 'The coach asked whether I wanted to walk the Vierdaagse.', parts: ['De trainer vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'ik de Vierdaagse', FK(['wilde lopen', 'wilde te lopen'], 0, 'modal',
        'After wilde the infinitive comes without te: wilde lopen.'), '.'] },
      { en: 'The seventh hill is harder than the first.', parts: ['De zevende heuvel is', FK(['zwaarder', 'zwaarer', 'meer zwaar'], 0, 'vergelijk',
        'After an r the comparative takes -der: zwaarder.'), 'dan de eerste.'] },

      // ---- words: the dyke, the hills, the race, five replayed from Maastricht
      { w: 'the floodplain along the river', nl: 'de uiterwaard' }, { w: 'the racing cyclist', nl: 'de wielrenner' },
      { w: "the cyclist's water bottle", nl: 'de bidon' }, { w: 'the blister', nl: 'de blaar' },
      { w: 'the sore muscles', nl: 'de spierpijn' }, { w: 'the goal (the score)', nl: 'het doelpunt', wrong: 'de doelpunt' },
      { w: 'the referee', nl: 'de scheidsrechter' }, { w: 'the supporter', nl: 'de supporter' },
      { w: 'the changing room', nl: 'de kleedkamer' }, { w: 'the start card', nl: 'het startbewijs', wrong: 'de startbewijs' },
      { w: 'the running shoe', nl: 'de hardloopschoen' }, { w: 'the junction in the cycle network', nl: 'het knooppunt', wrong: 'de knooppunt' },
      { w: 'the hill', nl: 'de heuvel' }, { w: 'the descent', nl: 'de afdaling' },
      { w: 'the climb', nl: 'de klim' }, { w: 'the injury', nl: 'de blessure' },
      { w: 'the course of a race', nl: 'het parcours', wrong: 'de parcours' }, { w: 'the finish', nl: 'de finish' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'We liepen ons de benen uit het lijf.', o: ['We walked ourselves off our feet.', 'Our legs fell off on the way.', 'We walked very slowly.'], a: 0, r: 'idioom',
        w: 'zich de benen uit het lijf lopen is a fixed phrase for walking or running yourself into the ground. The legs stay on.' },
      { read: true, nl: 'Rustig aan, hoor. Het is geen wedstrijd.', o: ['Take it easy, it is not a race.', 'Hurry up, it is a race.', 'Listen, the race is quiet.'], a: 0, r: 'soft',
        w: 'rustig aan means slow down, and hoor makes it friendly. It has nothing to do with listening.' },
      { read: true, nl: 'Deelnemers worden verzocht hun startbewijs zichtbaar te dragen.', o: ['Participants are asked to wear their start card where it can be seen.', 'Participants are asked to hide their start card.', 'Participants have to hand in their start card at the end.'], a: 0, r: 'formeel',
        w: 'worden verzocht is the formal passive for are asked, and zichtbaar means visible.' },
      { read: true, nl: 'Die heuvels vallen best mee.', o: ['Those hills are not as bad as I feared.', 'Those hills are falling down.', 'Those hills are even worse than I feared.'], a: 0, r: 'idioom',
        w: 'meevallen means to turn out better than feared, and best makes it stronger. Worse would be tegenvallen.' },
      { read: true, nl: 'De Zevenheuvelenweg heeft zeven heuvels, en dat is veel voor Nederland.', en: 'The Zevenheuvelenweg has seven hills, and that is a lot for the Netherlands.' },
      { read: true, nl: 'In de Ooijpolder fiets je over de dijk, met koeien aan de ene kant en schepen aan de andere.', en: 'In the Ooijpolder you cycle along the dyke, with cows on one side and ships on the other.' },

      // ---- listens: a race, a polder, a stadium, a distance
      { listen: true, nl: 'de Zevenheuvelenloop', en: 'the seven hills road race' }, { listen: true, nl: 'de Ooijpolder', en: 'the polder along the Waal east of the city' },
      { listen: true, nl: 'de Goffert', en: 'the park and the stadium of NEC' }, { listen: true, nl: 'veertig kilometer', en: '40 kilometres' },

      // ---- looks: the dog, the bike on the dyke, a tree in the polder
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },

      // ---- de of het
      { dehet: true, nl: 'zwembad', art: 'het', en: 'the swimming pool', w: 'The last part decides: het bad, so het zwembad.' },
      { dehet: true, nl: 'eindsprint', art: 'de', en: 'the final sprint', w: 'The last part decides: de sprint, so de eindsprint.' },
    ] }]);
})();
