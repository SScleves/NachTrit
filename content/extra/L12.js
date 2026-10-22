(() => {
  // Level 12 De weg kwijt, longer: the station place in Gouda (tier 3, 8 words max). Asking the way to the
  // station, buying a ticket at the counter, the platform and the track, changing trains, delays, the bus that
  // does not run tonight, the bike and the bike shed, crossing the road. Present tense of all persons, questions
  // with the verb first, V2 after a time word, niet and geen, modal plus infinitive at the end, possessives.
  // Separable verbs only ever appear glued after a modal (overstappen, inchecken, oversteken), never split anywhere.
  // No clock times beyond what the level already has, no imperatives, no adjective -e (no volgende, no enkele reis).
  // Sources: vault _site/dialogues/een-treinkaartje-kopen (ik wil graag een kaartje naar Utrecht, Een retour,
  // alstublieft. Ik ben vanavond weer terug., Moet u ergens overstappen?, Deze trein is rechtstreeks, hoor.,
  // U hoeft niet over te stappen. (swapped for U hoeft niet te wachten, to keep separable verbs unsplit), Van welk perron vertrekt hij?, Kan ik met mijn OV-chipkaart inchecken?),
  // _site/dialogues/de-weg-vragen (Is het ver lopen?, Je kunt het niet missen.), _site/situations/polite-phrases
  // (Kunt u mij helpen? Ik zoek het station.), _site/situations/directions (oversteken, de plattegrond),
  // _site/sentences (De trein heeft weer vertraging., Mijn fiets staat bij het station., Ik neem elke ochtend de bus
  // naar mijn werk., Goedemiddag, mag ik uw kaartje even zien?), _site/words (de trein, de bus, de fietsenmaker,
  // nemen, welk, het verkeer), 02 - Grammar (presens, V2 word order, niet vs geen, modale werkwoorden, de vs het).
  // Replays: de trein and de vertraging (level 10).
  // Left out on purpose, because the shared distractor pool would make them right answers too: het spoor as a
  // word next to het perron (it lives in the listen spoor acht), rechtsaf next to rechts, de kaart next to
  // de plattegrond, vannacht next to vanavond, welke perron as a fork (heard often enough in speech).
  // Rules used: v2, modal, neg, dehet, mag, woord, zijn (data.js, levels.js), presens and vraag (district3.js),
  // bezit (town-gouda.js). New rules: none. New props: none, only fiets and brug.
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(12, { deliveries: 20, items: [
    // ---- builds: asking the way to the station
    { en: "Can you help me? I'm looking for the station.", parts: ['Kunt u mij', FK(['helpen', 'helpt', 'te helpen'], 0, 'modal', 'After kunt the second verb goes to the end as a bare infinitive: helpen.'), '? Ik',
      FK(['zoek', 'zoekt', 'zoeken'], 0, 'presens', 'ik takes the bare stem: zoek.'), 'het station.'] },
    { en: 'How far is it to the station?', parts: ['Hoe ver', FK(['is het', 'het is'], 0, 'v2', 'Hoe ver takes slot 1, so the verb comes next, then het.'), 'naar het station?'] },
    { en: 'We have to cross here.', parts: ['We', FK(['moeten', 'moet'], 0, 'modal', 'we is plural, so the modal is plural too: moeten.'), 'hier',
      FK(['oversteken', 'steken over', 'over te steken'], 0, 'modal', 'After a modal the verb stays whole at the end: oversteken.'), '.'] },
    { en: "Tomorrow we're going by bike.", parts: ['Morgen', FK(['gaan we', 'we gaan', 'gaat we'], 0, 'v2', 'Morgen takes slot 1, so the verb jumps ahead of we.'), 'met de fiets.'] },

    // ---- builds: at the ticket counter
    { en: "I'd like a ticket to Utrecht.", parts: ['Ik', FK(['wil', 'wilt', 'willen'], 0, 'modal', 'ik takes the bare stem of willen: wil. No t for ik.'), 'graag een kaartje naar Utrecht.'] },
    { en: "A return, please. I'll be back tonight.", parts: ['Een retour, alstublieft. Ik', FK(['ben', 'heb'], 0, 'zijn', 'Being back is built on zijn: ik ben terug.'), 'vanavond weer terug.'] },
    { en: 'Do I have to change anywhere?', parts: ['Moet ik ergens', FK(['overstappen', 'stap over', 'over te stappen'], 0, 'modal', 'After moet the verb goes whole to the end, no te: overstappen.'), '?'] },
    { en: 'This train is direct.', parts: [FK(['Deze', 'Dit'], 0, 'dehet', 'trein is a de-word, so this one is deze trein. dit is for het-words.'), 'trein is rechtstreeks, hoor.'] },
    { en: 'Which track does the train leave from?', parts: ['Van welk spoor', FK(['vertrekt de trein', 'de trein vertrekt', 'vertrekken de trein'], 0, 'v2', 'Question word in slot 1, then the verb, then de trein. One train: vertrekt.'), '?'] },
    { en: 'Can I check in with my OV-chipkaart?', parts: ['Kan ik met', FK(['mijn', 'mij', 'ik'], 0, 'bezit', 'Before a noun, my is mijn. mij and ik never stand in front of a noun.'), 'OV-chipkaart',
      FK(['inchecken', 'check in', 'in te checken'], 0, 'modal', 'After kan the verb goes whole to the end: inchecken.'), '?'] },

    // ---- builds: delays, the bus, the commute
    { en: 'My train is delayed again.', parts: ['Mijn trein', FK(['heeft', 'is'], 0, 'woord', 'Dutch says a train has delay: vertraging hebben. One train, so heeft.'), 'weer vertraging.'] },
    { en: "Tonight the bus isn't running.", parts: ['Vanavond', FK(['rijdt de bus', 'de bus rijdt'], 0, 'v2', 'Vanavond takes slot 1, so rijdt comes second and de bus follows it.'),
      FK(['niet', 'geen'], 0, 'neg', 'de bus already has its article, so there is nothing for geen to cancel: niet, at the end.'), '.'] },
    { en: 'Paola takes the bus to work.', parts: ['Paola', FK(['neemt', 'neem', 'nemen'], 0, 'presens', 'Paola is a zij: stem plus t, neemt.'), 'de bus naar',
      FK(['haar', 'zij'], 0, 'bezit', 'Her before a noun is haar. zij is she, the one doing it.'), 'werk.'] },

    // ---- words: the station, the counter and the road; four with the wrong article as the second sign
    { w: 'the train', nl: 'de trein' }, { w: 'the platform', nl: 'het perron', wrong: 'de perron' },
    { w: 'the train ticket', nl: 'het treinkaartje', wrong: 'de treinkaartje' }, { w: 'the ticket counter', nl: 'het loket', wrong: 'de loket' },
    { w: 'the traveller', nl: 'de reiziger' }, { w: 'the delay', nl: 'de vertraging' }, { w: 'the bike shed', nl: 'de fietsenstalling' },
    { w: 'the crossroads', nl: 'het kruispunt', wrong: 'de kruispunt' }, { w: 'the roundabout', nl: 'de rotonde' }, { w: 'the corner', nl: 'de hoek' },
    { w: 'to change (trains)', nl: 'overstappen' }, { w: 'to leave (a train, a bus)', nl: 'vertrekken' }, { w: 'direct (no changing)', nl: 'rechtstreeks' },

    // ---- reads: three traps with their own options, two plain lines from the platform and the passer-by
    { read: true, nl: 'U hoeft niet te wachten.', en: "You don't have to wait.",
      o: ["You don't have to wait.", "You're not allowed to wait.", "You mustn't wait."], a: 0, r: 'mag',
      w: "You don't have to wait. hoeft niet means there is no need. mag niet would be not allowed." },
    { read: true, nl: 'Is het ver lopen?', en: 'Is it a long walk?',
      o: ['Is it a long walk?', 'Is it a long run?', 'Is it a long drive?'], a: 0, r: 'woord',
      w: 'Is it a long walk? lopen is to walk. Running is rennen.' },
    { read: true, nl: 'Hoe laat gaat de trein?', en: 'What time does the train leave?',
      o: ['What time does the train leave?', 'How late is the train?', 'How long is the train ride?'], a: 0, r: 'vraag',
      w: 'What time does the train leave? hoe laat asks for the time on the clock, not how late.' },
    { read: true, nl: 'Je kunt het niet missen.', en: "You can't miss it." },
    { read: true, nl: 'Mag ik uw kaartje even zien?', en: 'May I see your ticket?' },

    // ---- listens: the station speaker and the road
    { listen: true, nl: 'spoor acht', en: 'track 8' }, { listen: true, nl: 'het verkeer', en: 'the traffic' }, { listen: true, nl: 'oversteken', en: 'to cross' },

    // ---- looks: the bike you came on, the bridge over the gracht on the way to the station
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
  ] });
})();
