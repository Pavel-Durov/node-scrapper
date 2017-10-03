"use strict";
let Promise = require('bluebird');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

var GsHandler = function () { };

const FILENAMES = {
    HISTORY_DIR: 'history'
};

const FILE_EXT = {
    html: 'html'
};

function ensureFolderExist(dir) {
    return new Promise(function (resolve, reject) {
        mkdirp(dir, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

function getFileTextContent(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function composeFileName(dir, timeStamp, extention) {
    return `${dir}/${timeStamp}.${extention}`;
}

function writeToFile(fileName, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fileName, content, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    });
}

GsHandler.prototype.fNames = FILENAMES;
GsHandler.prototype.ext = FILE_EXT;
GsHandler.prototype.composeFileName = composeFileName;
GsHandler.prototype.ensureFolderExist = ensureFolderExist;
GsHandler.prototype.writeToFile = writeToFile;
GsHandler.prototype.getFileTextContent = getFileTextContent;

module.exports = new GsHandler();