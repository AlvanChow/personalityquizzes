import { readdir } from 'node:fs/promises';
import { createServer } from 'vite';

const ROOT = new URL('../', import.meta.url);
const SNAPSHOT_FIELDS = [
  'name',
  'emoji',
  'color',
  'accent',
  'nickname',
  'tagline',
  'coreDesire',
  'competency',
  'typeNumber',
  'trait',
  'key',
  'description',
];

function firstSentence(value) {
  if (typeof value !== 'string') return undefined;
  return (value.match(/^[^.!?]*[.!?]?/)?.[0] ?? '').slice(0, 240);
}

function buildSnapshot(resultKey, result, fallbackEmoji = '') {
  const merged = { ...(result.store ?? {}), ...result };
  const snapshot = {
    name: typeof merged.name === 'string' ? merged.name.slice(0, 100) : '',
    emoji: typeof merged.emoji === 'string' ? merged.emoji.slice(0, 16) : fallbackEmoji.slice(0, 16),
    color: typeof merged.color === 'string' ? merged.color.slice(0, 60) : undefined,
    accent: typeof merged.accent === 'string' ? merged.accent.slice(0, 40) : undefined,
    nickname: typeof merged.nickname === 'string' ? merged.nickname.slice(0, 100) : undefined,
    tagline: typeof (merged.tagline ?? merged.tag) === 'string'
      ? (merged.tagline ?? merged.tag).slice(0, 120)
      : undefined,
    coreDesire: typeof merged.coreDesire === 'string' ? merged.coreDesire.slice(0, 160) : undefined,
    competency: typeof merged.competency === 'string' ? merged.competency.slice(0, 60) : undefined,
    typeNumber: typeof merged.typeNumber === 'string' ? merged.typeNumber.slice(0, 2) : undefined,
    trait: typeof merged.trait === 'string' ? merged.trait.slice(0, 8) : undefined,
    key: resultKey.slice(0, 20),
    description: firstSentence(merged.description ?? merged.desc),
  };

  return Object.fromEntries(
    SNAPSHOT_FIELDS
      .filter((field) => snapshot[field] !== undefined)
      .map((field) => [field, snapshot[field]]),
  );
}

function addRow(rows, quizType, resultKey, result, fallbackEmoji = '') {
  const key = String(resultKey);
  const snapshot = buildSnapshot(key, result, fallbackEmoji);
  const row = {
    quiz_type: quizType,
    result_key: key,
    result_name: snapshot.name,
    result_emoji: snapshot.emoji,
    result_data: snapshot,
  };

  if (!/^[a-z][a-z0-9_-]{1,31}$/.test(row.quiz_type)) {
    throw new Error(`Invalid quiz type: ${row.quiz_type}`);
  }
  if (!row.result_key || row.result_key.length > 20) {
    throw new Error(`Invalid result key: ${row.quiz_type}/${row.result_key}`);
  }
  if (!row.result_name) {
    throw new Error(`Missing result name: ${row.quiz_type}/${row.result_key}`);
  }
  if (JSON.stringify(row.result_data).length > 4096) {
    throw new Error(`Oversized result snapshot: ${row.quiz_type}/${row.result_key}`);
  }

  rows.set(`${row.quiz_type}/${row.result_key}`, row);
}

export async function generateShareCatalog() {
  const vite = await createServer({
    root: ROOT.pathname,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  });

  try {
    const rows = new Map();

    addRow(rows, 'big5', 'profile', {
      name: 'Big Five Personality Profile',
      emoji: '🧬',
      tagline: 'Your science-backed personality profile',
      description: 'Your scores across openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
    });

    const { mbtiResults } = await vite.ssrLoadModule('/src/data/mbtiResults.js');
    for (const [key, result] of Object.entries(mbtiResults)) {
      addRow(rows, 'mbti', key, result);
    }

    const { enneagramResults } = await vite.ssrLoadModule('/src/data/enneagramResults.js');
    for (const [key, result] of Object.entries(enneagramResults)) {
      addRow(rows, 'enneagram', key, result);
    }

    const vectorDirectory = new URL('../src/data/vectorQuizzes/', import.meta.url);
    const vectorFiles = (await readdir(vectorDirectory))
      .filter((file) => file.endsWith('.js'))
      .filter((file) => !file.endsWith('.test.js'))
      .filter((file) => !['battery.js', 'glyphs.js', 'registry.js'].includes(file));

    for (const file of vectorFiles) {
      const definition = (await vite.ssrLoadModule(`/src/data/vectorQuizzes/${file}`)).default;
      for (const [key, result] of Object.entries(definition.CHARS)) {
        addRow(rows, definition.key, key, result, definition.shareEmoji ?? '');
      }
    }

    const { QUIZ_CATALOG } = await vite.ssrLoadModule('/src/data/quizzes/index.js');
    for (const meta of QUIZ_CATALOG.filter((item) => item.load)) {
      const definition = (await vite.ssrLoadModule(`/src/data/quizzes/${meta.key}.js`)).default;
      for (const [key, result] of Object.entries(definition.results ?? {})) {
        addRow(rows, meta.key, key, result, meta.emoji ?? '');
      }
      for (const [index, result] of (definition.bands ?? []).entries()) {
        addRow(rows, meta.key, result.key ?? `band_${index}`, result, meta.emoji ?? '');
      }
    }

    return [...rows.values()].sort((left, right) => (
      left.quiz_type.localeCompare(right.quiz_type)
      || left.result_key.localeCompare(right.result_key)
    ));
  } finally {
    await vite.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const catalog = await generateShareCatalog();
  if (process.argv.includes('--count')) {
    process.stdout.write(`${catalog.length}\n`);
  } else if (process.argv.includes('--sql-json')) {
    const json = JSON.stringify(catalog).replaceAll('$share_catalog$', '$share_catalog_escaped$');
    process.stdout.write(`$share_catalog$${json}$share_catalog$\n`);
  } else {
    process.stdout.write(`${JSON.stringify(catalog, null, 2)}\n`);
  }
}
