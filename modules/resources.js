"use strict";
const Promise = require('bluebird');
const fs = require('fs');

const Resources = function () { };
const UTF_ENCODING = 'utf8';
const urlFileName = './resources/urls.json';

function loadResources() {
    return new Promise(function (resolve, reject) {
        fs.readFile(urlFileName, UTF_ENCODING, function (err, data) {
            if (err) {
                reject(err);
            } else {
                Resources.prototype.urlResources = JSON.parse(data);
                resolve(Resources.prototype.urlResources);
            }
        });
    });
}
Resources.prototype.urlResources = {};
Resources.prototype.init = loadResources;
module.exports = new Resources();