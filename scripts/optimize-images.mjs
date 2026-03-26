/**
 * Script de Optimización de Imágenes - Mundo de Sorpresas Ayacucho
 * Convierte todos los assets de /public a WebP con calidad 82 (óptimo calidad/peso)
 * Uso: node scripts/optimize-images.js
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// Configuración de optimización por tipo de imagen
const CONFIG = {
  // Imágenes de fondo y hero - calidad alta pero comprimida
  background: { quality: 82, effort: 6 },
  // Logos con transparencia - preservar calidad
  logo: { quality: 90, lossless: false },
  // Galería de recuerdos - balance perfecto
  gallery: { quality: 78, effort: 6 },
};

// Extensiones a convertir
const CONVERTIBLE = ['.jpg', '.jpeg', '.png'];
// Archivos a excluir
const EXCLUDE = ['placeholder.svg', 'robots.txt', 'sitemap.xml'];

let totalOriginal = 0;
let totalOptimized = 0;
let converted = 0;

async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!CONVERTIBLE.includes(ext)) return;
  
  const fileName = path.basename(filePath);
  if (EXCLUDE.includes(fileName)) return;

  const webpPath = filePath.replace(ext, '.webp');
  
  // Elegir configuración según tipo de imagen
  let config = CONFIG.background;
  if (fileName.includes('logo')) config = CONFIG.logo;
  if (filePath.includes('recuerdos')) config = CONFIG.gallery;

  try {
    const originalSize = fs.statSync(filePath).size;
    
    await sharp(filePath)
      .webp(config)
      .toFile(webpPath);
    
    const newSize = fs.statSync(webpPath).size;
    const saving = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    totalOriginal += originalSize;
    totalOptimized += newSize;
    converted++;
    
    console.log(`✅ ${fileName}`);
    console.log(`   ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (−${saving}%)`);
  } catch (err) {
    console.error(`❌ Error en ${fileName}:`, err.message);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      await convertToWebP(fullPath);
    }
  }
}

console.log('🚀 Iniciando conversión a WebP...\n');
await processDirectory(publicDir);

const totalSavingMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2);
const totalSavingPct = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);

console.log(`\n📊 RESUMEN:`);
console.log(`   Archivos convertidos: ${converted}`);
console.log(`   Tamaño original: ${(totalOriginal/1024/1024).toFixed(2)}MB`);
console.log(`   Tamaño final:    ${(totalOptimized/1024/1024).toFixed(2)}MB`);
console.log(`   💾 AHORRO TOTAL: ${totalSavingMB}MB (−${totalSavingPct}%)`);
console.log(`\n✨ ¡Listo! PageSpeed debería mejorar considerablemente.`);
