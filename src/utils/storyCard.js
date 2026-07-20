/**
 * Instagram-story share card generator.
 *
 * Renders a 1080×1920 PNG on an offscreen <canvas> — no dependencies — and
 * shares it through the native share sheet (navigator.share with files) so on
 * mobile it's one tap to post to an Instagram story, WhatsApp status, etc.
 * Falls back to downloading the PNG when file sharing isn't available.
 */

const W = 1080;
const H = 1920;
const SITE = 'mypersonalityquizzes.com';

// Per-quiz theme: story background gradient + accent for bars/labels.
const THEMES = {
  mbti:      { bg: ['#ff9a8b', '#ff5e7e'], accent: '#f43f5e', label: 'MBTI' },
  enneagram: { bg: ['#34d399', '#0d9488'], accent: '#10b981', label: 'Enneagram' },
  cake:      { bg: ['#38bdf8', '#2563eb'], accent: '#0ea5e9', label: 'CAKE Workplace' },
  big5:      { bg: ['#a78bfa', '#7c3aed'], accent: '#8b5cf6', label: 'Big Five' },
  house:     { bg: ['#fbbf24', '#b45309'], accent: '#d97706', label: 'Wizarding House' },
};

function theme(quizType) {
  return THEMES[quizType] ?? THEMES.mbti;
}

// Space Grotesk is loaded by the page; make sure the canvas can use it. Never throws.
async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load("700 120px 'Space Grotesk Variable'"),
      document.fonts.load("700 48px 'Space Grotesk Variable'"),
      document.fonts.load("500 36px 'Space Grotesk Variable'"),
    ]);
  } catch { /* system font fallback below */ }
}

const FONT = (weight, size) => `${weight} ${size}px 'Space Grotesk Variable', system-ui, sans-serif`;

function roundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Shrink font size until text fits maxWidth. Returns the fitted size. */
function fitText(ctx, text, weight, startSize, maxWidth) {
  let size = startSize;
  ctx.font = FONT(weight, size);
  while (size > 24 && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = FONT(weight, size);
  }
  return size;
}

function drawBackground(ctx, quizType) {
  const t = theme(quizType);
  const grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
  grad.addColorStop(0, t.bg[0]);
  grad.addColorStop(1, t.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Soft decorative circles
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  for (const [cx, cy, r] of [[120, 220, 190], [980, 160, 130], [60, 1700, 150], [1000, 1760, 210], [900, 900, 70]]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFooter(ctx, ctaText) {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = FONT(800, 44);
  ctx.fillText(ctaText, W / 2, H - 200);

  // Domain pill
  ctx.font = FONT(700, 36);
  const tw = ctx.measureText(SITE).width;
  const pw = tw + 90;
  roundRect(ctx, (W - pw) / 2, H - 160, pw, 84, 42);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(SITE, W / 2, H - 105);
}

function drawBar(ctx, x, y, w, label, rightLabel, pct, accent) {
  ctx.textAlign = 'left';
  ctx.font = FONT(700, 30);
  ctx.fillStyle = '#6b7280';
  ctx.fillText(label, x, y);
  if (rightLabel) {
    ctx.textAlign = 'right';
    ctx.fillText(rightLabel, x + w, y);
  }
  const barY = y + 18;
  roundRect(ctx, x, barY, w, 22, 11);
  ctx.fillStyle = '#f3f4f6';
  ctx.fill();
  const fillW = Math.max(22, Math.min(w, (pct / 100) * w));
  roundRect(ctx, x, barY, fillW, 22, 11);
  ctx.fillStyle = accent;
  ctx.fill();
}

/** Build the per-quiz bar rows shown on the card. */
function barRows(quizType, result, scores) {
  if (!scores) return [];
  if (quizType === 'mbti') {
    const dims = [
      { key: 'IE', l: 'I', r: 'E' },
      { key: 'SN', l: 'S', r: 'N' },
      { key: 'TF', l: 'T', r: 'F' },
      { key: 'JP', l: 'J', r: 'P' },
    ];
    return dims.map((d) => {
      const v = Math.max(0, Math.min(100, Number(scores[d.key]) || 0));
      return { label: d.l, rightLabel: d.r, pct: v };
    });
  }
  if (quizType === 'enneagram') {
    return Object.entries(scores)
      .filter(([k, v]) => /^[1-9]$/.test(k) && Number.isFinite(Number(v)))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k, v]) => ({ label: `Type ${k}`, rightLabel: null, pct: Math.max(0, Math.min(100, Math.round((v / 12) * 100))) }));
  }
  if (quizType === 'cake') {
    const labels = { AO: 'Action', PS: 'Problem Solving', IN: 'Innovation', TM: 'Teamwork', AD: 'Detail', INF: 'Influence' };
    return Object.entries(scores)
      .filter(([k, v]) => labels[k] && Number.isFinite(Number(v)))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k, v]) => ({ label: labels[k], rightLabel: null, pct: Math.max(0, Math.min(100, Math.round((v / 8) * 100))) }));
  }
  if (quizType === 'house') {
    const labels = { g: 'Gryffindor', h: 'Hufflepuff', r: 'Ravenclaw', s: 'Slytherin' };
    return Object.entries(scores)
      .filter(([k, v]) => labels[k] && Number.isFinite(Number(v)))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k, v]) => ({ label: labels[k], rightLabel: null, pct: Math.max(0, Math.min(100, Math.round((v / 10) * 100))) }));
  }
  if (quizType === 'big5') {
    const labels = { O: 'Openness', C: 'Conscientiousness', E: 'Extraversion', A: 'Agreeableness', N: 'Neuroticism' };
    return Object.entries(labels).map(([k, label]) => ({
      label,
      rightLabel: null,
      pct: Math.max(0, Math.min(100, Number(scores[k]) || 0)),
    }));
  }
  return [];
}

