
const fs = require('fs');
const path = require('path');

// Mock window and document to avoid errors if they are used
global.window = {};
global.document = {};

// Helper to eval file content
function loadFile(filename) {
    const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    // Remove 'const ' to make them global vars we can access
    const cleanContent = content.replace(/const /g, 'global.');
    eval(cleanContent);
}

try {
    loadFile('data.js');
    console.log('Loaded data.js');
    fs.writeFileSync('data.json', JSON.stringify(global.iplData, null, 2));
    console.log('Created data.json');

    loadFile('matches.js');
    console.log('Loaded matches.js');
    fs.writeFileSync('matches.json', JSON.stringify(global.iplMatches, null, 2));
    console.log('Created matches.json');

} catch (err) {
    console.error('Conversion failed:', err);
}
