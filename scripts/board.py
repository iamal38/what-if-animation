"""Step 4: the storyboard sheet. Lays the board stills out as one captioned contact sheet: shot number and size, start
time, the words over it, and the note. This is what gets reviewed (by you, then by the person) before any animation.

python <skill>/scripts/board.py <slug> [--cols 3] [--secondary] [--dir <dir>]
Reads  out/<slug>/board/<shot>.png (from stills.mjs) and src/episodes/<slug>/timeline.json
Writes out/<slug>/storyboard.jpg (or storyboard-secondary.jpg / storyboard-vertical.jpg)

Adapts layout automatically for 16:9 (landscape) and 9:16 (vertical) episodes based on the format in episode.json.
"""
import json, pathlib, sys

from PIL import Image, ImageDraw, ImageFont

from wi import STUDIO, ep_dir, out_dir

slug = sys.argv[1]
default_cols = None  # auto-detect from format
if '--cols' in sys.argv:
    default_cols = int(sys.argv[sys.argv.index('--cols') + 1])
tl = json.loads((ep_dir(slug) / 'timeline.json').read_text(encoding='utf-8'))
ep = json.loads((ep_dir(slug) / 'episode.json').read_text(encoding='utf-8'))

secondary = '--secondary' in sys.argv
dir_opt = sys.argv[sys.argv.index('--dir') + 1] if '--dir' in sys.argv else None

fmt = ep.get('format', {})
if secondary:
    fmt = fmt.get('secondary', fmt)

aspect = fmt.get('aspect', '16:9')
is_vertical = aspect == '9:16'
ep_width = fmt.get('width', 1920 if not is_vertical else 1080)
ep_height = fmt.get('height', 1080 if not is_vertical else 1920)

if dir_opt:
    src = out_dir(slug) / dir_opt
elif secondary:
    src = out_dir(slug) / ('board-secondary' if (out_dir(slug) / 'board-secondary').exists() else 'board')
else:
    src = out_dir(slug) / 'board'


def font(size, bold=True):
    """The first face that exists: your own (fonts/ in the studio), then common system faces, then Pillow's default."""
    cands = [STUDIO / 'public' / 'fonts' / 'board.ttf', STUDIO / 'public' / 'fonts' / 'board.otf']
    cands += [pathlib.Path(p) for p in ['C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arialbd.ttf',
                                         '/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/System/Library/Fonts/Helvetica.ttc',
                                         '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']]
    for c in cands:
        if c.exists():
            return ImageFont.truetype(str(c), size)
    return ImageFont.load_default(size)


head, body, note = font(34), font(28), font(23, False)

# Adaptive thumbnail sizes based on aspect ratio
if is_vertical:
    W, H = 540, 960          # portrait thumbnails (9:16 ratio)
    cols = default_cols or 4  # more cols since they're narrower
    CAP = 160
else:
    W, H = 960, 540           # landscape thumbnails (16:9 ratio)
    cols = default_cols or 3
    CAP = 160

PAD = 24
n = len(tl['shots'])
rows = (n + cols - 1) // cols
sheet = Image.new('RGB', (cols * W + (cols + 1) * PAD, rows * (H + CAP + PAD) + PAD + 90), (20, 17, 26))
d = ImageDraw.Draw(sheet)
title = ' '.join(ep['title']) if isinstance(ep.get('title'), list) else ep.get('topic', slug)
format_label = f'{ep_width}×{ep_height} ({aspect})'
d.text((PAD, 26), f'{title}  ·  storyboard  ·  {tl["total"] / tl["fps"]:.1f} s  ·  {format_label}', font=head, fill=(246, 239, 227))


def fit(text, f, width):
    """Wrap text into at most two lines that fit the caption."""
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=f) <= width:
            cur = t
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    if len(lines) > 2:
        lines = lines[:2]
        lines[1] = lines[1][: max(0, len(lines[1]) - 2)] + '…'
    return lines


for i, s in enumerate(tl['shots']):
    x = PAD + (i % cols) * (W + PAD)
    y = 90 + PAD + (i // cols) * (H + CAP + PAD)
    p = src / f'{s["id"]}.png'
    if p.exists():
        sheet.paste(Image.open(p).convert('RGB').resize((W, H)), (x, y))
    else:
        d.rectangle([x, y, x + W, y + H], fill=(60, 30, 40))
        d.text((x + 20, y + 20), f'missing {p.name}', font=body, fill=(255, 120, 120))
    d.rectangle([x, y + H, x + W, y + H + CAP], fill=(32, 27, 40))
    d.text((x + 18, y + H + 12), f'{i + 1}  {s["id"]}  {s["size"].upper()}', font=head, fill=(255, 177, 90))
    at = f'{s["first"] / tl["fps"]:.1f} s'
    d.text((x + W - 18 - d.textlength(at, font=note), y + H + 20), at, font=note, fill=(170, 160, 185))
    line = f'"{s["line"]}"' if s.get('line') else '(no words)'
    yy = y + H + 58
    for ln in fit(line, body, W - 36):
        d.text((x + 18, yy), ln, font=body, fill=(246, 239, 227))
        yy += 34
    if s.get('note'):
        d.text((x + 18, yy + 2), fit(s['note'], note, W - 36)[0], font=note, fill=(170, 160, 185))

# Output filename includes format suffix for dual exports
if secondary:
    suffix = '-vertical' if is_vertical else '-landscape'
else:
    suffix = ''
out = out_dir(slug) / f'storyboard{suffix}.jpg'
sheet.save(out, quality=88)
print(out, sheet.size, f'({aspect})')
