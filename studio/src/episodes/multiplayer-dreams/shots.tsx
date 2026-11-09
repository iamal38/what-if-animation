import React from 'react';
import {
  Hero, LOOKS, basePose, poseAt, kf, clamp, lerp, easeOut, easeIn, backOut, faceAt, HEAD, C,
  Tag, TitleCard, Dial, Gauge, HudChip, Sparkle, FocusRings, Marquee, PasteIn, Toast,
  FONT, rnd, ShotProps, camT916,
} from '../../engine';

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const MO = LOOKS.mo;
const SUIT = LOOKS.suit;

// Frame: 1080 x 1920 (9:16 vertical video). Center: (540, 960).

// ---------- S1: Pip floating through dream sky ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const y = 920 + Math.sin(t / 8) * 35;
  const cape = Math.sin(t / 4) * 16;
  const pose = {
    ...basePose,
    x: 540,
    y,
    scale: 1.15,
    tilt: 18,
    armL: { a: -60, b: -20 },
    armR: { a: -75, b: -10 },
    legL: { a: 25, b: -15 },
    legR: { a: 15, b: -30 },
    expr: 'happy' as const,
  };
  return (
    <g>
      <defs>
        <linearGradient id="s1Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B1233" />
          <stop offset="50%" stopColor="#311B4D" />
          <stop offset="100%" stopColor="#140E26" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#s1Sky)" />
      {/* Floating dreamy clouds */}
      {[
        [200, 400, 180, 0.4],
        [850, 600, 240, 0.5],
        [350, 1200, 220, 0.35],
        [750, 1500, 280, 0.45],
      ].map(([cx, cy, r, o], i) => (
        <g key={i} opacity={o}>
          <circle cx={cx} cy={cy} r={r} fill="#543A7E" />
          <circle cx={cx + 70} cy={cy + 20} r={r * 0.8} fill="#6E4D9E" />
          <circle cx={cx - 60} cy={cy + 30} r={r * 0.75} fill="#462F6B" />
        </g>
      ))}
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={(i * 137) % 1040 + 20} cy={(i * 263) % 1840 + 40} r={2 + (i % 3)} fill="#FFE8A3" opacity={0.4 + 0.4 * Math.sin(t / 6 + i)} />
      ))}
      {/* Superhero cape */}
      <path
        d={`M 510 ${y - 80} Q ${420 - cape} ${y + 20} ${400 - cape * 1.5} ${y + 140} Q 500 ${y + 60} 530 ${y - 40} Z`}
        fill="#FF5A4A"
        stroke="#1A1230"
        strokeWidth={5}
      />
      <Hero look={PIP} pose={pose} shadow={0} />
      <Sparkle x={620} y={y - 120} t={t % 20} s={1.2} />
    </g>
  );
};

// ---------- S2: Sis drops in riding a giant goldfish ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const dropY = kf(t, [[0, 200], [15, 880], [30, 920]]);
  const fishWob = Math.sin(t / 4) * 20;
  const fishX = 540 + Math.sin(t / 6) * 40;
  const sisPose = {
    ...basePose,
    x: fishX - 20,
    y: dropY - 90,
    scale: 0.85,
    tilt: 12,
    armL: { a: 45, b: 20 },
    armR: { a: 60, b: 15 },
    expr: 'happy' as const,
  };
  return (
    <g>
      <rect width={1080} height={1920} fill="#24163E" />
      {/* Speed lines dropping down */}
      {[160, 340, 520, 720, 900].map((x, i) => (
        <line key={i} x1={x} y1={((t * 40 + i * 200) % 2000) - 200} x2={x} y2={((t * 40 + i * 200) % 2000) + 150} stroke="#7FD4FF" strokeWidth={5} opacity={0.4} strokeDasharray="30 20" />
      ))}
      {/* Giant Goldfish */}
      <g transform={`translate(${fishX} ${dropY})`}>
        {/* Tail fin */}
        <path d={`M -180 0 Q -280 ${-80 + fishWob} -310 ${-120 + fishWob} Q -240 0 -310 ${120 + fishWob} Q -280 ${80 + fishWob} -180 0 Z`} fill="#FF8A3D" stroke="#1D2033" strokeWidth={6} />
        {/* Body */}
        <ellipse cx={0} cy={0} rx={210} ry={140} fill="#FFA24A" stroke="#1D2033" strokeWidth={8} />
        <ellipse cx={30} cy={-20} rx={160} ry={100} fill="#FFB96D" />
        {/* Scales texture */}
        {[-80, -20, 40].map((sx, i) => (
          <path key={i} d={`M ${sx} -40 Q ${sx + 30} 0 ${sx} 40`} stroke="#FF7A26" strokeWidth={6} fill="none" />
        ))}
        {/* Dorsal Fin */}
        <path d="M -80 -130 Q 0 -220 90 -130 Z" fill="#FF7A26" stroke="#1D2033" strokeWidth={6} />
        {/* Big Cartoon Eye */}
        <circle cx={130} cy={-40} r={38} fill="#F6EFE3" stroke="#1D2033" strokeWidth={6} />
        <circle cx={142} cy={-40} r={18} fill="#1D2033" />
        <circle cx={148} cy={-46} r={7} fill="#FFFFFF" />
        {/* Pectoral Fin */}
        <path d={`M 20 50 Q 80 ${130 - fishWob * 0.5} 30 150 Z`} fill="#FF7A26" stroke="#1D2033" strokeWidth={6} />
      </g>
      <Hero look={SIS} pose={sisPose} shadow={0} />
      <Sparkle x={fishX + 160} y={dropY - 140} t={t} s={1.4} />
    </g>
  );
};

