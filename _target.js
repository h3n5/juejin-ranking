const port = 3333
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  base: isDev ? '/' : '/juejin/',
  port: port,
  apiUrl: isDev ? `https://m3lt.cn/juejin/api` : `https://m3lt.cn/juejin/api`
}
