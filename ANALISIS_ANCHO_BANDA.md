# Análisis de Ancho de Banda - Proyecto Dinax

## 📊 Resumen Actual

### Tamaño Total de Imágenes
- **Total general**: ~303 MB
- **Productos**: 205 MB (198 imágenes JPG)
- **Categorías**: 42 MB
- **Hero/About**: ~3.5 MB

### Uso de Ancho de Banda por Página

#### 🏠 **index.html** (Página Principal)
**Imágenes que se cargan inmediatamente:**
- Hero image: ~3.4 MB
- 6 preview images (prev1-6.png): ~6-12 MB
- 6 category images (home_cat-*.png): ~6-12 MB
- Logo: ~10 KB (SVG)

**Total inicial**: ~15-25 MB
**Con lazy loading**: ~3-5 MB (solo hero + primeras imágenes visibles)

#### 📦 **catalog.html** (Catálogo)
**Imágenes que se cargan:**
- 61 productos × 1 imagen _main cada uno
- Tamaño promedio por imagen: ~1 MB (sin optimizar)
- **Sin optimización**: ~61 MB inicialmente
- **Con lazy loading (ya implementado)**: ~5-10 MB (solo primeras 5-10 imágenes visibles)

#### 🔍 **product-details.html** (Detalle de Producto)
**Imágenes que se cargan:**
- 1 producto con 2-5 imágenes promedio
- **Total**: ~2-5 MB por producto

## 🎯 Optimizaciones Recomendadas

### Prioridad ALTA (Mayor impacto)

1. **Imágenes de Productos (_main.jpg)**
   - **Actual**: ~1 MB promedio cada una
   - **Objetivo**: 100-200 KB cada una
   - **Ahorro**: ~80-90% (de 205 MB a ~20-40 MB)
   - **Impacto**: Reducción masiva en catálogo

2. **Imágenes de Categorías**
   - **Actual**: 42 MB total
   - **Objetivo**: 4-8 MB total
   - **Ahorro**: ~80-90%
   - **Impacto**: Mejora carga de index.html

3. **Hero Image**
   - **Actual**: ~3.4 MB
   - **Objetivo**: 300-500 KB
   - **Ahorro**: ~85-90%
   - **Impacto**: Mejora carga inicial

### Prioridad MEDIA

4. **Preview Images (prev1-6.png)**
   - Convertir a JPG y optimizar
   - **Objetivo**: 50-100 KB cada una

5. **Imágenes secundarias de productos** (no _main)
   - Optimizar cuando se cargan en detalles
   - **Objetivo**: 150-300 KB cada una

## 📈 Proyección Post-Optimización

### Tamaños Esperados
- **Productos**: 205 MB → 20-40 MB (80-90% reducción)
- **Categorías**: 42 MB → 4-8 MB (80-90% reducción)
- **Hero/About**: 3.5 MB → 0.5-1 MB (70-85% reducción)
- **Total**: 303 MB → **25-50 MB** (83-92% reducción)

### Uso de Ancho de Banda Post-Optimización

#### index.html
- **Antes**: 15-25 MB
- **Después**: 1-2 MB inicial (solo hero optimizado)
- **Ahorro**: ~90%

#### catalog.html
- **Antes**: 61 MB (sin lazy) / 5-10 MB (con lazy)
- **Después**: 6-12 MB (sin lazy) / 1-2 MB (con lazy)
- **Ahorro**: ~80-90%

## 🛠️ Herramientas Recomendadas

1. **ImageMagick** (multiplataforma)
2. **sips** (macOS nativo - ya disponible)
3. **jpegoptim** (Linux/Mac)
4. **Online**: TinyPNG, Squoosh

## ⚠️ Consideraciones

- Mantener calidad visual aceptable (80-85% calidad JPG)
- Resolución máxima: 1200px para productos, 800px para thumbnails
- Las imágenes _main deben ser ~400x340px (ya definido en CSS)
- Considerar WebP para navegadores modernos (opcional, más complejo)

