const mongoose = require('../server')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  back_ground: String,
  color: String,
  concern_user_count: Number,
  icon: String,
  id: Number,
  post_article_count: Number,
  show_navi: Number,
  tag_alias: String,
  tag_id: String,
  tag_name: String
})

module.exports = mongoose.model('tags', tagSchema)