/**
 * Render "my result" story card. Returns a canvas.
 *
 * @param {string} quizType 'mbti' | 'enneagram' | 'cake' | 'big5'
 * @param {object} result   result object (.name, .emoji, .nickname/.competency/.tagline)
 * @param {object} [scores] raw quiz scores for the bar section
 */
async function renderResultCard(quizType, result, scores) {
  await ensureFonts();
  const t = theme(quizType);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, quizType);

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = FONT(800, 42);
  ctx.fillText(`My ${t.label} result`, W / 2, 240);

  // White card
  const rows = barRows(quizType, result, scores);
  const cardX = 90;
  const cardW = W - 180;
  const cardH = 900 + rows.length * 92;
  const cardY = (H - cardH) / 2 - 40;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  roundRect(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Emoji
  ctx.textAlign = 'center';
  ctx.font = `240px system-ui, sans-serif`;
  ctx.fillText(result.emoji ?? '✨', W / 2, cardY + 330);

  // Type name
  const name = String(result.name ?? '');
  const nameSize = fitText(ctx, name, 900, 130, cardW - 120);
  ctx.font = FONT(900, nameSize);
  ctx.fillStyle = '#1f2937';
  ctx.fillText(name, W / 2, cardY + 480);

  // Nickname / competency / tagline
  const sub = result.nickname ?? result.competency ?? result.tagline ?? '';
  if (sub) {
    const subSize = fitText(ctx, sub, 800, 52, cardW - 140);
    ctx.font = FONT(800, subSize);
    ctx.fillStyle = t.accent;
    ctx.fillText(sub, W / 2, cardY + 480 + nameSize * 0.35 + 40);
  }

  // Divider
  ctx.strokeStyle = '#f3f4f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cardX + 90, cardY + 640);
  ctx.lineTo(cardX + cardW - 90, cardY + 640);
  ctx.stroke();

  // Bars
  let by = cardY + 730;
  for (const row of rows) {
    drawBar(ctx, cardX + 90, by, cardW - 180, row.label, row.rightLabel, row.pct, t.accent);
    by += 92;
  }

  drawFooter(ctx, "What's your type?");
  return canvas;
}

