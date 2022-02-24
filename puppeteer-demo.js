const puppeteer = require("puppeteer");
(async () => {
    try {
        console.log('starting export pdf')
        const browser = await puppeteer.launch({
            // headless: false,
            args: [
                '--disable-gpu', // GPU硬件加速
                '--disable-dev-shm-usage', // 创建临时文件共享内存
                '--disable-setuid-sandbox', // uid沙盒
                '--no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
                '--no-sandbox', // 沙盒模式
                '--no-zygote',
                '--single-process' // 单进程运行
            ]
        })
        const page = await browser.newPage()
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
        const cookies = await page.setCookie(...cookieList) // 注意这里需要展开
        await page.goto('http://www.baidu.com', {
            waitUntil: 'networkidle0'
        }) // 没传就用百度首页
        await page.waitForFunction(() => {
            return true
            // @ts-ignore
            return window["reportPreviewFinished"]
        })
        await page.pdf({
            path: 'puppeteer-out.pdf',
            printBackground: true, // 因为水印的缘故，没有这个就全是空白
            format: 'a4'
        })
        console.log('pdf exported')
        await page.close()
        await browser.close()
    } catch (e) {
        console.error(e)
    }
})()