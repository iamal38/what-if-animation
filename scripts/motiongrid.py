"""Step 6: the motion check. Pulls frame grids from a render, one sheet per shot (or per frame range), each frame
labelled, so a walk, a fall, a catch or a reversal can be read at a glance without scrubbing.

python <skill>/scripts/motiongrid.py <slug> [S3 S5 ...] [--video out/<slug>/<slug>-raw.mp4] [--step 2]
python <skill>/scripts/motiongrid.py <slug> --range 120:180
Writes out/<slug>/motion/<shot>.jpg (every segment of that shot, in order) or out/<slug>/motion/range-<a>-<b>.jpg

Adapts grid layout for 16:9 (landscape) and 9:16 (vertical) episodes based on the format in episode.json.
"""
import json, subprocess, sys

from PIL import Image, ImageDraw, ImageFont

from wi import ep_dir, out_dir

slug = sys.argv[1]
args = sys.argv[2:]


def opt(name, default=None):
    return args[args.index(name) + 1] if name in args else default


# Detect aspect ratio from episode.json
ep = json.loads((ep_dir(slug) / 'episode.json').read_text(encoding='utf-8'))
fmt = ep.get('format', {})
aspect = fmt.get('aspect', '16:9')
is_vertical = aspect == '9:16'

video = opt('--video', str(out_dir(slug) / f'{slug}-raw.mp4'))
step = int(opt('--step', 2))
tl = json.loads((ep_dir(slug) / 'timeline.json').read_text(encoding='utf-8'))
out = out_dir(slug) / 'motion'
out.mkdir(exist_ok=True)
skip = {opt('--video'), opt('--step'), opt('--range')}
want = [a for a in args if not a.startswith('--') and a not in skip]
jobs = []
if opt('--range'):
    a, b = map(int, opt('--range').split(':'))
    jobs.append((f'range-{a}-{b}', list(range(a, b + 1, step))))
else:
    for s in tl['shots']:
        if want and s['id'] not in want:
            continue
        frames = []
        for g in tl['segments']:
            if g['shot'] == s['id']:
                frames += list(range(g['a'], g['b'], step))
        jobs.append((s['id'], frames))
try:
    font = ImageFont.truetype('arial.ttf', 22)
except OSError:
    font = ImageFont.load_default(22)

# Adaptive grid sizes based on aspect ratio
if is_vertical:
    W, H, cols = 270, 480, 8   # portrait thumbnails, more columns
else:
    W, H, cols = 480, 270, 6   # landscape thumbnails

for name, frames in jobs:
    rows = (len(frames) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * W, rows * H))
    for i, f in enumerate(frames):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vf', f'select=eq(n\\\\,{f}),scale={W}:{H}', '-vframes', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True, check=True).stdout
        tmp = out / '_f.png'
        tmp.write_bytes(raw)
        im = Image.open(tmp).convert('RGB')
        dr = ImageDraw.Draw(im)
        dr.rectangle([0, 0, 64, 28], fill=(0, 0, 0))
        dr.text((5, 2), str(f), fill=(255, 255, 0), font=font)
        sheet.paste(im, ((i % cols) * W, (i // cols) * H))
    p = out / f'{name}.jpg'
    sheet.save(p, quality=85)
    print(p)
(out / '_f.png').unlink(missing_ok=True)
