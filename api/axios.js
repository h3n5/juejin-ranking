import axios from 'axios'

const instance = axios.create({
  baseURL: require('../_target').apiUrl,
  headers: {}
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.resolve(error)
  }
)
instance.interceptors.response.use(
  (res) => {
    const { data } = res
    return data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
