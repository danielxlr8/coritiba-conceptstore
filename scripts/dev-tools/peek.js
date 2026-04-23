/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const txt = fs.readFileSync('src/components/fit-guide/AiSizeGuideModal.tsx', 'utf8');
const anchor = "if (typeof window !== 'undefined') {";
const idx = txt.indexOf(anchor);
console.log(txt.substring(idx - 300, idx));
