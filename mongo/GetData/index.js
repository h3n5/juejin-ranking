const getTags = require('./package/tag')
const getArticles = require('./package/article')

async function task() {
  console.time('任务耗时')
  let tags = await getTags()
  await getArticles(tags)
  console.timeEnd('任务耗时')
}
module.exports = task
