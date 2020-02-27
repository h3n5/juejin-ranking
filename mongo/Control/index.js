const Tag = require('../Model/tag')
const Article = require('../Model/article')

async function findTag(req, res) {
  let { query } = req
  let { pageIndex = 0, pageSize = 20, title = '' } = query
  let conditions = {}
  let sort = {
    subscribersCount: -1
  }
  if (title) {
    conditions.title = { $regex: title, $options: 'gi' }
  }
  try {
    let data = await Promise.all([
      Tag.find(conditions)
        .sort(sort)
        .skip(pageIndex * pageSize)
        .limit(+pageSize)
        .exec(),
      Tag.countDocuments(conditions).exec()
    ])
    res.send({ success: true, data: data[0], count: data[1] })
  } catch (e) {
    res.send({ success: false, msg: e })
  }
}
async function findArticle(req, res) {
  let { query } = req
  let {
    pageIndex = 0,
    pageSize = 20,
    title = '',
    type = '',
    sort = 'desc'
  } = query
  let conditions = {}
  let sortConditon = {}
  switch (type) {
    case 'thumbUpCount':
      sortConditon = { collectionCount: sort === 'desc' ? -1 : 1 }
      break
    case 'createTime':
      sortConditon = { createdAt: sort === 'desc' ? -1 : 1 }
      break
    case 'commentCount':
      sortConditon = { commentsCount: sort === 'desc' ? -1 : 1 }
      break
    case 'viewsCount':
      sortConditon = { viewsCount: sort === 'desc' ? -1 : 1 }
      break
    default:
      sortConditon = {
        hotIndex: sort === 'desc' ? -1 : 1
      }
  }
  if (title) {
    conditions.$or = [
      {
        title: {
          $regex: title,
          $options: 'gi'
        }
      },
      {
        content: {
          $regex: title,
          $options: 'gi'
        }
      }
    ]
  }
  try {
    let data = await Promise.all([
      Article.find(conditions)
        .sort(sortConditon)
        .skip(pageIndex * pageSize)
        .limit(+pageSize)
        .exec(),
      Article.countDocuments(conditions).exec()
    ])
    res.send({ success: true, data: data[0], count: data[1] })
  } catch (e) {
    res.send({ success: false, msg: e })
  }
}
module.exports = { findTag, findArticle }
