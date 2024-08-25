const SUB_DIR_TO_FILES_MAP = {};

module.exports = {
    addFile: function (subDir, filename) {
        if (!SUB_DIR_TO_FILES_MAP[subDir]) {
            SUB_DIR_TO_FILES_MAP[subDir] = [];
        }

        SUB_DIR_TO_FILES_MAP[subDir].push(filename);
    },
    getSubDirs: function () {
        return SUB_DIR_TO_FILES_MAP;
    },
    getFiles: function (subDir) {
        return SUB_DIR_TO_FILES_MAP[subDir];
    }
};
