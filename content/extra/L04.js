(() => {
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(4, { deliveries: 20, items: [
    // zijn with people, feelings and age. Sources: 03 - Verbs/zijn, situations/daily-life (Mijn buren zijn vriendelijk),
    // De nieuwe buren ontmoeten (Dit is mijn vrouw, en dit zijn onze twee honden), meeting-people (Ja, ik ben getrouwd).
    { en: "I'm scared.", parts: ['Ik', FK(['ben', 'heb'], 0, 'zijn', 'bang goes with zijn: ik ben bang. Tengo miedo does not carry over.'), 'bang.'] },
    { en: 'The girl is eight.', parts: ['Het meisje', FK(['is', 'heeft'], 0, 'zijn', 'Age goes with zijn, never hebben: zij is acht jaar.'), 'acht jaar.'] },
    { en: 'The neighbours are friendly.', parts: ['De buren', FK(['zijn', 'is'], 0, 'zijn', 'buren is plural, so zijn.'), 'vriendelijk.'] },
    { en: 'Everyone is welcome.', parts: ['Iedereen', FK(['is', 'zijn'], 0, 'zijn', 'iedereen counts as one person: iedereen is.'), 'welkom.'] },
    { en: 'The women are tall.', parts: ['De vrouwen', FK(['zijn', 'is'], 0, 'zijn', 'Plural, so zijn. They are still taller than you.'), 'lang.'] },
    { en: "Honey, you're sweet.", parts: ['Schat, je', FK(['bent', 'is'], 0, 'zijn', 'je and jij both take bent. is is for hij and zij.'), 'lief.'] },
    { en: 'Santi and Paola are married.', parts: ['Santi en Paola', FK(['zijn', 'is'], 0, 'zijn', 'Santi en Paola are two people, so zijn.'), 'getrouwd.'] },
    { en: 'This is Paola.', parts: ['Dit', FK(['is', 'zijn'], 0, 'zijn', 'One person, so dit is.'), 'Paola.'] },
    { en: 'These are the dogs.', parts: ['Dit', FK(['zijn', 'is'], 0, 'zijn', 'Two dogs, so dit zijn. Dutch keeps dit where English says these.'), 'de honden.'] },

    // de or het with people and parties. Source: 02 - Grammar/de vs het (people are de, het kind, every plural is de).
    { en: 'The child is tired.', parts: [FK(['Het', 'De'], 0, 'dehet', 'kind is a het-word, one of the few people that are: het kind.'), 'kind is moe.'] },
    { en: "I'm the neighbour.", parts: ['Ik ben', FK(['de', 'het'], 0, 'dehet', 'People are de-words: de buurman, de buurvrouw.'), 'buurman.'] },
    { en: 'The children are outside.', parts: [FK(['De', 'Het'], 0, 'dehet', 'Every plural is de, even het kind: de kinderen.'), 'kinderen zijn buiten.'] },
    { en: 'The borrel is cosy.', parts: [FK(['De', 'Het'], 0, 'dehet', 'borrel is a de-word: de borrel.'), 'borrel is gezellig.'] },
    { en: 'The party is fun.', parts: [FK(['Het', 'De'], 0, 'dehet', 'feest is a het-word: het feest.'), 'feest is leuk.'] },

    // greetings and the birthday circle. Sources: words/welkom (in), words/gefeliciteerd, Borrel met vrienden.
    { en: 'Welcome to the neighbourhood.', parts: ['Welkom', FK(['in', 'naar'], 0, 'groet', 'Welcome to a place is welkom in. naar is for getting there.'), 'de buurt.'] },
    { en: "Congratulations on Paola's birthday.", parts: ['Gefeliciteerd', FK(['met', 'op'], 0, 'cult', 'You congratulate with met, and at a Dutch birthday the whole family gets it.'), 'Paola.'] },

    // people and greetings. Sources: words (de buurman / buurvrouw, het kind, mensen, de naam, de vriend, borrel, gefeliciteerd),
    // situations/meeting-people (Aangenaam). goedenavond and alsjeblieft come back from level 2.
    { w: 'the neighbour (woman)', nl: 'de buurvrouw' }, { w: 'the child', nl: 'het kind', wrong: 'de kind' }, { w: 'the girl', nl: 'het meisje', wrong: 'de meisje' },
    { w: 'the people', nl: 'de mensen' }, { w: 'the name', nl: 'de naam', wrong: 'het naam' }, { w: 'the friend (man)', nl: 'de vriend' },
    { w: 'the drinks after work', nl: 'de borrel' }, { w: 'pleased to meet you', nl: 'aangenaam' }, { w: 'congratulations', nl: 'gefeliciteerd' },
    { w: 'good evening', nl: 'goedenavond' }, { w: 'please', nl: 'alsjeblieft' },

    // small talk, feelings and opinions. Sources: meeting-people (Alles goed?), neighbours (Lekker weertje, hè?), words/jarig, Wat jammer.
    { read: true, nl: 'Alles goed?', en: 'All good?' },
    { read: true, nl: 'Lekker weertje, hè?', en: 'Nice weather, right?' },
    { read: true, nl: 'Dat is jammer.', en: "That's a shame." },
    { read: true, nl: 'Hij is boos.', en: "He's angry.",
      o: ["He's angry.", "He's the boss.", "He's bored."], a: 0, r: 'woord', w: 'boos means angry. The boss is de baas.' },
    { read: true, nl: 'Zij is jarig.', en: "It's her birthday.",
      o: ["It's her birthday.", 'She is one year old.', 'She is old.'], a: 0, r: 'cult', w: 'jarig means it is your birthday today. Then the whole room gets congratulated.' },

    { listen: true, nl: 'gezellig', en: 'cosy, sociable' }, { listen: true, nl: 'de buren', en: 'the neighbours' },

    { look: true, prop: 'deur', nl: 'de deur', en: 'the door' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
  ] });
})();
