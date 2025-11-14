// Simple test file for AI Agency Game

console.log('Running AI Agency Game Tests...\n');

// Test 1: Game initialization
console.log('Test 1: Game Initialization');
try {
  const AIAgencyGame = require('./index.js');
  console.log('✓ Game module loads successfully\n');
} catch (error) {
  console.log('✗ Failed to load game module');
  console.error(error);
  process.exit(1);
}

// Test 2: Check if Node.js readline module is available
console.log('Test 2: Required Modules');
try {
  const readline = require('readline');
  console.log('✓ readline module available\n');
} catch (error) {
  console.log('✗ readline module not available');
  console.error(error);
  process.exit(1);
}

// Test 3: File structure
const fs = require('fs');
const path = require('path');

console.log('Test 3: File Structure');
const requiredFiles = ['package.json', 'index.js', 'README.md'];
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} missing`);
    allFilesExist = false;
  }
});

console.log('');

if (allFilesExist) {
  console.log('All tests passed! ✓');
  process.exit(0);
} else {
  console.log('Some tests failed! ✗');
  process.exit(1);
}
