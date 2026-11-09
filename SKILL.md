---
name: what-if-animation
description: Make a "What If" animated episode from one topic line ("What if you could rewind 10 seconds?"), in the dusk-lit stick-figure style of the What If channels that broke out on YouTube in October 2026. Before generating anything, the user picks the output format — 16:9 (YouTube), 9:16 (Shorts/Reels/TikTok), or both — and optionally a length preset (Full 15-25 s or Short 8-12 s). Writes the script on the seven-beat What If formula, voices it with ElevenLabs, lays out a shot list at the genre's pace, renders a storyboard of stills and self-checks it before animating, animates every frame in code (Remotion and SVG, with an original cast on one rig, rooms in perspective and light from lamps and windows), generates and syncs the sound, and masters a finished episode to -14 LUFS. Use when someone asks for a What If episode, animation or cartoon, "make a what if video about X", a stick-figure explainer in this style, or to run the free What If skill.
---

# What If animation

One topic line in, a finished episode out. Every frame is SVG that Claude writes (rendered by
Remotion); the voice and the sound come from ElevenLabs. Two examples ship in `studio/src/episodes/`, both ready to
render: `rewind` ("What if you could rewind 10 seconds?", the proof clip: shots played backwards as the power) and
`copy-paste` ("What if you could copy and paste anything?", the skill's first full run: a new kitchen set, a
schematic for the science beat, a cliffhanger blackout). Read the one closest to your topic before you start.

| File | What's in it |
|---|---|
| `references/formula.md` | The seven-beat What If formula, the 15-25 s shape (and the 8-12 s Short shape), script rules, choosing a topic |
| `references/look.md` | The measured look, pace, shot vocabulary, vertical framing rules, and the storyboard and motion checklists |
| `references/kit.md` | The building blocks: engine, cast, sets, room kit, light, UI, looks, and how to add each — including the vertical (9:16) world |
| `references/sound.md` | Writing sound events, prompts, levels, costs |
| `references/traps.md` | Everything that cost time on the two example episodes |
| `studio/` | The Remotion project: copy it once, then every episode lives in it |
| `scripts/` | voice, plan, stills, board, sfx, mixcheck, motiongrid, master (Python 3.9+ and Node) |

## Rules

