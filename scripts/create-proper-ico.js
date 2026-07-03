#!/usr/bin/env node
import sharp from 'sharp';
import toIco from 'to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandingDir = path.join(__dirname, '../assets/branding');
const buildDir = path.join(__dirname, '../build');

async function createProperICO() {
  console.log('Creating proper ICO files...');

  try {
    // Read crest.png
    const crestPng = path.join(brandingDir, 'crest.png');
    const icoPath = path.join(buildDir, 'icon.ico');

    if (!fs.existsSync(crestPng)) {
      console.error('❌ crest.png not found');
      return;
    }

    // Create multiple sizes for ICO
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const buffers = [];

    for (const size of sizes) {
      const buffer = await sharp(crestPng).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      buffers.push(buffer);
    }

    // Create ICO from buffers
    const icoBuffer = await toIco(buffers);
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('✅ icon.ico created successfully (16-256px)');
  } catch (error) {
    console.error('❌ Error creating ICO:', error.message);
    process.exit(1);
  }
}

createProperICO();
