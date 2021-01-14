const Article = require('../../Model/article')
const request = require('../axios')
const eventBus = require('../../util/eventBus')
const tagArticleListUrl =
  'https://api.juejin.cn/recommend_api/v1/article/recommend_tag_feed'
const atob = (s) => Buffer.from(s, 'base64').toString()
const btoa = (s) => Buffer.from(s).toString('base64')
const fs = require('fs')
const path = require('path')
const { Readable } = require('stream')
function percentNum(num = 0) {
  return Number((num * 100).toFixed(2))
}
const SLOWSEARCH = false
function getArticles(tags = []) {
  return new Promise(async (resolve) => {
    if (SLOWSEARCH) {
      const Tasks = tags.map((tag) => {
        return loopSearch(tag)
      })

      let list = (await Promise.all(Tasks)).flat()

      callback(list)
      // await arrayLimit(list, callback, 1000)
    } else {
      console.time('获取标签paylaod')
      const allpayloads = await arrayLimit(tags, tagsLoopArray, 100)
      console.timeEnd('获取标签paylaod')
      await arrayLimitSave(allpayloads, request, 100, 2000, callback)

    }
    resolve(console.log('End'))

    async function arrayLimitSave(
      arr = [],
      func,
      limit = 10,
      extra = 0,
      extraFunc
    ) {
      let result = []
      let allLength = arr.length
      let tryTime = 0
      while (arr.length) {
        try {
          let temp = arr.splice(0, limit)
					console.log('开始请求')
          let res = await Promise.all(temp.map(func))
          result = result.concat(res.map((v) => v.data).flat())
          if (extra && result.length >= extra) {
            tryTime++
            await extraFunc(result, tryTime)
            result = []
            let progress = percentNum((allLength - arr.length) / allLength)
            eventBus.emit('articles-progress', progress)
            console.log('AutoConsole: getArticles -> progress', progress)
          }
        } catch (error) {
          console.log('AutoConsole: arrayLimit -> error', error)
        }
      }
      if (extra) {
        await extraFunc(result, tryTime)
      }
      eventBus.emit('articles-progress', percentNum(1))
      return result
    }

    async function arrayLimit(arr = [], func, limit = 10) {
      let result = []
      while (arr.length) {
        try {
          let temp = arr.splice(0, limit)
          let res = await Promise.all(temp.map(func))
          result = result.concat(...res)
        } catch (error) {
          console.log('AutoConsole: arrayLimit -> error', error)
        }
      }
      return result
    }

    async function tagsLoopArray(tag) {
      try {
        let tagId = tag.tag_id
        let payload = {
          url: tagArticleListUrl,
          method: 'POST',
          data: { sort_type: 0, cursor: '', tag_ids: [tagId] }
        }
        let res = await request(payload)
        let key = res.cursor
        if (!key) return []
        let count = res.count
        let article_id = JSON.parse(atob(key))['v']
        let cursorArray = Array.from({ length: Math.ceil(count / 10) })
          .map((_, index) => ({
            v: article_id,
            i: index * 10
          }))
          .map(JSON.stringify)
          .map(btoa)
          .map((v) => ({
            url: tagArticleListUrl,
            method: 'POST',
            data: { sort_type: 0, cursor: v, tag_ids: [tagId] }
          }))
        return cursorArray
      } catch (error) {
        return []
      }
    }

    async function tagsLoop(tagId, cursor = '', result = []) {
      let payload = {
        url: tagArticleListUrl,
        method: 'POST',
        data: { sort_type: 0, cursor: cursor, tag_ids: [tagId] }
      }
      let count = 0
      try {
        let res = await request(payload)
        count = res.count
        result = result.concat(res.data || [])
        // console.log(`进度:${percentNum(result.length / count)}`)
        if (res.has_more) {
          return await tagsLoop(tagId, res.cursor, result)
        } else {
          return { result, count }
        }
      } catch (error) {
        console.error('AutoConsole: tagsLoop -> error', error)
        return { result, count }
      }
    }

    async function loopSearch(tags) {
      let { result, count } = await tagsLoop(tags.tag_id)
      console.log(`${tags.tag.tag_name}应有：${count}，实际：${result.length}`)
      return result
    }

    function jsonCallBack(json = [], tryTime) {
      return new Promise((resolve) => {
        let timeStart = +new Date()
        let stream = Readable.from(JSON.stringify(json)).pipe(
          fs.createWriteStream(
            path.resolve(__dirname, `./tag/article_${tryTime}.json`)
          )
        )
        stream.on('finish', () => {
          let timeEnd = +new Date()
          console.log(`保存数据耗时${timeEnd - timeStart}ms`)
          resolve('写入完成')
        })
        stream.on('error', () => {
          resolve('写入错误')
        })
      })
    }
    
    function callback(arts, tryTime) {
      return new Promise((resolve) => {
        if (arts.length === 0) return resolve(console.log('该标签没有数据'))
        const saveData = arts.map((v) => ({
          updateOne: {
            filter: { article_id: v.article_id },
            update: { $set: v },
            upsert: true
          }
        }))
        let timeStart = +new Date()
        console.log(`开始保存数据${tryTime}`)
        Article.bulkWrite(saveData)
          .then(() => {
            let timeEnd = +new Date()
            console.log(`保存数据${tryTime}耗时${timeEnd - timeStart}ms`)
            resolve()
          })
          .catch((e) => resolve(console.log('保存失败', e)))
      })
    }
  })
}
module.exports = getArticles
