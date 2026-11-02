# dt/audit-distractors: build fork distractor audit (backlog C2)

Branch `dt/audit-distractors`, from `main` at 39356da (the parent of `dt/polish-nov`). Not pushed, not merged.
Content sources only: `content/district3.js`, `content/town-alblasserdam.js`, `content/towns.js`, `content/new/L78 … L130.js`,
plus the regenerated bundles `content/extra.js` and `content/towns-new.js`. `index.html` and `levels.js` were not touched.
`node qa/build-content.mjs` and `node qa/validate-content.mjs` end with 0 errors, 0 warnings after every commit.
No rendering changes, so nothing needs checking on the GPU.

## Method

Every level with content (1 to 15 and 41 to 130; 16 to 40 are locked stubs with no items) was dumped with the answer
marked and every why line printed. For every fork I asked whether a Netherlands native could say the distractor in
that slot with the English meaning. I also read every read item and its English options, and grepped all content for
exclamation marks (none found) and for rule 8 topics.

The biggest class this pass found was **PP extraposition**. In Dutch speech, a prepositional phrase can follow the
verb in a sub-clause ("de hond die slaapt op de bank", "omdat iedereen zit in de kerk", "de bus die gaat naar De Koog").
A distractor built that way is something a native says. In each case I added an adverb or time word that can never
follow the verb (altijd, nog, al, vandaag, vanavond, al jaren, al uren, hier), so the verb-second option is now clearly
wrong. The second class was **forms that Taaladvies or Flemish usage accepts**: verliezen with zijn, u zal, de vest,
de idee, lopen with zijn, kraam as de or het.

## Counts per level

Checked means every fork in every build, plus every read item. Changed counts the items that changed.

