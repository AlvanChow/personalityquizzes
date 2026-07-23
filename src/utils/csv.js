/**
 * Build a CSV from authenticated account rows. Formula-leading cells are
 * prefixed so opening an export in Excel/Sheets cannot execute user input.
 */
export function accountsToCsv(rows) {
  const escapeCell = (value) => {
    let text = value == null ? '' : String(value);
    // Spreadsheet apps may ignore leading whitespace before a formula marker.
    if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`;
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const lines = ['email,joined_at,last_sign_in_at'];
  for (const row of rows) {
    lines.push([
      escapeCell(row.email),
      escapeCell(row.created_at),
      escapeCell(row.last_sign_in_at),
    ].join(','));
  }
  return lines.join('\n');
}
