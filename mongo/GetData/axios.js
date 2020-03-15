const axios = require('axios')
const requestHeaders = {
  'X-Juejin-Src': 'web',
  'X-Juejin-Token':
    'eyJhY2Nlc3NfdG9rZW4iOiJ3NlpSMDJTb1VxRFo0RThiIiwicmVmcmVzaF90b2tlbiI6IkdZTWxTc2lQTkVtSzFvNmIiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ=='
}
const request = axios.create({
  headers: requestHeaders
})

request.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
module.exports = request
