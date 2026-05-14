const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const replacements = {
    // Recruitment
    "'2026/04/28'": "'2026/05/10'",
    "\"2026/01/20\"": "\"2026/05/10\"",
    "'2025/02/03'": "'2026/04/15'",
    "\"2025/02/03\"": "\"2026/04/15\"",
    "'2025/06/01'": "'2026/05/01'",
    "\"2025/06/01\"": "\"2026/05/01\"",
    
    // News
    "'2026/05/25'": "'2026/05/28'",
    "\"2026/05/25\"": "\"2026/05/28\"",
    "'2026/05/05'": "'2026/05/12'",
    "\"2026/05/05\"": "\"2026/05/12\"",
    "'2026/05/12'": "'2026/05/18'",
    "\"2026/05/12\"": "\"2026/05/18\"",
    "'2026/05/15'": "'2026/05/20'",
    "\"2026/05/15\"": "\"2026/05/20\"",
    
    // Science
    "'2025/05/15'": "'2026/05/08'",
    "\"2025/01/10\"": "\"2026/05/08\"",
    "'2024/09/12'": "'2026/04/22'",
    "\"2024/09/12\"": "\"2026/04/22\"",
    "'2024/03/15'": "'2026/03/15'",
    "\"2024/03/15\"": "\"2026/03/15\"",
    "'2024/01/19'": "'2026/02/10'",
    "\"2024/01/19\"": "\"2026/02/10\"",
    "'2023/08/04'": "'2026/01/05'",
    "\"2023/08/04\"": "\"2026/01/05\"",
    
    // Conferences
    "'2025/12/9-2025/12/12'": "'2026/06/09-2026/06/12'",
    "\"2025/12/9-2025/12/12\"": "\"2026/06/09-2026/06/12\"",
    "'2025 ACML'": "'2026 ACML'",
    "\"2025 ACML\"": "\"2026 ACML\"",
    "ACML 2025)": "ACML 2026)",
    "第 17 屆亞洲機器學習會議 (ACML 2025)": "第 18 屆亞洲機器學習會議 (ACML 2026)",
    "17th Asian Conference on Machine Learning (ACML 2025)": "18th Asian Conference on Machine Learning (ACML 2026)",
    "17th Asian Conference on Machine Learning": "18th Asian Conference on Machine Learning",
    "'待定'": "'2026/06/20'",
    "\"2026/12/11\"": "\"2026/06/20\"",
    
    // Footer update times
    "2026-04-27": "2026-05-14",
    "2026-04-10": "2026-05-14",
  };

  let updatedContent = content;
  for (const [oldStr, newStr] of Object.entries(replacements)) {
    updatedContent = updatedContent.split(oldStr).join(newStr);
  }

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated dates in ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

updateFile('src/App.tsx');
updateFile('src/en.json');
