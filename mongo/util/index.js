function promiseLimit(arr = [], num = 5, request, cb) {
  const allLength = arr.length
  const start = Date.now()
  console.log(`共计${allLength}个请求，分${Math.ceil(arr.length / num)}次完成`)
  return new Promise(async (resolve) => {
    let res = []
    while (arr.length > 0) {
      let tmp = arr.splice(0, num).map((v) => request(v))
      try {
        let tmpArr = []
        let data = await Promise.all(tmp)
        data.forEach((v) => {
          tmpArr = tmpArr.concat(v.d.entrylist)
        })
        if (cb && tmpArr.length) cb(tmpArr)
        res = res.concat(tmpArr)
        console.log(
          `已完成${allLength - arr.length}个，还剩余${arr.length}个，进度${(
            ((allLength - arr.length) / allLength) *
            100
          ).toFixed(2)}%`
        )
      } catch (error) {
        console.log(error)
      }
    }
    const end = Date.now()
    console.log(`全部完成！总共计时${(end - start) / 1000}s`)
    resolve(res)
  })
}

module.exports = {
  promiseLimit
}
