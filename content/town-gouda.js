// Nachtrit, Gouda (tier 3, A1 to A2): the two places district 3 did not cover. Level 49 Thuis, level 50 Eten en drinken.
// Same fence as district 3: 8 words max, present tense, V2 after a time word, niet/geen, modal + infinitive at the end.
// Separable verbs only ever appear glued (de honden uitlaten after moet), never split.
// Sources: dutch-lessons vault, _site/situations (restaurant, pub, takeaway, visiting, daily-life),
// 04 - Phrases & Scenarios/Thuis met je vrouw, 01 - Vocabulary/hond, 02 - Grammar (presens, de vs het,
// modale werkwoorden, niet vs geen), MOC Lidwoorden & voornaamwoorden (mijn, jouw, zijn, haar, ons/onze),
// MOC Getallen, and content/towns.js for Gouda (de Markt, de Waag, de kaasdragers, de kaasmarkt, Mag ik even proeven?).
//
// New rules: bezit (possessives), linked to the vault note 'MOC Lidwoorden & voornaamwoorden' (the vault has no
// grammar note of its own for possessives). presens is reused from district3.js and redeclared here only if missing.
// New props: none. Only hond, tuin, huis, winkel, water and kerk are used.
// Loading: index.html loads this file after content/district3.js. Ids 49 and 50 are new, so defineLevels appends them.

