const Article = require('../../Model/article')
const request = require('../axios')
const eventBus = require('../../util/eventBus')
const tagArticleListUrl =
  'https://apinew.juejin.im/recommend_api/v1/article/recommend_tag_feed'

function getArticles(tags = []) {
  return new Promise(async (resolve) => {
    const Tasks = tags.map((v) => ({
      url: tagArticleListUrl,
      method: 'POST',
      data: { limit: v.post_article_count, tag_ids: [v.tag_id] }
    }))
    for (let index = 0; index < Tasks.length; index++) {
      let task = Tasks[index]
      let res = await request(task)
      await callback(res)
      let progress = Number(((index / (Tasks.length - 1)) * 100).toFixed(2))
      eventBus.emit('articles-progress', progress)
    }
    resolve(console.log('End'))

    function callback(res) {
      return new Promise((re) => {
        let arts = res.data || []
        if (arts.length === 0) return re(console.log('该标签没有数据'))
        const saveData = arts.map((v) => ({
          updateOne: {
            filter: { article_id: v.article_id },
            update: { $set: v },
            upsert: true
          }
        }))
        Article.bulkWrite(saveData)
          .then(() => {
            re()
          })
          .catch((e) => re(console.log('保存失败', e)))
      })
    }
  })
}
module.exports = getArticles
