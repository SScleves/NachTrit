// Nachtrit levels. Act 1 is playable. Later acts are named and locked until their content lands.
// item kinds: {w:'the dog', nl:'de hond'} word (English prompt, Dutch signs)
//             {read:true, nl:'Hallo', en:'Hello'} reading (Dutch on the board, English signs)
//             {listen:true, nl:'de hond', en:'the dog'} listening (you hear it, Dutch signs)
//             {en:'I am', parts:[...]} build, same shape as data.js
// Level knobs: lanes, speed, maxSpeed, ramp, lampDecay, forkSlow (fraction of speed at a fork), hint, obstacles, filler [min,max]

window.RULES.woord = { name: 'Vocabulary', note: 'MOC Woordenschat' };
window.RULES.getal = { name: 'Numbers', note: 'MOC Getallen' };
window.RULES.groet = { name: 'Greetings', note: 'H01 — Welkom' };
window.RULES.zijn = { name: 'zijn (to be)', note: 'zijn' };

const A1 = { lanes: 2, speed: 11, maxSpeed: 13, ramp: false, lampDecay: 0.35, forkSlow: 0.25, hint: 'glow', obstacles: 'none', filler: [26, 36], deliveries: 6, cefr: 'A1', maxWords: 6 };
const FK = (o, a, r, w) => ({ o, a, r, w });

