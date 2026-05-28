import sharp from 'sharp';

/** Chroma-key: pixels near keyColor become transparent. Good for solid-color bgs. */
async function chromaKey({ input, output, keyColor, threshold = 28 }) {
  const { data, info } = await sharp(input).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const [kr, kg, kb] = keyColor;
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const dist = Math.max(Math.abs(r - kr), Math.abs(g - kg), Math.abs(b - kb));
    if (dist <= threshold) {
      out[i + 3] = 0;
    } else if (dist <= threshold * 2) {
      const t = (dist - threshold) / threshold;
      out[i + 3] = Math.round(255 * t);
    }
  }
  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 }).toFile(output);
  console.log(`✓ ${output}  ${width}x${height}  (chroma-key)`);
}

/** Luminance-as-alpha: bright pixels stay opaque, dark pixels become transparent.
 *  Forces all opaque pixels to a single output colour. Ideal for monochrome
 *  logos sitting on dark or messy backgrounds — gradients become natural
 *  anti-aliased edges instead of visible rectangles. */
async function lumaAsAlpha({ input, output, paintColor = [255, 255, 255] }) {
  const { data, info } = await sharp(input).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const [pr, pg, pb] = paintColor;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    // ITU-R BT.601 luma; good enough for white logos
    const luma = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    out[j]     = pr;
    out[j + 1] = pg;
    out[j + 2] = pb;
    out[j + 3] = luma;
  }
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 }).toFile(output);
  console.log(`✓ ${output}  ${width}x${height}  (luma-as-alpha)`);
}

/** Find the bounding box of "dark" content in an image (luma < threshold).
 *  Used to crop off light frames/padding around a logo before keying. */
async function darkRegionBBox(input, threshold = 60, minFillRatio = 0.30) {
  const { data, info } = await sharp(input).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rowDark = new Array(height).fill(0);
  const colDark = new Array(width).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luma < threshold) {
        rowDark[y]++;
        colDark[x]++;
      }
    }
  }
  const findFirst = (arr, dim) => arr.findIndex((c) => c / dim >= minFillRatio);
  const findLast  = (arr, dim) => arr.length - 1 - [...arr].reverse().findIndex((c) => c / dim >= minFillRatio);
  const top    = Math.max(0, findFirst(rowDark, width));
  const bottom = Math.min(height - 1, findLast(rowDark, width));
  const left   = Math.max(0, findFirst(colDark, height));
  const right  = Math.min(width - 1, findLast(colDark, height));
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** White-on-black logo with a white frame around it.
 *  1. Detect the bbox of the dark region (the actual logo box).
 *  2. Crop to that bbox (drops the white frame).
 *  3. luma-as-alpha: white logo stays opaque, black bg becomes transparent.
 */
{
  const input  = 'Images/BaltoCapital_Logo_Horizontal_BlancSurNoir.jpg';
  const output = 'public/brand/balto-logo-white.png';
  const bbox = await darkRegionBBox(input, 60, 0.30);
  console.log(`  bbox of dark region: x=${bbox.left} y=${bbox.top} w=${bbox.width} h=${bbox.height}`);

  const croppedBuf = await sharp(input).extract(bbox).toBuffer();
  const { data, info } = await sharp(croppedBuf).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const luma = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    out[j]     = 255;
    out[j + 1] = 255;
    out[j + 2] = 255;
    out[j + 3] = luma;
  }
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 }).toFile(output);
  console.log(`✓ ${output}  ${width}x${height}  (cropped + luma-as-alpha)`);
}

// Navy-on-white logo: chroma-key works because the background is genuinely solid white.
await chromaKey({
  input: 'Images/BaltoCapital_Logo_Horizontal_BleuFoncé.jpg',
  output: 'public/brand/balto-logo-navy.png',
  keyColor: [255, 255, 255],
  threshold: 18,
});

console.log('done');