// ---------- S3: Apartment cutaway: Pip & Sis asleep, distance 3.2m ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#161426" />
      {/* Apartment Floorplan Header */}
      <rect x={120} y={260} width={840} height={110} rx={20} fill="#24213D" />
      <text x={540} y={332} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#7FD4FF" letterSpacing={4}>
        PHYSICAL PROXIMITY SCAN
      </text>

      {/* Building Cutaway Container */}
      <rect x={120} y={420} width={840} height={1120} rx={28} fill="#1C1830" stroke="#363056" strokeWidth={8} />
      {/* Dividing Wall */}
      <line x1={540} y1={420} x2={540} y2={1540} stroke="#463F6E" strokeWidth={16} />
      <line x1={540} y1={420} x2={540} y2={1540} stroke="#1A152B" strokeWidth={6} />

      {/* Left Room: Pip's Bed */}
      <g transform="translate(160 880)">
        <rect x={30} y={160} width={300} height={200} rx={16} fill="#303A58" stroke="#1D2033" strokeWidth={6} />
        <rect x={30} y={160} width={300} height={60} rx={12} fill="#E5DFD3" />
        {/* Pip head asleep */}
        <circle cx={180} cy={170} r={44} fill="#F6EFE3" stroke="#1D2033" strokeWidth={5} />
        <path d="M 160 168 Q 170 174 180 168 M 184 168 Q 194 174 204 168" stroke="#1D2033" strokeWidth={4} fill="none" />
        <text x={180} y={420} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">PIP'S BED</text>
      </g>

      {/* Right Room: Sis's Bed */}
      <g transform="translate(580 880)">
        <rect x={30} y={160} width={300} height={200} rx={16} fill="#4A3452" stroke="#1D2033" strokeWidth={6} />
        <rect x={30} y={160} width={300} height={60} rx={12} fill="#E5DFD3" />
        {/* Sis head asleep */}
        <circle cx={180} cy={170} r={38} fill="#F6EFE3" stroke="#1D2033" strokeWidth={5} />
        <path d="M 164 168 Q 174 174 184 168 M 188 168 Q 198 174 208 168" stroke="#1D2033" strokeWidth={4} fill="none" />
        {/* Bunches */}
        <circle cx={136} cy={165} r={14} fill="#3A2620" />
        <circle cx={224} cy={165} r={14} fill="#3A2620" />
        <text x={180} y={420} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">SIS'S BED</text>
      </g>

      {/* Distance Line & Radar Wave */}
      <line x1={340} y1={1050} x2={760} y2={1050} stroke="#FF8A3D" strokeWidth={8} strokeDasharray="16 12" />
      <circle cx={340} cy={1050} r={16 + (t % 18) * 8} fill="none" stroke="#7FD4FF" strokeWidth={4} opacity={1 - (t % 18) / 18} />
      <circle cx={760} cy={1050} r={16 + (t % 18) * 8} fill="none" stroke="#7FD4FF" strokeWidth={4} opacity={1 - (t % 18) / 18} />

      {/* Distance Tag */}
      <Tag x={540} y={1050} t={t} text="3.2 METERS" mark="check" w={320} />
    </g>
  );
};

// ---------- S4: Mo sleeping on floor next to bed ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const zzz = (t * 2) % 60;
  return (
    <g>
      <rect width={1080} height={1920} fill="#181528" />
      {/* Bedroom floor and rug */}
      <ellipse cx={540} cy={1380} rx={440} ry={220} fill="#2B243B" />
      {/* Pip's bed on top half */}
      <rect x={140} y={460} width={800} height={440} rx={24} fill="#2A334E" stroke="#181B2A" strokeWidth={8} />
      <rect x={140} y={460} width={800} height={120} rx={16} fill="#E6DFD1" />
      <text x={540} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#7A8CA8">PIP (ASLEEP)</text>

      {/* Mo on Sleeping bag on the floor */}
      <rect x={220} y={1160} width={640} height={380} rx={40} fill="#435E3B" stroke="#1D2033" strokeWidth={8} />
      {/* Sleeping bag collar */}
      <ellipse cx={540} cy={1220} rx={180} ry={60} fill="#E9C46A" />
      {/* Mo's head */}
      <circle cx={540} cy={1180} r={65} fill="#C98E68" stroke="#1D2033" strokeWidth={6} />
      {/* Curly hair */}
      {[-40, -15, 15, 40].map((dx, i) => (
        <circle key={i} cx={540 + dx} cy={1120} r={28} fill="#2A1C18" />
      ))}
      {/* Headphones */}
      <path d="M 460 1190 A 80 80 0 0 1 620 1190" stroke="#FF5A4A" strokeWidth={16} fill="none" strokeLinecap="round" />
      {/* Closed relaxed eyes & open snoring mouth */}
      <path d="M 510 1180 Q 525 1188 540 1180 M 550 1180 Q 565 1188 580 1180" stroke="#1D2033" strokeWidth={5} fill="none" />
      <ellipse cx={545} cy={1205} rx={14} ry={20} fill="#1D2033" />

      {/* Floating ZZZ */}
      <text x={640 + zzz * 0.8} y={1140 - zzz * 2.5} fontFamily={FONT.title} fontWeight={800} fontSize={40 + zzz * 0.6} fill="#7FD4FF" opacity={1 - zzz / 60}>
        Zzz
      </text>
    </g>
  );
};

