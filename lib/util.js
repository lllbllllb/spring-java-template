const fs = require('fs');
const path = require('path');

function getDefaultJavaPackage(asyncapi, params) {
    const info = asyncapi.info();
    let javaPackage = getBaseJavaPackage(params);
    const extensions = info.extensions();

    if (!javaPackage && info && extensions) {
        javaPackage = extensions['x-java-package'];
    }

    return javaPackage;
}

function getDefaultJavaPackageDir(generator, defaultJavaPackage) {
    let defaultPackageDir;

    if (defaultJavaPackage) {
        const packageDir = packageToPath(defaultJavaPackage);
        defaultPackageDir = `${generator.targetDir}/${packageDir}`;
    }

    return defaultPackageDir;
}

function getBaseJavaPackage(params) {
    return params['javaPackage'] || '';
}

function moveFile(oldDirectory, newDirectory, fileName) {
    if (!fs.existsSync(newDirectory)) {
        fs.mkdirSync(newDirectory, { recursive: true });
    }

    const oldPath = path.resolve(oldDirectory, fileName);
    const newPath = path.resolve(newDirectory, fileName);
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
}

function packageToPath(javaPackage) {
    return javaPackage.replace(/\./g, '/');
}

function getFilePackage(baseJavPackage, ...ext) {
    const pckg = [
        baseJavPackage,
        ...ext
    ]
        .join('.');

    return `package ${pckg};`
}

module.exports = { getDefaultJavaPackageDir, getDefaultJavaPackage, getFilePackage};
