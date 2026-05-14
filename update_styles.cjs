const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const bgClass = "bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50";

// 1. About
content = content.replace(
  /<div className="text-left w-full mb-8">/g,
  `<div className="text-left w-full mb-8 ${bgClass}">`
);

// 2. Recruitment
content = content.replace(
  /<div className="text-center mb-10">/g,
  `<div className="text-center mb-10 ${bgClass} max-w-3xl mx-auto">`
);

// 3. News
content = content.replace(
  /<div className="text-center mb-16">\s*<span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">\{t\.news\.badge\}<\/span>/g,
  `<div className="text-center mb-16 ${bgClass} max-w-3xl mx-auto">\n          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">{t.news.badge}</span>`
);

// 4. Science
content = content.replace(
  /<div className="text-center mb-16">\s*<span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">\{t\.science\.badge\}<\/span>/g,
  `<div className="text-center mb-16 ${bgClass} max-w-3xl mx-auto">\n          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">{t.science.badge}</span>`
);

// 5. Conferences
content = content.replace(
  /<div className="text-center mb-12">\s*<span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">\{t\.conferences\.badge\}<\/span>/g,
  `<div className="text-center mb-12 ${bgClass} max-w-3xl mx-auto">\n          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">{t.conferences.badge}</span>`
);

// 6. Privacy - Needs a bit more surgical replacement
content = content.replace(
  /<div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">[\s\S]*?\{!showFull \? \([\s\S]*?<\/button>\n        \) : \(/,
  `<div className="${bgClass}">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-xl">{t.privacy.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-6">{t.privacy.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t.privacy.desc}
          </p>
          
          {!showFull ? (
            <button 
              onClick={() => setShowFull(true)}
              className="mt-10 text-blue-600 font-bold underline underline-offset-8 hover:text-blue-700 transition-colors"
            >
              {lang === 'zh' ? '閱讀完整政策文件' : 'Read Full Policy Document'}
            </button>
          ) : null}
        </div>
        
        {showFull && (`
);

// We need to fix the closing parenthesis for Privacy's showFull condition
content = content.replace(
  /<\/motion\.div>\n        \)}/g,
  `</motion.div>\n        )}` // this remains same, but wait, the original was `) : ( <motion.div... )}`
);
// Actually the original was:
//         ) : (
//           <motion.div
//             ...
//           </motion.div>
//         )}
// My replacement changes the `) : (` to `) : null}</div>{showFull && (`
// Let's refine Privacy replacement using string splitting to avoid regex hell

// 7. Team
content = content.replace(
  /<div className="text-center mb-16">\s*<span className="text-blue-700 font-bold tracking-widest uppercase text-xl">\{t\.team\.badge\}<\/span>/g,
  `<div className="text-center mb-16 ${bgClass} max-w-3xl mx-auto">\n          <span className="text-blue-700 font-bold tracking-widest uppercase text-xl">{t.team.badge}</span>`
);

// 8. TeamMember component
content = content.replace(
  /<div className="flex flex-col items-center text-center group">/g,
  `<div className="flex flex-col items-center text-center group bg-white/80 p-6 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 h-full">`
);
content = content.replace(
  /<div className="w-32 h-32 rounded-full overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-blue-50 transition-all duration-500 shadow-xl">/g,
  `<div className="w-32 h-32 rounded-full overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-blue-50 transition-all duration-500 shadow-xl bg-white">`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Updated App.tsx");
