const request = require('../axios')
const { tagArticleListUrl } = require('../url')
const Article = require('../../Model/article')
const Tag = require('../../Model/tag')
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
      .then((res) => {
        // console.log('res', res)
        console.log('保存成功')
      })
      .catch((e) => console.log('保存失败', e))
  }
  promiseLimit(Task, 3, request, cb).then((arts) => {
    // const saveData = arts.map((v) => ({
    //   updateOne: {
    //     filter: { _id: v.objectId },
    //     update: { $set: { ...v, _id: v.objectId } },
    //     upsert: true
    //   }
    // }))
    // Article.bulkWrite(saveData)
    //   .then((res) => {
    //     console.log('res', res)
    //   })
    //   .catch((e) => console.log('err2', e))
  })
}
Tag.find().then((res) => {
  console.log(res.reduce((p, c) => p + c.entryCount, 0))
  // getArticles(res)
})
module.exports = getArticles