// ---------- S5: Dream transforms into Pizza Galaxy / Laser Battle ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  const laserP = (t * 28) % 900;
  return (
    <g>
      <rect width={1080} height={1920} fill="#140826" />
      {/* Space stars */}
      {[...Array(24)].map((_, i) => (
        <circle key={i} cx={(i * 197) % 1040 + 20} cy={(i * 163) % 1840 + 40} r={3 + (i % 3)} fill="#FFE27A" opacity={0.6} />
      ))}

      {/* Giant Floating Pizza Slice */}
      <g transform={`translate(540 680) rotate(${Math.sin(t / 8) * 12}) scale(1.3)`}>
        <polygon points="0,-260 220,180 -220,180" fill="#E8A34A" stroke="#1D2033" strokeWidth={8} />
        {/* Crust */}
        <path d="M -230 180 Q 0 230 230 180" stroke="#B86E28" strokeWidth={44} strokeLinecap="round" />
        {/* Pepperonis */}
        {[
          [-60, 40],
          [70, 70],
          [0, -40],
          [-100, 110],
          [80, -90],
        ].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={32} fill="#C0392B" stroke="#8A1F14" strokeWidth={4} />
        ))}
        {/* Cheese drips */}
        <path d="M -90 180 Q -80 240 -70 180 M 40 180 Q 50 260 65 180" stroke="#F1C40F" strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>

      {/* Mo standing on an asteroid firing lasers */}
      <ellipse cx={540} cy={1620} rx={420} ry={160} fill="#3A324A" stroke="#1D2033" strokeWidth={8} />
      <Hero
        look={MO}
        pose={{
          ...basePose,
          x: 540,
          y: 1420,
          scale: 1.1,
          tilt: -8,
          armL: { a: -70, b: 0 },
          armR: { a: -60, b: -10 },
          expr: 'happy',
        }}
        shadow={0}
      />
      {/* Dual Laser Blasts */}
      <line x1={460} y1={1300} x2={460 - laserP * 0.4} y2={1300 - laserP} stroke="#34C759" strokeWidth={16} strokeLinecap="round" />
      <line x1={620} y1={1300} x2={620 + laserP * 0.4} y2={1300 - laserP} stroke="#FF3B30" strokeWidth={16} strokeLinecap="round" />
      <Sparkle x={540} y={1300} t={t % 15} s={1.6} />
    </g>
  );
};

// ---------- S6: Pip sneaks toward secret dream vault ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const walk = (t * 4) % 100;
  return (
    <g>
      <rect width={1080} height={1920} fill="#0E121E" />
      {/* Heavy vault steel doorway */}
      <rect x={180} y={480} width={720} height={1080} rx={36} fill="#202A3D" stroke="#3A4D6B" strokeWidth={12} />
      {/* Vault Wheel */}
      <circle cx={540} cy={1020} r={180} fill="#171F2D" stroke="#547299" strokeWidth={16} />
      {[0, 45, 90, 135].map((deg, i) => (
        <line
          key={i}
          x1={540 - 180 * Math.cos((deg * Math.PI) / 180)}
          y1={1020 - 180 * Math.sin((deg * Math.PI) / 180)}
          x2={540 + 180 * Math.cos((deg * Math.PI) / 180)}
          y2={1020 + 180 * Math.sin((deg * Math.PI) / 180)}
          stroke="#547299"
          strokeWidth={14}
        />
      ))}
      <circle cx={540} cy={1020} r={50} fill="#7FD4FF" />
      {/* Warning Sign */}
      <rect x={280} y={560} width={520} height={90} rx={16} fill="#FF8A3D" />
      <text x={540} y={622} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fontWeight={700} fill="#140E26" letterSpacing={6}>
        PIP'S SECRET VAULT
      </text>

      {/* Pip sneaking */}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 360 + walk * 0.5,
          y: 1540,
          scale: 1.15,
          tilt: 16,
          armL: { a: 30, b: 30 },
          armR: { a: -20, b: 20 },
          expr: 'worried',
        }}
        shadow={0}
      />
    </g>
  );
};

