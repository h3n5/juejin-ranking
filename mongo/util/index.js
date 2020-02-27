function promiseLimit(arr = [], num = 5, callback) {
  return new Promise(async (resolve) => {
    let res = []
    while (arr.length > 0) {
      let tmp = arr.splice(0, num)
      let data = await Promise.all(tmp)
      res = res.concat(data)
    }
    if (callback) {
      callback(res)
    }
    resolve(res)
  })
}

module.exports = {
  promiseLimit
}
