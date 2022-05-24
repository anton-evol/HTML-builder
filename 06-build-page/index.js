const fs = require('fs');
const { rm } = require('fs/promises');
const { readFile } = require('fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const path = require('path');
const dirProjectDist = path.resolve(__dirname, 'project-dist');

function main() {
  //0.remove folder project-dist
  // fs.promises.rmdir(dirProjectDist, { recursive: true, force: true }).then(() => {
  //1.make folder project-dist
  fs.promises.mkdir(dirProjectDist, { recursive: true }).then(() => {
    //2.make template parser and replacer for index html and components
    // const htmlSourceTemplate = path.resolve(__dirname, 'template.html');
    // const htmlSourceComponetsPath = path.resolve(__dirname, 'components');
    // const htmlOutputFile = path.resolve(__dirname, 'project-dist', 'index.html');

    // fs.copyFile(htmlSourceTemplate, htmlOutputFile, () => {
    // fs.readFile(htmlOutputFile, 'utf8', function (error, data) {
    //   if (error) throw error;
    //   fs.readdir(htmlSourceComponetsPath, { withFileTypes: true }, function (error, files) {
    //     if (error) throw error;
    //     files.forEach(function (file) {
    //       fs.readFile(path.resolve(htmlSourceComponetsPath, file.name), 'utf8', function (error, dataFile) {
    //         if (error) throw error;
    //         let component = `{{${file.name.split('.')[0]}}}`;
    //         data = data.replace(component, dataFile);
    //         fs.writeFile(htmlOutputFile, data, function (error) {
    //           if (error) throw error;
    //         });
    //       });
    //     });
    //   });
    // });
    // });

    //
    //
    //
    //3.make styles bundle and put to project-dist/style.css
    const dirProjectSourceStyles = path.resolve(__dirname, 'styles');
    const cssBundleFullPath = path.resolve(__dirname, 'project-dist', 'style.css');
    readdir(dirProjectSourceStyles, { withFileTypes: true }).then((filenames) => {
      for (let filename of filenames) {
        if (path.extname(filename.name) === '.css') {
          let cssFileName = path.resolve(__dirname, 'styles', filename.name);
          const readableStream = fs.createReadStream(cssFileName, 'utf-8');
          readableStream.on('data', (chunk) => {
            fs.appendFile(cssBundleFullPath, chunk, () => {});
          });
        }
      }
    });

    //4.copy folder assets to folder project-dist
    const dirProjectDistAssets = path.resolve(__dirname, 'project-dist', 'assets');
    fs.promises.mkdir(dirProjectDistAssets, { recursive: true }).then(() => {
      //create sub folder fonts and copy files
      const dirProjectSourceAssetsFonts = path.resolve(__dirname, 'assets', 'fonts');
      const dirProjectDistAssetsFonts = path.resolve(__dirname, 'project-dist', 'assets', 'fonts');
      fs.promises.mkdir(dirProjectDistAssetsFonts, { recursive: true }).then(function () {
        readdir(dirProjectSourceAssetsFonts).then((filenames) => {
          for (let filename of filenames) {
            let sourceFullName = path.resolve(dirProjectSourceAssetsFonts, filename);
            let destinationFullName = path.resolve(dirProjectDistAssetsFonts, filename);
            copyFile(sourceFullName, destinationFullName);
          }
        });
      });
      //create sub folder img and copy files
      const dirProjectSourceAssetsImg = path.resolve(__dirname, 'assets', 'img');
      const dirProjectDistAssetsImg = path.resolve(__dirname, 'project-dist', 'assets', 'img');
      fs.promises.mkdir(dirProjectDistAssetsImg, { recursive: true }).then(() => {
        readdir(dirProjectSourceAssetsImg).then((filenames) => {
          for (let filename of filenames) {
            let sourceFullName = path.resolve(dirProjectSourceAssetsImg, filename);
            let destinationFullName = path.resolve(dirProjectDistAssetsImg, filename);
            copyFile(sourceFullName, destinationFullName);
          }
        });
      });
      //create sub folder svg and copy files
      const dirProjectSourceAssetsSvg = path.resolve(__dirname, 'assets', 'svg');
      const dirProjectDistAssetsSvg = path.resolve(__dirname, 'project-dist', 'assets', 'svg');
      fs.promises.mkdir(dirProjectDistAssetsSvg, { recursive: true }).then(() => {
        readdir(dirProjectSourceAssetsSvg).then((filenames) => {
          for (let filename of filenames) {
            let sourceFullName = path.resolve(dirProjectSourceAssetsSvg, filename);
            let destinationFullName = path.resolve(dirProjectDistAssetsSvg, filename);
            copyFile(sourceFullName, destinationFullName);
          }
        });
      });
    });
  });
  // });
}

//2.make template parser and replacer for index html and components
const htmlSourceTemplate = path.resolve(__dirname, 'template.html');
const htmlSourceComponetsPath = path.resolve(__dirname, 'components');
const htmlOutputFile = path.resolve(__dirname, 'project-dist', 'index.html');

(async function () {
  try {
    await rm(dirProjectDist, { recursive: true, force: true });
    main();
    await makeHtmlIndexFile();
  } catch (error) {
    if (error) throw error;
  }
})();

const getComponentsObject = async () => {
  const components = {};
  const files = await readdir(htmlSourceComponetsPath, { withFileTypes: true });
  for (const file of files) {
    const component = path.resolve(htmlSourceComponetsPath, file.name);
    if (file.isFile() && path.extname(component) === '.html') {
      const data = await readFile(component);
      components[file.name] = data.toString();
    }
  }
  return components;
};

async function makeHtmlIndexFile() {
  const writeStream = fs.createWriteStream(htmlOutputFile);
  const components = await getComponentsObject();
  fs.readFile(htmlSourceTemplate, 'utf-8', (error, data) => {
    if (error) throw error;
    for (const component of Object.keys(components)) {
      data = data.replace(`{{${component.split('.')[0]}}}`, components[component]);
    }
    writeStream.write(data);
  });
}
