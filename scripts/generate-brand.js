/**
 * DMP marka varlıkları üretici (v0.8.7 "D" logosu)
 *
 * Tek SVG kaynağından üretir:
 *   - build/icon.png   (512x512, electron-builder ana ikon)
 *   - build/icon.ico   (16..256 çoklu boyut, Windows installer/taskbar)
 *   - public/favicon.svg
 *
 * Kullanım: node scripts/generate-brand.js
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// DLogo.tsx ile birebir aynı çizim
const svg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="118" fill="url(#g)"/>
  <rect x="1.5" y="1.5" width="509" height="509" rx="116.5" stroke="white" stroke-opacity="0.08" stroke-width="3"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M164 124H272C350 124 402 178 402 256C402 334 350 388 272 388H164V124ZM230 186V326H266C310 326 338 300 338 256C338 212 310 186 266 186H230Z" fill="white"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#5B67F5"/>
      <stop offset="1" stop-color="#4F5BE8"/>
    </linearGradient>
  </defs>
</svg>`;

const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

async function main() {
  const src = Buffer.from(svg);

  // 512 ana PNG
  const png512 = await sharp(src).resize(512, 512).png().toBuffer();
  writeFileSync(join(root, 'build', 'icon.png'), png512);
  console.log('build/icon.png (512x512) yazildi');

  // Çoklu boyut ICO
  const pngs = await Promise.all(
    ICO_SIZES.map((s) => sharp(src).resize(s, s).png().toBuffer()),
  );
  const ico = await toIco(pngs);
  writeFileSync(join(root, 'build', 'icon.ico'), ico);
  console.log(`build/icon.ico (${ICO_SIZES.join(', ')}) yazildi`);

  // Favicon
  writeFileSync(join(root, 'public', 'favicon.svg'), svg);
  console.log('public/favicon.svg yazildi');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
