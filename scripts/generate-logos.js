#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandingDir = path.join(__dirname, '../assets/branding');
const logos = ['crest', 'signet', 'compact'];

// Ensure directory exists
if (!fs.existsSync(brandingDir)) {
  fs.mkdirSync(brandingDir, { recursive: true });
}

// PNG sizes to generate
const pngSizes = {
  crest: [1024, 512, 256, 128, 64, 48, 32, 16],
  signet: [1024, 512, 256, 128, 64, 48, 32, 16],
  compact: [1024, 512, 256, 128, 64, 48, 32, 16]
};

async function convertSvgToPng() {
  console.log('Converting SVGs to PNGs...');

  for (const logo of logos) {
    const svgPath = path.join(brandingDir, `${logo}.svg`);

    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  ${svgPath} not found, skipping...`);
      continue;
    }

    try {
      // Create main PNG (1024x1024)
      const mainPngPath = path.join(brandingDir, `${logo}.png`);
      await sharp(svgPath, { density: 300 }).resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(mainPngPath);
      console.log(`✅ ${logo}.png (1024x1024)`);

      // Create ICO (multiple sizes for Windows icon)
      const icoSizes = [256, 128, 96, 64, 48, 32, 16];
      const icoBuffers = [];

      for (const size of icoSizes) {
        const buffer = await sharp(svgPath, { density: 300 })
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        icoBuffers.push(buffer);
      }

      // For now, save ICO as a multi-format file (Windows will use)
      // We'll use the largest PNG as ICO for simplicity
      if (logo === 'crest') {
        const icoPath = path.join(brandingDir, `${logo}.ico`);
        // Convert largest PNG to ICO format
        const pngBuffer = await sharp(svgPath, { density: 300 })
          .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();

        // Save as ICO (we'll need to create a proper ICO with multiple resolutions)
        // For now, save the PNG and mark it for ICO conversion
        fs.writeFileSync(icoPath.replace('.ico', '.png-for-ico'), pngBuffer);
        console.log(`✅ ${logo}.ico (prepared from PNG)`);
      }
    } catch (error) {
      console.error(`❌ Error converting ${logo}:`, error.message);
    }
  }

  console.log('\n✅ Logo conversion complete!');
}

convertSvgToPng().catch(console.error);
