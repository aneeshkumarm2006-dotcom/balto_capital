import sharp from 'sharp';

async function chromaKey({ input, output, keyColor, threshold = 28 }) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
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
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`✓ ${output}  ${width}x${height}`);
}

await chromaKey({
  input: 'Images/BaltoCapital_Logo_Horizontal_BlancSurNoir.jpg',
  output: 'public/brand/balto-logo-white.png',
  keyColor: [0, 0, 0],
  threshold: 36,
});

await chromaKey({
  input: 'Images/BaltoCapital_Logo_Horizontal_BleuFoncé.jpg',
  output: 'public/brand/balto-logo-navy.png',
  keyColor: [255, 255, 255],
  threshold: 18,
});

console.log('done');
