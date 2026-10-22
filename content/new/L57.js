// Nachtrit, Zeeland (tier 4, A2 entry), level 57 De mensen, place mensen.
// Meeting people on the island: the neighbours, the borrel at the harbour of Zierikzee, small talk about the wind,
// birthdays, how people feel and who is taller. Fence: tier 3 plus object pronouns (me, je, hem, haar, ons),
// er is / er zijn, comparatives and superlatives (langer dan, het lekkerst, liever), adjective -e after de, het, een.
// 8 words a line at most. No separable verbs split, no imperative, no perfectum, no gaan + infinitive, no sub-clauses.
// Sources: vault _site/situations (meeting-people, neighbours, small-talk, friends, pub), Dutch Lessons/04 - Phrases &
// Scenarios (De nieuwe buren ontmoeten: Welkom in de buurt, the ladder; Borrel met vrienden: Ik app je, Gefeliciteerd
// met je vrouw), 01 - Vocabulary (borrel: de vrijmibo, de bitterbal; buur: de buurman, de buurvrouw, de buren, de buurt;
// gezellig: een gezellige avond), _site/words (chagrijnig, jarig, de mening, de afspraak, het cadeautje, het feest,
// de verjaardag, de vriend, mensen, leuker dan, graag → liever → liefst), _site/grammar (Trappen van vergelijking,
// Het adjectief — de -e regel, ER — het kleine woord), MOC Lidwoorden & voornaamwoorden (hem / haar, ons / onze),
// Zullen we snel een keer koffie drinken? (neighbours), and content/towns.js for Zeeland (het eiland, de mossel,
// de zeedijk, Het waait vandaag hard, the Dikke Toren of Zierikzee, the barrier that someone still knocks on).
// New props: none (water, deur, kerk). Rules: obj, eris and vergr are shared with the other tier 4 files and set here
// only if missing; adj, v2, modal, neg, dehet, woord, cult come from data.js and levels.js, presens from district3.js.
(() => {
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, jullie, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.eris = window.RULES.eris || { name: 'er is, er zijn', note: 'ER — het kleine woord met veel banen · the little word' };
  window.RULES.vergr = window.RULES.vergr || { name: 'Comparatives and superlatives', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 57, act: 4, name: 'De mensen', town: 'zeeland', place: 'mensen', theme: 'dyke', ...P,
    intro: 'A borrel on the sea dyke. The wind is stronger than you, the women are taller than you, and everyone still splits the bill to the cent.',
    introNl: 'Een borrel op de zeedijk. De wind is sterker dan jij, de vrouwen zijn langer dan jij, en iedereen splitst de rekening nog steeds tot op de cent.',
    mission: {
      where: 'The harbour of Zierikzee under the Dikke Toren, then out along the sea dyke to the barrier. Since the mist everyone who spoke Dutch has changed. In Zeeland you can hardly tell.',
      carry: 'A tray of bitterballen, still molten, and no helmet. The dogs stayed home. They need a walk, just not in this wind.',
      want: 'Small talk. Who you know, who you see on Friday, who is taller. Him, her, us: they wait for the right one. The grammar book was never opened. At the barrier someone still knocks.',
    },
    items: [
      // ---- words: the people (de buurman and de vriend come back from earlier levels)
      { w: 'the neighbour (man)', nl: 'de buurman' }, { w: 'the neighbour (woman)', nl: 'de buurvrouw' },
      { w: 'the neighbours', nl: 'de buren' }, { w: 'the neighbourhood', nl: 'de buurt' },
      { w: 'the friend (man)', nl: 'de vriend' }, { w: 'the people', nl: 'de mensen' },
      { w: 'the girl', nl: 'het meisje', wrong: 'de meisje' }, { w: 'the tourist', nl: 'de toerist' },
      // ---- words: the borrel and the birthday
      { w: 'the drinks get-together', nl: 'de borrel' }, { w: 'the Friday afternoon drinks', nl: 'de vrijmibo' },
      { w: 'the bitterbal', nl: 'de bitterbal' }, { w: 'the party', nl: 'het feest', wrong: 'de feest' },
      { w: 'the birthday', nl: 'de verjaardag' }, { w: 'the little gift', nl: 'het cadeautje', wrong: 'de cadeautje' },
      { w: 'the appointment', nl: 'de afspraak' },
      // ---- words: the talk and the feelings
      { w: 'the conversation', nl: 'het gesprek', wrong: 'de gesprek' }, { w: 'the opinion', nl: 'de mening' },
      { w: 'the feeling', nl: 'het gevoel', wrong: 'de gevoel' }, { w: 'grumpy', nl: 'chagrijnig' },
      { w: 'having your birthday', nl: 'jarig' },
      // ---- words: Zeeland
      { w: 'the island', nl: 'het eiland', wrong: 'de eiland' }, { w: 'the mussel', nl: 'de mossel' },

      // ---- reads: five with their own traps
      { read: true, nl: 'Welkom in de buurt.', en: 'Welcome to the neighbourhood.' },
      { read: true, nl: 'Het waait vandaag hard.', en: 'It is very windy today.',
        o: ['It is very windy today.', 'It is raining hard today.', 'It is hard work today.'], a: 0, r: 'woord',
        w: 'waaien is what the wind does. Het waait hard: a lot of wind, no rain in it.' },
      { read: true, nl: 'Ik zie je vrijdag.', en: 'See you on Friday.',
        o: ['See you on Friday.', 'You see me on Friday.', "I'm free on Friday."], a: 0, r: 'obj',
        w: 'ik does the seeing, je is the one seen. Ik zie je is literally I see you, and Dutch says it as a goodbye.' },
      { read: true, nl: 'Gefeliciteerd met je vrouw.', en: "Congratulations on your wife's birthday.",
        o: ["Congratulations on your wife's birthday.", 'Say hi to your wife.', 'Your wife is very nice.'], a: 0, r: 'cult',
        w: 'At a Dutch birthday you congratulate the whole room, so the husband hears Gefeliciteerd met je vrouw.' },
      { read: true, nl: 'Mijn buurvrouw is langer dan ik.', en: 'My neighbour is taller than me.',
        o: ['My neighbour is taller than me.', 'My neighbour is older than me.', 'My neighbour stays longer than me.'], a: 0, r: 'vergr',
        w: 'lang is tall for people, langer dan is taller than. Older would be ouder.' },
      { read: true, nl: 'Er zijn geen bitterballen meer.', en: 'There are no bitterballen left.',
        o: ['There are no bitterballen left.', 'There are more bitterballen.', 'The bitterballen are not hot.'], a: 0, r: 'neg',
        w: 'geen ... meer means none left. Here meer means any more, not more.' },

      // ---- listens
      { listen: true, nl: 'gezellig', en: 'cosy, good company' }, { listen: true, nl: 'de buurvrouw', en: 'the neighbour (woman)' },
      { listen: true, nl: 'het eiland', en: 'the island' },

      // ---- looks: the harbour water, the barrier doors, the Dikke Toren
      { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- builds: object pronouns
      { en: 'I see her every morning in the garden.', parts: ['Ik zie',
        FK(['haar', 'zij'], 0, 'obj', 'zij is the one who does the seeing. After zie comes the one seen: haar.'), 'elke ochtend in de tuin.'] },
      { en: 'Do you know him?', parts: [FK(['Ken je', 'Kent je'], 0, 'v2', 'A yes or no question starts with the verb, and the verb drops its t before je.'),
        FK(['hem', 'hij'], 0, 'obj', 'hij does things. The one you know is hem.'), '?'] },
      { en: 'The neighbours are expecting us at four.', parts: ['De buren verwachten',
        FK(['ons', 'wij', 'onze'], 0, 'obj', 'wij expect, ons is expected. onze is our, and needs a noun after it.'), 'om vier uur.'] },
      { en: 'Can you help me with the ladder?', parts: ['Kun je', FK(['me', 'ik'], 0, 'obj', 'ik helps, me gets helped.'), 'met de ladder',
        FK(['helpen', 'helpt', 'te helpen'], 0, 'modal', 'After kun the verb goes whole to the end: helpen, no te.'), '?'] },
      { en: "On Friday I'll see you at the borrel.", parts: ['Vrijdag', FK(['zie ik', 'ik zie'], 0, 'v2', 'Vrijdag takes slot 1, so the verb comes second, then ik.'),
        FK(['je', 'jij'], 0, 'obj', 'jij is the one who acts, and ik is already doing the seeing. The one seen is je.'), 'op de borrel.'] },
      // ---- builds: er is, er zijn
      { en: "There's a borrel at the harbour tonight.", parts: [FK(['Er is', 'Er zijn'], 0, 'eris', 'One borrel, so er is. er zijn is for more than one.'), 'vanavond een borrel bij de haven.'] },
      { en: 'There are a lot of tourists on the island.', parts: ['Er', FK(['zijn', 'is'], 0, 'eris', 'toeristen is plural, so er zijn.'), 'veel toeristen op',
        FK(['het', 'de'], 0, 'dehet', 'eiland is a het-word: het eiland.'), 'eiland.'] },
      { en: 'Is there one more bitterbal?', parts: [FK(['Is er', 'Zijn er'], 0, 'eris', 'One bitterbal, so is er. A question puts the verb first.'), 'nog een bitterbal?'] },
      // ---- builds: comparing
      { en: 'The women here are even taller.', parts: ['De vrouwen hier zijn nog',
        FK(['langer', 'langst', 'meer lang'], 0, 'vergr', 'Taller is lang plus -er: langer. Dutch never says meer lang.'), '.'] },
      { en: 'The wind is stronger than me.', parts: ['De wind is',
        FK(['sterker', 'sterkst', 'meer sterk'], 0, 'vergr', 'Comparing two: sterk plus -er, then dan.'), 'dan ik.'] },
      { en: 'Here the mussels are the tastiest.', parts: ['Hier', FK(['zijn de mosselen', 'de mosselen zijn'], 0, 'v2', 'Hier takes slot 1, so the verb comes second.'),
        FK(['het lekkerst', 'de lekkerst', 'het lekkerder'], 0, 'vergr', 'The most after a verb: het plus -st. lekker, lekkerder, lekkerst.'), '.'] },
      { en: 'I prefer beer to wine.', parts: ['Ik drink', FK(['liever', 'graager', 'meer graag'], 0, 'vergr', 'graag has its own ladder: graag, liever, liefst.'), 'bier dan wijn.'] },
      // ---- builds: adjective -e
      { en: 'The new neighbours are nice.', parts: ['De', FK(['nieuwe', 'nieuw'], 0, 'adj', 'After de the adjective takes an -e: de nieuwe buren.'), 'buren',
        FK(['zijn', 'is'], 0, 'presens', 'buren is plural, so zijn.'), 'aardig.'] },
      { en: "It's a cosy evening.", parts: ['Het is een', FK(['gezellige', 'gezellig'], 0, 'adj', 'avond is a de-word, so een gezellige avond.'), 'avond.'] },
      { en: 'The neighbours have a nice house.', parts: ['De buren hebben een', FK(['mooi', 'mooie'], 0, 'adj', 'een plus a het-word: the -e drops. een mooi huis.'), 'huis.'] },
      { en: 'The big party is on Saturday.', parts: ['Het', FK(['grote', 'groot'], 0, 'adj', 'After het the -e comes back: het grote feest.'), 'feest is zaterdag.'] },
    ] }]);
})();
