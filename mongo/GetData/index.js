const tag = require('./package/tag')
const article = require('./package/article')

async function task() {
  let res = await tag()
  await article(res)
}

module.exports = task
