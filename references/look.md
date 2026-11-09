# The look: what the genre does, and the self-check

Measured on 21 Oct 2026, frame by frame, from the leading channel's most-viewed episode (4.2M views, 24 fps) with
ffmpeg scene detection. We learn the technique (timing, camera grammar, light); every character, set and story stays
our own. Nothing confirms how the viral channels make their videos, so never say or imply they're made with Claude
or any other tool.

## Format awareness

Everything below uses the **16:9 (1920 × 1080)** canvas by default. For **9:16 (1080 × 1920)**, see the "Vertical
framing" section at the end — the same rules apply, but the camera grammar and safe zones shift.

## Pace

| | The genre | Full (15-25 s) | Short (8-12 s) |
|---|---|---|---|
| Cuts per minute, opening | about 27 (first 90 s) | 27 or more; the cold open can run 40-70 with reversals | 30+ throughout; no slow section |
| Median shot | 2.7 s in the opening | 0.7 to 3 s | 0.5 to 2 s |
| Long holds | up to about 12 s, always with action inside | nothing static over about 3 s | nothing static over about 2 s |

- Cuts come from **changing shot size**, not from motion: wide, then a macro insert, then a medium, then a close-up
  of a hand, then a reaction. No two neighbouring shots share a size and angle.
- The opening runs about twice as fast as the rest. Cut on the word: `plan.py` lands each cut 2 frames before its
  cue word.

## Light does most of the work

- A dusk palette: purple to orange sky, a low sun with soft rays behind the subject.
- **Every light comes from something you can see:** a window with the sun in it, a pendant, a wall light, a desk
  lamp, string lights, a lit doorway, city windows. Pools of light, dark corners.
- Muted, mid-dark walls (`S3` palette), so the practicals read; then `LightVeil` sinks the mid-tones further and
  leaves holes where the light falls.
- A warm rim light on every character edge, on the side facing the light (`rimId="rimR"` or `"rimL"`;
  `"rimRed"` for the turn).
- Haze, dust in the beams (`Dust`), soft bokeh. Depth of field: foreground objects blurred dark (`Foreground`),
  the middle sharp, the background soft on close-ups (`blur16` on a scaled-up set).
