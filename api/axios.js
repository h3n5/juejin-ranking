import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3333/api',
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
    return Promise.resolve(error)
  }
)

export default instance
