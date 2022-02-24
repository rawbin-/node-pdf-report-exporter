const fs = require('fs')
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


(async function helloSelenium() {
    const opts = new chrome.Options()
    opts.headless()

    const cookieObj = {
        xxxtoken: "1111xxxx"
    }
    const cookieList = Object.keys(cookieObj).map(key => {
        return {
            name: key,
            value: cookieObj[key],
            expires: -1,
            domain: '.baidu.com',
            path: '/'
        }
    });

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

    await driver.get('http://www.baidu.com');

    for (let i = 0, len = cookieList.length; i < len; i++) {
        await driver.manage().addCookie(cookieList[i])
    }

    const result = await driver.printPage()
    // 拿到的结果是 base64的String
    fs.writeFileSync('selenium-out.pdf', Buffer.from(result, 'base64'))

    await driver.quit();
})();