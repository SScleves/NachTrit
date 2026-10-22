(() => {
  // Level 44 Het werk, Alblasserdam (tier 1, A1): more of the home office, the standup, incidents and the colleagues.
  // Sources in the vault: _site/situations/office, De standup - tech talk, Koffiepraatje op kantoor, storing, vergadering,
  // the dialogues Maandagochtend bij de koffieautomaat and De vrijmibo, and the verb note hebben.
  // Werk ze is the fixed office goodbye from the vault's office situation, read as a chunk.
  // de suiker and het biertje are replays from level 42 (the office coffee and the vrijmibo beer).
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(44, { deliveries: 20, items: [
    { w: 'the work', nl: 'het werk', wrong: 'de werk' }, { w: 'the problem', nl: 'het probleem', wrong: 'de probleem' },
    { w: 'the team', nl: 'het team', wrong: 'de team' }, { w: 'the quick email', nl: 'het mailtje', wrong: 'de mailtje' },
    { w: 'the keyboard', nl: 'het toetsenbord' }, { w: 'the customer', nl: 'de klant' }, { w: 'the boss', nl: 'de baas' },
    { w: 'the question', nl: 'de vraag' }, { w: 'the charger', nl: 'de oplader' }, { w: 'the Friday drinks', nl: 'de vrijmibo' },
    { w: 'the coffee machine', nl: 'de koffieautomaat' }, { w: 'the break', nl: 'de pauze' },
    { w: 'at home', nl: 'thuis' }, { w: 'at the office', nl: 'op kantoor' }, { w: 'busy', nl: 'druk' }, { w: 'good afternoon', nl: 'goedemiddag' },
    { w: 'the sugar', nl: 'de suiker' }, { w: 'the small beer', nl: 'het biertje', wrong: 'de biertje' },
    { read: true, nl: 'Ik heb piket.', o: ["I'm on call.", "I'm on strike.", 'I have a ticket.'], a: 0, r: 'woord', w: 'piket is on-call duty. It looks like picket, but nobody is on strike.' },
    { read: true, nl: 'De koffie is op.', o: ['The coffee has run out.', 'The coffee is on.', 'The coffee is upstairs.'], a: 0, r: 'woord', w: 'op after zijn means used up: de koffie is op, there is none left.' },
    { read: true, nl: 'Ik ben klaar.', o: ["I'm done.", "I'm clear.", "I'm calm."], a: 0, r: 'woord', w: 'klaar here means done. It looks like clear, but it is not.' },
    { read: true, nl: 'Werk ze.', o: ['Have a good day at work.', 'Get back to work.', 'See you at work.'], a: 0, r: 'groet', w: 'Werk ze is what you say to someone who still has work to do. A goodbye, not an order.' },
    { read: true, nl: 'Sorry, ik ben te laat.', en: "Sorry, I'm late." },
    { read: true, nl: 'Fijn weekend alvast.', en: 'Have a nice weekend.' },
    { listen: true, nl: "de collega's", en: 'the colleagues' }, { listen: true, nl: 'de oorzaak', en: 'the root cause' },
    { listen: true, nl: 'tot morgen', en: 'see you tomorrow' }, { listen: true, nl: 'het wachtwoord', en: 'the password' },
    { look: true, prop: 'deur', nl: 'de deur', en: 'the door' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
    { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
    { en: 'I have a question.', parts: ['Ik', FK(['heb', 'hebt', 'heeft'], 0, 'hebben', 'ik heb. hebt is for jij, heeft for hij and zij.'), 'een vraag.'] },
    { en: "I'm busy.", parts: ['Ik', FK(['heb', 'ben'], 0, 'hebben', 'English is busy, Dutch has it busy: ik heb het druk.'), 'het druk.'] },
    { en: 'The password is wrong.', parts: [FK(['Het', 'De'], 0, 'dehet', 'A compound takes the article of its last part: het woord, so het wachtwoord.'), 'wachtwoord is fout.'] },
    { en: "Everyone's here.", parts: ['Iedereen', FK(['is', 'zijn'], 0, 'zijn', 'iedereen is everyone, but it counts as one: iedereen is.'), 'er.'] },
    { en: "I've got four percent left.", parts: ['Ik heb nog vier', FK(['procent', 'procenten'], 0, 'getal', 'After a number procent stays singular, like tien uur.'), '.'] },
  ] });
})();
