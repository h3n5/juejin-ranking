const mongoose = require('mongoose')

const DB_URL = 'mongodb://melt:351258@127.0.0.1:27017/juejin'

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // auth: {
  //   user: 'melt',
  //   pass: '351258'
  // }
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

module.exports = mongoose
