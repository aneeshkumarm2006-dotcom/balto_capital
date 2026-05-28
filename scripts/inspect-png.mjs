import sharp from 'sharp';

async function inspect(path) {
  const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`\n${path}  ${width}x${height}  ch=${channels}`);

  // Check the 4 corners + center of each edge
  const samples = [
    ['top-left',     0, 0],
    ['top-right',    width - 1, 0],
    ['bottom-left',  0, height - 1],
    ['bottom-right', width - 1, height - 1],
    ['top-mid',      Math.floor(width / 2), 0],
    ['bottom-mid',   Math.floor(width / 2), height - 1],
    ['left-mid',     0, Math.floor(height / 2)],
    ['right-mid',    width - 1, Math.floor(height / 2)],
  ];
  for (const [name, x, y] of samples) {
    const i = (y * width + x) * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    console.log(`  ${name.padEnd(13)} rgb(${r},${g},${b}) a=${a}`);
  }

  // Histogram of alpha values
  const buckets = new Array(8).fill(0);
  for (let i = 3; i < data.length; i += channels) {
    buckets[Math.floor(data[i] / 32)]++;
  }
  console.log(`  alpha histogram (8 bins, 0..255):`);
  buckets.forEach((c, i) => console.log(`    ${(i * 32).toString().padStart(3)}-${(i * 32 + 31).toString().padStart(3)}: ${c}`));
}

await inspect('public/brand/balto-logo-white.png');
await inspect('public/brand/balto-logo-navy.png');
