// Make public/artifact.html: the built page without its <html>/<head>/<body> wrapper, for publishing as a claude.ai artifact
// (the artifact host adds that wrapper itself). Run after `npm run build`.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const head = (src.match(/<head>([\s\S]*?)<\/head>/) || [])[1] || '';
const body = (src.match(/<body>([\s\S]*?)<\/body>/) || [])[1] || '';
const keep = head.split('\n').filter(l => /<title>|claude:viewport|<link|<script/.test(l)).join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'public', 'artifact.html'), `${keep}\n${body.trim()}\n`);
console.log('public/artifact.html written');
