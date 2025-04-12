/**
 * Console Whisperer - Icon Conversion Script
 * 
 * This script converts the SVG icon to PNG files of different sizes.
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define the sizes
const sizes = [16, 48, 128];

// Define the paths
const svgPath = path.join(__dirname, '..', 'extension', 'assets', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, '..', 'extension', 'assets', 'icons');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert the SVG to PNG files
async function convertIcons() {
  try {
    console.log('Converting SVG to PNG files...');
    
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert to each size
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Created ${outputPath}`);
    }
    
    console.log('Conversion complete!');
  } catch (error) {
    console.error('Error converting icons:', error);
    process.exit(1);
  }
}

// Run the conversion
convertIcons();
