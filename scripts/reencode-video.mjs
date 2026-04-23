// scripts/reencode-video.mjs
// Re-encoda o vídeo para que cada frame seja um keyframe (I-frame only)
// Isso permite seeking perfeito sem stutter durante scroll-driven animation

import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ffmpeg-static fornece o binário pré-compilado para a plataforma atual
const ffmpegPath = require("ffmpeg-static");

const input = path.resolve(__dirname, "../public/videos/torcida.mp4");
const output = path.resolve(__dirname, "../public/videos/torcida.mp4");

console.log("🎬 Re-encodando vídeo para scrubbing perfeito...");
console.log(`  Input : ${input}`);
console.log(`  Output: ${output}`);
console.log("  Isso pode levar alguns minutos...\n");

const args = [
  "-y", // sobrescreve sem perguntar
  "-i",
  input,
  // --- Vídeo: H.264, sem B-frames, keyframe em todo frame ---
  "-c:v",
  "libx264",
  "-g",
  "1", // GOP size = 1 → todo frame é keyframe
  "-keyint_min",
  "1",
  "-sc_threshold",
  "0",
  "-bf",
  "0", // sem B-frames
  "-crf",
  "20", // qualidade alta (0=lossless, 23=default, 51=pior)
  "-preset",
  "fast", // equilíbrio entre velocidade de encode e tamanho
  "-profile:v",
  "baseline", // compatibilidade máxima com browsers
  "-level",
  "3.1",
  "-pix_fmt",
  "yuv420p",
  // --- Áudio: remover (vídeo é mudo) ---
  "-an",
  // --- MP4 faststart: metadados no início para streaming mais rápido ---
  "-movflags",
  "+faststart",
  output,
];

execFile(
  ffmpegPath,
  args,
  { maxBuffer: 1024 * 1024 * 50 },
  (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erro no re-encode:\n", stderr);
      process.exit(1);
    }
    console.log("✅ Vídeo re-encodado com sucesso!");
    console.log(`   Arquivo salvo em: ${output}`);
    console.log(
      "\n⚡ Agora atualize o src no BrandStory.tsx para '/videos/torcida.mp4'",
    );
  },
);
