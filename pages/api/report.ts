import { NextApiRequest, NextApiResponse } from "next";
import { exportUrlToPdf } from "../../utils/puppeteer-util";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body ?? {}
  const { url } = body
  console.log(req.cookies)
  const cookieObj = req.cookies || {}
  const cookieList = Object.keys(cookieObj).map(key => {
    return {
      // url,
      name: key,
      value: cookieObj[key],
      expires: -1,
      domain: '.the.right.domain',
      path: '/'
    }
  })
  console.log('cookieList:', cookieList)
  try {
    console.log('get url:', url)
    await exportUrlToPdf(url, cookieList)
    res.send({
      code: 200
    })
  } catch (e) {
    res.send({
      code: 500
    })
  }
}
