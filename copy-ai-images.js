const fs = require('fs');
const path = require('path');

const srcBase = path.join(__dirname, 'Images/Acadian House- 124 West Residences-AI_Images');
const destBase = path.join(__dirname, 'public/assets/acadian/ai');

if (!fs.existsSync(destBase)) {
  fs.mkdirSync(destBase, { recursive: true });
}

const folders = [
  { name: 'Unit 103, Unit 303', prefix: 'studio', label: 'Studio' },
  { name: 'Unit 106, Unit 201, Unit 207, Unit 304, Unit 306', prefix: '1bed', label: '1 Bedroom' },
  { name: 'Unit 202, Unit 205', prefix: '2bed', label: '2 Bedroom' }
];

let counter = 1;
const results = [];

for (const folder of folders) {
  const folderPath = path.join(srcBase, folder.name);
  if (!fs.existsSync(folderPath)) continue;

  const subdirs = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isDirectory());

  for (const subdir of subdirs) { // "AI Furnished" or "AI Unfurnished"
    const subDirPath = path.join(folderPath, subdir);
    const files = fs.readdirSync(subDirPath).filter(f => f.endsWith('.png'));

    for (const file of files) {
      const srcFile = path.join(subDirPath, file);
      const destName = `${counter.toString().padStart(2, '0')}_${folder.prefix}_${subdir.toLowerCase().replace(/\s+/g, '_')}_${file.toLowerCase().replace(/\s+/g, '_')}`;
      const destFile = path.join(destBase, destName);
      
      fs.copyFileSync(srcFile, destFile);
      
      results.push({
        file: `/assets/acadian/ai/${destName}`,
        label: folder.label
      });
      counter++;
    }
  }
}

console.log(JSON.stringify(results, null, 2));
