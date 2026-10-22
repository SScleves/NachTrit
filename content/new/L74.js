// Nachtrit, Den Haag (tier 6, A2+): level 74 Het Binnenhof, the town's own place. The Binnenhof in its scaffolding,
// the Torentje on the Hofvijver, the Tweede Kamer and its debates, the Vredespaleis, the stalls of the Haagse Markt,
// the dunes, the beach, the pier and the Ferris wheel at Scheveningen.
// New at tier 6 and drilled here: the perfectum with hebben and zijn (zijn for going somewhere, running into the sea,
// falling, arriving, and for zijn itself), 't kofschip (gepikt against gestemd, gerend, geduurd, gewandeld,
// gedebatteerd), be- with no ge (beantwoord), irregular participles (gegaan, geweest, gedaan, gegeten, gekocht),
// separable participles (opgebeld, aangekomen), and V2 after a time word or a place in slot 1.
// Still inside the fence: 10 words max, no omdat/dat/als clauses, no imperfectum, no relative clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/perfectum (be- takes no ge), zijn of hebben, 't kofschip, V2 word order,
// scheidbare werkwoorden; _site/situations/small-talk (Heb je de wedstrijd gezien?), opinions (Volgens mij);
// _site/words (de vraag, het antwoord, de vis, de stad, de politie, Ik ben vanmorgen naar de markt geweest.);
// content/towns.js for Den Haag (de regering, de minister, de Tweede Kamer, het debat, het strand, de pier,
// het reuzenrad, de marktkraam, Wat kost een bakje aardbeien?, Dat is geen antwoord op mijn vraag., the Binnenhof
// joke, het Torentje, het Vredespaleis).
// New rules: none (perf, aux, kof, sep, v2, mag, dehet are in data.js; presens and bezit guarded below).
// New props: none. Only water, hond and winkel are used.
(() => {
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 74, act: 6, name: 'Het Binnenhof', town: 'denhaag', place: 'eigen', theme: 'square', ...P,
    intro: 'The politicians left the Binnenhof for a renovation and the dead moved in. In the debates nobody has noticed the difference, and they still split the bill.',
    introNl: 'De politici zijn voor de verbouwing uit het Binnenhof vertrokken en de doden zijn erin getrokken. Bij de debatten merkt niemand het verschil, en ze delen de rekening nog steeds.',
    mission: {
      where: 'From the Binnenhof in its scaffolding, past the Torentje on the Hofvijver, through the stalls of the Haagse Markt and over the dunes to the pier at Scheveningen.',
      carry: 'A punnet of strawberries, two dogs who smell the beach, and the grammar book, still unopened. No helmet. The government cars do not slow down for anyone without a title.',
      want: 'The dead sit in committee and ask what you did today. They want a real answer: heb or ben, and the participle at the very end. The women on the committee are still taller than you, and the dogs still need a walk on the beach.' },
    items: [
      // ---- builds: hebben or zijn
      { en: 'The prime minister fell off his bike yesterday.', parts: ['De premier', FK(['is', 'heeft'], 0, 'aux',
        'Falling is a change of place, not an activity: zijn.'), 'gisteren van zijn fiets', FK(['gevallen', 'gevalt', 'gevald'], 0, 'perf',
        'vallen is irregular: gevallen. Learn it whole.'), '.'] },
      { en: 'The debate lasted all night.', parts: ['Het debat', FK(['heeft', 'is'], 0, 'aux',
        'Lasting is not going anywhere: hebben.'), 'de hele nacht', FK(['geduurd', 'geduurt'], 0, 'kof',
        'duur ends in r, no ketchup letter: geduurd with a d.'), '.'] },
      { en: 'The dogs ran into the sea.', parts: ['De honden', FK(['zijn', 'hebben'], 0, 'aux',
        'Running into the sea goes somewhere: zijn.'), 'de zee in', FK(['gerend', 'gerent'], 0, 'kof',
        'ren ends in n, no ketchup letter: gerend with a d.'), '.'] },
      { en: 'I have been to the Peace Palace.', parts: ['Ik', FK(['ben', 'heb'], 0, 'aux',
        'zijn makes its own perfect with zijn: ik ben geweest.'), 'bij het Vredespaleis', FK(['geweest', 'gezijn', 'gebent'], 0, 'perf',
        'The participle of zijn is geweest. Learn it as a word of its own.'), '.'] },

      // ---- builds: 't kofschip and be- without ge
      { en: 'Have you voted yet?', parts: [FK(['Heb', 'Hebt'], 0, 'presens',
        'Verb first with je right behind it: the t drops, heb je.'), 'je al', FK(['gestemd', 'gestemt'], 0, 'kof',
        'stem ends in m, no ketchup letter: gestemd with a d.'), '?'] },
      { en: 'The House debated for three hours.', parts: ['De Tweede Kamer heeft drie uur', FK(['gedebatteerd', 'gedebatteert', 'gedebatteren'], 0, 'kof',
        'debatteer ends in r, no ketchup letter: gedebatteerd with a d.'), '.'] },
      { en: 'On Sunday we walked on the pier.', parts: ['Zondag', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Zondag takes slot 1, so the verb comes second, then we.'), 'op de pier', FK(['gewandeld', 'gewandelt'], 0, 'kof',
        'wandel ends in l, no ketchup letter: gewandeld with a d.'), '.'] },
      { en: 'A seagull nicked my chips.', parts: ['Een meeuw', FK(['heeft', 'hebben'], 0, 'presens',
        'One gull, so the hij-form: heeft.'), 'mijn patatje', FK(['gepikt', 'gepikd'], 0, 'kof',
        'pik ends in k, a ketchup letter: gepikt with a t.'), '.'] },
      { en: "The minister didn't answer my question.", parts: ['De minister heeft mijn vraag niet', FK(['beantwoord', 'gebeantwoord', 'beantwoordt'], 0, 'perf',
        'be- verbs never take ge, and the stem already ends in d: beantwoord.'), '.'] },

      // ---- builds: irregular participles
      { en: 'Yesterday we went to Scheveningen.', parts: ['Gisteren', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes before we.'), 'naar Scheveningen', FK(['gegaan', 'gegaat'], 0, 'perf',
        'gaan has its own participle: gegaan.'), '.'] },
      { en: 'On the beach we ate kibbeling.', parts: ['Op het strand', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Op het strand takes slot 1, so hebben comes before we.'), 'kibbeling', FK(['gegeten', 'gegeet', 'geëten'], 0, 'perf',
        'eten is irregular: ge + geten, so gegeten with ge twice.'), '.'] },
      { en: 'Paola bought strawberries at the Haagse Markt.', parts: ['Paola heeft op de Haagse Markt aardbeien', FK(['gekocht', 'gekoopt', 'gekoopd'], 0, 'perf',
        'kopen is irregular: gekocht. Learn it whole.'), '.'] },
      { en: 'The politicians have done nothing again.', parts: ['De politici', FK(['hebben', 'heeft'], 0, 'presens',
        'politici is plural: hebben.'), 'weer niks', FK(['gedaan', 'gedoet', 'gedoen'], 0, 'perf',
        'doen is irregular: gedaan.'), '.'] },

      // ---- builds: separable participles
      { en: 'I called Paola from the pier.', parts: ['Ik heb Paola vanaf de pier', FK(['opgebeld', 'geopbeld', 'opgebelt'], 0, 'sep',
        'ge goes between op and beld. bel has no ketchup letter, so -d: opgebeld.'), '.'] },
      { en: 'At nine the king arrived.', parts: ['Om negen uur', FK(['is de koning', 'de koning is'], 0, 'v2',
        'Om negen uur takes slot 1, so is comes before de koning.'), FK(['aangekomen', 'geaankomen', 'aangekomt'], 0, 'sep',
        'The ge slots in between aan and komen: aan-ge-komen, one word at the end.'), '.'] },

      // ---- words: the Binnenhof, the Kamer, the beach, the market
      { w: 'the government', nl: 'de regering' }, { w: 'the minister', nl: 'de minister' }, { w: 'the prime minister', nl: 'de premier' },
      { w: 'the House of Representatives', nl: 'de Tweede Kamer' }, { w: 'the debate', nl: 'het debat', wrong: 'de debat' },
      { w: 'the parliament', nl: 'het parlement', wrong: 'de parlement' }, { w: 'the politicians', nl: 'de politici', wrong: 'het politici' },
      { w: 'the elections', nl: 'de verkiezingen' }, { w: 'the strawberry', nl: 'de aardbei' }, { w: 'the king', nl: 'de koning' },
      { w: 'the punnet', nl: 'het bakje' }, { w: 'the answer', nl: 'het antwoord', wrong: 'de antwoord' },
      { w: 'the beach', nl: 'het strand', wrong: 'de strand' }, { w: 'the shell', nl: 'de schelp' }, { w: 'the sand', nl: 'het zand' },
      { w: 'the pier', nl: 'de pier' }, { w: 'the Ferris wheel', nl: 'het reuzenrad', wrong: 'de reuzenrad' }, { w: 'the dunes', nl: 'de duinen' },
      { w: 'the seagull', nl: 'de meeuw' }, { w: 'the market stall', nl: 'de marktkraam' }, { w: 'the herring', nl: 'de haring' },

      // ---- reads: three traps with their own options, three lines from the city
      { read: true, nl: 'De premier is naar huis gefietst.', o: ['The prime minister cycled home.', 'The prime minister is cycling home.', 'The prime minister wants to cycle home.'], a: 0, r: 'perf',
        w: 'is + gefietst at the end: it already happened.' },
      { read: true, nl: 'Je mag hier niet fietsen.', o: ["You're not allowed to cycle here.", "You don't have to cycle here.", 'You have to cycle here.'], a: 0, r: 'mag',
        w: 'mag niet: not allowed. No need would be hoeft niet te.' },
      { read: true, nl: 'Heb je het debat gezien?', o: ['Have you seen the debate?', 'Do you want to see the debate?', 'Is the debate on tonight?'], a: 0, r: 'perf',
        w: 'heb + gezien: it is about something already seen. Wanting to see it would be wil je het debat zien.' },
      { read: true, nl: 'Dat is geen antwoord op mijn vraag.', en: 'That is not an answer to my question.' },
      { read: true, nl: 'Wat kost een bakje aardbeien?', en: 'How much is a punnet of strawberries?' },
      { read: true, nl: 'Volgens mij heeft de minister niks gedaan.', en: 'If you ask me, the minister has done nothing.' },

      // ---- listens: the Kamer by ear, two participles
      { listen: true, nl: 'het Binnenhof', en: 'the Binnenhof' }, { listen: true, nl: 'gestemd', en: 'voted' },
      { listen: true, nl: 'aangekomen', en: 'arrived' },

      // ---- looks: the Hofvijver, the dogs on the beach, a stall at the market
      { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
      { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' },

      // ---- de of het
      { dehet: true, nl: 'kabinet', art: 'het', en: 'the cabinet', w: 'het kabinet. All the ministers together are het kabinet, but one minister is de minister.' },
      { dehet: true, nl: 'ministerie', art: 'het', en: 'the ministry', w: 'Most -ie words are de, like de politie. het ministerie is the exception.' },
    ] }]);
})();
