const fs = require('fs');
const path = require('path');
const { getDefaultJavaPackage, getDefaultJavaPackageDir } = require('../lib/util.js');

module.exports = {
    'generate:after': generator => {
        const asyncapi = generator.asyncapi
        const params = generator.templateParams;
        const targetDir = generator.targetDir;
        const sourcePath = targetDir;
        const defaultJavaPackage = getDefaultJavaPackage(asyncapi, params);
        const defaultJavaPackageDir = getDefaultJavaPackageDir(generator, defaultJavaPackage);

        // move models from Modelina
        moveAllFiles(sourcePath, defaultJavaPackageDir);

    }
};

function moveAllFiles(oldDirectory, newDirectory) {
    fs.readdir(oldDirectory, (err, files) => {
        files.forEach(file => {
            moveFile(oldDirectory, newDirectory, file);
        });
    });
}

function moveFile(oldDirectory, newDirectory, fileName) {
    if (!fs.existsSync(newDirectory)) {
        fs.mkdirSync(newDirectory, {recursive: true});
    }

    const oldPath = path.resolve(oldDirectory, fileName);
    const newPath = path.resolve(newDirectory, fileName);
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
    // fs.renameSync(oldPath, newPath);
}