// ---------- S7: Inside Vault: Sis reading secret diary ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#141124" />
      {/* Treasure Pedestal */}
      <rect x={260} y={1180} width={560} height={500} rx={24} fill="#271E3A" stroke="#48386B" strokeWidth={10} />
      {/* Glowing open Diary */}
      <g transform="translate(540 1060)">
        {/* Light beam up */}
        <polygon points="-160,0 160,0 260,-600 -260,-600" fill="url(#s7Glow)" opacity={0.35} />
        <defs>
          <linearGradient id="s7Glow" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FF7FD4" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#7FD4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Pink diary covers */}
        <path d="M -130 0 L -10 -20 L -10 90 L -130 110 Z" fill="#FF5A92" stroke="#1D2033" strokeWidth={6} />
        <path d="M 130 0 L 10 -20 L 10 90 L 130 110 Z" fill="#FF5A92" stroke="#1D2033" strokeWidth={6} />
        {/* Glowing Pages */}
        <path d="M -120 10 L -10 -10 L -10 80 L -120 100 Z" fill="#FFF2F8" />
        <path d="M 120 10 L 10 -10 L 10 80 L 120 100 Z" fill="#FFF2F8" />
        <text x={0} y={-40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FF5A92">
          CRUSHES & SECRETS
        </text>
      </g>

      {/* Sis sitting and reading smugly */}
      <Hero
        look={SIS}
        pose={{
          ...basePose,
          x: 540,
          y: 920,
          scale: 1.0,
          tilt: -6,
          armL: { a: 50, b: 40 },
          armR: { a: 50, b: 40 },
          expr: 'smug',
        }}
        shadow={0}
      />
      <Sparkle x={680} y={980} t={t} s={1.3} />
    </g>
  );
};

// ---------- S8: Title Card: WHAT IF DREAMS WERE MULTIPLAYER? ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#110B22" />
      {/* Dreamscape Backdrop */}
      <circle cx={540} cy={1100} r={460} fill="#241640" />
      <circle cx={540} cy={1100} r={320} fill="#351F5E" />
      <circle cx={540} cy={1100} r={180} fill="#4B2C84" />
      {/* Surreal floating islands */}
      <polygon points="120,1400 360,1320 280,1540" fill="#2E1C4D" stroke="#1D2033" strokeWidth={6} />
      <polygon points="960,1380 720,1300 800,1520" fill="#2E1C4D" stroke="#1D2033" strokeWidth={6} />
      {/* Title Card */}
      <TitleCard t={t} lines={["WHAT IF DREAMS WERE", "MULTIPLAYER?"]} accent="MULTIPLAYER?" x={540} y={480} size={106} />
      <FocusRings x={540} y={1100} t={t} r0={120} color="#7FD4FF" />
    </g>
  );
};

// ---------- S8B: HUD Radar (Proximity rule) ----------
export const S8B: React.FC<ShotProps> = ({ t }) => {
  const sweep = (t * 6) % 360;
  return (
    <g>
      <rect width={1080} height={1920} fill="#0A0F1D" />
      {/* Radar Circles */}
      <g transform="translate(540 960)">
        {[160, 320, 480].map((r, i) => (
          <circle key={i} r={r} fill="none" stroke="#254366" strokeWidth={4} />
        ))}
        {/* Radar Crosshairs */}
        <line x1={-500} y1={0} x2={500} y2={0} stroke="#254366" strokeWidth={3} />
        <line x1={0} y1={-500} x2={0} y2={500} stroke="#254366" strokeWidth={3} />
        {/* Radar Sweep Wedge */}
        <path
          d={`M 0 0 L ${480 * Math.cos((sweep * Math.PI) / 180)} ${480 * Math.sin((sweep * Math.PI) / 180)} A 480 480 0 0 0 ${480 * Math.cos(((sweep - 40) * Math.PI) / 180)} ${480 * Math.sin(((sweep - 40) * Math.PI) / 180)} Z`}
          fill="#38E8FF"
          opacity={0.25}
        />
        {/* You Icon (center) */}
        <circle r={24} fill="#FF8A3D" />
        <text y={48} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#FF8A3D">YOU</text>
        {/* Nearest Sleeping Players */}
        <circle cx={-180} cy={-120} r={18} fill="#5BE08A" />
        <text x={-180} y={-80} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#5BE08A">SIS (3m)</text>
        <circle cx={140} cy={220} r={18} fill="#7FD4FF" />
        <text x={140} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#7FD4FF">MO (1.5m)</text>
      </g>
      {/* HUD Chip */}
      <HudChip x={160} y={280} f={t} label="PROXIMITY SYNC" icon="dot" />
    </g>
  );
};