window.RULES.bezit = { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

(function () {
  const D3 = { lanes: 3, speed: 13, maxSpeed: 16, ramp: false, lampDecay: 0.55, forkSlow: 0.35, hint: null, obstacles: 'light', filler: [28, 40], deliveries: 10, cefr: 'A2', maxWords: 8 };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    // ---------------------------------------------------------------- 49 Gouda, Thuis
    { id: 49, act: 3, town: 'gouda', place: 'thuis', name: 'Thuis', theme: 'street', ...D3,
      intro: 'A house in Gouda, one street behind the Markt. The dogs took the couch before you found the light switch.',
      introNl: 'Een huis in Gouda, één straat achter de Markt. De honden lagen al op de bank voordat jij het lichtknopje had gevonden.',
      mission: { where: 'Your house, one street behind the Markt. Kitchen, bedroom, garden, and back to bed.',
        carry: 'The keys. Paola wants to know where they are. They are under the couch. They are always under the couch.',
        want: 'They stand in every room and ask whose it is and when you do it. Mijn, jouw, zijn, haar, ons. Then a time, then the verb.' },
      items: [
        { en: 'I live with my wife.', parts: ['Ik', FK(['woon', 'woont', 'wonen'], 0, 'presens', 'ik takes the bare stem: woon.'), 'samen met',
          FK(['mijn', 'mij', 'ik'], 0, 'bezit', 'Before a noun, my is mijn. mij is me, the one it happens to.'), 'vrouw.'] },
        { en: 'Our house has a garden.', parts: [FK(['Ons', 'Onze'], 0, 'bezit', 'huis is a het-word, so ons huis. onze is for de-words and plurals.'), 'huis',
          FK(['heeft', 'hebt', 'hebben'], 0, 'presens', 'One house, so hij-form: heeft.'), 'een tuin.'] },
        { en: 'Our dogs sleep on the couch.', parts: [FK(['Onze', 'Ons'], 0, 'bezit', 'Every plural is a de-word, so onze honden.'), 'honden',
          FK(['slapen', 'slaapt', 'slaap'], 0, 'presens', 'Two dogs, plural: the infinitive, slapen.'), 'op de bank.'] },
        { en: 'Paola drinks her coffee in the garden.', parts: ['Paola', FK(['drinkt', 'drink', 'drinken'], 0, 'presens', 'Paola is a zij: stem plus t, drinkt.'),
          FK(['haar', 'zij'], 0, 'bezit', 'Her before a noun is haar. zij is she, the one doing it.'), 'koffie in de tuin.'] },
        { en: 'His dog is lying in our garden.', parts: [FK(['Zijn', 'Hij', 'Hem'], 0, 'bezit', 'His before a noun is zijn. Same word as the verb zijn, other job.'), 'hond ligt in',
          FK(['onze', 'ons'], 0, 'bezit', 'tuin is a de-word: onze tuin.'), 'tuin.'] },
        { en: 'Honey, your coffee is on the table.', parts: ['Schat,', FK(['jouw', 'jij', 'jou'], 0, 'bezit', 'Your before a noun is jouw. jij does things, jou has things done to it.'), 'koffie staat op tafel.'] },
        { en: 'Where are my keys?', parts: ['Waar', FK(['zijn', 'is'], 0, 'zijn', 'sleutels is plural, so zijn.'),
          FK(['mijn', 'mij'], 0, 'bezit', 'My before a noun: mijn.'), 'sleutels?'] },
        { en: 'At eleven I go to bed.', parts: ['Om elf uur', FK(['ga ik', 'ik ga', 'gaat ik'], 0, 'v2', 'A time in slot 1 pushes ik behind the verb: ga ik.'), 'naar bed.'] },
        { en: 'In the evening we cook in the kitchen.', parts: ["'s Avonds", FK(['koken we', 'we koken', 'kookt we'], 0, 'v2', "'s Avonds takes slot 1, then the verb, then we."), 'in de keuken.'] },
        { en: 'Every morning I have to walk the dogs.', parts: ['Elke ochtend', FK(['moet ik', 'ik moet', 'moeten ik'], 0, 'v2', 'Elke ochtend in slot 1: the modal comes next, then ik.'), 'de honden',
          FK(['uitlaten', 'laat uit', 'te uitlaten'], 0, 'modal', 'After a modal the verb goes whole to the end: uitlaten.'), '.'] },
        { en: "The dogs aren't allowed in the bedroom.", parts: ['De honden', FK(['mogen', 'mag'], 0, 'modal', 'Two dogs, so the plural: mogen.'),
          FK(['niet', 'geen'], 0, 'neg', 'No noun to cancel here, so niet, before the place.'), 'in de slaapkamer.'] },
        { w: 'the kitchen', nl: 'de keuken' }, { w: 'the bedroom', nl: 'de slaapkamer' }, { w: 'the living room', nl: 'de woonkamer' },
        { w: 'the bathroom', nl: 'de badkamer' }, { w: 'the bed', nl: 'het bed' }, { w: 'the window', nl: 'het raam' }, { w: 'the stairs', nl: 'de trap' },
        { w: 'the couch', nl: 'de bank' }, { w: 'the key', nl: 'de sleutel' },
        { read: true, nl: 'Schat, ik ben thuis.', en: "Honey, I'm home." },
        { read: true, nl: 'Wat eten we vanavond?', en: "What's for dinner tonight?" },
        { read: true, nl: 'Ik hou van jou.', en: 'I love you.' },
        { read: true, nl: 'Welterusten, slaap lekker.', en: 'Good night, sleep well.' },
        { listen: true, nl: 'om zeven uur', en: 'at seven o\'clock' }, { listen: true, nl: 'onze honden', en: 'our dogs' }, { listen: true, nl: 'de kaars', en: 'the candle' },
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      ] },

    // ---------------------------------------------------------------- 50 Gouda, Eten en drinken
    { id: 50, act: 3, town: 'gouda', place: 'eten', name: 'Eten en drinken', theme: 'square', ...D3,
      intro: 'The cheese porters still carry the wheels across the Markt. The dead still split the bill to the cent.',
      introNl: 'De kaasdragers sjouwen nog steeds de kazen over de Markt. De doden delen de rekening nog steeds tot op de cent.',
      mission: { where: 'The Markt: the stalls by the Waag, the cafés around the town hall, the pub on the corner.',
        carry: 'A wallet with four euros in coins and a card that works when it feels like it.',
        want: 'They take your order, then ask something back. What it costs, who pays, together or apart. Get it wrong and they bring more cheese.' },
      items: [
        { en: 'May I have the bill, please?', parts: ['Mag ik', FK(['de', 'het'], 0, 'dehet', 'rekening ends in -ing, and -ing words are de.'), 'rekening, alstublieft?'] },
        { en: 'Can we pay separately?', parts: [FK(['Kunnen', 'Kan'], 0, 'modal', 'we is plural: kunnen.'), 'we apart',
          FK(['betalen', 'te betalen', 'betaalt'], 0, 'modal', 'After a modal the infinitive closes the sentence, no te.'), '?'] },
        { en: 'What does that cost?', parts: ['Wat', FK(['kost dat', 'dat kost', 'kosten dat'], 0, 'v2', 'Question word in slot 1, then the verb, then dat.'), '?'] },
        { en: 'Who pays the bill?', parts: ['Wie', FK(['betaalt', 'betalen', 'betaal'], 0, 'presens', 'wie counts as one person: stem plus t, betaalt.'), 'de rekening?'] },
        { en: "I'll have a beer from the tap.", parts: ['Doe', FK(['mij', 'ik'], 0, 'woord', 'Doe mij maar: the beer comes to me, so mij.'), 'maar een biertje van de tap.'] },
        { en: "I'd like a piece of mature cheese.", parts: ['Ik', FK(['wil', 'wilt', 'willen'], 0, 'modal', 'ik wil. No t for ik.'), 'graag een stuk belegen kaas.'] },
        { en: 'Can I have a taste?', parts: ['Mag ik even', FK(['proeven', 'proef', 'te proeven'], 0, 'modal', 'After mag the verb goes whole to the end: proeven.'), '?'] },
        { en: 'A kilo of cheese costs € 12.', parts: ['Een kilo kaas', FK(['kost', 'kosten'], 0, 'presens', 'One kilo, so the hij-form. The stem kost already ends in t.'),
          FK(['twaalf euro', 'euro twaalf'], 0, 'getal', 'The number first, then euro: twaalf euro.'), '.'] },
        { en: 'Two stroopwafels cost € 5.', parts: ['Twee stroopwafels', FK(['kosten', 'kost'], 0, 'presens', 'Two waffles, plural: kosten.'), 'vijf euro.'] },
        { en: 'Every Thursday there is a cheese market.', parts: ['Elke donderdag', FK(['is er', 'er is'], 0, 'v2', 'Elke donderdag takes slot 1, so the verb comes next: is er.'), 'kaasmarkt.'] },
        { en: 'Tonight we eat on the Markt.', parts: ['Vanavond', FK(['eten we', 'we eten', 'eet we'], 0, 'v2', 'Vanavond in slot 1, the verb second, then we.'), 'op de Markt.'] },
        { en: "There's no cheese left.", parts: ['Er is', FK(['geen', 'niet'], 0, 'neg', 'kaas with no article: geen.'), 'kaas meer.'] },
        { w: 'the menu', nl: 'de kaart' }, { w: 'the waiter', nl: 'de ober' }, { w: 'the café', nl: 'het café' },
        { w: 'the cheese market', nl: 'de kaasmarkt' }, { w: 'the cheese porter', nl: 'de kaasdrager' }, { w: 'the syrup waffle', nl: 'de stroopwafel' },
        { w: 'the tip', nl: 'de fooi' }, { w: 'the kitchen', nl: 'de keuken' }, { w: 'the sauce', nl: 'de saus' },
        { read: true, nl: 'Mag ik de kaart zien, alstublieft?', en: 'May I see the menu, please?' },
        { read: true, nl: 'Voor mij hetzelfde, graag.', en: 'Same for me, please.' },
        { read: true, nl: 'Is alles naar wens?', en: 'Is everything to your liking?' },
        { read: true, nl: 'Nog een rondje, alstublieft.', en: 'Another round, please.' },
        { listen: true, nl: 'drie euro vijftig', en: '€ 3,50' }, { listen: true, nl: 'zeventien euro', en: '€ 17' },
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      ] },
  ]);
})();
