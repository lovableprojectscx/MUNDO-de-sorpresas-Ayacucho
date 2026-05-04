/**
 * Re-compresión de WebPs existentes a tamaño adaptable
 * Uso: node scripts/resize-webp.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const JOBS = [
  // Recuerdos: mostrados a 280px en móvil → 2x = 400px es suficiente
  { pattern: 'recuerdos', maxW: 400, quality: 72 },
  // Servicios: mostrados a 333px → 2x = 500px
  { files: ['public/show-ositos-tunanteros-ayacucho.webp', 'public/detalles-regalo.webp'], maxW: 500, quality: 80 },
];

let totalBefore = 0, totalAfter = 0;

async function process(filePath, maxW, quality) {
  const abs = path.join(root, filePath);
  if (!fs.existsSync(abs)) return;
  
  const before = fs.statSync(abs).size;
  // Escribir a un nombre diferente primero (evitar EPERM)
  const out = abs.replace('.webp', '._opt.webp');
  
  await sharp(abs)
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);
  
  const after = fs.statSync(out).size;
  // Solo reemplazar si el nuevo es más pequeño
  if (after < before) {
    fs.unlinkSync(abs);
    fs.renameSync(out, abs);
    totalBefore += before;
    totalAfter += after;
    console.log(`✅ ${path.basename(filePath)}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (−${((before-after)/before*100).toFixed(1)}%)`);
  } else {
    fs.unlinkSync(out);
    console.log(`⏭ ${path.basename(filePath)}: ya optimizado (${(before/1024).toFixed(0)}KB)`);
  }
}

// Procesar recuerdos
const recuerdosDir = path.join(root, 'public', 'recuerdos');
if (fs.existsSync(recuerdosDir)) {
  for (const f of fs.readdirSync(recuerdosDir).filter(f => f.endsWith('.webp'))) {
    await process(`public/recuerdos/${f}`, 400, 72);
  }
}

// Procesar servicios individuales
for (const job of JOBS) {
  if (job.files) {
    for (const f of job.files) {
      await process(f, job.maxW, job.quality);
    }
  }
}

console.log(`\n📊 AHORRO TOTAL: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB (−${((totalBefore-totalAfter)/totalBefore*100).toFixed(1)}%)`);