- **Original characters only.** Pip (the hero, look B) and Mo (his friend) are ours, and so are the sister, mum and
  the suit on the rig. Never a channel's own hero, and nothing that resembles a famous cartoon character: check every
  new look on the cast sheet (Mo's first hat was dropped for drifting toward one).
- **Original stories.** The formula is shared; the episode isn't anyone else's. Don't remake a channel's title.
- **Never claim the viral channels are made with Claude** or any other tool. Nobody has said how they're made.
- **Keys by name only.** `ELEVENLABS_API_KEY`, from the environment or a `.env`
  above the studio. Never print, paste or hardcode a key.
- **Report the ElevenLabs credits** of every run: the scripts log them to `out/<slug>/costs.json` and `master.py`
  totals them in `report.json`. The voice's cost is read from the account's history (exact); sound clips don't show
  there, so their cost comes from the account counter, which can lag: re-read it before you report. Say the number
  when you hand the episode over. The copy-paste run cost 152 credits (78 for the voice, 74 for 12 new clips).
- **Storyboard before animation.** No video render until the stills pass the self-check (step 5) and, when the person
  is in the loop, they've seen the board.
- **Every fact is real.** A number in the script is worked out and sourced in the episode's `science` field first.

## Setup (once per machine)

Needs Node 18+, ffmpeg and ffprobe on the PATH, Python 3.9+ with `numpy` and `Pillow`, and an ElevenLabs key.

```bash
cp -r <skill>/studio ./what-if-studio && cd what-if-studio && npm install
```

Everything below runs from that studio folder; `<skill>` is this skill's folder. To work offline or in your own
brand face, put a display font in `public/fonts/` and set `titleFont` in `src/studio.config.ts` (the default title
face, Bricolage Grotesque, and the UI faces load from Google Fonts at render time). To update an existing studio to
a newer engine, copy `<skill>/studio/src/engine` over its `src/engine`.

## The pipeline

Work through the steps in order. Each ends on something you look at before the next.

---

### 0. Format — choose before anything else

**Ask the user before writing a single line of script or generating any media.** Present these choices:

#### Aspect ratio

| Option | Resolution | Use case |
|---|---|---|
| **16:9** (landscape) | 1920 × 1080 | YouTube, desktop, TV |
| **9:16** (vertical) | 1080 × 1920 | YouTube Shorts, Instagram Reels, TikTok |
| **Both** | Both resolutions | Export the same episode in both formats |

#### Length preset

| Preset | Duration | Words | Best for |
|---|---|---|---|
| **Full** | 15–25 s | 45–65 words | YouTube (16:9), longer Shorts |
| **Short** | 8–12 s | 20–35 words | Shorts, Reels, TikTok — snappier, 2 demos instead of 3, turn folded into one line |

Default: **Full** for 16:9, **Short** for 9:16 (but the user can mix: a Full-length Short or a Short 16:9 works too).

#### What the choice sets

Write the format into `episode.json` at the top:

```json
{
  "format": {
    "aspect": "16:9",
    "width": 1920,
    "height": 1080,
    "length": "full"
  }
}
```

Or for vertical:

```json
{
  "format": {
    "aspect": "9:16",
    "width": 1080,
    "height": 1920,
    "length": "short"
  }
}
```

Or for **both** (the primary renders first, the secondary re-renders with adjusted framing):

```json
{
  "format": {
    "aspect": "both",
    "primary": "16:9",
    "width": 1920,
    "height": 1080,
    "length": "full",
    "secondary": {
      "aspect": "9:16",
      "width": 1080,
      "height": 1920,
      "length": "short"
    }
  }
}
```

The `format` block flows into `studio.config.ts` (the engine reads `WIDTH`, `HEIGHT`, `FPS` from it) and
into the scripts. See `references/look.md` for how vertical changes the framing, and `references/kit.md` for
how the world coordinates adapt.

**When "both" is chosen:**
1. Write `shots.tsx` with both landscape and vertical camera framings per shot (see kit.md § "Dual-format shots")
2. Run the full pipeline for the primary format first
3. After mastering the primary, switch `studio.config.ts` to the secondary dimensions and re-render:
   - The voice, sound and timeline stay the same
   - Only the camera framing (zoom, centre) changes per shot
   - For Short length: the edit may trim beats (2 demos instead of 3, shorter tail)
   - Re-run `stills.mjs`, `board.py` (self-check the vertical board too), then `master.py`
4. Hand over both files: `<slug>-final.mp4` (primary) and `<slug>-final-vertical.mp4` or `<slug>-final-landscape.mp4`

---

### 1. Script

Read `references/formula.md`. Search YouTube for the premise first: if a What If channel already has that exact
episode, change the power or the rule. From the topic line, decide the power's word, its rule, three escalating
demos and the turn (one real fact with a number). Write `src/episodes/<slug>/episode.json` with `format` (from step 0),
`id` (PascalCase, the composition name), `slug`, `topic`, `title` (two lines), `script` (one entry per beat) and
`science` (each fact: the claim, the working, the source).

- **Full** (16:9 or vertical): 45 to 65 words, 3 demos.
- **Short** (8-12 s): 20 to 35 words, 2 demos, the turn folded into one punchy line.

Read it aloud at pace: every line must be a picture.

### 2. Voice

```bash
python <skill>/scripts/voice.py <slug>
```

One ElevenLabs take with character timestamps (the 356-character copy-paste take cost 78 credits), then the pauses
cut to the genre's pace: `public/<slug>/voice.wav` and `src/episodes/<slug>/words.json`. Check the length:
- **Full**: 15-25 s
- **Short**: 8-12 s

Check the word times it prints. Retune pauses with `gaps` in `episode.json` and re-run: the take is cached, so that's free. Change a word
and it calls the API again.

### 3. Shot list

Design one shot per picture in the script (usually 9 to 14 for Full, 5 to 8 for Short), varying the size and angle
every cut (wide, insert, medium, close-up, over the shoulder, high, low; see `references/look.md`).

**For 9:16 (vertical):** favour tighter shots — more close-ups and medium shots, fewer extreme wides. The vertical
frame naturally crops the sides, so centre the subject. See `references/look.md` § "Vertical framing".

Add to `episode.json`:

- `shots`: `{ "id": "S1", "size": "medium", "set": "kitchen", "key": 14, "note": "what we see" }` (`key` is the
  frame of the shot's own clock the storyboard shows)
- `edit`: `{ "shot": "S1", "at": "cookie" }` per cut, cued on the word it lands on (`plan.py` lists the cue forms;
  `reverse`, `from`, `to` and `look` for powers that bend a shot's clock)
- `fx`: one-frame flashes and shakes, `{ "at": "S3+2", "kind": "flash" }`

```bash
python <skill>/scripts/plan.py <slug>
```

It writes `timeline.json` and `out/<slug>/shotlist.md` and prints the pace. Aim for 27+ cuts a minute in the
opening and no static shot over about 3 s; fix what it flags before drawing anything.

### 4. Storyboard

Read `references/kit.md` for the building blocks. Write `src/episodes/<slug>/shots.tsx`, one component per shot,
each a pure function of its clock `t` (copy the patterns in the two examples' `shots.tsx`), and `index.tsx` (the
episode and its power look), then add the episode to `src/episodes/index.ts`.

**For 9:16:** use the vertical world (1080 × 1920 units). See `references/kit.md` § "The vertical world". Key
differences: ground line at x ≈ 540 (centred), tighter camera zooms, title card repositioned to the upper quarter,
HUD elements stacked vertically.

**For "both":** write each shot with two camera framings — a landscape `camT(...)` and a vertical `camTV(...)` — so
the same set and poses render correctly at both aspect ratios (see kit.md § "Dual-format shots").

At this step each shot only needs to be right at its `key` frame. When a topic needs a place the library lacks, build it
with the room kit and add it to `src/engine/sets/` (and to the skill's copy) so the next episode has it, as the
copy-paste run did with the kitchen and the schematic. A new character or costume: add the look, then check it on the
cast sheet (`npx remotion still src/index.ts Cast out/cast.png`).

```bash
npx tsc --noEmit
node <skill>/scripts/stills.mjs <slug>
python <skill>/scripts/board.py <slug>
```

`out/<slug>/storyboard.jpg`: one captioned still per shot.

### 5. Self-check the stills

Look at the storyboard, then open every still in `out/<slug>/board/` at full size, and run the storyboard checklist
in `references/look.md` honestly, shot by shot. Write down what fails, fix it, re-render just those shots
(`stills.mjs <slug> S3 S7`), rebuild the sheet and look again. Repeat until it passes. Check `references/traps.md`
for the failure you're seeing before inventing a fix. If the person is in the loop, show them the board now and
take their notes before animating.

**For 9:16:** also run the vertical-specific checks in `references/look.md` § "Vertical storyboard check".

### 6. Animate

Bring each shot to life from its key pose: `poseAt` keys with anticipation, holds and overshoot, `faceAt` for
expressions, camera moves with `kf`, the power's look, the `fx`. Then render a draft and check the motion:

```bash
python <skill>/scripts/master.py <slug>
python <skill>/scripts/motiongrid.py <slug> S2 S5
node <skill>/scripts/stills.mjs <slug> --frames 120 240
```

Read the grids like a flipbook against the motion checklist in `references/look.md`; fix and re-render until it
reads.

### 7. Sound

Read `references/sound.md`. Add `sound` to `episode.json`: the clips (prompt and length), one event per visible
action cued to its shot, ambiences per location, the music bed and the levels. Check what the library already has,
then generate:

```bash
python <skill>/scripts/sfx.py <slug> --dry
python <skill>/scripts/sfx.py <slug>
```

It prints the credits it used and sets the stem volumes in `timeline.json`. Then check that every word stays clear:

```bash
python <skill>/scripts/mixcheck.py <slug>
```

It lists the moments, while a word is being spoken, where effects or music come within 3 dB of the voice. A hit that
illustrates a word lands in the pause just after it, never on it; a bed (a hum, a drone) under a key line comes down;
if most of the stem crowds the voice, lower `sfx_lu`. Re-run sfx.py and the check until only deliberate overlaps
remain (a title boom, a turn).

### 8. Master and hand over

```bash
python <skill>/scripts/master.py <slug>
```

Renders, brings the mix to -14 LUFS with peaks under -1 dBTP, and writes `out/<slug>/report.json` (length, loudness,
pace, credits). Watch the final file once through with sound. Hand over `out/<slug>/<slug>-final.mp4` and
`out/<slug>/storyboard.jpg`, with the length, the ElevenLabs credits used, and anything you'd still improve.

**For "both" format:** after mastering the primary, switch `studio.config.ts` to the secondary format's dimensions,
adjust the camera framings in `shots.tsx` (use the vertical/landscape alternates), and re-run steps 4-5 (stills +
self-check) and step 8 (master). The voice, sound, and timeline carry over — only the visual framing changes.
Hand over both files with their respective reports.

### 9. Dual export (when "both" was chosen)

After both renders are done:

1. **Primary file:** `out/<slug>/<slug>-final.mp4` (e.g., 1920×1080 landscape)
2. **Secondary file:** `out/<slug>/<slug>-final-<format>.mp4` (e.g., `<slug>-final-vertical.mp4` at 1080×1920)
3. **Both storyboards:** `out/<slug>/storyboard.jpg` and `out/<slug>/storyboard-<format>.jpg`
4. **Combined report:** `out/<slug>/report.json` with both formats' stats

Hand over all files, with the length, the ElevenLabs credits used (they're shared — the voice and sound are generated
once), and which format you think works better for this particular episode.

## Where an episode lives

| Path | What |
|---|---|
| `src/episodes/<slug>/episode.json` | Everything you write: format, script, science, shots, edit, fx, sound |
| `src/episodes/<slug>/shots.tsx`, `index.tsx` | The drawing: one component per shot, the power's look |
| `src/episodes/<slug>/words.json`, `timeline.json` | Written by voice.py and plan.py (sfx.py adds the volumes) |
| `public/<slug>/` | voice.wav, sfx.wav, music.wav |
| `out/<slug>/` | board stills, storyboard.jpg, shotlist.md, motion grids, renders, costs.json, report.json |
| `library/sfx/` | Every generated sound clip, shared by all episodes |