window.LEVELS = [
  { id: 1, act: 1, name: 'De honden', ...A1, theme: 'street',
    mission: { where: 'Your own street, to the end and back.', carry: 'Two dogs on a leash. They know the way, you don\'t.', want: 'The dead at each door want to hear the word for what you carry past them.' },
    items: [
      { w: 'the dog', nl: 'de hond' }, { w: 'the house', nl: 'het huis' }, { w: 'the woman', nl: 'de vrouw' }, { w: 'the garden', nl: 'de tuin' },
      { w: 'the door', nl: 'de deur' }, { w: 'the street', nl: 'de straat' }, { w: 'the bike', nl: 'de fiets' }, { w: 'the lamp', nl: 'de lamp' },
      { w: 'the night', nl: 'de nacht' }, { w: 'the mist', nl: 'de mist' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
    ] },

  { id: 2, act: 1, name: 'De buren', ...A1, theme: 'street',
    mission: { where: 'The neighbours, three doors down.', carry: 'A candle. Theirs went out with everything else.', want: 'They only answer to greetings. Say the right one and the door opens.' },
    items: [
      { w: 'hello', nl: 'hallo' }, { w: 'good morning', nl: 'goedemorgen' }, { w: 'good evening', nl: 'goedenavond' }, { w: 'bye', nl: 'doei' },
      { w: 'thank you', nl: 'dank je wel' }, { w: 'please', nl: 'alsjeblieft' }, { w: 'sorry', nl: 'sorry' }, { w: 'yes', nl: 'ja' }, { w: 'no', nl: 'nee' },
      { read: true, nl: 'Hallo', en: 'Hello' }, { read: true, nl: 'Goedenavond', en: 'Good evening' }, { read: true, nl: 'Dank je wel', en: 'Thank you' }, { read: true, nl: 'Doei', en: 'Bye' },
    ] },

  { id: 3, act: 1, name: 'De brievenbus', ...A1, theme: 'dyke', obstacles: 'puddles',
    mission: { where: 'Ten houses on the dyke road.', carry: 'Letters. Nobody wrote them, everybody is waiting for them.', want: 'The numbers are the only thing left on the doors. Match them or ride on.' },
    items: [
      { w: '0', nl: 'nul' }, { w: '1', nl: 'een' }, { w: '2', nl: 'twee' }, { w: '3', nl: 'drie' }, { w: '4', nl: 'vier' }, { w: '5', nl: 'vijf' }, { w: '6', nl: 'zes' },
      { w: '7', nl: 'zeven' }, { w: '8', nl: 'acht' }, { w: '9', nl: 'negen' }, { w: '10', nl: 'tien' }, { w: '11', nl: 'elf' }, { w: '12', nl: 'twaalf' },
      { listen: true, nl: 'zeven', en: '7' }, { listen: true, nl: 'drie', en: '3' }, { listen: true, nl: 'negen', en: '9' },
      { look: true, prop: 'nummer', value: 4, nl: 'vier', en: '4' }, { look: true, prop: 'nummer', value: 8, nl: 'acht', en: '8' }, { look: true, prop: 'nummer', value: 11, nl: 'elf', en: '11' }, { look: true, prop: 'nummer', value: 6, nl: 'zes', en: '6' },
    ] },

  { id: 4, act: 1, name: 'Ik ben', ...A1, theme: 'square', obstacles: 'puddles', filler: [30, 40],
    mission: { where: 'The church. Someone is still ringing the bell.', carry: 'Your name. It\'s all they ask for.', want: 'Say who you are, who they are, who we all are. The verb zijn, nothing else.' },
    items: [
      { en: 'I am', parts: ['Ik', FK(['ben', 'bent'], 0, 'zijn', 'ik ben. Always.')] },
      { en: 'you are', parts: ['Jij', FK(['bent', 'ben'], 0, 'zijn', 'jij bent. The -t belongs to jij.')] },
      { en: 'he is', parts: ['Hij', FK(['is', 'zijn'], 0, 'zijn', 'hij is, zij is, het is.')] },
      { en: 'she is', parts: ['Zij', FK(['is', 'bent'], 0, 'zijn', 'zij is. Same as hij.')] },
      { en: 'we are', parts: ['Wij', FK(['zijn', 'is'], 0, 'zijn', 'wij zijn. Every plural takes zijn.')] },
      { en: 'you all are', parts: ['Jullie', FK(['zijn', 'bent'], 0, 'zijn', 'jullie zijn. Plural, so zijn.')] },
      { en: 'they are', parts: ['Zij', FK(['zijn', 'is'], 0, 'zijn', 'zij zijn when zij means they.')] },
      { en: 'I am Santi.', parts: ['Ik', FK(['ben', 'is'], 0, 'zijn', 'ik ben Santi.'), 'Santi.'] },
      { en: 'We are home.', parts: ['Wij', FK(['zijn', 'ben'], 0, 'zijn', 'wij zijn thuis.'), 'thuis.'] },
      { w: 'the church', nl: 'de kerk' }, { w: 'the tree', nl: 'de boom' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
      { read: true, nl: 'Ik ben thuis.', en: 'I am home.' },
      { read: true, nl: 'Wij zijn buren.', en: 'We are neighbours.' },
    ] },

  { id: 5, act: 1, name: 'Nachtwinkel', ...A1, theme: 'nightshop', obstacles: 'puddles', filler: [28, 38], deliveries: 8,
    mission: { where: 'The corner shop. Open at 3 AM, lights off.', carry: 'A shopping list in a dead man\'s handwriting.', want: 'Milk, bread, eggs. The shelves whisper the prices. Pay and leave.' },
    items: [
      { w: 'the milk', nl: 'de melk' }, { w: 'the bread', nl: 'het brood' }, { w: 'the egg', nl: 'het ei' }, { w: 'the cheese', nl: 'de kaas' }, { w: 'the apple', nl: 'de appel' },
      { w: 'the water', nl: 'het water' }, { w: 'the coffee', nl: 'de koffie' }, { w: 'the tea', nl: 'de thee' }, { w: 'the beer', nl: 'het bier' }, { w: 'the wine', nl: 'de wijn' },
      { w: '13', nl: 'dertien' }, { w: '14', nl: 'veertien' }, { w: '15', nl: 'vijftien' }, { w: '16', nl: 'zestien' }, { w: '17', nl: 'zeventien' }, { w: '18', nl: 'achttien' }, { w: '19', nl: 'negentien' }, { w: '20', nl: 'twintig' },
      { listen: true, nl: 'de melk', en: 'the milk' }, { listen: true, nl: 'het brood', en: 'the bread' }, { listen: true, nl: 'twintig', en: '20' },
      { w: 'the shop', nl: 'de winkel' }, { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
    ] },

  // ---- later acts: named, locked until their content lands ----
  { id: 6, act: 2, name: 'De supermarkt', soon: true }, { id: 7, act: 2, name: 'De slager', soon: true }, { id: 8, act: 2, name: 'De of het', soon: true },
  { id: 9, act: 2, name: 'Afhalen', soon: true }, { id: 10, act: 2, name: 'De kalender', soon: true },
  { id: 11, act: 3, name: 'Werkwoorden', soon: true }, { id: 12, act: 3, name: 'De weg kwijt', soon: true }, { id: 13, act: 3, name: 'Nieuwe mensen', soon: true },
  { id: 14, act: 3, name: 'Niet of geen', soon: true }, { id: 15, act: 3, name: 'Mag ik?', soon: true },
  { id: 16, act: 4, name: 'De standup', soon: true }, { id: 17, act: 4, name: 'Naar de golfbaan', soon: true }, { id: 18, act: 4, name: 'Uitlaten', soon: true },
  { id: 19, act: 4, name: 'Morgen', soon: true }, { id: 20, act: 4, name: 'Aan het werk', soon: true },
  { id: 21, act: 5, name: 'Omdat', soon: true }, { id: 22, act: 5, name: 'Die of dat', soon: true }, { id: 23, act: 5, name: 'Vroeger', soon: true },
  { id: 24, act: 5, name: 'Bij de politie', soon: true }, { id: 25, act: 5, name: 'Dageraad', soon: true },
];
window.ACTS = { 1: 'Thuisstraat', 2: 'De wijk', 3: 'Het dorp', 4: 'Kantoor en baan', 5: 'De lange nacht' };
