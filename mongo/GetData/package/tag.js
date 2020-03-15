const request = require('../axios')
const mongoose = require('mongoose')
const { tagListUrl } = require('../url')
const Tag = require('../../Model/tag')
async function getTags() {
  const {
    d: { tags }
  } = await request(tagListUrl)
  console.log(`tags count => ${tags.length}`)
  const saveData = tags.map((v) => ({
    updateOne: {
      filter: { _id: v.id },
      update: { $set: { ...v, _id: v.id } },
      upsert: true
    }
  }))
  Tag.bulkWrite(saveData)
    .then((res) => {
      console.log('res', res)
    })
    .catch((e) => console.log('err2', e))
}
getTags()
module.exports = getTags
