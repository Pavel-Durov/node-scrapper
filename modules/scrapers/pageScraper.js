"use strict";
const phantom = require('phantom');
const fsH = require('../fsHandler.js');

const LOG_RESOURCE_REQUESTS = false;
const USE_MOCKED_DATA = false;

let PageScraper = function () { };

async function getPageContent (url) {
    let htmlContent = undefined;
    try {
        if (USE_MOCKED_DATA) {
            htmlContent = await fsH.getFileTextContent('./history/1506965036078.html');
        } else {
            const instance = await phantom.create();
            const page = await instance.createPage();
            if (LOG_RESOURCE_REQUESTS) {
                await page.on('onResourceRequested', function (requestData) {
                    console.info('Requesting', requestData.url);
                });
            }
            const status = await page.open(url);
            htmlContent = await page.property('content');
        }
    } catch (e) {
        console.log(e);
    }
    return htmlContent;
};

PageScraper.prototype.getPageContent = getPageContent;
module.exports = new PageScraper();