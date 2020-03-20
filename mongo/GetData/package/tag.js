const request = require('../axios')
const { tagListUrl } = require('../url')
const Tag = require('../../Model/tag')
async function getTags() {
  const {
    d: { tags }
  } = await request.get(tagListUrl, {
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Token':
        'eyJhY2Nlc3NfdG9rZW4iOiJ3NlpSMDJTb1VxRFo0RThiIiwicmVmcmVzaF90b2tlbiI6IkdZTWxTc2lQTkVtSzFvNmIiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ=='
    }
  })
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
