const { stat } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const dirPath = path.resolve(__dirname, 'secret-folder');

readdir(dirPath, { withFileTypes: true }).then((filenames) => {
  for (let filename of filenames) {
    if (!filename.isDirectory() == true) {
      stat(path.resolve(dirPath, filename.name), (err, stats) => {
        console.log(filename.name.replace('.', ' - ')+' - '+(stats.size / 1024).toFixed(3)+'kb');
      });
    }
  }
});
