const eventBus = require('./eventBus')

function promiseLimit(arr = [], num = 5, request, cb) {
  const allLength = arr.length
  const start = Date.now()
  const limit = num * 100 * 10
  console.log(`共计${allLength}个请求，分${Math.ceil(arr.length / num)}次完成`)
  return new Promise(async (resolve) => {
    let tmpArr = []
    while (arr.length > 0) {
      try {
        let tmp = arr.splice(0, num).map((v) =>
          request(v).catch((e) => ({
            err: e
          }))
        )
        let data = await Promise.all(tmp)
        console.log(`请求失败共${data.filter((v) => v.err).length}个`)
        data
          .filter((v) => !v.err)
          .forEach((v) => {
            tmpArr = tmpArr.concat(v.d.entrylist)
          })
        if (cb && tmpArr.length >= limit) {
          cb(tmpArr)
          tmpArr = []
        }
        console.log(
          `已完成${allLength - arr.length}个，还剩余${arr.length}个，进度${(
            ((allLength - arr.length) / allLength) *
            100
          ).toFixed(2)}%`
        )
        eventBus.emit(
          'articles-progress',
          (((allLength - arr.length) / allLength) * 100).toFixed(2)
        )
      } catch (error) {
        console.log('timeout')
      }
    }
    const end = Date.now()
    console.log(`全部完成！总共计时${(end - start) / 1000}s`)
    resolve(tmpArr)
  })
}

module.exports = {
  promiseLimit
}
