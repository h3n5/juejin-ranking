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
    method: 'post',
    data: params
  })
}
export const refreshData = (params) => {
  return axios.request({
    url: '/refreshData',
    method: 'post',
    data: params
  })
}
export const getRefresh = (params) => {
  return axios.request({
    url: '/refreshData',
    method: 'get',
    params: params
  })
}
export const getRecomment = (params) => {
  return axios.request({
    url: '/getRecomment',
    method: 'post',
    data: params
  })
}
