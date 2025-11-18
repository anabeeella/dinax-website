#!/bin/bash
# Script simple para optimizar imágenes del proyecto Dinax
# Usa herramientas nativas de macOS (sips) - no requiere instalaciones adicionales

echo "🖼️  Optimizando imágenes del proyecto Dinax..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para optimizar una imagen
optimize_image() {
    local file=$1
    local max_width=$2
    local quality=$3
    local output_file=$4
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    # Obtener extensión
    extension="${file##*.}"
    
    # Si es JPG, optimizar con sips
    if [[ "$extension" == "jpg" || "$extension" == "jpeg" || "$extension" == "JPG" || "$extension" == "JPEG" ]]; then
        # Redimensionar si es necesario
        if [ ! -z "$max_width" ]; then
            sips -Z "$max_width" "$file" --out "$output_file" > /dev/null 2>&1
        else
            cp "$file" "$output_file"
        fi
        
        # Comprimir (sips no tiene opción de calidad directa, pero podemos usar jpegoptim si está disponible)
        # Por ahora, sips ya comprime bien por defecto
        echo -e "${GREEN}✓${NC} Optimizado: $(basename "$file")"
        return 0
    fi
    
    # Si es PNG, convertir a JPG si es posible
    if [[ "$extension" == "png" || "$extension" == "PNG" ]]; then
        # Convertir PNG a JPG
        jpg_file="${file%.*}.jpg"
        sips -s format jpeg "$file" --out "$jpg_file" > /dev/null 2>&1
        
        if [ ! -z "$max_width" ]; then
            sips -Z "$max_width" "$jpg_file" --out "$output_file" > /dev/null 2>&1
        else
            mv "$jpg_file" "$output_file"
        fi
        
        echo -e "${GREEN}✓${NC} Convertido y optimizado: $(basename "$file") → $(basename "$output_file")"
        return 0
    fi
    
    return 1
}

# Crear backup
echo "📦 Creando backup..."
BACKUP_DIR="assets/images_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r assets/images "$BACKUP_DIR/"
echo -e "${GREEN}✓${NC} Backup creado en: $BACKUP_DIR"
echo ""

# 1. Optimizar imágenes de productos (_main.jpg) - Prioridad ALTA
echo "🎯 Optimizando imágenes de productos (_main.jpg)..."
PRODUCT_MAIN_COUNT=0
for img in assets/images/products/*_main.jpg; do
    if [ -f "$img" ]; then
        # Redimensionar a máximo 800px de ancho (suficiente para 400px display)
        optimize_image "$img" 800 "" "$img"
        ((PRODUCT_MAIN_COUNT++))
    fi
done
echo -e "${YELLOW}→${NC} Optimizadas $PRODUCT_MAIN_COUNT imágenes _main"
echo ""

# 2. Optimizar otras imágenes de productos (no _main)
echo "🎯 Optimizando otras imágenes de productos..."
PRODUCT_OTHER_COUNT=0
for img in assets/images/products/*.jpg; do
    if [ -f "$img" ] && [[ ! "$img" == *"_main.jpg" ]]; then
        # Redimensionar a máximo 1200px (para detalles)
        optimize_image "$img" 1200 "" "$img"
        ((PRODUCT_OTHER_COUNT++))
    fi
done
echo -e "${YELLOW}→${NC} Optimizadas $PRODUCT_OTHER_COUNT imágenes adicionales"
echo ""

# 3. Optimizar imágenes de categorías
echo "🎯 Optimizando imágenes de categorías..."
CATEGORY_COUNT=0
for img in assets/images/categories/*.png assets/images/categories/*.jpg; do
    if [ -f "$img" ]; then
        # Redimensionar a máximo 600px
        optimize_image "$img" 600 "" "${img%.*}.jpg"
        if [[ "$img" == *.png ]]; then
            rm "$img" 2>/dev/null  # Eliminar PNG original si se convirtió a JPG
        fi
        ((CATEGORY_COUNT++))
    fi
done
echo -e "${YELLOW}→${NC} Optimizadas $CATEGORY_COUNT imágenes de categorías"
echo ""

# 4. Optimizar hero image
echo "🎯 Optimizando hero image..."
HERO_COUNT=0
for img in assets/images/hero/*.jpg assets/images/hero/*.png; do
    if [ -f "$img" ]; then
        # Redimensionar a máximo 1920px (full width)
        optimize_image "$img" 1920 "" "${img%.*}.jpg"
        if [[ "$img" == *.png ]]; then
            rm "$img" 2>/dev/null
        fi
        ((HERO_COUNT++))
    fi
done
echo -e "${YELLOW}→${NC} Optimizadas $HERO_COUNT imágenes hero"
echo ""

# 5. Optimizar preview images
echo "🎯 Optimizando preview images..."
PREVIEW_COUNT=0
for img in assets/images/categories/prev*.png; do
    if [ -f "$img" ]; then
        # Redimensionar a máximo 400px
        optimize_image "$img" 400 "" "${img%.*}.jpg"
        rm "$img" 2>/dev/null
        ((PREVIEW_COUNT++))
    fi
done
echo -e "${YELLOW}→${NC} Optimizadas $PREVIEW_COUNT preview images"
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Optimización completada!${NC}"
echo ""
echo "📊 Resumen:"
echo "   • Imágenes _main: $PRODUCT_MAIN_COUNT"
echo "   • Otras productos: $PRODUCT_OTHER_COUNT"
echo "   • Categorías: $CATEGORY_COUNT"
echo "   • Hero: $HERO_COUNT"
echo "   • Preview: $PREVIEW_COUNT"
echo ""
echo "💾 Backup guardado en: $BACKUP_DIR"
echo ""
echo "⚠️  Nota: Si convertiste PNG a JPG, actualiza las referencias en:"
echo "   - index.html (preview images)"
echo "   - styles.css (hero background si aplica)"
echo ""

