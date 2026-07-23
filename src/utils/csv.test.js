import { describe, expect, it } from 'vitest';
import { accountsToCsv } from './csv';

describe('accountsToCsv', () => {
  it('escapes quotes and commas', () => {
    const csv = accountsToCsv([{
      email: 'person@example.com',
      created_at: 'July 22, 2026',
      last_sign_in_at: 'now',
    }]);
    expect(csv).toContain('person@example.com,"July 22, 2026",now');
  });

  it('neutralizes spreadsheet formulas', () => {
    const csv = accountsToCsv([{
      email: '=HYPERLINK("https://evil.example")@example.com',
      created_at: '  +1',
      last_sign_in_at: '-1',
    }]);
    expect(csv).toContain('"\'=HYPERLINK(""https://evil.example"")@example.com"');
    expect(csv).toContain("'  +1,'-1");
  });
});
