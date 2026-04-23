/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
let txt = fs.readFileSync('src/components/fit-guide/AiSizeGuideModal.tsx', 'utf8');
const lines = txt.split('\n');

/* ── FIX 1: close the unclosed if-block at line 509 ─────────────────────────
   Line 509 (index 508) is:  "  useGLTF.preload('/moldes/tshirtmobile.glb')"
   followed by an empty line (index 509) then the BODY MODEL comment block.
   We need to insert a closing "}" and a semicolon for the preload call.       */
// The raw text to find:
const badBlock = `if (typeof window !== 'undefined') {\r\n  useGLTF.preload('/moldes/human.glb');\r\n  useGLTF.preload('/moldes/tshirtweb.glb');\r\n  useGLTF.preload('/moldes/tshirtmobile.glb')\n`;
const goodBlock = `if (typeof window !== 'undefined') {\r\n  useGLTF.preload('/moldes/human.glb');\r\n  useGLTF.preload('/moldes/tshirtweb.glb');\r\n  useGLTF.preload('/moldes/tshirtmobile.glb');\r\n}\n`;

if (txt.includes(badBlock)) {
  txt = txt.replace(badBlock, goodBlock);
  console.log('FIX 1 applied: closed preload if-block');
} else {
  console.log('FIX 1: pattern not found — trying CRLF variant');
  const badBlock2 = "if (typeof window !== 'undefined') {\r\n  useGLTF.preload('/moldes/human.glb');\r\n  useGLTF.preload('/moldes/tshirtweb.glb');\r\n  useGLTF.preload('/moldes/tshirtmobile.glb')\r\n";
  const goodBlock2 = "if (typeof window !== 'undefined') {\r\n  useGLTF.preload('/moldes/human.glb');\r\n  useGLTF.preload('/moldes/tshirtweb.glb');\r\n  useGLTF.preload('/moldes/tshirtmobile.glb');\r\n}\r\n";
  if (txt.includes(badBlock2)) {
    txt = txt.replace(badBlock2, goodBlock2);
    console.log('FIX 1 applied (CRLF variant)');
  } else {
    // Manual line-level patch
    const linesNow = txt.split('\n');
    for (let i = 0; i < linesNow.length; i++) {
      if (linesNow[i].trim() === "useGLTF.preload('/moldes/tshirtmobile.glb')") {
        // Fix missing semicolon
        linesNow[i] = linesNow[i].replace('tshirtmobile.glb\')', "tshirtmobile.glb');");
        // Insert closing brace after
        linesNow.splice(i + 1, 0, '}');
        console.log('FIX 1 applied via line splice at line', i+1);
        break;
      }
    }
    txt = linesNow.join('\n');
  }
}

/* ── FIX 2: Scene shirtSize missing height/weight props ──────────────────────
   Scene's props interface says { height, weight, shirtSize } but it's only
   called with { shirtSize }. The function body doesn't actually use height or
   weight, so the cleanest fix is to make height/weight optional in the Scene
   function signature. We update the one Scene call in the Visualizer too.     */
// Patch Scene function signature: remove unused height/weight from type
txt = txt.replace(
  'function Scene({ shirtSize }: { height: number; weight: number; shirtSize: Size })',
  'function Scene({ shirtSize }: { shirtSize: Size })'
);
console.log('FIX 2 applied: Scene signature simplified');

/* ── FIX 3: Visualizer is defined AFTER AISizeGuideModal uses it ─────────────
   Visualizer is defined around line 610+. AISizeGuideModal (ends ~424) calls
   <Visualizer> on line 283. In JS/TS function declarations are hoisted, but
   this is a `function` declaration so it IS hoisted.  TypeScript still
   reports it when the structural ordering crosses module-level statements.

   The real root cause is that there's a bad merge leaving orphan code between
   the closing brace of AISizeGuideModal (line 424) and the helper functions.
   We move useNormalizedGLTF, FIT_CONFIG, BodyModel, AnimatedShirt, ShirtModel,
   Loader, CameraController, Scene, Visualizer to BEFORE AISizeGuideModal.

   Simplest correct fix: Visualizer is a hoisted function declaration so TS
   should accept it. The TS error "Cannot find name 'Visualizer'" usually means
   Visualizer is inside another function or not declared in the same scope.
   Let's check where Visualizer function is declared.                           */

const vizIdx = txt.indexOf('\nfunction Visualizer(');
if (vizIdx === -1) {
  console.log('FIX 3: Visualizer declaration not found - it was merged into the temp bottomPart in the previous run. Already inline.');
} else {
  console.log('FIX 3: Visualizer found at char', vizIdx);
  // Check: is it inside AISizeGuideModal?
  const modalCloseIdx = txt.indexOf('\n}\n\n// Helpers');
  console.log('  AISizeGuideModal close at:', modalCloseIdx);
  console.log('  Is Visualizer after modal close?', vizIdx > modalCloseIdx);
}

fs.writeFileSync('src/components/ui/AISizeGuideModal.tsx', txt);
console.log('\nDone. Running tsc to verify...');
