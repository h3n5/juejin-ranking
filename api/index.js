import axios from './axios'
export const getTag = (params) => {
  return axios.request({
    url: '/getTag',
    method: 'get',
    params
  })
}
export const getArticle = (params) => {
  return axios.request({
    url: '/getArticle',
    method: 'get',
    params
  })
}
