const fs = require('fs');
const path = require('path');
const fullFileName = path.resolve(__dirname, 'text.txt');
const readableStream = fs.createReadStream(fullFileName, 'utf-8');
readableStream.on('data', chunk => console.log(chunk));