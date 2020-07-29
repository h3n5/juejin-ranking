const Article = require('../../Model/article')
const request = require('../axios')
const { tagArticleListUrl } = require('../url')
const { promiseLimit } = require('../../util')
function getArticles(tags = []) {
  return new Promise((resolve) => {
    const Task = tags.reduce((all, tag) => {
      const pageIndexMax = Math.ceil(tag.entryCount / 100)
      return all.concat(
        Array(pageIndexMax)
          .fill(0)
          .map((_, index) => tagArticleListUrl(tag.id, index, 100))
      )
    }, [])

    promiseLimit(Task, 100, request, cb).then(() => {
      resolve(console.log('End'))
    })

    function cb(arts) {
      if (!arts.length) return false
      return new Promise((re, rj) => {
        console.log('开始保存至数据库')
        const saveData = arts.map((v) => ({
          updateOne: {
            filter: { _id: v.objectId },
            update: { $set: { ...v, _id: v.objectId } },
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
