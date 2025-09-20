const fs = require('fs');

// カレントディレクトリ内の .html ファイルを取得（index.html 除外）
const files = fs.readdirSync('./').filter(file => file.endsWith('.html') && file !== 'index.html');

let html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>アプリ一覧</title></head>
<body><h1>アプリ一覧</h1><ul>
`;

for (const file of files) {
  html += `<li><a href="${file}">${file}</a></li>\n`;
}

html += `</ul></body></html>`;

fs.writeFileSync('index.html', html);
console.log('✅ index.html を再生成しました！');