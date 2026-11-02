// window.voiceId(voice, text): first 12 hex of sha1(voice + '|' + text) over UTF-8, the same id qa/voice-batch.mjs writes.
// Plain synchronous JS on purpose: crypto.subtle is missing on plain http (a LAN or Meshnet address) and is async.
(function () {
  function sha1hex(str) {
    const b = new TextEncoder().encode(str), n = b.length, words = ((n + 8) >> 6) + 1, w = new Uint32Array(words * 16);
    for (let i = 0; i < n; i++) w[i >> 2] |= b[i] << (24 - (i & 3) * 8);
    w[n >> 2] |= 0x80 << (24 - (n & 3) * 8); w[words * 16 - 1] = n * 8;
    let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0; const x = new Uint32Array(80);
    for (let o = 0; o < w.length; o += 16) {
      for (let t = 0; t < 16; t++) x[t] = w[o + t];
      for (let t = 16; t < 80; t++) { const v = x[t - 3] ^ x[t - 8] ^ x[t - 14] ^ x[t - 16]; x[t] = (v << 1) | (v >>> 31); }
      let a = h0, b2 = h1, c = h2, d = h3, e = h4;
      for (let t = 0; t < 80; t++) {
        const f = t < 20 ? (b2 & c) | (~b2 & d) : t < 40 ? b2 ^ c ^ d : t < 60 ? (b2 & c) | (b2 & d) | (c & d) : b2 ^ c ^ d;
        const k = t < 20 ? 0x5a827999 : t < 40 ? 0x6ed9eba1 : t < 60 ? 0x8f1bbcdc : 0xca62c1d6;
        const tmp = (((a << 5) | (a >>> 27)) + f + e + k + x[t]) >>> 0;
        e = d; d = c; c = (b2 << 30) | (b2 >>> 2); b2 = a; a = tmp;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b2) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
    }
    return [h0, h1, h2, h3, h4].map(v => v.toString(16).padStart(8, '0')).join('');
  }
  window.voiceId = (voice, text) => sha1hex(voice + '|' + String(text).trim()).slice(0, 12);
})();
