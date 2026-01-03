import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const PUBLIC_DIR = join(import.meta.dir, "../public");

// Favicon SVG - Modern "T" with LinkedIn blue gradient accent
function generateFavicon(): string {
  return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0077B5"/>
      <stop offset="100%" style="stop-color:#0A66C2"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#18181b"/>
      <stop offset="100%" style="stop-color:#1f1f23"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="512" height="4" fill="url(#iconGradient)" opacity="0.8"/>
  <g transform="translate(96, 110)">
    <rect x="60" y="60" width="200" height="28" rx="2" fill="#fafafa"/>
    <rect x="146" y="60" width="28" height="180" rx="2" fill="#fafafa"/>
    <circle cx="160" cy="30" r="16" fill="url(#iconGradient)"/>
    <circle cx="160" cy="30" r="10" fill="#18181b"/>
  </g>
</svg>`;
}

// Simple favicon for better visibility at small sizes
function generateFaviconSimple(): string {
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0077B5"/>
      <stop offset="100%" style="stop-color:#0A66C2"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="#18181b"/>
  <rect x="0" y="0" width="32" height="2" fill="url(#favGrad)"/>
  <rect x="6" y="9" width="20" height="3" rx="1" fill="#fafafa"/>
  <rect x="13" y="9" width="6" height="16" rx="1" fill="#fafafa"/>
  <circle cx="16" cy="6" r="2" fill="#0A66C2"/>
</svg>`;
}

