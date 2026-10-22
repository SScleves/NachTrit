(() => {
  // Level 15 Mag ik?, longer: the sport place in Gouda (tier 3, 8 words max). Golf, the gym, the dog walk, cycling
  // to the course and the weather on it. Grammar stays in the fence: present tense, verb-first questions, V2 after a
  // time word, niet and geen, modal plus infinitive at the end (glued separables only: doorspelen), possessives,
  // and the hoeft niet te / mag niet / moet niet trap.
  // Sources: 04 - Phrases & Scenarios/Op de golfbaan (starttijd reserveren, Hebben jullie nog plek, Jij mag eerst,
  // Wat is je handicap, balletje in het water, Ik baal, Zin in een biertje in het clubhuis, Volgende week weer,
  // Het waait weer eens, de bui), 02 - Grammar/modale werkwoorden (no te after a modal), _site/maps H14 In de
  // sportschool (de sportschool, het park, wandelen, uitlaten), _site/words (de sport, sporten, de spierpijn, golf,
  // Ik speel zaterdag golf., Waar kan ik mijn spullen kwijt), MOC Het weer, MOC Vrije tijd.
  // Rules used: modal, v2, neg, mag (data.js), presens (district3.js), bezit (town-gouda.js). No new rules or props.
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(15, { deliveries: 20, items: [
    // golf: booking, the first tee, the round
    { en: "I'd like to book a tee time for Saturday.", parts: ['Ik', FK(['wil', 'wilt', 'willen'], 0, 'modal', 'ik wil. A modal never takes a t after ik.'), 'graag een starttijd voor zaterdag',
      FK(['reserveren', 'reserveer', 'te reserveren'], 0, 'modal', 'After wil the verb goes to the end as a bare infinitive. No te.'), '.'] },
    { en: 'Do you still have room for two people?', parts: [FK(['Hebben', 'Heeft', 'Hebt'], 0, 'presens', 'jullie takes the plural: hebben, first in a yes/no question.'), 'jullie nog plek voor twee personen?'] },
    { en: 'On Saturday I play golf.', parts: ['Zaterdag', FK(['speel ik', 'ik speel', 'speelt ik'], 0, 'v2', 'Zaterdag takes slot 1, so the verb comes second and ik follows it.'), 'golf.'] },
    { en: 'May we play through?', parts: [FK(['Mogen', 'Mag'], 0, 'modal', 'we takes the plural: mogen. mag is for one person.'), 'we even',
      FK(['doorspelen', 'spelen door', 'door te spelen'], 0, 'modal', 'After a modal the verb stays whole at the end: doorspelen.'), '?'] },
    { en: 'My ball is in the water.', parts: [FK(['Mijn', 'Mij', 'Ik'], 0, 'bezit', 'Before a noun, my is mijn. mij and ik never stand in front of a noun.'), 'balletje',
      FK(['ligt', 'liggen', 'lig'], 0, 'presens', 'One ball, so stem plus t: ligt.'), 'in het water.'] },
    { en: "What's your handicap?", parts: ['Wat is', FK(['jouw', 'jij', 'jou'], 0, 'bezit', 'Your before a noun is jouw. jij does things, jou has things done to it.'), 'handicap?'] },
    { en: "It's raining, but we're still playing golf.", parts: ['Het regent, maar we', FK(['spelen', 'speelt', 'speel'], 0, 'presens', 'we is plural, so the infinitive form: spelen.'), 'gewoon golf.'] },
    { en: 'Fancy a beer?', parts: [FK(['Heb je', 'Hebt je', 'Heeft je'], 0, 'presens', 'Verb first with je behind it: the t drops, heb je.'), 'zin in een biertje?'] },
    // cycling there, the dogs, the gym
    { en: 'Are you cycling to the golf course?', parts: [FK(['Fiets jij', 'Fietst jij'], 0, 'presens', 'Verb first, and the t drops before jij: fiets jij.'), 'naar de golfbaan?'] },
    { en: 'Every morning I walk with the dogs.', parts: ['Elke ochtend', FK(['wandel ik', 'ik wandel', 'wandelt ik'], 0, 'v2', 'Elke ochtend takes slot 1, so the verb comes second, then ik.'), 'met de honden.'] },
    { en: "Dogs don't have to pay.", parts: ['Honden', FK(['hoeven', 'moeten', 'mogen'], 0, 'mag', "Don't have to is hoeven niet te. moeten and mogen never take te."), 'niet te betalen.'] },
    { en: 'On Tuesday I go to the gym.', parts: ['Dinsdag', FK(['ga ik', 'ik ga', 'gaat ik'], 0, 'v2', 'Dinsdag takes slot 1, so the verb comes second and ik follows it.'), 'naar de sportschool.'] },
    { en: "Today I'm not in the mood for the gym.", parts: ['Vandaag heb ik', FK(['geen', 'niet'], 0, 'neg', 'zin is a noun with no article in front, so geen.'), 'zin in de sportschool.'] },
    { en: 'Where can I leave my stuff?', parts: ['Waar', FK(['kan ik', 'ik kan', 'kunnen ik'], 0, 'v2', 'A question word in slot 1, then the verb, then ik.'), 'mijn spullen kwijt?'] },

    // sport words, four with the wrong article as the second sign
    { w: 'the golf course', nl: 'de golfbaan' }, { w: 'the clubhouse', nl: 'het clubhuis', wrong: 'de clubhuis' },
    { w: 'the little ball', nl: 'het balletje', wrong: 'de balletje' }, { w: 'the gym', nl: 'de sportschool' },
    { w: 'the muscle ache', nl: 'de spierpijn' }, { w: 'the weather', nl: 'het weer', wrong: 'de weer' },
    { w: 'the wind', nl: 'de wind' }, { w: 'the rain shower', nl: 'de bui' },
    { w: 'the park', nl: 'het park', wrong: 'de park' }, { w: 'to exercise, to do sport', nl: 'sporten' }, { w: 'to walk, to hike', nl: 'wandelen' },

    // reading: the mag trap twice more, then the golf chunks
    { read: true, nl: 'Jij mag eerst.', en: 'You may go first.',
      o: ['You may go first.', 'You have to go first.', "You're not allowed to go first."], a: 0, r: 'mag', w: 'mag without niet is permission: you may go first. Have to would be moet.' },
    { read: true, nl: 'Honden mogen niet op de golfbaan.', en: "Dogs aren't allowed on the golf course.",
      o: ["Dogs aren't allowed on the golf course.", "Dogs don't have to go on the golf course.", 'Dogs have to go on the golf course.'], a: 0, r: 'mag', w: "mag niet means forbidden. Don't have to would be hoeven niet." },
    { read: true, nl: 'Ik baal.', en: "I'm gutted." },
    { read: true, nl: 'Het waait weer eens.', en: "It's windy again." },
    { read: true, nl: 'Volgende week weer?', en: 'Again next week?' },

    { listen: true, nl: 'de slag', en: 'the stroke' }, { listen: true, nl: 'het regent', en: "it's raining" }, { listen: true, nl: 'de handicap', en: 'the handicap' },

    { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
  ] });
})();
