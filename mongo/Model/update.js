const mongoose = require('../server')
const Schema = mongoose.Schema

const updateSchema = new Schema({
  updateTime: String,
  progress: Number
})

module.exports = mongoose.model('updates', updateSchema)
