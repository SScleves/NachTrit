// @ts-check
// Which rendered voice file plays a line. The id is voiceId(voice, text) from voice/hash.js (the same sha1 qa/voice-batch.mjs
// writes); voice/ids.json lists the ids that were rendered. The game imports this (src/speech.js); the unit tests in Node.
export const VOICES = { rider: 'nl-NL-MaartenNeural', narrator: 'nl-NL-MaartenNeural', passenger: 'nl-NL-FennaNeural', town: 'nl-NL-ColetteNeural' };
export const VOICE_ALL = ['nl-NL-MaartenNeural', 'nl-NL-FennaNeural', 'nl-NL-ColetteNeural'];
// the file for this text: the asked voice first, then any voice that has it (a listen line exists only as a passenger).
// ids: the Set of rendered ids, or null before ids.json arrives (then only the asked voice is tried). idOf: window.voiceId.
export function voiceFileOf(text, voice, ids, idOf, all = VOICE_ALL) {
  if (!idOf || !text) return null;
  for (const v of [voice, ...all.filter(x => x !== voice)]) {
    const id = idOf(v, text);
    if (ids ? ids.has(id) : v === voice) return id;
  }
  return null;
}
