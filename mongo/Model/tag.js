const mongoose = require('../server')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  id: String,
  title: String,
  createdAt: String,
  updatedAt: String,
  color: String,
  icon: String,
  background: String,
  showOnNav: Boolean,
  relationTagId: String,
  alias: String,
  isCategory: Boolean,
  entryCount: Number,
  subscribersCount: Number,
  isSubscribe: Boolean
})

module.exports = mongoose.model('tags', tagSchema)
