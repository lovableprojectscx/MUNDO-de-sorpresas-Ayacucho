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
  // Show de ositos / imágenes de servicios (se muestran a ~400px)
  { match: (f) => f.includes('show-ositos') || f.includes('detalles-regalo'), width: 800, quality: 82, effort: 6 },
  // Galería de recuerdos - se muestran en grid a máx 400px en desktop
  // 2x retina = 800px es SUFICIENTE (antes eran 3000px+!)
  { match: (f) => f.includes('recuerdos'), width: 800, quality: 78, effort: 6 },
  // Default para cualquier otra imagen
  { match: () => true, width: 1280, quality: 80, effort: 5 },
];

const CONVERTIBLE = ['.jpg', '.jpeg', '.png'];
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
    const originalSize = fs.existsSync(webpPath) 
      ? fs.statSync(filePath).size 
      : fs.statSync(filePath).size;

    const metadata = await sharp(filePath).metadata();
    const originalPx = `${metadata.width}×${metadata.height}`;
    
    await sharp(filePath)
      .resize({ width: rule.width, withoutEnlargement: true }) // nunca agrandar, solo achicar
      .webp({ quality: rule.quality, effort: rule.effort })
      .toFile(webpPath);
    
    const newSize = fs.statSync(webpPath).size;
    const origSize = fs.statSync(filePath).size;
    const saving = ((origSize - newSize) / origSize * 100).toFixed(1);
    
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
