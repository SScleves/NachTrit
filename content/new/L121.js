// Nachtrit, Nijmegen (tier 12, B1 to B2): level 121 De mensen. The Grote Markt under the Stevenskerk, a street party in the
// Benedenstad, the student houses up the hill, the Waalkade at the end of the night. Neighbours, housemates, an invitation,
// u or je, the walkers in July, Roze Woensdag, and carnaval, when Nijmegen is called Knotsenburg.
// New at tier 12 and drilled here: the formal and the informal register side by side (Zeg maar je, Hoe maakt u het, u bent van
// harte welkom, Mag ik u voorstellen), modal particles among people (Jij bent toch de nieuwe buurman, Leuk je weer eens te zien,
// Kom maar even binnen, ik ga maar eens in a read), idioms about people (iemand in de maling nemen, met de deur in huis vallen,
// een appeltje te schillen hebben, een oogje in het zeil houden, de oren van het hoofd praten in a read), compound nouns
// (het buurtfeest, de buurtapp, het verjaardagsfeest with its s, de huisgenoten), and the Vierdaagse week (the pink Wednesday).
// Review: V2 after a fronted phrase, the passive with worden and door, the plusquamperfectum after voordat, indirect speech with
// of, die and dat, the adjective -e, an opinion with ik vind dat, 't kofschip, the imperative.
// Still inside the fence: 16 words max, nothing from tier 13.
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar, V2 word order, bijzin - werkwoord naar het einde, die vs
// dat, de vs het; 04 - Phrases & Scenarios/De nieuwe buren ontmoeten, Borrel met vrienden; _site/situations/neighbours (Kan ik u
// ergens mee helpen, Zullen we snel een keer koffie drinken), meeting-people, friends, small-talk; levels 113 and 114 for the
// replayed words (de uitnodiging, de kennismaking, het gezelschap, de grap, de gastheer, de optocht); content/towns.js for
// Nijmegen (de student, het feest, de Romeinen, de Stevenskerk, de wandelaar, the oldest-city rumour).
// New rules: idioom, samen and formeel (guarded, same text in every Nijmegen and Amsterdam file). gebod, passief, indirect,
// mening and plusq are guarded copies of the existing definitions; the rest are in data.js.
// New props: none. Only hond, lamp and deur are used (not kerk: de Stevenskerk is a listen item and would read as a right answer).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was + participle', note: 'perfectum' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 121, act: 12, name: 'De mensen', town: 'nijmegen', place: 'mensen', theme: 'square', ...P,
    intro: 'Nijmegen is friendly to everyone, the dead included. Only about Maastricht you had better not start.',
    introNl: 'Nijmegen is vriendelijk tegen iedereen, de doden ook. Alleen over Maastricht kun je beter niet beginnen.',
    mission: {
      where: 'The Grote Markt under the Stevenskerk, a street party in the Benedenstad, the student houses up the hill and the Waalkade at the end of the night. In July the whole town comes out for the walkers, and on the Wednesday everything turns pink.',
      carry: 'Two dogs on leads, a bunch of gladioli for the neighbours, a round of drinks split to the cent, and the grammar book, still never opened. No helmet. Nobody at the party asks.',
      want: 'Since the mist the dead of Nijmegen are still friendly, maybe friendlier. They ask whether they may say je to you, zeg maar je, they tease you with old sayings, iemand in de maling nemen, met de deur in huis vallen, and they invite you formally to everything: u bent van harte welkom. At carnaval the town is called Knotsenburg and nobody can tell the living from the dead. Paola, still taller than you, knows every neighbour by name. You know their dogs.' },
    items: [
      // ---- builds: u or je
      { en: 'No need for u, just say je.', parts: [FK(['Zeg maar je', 'Zegt maar je'], 0, 'gebod',
        'A command to jij is the bare stem, without -t: zeg maar je. Only with u would it be zegt u.'), ', hoor.'] },
      { en: 'How do you do?', parts: ['Hoe', FK(['maakt u het', 'maak u het'], 0, 'formeel',
        'With u the verb takes -t, also when u comes after it: hoe maakt u het.'), '?'] },
      { en: 'May I introduce you to my wife, Paola?', parts: ['Mag ik', FK(['u', 'uw'], 0, 'formeel',
        'Here you introduce the person, so the object is u. uw would need a noun after it.'), 'voorstellen aan mijn vrouw, Paola?'] },
      { en: 'Dear residents, you are very welcome at our borrel.', parts: ['Geachte buurtbewoners,', FK(['u bent', 'u is'], 0, 'formeel',
        'u takes bent, like jij: u bent. is belongs to hij and zij.'), 'van harte', FK(['welkom', 'welkomen'], 0, 'woord',
        'After zijn the adjective welkom gets no ending: u bent van harte welkom. welkomen is not a Dutch word.'), 'op onze borrel.'] },

      // ---- builds: particles among people
      { en: "You're the new neighbour, aren't you?", parts: ['Jij bent', FK(['toch', 'hoor'], 0, 'soft',
        'toch in a question expects a yes: you are, surely. hoor only closes a statement.'), 'de nieuwe buurman?'] },
      { en: 'Nice to see you again.', parts: ['Leuk je', FK(['weer eens', 'eens weer'], 0, 'soft',
        'The fixed order is weer eens: leuk je weer eens te zien.'), 'te zien.'] },
      { en: 'Just come in for a moment.', parts: ['Kom', FK(['maar even', 'even maar'], 0, 'soft',
        'maar comes before even: kom maar even binnen. The other order is not Dutch.'), 'binnen.'] },

      // ---- builds: idioms about people
      { en: "You're pulling my leg.", parts: ['Je neemt me', FK(['in de maling', 'in de molen', 'op de maling'], 0, 'idioom',
        'iemand in de maling nemen means to tease or fool someone. Only in de maling.'), '.'] },
      { en: 'Sorry to come straight to the point, but may I borrow your ladder?', parts: ['Sorry dat ik', FK(['met de deur in huis val', 'met de deur in het huis val', 'met het raam in huis val'], 0, 'idioom',
        'met de deur in huis vallen means to start without any warm-up. The words of the saying never change.'), ', maar mag ik uw ladder lenen?'] },
      { en: 'I still have a bone to pick with him.', parts: ['Ik heb nog', FK(['een appeltje', 'een peertje', 'een appel'], 0, 'idioom',
        'een appeltje te schillen hebben met iemand means to have something to settle with him. Only the small apple.'), 'met hem te schillen.'] },
      { en: 'Will you keep an eye on things while we are away?', parts: ['Wil jij', FK(['een oogje in het zeil', 'een oogje op het zeil'], 0, 'idioom',
        'een oogje in het zeil houden means to keep an eye on things. It is in het zeil, from the sailing ships.'), 'houden als wij weg zijn?'] },

      // ---- builds: compound nouns
      { en: 'The street party has been in the neighbourhood app for weeks.', parts: [FK(['Het', 'De'], 0, 'samen',
        'buurt + feest: feest is het, so het buurtfeest.'), 'buurtfeest staat al weken in', FK(['de', 'het'], 0, 'samen',
        'buurt + app: app is de, so de buurtapp.'), 'buurtapp.'] },
      { en: "Tomorrow is the neighbour's birthday party.", parts: ['Morgen is het', FK(['verjaardagsfeest', 'verjaardagfeest', 'verjaardagenfeest'], 0, 'samen',
        'verjaardag + s + feest: this compound is glued with an s, like verjaardagstaart.'), 'van de buurvrouw.'] },
      { en: "The neighbours' son lives in student rooms with five housemates.", parts: ['De zoon van de buren woont met vijf', FK(['huisgenoten', 'huisgenooten', 'huizengenoten'], 0, 'samen',
        'de huisgenoot becomes huisgenoten: the first part stays huis, and the open syllable needs only one o.'), 'op kamers.'] },

      // ---- builds: the Vierdaagse week and carnaval
      { en: 'On the Wednesday of the Vierdaagse the whole town turns pink.', parts: ['Op de woensdag van de Vierdaagse', FK(['kleurt de hele stad', 'de hele stad kleurt'], 0, 'v2',
        'The time phrase fills slot 1, so the verb comes second: kleurt de hele stad.'), 'roze.'] },
      { en: 'At carnival Nijmegen is called Knotsenburg.', parts: ['Met carnaval', FK(['heet Nijmegen', 'Nijmegen heet'], 0, 'v2',
        'Met carnaval fills slot 1, so the verb comes second: heet Nijmegen.'), 'Knotsenburg.'] },

      // ---- builds: review of earlier tiers
      { en: 'The old neighbour is helped by the whole street.', parts: ['De oude buurvrouw', FK(['wordt', 'worden'], 0, 'passief',
        'One neighbour, so wordt: wordt geholpen, with door for the helpers.'), 'door de hele straat', FK(['geholpen', 'gehelpt', 'geholpt'], 0, 'perf',
        'helpen is irregular: geholpen.'), '.'] },
      { en: 'Before we came to live here, we had never heard of the Vierdaagse.', parts: ['Voordat we hier kwamen wonen,', FK(['hadden we', 'we hadden'], 0, 'v2',
        'The voordat-clause fills slot 1, so the main clause starts with its verb: hadden we.'), 'nog nooit van de Vierdaagse', FK(['gehoord', 'gehoort', 'gehoren'], 0, 'kof',
        'hoor ends in r, not a ketchup letter, so -d: gehoord.'), '.'] },
      { en: 'The neighbour asked whether we felt like walking along.', parts: ['De buurman vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'we', FK(['zin hadden', 'hadden zin'], 0, 'bijzin',
        'of sends the verb to the end of its clause: zin hadden, then om mee te lopen.'), 'om mee te lopen.'] },
      { en: 'The student who lives above us plays the guitar every night.', parts: ['De student', FK(['die', 'dat'], 0, 'diedat',
        'student is a de-word, so the relative pronoun is die.'), 'boven ons woont, speelt', FK(['elke', 'elk'], 0, 'adj',
        'nacht is a de-word, so elke: elke nacht. elk goes with het-words.'), 'nacht gitaar.'] },
      { en: 'I think the people here are friendlier than in the Randstad.', parts: ['Ik vind', FK(['dat', 'of'], 0, 'mening',
        'ik vind dat opens an opinion. of would turn it into a question.'), 'de mensen hier', FK(['aardiger zijn', 'zijn aardiger'], 0, 'bijzin',
        'dat sends the verb to the end: aardiger zijn, then dan in de Randstad.'), 'dan in de Randstad.'] },

      // ---- words: people, the street, the party, six replayed from Maastricht
      { w: 'the person from Nijmegen', nl: 'de Nijmegenaar' }, { w: 'the local resident', nl: 'de buurtbewoner' },
      { w: 'the street party', nl: 'het buurtfeest', wrong: 'de buurtfeest' }, { w: 'the neighbourhood app group', nl: 'de buurtapp' },
      { w: 'the housemate', nl: 'de huisgenoot' }, { w: 'the birthday party', nl: 'het verjaardagsfeest', wrong: 'de verjaardagsfeest' },
      { w: 'the upstairs neighbour', nl: 'de bovenbuurman' }, { w: 'the mother-in-law', nl: 'de schoonmoeder' },
      { w: 'the piece of gossip', nl: 'de roddel' }, { w: 'the student', nl: 'de student' },
      { w: 'the party', nl: 'het feest', wrong: 'de feest' }, { w: 'the Roman', nl: 'de Romein' },
      { w: 'the invitation', nl: 'de uitnodiging' }, { w: 'the first meeting', nl: 'de kennismaking' },
      { w: 'the company (people around you)', nl: 'het gezelschap', wrong: 'de gezelschap' }, { w: 'the joke', nl: 'de grap' },
      { w: 'the host', nl: 'de gastheer' }, { w: 'the parade', nl: 'de optocht' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Hij praat je de oren van het hoofd.', o: ['He talks your ears off.', 'He pulls your ears.', 'He never listens to you.'], a: 0, r: 'idioom',
        w: 'iemand de oren van het hoofd praten means to talk without stopping. Nobody touches your ears.' },
      { read: true, nl: 'Nou, ik ga maar eens.', o: ['Well, I had better be off.', 'Well, I am going only once.', 'Well, I will go later.'], a: 0, r: 'soft',
        w: 'ik ga maar eens is the soft Dutch way to say it is time to leave. eens does not count anything here.' },
      { read: true, nl: 'U bent van harte uitgenodigd voor de nieuwjaarsborrel.', o: ['You are warmly invited to the New Year drinks.', 'You have invited us to the New Year drinks.', 'You are invited, but not warmly.'], a: 0, r: 'formeel',
        w: 'bent uitgenodigd: you are the one who is invited. van harte means warmly.' },
      { read: true, nl: 'De buurvrouw zei dat ze de Vierdaagse al twintig keer had gelopen.', o: ['The neighbour said she had walked the Vierdaagse twenty times already.', 'The neighbour said she would walk the Vierdaagse twenty times.', 'The neighbour asked whether I had walked the Vierdaagse twenty times.'], a: 0, r: 'plusq',
        w: 'had gelopen is the plusquamperfectum: it was done before she said it. zei dat reports, it does not ask.' },
      { read: true, nl: 'Nijmegenaren zeggen dat hun stad de oudste van Nederland is.', en: 'People from Nijmegen say their city is the oldest in the Netherlands.' },
      { read: true, nl: 'Tijdens de Vierdaagse staan de mensen langs de route en delen ze snoep uit aan de wandelaars.', en: 'During the Vierdaagse people line the route and hand out sweets to the walkers.' },

      // ---- listens: the church, carnaval, a welcome, the neighbours upstairs
      { listen: true, nl: 'de Stevenskerk', en: 'the big church above the Grote Markt' }, { listen: true, nl: 'Knotsenburg', en: 'what Nijmegen is called at carnival' },
      { listen: true, nl: 'van harte welkom', en: 'very welcome' }, { listen: true, nl: 'de bovenburen', en: 'the upstairs neighbours' },

      // ---- looks: the dog, the lamp at the party, the front door
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'praatje', art: 'het', en: 'the chat', w: 'Every -je word is het: het praatje.' },
      { dehet: true, nl: 'gewoonte', art: 'de', en: 'the habit', w: 'Nouns ending in -te like this one are mostly de: de gewoonte.' },
    ] }]);
})();
