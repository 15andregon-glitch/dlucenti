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

/**
 * Rebuild mark as solid ink on true transparency using the source alpha channel.
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

  const trimmed = await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });

  const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.1);

  return sharp(trimmed.data, {
    raw: {
      width: trimmed.info.width,
      height: trimmed.info.height,
      channels: 4,
    },
  }).extend({
    top: pad,
    bottom: pad,
    left: pad,
    right: pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
}

/** Multi-step downscale keeps letterforms sharper at 16–32px */
async function resizeCrisp(mark, size) {
  const meta = await mark.metadata();
  const longest = Math.max(meta.width ?? size, meta.height ?? size);

  let pipeline = mark.clone();
  const breakpoints = [512, 256, 128, 64, 48, 32, 24, 16].filter(
    (s) => s > size && s < longest,
  );

  for (const step of breakpoints) {
    pipeline = pipeline.resize(step, step, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    });
  }

  return pipeline
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: size <= 32 ? 0.8 : 0.4, m1: 1, m2: 0.5 })
    .png({ compressionLevel: 9, adaptiveFiltering: false })
    .toBuffer();
}

async function main() {
  const mark = await prepareCrispMark();

  const [png16, png32, png48, png180, png512] = await Promise.all([
    resizeCrisp(mark, 16),
    resizeCrisp(mark, 32),
    resizeCrisp(mark, 48),
    resizeCrisp(mark, 180),
    resizeCrisp(mark, 512),
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

  console.log("Crisp favicon assets generated:");
  console.log("  favicon.ico (16, 32, 48)");
  console.log("  icon.png (32x32, transparent)");
  console.log("  apple-icon.png (180x180, transparent)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
