const Article = require('../../Model/article')
const request = require('../axios')
const eventBus = require('../../util/eventBus')
const tagArticleListUrl = 'https://apinew.juejin.im/recommend_api/v1/article/recommend_tag_feed'
// const { promiseLimit } = require('../../util')
// function atob() {
//   Buffer.from(string, 'base64').toString()
// }
// function btoa(string) {
//   Buffer.from(string).toString('base64')
// }
async function getArticles(tags = []) {a
  return new Promise((resolve) => {
    const Tasks = tags.map((v) => ({
      url: tagArticleListUrl,
      methos: 'POST',
      data: { limit: v.post_article_count, tag_ids: [v.tagId] }
    }))
    for (let index = 0; index < Tasks.length; index++) {
      let task = Tasks[index]
      let res = await request(task)
      await callback(res.data)
      let progress = Number(((index / Tasks.length) * 100).toFixed(2))
      eventBus.emit('articles-progress', progress)
    }
    resolve(console.log('End'))


    function callback(arts) {
      return new Promise((re, rj) => {
        if (!arts.length) re()
        console.log('开始保存至数据库')
        const saveData = arts.map((v) => ({
          updateOne: {
            filter: { _id: v.article_id },
            update: { $set: { ...v, _id: v.article_id } },
            upsert: true
          }
        }))
        Article.bulkWrite(saveData)
          .then(() => {
            re(console.log('保存成功'))
          })
          .catch((e) => rj(console.log('保存失败', e)))
      })
    }
  })
}
module.exports = getArticles
