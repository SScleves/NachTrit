// Nachtrit, Den Haag (tier 6, A2+): level 73 De mensen. The borrel near the Plein, the neighbours, small talk, feelings and
// opinions, and the politicians who are somebody or work for somebody. Everything told afterwards, in the perfectum.
// Fence: tier 5 plus the perfectum with hebben and zijn, regular participles with 't kofschip (gepraat, gekletst, bedankt,
// gefeliciteerd, gehuild, geglimlacht), irregular participles (geweest, gegaan, gegeten, gevonden, ontmoet), separable
// participles (uitgenodigd, afgesproken, langsgekomen). 10 words max. No imperfectum, no sub-clauses, no passive.
// Sources: dutch-lessons vault: _site/situations/neighbours (Druk geweest op het werk?), friends (Wat leuk je te zien,
// We moeten snel weer afspreken), small-talk (Zullen we snel een keer koffie drinken?), opinions (Volgens mij, Hoe vind je),
// meeting-people (aangenaam, tot straks), _site/words (de buurman, de buurvrouw, de vriendin, de collega, het feest,
// de verjaardag, het cadeautje, de mening, de groeten, het verdriet, de achternaam, het gebaar), MOC Gevoel & uitdrukkingen
// (jarig, gefeliciteerd, proosten), 02 - Grammar/perfectum (be- and ont- take no ge, zijn of hebben), 't kofschip,
// scheidbare werkwoorden, and content/towns.js for Den Haag (de minister, het debat, het Torentje on the Hofvijver,
// the politicians gone from the Binnenhof and nobody noticing the difference, Dat is geen antwoord op mijn vraag).
// New rules: none. objpron is declared below only if missing; aux, kof, perf, sep, v2, mag and woord already exist.
// New props: none. Only deur, tuin and hond are used.
(() => {
  window.RULES.objpron = window.RULES.objpron || { name: 'Object pronouns: me, je, hem, haar, ons, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 73, act: 6, name: 'De mensen', town: 'denhaag', place: 'mensen', theme: 'street', ...P,
    intro: 'Since the mist everyone at a Haagse borrel is somebody, or works for somebody. The dead fit right in, and they still split the bill.',
    introNl: 'Sinds de mist is iedereen op een Haagse borrel iemand, of werkt voor iemand. De doden vallen niet op, en ze delen de rekening nog steeds.',
    mission: {
      where: 'A borrel in a cafe near the Plein, the terraces of the neighbours on the way home, and a long walk past the Hofvijver where the Torentje stares back at you.',
      carry: 'A bottle of wine for the host, flowers for the neighbour, two dogs who need a walk, and a phone with forty unanswered WhatsApp messages. No helmet. The grammar book is in your bag, still shut.',
      want: 'The dead make small talk and want to know what happened: who you met, who you called, what you thought of the debate. Answer in the past: heb or ben in second place, the participle at the very end. The women at the borrel are still taller than you, and the politicians still do not answer the question.' },
    items: [
      // ---- words: people, the borrel, feelings, the Haagse politicians
      { w: 'the neighbour (a man)', nl: 'de buurman' },
      { w: 'the neighbour (a woman)', nl: 'de buurvrouw' },
      { w: 'the friend (a woman)', nl: 'de vriendin' },
      { w: 'the colleague', nl: 'de collega' },
      { w: 'the party', nl: 'het feest', wrong: 'de feest' },
      { w: 'the borrel (Friday drinks)', nl: 'de borrel' },
      { w: 'the birthday', nl: 'de verjaardag' },
      { w: 'the little gift', nl: 'het cadeautje' },
      { w: 'the invitation', nl: 'de uitnodiging' },
      { w: 'the conversation', nl: 'het gesprek', wrong: 'de gesprek' },
      { w: 'the opinion', nl: 'de mening' },
      { w: 'the joke', nl: 'de grap' },
      { w: 'the mood', nl: 'het humeur', wrong: 'de humeur' },
      { w: 'the compliment', nl: 'het compliment' },
      { w: 'the surname', nl: 'de achternaam' },
      { w: 'the sorrow', nl: 'het verdriet' },
      { w: 'the greetings (as in: say hi to Paola)', nl: 'de groeten' },
      { w: 'the secret', nl: 'het geheim', wrong: 'de geheim' },
      { w: 'the visit', nl: 'het bezoek', wrong: 'de bezoek' },
      { w: 'the politician', nl: 'de politicus' },
      { w: 'the minister', nl: 'de minister' },
      { w: 'the debate', nl: 'het debat' },

      // ---- builds: hebben or zijn, then the participle at the end
      { en: 'Yesterday I met the new neighbour.', parts: ['Gisteren', FK(['heb ik', 'ik heb', 'heeft ik'], 0, 'v2',
        'Gisteren fills slot 1, so the verb comes next and ik after it: heb ik.'), 'de nieuwe buurvrouw',
        FK(['ontmoet', 'geontmoet', 'ontmoeten'], 0, 'perf', 'ont- is an inseparable start, so no ge goes in front: ontmoet.'), '.'] },
      { en: 'On Saturday we were at the neighbours.', parts: ['Zaterdag', FK(['zijn we', 'hebben we'], 0, 'aux',
        'zijn itself takes zijn in the perfectum: ik ben geweest. Zaterdag in slot 1 puts we behind the verb.'), 'bij de buren',
        FK(['geweest', 'gezijn', 'gewees'], 0, 'perf', 'zijn is irregular: geweest.'), '.'] },
      { en: 'Paola invited the neighbours for a borrel.', parts: ['Paola heeft de buren voor een borrel',
        FK(['uitgenodigd', 'geuitnodigd', 'uitgenodigt'], 0, 'sep', 'uitnodigen is separable, so ge goes in the middle. The stem nodig ends in g, not a soft ketchup letter, so -d: uitgenodigd.'), '.'] },
      { en: 'We arranged a borrel for Friday.', parts: ['We hebben vrijdag een borrel',
        FK(['afgesproken', 'geafspreken', 'afgesprekt'], 0, 'sep', 'afspreken is separable, so ge goes between af and spreken, and spreken is irregular: afgesproken.'), '.'] },
      { en: 'We talked with the neighbours for a long time.', parts: ['Wij hebben lang met de buren',
        FK(['gepraat', 'gepraatd', 'gepraten'], 0, 'kof', 'The stem praat already ends in t, so nothing is added: gepraat.'), '.'] },
      { en: 'Paola chatted with the neighbour for an hour.', parts: ['Paola heeft een uur met de buurvrouw',
        FK(['gekletst', 'gekletsd', 'gekletsen'], 0, 'kof', 'The stem klets ends in s, a soft ketchup letter, so -t: gekletst.'), '.'] },
      { en: 'I thanked her for the flowers.', parts: ['Ik heb', FK(['haar', 'zij'], 0, 'objpron',
        'She is the one being thanked, so haar. zij is only for the one doing the thanking.'), 'voor de bloemen',
        FK(['bedankt', 'gebedankt', 'bedankd'], 0, 'kof', 'be- is an inseparable start, so no ge. The stem bedank ends in k, so -t: bedankt.'), '.'] },
      { en: 'I congratulated my colleague on his birthday.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux',
        'Congratulating is something you do, not a trip: hebben.'), 'mijn collega met zijn verjaardag',
        FK(['gefeliciteerd', 'gefeliciteert', 'feliciteerd'], 0, 'kof', 'The stem feliciteer ends in r, not a soft ketchup letter, so -d: gefeliciteerd.'), '.'] },
      { en: 'The neighbours dropped by yesterday.', parts: ['De buren', FK(['zijn', 'hebben'], 0, 'aux',
        'komen is movement towards a place: zijn.'), 'gisteren bij ons',
        FK(['langsgekomen', 'gelangskomen', 'langsgekomt'], 0, 'sep', 'langskomen is separable, so ge goes between langs and komen, and komen is irregular: langsgekomen.'), '.'] },
      { en: 'The politician cried during the debate.', parts: ['De politicus', FK(['heeft', 'is'], 0, 'aux',
        'Crying is something you do, nothing moves: hebben.'), 'in het debat',
        FK(['gehuild', 'gehuilt', 'gehuilen'], 0, 'kof', 'The stem huil ends in l, not a soft ketchup letter, so -d: gehuild.'), '.'] },
      { en: 'The neighbour smiled at me.', parts: ['De buurvrouw heeft naar',
        FK(['me', 'ik'], 0, 'objpron', 'After a preposition you need the object form: naar me. ik is for the one doing it.'),
        FK(['geglimlacht', 'geglimlachd', 'geglimlachen'], 0, 'kof', 'The stem glimlach ends in ch, which is in the ketchup list, so -t: geglimlacht.'), '.'] },
      { en: 'What did you think of the debate?', parts: ['Hoe', FK(['heb je', 'je hebt', 'hebt je'], 0, 'v2',
        'The question word takes slot 1, the verb comes straight after, then je.'), 'het debat',
        FK(['gevonden', 'gevind', 'gevinden'], 0, 'perf', 'vinden is irregular: gevonden. This is the past way to ask for an opinion.'), '?'] },
      { en: 'After work we went to the borrel.', parts: ['Na het werk', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Na het werk fills slot 1, so the verb comes next, then we.'), 'naar de borrel',
        FK(['gegaan', 'gegaand', 'gegaat'], 0, 'perf', 'gaan is irregular: gegaan. Going somewhere takes zijn.'), '.'] },
      { en: 'What did you all eat at the borrel?', parts: ['Wat', FK(['hebben jullie', 'jullie hebben', 'hebt jullie'], 0, 'v2',
        'Wat takes slot 1, the verb comes next, then jullie. jullie is plural, so hebben. hebt goes with jij and u, never with jullie.'), 'op de borrel',
        FK(['gegeten', 'geeten', 'gegeet'], 0, 'perf', 'eten is irregular: gegeten.'), '?'] },

      // ---- reading
      { read: true, nl: 'Je hoeft niet te komen, hoor.', o: ["You don't have to come.", "You shouldn't come.", "You're not allowed to come."], a: 0, r: 'mag',
        w: 'Je hoeft niet te means you do not have to. You should not is je moet niet, and not allowed is je mag niet.' },
      { read: true, nl: 'Druk geweest op het werk?', o: ['Are you busy at work?', 'Have you been busy at work?', 'Will you be busy at work?'], a: 1, r: 'perf',
        w: 'geweest is the participle of zijn, so the question is about busy time that has already happened.' },
      { read: true, nl: 'Ik heb hem gisteren niet gezien.', o: ["He didn't see me yesterday.", "I won't see him tomorrow.", "I didn't see him yesterday."], a: 2, r: 'objpron',
        w: 'hem is the one being seen, ik is the one who did not see him. gezien and gisteren both put it in the past.' },
      { read: true, nl: 'Volgens mij heeft de minister gelijk.', o: ['The minister thinks I am right.', 'I told the minister he is right.', 'In my opinion the minister is right.'], a: 2, r: 'woord',
        w: 'volgens mij is according to me, so it is my opinion. gelijk hebben is to be right.' },
      { read: true, nl: 'Zullen we snel een keer koffie drinken?', en: 'Shall we grab a coffee sometime soon?' },
      { read: true, nl: 'We moeten snel weer afspreken.', en: 'We should meet up again soon.' },

      // ---- listening
      { listen: true, nl: 'tot straks', en: 'see you later' },
      { listen: true, nl: 'de buren', en: 'the neighbours' },
      { listen: true, nl: 'aangenaam', en: 'pleased to meet you' },

      // ---- looking
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

      // ---- de or het
      { dehet: true, nl: 'vriendje', art: 'het', en: 'the little friend', w: 'A diminutive ending in -je is always het: de vriend becomes het vriendje.' },
      { dehet: true, nl: 'verrassing', art: 'de', en: 'the surprise', w: 'Words ending in -ing are de: de verrassing, de uitnodiging.' },
    ] }]);
})();
