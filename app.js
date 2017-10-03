
let resources = require('./modules/resources.js');
let scrapersMgr = require('./modules/scrapersMgr.js');

async function main() {
    let urls = await resources.init();
    if (urls) {
        let data = await scrapersMgr.run(urls);
        console.log(data);
    }
}

main();