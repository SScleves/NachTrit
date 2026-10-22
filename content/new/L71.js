// Nachtrit, Den Haag (tier 6, A2+): level 71 Het werk. A ministry of glass behind the Binnenhof, the standup,
// the incident call, the colleagues, the laptop, and the tram out to Scheveningen.
// Fence: tier 5 plus the tier 6 additions drilled here: the perfectum with hebben and zijn, regular participles
// with 't kofschip (gewerkt, gewoond, geluncht, gebeld), common irregular participles (gegaan, geweest, gedaan,
// gezien, gedronken, opgegeten, uitgelopen) and separable participles (teruggebeld, aangekomen, uitgezet).
// 10 words max. No imperfectum (no was, had), no sub-clauses, no relative clauses, no passive.
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios (De standup - tech talk: Gisteren heb ik aan de dashboards
// gewerkt, Er is vannacht een storing geweest; Koffiepraatje op kantoor), _site/situations/office (Goed weekend gehad?,
// Ik zit zo in een meeting, kan het straks?), 02 - Grammar (perfectum, 't kofschip,
// zijn of hebben, scheidbare werkwoorden), _site/words (aankomen, aanzetten / uitzetten, opeten, het werk),
// and content/towns.js for Den Haag (het Binnenhof, het Torentje, de Hofvijver, de minister, de regering,
// het debat, de Tweede Kamer, Scheveningen, the trams).
// New rules: none. perf, kof, aux, sep, v2, mag, woord come from data.js; presens is declared below only if missing.
// New props: none. Only water, deur and lamp are used.
(() => {
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 71, act: 6, name: 'Het werk', town: 'denhaag', place: 'werk', theme: 'street', ...P,
    intro: 'Since the mist the dead chair every meeting in Den Haag. The minutes are shorter, but the meetings still run over.',
    introNl: 'Sinds de mist zitten de doden elke vergadering in Den Haag voor. De notulen zijn korter, maar de vergaderingen lopen nog steeds uit.',
    mission: {
      where: 'A ministry of glass behind the Binnenhof, past the scaffolding and the Torentje on the Hofvijver, then along the tram rails to Scheveningen, where the wifi is better than in the ministry.',
      carry: 'A laptop at six percent, a badge that opens no doors, and the grammar book, never opened. No helmet. Paola texts that the dogs need a walk. The dogs always need a walk.',
      want: 'Everyone who spoke Dutch changed in the mist, but the standup survived. The dead want to know what you did yesterday, who you called and where you have been. Heb or ben, the participle at the very end. They still split the bill for the coffee, and the women at the machine are still taller than you.' },
    items: [
      // ---- build: perfectum with hebben, 't kofschip
      { en: 'Yesterday I worked on the dashboards.', parts: ['Gisteren',
        FK(['heb ik', 'ik heb', 'heeft ik'], 0, 'v2', 'Gisteren takes slot 1, so the verb comes next, then ik: heb ik.'), 'aan de dashboards',
        FK(['gewerkt', 'gewerkd', 'gewerken'], 0, 'kof', 'The stem werk ends in k, a soft ketchup letter, so the participle ends in -t: gewerkt.'), '.'] },
      { en: 'I lived in Den Haag for two years.', parts: ['Ik heb twee jaar in Den Haag',
        FK(['gewoond', 'gewoont'], 0, 'kof', 'The stem woon ends in n, not in soft ketchup, so -d: gewoond.'), '.'] },
      { en: 'We had lunch on the Plein.', parts: ['We hebben op het Plein',
        FK(['geluncht', 'gelunchd', 'gelunchen'], 0, 'kof', 'The stem lunch ends in ch, and ch is in soft ketchup: geluncht.'), '.'] },
      { en: "I've already called the minister twice.", parts: ['Ik heb de minister al twee keer',
        FK(['gebeld', 'gebelt'], 0, 'kof', 'The stem bel ends in l, not in soft ketchup, so -d: gebeld.'), '.'] },
      // ---- build: irregular participles
      { en: 'Have you seen my email?', parts: [
        FK(['Heb', 'Hebt', 'Heeft'], 0, 'presens', 'Verb first and je right behind it: the t drops, heb je.'), 'je mijn mail',
        FK(['gezien', 'gezient', 'gezeen'], 0, 'perf', 'zien is irregular: gezien, no t on the end.'), '?'] },
      { en: 'What did you do this weekend?', parts: ['Wat heb je dit weekend',
        FK(['gedaan', 'gedoet', 'gedoen'], 0, 'perf', 'doen is irregular: gedaan. Learn it as one word.'), '?'] },
      { en: "I've already had four cups of coffee today.", parts: ['Ik heb vandaag al vier koppen koffie',
        FK(['gedronken', 'gedrinkt', 'gedronkt'], 0, 'perf', 'drinken changes its vowel: gedronken, ending in -en.'), '.'] },
      // ---- build: zijn or hebben
      { en: 'There was an outage last night.', parts: ['Er',
        FK(['is', 'heeft'], 0, 'aux', 'zijn makes its perfectum with zijn: is geweest. Never heeft geweest.'), 'vannacht een storing',
        FK(['geweest', 'gezijnd', 'gewest'], 0, 'perf', 'The participle of zijn is geweest.'), '.'] },
      { en: 'I went to the office by tram.', parts: ['Ik',
        FK(['ben', 'heb'], 0, 'aux', 'Going somewhere is movement to a place, so zijn: ik ben gegaan.'), 'met de tram naar kantoor',
        FK(['gegaan', 'gegaat', 'gegaand'], 0, 'perf', 'gaan is irregular: gegaan.'), '.'] },
      { en: 'On Sunday I was in Scheveningen with the dogs.', parts: ['Zondag',
        FK(['ben ik', 'ik ben', 'heb ik'], 0, 'v2', 'Zondag takes slot 1, so the verb comes next. And geweest runs on zijn: ben ik.'), 'met de honden in Scheveningen geweest.'] },
      // ---- build: separable participles, ge in the middle
      { en: "After the standup I called him back.", parts: ['Na de standup',
        FK(['heb ik', 'ik heb'], 0, 'v2', 'Na de standup takes slot 1, then the verb, then ik.'), 'hem',
        FK(['teruggebeld', 'geterugbeld', 'terugbelt'], 0, 'sep', 'terugbellen splits, and ge slips in between: terug-ge-beld.'), '.'] },
      { en: 'The new colleague has just arrived.', parts: ['De nieuwe collega',
        FK(['is', 'heeft'], 0, 'aux', 'Arriving is movement to a place, so zijn: is aangekomen.'), 'net',
        FK(['aangekomen', 'geaankomen', 'aangekomt'], 0, 'sep', 'aankomen takes ge in the middle: aan-ge-komen.'), '.'] },
      { en: "I've already turned off the laptop.", parts: ['Ik heb de laptop al',
        FK(['uitgezet', 'geuitzet', 'uitgezett'], 0, 'sep', 'uitzetten puts ge after the prefix: uit-ge-zet. The stem already ends in t, so no extra t.'), '.'] },
      { en: 'The dogs have eaten my sandwich.', parts: ['De honden',
        FK(['hebben', 'heeft', 'zijn'], 0, 'aux', 'Two dogs, plural, and eating is not movement: hebben.'), 'mijn boterham',
        FK(['opgegeten', 'geopeten', 'opgeëet'], 0, 'sep', 'opeten splits: op plus gegeten (eten is irregular), so opgegeten.'), '.'] },
      { en: 'The standup ran over again.', parts: ['De standup',
        FK(['is', 'heeft'], 0, 'aux', 'uitlopen, running over, takes zijn: de standup is uitgelopen.'), 'weer',
        FK(['uitgelopen', 'geuitlopen', 'uitgeloopt'], 0, 'sep', 'lopen is irregular and separable: uit-ge-lopen.'), '.'] },

      // ---- words: the office, the laptop, the job
      { w: 'the team meeting', nl: 'het teamoverleg', wrong: 'de teamoverleg' }, { w: 'the meeting room', nl: 'de vergaderruimte' },
      { w: 'the desk', nl: 'het bureau', wrong: 'de bureau' }, { w: 'the customer', nl: 'de klant' }, { w: 'the job', nl: 'de baan' },
      { w: 'the workday', nl: 'de werkdag' }, { w: 'the contract', nl: 'het contract', wrong: 'de contract' }, { w: 'the deadline', nl: 'de deadline' },
      { w: 'the report', nl: 'het rapport', wrong: 'de rapport' }, { w: 'the alert', nl: 'de melding' }, { w: 'the outage', nl: 'de storing' },
      { w: 'the network', nl: 'het netwerk', wrong: 'de netwerk' }, { w: 'the boss', nl: 'de baas' }, { w: 'the project', nl: 'het project', wrong: 'de project' },
      { w: 'the laptop', nl: 'de laptop' }, { w: 'the colleague', nl: 'de collega' }, { w: 'the overtime', nl: 'het overwerk' },
      // ---- words: Den Haag
      { w: 'the ministry', nl: 'het ministerie', wrong: 'de ministerie' }, { w: 'the civil servant', nl: 'de ambtenaar' }, { w: 'the file', nl: 'het dossier', wrong: 'de dossier' },

      // ---- read
      { read: true, nl: 'Goed weekend gehad?', en: 'Had a good weekend?' },
      { read: true, nl: 'Ik zit zo in een meeting, kan het straks?', en: "I'm about to be in a meeting, can it wait?" },
      { read: true, nl: 'Fijn weekend, tot maandag.', en: 'Have a good weekend, see you Monday.' },
      { read: true, nl: 'Ik heb de bug al gefixt.', en: "I've already fixed the bug.",
        o: ["I've already fixed the bug.", 'I still have to fix the bug.', "I've already found the bug."], a: 0, r: 'perf',
        w: 'heb plus a participle at the end is something done: gefixt. Found would be gevonden.' },
      { read: true, nl: 'Je hoeft je camera niet aan te zetten.', en: "You don't have to turn your camera on.",
        o: ["You don't have to turn your camera on.", "You mustn't turn your camera on.", "Your camera isn't on."], a: 0, r: 'mag',
        w: 'Je hoeft niet te means you don\'t have to. You mustn\'t would be je mag je camera niet aanzetten.' },
      { read: true, nl: 'De Kamer heeft weer drie uur vergaderd.', en: 'Parliament met for three hours again.',
        o: ['Parliament met for three hours again.', 'Parliament will meet for three hours.', 'Parliament has three rooms again.'], a: 0, r: 'perf',
        w: 'heeft plus vergaderd is done and over. ver- words take no ge-: vergaderd.' },

      // ---- listen
      { listen: true, nl: 'ik heb gewerkt', en: 'I worked' },
      { listen: true, nl: 'we zijn begonnen', en: 'we have started' },
      { listen: true, nl: 'de stagiair', en: 'the intern' },
      { listen: true, nl: 'de notulen', en: 'the minutes' },

      // ---- look
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'salaris', art: 'het', en: 'the salary' },
      { dehet: true, nl: 'budget', art: 'het', en: 'the budget' },
    ] }]);
})();