// ---------- S9: Co-op City Building (Skyscrapers summon) ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const buildH = kf(t, [[0, 0], [25, 600]]);
  return (
    <g>
      <rect width={1080} height={1920} fill="#140D28" />
      {/* Rising Neon Towers */}
      {[
        [220, 380, "#7FD4FF"],
        [540, 560, "#FF8A3D"],
        [860, 420, "#5BE08A"],
      ].map(([x, targetH, col], i) => (
        <g key={i}>
          <rect x={Number(x) - 100} y={1500 - (Number(targetH) * buildH) / 600} width={200} height={(Number(targetH) * buildH) / 600} fill={String(col)} opacity={0.3} stroke={String(col)} strokeWidth={6} />
          {/* Windows */}
          {[...Array(6)].map((_, w) => (
            <rect key={w} x={Number(x) - 70 + (w % 2) * 80} y={1540 - w * 70} width={40} height={40} fill="#FFFFFF" opacity={0.8} />
          ))}
        </g>
      ))}

      {/* Pip and Mo building */}
      <Hero look={PIP} pose={{ ...basePose, x: 420, y: 1620, scale: 0.95, tilt: -10, armL: { a: -80, b: -20 }, armR: { a: -60, b: 0 }, expr: 'happy' }} shadow={0} />
      <Hero look={MO} pose={{ ...basePose, x: 660, y: 1620, scale: 0.95, tilt: 10, armL: { a: -60, b: 0 }, armR: { a: -80, b: -20 }, expr: 'happy' }} shadow={0} />
      <Sparkle x={540} y={920} t={t} s={1.5} />
    </g>
  );
};

// ---------- S9B: Superheroes flying together ----------
export const S9B: React.FC<ShotProps> = ({ t }) => {
  const flyY = 960 + Math.sin(t / 6) * 30;
  return (
    <g>
      <rect width={1080} height={1920} fill="#1C1438" />
      {/* Distant neon skyline */}
      {[120, 320, 520, 720, 920].map((x, i) => (
        <rect key={i} x={x - 80} y={1200 + (i % 3) * 60} width={160} height={700} fill="#2A1E52" stroke="#48338A" strokeWidth={6} />
      ))}
      {/* Pip flying */}
      <Hero look={PIP} pose={{ ...basePose, x: 380, y: flyY, scale: 1.0, tilt: 25, armL: { a: -70, b: -10 }, armR: { a: -70, b: -10 }, expr: 'happy' }} shadow={0} />
      {/* Mo flying */}
      <Hero look={MO} pose={{ ...basePose, x: 700, y: flyY + 40, scale: 1.0, tilt: 25, armL: { a: -70, b: -10 }, armR: { a: -70, b: -10 }, expr: 'happy' }} shadow={0} />
    </g>
  );
};

// ---------- S10: Airplane exterior through storm clouds ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const planeX = kf(t, [[0, 150], [40, 930]]);
  const planeY = kf(t, [[0, 900], [40, 840]]);
  const blink = Math.floor(t / 6) % 2 ? 1 : 0;
  return (
    <g>
      <rect width={1080} height={1920} fill="#090B14" />
      {/* Storm clouds */}
      {[
        [200, 600, 260],
        [800, 800, 320],
        [400, 1200, 340],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#181D2E" opacity={0.65} />
      ))}
      {/* Airplane Silhouette */}
      <g transform={`translate(${planeX} ${planeY}) scale(1.1)`}>
        {/* Fuselage */}
        <ellipse cx={0} cy={0} rx={220} ry={42} fill="#E5DFD3" stroke="#0D101A" strokeWidth={6} />
        {/* Wings */}
        <polygon points="-40,-10 60,-10 20,-160 -20,-160" fill="#C5BDAC" stroke="#0D101A" strokeWidth={5} />
        <polygon points="-40,10 60,10 20,160 -20,160" fill="#A89F8D" stroke="#0D101A" strokeWidth={5} />
        {/* Tail Fin */}
        <polygon points="-180,-10 -130,-10 -170,-90 -210,-90" fill="#FF5A4A" stroke="#0D101A" strokeWidth={5} />
        {/* Cabin windows row */}
        {[-120, -80, -40, 0, 40, 80, 120].map((wx, i) => (
          <rect key={i} x={wx} y={-8} width={18} height={16} rx={4} fill="#FFE27A" />
        ))}
        {/* Blinking red beacon */}
        <circle cx={-180} cy={-90} r={10} fill="#FF3B30" opacity={blink} />
      </g>
    </g>
  );
};

// ---------- S11: Brain REM Schematic (Amygdala +30%) ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  const pulse = Math.sin(t / 3) * 0.2;
  return (
    <g>
      <rect width={1080} height={1920} fill="#0A0B14" />
      {/* Medical HUD Header */}
      <rect x={140} y={260} width={800} height={120} rx={20} fill="#1C1F32" />
      <text x={540} y={335} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#7FD4FF" letterSpacing={6}>
        REM SLEEP BRAIN SCAN
      </text>

      {/* Skull Outline */}
      <path
        d="M 280 1100 Q 240 760 540 640 Q 840 760 800 1100 Q 760 1340 540 1360 Q 320 1340 280 1100 Z"
        fill="#141829"
        stroke="#3B4766"
        strokeWidth={10}
      />
      {/* Brain Cortex Silhouettes */}
      <path
        d="M 320 1060 Q 300 800 540 720 Q 780 800 760 1060 Q 720 1200 540 1220 Q 360 1200 320 1060 Z"
        fill="#232B45"
        stroke="#4B5A82"
        strokeWidth={6}
      />

      {/* Glowing Hyperactive Amygdala */}
      <circle cx={540} cy={1020} r={55 * (1 + pulse)} fill="#FF3B30" opacity={0.85} style={{ filter: 'drop-shadow(0 0 35px #FF3B30)' }} />
      <circle cx={540} cy={1020} r={32} fill="#FFA24A" />

      {/* Readout Tag */}
      <Tag x={540} y={1160} t={t} text="AMYGDALA: +30% HEAT" mark="x" w={520} />
    </g>
  );
};

