/**
 * Generates crisp favicon assets from public/brand/dlucenti-mark.png
 * Run: npm run generate:favicons
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "public", "brand", "dlucenti-mark.png");

/** D'LUCENTI charcoal — readable on light browser tabs */
const INK = { r: 58, g: 56, b: 52 };


function findInkBounds(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 40) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { left: 0, top: 0, width, height };
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/** Slightly bolden thin letterforms so they survive 16px tabs. */
function dilateInk(pixels, width, height, radius = 1) {
  const out = Buffer.from(pixels);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] < 200) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const j = (ny * width + nx) * 4;
          out[j] = INK.r;
          out[j + 1] = INK.g;
          out[j + 2] = INK.b;
          out[j + 3] = 255;
        }
      }
    }
  }
  return out;
}

/**
 * Rebuild mark as solid ink on transparency, cropped tightly to the letters.
 */
async function prepareCrispMark() {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 40) {
      pixels[i] = INK.r;
      pixels[i + 1] = INK.g;
      pixels[i + 2] = INK.b;
      pixels[i + 3] = 255;
    }
  }

  const bounds = findInkBounds(pixels, info.width, info.height);
  const bold = dilateInk(pixels, info.width, info.height, 1);

  return sharp(bold, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .extract(bounds)
    .png()
    .toBuffer();
}

/**
 * Balanced sizing: visible D'L with comfortable padding (not cover, not tiny).
 * Wide marks are height-led, then capped if they exceed ~86% of canvas width.
 */
async function resizeCrisp(markPng, size) {
  const meta = await sharp(markPng).metadata();
  const markW = meta.width ?? size;
  const markH = meta.height ?? size;

  const targetHeight = size * 0.5;
  let scale = targetHeight / markH;
  let w = Math.round(markW * scale);
  let h = Math.round(markH * scale);

  const maxWidth = Math.round(size * 0.86);
  if (w > maxWidth) {
    scale = maxWidth / markW;
    w = maxWidth;
    h = Math.round(markH * scale);
  }

  const resized = await sharp(markPng)
    .resize(w, h, {
      kernel: sharp.kernel.lanczos3,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .sharpen({ sigma: size <= 32 ? 0.5 : 0.3, m1: 1, m2: 0.5 })
    .png({ compressionLevel: 9, adaptiveFiltering: false })
    .toBuffer();
}

async function main() {
  const markPng = await prepareCrispMark();
  const mark = sharp(markPng);
  const meta = await mark.metadata();
  console.log(`Cropped mark: ${meta.width}x${meta.height}`);

  const [png16, png32, png48, png180, png512] = await Promise.all([
    resizeCrisp(markPng, 16),
    resizeCrisp(markPng, 32),
    resizeCrisp(markPng, 48),
    resizeCrisp(markPng, 180),
    resizeCrisp(markPng, 512),
  ]);

  const ico = await toIco([png16, png32, png48]);

  const publicDir = path.join(root, "public");
  const appDir = path.join(root, "app");

  await Promise.all([
    fs.writeFile(path.join(publicDir, "favicon.ico"), ico),
    fs.writeFile(path.join(publicDir, "icon.png"), png32),
    fs.writeFile(path.join(publicDir, "apple-icon.png"), png180),
    fs.writeFile(path.join(publicDir, "brand", "og-icon.png"), png512),
    fs.writeFile(path.join(appDir, "favicon.ico"), ico),
    fs.writeFile(path.join(appDir, "icon.png"), png32),
    fs.writeFile(path.join(appDir, "apple-icon.png"), png180),
  ]);

  console.log("Crisp favicon assets generated (balanced padding):");
  console.log("  favicon.ico (16, 32, 48)");
  console.log("  icon.png (32x32)");
  console.log("  apple-icon.png (180x180)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
