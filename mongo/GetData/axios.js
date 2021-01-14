const axios = require('axios')
const requestHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36',
  'Content-Type': 'application/json'
}

const request = axios.create({
  headers: requestHeaders,
  timeout: 4000
})
// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截
request.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    if (error.code === 'ETIMEDOUT' && !error.config._reTry) {
      error.config._reTry = true
      return request(error.config)
    }
    return Promise.reject(error)
  }
)
module.exports = request
