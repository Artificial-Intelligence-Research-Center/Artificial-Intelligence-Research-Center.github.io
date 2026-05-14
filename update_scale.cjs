const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targets = [
  'About Background',
  'Recruitment Background',
  'News Background',
  'Science Background',
  'Conferences Background',
  'Privacy Background',
  'Team Background'
];

let successCount = 0;
targets.forEach(alt => {
  const searchStr = `alt="${alt}" \n          className="w-full h-full object-contain object-top"`;
  const replaceStr = `alt="${alt}" \n          className="w-full h-full object-cover object-top"`;
  
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    successCount++;
  } else {
    // Try with different spacing
    const regex = new RegExp(`alt="${alt}"\\s*className="w-full h-full object-contain object-top"`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `alt="${alt}" \n          className="w-full h-full object-cover object-top"`);
      successCount++;
    } else {
      console.log(`Could not find target for ${alt}`);
    }
  }
});

fs.writeFileSync('src/App.tsx', content);
console.log(`Replaced ${successCount} occurrences.`);