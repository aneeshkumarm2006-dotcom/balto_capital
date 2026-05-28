import sharp from 'sharp';

const { data, info } = await sharp('Images/BaltoCapital_Logo_Horizontal_BlancSurNoir.jpg')
  .raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
console.log(`${width}x${height}  ch=${channels}`);

// Sample a 10x10 grid across the image
console.log('Grid of source JPEG pixel values (luminance ~= R since neutral gray):');
for (let row = 0; row < 8; row++) {
  let line = '';
  for (let col = 0; col < 16; col++) {
    const x = Math.floor((col / 15) * (width - 1));
    const y = Math.floor((row / 7) * (height - 1));
    const i = (y * width + x) * channels;
    const lum = data[i];
    // ASCII shade by luminance
    const ch = lum < 32 ? '#' : lum < 64 ? '@' : lum < 96 ? '%' : lum < 128 ? '*' : lum < 160 ? '+' : lum < 192 ? '=' : lum < 224 ? '-' : '.';
    line += ch.repeat(3);
  }
  console.log(line);
}

// Histogram of full image luminance
const hist = new Array(8).fill(0);
for (let i = 0; i < data.length; i += channels) {
  hist[Math.min(7, Math.floor(data[i] / 32))]++;
}
console.log('\nLuminance histogram of source JPEG:');
hist.forEach((c, i) => console.log(`  ${(i * 32).toString().padStart(3)}-${(i * 32 + 31).toString().padStart(3)}: ${c}`));
