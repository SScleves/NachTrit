(() => {
  // Level 11 Werkwoorden, longer: the werk place in Gouda (tier 3, 8 words max). The office and the home office,
  // the standup, meetings, incidents, colleagues and the laptop, all in the present tense: ik stem, jij and u stem
  // plus t, plural infinitive, the t that drops after the verb (vind je, kun jij) and stays for u (werkt u), stem
  // spelling (ik zeg, ik stuur, hij weet, hij wacht), V2 after a time word, modal plus infinitive, niet and geen.
  // Sources: 04 - Phrases & Scenarios/De standup - tech talk (Goedemorgen allemaal, zullen we beginnen?, the review
  // of Mark), Koffiepraatje op kantoor (het doet het niet), Uitleggen wat je doet - Dynatrace (jij kunt mijn wifi
  // fixen, wij zien het probleem), 01 - Vocabulary/storing (de storing, de melding, piket, oplossen) and vergadering,
  // Werk MOC (Komt goed), 03 - Verbs (werken, vinden: vind jij?, kunnen: kun je?, hebben), 02 - Grammar (presens,
  // open vs gesloten lettergreep, V2 word order, modale werkwoorden, niet vs geen), _site/situations/office (Heb je
  // even?), _site/sentences (Hoe laat begint de vergadering?, Sorry, ik begrijp het niet., Ik stuur mijn vrouw even
  // een berichtje., Tegen mijn baas zeg ik nog steeds u., Vind je je werk leuk?, het wachtwoord van de wifi).
  // Rules used: presens and vraag (district3.js), spel (district2.js), bezit (town-gouda.js), v2, modal, neg, woord.
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(11, { deliveries: 20, items: [
    // the standup and the meeting
    { en: 'Morning everyone, shall we start?', parts: ['Goedemorgen allemaal,', FK(['zullen', 'zal', 'zult'], 0, 'modal', 'we takes the plural: zullen. zal and zult are for one person.'), 'we',
      FK(['beginnen', 'begint', 'te beginnen'], 0, 'modal', 'zullen sends the second verb to the end as a bare infinitive: beginnen.'), '?'] },
    { en: 'The standup starts at nine.', parts: ['Om negen uur', FK(['begint', 'beginnen', 'begin'], 0, 'presens', 'de standup is one thing, so stem plus t: begint, in slot 2 right after the time.'), 'de standup.'] },
    { en: 'Mark is still waiting for my review.', parts: ['Mark', FK(['wacht', 'wachtt', 'wachten'], 0, 'presens', 'The stem wacht already ends in t, so hij wacht. Dutch never writes tt at the end.'), 'nog op',
      FK(['mijn', 'mij', 'ik'], 0, 'bezit', 'Before a noun, my is mijn. mij and ik never stand in front of a noun.'), 'review.'] },
    { en: "Sorry, I don't understand.", parts: ['Sorry, ik', FK(['begrijp', 'begrijpt', 'begrijpen'], 0, 'presens', 'ik takes the bare stem: begrijp.'), 'het',
      FK(['niet', 'geen'], 0, 'neg', 'There is no noun to cancel, so niet, at the end.'), '.'] },

    // incidents and the laptop
    { en: "My laptop isn't working.", parts: ['Mijn laptop', FK(['doet', 'doen', 'doe'], 0, 'presens', 'One laptop, so stem plus t: doet. Het doet het niet means it does not work.'), 'het niet.'] },
    { en: 'At night I get an alert.', parts: ["'s Nachts", FK(['krijg ik', 'ik krijg', 'krijgt ik'], 0, 'v2', "'s Nachts takes slot 1, so the verb comes next and ik follows it."), 'een melding.'] },
    { en: 'This afternoon I have to fix an outage.', parts: ['Vanmiddag', FK(['moet ik', 'ik moet', 'moeten ik'], 0, 'v2', 'Vanmiddag takes slot 1, so the modal comes second, then ik.'), 'een storing',
      FK(['oplossen', 'los op', 'op te lossen'], 0, 'modal', 'After a modal the verb stays whole at the end: oplossen.'), '.'] },
    { en: "Our customers don't see the problem.", parts: ['Onze klanten', FK(['zien', 'ziet', 'zie'], 0, 'presens', 'Onze klanten is plural, so the infinitive: zien.'), 'het probleem',
      FK(['niet', 'geen'], 0, 'neg', 'het probleem is a specific thing with het in front, so niet. geen only replaces een or no article.'), '.'] },
    { en: 'Can you fix my wifi?', parts: [FK(['Kun', 'Kunnen'], 0, 'modal', 'Verb first with jij behind it: kun jij. Kunnen goes with wij, jullie and zij.'), 'jij mijn wifi',
      FK(['fixen', 'fix', 'te fixen'], 0, 'modal', 'After a modal the verb goes to the end as an infinitive: fixen.'), '?'] },
    { en: "My colleague doesn't know her password.", parts: ['Mijn collega', FK(['weet', 'wet', 'weten'], 0, 'spel', 'weten is irregular: ik, jij and hij all say weet, with no extra t. wet is a different word.'), 'haar wachtwoord',
      FK(['niet', 'geen'], 0, 'neg', 'haar already pins the noun down, so niet, after it. geen is only for een or no article.'), '.'] },

    // colleagues, the boss and working from home
    { en: 'Do you like your job?', parts: [FK(['Vind je', 'Vindt je', 'Je vind'], 0, 'presens', 'Verb first, and with je behind it the t drops: vind je. The d stays, it belongs to the stem.'), 'je werk leuk?'] },
    { en: 'Do you work here too? (polite)', parts: [FK(['Werkt u', 'Werk u', 'Werken u'], 0, 'presens', 'u keeps its t, even after the verb: werkt u. Only jij and je drop it.'), 'hier ook?'] },
    { en: 'I still say u to my boss.', parts: ['Ik', FK(['zeg', 'zegg', 'zegt'], 0, 'spel', 'zeggen keeps one g at the end: ik zeg. ik never adds a t.'), 'nog steeds u tegen mijn baas.'] },
    { en: 'Paola and I both work from home.', parts: ['Paola en ik', FK(['werken', 'werk', 'werkt'], 0, 'presens', 'Paola en ik is two people, a wij, so the plural: werken.'), 'allebei thuis.'] },
    { en: "I'll just text my wife.", parts: ['Ik', FK(['stuur', 'stur', 'stuurt'], 0, 'spel', 'Open stu-ren becomes closed stuur, so the long u is written twice: ik stuur.'), 'mijn vrouw even een berichtje.'] },

    // work words, three with the wrong article as the second sign
    { w: 'the office', nl: 'het kantoor', wrong: 'de kantoor' }, { w: 'the colleague', nl: 'de collega' }, { w: 'the laptop', nl: 'de laptop' },
    { w: 'the screen', nl: 'het scherm', wrong: 'de scherm' }, { w: 'the outage', nl: 'de storing' }, { w: 'the alert', nl: 'de melding' },
    { w: 'the boss', nl: 'de baas' }, { w: 'the password', nl: 'het wachtwoord', wrong: 'de wachtwoord' },
    { w: 'to know (a fact)', nl: 'weten' }, { w: 'to start', nl: 'beginnen' }, { w: 'to wait', nl: 'wachten' },

    // reading: two meaning traps (hoe laat, weten), then office chunks
    { read: true, nl: 'Hoe laat begint de vergadering?', en: 'What time does the meeting start?',
      o: ['What time does the meeting start?', 'How late is the meeting running?', 'When does the meeting end?'], a: 0, r: 'vraag', w: 'hoe laat asks for the time on the clock. It has nothing to do with being late.' },
    { read: true, nl: 'Ik weet het niet.', en: "I don't know.",
      o: ["I don't know.", "I don't know him.", "I don't get it."], a: 0, r: 'woord', w: 'weten is for facts. Knowing a person is kennen, understanding is begrijpen.' },
    { read: true, nl: 'Heb je even?', en: 'Got a minute?' },
    { read: true, nl: 'Ik heb piket.', en: "I'm on call." },
    { read: true, nl: 'Komt goed.', en: "It'll be fine." },

    { listen: true, nl: 'hij zegt', en: 'he says' }, { listen: true, nl: 'jullie zien', en: 'you all see' }, { listen: true, nl: 'zij krijgt', en: 'she gets' },

    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },

    // ---- second lengthening: the working day from the first mail to the last call
    // Sources: 04 - Phrases & Scenarios/De standup - tech talk (Ik heb geen blockers, Kun je je scherm delen?),
    // Werk MOC (Even kijken., Het draait weer., Kunnen we dit in een mailtje doen?), 01 - Vocabulary/storing
    // (het ligt eruit) and vergadering (de meeting), _site/situations/office (Druk vandaag?, Ik zit zo in een
    // meeting), _site/words (de klant, het probleem, de vraag, het antwoord, de telefoon, bellen, helpen, lezen,
    // Ik werk vier dagen per week., Morgen werk ik thuis., Ik ben moe na een lange werkdag.), 02 - Grammar (presens,
    // open vs gesloten lettergreep, V2, modale werkwoorden, niet vs geen). Fence kept: no object pronouns (tier 4),
    // no gaan + infinitive (tier 5), separable verbs only whole after a modal (inloggen).
    { en: 'I have no blockers.', parts: ['Ik heb', FK(['geen', 'niet'], 0, 'neg', 'blockers has no article in front, so geen cancels the noun.'), 'blockers.'] },
    { en: "I'm calling the customer.", parts: ['Ik', FK(['bel', 'bell', 'belt'], 0, 'spel', 'The stem of bellen is bel: a Dutch word never ends on a double consonant, and ik never adds a t.'), 'de klant.'] },
    { en: 'Do you read your mail in the morning?', parts: [FK(['Lees', 'Leest', 'Lest'], 0, 'presens', 'Verb first and jij behind it, so the t drops: lees jij. The long e is written twice in the closed stem.'), "jij 's ochtends je mail?"] },
    { en: 'Every morning I look at the dashboards.', parts: ['Elke ochtend', FK(['bekijk ik', 'ik bekijk', 'bekijkt ik'], 0, 'v2', 'Elke ochtend takes slot 1, so the verb comes second and ik follows it, without a t.'), 'de dashboards.'] },
    { en: 'Can I help the customer?', parts: [FK(['Kan', 'Kun', 'Kunnen'], 0, 'modal', 'ik always takes kan. kun only goes with jij or je after it.'), 'ik de klant',
      FK(['helpen', 'helpt', 'te helpen'], 0, 'modal', 'kunnen sends the second verb to the end as a bare infinitive, without te.'), '?'] },
    { en: 'The meeting takes an hour.', parts: ['De vergadering', FK(['duurt', 'duur', 'duren'], 0, 'presens', 'de vergadering is one thing, a zij, so stem plus t: duurt.'), 'een uur.'] },
    { en: "My colleagues don't have time.", parts: ["Mijn collega's", FK(['hebben', 'heeft', 'hebt'], 0, 'presens', "Mijn collega's is plural, so the infinitive: hebben."),
      FK(['geen', 'niet'], 0, 'neg', 'tijd has no article in front, so geen cancels it.'), 'tijd.'] },
    { en: "Tomorrow I'm working at the office.", parts: ['Morgen', FK(['werk ik', 'ik werk', 'werkt ik'], 0, 'v2', 'Morgen takes slot 1, so the verb comes second, then ik. ik keeps the bare stem.'), 'op kantoor.'] },
    { en: 'You have to log in first.', parts: ['Je moet eerst', FK(['inloggen', 'log in', 'in te loggen'], 0, 'modal', 'After moet the verb goes to the end whole, as one infinitive: inloggen.'), '.'] },
    { en: "You don't have to come to the office.", parts: ['Je', FK(['hoeft', 'moet', 'mag'], 0, 'modal', "Don't have to is hoeven niet, and only hoeven takes te. moet niet means you shouldn't and mag niet means you're not allowed, and neither takes te."), 'niet naar kantoor te komen.'] },
    { en: 'Is your laptop working again?', parts: [FK(['Doet', 'Doe', 'Doen'], 0, 'presens', 'The subject is one laptop, so stem plus t: doet. doe is for ik, doen for the plural.'),
      FK(['je', 'jij'], 0, 'bezit', 'Your before a noun is je or jouw. jij is the one doing something, never in front of a noun.'), 'laptop het weer?'] },
    { en: 'Paola works four days a week.', parts: ['Paola', FK(['werkt', 'werk', 'werken'], 0, 'presens', 'Paola is a zij, so stem plus t: werkt.'), 'vier dagen per week.'] },
    { en: 'Who has a question?', parts: [FK(['Wie', 'Wat', 'Waar'], 0, 'vraag', 'wie asks for a person. wat asks for a thing and waar for a place.'), FK(['heeft', 'hebt', 'heb'], 0, 'presens', 'wie counts as one person, a hij: heeft.'), 'een vraag?'] },
    { en: 'Our team has a lot of work today.', parts: [FK(['Ons', 'Onze'], 0, 'bezit', 'team is a het-word, so ons team. onze is for de-words and plurals.'), 'team heeft vandaag veel werk.'] },

    // words of the working day, three with the wrong article as the second sign
    { w: 'the customer', nl: 'de klant' }, { w: 'the problem', nl: 'het probleem', wrong: 'de probleem' },
    { w: 'the question', nl: 'de vraag' }, { w: 'the answer', nl: 'het antwoord', wrong: 'de antwoord' },
    { w: 'the phone', nl: 'de telefoon' }, { w: 'the workday', nl: 'de werkdag' }, { w: 'the desk', nl: 'het bureau', wrong: 'de bureau' },
    { w: 'to call (on the phone)', nl: 'bellen' }, { w: 'to help', nl: 'helpen' }, { w: 'to read', nl: 'lezen' },

    // reading: two meaning traps (zo, eruit liggen), then the office chunks
    { read: true, nl: 'Ik zit zo in een meeting.', en: "I'm in a meeting in a minute.",
      o: ["I'm in a meeting in a minute.", "I'm sitting in the meeting room.", 'The meeting is over soon.'], a: 0, r: 'woord', w: 'zo here means in a minute. In een meeting zitten is simply being in one.' },
    { read: true, nl: 'Het ligt eruit.', en: "It's down.",
      o: ["It's down.", "It's lying outside.", "It's out of stock."], a: 0, r: 'woord', w: 'Eruit liggen is IT talk for down: the system is not running.' },
    { read: true, nl: 'Even kijken.', en: 'Let me have a look.' },
    { read: true, nl: 'Kun je je scherm delen?', en: 'Can you share your screen?' },
    { read: true, nl: 'Kunnen we dit in een mailtje doen?', en: 'Could this be an email?' },
    { read: true, nl: 'Druk vandaag?', en: 'Busy today?' },

    { listen: true, nl: 'zij leest', en: 'she reads' }, { listen: true, nl: 'ik bel', en: 'I call' }, { listen: true, nl: 'u helpt', en: 'you help (polite)' },

    { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
  ] });
})();
