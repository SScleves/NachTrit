// Nachtrit, Utrecht (tier 5, A2): level 63 Het werk. An office by Utrecht Centraal, a flex desk, the standup,
// the incident call, the lunch break, and the home office on the kitchen table.
// New at tier 5 and drilled here: separable verbs split in the present (Ik bel de klant morgen terug, Ik pak het op),
// zijn + aan het + infinitive (Ik ben de storing aan het oplossen), gaan + infinitive (Vandaag ga ik ... uitrollen),
// the imperative (Zet je camera even aan, Laat de honden uit) and telling the time (kwart over tien, tien voor half twaalf).
// 10 words max. No perfectum, no imperfectum, no sub-clauses.
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios (De standup - tech talk: Vandaag ga ik de nieuwe monitoring
// uitrollen, Ik pak het op, De deploy is nog aan het draaien; Koffiepraatje op kantoor), 💼 Werk — MOC,
// 01 - Vocabulary (storing: de oorzaak, de melding; vergadering: uitlopen, het overleg, de agenda, de deadline),
// 02 - Grammar (scheidbare werkwoorden: inloggen, uitloggen, meegaan; aan het + infinitief; futurum - gaan + infinitief;
// V2 word order), _site/grammar/de-imperatief-commands, _site/situations/office (Ik ga lunchen, ga je mee?;
// Tot morgen, fijne avond nog is our own wording, the vault's werk ze nog is dropped as not standard), _site/words (het verslag, de computer, de baan, het werk), MOC Tijd, dagen & maanden,
// and content/towns.js for Utrecht (de fietsenstalling with 12,500 bikes, de Domtoren, the students).
// Replay from Gouda L11 and Zeeland L55: de vergadering, de storing, de collega, het scherm, het toetsenbord, het kantoor.
// Rules: gebod and klok are shared with L59 and declared here only if missing. New props: none.
(() => {
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 63, act: 5, name: 'Het werk', town: 'utrecht', place: 'werk', theme: 'square', ...P,
    intro: 'An office next to Utrecht Centraal. Since the mist the whole standup speaks Dutch. Most of them are dead, and their cameras are still off.',
    introNl: 'Een kantoor naast Utrecht Centraal. Sinds de mist praat de hele standup Nederlands. De meesten zijn dood, en hun camera\'s staan nog steeds uit.',
    mission: {
      where: 'From the bike garage under the station, past the Dom, up to a flex desk on the fourth floor, and home again to the laptop on the kitchen table.',
      carry: 'A laptop at six percent, a headset, and the grammar book, still in its plastic. No helmet. Your bike is down there with 12,500 others, and you will not find it either.',
      want: 'The dead run a standup at every desk. They ask what you are working on, what you are going to do and what time the incident call starts. Then they split the lunch bill to the cent. Your manager, a woman a head taller than you, says the prefix goes at the end. At five the dogs need a walk, incident or no incident.' },
    items: [
      // ---- build: separable verbs split in the present, the prefix at the end
      { en: "I'll call the customer back tomorrow.", parts: ['Ik', FK(['bel', 'terugbel', 'belt'], 0, 'sep', 'terugbellen splits: bel goes in slot 2, terug waits at the end.'),
        'de klant morgen', FK(['terug', 'terugbellen'], 0, 'sep', 'Only the prefix goes to the end, terug, not the whole verb.'), '.'] },
      { en: 'At eight o\'clock I log in.', parts: ['Om acht uur', FK(['log ik', 'ik log', 'inlog ik'], 0, 'v2', 'Om acht uur takes slot 1, so log comes second and ik third.'),
        FK(['in', 'inloggen'], 0, 'sep', 'inloggen splits: in goes to the end of the sentence.'), '.'] },
      { en: "I'll pick up the ticket.", parts: ['Ik', FK(['pak', 'oppak', 'pakt'], 0, 'sep', 'oppakken splits: ik pak, and op goes to the end.'),
        'het ticket', FK(['op', 'oppakken'], 0, 'sep', 'The prefix op closes the sentence.'), '.'] },
      { en: 'The standup always runs over.', parts: ['De standup', FK(['loopt', 'uitloopt', 'lopen'], 0, 'sep', 'uitlopen splits: loopt in slot 2, uit at the end. One standup, so loopt.'), 'altijd uit.'] },
      // ---- build: zijn + aan het + infinitive
      { en: "I'm fixing the outage.", parts: ['Ik', FK(['ben', 'heb', 'is'], 0, 'aanhet', 'aan het always takes zijn: ik ben.'), 'de storing',
        FK(['aan het oplossen', 'oplossen aan het', 'aan het lossen op'], 0, 'aanhet', 'aan het first, then the whole verb, glued: oplossen.'), '.'] },
      { en: 'We are testing the new release.', parts: ['We', FK(['zijn', 'hebben', 'is'], 0, 'aanhet', 'aan het takes zijn, never hebben: we zijn.'), 'de',
        FK(['nieuwe', 'nieuw'], 0, 'adj', 'After de the adjective takes -e: de nieuwe release.'), 'release aan het testen.'] },
      { en: 'Paola is on a call too.', parts: ['Paola', FK(['is', 'heeft', 'zijn'], 0, 'aanhet', 'One person, and aan het goes with zijn: Paola is.'), 'ook',
        FK(['aan het bellen', 'aan bellen', 'het aan bellen'], 0, 'aanhet', 'The block is always aan het, in that order, then the infinitive.'), '.'] },
      // ---- build: gaan + infinitive at the end
      { en: "Today I'm going to roll out the new monitoring.", parts: ['Vandaag', FK(['ga ik', 'ik ga', 'gaat ik'], 0, 'v2', 'Vandaag takes slot 1, so ga comes second and ik third.'),
        'de nieuwe monitoring', FK(['uitrollen', 'rol uit', 'uit te rollen'], 0, 'fut', 'After gaan the verb goes whole to the end, glued and without te: uitrollen.'), '.'] },
      { en: 'This afternoon we are going to look for the cause.', parts: ['Vanmiddag', FK(['gaan we', 'we gaan', 'gaat we'], 0, 'v2', 'Vanmiddag in slot 1 puts the verb before we.'),
        'de oorzaak', FK(['zoeken', 'zoekt', 'te zoeken'], 0, 'fut', 'gaan plus the bare infinitive at the end: zoeken, no te.'), '.'] },
      { en: 'Are you coming to the borrel on Friday?', parts: [FK(['Ga je', 'Gaat je', 'Gaan je'], 0, 'v2', 'A question starts with the verb. Before je the t drops: ga je.'), 'vrijdag',
        FK(['mee', 'meegaat', 'mee te gaan'], 0, 'sep', 'meegaan splits: ga stands in front in the question, and mee waits at the end.'), 'naar de borrel?'] },
      // ---- build: the imperative, the bare stem
      { en: 'Just switch your camera on.', parts: [FK(['Zet', 'Zetten', 'Aanzet'], 0, 'gebod', 'A command is the bare stem: zet. The prefix does not come along.'), 'je camera even',
        FK(['aan', 'aanzetten'], 0, 'sep', 'aanzetten splits in a command too: aan goes to the end.'), '.'] },
      { en: 'Just restart your laptop.', parts: [FK(['Start', 'Starten', 'Opstart'], 0, 'gebod', 'Command: the bare stem, start. It already ends in t, so nothing changes.'), 'je laptop even opnieuw',
        FK(['op', 'opstarten'], 0, 'sep', 'opstarten splits: op goes to the very end.'), '.'] },
      { en: 'Walk the dogs, the call can wait.', parts: [FK(['Laat', 'Uitlaat', 'Laten'], 0, 'gebod', 'Command: the bare stem laat, and uit waits at the end.'), 'de honden',
        FK(['uit', 'uitlaat', 'uit te laten'], 0, 'sep', 'uitlaten splits: laat stands in front, and only uit goes to the end.'), ', de call kan wachten.'] },
      // ---- build: telling the time
      { en: 'The call starts at quarter past ten.', parts: ['Om', FK(['kwart over tien', 'kwart voor tien', 'half tien'], 0, 'klok', 'Quarter past ten is kwart over tien. kwart voor tien is 9:45, half tien is 9:30.'),
        FK(['begint de call', 'de call begint'], 0, 'v2', 'A time in slot 1 puts the verb before de call.'), '.'] },
      { en: 'At twenty past eleven I have a meeting.', parts: ['Om', FK(['tien voor half twaalf', 'tien over half twaalf', 'twintig over twaalf'], 0, 'klok', 'Half twaalf is 11:30, so ten minutes before it, 11:20, is tien voor half twaalf.'),
        FK(['heb ik', 'ik heb'], 0, 'v2', 'The time takes slot 1, so heb comes before ik.'), 'een vergadering.'] },

      // ---- word: the office, the desk, the incident
      { w: 'the meeting', nl: 'de vergadering' }, { w: 'the outage', nl: 'de storing' }, { w: 'the colleague', nl: 'de collega' },
      { w: 'the screen', nl: 'het scherm', wrong: 'de scherm' }, { w: 'the keyboard', nl: 'het toetsenbord', wrong: 'de toetsenbord' },
      { w: 'the office', nl: 'het kantoor', wrong: 'de kantoor' },
      { w: 'the calendar', nl: 'de agenda' }, { w: 'the deadline', nl: 'de deadline' }, { w: 'the cause', nl: 'de oorzaak' },
      { w: 'the flex desk', nl: 'de flexplek' }, { w: 'the lunch break', nl: 'de lunchpauze' }, { w: 'the server', nl: 'de server' },
      { w: 'the update', nl: 'de update' }, { w: 'the canteen', nl: 'de kantine' }, { w: 'the floor (of a building)', nl: 'de verdieping' },
      { w: 'the email', nl: 'de e-mail' }, { w: 'the report', nl: 'het verslag', wrong: 'de verslag' },
      { w: 'the salary', nl: 'het salaris', wrong: 'de salaris' }, { w: 'the meeting room', nl: 'de vergaderruimte' },
      { w: 'the bike garage', nl: 'de fietsenstalling' },

      // ---- read
      { read: true, nl: 'Ik pak het op.', o: ["I'll pick it up.", "I'll pack it in.", "I'll put it down."], a: 0, r: 'sep',
        w: 'oppakken: pak in slot 2, op at the end. In a standup it means you take the ticket.' },
      { read: true, nl: 'De vergadering loopt uit.', o: ['The meeting is running over.', 'The meeting is cancelled.', 'The meeting starts later.'], a: 0, r: 'sep',
        w: 'uitlopen: a meeting that goes on past its end time is running over.' },
      { read: true, nl: 'De deploy is nog aan het draaien.', o: ['The deploy is still running.', 'The deploy has finished.', 'The deploy is not running yet.'], a: 0, r: 'aanhet',
        w: 'zijn + aan het + infinitive is happening right now, and nog means still.' },
      { read: true, nl: 'Ik ga lunchen, ga je mee?', en: "I'm going to have lunch, are you coming along?" },
      { read: true, nl: 'Log even uit en weer in.', en: 'Just log out and back in.' },
      { read: true, nl: 'Tot morgen, fijne avond nog.', en: 'See you tomorrow, have a good evening.' },

      // ---- listen
      { listen: true, nl: 'kwart over negen', en: '9:15' }, { listen: true, nl: 'vijf over half vier', en: '3:35' },
      { listen: true, nl: 'ik bel je terug', en: "I'll call you back" }, { listen: true, nl: 'we zijn aan het testen', en: 'we are testing' },

      // ---- look
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
      { look: true, prop: 'nummer', value: 9, nl: 'negen', en: '9' },

      // ---- de or het
      { dehet: true, nl: 'overleg', art: 'het', en: 'the sync meeting', w: 'het overleg. Learn it with its het, like het verslag.' },
      { dehet: true, nl: 'netwerk', art: 'het', en: 'the network', w: 'A compound takes the article of its last part: het werk, so het netwerk.' },
    ] }]);
})();
