const request = require('../axios')
// const { tagListUrl } = require('../url')
const Tag = require('../../Model/tag')
async function getTags() {
  let url = 'https://apinew.juejin.im/tag_api/v1/query_tag_list'
  let postData = { sort_type: 1, cursor: '0', limit: 10000000 }
  let headers = { 'content-type': 'application/json' }
  let { data } = await request.post(url, postData, headers)
  let tags = data.map(v => v.tag)
  console.log(`tags count => ${tags.length}`)
  const saveData = tags.map((v) => ({
    updateOne: {
      filter: { _id: v.id },
      update: { $set: { ...v, _id: v.id } },
      upsert: true
    }
  }))
  Tag.bulkWrite(saveData)
    .then(() => {
      console.log('标签查找Over')
    })
    .catch((e) => console.log('err2', e))
  return tags
}
module.exports = getTags