// ---------- S11B: Brainstem Paralysis Lock + "THAT'S REAL" ----------
export const S11B: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#0A0B14" />
      {/* Brainstem Lock Schematic */}
      <rect x={180} y={500} width={720} height={960} rx={32} fill="#181B2E" stroke="#363E5E" strokeWidth={8} />

      {/* Huge Motor Lock Icon */}
      <g transform="translate(540 880) scale(1.4)">
        {/* Shackle */}
        <path d="M -70 0 L -70 -80 A 70 70 0 0 1 70 -80 L 70 0" fill="none" stroke="#7FD4FF" strokeWidth={24} strokeLinecap="round" />
        {/* Lock Body */}
        <rect x={-110} y={0} width={220} height={160} rx={24} fill="#2A3550" stroke="#7FD4FF" strokeWidth={10} />
        <circle cx={0} cy={70} r={22} fill="#0A0B14" />
        <polygon points="-8,70 8,70 14,110 -14,110" fill="#0A0B14" />
      </g>

      <text x={540} y={1200} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#7FD4FF" letterSpacing={4}>
        MOTOR PARALYSIS: 100%
      </text>

      {/* Stamped Badge: THAT'S REAL */}
      <g transform={`translate(540 1400) scale(${backOut(clamp(t / 6))}) rotate(-6)`}>
        <rect x={-260} y={-50} width={520} height={100} rx={20} fill="#FF3B30" stroke="#FFFFFF" strokeWidth={6} />
        <text y={16} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={54} fill="#FFFFFF" letterSpacing={6}>
          THAT'S REAL.
        </text>
      </g>
    </g>
  );
};

// ---------- S12: Airplane Cabin High Angle: 200 Passengers ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#0D111A" />
      {/* Cabin interior cylinder */}
      <rect x={140} y={320} width={800} height={1380} rx={80} fill="#1E2638" stroke="#384766" strokeWidth={12} />
      {/* Aisle */}
      <line x1={540} y1={320} x2={540} y2={1700} stroke="#141926" strokeWidth={60} />

      {/* Seat Rows with sleeping passengers */}
      {[440, 600, 760, 920, 1080, 1240, 1400].map((sy, row) => (
        <g key={row}>
          {/* Left seats */}
          <rect x={200} y={sy} width={130} height={100} rx={16} fill="#2E3B54" />
          <circle cx={265} cy={sy + 50} r={32} fill="#F6EFE3" opacity={0.8} />
          <rect x={350} y={sy} width={130} height={100} rx={16} fill="#2E3B54" />
          <circle cx={415} cy={sy + 50} r={32} fill="#F6EFE3" opacity={0.8} />
          {/* Right seats */}
          <rect x={600} y={sy} width={130} height={100} rx={16} fill="#2E3B54" />
          <circle cx={665} cy={sy + 50} r={32} fill="#F6EFE3" opacity={0.8} />
          <rect x={750} y={sy} width={130} height={100} rx={16} fill="#2E3B54" />
          <circle cx={815} cy={sy + 50} r={32} fill="#F6EFE3" opacity={0.8} />
          {/* Cyan dream link threads */}
          <line x1={265} y1={sy + 50} x2={415} y2={sy + 50} stroke="#7FD4FF" strokeWidth={4} opacity={0.7} />
          <line x1={415} y1={sy + 50} x2={665} y2={sy + 50} stroke="#7FD4FF" strokeWidth={4} strokeDasharray="12 8" opacity={0.5} />
          <line x1={665} y1={sy + 50} x2={815} y2={sy + 50} stroke="#7FD4FF" strokeWidth={4} opacity={0.7} />
        </g>
      ))}

      <Tag x={540} y={240} t={t} text="200 PASSENGERS: CABIN 6m" w={560} />
    </g>
  );
};

