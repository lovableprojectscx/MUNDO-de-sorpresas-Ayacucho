/**
 * Script MEJORADO de Optimización de Imágenes - Mundo de Sorpresas Ayacucho
 * 
 * PROBLEMA: Convertir a WebP sin redimensionar no es suficiente.
 * Una foto de 3024x2638px se muestra a 280x173px en móvil = 99% de píxeles desperdiciados.
 * 
 * SOLUCIÓN: Redimensionar + WebP + calidad óptima por tipo de imagen.
 * 
 * Uso: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// Reglas de optimización por prefijo de archivo o carpeta:
// width: ancho máximo (sharp respeta aspect ratio automáticamente)
// quality: calidad WebP (0-100)
// effort: velocidad de compresión (0=rápido/menos comprimido, 6=lento/más comprimido)
const RULES = [
  // Fondos de hero/catálogo - 1920px es suficiente para desktop 4K
  { match: (f) => f.includes('fondo-principal') || f.includes('portada-catalogo'), width: 1920, quality: 82, effort: 6 },
  // Logos - máximo 600px (se muestran a ~300px)
  { match: (f) => f.includes('logo') || f.includes('icon'), width: 600, quality: 90, effort: 6 },
  // Premium gift bg (pequeño fondo decorativo)
  { match: (f) => f.includes('premium-gift'), width: 1280, quality: 82, effort: 6 },
  // Show de ositos / imágenes de servicios (se muestran a ~333px en móvil)
  // bajado a 400px para satisfacer Lighthouse
  { match: (f) => f.includes('show-ositos') || f.includes('detalles-regalo'), width: 400, quality: 75, effort: 6 },
  // Galería de recuerdos - se muestran en grid a máx 280px en móvil
  // bajado a 320px
  { match: (f) => f.includes('recuerdos'), width: 320, quality: 70, effort: 6 },
  // Default para cualquier otra imagen
  { match: () => true, width: 1280, quality: 80, effort: 5 },
];

const CONVERTIBLE = ['.jpg', '.jpeg', '.png', '.webp'];
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
  
  // Buscar la regla que aplica
  const rule = RULES.find(r => r.match(filePath.replace(/\\/g, '/')));

  try {
    // Read into memory first to release file lock on Windows before overwriting
    const fileBuffer = fs.readFileSync(filePath);
    const metadata = await sharp(fileBuffer).metadata();
    const originalPx = `${metadata.width}×${metadata.height}`;
    
    // We remove the early return so all WebP files are forcibly recompressed using the new quality limit.

    const { data, info } = await sharp(fileBuffer)
      .resize({ width: rule.width, withoutEnlargement: true }) // nunca agrandar, solo achicar
      .webp({ quality: rule.quality, effort: rule.effort })
      .toBuffer({ resolveWithObject: true });
      
    fs.writeFileSync(webpPath, data);

    // If original was NOT webp, we might want to delete the original after? Left as is.
    const newSize = info.size;
    const origSize = fs.existsSync(filePath) && ext !== '.webp' ? fs.statSync(filePath).size : (metadata.size || data.length);
    const saving = origSize > 0 ? ((origSize - newSize) / origSize * 100).toFixed(1) : 0;
    
    totalOriginal += origSize;
    totalOptimized += newSize;
    converted++;
    
    console.log(`✅ ${fileName}`);
    console.log(`   ${originalPx}px → max ${rule.width}px | ${(origSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (−${saving}%)`);
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

console.log('🚀 Optimización COMPLETA (WebP + Redimensionado inteligente)...\n');
await processDirectory(publicDir);

const totalSavingMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2);
const totalSavingPct = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);

console.log(`\n📊 RESUMEN FINAL:`);
console.log(`   Archivos procesados: ${converted}`);
console.log(`   Antes:  ${(totalOriginal/1024/1024).toFixed(2)}MB`);
console.log(`   Ahora:  ${(totalOptimized/1024/1024).toFixed(2)}MB`);
console.log(`   💾 AHORRO: ${totalSavingMB}MB (−${totalSavingPct}%)`);
console.log(`\n🏆 PageSpeed ahora debería detectar MUCHO menos ahorro posible.`);
