"use strict";
const R = require('ramda');
const bhRatesScraper = require('./scrapers/bhRatesScraper.js');

let scrapersMgr = function () { };

const PROPS = {
    ACTIVE: 'active',
    RATES_URL : 'ratesUrl',
    BH: 'bh'
}
const ACTIVE = 'ratesUrl';
const RATES_PROP_NAME = 'ratesUrl';
const BH_PROP_NAME = 'bh';

//  getBhRatesUrl :: Object -> String
let getBhRatesUrl = R.compose(R.prop(PROPS.RATES_URL), R.prop(PROPS.BH));
//  getBhRatesUrl :: Object -> String
let getBhRatesActive = R.compose(R.prop(PROPS.ACTIVE), R.prop(PROPS.BH));

async function run(urlResources) {
    let result = undefined;
    let url = getBhRatesUrl(urlResources);
    let active = getBhRatesActive(urlResources);
    if (url && active) {
        result = await bhRatesScraper.run(url);
    }
    return result;
};

scrapersMgr.prototype.run = run;
module.exports = new scrapersMgr();