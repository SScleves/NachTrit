// Nachtrit, Utrecht (tier 5, A2): level 61, Eten en drinken. The wharf cafés on the Oudegracht, a takeaway,
// the Saturday market on Vredenburg, ordering, the bill and splitting it.
// Fence: tier 4 plus separable verbs split in the present (Ik haal het om half negen op), zijn + aan het + infinitive,
// gaan + infinitive for the future, telling the time, the imperative. 10 words max, no perfectum, no sub-clauses.
// Sources: dutch-lessons vault, _site/situations/restaurant (Mag ik de rekening, Kunnen we apart betalen, Wat kunt u
// aanraden), takeaway (Bestelling voor Santi, Doet u er saus bij, Mag het zonder ui, Ik haal het over twintig minuten op),
// pub (Doe mij maar een biertje van de tap, Wat raadt u aan), _site/dialogues/uit-eten-met-vrienden (Neem de vis. Die is
// hier heerlijk, witbiertje, de rekening delen), 02 - Grammar (scheidbare werkwoorden, aan het + infinitief,
// futurum - gaan + infinitief), _site/grammar/de-imperatief-commands, _site/words (inschenken, meenemen, opeten),
// and content/towns.js for Utrecht (de werf, het terras, de kelder, the Dom, the lost bikes).
//
// New rules: gebod (imperative) -> 'de-imperatief-commands'; klok (telling the time) -> 'MOC Tijd, dagen & maanden'
// (the vault has no clock note of its own). Each is declared only if missing. sep, aanhet, fut, v2, presens reused.
// New props: none. Only water, brug and kerk are used.
(() => {
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 61, act: 5, name: 'Eten en drinken', town: 'utrecht', place: 'eten', theme: 'square', ...P,
    intro: 'The kitchens in the wharf cellars close at a quarter to ten, mist or no mist. The dead order at five to ten and ask if it is still possible.',
    introNl: 'De keukens in de werfkelders gaan om kwart voor tien dicht, mist of geen mist. De doden bestellen om vijf voor tien en vragen of het nog kan.',
    mission: { where: 'The wharf cellars along the Oudegracht, a takeaway behind the Neude and the Saturday market on Vredenburg. The Dom watches all of it.',
      carry: 'A reservation for half past eight under Santiago, two dogs who need a walk, and no helmet. The dogs always need a walk.',
      want: 'Order, pass the sauce, pick it up, settle up. The waitress is taller than you, the grammar book is still in its wrapper, and nobody leaves before the bill is split.' },
    items: [
      // ---- builds: separable verbs split, aan het, gaan + infinitive, the time, the imperative
      { en: "I'll pick it up at half past eight.", parts: ['Ik', FK(['haal', 'ophaal', 'haalt'], 0, 'sep', 'ophalen splits in the present: haal sits in slot 2, op waits at the end.'), 'het om',
        FK(['half negen', 'half acht'], 0, 'klok', 'Dutch counts half towards the next hour: half negen is 8:30, half acht is 7:30.'), 'op.'] },
      { en: 'What do you recommend? (polite)', parts: ['Wat', FK(['raadt', 'aanraadt', 'raad'], 0, 'sep', 'aanraden splits: raadt in slot 2, aan at the end. And u always takes the -t.'), 'u aan?'] },
      { en: 'The waiter pours the wine.', parts: ['De ober', FK(['schenkt', 'inschenkt'], 0, 'sep', 'inschenken splits: schenkt in slot 2, in at the end.'), 'de wijn',
        FK(['in', 'inschenken'], 0, 'sep', 'Only the prefix goes to the end in the present: de wijn in.'), '.'] },
      { en: 'The dogs eat everything up.', parts: ['De honden', FK(['eten', 'opeten', 'eet'], 0, 'sep', 'opeten splits: eten in slot 2, op at the end. Two dogs, so the plural eten.'), 'alles op.'] },
      { en: 'Just pass the sauce along.', parts: [FK(['Geef', 'Te geven', 'Geven'], 0, 'gebod', 'A command is the bare stem: geef. No te, no -en.'), 'de saus even',
        FK(['door', 'doorgeven'], 0, 'sep', 'doorgeven splits in a command too: geef ... door.'), '.'] },
      { en: "Get the fish. It's delicious here.", parts: [FK(['Neem', 'Te nemen', 'Nemen'], 0, 'gebod', 'The imperative is the stem of nemen: neem.'), 'de vis. Die is hier heerlijk.'] },
      { en: 'Come in, have a seat.', parts: [FK(['Kom', 'Te komen', 'Komen'], 0, 'gebod', 'Kom binnen: the bare stem, nothing added.'), 'binnen,',
        FK(['ga maar zitten', 'ga maar te zitten', 'ga maar zit'], 0, 'gebod', 'ga is the command, maar makes it friendly, zitten closes it as an infinitive.'), '.'] },
      { en: 'The chef is cooking right now.', parts: ['De kok', FK(['is', 'heeft'], 0, 'aanhet', 'aan het always runs on zijn: de kok is aan het koken.'), 'nu aan het',
        FK(['koken', 'kookt'], 0, 'aanhet', 'After aan het comes the infinitive: koken.'), '.'] },
      { en: 'Paola is still choosing.', parts: ['Paola is nog aan het', FK(['kiezen', 'kiest', 'te kiezen'], 0, 'aanhet', 'aan het takes the bare infinitive: kiezen, no te.'), '.'] },
      { en: 'The students are drinking down on the wharf.', parts: ['De studenten', FK(['zijn', 'is'], 0, 'presens', 'studenten is plural, so zijn.'), 'op de werf aan het',
        FK(['drinken', 'drinkt'], 0, 'aanhet', 'aan het plus the infinitive: drinken.'), '.'] },
      { en: 'What are we going to eat tonight?', parts: ['Wat', FK(['gaan', 'gaat'], 0, 'fut', 'With we the verb is gaan.'), 'we vanavond',
        FK(['eten', 'eet', 'te eten'], 0, 'fut', 'gaan sends the infinitive to the end: eten.'), '?'] },
      { en: 'On Saturday we are going to buy cheese at the market.', parts: ['Zaterdag', FK(['gaan we', 'we gaan'], 0, 'v2', 'A time word first, then the verb in slot 2: Zaterdag gaan we.'), 'op de markt kaas',
        FK(['kopen', 'koopt'], 0, 'fut', 'After gaan the infinitive closes the sentence: kopen.'), '.'] },
      { en: 'Are we going to split the bill?', parts: [FK(['Gaan', 'Gaat'], 0, 'fut', 'A question starts with the verb, and we takes gaan.'), 'we de rekening',
        FK(['delen', 'deelt', 'te delen'], 0, 'fut', 'gaan plus the bare infinitive at the end: delen.'), '?'] },
      { en: 'The kitchen closes at a quarter to ten.', parts: ['De keuken', FK(['gaat', 'dichtgaat'], 0, 'sep', 'dichtgaan splits: gaat in slot 2, dicht at the end.'), 'om',
        FK(['kwart voor tien', 'kwart over tien', 'kwart voor negen'], 0, 'klok', 'kwart voor tien is 9:45, a quarter before ten.'), 'dicht.'] },
      { en: "I'm taking the rest home.", parts: ['Ik neem de rest', FK(['mee', 'meenemen'], 0, 'sep', 'meenemen splits: neem in slot 2, only mee goes to the back.'), 'naar huis.'] },

      // ---- words
      { w: 'the waiter', nl: 'de ober' }, { w: 'the chef', nl: 'de kok' },
      { w: 'the bill', nl: 'de rekening', wrong: 'het rekening' }, { w: 'the menu', nl: 'de menukaart' },
      { w: 'the terrace', nl: 'het terras', wrong: 'de terras' }, { w: 'the wharf', nl: 'de werf' },
      { w: 'the wheat beer', nl: 'het witbiertje', wrong: 'de witbiertje' }, { w: 'the tip', nl: 'de fooi', wrong: 'het fooi' },
      { w: 'the starter', nl: 'het voorgerecht', wrong: 'de voorgerecht' }, { w: 'the dessert', nl: 'het nagerecht' },
      { w: 'the order', nl: 'de bestelling' }, { w: 'the sauce', nl: 'de saus' }, { w: 'the onion', nl: 'de ui' },
      { w: 'the steak', nl: 'de biefstuk' }, { w: 'the knife', nl: 'het mes', wrong: 'de mes' },
      { w: 'the market stall', nl: 'de kraam' }, { w: 'the bitterbal', nl: 'de bitterbal' }, { w: 'the Friday drinks', nl: 'de borrel' },
      { w: 'to settle up', nl: 'afrekenen' }, { w: 'to recommend', nl: 'aanraden' }, { w: 'to take away', nl: 'meenemen' },

      // ---- read
      { read: true, nl: 'We rekenen apart af.', o: ['We pay separately.', 'We pay together.', 'We already paid.'], a: 0, r: 'sep',
        w: 'apart is separately, and afrekenen splits: the af lands at the end.' },
      { read: true, nl: 'Ik ben nog aan het eten.', o: ['I am still eating.', 'I have already eaten.', 'I am going to eat.'], a: 0, r: 'aanhet',
        w: 'zijn aan het eten is happening right now. Going to eat would be ik ga eten.' },
      { read: true, nl: 'Hoe laat gaat de keuken dicht?', o: ['What time does the kitchen close?', 'What time does the kitchen open?', 'How long is the kitchen closed?'], a: 0, r: 'sep',
        w: 'dichtgaan is to close, and dicht waits at the end. Open would be opengaan.' },
      { read: true, nl: 'Het is kwart over acht.', o: ['It is a quarter past eight.', 'It is a quarter to eight.', 'It is half past eight.'], a: 0, r: 'klok',
        w: 'kwart over is past the hour, kwart voor is before it.' },
      { read: true, nl: 'Doe mij maar een biertje van de tap.', en: "I'll have a draft beer." },
      { read: true, nl: 'Eet smakelijk.', en: 'Enjoy your meal.' },

      // ---- listen
      { listen: true, nl: 'half negen', en: '8:30' }, { listen: true, nl: 'achtenveertig euro', en: '€ 48' },
      { listen: true, nl: 'drie euro vijftig', en: '€ 3,50' },

      // ---- look
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- de of het
      { dehet: true, nl: 'bord', art: 'het', en: 'the plate' },
      { dehet: true, nl: 'servet', art: 'het', en: 'the napkin' },
    ] }]);
})();
