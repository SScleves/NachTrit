// Alblasserdam, tier 1 (A1): the four places it still lacked. Eten (42), Het station (43), Het werk (44), De sport (45).
// Single words and two-word phrases, 5 words max per Dutch line, 2 lanes. Grammar fence: de/het and zijn only.
//
// New props: none. Only hond, huis, lamp, brug, water, kerk, boom and molen are used.
// New rules: none. Forks use dehet, zijn, getal and groet.
// `wrong` on a word item is the same noun with the wrong article ('het koffie'). itemToEntry puts it in
//   as the first distractor, so those forks test the article as well as the word.
// Read lines with geen (43: 'Er is hier geen station.', 44: 'Ik heb geen blockers.') are reading only,
//   as the brief allows for niet/geen at A1.
// The whole file is wrapped in a function so the preset and FK do not clash with the consts in levels.js.

(() => {
  const ALB = { lanes: 2, speed: 11, maxSpeed: 13, ramp: false, lampDecay: 0.35, forkSlow: 0.25, hint: 'glow', obstacles: 'puddles', filler: [26, 36], deliveries: 10, cefr: 'A1', maxWords: 5 };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    // ---------------------------------------------------------------- 42
    { id: 42, act: 1, town: 'alblasserdam', place: 'eten', name: 'Eten en drinken', theme: 'dyke', ...ALB,
      intro: 'The café on the dyke never closed. The dead still order one round, and they still split the bill.',
      introNl: 'Het café op de dijk is nooit dichtgegaan. De doden bestellen nog steeds één rondje, en ze delen nog steeds de rekening.',
      mission: { where: 'The café on the dyke, the terrace that looks out over the Noord.', carry: 'Your wallet. You pay your share, to the cent.', want: 'They only take the order in Dutch. Coffee, beer, the bill, and the word for cheers.' },
      items: [
        { w: 'the coffee', nl: 'de koffie', wrong: 'het koffie' }, { w: 'the tea', nl: 'de thee' }, { w: 'the beer', nl: 'het bier', wrong: 'de bier' },
        { w: 'the small beer', nl: 'het biertje', wrong: 'de biertje' }, { w: 'the café', nl: 'het café', wrong: 'de café' }, { w: 'the terrace', nl: 'het terras' },
        { w: 'the drinks after work', nl: 'de borrel' }, { w: 'the bill', nl: 'de rekening' }, { w: 'the menu', nl: 'de menukaart' },
        { w: 'the sugar', nl: 'de suiker' }, { w: 'the apple pie', nl: 'de appeltaart' }, { w: 'the glass', nl: 'het glas' },
        { w: 'the round of drinks', nl: 'het rondje' }, { w: 'the waiter', nl: 'de ober' },
        { read: true, nl: 'Twee bier, alstublieft.', en: 'Two beers, please.' },
        { read: true, nl: 'Doe mij maar een biertje.', en: "I'll have a beer." },
        { read: true, nl: 'Zwart, zonder suiker.', en: 'Black, no sugar.' },
        { read: true, nl: 'Mag ik de rekening?', en: 'Can I have the bill?' },
        { read: true, nl: 'Zullen we het even splitten?', en: 'Shall we split it?' },
        { listen: true, nl: 'proost', en: 'cheers' }, { listen: true, nl: 'lekker', en: 'tasty' },
        { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
        { en: 'Cheers, to the weekend.', parts: ['Proost, op', FK(['het', 'de'], 0, 'dehet', 'weekend is a het-word: het weekend.'), 'weekend.'] },
        { en: 'The café is open.', parts: [FK(['Het', 'De'], 0, 'dehet', 'café is a het-word, like het restaurant.'), 'café is open.'] },
        { en: 'The bitterballen are hot.', parts: ['De bitterballen', FK(['zijn', 'is'], 0, 'zijn', 'More than one bitterbal, so zijn.'), 'heet.'] },
        { en: 'We split the bill.', parts: ['Wij delen', FK(['de', 'het'], 0, 'dehet', 'Words ending in -ing are always de: de rekening.'), 'rekening.'] },
      ] },

    // ---------------------------------------------------------------- 43
    { id: 43, act: 1, town: 'alblasserdam', place: 'station', name: 'Het station', theme: 'square', ...ALB,
      intro: 'Alblasserdam has no train station. The dead wait there anyway, for the train.',
      introNl: 'Alblasserdam heeft geen station. De doden wachten er toch, op de trein.',
      mission: { where: 'The bus stop on the square, then the ferry landing on the Noord.', carry: 'A ticket for a train that never comes.', want: 'They ask where things are. Left, right, here, there. One word is enough.' },
      items: [
        { w: 'left', nl: 'links' }, { w: 'right', nl: 'rechts' }, { w: 'here', nl: 'hier' }, { w: 'there', nl: 'daar' }, { w: 'straight on', nl: 'rechtdoor' },
        { w: 'the bus', nl: 'de bus' }, { w: 'the bus stop', nl: 'de bushalte' }, { w: 'the ferry', nl: 'de pont' },
        { w: 'the station', nl: 'het station', wrong: 'de station' }, { w: 'the ticket', nl: 'het kaartje', wrong: 'de kaartje' },
        { w: 'now', nl: 'nu' }, { w: 'in a bit', nl: 'straks' }, { w: 'the hour', nl: 'het uur', wrong: 'de uur' },
        { w: 'the café', nl: 'het café' }, { w: 'the street', nl: 'de straat' },
        { read: true, nl: 'De bus is laat.', en: 'The bus is late.' },
        { read: true, nl: 'Daar is de pont.', en: "There's the ferry." },
        { read: true, nl: 'Hoe laat is het?', en: 'What time is it?' },
        { read: true, nl: 'Er is hier geen station.', en: "There's no station here." },
        { read: true, nl: 'Om tien uur.', en: "At ten o'clock." },
        { listen: true, nl: 'rechts', en: 'right' }, { listen: true, nl: 'de pont', en: 'the ferry' },
        { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
        { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
        { en: 'The bus is here.', parts: ['De bus', FK(['is', 'zijn'], 0, 'zijn', 'One bus, so is. Like hij is.'), 'hier.'] },
        { en: 'Where is the station?', parts: ['Waar is', FK(['het', 'de'], 0, 'dehet', 'station is a het-word: het station.'), 'station?'] },
        { en: "It is ten o'clock.", parts: ['Het is tien', FK(['uur', 'uren'], 0, 'getal', 'On the clock uur stays singular: tien uur.')] },
        { en: 'The ticket, please.', parts: [FK(['Het', 'De'], 0, 'dehet', 'Every -je word is het: het kaartje.'), 'kaartje, alstublieft.'] },
      ] },

    // ---------------------------------------------------------------- 44
    { id: 44, act: 1, town: 'alblasserdam', place: 'werk', name: 'Het werk', theme: 'street', ...ALB,
      intro: 'The standup starts at nine. The dogs need a walk at nine. The dogs win.',
      introNl: 'De standup begint om negen uur. De honden moeten om negen uur uit. De honden winnen.',
      mission: { where: 'The back bedroom. The home office, camera off.', carry: 'A laptop on four percent and a cold coffee.', want: 'The team still dials in. They want the morning greeting and the words for what broke.' },
      items: [
        { w: 'the laptop', nl: 'de laptop' }, { w: 'the meeting', nl: 'de vergadering', wrong: 'het vergadering' }, { w: 'the dashboard', nl: 'het dashboard', wrong: 'de dashboard' },
        { w: 'the outage', nl: 'de storing' }, { w: 'the colleague', nl: 'de collega' }, { w: 'the standup', nl: 'de standup' },
        { w: 'the screen', nl: 'het scherm' }, { w: 'the alert', nl: 'de melding' }, { w: 'the office', nl: 'het kantoor', wrong: 'de kantoor' },
        { w: 'the calendar', nl: 'de agenda' }, { w: 'good morning, everyone', nl: 'goedemorgen allemaal' },
        { w: 'the coffee', nl: 'de koffie' }, { w: 'in a bit', nl: 'straks' }, { w: 'now', nl: 'nu' },
        { read: true, nl: 'Zullen we beginnen?', en: 'Shall we start?' },
        { read: true, nl: 'Ik heb geen blockers.', en: 'No blockers.' },
        { read: true, nl: 'Druk vandaag?', en: 'Busy today?' },
        { read: true, nl: 'Even kijken.', en: 'Let me have a look.' },
        { read: true, nl: 'Alles is weer groen.', en: 'Everything is green again.' },
        { listen: true, nl: 'de vergadering', en: 'the meeting' }, { listen: true, nl: 'komt goed', en: "it'll be fine" }, { listen: true, nl: 'het overleg', en: 'the sync' },
        { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
        { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
        { en: 'Good morning, everyone.', parts: ['Goedemorgen', FK(['allemaal', 'alle'], 0, 'groet', 'allemaal is everyone. alle needs a noun after it: alle collega\'s.')] },
        { en: 'The laptop is broken.', parts: ['De laptop', FK(['is', 'zijn'], 0, 'zijn', 'One laptop, so is.'), 'kapot.'] },
        { en: 'The dashboard is green.', parts: [FK(['Het', 'De'], 0, 'dehet', 'dashboard is a het-word: het dashboard.'), 'dashboard is groen.'] },
        { en: 'The meeting is now.', parts: [FK(['De', 'Het'], 0, 'dehet', 'Words ending in -ing are always de: de vergadering.'), 'vergadering is nu.'] },
      ] },

    // ---------------------------------------------------------------- 45
    { id: 45, act: 1, town: 'alblasserdam', place: 'sport', name: 'De sport', theme: 'dyke', ...ALB,
      intro: 'Golf on Saturday, the dogs on Sunday. Nobody asked the dogs.',
      introNl: 'Zaterdag golf, zondag de honden. Niemand heeft het aan de honden gevraagd.',
      mission: { where: 'The dyke path to the golf course, then back through the park.', carry: 'Two dogs on one lead, a bag of golf balls, no helmet.', want: 'The dead on the fairway want the words for the ball, the lead and the walk. Mooie slag earns extra.' },
      items: [
        { w: 'the golf course', nl: 'de golfbaan' }, { w: 'the ball', nl: 'de bal', wrong: 'het bal' }, { w: 'the little ball', nl: 'het balletje', wrong: 'de balletje' },
        { w: 'the shot', nl: 'de slag' }, { w: 'the clubhouse', nl: 'het clubhuis', wrong: 'de clubhuis' }, { w: 'the bunker', nl: 'de bunker' },
        { w: 'the dog', nl: 'de hond', wrong: 'het hond' }, { w: 'the lead', nl: 'de riem' }, { w: 'the park', nl: 'het park' },
        { w: 'to walk', nl: 'wandelen' }, { w: 'to walk the dog', nl: 'uitlaten' }, { w: 'the poo bag', nl: 'het poepzakje' },
        { w: 'left', nl: 'links' }, { w: 'in a bit', nl: 'straks' }, { w: 'the colleague', nl: 'de collega' },
        { read: true, nl: 'Mooie slag.', en: 'Nice shot.' },
        { read: true, nl: 'Ik baal.', en: "I'm gutted." },
        { read: true, nl: 'Ik laat de honden uit.', en: "I'm walking the dogs." },
        { read: true, nl: 'Hij doet niks, hoor.', en: "He's harmless." },
        { listen: true, nl: 'de riem', en: 'the lead' }, { listen: true, nl: 'het clubhuis', en: 'the clubhouse' }, { listen: true, nl: 'wandelen', en: 'to walk' },
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
        { look: true, prop: 'water', nl: 'het water', en: 'the water' },
        { en: 'The dogs are outside.', parts: ['De honden', FK(['zijn', 'is'], 0, 'zijn', 'Two dogs, so zijn.'), 'buiten.'] },
        { en: 'The little ball is gone.', parts: [FK(['Het', 'De'], 0, 'dehet', 'Every -je word is het, and Dutch golfers always say balletje.'), 'balletje is weg.'] },
        { en: 'I am on the golf course.', parts: ['Ik', FK(['ben', 'is'], 0, 'zijn', 'ik ben. Always.'), 'op de golfbaan.'] },
        { en: 'We walk in the park.', parts: ['Wij wandelen in', FK(['het', 'de'], 0, 'dehet', 'park is a het-word: het park.'), 'park.'] },
      ] },
  ]);
})();
