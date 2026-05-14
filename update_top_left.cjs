const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targets = [
  { alt: 'About Background', src: '/assets/bg-about.webp' },
  { alt: 'Recruitment Background', src: '/assets/bg-recruitment.webp' },
  { alt: 'News Background', src: '/assets/bg-news.webp' },
  { alt: 'Science Background', src: '/assets/bg-science.webp' },
  { alt: 'Conferences Background', src: '/assets/bg-conferences.webp' },
  { alt: 'Privacy Background', src: '/assets/bg-privacy.webp' },
  { alt: 'Team Background', src: '/assets/bg-team.webp' }
];

let successCount = 0;

targets.forEach(target => {
  const searchBlock = `<div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img \n          src={getImageUrl("${target.src}")} \n          alt="${target.alt}" \n          className="w-full h-full object-cover object-top"`;

  const replaceBlock = `<div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">\n        <img \n          src={getImageUrl("${target.src}")} \n          alt="${target.alt}" \n          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"`;

  if (content.includes(searchBlock)) {
    content = content.replace(searchBlock, replaceBlock);
    successCount++;
  } else {
    // Try relaxing whitespace if exact match fails
    const regex = new RegExp(
      `<div className="fixed top-\\[80px\\] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\\s*<img \\s*src=\\{getImageUrl\\("${target.src}"\\)\\} \\s*alt="${target.alt}" \\s*className="w-full h-full object-cover object-top"`, 'g'
    );
    if(regex.test(content)) {
        content = content.replace(regex, `<div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">\n        <img \n          src={getImageUrl("${target.src}")} \n          alt="${target.alt}" \n          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"`);
        successCount++;
    } else {
        console.log('Failed to match:', target.alt);
    }
  }
});

fs.writeFileSync('src/App.tsx', content);
console.log(`Replaced ${successCount} occurrences.`);
