(() => {
  // Level 46, Kinderdijk en Dordrecht, Het werk (tier 2, A1 phrases): the office on the square under the Grote Kerk,
  //   the home office, the standup, meetings, the outage, colleagues, the laptop.
  // Fence: at most 5 words a line, present tense, subject verb object, numbers to 100, de/het. niet and geen only in reads.
  // Sources in the vault: 04 - Phrases & Scenarios/De standup - tech talk (Het draait weer, de review),
  //   Koffiepraatje op kantoor (Het apparaat doet het weer niet, Druk, druk, druk, de vrijmibo, Alweer een reorganisatie),
  //   Uitleggen wat je doet - Dynatrace (de melding, de klant, het systeem), the Werk MOC, 01 - Vocabulary/storing
  //   (het ligt eruit, de oorzaak, kapot), vergadering (het overleg, de agenda), afspraak (Afspraak is afspraak),
  //   _site/situations/office (Druk vandaag?, Heb je even? Ik heb een korte vraag, Ik zit zo in een meeting,
  //   Fijn weekend alvast), _site/words (de baan, de computer, de telefoon, de vraag, het antwoord, de afspraak).
  // Rules used: pres, hebben, zijn, dehet, woord, neg, cult. hebben and pres are set again below only if no earlier
  //   file set them. New props: none (deur, huis, nummer).
  // Word, listen and look forks take their wrong signs from each other, so no two Dutch answers here mean the same
  //   thing: no de meeting next to de vergadering, no stuk next to kapot, no het werk next to de baan, no de mail
  //   next to het mailtje. `wrong` sits only on het-nouns whose de form is wrong in every variety of Dutch.
  window.RULES.pres = window.RULES.pres || { name: 'Present tense', note: 'presens' };
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(46, { deliveries: 20, items: [
    // words: the desk and the laptop, the people, the incident, the calendar, Friday
    { w: 'the laptop', nl: 'de laptop' }, { w: 'the phone', nl: 'de telefoon' },
    { w: 'the printer', nl: 'de printer' }, { w: 'the password', nl: 'het wachtwoord', wrong: 'de wachtwoord' },
    { w: 'the system', nl: 'het systeem', wrong: 'de systeem' },
    { w: 'the boss', nl: 'de baas' }, { w: 'the customer', nl: 'de klant' }, { w: 'the job', nl: 'de baan' },
    { w: 'the root cause', nl: 'de oorzaak' }, { w: 'the question', nl: 'de vraag' },
    { w: 'the answer', nl: 'het antwoord', wrong: 'de antwoord' },
    { w: 'the appointment', nl: 'de afspraak' }, { w: 'the calendar', nl: 'de agenda' },
    { w: 'Friday', nl: 'vrijdag' }, { w: 'busy', nl: 'druk' }, { w: 'broken', nl: 'kapot' },

    // reads: four meaning traps, three plain lines from the coffee machine and the standup
    { read: true, nl: 'Het ligt eruit.', en: "It's down.",
      o: ["It's down.", "It's lying outside.", "It's sold out."], a: 0, r: 'woord', w: 'Het ligt eruit is IT talk for a system that is down. Nothing is lying anywhere.' },
    { read: true, nl: 'Heb je even?', en: 'Got a minute?',
      o: ['Got a minute?', 'Have you got it?', 'Are you ready?'], a: 0, r: 'woord', w: 'Heb je even? asks for a moment of your time. Have you got it is Heb je het?' },
    { read: true, nl: 'Het apparaat doet het niet.', en: "The machine isn't working.",
      o: ["The machine isn't working.", 'The machine is switched off.', 'The machine is new.'], a: 0, r: 'neg', w: 'Het doet het means it works. With niet the coffee machine is broken again. Switched off is staat uit.' },
    { read: true, nl: 'Afspraak is afspraak.', en: 'A deal is a deal.',
      o: ['A deal is a deal.', 'Meeting after meeting.', 'The appointment is off.'], a: 0, r: 'cult', w: 'de afspraak is an appointment and an agreement, and a Dutch agreement holds.' },
    { read: true, nl: 'Druk vandaag?', en: 'Busy today?' },
    { read: true, nl: 'Ik zit in een meeting.', en: "I'm in a meeting." },
    { read: true, nl: 'Fijn weekend.', en: 'Have a nice weekend.' },

    // listen: the ij of vrijmibo, the v and g of overleg, the long word for the reorg, and 45 with its en
    { listen: true, nl: 'de vrijmibo', en: 'the Friday drinks at work' }, { listen: true, nl: 'het overleg', en: 'the sync, the consultation' },
    { listen: true, nl: 'de reorganisatie', en: 'the reorganisation' }, { listen: true, nl: 'vijfenveertig', en: '45' },

    // look: the office door on the square, a house with a home office light on, the fifteen-minute standup
    { look: true, prop: 'deur', nl: 'de deur', en: 'the door' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
    { look: true, prop: 'nummer', value: 15, nl: 'vijftien', en: '15' },

    // builds: one fork each, on zijn, hebben, the present tense or de/het
    { en: 'The laptop is broken.', parts: ['De laptop', FK(['is', 'zijn', 'ben'], 0, 'zijn', 'One laptop is a hij, and hij is. zijn is for more than one, ben for ik.'), 'kapot.'] },
    { en: 'I have a question.', parts: ['Ik', FK(['heb', 'heeft', 'hebben'], 0, 'hebben', 'ik heb. heeft is only for hij, zij and het.'), 'een vraag.'] },
    { en: 'We have a meeting on Friday.', parts: ['We', FK(['hebben', 'heeft', 'heb'], 0, 'hebben', 'we is plural, so the whole verb: hebben.'), 'vrijdag een vergadering.'] },
    { en: 'The customer calls on Monday.', parts: ['De klant', FK(['belt', 'bel', 'bellen'], 0, 'pres', 'One customer is a hij: stem plus t, belt.'), 'maandag.'] },
    { en: 'The standup starts tomorrow.', parts: ['De standup', FK(['begint', 'begin', 'beginnen'], 0, 'pres', 'One standup is a hij: stem plus t, begint.'), 'morgen.'] },
    { en: 'The system is running again.', parts: ['Het systeem', FK(['draait', 'draai', 'draaien'], 0, 'pres', 'One system is a het, so it takes the t: draait.'), 'weer.'] },
  ] });
})();
