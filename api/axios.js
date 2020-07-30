import axios from 'axios'
import { apiUrl } from '../_target'
const instance = axios.create({
  baseURL: apiUrl,
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