// OG Image (1200x630) with LinkedIn blue accents and dotted grid
function generateOGImage(): string {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0f12"/>
      <stop offset="50%" style="stop-color:#18181b"/>
      <stop offset="100%" style="stop-color:#1a1a1f"/>
    </linearGradient>
    <linearGradient id="ogLinkedinGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0077B5;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#0077B5;stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="ogBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0077B5"/>
      <stop offset="100%" style="stop-color:#00A0DC"/>
    </linearGradient>
    <pattern id="ogDots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="1" fill="#3f3f46" opacity="0.5"/>
    </pattern>
  </defs>
  
  <rect width="1200" height="630" fill="url(#ogBgGradient)"/>
  <rect width="1200" height="630" fill="url(#ogDots)"/>
  <rect width="1200" height="180" fill="url(#ogLinkedinGlow)"/>
  
  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="3" fill="url(#ogBlueGrad)"/>
  
  <!-- Vertical content lines -->
  <rect x="100" y="0" width="1" height="630" fill="#27272a"/>
  <rect x="1100" y="0" width="1" height="630" fill="#27272a"/>
  
  <!-- Decorative corner accents -->
  <circle cx="100" cy="100" r="4" fill="#0077B5"/>
  <circle cx="1100" cy="100" r="4" fill="#0077B5" opacity="0.5"/>
  
  <g transform="translate(140, 160)">
    <!-- Badge -->
    <rect x="0" y="0" width="200" height="36" rx="2" fill="#27272a" stroke="#0077B5" stroke-width="1"/>
    <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#70B5F9">⚡ Chrome Extension</text>
    
    <!-- Main title -->
    <text x="0" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="#fafafa" letter-spacing="-2">Let's Tag Fast</text>
    
    <!-- Subtitle -->
    <text x="0" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#a1a1aa">Tag multiple LinkedIn users in seconds.</text>
    <text x="0" y="205" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#71717a">Collect, organize, insert with one click.</text>
    
    <!-- CTA hint -->
    <rect x="0" y="250" width="180" height="44" rx="2" fill="#0077B5"/>
    <text x="24" y="279" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff">Add to Chrome</text>
  </g>
  
  <!-- Profile cards stack -->
  <g transform="translate(780, 140)">
    <rect x="40" y="160" width="260" height="70" rx="4" fill="#1f1f23" stroke="#3f3f46" stroke-width="1"/>
    <circle cx="80" cy="195" r="20" fill="#0077B5" opacity="0.15"/>
    <circle cx="80" cy="195" r="14" fill="#0077B5" opacity="0.25"/>
    <rect x="115" y="182" width="140" height="10" rx="2" fill="#3f3f46"/>
    <rect x="115" y="200" width="90" height="8" rx="2" fill="#27272a"/>
    
    <rect x="20" y="80" width="260" height="70" rx="4" fill="#1f1f23" stroke="#3f3f46" stroke-width="1"/>
    <circle cx="60" cy="115" r="20" fill="#0077B5" opacity="0.2"/>
    <circle cx="60" cy="115" r="14" fill="#0077B5" opacity="0.35"/>
    <rect x="95" y="102" width="150" height="10" rx="2" fill="#52525b"/>
    <rect x="95" y="120" width="100" height="8" rx="2" fill="#3f3f46"/>
    
    <rect x="0" y="0" width="260" height="70" rx="4" fill="#1f1f23" stroke="#0077B5" stroke-width="1" opacity="0.8"/>
    <circle cx="40" cy="35" r="20" fill="#0077B5" opacity="0.3"/>
    <circle cx="40" cy="35" r="14" fill="#0077B5" opacity="0.5"/>
    <rect x="75" y="22" width="160" height="10" rx="2" fill="#52525b"/>
    <rect x="75" y="40" width="110" height="8" rx="2" fill="#3f3f46"/>
    <rect x="200" y="25" width="40" height="20" rx="2" fill="#0077B5" opacity="0.3"/>
    <text x="210" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#70B5F9">Tag</text>
  </g>
  
  <!-- Bottom accent -->
  <rect x="0" y="627" width="1200" height="3" fill="url(#ogBlueGrad)" opacity="0.5"/>
  
  <!-- URL -->
  <text x="140" y="580" font-family="ui-monospace, monospace" font-size="14" fill="#52525b">letstag.fast</text>
</svg>`;
}

// Hero image for GitHub repo (1280x640) with LinkedIn blue accents
function generateHeroImage(): string {
  return `<svg width="1280" height="640" viewBox="0 0 1280 640" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0c"/>
      <stop offset="50%" style="stop-color:#18181b"/>
      <stop offset="100%" style="stop-color:#1a1a1f"/>
    </linearGradient>
    <linearGradient id="heroLinkedinGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0077B5;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#0077B5;stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="heroBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0077B5"/>
      <stop offset="50%" style="stop-color:#00A0DC"/>
      <stop offset="100%" style="stop-color:#0077B5"/>
    </linearGradient>
    <pattern id="heroDots" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1" fill="#3f3f46" opacity="0.4"/>
    </pattern>
  </defs>
  
  <rect width="1280" height="640" fill="url(#heroGradient)"/>
  <rect width="1280" height="640" fill="url(#heroDots)"/>
  <rect width="1280" height="250" fill="url(#heroLinkedinGlow)"/>
  
  <!-- Top accent line -->
  <rect x="0" y="0" width="1280" height="3" fill="url(#heroBlueGrad)"/>
  
  <!-- Vertical content delimiters -->
  <rect x="120" y="0" width="1" height="640" fill="#27272a"/>
  <rect x="1160" y="0" width="1" height="640" fill="#27272a"/>
  
  <!-- Decorative nodes -->
  <circle cx="120" cy="120" r="5" fill="#0077B5"/>
  <circle cx="1160" cy="520" r="5" fill="#0077B5" opacity="0.5"/>
  
  <g transform="translate(160, 180)">
    <!-- Badge -->
    <rect x="0" y="0" width="220" height="40" rx="4" fill="#1f1f23" stroke="#0077B5" stroke-width="1"/>
    <circle cx="20" cy="20" r="8" fill="#0077B5"/>
    <text x="40" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#70B5F9">Chrome Extension</text>
    
    <!-- Main title -->
    <text x="0" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="80" font-weight="700" fill="#fafafa" letter-spacing="-3">Let's Tag Fast</text>
    
    <!-- Subtitle -->
    <text x="0" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#a1a1aa">Bulk tag LinkedIn users and organizations</text>
    <text x="0" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#71717a">in your posts with a single click.</text>
    
    <!-- Feature pills -->
    <g transform="translate(0, 280)">
      <rect x="0" y="0" width="120" height="36" rx="4" fill="#0077B5"/>
      <text x="18" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#ffffff">One-Click</text>
      
      <rect x="135" y="0" width="130" height="36" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="155" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#a1a1aa">Organized</text>
      
      <rect x="280" y="0" width="120" height="36" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="300" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#a1a1aa">Bulk Insert</text>
      
      <rect x="415" y="0" width="130" height="36" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="1"/>
      <text x="435" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#a1a1aa">100% Private</text>
    </g>
  </g>
  
  <!-- Profile cards visualization -->
  <g transform="translate(820, 120)">
    <!-- Back card -->
    <rect x="60" y="200" width="280" height="80" rx="6" fill="#1a1a1f" stroke="#27272a" stroke-width="1"/>
    <circle cx="105" cy="240" r="22" fill="#0077B5" opacity="0.1"/>
    <rect x="145" y="225" width="150" height="12" rx="2" fill="#27272a"/>
    <rect x="145" y="245" width="100" height="10" rx="2" fill="#1f1f23"/>
    
    <!-- Middle card -->
    <rect x="30" y="100" width="280" height="80" rx="6" fill="#1f1f23" stroke="#3f3f46" stroke-width="1"/>
    <circle cx="75" cy="140" r="22" fill="#0077B5" opacity="0.2"/>
    <circle cx="75" cy="140" r="14" fill="#0077B5" opacity="0.3"/>
    <rect x="115" y="125" width="160" height="12" rx="2" fill="#3f3f46"/>
    <rect x="115" y="145" width="110" height="10" rx="2" fill="#27272a"/>
    
    <!-- Front card (highlighted) -->
    <rect x="0" y="0" width="280" height="80" rx="6" fill="#1f1f23" stroke="#0077B5" stroke-width="2"/>
    <circle cx="45" cy="40" r="22" fill="#0077B5" opacity="0.3"/>
    <circle cx="45" cy="40" r="14" fill="#0077B5" opacity="0.5"/>
    <rect x="85" y="25" width="150" height="12" rx="2" fill="#52525b"/>
    <rect x="85" y="45" width="100" height="10" rx="2" fill="#3f3f46"/>
    
    <!-- Tag button on front card -->
    <rect x="210" y="25" width="50" height="28" rx="4" fill="#0077B5"/>
    <text x="222" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#ffffff">Tag</text>
  </g>
  
  <!-- Bottom accent -->
  <rect x="0" y="637" width="1280" height="3" fill="url(#heroBlueGrad)" opacity="0.4"/>
  
  <!-- Corner decorations -->
  <rect x="0" y="0" width="50" height="3" fill="#0077B5"/>
  <rect x="0" y="0" width="3" height="50" fill="#0077B5"/>
  <rect x="1230" y="637" width="50" height="3" fill="#0077B5" opacity="0.6"/>
  <rect x="1277" y="590" width="3" height="50" fill="#0077B5" opacity="0.6"/>
</svg>`;
}

// Apple touch icon (180x180) with LinkedIn blue gradient
function generateAppleTouchIcon(): string {
  return `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="appleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#18181b"/>
      <stop offset="100%" style="stop-color:#1f1f23"/>
    </linearGradient>
    <linearGradient id="appleBlue" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0077B5"/>
      <stop offset="100%" style="stop-color:#00A0DC"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" fill="url(#appleBg)"/>
  <rect x="0" y="0" width="180" height="3" fill="url(#appleBlue)"/>
  <g transform="translate(35, 45)">
    <circle cx="55" cy="15" r="12" fill="#0077B5"/>
    <circle cx="55" cy="15" r="7" fill="#18181b"/>
    <rect x="0" y="35" width="110" height="18" rx="2" fill="#fafafa"/>
    <rect x="46" y="35" width="18" height="85" rx="2" fill="#fafafa"/>
  </g>
</svg>`;
}

async function svgToPng(svg: string, outputPath: string, width: number, height: number) {
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(outputPath);
}

async function svgToIco(svg: string, outputPath: string) {
  // Generate ICO as a 32x32 PNG (browsers accept this)
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile(outputPath.replace(".ico", ".png"));
}

async function main() {
  console.log("🎨 Generating brand assets...\n");

  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Favicon
  console.log("📌 Generating favicons...");
  const faviconSvg = generateFaviconSimple();
  const iconSvg = generateFavicon();
  
  writeFileSync(join(PUBLIC_DIR, "favicon.svg"), faviconSvg);
  await svgToPng(faviconSvg, join(PUBLIC_DIR, "favicon.png"), 32, 32);
  writeFileSync(join(PUBLIC_DIR, "icon.svg"), iconSvg);
  await svgToPng(iconSvg, join(PUBLIC_DIR, "icon-192.png"), 192, 192);
  await svgToPng(iconSvg, join(PUBLIC_DIR, "icon-512.png"), 512, 512);
  console.log("   ✓ favicon.svg, favicon.png");
  console.log("   ✓ icon.svg, icon-192.png, icon-512.png");

  // Apple Touch Icon
  console.log("🍎 Generating Apple touch icon...");
  const appleSvg = generateAppleTouchIcon();
  writeFileSync(join(PUBLIC_DIR, "apple-touch-icon.svg"), appleSvg);
  await svgToPng(appleSvg, join(PUBLIC_DIR, "apple-touch-icon.png"), 180, 180);
  console.log("   ✓ apple-touch-icon.svg, apple-touch-icon.png");

  // OG Image
  console.log("🖼️  Generating OG image...");
  const ogSvg = generateOGImage();
  writeFileSync(join(PUBLIC_DIR, "og.svg"), ogSvg);
  await svgToPng(ogSvg, join(PUBLIC_DIR, "og.png"), 1200, 630);
  console.log("   ✓ og.svg, og.png");

  // Hero Image
  console.log("🦸 Generating hero image...");
  const heroSvg = generateHeroImage();
  writeFileSync(join(PUBLIC_DIR, "hero.svg"), heroSvg);
  await svgToPng(heroSvg, join(PUBLIC_DIR, "hero.png"), 1280, 640);
  console.log("   ✓ hero.svg, hero.png");

  console.log("\n✅ All assets generated in /public");
  console.log("\n📋 Generated files:");
  console.log("   • favicon.svg / favicon.png (32x32)");
  console.log("   • icon.svg / icon-192.png / icon-512.png");
  console.log("   • apple-touch-icon.png (180x180)");
  console.log("   • og.png (1200x630) - for social sharing");
  console.log("   • hero.png (1280x640) - for GitHub repo");
}

main().catch(console.error);