| Level | Town | Name | Builds | Forks | Reads | Changed |
|---|---|---|---|---|---|---|
| 1 | - | De honden | 4 | 4 | 4 | 0 |
| 2 | - | De buren | 4 | 4 | 13 | 0 |
| 3 | - | De brievenbus | 4 | 4 | 3 | 0 |
| 4 | - | Ik ben | 25 | 25 | 7 | 0 |
| 5 | - | Nachtwinkel | 3 | 3 | 5 | 0 |
| 6 | - | De supermarkt | 9 | 9 | 12 | 0 |
| 7 | - | De slager | 9 | 9 | 9 | 0 |
| 8 | - | De of het | 8 | 8 | 7 | 0 |
| 9 | - | Afhalen | 9 | 9 | 11 | 0 |
| 10 | - | De kalender | 9 | 9 | 9 | 0 |
| 11 | - | Werkwoorden | 41 | 54 | 15 | 0 |
| 12 | - | De weg kwijt | 23 | 31 | 9 | 1 |
| 13 | - | Nieuwe mensen | 26 | 26 | 9 | 0 |
| 14 | - | Niet of geen | 26 | 33 | 9 | 0 |
| 15 | - | Mag ik? | 25 | 34 | 9 | 1 |
| 41 | alblasserdam | De of het | 0 | 0 | 0 | 0 |
| 42 | alblasserdam | Eten en drinken | 9 | 9 | 12 | 0 |
| 43 | alblasserdam | Het station | 9 | 9 | 11 | 1 |
| 44 | alblasserdam | Het werk | 9 | 9 | 11 | 0 |
| 45 | alblasserdam | De sport | 9 | 9 | 10 | 0 |
| 46 | kinderdijk | Het werk | 10 | 10 | 12 | 0 |
| 47 | kinderdijk | De sport | 15 | 15 | 19 | 0 |
| 48 | kinderdijk | De mensen | 16 | 16 | 18 | 0 |
| 49 | gouda | Thuis | 24 | 36 | 9 | 0 |
| 50 | gouda | Eten en drinken | 26 | 30 | 10 | 0 |
| 51 | zeeland | Thuis | 16 | 23 | 6 | 0 |
| 52 | zeeland | De winkels | 15 | 23 | 6 | 0 |
| 53 | zeeland | Eten en drinken | 15 | 21 | 6 | 0 |
| 54 | zeeland | Het station | 16 | 21 | 6 | 0 |
| 55 | zeeland | Het werk | 16 | 30 | 6 | 0 |
| 56 | zeeland | De sport | 16 | 22 | 5 | 0 |
| 57 | zeeland | De mensen | 16 | 22 | 6 | 0 |
| 58 | zeeland | De Deltawerken | 15 | 17 | 6 | 0 |
| 59 | utrecht | Thuis | 15 | 23 | 6 | 0 |
| 60 | utrecht | De winkels | 16 | 22 | 6 | 0 |
| 61 | utrecht | Eten en drinken | 15 | 25 | 6 | 0 |
| 62 | utrecht | Het station | 15 | 25 | 6 | 0 |
| 63 | utrecht | Het werk | 15 | 29 | 6 | 0 |
| 64 | utrecht | De sport | 16 | 23 | 6 | 0 |
| 65 | utrecht | De mensen | 15 | 25 | 6 | 0 |
| 66 | utrecht | De Dom | 15 | 25 | 6 | 0 |
| 67 | denhaag | Thuis | 16 | 29 | 6 | 0 |
| 68 | denhaag | De winkels | 16 | 23 | 6 | 0 |
| 69 | denhaag | Eten en drinken | 15 | 22 | 6 | 0 |
| 70 | denhaag | Het station | 16 | 24 | 6 | 0 |
| 71 | denhaag | Het werk | 15 | 23 | 6 | 0 |
| 72 | denhaag | De sport | 14 | 23 | 6 | 0 |
| 73 | denhaag | De mensen | 14 | 24 | 6 | 0 |
| 74 | denhaag | Het Binnenhof | 15 | 26 | 6 | 0 |
| 75 | rotterdam | Thuis | 20 | 30 | 6 | 0 |
| 76 | rotterdam | De winkels | 20 | 32 | 6 | 0 |
| 77 | rotterdam | Eten en drinken | 18 | 29 | 6 | 0 |
| 78 | rotterdam | Het station | 18 | 29 | 6 | 1 |
| 79 | rotterdam | Het werk | 18 | 31 | 6 | 0 |
| 80 | rotterdam | De sport | 17 | 24 | 6 | 0 |
| 81 | rotterdam | De mensen | 20 | 37 | 6 | 0 |
| 82 | rotterdam | De haven | 17 | 26 | 6 | 0 |
| 83 | urk | Thuis | 19 | 27 | 5 | 0 |
| 84 | urk | De winkels | 17 | 25 | 6 | 1 |
| 85 | urk | Eten en drinken | 18 | 31 | 6 | 1 |
| 86 | urk | Het station | 18 | 26 | 6 | 0 |
| 87 | urk | Het werk | 19 | 31 | 6 | 2 |
| 88 | urk | De sport | 19 | 30 | 6 | 0 |
| 89 | urk | De mensen | 18 | 28 | 6 | 0 |
| 90 | urk | De haven van Urk | 18 | 21 | 6 | 0 |
| 91 | texel | Thuis | 18 | 25 | 6 | 2 |
| 92 | texel | De winkels | 19 | 22 | 6 | 1 |
| 93 | texel | Eten en drinken | 20 | 36 | 5 | 1 |
| 94 | texel | Het station | 19 | 36 | 6 | 3 |
| 95 | texel | Het werk | 18 | 24 | 5 | 1 |
| 96 | texel | De sport | 20 | 24 | 6 | 0 |
| 97 | texel | De mensen | 19 | 30 | 6 | 1 |
| 98 | texel | Het eiland | 18 | 20 | 6 | 0 |
| 99 | groningen | Thuis | 20 | 33 | 6 | 0 |
| 100 | groningen | De winkels | 18 | 25 | 5 | 0 |
| 101 | groningen | Eten en drinken | 19 | 28 | 6 | 0 |
| 102 | groningen | Het station | 18 | 30 | 6 | 0 |
| 103 | groningen | Het werk | 19 | 26 | 6 | 1 |
| 104 | groningen | De sport | 20 | 24 | 6 | 0 |
| 105 | groningen | De mensen | 20 | 25 | 6 | 0 |
| 106 | groningen | De Martinitoren | 19 | 27 | 6 | 0 |
| 107 | maastricht | Thuis | 19 | 32 | 5 | 0 |
| 108 | maastricht | De winkels | 16 | 30 | 6 | 0 |
| 109 | maastricht | Eten en drinken | 19 | 33 | 6 | 0 |
| 110 | maastricht | Het station | 19 | 36 | 6 | 2 |
| 111 | maastricht | Het werk | 17 | 26 | 6 | 0 |
| 112 | maastricht | De sport | 18 | 31 | 6 | 0 |
| 113 | maastricht | De mensen | 20 | 34 | 6 | 0 |
| 114 | maastricht | Het Vrijthof | 20 | 38 | 6 | 1 |
| 115 | nijmegen | Thuis | 23 | 39 | 6 | 0 |
| 116 | nijmegen | De winkels | 21 | 34 | 6 | 0 |
| 117 | nijmegen | Eten en drinken | 20 | 31 | 6 | 1 |
| 118 | nijmegen | Het station | 21 | 31 | 6 | 0 |
| 119 | nijmegen | Het werk | 20 | 29 | 6 | 0 |
| 120 | nijmegen | De sport | 20 | 26 | 6 | 0 |
| 121 | nijmegen | De mensen | 21 | 28 | 6 | 0 |
| 122 | nijmegen | De Vierdaagse | 20 | 32 | 6 | 0 |
| 123 | amsterdam | Thuis | 21 | 39 | 6 | 0 |
| 124 | amsterdam | De winkels | 19 | 33 | 6 | 1 |
| 125 | amsterdam | Eten en drinken | 19 | 35 | 6 | 2 |
| 126 | amsterdam | Het station | 20 | 39 | 6 | 0 |
| 127 | amsterdam | Het werk | 20 | 48 | 6 | 1 |
| 128 | amsterdam | De sport | 20 | 41 | 6 | 2 |
| 129 | amsterdam | De Wallen | 20 | 44 | 6 | 0 |
| 130 | amsterdam | De grachten | 20 | 50 | 6 | 1 |
| **total** | | 105 levels | 1791 | 2706 | 717 | 29 |

