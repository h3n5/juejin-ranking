const request = require('../axios')
const { tagArticleListUrl } = require('../url')
const Article = require('../../Model/article')
const { promiseLimit } = require('../../util')
async function getArticles(tags = []) {
  const Task = tags.reduce((all, tag) => {
    const pageIndexMax = Math.ceil(tag.entryCount / 100)
    return all.concat(
      Array(pageIndexMax)
        .fill(0)
        .map((_, index) => tagArticleListUrl(tag.id, index, 100))
    )
  }, [])
  function cb(arts) {
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
        console.log('保存成功')
      })
      .catch((e) => console.log('保存失败', e))
  }
  promiseLimit(Task, 9, request, cb).then((arts) => {
    cb(arts)
    console.log('End')
  })
}
module.exports = getArticles
