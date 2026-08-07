// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

import Support from './Support';

/**
 * This page is the Support URL given to App Store Connect, and reviewers open
 * it. Two things on it are load-bearing for review rather than decorative: the
 * account-deletion instructions (Guideline 5.1.1(v), which is checked by hand)
 * and a working contact address. Everything else is prose that can change
 * freely.
 */
describe('Support page', () => {
  it('renders', () => {
    render(<Support />);
    expect(screen.getByRole('heading', { level: 1, name: /support/i })).toBeDefined();
  });

  it('spells out the in-app account deletion path', () => {
    // /profile redirects to home when signed out, so a reviewer who has not
    // signed in cannot discover this by clicking around — the page has to say
    // it. Assert the steps, not the exact wording around them.
    render(<Support />);
    const text = document.body.textContent;
    expect(text).toMatch(/Profile/);
    expect(text).toMatch(/Delete Account/);
    expect(text).toMatch(/\bDELETE\b/);
  });

  it('gives a reachable contact address', () => {
    render(<Support />);
    const mailto = [...document.querySelectorAll('a[href^="mailto:"]')];
    expect(mailto.length).toBeGreaterThan(0);
  });

  it('links to the privacy policy', () => {
    render(<Support />);
    expect(document.querySelector('a[href="/privacy"]')).not.toBeNull();
  });
});