- Grain on twos and a soft vignette finish the frame (the engine's `Grade`).

## Shot vocabulary

- **Establishing wide:** the whole lit room, the character small in it.
- **Medium** (waist up, camera zoom about 1.6 to 2) and **close-up** (head; 3 to 4.5 for an extreme close-up).
- **Macro insert:** an object huge in frame, shallow focus (a mug, a cookie, a hand), often a high or top-down angle.
- **Over the shoulder:** a big, dark, blurred foreground figure filling a third of the frame.
- **High angle / top-down** (looking down at a desk, a landing) and **low angle** (looking up at a character against
  the sky: the rooftop's `low` prop).
- **Schematic** for the science beat: a dark grid, line icons, labels in the mono face, numbers counting.
- **Title card:** a wide establishing shot with the title over it, small first line, big second line.

## Characters

- Mostly three-quarter or profile (`yaw`), rarely face-on; the face slides toward the side they face.
- They animate very little: holds are near-still, with small hand changes. Expressions swap instantly through a
  blink (`faceAt`), never morph.
- Life comes from around them: a one-frame flash on an impact, focus rings, a timer, floating labels, dust, steam,
  a swaying lamp, a slow push-in.
- One hero who never changes. Every costume is a `Look` on the one rig, so it can't drift.

## On-screen text

Almost none. The title card, and small UI readouts in the mono face (a timer, a chip naming the power, a short
label). No speech bubbles, no "HA HA", no captions of the voice.

## The storyboard self-check (step 5)

Look at `storyboard.jpg`, then open every still at full size. Fix anything that fails, re-render those shots, look
again. Only a board that passes goes to animation.

1. **One read in a second.** At phone size the subject and the action are clear. If it needs the voice to make
   sense, reframe it.
2. **Sizes change.** No two neighbours share a size and angle; the board has wides, inserts, mediums, close-ups and
   at least one high or low angle.
3. **Light from a source.** Every shot has a visible practical or sunlight, and the subject sits in or against a
   pool of it. Mid-tones are dark; nothing is evenly lit.
4. **The character pops.** The face is the brightest, sharpest thing in its area; the rim light is on the lit side;
   no dark limb on a dark wall.
5. **Depth.** A blurred dark foreground in about a third of the shots; soft backgrounds on close-ups.
6. **The world is full.** Wides show 20 or more designed objects; no empty wall, no floating furniture. Everything
   that stands has legs and a contact shadow.
7. **Perspective holds.** Objects sit on their surfaces, at the right scale for the character, toward the room's
   vanishing point.
8. **Acting matches the line.** The expression and pose say the line without the voice; the hand that moves is the
   near one (with `yaw < 0` the far arm hides behind the body).
9. **Continuity.** Same costume, same set layout, same props in the same places across shots of one place.
10. **Only the title and readouts as text,** spelled right, inside the frame.
11. **Ours.** Nothing resembles a famous character, a channel's hero or a brand.

## The motion check (step 6)

Pull frame grids of every action shot with `motiongrid.py` and read them like a flipbook.

- Anticipation before a big move (a crouch before a step, a wind-up before a grab), a hold of 2 frames on the beat
  where the character realises, overshoot and settle on landings and catches.
- Nothing static for more than about a second: something always moves (dust, steam, a sway, a push-in).
- The action lands on its word, within about 3 frames.
- Reversals read backwards (every move derives from `t`, so it does).
- No pops: a prop never jumps between frames unless it's meant to (a paste, a flash).

---

## Vertical framing (9:16)

When the format is 9:16 (1080 × 1920), the world coordinate system stays 1080 × 1920 units. The same sets, characters
and light work, but the camera grammar changes:

### Canvas and safe zones

| | 16:9 (landscape) | 9:16 (vertical) |
|---|---|---|
| Canvas | 1920 × 1080 | 1080 × 1920 |
| Ground line | y ≈ 820 | y ≈ 1520 |
| Title card | upper third (~360 px), 2 lines | upper quarter (~480 px), can be 1 or 2 lines |
| Title font size | ~64 px | ~56 px (narrower frame) |
| HUD chips | top corners | centred top or stacked vertically at the side |
| Safe zone (text/UI) | 120 px inset on all sides | 80 px sides, 200 px top/bottom (platform UI overlaps) |

### Camera differences

| Shot type | 16:9 zoom | 9:16 zoom | Notes |
|---|---|---|---|
| Establishing wide | 0.75 – 1.1 | 0.55 – 0.8 | Vertical shows less width; zoom out further or use a narrower room |
| Medium | 1.6 – 2 | 1.4 – 1.8 | Centre the character; the frame is already tight horizontally |
| Close-up | 3 – 4.5 | 2.5 – 3.5 | The tall frame gives more vertical headroom |
| Macro insert | 4 – 6 | 3 – 5 | Objects can be shown in portrait orientation naturally |
| Over the shoulder | fill ⅓ of frame width | fill ½ of frame width | More dramatic in vertical (foreground figure is bigger) |

### What changes in vertical

- **Favour tighter shots.** The vertical frame crops the sides, so wides lose impact. Use more medium and close-up
  shots; save the establishing wide for one beat (the title card).
- **Centre the subject.** In landscape the character can sit at the rule of thirds; in vertical, centre them
  horizontally and place them in the lower 40-60% of the frame (above the platform's bottom UI bar).
- **Stack, don't spread.** UI elements (HudChip, Gauge, Dial) should stack vertically along one edge instead of
  sitting in opposite corners. The title card works as a single wide line or two lines stacked tighter.
- **The schematic works well vertical.** Icons and labels stack naturally; a `CountUp` number reads huge.
- **Over-the-shoulder is powerful.** The foreground figure takes the full width and fills the bottom half.
- **Top-down inserts feel natural.** A phone or a desk from above fits the portrait frame perfectly.
- **Ground line drops.** At y ≈ 1520 (vs. 820), characters stand in the lower quarter. Rooms need more ceiling
  and vertical dressing (tall bookcases, pendant lamps, wall art above eye level).

### Vertical storyboard check (step 5, additional)

Run these on top of the main 11-point check:

12. **Subject centred horizontally.** The face or the action is within the centre 60% of the 1080-wide frame.
13. **Safe from platform UI.** Nothing important in the bottom 200 px (like/comment buttons) or top 120 px
    (status bar, story progress dots).
14. **Vertical rhythm.** The frame reads top-to-bottom: sky/ceiling, action zone, ground/floor. The eye flows
    downward, not left-to-right.
15. **Title reads on mobile.** The title at ~56 px on 1080-wide: check it on a phone-sized preview.

### Dual-format shots (when "both" is chosen)

Write each shot with two camera setups. The set, poses and light are shared; only `camT` changes:

```tsx
export const S3: React.FC<ShotProps & { vertical?: boolean }> = ({ t, len, vertical }) => {
  const cam = vertical
    ? camT(kf(t, [[0, 540]]), kf(t, [[0, 1100]]), kf(t, [[0, 1.5], [len, 1.7]]))  // 9:16
    : camT(kf(t, [[0, 960]]), kf(t, [[0, 580]]), kf(t, [[0, 1.8], [len, 2.0]]));   // 16:9
  return (
    <g transform={cam}>
      {/* the same set, characters, light */}
    </g>
  );
};
```

The engine reads the format from `studio.config.ts` and passes `vertical` to each shot. Storyboard and self-check
both formats separately.