There was also one non-level change: the Groningen `joke` in `content/towns.js`.

## Every change (before / after / why)

| # | Level | Before | After | Why |
|---|---|---|---|---|
| 1 | L15 | Zou je dat [kunnen herhalen \| **herhalen kunnen** \| kunnen te herhalen] | distractor **kan herhalen**; why: "After zou the modal goes to the end as an infinitive too: kunnen herhalen. Never kan, never te." | herhalen kunnen is a valid cluster order (ANS, southern and written Dutch). |
| 2 | L12 | Pardon, ik [ben \| **heb**] de weg kwijt. | distractor **bent**; why adds "bent is for jij." | "ik heb mijn telefoon kwijt" is common NL speech, so heb is risky. |
| 3 | L43 | read: De bus is laat. = The bus is late. | De bus is **te** laat. | "laat" alone is late in the day. A late bus is te laat, the calque the brief names. |
| 4 | L78 | Ik [heb \| **ben**] mijn ov-chipkaart … verloren | distractor **heeft**; why: "verliezen runs on hebben, and with ik that is heb. heeft is for hij and zij." | "ik ben mijn … verloren" is accepted (standard in Belgium, and Taaladvies allows both). |
| 5 | L84 | EN: I see that the fish is fresher **here** than in the supermarket. | …the fish **on Urk** is fresher… | The Dutch says op Urk. |
| 6 | L85 | …dicht [omdat iedereen in de kerk zit \| **omdat iedereen zit in de kerk**] | distractor **omdat zit iedereen in de kerk** | Extraposed PP, natural speech. |
| 7 | L87 | Terwijl ik een dashboard [aan het bouwen ben \| **ben aan het bouwen**] | distractor **aan het ben bouwen**; why adds "aan het and its infinitive stay together." | "ben aan het bouwen" in a sub-clause is Flemish and heard in NL. |
| 8 | L87 | Ik heb vandaag geen tijd omdat ik de hele dag [in vergaderingen zit \| **zit in vergaderingen**] | the fork now covers the whole clause: [omdat ik de hele dag in vergaderingen zit \| omdat ik **zit de hele dag** in vergaderingen \| omdat **zit ik** de hele dag in vergaderingen] | Extraposed PP is natural. With de hele dag after the verb it is clearly wrong. |
| 9 | L91 | De hond die [op de bank slaapt \| slaapt op de bank] | De hond die [**altijd** op de bank slaapt \| slaapt **altijd** op de bank]; EN "always sleeps" | Extraposed PP. |
| 10 | L91 | Het schaap dat [achter de schapenboet staat \| staat achter …] | [**nog** achter de schapenboet staat \| staat **nog** achter …]; EN "is still standing" | Extraposed PP. |
| 11 | L92 | Ik zoek een [warm \| warme] **vest** van Texelse wol (cardigan) | …een [warm \| warme] **dekbed** van Texelse wol (duvet) | "de vest" is Belgian, so "een warme vest" is not clearly wrong. Texel wool duvets are a real product. |
| 12 | L93 | Het terras dat [aan de haven ligt \| ligt aan de haven] | [**hier** aan de haven ligt \| ligt **hier** aan de haven]; EN "The terrace here by the harbour" | Extraposed PP. |
| 13 | L94 | De boot die [om negen uur vertrekt \| vertrekt om negen uur] | [**vandaag** om negen uur vertrekt \| vertrekt **vandaag** …]; EN "at nine today" | Extraposed time PP is very common. |
| 14 | L94 | Het schaap dat [op het fietspad staat \| staat op het fietspad] | [**al uren** op het fietspad staat \| staat **al uren** …]; EN "has been standing … for hours" | Extraposed PP. |
| 15 | L94 | Is dit de bus die [naar De Koog gaat \| gaat naar De Koog] | [**vanavond** naar De Koog gaat \| gaat **vanavond** …]; EN "tonight" | Extraposed directional PP is very common. |
| 16 | L95 | Het schaap [dat bij de deur staat \| dat staat bij de deur \| dat bij de deur] | [dat **al** bij de deur staat \| dat staat **al** bij de deur \| dat **al** bij de deur]; EN "is already standing" | Extraposed PP. |
| 17 | L97 | Het schaap dat [naast ons woont \| woont naast ons] | [**al jaren** naast ons woont \| woont **al jaren** …]; EN "has lived next to us for years" | Extraposed PP. |
| 18 | L103 | Dit is geen [goed \| goede] **idee**. | Dit is geen [goed \| goede] **plan**. | "de idee" is Belgian, so "geen goede idee" is accepted there. |
| 19 | L110 | [Zou \| **Zal**] u mij kunnen zeggen … | distractor **Zouden**; why adds "u takes the singular zou, not zouden." | "u zal" is accepted (Taaladvies, Flemish). |
| 20 | L110 | De trein die [naar Luik gaat \| gaat naar Luik] | [**vanavond** naar Luik gaat \| gaat **vanavond** …]; EN "tonight" | Extraposed directional PP. |
| 21 | L114 | EN: I think **chips** taste better than patat. | I think **friet** tastes better than patat. | The gloss did not match the Dutch. |
| 22 | L117 | Paola vroeg of er noten [in de saus zaten \| zaten in de saus] | the fork now covers the whole clause: [er noten in de saus zaten \| **zaten er noten** in de saus] | "of er noten zaten in de saus" is natural speech. |
| 23 | L124 | Nee, bij [deze \| dit] **kraam** kan alleen contant. | …bij [deze \| dit] **kaasboer**…; EN "this cheese seller takes cash only"; why: people are de-words | The Woordenlijst lists kraam as de and het. |
| 24 | L125 | [Ik zit vol \| **Ik ben vol**] | distractor **Ik heb vol**; why: "Full after a meal is ik zit vol, with zitten. ik heb vol is not Dutch." | "ik ben vol" is common NL speech. |
| 25 | L125 | tweehonderd kilometer [zuidelijker \| **meer zuidelijk** \| zuidelijkst] | distractor **zuidelijkere**; why adds "With no noun after it, it takes no -e." | "meer zuidelijk" is used ("meer zuidelijk gelegen"). |
| 26 | L127 | why: "Rising by an amount is stijgen met. stijgen tot is rising to a level." (distractor is **op**) | "Rising by an amount is stijgen met: met drie komma vijf procent. stijgen op is not said." | The why line explained an option that was not there. |
| 27 | L128 | …gewonnen door een **vrouw uit Kenia**, in vierenveertig minuten | …door een **man uit Ethiopië** (EN updated) | 44 minutes for 10 miles is far beyond any women's time. The course record (44:24) belongs to Haile Gebrselassie. |
| 28 | L128 | Als ik meer had getraind, [had ik \| **was ik**] sneller gelopen (rule aux) | [had ik \| **ik had**] (rule v2); why: "The als-clause fills slot 1, so the main clause starts with its verb: had ik ... gelopen." | "was ik sneller gelopen" is accepted: zijn with lopen without a direction is common, and Taaladvies allows it. |
| 29 | L130 | De honden moesten [uit \| **buiten**] | distractor **uitlaten**; why: "uitlaten is what you do to the dogs, so it needs you as the subject." | "de hond moet buiten" is Flemish for needs to go out, and valid NL Dutch for "had to stay outside". |
| 30 | towns.js Groningen | joke: "For years the ground shook here because of the gas … The ground still shakes. That is not the gas." | "The Martinitoren has watched students cycle home late for five hundred years. The dead are just the latest intake." / NL "De Martinitoren ziet al vijfhonderd jaar studenten laat naar huis fietsen. De doden zijn gewoon de nieuwste lichting." | Rule 8: no jokes about the Groningen gas earthquakes. |

