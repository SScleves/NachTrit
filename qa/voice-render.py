#!/usr/bin/env python3
"""Render voice/lines.json to voice/<id>.mp3 with edge-tts (Microsoft neural voices through the Edge read-aloud service).

usage: ../venv/bin/python qa/voice-render.py [--limit N] [--jobs 4] [--retries 4]
Skips ids that already have a file, so a re-run only renders new or changed lines.
Writes voice/ids.json (the rendered ids) at the end; the browser hook loads it.
edge-tts gives mp3, 24 kHz mono, 48 kbps; when ffmpeg is installed each file is re-encoded to 32 kbps mono
(the first full render came to 85 MB at 48 kbps, 59 MB at 32 kbps). --no-reencode keeps the edge-tts file.
"""
import argparse, asyncio, json, os, shutil, sys, time
import edge_tts

ROOT = os.getcwd()
REENCODE = bool(shutil.which('ffmpeg'))
VOICE_DIR = os.path.join(ROOT, 'voice')


async def render(line, sem, retries, failed):
    out = os.path.join(VOICE_DIR, line['id'] + '.mp3')
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return 'skip'
    async with sem:
        for attempt in range(1, retries + 1):
            tmp = out + '.part'
            try:
                await edge_tts.Communicate(line['text'], line['voice']).save(tmp)
                if os.path.getsize(tmp) == 0:
                    raise RuntimeError('empty audio')
                if REENCODE:
                    small = tmp + '.32k.mp3'
                    p = await asyncio.create_subprocess_exec('ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ac', '1', '-ar', '24000', '-b:a', '32k', small)
                    if await p.wait() != 0:
                        raise RuntimeError('ffmpeg failed')
                    os.replace(small, tmp)
                os.replace(tmp, out)
                return 'done'
            except Exception as e:  # network hiccups, throttling: back off and try again
                if os.path.exists(tmp):
                    os.remove(tmp)
                if attempt == retries:
                    failed.append({**line, 'error': f'{type(e).__name__}: {e}'})
                    return 'fail'
                await asyncio.sleep(2 * attempt)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0, help='render at most N missing lines (for tests)')
    ap.add_argument('--jobs', type=int, default=4)
    ap.add_argument('--retries', type=int, default=4)
    ap.add_argument('--no-reencode', action='store_true', help='keep the 48 kbps file edge-tts gives')
    a = ap.parse_args()
    global REENCODE
    REENCODE = REENCODE and not a.no_reencode
    lines = json.load(open(os.path.join(VOICE_DIR, 'lines.json'), encoding='utf8'))
    todo = [l for l in lines if not os.path.exists(os.path.join(VOICE_DIR, l['id'] + '.mp3'))]
    print(f'{len(lines)} lines, {len(lines) - len(todo)} rendered already, {len(todo)} missing', flush=True)
    if a.limit:
        todo = todo[:a.limit]
    sem, failed, t0, n = asyncio.Semaphore(a.jobs), [], time.time(), 0
    tasks = [asyncio.create_task(render(l, sem, a.retries, failed)) for l in todo]
    for f in asyncio.as_completed(tasks):
        await f
        n += 1
        if n % 200 == 0:
            print(f'  {n}/{len(todo)}  {time.time() - t0:.0f}s  failed {len(failed)}', flush=True)
    path = os.path.join(VOICE_DIR, 'failed.json')
    if failed:
        json.dump(failed, open(path, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
        print(f'{len(failed)} failed, see voice/failed.json')
    elif os.path.exists(path):
        os.remove(path)
    have = sorted(l['id'] for l in lines if os.path.exists(os.path.join(VOICE_DIR, l['id'] + '.mp3')))
    with open(os.path.join(VOICE_DIR, 'ids.json'), 'w') as f:  # what the hook loads to know which files exist
        f.write(json.dumps(have, separators=(',', ':')) + '\n')
    size = sum(os.path.getsize(os.path.join(VOICE_DIR, f)) for f in os.listdir(VOICE_DIR) if f.endswith('.mp3'))
    print(f'done in {time.time() - t0:.0f}s; voice/*.mp3 total {size / 1e6:.1f} MB')
    sys.exit(1 if failed else 0)


asyncio.run(main())
