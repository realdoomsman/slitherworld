#!/bin/bash

echo "🎨 Converting Slither.io Branding Assets to PNG..."
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not installed"
    echo ""
    echo "Install it with:"
    echo "  macOS:  brew install imagemagick"
    echo "  Linux:  sudo apt install imagemagick"
    echo ""
    echo "Or use online converter: https://cloudconvert.com/svg-to-png"
    exit 1
fi

echo "✅ ImageMagick found"
echo ""

# Create output directory
mkdir -p public/branding

# Convert icon to various sizes
echo "📱 Converting icon.svg..."
convert -background none public/icon.svg -resize 500x500 public/branding/icon-500.png
convert -background none public/icon.svg -resize 512x512 public/branding/icon-512.png
convert -background none public/icon.svg -resize 192x192 public/branding/icon-192.png
convert -background none public/icon.svg -resize 180x180 public/branding/apple-touch-icon.png
echo "   ✅ icon-500.png (500x500)"
echo "   ✅ icon-512.png (512x512)"
echo "   ✅ icon-192.png (192x192)"
echo "   ✅ apple-touch-icon.png (180x180)"

# Convert banner
echo ""
echo "🎯 Converting banner.svg..."
convert -background none public/banner.svg -resize 1500x500 public/branding/banner-1500.png
convert -background none public/banner.svg -resize 1200x675 public/branding/og-image.png
echo "   ✅ banner-1500.png (1500x500)"
echo "   ✅ og-image.png (1200x675)"

# Convert favicon
echo ""
echo "🔖 Converting favicon.svg..."
convert -background none public/favicon.svg -resize 32x32 public/branding/favicon-32.png
convert -background none public/favicon.svg -resize 16x16 public/branding/favicon-16.png
echo "   ✅ favicon-32.png (32x32)"
echo "   ✅ favicon-16.png (16x16)"

# Create multi-size favicon.ico
echo ""
echo "🎨 Creating favicon.ico..."
convert public/branding/favicon-16.png public/branding/favicon-32.png public/favicon.ico
echo "   ✅ favicon.ico (16x16 + 32x32)"

echo ""
echo "✅ All branding assets converted!"
echo ""
echo "📁 Files created in public/branding/:"
ls -lh public/branding/
echo ""
echo "📋 Next steps:"
echo "   1. Review files in public/branding/"
echo "   2. Copy to public/ root if needed"
echo "   3. Update social media profiles"
echo "   4. See BRANDING.md for usage guidelines"
echo ""
