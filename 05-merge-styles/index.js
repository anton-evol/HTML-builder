const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const dirPathSource = path.resolve(__dirname, 'styles');
const cssBundleFullPath = path.resolve(__dirname, 'project-dist', 'bundle.css');

fs.unlink(cssBundleFullPath, () => {});

readdir(dirPathSource, { withFileTypes: true }).then((filenames) => {
  for (let filename of filenames) {
    if (path.extname(filename.name) === '.css') {
      let cssFileName = path.resolve(__dirname, 'styles', filename.name);
      const readableStream = fs.createReadStream(cssFileName, 'utf-8');
      readableStream.on('data', (chunk) => {
        fs.appendFile(cssBundleFullPath, chunk, () => {});
      });
    }
  }
  console.log('Бандл стилей успешно создан/обновлён!');
});
