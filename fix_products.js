const fs = require('fs');
let content = fs.readFileSync('src/data/product-data.ts', 'utf8');

// The problematic lines are like: `title: 'Qulibot ai's Heather",`
// A regex to match any `title: ` followed by single quote, then until a double quote and a comma.
content = content.replace(/title:\s*'([^']+)'s?[^,]+,/g, "title: '$1',");
// Wait, the strings were:
// title: 'Qulibot ai's Heather",
// title: 'Youtube's",
// title: 'Zoom's",

// Let's just fix it universally: replace `title: '...'something",` with `title: '...',`
// It's safer to just replace any `title: '([^']+)'[^,]+,` with `title: '$1',`
content = content.replace(/title:\s*'([^']+)'[^,]+,/g, "title: '$1',");

fs.writeFileSync('src/data/product-data.ts', content, 'utf8');
console.log('Fixed broken titles.');