// ---------- S12B: Seat row insert cutaway ----------
export const S12B: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#0C0F17" />
      <text x={540} y={420} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#7FD4FF" letterSpacing={4}>
        PHYSICAL RADIUS: &lt; 1 METER
      </text>

      {/* Big Seats Side by Side */}
      {[240, 580].map((sx, i) => (
        <g key={i}>
          <rect x={sx} y={640} width={260} height={700} rx={32} fill="#232C42" stroke="#3D4E72" strokeWidth={8} />
          <ellipse cx={sx + 130} cy={820} rx={75} ry={85} fill="#E2D3BE" stroke="#1D2033" strokeWidth={6} />
          {/* Sleeping face */}
          <path d={`M ${sx + 100} 820 Q ${sx + 115} 830 ${sx + 130} 820 M ${sx + 140} 820 Q ${sx + 155} 830 ${sx + 170} 820`} stroke="#1D2033" strokeWidth={6} fill="none" />
        </g>
      ))}

      {/* Proximity shock link between their heads */}
      <line x1={370} y1={820} x2={710} y2={820} stroke="#FF8A3D" strokeWidth={10} strokeDasharray="16 12" />
      <Sparkle x={540} y={820} t={t} s={1.8} />
      <Tag x={540} y={1480} t={t} text="DREAM MESH SYNCED" mark="check" w={460} />
    </g>
  );
};

