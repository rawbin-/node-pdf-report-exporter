import Protocol from "devtools-protocol";
import CookieParam = Protocol.Network.CookieParam;

const puppeteer = require('puppeteer')
export const exportUrlToPdf = async (url: string, cookieList: CookieParam[]) => {
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
        console.log(111)
        const cookies = await page.setCookie(...cookieList) // 注意这里需要展开
        console.log(cookies)
        console.log(222)
        await page.goto(url || 'http://www.baidu.com', {
            waitUntil: 'networkidle0'
        }) // 没传就用百度首页
        await page.waitForFunction(() => {
            return true
            // @ts-ignore
            return window["reportPreviewFinished"]
        })
        await page.pdf({
            path: 'report.pdf',
            printBackground: true, // 因为水印的缘故，没有这个就全是空白
            format: 'a4'
        })
        console.log('pdf exported')
        await page.close()
    } catch (e) {
        console.error(e)
    }
}
