const fs = require('fs');
const path = './lib/translations.ts';
let content = fs.readFileSync(path, 'utf8');

// Fix 1: Rename duplicate 'portfolio' key at end of file to 'portfolioPage'
content = content.replace(
  /\/\/ Portfolio page section\r?\n  portfolio: \{/,
  '// Portfolio page section\r\n  portfolioPage: {'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done! Duplicate portfolio key renamed to portfolioPage.');