// ---------- S13: Passenger has a nightmare (Sweat & dark tendrils) ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const tendril = (t * 12) % 300;
  return (
    <g>
      <rect width={1080} height={1920} fill="#14080B" />
      {/* High close up passenger head */}
      <circle cx={540} cy={960} r={320} fill="#D9C6AE" stroke="#1D2033" strokeWidth={12} />
      {/* Distressed face */}
      <path d="M 400 900 Q 450 940 500 890 M 580 890 Q 630 940 680 900" stroke="#1D2033" strokeWidth={10} fill="none" />
      <path d="M 480 1060 Q 540 1010 600 1060" stroke="#1D2033" strokeWidth={12} fill="none" />
      {/* Sweat drops */}
      <path d="M 680 820 Q 695 850 680 865 Q 665 850 680 820 Z" fill="#7FD4FF" />
      <path d="M 380 840 Q 395 870 380 885 Q 365 870 380 840 Z" fill="#7FD4FF" />

      {/* Dark Red Shadow tendrils erupting */}
      <path
        d={`M 540 760 Q ${420 - tendril * 0.5} ${520 - tendril} ${300 - tendril} 400`}
        stroke="#FF3B30"
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 540 760 Q ${660 + tendril * 0.5} ${520 - tendril} ${780 + tendril} 400`}
        stroke="#FF2A2A"
        strokeWidth={22}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

// ---------- S14: Entire plane engulfed in nightmare red chaos ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#260408" />
      {/* Huge menacing shadow beast eyes */}
      <ellipse cx={380} cy={680} rx={120} ry={60} fill="#FF2A2A" />
      <ellipse cx={700} cy={680} rx={120} ry={60} fill="#FF2A2A" />
      <ellipse cx={380} cy={680} rx={25} ry={55} fill="#000000" />
      <ellipse cx={700} cy={680} rx={25} ry={55} fill="#000000" />

      {/* Sharp teeth shadow mouth */}
      <path d="M 220 920 Q 540 1140 860 920 Q 540 980 220 920 Z" fill="#0E0204" stroke="#FF3B30" strokeWidth={10} />
      {/* Sharp teeth */}
      {[320, 420, 520, 620, 720].map((tx, i) => (
        <polygon key={i} points={`${tx},930 ${tx + 30},1010 ${tx + 60},930`} fill="#FFF2F2" />
      ))}

      <Tag x={540} y={1320} t={t} text="CONTAGIOUS NIGHTMARE" mark="x" w={560} />
    </g>
  );
};

// ---------- S15: Pip's face locked in sleep paralysis ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#0F0918" />
      {/* Pip head in dark bedroom with red nightmare light reflection */}
      <circle cx={540} cy={960} r={340} fill="#E2D3BE" stroke="#1D2033" strokeWidth={14} />
      {/* Red ambient reflection across face */}
      <path d="M 540 620 A 340 340 0 0 1 880 960 A 340 340 0 0 1 540 1300 Z" fill="#FF3B30" opacity={0.25} />
      {/* Eyes wide open in terror */}
      <ellipse cx={420} cy={920} rx={60} ry={60} fill="#FFFFFF" stroke="#1D2033" strokeWidth={8} />
      <circle cx={430} cy={920} r={28} fill="#1D2033" />
      <ellipse cx={660} cy={920} rx={60} ry={60} fill="#FFFFFF" stroke="#1D2033" strokeWidth={8} />
      <circle cx={670} cy={920} r={28} fill="#1D2033" />
      {/* Paralyzed trembling mouth */}
      <path d="M 460 1120 Q 540 1100 620 1120" stroke="#1D2033" strokeWidth={10} strokeLinecap="round" />
      <Tag x={540} y={1480} t={t} text="CANNOT WAKE UP" mark="x" w={460} />
    </g>
  );
};

// ---------- S15B: Macro Eye reflecting monster claws ----------
export const S15B: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#050106" />
      {/* Giant Macro Eye filling frame */}
      <ellipse cx={540} cy={960} rx={480} ry={360} fill="#F6EFE3" stroke="#1D2033" strokeWidth={16} />
      {/* Huge Dilated Iris */}
      <circle cx={540} cy={960} r={220} fill="#351F5E" stroke="#1D2033" strokeWidth={10} />
      <circle cx={540} cy={960} r={140} fill="#0A0612" />
      {/* Red monster claw reflection inside pupil */}
      <g transform="translate(540 960) scale(0.9)">
        <path d="M -60 -40 Q -30 20 -10 60 M 0 -50 Q 15 20 25 70 M 60 -40 Q 40 20 45 60" stroke="#FF3B30" strokeWidth={12} strokeLinecap="round" />
      </g>
      {/* Glint */}
      <circle cx={470} cy={880} r={32} fill="#FFFFFF" />
    </g>
  );
};

// ---------- S16: Airport Jet Bridge: Men in dark suits ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#161822" />
      {/* Airport Gate Corridor */}
      <rect x={180} y={420} width={720} height={1180} fill="#242838" stroke="#3D455E" strokeWidth={10} />
      {/* Gate Sign */}
      <rect x={320} y={500} width={440} height={90} rx={16} fill="#FF8A3D" />
      <text x={540} y={560} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fontWeight={700} fill="#121019">
        GATE QUARANTINE
      </text>

      {/* Two Agents in dark suits and sunglasses standing guard */}
      <Hero look={SUIT} pose={{ ...basePose, x: 400, y: 1320, scale: 1.15, tilt: 0, armL: { a: 15, b: 0 }, armR: { a: 15, b: 0 }, expr: 'neutral' }} shadow={0} />
      <Hero look={SUIT} pose={{ ...basePose, x: 680, y: 1320, scale: 1.15, tilt: 0, armL: { a: 15, b: 0 }, armR: { a: 15, b: 0 }, expr: 'neutral' }} shadow={0} />

      {/* Flashing Police Blue & Red Alert Light */}
      <circle cx={540} cy={450} r={40} fill={Math.floor(t / 5) % 2 ? "#FF3B30" : "#38E8FF"} style={{ filter: 'drop-shadow(0 0 30px #FF3B30)' }} />
    </g>
  );
};

// ---------- S17: Sister in bed with 104°F fever ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#181324" />
      {/* Bedroom Set */}
      <rect x={180} y={800} width={720} height={700} rx={28} fill="#3E2C48" stroke="#1D2033" strokeWidth={8} />
      <rect x={180} y={800} width={720} height={140} rx={20} fill="#E8DFD0" />

      {/* Sis head with fever flushed cheeks */}
      <g transform="translate(540 840)">
        <circle cx={0} cy={0} r={95} fill="#F6EFE3" stroke="#1D2033" strokeWidth={8} />
        {/* Red Fever Cheeks */}
        <circle cx={-50} cy={20} r={32} fill="#FF5A5A" opacity={0.65} />
        <circle cx={50} cy={20} r={32} fill="#FF5A5A" opacity={0.65} />
        {/* Bunches */}
        <circle cx={-110} cy={-20} r={34} fill="#3A2620" />
        <circle cx={110} cy={-20} r={34} fill="#3A2620" />
        {/* Sleeping troubled face */}
        <path d="M -45 0 Q -25 15 -5 0 M 15 0 Q 35 15 55 0" stroke="#1D2033" strokeWidth={6} fill="none" />
      </g>

      {/* Digital Thermometer */}
      <Tag x={540} y={1160} t={t} text="FEVER: 104.2°F" mark="x" w={460} />
    </g>
  );
};

// ---------- S18: Bedroom walls melting into red nightmare: PART 1 ----------
export const S18: React.FC<ShotProps> = ({ t }) => {
  return (
    <g>
      <rect width={1080} height={1920} fill="#14060A" />
      {/* Dripping black and red walls */}
      {[120, 260, 420, 640, 820, 960].map((wx, i) => (
        <path
          key={i}
          d={`M ${wx - 60} 0 L ${wx + 60} 0 L ${wx + 40} ${600 + (i % 4) * 120} Q ${wx} ${780 + (i % 4) * 120} ${wx - 40} ${600 + (i % 4) * 120} Z`}
          fill="#3B0810"
        />
      ))}
      {/* Menacing red nightmare eyes on walls */}
      {[
        [240, 520],
        [840, 580],
        [540, 360],
      ].map(([ex, ey], i) => (
        <g key={i}>
          <ellipse cx={ex} cy={ey} rx={50} ry={25} fill="#FF3B30" />
          <ellipse cx={ex} cy={ey} rx={12} ry={22} fill="#000000" />
        </g>
      ))}

      {/* Pip standing in doorway, terrified */}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 540,
          y: 1380,
          scale: 1.25,
          tilt: -8,
          armL: { a: 20, b: 40 },
          armR: { a: 20, b: 40 },
          expr: 'shock',
        }}
        shadow={0}
      />

      {/* Dramatic Cliffhanger Title: PART 1 */}
      <g transform={`translate(540 1620) scale(${backOut(clamp(t / 8))})`}>
        <rect x={-220} y={-55} width={440} height={110} rx={22} fill="#FF2A2A" stroke="#FFFFFF" strokeWidth={8} />
        <text y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={62} fill="#FFFFFF" letterSpacing={8}>
          PART 1
        </text>
      </g>
    </g>
  );
};
