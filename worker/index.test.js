import { describe, expect, it } from 'vitest';
import { buildShareMetadata } from './index';

describe('buildShareMetadata', () => {
  it('builds result-specific social metadata', () => {
    expect(buildShareMetadata({
      quiz_type: 'mbti',
      result_name: 'INTJ — The Architect',
      result_emoji: '🏛️',
    }, 'https://mypersonalityquizzes.com/s/01234567')).toEqual({
      title: '🏛️ INTJ — The Architect — MBTI Result',
      description: 'See this MBTI result: INTJ — The Architect. Take the quiz to discover and save your own result.',
      canonicalUrl: 'https://mypersonalityquizzes.com/s/01234567',
    });
  });

  it('strips control characters from untrusted result fields', () => {
    const metadata = buildShareMetadata({
      quiz_type: 'custom',
      result_name: 'Nice\nResult\u0000',
    }, 'https://mypersonalityquizzes.com/s/01234567');
    expect(metadata.title).toBe('NiceResult — Personality Result');
    expect(Array.from(metadata.description).every((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127;
    })).toBe(true);
  });
});
