// Nachtrit, Rotterdam (tier 7, A2 to B1): level 79 Het werk. A glass tower on the Nieuwe Maas with the light-blue
// Erasmusbrug in the window, harbour cranes lifting nothing, the Markthal for lunch, the metro and the watertaxi
// for the commute. Office, home office, standup, meetings, incidents, colleagues, the laptop, told in the past.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (werkte, duurde, belde, lachte,
// wachtten, verveelden), the common irregulars (was, ging, zag, sprak, liep, viel), reflexive verbs (zich voelen,
// zich vergissen, zich vervelen), zou plus infinitive for polite requests (zou je me kunnen helpen, ik zou liever
// thuis werken), comparatives and superlatives (beter, liever, minder, de snelste, de langste).
// Review of earlier tiers: perfectum with a separable participle (uitgerold), V2 after a time phrase, geen against
// niet, aan het plus infinitive, de or het.
// Still inside the fence: 12 words max, no omdat/dat/als/toen clauses, no relative clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum, reflexieve werkwoorden, 't kofschip, V2 word order,
// scheidbare werkwoorden, aan het + infinitief; 03 - Verbs/zich voelen; 04 - Phrases & Scenarios/De standup - tech
// talk (alerts, blockers, even kijken, Na de fix was alles weer groen), Koffiepraatje op kantoor (Het apparaat doet
// het weer niet, Druk, druk, druk), Uitleggen wat je doet - Dynatrace; _site/words (graag-liever-liefst,
// goed-beter-best, weinig-minder-minst, zich-vergissen, zich-herinneren, kunt-u-dit-even-nakijken, werk-je-thuis-of-op-kantoor);
// MOC Werk; content/towns.js for Rotterdam (de Erasmusbrug, de Markthal, de wolkenkrabber, de hijskraan, de metro,
// de watertaxi, een bakkie pleur, Niet lullen maar poetsen, the dead who work instead of talk).
// New rules: zou (polite requests). vergelijk is guarded below, the rest are in data.js.
// New props: none. Only brug, deur and fiets are used (not lamp or huis: neither is a right answer from the word pool).
(() => {
  window.RULES.zou = window.RULES.zou || { name: 'zou + infinitive: polite requests', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 79, act: 7, name: 'Het werk', town: 'rotterdam', place: 'werk', theme: 'square', ...P,
    intro: 'Rotterdam never stopped working, not even after the end of the world. The standup is still at nine.',
    introNl: 'Rotterdam is nooit gestopt met werken, zelfs niet na het einde van de wereld. De standup is nog steeds om negen uur.',
    mission: {
      where: 'A glass tower on the Nieuwe Maas, the light-blue Erasmusbrug in the window and harbour cranes lifting nothing. The lift is out, the coffee machine is broken again, and on Fridays the office is the kitchen table.',
      carry: 'A laptop at three percent, a lanyard, the dogs\' leads in the bag because the dogs always need a walk, and a lunch receipt split to the cent. The grammar book was never opened. No helmet, not even on the bridge.',
      want: 'The mist came and everyone who spoke Dutch changed. The colleagues still hold their standup, only in the past tense now, and the project lead is taller than you, like everyone else. Niet lullen maar poetsen: say it right and they let you reach your desk.' },
    items: [
      // ---- builds: the imperfectum, regular by 't kofschip
      { en: 'Last year I worked at a bank in Rotterdam.', parts: ['Vorig jaar', FK(['werkte', 'werkde', 'werkt'], 0, 'kof',
        'werk ends in k, a ketchup letter, so the past takes -te: werkte. werkt is the present.'), 'ik bij een bank in Rotterdam.'] },
      { en: 'Yesterday the meeting lasted two hours.', parts: ['Gisteren', FK(['duurde', 'duurte', 'duurt'], 0, 'kof',
        'duur ends in r, not a ketchup letter, so the past takes -de: duurde. Gisteren asks for the past.'), 'de vergadering twee uur.'] },
      { en: 'Last night there was an outage at the office.', parts: ['Gisteravond', FK(['was', 'waren', 'heeft'], 0, 'imp',
        'zijn is irregular in the past: was for one thing, waren for several. One outage, so was.'), 'er een storing op kantoor.'] },
      { en: 'Last night I went home late. The dogs were already waiting.', parts: ['Gisteravond', FK(['ging ik', 'ik ging'], 0, 'v2',
        'Gisteravond takes slot 1, so the verb comes second, then ik.'), 'laat naar huis. De honden', FK(['wachtten', 'wachtte', 'wachtde'], 0, 'kof',
        'De honden is plural, so -n. wacht ends in t, a ketchup letter, so -te: wachtten.'), 'al.'] },
      { en: 'I saw the error on my screen and called Mark.', parts: ['Ik', FK(['zag', 'zien', 'zagen'], 0, 'imp',
        'zien is irregular: ik zag, wij zagen. No -de on the end.'), 'de fout op mijn scherm en', FK(['belde', 'belte'], 0, 'kof',
        'bel ends in l, not a ketchup letter, so -de: belde.'), 'Mark.'] },
      { en: 'During the standup I spoke Dutch and nobody laughed.', parts: ['Tijdens de standup', FK(['sprak ik', 'ik sprak'], 0, 'v2',
        'Tijdens de standup takes slot 1, so the verb comes second, then ik.'), 'Nederlands en niemand', FK(['lachte', 'lachde'], 0, 'kof',
        'lach ends in ch, a ketchup letter, so -te: lachte.'), '.'] },
      { en: 'After the standup I walked over the Erasmus Bridge to the Markthal.', parts: ['Na de standup', FK(['liep ik', 'ik liep'], 0, 'v2',
        'Na de standup takes slot 1, so the verb comes second, then ik. lopen is irregular: liep.'), 'over de Erasmusbrug naar', FK(['de', 'het'], 0, 'dehet',
        'It is a hal, a de-word, so de Markthal.'), 'Markthal.'] },
      { en: 'I was building a dashboard and the wifi went down.', parts: ['Ik was een dashboard', FK(['aan het', 'aan de'], 0, 'aanhet',
        'Busy doing something is aan het plus the infinitive, always het.'), 'bouwen en de wifi', FK(['viel', 'valde', 'vielt'], 0, 'imp',
        'vallen is irregular: viel. uit goes to the end because uitvallen is separable.'), 'uit.'] },

      // ---- builds: reflexive verbs
      { en: 'I feel better today than yesterday.', parts: ['Ik voel', FK(['me', 'zich', 'ons'], 0, 'refl',
        'voelen is reflexive and the self word matches the subject: ik voel me. zich is for hij, zij, het.'), 'vandaag', FK(['beter', 'gooder'], 0, 'vergelijk',
        'goed is irregular: goed, beter, best. Never gooder.'), 'dan gisteren.'] },
      { en: 'Sorry, I made a mistake with the password.', parts: ['Sorry, ik heb', FK(['me', 'zich'], 0, 'refl',
        'ik goes with me: ik heb me vergist.'), FK(['vergist', 'gevergist'], 0, 'perf',
        'ver- verbs never take ge: vergist.'), 'in het wachtwoord.'] },
      { en: 'Last Monday I worked at home and the dogs were bored.', parts: ['Afgelopen maandag werkte ik thuis en de honden', FK(['verveelden', 'verveelde'], 0, 'imp',
        'verveel ends in l, not a ketchup letter, so the past takes -de, and De honden is plural, so -n: verveelden.'), FK(['zich', 'zij'], 0, 'refl',
        'The dogs are they, so the self word is zich: de honden vervelen zich. zij is a subject word and cannot stand there.'), '.'] },

      // ---- builds: zou plus infinitive, polite requests and wishes
      { en: 'Could you help me with this alert?', parts: ['Zou je me even', FK(['kunnen', 'kan', 'kon'], 0, 'zou',
        'zou is the polite opener and the next verb stays an infinitive: zou je kunnen.'), 'helpen', FK(['met', 'aan', 'voor'], 0, 'woord',
        'helpen goes with met: helpen met iets.'), 'deze melding?'] },
      { en: 'I would rather work at home today.', parts: ['Ik zou vandaag', FK(['liever', 'graager', 'meer graag'], 0, 'vergelijk',
        'graag, liever, liefst: the comparative of graag is liever.'), 'thuis', FK(['werken', 'werk', 'gewerkt'], 0, 'zou',
        'After zou the main verb goes to the end as an infinitive: werken.'), '.'] },

      // ---- builds: comparatives and superlatives
      { en: 'This laptop is the fastest in the whole office.', parts: ['Deze laptop is de', FK(['snelste', 'snelst', 'sneller'], 0, 'vergelijk',
        'After de the superlative takes -ste: de snelste. sneller compares two things, and snelst never follows de.'), 'van het hele kantoor.'] },
      { en: 'Yesterday was the longest meeting of the year.', parts: ['Gisteren', FK(['was', 'waren'], 0, 'imp',
        'The subject is het, one thing, so was.'), 'het de', FK(['langste', 'langer', 'langst'], 0, 'vergelijk',
        'After de the superlative gets -ste: de langste vergadering.'), 'vergadering van het jaar.'] },
      { en: 'On Friday there are fewer people at the office.', parts: ['Op vrijdag', FK(['zijn er', 'er zijn'], 0, 'v2',
        'Op vrijdag takes slot 1, so the verb comes second, then er.'), FK(['minder', 'meer weinig', 'minst'], 0, 'vergelijk',
        'weinig, minder, minst: fewer is minder.'), 'mensen op kantoor.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday I fixed the bug and rolled out the fix.', parts: ['Gisteren', FK(['heb ik', 'ik heb'], 0, 'v2',
        'Gisteren takes slot 1, so heb comes second, then ik.'), 'de bug opgelost en de fix', FK(['uitgerold', 'geuitrold', 'uitgerolt'], 0, 'sep',
        'The ge goes in the middle: uit + gerold, one word at the end. rol ends in l, so -d.'), '.'] },
      { en: "I don't have time for an extra meeting today.", parts: ['Ik heb vandaag', FK(['geen', 'niet'], 0, 'neg',
        'geen goes with a noun: geen tijd. niet is for verbs and adjectives.'), 'tijd voor een extra vergadering.'] },

      // ---- words: the office, the laptop, the team, the commute
      { w: 'the office', nl: 'het kantoor', wrong: 'de kantoor' }, { w: 'the screen', nl: 'het scherm', wrong: 'de scherm' },
      { w: 'the keyboard', nl: 'het toetsenbord' }, { w: 'the charger', nl: 'de oplader' },
      { w: 'the password', nl: 'het wachtwoord', wrong: 'de wachtwoord' }, { w: 'the meeting', nl: 'de vergadering' },
      { w: 'the dashboard', nl: 'het dashboard', wrong: 'de dashboard' }, { w: 'the team', nl: 'het team', wrong: 'de team' },
      { w: 'the colleagues', nl: "de collega's" }, { w: 'the desk', nl: 'het bureau' }, { w: 'the boss', nl: 'de baas' },
      { w: 'the customer', nl: 'de klant' }, { w: 'the alert', nl: 'de melding' }, { w: 'the outage', nl: 'de storing' },
      { w: 'the coffee machine', nl: 'het koffieapparaat' }, { w: 'the lunch break', nl: 'de lunchpauze' },
      { w: 'the work-from-home day', nl: 'de thuiswerkdag' }, { w: 'the metro', nl: 'de metro' },
      { w: 'the water taxi', nl: 'de watertaxi' },

      // ---- reads: two traps with their own options, four plain lines from the office and the city
      { read: true, nl: 'De server was om negen uur weer terug.', o: ["The server was back at nine o'clock.", "The server will be back at nine o'clock.", "The server went down at nine o'clock."], a: 0, r: 'imp',
        w: 'was is the past and weer terug means back again. Will be back would be zal terug zijn.' },
      { read: true, nl: 'Zou je me even kunnen bellen?', o: ['Could you give me a call?', 'Did you call me?', 'Shall I call you?'], a: 0, r: 'zou',
        w: 'zou je kunnen is the polite request. Shall I would be zal ik.' },
      { read: true, nl: 'Niet lullen maar poetsen.', en: 'Stop talking and get to work.' },
      { read: true, nl: 'Mark werkt harder dan ik, maar ik werk slimmer.', o: ['Mark works harder than I do, but I work smarter.', 'Mark works as hard as I do, but more slowly.', 'I work harder than Mark, but he works smarter.'], a: 0, r: 'vergelijk',
        w: 'harder dan ik: Mark works harder than I do. slimmer is smarter, and that is ik.' },
      { read: true, nl: 'Zin in een bakkie pleur?', en: 'Fancy a coffee? (Rotterdam slang)' },
      { read: true, nl: 'Ik werk vandaag thuis, dus de honden zijn blij.', en: 'I work from home today, so the dogs are happy.' },

      // ---- listens: two Rotterdam skyline words, one past form, one office word
      { listen: true, nl: 'de wolkenkrabber', en: 'the skyscraper' }, { listen: true, nl: 'de hijskraan', en: 'the crane' },
      { listen: true, nl: 'ik werkte', en: 'I worked' }, { listen: true, nl: 'de deadline', en: 'the deadline' },

      // ---- looks: the bridge, the office door, the bike
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },

      // ---- de of het
      { dehet: true, nl: 'bedrijf', art: 'het', en: 'the company', w: 'het bedrijf. The plural is de bedrijven, because every plural is de.' },
      { dehet: true, nl: 'afspraak', art: 'de', en: 'the appointment' },
    ] }]);
})();
