const request = require('../axios')
const tagListUrl = 'https://api.juejin.cn/tag_api/v1/query_tag_list'
const Tag = require('../../Model/tag')

async function getTags() {
  try {
    let postData = { limit: 100000 }
    let res = await request.post(tagListUrl, postData)
    let tags = res.data
    const saveData = tags.map((v) => ({
      updateOne: {
        filter: { tag_id: v.tag_id },
        update: { $set: v },
        upsert: true
      }
    }))
    await Tag.bulkWrite(saveData)
    console.log('标签更新完成', saveData.length)
    return tags
  } catch (error) {
    console.log(error)
  }
}
module.exports = getTags
