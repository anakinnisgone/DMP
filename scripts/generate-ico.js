#!/usr/bin/env node
import sharp from 'sharp';
import ICO from 'ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandingDir = path.join(__dirname, '../assets/branding');

async function generateICO() {
  console.log('Generating ICO files from PNGs...');

  try {
    // Generate crest.ico (Windows app icon - multiple resolutions)
    const crestPng = path.join(brandingDir, 'crest.png');

    if (fs.existsSync(crestPng)) {
      const sizes = [16, 24, 32, 48, 64, 128, 256];
      const images = [];

      for (const size of sizes) {
        const buffer = await sharp(crestPng)
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();

        images.push({
          width: size,
          height: size,
          buffer: buffer
        });
      }

      const icoBuffer = ICO.encode(images);
      fs.writeFileSync(path.join(brandingDir, 'crest.ico'), icoBuffer);
      console.log('✅ crest.ico generated (16-256px)');
    }
  } catch (error) {
    console.error('❌ Error generating ICO:', error.message);
    // Fallback: create a simple ICO from PNG
    console.log('⚠️  Falling back to PNG-to-ICO conversion...');
    await fallbackIcoGeneration();
  }
}

async function fallbackIcoGeneration() {
  // Use ImageMagick-like approach with just PNG
  const crestPng = path.join(brandingDir, 'crest.png');

  if (fs.existsSync(crestPng)) {
    const buffer = await sharp(crestPng).resize(256, 256).png().toBuffer();
    const icoPath = path.join(brandingDir, 'crest.ico');

    // Write PNG as ICO (some tools can read this)
    fs.writeFileSync(icoPath, buffer);
    console.log('✅ crest.ico generated (256x256 PNG format)');
  }
}

generateICO().catch(console.error);
