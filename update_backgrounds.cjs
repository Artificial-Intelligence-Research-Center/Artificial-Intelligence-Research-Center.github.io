const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  {
    old: '<section id="about" className="pt-32 pb-16 bg-slate-50/50 overflow-hidden h-auto">\n      <div className="max-w-7xl mx-auto px-6">',
    new: `<section id="about" className="pt-32 pb-16 bg-transparent overflow-hidden h-auto">\n      {/* Background Image - 請將計畫內容背景圖片命名為 bg-about.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-about.webp")} alt="About Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/about-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-7xl mx-auto px-6 relative z-10">`
  },
  {
    old: '<section id="recruitment" className="pt-32 pb-20 bg-blue-50/30 min-h-screen">\n      <div className="max-w-7xl mx-auto px-6">',
    new: `<section id="recruitment" className="pt-32 pb-20 bg-transparent min-h-screen">\n      {/* Background Image - 請將徵聘資訊背景圖片命名為 bg-recruitment.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-recruitment.webp")} alt="Recruitment Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/recruitment-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-7xl mx-auto px-6 relative z-10">`
  },
  {
    old: '<section id="news" className="pt-32 pb-20 bg-slate-50/50 min-h-screen">\n      <div className="max-w-7xl mx-auto px-6">',
    new: `<section id="news" className="pt-32 pb-20 bg-transparent min-h-screen">\n      {/* Background Image - 請將活動訊息背景圖片命名為 bg-news.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-news.webp")} alt="News Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/news-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-7xl mx-auto px-6 relative z-10">`
  },
  {
    old: '<section id="science" className="pt-32 pb-20 bg-white min-h-screen">\n      <div className="max-w-7xl mx-auto px-6">',
    new: `<section id="science" className="pt-32 pb-20 bg-transparent min-h-screen">\n      {/* Background Image - 請將AI新知背景圖片命名為 bg-science.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-science.webp")} alt="Science Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/science-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-7xl mx-auto px-6 relative z-10">`
  },
  {
    old: '<section id="conferences" className="pt-32 pb-20 relative min-h-screen bg-slate-50/30">\n      <div className="max-w-5xl mx-auto px-6 relative z-10">',
    new: `<section id="conferences" className="pt-32 pb-20 relative min-h-screen bg-transparent">\n      {/* Background Image - 請將學術會議背景圖片命名為 bg-conferences.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-conferences.webp")} alt="Conferences Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/conferences-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-5xl mx-auto px-6 relative z-10">`
  },
  {
    old: '<section id="privacy" className="pt-32 pb-20 bg-slate-50/50 min-h-screen">\n      <div className="max-w-3xl mx-auto px-6 text-center">',
    new: `<section id="privacy" className="pt-32 pb-20 bg-transparent min-h-screen">\n      {/* Background Image - 請將隱私權政策背景圖片命名為 bg-privacy.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-privacy.webp")} alt="Privacy Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/privacy-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">`
  },
  {
    old: '<section id="team" className="pt-32 pb-20 bg-white min-h-screen">\n      <div className="max-w-7xl mx-auto px-6">',
    new: `<section id="team" className="pt-32 pb-20 bg-transparent min-h-screen">\n      {/* Background Image - 請將團隊介紹背景圖片命名為 bg-team.webp 並放置於 public/assets/ 資料夾下 */}\n      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">\n        <img src={getImageUrl("/assets/bg-team.webp")} alt="Team Background" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/team-bg/1920/1080"; }} />\n      </div>\n      <div className="max-w-7xl mx-auto px-6 relative z-10">`
  }
];

let success = true;
for (const r of replacements) {
  if (content.includes(r.old)) {
    content = content.replace(r.old, r.new);
  } else {
    console.error("Could not find:", r.old);
    success = false;
  }
}

if (success) {
  fs.writeFileSync(file, content);
  console.log("Replaced successfully!");
} else {
  console.log("Failed to replace some sections");
}