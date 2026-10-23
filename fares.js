// Nachtrit fares: what a ride is worth, what it pays, and how the dead say the amount.
// Pure data and functions, no DOM, no Three.js. All money is integer cents, always a multiple of 10.
// Loads as a classic script before the module and in node through vm with a fake window.
(function () {
  const UNITS = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien',
    'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
  const TENS = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];

  // 0..999 as one Dutch word
  function numWord(n) {
    if (n < 20) return UNITS[n];
    if (n < 100) {
      const t = Math.floor(n / 10), u = n % 10;
      if (!u) return TENS[t];
      const uw = UNITS[u];
      return uw + (/[aeiou]$/.test(uw) ? 'ën' : 'en') + TENS[t];   // tweeëntwintig, drieëndertig, eenentwintig
    }
    const h = Math.floor(n / 100), r = n % 100;
    return (h === 1 ? '' : UNITS[h]) + 'honderd' + (r ? numWord(r) : '');
  }

  // euros (a number, 2.3 = two euros thirty) to spoken Dutch: 'twee euro dertig'
  function euroToWords(n) {
    const c = Math.max(0, Math.round((+n || 0) * 10) * 10);   // snap to 10 cents
    const e = Math.floor(c / 100), ct = c % 100;
    if (!e && !ct) return 'nul euro';
    if (!e) return numWord(ct) + ' cent';
    const ew = e === 1 ? 'één' : numWord(e);
    return ew + ' euro' + (ct ? ' ' + numWord(ct) : '');
  }

  // cents to '€ 4,50'
  function fmtEuro(cents) {
    const c = Math.round(+cents || 0), a = Math.abs(c);
    const s = '€ ' + Math.floor(a / 100) + ',' + String(a % 100).padStart(2, '0');
    return c < 0 ? '− ' + s : s;
  }

  const FLAT = { dehet: 50, look: 100, read: 150 };

  // the fare for one ride; works on level items and on planner entries alike
  function fareFor(entry, tier) {
    if (!entry) return 0;
    if (entry.read) return FLAT.read;
    if (entry.look) return FLAT.look;
    if (entry.dehet) return FLAT.dehet;
    const forks = Math.max(1, entry.parts ? entry.parts.filter(p => typeof p !== 'string').length : 1);
    const t = +tier || 1;
    return Math.max(200, Math.min(1200, 150 + 50 * t + 150 * (forks - 1)));
  }

  // what a ride pays: each wrong fork halves it, floored to 10 cents; a one-fork ride said wrong and three wrong pay nothing
  function payCents(fare, wrong, forks) {
    if (wrong >= Math.min(3, forks)) return 0;
    return Math.floor(fare / Math.pow(2, wrong) / 10) * 10;
  }

  // refusals: minTier..maxTier is the tier range of the town where the line is said
  const REFUSE = [
    { nl: 'Dat betaal ik niet.', en: "I'm not paying for that.", minTier: 1, maxTier: 99 },
    { nl: 'Geen cent.', en: 'Not a cent.', minTier: 1, maxTier: 3 },
    { nl: 'Volgende keer beter.', en: 'Better luck next time.', minTier: 1, maxTier: 3 },
    { nl: 'Ik ben dood, niet doof.', en: "I'm dead, not deaf.", minTier: 1, maxTier: 6 },
    { nl: 'Zo zeg je dat niet.', en: "That's not how you say it.", minTier: 2, maxTier: 99 },
    { nl: 'Dit klopt niet.', en: "This isn't right.", minTier: 2, maxTier: 99 },
    { nl: 'Ik had het zelf beter gezegd.', en: "I'd have said it better myself.", minTier: 4, maxTier: 99 },
    { nl: 'Daar geef ik geen cent voor.', en: "I won't give a cent for that.", minTier: 4, maxTier: 99 },
    { nl: 'Mijn oma sprak beter Nederlands, en die ligt al honderd jaar onder de grond.', en: "My grandmother spoke better Dutch, and she's been in the ground a hundred years.", minTier: 9, maxTier: 99 },
  ];

  // tips: the first of a run is always 'Hou de rest maar.', later ones rotate through the rest
  const TIPS = [
    { nl: 'Hou de rest maar.', en: 'Keep the change.', minTier: 1, first: true },
    { nl: 'Klopt zo.', en: "That's fine as it is.", minTier: 1 },
    { nl: 'Laat maar zitten.', en: 'Keep it.', minTier: 4 },
  ];

  window.FARES = { euroToWords, fmtEuro, fareFor, payCents, FLAT, REFUSE, TIPS };
})();
