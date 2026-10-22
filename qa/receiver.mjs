// receives frames posted by the page (window.NRsnap) and writes them to qa/out/live/<n>.png
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const dir = path.join('qa', 'out', 'live'); fs.mkdirSync(dir, { recursive: true }); let n = 0;
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.end(); return; }
  if (req.method === 'POST' && req.url.startsWith('/shot')) {
    let body = ''; req.on('data', c => body += c); req.on('end', () => { const m = /^data:image\/png;base64,(.*)$/.exec(body); if (m) { const f = path.join(dir, `${String(++n).padStart(3, '0')}.png`); fs.writeFileSync(f, Buffer.from(m[1], 'base64')); res.end(f); } else { res.statusCode = 400; res.end('bad'); } });
    return;
  }
  res.statusCode = 404; res.end();
}).listen(8766, () => console.log('receiver on 8766'));
