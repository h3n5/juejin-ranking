const port = 3333
const isDev = process.env.NODE_ENV === 'development'
exports = module.exports = {
  base: isDev ? '/' : '/juejin/',
  port: port,
  apiUrl: isDev ? `http://localhost:3333/api` : `https://m3lt.cn/juejin/api`
}
