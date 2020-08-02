const Tag = require('../Model/tag')
const Article = require('../Model/article')
const Update = require('../Model/update')
const task = require('../GetData/index')
const eventBus = require('../util/eventBus')
let taskFlag = true
let progress = null
eventBus.on('articles-progress', (e) => {
  if (progress) {
    Update.findOneAndUpdate(
      { _id: progress._id },
      { $set: { progress: e } },
      function(err, e) {
        if (err) console.log(err)
      }
    )
  }
})
async function findTag(req, res) {
  try {
    let { pageIndex = 0, pageSize = 20, keyword = '', type = 'hot' } = req.query
    let conditions = {}
    let sort =
      type === 'hot'
        ? {
            'tag.concern_user_count': -1
          }
        : {
            tag_id: -1
          }
    if (keyword) {
      conditions['tag.tag_name'] = { $regex: keyword, $options: 'gi' }
    }
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
  let { body } = req
  let {
    pageIndex = 0,
    pageSize = 20,
    title = '',
    type = '',
    sort = 'desc',
    tags = []
  } = body

  let conditions = {}

  let sortValue = sort === 'desc' ? -1 : 1
  let typeMap = {
    thumbUpCount: { 'article_info.digg_count': sortValue },
    createTime: { 'article_info.ctime': sortValue },
    commentCount: { 'article_info.comment_count': sortValue },
    viewsCount: { 'article_info.view_count': sortValue }
  }
  let sortConditon = typeMap[type] || { 'article_info.rank_index': -1 }

  if (title) {
    conditions.$or = [
      {
        'article_info.title': {
          $regex: title,
          $options: 'gi'
        }
      },
      {
        'article_info.brief_content': {
          $regex: title,
          $options: 'gi'
        }
      },
      {
        'article_info.article_id': {
          $regex: title,
          $options: 'gi'
        }
      }
    ]
  }

  if (tags.length) {
    if (!conditions.$or) conditions.$or = []
    conditions.$or = conditions.$or.concat(
      tags.map((v) => ({
        tags: {
          $elemMatch: {
            tag_name: v.title
          }
        }
      }))
    )
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
async function refreshData(req, res) {
  try {
    let { code } = req.body
    if (code === 'melt1993') {
      if (taskFlag) {
        taskFlag = false
        progress = await new Update({
          updateTime: new Date(),
          progress: 0
        }).save()
        taskFlag = true
        res.send({ success: true, msg: progress._id })
        task()
      } else {
        res.send({ success: false, msg: 'loading ……' })
      }
    } else {
      res.send({ success: false })
    }
  } catch (error) {
    res.send({ success: false, msg: error })
  }
}

async function getRefresh(req, res) {
  try {
    let { id } = req.query
    let data = await Update.findById(id).exec()
    res.send({ success: true, progress: data.progress || 0 })
  } catch (error) {
    res.send({ success: false })
  }
}
module.exports = { findTag, findArticle, refreshData, getRefresh }
