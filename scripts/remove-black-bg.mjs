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

async function removeBlackBg(name) {
  const filePath = path.join(ROOT, 'public/icons', name + '.png');

  // RGBA 버퍼로 읽기
  const img = sharp(filePath);
  const { width, height } = await img.metadata();
  const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // 검은색 계열 픽셀 → 투명 처리
  // 임계값: R,G,B 모두 60 이하인 픽셀을 검은 배경으로 판단
  const THRESHOLD = 60;
  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
      pixels[i + 3] = 0; // alpha = 0 (투명)
    }
  }

  // 다시 trim해서 여백 제거 후 저장
  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 },
  })
    .trim({ threshold: 0 })  // 투명 픽셀 기준으로 trim
    .png()
    .toFile(filePath);

  console.log(`✓ ${name}: 검은 배경 제거 완료`);
}

for (const name of FILES) {
  await removeBlackBg(name);
}
console.log('\n모든 아이콘 처리 완료!');
