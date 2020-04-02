const port = 3333
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  port: port,
  apiUrl: isDev ? `http://localhost:${port}/api` : `https://m3lt.cn/juejin/api`
}
