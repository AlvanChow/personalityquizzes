// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BigFiveScoreCard from '../components/BigFiveScoreCard';
import { getBigFiveScoreRows } from '../utils/bigFiveShare';

describe('shared Big Five scores', () => {
  it('renders every named trait and its stored score', () => {
    render(
      <BigFiveScoreCard
        result={{ scores: { O: 55, C: 60, E: 80, A: 65, N: 70 } }}
      />,
    );

    for (const [label, score] of [
      ['Openness', 55],
      ['Conscientiousness', 60],
      ['Extraversion', 80],
      ['Agreeableness', 65],
      ['Neuroticism', 70],
    ]) {
      expect(screen.getByText(label)).toBeTruthy();
      expect(screen.getByRole('progressbar', {
        name: `${label} score ${score} out of 100`,
      }).getAttribute('aria-valuenow')).toBe(String(score));
    }

    cleanup();
  });

  it('clamps public values to the visible scale and drops non-numeric scores', () => {
    expect(getBigFiveScoreRows({
      scores: { O: 'not-a-number', C: -20, E: 140, A: 64.6 },
    })).toEqual([
      expect.objectContaining({ key: 'C', score: 0 }),
      expect.objectContaining({ key: 'E', score: 100 }),
      expect.objectContaining({ key: 'A', score: 65 }),
    ]);
  });
});
