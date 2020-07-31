const request = require('../axios')
const tagListUrl = 'https://apinew.juejin.im/tag_api/v1/query_tag_list'
const Tag = require('../../Model/tag')
async function getTags() {
  try {
    let postData = { limit: 100000 }
    let res = await request.post(tagListUrl, postData)
    let tags = res.data
    const saveData = tags.map((v) => ({
      updateOne: {
        filter: { _id: v.tag_id },
        update: { $set: { ...v, _id: v.tag_id } },
        upsert: true
      }
    }))
    Tag.bulkWrite(saveData)
      .then(() => {
        console.log('标签更新完成')
      })
      .catch((e) => console.log('err2', e))
    return tags
  } catch (error) {
    console.log(error)
  }
}
module.exports = getTags
