/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const txt = fs.readFileSync('src/components/fit-guide/AiSizeGuideModal.tsx', 'utf8');
const lines = txt.split('\n');

console.log('=== Line 506 area (was unclosed if-block) ===');
for (let i = 503; i < 515; i++) console.log((i+1) + ': ' + lines[i]);

console.log('\n=== Line 283 area (Visualizer usage) ===');
for (let i = 280; i < 286; i++) console.log((i+1) + ': ' + lines[i]);

console.log('\n=== Line 647 area (Scene call) ===');
for (let i = 644; i < 651; i++) console.log((i+1) + ': ' + lines[i]);