/**
 * Render a "compatibility match" story card. Returns a canvas.
 *
 * @param {string} quizType
 * @param {object} compat   result of computeCompatibility()
 * @param {{emoji:string,name:string}} me
 * @param {{emoji:string,name:string}} friend
 */
async function renderCompatCard(quizType, compat, me, friend) {
  await ensureFonts();
  const t = theme(quizType);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, quizType);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = FONT(800, 42);
  ctx.fillText(`${t.label} compatibility`, W / 2, 240);

  // White card
  const cardX = 90;
  const cardW = W - 180;
  const cardH = 1080;
  const cardY = (H - cardH) / 2 - 40;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  roundRect(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Two emojis + a heart between
  ctx.font = `170px system-ui, sans-serif`;
  ctx.fillText(me.emoji ?? '✨', W / 2 - 220, cardY + 280);
  ctx.fillText(friend.emoji ?? '✨', W / 2 + 220, cardY + 280);
  ctx.font = `90px system-ui, sans-serif`;
  ctx.fillText('🤝', W / 2, cardY + 260);

  // Names under emojis
  ctx.font = FONT(800, 44);
  ctx.fillStyle = '#374151';
  ctx.fillText(String(me.name ?? 'Me').slice(0, 14), W / 2 - 220, cardY + 380);
  ctx.fillText(String(friend.name ?? 'Friend').slice(0, 14), W / 2 + 220, cardY + 380);
  ctx.font = FONT(700, 34);
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('me', W / 2 - 220, cardY + 430);
  ctx.fillText('my friend', W / 2 + 220, cardY + 430);

  // Big score
  ctx.font = FONT(900, 230);
  ctx.fillStyle = t.accent;
  ctx.fillText(`${compat.score}%`, W / 2, cardY + 720);

  // Headline
  const headline = `${compat.emoji} ${compat.title}`;
  const hs = fitText(ctx, headline, 900, 64, cardW - 140);
  ctx.font = FONT(900, hs);
  ctx.fillStyle = '#1f2937';
  ctx.fillText(headline, W / 2, cardY + 840);

  // First dimension blurb, wrapped to two lines max
  const blurb = compat.dimensions?.[0]?.text ?? '';
  if (blurb) {
    ctx.font = FONT(700, 36);
    ctx.fillStyle = '#6b7280';
    const words = blurb.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      const probe = line ? `${line} ${w}` : w;
      if (ctx.measureText(probe).width > cardW - 180 && line) {
        lines.push(line);
        line = w;
        if (lines.length === 2) break;
      } else {
        line = probe;
      }
    }
    if (lines.length < 3 && line) lines.push(line);
    lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, W / 2, cardY + 930 + i * 52));
  }

  drawFooter(ctx, 'How compatible are we?');
  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

/**
 * Share a rendered canvas via the native share sheet, falling back to a
 * download. Returns 'shared' | 'downloaded' | 'cancelled'.
 */
async function shareCanvas(canvas, filename, shareText, shareUrl) {
  const blob = await canvasToBlob(canvas);
  const file = new File([blob], filename, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'My Personality Quizzes', text: shareUrl ? `${shareText} ${shareUrl}` : shareText });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
      // fall through to download on any other share failure
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return 'downloaded';
}

/** One-click: render my-result story card and open the share sheet. */
export async function shareResultStory(quizType, result, scores, shareUrl) {
  const canvas = await renderResultCard(quizType, result, scores);
  const label = theme(quizType).label;
  return shareCanvas(canvas, 'my-personality.png', `I got ${result.emoji ?? ''} ${result.name ?? ''} on the ${label} quiz!`, shareUrl);
}

/** One-click: render compatibility story card and open the share sheet. */
export async function shareCompatStory(quizType, compat, me, friend, shareUrl) {
  const canvas = await renderCompatCard(quizType, compat, me, friend);
  return shareCanvas(canvas, 'our-compatibility.png', `${me.name} × ${friend.name} = ${compat.score}% compatible!`, shareUrl);
}
