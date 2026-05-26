/**
 * Generates favicon assets from public/brand/dlucenti-mark.png
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

/** Checkerboard / near-white export backgrounds → fully transparent. */
function alphaFromRgb(r, g, b) {
  const min = Math.min(r, g, b);
  if (min < 72) return 255;
  if (min > 218) return 0;
  return Math.round(255 * ((218 - min) / (218 - 72)));
}

async function loadTransparentMark() {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    pixels[i + 3] = alphaFromRgb(r, g, b);
  }

  return sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  });
}

async function resizeMark(mark, size) {
  return mark
    .clone()
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function main() {
  const mark = await loadTransparentMark();

  const [png16, png32, png180, png512] = await Promise.all([
    resizeMark(mark, 16),
    resizeMark(mark, 32),
    resizeMark(mark, 180),
    resizeMark(mark, 512),
  ]);

  const ico = await toIco([png16, png32]);

  const publicDir = path.join(root, "public");
  const appDir = path.join(root, "app");

  await Promise.all([
    fs.writeFile(path.join(publicDir, "favicon.ico"), ico),
    fs.writeFile(path.join(publicDir, "icon.png"), png32),
    fs.writeFile(path.join(publicDir, "apple-icon.png"), png180),
    fs.writeFile(path.join(publicDir, "brand", "og-icon.png"), png512),
    // Keep App Router file convention in sync (same bytes as public/).
    fs.writeFile(path.join(appDir, "favicon.ico"), ico),
    fs.writeFile(path.join(appDir, "icon.png"), png32),
    fs.writeFile(path.join(appDir, "apple-icon.png"), png180),
  ]);

  console.log("Favicon assets generated from public/brand/dlucenti-mark.png:");
  console.log("  public/favicon.ico + app/favicon.ico");
  console.log("  public/icon.png + app/icon.png (32x32, transparent)");
  console.log("  public/apple-icon.png + app/apple-icon.png (180x180, transparent)");
  console.log("  public/brand/og-icon.png (512x512, OG only)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