## For a human native speaker: things I was unsure about and left as they are

1. **Historic present.** L77 "Gisteravond [aten we | **eten we**]" and L79 "Gisteren [duurde | **duurt**] de vergadering". In a story
   ("Zit ik gisteren in de trein…") the present is possible. As a flat statement it is wrong, and the English is past. Kept.
2. **kraam, de or het.** I believe the Woordenlijst gives both. If so, the dehet item in L69 (kraam = de) and the `wrong: 'het marktkraam'`
   word items should also be checked. I only changed the L124 fork.
3. **L99 read** "Er zit een scheur in de muur sinds de beving." and the Groningen word list (de aardbeving, de gaswinning, L99 listen,
   L103 word). These are neutral vocabulary, not jokes, so I kept them. A Groninger may still find a quake crack in the "Thuis" level of a
   horror game too close.
4. **Zeeland town joke** (`towns.js`): the blurb names the 1,836 dead of 1953, and the joke right after it is "On storm nights they all
   close. Someone still knocks." This can read as the drowned knocking. It is not on the rule 8 list, but a Zeeuw might not laugh.
5. **"bomma"** (L107, L113) is glossed as Maastricht dialect for grandma. It is mainly Flemish and Belgian Limburg. Check whether
   Maastrichters use it, or whether it should be "oma".
6. **L76 / L115 "Ik pak [wel even | even wel]"**: I take "even wel" as wrong, but particle order is a matter of feel.
7. **L80 "Ik [zou | zal | zouden] graag een starttijd willen reserveren"**: "Ik zal graag … willen" is very odd, but not impossible.
8. **L79 "Zou je me even kunnen helpen [met | aan | voor] deze melding"**: "iemand aan iets helpen" exists (to get someone something).
   It is wrong in meaning here.
9. **L129 "met de fiets [aan de hand | in de hand]"**: some speakers may say "in de hand".
10. **L130 "niemand had [hem | zich] laten praten"** about the personified de taal: hem is fine in NL, but haar may feel more natural.
    The why line says "de-word, so hem".
11. **L83 "De gezinnen op Urk zijn groter dan de huizen"**: a gentle joke about big (orthodox) families. Probably fine.
12. **L123 town rumour / read** "het klinkt als een dronken Duitser": a well-known tourist line. Probably fine.
13. **L9 "Twee [pizza's | pizzas]"**: the options differ only by an apostrophe, close to the brief's "differ only by punctuation" rule.
