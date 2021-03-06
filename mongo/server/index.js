const mongoose = require('mongoose')

// const DB_URL = 'mongodb://melt:351258@m3lt.cn:27017/juejin_new'
const DB_URL = 'mongodb://127.0.0.1:27017/juejin_new'
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}) /** * 连接成功 */

mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open to ' + DB_URL)
}) /** * 连接异常 */

mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err)
}) /** * 连接断开 */

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected')
})

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('debug', false)
module.exports = mongoose
