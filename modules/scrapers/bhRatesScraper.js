"use strict";
let BhExchangeRates = function () { };

const R = require('ramda');
const fsH = require('../fsHandler.js');
const pageScraper = require('./pageScraper.js');
const cheerio = require('cheerio');

const WRITE_LOCAL_SCRAP_HISTORY = true;

const GBP_IDENTIFIER = 'שטרלינג';
const DATA_PROP_NAME = "data";
const CHILDNODES_PROP_NAME = 'childNodes';

const EXCHANGE_RATE_TD_INDEX = 1;
const BUY_CHECKS_RATE_TD_INDEX = 2;
const BUY_SELL_CHEQUES_RATE_TD_INDEX = 3;
const CASH_BUY_RATE_TD_INDEX = 4;
const CASH_SELL_RATE_TD_INDEX = 5;
const OVERALL_CHANGE_RATE_TD_INDEX = 6;

function getRatesTr(trArray, identifier) {
    let filterByTag = R.filter(function (tr) {
        return tr && tr.firstChild && R.propEq('type', 'tag', tr);
    });

    function getIdentifierDOMImg(tr) {
        let result = undefined;
        if (tr && tr.firstChild && tr.firstChild.firstChild
            && tr.firstChild.firstChild.attribs) {
            result = tr.firstChild.firstChild.attribs.alt;
        }
        return result;
    }

    let filterByAlt = R.filter(function (tr) {
        let success = false;
        let attr = getIdentifierDOMImg(tr);
        if (attr) {
            success = attr.indexOf(identifier) != -1;
        }
        return success;
    });
    let composed = R.compose(filterByAlt, filterByTag);
    let filtered = composed(trArray);

    return R.head(filtered);
}

function getRatesDOMTableTrs(htmlContent) {
    let $ = cheerio.load(htmlContent);
    let arr = $('.even_line', '#tableSPAN').toArray();
    return arr;
}

function parseHtmlContent(htmlContent, identifier) {
    let result = undefined;
    const ratesTrArray = getRatesDOMTableTrs(htmlContent);
    const node = getRatesTr(ratesTrArray, identifier);
    if (node) {
        let tdDOMList = node.childNodes;
        // getHeadData :: [] -> String
        const getHeadData = R.compose(R.prop(DATA_PROP_NAME), R.head, R.prop(CHILDNODES_PROP_NAME));
        // getHeadDataFromTail :: [] -> String
        const getHeadDataFromTail = R.compose(R.prop(DATA_PROP_NAME), R.head, R.tail, R.prop(CHILDNODES_PROP_NAME));

        // extractRateByIndex :: ([] -> String) -> Integer -> String
        const extractRateByIndex = (func, index) => (R.compose(func, R.nth(index)))(tdDOMList);

        result = {
            exchangeRate: extractRateByIndex(getHeadData, EXCHANGE_RATE_TD_INDEX),
            buyChecks: extractRateByIndex(getHeadData, BUY_CHECKS_RATE_TD_INDEX),
            buyAndSellChecks: extractRateByIndex(getHeadData, BUY_SELL_CHEQUES_RATE_TD_INDEX),
            cashBuy: extractRateByIndex(getHeadData, CASH_BUY_RATE_TD_INDEX),
            cashSell: extractRateByIndex(getHeadData, CASH_SELL_RATE_TD_INDEX),
            change: extractRateByIndex(getHeadDataFromTail, OVERALL_CHANGE_RATE_TD_INDEX)
        };
    }
    return result;
}

function scrapGbpRates (htmlContent){
    return parseHtmlContent(htmlContent, GBP_IDENTIFIER);
}

async function writeHistory(content) {
    const exist = await fsH.ensureFolderExist(fsH.fNames.HISTORY_DIR);
    if (exist) {
        let timeStamp = (new Date).getTime();
        let fName = fsH.composeFileName(fsH.fNames.HISTORY_DIR, timeStamp, fsH.ext.html);
        await fsH.writeToFile(fName, content);
    }
}

async function run(url) {
    let result = undefined;
    try {
        const pageContent = await pageScraper.getPageContent(url);
        if (WRITE_LOCAL_SCRAP_HISTORY) {
            await writeHistory(pageContent);
        }
        result = scrapGbpRates(pageContent);
    } catch (e) {
        console.log(e);
    }
    return result;
}

BhExchangeRates.prototype.run = run;
module.exports = new BhExchangeRates();

