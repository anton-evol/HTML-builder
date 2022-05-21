const fs = require('fs');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const path = require('path');
const dirPathSource = path.resolve(__dirname, 'files');
const dirPathDestination = path.resolve(__dirname, 'files-copy');

fs.promises.rm(dirPathDestination, { recursive: true, force: true }).then(function () {
  fs.promises.mkdir(dirPathDestination, { recursive: true }).then(function () {
    readdir(dirPathSource).then((filenames) => {
      for (let filename of filenames) {        
        let sourceFullName = path.resolve(dirPathSource, filename);
        let destinationFullName = path.resolve(dirPathDestination, filename);
        copyFile(sourceFullName, destinationFullName);
      }
    });
  });
  console.log('Копирование/сихронизация успешно завершены!');
});
