const pup = require('puppeteer');

const url ="https://www.mercadolivre.com.br/";
const searchFor = "macbook";

let c = 1;
const list = [];

(async () => {
    const browser = await pup.launch({headless: false}); // trocar para true tudo roda por baixo dos panos
    const page = await browser.newPage();
    console.log('iniciei!');

    await page.goto(url);
    console.log('Fui para a URL');

    await page.waitForSelector('#cb1-edit')

    await page.type('#cb1-edit', searchFor);

    await Promise.all([
        page.waitForNavigation(),
        await page.click('.nav-search-btn')
    ])

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href));

    for(const link of links) {
        if(c === 10) continue;
        console.log('Página', c);
        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title')

        const title = await page.$eval('.ui-pdp-title', element => element.innerHTML);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerHTML);

        const seller = await page.evaluate(()=> {
           const el = document.querySelector('.ui-pdp-seller__link-trigger')
           if(!el) return null
           return el.innerText;
        });

        const obj = {};
        obj.title = title;
        obj.price = price;
        (seller ? obj.seller = seller : '');
        obj.link = link;
        
        list.push(obj);
        
        c++;
    }

    console.log(list);

    await page.waitForTimeout(3000);
    await browser.close();
})();