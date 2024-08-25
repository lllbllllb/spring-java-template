const fs = require('fs');
const path = require('path');
const {getDefaultJavaPackage, getDefaultJavaPackageDir} = require('../lib/util.js');
const {getSubDirs} = require('../lib/state.js');

module.exports = {
    'generate:after': generator => {
        const asyncapi = generator.asyncapi
        const params = generator.templateParams;
        const targetDir = generator.targetDir;
        const sourcePath = targetDir;
        const defaultJavaPackage = getDefaultJavaPackage(asyncapi, params);
        const defaultJavaPackageDir = getDefaultJavaPackageDir(generator, defaultJavaPackage);

        moveComponents(sourcePath, defaultJavaPackageDir);
    }
};

function moveComponents(sourcePath, defaultJavaPackageDir) {

    Object.entries(getSubDirs()).forEach(([subDir, files]) => {
        files.forEach(file => {
            moveFile(sourcePath, `${defaultJavaPackageDir}/${subDir}`, file)
        })
    })
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
