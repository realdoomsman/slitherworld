# 🎨 Slither.io Branding Assets

## Available Files

### SVG (Vector - Scalable)
- **icon.svg** - 500x500 app icon with coiled snake
- **banner.svg** - 1500x500 banner with full branding
- **favicon.svg** - 32x32 simplified icon for browser tabs

### Usage

#### In HTML
```html
<!-- Favicon -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/icon.svg">

<!-- Open Graph (Social Media) -->
<meta property="og:image" content="/banner.svg">
```

#### In Next.js
Already configured in `app/layout.tsx`!

#### In CSS
```css
.logo {
  background-image: url('/icon.svg');
  background-size: contain;
}
```

## Converting to PNG

### Option 1: Use Script (Requires ImageMagick)
```bash
# Install ImageMagick first
brew install imagemagick  # macOS
sudo apt install imagemagick  # Linux

# Run conversion script
bash scripts/convert-branding.sh
```

### Option 2: Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload SVG files
3. Download PNG files
4. Place in `public/` folder

### Option 3: Design Software
- Open in Figma, Illustrator, or Inkscape
- Export as PNG at desired resolution
- Use 2x or 3x for retina displays

## Sizes Needed

### For Web
- 16x16 - Favicon
- 32x32 - Favicon
- 180x180 - Apple Touch Icon
- 192x192 - Android Icon
- 512x512 - PWA Icon

### For Social Media
- 500x500 - Profile pictures
- 1500x500 - Twitter/X header (perfect fit!)
- 1200x675 - Open Graph images
- 1584x396 - LinkedIn banner

## Brand Colors

```css
--neon-green: #00ff00
--dark-bg: #0a0a0a
--solana-green: #14F195
--usdc-blue: #2775CA
```

## More Info

See **BRANDING.md** in the root directory for:
- Complete brand guidelines
- Color palette
- Typography
- Usage examples
- Social media sizes
- Design philosophy

---

**Need help?** Check BRANDING.md or contact the team.
