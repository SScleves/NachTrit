# Spot-checks: Nijmegen (levels 115 to 122) and Amsterdam (levels 123 to 130)

Branch `dt/content-nijmegen-amsterdam`, backlog C1. Every file went through three passes in sequence: written, then audited
as a native Netherlands-Dutch teacher (every sentence, every distractor, the tier fence, articles, no exclamation marks),
then spot-checked: six items per file drawn with a seeded generator (seed 20261024; three builds, one word, one read,
one listen per file), each checked again with a fresh eye. The numbers below are for pass 3; the pass 2 findings are
listed per town because they were fixed before the sample was drawn.

## Nijmegen (tier 12, B1 to B2, 16 words)

### Pass 2, the audit: 10 findings, all fixed in place

| File | Finding | Fix |
|---|---|---|
| L115 | The saying was written as "Doe maar normaal, dan doe je al gek genoeg"; the standard form (Van Dale) is "Doe maar gewoon". Its fork "Doe normaal maar" was weak. | Now "Doe maar gewoon, [dan doe je / dan je doet] al [gek genoeg / genoeg gek]". |
| L115 | "De buurvrouw vroeg [of / dat] de studenten wat zachter konden doen": "vragen dat" is a request form in Belgian Dutch, so a Flemish speaker could say the distractor with the same meaning. | Distractor is now "om". The other "vroeg [of / dat]" forks ask real yes-or-no questions (nuts in the sauce, a moment, wanting to walk), where "dat" is wrong everywhere; kept. |
| L117 | Plain read "Nijmegen ligt net onder de Waal" reads as lying under the river. | "Nijmegen ligt op de zuidoever van de Waal". |
| L117 | Why line said er "never comes last". | Now "It does not go at the end." |
| L118 | "Pardon, mag ik [er even langs / even er langs / er langs even]": "Mag ik even erlangs?" is good Dutch, so "even er langs" was the right sentence with a spelling slip. | Option removed; the fork is now [er even langs / er langs even]. |
| L118 | Why line for "dan val je" claimed the main clause always starts with its verb, dan included. | Reworded: the main clause may start with dan, and the verb follows it. |
| L119 | "Kun je [er even naar kijken / er naar even kijken]": "ernaar even kijken" is marginal rather than wrong. | Distractor is now the English order "er even kijken naar". |
| L119 | "De stagiair heeft er bij dat dashboard met de pet naar gegooid" was clumsy. | "Bij dat dashboard heeft de stagiair er met de pet naar gegooid." |
| L121 | Why line said welkom never changes its form (een welkome gast does). | "After zijn the adjective welkom gets no ending." |
| L121 | Rule plusq used in a read without its guarded definition in the file. | Guard added (same text as the existing definition). |

Also checked across all eight files: no exclamation marks; "te laat" everywhere (the "Ik ben laat" class); no reflexive
forks; every modal is followed by a bare infinitive and every "om" by "te"; every V2 fork's distractor puts the subject
before the verb after a fronted phrase, which is wrong in Netherlands Dutch; the tier fence (no builds with three forks,
nothing from tier 13); max 16 words per build. The rule definitions printed by the loader are unchanged for every existing
id; four ids are new (idioom, samen, formeel, datum) and are defined with the same text in every file.

### Pass 3, the spot-check: 48 items, 0 errors

| File | Items checked | Errors found | Fixed |
|---|---|---|---|
| L115 Thuis | hondenmand build, voordeur/dakraam build, Wij danken u ... Hoogachtend build, de zolder, read De huisbaas kijkt de kat uit de boom, listen de Waalbrug | 0 | none needed |
| L116 De winkels | Er zijn geen wandelsokken build, derde dinsdag van juli build, Zegt u het maar build, de korting, read Dat is wel duur, hè?, listen € 15,95 | 0 | none needed |
| L117 Eten en drinken | Gelderse rookworst / andere koek build, erwtensoep / het bruine café build, Bent u klaar om te bestellen build, de bitterbal, read Vierdaagsefeesten, listen de Vierdaagsefeesten | 0 | none needed |
| L118 Het station | er even langs build, op het nippertje build, uw vervoersbewijs build, de overstap, read Neem maar gewoon de volgende trein, hoor, listen de wandelaar | 0 | none needed |
| L119 Het werk | koffieautomaat / koffieapparaat build, het wachtwoord build, Mocht u nog vragen hebben build, de foutmelding, read Het voorstel viel in het water, listen de deadline | 0 | none needed |
| L120 De sport | zwaarder build, Op de derde dag lopen de wandelaars build, zet nog even door build, de blessure, read de benen uit het lijf, listen de Goffert | 0 | none needed |
| L121 De mensen | verjaardagsfeest build, buurtfeest / buurtapp build, Kom maar even binnen build, de Nijmegenaar, read snoep langs de route, listen de Stevenskerk | 0 | none needed |
| L122 De Vierdaagse | Waalbrug naar Elst build, het Vierdaagsekruis build, op van de zenuwen build, het Vierdaagsekruis (word), read Paola komt wel, listen tienduizenden wandelaars | 0 | none needed |

Error rate in the sample: 0 of 48. Across the whole town, counting the audit: 10 problems in 430 items, all fixed.
The weak spot was the same as in earlier towns, distractors that a native can say (a Belgian "vragen dat", a spelling
variant of "even erlangs"), not grammar in the answers.

Facts used and where they were checked (October 2026): the Vierdaagse since 1909, the hundredth in 2016, the third
Tuesday of July, 30, 40 or 50 km, the Wedren, the Via Gladiola on the Friday, the Dag van Elst over the Waalbrug, the pink
Wednesday, the seven hills to Groesbeek, the army's pontoon bridge at Cuijk, no edition in 2020 and 2021, over a million
festival visitors (organisers, NOS, Wikipedia); Knotsenburg at carnaval; the Snelbinder (2004); De Oversteek (2013) and
its lamps for the soldiers of 1944, told once in a plain read; the Lange Hezelstraat, called the oldest shopping street
in the country; the Honig soup factory on the Waal; the Goffert stadium of NEC; the Zevenheuvelenloop in November.
Nijmegen lies south of the Waal, so the food level says friet.

Draft handling: `content/pending/L118.js` and `L122.js` were reused as the base of L118 and L122 and then removed. L122 is
named De Vierdaagse, as CONTENT-BRIEF.md names Nijmegen's own place; the draft called it De Waalbrug.

Frame: `qa/out/content-frames/n115.png` (GPU, Intel Iris Xe, `shot=8&level=115&lane=1`): errors 0, luma 63, 639 draw
calls. The Waalbrug arch stands on the skyline; the fork on screen is "Komt u | Kom u".
