import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const FILES = [
  'incense-1', 'incense-2', 'incense-3',
  'flower-1', 'flower-2',
  'wheat', 'egg', 'crab', 'soy', 'milk',
];

async function processIcon(name) {
  const filePath = path.join(ROOT, 'public/icons', name + '.png');

  // 1. 검은 배경 trim
  const { data, info } = await sharp(filePath)
    .trim({ background: '#000000', threshold: 20 })
    .toBuffer({ resolveWithObject: true });

  const { width: trimW, height: trimH } = info;

  // 2. 정사각형 + 15% 여백 캔버스에 중앙 합성
  const side = Math.max(trimW, trimH);
  const pad  = Math.round(side * 0.15);
  const canvas = side + pad * 2;

  await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: data, gravity: 'center' }])
    .png()
    .toFile(filePath);

  console.log(`✓ ${name}: ${trimW}×${trimH} → ${canvas}×${canvas} (pad ${pad}px)`);
}

for (const name of FILES) {
  await processIcon(name);
}
console.log('\n모든 아이콘 처리 완료!');
