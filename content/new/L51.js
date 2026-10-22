// Nachtrit, Zeeland (tier 4, A2 entry), level 51 Thuis: a small house behind the sea dyke, the rooms and the
// furniture, the family, the dogs, the wife, the evening routine, and a storm outside.
// Fence: tier 3 plus object pronouns (me, je, hem, haar, ons, jullie, ze), er is / er zijn and er + posture verb,
// comparatives and superlatives (groter dan, het koudst), adjective -e after de, het and een. 8 words max.
// No split separable verbs, no gaan + infinitive, no imperative, no perfectum, no sub-clauses.
// Sources: vault 04 - Phrases & Scenarios/Thuis met je vrouw (Zal ik thee zetten? Je hebt gelijk. Schat),
// Dutch Lessons/Thuis MOC, 01 - Vocabulary/hond and huis, _site/maps/H17 Thuis (de zus, de schat, slapen),
// _site/words (de verwarming, de wc, Er hangt een lamp boven de tafel, het oude huis, Heb je broers of zussen?),
// _site/grammar (trappen van vergelijking, ER het kleine woord met veel banen, het adjectief de -e regel),
// MOC Lidwoorden & voornaamwoorden (hem / haar), 03 - Verbs/mogen (mag niet), and content/towns.js for Zeeland
// (de zeedijk, het eiland, eb en vloed, Het waait vandaag hard, the 62 doors of the kering, Zierikzee, Middelburg).
// Rules: obj, er and vergl are shared with the other tier 4 files and set here only if missing; adj, v2, modal,
// neg, mag and woord come from data.js, presens and bezit from district3.js and town-gouda.js.
// Props: hond, tuin, lamp. No deur look: the deur prop reads as a narrow house and het oude huis is in the pool.
(() => {
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, jullie, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.vergl = window.RULES.vergl || { name: 'Comparison: -er dan, het -st', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 51, act: 4, name: 'Thuis', town: 'zeeland', place: 'thuis', theme: 'dyke', ...P,
    intro: 'A small house behind the sea dyke. Tonight there is a storm, so the barrier shuts all 62 of its doors. Someone still knocks on yours.',
    introNl: 'Een klein huis achter de zeedijk. Vannacht stormt het, dus alle 62 deuren van de kering gaan dicht. Bij jou klopt toch iemand.',
    mission: { where: 'Your house behind the sea dyke near Zierikzee: the hallway, the kitchen, the cold attic, the dogs\' basket by the heating.',
      carry: 'Two dogs who want their walk in a force nine gale. No helmet. Paola says the wind is no excuse.',
      want: 'They point at your wife, your dogs, your mother-in-law, and ask who you see and what is bigger. Your wife is taller. She always was. The grammar book is still in its plastic.' },
    items: [
      // the house, room by room
      { w: 'the hallway', nl: 'de gang' }, { w: 'the attic', nl: 'de zolder' }, { w: 'the chair', nl: 'de stoel' },
      { w: 'the cupboard', nl: 'de kast' }, { w: 'the fridge', nl: 'de koelkast' }, { w: 'the wall', nl: 'de muur' },
      { w: 'the curtain', nl: 'het gordijn', wrong: 'de gordijn' }, { w: 'the mirror', nl: 'de spiegel' },
      { w: 'the heating', nl: 'de verwarming', wrong: 'het verwarming' }, { w: 'the pillow', nl: 'het kussen', wrong: 'de kussen' },
      { w: 'the plate', nl: 'het bord', wrong: 'de bord' },
      // replay from Alblasserdam and Gouda
      { w: 'the bedroom', nl: 'de slaapkamer' }, { w: 'the window', nl: 'het raam', wrong: 'de raam' },
      { w: 'the key', nl: 'de sleutel' }, { w: 'the leash', nl: 'de riem' },
      // the family
      { w: 'the brother', nl: 'de broer' }, { w: 'the sister', nl: 'de zus' }, { w: 'the mother-in-law', nl: 'de schoonmoeder' },
      // Zeeland outside the window
      { w: 'the sea', nl: 'de zee' }, { w: 'the island', nl: 'het eiland', wrong: 'de eiland' }, { w: 'the storm', nl: 'de storm' },

      // reading
      { read: true, nl: 'Het waait vandaag hard.', en: 'It is very windy today.' },
      { read: true, nl: 'Zal ik thee zetten?', en: 'Shall I make tea?' },
      { read: true, nl: 'Er hangt een lamp boven de tafel.', en: 'A lamp is hanging above the table.' },
      { read: true, nl: 'De honden mogen niet op de bank.', en: 'The dogs are not allowed on the couch.',
        o: ['The dogs are not allowed on the couch.', "The dogs don't have to be on the couch.", 'The dogs like the couch.'], a: 0, r: 'mag',
        w: 'mag niet means not allowed. Not having to is hoeft niet.' },
      { read: true, nl: 'Zierikzee is kleiner dan Middelburg.', en: 'Zierikzee is smaller than Middelburg.',
        o: ['Zierikzee is smaller than Middelburg.', 'Zierikzee is bigger than Middelburg.', 'Zierikzee is the smallest town.'], a: 0, r: 'vergl',
        w: 'klein, kleiner, kleinst. -er with dan compares two things, and Zierikzee is the smaller one.' },
      { read: true, nl: 'Je hebt gelijk.', en: "You're right.",
        o: ["You're right.", 'You have the same.', 'You look alike.'], a: 0, r: 'woord',
        w: 'gelijk hebben means being right. The vault says to learn this one first.' },

      // listening
      { listen: true, nl: 'de zeedijk', en: 'the sea dyke' }, { listen: true, nl: 'eb en vloed', en: 'low and high tide' },
      { listen: true, nl: 'het oude huis', en: 'the old house' }, { listen: true, nl: 'een warme deken', en: 'a warm blanket' },

      // looking
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // building: object pronouns
      { en: 'My mother-in-law calls me every Sunday.', parts: ['Mijn schoonmoeder belt',
        FK(['me', 'ik', 'mijn'], 0, 'obj', 'She calls, I get called: the object form, me. ik only does things, mijn needs a noun after it.'), 'elke zondag.'] },
      { en: 'I love her more than golf.', parts: ['Ik hou meer van',
        FK(['haar', 'zij'], 0, 'obj', 'After van you need the object form: haar. zij is she, the one doing it.'),
        FK(['dan', 'dat'], 0, 'vergl', 'meer, groter, beter: a comparison is always followed by dan.'), 'van golf.'] },
      { en: 'Do you see him in the garden?', parts: ['Zie je',
        FK(['hem', 'hij', 'zijn'], 0, 'obj', 'You see him, so the object form: hem. hij does the seeing, zijn needs a noun.'), 'in de tuin?'] },
      { en: 'Every evening I brush them.', parts: ['Elke avond',
        FK(['borstel ik', 'ik borstel'], 0, 'v2', 'Elke avond takes slot 1, so the verb comes second and ik after it.'),
        FK(['ze', 'zij'], 0, 'obj', 'The dogs get brushed: the object form is ze. zij only does the doing.'), '.'] },
      { en: "I'll see you all Friday at the borrel.", parts: ['Ik zie',
        FK(['jullie', 'jij', 'jouw'], 0, 'obj', 'You all as an object is jullie, the same word as the subject. jij is only a subject and jouw needs a noun.'), 'vrijdag op de borrel.'] },
      { en: 'Honey, can I help you for a moment?', parts: ['Schat, kan ik',
        FK(['je', 'jij', 'jouw'], 0, 'obj', 'You get helped, so the object form: je. jij does things, jouw needs a noun.'), 'even',
        FK(['helpen', 'te helpen', 'help'], 0, 'modal', 'After kan the verb goes whole to the end, no te.'), '?'] },
      { en: 'In a storm the dogs sleep with us.', parts: ['Bij storm',
        FK(['slapen de honden', 'de honden slapen'], 0, 'v2', 'Bij storm takes slot 1, so the verb comes second, before de honden.'), 'bij',
        FK(['ons', 'wij', 'onze'], 0, 'obj', 'After bij you need the object form: ons. wij does things, onze needs a noun.'), '.'] },

      // building: er is, er zijn
      { en: 'Is there any milk left in the fridge?', parts: [
        FK(['Is er', 'Zijn er'], 0, 'er', 'melk is one mass, so singular: is er. zijn er is for things you count.'), 'nog melk in de koelkast?'] },
      { en: "There's no heating in the attic.", parts: ['Er',
        FK(['is', 'zijn'], 0, 'er', 'One heating, so er is.'),
        FK(['geen', 'niet'], 0, 'neg', 'verwarming is a noun with no article, so you negate it with geen. niet does not go before a noun.'), 'verwarming op zolder.'] },
      { en: 'Someone is knocking on the door.', parts: ['Er',
        FK(['klopt', 'kloppen'], 0, 'er', 'er fills slot 1, the verb follows the real subject: iemand is one person, so klopt.'), 'iemand op de deur.'] },

      // building: comparing
      { en: 'My wife is taller than me.', parts: ['Mijn vrouw is',
        FK(['groter', 'grootst', 'groot'], 0, 'vergl', 'Two people side by side: -er plus dan. grootst is for the top of the ladder.'), 'dan ik.'] },
      { en: 'Our house is the coldest in the street.', parts: [
        FK(['Ons', 'Onze'], 0, 'bezit', 'huis is a het-word, so ons huis. onze is for de-words and plurals.'), 'huis is',
        FK(['het koudst', 'het kouder'], 0, 'vergl', 'The top of the ladder is het plus -st: het koudst.'), 'van de straat.'] },
      { en: 'It is windier than yesterday.', parts: ['Het waait',
        FK(['harder', 'hardst', 'hard'], 0, 'vergl', 'Comparing with yesterday: -er plus dan, harder dan.'), 'dan gisteren.'] },

      // building: adjective -e
      { en: 'We have a small house behind the dyke.', parts: ['We hebben een',
        FK(['klein', 'kleine'], 0, 'adj', 'een plus a het-word drops the -e: een klein huis.'), 'huis achter de dijk.'] },
      { en: 'The big bed is in the bedroom.', parts: ['Het',
        FK(['grote', 'groot'], 0, 'adj', 'After het the adjective always takes -e: het grote bed.'), 'bed staat in de slaapkamer.'] },
      { en: 'Paola wants a new couch for the dogs.', parts: ['Paola',
        FK(['wil', 'wilt', 'willen'], 0, 'modal', 'Paola is one person: wil, with no t.'), 'een',
        FK(['nieuwe', 'nieuw'], 0, 'adj', 'bank is a de-word, so een nieuwe bank. Only het-words lose the -e after een.'), 'bank voor de honden.'] },
    ] }]);
})();
