// District 2: De wijk (levels 6 to 10). A1, 3 lanes, 5 words max per Dutch line.
//
// New props: none. Only hond, huis, fiets, kerk, boom, lamp, deur, winkel and nummer are used.
// New rules (added to window.RULES below):
//   spel  'Open and closed syllables'  -> vault note 'open vs gesloten lettergreep' (brood, broden)
//   pres  'Present tense'              -> vault note 'presens' (het duurt, ik wil, dat betekent)
// New field, level 8 only: word items carry `wrong`, the same noun with the wrong article
//   ('het hond'). The engine ignores it today. Level 8 is the de/het level, and word forks take
//   their distractors from other nouns in the level, so the article is never the thing being tested.
//   If itemToEntry puts `wrong` in as the first distractor, every level 8 word fork becomes a de/het gate.
// Days and months are bare (maandag, mei): they are used without an article, like the numbers.
// The whole file is wrapped in a function so FK does not clash with the FK const in levels.js.

(() => {
  window.RULES.spel = { name: 'Open and closed syllables', note: 'open vs gesloten lettergreep' };
  window.RULES.pres = { name: 'Present tense', note: 'presens' };

  const WIJK = { lanes: 3, speed: 12, maxSpeed: 14, ramp: false, lampDecay: 0.45, forkSlow: 0.3, hint: 'letter', obstacles: 'puddles', filler: [26, 36], deliveries: 10, cefr: 'A1', maxWords: 5 };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    { id: 6, act: 2, name: 'De supermarkt', theme: 'shops', ...WIJK,
      intro: 'The supermarket never closed. The staff never left. They still ask if you collect stamps.',
      introNl: 'De supermarkt is nooit dichtgegaan. Het personeel is nooit weggegaan. Ze vragen nog steeds of je zegels spaart.',
      mission: { where: 'The Albert Heijn on the corner. Aisle three goes further back than it used to.', carry: 'Your own bag. They will offer you one anyway.', want: 'The shelves whisper where the bread is. Find it, ask for it properly, pay by card.' },
      items: [
        { w: 'the supermarket', nl: 'de supermarkt' }, { w: 'the plastic bag', nl: 'het tasje' }, { w: 'the aisle', nl: 'het gangpad' },
        { w: 'the checkout', nl: 'de kassa' }, { w: 'the offer', nl: 'de aanbieding' }, { w: 'the basket', nl: 'het mandje' },
        { w: 'the butter', nl: 'de boter' }, { w: 'the banana', nl: 'de banaan' }, { w: 'the stamps', nl: 'de zegels' },
        { w: 'the bread', nl: 'het brood' }, { w: 'the cheese', nl: 'de kaas' }, { w: 'the egg', nl: 'het ei' },
        { w: '€ 2,15', nl: 'twee euro vijftien' }, { w: '€ 14', nl: 'veertien euro' },
        { read: true, nl: 'Kan ik pinnen?', en: 'Can I pay by card?' },
        { read: true, nl: 'In gangpad drie, achteraan.', en: 'Aisle three, at the back.' },
        { read: true, nl: 'Spaart u zegels?', en: 'Do you collect stamps?' },
        { read: true, nl: 'Wilt u een tasje erbij?', en: 'Would you like a bag with that?' },
        { read: true, nl: 'Dat was het.', en: "That's everything." },
        { listen: true, nl: 'achttien', en: '18' }, { listen: true, nl: 'het bonnetje', en: 'the receipt' }, { listen: true, nl: 'de rijst', en: 'the rice' },
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
        { look: true, prop: 'nummer', value: 16, nl: 'zestien', en: '16' },
        { en: 'Where do I find the bread?', parts: ['Waar vind ik', FK(['het', 'de'], 0, 'dehet', 'brood is a het-word. Learn it as het brood, never just brood.'), 'brood?'] },
        { en: 'Is this on offer?', parts: ['Is dit in', FK(['de', 'het'], 0, 'dehet', 'aanbieding is a de-word. Words ending in -ing are always de.'), 'aanbieding?'] },
        { en: 'Can I have two loaves, please?', parts: ['Mag ik twee', FK(['broden', 'brooden', 'broods'], 0, 'spel', 'brood, broden. The syllable opens up, so one o is enough: bro-den.'), ', alstublieft?'] },
        { en: '€ 2,20', parts: ['Twee', FK(['euro', "euro's"], 0, 'getal', 'In a price euro stays singular: twee euro twintig.'), 'twintig'] },
      ] },

    { id: 7, act: 2, name: 'De slager', theme: 'shops', ...WIJK,
      intro: 'The butcher is dead and still open. It is always a little more than you asked for.',
      introNl: 'De slager is dood en gewoon nog open. Het is altijd ietsje meer dan je vroeg.',
      mission: { where: 'The butcher two streets past the supermarket. The bell over the door still rings.', carry: 'Cash, just in case. The card machine went with everyone else.', want: 'Order by weight. He weighs in ons, counts in tens, and always asks if it can be a bit more.' },
      items: [
        { w: 'the butcher', nl: 'de slager' }, { w: 'the meat', nl: 'het vlees' }, { w: 'the mince', nl: 'het gehakt' },
        { w: 'the chicken breast', nl: 'de kipfilet' }, { w: 'the sausage', nl: 'de worst' }, { w: 'the slice', nl: 'het plakje' },
        { w: '30', nl: 'dertig' }, { w: '80', nl: 'tachtig' }, { w: '90', nl: 'negentig' }, { w: '100', nl: 'honderd' },
        { w: '500 grams', nl: 'een pond' }, { w: '1000 grams', nl: 'een kilo' },
        { w: '20', nl: 'twintig' }, { w: '14', nl: 'veertien' }, { w: '16', nl: 'zestien' }, { w: 'the plastic bag', nl: 'het tasje' },
        { read: true, nl: 'Anders nog iets?', en: 'Anything else?' },
        { read: true, nl: 'Mag het ietsje meer zijn?', en: 'Is a little more okay?' },
        { read: true, nl: 'Snijdt u het in plakjes?', en: 'Could you slice it?' },
        { read: true, nl: 'Nee, dat was het.', en: "No, that's all." },
        { listen: true, nl: 'vijfentwintig', en: '25' }, { listen: true, nl: 'zeventig', en: '70' }, { listen: true, nl: 'negenennegentig', en: '99' },
        { look: true, prop: 'nummer', value: 50, nl: 'vijftig', en: '50' }, { look: true, prop: 'nummer', value: 60, nl: 'zestig', en: '60' },
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' },
        { en: 'Can I have 200 grams of mince?', parts: ['Mag ik', FK(['twee ons', 'twintig ons', 'twee pond'], 0, 'getal', 'One ons is 100 grams, so 200 grams is twee ons. A pond is 500.'), 'gehakt?'] },
        { en: 'How much is the mince?', parts: ['Wat kost', FK(['het', 'de'], 0, 'dehet', 'Short words that start with ge- are het-words: het gehakt.'), 'gehakt?'] },
        { en: 'That is €40.', parts: ['Dat is', FK(['veertig', 'veertien', 'vierentig'], 0, 'getal', 'Tens end in -tig: veertig. The teens end in -tien: veertien.'), 'euro.'] },
        { en: 'That is €42.', parts: ['Dat is', FK(['tweeënveertig', 'veertigtwee', 'tweeveertig'], 0, 'getal', 'Units first, then en, then the tens: twee-en-veertig. The trema keeps ee and e apart.'), 'euro.'] },
      ] },

    { id: 8, act: 2, name: 'De of het', theme: 'street', ...WIJK,
      intro: 'The grammar book was never opened. Page one is still de or het.',
      introNl: 'Het grammaticaboek is nooit opengeslagen. Bladzijde één is nog steeds de of het.',
      mission: { where: 'A ruined house at the end of the street. Everything in it lost its label.', carry: 'A roll of labels. Half say de, half say het.', want: 'Every object wants its article back. Three out of four are de. The fourth one remembers.' },
      items: [
        { w: 'the dog', nl: 'de hond', wrong: 'het hond' }, { w: 'the door', nl: 'de deur', wrong: 'het deur' }, { w: 'the bread', nl: 'het brood', wrong: 'de brood' },
        { w: 'the egg', nl: 'het ei', wrong: 'de ei' }, { w: 'the cheese', nl: 'de kaas', wrong: 'het kaas' }, { w: 'the dogs', nl: 'de honden', wrong: 'het honden' },
        { w: 'the small beer', nl: 'het biertje', wrong: 'de biertje' }, { w: 'the name', nl: 'de naam', wrong: 'het naam' }, { w: 'the address', nl: 'het adres', wrong: 'de adres' },
        { w: 'the country', nl: 'het land', wrong: 'de land' }, { w: 'the postcode', nl: 'de postcode', wrong: 'het postcode' }, { w: 'the answer', nl: 'het antwoord', wrong: 'de antwoord' },
        { w: 'the teacher', nl: 'de docent', wrong: 'het docent' },
        { w: 'the plastic bag', nl: 'het tasje', wrong: 'de tasje' }, { w: 'the aisle', nl: 'het gangpad', wrong: 'de gangpad' }, { w: 'the offer', nl: 'de aanbieding', wrong: 'het aanbieding' },
        { w: 'the meat', nl: 'het vlees', wrong: 'de vlees' }, { w: 'the butcher', nl: 'de slager', wrong: 'het slager' },
        { read: true, nl: 'Het huis is oud.', en: 'The house is old.' },
        { read: true, nl: 'De golfbaan is mooi.', en: 'The golf course is beautiful.' },
        { read: true, nl: 'De honden zijn thuis.', en: 'The dogs are home.' },
        { listen: true, nl: 'het nummer', en: 'the number' }, { listen: true, nl: 'de buurman', en: 'the neighbour' },
        { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
        { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
        { en: 'the little dog', parts: [FK(['het', 'de'], 0, 'dehet', 'Every diminutive is a het-word, even when the dog is de hond.'), 'hondje'] },
        { en: 'the houses', parts: [FK(['de', 'het'], 0, 'dehet', 'Every plural is de. Het huis, de huizen.'), 'huizen'] },
        { en: 'the Dutch language', parts: [FK(['het', 'de'], 0, 'dehet', 'Languages are het-words: het Nederlands, het Spaans.'), 'Nederlands'] },
        { en: 'the mince', parts: [FK(['het', 'de'], 0, 'dehet', 'Two syllables starting with ge- is usually het: het gehakt, het gesprek.'), 'gehakt'] },
      ] },

    { id: 9, act: 2, name: 'Afhalen', theme: 'nightshop', ...WIJK,
      intro: 'Nobody has seen the pizza place since the mist. It still takes orders. Pickup only.',
      introNl: 'Niemand heeft de pizzeria nog gezien sinds de mist. Ze nemen nog steeds bestellingen aan. Alleen afhalen.',
      mission: { where: 'A takeaway with the lights off and the phone ringing.', carry: 'Two pizzas and a Tikkie for your wife. Some things the mist did not change.', want: 'They want alstublieft, not alsjeblieft. They are strangers now. They were always strangers.' },
      items: [
        { w: 'the pizza', nl: 'de pizza' }, { w: 'the fries', nl: 'de friet' }, { w: 'the sauce', nl: 'de saus' }, { w: 'the onion', nl: 'de ui' },
        { w: 'Monday', nl: 'maandag' }, { w: 'Tuesday', nl: 'dinsdag' }, { w: 'Friday', nl: 'vrijdag' }, { w: 'Saturday', nl: 'zaterdag' }, { w: 'Sunday', nl: 'zondag' },
        { w: 'please (to a stranger)', nl: 'alstublieft' }, { w: 'please (to a friend)', nl: 'alsjeblieft' }, { w: 'thank you (to a stranger)', nl: 'dank u wel' },
        { w: 'the address', nl: 'het adres' }, { w: 'the number', nl: 'het nummer' }, { w: '30', nl: 'dertig' },
        { read: true, nl: 'Mag het zonder ui?', en: 'Can it be without onion?' },
        { read: true, nl: 'Doet u er saus bij?', en: 'Do you add sauce?' },
        { read: true, nl: 'Bestelling voor Santi.', en: 'Order for Santi.' },
        { read: true, nl: 'Graag gedaan, hoor.', en: "You're welcome." },
        { read: true, nl: 'Sorry, ik begrijp het niet.', en: "Sorry, I don't understand." },
        { listen: true, nl: 'woensdag', en: 'Wednesday' }, { listen: true, nl: 'donderdag', en: 'Thursday' }, { listen: true, nl: 'de bestelling', en: 'the order' },
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
        { look: true, prop: 'nummer', value: 21, nl: 'eenentwintig', en: '21' },
        { en: 'How long will it take?', parts: ['Hoe lang', FK(['duurt', 'duren', 'duur'], 0, 'pres', 'het duurt: het takes the -t, just like hij.'), 'het?'] },
        { en: 'Are you open on Sunday?', parts: ['Bent u', FK(['zondag', 'zaterdag', 'maandag'], 0, 'woord', 'zondag is Sunday: zon, the sun.'), 'open?'] },
        { en: "I'd like to order.", parts: ['Ik', FK(['wil', 'wilt', 'willen'], 0, 'pres', 'ik wil, no -t. willen is for wij, jullie and zij.'), 'graag bestellen.'] },
        { en: 'What does that mean?', parts: ['Wat', FK(['betekent', 'beteken', 'betekenen'], 0, 'pres', 'dat works like hij: stem plus -t. Wat betekent dat?'), 'dat?'] },
      ] },

    { id: 10, act: 2, name: 'De kalender', theme: 'square', ...WIJK, obstacles: 'light', filler: [28, 38], deliveries: 12,
      intro: 'The church clock stopped when the mist came. Nobody knows what day it is. The bins still go out on Monday.',
      introNl: 'De kerkklok staat stil sinds de mist kwam. Niemand weet welke dag het is. De kliko gaat nog steeds op maandag aan de straat.',
      mission: { where: 'The church square. The clock face is the size of a door.', carry: 'A calendar from the year before the mist. Every birthday is still on it.', want: 'Put the days and months back in order. Today, tomorrow, yesterday. The dead lost count.' },
      items: [
        { w: 'the week', nl: 'de week' }, { w: 'the month', nl: 'de maand' }, { w: 'the year', nl: 'het jaar' },
        { w: 'January', nl: 'januari' }, { w: 'March', nl: 'maart' }, { w: 'June', nl: 'juni' }, { w: 'August', nl: 'augustus' }, { w: 'October', nl: 'oktober' }, { w: 'December', nl: 'december' },
        { w: 'today', nl: 'vandaag' }, { w: 'tomorrow', nl: 'morgen' }, { w: 'yesterday', nl: 'gisteren' }, { w: 'tonight', nl: 'vanavond' },
        { w: 'Monday', nl: 'maandag' }, { w: 'the order', nl: 'de bestelling' }, { w: 'the address', nl: 'het adres' },
        { read: true, nl: 'Tot morgen.', en: 'See you tomorrow.' },
        { read: true, nl: 'De winkel is zondag dicht.', en: 'The shop is closed on Sunday.' },
        { read: true, nl: 'Ik werk vandaag thuis.', en: 'I work from home today.' },
        { read: true, nl: 'De klok staat stil.', en: 'The clock has stopped.' },
        { listen: true, nl: 'september', en: 'September' }, { listen: true, nl: "'s ochtends", en: 'in the morning' }, { listen: true, nl: 'zaterdag', en: 'Saturday' },
        { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
        { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
        { en: 'this year', parts: [FK(['dit', 'deze'], 0, 'dehet', 'jaar is a het-word, so dit jaar. A de-word takes deze: deze week.'), 'jaar'] },
        { en: 'this week', parts: [FK(['deze', 'dit'], 0, 'dehet', 'week is a de-word, so deze week.'), 'week'] },
        { en: 'My birthday is in May.', parts: ['Mijn verjaardag is in', FK(['mei', 'mai', 'maai'], 0, 'woord', 'mei, with ei. Months take no capital in Dutch.')] },
        { en: 'It is Monday today.', parts: ['Het', FK(['is', 'zijn', 'ben'], 0, 'zijn', 'het is, like hij is.'), 'vandaag maandag.'] },
      ] },
  ]);
})();
