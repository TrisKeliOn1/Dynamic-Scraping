const pup = require('puppeteer');

const url ="https://www.mercadolivre.com.br/";
const searchFor = "macbook";

(async () => {
    const browser = await pup.launch();
    const page = await browser.newPage();

    await page.goto(url);

    await browser.close();
})();