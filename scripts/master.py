"""Step 8: the master. Renders the episode, then brings the mix to -14 LUFS with true peaks under -1 dBTP (two-pass
loudnorm, video copied untouched), measures the result and writes the report.

python <skill>/scripts/master.py <slug> [--skip-render] [--concurrency 6] [--secondary]
Writes out/<slug>/<slug>-raw.mp4, out/<slug>/<slug>-final.mp4 and out/<slug>/report.json

With --secondary, renders the secondary format (for dual export): output is <slug>-final-vertical.mp4 or
<slug>-final-landscape.mp4. The voice, sound and timeline are reused; only the video dimensions change.
"""
import json, re, subprocess, sys, time

from wi import STUDIO, ep_dir, load_episode, load_json, loudness, out_dir, save_json

slug = sys.argv[1]
args = sys.argv[2:]
conc = args[args.index('--concurrency') + 1] if '--concurrency' in args else None
secondary = '--secondary' in args
ep = load_episode(slug)
od = out_dir(slug)

# Determine format suffix for secondary export
fmt = ep.get('format', {})
if secondary:
    sec = fmt.get('secondary', {})
    sec_aspect = sec.get('aspect', '9:16')
    suffix = '-vertical' if sec_aspect == '9:16' else '-landscape'
else:
    suffix = ''

raw = od / f'{slug}-raw{suffix}.mp4'
final = od / f'{slug}-final{suffix}.mp4'
npx = 'npx.cmd' if sys.platform == 'win32' else 'npx'

if '--skip-render' not in args:
    t0 = time.time()
    cmd = [npx, 'remotion', 'render', 'src/index.ts', ep['id'], str(raw), '--log', 'error']
    if conc:
        cmd += ['--concurrency', conc]
    print(' '.join(cmd))
    subprocess.run(cmd, cwd=STUDIO, check=True)
    print(f'rendered in {time.time() - t0:.0f} s')

I, TP, LRA = -14.0, -1.5, 11
first = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(raw), '-af', f'loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
m = json.loads(first[first.rfind('{'):first.rfind('}') + 1])
filt = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(raw), '-c:v', 'copy', '-af', filt, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', str(final)], check=True)
lufs, peak = loudness(final)
tp = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(final), '-af', f'loudnorm=I={I}:TP={TP}:print_format=json', '-f', 'null', '-'],
                    capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
true_peak = float(json.loads(tp[tp.rfind('{'):tp.rfind('}') + 1])['input_tp'])
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(final)], capture_output=True, text=True).stdout.strip())
tl = load_json(ep_dir(slug) / 'timeline.json')
costs = load_json(od / 'costs.json', [])

# Include format info in report
report_format = fmt.get('secondary', fmt) if secondary else fmt
report = {
    'episode': ep['id'], 'file': str(final), 'seconds': round(dur, 2), 'lufs': lufs, 'true_peak_dbtp': true_peak,
    'format': report_format.get('aspect', '16:9'), 'resolution': f"{report_format.get('width', 1920)}x{report_format.get('height', 1080)}",
    'segments': len(tl['segments']), 'cuts_per_min': round((len(tl['segments']) - 1) / (tl['total'] / tl['fps']) * 60, 1),
    'elevenlabs_credits': sum(c['credits'] for c in costs), 'cost_lines': costs,
}

# For dual export, write separate report files
report_file = od / f'report{suffix}.json' if suffix else od / 'report.json'
save_json(report_file, report)
print(json.dumps({k: v for k, v in report.items() if k != 'cost_lines'}, indent=1))
ok = abs(lufs + 14) <= 0.5 and true_peak <= -1.0
print('loudness OK' if ok else '! loudness off target: check the report')
