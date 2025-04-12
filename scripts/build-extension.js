/**
 * Console Whisperer - Build Extension Script
 * 
 * This script builds and packages the extension for distribution.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

// Configuration
const extensionDir = path.join(__dirname, '..', 'extension');
const distDir = path.join(__dirname, '..', 'dist');
const manifestPath = path.join(extensionDir, 'manifest.json');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Read the manifest to get the version
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;

// Create a zip file
const output = fs.createWriteStream(path.join(distDir, `console-whisperer-v${version}.zip`));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for all archive data to be written
output.on('close', () => {
  console.log(`Extension packaged successfully: ${archive.pointer()} total bytes`);
  console.log(`File: ${path.join(distDir, `console-whisperer-v${version}.zip`)}`);
});

// Handle errors
archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to the archive
archive.directory(extensionDir, false);

// Finalize the archive
archive.finalize();

console.log(`Building extension version ${version}...`);
