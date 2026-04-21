const fs = require('fs');
const content = fs.readFileSync('./lib/translations.ts', 'utf8');
const lines = content.split('\n');

const keyCount = {};
const keyLines = {};

lines.forEach((line, idx) => {
  // Match top-level keys like "  portfolio: {" or "portfolioFilters: {"
  const match = line.match(/^  ([a-zA-Z][a-zA-Z0-9]*)\s*:/);
  if (match) {
    const key = match[1];
    keyCount[key] = (keyCount[key] || 0) + 1;
    if (!keyLines[key]) keyLines[key] = [];
    keyLines[key].push(idx + 1);
  }
});

console.log('=== DUPLICATE KEYS FOUND ===');
let found = false;
Object.entries(keyCount).forEach(([key, count]) => {
  if (count > 1) {
    console.log(`Key "${key}" appears ${count} times at lines: ${keyLines[key].join(', ')}`);
    found = true;
  }
});
if (!found) console.log('No duplicates found!');
